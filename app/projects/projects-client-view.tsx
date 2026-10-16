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
                          backgroundColor: "#053056",
                          border: "1px solid #0a365c",
                          borderRadius: "6px",
                          padding: "16px 20px",
                          margin: "24px 0 20px 0",
                          color: "#ffffff",
                        }}
                      >
                        {/* Search Input Row */}
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "14px", alignItems: "center" }}>
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
                                borderRadius: "4px",
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
                          <div style={{ display: "flex", gap: "4px", backgroundColor: "#042442", padding: "3px", borderRadius: "4px", border: "1px solid #0a365c" }}>
                            <button
                              type="button"
                              onClick={() => setViewMode("cards")}
                              style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: "700",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                backgroundColor: viewMode === "cards" ? "#9CBE41" : "transparent",
                                color: viewMode === "cards" ? "#041f36" : "#cbd5e1",
                              }}
                            >
                              ▦ Architecture View
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewMode("matrix")}
                              style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: "700",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                backgroundColor: viewMode === "matrix" ? "#9CBE41" : "transparent",
                                color: viewMode === "matrix" ? "#041f36" : "#cbd5e1",
                              }}
                            >
                              ▤ SLA Metrics Grid
                            </button>
                          </div>
                        </div>

                        {/* Domain Filter Badges Row */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#cbd5e1", marginRight: "4px" }}>
                            Filter by Domain:
                          </span>
                          {domainTabs.map((tab) => {
                            const isSelected = activeDomain === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveDomain(tab.id)}
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  padding: "5px 12px",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                  backgroundColor: isSelected ? "#9CBE41" : "#042442",
                                  color: isSelected ? "#041f36" : "#ffffff",
                                  border: isSelected ? "1px solid #9CBE41" : "1px solid #0a365c",
                                }}
                              >
                                {tab.label}
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
                                fontSize: "11.5px",
                                color: "#93c5fd",
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
                              <h3 style={{ margin: "0 0 6px 0", color: "#053056" }}>No matching production systems found</h3>
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
                                  padding: "8px 16px",
                                  backgroundColor: "#053056",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
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
                                  padding: "22px 24px",
                                  backgroundColor: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  borderLeft: "5px solid #053056",
                                  borderRadius: "4px",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
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
                                    marginBottom: "8px",
                                  }}
                                >
                                  <h3 style={{ margin: 0, fontSize: "21px", color: "#053056" }}>
                                    <Link
                                      href={`/projects/${project.slug}`}
                                      style={{ color: "#053056", textDecoration: "none" }}
                                    >
                                      {project.title}
                                    </Link>
                                  </h3>
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: "bold",
                                      color: "#053056",
                                      backgroundColor: "#ecfdf5",
                                      padding: "3px 10px",
                                      borderRadius: "3px",
                                      border: "1px solid #9CBE41",
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
                                  <span style={{ color: "#053056", fontWeight: "bold" }}>
                                    ⚡ SLA Impact: {project.impactMetric}
                                  </span>
                                </div>

                                {/* Summary */}
                                <p style={{ margin: "0 0 14px 0", fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
                                  {project.summary}
                                </p>

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
                                    <span
                                      key={tech}
                                      style={{
                                        fontSize: "11px",
                                        fontWeight: "bold",
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #cbd5e1",
                                        color: "#334155",
                                        padding: "2px 8px",
                                        borderRadius: "3px",
                                      }}
                                    >
                                      {tech}
                                    </span>
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
                                    paddingTop: "12px",
                                    borderTop: "1px solid #e2e8f0",
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
                                          color: "#053056",
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
                                          color: "#053056",
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
                                      backgroundColor: "#053056",
                                      padding: "6px 14px",
                                      borderRadius: "3px",
                                      textDecoration: "none",
                                      display: "inline-block",
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
                        <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: "13px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            <thead>
                              <tr style={{ backgroundColor: "#053056", color: "#ffffff", textAlign: "left" }}>
                                <th style={{ padding: "10px 14px", border: "1px solid #0a365c" }}>System Architecture</th>
                                <th style={{ padding: "10px 14px", border: "1px solid #0a365c" }}>Client / Domain</th>
                                <th style={{ padding: "10px 14px", border: "1px solid #0a365c" }}>Verified SLA Metric</th>
                                <th style={{ padding: "10px 14px", border: "1px solid #0a365c" }}>Core Stack</th>
                                <th style={{ padding: "10px 14px", border: "1px solid #0a365c" }}>Scope Tier</th>
                                <th style={{ padding: "10px 14px", border: "1px solid #0a365c" }}>Action</th>
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
                                  <td style={{ padding: "12px 14px", fontWeight: "700", color: "#053056" }}>
                                    <Link href={`/projects/${p.slug}`} style={{ color: "#053056" }}>
                                      {p.title}
                                    </Link>
                                  </td>
                                  <td style={{ padding: "12px 14px", color: "#475569" }}>
                                    {p.clientName || "Confidential"}
                                  </td>
                                  <td style={{ padding: "12px 14px", color: "#053056", fontWeight: "700" }}>
                                    ⚡ {p.impactMetric}
                                  </td>
                                  <td style={{ padding: "12px 14px", fontSize: "11.5px", color: "#334155" }}>
                                    {(p.techStack || []).slice(0, 3).join(", ")}
                                  </td>
                                  <td style={{ padding: "12px 14px", color: "#166534", fontWeight: "700" }}>
                                    {p.priceTag}
                                  </td>
                                  <td style={{ padding: "12px 14px" }}>
                                    <Link
                                      href={`/projects/${p.slug}`}
                                      style={{
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        color: "#053056",
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
                            padding: "10px",
                            backgroundColor: "#053056",
                            color: "#ffffff",
                            fontWeight: "bold",
                            textDecoration: "none",
                            borderRadius: "3px",
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
                          borderLeft: "3px solid #9CBE41",
                          paddingLeft: "10px",
                        }}
                      >
                        &ldquo;Abu Hanif transformed our core telemetry architecture in three weeks. Cut P99 latency by 75% and reduced our infrastructure bill by 64%.&rdquo;
                      </blockquote>
                      <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: "bold", color: "#053056" }}>
                        - VP of Engineering, Apex Telemetry Labs
                      </div>
                    </div>
                  </div>

                  {/* Admin Shortcut */}
                  <div className="widget" id="wdgt-admin">
                    <div style={{ padding: "12px", backgroundColor: "#f1f5f9", borderRadius: "3px", border: "1px solid #cbd5e1", fontSize: "12px" }}>
                      <strong>Project Management Portal</strong>
                      <p style={{ margin: "4px 0 8px 0", color: "#334155" }}>
                        Add, edit, or delete portfolio projects and manage client inquiries.
                      </p>
                      <Link
                        href="/admin"
                        style={{ color: "#053056", fontWeight: "bold", textDecoration: "underline" }}
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
                      contact@abuhanif.dev <br />
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
