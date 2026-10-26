"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Testimonial } from "../data/portfolio-data";

interface EnterpriseTestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function EnterpriseTestimonialsSection({
  testimonials,
}: EnterpriseTestimonialsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  if (!testimonials || testimonials.length === 0) return null;

  const filteredTestimonials =
    selectedCategory === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === selectedCategory);

  function toggleExpand(id: string) {
    setExpandedCardId((prev) => (prev === id ? null : id));
  }

  const categoryOptions = [
    { id: "all", label: `All Endorsements (${testimonials.length})` },
    { id: "telemetry", label: "Distributed & Telemetry" },
    { id: "edge", label: "Cloudflare & Edge" },
    { id: "postgres", label: "PostgreSQL & Database" },
    { id: "ai", label: "AI & Vector RAG" },
    { id: "security", label: "Zero-Trust & Security" },
  ];

  return (
    <section
      id="testimonials"
      style={{
        marginTop: "40px",
        marginBottom: "40px",
      }}
      aria-label="Verified Client Testimonials and Engineering Outcomes"
    >
      {/* Header with Authority Title */}
      <div
        style={{
          borderBottom: "2px solid #2563eb",
          paddingBottom: "14px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 6px #10b981",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#2563eb",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Verified Production Delivery &bull; Client &amp; Architect Endorsements
          </span>
        </div>

        <h2
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#0f172a",
            margin: "0 0 6px 0",
            letterSpacing: "-0.01em",
          }}
        >
          What Engineering Leaders &amp; Founders Say
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#475569",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Direct feedback and verified SLA metrics from CTOs, VPs of Engineering, and technical founders who contracted Staff Engineer Abu Hanif.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "20px",
        }}
      >
        {categoryOptions.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: "20px",
                border: isActive ? "1px solid #2563eb" : "1px solid #cbd5e1",
                backgroundColor: isActive ? "#2563eb" : "#ffffff",
                color: isActive ? "#ffffff" : "#475569",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Testimonials 2-Column Responsive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        {filteredTestimonials.map((t, idx) => {
          const cardId = t.id || `test-${idx}`;
          const isExpanded = expandedCardId === cardId;
          const initials = t.author
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div
              key={cardId}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
                transition: "all 0.15s ease",
              }}
            >
              <div>
                {/* Top Row: Stars & Deliverable Tag */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{ color: "#f59e0b", fontSize: "14px", letterSpacing: "2px" }}
                    aria-label="5 out of 5 stars"
                  >
                    ★★★★★
                  </div>

                  {t.deliverableTag && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#1e40af",
                        backgroundColor: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {t.deliverableTag}
                    </span>
                  )}
                </div>

                {/* Scope & Verification Tag */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "14px",
                  }}
                >
                  {t.engagementScope && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: "#f1f5f9",
                        color: "#334155",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      💰 {t.engagementScope}
                    </span>
                  )}
                  {t.engagementDuration && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: "#f1f5f9",
                        color: "#334155",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      ⏱ {t.engagementDuration}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: "#ecfdf5",
                      color: "#065f46",
                      border: "1px solid #a7f3d0",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    ✓ Milestone Verified
                  </span>
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontSize: "14px",
                    color: "#1e293b",
                    lineHeight: "1.65",
                    fontStyle: "italic",
                    margin: "0 0 16px 0",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Bottom Metadata & Expandable Deliverables */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px", marginTop: "auto" }}>
                {/* Verified Impact Pill */}
                {t.verifiedMetric && (
                  <div
                    style={{
                      backgroundColor: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      color: "#065f46",
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "7px 12px",
                      borderRadius: "6px",
                      marginBottom: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    {t.verifiedMetric}
                  </div>
                )}

                {/* Author Info with Initials Avatar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#0b132b",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        border: "2px solid #3b82f6",
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                        {t.author}
                      </strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {t.role} &bull; <strong>{t.company}</strong>
                      </span>
                    </div>
                  </div>

                  {t.projectSlug && (
                    <Link
                      href={`/projects/${t.projectSlug}`}
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#2563eb",
                        textDecoration: "none",
                      }}
                      title={`View ${t.company} case study`}
                    >
                      View Case Study &rsaquo;
                    </Link>
                  )}
                </div>

                {/* Expandable Deliverables Toggle */}
                {t.deliverablesCompleted && t.deliverablesCompleted.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(cardId)}
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: "#475569",
                        backgroundColor: "transparent",
                        border: "none",
                        padding: "4px 0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>{isExpanded ? "▾ Hide Delivered Milestones" : "▸ Inspect Verified Deliverables (4)"}</span>
                    </button>

                    {isExpanded && (
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "10px 14px",
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#334155",
                          lineHeight: "1.6",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: "#64748b",
                            marginBottom: "6px",
                          }}
                        >
                          Production Deliverables Handed Over:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: "16px" }}>
                          {t.deliverablesCompleted.map((del, dIdx) => (
                            <li key={dIdx} style={{ marginBottom: "4px" }}>
                              {del}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Consultation Strip */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #cbd5e1",
          borderRadius: "10px",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ flex: "1 1 320px" }}>
          <strong style={{ fontSize: "15px", color: "#0f172a", display: "block", marginBottom: "3px" }}>
            Ready to achieve verified production results for your engineering team?
          </strong>
          <span style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
            Every engagement includes an explicit Statement of Work (SOW), 100% intellectual property assignment, and a guaranteed 30-day bug warranty.
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/pricing#inquiry"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              padding: "9px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Request Project Consultation &rsaquo;
          </Link>
          <Link
            href="/pricing"
            style={{
              backgroundColor: "#ffffff",
              color: "#1e293b",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              fontWeight: "700",
              padding: "9px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            View Pricing Matrix &rsaquo;
          </Link>
        </div>
      </div>
    </section>
  );
}
