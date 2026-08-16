import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const checkType = searchParams.get("check");
  const timestamp = new Date().toISOString();

  // 1. Liveness check - returns immediately
  if (checkType === "liveness") {
    return NextResponse.json({
      status: "healthy",
      timestamp,
      type: "liveness",
    });
  }

  // 2. Readiness check - queries downstream dependencies
  let supabaseStatus = "down";
  let redisStatus = "down";
  let overallStatus = "healthy";

  const promises: Promise<void>[] = [];

  // A. Supabase Check
  promises.push(
    (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !anonKey || url.includes("placeholder")) {
        supabaseStatus = "not_configured";
        overallStatus = "unhealthy";
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${url}/rest/v1/`, {
          headers: {
            apikey: anonKey,
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          supabaseStatus = "up";
        } else {
          logger.error("Supabase health check returned non-OK status", { status: res.status });
          supabaseStatus = "down";
          overallStatus = "unhealthy";
        }
      } catch (error) {
        logger.error("Supabase health check failed", { error });
        supabaseStatus = "down";
        overallStatus = "unhealthy";
      }
    })()
  );

  // B. Redis Check
  promises.push(
    (async () => {
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (!url || !token) {
        redisStatus = "not_configured";
        if (overallStatus !== "unhealthy") {
          overallStatus = "degraded";
        }
        return;
      }

      try {
        const redis = new Redis({ url, token });
        const pong = await redis.ping();

        if (pong === "PONG") {
          redisStatus = "up";
        } else {
          redisStatus = "down";
          if (overallStatus !== "unhealthy") {
            overallStatus = "degraded";
          }
        }
      } catch (error) {
        logger.error("Redis health check failed", { error });
        redisStatus = "down";
        if (overallStatus !== "unhealthy") {
          overallStatus = "degraded";
        }
      }
    })()
  );

  await Promise.all(promises);

  const statusCode = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp,
      type: "readiness",
      checks: {
        supabase: supabaseStatus,
        redis: redisStatus,
      },
    },
    { status: statusCode }
  );
}
