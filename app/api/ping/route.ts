import { NextResponse } from "next/server";
import {
  checkSlidingWindowRateLimit,
  RATE_LIMIT_CONFIGS,
} from "../../lib/edge-rate-limiter";

export const dynamic = "force-dynamic";

export async function GET(req?: Request) {
  let rateHeaders: Record<string, string> = {};
  if (req) {
    const rateCheck = checkSlidingWindowRateLimit(req, RATE_LIMIT_CONFIGS.ping);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.error },
        { status: 429, headers: rateCheck.headers }
      );
    }
    rateHeaders = rateCheck.headers;
  }

  const start = Date.now();
  return NextResponse.json(
    {
      status: "ok",
      region: "DAC (South Asia Edge Gateway)",
      runtime: "Next.js 16 Turbopack • Cloudflare Pages Edge",
      timestamp: start,
      edgeSla: "99.99% Production Uptime",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Edge-Region": "DAC",
        ...rateHeaders,
      },
    }
  );
}

export async function HEAD(req?: Request) {
  let rateHeaders: Record<string, string> = {};
  if (req) {
    const rateCheck = checkSlidingWindowRateLimit(req, RATE_LIMIT_CONFIGS.ping);
    if (!rateCheck.allowed) {
      return new Response(null, { status: 429, headers: rateCheck.headers });
    }
    rateHeaders = rateCheck.headers;
  }

  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Edge-Region": "DAC",
      ...rateHeaders,
    },
  });
}
