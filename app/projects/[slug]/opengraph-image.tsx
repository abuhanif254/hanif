import { ImageResponse } from "next/og";
import { getProjectBySlug } from "../../lib/portfolio-store";

export const runtime = "nodejs";
export const alt = "Abu Hanif Production Systems Case Study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: OgProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const title = project?.title || "Production Systems Architecture Case Study";
  const priceTag = project?.priceTag || "Scoped Architecture Contract";
  const impactMetric = project?.impactMetric || "Production SLA Verified";
  const techStack = project?.techStack?.slice(0, 4) || ["Next.js", "PostgreSQL", "Cloudflare"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#053056",
          padding: "56px 60px",
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
            backgroundColor: "#9CBE41",
          }}
        />

        {/* Header Kicker Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                backgroundColor: "#9CBE41",
                color: "#041f36",
                fontSize: "15px",
                fontWeight: 900,
                padding: "6px 14px",
                borderRadius: "4px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {priceTag}
            </span>
            <span
              style={{
                backgroundColor: "#031a2e",
                color: "#4ade80",
                border: "1px solid #166534",
                fontSize: "15px",
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: "4px",
              }}
            >
              ⚡ {impactMetric}
            </span>
          </div>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            abuhanifmia.com/projects
          </div>
        </div>

        {/* Case Study Title & Technologies */}
        <div style={{ display: "flex", flexDirection: "column", margin: "16px 0" }}>
          <div
            style={{
              fontSize: title.length > 50 ? "42px" : "50px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.25,
              marginBottom: "18px",
            }}
          >
            {title}
          </div>

          {/* Tech Stack Badges */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  backgroundColor: "#042442",
                  color: "#cbd5e1",
                  border: "1px solid #0a365c",
                  fontSize: "14px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "3px",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Author Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #0e4475",
            paddingTop: "22px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: 800 }}>
              MD Abu Hanif Mia (Abu Hanif)
            </span>
            <span style={{ color: "#9CBE41", fontSize: "16px", fontWeight: 700, marginTop: "4px" }}>
              Staff Software Engineer &amp; Systems Architect
            </span>
          </div>

          <div
            style={{
              display: "flex",
              backgroundColor: "#031a2e",
              padding: "10px 18px",
              borderRadius: "4px",
              border: "1px solid #0a365c",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>
              B.Sc. CSE &bull; Batch-12 PH Honor &bull; Rust &bull; Distributed Systems
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
