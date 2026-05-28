import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";

// Connection pool for high concurrency (50+ simultaneous requests)
const pool: Pool = createPool({
  uri: env.databaseUrl,
  connectionLimit: 30,        // Max 30 concurrent DB connections
  queueLimit: 100,            // Queue up to 100 waiting requests
  idleTimeout: 300000,        // 5min idle timeout
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

let instance: ReturnType<typeof createDrizzle> | undefined;

function createDrizzle() {
  return drizzle(pool, {
    mode: "planetscale",
    schema,
  });
}

export function getDb() {
  if (!instance) {
    instance = createDrizzle();
  }
  return instance;
}

// Get raw pool for transactions
export function getPool() {
  return pool;
}

// Health check
export async function checkDbHealth(): Promise<{ ok: boolean; latency: number }> {
  const start = Date.now();
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    return { ok: true, latency: Date.now() - start };
  } catch {
    return { ok: false, latency: Date.now() - start };
  }
}
