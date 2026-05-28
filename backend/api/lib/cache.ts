import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
});

const DEFAULT_TTL = 300; // 5 minutes

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const val = await redis.get(key);
    if (!val) return null;
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    // Silently fail - cache is best-effort
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // Silently fail
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Silently fail
  }
}

export async function incrementCounter(key: string, ttl = DEFAULT_TTL): Promise<number> {
  try {
    const val = await redis.incr(key);
    if (val === 1) {
      await redis.expire(key, ttl);
    }
    return val;
  } catch {
    return 0;
  }
}

export async function getCounter(key: string): Promise<number> {
  try {
    const val = await redis.get(key);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export async function acquireLock(lockKey: string, ttlSeconds = 10): Promise<boolean> {
  try {
    const result = await redis.set(lockKey, "1", "EX", ttlSeconds, "NX");
    return result === "OK";
  } catch {
    return false;
  }
}

export async function releaseLock(lockKey: string): Promise<void> {
  try {
    await redis.del(lockKey);
  } catch {
    // Ignore
  }
}

export { redis };
