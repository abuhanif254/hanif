import { initialBlogPosts } from "../data/portfolio-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanif.dev";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const publishedPosts = initialBlogPosts.filter((post) => post.isPublished);

  const itemsXml = publishedPosts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt || Date.now()).toUTCString();
      const categoriesXml = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>contact@abuhanif.dev (MD Abu Hanif Mia)</author>
      ${categoriesXml}
    </item>`;
    })
    .join("");

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Abu Hanif Technical Engineering Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Technical write-ups, distributed systems architecture, Next.js 16, and PostgreSQL optimization by Staff Software Engineer MD Abu Hanif Mia.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`.trim();

  return new Response(rssFeedXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
