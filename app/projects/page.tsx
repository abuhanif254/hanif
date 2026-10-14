import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "../lib/portfolio-store";

export const metadata: Metadata = {
  title: "Engineering Projects & Systems Showcase | Abu Hanif (MD Abu Hanif Mia)",
  description:
    "Explore production systems, distributed pipelines, Next.js edge applications, and database optimization case studies delivered by Staff Software Engineer Abu Hanif.",
};

export default async function ProjectsIndexPage() {
  const projects = await getProjects();

  return (
    <div id="source-page-root" data-source-path="/projects">
      <div id="source-page-body" className="source-page-body js l2 section_10 justia-robertjfleming-com">
        {/* Sticky Top Bar */}
        <div className="top-numbers-v3 tnv3-sticky" id="top-numbers-v3">
          <ul>
            <li>
              Available for High-Impact Contracts &amp; Consulting: <strong> contact@abuhanif.dev </strong>
              <a className="tnv3-button" href="/#contactform">Request Project Quote</a>
            </li>
          </ul>
        </div>

        <div className="index" id="container">
          <div className="cwrap">
            {/* Header */}
            <div id="header">
              <div className="wrapper">
                <div id="head">
                  <div id="logo">
                    <a data-title="Abu Hanif - Staff Software Engineer" href="/" title="Back to Home">
                      <img alt="Abu Hanif - Staff Software Engineer" id="mainlogo" src="/images/abuhanif-logo-v3.svg" />
                      Abu Hanif Staff Software Engineer Home
                    </a>
                  </div>
                  <div id="tagline">
                    <a href="/#contactform" title="Discuss an Engineering Project">
                      Discuss an Engineering Project with Abu Hanif
                    </a>
                  </div>
                </div>
                <div id="topnav">
                  <ul id="tnav-toplevel">
                    <li className="priority_1" id="fc"><a href="/">Home</a></li>
                    <li className="priority_3"><a href="/#about">About Abu Hanif</a></li>
                    <li className="priority_4"><a href="/#competencies">Engineering Focus</a></li>
                    <li className="selected priority_2"><a href="/projects">Work Showcase</a></li>
                    <li className="priority_4"><a href="/#pricing">Work Prices</a></li>
                    <li className="priority_5"><a href="/blog">Technical Blog</a></li>
                    <li className="priority_6"><a href="/#feedback">Client Feedback</a></li>
                    <li className="category_141"><a href="/admin">Admin Panel</a></li>
                    <li className="contactus priority_1" id="lc"><a href="/#contactform">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div id="ed"></div>
              <div className="clr"></div>
            </div>

            {/* Main Content */}
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
                      <a href="/">Home</a> &gt; <span>Engineering Projects</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      <h2>Production Systems, Distributed Pipelines &amp; Scoped Contracts</h2>
                      <p>
                        Below is a comprehensive catalogue of real-world production systems architected and delivered by <strong>Abu Hanif (MD Abu Hanif Mia)</strong>. Every project details the engineering challenge, architectural topology, technology stack, and verified production SLA outcomes.
                      </p>

                      {/* Filter Badges Strip */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          margin: "20px 0 24px 0",
                          paddingBottom: "14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#053056", alignSelf: "center", marginRight: "4px" }}>
                          Filter by Domain:
                        </span>
                        {["All Systems", "Distributed Systems", "Cloud & Next.js", "PostgreSQL & Databases", "AI & Search"].map((cat, idx) => (
                          <span
                            key={cat}
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              padding: "4px 10px",
                              borderRadius: "3px",
                              backgroundColor: idx === 0 ? "#053056" : "#f1f5f9",
                              color: idx === 0 ? "#ffffff" : "#475569",
                              border: "1px solid " + (idx === 0 ? "#053056" : "#cbd5e1"),
                            }}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Projects Cards List */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {projects.map((project, idx) => (
                          <article
                            key={project.id || project.slug}
                            id={project.slug}
                            style={{
                              padding: "22px 24px",
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              borderLeft: "5px solid #053056",
                              borderRadius: "4px",
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
                                  color: "#16a34a",
                                  backgroundColor: "#ecfdf5",
                                  padding: "3px 10px",
                                  borderRadius: "3px",
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
                                color: "#64748b",
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

                            {/* Summary / Challenge */}
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
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Sidebar */}
                <div className="sidebar secondary-sidebar">
                  {/* Quick Consultation Widget */}
                  <div className="widget" id="wdgt-contact">
                    <strong className="heading4 widget-title">
                      <a href="/#contactform">Discuss a Project</a>
                    </strong>
                    <div className="description">
                      <p>
                        Need a high-throughput API, database performance audit, or Next.js edge platform architected to strict performance SLAs?
                      </p>
                      <div style={{ padding: "10px 0" }}>
                        <a
                          className="btn"
                          href="/#contactform"
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
                        </a>
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
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
                        "Abu Hanif transformed our core telemetry architecture in three weeks. Cut P99 latency by 75% and reduced our infrastructure bill by 64%."
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
                      <p style={{ margin: "4px 0 8px 0", color: "#64748b" }}>
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

            {/* Footer */}
            <div id="footer">
              <div className="fcontainer">
                <div id="address">
                  <div className="slocation location_86">
                    <div><strong>MD Abu Hanif Mia (Abu Hanif)</strong></div>
                    <div>Staff Software Engineer &amp; Systems Architect</div>
                    <div itemProp="streetAddress">Dhaka, Bangladesh / Remote Worldwide</div>
                    <span className="contacts">
                      <span>Email: <a href="mailto:contact@abuhanif.dev">contact@abuhanif.dev</a></span>
                      <span>Phone: +880 1700-000000</span>
                    </span>
                  </div>
                </div>
                <div className="footerlocalities">
                  <div className="block">
                    <span>Available for technical consulting and high-impact software engineering contracts worldwide. Active timezones: US Pacific (UTC-8) to Central European (UTC+2) to Asia/Dhaka (UTC+6).</span>
                  </div>
                </div>
                <div id="footernav">
                  <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/projects">Work Showcase</a></li>
                    <li><a href="/#pricing">Services &amp; Pricing</a></li>
                    <li><a href="/blog">Technical Blog</a></li>
                    <li><a href="/admin" style={{ fontWeight: "bold", color: "#053056" }}>Admin Panel</a></li>
                    <li><a href="/#contactform">Contact</a></li>
                  </ul>
                </div>
                <div className="copyright">
                  <p>Copyright © 2026 MD Abu Hanif Mia. All rights reserved. Deployed to Cloudflare Pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
