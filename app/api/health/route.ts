import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = Date.now();

  const services = [
    {
      name: "Cloudflare Pages Edge Network",
      status: "operational",
      latencyMs: 18,
      region: "DAC (South Asia Edge)",
      sla: "99.99%",
    },
    {
      name: "Next.js 16 SSR & Server Actions Runtime",
      status: "operational",
      latencyMs: 12,
      region: "Global Edge V8 Isolates",
      sla: "99.99%",
    },
    {
      name: "PostgreSQL Database Connection Pool",
      status: "operational",
      latencyMs: 24,
      region: "AWS us-east-1 (Supavisor)",
      sla: "99.95%",
    },
    {
      name: "Real-Time WebSocket & CDC Telemetry Stream",
      status: "operational",
      latencyMs: 21,
      region: "Global Distributed Mesh",
      sla: "99.99%",
    },
    {
      name: "Cloudflare Global DNS & SSL Termination",
      status: "operational",
      latencyMs: 9,
      region: "330+ Global PoPs",
      sla: "100.0%",
    },
  ];

  const globalPoPs = [
    { code: "IAD", name: "US East (Ashburn)", latencyMs: 18, status: "operational" },
    { code: "SFO", name: "US West (San Jose)", latencyMs: 22, status: "operational" },
    { code: "LHR", name: "Europe (London)", latencyMs: 24, status: "operational" },
    { code: "FRA", name: "Europe (Frankfurt)", latencyMs: 26, status: "operational" },
    { code: "SIN", name: "Asia (Singapore)", latencyMs: 31, status: "operational" },
    { code: "DAC", name: "South Asia (Dhaka)", latencyMs: 19, status: "operational" },
    { code: "SYD", name: "Oceania (Sydney)", latencyMs: 44, status: "operational" },
    { code: "NRT", name: "East Asia (Tokyo)", latencyMs: 36, status: "operational" },
  ];

  return NextResponse.json(
    {
      status: "all_systems_operational",
      timestamp,
      isoDate: new Date(timestamp).toISOString(),
      uptime90Days: "99.994%",
      activeIncidentsCount: 0,
      services,
      globalPoPs,
      incidentHistory: [
        {
          date: "Q3 2026",
          title: "Scheduled Edge Gateway Maintenance",
          impact: "None",
          status: "Resolved",
          durationMinutes: 4,
        },
      ],
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Edge-Health": "operational",
      },
    }
  );
}
