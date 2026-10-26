"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialBlogPosts, BlogPost } from "../data/portfolio-data";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export default function BlogClientView({
  posts: propPosts,
}: {
  posts?: BlogPost[];
} = {}) {
  const posts = propPosts && propPosts.length > 0 ? propPosts : initialBlogPosts;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const categories = [
    "All",
    "PostgreSQL",
    "Next.js",
    "Cloudflare",
    "Architecture",
    "Performance",
    "System Design",
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === "All" ||
      post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const featuredPost = posts[0];

  return (
    <div id="source-page-root" data-source-path="/blog">
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
                        <h1 style={{ margin: 0, fontSize: "28px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Technical Architecture &amp; Systems Blog
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          Distributed Systems • PostgreSQL Optimization • Edge Performance • Real Engineering Case Studies
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tcfrags"></div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <a href="/">Home</a> &gt; <span>Technical Blog</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      <h2>Production Architectures, Engineering Decisions &amp; Benchmarks</h2>
                      <p>
                        Welcome to the personal technical publication of <strong>Abu Hanif (MD Abu Hanif Mia)</strong>, Staff Software Engineer &amp; Systems Architect. Here I document deep-dive engineering explorations, database query plan analyses, low-latency edge deployments, and architectural trade-offs learned shipping high-throughput production systems.
                      </p>

                      {/* Category Filter Pills Strip */}
                      <div
                        className="scrollbar-none"
                        style={{
                          display: "flex",
                          gap: "8px",
                          overflowX: "auto",
                          flexWrap: "nowrap",
                          margin: "20px 0 16px 0",
                          paddingBottom: "12px",
                          borderBottom: "1px solid #e2e8f0",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a", alignSelf: "center", marginRight: "4px", flexShrink: 0 }}>
                          Filter by Domain:
                        </span>
                        {categories.map((cat) => {
                          const isActive = selectedTag === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedTag(cat)}
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                padding: "6px 14px",
                                minHeight: "36px",
                                border: isActive ? "1px solid #2563eb" : "1px solid #cbd5e1",
                                backgroundColor: isActive ? "#2563eb" : "#ffffff",
                                color: isActive ? "#ffffff" : "#334155",
                                borderRadius: "6px",
                                cursor: "pointer",
                                flexShrink: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Search Bar */}
                      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search articles by title, topic, or technical keywords..."
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            fontSize: "13.5px",
                            color: "#0f172a",
                          }}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            style={{
                              padding: "10px 16px",
                              backgroundColor: "#1e293b",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Featured Flagship Article (Shown when no search/tag active) */}
                      {selectedTag === "All" && !searchQuery && featuredPost && (
                        <div
                          style={{
                            backgroundColor: "#0b132b",
                            color: "#ffffff",
                            borderRadius: "8px",
                            padding: "24px",
                            marginBottom: "32px",
                            border: "1px solid #1e293b",
                            boxShadow: "0 4px 12px -2px rgba(11, 19, 43, 0.12)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>
                              ★ Featured Technical Publication
                            </span>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                              ⏱ {featuredPost.readingTimeMinutes} min read
                            </span>
                          </div>

                          <h3 style={{ fontSize: "22px", margin: "6px 0 10px 0", lineHeight: "1.3" }}>
                            <Link href={`/blog/${featuredPost.slug}`} style={{ color: "#ffffff", textDecoration: "none" }}>
                              {featuredPost.title}
                            </Link>
                          </h3>

                          <p style={{ fontSize: "13.5px", color: "#cbd5e1", lineHeight: "1.6", margin: "0 0 16px 0" }}>
                            {featuredPost.excerpt}
                          </p>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {featuredPost.tags.map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    fontSize: "11px",
                                    backgroundColor: "#111e38",
                                    border: "1px solid #1e293b",
                                    color: "#e2e8f0",
                                    padding: "3px 9px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <Link
                              href={`/blog/${featuredPost.slug}`}
                              className="mobile-full-width-btn"
                              style={{
                                padding: "10px 18px",
                                minHeight: "44px",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                textDecoration: "none",
                                fontWeight: "700",
                                fontSize: "13px",
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background-color 0.15s ease",
                              }}
                            >
                              Read Full Architecture Breakdown &rsaquo;
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Header for All Articles */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #2563eb", paddingBottom: "8px", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "18px", color: "#0f172a", margin: 0 }}>
                          {selectedTag === "All" ? "All Engineering Publications" : `Articles in #${selectedTag}`}
                        </h3>
                        <span style={{ fontSize: "12px", color: "#334155", fontWeight: "600" }}>
                          Showing {filteredPosts.length} publication{filteredPosts.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/* Article Cards Stream */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
                        {filteredPosts.map((post) => (
                          <article
                            key={post.id}
                            style={{
                              padding: "24px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderLeft: "4px solid #2563eb",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px -2px rgba(11, 19, 43, 0.05)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "12px", color: "#64748b" }}>
                              <div>
                                <strong style={{ color: "#0f172a" }}>
                                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </strong>
                                <span style={{ margin: "0 8px" }}>•</span>
                                <span style={{ color: "#047857", fontWeight: "700" }}>
                                  ⏱ {post.readingTimeMinutes} min read
                                </span>
                              </div>
                              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
                                By MD Abu Hanif Mia
                              </span>
                            </div>

                            <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", lineHeight: "1.3" }}>
                              <Link href={`/blog/${post.slug}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                                {post.title}
                              </Link>
                            </h3>

                            <p style={{ margin: "0 0 14px 0", fontSize: "13.5px", lineHeight: "1.6", color: "#334155" }}>
                              {post.excerpt}
                            </p>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      backgroundColor: "#f1f5f9",
                                      border: "1px solid #e2e8f0",
                                      color: "#475569",
                                      padding: "3px 8px",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <Link
                                href={`/blog/${post.slug}`}
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  color: "#2563eb",
                                  textDecoration: "none",
                                }}
                              >
                                Read Article &nbsp;&rsaquo;
                              </Link>
                            </div>
                          </article>
                        ))}

                        {filteredPosts.length === 0 && (
                          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "8px", color: "#64748b", fontWeight: "600" }}>
                            No technical articles found matching &ldquo;{searchQuery || selectedTag}&rdquo;.
                          </div>
                        )}
                      </div>

                      {/* Technical Consultation CTA Banner */}
                      <div
                        style={{
                          padding: "24px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #cbd5e1",
                          borderLeft: "4px solid #2563eb",
                          borderRadius: "8px",
                          marginBottom: "20px",
                        }}
                      >
                        <h3 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "18px" }}>
                          Need an architectural review, database optimization sprint, or MVP platform?
                        </h3>
                        <p style={{ margin: "0 0 16px 0", fontSize: "13.5px", color: "#475569", lineHeight: "1.6" }}>
                          I partner directly with technical founders, CTOs, and engineering leaders to eliminate scaling bottlenecks and ship production platforms with strict SLAs.
                        </p>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <Link
                            href="/pricing#inquiry"
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
                            Request Architecture Consultation &rsaquo;
                          </Link>
                          <Link
                            href="/pricing"
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#ffffff",
                              color: "#0f172a",
                              border: "1px solid #cbd5e1",
                              textDecoration: "none",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "700",
                            }}
                          >
                            View Transparent Work Prices &rsaquo;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Sidebar */}
                <div className="sidebar secondary-sidebar">
                  <div className="wrapper">
                    {/* Author Snapshot */}
                    <div className="block" style={{ backgroundColor: "#f8fafc", padding: "18px", border: "1px solid #e2e8f0", borderRadius: "8px", marginBottom: "20px" }}>
                      <img
                        src="/images/profile.png"
                        alt="MD Abu Hanif Mia"
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

                    {/* Topic Pillars Hubs */}
                    <div className="block" style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#0f172a", textTransform: "uppercase", borderBottom: "2px solid #2563eb", paddingBottom: "4px" }}>
                        Topic Pillars
                      </h4>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "12.5px" }}>
                        <li style={{ padding: "6px 0", borderBottom: "1px dotted #e2e8f0" }}>
                          <Link href="/blog/category/postgresql" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                            &rsaquo; PostgreSQL &amp; Database Systems
                          </Link>
                        </li>
                        <li style={{ padding: "6px 0", borderBottom: "1px dotted #e2e8f0" }}>
                          <Link href="/blog/category/nextjs" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                            &rsaquo; Next.js 16 &amp; React 19 Architecture
                          </Link>
                        </li>
                        <li style={{ padding: "6px 0", borderBottom: "1px dotted #e2e8f0" }}>
                          <Link href="/blog/category/cloudflare" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                            &rsaquo; Cloudflare Pages &amp; Edge Delivery
                          </Link>
                        </li>
                        <li style={{ padding: "6px 0", borderBottom: "1px dotted #e2e8f0" }}>
                          <Link href="/blog/category/architecture" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                            &rsaquo; Distributed Systems &amp; Modular Monoliths
                          </Link>
                        </li>
                        <li style={{ padding: "6px 0", borderBottom: "1px dotted #e2e8f0" }}>
                          <Link href="/blog/category/rust" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                            &rsaquo; Rust Systems &amp; Concurrency
                          </Link>
                        </li>
                        <li style={{ padding: "6px 0" }}>
                          <Link href="/blog/category/performance" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                            &rsaquo; Performance &amp; P99 Latency Tuning
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Production Track Record */}
                    <div className="block" style={{ backgroundColor: "#0b132b", color: "#ffffff", padding: "18px", borderRadius: "8px", border: "1px solid #1e293b", marginBottom: "20px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "bold", color: "#10b981", textTransform: "uppercase" }}>
                        Verified Track Record
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "800", margin: "4px 0", color: "#ffffff" }}>
                        99.99% UPTIME
                      </div>
                      <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.4" }}>
                        Over 50+ high-concurrency production deployments across Cloudflare Pages, Supabase, and distributed backends.
                      </div>
                    </div>

                    {/* Popular Topics Cloud */}
                    <div className="block" style={{ border: "1px solid #cbd5e1", padding: "16px", borderRadius: "8px", backgroundColor: "#ffffff", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#0f172a", textTransform: "uppercase" }}>
                        Popular Topics
                      </h4>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {["PostgreSQL", "Next.js", "Cloudflare", "Performance", "Architecture", "WebSockets", "Supabase", "System Design"].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTag(tag)}
                            style={{
                              fontSize: "11px",
                              backgroundColor: selectedTag === tag ? "#2563eb" : "#f1f5f9",
                              color: selectedTag === tag ? "#ffffff" : "#334155",
                              border: selectedTag === tag ? "1px solid #2563eb" : "1px solid #e2e8f0",
                              padding: "4px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              transition: "all 0.12s ease",
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="block" style={{ border: "1px solid #e2e8f0", padding: "14px", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                      <strong style={{ display: "block", fontSize: "12px", color: "#0f172a", marginBottom: "8px" }}>Portfolio Links:</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                        <Link href="/projects" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Work Showcase &amp; Projects
                        </Link>
                        <Link href="/pricing" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Work Prices &amp; Sprints
                        </Link>
                        <Link href="/admin" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Admin Publishing Portal
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
