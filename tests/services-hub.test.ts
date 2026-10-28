import { describe, it, expect } from "vitest";
import { initialServices } from "../app/data/portfolio-data";
import { getServices, getServiceBySlug } from "../app/lib/portfolio-store";

describe("Services & Digital Engineering Solutions Hub", () => {
  it("should verify that all core service offerings are present with rich metadata", () => {
    expect(initialServices.length).toBeGreaterThanOrEqual(10);

    const requiredSlugs = [
      "technical-programmatic-seo",
      "social-media-automation",
      "high-converting-landing-pages",
      "custom-web-saas",
      "database-optimization",
      "cloudflare-edge-migration",
      "architecture-audit",
    ];

    for (const slug of requiredSlugs) {
      const match = initialServices.find((s) => s.slug === slug);
      expect(match).toBeDefined();
      expect(match?.title.length).toBeGreaterThan(10);
      expect(match?.description.length).toBeGreaterThan(30);
      expect(match?.priceDisplay).toMatch(/^\$\d+/);
      expect(match?.deliverables.length).toBeGreaterThanOrEqual(4);
      expect(match?.timeline.length).toBeGreaterThan(3);
    }
  });

  it("should categorize services accurately across growth, web, and systems", () => {
    const seo = initialServices.find((s) => s.slug === "technical-programmatic-seo");
    expect(seo?.category).toBe("growth-seo");
    expect(seo?.techStack).toContain("Next.js 16");
    expect(seo?.techStack).toContain("Schema.org");
    expect(seo?.roiMetric).toContain("100/100 Lighthouse");

    const automation = initialServices.find((s) => s.slug === "social-media-automation");
    expect(automation?.category).toBe("growth-seo");
    expect(automation?.techStack).toContain("BullMQ");
    expect(automation?.techStack).toContain("Twitter API v2");

    const landing = initialServices.find((s) => s.slug === "high-converting-landing-pages");
    expect(landing?.category).toBe("growth-seo");
    expect(landing?.techStack).toContain("Stripe API");
    expect(landing?.roiMetric).toContain("Sub-50ms TTFB");

    const saas = initialServices.find((s) => s.slug === "custom-web-saas");
    expect(saas?.category).toBe("web-saas");
    expect(saas?.techStack).toContain("Supabase");
    expect(saas?.techStack).toContain("PostgreSQL");
  });

  it("should resolve each service through portfolio store getServiceBySlug", async () => {
    const service = await getServiceBySlug("technical-programmatic-seo");
    expect(service).toBeDefined();
    expect(service?.title).toContain("Technical & Programmatic SEO");

    const automation = await getServiceBySlug("social-media-automation");
    expect(automation).toBeDefined();
    expect(automation?.priceDisplay).toBe("$4,000");

    const landing = await getServiceBySlug("high-converting-landing-pages");
    expect(landing).toBeDefined();
    expect(landing?.priceDisplay).toBe("$2,800");

    const saas = await getServiceBySlug("custom-web-saas");
    expect(saas).toBeDefined();
    expect(saas?.priceDisplay).toBe("$14,500");
  });

  it("should verify sitemap includes /services with high priority", async () => {
    const sitemapFn = (await import("../app/sitemap")).default;
    const entries = await sitemapFn();

    const servicesEntry = entries.find((e) => e.url === "https://abuhanifmia.com/services");
    expect(servicesEntry).toBeDefined();
    expect(servicesEntry?.priority).toBe(0.95);

    const seoSubroute = entries.find((e) => e.url === "https://abuhanifmia.com/services/technical-programmatic-seo");
    expect(seoSubroute).toBeDefined();
  });
});
