import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { initialProjects, initialBlogPosts, initialServices } from "../app/data/portfolio-data";
import { blogCategoryPillars } from "../app/data/blog-categories";

describe("Global Command Palette & Quick Discovery Hub", () => {
  const paletteSource = fs.readFileSync(
    path.resolve(process.cwd(), "app/components/command-palette.tsx"),
    "utf8"
  );

  it("handles standard keyboard shortcuts (Ctrl+K, Cmd+K, Escape) and custom open event", () => {
    expect(paletteSource).toContain("handleKeyDown");
    expect(paletteSource).toContain("e.metaKey || e.ctrlKey");
    expect(paletteSource).toContain('e.key.toLowerCase() === "k"');
    expect(paletteSource).toContain('e.key === "Escape"');
    expect(paletteSource).toContain('"open-command-palette"');
  });

  it("indexes all core interactive systems lab tools and simulators", () => {
    expect(paletteSource).toContain("Interactive Systems Lab & Engineering Simulators");
    expect(paletteSource).toContain("/lab#edge-radar");
    expect(paletteSource).toContain("Global Edge Latency Radar");
    expect(paletteSource).toContain("/lab#postgres-planner");
    expect(paletteSource).toContain("PostgreSQL EXPLAIN Simulator");
    expect(paletteSource).toContain("/lab#topology-explorer");
    expect(paletteSource).toContain("Streaming Topology");
    expect(paletteSource).toContain("/pricing#sow-builder");
    expect(paletteSource).toContain("Statement of Work (SOW) Builder");
    expect(paletteSource).toContain("/status");
    expect(paletteSource).toContain("Live Systems Status &amp; Edge PoP Health");
  });

  it("indexes verified academic credentials and formal certifications", () => {
    expect(paletteSource).toContain("Verified Accreditations & Credentials");
    expect(paletteSource).toContain("Programming Hero Certificate of Excellence");
    expect(paletteSource).toContain("WEB12-3991");
    expect(paletteSource).toContain("Bachelor of Science in Computer Science");
    expect(paletteSource).toContain("freeCodeCamp Certified");
  });

  it("indexes quick executive actions (email copy, LinkedIn copy, ATS PDF)", () => {
    expect(paletteSource).toContain("Quick Actions & Direct Contact");
    expect(paletteSource).toContain("abuhanifmain@gmail.com");
    expect(paletteSource).toContain("linkedin.com/in/abuhanif254");
    expect(paletteSource).toContain("/pricing#inquiry");
    expect(paletteSource).toContain("/resume");
  });

  it("indexes all production projects, blog articles, services, and topic category pillars", () => {
    // Projects mapped
    expect(paletteSource).toContain("initialProjects.map");
    // Topic Pillars mapped
    expect(paletteSource).toContain("blogCategoryPillars.map");
    // Blog Posts mapped
    expect(paletteSource).toContain("initialBlogPosts.map");
    // Services mapped
    expect(paletteSource).toContain("initialServices.map");

    expect(initialProjects.length).toBeGreaterThanOrEqual(6);
    expect(blogCategoryPillars.length).toBeGreaterThanOrEqual(6);
    expect(initialBlogPosts.length).toBeGreaterThanOrEqual(4);
    expect(initialServices.length).toBeGreaterThanOrEqual(6);
  });
});
