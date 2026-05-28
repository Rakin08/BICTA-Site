import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

// ─── Auth Middleware (any logged-in user) ──────────────
const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

// ─── Role-based Middleware ─────────────────────────────
function requireRole(role: string) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== role) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

// ─── Three Login Type Procedures ───────────────────────
// Type 1: Admin — Full CMS control
export const adminQuery = t.procedure.use(requireAuth).use(requireRole("admin"));

// Type 2: Student — Can register for events, view own data
export const studentQuery = t.procedure.use(requireAuth).use(requireRole("student"));

// Type 3: Partner — Can submit inquiries, access partner portal
export const partnerQuery = t.procedure.use(requireAuth).use(requireRole("partner"));

// Any authenticated user
export const authedQuery = t.procedure.use(requireAuth);

// Admin or authed (for mixed-access endpoints)
export const adminOrAuthed = t.procedure.use(requireAuth);
