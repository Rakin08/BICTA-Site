import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),

  // Admin: Update user's role
  updateRole: adminQuery
    .input(z.object({
      userId: z.number(),
      role: z.enum(["admin", "student", "partner"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // Admin: List all users
  userList: adminQuery
    .input(z.object({
      role: z.enum(["admin", "student", "partner"]).optional(),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(users).limit(input?.limit ?? 50);
      if (input?.role) {
        return results.filter((u) => u.role === input.role);
      }
      return results;
    }),
});
