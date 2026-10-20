import { describe, it, expect } from "vitest";
import { GET, HEAD } from "../app/api/ping/route";

describe("Ping API Health & Latency Probe (/api/ping)", () => {
  it("should respond to GET with status 200 and edge metadata", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.region).toContain("DAC");
    expect(json.timestamp).toBeGreaterThan(0);
  });

  it("should respond to HEAD request with status 200 for sub-millisecond latency probes", async () => {
    const res = await HEAD();
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Edge-Region")).toBe("DAC");
  });
});
