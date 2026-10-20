import { ImageResponse } from "next/og";
import { getBlogPostBySlug } from "../../lib/portfolio-store";

export const runtime = "nodejs";
export const alt = "Abu Hanif Technical Engineering Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: OgProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  const title = post?.title || "Technical Architecture Publication";
  const tag = post?.tags?.[0] || "Architecture";
  const readingTime = post?.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : "5 min read";

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
          padding: "60px",
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

        {/* Header Kicker */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 900,
                padding: "6px 14px",
                borderRadius: "4px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
            <span style={{ color: "#94a3b8", fontSize: "18px", marginLeft: "12px" }}>
              ⏱ {readingTime}
            </span>
          </div>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            abuhanifmia.com/blog
          </div>
        </div>

        {/* Article Headline */}
        <div style={{ display: "flex", flexDirection: "column", margin: "20px 0" }}>
          <div
            style={{
              fontSize: title.length > 55 ? "44px" : "54px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer Author Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #1e293b",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: 800 }}>
              MD Abu Hanif Mia (Abu Hanif)
            </span>
            <span style={{ color: "#38bdf8", fontSize: "16px", fontWeight: 700, marginTop: "4px" }}>
              Staff Software Engineer &amp; Systems Architect
            </span>
          </div>

          <div
            style={{
              display: "flex",
              backgroundColor: "#070f1e",
              padding: "10px 18px",
              borderRadius: "4px",
              border: "1px solid #0a365c",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>
              B.Sc. CSE &bull; Batch-12 PH Honor &bull; Rust &bull; Postgres 16
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
