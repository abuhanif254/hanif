import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import StatusDashboardClient from "./status-dashboard-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Live Systems Status & Edge Observability",
  description:
    "Real-time operational status, Cloudflare Pages edge health, PostgreSQL database connection pool metrics, and multi-region latency benchmarks for Abu Hanif's production architecture.",
  keywords: [
    "Systems Status",
    "Edge Network Uptime",
    "PostgreSQL Connection Pool Status",
    "Cloudflare Pages Telemetry",
    "Abu Hanif",
    "MD Abu Hanif Mia",
    "Staff Software Engineer Observability",
  ],
  alternates: {
    canonical: `${siteUrl}/status`,
  },
  openGraph: {
    title: "Live Systems Status & Edge Observability | Abu Hanif",
    description:
      "Real-time operational status and multi-region edge telemetry for Abu Hanif's production architecture.",
    url: `${siteUrl}/status`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Systems Status & Edge Observability | Abu Hanif",
    description: "99.994% Uptime • Real-time Cloudflare Edge & PostgreSQL Telemetry.",
    creator: "@abuhanif",
  },
};

export default function StatusPage() {
  const statusSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Live Systems Status & Edge Observability",
    description: "Real-time production health and multi-region latency telemetry.",
    url: `${siteUrl}/status`,
    author: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      url: siteUrl,
      jobTitle: "Staff Software Engineer & Systems Architect",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Systems Status",
        item: `${siteUrl}/status`,
      },
    ],
  };

  return (
    <div id="source-page-root" data-source-path="/status">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(statusSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div id="source-page-body" className="source-page-body js l2 section_10 abuhanif-portfolio-shell">
        <SiteHeader activePath="/status" />

        <div className="index" id="container">
          <div className="cwrap">
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
                          Production Telemetry &bull; Empirical Observability
                        </span>
                        <h1 style={{ margin: "4px 0 0 0", fontSize: "28px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Live Systems Status &amp; Edge Health
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          Cloudflare Global Edge • PostgreSQL Supavisor Pool • Multi-Region P99 Latency
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content" style={{ padding: "32px 24px" }}>
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <Link href="/">Home</Link> &gt; <span>Systems Status</span>
                    </div>
                  </div>

                  <div className="bodytext" style={{ maxWidth: "880px", margin: "24px 0" }}>
                    <StatusDashboardClient />
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
