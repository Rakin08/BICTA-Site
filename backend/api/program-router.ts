import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { programs } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const programRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional().default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(programs)
        .orderBy(desc(programs.order))
        .limit(input?.limit ?? 20);
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(programs)
      .where(eq(programs.featured, true))
      .orderBy(desc(programs.order))
      .limit(6);
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(programs)
        .where(eq(programs.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),
});
