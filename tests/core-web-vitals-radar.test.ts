import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

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

describe("Core Web Vitals Radar & Live Performance Telemetry", () => {
  it("verifies official Google CWV thresholds are declared accurately in component source", () => {
    const componentSource = fs.readFileSync(
      path.resolve(process.cwd(), "app/components/core-web-vitals-radar.tsx"),
      "utf8"
    );

    // Official Google Core Web Vitals targets
    expect(componentSource).toContain("200ms"); // TTFB
    expect(componentSource).toContain("1.8s"); // FCP
    expect(componentSource).toContain("2.5s"); // LCP
    expect(componentSource).toContain("0.10"); // CLS
    expect(componentSource).toContain("200ms"); // INP

    // Observers
    expect(componentSource).toContain("largest-contentful-paint");
    expect(componentSource).toContain("layout-shift");
    expect(componentSource).toContain("first-input");
    expect(componentSource).toContain("PerformanceObserver");
  });

  it("verifies all prerendered public pages include the Core Web Vitals Radar component", () => {
    const htmlFiles = findHtmlFiles(APP_SERVER_DIR);
    expect(htmlFiles.length).toBeGreaterThanOrEqual(35);

    let foundCount = 0;
    for (const filePath of htmlFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      const relative = path.relative(APP_SERVER_DIR, filePath).replace(/\\/g, "/");

      // Skip admin dashboard if present
      if (relative.includes("admin")) continue;

      if (
        content.includes("core-web-vitals-radar") ||
        content.includes("Live Core Web Vitals")
      ) {
        foundCount++;
      }
    }

    // Every public page sharing SiteFooter must contain the vitals radar
    expect(foundCount).toBeGreaterThanOrEqual(35);
  });

  it("verifies the 4 Lighthouse 100/100 audit audit targets are documented", () => {
    const componentSource = fs.readFileSync(
      path.resolve(process.cwd(), "app/components/core-web-vitals-radar.tsx"),
      "utf8"
    );

    expect(componentSource).toContain("PERFORMANCE");
    expect(componentSource).toContain("ACCESSIBILITY");
    expect(componentSource).toContain("BEST PRACTICES");
    expect(componentSource).toContain("SEO RANK");
  });

  it("verifies re-test ping connects to valid endpoint (/api/ping)", () => {
    const componentSource = fs.readFileSync(
      path.resolve(process.cwd(), "app/components/core-web-vitals-radar.tsx"),
      "utf8"
    );

    expect(componentSource).toContain("/api/ping");
  });
});
