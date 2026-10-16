import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogCategoryPillars, getCategoryPillarBySlug } from "../../../data/blog-categories";
import { initialBlogPosts } from "../../../data/portfolio-data";
import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanif.dev";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return blogCategoryPillars.map((p) => ({
    category: p.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const pillar = getCategoryPillarBySlug(category);

  if (!pillar) {
    return { title: "Topic Category Not Found | Abu Hanif" };
  }

  return {
    title: `${pillar.name} — Technical Architecture Articles | Abu Hanif`,
    description: pillar.description,
    keywords: [
      ...pillar.keywords,
      "Abu Hanif Blog",
      "MD Abu Hanif Mia",
      "Staff Software Engineer",
      "Software Architecture Articles",
    ],
    alternates: {
      canonical: `${siteUrl}/blog/category/${pillar.slug}`,
    },
    openGraph: {
      title: `${pillar.name} | Abu Hanif Technical Blog`,
      description: pillar.description,
      url: `${siteUrl}/blog/category/${pillar.slug}`,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pillar.name} | Abu Hanif Technical Blog`,
      description: pillar.description,
      creator: "@abuhanif",
    },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const pillar = getCategoryPillarBySlug(category);

  if (!pillar) {
    notFound();
  }

  // Filter posts matching this category pillar
  const matchingPosts = initialBlogPosts.filter((post) => {
    if (!post.isPublished) return false;
    return post.tags.some((tag) =>
      pillar.matchingTags.some((mt) => mt.toLowerCase() === tag.toLowerCase())
    );
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${pillar.name} Articles`,
    description: pillar.description,
    url: `${siteUrl}/blog/category/${pillar.slug}`,
    publisher: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      url: siteUrl,
      jobTitle: "Staff Software Engineer & Systems Architect",
    },
    hasPart: matchingPosts.map((post) => ({
      "@type": "TechArticle",
      headline: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  };

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
        name: pillar.name,
        item: `${siteUrl}/blog/category/${pillar.slug}`,
      },
    ],
  };

  return (
    <div id="source-page-root" data-source-path={`/blog/category/${pillar.slug}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div id="source-page-body" className="source-page-body js l2 section_10 justia-robertjfleming-com">
        <SiteHeader activePath="/blog" />

        <div className="index" id="container">
          <div className="cwrap">
            {/* Main Content Area */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#9CBE41", fontWeight: "700", marginBottom: "4px" }}>
                          Topic Pillar &bull; Technical Publication Archive
                        </div>
                        <h1 style={{ margin: 0, fontSize: "28px", lineHeight: "1.3", color: "#ffffff" }}>
                          {pillar.name}
                        </h1>
                        <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#cbd5e1" }}>
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contentwrap">
                  <div id="content">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" style={{ fontSize: "12px", color: "#64748b", margin: "16px 0 20px 0" }}>
                      <Link href="/" style={{ color: "#053056", textDecoration: "none" }}>Home</Link>
                      {" "}&rsaquo;{" "}
                      <Link href="/blog" style={{ color: "#053056", textDecoration: "none" }}>Technical Blog</Link>
                      {" "}&rsaquo;{" "}
                      <span style={{ color: "#334155", fontWeight: "bold" }}>{pillar.name}</span>
                    </nav>

                    {/* Topic Pillar Overview Brief */}
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderLeft: "4px solid #9CBE41",
                        padding: "18px 22px",
                        borderRadius: "4px",
                        marginBottom: "28px",
                      }}
                    >
                      <h2 style={{ fontSize: "16px", color: "#053056", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Architectural Focus: {pillar.name}
                      </h2>
                      <p style={{ margin: 0, fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
                        {pillar.description}
                      </p>
                    </div>

                    {/* Published Articles Stream */}
                    <div style={{ borderBottom: "2px solid #053056", paddingBottom: "6px", marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "18px", color: "#053056", margin: 0 }}>
                        Published Publications ({matchingPosts.length})
                      </h3>
                    </div>

                    {matchingPosts.length === 0 ? (
                      <div style={{ padding: "30px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                          New deep-dive case studies for <strong>{pillar.name}</strong> are currently being drafted. Explore related articles in the main archive.
                        </p>
                        <Link href="/blog" className="btn" style={{ display: "inline-block", marginTop: "14px", fontSize: "13px" }}>
                          &larr; Return to All Articles
                        </Link>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "36px" }}>
                        {matchingPosts.map((post) => (
                          <article
                            key={post.id}
                            style={{
                              border: "1px solid #e2e8f0",
                              borderRadius: "4px",
                              backgroundColor: "#ffffff",
                              padding: "20px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {post.tags.map((t) => (
                                  <span
                                    key={t}
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: "700",
                                      color: "#053056",
                                      backgroundColor: "#f1f5f9",
                                      padding: "2px 8px",
                                      borderRadius: "3px",
                                      border: "1px solid #cbd5e1",
                                    }}
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                              <span style={{ fontSize: "12px", color: "#64748b" }}>
                                {post.readingTimeMinutes} min read &bull; {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>

                            <h4 style={{ margin: "0 0 10px 0", fontSize: "19px", lineHeight: "1.4" }}>
                              <Link
                                href={`/blog/${post.slug}`}
                                style={{ color: "#053056", textDecoration: "none" }}
                              >
                                {post.title}
                              </Link>
                            </h4>

                            <p style={{ margin: "0 0 14px 0", fontSize: "13.5px", color: "#475569", lineHeight: "1.6" }}>
                              {post.excerpt}
                            </p>

                            <Link
                              href={`/blog/${post.slug}`}
                              style={{
                                color: "#053056",
                                fontSize: "13px",
                                fontWeight: "700",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              Read Full Architecture Case Study &rsaquo;
                            </Link>
                          </article>
                        ))}
                      </div>
                    )}

                    {/* Contextual Consulting CTA Box */}
                    <div
                      style={{
                        backgroundColor: "#053056",
                        color: "#ffffff",
                        padding: "24px",
                        borderRadius: "6px",
                        marginBottom: "36px",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "#9CBE41", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                        Targeted Engineering Sprint Available
                      </div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "19px", color: "#ffffff" }}>
                        Need Hands-On {pillar.name} Support?
                      </h3>
                      <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#cbd5e1", lineHeight: "1.6" }}>
                        Book the <strong>{pillar.consultingServiceTitle}</strong> ({pillar.consultingPrice} fixed milestone). Direct 1:1 engagement with Staff Software Engineer Abu Hanif with verified production deliverables and zero budget creep.
                      </p>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <Link
                          href={`/pricing#${pillar.consultingServiceSlug}`}
                          style={{
                            backgroundColor: "#9CBE41",
                            color: "#041f36",
                            padding: "9px 18px",
                            borderRadius: "3px",
                            fontWeight: "800",
                            fontSize: "13px",
                            textDecoration: "none",
                          }}
                        >
                          View Sprint Scope &amp; Pricing &rsaquo;
                        </Link>
                        <Link
                          href="/blog"
                          style={{
                            backgroundColor: "#042442",
                            color: "#cbd5e1",
                            padding: "9px 16px",
                            borderRadius: "3px",
                            fontWeight: "600",
                            fontSize: "13px",
                            textDecoration: "none",
                            border: "1px solid #0a365c",
                          }}
                        >
                          &larr; Browse All Topics
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Sidebar */}
                  <aside className="sidebar secondary-sidebar">
                    {/* Other Topic Pillars */}
                    <div className="block" style={{ marginBottom: "24px" }}>
                      <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056", borderBottom: "2px solid #9CBE41", paddingBottom: "6px", margin: "0 0 12px 0" }}>
                        Topic Pillars
                      </h4>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13px" }}>
                        {blogCategoryPillars.map((cat) => {
                          const isCurrent = cat.slug === pillar.slug;
                          return (
                            <li key={cat.slug} style={{ padding: "6px 0", borderBottom: "1px dotted #e2e8f0" }}>
                              <Link
                                href={`/blog/category/${cat.slug}`}
                                style={{
                                  color: isCurrent ? "#9CBE41" : "#053056",
                                  fontWeight: isCurrent ? "800" : "600",
                                  textDecoration: "none",
                                }}
                              >
                                {isCurrent ? "&bull; " : "&rsaquo; "}
                                {cat.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Author Snapshot */}
                    <div className="block" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "4px", marginBottom: "24px" }}>
                      <h4 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056", margin: "0 0 8px 0" }}>
                        Author Authority
                      </h4>
                      <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
                        <strong>MD Abu Hanif Mia</strong><br />
                        Staff Software Engineer &amp; Systems Architect.<br />
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          B.Sc. in CSE &bull; Programming Hero Honor (Batch-12 &bull; WEB12-3991) &bull; freeCodeCamp Certified &bull; Rust &amp; Go.
                        </span>
                      </div>
                      <Link href="/resume" style={{ display: "inline-block", marginTop: "10px", fontSize: "12px", color: "#053056", fontWeight: "700" }}>
                        View Full Resume &amp; Credentials &rsaquo;
                      </Link>
                    </div>

                    {/* Feed Syndication Link */}
                    <div className="block" style={{ border: "1px solid #e2e8f0", padding: "14px", borderRadius: "4px", textAlign: "center" }}>
                      <span style={{ fontSize: "16px" }}>📡</span>
                      <strong style={{ display: "block", fontSize: "12px", color: "#053056", margin: "4px 0" }}>
                        Subscribe via RSS Feed
                      </strong>
                      <p style={{ margin: "0 0 10px 0", fontSize: "11.5px", color: "#64748b" }}>
                        Add to your favorite reader (Feedly, NetNewsWire, Miniflux).
                      </p>
                      <a
                        href="/feed.xml"
                        target="_blank"
                        rel="alternate"
                        type="application/rss+xml"
                        style={{
                          display: "inline-block",
                          backgroundColor: "#f97316",
                          color: "#ffffff",
                          padding: "5px 12px",
                          borderRadius: "3px",
                          fontSize: "11.5px",
                          fontWeight: "700",
                          textDecoration: "none",
                        }}
                      >
                        Copy /feed.xml
                      </a>
                    </div>
                  </aside>
                  <div className="clr"></div>
                </div>
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
