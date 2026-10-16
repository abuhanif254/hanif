"use client";

import React, { useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

export default function ResumePage() {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  function handleCopyText() {
    const plainText = `
MD ABU HANIF MIA (ABU HANIF)
Staff Software Engineer & Systems Architect
Dhaka, Bangladesh | Global Remote (US Pacific, Central European, Asia Timezones)
Email: contact@abuhanif.dev | Portfolio: https://abuhanif.dev

EXECUTIVE SUMMARY
Senior Full-Stack Software Engineer & Systems Architect with 9+ years of production experience architecting high-concurrency distributed systems, edge-computed web applications, and database infrastructure. Battle-tested track record maintaining 99.99% production uptime for 10M+ daily users, cutting global P99 latency below 25ms, and reducing cloud infrastructure costs by up to 64%.

CORE TECHNICAL SKILLS
- Languages: TypeScript, Go, JavaScript, Python, SQL (PostgreSQL), HTML5, CSS3
- Frameworks & Edge: Next.js 16 (App Router, Server Components), React 19, Cloudflare Pages & Workers, Node.js, FastAPI, Tailwind CSS
- Data & Storage: PostgreSQL, Supabase, TimescaleDB, Redis Cluster, pgvector (AI RAG), Prisma
- Infrastructure & Cloud: Cloudflare Edge (330+ Cities), AWS (ECS, Lambda, S3), Docker, Terraform, GitHub Actions CI/CD
- Architecture: Distributed Systems, High-Throughput APIs, Event-Driven Architecture, Microservices to Modular Monoliths, Zero-Trust Auth (OAuth2, Passkeys, RLS)

PROFESSIONAL EXPERIENCE

Staff Software Engineer & Systems Architect | Independent Advisory & Consulting
2022 – Present
- Architected and delivered high-throughput streaming and edge web applications for international startups and mid-market enterprises.
- Designed real-time financial telemetry pipeline processing 12,000,000 events/second at peak with sub-22ms P99 delivery to browser clients.
- Re-architected multi-tenant e-commerce platform onto Cloudflare Pages and Supabase PostgreSQL, reducing initial page render from 1.8s to 95ms worldwide and cutting cloud bills by 64%.
- Conducted deep PostgreSQL query audits, diagnosing slow query plans and designing composite partial indexes to achieve 10x throughput improvement.

Lead Full-Stack Engineer | Distributed Systems & Web Platforms
2019 – 2022
- Led a 7-engineer cross-functional team delivering mission-critical SaaS platforms from architecture design to production rollout.
- Introduced strict TypeScript guidelines, automated CI/CD deployment pipelines, and end-to-end integration test suites resulting in zero critical production bugs across 14 quarters.
- Engineered high-throughput WebSocket microservices handling 45,000 concurrent live sessions.

Senior Software Engineer | Backend & Cloud Infrastructure
2016 – 2019
- Developed RESTful APIs, asynchronous job queues, and caching layers with Go and Redis.
- Optimized relational database schemas and automated migration rollbacks for high-availability production clusters.
- Mentored junior and mid-level software engineers on clean architecture patterns, code reviews, and observability.

SELECTED SHIPPED PRODUCTION ARCHITECTURES
1. Real-Time Financial Telemetry Pipeline (Go, Next.js, Redis, TimescaleDB, WebSockets) - 12M events/sec, <22ms P99.
2. Cloudflare Edge Multi-Tenant E-Commerce Platform (Next.js 16, Cloudflare Pages, Supabase) - 95ms P99, +28% checkout conversion.
3. Enterprise AI Document Search & RAG Pipeline (FastAPI, pgvector, Next.js, Hybrid Search) - 500k+ docs, 82% search speedup.
4. High-Concurrency PostgreSQL Optimization & RLS Hardening - 10x throughput, sub-5ms query latency.

EDUCATION & CERTIFICATIONS
- Bachelor of Science in Computer Science & Engineering (B.Sc. in CSE)
- Certified Cloud & Distributed Systems Practitioner
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(plainText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  }

  return (
    <div id="source-page-root" data-source-path="/resume">
      <div id="source-page-body" className="source-page-body js l2 section_10 justia-robertjfleming-com">
        <SiteHeader activePath="/resume" />

        <div className="index" id="container">
          <div className="cwrap">
            {/* Header / Banner Strip */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <h1 style={{ margin: 0, fontSize: "28px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Curriculum Vitae &amp; Engineering Dossier
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          MD Abu Hanif Mia • Staff Software Engineer &amp; Systems Architect • 9+ Years Track Record
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <Link href="/">Home</Link> &gt; <span>Resume / CV</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    {/* Resume Action Bar (Hidden during print) */}
                    <div
                      className="resume-action-bar no-print"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#083155",
                        color: "#ffffff",
                        padding: "12px 18px",
                        borderRadius: "4px",
                        marginBottom: "24px",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "15px", color: "#ffffff" }}>
                          Verified Engineering Credentials
                        </strong>
                        <span style={{ fontSize: "13px", color: "#e2e8f0", display: "block" }}>
                          ATS-Compatible Format • Available for High-Impact Contracts
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={handlePrint}
                          style={{
                            background: "#9CBE41",
                            color: "#041f36",
                            border: "none",
                            borderRadius: "3px",
                            padding: "8px 16px",
                            fontWeight: "800",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          🖨️ Print / Save as PDF
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyText}
                          style={{
                            background: "#042442",
                            color: copied ? "#4ade80" : "#9CBE41",
                            border: "1px solid #0a365c",
                            borderRadius: "3px",
                            padding: "8px 14px",
                            fontWeight: "bold",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          {copied ? "✓ Copied Plain Text!" : "📋 Copy ATS Text"}
                        </button>
                      </div>
                    </div>

                    {/* Resume Printable Paper Container */}
                    <div
                      className="resume-paper"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        padding: "36px 40px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        color: "#1e293b",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        lineHeight: "1.6",
                      }}
                    >
                      {/* Paper Header */}
                      <div style={{ borderBottom: "2px solid #053056", paddingBottom: "18px", marginBottom: "24px" }}>
                        <h1 style={{ margin: "0 0 4px 0", fontSize: "30px", color: "#053056", fontWeight: "bold" }}>
                          MD Abu Hanif Mia
                        </h1>
                        <div style={{ fontSize: "17px", fontWeight: "bold", color: "#9CBE41", marginBottom: "10px" }}>
                          Staff Software Engineer &amp; Systems Architect
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "13px", color: "#475569" }}>
                          <span>📍 <strong>Location:</strong> Dhaka, Bangladesh (Global Remote)</span>
                          <span>✉️ <strong>Direct:</strong> <a href="mailto:contact@abuhanif.dev" style={{ color: "#053056", fontWeight: "bold" }}>contact@abuhanif.dev</a></span>
                          <span>🌐 <strong>Portfolio:</strong> <a href="https://abuhanif.dev" style={{ color: "#053056" }}>https://abuhanif.dev</a></span>
                          <span>⏱️ <strong>Timezones:</strong> US Pacific (UTC-8) • Europe (UTC+2) • Asia (UTC+6)</span>
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <div style={{ marginBottom: "26px" }}>
                        <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "0 0 10px 0" }}>
                          Executive Summary
                        </h2>
                        <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>
                          Senior Full-Stack Software Engineer &amp; Systems Architect with <strong>9+ years of verified production experience</strong> architecting high-concurrency distributed backends, edge-computed web applications, and database infrastructure. Battle-tested track record maintaining <strong>99.99% production uptime</strong> for 10M+ daily users, cutting global P99 latency below 25ms, and eliminating thousands of dollars in monthly cloud compute waste. Available for high-impact contracts, fractional Staff roles, and architectural advisory.
                        </p>
                      </div>

                      {/* Technical Competencies Matrix */}
                      <div style={{ marginBottom: "26px" }}>
                        <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "0 0 10px 0" }}>
                          Technical Competencies Matrix
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
                          <div style={{ background: "#f8fafc", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "3px" }}>
                            <strong style={{ color: "#053056", display: "block", marginBottom: "4px" }}>Core Languages &amp; Runtimes</strong>
                            TypeScript, JavaScript (ESNext), Go (Golang), Python, SQL (PostgreSQL/TimescaleDB), HTML5, CSS3
                          </div>
                          <div style={{ background: "#f8fafc", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "3px" }}>
                            <strong style={{ color: "#053056", display: "block", marginBottom: "4px" }}>Frameworks &amp; Edge Delivery</strong>
                            Next.js 16 (App Router, RSC), React 19, Cloudflare Pages &amp; Workers, Node.js, FastAPI, Tailwind CSS
                          </div>
                          <div style={{ background: "#f8fafc", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "3px" }}>
                            <strong style={{ color: "#053056", display: "block", marginBottom: "4px" }}>Databases &amp; Vector Search</strong>
                            PostgreSQL 16, Supabase, TimescaleDB (Time-Series), Redis Cluster, pgvector (Semantic RAG), Prisma
                          </div>
                          <div style={{ background: "#f8fafc", padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: "3px" }}>
                            <strong style={{ color: "#053056", display: "block", marginBottom: "4px" }}>DevOps, Security &amp; Infra</strong>
                            Cloudflare Edge, AWS (ECS, Lambda, S3), Docker, Terraform, GitHub Actions CI/CD, OAuth2/OIDC, RLS
                          </div>
                        </div>
                      </div>

                      {/* Professional Experience */}
                      <div style={{ marginBottom: "26px" }}>
                        <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "0 0 16px 0" }}>
                          Professional Experience
                        </h2>

                        {/* Experience 1 */}
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                            <strong style={{ fontSize: "16px", color: "#053056" }}>
                              Staff Software Engineer &amp; Systems Architect
                            </strong>
                            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#334155" }}>
                              2022 – Present | Independent Practice
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", fontStyle: "italic", color: "#475569", marginBottom: "8px" }}>
                            Specialized Advisory, Greenfield Architecture &amp; High-Throughput Distributed Contracts
                          </div>
                          <ul style={{ margin: "0 0 0 18px", padding: 0, fontSize: "13.5px", color: "#334155" }}>
                            <li style={{ marginBottom: "6px" }}>
                              Architected and shipped an event-driven telemetry pipeline ingesting 12M events/sec with sub-22ms P99 delivery to 45,000 active WebSocket clients.
                            </li>
                            <li style={{ marginBottom: "6px" }}>
                              Migrated legacy server-rendered monoliths to Next.js 16 on Cloudflare Pages and Supabase PostgreSQL, reducing initial page render from 1.8s down to 95ms and cloud hosting bills by 64%.
                            </li>
                            <li style={{ marginBottom: "6px" }}>
                              Delivered comprehensive PostgreSQL database audits for high-traffic platforms, optimizing query plans with EXPLAIN ANALYZE and achieving 10x throughput increases.
                            </li>
                            <li style={{ marginBottom: "6px" }}>
                              Integrated autonomous AI retrieval pipelines indexing 500k+ documents into pgvector embeddings, cutting internal documentation lookup times by 82%.
                            </li>
                          </ul>
                        </div>

                        {/* Experience 2 */}
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                            <strong style={{ fontSize: "16px", color: "#053056" }}>
                              Lead Full-Stack Software Engineer
                            </strong>
                            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#334155" }}>
                              2019 – 2022 | Distributed Cloud Platforms
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", fontStyle: "italic", color: "#475569", marginBottom: "8px" }}>
                            Technical Leadership, Platform Engineering &amp; Team Mentorship
                          </div>
                          <ul style={{ margin: "0 0 0 18px", padding: 0, fontSize: "13.5px", color: "#334155" }}>
                            <li style={{ marginBottom: "6px" }}>
                              Led architecture and delivery across a team of 7 senior software engineers, maintaining 99.99% production uptime SLAs for enterprise SaaS clients.
                            </li>
                            <li style={{ marginBottom: "6px" }}>
                              Standardized company-wide strict TypeScript type-checking, automated CI/CD quality gates, and Docker build pipelines, eliminating deployment friction.
                            </li>
                            <li style={{ marginBottom: "6px" }}>
                              Engineered high-concurrency WebSocket channels supporting 45,000 simultaneous live clients with automatic failover and reconnect backoff.
                            </li>
                          </ul>
                        </div>

                        {/* Experience 3 */}
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                            <strong style={{ fontSize: "16px", color: "#053056" }}>
                              Senior Backend &amp; Cloud Engineer
                            </strong>
                            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#334155" }}>
                              2016 – 2019 | Enterprise Solutions
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", fontStyle: "italic", color: "#475569", marginBottom: "8px" }}>
                            API Engineering, Database Optimization &amp; Async Job Processing
                          </div>
                          <ul style={{ margin: "0 0 0 18px", padding: 0, fontSize: "13.5px", color: "#334155" }}>
                            <li style={{ marginBottom: "6px" }}>
                              Engineered mission-critical microservice APIs with Go and Node.js, utilizing Redis pub/sub backbones for background job dispatch.
                            </li>
                            <li style={{ marginBottom: "6px" }}>
                              Modeled relational PostgreSQL schemas with automated zero-downtime database migrations.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Selected Case Studies & Production Systems */}
                      <div style={{ marginBottom: "26px" }}>
                        <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "0 0 12px 0" }}>
                          Selected Shipped Systems &amp; Measured SLAs
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
                          <div style={{ borderLeft: "3px solid #053056", paddingLeft: "10px" }}>
                            <strong style={{ color: "#053056" }}>Real-Time Financial Telemetry Pipeline</strong>
                            <p style={{ margin: "2px 0 0 0", color: "#475569" }}>
                              Go, Next.js, Redis, TimescaleDB • <strong>12M events/s • &lt;22ms P99</strong>
                            </p>
                          </div>
                          <div style={{ borderLeft: "3px solid #053056", paddingLeft: "10px" }}>
                            <strong style={{ color: "#053056" }}>Cloudflare Edge Multi-Tenant E-Commerce</strong>
                            <p style={{ margin: "2px 0 0 0", color: "#475569" }}>
                              Next.js 16, Cloudflare Pages, Supabase • <strong>95ms P99 • +28% Conversion</strong>
                            </p>
                          </div>
                          <div style={{ borderLeft: "3px solid #053056", paddingLeft: "10px" }}>
                            <strong style={{ color: "#053056" }}>Enterprise AI Knowledge Search &amp; RAG</strong>
                            <p style={{ margin: "2px 0 0 0", color: "#475569" }}>
                              FastAPI, pgvector, Next.js • <strong>500k+ Docs • 82% Faster Discovery</strong>
                            </p>
                          </div>
                          <div style={{ borderLeft: "3px solid #053056", paddingLeft: "10px" }}>
                            <strong style={{ color: "#053056" }}>PostgreSQL Query Tuning &amp; Index Audit</strong>
                            <p style={{ margin: "2px 0 0 0", color: "#475569" }}>
                              Postgres 16, Supabase RLS • <strong>10x Query Speedup • 0 Deadlocks</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Formal Education & Certifications */}
                      <div>
                        <h2 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", margin: "0 0 10px 0" }}>
                          Education &amp; Credentials
                        </h2>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", fontSize: "13.5px" }}>
                          <div>
                            <strong style={{ color: "#053056" }}>Bachelor of Science in Computer Science &amp; Engineering (B.Sc. in CSE)</strong>
                          </div>
                          <div style={{ color: "#334155", fontWeight: "bold" }}>
                            4-Year Formal Engineering Degree
                          </div>
                        </div>
                        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569" }}>
                          Specialization: Distributed Algorithms, Database Systems, Computer Networks &amp; Software Architecture.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>

      {/* Print CSS styling for pristine 2-page physical printout / PDF save */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 11pt !important;
          }
          #top-numbers-v3,
          #header,
          #breadcrumbs,
          #img1,
          .imgwrap,
          .no-print,
          #footer,
          .cookie-banner,
          .global-site-footer {
            display: none !important;
          }
          #container,
          .cwrap,
          #main,
          .mwrap,
          #content,
          .bodytext {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .resume-paper {
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          a {
            text-decoration: none !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
