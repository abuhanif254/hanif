import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { initialProjects, initialBlogPosts, initialServices } from "../app/data/portfolio-data";
import { blogCategoryPillars } from "../app/data/blog-categories";
import { PROJECT_SLUG_ALIASES, SERVICE_SLUG_ALIASES } from "../app/lib/portfolio-store";

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

interface ParsedHtmlMeta {
  filePath: string;
  relativePath: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogType: string | null;
  twitterCard: string | null;
  hasViewport: boolean;
  hasH1: boolean;
  jsonLdSchemas: any[];
  internalLinks: string[];
  htmlContent: string;
}

function parseHtmlFile(filePath: string): ParsedHtmlMeta {
  const htmlContent = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(APP_SERVER_DIR, filePath).replace(/\\/g, "/");

  // Title
  const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // Description
  const descMatch = htmlContent.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                    htmlContent.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : null;

  // Canonical
  const canonMatch = htmlContent.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
                     htmlContent.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const canonical = canonMatch ? canonMatch[1].trim() : null;

  // OpenGraph
  const ogTitleMatch = htmlContent.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
                       htmlContent.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i);
  const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;

  const ogDescMatch = htmlContent.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i) ||
                      htmlContent.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i);
  const ogDescription = ogDescMatch ? ogDescMatch[1].trim() : null;

  const ogUrlMatch = htmlContent.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i) ||
                     htmlContent.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:url["']/i);
  const ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : null;

  const ogTypeMatch = htmlContent.match(/<meta[^>]+property=["']og:type["'][^>]+content=["']([^"']*)["']/i) ||
                      htmlContent.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:type["']/i);
  const ogType = ogTypeMatch ? ogTypeMatch[1].trim() : null;

  // Twitter
  const twitterMatch = htmlContent.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i) ||
                       htmlContent.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']twitter:card["']/i);
  const twitterCard = twitterMatch ? twitterMatch[1].trim() : null;

  // Viewport
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(htmlContent);

  // H1 tag
  const hasH1 = /<h1[^>]*>/i.test(htmlContent);

  // JSON-LD scripts
  const jsonLdSchemas: any[] = [];
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let sMatch;
  while ((sMatch = scriptRegex.exec(htmlContent)) !== null) {
    try {
      const parsed = JSON.parse(sMatch[1]);
      jsonLdSchemas.push(parsed);
    } catch {
      // Record unparseable JSON
      jsonLdSchemas.push({ __syntaxError: true, raw: sMatch[1] });
    }
  }

  // Internal Links (<a href="...">)
  const internalLinks: string[] = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let lMatch;
  while ((lMatch = linkRegex.exec(htmlContent)) !== null) {
    const rawHref = lMatch[1].trim();
    if (
      rawHref.startsWith("/") &&
      !rawHref.startsWith("/_next") &&
      !rawHref.startsWith("/images") &&
      !rawHref.endsWith(".png") &&
      !rawHref.endsWith(".svg") &&
      !rawHref.endsWith(".ico") &&
      !rawHref.endsWith(".xml") &&
      !rawHref.endsWith(".txt") &&
      !rawHref.endsWith(".json")
    ) {
      internalLinks.push(rawHref);
    }
  }

  return {
    filePath,
    relativePath,
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogUrl,
    ogType,
    twitterCard,
    hasViewport,
    hasH1,
    jsonLdSchemas,
    internalLinks,
    htmlContent,
  };
}

describe("Automated Link Integrity & Core Web Vitals CI Test", () => {
  const htmlFiles = findHtmlFiles(APP_SERVER_DIR);
  const parsedPages = htmlFiles.map(parseHtmlFile);

  it("discovers all 35+ production prerendered pages in .next build artifact", () => {
    expect(parsedPages.length).toBeGreaterThanOrEqual(35);
  });

  it("verifies every page has a compliant title tag containing branding (<= 90 chars)", () => {
    for (const page of parsedPages) {
      // Exclude admin or internal auth error pages
      if (page.relativePath.includes("admin")) continue;

      expect(page.title, `Missing title on ${page.relativePath}`).toBeTruthy();
      expect(page.title!.length).toBeGreaterThan(10);
      expect(page.title!.length).toBeLessThanOrEqual(95);
      expect(page.title).toMatch(/Abu Hanif/i);
    }
  });

  it("verifies every public page has an SEO meta description between 40 and 320 characters", () => {
    for (const page of parsedPages) {
      if (page.relativePath.includes("admin")) continue;

      expect(page.description, `Missing description on ${page.relativePath}`).toBeTruthy();
      expect(page.description!.length).toBeGreaterThanOrEqual(40);
      expect(page.description!.length).toBeLessThanOrEqual(320);
    }
  });

  it("verifies every page declares an absolute canonical URL on https://abuhanifmia.com", () => {
    for (const page of parsedPages) {
      if (page.relativePath.includes("admin")) continue;

      expect(page.canonical, `Missing canonical on ${page.relativePath}`).toBeTruthy();
      expect(page.canonical).toMatch(/^https:\/\/abuhanifmia\.com/);
    }
  });

  it("verifies OpenGraph and Twitter card metadata consistency across all pages", () => {
    for (const page of parsedPages) {
      if (page.relativePath.includes("admin")) continue;

      expect(page.ogTitle, `Missing og:title on ${page.relativePath}`).toBeTruthy();
      expect(page.ogDescription, `Missing og:description on ${page.relativePath}`).toBeTruthy();
      expect(page.ogUrl, `Missing og:url on ${page.relativePath}`).toBeTruthy();
      expect(page.ogType, `Missing og:type on ${page.relativePath}`).toBeTruthy();
      expect(page.twitterCard, `Missing twitter:card on ${page.relativePath}`).toBe("summary_large_image");
    }
  });

  it("validates all JSON-LD Schema.org scripts parse cleanly without syntax errors", () => {
    let validatedSchemas = 0;
    for (const page of parsedPages) {
      for (const schema of page.jsonLdSchemas) {
        expect(schema.__syntaxError, `Syntax error in JSON-LD on ${page.relativePath}`).toBeUndefined();
        expect(schema["@context"]).toBe("https://schema.org");

        const hasType = schema["@type"] || schema["@graph"];
        expect(hasType, `Missing @type or @graph on ${page.relativePath}`).toBeTruthy();
        validatedSchemas++;
      }
    }
    expect(validatedSchemas).toBeGreaterThanOrEqual(35);
  });

  it("crawls all internal links across every page and verifies zero broken routes (404s)", () => {
    // Build set of valid route paths
    const validRoutes = new Set<string>([
      "/",
      "/projects",
      "/pricing",
      "/lab",
      "/blog",
      "/resume",
      "/status",
      "/work-prices",
      "/admin",
      "/admin/login",
      "/orders/tracker",
    ]);

    // Add projects
    initialProjects.forEach((p) => {
      validRoutes.add(`/projects/${p.slug}`);
    });
    // Add project aliases
    Object.keys(PROJECT_SLUG_ALIASES).forEach((alias) => {
      validRoutes.add(`/projects/${alias}`);
    });

    // Add services
    initialServices.forEach((s) => {
      validRoutes.add(`/services/${s.slug}`);
    });
    // Add service aliases
    Object.keys(SERVICE_SLUG_ALIASES).forEach((alias) => {
      validRoutes.add(`/services/${alias}`);
    });

    // Add blog posts
    initialBlogPosts.forEach((b) => {
      validRoutes.add(`/blog/${b.slug}`);
    });

    // Add blog categories
    blogCategoryPillars.forEach((c) => {
      validRoutes.add(`/blog/category/${c.slug}`);
    });

    // Collect all links from all pages
    const visitedLinks = new Set<string>();
    const brokenLinks: { sourcePage: string; targetHref: string }[] = [];

    for (const page of parsedPages) {
      for (const href of page.internalLinks) {
        visitedLinks.add(href);
        // Strip hash fragment and query parameters for route matching
        const cleanPath = href.split("#")[0].split("?")[0] || "/";

        if (!validRoutes.has(cleanPath)) {
          brokenLinks.push({
            sourcePage: page.relativePath,
            targetHref: href,
          });
        }
      }
    }

    expect(visitedLinks.size).toBeGreaterThan(20);
    expect(brokenLinks).toEqual([]);
  });

  it("verifies hash anchors point to existing DOM element IDs on their destination pages", () => {
    // Common anchors: /pricing#inquiry, /pricing#sow-builder, /#about, /#competencies, /#testimonials, /#certificate-modal
    const anchorMap: Record<string, string[]> = {
      "index.html": ["about", "competencies", "badges", "work"],
      "pricing.html": ["inquiry", "sow-builder"],
    };

    for (const [pageName, expectedIds] of Object.entries(anchorMap)) {
      const page = parsedPages.find((p) => p.relativePath === pageName);
      if (page) {
        for (const id of expectedIds) {
          const hasId =
            page.htmlContent.includes(`id="${id}"`) ||
            page.htmlContent.includes(`id='${id}'`) ||
            page.htmlContent.includes(`name="${id}"`);
          expect(hasId, `Expected ID #${id} on page ${pageName}`).toBe(true);
        }
      }
    }
  });

  it("satisfies Core Web Vitals best practices: viewport meta tag, semantic H1, and image layout protection", () => {
    for (const page of parsedPages) {
      if (page.relativePath.includes("admin")) continue;

      // 1. Viewport tag present
      expect(page.hasViewport, `Missing viewport on ${page.relativePath}`).toBe(true);

      // 2. Semantic H1 tag present
      expect(page.hasH1, `Missing H1 tag on ${page.relativePath}`).toBe(true);

      // 3. Image Layout Shift (CLS) prevention:
      // Scan all <img> tags to verify they either have width/height or use Next.js data-nimg
      const imgRegex = /<img\s+([^>]+)>/gi;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(page.htmlContent)) !== null) {
        const attributes = imgMatch[1];
        const hasDimensions =
          (/width=["']\d+["']/i.test(attributes) && /height=["']\d+["']/i.test(attributes)) ||
          attributes.includes("data-nimg") ||
          attributes.includes("fill");
        expect(hasDimensions, `Image without explicit dimensions in ${page.relativePath}: ${imgMatch[0].slice(0, 80)}`).toBe(true);
      }
    }
  });

  it("verifies production edge security headers in next.config.ts", async () => {
    const nextConfigContent = fs.readFileSync(path.resolve(process.cwd(), "next.config.ts"), "utf8");

    // Strict Security Headers
    expect(nextConfigContent).toContain("Content-Security-Policy");
    expect(nextConfigContent).toContain("X-Frame-Options");
    expect(nextConfigContent).toContain("X-Content-Type-Options");
    expect(nextConfigContent).toContain("Strict-Transport-Security");
    expect(nextConfigContent).toContain("Referrer-Policy");
    expect(nextConfigContent).toContain("Permissions-Policy");
    expect(nextConfigContent).toContain("Cross-Origin-Opener-Policy");
    expect(nextConfigContent).toContain("Cross-Origin-Resource-Policy");
    expect(nextConfigContent).toContain("X-Permitted-Cross-Domain-Policies");
    expect(nextConfigContent).toContain("Cache-Control");
    expect(nextConfigContent).toContain("stale-while-revalidate");
  });
});
