import { describe, it, expect } from "vitest";
import { blogCategoryPillars } from "../app/data/blog-categories";
import { initialProjects, initialBlogPosts, initialServices } from "../app/data/portfolio-data";
import { PROJECT_SLUG_ALIASES, SERVICE_SLUG_ALIASES } from "../app/lib/portfolio-store";

describe("Routes, SEO & Topic Pillars Verification", () => {
  it("should define all 6 topic category pillars with valid metadata and slugs", () => {
    expect(blogCategoryPillars).toHaveLength(6);
    const expectedSlugs = ["postgresql", "nextjs", "cloudflare", "architecture", "performance", "rust"];

    for (const slug of expectedSlugs) {
      const pillar = blogCategoryPillars.find((p) => p.slug === slug);
      expect(pillar).toBeDefined();
      expect(pillar?.name.length).toBeGreaterThan(0);
      expect(pillar?.description.length).toBeGreaterThan(30);
      expect(pillar?.keywords.length).toBeGreaterThanOrEqual(3);
      expect(pillar?.consultingServiceSlug.length).toBeGreaterThan(0);
      expect(pillar?.consultingPrice).toMatch(/^\$\d+/);
    }
  });

  it("should ensure all initial project slugs are lowercase alphanumeric with hyphens", () => {
    expect(initialProjects.length).toBeGreaterThanOrEqual(6);
    for (const project of initialProjects) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.title.length).toBeGreaterThan(5);
      expect(project.techStack.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("should ensure all initial blog posts have required SEO properties", () => {
    expect(initialBlogPosts.length).toBeGreaterThanOrEqual(4);
    for (const post of initialBlogPosts) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.title.length).toBeGreaterThan(10);
      expect(post.excerpt.length).toBeGreaterThan(30);
      expect(post.readingTimeMinutes).toBeGreaterThan(0);
      expect(post.tags.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("should verify that all project aliases map to valid canonical slugs", () => {
    const canonicalSlugs = initialProjects.map((p) => p.slug);
    for (const [alias, canonical] of Object.entries(PROJECT_SLUG_ALIASES)) {
      expect(alias).not.toBe(canonical);
      expect(canonicalSlugs).toContain(canonical);
    }
  });

  it("should verify that all service aliases map to valid canonical service slugs", () => {
    const canonicalSlugs = initialServices.map((s) => s.slug);
    for (const [alias, canonical] of Object.entries(SERVICE_SLUG_ALIASES)) {
      expect(alias).not.toBe(canonical);
      expect(canonicalSlugs).toContain(canonical);
    }
  });

  it("should verify sitemap generates all core routes including /lab and topic pillars", async () => {
    const sitemapFn = (await import("../app/sitemap")).default;
    const entries = await sitemapFn();

    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://abuhanifmia.com/");
    expect(urls).toContain("https://abuhanifmia.com/lab");
    expect(urls).toContain("https://abuhanifmia.com/status");
    expect(urls).toContain("https://abuhanifmia.com/projects");
    expect(urls).toContain("https://abuhanifmia.com/pricing");
    expect(urls).toContain("https://abuhanifmia.com/blog");
    expect(urls).toContain("https://abuhanifmia.com/resume");

    for (const cat of blogCategoryPillars) {
      expect(urls).toContain(`https://abuhanifmia.com/blog/category/${cat.slug}`);
    }

    for (const s of initialServices) {
      expect(urls).toContain(`https://abuhanifmia.com/services/${s.slug}`);
    }

    expect(entries.length).toBeGreaterThanOrEqual(30);
  });

  it("should return valid operational telemetry from /api/health", async () => {
    const { GET } = await import("../app/api/health/route");
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("all_systems_operational");
    expect(data.uptime90Days).toBe("99.994%");
    expect(Array.isArray(data.services)).toBe(true);
    expect(data.services.length).toBeGreaterThanOrEqual(5);

    const edgePoPs = data.services.find((c: { name: string }) => c.name.includes("Cloudflare"));
    expect(edgePoPs).toBeDefined();
    expect(edgePoPs?.status).toBe("operational");

    expect(Array.isArray(data.globalPoPs)).toBe(true);
    expect(data.globalPoPs.length).toBeGreaterThanOrEqual(6);
  });

  it("should verify verified client testimonials have valid structure and metrics", async () => {
    const { getTestimonials } = await import("../app/lib/portfolio-store");
    const testimonials = await getTestimonials();

    expect(testimonials.length).toBeGreaterThanOrEqual(4);
    for (const t of testimonials) {
      expect(t.author.length).toBeGreaterThan(3);
      expect(t.role.length).toBeGreaterThan(3);
      expect(t.company.length).toBeGreaterThan(3);
      expect(t.quote.length).toBeGreaterThan(40);
      expect(t.verifiedMetric).toBeDefined();
      expect(t.deliverableTag).toBeDefined();
    }
  });

  it("should verify interactive architecture topologies have valid nodes and cross-links", async () => {
    const { ARCHITECTURE_TOPOLOGIES } = await import("../app/components/architecture-topology-explorer");
    expect(ARCHITECTURE_TOPOLOGIES.length).toBe(4);

    for (const top of ARCHITECTURE_TOPOLOGIES) {
      expect(top.id.length).toBeGreaterThan(0);
      expect(top.title.length).toBeGreaterThan(10);
      expect(top.caseStudySlug.length).toBeGreaterThan(0);
      expect(top.serviceSlug.length).toBeGreaterThan(0);
      expect(top.nodes.length).toBe(5);

      for (const node of top.nodes) {
        expect(node.id.length).toBeGreaterThan(0);
        expect(node.label.length).toBeGreaterThan(0);
        expect(node.throughput.length).toBeGreaterThan(0);
        expect(node.latencyBudget.length).toBeGreaterThan(0);
        expect(node.rationale.length).toBeGreaterThan(20);
        expect(node.resiliency.length).toBeGreaterThan(20);
      }
    }
  });
});

