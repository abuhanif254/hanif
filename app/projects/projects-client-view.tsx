"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProjectItem } from "../data/portfolio-data";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import ArchitectureTopologyExplorer from "../components/architecture-topology-explorer";
import SqlOptimizationExplorer from "../components/sql-optimization-explorer";

interface ProjectsClientViewProps {
  initialProjects: ProjectItem[];
}

type DomainCategory = "all" | "distributed" | "cloud" | "database" | "ai" | "security";

export default function ProjectsClientView({ initialProjects }: ProjectsClientViewProps) {
  const [activeDomain, setActiveDomain] = useState<DomainCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "matrix">("cards");

  const domainTabs: { id: DomainCategory; label: string; count?: number }[] = [
    { id: "all", label: "All Systems" },
    { id: "distributed", label: "Distributed Systems" },
    { id: "cloud", label: "Cloud & Next.js" },
    { id: "database", label: "PostgreSQL & Databases" },
    { id: "ai", label: "AI & Search" },
    { id: "security", label: "Security & Auth" },
  ];

  // Helper to categorize projects into domains based on tech stack & title
  function matchesDomain(project: ProjectItem, domain: DomainCategory): boolean {
    if (domain === "all") return true;
    const stack = (project.techStack || []).map((t) => t.toLowerCase());
    const text = `${project.title} ${project.summary}`.toLowerCase();

    switch (domain) {
      case "distributed":
        return (
          stack.some((t) => ["go", "websockets", "timescaledb", "redis", "bullmq", "kafka"].includes(t)) ||
          text.includes("stream") ||
          text.includes("telemetry") ||
          text.includes("pipeline")
        );
      case "cloud":
        return (
          stack.some((t) => ["next.js", "next.js 16", "cloudflare pages", "supabase", "tailwind css", "react"].includes(t)) ||
          text.includes("edge") ||
          text.includes("storefront") ||
          text.includes("platform")
        );
      case "database":
        return (
          stack.some((t) => ["postgresql", "postgresql 16", "pgbouncer", "explain analyze", "supabase", "timescaledb"].includes(t)) ||
          text.includes("postgres") ||
          text.includes("deadlock") ||
          text.includes("query")
        );
      case "ai":
        return (
          stack.some((t) => ["pgvector", "fastapi", "anthropic claude", "python", "algolia"].includes(t)) ||
          text.includes("rag") ||
          text.includes("semantic") ||
          text.includes("ai") ||
          text.includes("search")
        );
      case "security":
        return (
          stack.some((t) => ["oauth2", "webauthn", "docker", "zod"].includes(t)) ||
          text.includes("auth") ||
          text.includes("zero-trust") ||
          text.includes("soc2") ||
          text.includes("security")
        );
      default:
        return true;
    }
  }

  // Filter projects by both domain tab and search query
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchDomain = matchesDomain(project, activeDomain);
      if (!matchDomain) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inTitle = project.title.toLowerCase().includes(q);
      const inSummary = project.summary.toLowerCase().includes(q);
      const inClient = (project.clientName || "").toLowerCase().includes(q);
      const inMetric = (project.impactMetric || "").toLowerCase().includes(q);
      const inStack = (project.techStack || []).some((t) => t.toLowerCase().includes(q));

      return inTitle || inSummary || inClient || inMetric || inStack;
    });
  }, [initialProjects, activeDomain, searchQuery]);

  return (
    <div id="source-page-root" data-source-path="/projects">
      <div id="source-page-body" className="source-page-body js l2 section_10 justia-robertjfleming-com">
        <SiteHeader activePath="/projects" />

        <div className="index" id="container">
          <div className="cwrap">
            {/* Header / Banner Strip */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <h1 style={{ margin: 0, fontSize: "30px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Engineering Projects &amp; Systems Showcase
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          Production Architectures • Measurable SLAs • Transparent Scopes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <Link href="/">Home</Link> &gt; <span>Engineering Projects</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      <h2>Production Systems, Distributed Pipelines &amp; Scoped Contracts</h2>
                      <p>
                        Below is a comprehensive catalogue of real-world production systems architected and delivered by <strong>Abu Hanif (MD Abu Hanif Mia)</strong>. Every project details the engineering challenge, architectural topology, technology stack, and verified production SLA outcomes.
                      </p>

                      {/* Interactive Controls Bar */}
                      <div
                        style={{
                          backgroundColor: "#0b132b",
                          border: "1px solid #1e293b",
                          borderRadius: "8px",
                          padding: "20px 24px",
                          margin: "24px 0 24px 0",
                          color: "#ffffff",
                        }}
                      >
                        {/* Search Input Row */}
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
                          <div style={{ flex: "1 1 280px", position: "relative" }}>
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search by tech (e.g. Rust, Go, Postgres, Docker) or challenge keyword..."
                              style={{
                                width: "100%",
                                padding: "10px 14px",
                                backgroundColor: "#ffffff",
                                color: "#0f172a",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                fontSize: "13.5px",
                                boxSizing: "border-box",
                              }}
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  background: "none",
                                  border: "none",
                                  color: "#64748b",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* View Mode Toggle */}
                          <div style={{ display: "flex", gap: "4px", backgroundColor: "#070f1e", padding: "4px", borderRadius: "6px", border: "1px solid #1e293b" }}>
                            <button
                              type="button"
                              onClick={() => setViewMode("cards")}
                              style={{
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: "700",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                backgroundColor: viewMode === "cards" ? "#2563eb" : "transparent",
                                color: viewMode === "cards" ? "#ffffff" : "#94a3b8",
                                transition: "all 0.15s ease",
                              }}
                            >
                              ▦ Architecture View
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewMode("matrix")}
                              style={{
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: "700",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                backgroundColor: viewMode === "matrix" ? "#2563eb" : "transparent",
                                color: viewMode === "matrix" ? "#ffffff" : "#94a3b8",
                                transition: "all 0.15s ease",
                              }}
                            >
                              ▤ SLA Metrics Grid
                            </button>
                          </div>
                        </div>

                        {/* Domain Filter Badges Row */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginRight: "4px" }}>
                            Filter by Domain:
                          </span>
                          {domainTabs.map((tab) => {
                            const isSelected = activeDomain === tab.id;
                            const count = tab.id === "all"
                              ? initialProjects.length
                              : initialProjects.filter((p) => matchesDomain(p, tab.id)).length;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveDomain(tab.id)}
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  padding: "6px 14px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                  backgroundColor: isSelected ? "#2563eb" : "#111e38",
                                  color: isSelected ? "#ffffff" : "#e2e8f0",
                                  border: isSelected ? "1px solid #2563eb" : "1px solid #1e293b",
                                }}
                              >
                                {tab.label} <span style={{ opacity: 0.8, fontSize: "11px" }}>({count})</span>
                              </button>
                            );
                          })}

                          {(activeDomain !== "all" || searchQuery) && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDomain("all");
                                setSearchQuery("");
                              }}
                              style={{
                                fontSize: "12px",
                                color: "#38bdf8",
                                textDecoration: "underline",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                marginLeft: "auto",
                              }}
                            >
                              Reset Filters
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Status Counter */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", fontSize: "13px", color: "#475569" }}>
                        <span>
                          Showing <strong>{filteredProjects.length}</strong> of <strong>{initialProjects.length}</strong> production architectures
                          {activeDomain !== "all" && <> in <em>{domainTabs.find((d) => d.id === activeDomain)?.label}</em></>}
                          {searchQuery && <> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</>}
                        </span>
                      </div>

                      {/* Interactive Architecture Explorer */}
                      <ArchitectureTopologyExplorer />

                      {/* Projects Render: Cards View */}
                      {viewMode === "cards" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                          {filteredProjects.length === 0 ? (
                            <div
                              style={{
                                padding: "40px 20px",
                                textAlign: "center",
                                backgroundColor: "#f8fafc",
                                border: "1px dashed #cbd5e1",
                                borderRadius: "4px",
                                color: "#64748b",
                              }}
                            >
                              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔍</div>
                              <h3 style={{ margin: "0 0 6px 0", color: "#0f172a" }}>No matching production systems found</h3>
                              <p style={{ margin: "0 0 16px 0", fontSize: "13px" }}>
                                Try searching for another keyword or clear your active filters.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDomain("all");
                                  setSearchQuery("");
                                }}
                                style={{
                                  padding: "8px 18px",
                                  backgroundColor: "#2563eb",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  transition: "background-color 0.15s ease",
                                }}
                              >
                                View All 7 Projects
                              </button>
                            </div>
                          ) : (
                            filteredProjects.map((project) => (
                              <article
                                key={project.id || project.slug}
                                id={project.slug}
                                style={{
                                  padding: "24px",
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #e2e8f0",
                                  borderLeft: "4px solid #2563eb",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 8px -2px rgba(11, 19, 43, 0.05)",
                                }}
                              >
                                {/* Card Header Row */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "baseline",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <h3 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>
                                    <Link
                                      href={`/projects/${project.slug}`}
                                      style={{ color: "#0f172a", textDecoration: "none" }}
                                    >
                                      {project.title}
                                    </Link>
                                  </h3>
                                  <span
                                    style={{
                                      fontSize: "12.5px",
                                      fontWeight: "bold",
                                      color: "#047857",
                                      backgroundColor: "#ecfdf5",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      border: "1px solid #a7f3d0",
                                    }}
                                  >
                                    {project.priceTag || "Scoped Contract"}
                                  </span>
                                </div>

                                {/* Metadata Strip */}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "16px",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    marginBottom: "12px",
                                    fontSize: "12.5px",
                                    color: "#334155",
                                  }}
                                >
                                  <span>
                                    🏢 Client: <strong>{project.clientName || "Confidential Client"}</strong>
                                  </span>
                                  <span>•</span>
                                  <span style={{ color: "#047857", fontWeight: "bold" }}>
                                    ⚡ SLA Impact: {project.impactMetric}
                                  </span>
                                </div>

                                {/* Summary & Optional Cover Thumbnail */}
                                <div style={{ display: "flex", gap: "18px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "16px" }}>
                                  {project.imageUrl && (
                                    <div
                                      style={{
                                        width: "140px",
                                        height: "95px",
                                        borderRadius: "6px",
                                        overflow: "hidden",
                                        backgroundColor: "#071324",
                                        border: "1px solid #cbd5e1",
                                        flexShrink: 0,
                                        position: "relative",
                                      }}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                      />
                                      {project.screenshots && project.screenshots.length > 0 && (
                                        <div
                                          style={{
                                            position: "absolute",
                                            bottom: "4px",
                                            right: "4px",
                                            backgroundColor: "rgba(11, 19, 43, 0.9)",
                                            color: "#ffffff",
                                            fontSize: "10px",
                                            fontWeight: "700",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                          }}
                                        >
                                          📷 {project.screenshots.length}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div style={{ flex: 1, minWidth: "260px" }}>
                                    <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
                                      {project.summary}
                                    </p>
                                  </div>
                                </div>

                                {/* Tech Stack Tags */}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "6px",
                                    flexWrap: "wrap",
                                    marginBottom: "16px",
                                  }}
                                >
                                  {(project.techStack || []).map((tech) => (
                                    <button
                                      key={tech}
                                      type="button"
                                      onClick={() => setSearchQuery(tech)}
                                      title={`Filter systems by ${tech}`}
                                      style={{
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                        backgroundColor: searchQuery.toLowerCase() === tech.toLowerCase() ? "#2563eb" : "#f1f5f9",
                                        border: searchQuery.toLowerCase() === tech.toLowerCase() ? "1px solid #2563eb" : "1px solid #cbd5e1",
                                        color: searchQuery.toLowerCase() === tech.toLowerCase() ? "#ffffff" : "#334155",
                                        padding: "3px 9px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        transition: "all 0.12s ease",
                                      }}
                                    >
                                      #{tech}
                                    </button>
                                  ))}
                                </div>

                                {/* Action Links Row */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "12px",
                                    paddingTop: "14px",
                                    borderTop: "1px solid #f1f5f9",
                                  }}
                                >
                                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                                    {project.demoUrl && (
                                      <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          fontSize: "12.5px",
                                          fontWeight: "bold",
                                          color: "#2563eb",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Live Demo ↗
                                      </a>
                                    )}
                                    {project.githubUrl && (
                                      <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          fontSize: "12.5px",
                                          fontWeight: "bold",
                                          color: "#2563eb",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        GitHub Repository ↗
                                      </a>
                                    )}
                                  </div>

                                  <Link
                                    href={`/projects/${project.slug}`}
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: "bold",
                                      color: "#ffffff",
                                      backgroundColor: "#2563eb",
                                      padding: "8px 16px",
                                      borderRadius: "6px",
                                      textDecoration: "none",
                                      display: "inline-block",
                                      transition: "background-color 0.15s ease",
                                    }}
                                  >
                                    Read Technical Case Study &nbsp;›
                                  </Link>
                                </div>
                              </article>
                            ))
                          )}
                        </div>
                      )}

                      {/* Projects Render: SLA Metrics Matrix View */}
                      {viewMode === "matrix" && (
                        <div className="table-responsive-container" style={{ overflowX: "auto", marginBottom: "24px", borderRadius: "8px", border: "1px solid #cbd5e1", boxShadow: "0 2px 8px -2px rgba(11, 19, 43, 0.05)" }}>
                          <table
                            style={{
                              width: "100%",
                              minWidth: "680px",
                              borderCollapse: "collapse",
                              fontSize: "13px",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <thead>
                              <tr style={{ backgroundColor: "#0b132b", color: "#ffffff", textAlign: "left" }}>
                                <th style={{ padding: "12px 16px", borderBottom: "2px solid #1e293b", fontWeight: "700" }}>System Architecture</th>
                                <th style={{ padding: "12px 16px", borderBottom: "2px solid #1e293b", fontWeight: "700" }}>Client / Domain</th>
                                <th style={{ padding: "12px 16px", borderBottom: "2px solid #1e293b", fontWeight: "700" }}>Verified SLA Metric</th>
                                <th style={{ padding: "12px 16px", borderBottom: "2px solid #1e293b", fontWeight: "700" }}>Core Stack</th>
                                <th style={{ padding: "12px 16px", borderBottom: "2px solid #1e293b", fontWeight: "700" }}>Scope Tier</th>
                                <th style={{ padding: "12px 16px", borderBottom: "2px solid #1e293b", fontWeight: "700" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredProjects.map((p, idx) => (
                                <tr
                                  key={p.slug}
                                  style={{
                                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                                    borderBottom: "1px solid #e2e8f0",
                                  }}
                                >
                                  <td style={{ padding: "12px 16px", fontWeight: "700", color: "#0f172a" }}>
                                    <Link href={`/projects/${p.slug}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                                      {p.title}
                                    </Link>
                                  </td>
                                  <td style={{ padding: "12px 16px", color: "#475569" }}>
                                    {p.clientName || "Confidential"}
                                  </td>
                                  <td style={{ padding: "12px 16px", color: "#047857", fontWeight: "700" }}>
                                    ⚡ {p.impactMetric}
                                  </td>
                                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "#334155" }}>
                                    {(p.techStack || []).slice(0, 3).join(", ")}
                                  </td>
                                  <td style={{ padding: "12px 16px", color: "#047857", fontWeight: "700" }}>
                                    <span style={{ backgroundColor: "#ecfdf5", padding: "3px 8px", borderRadius: "4px", border: "1px solid #a7f3d0" }}>
                                      {p.priceTag}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px 16px" }}>
                                    <Link
                                      href={`/projects/${p.slug}`}
                                      style={{
                                        fontSize: "12.5px",
                                        fontWeight: "700",
                                        color: "#2563eb",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      Case Study &rsaquo;
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Interactive SQL Performance Explorer */}
                      <SqlOptimizationExplorer />
                    </div>
                  </div>
                </div>

                {/* Secondary Sidebar */}
                <div className="sidebar secondary-sidebar">
                  {/* Quick Consultation Widget */}
                  <div className="widget" id="wdgt-contact">
                    <strong className="heading4 widget-title">
                      <a href="/pricing#inquiry">Discuss a Project</a>
                    </strong>
                    <div className="description">
                      <p>
                        Need a high-throughput API, database performance audit, or Next.js edge platform architected to strict performance SLAs?
                      </p>
                      <div style={{ padding: "10px 0" }}>
                        <Link
                          className="btn"
                          href="/pricing#inquiry"
                          style={{
                            display: "block",
                            textAlign: "center",
                            padding: "10px 16px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            fontWeight: "bold",
                            textDecoration: "none",
                            borderRadius: "6px",
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          Request Project Quote ›
                        </Link>
                      </div>
                      <div style={{ fontSize: "12px", color: "#334155", marginTop: "6px" }}>
                        Typical response within 24 hours.
                      </div>
                    </div>
                  </div>

                  {/* Architecture Competencies Widget */}
                  <div className="widget amp-include" id="wdgt-competencies">
                    <strong className="heading4 widget-title">
                      <a href="/#competencies">Architecture Specialties</a>
                    </strong>
                    <div className="description">
                      <ul style={{ margin: "0", paddingLeft: "18px", fontSize: "13px", lineHeight: "1.8" }}>
                        <li><strong>Distributed Pipelines</strong> (Go, Kafka, Redis)</li>
                        <li><strong>Next.js 16 Edge Deployments</strong> (Cloudflare)</li>
                        <li><strong>PostgreSQL Query Optimization</strong> (EXPLAIN ANALYZE)</li>
                        <li><strong>Enterprise Search &amp; RAG</strong> (pgvector)</li>
                        <li><strong>High-Concurrency WebSocket Fan-Out</strong></li>
                      </ul>
                    </div>
                  </div>

                  {/* Client Testimonial Widget */}
                  <div className="widget amp-include" id="wdgt-review">
                    <strong className="heading4 widget-title">
                      <a href="/#feedback">Client Feedback</a>
                    </strong>
                    <div className="description">
                      <blockquote
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          lineHeight: "1.6",
                          color: "#334155",
                          fontStyle: "italic",
                          borderLeft: "3px solid #2563eb",
                          paddingLeft: "12px",
                        }}
                      >
                        &ldquo;Abu Hanif transformed our core telemetry architecture in three weeks. Cut P99 latency by 75% and reduced our infrastructure bill by 64%.&rdquo;
                      </blockquote>
                      <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: "bold", color: "#0f172a" }}>
                        - VP of Engineering, Apex Telemetry Labs
                      </div>
                    </div>
                  </div>

                  {/* Admin Shortcut */}
                  <div className="widget" id="wdgt-admin">
                    <div style={{ padding: "14px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}>
                      <strong style={{ color: "#0f172a" }}>Project Management Portal</strong>
                      <p style={{ margin: "4px 0 8px 0", color: "#334155" }}>
                        Add, edit, or delete portfolio projects and manage client inquiries.
                      </p>
                      <Link
                        href="/admin"
                        style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "underline" }}
                      >
                        Open Admin Panel ›
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stpr"></div>
            </div>

            {/* Bottom Contact Stripe */}
            <div className="stripes detailedform" id="stripe-01">
              <div className="stripewrap">
                <div className="widget contactform" id="bottom-scf">
                  <div className="formdesc">
                    <span className="free-consultation">Technical Consultation</span>
                    <span className="phone-numbers">
                      abuhanifmain@gmail.com <br />
                      +880 1700-000000
                    </span>
                  </div>
                  <div style={{ padding: "0 0 10px 0" }}>
                    <p>
                      Have an architectural bottleneck or ambitious technical roadmap? Get in touch with Abu Hanif directly for a scoping discussion.
                    </p>
                  </div>
                </div>
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
