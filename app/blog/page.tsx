import type { Metadata } from "next";
import BlogClientView from "./blog-client-view";
import { getBlogPosts } from "../lib/portfolio-store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Technical Architecture Blog | Abu Hanif (MD Abu Hanif Mia)",
  description:
    "In-depth engineering articles on Next.js 16 App Router, PostgreSQL CDC, Cloudflare edge networks, distributed telemetry pipelines, and database optimization.",
  keywords: [
    "Software Architecture Blog",
    "Next.js 16 Architecture",
    "PostgreSQL Performance Tuning",
    "Cloudflare Pages Workers",
    "Supabase CDC Realtime",
    "Distributed Systems Engineering",
    "Staff Software Engineer Blog",
    "Abu Hanif",
    "MD Abu Hanif Mia",
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Technical Architecture Blog | Abu Hanif",
    description:
      "Deep dives into high-throughput systems, Next.js 16, PostgreSQL optimization, and cloud architecture.",
    url: `${siteUrl}/blog`,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Architecture Blog | Abu Hanif",
    description:
      "Deep dives into high-throughput systems, Next.js 16, PostgreSQL optimization, and cloud architecture.",
    creator: "@abuhanif",
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${siteUrl}/blog#blog`,
        url: `${siteUrl}/blog`,
        name: "Abu Hanif Technical Engineering Blog",
        description:
          "Technical write-ups and architectural deep dives by Staff Software Engineer MD Abu Hanif Mia.",
        publisher: {
          "@type": "Person",
          name: "MD Abu Hanif Mia",
          url: siteUrl,
        },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          url: `${siteUrl}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          author: {
            "@type": "Person",
            name: "MD Abu Hanif Mia",
            url: siteUrl,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Technical Blog",
            item: `${siteUrl}/blog`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogClientView posts={posts} />
    </>
  );
}
