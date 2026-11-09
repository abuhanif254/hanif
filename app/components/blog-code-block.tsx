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
    <div className="blog-code-container">
      {/* Code Header Bar */}
      <div className="blog-code-header">
        <div className="blog-code-meta">
          <div className="blog-code-dots">
            <span className="blog-code-dot red" />
            <span className="blog-code-dot amber" />
            <span className="blog-code-dot green" />
          </div>
          <span className="blog-code-lang">{cleanLang}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet to clipboard"
          className={`blog-code-copy-btn ${copied ? "copied" : ""}`}
        >
          {copied ? "✓ Copied!" : "📋 Copy Code"}
        </button>
      </div>

      {/* Code Content */}
      <pre className="blog-code-pre">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
