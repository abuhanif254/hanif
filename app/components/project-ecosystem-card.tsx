import React from "react";
import Link from "next/link";
import { getEcosystemForProject } from "../lib/ecosystem-map";

interface ProjectEcosystemCardProps {
  projectSlug: string;
}

export default function ProjectEcosystemCard({ projectSlug }: ProjectEcosystemCardProps) {
  const eco = getEcosystemForProject(projectSlug);

  return (
    <div
      style={{
        marginTop: "36px",
        marginBottom: "36px",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(11, 25, 44, 0.06)",
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
            Connected Architecture Ecosystem
          </span>
          <h3 style={{ margin: "2px 0 0 0", fontSize: "16px", color: "#ffffff", fontWeight: "800" }}>
            Live Telemetry, Technical Publication &amp; SOW Scope
          </h3>
        </div>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
          Empirical Proof &bull; Zero Speculation
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
        {/* Lab Simulator */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderTop: "3px solid #0284c7",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              🔬 {eco.labBadge}
            </span>
            <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "6px", lineHeight: "1.3" }}>
              {eco.labToolName}
            </strong>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#475569", lineHeight: "1.5" }}>
              Test and inspect the live simulator and telemetry benchmarks backing this architecture.
            </p>
          </div>
          <div style={{ marginTop: "14px" }}>
            <Link
              href={eco.labAnchor}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#0284c7",
                textDecoration: "none",
              }}
            >
              Launch in Systems Lab &rsaquo;
            </Link>
          </div>
        </div>

        {/* Technical Article */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderTop: "3px solid #8b5cf6",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#8b5cf6", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              📖 Architectural Deep-Dive
            </span>
            <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "6px", lineHeight: "1.3" }}>
              {eco.blogTitle}
            </strong>
            <p style={{ margin: 0, fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
              {eco.blogExcerpt}
            </p>
          </div>
          <div style={{ marginTop: "14px" }}>
            <Link
              href={`/blog/${eco.blogSlug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#8b5cf6",
                textDecoration: "none",
              }}
            >
              Read Full Article &rsaquo;
            </Link>
          </div>
        </div>

        {/* Commercial Fixed Package */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderTop: "3px solid #16a34a",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#16a34a", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              💼 Fixed-Scope SOW Delivery
            </span>
            <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "4px", lineHeight: "1.3" }}>
              {eco.serviceTitle}
            </strong>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#16a34a", marginBottom: "6px" }}>
              {eco.servicePrice} <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>&bull; {eco.serviceTimeline}</span>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
              Engage Abu Hanif to architect and ship a customized version of this production system.
            </p>
          </div>
          <div style={{ marginTop: "14px" }}>
            <Link
              href="/pricing#sow-builder"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#16a34a",
                textDecoration: "none",
              }}
            >
              Configure in SOW Builder &rsaquo;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
