import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { impactMetrics } from "@db/schema";
import { asc } from "drizzle-orm";


export const metricsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(impactMetrics)
      .orderBy(asc(impactMetrics.displayOrder));
  }),
});
