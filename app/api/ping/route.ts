import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
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
      },
    }
  );
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Edge-Region": "DAC",
    },
  });
}
