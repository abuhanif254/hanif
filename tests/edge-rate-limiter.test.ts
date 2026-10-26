import { describe, it, expect, beforeEach } from "vitest";
import {
  checkSlidingWindowRateLimit,
  detectSuspiciousBot,
  extractClientIp,
  _resetRateLimitRegistryForTesting,
  RATE_LIMIT_CONFIGS,
} from "../app/lib/edge-rate-limiter";
import { POST as postInquiry } from "../app/api/inquiries/route";
import { GET as getPing } from "../app/api/ping/route";
import { POST as postTelemetry } from "../app/api/telemetry/route";
import { NextRequest } from "next/server";

describe("Edge Sliding-Window Rate Limiter & Bot Protection Shield", () => {
  beforeEach(() => {
    _resetRateLimitRegistryForTesting();
  });

  describe("Client IP Resolution", () => {
    it("extracts cf-connecting-ip header as top priority", () => {
      const req = new Request("http://localhost/api/test", {
        headers: {
          "cf-connecting-ip": "203.0.113.195",
          "x-real-ip": "198.51.100.2",
          "x-forwarded-for": "192.0.2.1, 10.0.0.1",
        },
      });
      expect(extractClientIp(req)).toBe("203.0.113.195");
    });

    it("falls back to x-real-ip if cf-connecting-ip is absent", () => {
      const req = new Request("http://localhost/api/test", {
        headers: {
          "x-real-ip": "198.51.100.2",
          "x-forwarded-for": "192.0.2.1, 10.0.0.1",
        },
      });
      expect(extractClientIp(req)).toBe("198.51.100.2");
    });

    it("falls back to first x-forwarded-for entry if others missing", () => {
      const req = new Request("http://localhost/api/test", {
        headers: {
          "x-forwarded-for": "192.0.2.14, 10.0.0.1",
        },
      });
      expect(extractClientIp(req)).toBe("192.0.2.14");
    });

    it("defaults to 127.0.0.1 when no forwarding headers exist", () => {
      const req = new Request("http://localhost/api/test");
      expect(extractClientIp(req)).toBe("127.0.0.1");
    });
  });

  describe("Sliding-Window Rate Limiting Engine", () => {
    const config = {
      limit: 3,
      windowMs: 60 * 1000,
      namespace: "test-window",
    };

    it("permits requests within quota and decrements remaining counter", () => {
      const req = new Request("http://localhost/api/test", {
        headers: { "cf-connecting-ip": "192.0.2.40" },
      });

      const r1 = checkSlidingWindowRateLimit(req, config);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);
      expect(r1.headers["RateLimit-Remaining"]).toBe("2");
      expect(r1.headers["RateLimit-Limit"]).toBe("3");

      const r2 = checkSlidingWindowRateLimit(req, config);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkSlidingWindowRateLimit(req, config);
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);
    });

    it("strictly blocks requests exceeding quota with 429 Retry-After metadata", () => {
      const req = new Request("http://localhost/api/test", {
        headers: { "cf-connecting-ip": "192.0.2.55" },
      });

      // Exhaust 3 tokens
      checkSlidingWindowRateLimit(req, config);
      checkSlidingWindowRateLimit(req, config);
      checkSlidingWindowRateLimit(req, config);

      // 4th request must be blocked
      const r4 = checkSlidingWindowRateLimit(req, config);
      expect(r4.allowed).toBe(false);
      expect(r4.remaining).toBe(0);
      expect(r4.headers["RateLimit-Remaining"]).toBe("0");
      expect(r4.headers["Retry-After"]).toBeDefined();
      expect(Number(r4.headers["Retry-After"])).toBeGreaterThan(0);
      expect(r4.headers["X-RateLimit-Exceeded"]).toBe("true");
      expect(r4.error).toContain("Rate limit exceeded");
    });

    it("isolates rate limits by IP address", () => {
      const reqA = new Request("http://localhost/api/test", {
        headers: { "cf-connecting-ip": "10.0.0.1" },
      });
      const reqB = new Request("http://localhost/api/test", {
        headers: { "cf-connecting-ip": "10.0.0.2" },
      });

      checkSlidingWindowRateLimit(reqA, config);
      checkSlidingWindowRateLimit(reqA, config);
      checkSlidingWindowRateLimit(reqA, config);

      // reqA exhausted
      expect(checkSlidingWindowRateLimit(reqA, config).allowed).toBe(false);

      // reqB still has fresh quota
      const rB = checkSlidingWindowRateLimit(reqB, config);
      expect(rB.allowed).toBe(true);
      expect(rB.remaining).toBe(2);
    });

    it("isolates rate limits by route namespace", () => {
      const req = new Request("http://localhost/api/test", {
        headers: { "cf-connecting-ip": "172.16.0.1" },
      });

      const configA = { limit: 2, windowMs: 10000, namespace: "route-a" };
      const configB = { limit: 2, windowMs: 10000, namespace: "route-b" };

      checkSlidingWindowRateLimit(req, configA);
      checkSlidingWindowRateLimit(req, configA);

      expect(checkSlidingWindowRateLimit(req, configA).allowed).toBe(false);
      expect(checkSlidingWindowRateLimit(req, configB).allowed).toBe(true);
    });
  });

  describe("Automated Bot & Exploit Detection Shield", () => {
    it("flags malicious automated vulnerability scanners", () => {
      const scannerAgents = [
        "sqlmap/1.5#stable",
        "Mozilla/5.0 (compatible; Nikto/2.1.6)",
        "masscan/1.3",
        "WPScan v3.8.22",
      ];

      scannerAgents.forEach((agent) => {
        const req = new Request("http://localhost/api/test", {
          headers: { "user-agent": agent },
        });
        const res = detectSuspiciousBot(req);
        expect(res.isSuspicious).toBe(true);
        expect(res.reason).toContain("scanner");
      });
    });

    it("flags hidden honeypot fields in body payloads", () => {
      const req = new Request("http://localhost/api/test");
      const res = detectSuspiciousBot(req, {
        name: "Bot User",
        website: "https://spam.com",
      });
      expect(res.isSuspicious).toBe(true);
      expect(res.reason?.toLowerCase()).toContain("honeypot");
    });

    it("flags script injection and cross-site scripting attempts", () => {
      const req = new Request("http://localhost/api/test");
      const res = detectSuspiciousBot(req, {
        name: "Attacker",
        message: "Hello <script>alert('pwned')</script> world",
      });
      expect(res.isSuspicious).toBe(true);
      expect(res.reason).toContain("script payload");
    });

    it("flags excessive hyperlink spam (>4 external links)", () => {
      const req = new Request("http://localhost/api/test");
      const res = detectSuspiciousBot(req, {
        name: "Spammer",
        message:
          "Buy crypto at https://link1.com and https://link2.com or https://link3.com and https://link4.com also https://link5.com",
      });
      expect(res.isSuspicious).toBe(true);
      expect(res.reason).toContain("Spam link");
    });

    it("permits genuine human project inquiries", () => {
      const req = new Request("http://localhost/api/test", {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0",
        },
      });
      const res = detectSuspiciousBot(req, {
        name: "Elena Rostova",
        email: "elena@synthetix.cloud",
        projectType: "Full-Stack SaaS MVP Engineering Sprint",
        message:
          "Hi Abu Hanif, we are looking for a staff engineer to lead our Next.js edge migration on Cloudflare Pages.",
      });
      expect(res.isSuspicious).toBe(false);
    });
  });

  describe("API Route Integration Verification", () => {
    it("/api/inquiries rejects script injection payloads with 400", async () => {
      const req = new Request("http://localhost:3000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cf-connecting-ip": "198.51.100.99",
        },
        body: JSON.stringify({
          name: "Security Probe",
          email: "probe@test.com",
          message: "<script>document.cookie</script>",
        }),
      });

      const res = await postInquiry(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Security verification failed");
    });

    it("/api/telemetry POST returns standard RateLimit headers", async () => {
      const req = new NextRequest("http://localhost:3000/api/telemetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cf-connecting-ip": "203.0.113.11",
        },
        body: JSON.stringify({
          latencyMs: 19,
          region: "DAC",
        }),
      });

      const res = await postTelemetry(req);
      expect(res.status).toBe(201);
      expect(res.headers.get("RateLimit-Limit")).toBe(
        String(RATE_LIMIT_CONFIGS.telemetryPost.limit)
      );
      expect(res.headers.get("RateLimit-Remaining")).toBeDefined();
    });

    it("/api/ping returns standard RateLimit headers when request is provided", async () => {
      const req = new Request("http://localhost:3000/api/ping", {
        headers: { "cf-connecting-ip": "203.0.113.88" },
      });

      const res = await getPing(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("RateLimit-Limit")).toBe(
        String(RATE_LIMIT_CONFIGS.ping.limit)
      );
      expect(res.headers.get("RateLimit-Remaining")).toBeDefined();
    });
  });
});
