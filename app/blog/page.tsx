"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialBlogPosts, BlogPost } from "../data/portfolio-data";
import SiteFooter from "../components/site-footer";

export default function BlogIndexPage() {
  const [posts] = useState<BlogPost[]>(initialBlogPosts);
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
      <div id="source-page-body" className="source-page-body js l2 section_83 justia-robertjfleming-com">
        {/* Sticky Top Bar */}
        <div className="top-numbers-v3 tnv3-sticky" id="top-numbers-v3">
          <ul>
            <li>
              Available for High-Impact Contracts &amp; Consulting: <strong>contact@abuhanif.dev</strong>
              <a className="tnv3-button" href="/pricing#inquiry">
                Request Scope Quote
              </a>
            </li>
          </ul>
        </div>

        <div className="index" id="container">
          <div className="cwrap">
            {/* Header */}
            <div id="header">
              <div className="wrapper">
                <div id="head">
                  <div id="logo">
                    <a data-title="Abu Hanif - Staff Software Engineer" href="/" title="Back to Home">
                      <img alt="Abu Hanif - Staff Software Engineer" id="mainlogo" src="/images/abuhanif-logo-v3.svg" />
                      Abu Hanif Staff Software Engineer Home
                    </a>
                  </div>
                  <div id="tagline">
                    <a href="/pricing#inquiry" title="Discuss an Engineering Project">
                      Discuss an Engineering Project with Abu Hanif
                    </a>
                  </div>
                </div>
                <div id="topnav">
                  <ul id="tnav-toplevel">
                    <li className="priority_1" id="fc"><a href="/">Home</a></li>
                    <li className="priority_3"><a href="/#about">About Abu Hanif</a></li>
                    <li className="priority_4"><a href="/#competencies">Engineering Focus</a></li>
                    <li className="priority_2"><a href="/projects">Work Showcase</a></li>
                    <li className="priority_4"><a href="/pricing">Work Prices</a></li>
                    <li className="selected priority_5"><a href="/blog">Technical Blog</a></li>
                    <li className="priority_6"><a href="/#feedback">Client Feedback</a></li>
                    <li className="category_141"><a href="/admin">Admin Panel</a></li>
                    <li className="contactus priority_1" id="lc"><a href="/pricing#inquiry">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div id="ed"></div>
              <div className="clr"></div>
            </div>

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
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          margin: "20px 0 16px 0",
                          paddingBottom: "12px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#053056", alignSelf: "center", marginRight: "4px" }}>
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
                                padding: "4px 10px",
                                border: isActive ? "1px solid #053056" : "1px solid #cbd5e1",
                                backgroundColor: isActive ? "#053056" : "#ffffff",
                                color: isActive ? "#ffffff" : "#475569",
                                borderRadius: "3px",
                                cursor: "pointer",
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
                            padding: "9px 12px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                            fontSize: "13px",
                          }}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            style={{
                              padding: "9px 14px",
                              backgroundColor: "#334155",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
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
                            backgroundColor: "#053056",
                            color: "#ffffff",
                            borderRadius: "6px",
                            padding: "24px",
                            marginBottom: "32px",
                            border: "1px solid #1e3a5f",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "800", color: "#9CBE41", textTransform: "uppercase", letterSpacing: "1px" }}>
                              ★ Featured Technical Publication
                            </span>
                            <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                              ⏱ {featuredPost.readingTimeMinutes} min read
                            </span>
                          </div>

                          <h3 style={{ fontSize: "22px", margin: "6px 0 10px 0", lineHeight: "1.3" }}>
                            <Link href={`/blog/${featuredPost.slug}`} style={{ color: "#ffffff", textDecoration: "none" }}>
                              {featuredPost.title}
                            </Link>
                          </h3>

                          <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.6", margin: "0 0 16px 0" }}>
                            {featuredPost.excerpt}
                          </p>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {featuredPost.tags.map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    fontSize: "11px",
                                    backgroundColor: "#071c33",
                                    border: "1px solid #1e3a5f",
                                    color: "#e2e8f0",
                                    padding: "2px 8px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <Link
                              href={`/blog/${featuredPost.slug}`}
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#9CBE41",
                                color: "#053056",
                                textDecoration: "none",
                                fontWeight: "800",
                                fontSize: "12px",
                                borderRadius: "4px",
                              }}
                            >
                              Read Full Architecture Breakdown &rsaquo;
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Header for All Articles */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #9CBE41", paddingBottom: "6px", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "18px", color: "#053056", margin: 0 }}>
                          {selectedTag === "All" ? "All Engineering Publications" : `Articles in #${selectedTag}`}
                        </h3>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          Showing {filteredPosts.length} publication{filteredPosts.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/* Article Cards Stream */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
                        {filteredPosts.map((post) => (
                          <article
                            key={post.id}
                            style={{
                              padding: "20px 24px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #cbd5e1",
                              borderLeft: "4px solid #053056",
                              borderRadius: "4px",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "12px", color: "#64748b" }}>
                              <div>
                                <strong style={{ color: "#053056" }}>
                                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </strong>
                                <span style={{ margin: "0 8px" }}>•</span>
                                <span style={{ color: "#16a34a", fontWeight: "700" }}>
                                  ⏱ {post.readingTimeMinutes} min read
                                </span>
                              </div>
                              <span style={{ fontSize: "11px", color: "#64748b" }}>
                                By MD Abu Hanif Mia
                              </span>
                            </div>

                            <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", lineHeight: "1.3" }}>
                              <Link href={`/blog/${post.slug}`} style={{ color: "#053056", textDecoration: "none" }}>
                                {post.title}
                              </Link>
                            </h3>

                            <p style={{ margin: "0 0 14px 0", fontSize: "13px", lineHeight: "1.6", color: "#334155" }}>
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
                                      padding: "2px 8px",
                                      borderRadius: "3px",
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
                                  color: "#053056",
                                  textDecoration: "none",
                                }}
                              >
                                Read Article &nbsp;&rsaquo;
                              </Link>
                            </div>
                          </article>
                        ))}

                        {filteredPosts.length === 0 && (
                          <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", color: "#64748b" }}>
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
                          borderLeft: "4px solid #16a34a",
                          borderRadius: "4px",
                          marginBottom: "20px",
                        }}
                      >
                        <h3 style={{ margin: "0 0 8px 0", color: "#053056", fontSize: "18px" }}>
                          Need an architectural review, database optimization sprint, or MVP platform?
                        </h3>
                        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                          I partner directly with technical founders, CTOs, and engineering leaders to eliminate scaling bottlenecks and ship production platforms with strict SLAs.
                        </p>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <Link
                            href="/pricing#inquiry"
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#053056",
                              color: "#ffffff",
                              textDecoration: "none",
                              borderRadius: "4px",
                              fontSize: "13px",
                              fontWeight: "700",
                            }}
                          >
                            Request Architecture Consultation &rsaquo;
                          </Link>
                          <Link
                            href="/pricing"
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#ffffff",
                              color: "#053056",
                              border: "1px solid #cbd5e1",
                              textDecoration: "none",
                              borderRadius: "4px",
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
                    <div className="block" style={{ backgroundColor: "#f8fafc", padding: "18px", border: "1px solid #e2e8f0", borderRadius: "4px", marginBottom: "20px" }}>
                      <img
                        src="/images/profile.png"
                        alt="MD Abu Hanif Mia"
                        style={{
                          width: "100%",
                          borderRadius: "4px",
                          marginBottom: "12px",
                          border: "1px solid #cbd5e1",
                          display: "block",
                        }}
                      />
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#053056" }}>
                        MD Abu Hanif Mia
                      </h3>
                      <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>
                        Staff Software Engineer &amp; Systems Architect
                      </div>
                      <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", margin: 0 }}>
                        Writing about production systems architecture, PostgreSQL query optimizations, and low-latency edge compute based on 9+ years in production.
                      </p>
                    </div>

                    {/* Production Track Record */}
                    <div className="block" style={{ backgroundColor: "#053056", color: "#ffffff", padding: "18px", borderRadius: "4px", marginBottom: "20px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "bold", color: "#9CBE41", textTransform: "uppercase" }}>
                        Verified Track Record
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "800", margin: "4px 0" }}>
                        99.99% UPTIME
                      </div>
                      <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.4" }}>
                        Over 50+ high-concurrency production deployments across Cloudflare Pages, Supabase, and distributed backends.
                      </div>
                    </div>

                    {/* Popular Topics Cloud */}
                    <div className="block" style={{ border: "1px solid #cbd5e1", padding: "16px", borderRadius: "4px", backgroundColor: "#ffffff", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#053056", textTransform: "uppercase" }}>
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
                              backgroundColor: selectedTag === tag ? "#053056" : "#f1f5f9",
                              color: selectedTag === tag ? "#ffffff" : "#334155",
                              border: "1px solid #e2e8f0",
                              padding: "4px 8px",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="block" style={{ border: "1px solid #e2e8f0", padding: "14px", borderRadius: "4px", backgroundColor: "#f8fafc" }}>
                      <strong style={{ display: "block", fontSize: "12px", color: "#053056", marginBottom: "8px" }}>Portfolio Links:</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                        <Link href="/projects" style={{ color: "#053056", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Work Showcase &amp; Projects
                        </Link>
                        <Link href="/pricing" style={{ color: "#053056", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Work Prices &amp; Sprints
                        </Link>
                        <Link href="/admin" style={{ color: "#053056", textDecoration: "none", fontWeight: "600" }}>
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
