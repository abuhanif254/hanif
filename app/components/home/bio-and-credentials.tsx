"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from "lucide-react";

export default function BioAndCredentials() {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  function handleOpenCertificate(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.hash = "#certificate-modal";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  return (
    <>
      {/* Desktop Profile Pic Float (Hidden on Mobile) */}
      <div className="profilepic-wrap-desktop" style={{ position: "relative", float: "right", margin: "0 0 20px 24px" }}>
        <div
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #2563eb",
            background: "radial-gradient(circle at 50% 35%, #1e293b 0%, #0b132b 100%)",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.14)",
          }}
        >
          <Image
            src="/images/profile.png"
            alt="MD Abu Hanif Mia - Staff Software Engineer"
            width={180}
            height={180}
            className="profilepic"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="bio-section-header" style={{ marginBottom: "16px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: "20px", marginBottom: "8px" }}>
          <ShieldCheck size={14} className="text-blue-600" />
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Verified Systems Architect
          </span>
        </div>
        <h1 id="about" className="heading-about-desktop" style={{ margin: "4px 0 2px 0", color: "#0f172a", fontSize: "24px", fontWeight: "800" }}>
          MD Abu Hanif Mia (Abu Hanif)
        </h1>
        <strong className="heading4 heading-title-desktop" style={{ color: "#2563eb", margin: "0 0 14px 0", display: "block", fontSize: "14px" }}>
          Staff Software Engineer &amp; Systems Architect
        </strong>
      </div>

      {/* Primary Bio Paragraphs (Always Visible) */}
      <div className="bio-text-container" style={{ color: "#334155", fontSize: "14.5px", lineHeight: "1.7" }}>
        <p style={{ margin: "0 0 14px 0" }}>
          <strong>MD Abu Hanif Mia</strong> (known professionally as <strong>Abu Hanif</strong>) is a{" "}
          <strong>Staff Software Engineer and Systems Architect</strong> holding a{" "}
          <strong>Bachelor of Science in Computer Science &amp; Engineering (B.Sc. in CSE)</strong> with over 9 years of
          hands-on experience designing high-concurrency, fault-tolerant production platforms for startups and enterprise
          organizations worldwide. He combines modern <strong>Next.js 16 App Router</strong>,{" "}
          <strong>React 19</strong>, and <strong>Cloudflare Edge</strong> delivery with low-level systems programming in{" "}
          <strong>Rust (Tokio/Axum)</strong>, <strong>Go</strong>, and high-throughput <strong>PostgreSQL 16</strong>{" "}
          database architecture. Formally recognized with the{" "}
          <em>Certificate of Completion with Excellence</em> from <strong>Programming Hero</strong> (Batch-12 •{" "}
          <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: "3px", fontSize: "12px", color: "#0f172a" }}>WEB12-3991</code>) and verified <strong>freeCodeCamp</strong> accreditations across JavaScript,
          TypeScript, and Python, he pairs deep computer science fundamentals with rapid full-stack execution.
        </p>

        <p style={{ margin: "0 0 14px 0" }}>
          Specializing in distributed systems, PostgreSQL query tuning, Cloudflare Pages, and memory-safe concurrent
          backends, Abu Hanif operates at the intersection of clean architecture, database performance, and edge network
          delivery. Whether eliminating complex architectural bottlenecks, restructuring legacy codebases, or
          deploying new greenfield products from technical requirements to production, Abu Hanif brings over 9 years
          of battle-tested engineering leadership. Every system is built with high observability, rigorous test
          coverage, and strict performance SLAs.
        </p>

        {/* Expandable Extended Bio on Mobile */}
        <div className={`bio-extended-content ${isBioExpanded ? "block" : "hidden md:block"}`}>
          <p style={{ margin: "0 0 14px 0" }}>
            His core technical philosophy centers on empirical proof of execution: avoiding over-engineered microservice
            sprawl in favor of modular monoliths, pushing computation to the edge via Cloudflare Workers &amp; Pages, and
            extracting maximum throughput from PostgreSQL through connection pooling with PgBouncer, covering indexes, and
            write-ahead log (WAL) change-data-capture streaming.
          </p>
          <p style={{ margin: "0 0 14px 0" }}>
            Beyond systems engineering, Abu Hanif works closely with CTOs, VP of Engineering, and technical founders
            offering fixed-scope sprint execution, zero-budget-creep Statements of Work, and fractional Staff Engineer
            retainers. All deliverables include automated CI/CD pipelines, architectural RFC specifications, full test
            suites, and guaranteed 30-day post-launch warranty support.
          </p>
        </div>

        {/* Mobile Accordion Toggle Button */}
        <div className="md:hidden" style={{ margin: "10px 0 20px 0" }}>
          <button
            type="button"
            onClick={() => setIsBioExpanded(!isBioExpanded)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              width: "100%",
              minHeight: "44px",
              padding: "10px 16px",
              backgroundColor: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
          >
            {isBioExpanded ? (
              <>
                <span>Show Compact Overview</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Read Full Architectural Bio</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* VERIFIED CERTIFICATIONS & ACCREDITATIONS SECTION */}
      <div
        id="competencies"
        style={{
          margin: "24px 0",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderTop: "4px solid #2563eb",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "14px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "12px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: "800",
              }}
            >
              Verified Accreditations &amp; Credentials
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#64748b" }}>
              Formally accredited development distinctions and verified technical certifications:
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCertificate}
            style={{
              fontSize: "12.5px",
              fontWeight: "bold",
              color: "#2563eb",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Award size={16} />
            <span>Inspect Full Certificate</span>
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
          }}
        >
          {/* Credential 1: Programming Hero */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                onClick={handleOpenCertificate}
                style={{
                  position: "relative",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid #2563eb",
                  background: "#f1f5f9",
                  cursor: "pointer",
                }}
              >
                <Image
                  src="/images/programming-hero-certificate.png"
                  alt="Programming Hero Certificate of Completion with Excellence"
                  width={320}
                  height={220}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>

              <div
                style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  background: "#fef3c7",
                  color: "#92400e",
                  fontWeight: "bold",
                  fontSize: "11px",
                  borderRadius: "4px",
                  marginBottom: "6px",
                }}
              >
                ★ Batch-12 Distinction
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#2563eb",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                Programming Hero
              </span>
              <h4 style={{ margin: "2px 0 4px 0", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
                Complete Web Development Course with Excellence
              </h4>
              <p style={{ margin: "0 0 6px 0", fontSize: "11.5px", color: "#047857", fontWeight: "bold" }}>
                Credential ID: WEB12-3991 • Certified by CEO Jhankar Mahbub
              </p>
              <p style={{ margin: "0", fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                Distinction certified across modern JavaScript (ES6+), React 19, HTML5/CSS3 responsive layouts, asynchronous state handling, and multi-tier production architectures.
              </p>
            </div>
            <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px dotted #e2e8f0" }}>
              <button
                type="button"
                onClick={handleOpenCertificate}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  padding: 0,
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>Verify &amp; View Credential</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          {/* Credential 2: freeCodeCamp */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  background: "#0a0a23",
                  color: "#facc15",
                  fontWeight: "bold",
                  fontSize: "11px",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                (fCC) Multi-Track Certified
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#2563eb",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                freeCodeCamp
              </span>
              <h4 style={{ margin: "2px 0 6px 0", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
                JavaScript, TypeScript &amp; Python Accreditations
              </h4>
              <ul style={{ margin: "0 0 10px 16px", padding: 0, fontSize: "12px", color: "#475569", lineHeight: "1.55" }}>
                <li>
                  <strong>JavaScript Algorithms &amp; Data Structures:</strong> Algorithmic problem solving, recursion, OOP &amp; functional programming.
                </li>
                <li>
                  <strong>TypeScript Platform Development:</strong> Static typing, generics, strict compiler configs, and interface design.
                </li>
                <li>
                  <strong>Scientific Computing with Python:</strong> Data manipulation, automation scripting, algorithms, and backend utilities.
                </li>
              </ul>
            </div>
            <div
              style={{
                marginTop: "12px",
                paddingTop: "8px",
                borderTop: "1px dotted #e2e8f0",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#047857",
              }}
            >
              ✓ Verified Curriculum Standard
            </div>
          </div>

          {/* Credential 3: Systems Programming in Rust & Go */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  background: "#431407",
                  color: "#fb923c",
                  fontWeight: "bold",
                  fontSize: "11px",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                🦀 Systems &amp; Concurrency
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#2563eb",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                Systems Architecture
              </span>
              <h4 style={{ margin: "2px 0 6px 0", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
                Rust &amp; Go Production Pipelines
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                Engineering zero-cost abstractions, fearless memory safety without garbage collection pauses (Rust/Tokio/Axum),
                and lock-free concurrent workers (Go goroutines) for sub-25ms edge telemetry.
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", color: "#0f172a" }}>
                  Rust Tokio
                </span>
                <span style={{ fontSize: "11px", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", color: "#0f172a" }}>
                  WebAssembly
                </span>
                <span style={{ fontSize: "11px", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", color: "#0f172a" }}>
                  Go CSP
                </span>
                <span style={{ fontSize: "11px", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", color: "#0f172a" }}>
                  Next.js 16
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: "12px",
                paddingTop: "8px",
                borderTop: "1px dotted #e2e8f0",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#047857",
              }}
            >
              ✓ High-Concurrency Production SLA
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
