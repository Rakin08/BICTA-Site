import { createRouter, publicQuery } from "./middleware";
import { checkDbHealth } from "./queries/connection";
import { redis } from "./lib/cache";

export const healthRouter = createRouter({
  check: publicQuery.query(async () => {
    const start = Date.now();
    const [dbHealth, redisHealth] = await Promise.all([
      checkDbHealth(),
      redis.ping().then(() => true).catch(() => false),
    ]);

    const totalLatency = Date.now() - start;

    return {
      status: dbHealth.ok && redisHealth ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database: { status: dbHealth.ok ? "up" : "down", latency: dbHealth.latency },
        cache: { status: redisHealth ? "up" : "down" },
      },
      totalLatency,
    };
  }),

  // Detailed stats for admin monitoring
  stats: publicQuery.query(async () => {
    const [dbHealth, redisInfo] = await Promise.all([
      checkDbHealth(),
      redis.info("stats").catch(() => null),
    ]);

    const connectedClients = redisInfo
      ? parseInt(redisInfo.match(/connected_clients:(\d+)/)?.[1] || "0", 10)
      : 0;

    const keyspaceHits = redisInfo
      ? parseInt(redisInfo.match(/keyspace_hits:(\d+)/)?.[1] || "0", 10)
      : 0;

    const keyspaceMisses = redisInfo
      ? parseInt(redisInfo.match(/keyspace_misses:(\d+)/)?.[1] || "0", 10)
      : 0;

    return {
      database: { status: dbHealth.ok ? "up" : "down", latency: dbHealth.latency },
      cache: {
        status: connectedClients > 0 ? "up" : "down",
        connectedClients,
        hitRate: keyspaceHits + keyspaceMisses > 0
          ? Math.round((keyspaceHits / (keyspaceHits + keyspaceMisses)) * 100)
          : 0,
      },
    };
  }),
});
