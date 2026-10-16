"use client";

import React, { useState } from "react";

interface AdminBlogSeoAssistantProps {
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string;
}

export default function AdminBlogSeoAssistant({
  title,
  slug,
  excerpt,
  contentMarkdown,
  tags,
}: AdminBlogSeoAssistantProps) {
  const [focusKeyword, setFocusKeyword] = useState("");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");

  const cleanKeyword = focusKeyword.trim().toLowerCase();

  // Audit Calculations
  const titleLen = title.length;
  const isTitleIdeal = titleLen >= 40 && titleLen <= 65;

  const excerptLen = excerpt.length;
  const isExcerptIdeal = excerptLen >= 120 && excerptLen <= 165;

  const hasKeywordInTitle = cleanKeyword ? title.toLowerCase().includes(cleanKeyword) : false;
  const hasKeywordInSlug = cleanKeyword
    ? cleanKeyword.split(" ").some((w) => slug.toLowerCase().includes(w) && w.length > 2)
    : false;
  const hasKeywordInExcerpt = cleanKeyword ? excerpt.toLowerCase().includes(cleanKeyword) : false;

  const h2Matches = (contentMarkdown.match(/^## .+/gm) || []).filter((h) =>
    cleanKeyword ? h.toLowerCase().includes(cleanKeyword) : false
  );

  const wordCount = contentMarkdown.trim() ? contentMarkdown.trim().split(/\s+/).length : 0;
  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Calculate Overall SEO Score (0 - 100)
  let score = 0;
  if (titleLen > 10) score += 15;
  if (isTitleIdeal) score += 10;
  if (excerptLen > 50) score += 15;
  if (isExcerptIdeal) score += 10;
  if (wordCount >= 300) score += 15;
  if (wordCount >= 800) score += 10;
  if (cleanKeyword) {
    if (hasKeywordInTitle) score += 10;
    if (hasKeywordInSlug) score += 5;
    if (hasKeywordInExcerpt) score += 5;
    if (h2Matches.length > 0) score += 5;
  } else {
    score += 15; // default credit when no focus keyword set
  }
  score = Math.min(100, score);

  const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div
      style={{
        backgroundColor: "#071324",
        border: "1px solid #1e293b",
        borderRadius: "6px",
        padding: "18px",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      {/* Header with Score */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid #1e293b",
          paddingBottom: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🎯</span>
          <div>
            <strong style={{ fontSize: "14px", color: "#ffffff" }}>
              Real-Time Editorial SEO Assistant
            </strong>
            <span style={{ display: "block", fontSize: "11px", color: "#94a3b8" }}>
              Live audit against Google Helpful Content System &amp; E-E-A-T guidelines
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>SEO Health:</span>
          <div
            style={{
              backgroundColor: "#030c18",
              border: `2px solid ${scoreColor}`,
              borderRadius: "4px",
              padding: "4px 12px",
              fontWeight: "900",
              fontSize: "16px",
              color: scoreColor,
            }}
          >
            {score} / 100
          </div>
        </div>
      </div>

      {/* Focus Keyword Input & Word Count */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
            Target Focus Keyword (e.g. <em>postgresql cdc realtime</em>):
          </label>
          <input
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="Enter primary search phrase..."
            style={{
              width: "100%",
              padding: "7px 10px",
              backgroundColor: "#030c18",
              border: "1px solid #1e293b",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "12.5px",
            }}
          />
        </div>

        <div style={{ backgroundColor: "#030c18", border: "1px solid #1e293b", borderRadius: "4px", padding: "8px 12px" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Article Volume</div>
          <div style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginTop: "2px" }}>
            {wordCount} Words &bull; ~{estimatedReadMinutes} min read
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "8px",
          fontSize: "12px",
          marginBottom: "18px",
        }}
      >
        {/* Title Check */}
        <div style={{ padding: "6px 10px", backgroundColor: "#0a192f", borderRadius: "3px", border: "1px solid #1e293b" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: isTitleIdeal ? "#4ade80" : "#f59e0b" }}>
              {isTitleIdeal ? "✓" : "!"} Title Length
            </span>
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>{titleLen} / 60 chars</span>
          </div>
        </div>

        {/* Excerpt Check */}
        <div style={{ padding: "6px 10px", backgroundColor: "#0a192f", borderRadius: "3px", border: "1px solid #1e293b" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: isExcerptIdeal ? "#4ade80" : "#f59e0b" }}>
              {isExcerptIdeal ? "✓" : "!"} Meta Description
            </span>
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>{excerptLen} / 160 chars</span>
          </div>
        </div>

        {/* Keyword in Title */}
        <div style={{ padding: "6px 10px", backgroundColor: "#0a192f", borderRadius: "3px", border: "1px solid #1e293b" }}>
          <span style={{ color: hasKeywordInTitle ? "#4ade80" : cleanKeyword ? "#ef4444" : "#94a3b8" }}>
            {hasKeywordInTitle ? "✓" : "•"} Keyword in Title
          </span>
        </div>

        {/* Keyword in Slug */}
        <div style={{ padding: "6px 10px", backgroundColor: "#0a192f", borderRadius: "3px", border: "1px solid #1e293b" }}>
          <span style={{ color: hasKeywordInSlug ? "#4ade80" : cleanKeyword ? "#ef4444" : "#94a3b8" }}>
            {hasKeywordInSlug ? "✓" : "•"} Keyword in URL Slug
          </span>
        </div>

        {/* Keyword in Excerpt */}
        <div style={{ padding: "6px 10px", backgroundColor: "#0a192f", borderRadius: "3px", border: "1px solid #1e293b" }}>
          <span style={{ color: hasKeywordInExcerpt ? "#4ade80" : cleanKeyword ? "#ef4444" : "#94a3b8" }}>
            {hasKeywordInExcerpt ? "✓" : "•"} Keyword in Excerpt
          </span>
        </div>

        {/* Keyword in Headings */}
        <div style={{ padding: "6px 10px", backgroundColor: "#0a192f", borderRadius: "3px", border: "1px solid #1e293b" }}>
          <span style={{ color: h2Matches.length > 0 ? "#4ade80" : cleanKeyword ? "#f59e0b" : "#94a3b8" }}>
            {h2Matches.length > 0 ? `✓ In ${h2Matches.length} H2 Section(s)` : "• Keyword in H2 Sections"}
          </span>
        </div>
      </div>

      {/* Google SERP Live Simulator */}
      <div style={{ borderTop: "1px solid #1e293b", paddingTop: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <strong style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase" }}>
            🔍 Google SERP Live Snippet Simulation
          </strong>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setDevicePreview("desktop")}
              style={{
                background: devicePreview === "desktop" ? "#1e293b" : "transparent",
                color: "#ffffff",
                border: "1px solid #334155",
                borderRadius: "3px",
                fontSize: "11px",
                padding: "2px 8px",
                cursor: "pointer",
              }}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevicePreview("mobile")}
              style={{
                background: devicePreview === "mobile" ? "#1e293b" : "transparent",
                color: "#ffffff",
                border: "1px solid #334155",
                borderRadius: "3px",
                fontSize: "11px",
                padding: "2px 8px",
                cursor: "pointer",
              }}
            >
              Mobile
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "16px",
            fontFamily: "Arial, sans-serif",
            maxWidth: devicePreview === "mobile" ? "420px" : "640px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          {/* URL Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#053056", display: "inline-block" }}></div>
            <div style={{ fontSize: "12px", color: "#202124", lineHeight: "1.3" }}>
              <span style={{ fontWeight: "bold" }}>Abu Hanif</span>
              <span style={{ color: "#5f6368", marginLeft: "4px" }}>
                https://abuhanif.dev &rsaquo; blog &rsaquo; {slug || "article-slug"}
              </span>
            </div>
          </div>

          {/* Title */}
          <div style={{ fontSize: "18px", color: "#1a0dab", fontWeight: "normal", lineHeight: "1.3", marginBottom: "4px", cursor: "pointer" }}>
            {title ? `${title} | Abu Hanif` : "Article Title Will Appear Here"}
          </div>

          {/* Description */}
          <div style={{ fontSize: "13px", color: "#4d5156", lineHeight: "1.5" }}>
            {excerpt || "Add an executive synopsis to generate a high-converting SERP meta description snippet in search results..."}
          </div>
        </div>
      </div>
    </div>
  );
}
