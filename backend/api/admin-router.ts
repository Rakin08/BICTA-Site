import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  users, events, programs, partnerInquiries,
  contactSubmissions, alumni, impactMetrics,
  speakers, eventRegistrations, siteSettings,
  contentBlocks, activityLog,
} from "@db/schema";
import { eq, desc, count } from "drizzle-orm";

export const adminRouter = createRouter({
  // ─── Dashboard Stats ──────────────────────────────────
  dashboard: adminQuery.query(async () => {
    const db = getDb();
    const [
      totalUsers,
      totalEvents,
      totalPrograms,
      totalPartners,
      totalContacts,
      totalAlumni,
      totalRegistrations,
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(events),
      db.select({ count: count() }).from(programs),
      db.select({ count: count() }).from(partnerInquiries),
      db.select({ count: count() }).from(contactSubmissions),
      db.select({ count: count() }).from(alumni),
      db.select({ count: count() }).from(eventRegistrations),
    ]);

    return {
      users: totalUsers[0].count,
      events: totalEvents[0].count,
      programs: totalPrograms[0].count,
      partners: totalPartners[0].count,
      contacts: totalContacts[0].count,
      alumni: totalAlumni[0].count,
      registrations: totalRegistrations[0].count,
    };
  }),

  // ─── Users Management ─────────────────────────────────
  userList: adminQuery
    .input(z.object({
      role: z.string().optional(),
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      let query = db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
      const results = await query;

      if (input?.role) {
        return results.filter((u) => u.role === input.role);
      }
      return results;
    }),

  userUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      role: z.enum(["admin", "student", "partner"]).optional(),
      isActive: z.boolean().optional(),
      name: z.string().optional(),
      title: z.string().optional(),
      organization: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(users).set(data).where(eq(users.id, id));
      return { success: true };
    }),

  // ─── Event Management ─────────────────────────────────
  eventCreate: adminQuery
    .input(z.object({
      title: z.string().min(1).max(255),
      slug: z.string().min(1).max(255),
      summary: z.string().optional(),
      body: z.string().optional(),
      agenda: z.string().optional(),
      faq: z.string().optional(),
      eventType: z.enum(["competition", "datathon", "workshop", "olympiad", "summit", "webinar", "conference", "hackathon"]).default("workshop"),
      mode: z.enum(["online", "offline", "hybrid"]).default("offline"),
      status: z.enum(["draft", "scheduled", "registration_open", "registration_closed", "live", "completed", "cancelled", "postponed"]).default("draft"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      venue: z.string().optional(),
      venueAddress: z.string().optional(),
      registrationUrl: z.string().optional(),
      registrationLimit: z.number().optional(),
      imageUrl: z.string().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(events).values({
        ...input,
        createdById: ctx.user!.id,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  eventUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      slug: z.string().min(1).max(255).optional(),
      summary: z.string().optional(),
      body: z.string().optional(),
      agenda: z.string().optional(),
      faq: z.string().optional(),
      eventType: z.enum(["competition", "datathon", "workshop", "olympiad", "summit", "webinar", "conference", "hackathon"]).optional(),
      mode: z.enum(["online", "offline", "hybrid"]).optional(),
      status: z.enum(["draft", "scheduled", "registration_open", "registration_closed", "live", "completed", "cancelled", "postponed"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      venue: z.string().optional(),
      venueAddress: z.string().optional(),
      registrationUrl: z.string().optional(),
      registrationLimit: z.number().optional(),
      imageUrl: z.string().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(events).set(data).where(eq(events.id, id));
      return { success: true };
    }),

  eventDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),

  // ─── Program Management ───────────────────────────────
  programCreate: adminQuery
    .input(z.object({
      title: z.string().min(1).max(255),
      slug: z.string().min(1).max(255),
      category: z.string().min(1).max(100),
      summary: z.string().optional(),
      description: z.string().optional(),
      curriculum: z.string().optional(),
      duration: z.string().optional(),
      price: z.string().optional(),
      imageUrl: z.string().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db.insert(programs).values({
        ...input,
        createdById: ctx.user!.id,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  programUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      slug: z.string().min(1).max(255).optional(),
      category: z.string().min(1).max(100).optional(),
      summary: z.string().optional(),
      description: z.string().optional(),
      curriculum: z.string().optional(),
      duration: z.string().optional(),
      price: z.string().optional(),
      imageUrl: z.string().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(programs).set(data).where(eq(programs.id, id));
      return { success: true };
    }),

  programDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(programs).where(eq(programs.id, input.id));
      return { success: true };
    }),

  // ─── Alumni Management ────────────────────────────────
  alumniCreate: adminQuery
    .input(z.object({
      name: z.string().min(1).max(255),
      role: z.string().min(1).max(255),
      company: z.string().min(1).max(255),
      quote: z.string().optional(),
      bio: z.string().optional(),
      imageUrl: z.string().optional(),
      batchYear: z.string().optional(),
      linkedInUrl: z.string().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(alumni).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  alumniUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      role: z.string().min(1).max(255).optional(),
      company: z.string().min(1).max(255).optional(),
      quote: z.string().optional(),
      bio: z.string().optional(),
      imageUrl: z.string().optional(),
      batchYear: z.string().optional(),
      linkedInUrl: z.string().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(alumni).set(data).where(eq(alumni.id, id));
      return { success: true };
    }),

  alumniDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(alumni).where(eq(alumni.id, input.id));
      return { success: true };
    }),

  // ─── Metrics Management ───────────────────────────────
  metricUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      value: z.number().optional(),
      suffix: z.string().optional(),
      label: z.string().optional(),
      description: z.string().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(impactMetrics).set(data).where(eq(impactMetrics.id, id));
      return { success: true };
    }),

  metricCreate: adminQuery
    .input(z.object({
      label: z.string().min(1).max(255),
      value: z.number(),
      suffix: z.string().optional(),
      description: z.string().optional(),
      displayOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(impactMetrics).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  // ─── Partner Inquiry Management ───────────────────────
  partnerList: adminQuery
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(partnerInquiries).orderBy(desc(partnerInquiries.createdAt)).limit(input?.limit ?? 50);
      const results = await query;
      if (input?.status) {
        return results.filter((r) => r.status === input.status);
      }
      return results;
    }),

  partnerUpdateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["new", "contacted", "qualified", "proposal_sent", "closed_won", "closed_lost"]),
      assignedToId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(partnerInquiries).set(data).where(eq(partnerInquiries.id, id));
      return { success: true };
    }),

  // ─── Contact Submission Management ────────────────────
  contactList: adminQuery
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(input?.limit ?? 50);
      if (input?.status) {
        return results.filter((r) => r.status === input.status);
      }
      return results;
    }),

  contactUpdateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["new", "read", "replied", "archived"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(contactSubmissions).set({ status: input.status }).where(eq(contactSubmissions.id, input.id));
      return { success: true };
    }),

  // ─── Event Registration Management ────────────────────
  registrationList: adminQuery
    .input(z.object({
      eventId: z.number().optional(),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(eventRegistrations)
        .orderBy(desc(eventRegistrations.createdAt))
        .limit(input?.limit ?? 50);
      if (input?.eventId) {
        return results.filter((r) => r.eventId === input.eventId);
      }
      return results;
    }),

  registrationUpdateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "waitlisted", "cancelled", "attended"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(eventRegistrations).set({ status: input.status }).where(eq(eventRegistrations.id, input.id));
      return { success: true };
    }),

  // ─── Site Settings (CMS) ──────────────────────────────
  settingsList: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(siteSettings).orderBy(siteSettings.group);
  }),

  settingUpdate: adminQuery
    .input(z.object({
      key: z.string(),
      value: z.string().optional(),
      type: z.enum(["text", "image", "json", "boolean", "number"]).optional(),
      group: z.string().optional(),
      label: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { key, ...data } = input;
      await db.update(siteSettings).set(data).where(eq(siteSettings.key, key));
      return { success: true };
    }),

  settingCreate: adminQuery
    .input(z.object({
      key: z.string().min(1),
      value: z.string().optional(),
      type: z.enum(["text", "image", "json", "boolean", "number"]).default("text"),
      group: z.string().default("general"),
      label: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(siteSettings).values(input);
      return { success: true };
    }),

  // ─── Content Blocks (CMS) ─────────────────────────────
  contentList: adminQuery
    .input(z.object({ section: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(contentBlocks).orderBy(contentBlocks.displayOrder);
      const results = await query;
      if (input?.section) {
        return results.filter((b) => b.section === input.section);
      }
      return results;
    }),

  contentUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      section: z.string().optional(),
      type: z.enum(["text", "richtext", "image", "cta", "quote", "stats"]).optional(),
      imageUrl: z.string().optional(),
      ctaText: z.string().optional(),
      ctaLink: z.string().optional(),
      displayOrder: z.number().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(contentBlocks).set(data).where(eq(contentBlocks.id, id));
      return { success: true };
    }),

  contentCreate: adminQuery
    .input(z.object({
      key: z.string().min(1),
      title: z.string().optional(),
      content: z.string().optional(),
      section: z.string().min(1),
      type: z.enum(["text", "richtext", "image", "cta", "quote", "stats"]).default("text"),
      imageUrl: z.string().optional(),
      ctaText: z.string().optional(),
      ctaLink: z.string().optional(),
      displayOrder: z.number().optional(),
      published: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contentBlocks).values(input);
      return { success: true };
    }),

  contentDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contentBlocks).where(eq(contentBlocks.id, input.id));
      return { success: true };
    }),

  // ─── Speaker Management ───────────────────────────────
  speakerCreate: adminQuery
    .input(z.object({
      name: z.string().min(1).max(255),
      title: z.string().optional(),
      company: z.string().optional(),
      bio: z.string().optional(),
      imageUrl: z.string().optional(),
      linkedInUrl: z.string().optional(),
      twitterUrl: z.string().optional(),
      websiteUrl: z.string().optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(speakers).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  speakerList: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(speakers).orderBy(desc(speakers.createdAt));
  }),

  speakerUpdate: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      title: z.string().optional(),
      company: z.string().optional(),
      bio: z.string().optional(),
      imageUrl: z.string().optional(),
      linkedInUrl: z.string().optional(),
      twitterUrl: z.string().optional(),
      websiteUrl: z.string().optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(speakers).set(data).where(eq(speakers.id, id));
      return { success: true };
    }),

  speakerDelete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(speakers).where(eq(speakers.id, input.id));
      return { success: true };
    }),

  // ─── Activity Log ─────────────────────────────────────
  activityList: adminQuery
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(activityLog)
        .orderBy(desc(activityLog.createdAt))
        .limit(input?.limit ?? 50);
    }),
});
