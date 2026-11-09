import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPosts } from "../../lib/portfolio-store";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import BlogCodeBlock from "../../components/blog-code-block";
import BlogTableOfContents from "../../components/blog-toc";
import BlogSocialShare from "../../components/blog-social-share";
import BlogEcosystemCard from "../../components/blog-ecosystem-card";
import { blogCategoryPillars } from "../../data/blog-categories";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | Abu Hanif" };
  }

  // Ensure title with template suffix (| Abu Hanif) remains strictly <= 90 chars for optimal SERP display
  const title =
    post.slug === "nextjs-300-tools-platform-architecture-seo"
      ? "How I Built a 300+ Tool Platform with Next.js"
      : post.title === "Architecting Next.js 16 Applications for Cloudflare Pages: Lessons from Production"
      ? "Architecting Next.js 16 for Cloudflare Pages: Production Lessons"
      : post.title.length + 12 > 88
      ? `${post.title.slice(0, 85 - 12)}...`
      : post.title;

  return {
    title,
    description: post.excerpt,
    keywords: [
      post.title,
      ...post.tags,
      "Software Architecture",
      "Staff Software Engineer",
      "Abu Hanif",
      "MD Abu Hanif Mia",
    ],
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      tags: post.tags,
      images: post.coverImageUrl ? [`${siteUrl}${post.coverImageUrl}`] : [`${siteUrl}/images/og-card.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@MohammadBitull1",
      images: post.coverImageUrl ? [`${siteUrl}${post.coverImageUrl}`] : [`${siteUrl}/images/og-card.png`],
    },
  };
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const tokenRegex = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("![") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (match) {
        const [, alt, src] = match;
        return (
          <img
            key={i}
            src={src}
            alt={alt}
            width={800}
            height={450}
            className="blog-inline-img"
            loading="lazy"
          />
        );
      }
    }
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, url] = match;
        const isExternal = url.startsWith("http");
        return (
          <a
            key={i}
            href={url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {label}
          </a>
        );
      }
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**") && part.length >= 2) {
      return (
        <em key={i}>
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={i}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  // Extract table of contents from markdown headings (lines starting with ## or ###)
  const headings: { title: string; id: string; level: number }[] = [];
  const lines = post.contentMarkdown.split("\n");
  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      const text = line.replace("## ", "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      headings.push({ title: text, id, level: 2 });
    } else if (line.startsWith("### ")) {
      const text = line.replace("### ", "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      headings.push({ title: text, id, level: 3 });
    }
  });

  // Render markdown chunks with code blocks, headings, blockquotes, and lists
  function renderMarkdownContent(content: string) {
    const normalizedContent = (content || "")
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n");
    const rawChunks = normalizedContent.split("```");
    const elements: React.ReactNode[] = [];

    rawChunks.forEach((chunk, index) => {
      if (index % 2 === 1) {
        // Code Block
        const firstLineBreak = chunk.indexOf("\n");
        const language = firstLineBreak !== -1 ? chunk.substring(0, firstLineBreak).trim() : "";
        const code = firstLineBreak !== -1 ? chunk.substring(firstLineBreak + 1) : chunk;

        elements.push(
          <BlogCodeBlock
            key={`code-${index}`}
            language={language}
            code={code}
          />
        );
      } else {
        // Text Markdown
        const paragraphs = chunk.split(/\n\s*\n/);
        paragraphs.forEach((p, pIdx) => {
          const trimmed = p.trim();
          if (!trimmed) return;

          if (trimmed.startsWith("## ")) {
            const headingText = trimmed.replace("## ", "").trim();
            const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            elements.push(
              <h2 key={`h2-${index}-${pIdx}`} id={id}>
                <span>{headingText}</span>
                <a
                  href={`#${id}`}
                  className="heading-anchor"
                  title="Permanent link to this section"
                >
                  #
                </a>
              </h2>
            );
          } else if (trimmed.startsWith("### ")) {
            const headingText = trimmed.replace("### ", "").trim();
            const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            elements.push(
              <h3 key={`h3-${index}-${pIdx}`} id={id}>
                <span>{headingText}</span>
                <a
                  href={`#${id}`}
                  className="heading-anchor"
                  title="Permanent link to this subsection"
                >
                  #
                </a>
              </h3>
            );
          } else if (trimmed.startsWith("![")) {
            const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
            if (lines.length > 0 && lines[0].startsWith("![") && lines[0].includes("](") && lines[0].endsWith(")")) {
              const imgMatch = lines[0].match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
              if (imgMatch) {
                const [, alt, src] = imgMatch;
                const captionLine = lines.slice(1).join(" ").replace(/^\*|\*$/g, "").trim();
                elements.push(
                  <figure key={`img-${index}-${pIdx}`} className="blog-figure">
                    <img src={src} alt={alt} width={1200} height={675} loading="lazy" />
                    {captionLine ? <figcaption className="figure-caption">{captionLine}</figcaption> : null}
                  </figure>
                );
              } else {
                elements.push(
                  <p key={`p-${index}-${pIdx}`}>{renderInlineMarkdown(trimmed)}</p>
                );
              }
            } else {
              elements.push(
                <p key={`p-${index}-${pIdx}`}>{renderInlineMarkdown(trimmed)}</p>
              );
            }
          } else if (trimmed.startsWith("*Figure ") || trimmed.startsWith("*Caption: ")) {
            elements.push(
              <p key={`caption-${index}-${pIdx}`} className="figure-caption">
                {trimmed.replace(/^\*|\*$/g, "")}
              </p>
            );
          } else if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
            const tableRows = trimmed.split("\n").filter((r) => r.trim().startsWith("|"));
            if (tableRows.length >= 2) {
              const parseCells = (row: string) =>
                row.split("|").slice(1, -1).map((c) => c.trim());
              const headerCells = parseCells(tableRows[0]);
              const bodyRows = tableRows.slice(2).map(parseCells);
              elements.push(
                <div key={`table-${index}-${pIdx}`} className="blog-table-container">
                  <table>
                    <thead>
                      <tr>
                        {headerCells.map((th, thIdx) => (
                          <th key={thIdx}>{renderInlineMarkdown(th)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bodyRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((td, tdIdx) => (
                            <td key={tdIdx}>{renderInlineMarkdown(td)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          } else if (trimmed.startsWith("> ")) {
            const quoteText = trimmed.replace(/^> /gm, "");
            elements.push(
              <blockquote key={`quote-${index}-${pIdx}`}>
                {renderInlineMarkdown(quoteText)}
              </blockquote>
            );
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const items = trimmed.split("\n").map((item) => item.replace(/^[-*] /, "").trim());
            elements.push(
              <ul key={`ul-${index}-${pIdx}`}>
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInlineMarkdown(item)}</li>
                ))}
              </ul>
            );
          } else if (/^\d+\. /.test(trimmed)) {
            const items = trimmed.split("\n").map((item) => item.replace(/^\d+\. /, "").trim());
            elements.push(
              <ol key={`ol-${index}-${pIdx}`}>
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInlineMarkdown(item)}</li>
                ))}
              </ol>
            );
          } else {
            // Regular paragraph with inline formatting
            elements.push(
              <p key={`p-${index}-${pIdx}`}>
                {renderInlineMarkdown(trimmed)}
              </p>
            );
          }
        });
      }
    });

    return elements;
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ? [`${siteUrl}${post.coverImageUrl}`] : [`${siteUrl}/images/og-card.png`],
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      alternateName: ["Abu Hanif", "md abu hanif mia"],
      url: siteUrl,
      jobTitle: "Staff Software Engineer & Systems Architect",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sadar Upazila",
        addressLocality: "Kishoreganj",
        addressRegion: "Dhaka",
        addressCountry: "Bangladesh",
      },
      sameAs: [
        "https://github.com/abuhanif254",
        "https://www.linkedin.com/in/md-abu-hanif-mia",
        "https://x.com/MohammadBitull1",
        "https://www.facebook.com/bitulla",
        "https://www.instagram.com/bitullah_aj",
      ],
    },
    publisher: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/abuhanif-logo-v3.svg`,
      },
    },
    keywords: post.tags.join(", "),
    articleSection: post.tags[0] || "Software Engineering",
  };

  const matchingPillar =
    blogCategoryPillars.find((p) =>
      p.matchingTags.some((mt) => post.tags.some((t) => t.toLowerCase() === mt.toLowerCase()))
    ) || blogCategoryPillars[0];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
      {
        "@type": "ListItem",
        position: 3,
        name: matchingPillar.name,
        item: `${siteUrl}/blog/category/${matchingPillar.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div id="source-page-root" data-source-path={`/blog/${post.slug}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div id="source-page-body" className="source-page-body js l2 section_83 abuhanif-portfolio-shell">
        <SiteHeader activePath="/blog" />

        <div className="index" id="container">
          <div className="cwrap">

            {/* Main Content */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                          <Link href={`/blog/category/${matchingPillar.slug}`} style={{ color: "#38bdf8", textDecoration: "none" }}>
                            {matchingPillar.name}
                          </Link>
                        </div>
                        <h1 style={{ margin: 0, fontSize: "26px", lineHeight: "1.3" }}>
                          {post.title}
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          Published on {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • {post.readingTimeMinutes} min read • By MD Abu Hanif Mia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tcfrags"></div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <Link href="/" style={{ color: "#2563eb" }}>Home</Link> &gt; <Link href="/blog" style={{ color: "#2563eb" }}>Technical Blog</Link> &gt; <Link href={`/blog/category/${matchingPillar.slug}`} style={{ color: "#2563eb" }}>{matchingPillar.name}</Link> &gt; <span>{post.title}</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      {/* Article Header Metadata Strip */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "12px", color: "#64748b" }}>
                          <strong style={{ color: "#0f172a" }}>
                            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </strong>
                          <span>•</span>
                          <span style={{ color: "#047857", fontWeight: "700" }}>⏱ {post.readingTimeMinutes} min read</span>
                          <span>•</span>
                          <span>Author: <strong>MD Abu Hanif Mia</strong></span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: "11px",
                                fontWeight: "700",
                                backgroundColor: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                color: "#1d4ed8",
                                padding: "2px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 1-Click Social Sharing with UTM tracking */}
                      <BlogSocialShare title={post.title} slug={post.slug} />

                      {/* Blog Feature Image (Direct Hero Rendering) */}
                      {post.coverImageUrl && (
                        <div className="blog-feature-image-hero">
                          <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            width={1200}
                            height={630}
                            className="blog-feature-image-img"
                            loading="eager"
                          />
                        </div>
                      )}

                      {/* Executive Abstract / Key Takeaways Box */}
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #cbd5e1",
                          borderLeft: "4px solid #2563eb",
                          borderRadius: "8px",
                          padding: "20px 24px",
                          marginBottom: "28px",
                        }}
                      >
                        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                          Executive Summary &amp; Core Takeaway
                        </span>
                        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#1e293b", fontWeight: "500" }}>
                          {post.excerpt}
                        </p>
                      </div>

                      {/* In-Article Table of Contents (if 2+ headings) */}
                      {headings.length >= 2 && (
                        <div
                          style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "16px 20px",
                            marginBottom: "28px",
                          }}
                        >
                          <strong style={{ display: "block", fontSize: "13px", color: "#0f172a", marginBottom: "8px", textTransform: "uppercase" }}>
                            Table of Contents
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", lineHeight: "1.8" }}>
                            {headings.map((h, i) => (
                              <li key={i} style={{ marginLeft: h.level === 3 ? "14px" : "0" }}>
                                <a href={`#${h.id}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                                  {h.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Structured Technical Content */}
                      <div className="article-rendered-body blog-prose-content" style={{ marginBottom: "32px" }}>
                        {renderMarkdownContent(post.contentMarkdown)}
                      </div>

                      {/* Connected Architecture Ecosystem: Production Case Study & Systems Lab Simulator */}
                      <BlogEcosystemCard blogSlug={post.slug} />

                      {/* Author Credentials Box */}
                      <div
                        style={{
                          display: "flex",
                          gap: "18px",
                          padding: "24px",
                          backgroundColor: "#0b132b",
                          border: "1px solid #1e293b",
                          color: "#ffffff",
                          borderRadius: "8px",
                          marginBottom: "40px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <img
                          src="/images/profile.png"
                          alt="MD Abu Hanif Mia"
                          width={80}
                          height={80}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "6px",
                            border: "2px solid #2563eb",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: "220px" }}>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff" }}>
                            Written by MD Abu Hanif Mia (Abu Hanif)
                          </div>
                          <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "600", marginBottom: "6px" }}>
                            Staff Software Engineer &amp; Systems Architect
                          </div>
                          <p style={{ margin: 0, fontSize: "12.5px", color: "#cbd5e1", lineHeight: "1.5" }}>
                            9+ years shipping high-throughput distributed backends, Supabase real-time pipelines, and low-latency Next.js applications on Cloudflare Pages.
                          </p>
                        </div>
                      </div>

                      {/* Related Architecture Articles */}
                      {relatedPosts.length > 0 && (
                        <div style={{ marginBottom: "40px" }}>
                          <h3 style={{ fontSize: "18px", color: "#0f172a", borderBottom: "2px solid #2563eb", paddingBottom: "6px", marginBottom: "16px" }}>
                            Related Technical Publications
                          </h3>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                            {relatedPosts.map((rel) => (
                              <div
                                key={rel.id}
                                style={{
                                  padding: "16px",
                                  backgroundColor: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "6px",
                                }}
                              >
                                <span style={{ fontSize: "11px", color: "#64748b" }}>⏱ {rel.readingTimeMinutes} min read</span>
                                <h4 style={{ margin: "6px 0 8px 0", fontSize: "15px", lineHeight: "1.3" }}>
                                  <Link href={`/blog/${rel.slug}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                                    {rel.title}
                                  </Link>
                                </h4>
                                <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", margin: "0 0 10px 0" }}>
                                  {rel.excerpt}
                                </p>
                                <Link href={`/blog/${rel.slug}`} style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb", textDecoration: "none" }}>
                                  Read Article &rsaquo;
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Direct Contextual Technical Consultation CTA */}
                      <div
                        style={{
                          padding: "24px",
                          backgroundColor: "#0b132b",
                          border: "1px solid #1e293b",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      >
                        <div style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                          Targeted Architecture Consultation
                        </div>
                        <h3 style={{ margin: "0 0 8px 0", color: "#ffffff", fontSize: "19px" }}>
                          Need Surgical Engineering on {matchingPillar.name}?
                        </h3>
                        <p style={{ margin: "0 0 16px 0", fontSize: "13.5px", color: "#cbd5e1", lineHeight: "1.6" }}>
                          Book the <strong>{matchingPillar.consultingServiceTitle}</strong> ({matchingPillar.consultingPrice} fixed milestone). Direct 1:1 engagement with Staff Software Engineer Abu Hanif with verified production deliverables and zero budget creep.
                        </p>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <Link
                            href={`/pricing#${matchingPillar.consultingServiceSlug}`}
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#2563eb",
                              color: "#ffffff",
                              textDecoration: "none",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "700",
                              transition: "background-color 0.15s ease",
                            }}
                          >
                            View Milestone Scope ({matchingPillar.consultingPrice}) &rsaquo;
                          </Link>
                          <Link
                            href={`/blog/category/${matchingPillar.slug}`}
                            style={{
                              padding: "10px 18px",
                              backgroundColor: "#111e38",
                              color: "#cbd5e1",
                              border: "1px solid #1e293b",
                              textDecoration: "none",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "700",
                            }}
                          >
                            Explore More {matchingPillar.name} Guides &rsaquo;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Sidebar */}
                <div className="sidebar secondary-sidebar">
                  <div className="wrapper">
                    {/* Dynamic Scroll-Spy Table of Contents */}
                    {headings.length >= 2 && (
                      <BlogTableOfContents headings={headings} />
                    )}

                    {/* Author Snapshot */}
                    <div className="block" style={{ backgroundColor: "#f8fafc", padding: "18px", border: "1px solid #e2e8f0", borderRadius: "8px", marginBottom: "20px" }}>
                      <img
                        src="/images/profile.png"
                        alt="MD Abu Hanif Mia - Staff Software Engineer"
                        width={260}
                        height={260}
                        style={{
                          width: "100%",
                          borderRadius: "6px",
                          marginBottom: "12px",
                          border: "1px solid #cbd5e1",
                          display: "block",
                        }}
                      />
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#0f172a" }}>
                        MD Abu Hanif Mia
                      </h3>
                      <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", marginBottom: "8px" }}>
                        Staff Software Engineer &amp; Systems Architect
                      </div>
                      <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", marginBottom: "10px" }}>
                        • <strong>B.Sc. in CSE</strong> (Formal 4-Year Degree)<br />
                        • <strong>Programming Hero Honor</strong> (Batch-12 • WEB12-3991)<br />
                        • <strong>freeCodeCamp Certified</strong> (JS, TS, Python)<br />
                        • <strong>Rust &amp; Go Concurrency</strong>, Next.js 16, Postgres
                      </div>
                      <Link href="/resume" style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", textDecoration: "underline" }}>
                        View Verified Credentials &rsaquo;
                      </Link>
                    </div>

                    {/* Article Details Widget */}
                    <div className="block" style={{ border: "1px solid #cbd5e1", padding: "16px", borderRadius: "8px", backgroundColor: "#ffffff", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#0f172a", textTransform: "uppercase" }}>
                        Article Metadata
                      </h4>
                      <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
                        <div><strong>Reading Time:</strong> {post.readingTimeMinutes} Minutes</div>
                        <div><strong>Published:</strong> {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                        <div><strong>Category:</strong> {post.tags[0] || "Architecture"}</div>
                        <div><strong>Status:</strong> Peer-Verified Production Code</div>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="block" style={{ border: "1px solid #e2e8f0", padding: "14px", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                      <strong style={{ display: "block", fontSize: "12px", color: "#0f172a", marginBottom: "8px" }}>Navigation:</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                        <Link href="/blog" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                          &lsaquo; Back to All Articles
                        </Link>
                        <Link href="/projects" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Work Showcase &amp; Projects
                        </Link>
                        <Link href="/pricing" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Work Prices &amp; Sprints
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="clr"></div>
              </div>
            </div>

            {/* Global Footer */}
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
