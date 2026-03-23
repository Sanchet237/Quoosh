// ============================================================
// ⚠️  PRODUCTION SECURITY WARNING
// Rate limiting is ONLY active when both UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN are set in your environment.
//
// Without these variables:
//   - The /api/creators/register endpoint has NO request limiting
//   - The credentials login has NO brute-force protection
//
// Get free Redis credentials at: https://upstash.com
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
// ============================================================

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Only initialize if Upstash env vars are set
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

export const registerRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 requests per 10 minutes
      analytics: false,
    })
  : null

export const authRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "5 m"), // 10 attempts per 5 minutes
      analytics: false,
    })
  : null
