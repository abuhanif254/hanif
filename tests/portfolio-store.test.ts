import { describe, it, expect } from "vitest";
import {
  getProjects,
  getProjectBySlug,
  getServices,
  getServiceBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  PROJECT_SLUG_ALIASES,
  SERVICE_SLUG_ALIASES,
} from "../app/lib/portfolio-store";

describe("Portfolio Store & Slug Unification", () => {
  it("should return all production projects without empty entries", async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThanOrEqual(6);
    for (const project of projects) {
      expect(project.slug).toBeDefined();
      expect(project.slug.length).toBeGreaterThan(0);
      expect(project.title).toBeDefined();
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.impactMetric).toBeDefined();
    }
  });

  it("should resolve canonical project slugs", async () => {
    const telemetry = await getProjectBySlug("financial-telemetry-pipeline");
    expect(telemetry).toBeDefined();
    expect(telemetry?.title).toContain("Financial Telemetry");

    const edge = await getProjectBySlug("cloudflare-edge-ecommerce");
    expect(edge).toBeDefined();
    expect(edge?.title).toContain("Cloudflare Edge");

    const postgres = await getProjectBySlug("postgres-performance-audit");
    expect(postgres).toBeDefined();
    expect(postgres?.impactMetric).toContain("Deadlocks");
  });

  it("should resolve legacy alias slugs without 404", async () => {
    const aliasEdge = await getProjectBySlug("edge-ecommerce-platform");
    expect(aliasEdge).toBeDefined();
    expect(aliasEdge?.title).toContain("Cloudflare Edge");

    const aliasRag = await getProjectBySlug("enterprise-rag-pipeline");
    expect(aliasRag).toBeDefined();
    expect(aliasRag?.title).toContain("Enterprise AI");
  });

  it("should return all consulting services and handle aliases", async () => {
    const services = await getServices();
    expect(services.length).toBeGreaterThanOrEqual(4);

    const audit = await getServiceBySlug("architecture-audit");
    expect(audit).toBeDefined();

    const aliasAudit = await getServiceBySlug("architecture-codebase-audit");
    expect(aliasAudit).toBeDefined();
    expect(aliasAudit?.id).toBe(audit?.id);
  });

  it("should return published blog posts and match slugs", async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBeGreaterThanOrEqual(4);

    const post = await getBlogPostBySlug("nextjs-16-cloudflare-pages-architecture");
    expect(post).toBeDefined();
    expect(post?.title).toContain("Next.js 16");
  });
});
