import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Engineering Services, Fixed Sprints & SOW Pricing | Abu Hanif (MD Abu Hanif Mia)";
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
              TRANSPARENT ENGINEERING CONTRACTS
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
              INTERACTIVE SOW GENERATOR
            </span>
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              fontWeight: 700,
            }}
          >
            abuhanifmia.com/pricing
          </div>
        </div>

        {/* Center Title & Scope */}
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
            Engineering Services &amp; SOW Pricing
          </div>
          <div
            style={{
              fontSize: "23px",
              color: "#94a3b8",
              lineHeight: 1.4,
              maxWidth: "1020px",
            }}
          >
            Interactive Statement of Work Builder • High-Resolution Printable PDF Export • Fixed-Price Delivery Milestones
          </div>
        </div>

        {/* 3 Tier Scope Cards */}
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
              DIAGNOSTIC AUDIT
            </span>
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
              $4,500 – $6,500
            </span>
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
              1–2 Week Delivery
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
              FULL-STACK MVP SPRINT
            </span>
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
              $14,000 – $24,000
            </span>
            <span style={{ color: "#c084fc", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
              4–6 Weeks • 100% Client IP
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
              FRACTIONAL ARCHITECT
            </span>
            <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
              $6,000 / mo
            </span>
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
              2 Dedicated Q4 Slots
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
            Configure Custom SOW &amp; Export PDF ↗
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
