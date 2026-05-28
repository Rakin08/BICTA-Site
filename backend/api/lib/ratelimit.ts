import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./cache";

// Public API: 100 requests per minute per IP
export const publicLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_public",
  points: 100,
  duration: 60,
  blockDuration: 60,
});

// Registration: 10 requests per minute per IP (prevent spam)
export const registrationLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_reg",
  points: 10,
  duration: 60,
  blockDuration: 120,
});

// Contact/Partner forms: 5 submissions per 10 minutes per IP
export const formLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_form",
  points: 5,
  duration: 600,
  blockDuration: 600,
});

// Admin API: 200 requests per minute
export const adminLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_admin",
  points: 200,
  duration: 60,
  blockDuration: 30,
});

// Event registration burst: max 50 concurrent per event
export const eventBurstLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_event_burst",
  points: 50,
  duration: 1, // 1 second window for burst control
  blockDuration: 5,
});

export async function checkLimit(limiter: RateLimiterRedis, key: string, points = 1): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  try {
    const result = await limiter.consume(key, points);
    return {
      allowed: true,
      remaining: result.remainingPoints,
    };
  } catch (rejResult: any) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil(rejResult.msBeforeNext / 1000),
    };
  }
}
