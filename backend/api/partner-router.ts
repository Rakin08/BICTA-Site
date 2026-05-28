import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { partnerInquiries } from "@db/schema";


export const partnerRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        organizationName: z.string().min(1).max(255),
        contactName: z.string().min(1).max(255),
        email: z.string().email().max(320),
        phone: z.string().max(50).optional(),
        interestType: z.enum([
          "sponsor",
          "university_partner",
          "media_partner",
          "ecosystem_partner",
          "other",
        ]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(partnerInquiries).values({
        organizationName: input.organizationName,
        contactName: input.contactName,
        email: input.email,
        phone: input.phone ?? null,
        interestType: input.interestType,
        notes: input.notes ?? null,
        status: "new",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),
});
