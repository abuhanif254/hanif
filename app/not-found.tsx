import Link from "next/link";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";

export default function NotFound() {
  return (
    <div id="source-page-root" data-source-path="/404">
      <div id="source-page-body" className="source-page-body js l2 section_10 justia-robertjfleming-com">
        <SiteHeader activePath="/404" />

        <div className="index" id="container">
          <div className="cwrap">
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <h1 style={{ margin: 0, fontSize: "28px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          404 — Page Not Found
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          The requested engineering document, case study, or resource does not exist.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content" style={{ padding: "40px 24px" }}>
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <Link href="/">Home</Link> &gt; <span>404 Not Found</span>
                    </div>
                  </div>

                  <div className="bodytext" style={{ maxWidth: "780px", margin: "24px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                      <div
                        style={{
                          fontSize: "52px",
                          fontWeight: 900,
                          color: "#0f172a",
                          lineHeight: 1,
                          borderRight: "3px solid #2563eb",
                          paddingRight: "20px",
                        }}
                      >
                        404
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>
                          Resource Not Found
                        </h2>
                        <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                          The link you followed may be outdated, or the system path may have changed.
                        </p>
                      </div>
                    </div>

                    <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#334155" }}>
                      Explore one of the active architectural hubs below, or use <kbd style={{ padding: "2px 6px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px" }}>Ctrl + K</kbd> to search across all case studies and publications:
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "16px",
                        marginTop: "24px",
                      }}
                    >
                      <Link
                        href="/"
                        style={{
                          display: "block",
                          padding: "16px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #2563eb",
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>
                          &larr; Return to Home
                        </strong>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Executive overview &amp; competencies
                        </span>
                      </Link>

                      <Link
                        href="/projects"
                        style={{
                          display: "block",
                          padding: "16px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #0284c7",
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>
                          Work Showcase &rsaquo;
                        </strong>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Production architectures &amp; case studies
                        </span>
                      </Link>

                      <Link
                        href="/pricing"
                        style={{
                          display: "block",
                          padding: "16px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #16a34a",
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>
                          Work Prices &rsaquo;
                        </strong>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Transparent fixed scopes &amp; SOW builder
                        </span>
                      </Link>

                      <Link
                        href="/lab"
                        style={{
                          display: "block",
                          padding: "16px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #0891b2",
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>
                          Systems Lab &rsaquo;
                        </strong>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Live telemetry &amp; PostgreSQL planner
                        </span>
                      </Link>

                      <Link
                        href="/blog"
                        style={{
                          display: "block",
                          padding: "16px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #8b5cf6",
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>
                          Technical Blog &rsaquo;
                        </strong>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Architecture write-ups &amp; benchmarks
                        </span>
                      </Link>

                      <Link
                        href="/resume"
                        style={{
                          display: "block",
                          padding: "16px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #f59e0b",
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                      >
                        <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>
                          Resume / Credentials &rsaquo;
                        </strong>
                        <span style={{ fontSize: "13px", color: "#64748b" }}>
                          Verified track record &amp; certifications
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
