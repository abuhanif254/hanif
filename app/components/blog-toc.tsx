"use client";

import React, { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface BlogTableOfContentsProps {
  headings: TocItem[];
}

export default function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Article Table of Contents"
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "4px",
        padding: "16px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#053056",
          borderBottom: "2px solid #9CBE41",
          paddingBottom: "6px",
          marginBottom: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Table of Contents</span>
        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "normal" }}>
          {headings.length} Sections
        </span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13px" }}>
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              style={{
                padding: "4px 0",
                paddingLeft: item.level === 3 ? "14px" : "0",
                borderBottom: "1px dotted #e2e8f0",
              }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `#${item.id}`);
                    setActiveId(item.id);
                  }
                }}
                style={{
                  color: isActive ? "#053056" : "#475569",
                  fontWeight: isActive ? "800" : "500",
                  textDecoration: "none",
                  display: "inline-block",
                  lineHeight: "1.4",
                  borderLeft: isActive ? "3px solid #9CBE41" : "3px solid transparent",
                  paddingLeft: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
