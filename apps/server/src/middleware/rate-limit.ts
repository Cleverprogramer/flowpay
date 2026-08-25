import type { MiddlewareHandler } from "hono";

type Bucket = { count: number; resetAt: number };

const CLEANUP_INTERVAL_MS = 60_000;
const MAX_TRACKED_CLIENTS = 10_000;

export function createRateLimiter(options?: {
  windowMs?: number;
  max?: number;
}): MiddlewareHandler {
  const windowMs = options?.windowMs ?? 60_000;
  const max = options?.max ?? 100;

  const buckets = new Map<string, Bucket>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, CLEANUP_INTERVAL_MS).unref?.();

  return async (c, next) => {
    const key =
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.env?.incoming?.remoteAddress ||
      "unknown";
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      if (buckets.size >= MAX_TRACKED_CLIENTS) {
        for (const [oldestKey, oldest] of buckets) {
          if (oldest.resetAt <= now) buckets.delete(oldestKey);
        }
      }
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count++;

    const remaining = Math.max(0, max - bucket.count);
    const resetIn = Math.ceil((bucket.resetAt - now) / 1000);

    if (bucket.count > max) {
      return c.json(
        { error: "Too many requests, please try again later" },
        429,
        {
          "Retry-After": String(resetIn),
          "X-RateLimit-Limit": String(max),
          "X-RateLimit-Remaining": "0",
        },
      );
    }

    await next();

    c.header("X-RateLimit-Limit", String(max));
    c.header("X-RateLimit-Remaining", String(remaining));
  };
}
