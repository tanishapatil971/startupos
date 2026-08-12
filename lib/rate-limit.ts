import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Default limits (can be overridden by env variables)
const MAX_REQUESTS = parseInt(process.env.AI_RATE_LIMIT_REQUESTS || "20", 10);
const WINDOW_SECONDS = parseInt(process.env.AI_RATE_LIMIT_WINDOW_SECONDS || "3600", 10);

// Fallback in-memory store for when Upstash Redis is not configured or fails
const fallbackCache = new Map<string, { count: number; expiresAt: number }>();

function getFallbackRateLimit(identifier: string) {
  const now = Date.now();
  let record = fallbackCache.get(identifier);

  // Clean up expired or create new
  if (!record || record.expiresAt < now) {
    record = { count: 0, expiresAt: now + WINDOW_SECONDS * 1000 };
    fallbackCache.set(identifier, record);
  }

  record.count += 1;
  const success = record.count <= MAX_REQUESTS;
  const reset = record.expiresAt;

  return { success, reset };
}

let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
      analytics: true,
      ephemeralCache: new Map(), // Use a local cache for faster subsequent requests
    });
  }
} catch {
  console.warn("Failed to initialize Upstash Redis rate limiter, using fallback.");
}

export async function checkRateLimit(userId: string, endpoint: string) {
  const identifier = `rate_limit:${endpoint}:${userId}`;

  if (ratelimit) {
    try {
      const { success, reset } = await ratelimit.limit(identifier);
      return { success, reset };
    } catch {
      console.warn("Upstash Redis rate limiting failed, falling back to in-memory limit.");
      // Fallback if Redis request fails
      return getFallbackRateLimit(identifier);
    }
  }

  // Fallback if Redis is not configured
  return getFallbackRateLimit(identifier);
}
