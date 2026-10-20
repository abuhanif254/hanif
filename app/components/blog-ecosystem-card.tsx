import React from "react";
import Link from "next/link";
import { getEcosystemForBlog } from "../lib/ecosystem-map";

interface BlogEcosystemCardProps {
  blogSlug: string;
}

export default function BlogEcosystemCard({ blogSlug }: BlogEcosystemCardProps) {
  const eco = getEcosystemForBlog(blogSlug);

  return (
    <div
      style={{
        margin: "36px 0",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(11, 25, 44, 0.08)",
      }}
    >
      <div
        style={{
          backgroundColor: "#0b132b",
          borderBottom: "1px solid #1e293b",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Production Implementation &amp; Architecture Delivery
          </span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "17px", color: "#ffffff", fontWeight: "800" }}>
            Verified Production Case Study &bull; Systems Lab Simulator
          </h3>
        </div>
        <span style={{ fontSize: "12px", color: "#4ade80", fontWeight: 700 }}>
          ● Production SLA Guaranteed
        </span>
      </div>

      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Case Study Proof */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderLeft: "4px solid #2563eb",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#2563eb", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              🏆 Production Case Study
            </span>
            <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "6px", lineHeight: "1.3" }}>
              {eco.projectTitle}
            </strong>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#475569", lineHeight: "1.5" }}>
              Inspect how this architectural pattern was implemented, tested, and shipped in production.
            </p>
          </div>
          <div style={{ marginTop: "14px" }}>
            <Link
              href={`/projects/${eco.projectSlug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              Read Production Case Study &rsaquo;
            </Link>
          </div>
        </div>

        {/* Live Lab Simulator */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderLeft: "4px solid #0284c7",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              🔬 Interactive Systems Lab
            </span>
            <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "6px", lineHeight: "1.3" }}>
              {eco.labToolName}
            </strong>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#475569", lineHeight: "1.5" }}>
              Run live empirical benchmarks and evaluate query execution metrics in real-time.
            </p>
          </div>
          <div style={{ marginTop: "14px" }}>
            <Link
              href={eco.labAnchor}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#0284c7",
                textDecoration: "none",
              }}
            >
              Launch Telemetry Tool &rsaquo;
            </Link>
          </div>
        </div>

        {/* Commercial Engagement */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderLeft: "4px solid #16a34a",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#16a34a", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              💼 Hire Abu Hanif
            </span>
            <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "4px", lineHeight: "1.3" }}>
              {eco.serviceTitle}
            </strong>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#16a34a", marginBottom: "6px" }}>
              {eco.servicePrice} <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>&bull; {eco.serviceTimeline}</span>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
              Facing architectural or scaling bottlenecks in your production environment?
            </p>
          </div>
          <div style={{ marginTop: "14px" }}>
            <Link
              href="/pricing#inquiry"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#16a34a",
                textDecoration: "none",
              }}
            >
              Book Technical Discovery Call &rsaquo;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
