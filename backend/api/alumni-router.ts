import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { alumni } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const alumniRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          featured: z.boolean().optional(),
          limit: z.number().min(1).max(50).optional().default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.featured) {
        return db
          .select()
          .from(alumni)
          .where(eq(alumni.featured, true))
          .orderBy(desc(alumni.createdAt))
          .limit(input.limit ?? 20);
      }
      return db
        .select()
        .from(alumni)
        .orderBy(desc(alumni.createdAt))
        .limit(input?.limit ?? 20);
    }),
});
