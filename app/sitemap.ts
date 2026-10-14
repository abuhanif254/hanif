import type { MetadataRoute } from "next";
import { sourcePages } from "./lib/source-pages";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.robertjfleming.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return sourcePages.map((page) => ({
    url: `${siteOrigin}${page.path}`,
    lastModified: new Date("2026-10-13"),
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : 0.6,
  }));
}
