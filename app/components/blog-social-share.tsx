"use client";

import React, { useState } from "react";

interface BlogSocialShareProps {
  title: string;
  slug: string;
}

export default function BlogSocialShare({ title, slug }: BlogSocialShareProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://abuhanif.dev/blog/${slug}`;
  const encodedTitle = encodeURIComponent(`${title} by @abuhanif`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(
    `${fullUrl}?utm_source=twitter&utm_medium=social_share`
  )}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    `${fullUrl}?utm_source=linkedin&utm_medium=social_share`
  )}`;

  function handleCopyLink() {
    const shareUrl = `${fullUrl}?utm_source=direct_share&utm_medium=copy_link`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        padding: "12px 0",
        margin: "20px 0",
        borderTop: "1px solid #e2e8f0",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginRight: "6px" }}>
        Share Article:
      </span>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
          padding: "5px 11px",
          borderRadius: "3px",
          textDecoration: "none",
        }}
      >
        <span>𝕏</span> Share on X
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#0077b5",
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
          padding: "5px 11px",
          borderRadius: "3px",
          textDecoration: "none",
        }}
      >
        <span>in</span> Share on LinkedIn
      </a>

      <button
        type="button"
        onClick={handleCopyLink}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: copied ? "#065f46" : "#f1f5f9",
          color: copied ? "#a7f3d0" : "#334155",
          border: "1px solid #cbd5e1",
          fontSize: "12px",
          fontWeight: "bold",
          padding: "5px 11px",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        {copied ? "✓ Copied with UTM!" : "🔗 Copy Link"}
      </button>
    </div>
  );
}
