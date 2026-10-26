"use client";

import Image from "next/image";

export default function BioAndCredentials() {
  function handleOpenCertificate(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.hash = "#certificate-modal";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  return (
    <>
      {/* Desktop Profile Pic Float */}
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

      {/* Facebook-Style Native Mobile Profile Card (Visible on <= 768px only) */}
      <div className="mobile-profile-card">
        <div style={{ position: "relative", width: "96px", height: "96px", marginBottom: "12px" }}>
          <Image
            src="/images/profile.png"
            alt="MD Abu Hanif Mia"
            width={96}
            height={96}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #2563eb",
              boxShadow: "0 4px 12px rgba(11,25,44,0.25)",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              backgroundColor: "#10b981",
              color: "#050e1d",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "900",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            ✓
          </span>
        </div>
        <h2 style={{ fontSize: "20px", margin: "0 0 4px 0", color: "#0f172a", fontWeight: "800" }}>
          MD Abu Hanif Mia (Abu Hanif)
        </h2>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
          Staff Software Engineer &amp; Systems Architect
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0", padding: "3px 8px", borderRadius: "12px" }}>
            ● Available for Contracts
          </span>
          <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#0f172a", border: "1px solid #cbd5e1", padding: "3px 8px", borderRadius: "12px" }}>
            Batch-12 • ID: WEB12-3991
          </span>
        </div>
        <div style={{ display: "flex", width: "100%", gap: "8px" }}>
          <a
            href="#contactform"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "4px",
              fontWeight: "700",
              fontSize: "12px",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Discuss Project &rsaquo;
          </a>
          <button
            type="button"
            onClick={handleOpenCertificate}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#f1f5f9",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Inspect Certificate ↗
          </button>
        </div>
      </div>

      <h1 id="about" className="heading-about-desktop" style={{ marginTop: 0, color: "#0f172a" }}>
        MD Abu Hanif Mia (Abu Hanif)
      </h1>
      <strong className="heading4 heading-title-desktop" style={{ color: "#2563eb", marginTop: 0, display: "block" }}>
        Staff Software Engineer &amp; Systems Architect
      </strong>

      <p style={{ lineHeight: "1.7", color: "#334155" }}>
        <strong>MD Abu Hanif Mia</strong> (known professionally as <strong>Abu Hanif</strong>) is a{" "}
        <strong>Staff Software Engineer and Systems Architect</strong> holding a{" "}
        <strong>Bachelor of Science in Computer Science &amp; Engineering (B.Sc. in CSE)</strong> with over 9 years of
        hands-on experience designing high-concurrency, fault-tolerant production platforms for startups and enterprise
        organizations worldwide. He combines modern <strong>Next.js 16 App Router</strong>,{" "}
        <strong>React 19</strong>, and <strong>Cloudflare Edge</strong> delivery with low-level systems programming in{" "}
        <strong>Rust (Tokio/Axum)</strong>, <strong>Go</strong>, and high-throughput <strong>PostgreSQL 16</strong>{" "}
        database architecture. Formally recognized with the{" "}
        <em>Certificate of Completion with Excellence</em> from <strong>Programming Hero</strong> (Batch-12 •{" "}
        <code>WEB12-3991</code>) and verified <strong>freeCodeCamp</strong> accreditations across JavaScript,
        TypeScript, and Python, he pairs deep computer science fundamentals with rapid full-stack execution.
      </p>
      <p style={{ lineHeight: "1.7", color: "#334155" }}>
        Specializing in distributed systems, PostgreSQL query tuning, Cloudflare Pages, and memory-safe concurrent
        backends, Abu Hanif operates at the intersection of clean architecture, database performance, and edge network
        delivery. Whether eliminating complex architectural bottlenecks, restructuring legacy codebases, or
        deploying new greenfield products from technical requirements to production, Abu Hanif brings over 9 years
        of battle-tested engineering leadership. Every system is built with high observability, rigorous test
        coverage, and strict performance SLAs.
      </p>

      {/* VERIFIED CERTIFICATIONS & ACCREDITATIONS SECTION */}
      <div
        id="competencies"
        style={{
          margin: "32px 0",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderTop: "4px solid #2563eb",
          borderRadius: "8px",
          padding: "24px 28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "14px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "10px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: "800",
              }}
            >
              Verified Certifications &amp; Technical Accreditations
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#475569" }}>
              Formally accredited training and verified software development credentials:
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCertificate}
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#0f172a",
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              padding: "6px 14px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🔍 Expand Certificate Modal
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Credential 1: Programming Hero */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
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
                  borderRadius: "4px",
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
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(11,25,44,0.45)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  🔍 Click to Inspect Full Size
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb", textTransform: "uppercase" }}>
                Programming Hero
              </span>
              <h4 style={{ margin: "2px 0 4px 0", fontSize: "14px", color: "#0f172a" }}>
                Complete Web Development Course with Excellence
              </h4>
              <div style={{ fontSize: "11.5px", color: "#334155", fontWeight: 700, marginBottom: "6px" }}>
                Batch-12 • Credential ID:{" "}
                <span style={{ fontFamily: "monospace", color: "#2563eb" }}>WEB12-3991</span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                Rigorous training across modern JavaScript, React, HTML5/CSS3, asynchronous state handling, and
                multi-tier production projects under CEO Jhankar Mahbub.
              </p>
            </div>
            <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px dotted #e2e8f0" }}>
              <button
                type="button"
                onClick={handleOpenCertificate}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#2563eb",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Verify &amp; View Credential ›
              </button>
            </div>
          </div>

          {/* Credential 2: freeCodeCamp */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
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
                  background: "#070f1e",
                  color: "#fde047",
                  fontWeight: "bold",
                  fontSize: "11px",
                  borderRadius: "3px",
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
              <h4 style={{ margin: "2px 0 6px 0", fontSize: "14px", color: "#0f172a" }}>
                JavaScript, TypeScript &amp; Python Accreditations
              </h4>
              <ul style={{ margin: "0 0 10px 16px", padding: 0, fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                <li>
                  <strong>JavaScript Algorithms &amp; Data Structures:</strong> Algorithmic problem solving, recursion,
                  OOP &amp; functional programming.
                </li>
                <li>
                  <strong>TypeScript Platform Development:</strong> Static typing, generics, strict compiler configs,
                  and interface design.
                </li>
                <li>
                  <strong>Scientific Computing with Python:</strong> Data manipulation, automation scripting, algorithms,
                  and backend utilities.
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
              borderRadius: "6px",
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
                  borderRadius: "3px",
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
              <h4 style={{ margin: "2px 0 6px 0", fontSize: "14px", color: "#0f172a" }}>
                Rust &amp; Go Production Pipelines
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                Engineering zero-cost abstractions, fearless memory safety without garbage collection pauses (Rust/Tokio/Axum),
                and lock-free concurrent workers (Go goroutines) for sub-25ms edge telemetry.
              </p>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "10px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  Rust Tokio
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  WebAssembly
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  Go CSP
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
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
