import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactSubmissions } from "@db/schema";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        subject: z.string().max(255).optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contactSubmissions).values({
        name: input.name,
        email: input.email,
        subject: input.subject ?? null,
        message: input.message,
        status: "new",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),
});
