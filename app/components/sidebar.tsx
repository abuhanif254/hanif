import ContactForm from "./contact-form";
import EdgeLatencyBenchmark from "./edge-latency-benchmark";

const engineeringSpecializations = [
  "Distributed Systems",
  "High-Throughput APIs",
  "Next.js & React 19 Apps",
  "Rust & Wasm Edge Performance",
  "PostgreSQL Query Optimization",
  "Cloudflare Edge Deployments",
  "AI & LLM RAG Integrations",
  "Zero-Trust Authentication",
  "Docker & Kubernetes",
  "CI/CD Pipeline Automation",
  "Microservices Decomposition",
  "Technical Debt Refactoring",
  "System Performance Audits",
];

const secondaryDomains = [
  "Rust & Tokio Concurrency",
  "Programming Hero Certified (Web-12)",
  "freeCodeCamp (JS, TS, Python)",
  "Go Microservices",
  "Redis & Event Caching",
  "TimescaleDB Telemetry",
  "Stripe Billing & Subscriptions",
  "Terraform Infrastructure as Code",
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Engineering Credentials & Metrics Badge */}
      <div
        style={{
          backgroundColor: "#0b132b",
          border: "1px solid #1e293b",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "14px",
          textAlign: "center",
          color: "#ffffff",
          boxShadow: "0 4px 16px -2px rgba(11, 19, 43, 0.12)",
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#10b981", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          Production Track Record
        </div>
        <div style={{ fontSize: "24px", fontWeight: "800", margin: "4px 0", color: "#ffffff" }}>
          99.99% Uptime
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1" }}>
          50+ Production Deployments • Sub-50ms P99 Architecture
        </p>
      </div>

      {/* Verified Certificate Quick Card */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderLeft: "4px solid #2563eb",
          borderRadius: "6px",
          padding: "10px 12px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src="/images/programming-hero-certificate.png"
          alt="Programming Hero Certificate Thumbnail"
          width={50}
          height={36}
          style={{
            width: "50px",
            height: "36px",
            objectFit: "cover",
            borderRadius: "2px",
            border: "1px solid #cbd5e1",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            ✓ Verified Certificate
          </div>
          <div style={{ fontSize: "12px", color: "#1e293b", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Programming Hero (Web-12)
          </div>
          <a
            href="#certificate-modal"
            data-certificate-trigger="programming-hero"
            style={{ fontSize: "11px", color: "#2563eb", textDecoration: "underline", fontWeight: "700" }}
          >
            View Credential (WEB12-3991) ›
          </a>
        </div>
      </div>

      {/* Live Edge Telemetry */}
      <EdgeLatencyBenchmark />

      {/* Embedded Project Inquiry Form */}
      <div id="contact">
        <ContactForm />
      </div>

      {/* Developer Social Links */}
      <div
        className="social-links"
        aria-label="Developer profiles and code repositories"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "18px 0",
        }}
      >
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            backgroundColor: "#070f1e",
            color: "#ffffff",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "14px",
            border: "1px solid #1e293b",
            textDecoration: "none",
          }}
          title="GitHub Profile"
        >
          GH
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            backgroundColor: "#0077b5",
            color: "#ffffff",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "14px",
            textDecoration: "none",
          }}
          title="LinkedIn Profile"
        >
          in
        </a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38px",
            height: "38px",
            backgroundColor: "#000000",
            color: "#ffffff",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "14px",
            border: "1px solid #1e293b",
            textDecoration: "none",
          }}
          title="X / Twitter"
        >
          𝕏
        </a>
      </div>

      {/* Direct Quote CTA */}
      <div style={{ margin: "16px 0" }}>
        <a className="btn" href="#pricing">
          View Work Prices &amp; Tiers
        </a>
      </div>

      {/* Engineering Specializations Sidebar */}
      <section className="practice-sidebar" id="practice" style={{ marginTop: "24px" }}>
        <h2 className="side-title" style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #2563eb", paddingBottom: "6px" }}>
          Core Competencies
        </h2>
        <div className="practice-group" style={{ margin: "12px 0" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {engineeringSpecializations.map((spec) => (
              <li key={spec} style={{ padding: "5px 0", borderBottom: "1px dotted #e2e8f0" }}>
                <a href="#competencies" style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                  › {spec}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="practice-group compact-links" style={{ marginTop: "16px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#334155", marginBottom: "6px" }}>
            Additional Tech Domains
          </div>
          {secondaryDomains.map((domain) => (
            <div key={domain} style={{ fontSize: "12px", color: "#1e293b", padding: "3px 0" }}>
              • {domain}
            </div>
          ))}
        </div>
      </section>

      {/* Client Feedback Recommendation Card */}
      <section
        className="feedback-card"
        style={{
          marginTop: "28px",
          padding: "18px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
        }}
      >
        <h2 className="side-title" style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 0", color: "#0f172a" }}>
          Client Recommendation
        </h2>
        <blockquote style={{ margin: 0, fontStyle: "italic", fontSize: "13px", lineHeight: "1.6", color: "#1e293b" }}>
          “Abu Hanif transformed our core API architecture in just three weeks. Our P99 latency dropped by 75% and our infrastructure bill was cut in half. Clear technical communication, pristine documentation, and zero fluff.”
        </blockquote>
        <p className="quote-credit" style={{ marginTop: "12px", marginBottom: "14px", fontSize: "12px", color: "#475569" }}>
          <strong style={{ color: "#0f172a" }}>David Vance</strong><br />
          VP of Engineering, Apex Telemetry Labs
        </p>
        <a className="btn" href="#contact" style={{ fontSize: "13px", padding: "8px 0" }}>
          Discuss Your Project
        </a>
      </section>
    </aside>
  );
}
