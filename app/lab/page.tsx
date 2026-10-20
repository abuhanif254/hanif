import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import LabEdgeRadar from "../components/lab-edge-radar";
import LabPostgresPlanner from "../components/lab-postgres-planner";
import ArchitectureTopologyExplorer from "../components/architecture-topology-explorer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Interactive Systems Architecture Lab & Live Benchmarks | Abu Hanif (MD Abu Hanif Mia)",
  description:
    "Interactive empirical systems telemetry, live browser edge latency testing, PostgreSQL EXPLAIN ANALYZE query plan simulator, and distributed systems architecture blueprints by Staff Software Engineer Abu Hanif.",
  keywords: [
    "Systems Architecture Lab",
    "PostgreSQL Query Cost Simulator",
    "EXPLAIN ANALYZE Simulator",
    "Edge Latency Benchmark",
    "Cloudflare Edge P99",
    "Distributed Systems Telemetry",
    "Abu Hanif",
    "MD Abu Hanif Mia",
  ],
  alternates: {
    canonical: `${siteUrl}/lab`,
  },
  openGraph: {
    title: "Interactive Systems Architecture Lab & Live Benchmarks | Abu Hanif",
    description:
      "Test live browser edge latency, simulate PostgreSQL 16 EXPLAIN ANALYZE index plans, and inspect distributed systems topologies.",
    url: `${siteUrl}/lab`,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Systems Architecture Lab | Abu Hanif",
    description:
      "Test live browser edge latency and simulate PostgreSQL index plans with Staff Software Engineer Abu Hanif.",
    creator: "@abuhanif",
  },
};

export default function SystemsLabPage() {
  const labSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Interactive Systems Architecture Lab & Live Telemetry Benchmarks",
    description:
      "Interactive empirical telemetry and query planning simulators designed by Staff Software Engineer MD Abu Hanif Mia.",
    url: `${siteUrl}/lab`,
    author: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      url: siteUrl,
      jobTitle: "Staff Software Engineer & Systems Architect",
    },
    publisher: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      url: siteUrl,
    },
  };

  return (
    <div id="source-page-root" data-source-path="/lab">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(labSchema) }}
      />
      <div id="source-page-body" className="source-page-body js l2 section_10 justia-robertjfleming-com">
        <SiteHeader activePath="/lab" />

        <div className="index" id="container">
          <div className="cwrap">
            {/* Header / Banner Strip */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <h1 style={{ margin: 0, fontSize: "28px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Interactive Systems Architecture Lab
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          Empirical Telemetry • Live Browser Latency Tests • PostgreSQL Query Simulators
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <Link href="/">Home</Link> &gt; <span>Systems Lab</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      <h2>Empirical Proof of Execution: Show, Don&rsquo;t Just Tell</h2>
                      <p>
                        Senior software engineering and systems architecture decisions must be grounded in measurable data rather than theoretical speculation. The interactive telemetry tools below allow engineering managers, technical founders, and recruiters to test live network performance, visualize database query plan execution, and inspect distributed streaming topologies in real time.
                      </p>

                      {/* Tool 1: Live Edge Network Latency Radar */}
                      <LabEdgeRadar />

                      {/* Tool 2: PostgreSQL EXPLAIN ANALYZE Planner */}
                      <LabPostgresPlanner />

                      {/* Tool 3: Distributed Topology Explorer */}
                      <div style={{ marginTop: "16px", marginBottom: "28px" }}>
                        <div style={{ marginBottom: "14px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Telemetry Tool 03 • Distributed Systems
                          </span>
                          <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#0f172a" }}>
                            Interactive Streaming Topology &amp; Failover Architecture
                          </h3>
                        </div>
                        <ArchitectureTopologyExplorer />
                      </div>

                      {/* Consultation Banner */}
                      <div
                        style={{
                          backgroundColor: "#0b132b",
                          border: "1px solid #1e293b",
                          borderRadius: "8px",
                          padding: "24px",
                          color: "#ffffff",
                          marginTop: "24px",
                          boxShadow: "0 4px 16px -2px rgba(11, 19, 43, 0.12)",
                        }}
                      >
                        <div style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                          Architecture Diagnostic &amp; Tuning Sprints
                        </div>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", color: "#ffffff" }}>
                          Facing a Production Database Bottleneck or High Edge Latency?
                        </h3>
                        <p style={{ margin: "0 0 18px 0", fontSize: "13.5px", color: "#cbd5e1", lineHeight: "1.6" }}>
                          I partner directly with venture-backed startups and engineering teams to audit slow queries, restructure database indexes, and deploy sub-25ms edge networks with zero downtime.
                        </p>
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          <Link
                            href="/pricing#database-optimization"
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#2563eb",
                              color: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "700",
                              textDecoration: "none",
                              transition: "background-color 0.15s ease",
                            }}
                          >
                            Book PostgreSQL Sprint ($4,500) &rsaquo;
                          </Link>
                          <Link
                            href="/projects"
                            style={{
                              padding: "10px 18px",
                              backgroundColor: "#111e38",
                              color: "#cbd5e1",
                              border: "1px solid #1e293b",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "700",
                              textDecoration: "none",
                            }}
                          >
                            View Shipped Production Systems &rsaquo;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Sidebar */}
                <div className="sidebar secondary-sidebar">
                  {/* Verified Credentials */}
                  <div className="widget" id="wdgt-credentials">
                    <strong className="heading4 widget-title">
                      <a href="/resume">Verified Accreditations</a>
                    </strong>
                    <div className="description" style={{ fontSize: "12.5px", lineHeight: "1.6" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>B.Sc. in Computer Science &amp; Eng.</strong><br />
                        <span style={{ color: "#475569" }}>Formal 4-Year Engineering Degree</span>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Programming Hero Honor</strong><br />
                        <span style={{ color: "#047857", fontWeight: "bold" }}>Batch-12 • WEB12-3991 (Verified)</span>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>freeCodeCamp Certified</strong><br />
                        <span style={{ color: "#475569" }}>JS Algorithms, TypeScript, Python</span>
                      </div>
                      <div>
                        <strong>Systems Specialization</strong><br />
                        <span style={{ color: "#2563eb", fontWeight: "bold" }}>Rust, Go Concurrency, Postgres 16</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Booking Widget */}
                  <div className="widget" id="wdgt-contact">
                    <strong className="heading4 widget-title">
                      <a href="/pricing#inquiry">Schedule Architecture Review</a>
                    </strong>
                    <div className="description">
                      <p style={{ fontSize: "13px", color: "#334155", margin: "0 0 12px 0" }}>
                        Direct engagement with Staff Software Engineer Abu Hanif. Guaranteed response within 24 hours.
                      </p>
                      <Link
                        className="btn"
                        href="/pricing#inquiry"
                        style={{
                          display: "block",
                          textAlign: "center",
                          padding: "10px 16px",
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          fontWeight: "bold",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontSize: "13px",
                          transition: "background-color 0.15s ease",
                        }}
                      >
                        Request Project Quote ›
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stpr"></div>
            </div>

            {/* Global Footer */}
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
