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
        <Image
          src="/images/profile.png"
          alt="MD Abu Hanif Mia - Staff Software Engineer"
          width={220}
          height={220}
          className="profilepic"
          priority
          style={{
            maxWidth: "220px",
            height: "auto",
            border: "1px solid #d9d9d9",
            padding: "4px",
            borderRadius: "4px",
            background: "#ffffff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "block",
          }}
        />
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
              border: "3px solid #9CBE41",
              boxShadow: "0 4px 12px rgba(5,48,86,0.25)",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              backgroundColor: "#9CBE41",
              color: "#053056",
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
        <h2 style={{ fontSize: "20px", margin: "0 0 4px 0", color: "#053056", fontWeight: "800" }}>
          MD Abu Hanif Mia (Abu Hanif)
        </h2>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#053056", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
          Staff Software Engineer &amp; Systems Architect
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", background: "#ecfdf5", color: "#166534", border: "1px solid #a7f3d0", padding: "3px 8px", borderRadius: "12px" }}>
            ● Available for Contracts
          </span>
          <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#053056", border: "1px solid #cbd5e1", padding: "3px 8px", borderRadius: "12px" }}>
            Batch-12 • ID: WEB12-3991
          </span>
        </div>
        <div style={{ display: "flex", width: "100%", gap: "8px" }}>
          <a
            href="#contactform"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#053056",
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
              backgroundColor: "#9CBE41",
              color: "#053056",
              border: "none",
              borderRadius: "4px",
              fontWeight: "800",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Inspect Certificate ↗
          </button>
        </div>
      </div>

      <h1 id="about" className="heading-about-desktop" style={{ marginTop: 0 }}>
        MD Abu Hanif Mia (Abu Hanif)
      </h1>
      <strong className="heading4 heading-title-desktop" style={{ color: "#053056", marginTop: 0, display: "block" }}>
        Staff Software Engineer &amp; Systems Architect
      </strong>

      <p>
        <strong>MD Abu Hanif Mia</strong> (known professionally as <strong>Abu Hanif</strong>) is an experienced
        software engineer and systems architect whose technical rigor, deep full-stack mastery, and execution
        velocity have resulted in high-concurrency, fault-tolerant production platforms for startups and
        enterprise organizations worldwide. Formally trained through <strong>Programming Hero</strong> (awarded the{" "}
        <em>Certificate of Completion with Excellence</em> in Complete Web Development) and holding verified{" "}
        <strong>freeCodeCamp</strong> certifications in JavaScript, TypeScript, and Python, Abu Hanif combines
        modern React 19 and Next.js 16 edge engineering with low-level systems programming in <strong>Rust</strong>{" "}
        and <strong>Go</strong>.
      </p>
      <p>
        Specializing in distributed systems, PostgreSQL query tuning, Cloudflare Pages, and memory-safe concurrent
        backends, Abu Hanif operates at the intersection of clean architecture, database performance, and edge network
        delivery. Whether eliminating complex architectural bottlenecks, restructuring legacy codebases, or
        deploying new greenfield products from technical requirements to production, Abu Hanif brings over 9 years
        of battle-tested engineering leadership. Every system is built with high observability, rigorous test
        coverage, and strict performance SLAs.
      </p>

      {/* VERIFIED CERTIFICATIONS & ACCREDITATIONS SECTION */}
      <div
        style={{
          margin: "2em 0",
          background: "#f8fafc",
          border: "1px solid #cbd5e1",
          borderTop: "4px solid #9CBE41",
          borderRadius: "6px",
          padding: "22px 24px",
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
                color: "#053056",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Verified Certifications &amp; Technical Accreditations
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#334155" }}>
              Formally accredited training and verified software development credentials:
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCertificate}
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#053056",
              background: "#e2e8f0",
              border: "1px solid #cbd5e1",
              padding: "6px 12px",
              borderRadius: "3px",
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
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              padding: "14px",
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
                  border: "1px solid #9CBE41",
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
                    background: "rgba(5,48,86,0.35)",
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
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#053056", textTransform: "uppercase" }}>
                Programming Hero
              </span>
              <h4 style={{ margin: "2px 0 4px 0", fontSize: "14px", color: "#053056" }}>
                Complete Web Development Course with Excellence
              </h4>
              <div style={{ fontSize: "11.5px", color: "#334155", fontWeight: 700, marginBottom: "6px" }}>
                Batch-12 • Credential ID:{" "}
                <span style={{ fontFamily: "monospace", color: "#053056" }}>WEB12-3991</span>
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
                  color: "#053056",
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
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              padding: "14px",
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
                  background: "#031c33",
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
                  color: "#053056",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                freeCodeCamp
              </span>
              <h4 style={{ margin: "2px 0 6px 0", fontSize: "14px", color: "#053056" }}>
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
                color: "#16a34a",
              }}
            >
              ✓ Verified Curriculum Standard
            </div>
          </div>

          {/* Credential 3: Systems Programming in Rust & Go */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              padding: "14px",
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
                  color: "#053056",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                Systems Architecture
              </span>
              <h4 style={{ margin: "2px 0 6px 0", fontSize: "14px", color: "#053056" }}>
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
                    color: "#053056",
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
                    color: "#053056",
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
                    color: "#053056",
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
                    color: "#053056",
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
                color: "#16a34a",
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
