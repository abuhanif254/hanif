"use client";

import React, { useState } from "react";
import type { Project } from "../lib/portfolio-store";

interface ProjectCaseStudyActionsProps {
  project: Project;
}

export default function ProjectCaseStudyActions({ project }: ProjectCaseStudyActionsProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);

  const siteUrl = "https://abuhanifmia.com";
  const projectUrl = `${siteUrl}/projects/${project.slug}`;
  const shareTitle = `${project.title} - Systems Architecture Case Study by Abu Hanif`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareTitle
  )}&url=${encodeURIComponent(`${projectUrl}?utm_source=twitter&utm_medium=case_study_share`)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    `${projectUrl}?utm_source=linkedin&utm_medium=case_study_share`
  )}`;

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${projectUrl}?utm_source=direct_share`).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const handleCopyDossier = () => {
    const tech = (project.techStack || []).join(", ");
    const dossierMarkdown = [
      `# Architecture Dossier: ${project.title}`,
      `> Staff Systems Architecture & Engineering Case Study`,
      ``,
      `* **Lead Architect:** MD Abu Hanif Mia (Staff Software Engineer & Systems Architect)`,
      `* **Client / Organization:** ${project.clientName || "Confidential Enterprise Client"}`,
      `* **Verified SLA / Metric:** ${project.impactMetric}`,
      `* **Scope Tag:** ${project.priceTag || "Custom Scoped"}`,
      `* **Core Tech Stack:** ${tech}`,
      project.demoUrl ? `* **Live URL:** ${project.demoUrl}` : null,
      project.githubUrl ? `* **Repository:** ${project.githubUrl}` : null,
      `* **Canonical Dossier:** ${projectUrl}`,
      ``,
      `## Executive Summary`,
      project.summary,
      ``,
      `## Technical Specifications`,
      project.descriptionMarkdown,
    ]
      .filter((line) => line !== null)
      .join("\n");

    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(dossierMarkdown).then(() => {
        setCopiedDossier(true);
        setTimeout(() => setCopiedDossier(false), 2500);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        padding: "16px 20px",
        margin: "24px 0",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
      className="no-print"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span style={{ color: "#2563eb" }}>●</span> Dossier Actions:
        </span>

        {/* Copy Markdown Dossier */}
        <button
          type="button"
          onClick={handleCopyDossier}
          title="Copy architecture specifications as formatted Markdown for RFCs or Notion"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: "700",
            padding: "6px 14px",
            borderRadius: "6px",
            backgroundColor: copiedDossier ? "#ecfdf5" : "#2563eb",
            color: copiedDossier ? "#065f46" : "#ffffff",
            border: copiedDossier ? "1px solid #a7f3d0" : "1px solid #2563eb",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <span>{copiedDossier ? "✓ Dossier Copied" : "📋 Copy Dossier (MD)"}</span>
        </button>

        {/* 1-Click Print / PDF */}
        <button
          type="button"
          onClick={handlePrint}
          title="Print or Save as Clean PDF"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: "600",
            padding: "6px 12px",
            borderRadius: "4px",
            backgroundColor: "#f8fafc",
            color: "#334155",
            border: "1px solid #cbd5e1",
            cursor: "pointer",
          }}
        >
          <span>🖨️ Print / Save PDF</span>
        </button>
      </div>

      {/* Social / Direct Share */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X (Twitter)"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            fontWeight: "600",
            padding: "6px 10px",
            borderRadius: "4px",
            backgroundColor: "#000000",
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          <span>𝕏</span> Share
        </a>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            fontWeight: "600",
            padding: "6px 10px",
            borderRadius: "4px",
            backgroundColor: "#0077b5",
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          <span>in</span> Share
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy Case Study Link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            fontWeight: "600",
            padding: "6px 10px",
            borderRadius: "4px",
            backgroundColor: copiedLink ? "#ecfdf5" : "#f1f5f9",
            color: copiedLink ? "#065f46" : "#334155",
            border: copiedLink ? "1px solid #a7f3d0" : "1px solid #cbd5e1",
            cursor: "pointer",
          }}
        >
          <span>{copiedLink ? "✓ Link Copied" : "🔗 Copy Link"}</span>
        </button>
      </div>
    </div>
  );
}
