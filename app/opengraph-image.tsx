import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "MD Abu Hanif Mia (Abu Hanif) - Staff Software Engineer & Systems Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#060b19",
          padding: "56px 64px",
          position: "relative",
        }}
      >
        {/* Top Cobalt Accent Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "10px",
            backgroundColor: "#2563eb",
          }}
        />

        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                backgroundColor: "#0f172a",
                color: "#38bdf8",
                border: "1px solid #1e293b",
                fontSize: "14px",
                fontWeight: 800,
                padding: "8px 16px",
                borderRadius: "6px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              STAFF SOFTWARE ENGINEER &amp; SYSTEMS ARCHITECT
            </span>
            <span
              style={{
                backgroundColor: "#064e3b",
                color: "#34d399",
                border: "1px solid #10b981",
                fontSize: "14px",
                fontWeight: 800,
                padding: "8px 14px",
                borderRadius: "6px",
              }}
            >
              99.99% PRODUCTION SLA
            </span>
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            abuhanifmia.com
          </div>
        </div>

        {/* Main Identity & Core Domains */}
        <div style={{ display: "flex", flexDirection: "column", margin: "12px 0" }}>
          <div
            style={{
              fontSize: "58px",
              fontWeight: 900,
              color: "#f8fafc",
              lineHeight: 1.12,
              letterSpacing: "-1px",
              marginBottom: "14px",
            }}
          >
            MD Abu Hanif Mia (Abu Hanif)
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#94a3b8",
              lineHeight: 1.4,
              marginBottom: "28px",
            }}
          >
            Distributed Systems &bull; Next.js 16 Edge &bull; PostgreSQL 16 Tuning &bull; Rust &amp; Go Concurrency
          </div>

          {/* 3 Empirical Metric Cards */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderLeft: "4px solid #2563eb",
                borderRadius: "8px",
                padding: "18px 24px",
                flex: 1,
              }}
            >
              <span style={{ color: "#f8fafc", fontSize: "28px", fontWeight: 900 }}>
                12M Events/Sec
              </span>
              <span style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
                Sub-22ms P99 Streaming Telemetry
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderLeft: "4px solid #10b981",
                borderRadius: "8px",
                padding: "18px 24px",
                flex: 1,
              }}
            >
              <span style={{ color: "#34d399", fontSize: "28px", fontWeight: 900 }}>
                4.2s to 4.8ms
              </span>
              <span style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
                PostgreSQL Query &amp; Index Optimization
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderLeft: "4px solid #38bdf8",
                borderRadius: "8px",
                padding: "18px 24px",
                flex: 1,
              }}
            >
              <span style={{ color: "#38bdf8", fontSize: "28px", fontWeight: 900 }}>
                50+ Systems
              </span>
              <span style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
                Zero-Downtime Edge Deployments
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Contact & Credentials Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1e293b",
            paddingTop: "20px",
          }}
        >
          <span style={{ color: "#cbd5e1", fontSize: "16px", fontWeight: 600 }}>
            https://abuhanifmia.com &bull; abuhanifmain@gmail.com &bull; Dhaka, Bangladesh (Global Remote)
          </span>
          <span style={{ color: "#38bdf8", fontSize: "15px", fontWeight: 700 }}>
            B.Sc. in CSE &bull; 9+ Years Systems Architecture
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
