"use client";

import Image from "next/image";

export default function BadgesBar() {
  function handleOpenCertificate(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.hash = "#certificate-modal";
      // Also dispatch event in case hash was already set
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  return (
    <div
      id="badges"
      className="badges-bar-container scrollbar-none"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        margin: "0 0 24px 0",
        paddingBottom: "18px",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      {/* Red Mark Area: Programming Hero Verified Certificate Badge */}
      <a
        href="#certificate-modal"
        id="ph-certificate-trigger"
        data-certificate-trigger="programming-hero"
        onClick={handleOpenCertificate}
        className="badge"
        title="Click to inspect verified Programming Hero Certificate of Excellence (Batch-12 • ID: WEB12-3991)"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 14px",
          background: "#0b132b",
          color: "#ffffff",
          border: "1px solid #2563eb",
          borderRadius: "4px",
          textDecoration: "none",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(11,25,44,0.3)",
          transition: "all 0.15s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "52px",
            height: "38px",
            borderRadius: "3px",
            overflow: "hidden",
            border: "1px solid #2563eb",
            flexShrink: 0,
            background: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          <Image
            src="/images/programming-hero-certificate.png"
            alt="Programming Hero Certificate Thumbnail"
            width={52}
            height={38}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#10b981",
              color: "#050e1d",
              fontSize: "7.5px",
              fontWeight: 900,
              padding: "1px 3px",
              lineHeight: 1,
              borderTopLeftRadius: "2px",
            }}
          >
            ✓
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1.2 }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "#38bdf8",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            PROGRAMMING HERO
          </span>
          <strong style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.1px" }}>
            CERTIFICATE OF EXCELLENCE
          </strong>
          <span style={{ fontSize: "10px", color: "#cbd5e1", fontWeight: 600 }}>
            Batch-12 • ID: WEB12-3991 <span style={{ color: "#4ade80" }}>(Inspect ↗)</span>
          </span>
        </div>
      </a>

      {/* freeCodeCamp Verified Badge */}
      <span
        className="badge"
        title="freeCodeCamp Verified Certifications: JavaScript Algorithms, TypeScript, Python"
      >
        <strong
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            background: "#070f1e",
            color: "#fde047",
            border: "1px solid #ca8a04",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          <span>(fCC)</span> JS • TS • PYTHON
        </strong>
      </span>

      {/* Rust & Go Systems Badge */}
      <span className="badge" title="Systems Concurrency in Rust & Go">
        <strong
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            background: "#070f1e",
            color: "#f97316",
            border: "1px solid #ea580c",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          <span>🦀</span> RUST &amp; GO SYSTEMS
        </strong>
      </span>

      {/* 9+ YRS EXP Badge */}
      <span className="badge" title="Full-Stack Senior Engineer">
        <strong
          style={{
            display: "inline-block",
            padding: "8px 14px",
            background: "#070f1e",
            color: "#38bdf8",
            border: "1px solid #1e293b",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          9+ YRS EXP
        </strong>
      </span>

      {/* 99.99% UPTIME Badge */}
      <span className="badge" title="99.99% Production Uptime">
        <strong
          style={{
            display: "inline-block",
            padding: "8px 14px",
            background: "#064e3b",
            color: "#4ade80",
            border: "1px solid #059669",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          99.99% UPTIME
        </strong>
      </span>

      {/* 50+ SHIPPED APPS Badge */}
      <span className="badge" title="50+ Shipped Deployments">
        <strong
          style={{
            display: "inline-block",
            padding: "8px 14px",
            background: "#1e1b4b",
            color: "#c084fc",
            border: "1px solid #4338ca",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          50+ SHIPPED APPS
        </strong>
      </span>
    </div>
  );
}
