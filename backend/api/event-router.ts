import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { events, eventRegistrations } from "@db/schema";
import { eq, desc, count, sql, and, inArray } from "drizzle-orm";
import { getCache, setCache, deleteCachePattern, acquireLock, releaseLock } from "./lib/cache";
import { checkLimit, publicLimiter } from "./lib/ratelimit";
import { TRPCError } from "@trpc/server";

const CACHE_TTL = 120; // 2 minutes for event data
const LIST_CACHE_TTL = 60; // 1 minute for lists

export const eventRouter = createRouter({
  // ─── Public: List Events (cached) ─────────────────────
  list: publicQuery
    .input(
      z.object({
        status: z.string().optional(),
        eventType: z.string().optional(),
        mode: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
        sort: z.enum(["latest", "upcoming", "featured"]).optional().default("latest"),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      // Rate limit
      const clientIp = ctx.req.headers.get("x-forwarded-for") || "anon";
      const limitCheck = await checkLimit(publicLimiter, `list_${clientIp}`);
      if (!limitCheck.allowed) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Try again later." });
      }

      const cacheKey = `events:list:${JSON.stringify(input || {})}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const db = getDb();
      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      // Build optimized query with select only needed columns
      // Apply filters
      const conditions = [eq(events.published, true)];
      if (input?.status) conditions.push(eq(events.status, input.status as any));
      if (input?.eventType) conditions.push(eq(events.eventType, input.eventType as any));
      if (input?.mode) conditions.push(eq(events.mode, input.mode as any));
      if (input?.featured) conditions.push(eq(events.featured, true));

      const results = await db
        .select({
          id: events.id,
          title: events.title,
          slug: events.slug,
          summary: events.summary,
          eventType: events.eventType,
          mode: events.mode,
          status: events.status,
          startDate: events.startDate,
          endDate: events.endDate,
          venue: events.venue,
          imageUrl: events.imageUrl,
          featured: events.featured,
          registrationLimit: events.registrationLimit,
          published: events.published,
          createdAt: events.createdAt,
        })
        .from(events)
        .where(and(...conditions))
        .orderBy(desc(events.createdAt))
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const countResult = await db
        .select({ count: count() })
        .from(events)
        .where(and(...conditions));

      const response = {
        data: results,
        meta: {
          page: Math.floor(offset / limit) + 1,
          pageSize: limit,
          total: countResult[0]?.count ?? 0,
          hasMore: (offset + limit) < (countResult[0]?.count ?? 0),
        },
      };

      await setCache(cacheKey, response, LIST_CACHE_TTL);
      return response;
    }),

  // ─── Public: Featured Events (cached) ─────────────────
  featured: publicQuery.query(async () => {
    const cacheKey = "events:featured";
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const db = getDb();
    const results = await db
      .select({
        id: events.id,
        title: events.title,
        slug: events.slug,
        summary: events.summary,
        eventType: events.eventType,
        mode: events.mode,
        status: events.status,
        startDate: events.startDate,
        venue: events.venue,
        imageUrl: events.imageUrl,
        registrationLimit: events.registrationLimit,
      })
      .from(events)
      .where(and(eq(events.featured, true), eq(events.published, true)))
      .orderBy(desc(events.createdAt))
      .limit(6);

    await setCache(cacheKey, results, CACHE_TTL);
    return results;
  }),

  // ─── Public: Event Detail (cached) ────────────────────
  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const cacheKey = `events:slug:${input.slug}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const db = getDb();
      const result = await db.select().from(events).where(eq(events.slug, input.slug)).limit(1);
      const event = result[0] ?? null;

      if (event) {
        await setCache(cacheKey, event, CACHE_TTL);
      }
      return event;
    }),

  // ─── Public: Event Stats (cached, high-traffic) ───────
  stats: publicQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const cacheKey = `events:stats:${input.eventId}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const db = getDb();
      const [regCount, eventData] = await Promise.all([
        db.select({ count: count() }).from(eventRegistrations).where(eq(eventRegistrations.eventId, input.eventId)),
        db.select({ limit: events.registrationLimit }).from(events).where(eq(events.id, input.eventId)).limit(1),
      ]);

      const registered = regCount[0]?.count ?? 0;
      const limit = eventData[0]?.limit;

      const response = {
        registered,
        limit,
        spotsLeft: limit ? Math.max(0, limit - registered) : null,
        isFull: limit ? registered >= limit : false,
        availabilityPercent: limit ? Math.round((registered / limit) * 100) : null,
      };

      await setCache(cacheKey, response, 30); // 30s cache for stats
      return response;
    }),

  // ─── Public: Register for Event (atomic, race-safe) ───
  register: publicQuery
    .input(
      z.object({
        eventId: z.number(),
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        phone: z.string().max(50).optional(),
        organization: z.string().max(255).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clientIp = ctx.req.headers.get("x-forwarded-for") || "anon";

      // Rate limit check
      const limitCheck = await checkLimit(publicLimiter, `reg_${clientIp}`);
      if (!limitCheck.allowed) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many registration attempts. Please try again later." });
      }

      // Burst limit per event (max 50 concurrent)
      const burstCheck = await checkLimit(publicLimiter, `burst_event_${input.eventId}`);
      if (!burstCheck.allowed) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Event is experiencing high traffic. Please try again in a few seconds." });
      }

      const lockKey = `lock:reg:${input.eventId}`;
      const lockAcquired = await acquireLock(lockKey, 5);
      if (!lockAcquired) {
        throw new TRPCError({ code: "CONFLICT", message: "Registration in progress. Please try again." });
      }

      try {
        const pool = getPool();
        const conn = await pool.getConnection();

        try {
          // Start transaction with row lock
          await conn.beginTransaction();

          // Lock the event row for update (prevents race conditions)
          const [eventRows] = await conn.execute(
            "SELECT id, registrationLimit, status FROM events WHERE id = ? FOR UPDATE",
            [input.eventId]
          );
          const eventRow = (eventRows as any[])[0];

          if (!eventRow) {
            await conn.rollback();
            throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
          }

          if (eventRow.status !== "registration_open") {
            await conn.rollback();
            throw new TRPCError({ code: "BAD_REQUEST", message: "Registration is closed for this event" });
          }

          // Check if already registered with this email
          const [existing] = await conn.execute(
            "SELECT id FROM event_registrations WHERE eventId = ? AND email = ? AND status != 'cancelled'",
            [input.eventId, input.email]
          );
          if ((existing as any[]).length > 0) {
            await conn.rollback();
            throw new TRPCError({ code: "CONFLICT", message: "You are already registered for this event" });
          }

          // Check capacity if limit exists
          if (eventRow.registrationLimit) {
            const [countResult] = await conn.execute(
              "SELECT COUNT(*) as cnt FROM event_registrations WHERE eventId = ? AND status IN ('pending', 'confirmed')",
              [input.eventId]
            );
            const currentCount = (countResult as any[])[0].cnt;

            if (currentCount >= eventRow.registrationLimit) {
              await conn.rollback();
              throw new TRPCError({ code: "BAD_REQUEST", message: "Event is fully booked" });
            }
          }

          // Determine status (confirmed if under limit, waitlisted if at limit)
          const regStatus = "confirmed";

          // Insert registration
          await conn.execute(
            "INSERT INTO event_registrations (eventId, name, email, phone, organization, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [input.eventId, input.name, input.email, input.phone || null, input.organization || null, input.notes || null, regStatus]
          );

          await conn.commit();

          // Invalidate caches
          await deleteCachePattern(`events:stats:${input.eventId}*`);
          await deleteCachePattern(`events:list*`);

          return {
            success: true,
            status: regStatus,
            message: regStatus === "confirmed" ? "Registration confirmed!" : "You have been added to the waitlist.",
          };
        } catch (err) {
          await conn.rollback();
          throw err;
        } finally {
          conn.release();
        }
      } finally {
        await releaseLock(lockKey);
      }
    }),

  // ─── Public: Bulk Event Stats (for listing pages) ─────
  bulkStats: publicQuery
    .input(z.object({ eventIds: z.array(z.number()).max(50) }))
    .query(async ({ input }) => {
      if (input.eventIds.length === 0) return {};

      const db = getDb();

      // Single optimized query for all events
      const results = await db
        .select({
          eventId: eventRegistrations.eventId,
          count: count(),
        })
        .from(eventRegistrations)
        .where(and(
          inArray(eventRegistrations.eventId, input.eventIds),
          sql`${eventRegistrations.status} IN ('pending', 'confirmed')`
        ))
        .groupBy(eventRegistrations.eventId);

      // Get limits
      const limits = await db
        .select({ id: events.id, limit: events.registrationLimit })
        .from(events)
        .where(inArray(events.id, input.eventIds));

      const limitMap = new Map(limits.map((l) => [l.id, l.limit]));
      const countMap = new Map(results.map((r) => [r.eventId, r.count]));

      const stats: Record<number, { registered: number; limit: number | null; spotsLeft: number | null; isFull: boolean }> = {};
      for (const id of input.eventIds) {
        const registered = countMap.get(id) ?? 0;
        const limit = limitMap.get(id) ?? null;
        stats[id] = {
          registered,
          limit,
          spotsLeft: limit ? Math.max(0, limit - registered) : null,
          isFull: limit ? registered >= limit : false,
        };
      }

      return stats;
    }),

  // ─── Public: Search Events ────────────────────────────
  search: publicQuery
    .input(z.object({
      q: z.string().min(1).max(100),
      limit: z.number().min(1).max(20).optional().default(10),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const searchTerm = `%${input.q}%`;

      const results = await db
        .select({
          id: events.id,
          title: events.title,
          slug: events.slug,
          summary: events.summary,
          eventType: events.eventType,
          status: events.status,
          imageUrl: events.imageUrl,
        })
        .from(events)
        .where(
          and(
            eq(events.published, true),
            sql`(${events.title} LIKE ${searchTerm} OR ${events.summary} LIKE ${searchTerm} OR ${events.venue} LIKE ${searchTerm})`
          )
        )
        .limit(input.limit);

      return results;
    }),

  // ─── Public: Upcoming Events ──────────────────────────
  upcoming: publicQuery
    .input(z.object({ limit: z.number().min(1).max(20).optional().default(6) }))
    .query(async ({ input }) => {
      const cacheKey = `events:upcoming:${input.limit}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const db = getDb();
      const results = await db
        .select({
          id: events.id,
          title: events.title,
          slug: events.slug,
          summary: events.summary,
          eventType: events.eventType,
          mode: events.mode,
          status: events.status,
          startDate: events.startDate,
          venue: events.venue,
          imageUrl: events.imageUrl,
          registrationLimit: events.registrationLimit,
        })
        .from(events)
        .where(
          and(
            eq(events.published, true),
            sql`${events.status} IN ('registration_open', 'scheduled', 'live')`
          )
        )
        .orderBy(desc(events.createdAt))
        .limit(input.limit);

      await setCache(cacheKey, results, CACHE_TTL);
      return results;
    }),
});
