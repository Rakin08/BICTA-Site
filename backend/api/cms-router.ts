import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { siteSettings, contentBlocks, speakers, eventSpeakers } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const cmsRouter = createRouter({
  // ─── Site Settings (public) ───────────────────────────
  settings: publicQuery
    .input(z.object({ group: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(siteSettings);
      if (input?.group) {
        return results.filter((s) => s.group === input.group);
      }
      return results;
    }),

  settingByKey: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(siteSettings).where(eq(siteSettings.key, input.key)).limit(1);
      return result[0] ?? null;
    }),

  // ─── Content Blocks by Section ────────────────────────
  contentBySection: publicQuery
    .input(z.object({ section: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(contentBlocks)
        .where(and(eq(contentBlocks.section, input.section), eq(contentBlocks.published, true)))
        .orderBy(contentBlocks.displayOrder);
      return results;
    }),

  contentByKey: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(contentBlocks)
        .where(and(eq(contentBlocks.key, input.key), eq(contentBlocks.published, true)))
        .limit(1);
      return result[0] ?? null;
    }),

  // ─── Speakers (public) ────────────────────────────────
  speakerList: publicQuery
    .input(z.object({ featured: z.boolean().optional(), limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.featured) {
        return db
          .select()
          .from(speakers)
          .where(eq(speakers.featured, true))
          .orderBy(desc(speakers.createdAt))
          .limit(input.limit ?? 50);
      }
      return db.select().from(speakers).orderBy(desc(speakers.createdAt)).limit(input?.limit ?? 50);
    }),

  speakerById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(speakers).where(eq(speakers.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  // ─── Event Speakers ───────────────────────────────────
  eventSpeakers: publicQuery
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(eventSpeakers)
        .where(eq(eventSpeakers.eventId, input.eventId));
    }),
});
