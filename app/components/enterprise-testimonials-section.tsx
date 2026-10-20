import Link from "next/link";
import { Testimonial } from "../data/portfolio-data";

interface EnterpriseTestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function EnterpriseTestimonialsSection({
  testimonials,
}: EnterpriseTestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      style={{
        marginTop: "36px",
        marginBottom: "36px",
      }}
      aria-label="Verified Client Testimonials and Engineering Outcomes"
    >
      {/* Header with Kicker & Authority Title */}
      <div
        style={{
          borderBottom: "2px solid #2563eb",
          paddingBottom: "12px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: "800",
            color: "#2563eb",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Verified Production Impact • Client &amp; Architect Endorsements
        </span>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#0f172a",
            margin: "0 0 6px 0",
            letterSpacing: "-0.01em",
          }}
        >
          What Engineering Leaders &amp; Founders Say
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#475569",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Real-world results delivered across high-throughput distributed pipelines, sub-30ms edge deployments, and enterprise PostgreSQL optimizations.
        </p>
      </div>

      {/* Testimonials 2-Column Responsive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {testimonials.map((t, idx) => (
          <div
            key={t.id || idx}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
              position: "relative",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            {/* Top Row: 5-Star Rating & Deliverable Tag */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ color: "#f59e0b", fontSize: "14px", letterSpacing: "2px" }} aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                {t.deliverableTag && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#1e40af",
                      backgroundColor: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {t.deliverableTag}
                  </span>
                )}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#1e293b",
                  lineHeight: "1.65",
                  fontStyle: "italic",
                  margin: "0 0 16px 0",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Bottom Meta & Metric Strip */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px", marginTop: "auto" }}>
              {/* Verified Impact Pill */}
              {t.verifiedMetric && (
                <div
                  style={{
                    backgroundColor: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    color: "#065f46",
                    fontSize: "12px",
                    fontWeight: "700",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    marginBottom: "12px",
                    display: "inline-block",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {t.verifiedMetric}
                </div>
              )}

              {/* Author & Proof Link Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>
                    {t.author}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {t.role} • <strong>{t.company}</strong>
                  </span>
                </div>

                {t.projectSlug ? (
                  <Link
                    href={`/projects/${t.projectSlug}`}
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                    title={`View ${t.company} case study`}
                  >
                    View Case Study &rsaquo;
                  </Link>
                ) : t.serviceSlug ? (
                  <Link
                    href={`/services/${t.serviceSlug}`}
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                    title="View related service sprint"
                  >
                    View Service &rsaquo;
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Consultation Strip */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "2px" }}>
            Ready to achieve similar production results for your engineering team?
          </strong>
          <span style={{ fontSize: "12.5px", color: "#64748b" }}>
            Every engagement includes an explicit Statement of Work (SOW), 100% intellectual property transfer, and a 30-day bug warranty.
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/pricing#inquiry"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              padding: "8px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Request Project Consultation &rsaquo;
          </Link>
          <Link
            href="/pricing"
            style={{
              backgroundColor: "#ffffff",
              color: "#1e293b",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              fontWeight: "700",
              padding: "8px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            View Pricing Matrix &rsaquo;
          </Link>
        </div>
      </div>
    </section>
  );
}
