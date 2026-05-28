import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { advisers } from "@db/schema";
import { eq, asc, count } from "drizzle-orm";

export const adviserRouter = createRouter({
  // ─── Public: List Advisers ──────────────────────────
  list: publicQuery
    .input(z.object({
      featured: z.boolean().optional(),
      limit: z.number().min(1).max(100).optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.featured) {
        return db.select().from(advisers)
          .where(eq(advisers.featured, true))
          .orderBy(asc(advisers.displayOrder))
          .limit(input.limit);
      }
      return db.select().from(advisers)
        .where(eq(advisers.published, true))
        .orderBy(asc(advisers.displayOrder))
        .limit(input?.limit ?? 50);
    }),

  // ─── Public: Get Single Adviser ─────────────────────
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(advisers).where(eq(advisers.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  // ─── Admin: Create ──────────────────────────────────
  create: adminQuery
    .input(z.object({
      name: z.string().min(1).max(255),
      title: z.string().min(1).max(255),
      company: z.string().optional(),
      bio: z.string().optional(),
      expertise: z.string().optional(),
      imageUrl: z.string().optional(),
      linkedInUrl: z.string().optional(),
      twitterUrl: z.string().optional(),
      websiteUrl: z.string().optional(),
      displayOrder: z.number().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(advisers).values(input);
      return { success: true, id: Number(result[0].insertId) };
    }),

  // ─── Admin: Update ──────────────────────────────────
  update: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      title: z.string().min(1).max(255).optional(),
      company: z.string().optional(),
      bio: z.string().optional(),
      expertise: z.string().optional(),
      imageUrl: z.string().optional(),
      linkedInUrl: z.string().optional(),
      twitterUrl: z.string().optional(),
      websiteUrl: z.string().optional(),
      displayOrder: z.number().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(advisers).set(data).where(eq(advisers.id, id));
      return { success: true };
    }),

  // ─── Admin: Delete ──────────────────────────────────
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(advisers).where(eq(advisers.id, input.id));
      return { success: true };
    }),

  // ─── Admin: List All (including unpublished) ────────
  adminList: adminQuery
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(advisers).orderBy(asc(advisers.displayOrder)).limit(input?.limit ?? 50);
    }),

  // ─── Admin: Count ───────────────────────────────────
  count: adminQuery.query(async () => {
    const db = getDb();
    const result = await db.select({ count: count() }).from(advisers);
    return result[0]?.count ?? 0;
  }),
});
