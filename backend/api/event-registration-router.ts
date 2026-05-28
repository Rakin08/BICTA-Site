import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { eventRegistrations, events } from "@db/schema";
import { eq, count, desc } from "drizzle-orm";

export const eventRegistrationRouter = createRouter({
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
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check registration limit
      const eventData = await db.select().from(events).where(eq(events.id, input.eventId)).limit(1);
      if (!eventData[0]) {
        return { success: false, error: "Event not found" };
      }

      if (eventData[0].registrationLimit) {
        const existingRegs = await db
          .select({ count: count() })
          .from(eventRegistrations)
          .where(eq(eventRegistrations.eventId, input.eventId));
        if (existingRegs[0].count >= eventData[0].registrationLimit) {
          return { success: false, error: "Event is fully booked" };
        }
      }

      await db.insert(eventRegistrations).values({
        eventId: input.eventId,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        organization: input.organization ?? null,
        notes: input.notes ?? null,
        status: "pending",
      });

      return { success: true };
    }),

  myRegistrations: publicQuery
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.email, input.email))
        .orderBy(desc(eventRegistrations.createdAt));
    }),

  eventStats: publicQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [regCount, eventData] = await Promise.all([
        db.select({ count: count() }).from(eventRegistrations).where(eq(eventRegistrations.eventId, input.eventId)),
        db.select().from(events).where(eq(events.id, input.eventId)).limit(1),
      ]);

      return {
        registered: regCount[0].count,
        limit: eventData[0]?.registrationLimit ?? null,
        spotsLeft: eventData[0]?.registrationLimit ? eventData[0].registrationLimit - regCount[0].count : null,
        isFull: eventData[0]?.registrationLimit ? regCount[0].count >= eventData[0].registrationLimit : false,
      };
    }),
});
