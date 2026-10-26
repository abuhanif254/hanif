import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Interactive Systems Architecture Lab | Abu Hanif (MD Abu Hanif Mia) - Staff Software Engineer";
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
        {/* Top Accent Strip */}
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

        {/* Top Header */}
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
                fontSize: "13px",
                fontWeight: 800,
                padding: "6px 14px",
                borderRadius: "6px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              SYSTEMS ARCHITECTURE LAB &amp; TELEMETRY
            </span>
            <span
              style={{
                backgroundColor: "#064e3b",
                color: "#34d399",
                border: "1px solid #10b981",
                fontSize: "13px",
                fontWeight: 800,
                padding: "6px 14px",
                borderRadius: "6px",
              }}
            >
              LIVE PRODUCTION SIMULATORS
            </span>
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              fontWeight: 700,
            }}
          >
            abuhanifmia.com/lab
          </div>
        </div>

        {/* Center Title & Tools */}
        <div style={{ display: "flex", flexDirection: "column", margin: "16px 0" }}>
          <div
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: "#f8fafc",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              marginBottom: "12px",
            }}
          >
            Interactive Systems Architecture Lab
          </div>
          <div
            style={{
              fontSize: "23px",
              color: "#94a3b8",
              lineHeight: 1.4,
              maxWidth: "1020px",
            }}
          >
            PostgreSQL EXPLAIN ANALYZE Simulator • Global Edge P99 Latency Radar • Distributed Chaos &amp; Failover Blueprint
          </div>
        </div>

        {/* 3 Live Metric Badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#0b132b",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px 20px",
              flex: 1,
            }}
          >
            <span style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
              EDGE P99 TTFB
            </span>
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
              &lt; 25ms Global
            </span>
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
              330+ Cloudflare Cities
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#0b132b",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px 20px",
              flex: 1,
            }}
          >
            <span style={{ color: "#c084fc", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
              POSTGRES OPTIMIZATION
            </span>
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
              10x Query Speedup
            </span>
            <span style={{ color: "#c084fc", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
              Zero-Heap Covering Indexes
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#0b132b",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px 20px",
              flex: 1,
            }}
          >
            <span style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
              FAILOVER MTTR
            </span>
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
              &lt; 450ms Recovery
            </span>
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
              0 Bytes Data Loss
            </span>
          </div>
        </div>

        {/* Footer Credit */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1e293b",
            paddingTop: "16px",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#f8fafc", fontWeight: 800 }}>MD Abu Hanif Mia</span>
            <span>•</span>
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>Staff Software Engineer &amp; Systems Architect</span>
          </div>

          <div style={{ color: "#10b981", fontWeight: 700 }}>
            Open Interactive Architecture Lab ↗
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
