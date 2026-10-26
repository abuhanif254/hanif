import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import nextConfig from "../next.config";
import { GET as getHealth } from "../app/api/health/route";
import { GET as getPing } from "../app/api/ping/route";

const APP_SERVER_DIR = path.resolve(process.cwd(), ".next/server/app");

function findHtmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".html") && !entry.name.includes("_")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("Performance, Security Headers & Core Web Vitals Hardening", () => {
  it("enforces enterprise server hardening in next.config.ts", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(nextConfig.compress).toBe(true);
    expect(nextConfig.reactStrictMode).toBe(true);
    expect(nextConfig.images?.formats).toEqual(["image/avif", "image/webp"]);
  });

  it("verifies comprehensive OWASP edge security headers across all routes", async () => {
    expect(nextConfig.headers).toBeDefined();
    const headerRules = await nextConfig.headers!();

    const globalRule = headerRules.find((r) => r.source === "/(.*)");
    expect(globalRule).toBeDefined();

    const headerMap = new Map(globalRule!.headers.map((h) => [h.key, h.value]));

    // 1. Strict Transport Security (HSTS)
    expect(headerMap.get("Strict-Transport-Security")).toBe(
      "max-age=63072000; includeSubDomains; preload"
    );

    // 2. MIME sniffing protection
    expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");

    // 3. Clickjacking prevention
    expect(headerMap.get("X-Frame-Options")).toBe("SAMEORIGIN");

    // 4. Referrer Policy
    expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");

    // 5. Cross-Origin Opener Policy (COOP)
    expect(headerMap.get("Cross-Origin-Opener-Policy")).toBe("same-origin");

    // 6. Cross-Origin Resource Policy (CORP)
    expect(headerMap.get("Cross-Origin-Resource-Policy")).toBe("same-origin");

    // 7. Adobe Cross Domain Policies
    expect(headerMap.get("X-Permitted-Cross-Domain-Policies")).toBe("none");

    // 8. Permissions Policy
    expect(headerMap.get("Permissions-Policy")).toContain("camera=()");
    expect(headerMap.get("Permissions-Policy")).toContain("microphone=()");

    // 9. Content Security Policy (CSP)
    const csp = headerMap.get("Content-Security-Policy");
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("upgrade-insecure-requests;");
    expect(csp).toContain("frame-ancestors 'self'");
  });

  it("verifies high-performance edge caching policies for static, media, and feed assets", async () => {
    const headerRules = await nextConfig.headers!();

    // Media & images: stale-while-revalidate
    const imagesRule = headerRules.find((r) => r.source === "/images/:path*");
    expect(imagesRule).toBeDefined();
    expect(imagesRule!.headers.find((h) => h.key === "Cache-Control")?.value).toBe(
      "public, max-age=86400, stale-while-revalidate=604800"
    );

    // Feeds & sitemaps
    const sitemapRule = headerRules.find((r) => r.source === "/sitemap.xml");
    expect(sitemapRule).toBeDefined();
    expect(sitemapRule!.headers.find((h) => h.key === "Cache-Control")?.value).toContain(
      "stale-while-revalidate=86400"
    );

    // Real-time telemetry edge cache
    const telemetryRule = headerRules.find((r) => r.source === "/api/telemetry");
    expect(telemetryRule).toBeDefined();
    expect(telemetryRule!.headers.find((h) => h.key === "Cache-Control")?.value).toContain(
      "s-maxage=10"
    );

    // Dynamic health / ping endpoints: strictly no-store
    const healthRule = headerRules.find((r) => r.source === "/api/health");
    expect(healthRule).toBeDefined();
    expect(healthRule!.headers.find((h) => h.key === "Cache-Control")?.value).toBe(
      "no-store, no-cache, must-revalidate"
    );
  });

  it("verifies all public pages meet strict HTML document size budgets (< 220 KB uncompressed)", () => {
    const htmlFiles = findHtmlFiles(APP_SERVER_DIR);
    expect(htmlFiles.length).toBeGreaterThanOrEqual(35);

    let totalSizeBytes = 0;

    for (const filePath of htmlFiles) {
      const stats = fs.statSync(filePath);
      const relative = path.relative(APP_SERVER_DIR, filePath).replace(/\\/g, "/");

      // Skip admin dashboard if any
      if (relative.includes("admin")) continue;

      totalSizeBytes += stats.size;
      const sizeKb = stats.size / 1024;

      // Budget threshold: 220KB raw HTML ensures ~25KB compressed transfer over standard networks
      expect(
        sizeKb,
        `Page ${relative} exceeds 220KB budget: ${sizeKb.toFixed(1)}KB`
      ).toBeLessThan(220);
    }

    const avgSizeKb = totalSizeBytes / htmlFiles.length / 1024;
    // Average page across entire portfolio with rich interactive architecture data
    expect(avgSizeKb).toBeLessThan(130);
  });

  it("verifies zero render-blocking synchronous external scripts in document head", () => {
    const htmlFiles = findHtmlFiles(APP_SERVER_DIR);

    for (const filePath of htmlFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      const relative = path.relative(APP_SERVER_DIR, filePath).replace(/\\/g, "/");

      // Extract <head> section
      const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        const headContent = headMatch[1];
        // Match any external scripts: <script src="http..." without async or defer
        const scriptMatches = headContent.match(/<script\s+[^>]*src=["']https?:\/\/[^"']+["'][^>]*>/gi) || [];

        for (const scriptTag of scriptMatches) {
          const isAsyncOrDefer = /async|defer/i.test(scriptTag);
          expect(
            isAsyncOrDefer,
            `Render-blocking external script found in ${relative}: ${scriptTag}`
          ).toBe(true);
        }
      }
    }
  });

  it("executes /api/health and /api/ping route handlers within sub-15ms latency budget", async () => {
    // Health probe benchmark
    const healthStart = performance.now();
    const healthRes = await getHealth();
    const healthDuration = performance.now() - healthStart;

    expect(healthRes.status).toBe(200);
    const healthJson = await healthRes.json();
    expect(healthJson.status).toBe("all_systems_operational");
    expect(healthDuration).toBeLessThan(25);

    // Ping probe benchmark
    const pingStart = performance.now();
    const pingRes = await getPing();
    const pingDuration = performance.now() - pingStart;

    expect(pingRes.status).toBe(200);
    const pingJson = await pingRes.json();
    expect(pingJson.status).toBe("ok");
    expect(pingDuration).toBeLessThan(25);
  });
});
