import type { MetadataRoute } from "next";
import { initialProjects, initialBlogPosts } from "./data/portfolio-data";

import { blogCategoryPillars } from "./data/blog-categories";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://abuhanifmia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString().split("T")[0];

  // Core static engineering routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteOrigin}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteOrigin}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteOrigin}/pricing`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteOrigin}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteOrigin}/resume`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteOrigin}/lab`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  // Topic Category Pillar routes
  const categoryRoutes: MetadataRoute.Sitemap = blogCategoryPillars.map((cat) => ({
    url: `${siteOrigin}/blog/category/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic project case study routes
  const projectRoutes: MetadataRoute.Sitemap = initialProjects
    .filter((p) => p.published)
    .map((project) => ({
      url: `${siteOrigin}/projects/${project.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    }));

  // Dynamic technical blog article routes
  const blogRoutes: MetadataRoute.Sitemap = initialBlogPosts
    .filter((b) => b.isPublished)
    .map((post) => ({
      url: `${siteOrigin}/blog/${post.slug}`,
      lastModified: post.publishedAt || currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes, ...blogRoutes];
}
