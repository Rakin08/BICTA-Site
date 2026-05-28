import { authRouter } from "./auth-router";
import { eventRouter } from "./event-router";
import { programRouter } from "./program-router";
import { partnerRouter } from "./partner-router";
import { alumniRouter } from "./alumni-router";
import { contactRouter } from "./contact-router";
import { metricsRouter } from "./metrics-router";
import { adminRouter } from "./admin-router";
import { eventRegistrationRouter } from "./event-registration-router";
import { cmsRouter } from "./cms-router";
import { healthRouter } from "./health-router";
import { competitionRouter } from "./competition-router";
import { adviserRouter } from "./adviser-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  health: healthRouter,
  auth: authRouter,
  event: eventRouter,
  program: programRouter,
  partner: partnerRouter,
  alumni: alumniRouter,
  contact: contactRouter,
  metrics: metricsRouter,
  admin: adminRouter,
  registration: eventRegistrationRouter,
  cms: cmsRouter,
  competition: competitionRouter,
  adviser: adviserRouter,
});

export type AppRouter = typeof appRouter;
