import type { MetadataRoute } from "next";
import {
  getProjects,
  getBlogPosts,
  getServices,
  PROJECT_SLUG_ALIASES,
  SERVICE_SLUG_ALIASES,
} from "./lib/portfolio-store";
import { blogCategoryPillars } from "./data/blog-categories";

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://abuhanifmia.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];

  // Core static engineering routes (only indexable 200-OK public URLs)
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
      url: `${siteOrigin}/services`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.95,
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
    {
      url: `${siteOrigin}/status`,
      lastModified: currentDate,
      changeFrequency: "daily",
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

  // Fetch dynamic projects from unified store (exclude aliases and drafts)
  const allProjects = await getProjects();
  const projectRoutes: MetadataRoute.Sitemap = allProjects
    .filter((p) => p.published && !PROJECT_SLUG_ALIASES[p.slug])
    .map((project) => ({
      url: `${siteOrigin}/projects/${project.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    }));

  // Fetch dynamic blog posts from unified store (ensure valid past/present ISO timestamp)
  const allPosts = await getBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = allPosts
    .filter((b) => b.isPublished)
    .map((post) => {
      let postLastMod = currentDate;
      if (post.publishedAt) {
        const parsed = new Date(post.publishedAt);
        if (!isNaN(parsed.getTime()) && parsed <= now) {
          postLastMod = parsed.toISOString().split("T")[0];
        }
      }
      return {
        url: `${siteOrigin}/blog/${post.slug}`,
        lastModified: postLastMod,
        changeFrequency: "monthly",
        priority: 0.8,
      };
    });

  // Fetch dynamic services from unified store (exclude aliases and inactive)
  const allServices = await getServices();
  const serviceRoutes: MetadataRoute.Sitemap = allServices
    .filter((s) => s.isActive && !SERVICE_SLUG_ALIASES[s.slug])
    .map((service) => ({
      url: `${siteOrigin}/services/${service.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.88,
    }));

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes, ...blogRoutes, ...serviceRoutes];
}
