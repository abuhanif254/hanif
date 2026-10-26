import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, detectEdgeRegion, REGIONS_DIRECTORY } from "../app/api/telemetry/route";

describe("Edge Telemetry API (/api/telemetry)", () => {
  it("GET returns global percentiles, 8 operational edge PoPs, and recent live pings", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("edge_telemetry_mesh_operational");
    expect(data.totalSamples).toBeGreaterThanOrEqual(8);
    expect(data.p50).toBeGreaterThan(0);
    expect(data.p95).toBeGreaterThanOrEqual(data.p50);
    expect(data.p99).toBeGreaterThanOrEqual(data.p95);
    expect(data.globalSla).toBe("99.99%");

    expect(Array.isArray(data.regions)).toBe(true);
    expect(data.regions.length).toBe(8);

    const regionCodes = data.regions.map((r: { region: string }) => r.region);
    expect(regionCodes).toContain("IAD");
    expect(regionCodes).toContain("SFO");
    expect(regionCodes).toContain("LHR");
    expect(regionCodes).toContain("FRA");
    expect(regionCodes).toContain("SIN");
    expect(regionCodes).toContain("DAC");
    expect(regionCodes).toContain("NRT");
    expect(regionCodes).toContain("SYD");

    // Every region should show edge delivery faster than centralized origin
    for (const r of data.regions) {
      expect(r.edgeLatencyMs).toBeLessThan(r.originLatencyMs);
      expect(r.originLatencyMs).toBeGreaterThan(200);
    }

    expect(Array.isArray(data.recentPings)).toBe(true);
    expect(data.recentPings.length).toBeGreaterThan(0);
  });

  it("POST records genuine browser latency and responds with 201", async () => {
    const req = new NextRequest("http://localhost:3000/api/telemetry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cf-ray": "8472910fa-SIN",
      },
      body: JSON.stringify({
        latencyMs: 27,
        region: "SIN",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.recordedPoint.region).toBe("SIN");
    expect(data.recordedPoint.latencyMs).toBe(27);
    expect(data.originLatencyMs).toBe(REGIONS_DIRECTORY.SIN.baselineOriginMs);
    expect(data.speedup).toContain("x Faster");
  });

  it("POST rejects invalid latency payloads with HTTP 400", async () => {
    const invalidPayloads = [
      { latencyMs: -10 },
      { latencyMs: 0 },
      { latencyMs: 99999 },
      { latencyMs: "not-a-number" },
    ];

    for (const payload of invalidPayloads) {
      const req = new NextRequest("http://localhost:3000/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    }
  });

  it("detectEdgeRegion accurately parses Cloudflare cf-ray colos and headers", () => {
    // 1. Cloudflare Ray ID with LHR (London)
    const reqLhr = new NextRequest("http://localhost:3000/api/telemetry", {
      headers: { "cf-ray": "993417382-LHR" },
    });
    const detectedLhr = detectEdgeRegion(reqLhr);
    expect(detectedLhr.code).toBe("LHR");
    expect(detectedLhr.name).toContain("London");

    // 2. Cloudflare Ray ID with SFO (San Jose)
    const reqSfo = new NextRequest("http://localhost:3000/api/telemetry", {
      headers: { "cf-ray": "443217382-SFO" },
    });
    const detectedSfo = detectEdgeRegion(reqSfo);
    expect(detectedSfo.code).toBe("SFO");

    // 3. Fallback to DAC on local development or non-CF headers
    const reqLocal = new NextRequest("http://localhost:3000/api/telemetry");
    const detectedLocal = detectEdgeRegion(reqLocal);
    expect(detectedLocal.code).toBe("DAC");
    expect(detectedLocal.name).toContain("Dhaka");
  });
});
