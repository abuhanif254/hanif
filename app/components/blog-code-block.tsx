"use client";

import React, { useState } from "react";

interface BlogCodeBlockProps {
  language: string;
  code: string;
}

export default function BlogCodeBlock({ language, code }: BlogCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code.trim()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }

  const cleanLang = language.toLowerCase() || "code";

  return (
    <div
      style={{
        backgroundColor: "#071324",
        border: "1px solid #1e293b",
        borderRadius: "6px",
        margin: "24px 0",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Code Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 14px",
          backgroundColor: "#030c18",
          borderBottom: "1px solid #1e293b",
          fontSize: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block" }}></span>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#f59e0b", display: "inline-block" }}></span>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
          </div>
          <span
            style={{
              color: "#38bdf8",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "monospace",
              fontSize: "11px",
              marginLeft: "6px",
            }}
          >
            {cleanLang}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet to clipboard"
          style={{
            background: copied ? "#065f46" : "#0f172a",
            color: copied ? "#a7f3d0" : "#cbd5e1",
            border: "1px solid #334155",
            borderRadius: "3px",
            padding: "4px 10px",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy Code"}
        </button>
      </div>

      {/* Code Content */}
      <pre
        style={{
          margin: 0,
          padding: "16px",
          color: "#e2e8f0",
          fontSize: "13px",
          lineHeight: "1.6",
          fontFamily: "var(--font-mono), 'JetBrains Mono', Consolas, 'Courier New', monospace",
          overflowX: "auto",
        }}
      >
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
