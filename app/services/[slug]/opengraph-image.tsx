import { ImageResponse } from "next/og";
import { getServiceBySlug } from "../../lib/portfolio-store";

export const runtime = "nodejs";
export const alt = "Abu Hanif Systems Architecture Sprints & Pricing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: OgProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  const title = service?.title || "Fixed-Scope Systems Architecture Sprint";
  const priceDisplay = service?.priceDisplay || "$4,500";
  const timeline = service?.timeline || "1-2 Weeks";
  const deliverables = service?.deliverables?.slice(0, 3) || [
    "Production Architecture Delivery",
    "100% Client IP Ownership",
    "30-Day SLA Bug Warranty",
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b132b",
          padding: "54px 60px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
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

        {/* Top Kicker & Price Strip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 800,
                padding: "6px 14px",
                borderRadius: "6px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Fixed Milestone Sprint
            </span>
            <span
              style={{
                backgroundColor: "#064e3b",
                color: "#4ade80",
                border: "1px solid #059669",
                fontSize: "16px",
                fontWeight: 800,
                padding: "6px 14px",
                borderRadius: "6px",
              }}
            >
              {priceDisplay}
            </span>
            <span
              style={{
                backgroundColor: "#111e38",
                color: "#38bdf8",
                border: "1px solid #1e293b",
                fontSize: "14px",
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: "6px",
              }}
            >
              {timeline}
            </span>
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            abuhanifmia.com/services
          </div>
        </div>

        {/* Service Title & Deliverables */}
        <div style={{ display: "flex", flexDirection: "column", margin: "14px 0" }}>
          <div
            style={{
              fontSize: title.length > 40 ? "44px" : "52px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            {title}
          </div>

          {/* Key Deliverables Highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {deliverables.map((deliv, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "16px",
                  color: "#cbd5e1",
                }}
              >
                <span style={{ color: "#10b981", fontWeight: 900 }}>✓</span>
                <span>{deliv.split(" - ")[0] || deliv.split(": ")[0] || deliv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Brand Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "20px",
            borderTop: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#ffffff", fontSize: "19px", fontWeight: 800 }}>
              MD Abu Hanif Mia (Abu Hanif)
            </div>
            <div style={{ color: "#38bdf8", fontSize: "14px", fontWeight: 600 }}>
              Staff Software Engineer &amp; Systems Architect &bull; 9+ Years High-Concurrency Experience
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#111e38",
              color: "#10b981",
              border: "1px solid #1e293b",
              fontSize: "13px",
              fontWeight: 700,
              padding: "8px 14px",
              borderRadius: "6px",
            }}
          >
            ● 100% Client IP &bull; 30-Day SLA Warranty
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
