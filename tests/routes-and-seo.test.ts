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
    const entries = sitemapFn();

    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://abuhanifmia.com/");
    expect(urls).toContain("https://abuhanifmia.com/lab");
    expect(urls).toContain("https://abuhanifmia.com/projects");
    expect(urls).toContain("https://abuhanifmia.com/pricing");
    expect(urls).toContain("https://abuhanifmia.com/blog");
    expect(urls).toContain("https://abuhanifmia.com/resume");

    for (const cat of blogCategoryPillars) {
      expect(urls).toContain(`https://abuhanifmia.com/blog/category/${cat.slug}`);
    }

    expect(entries.length).toBeGreaterThanOrEqual(20);
  });
});

