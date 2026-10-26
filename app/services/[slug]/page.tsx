import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServices, getServiceBySlug, SERVICE_SLUG_ALIASES } from "../../lib/portfolio-store";
import { getEcosystemForService } from "../../lib/ecosystem-map";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await getServices();
  const slugSet = new Set<string>();
  services.forEach((s) => slugSet.add(s.slug));
  Object.keys(SERVICE_SLUG_ALIASES).forEach((alias) => slugSet.add(alias));
  return Array.from(slugSet).map((slug) => ({
    slug,
  }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

const keywordMapping: Record<string, { title: string; metaDesc: string; keywords: string[] }> = {
  "database-optimization": {
    title: "PostgreSQL Query Optimization & Database Performance",
    metaDesc: "Surgical database performance tuning, B-tree/GIN/BRIN composite indexing, connection pooling, and sub-20ms P99 query latency audits by Staff Engineer Abu Hanif.",
    keywords: [
      "Hire PostgreSQL Consultant",
      "PostgreSQL Query Optimization Specialist",
      "Database Performance Audit",
      "EXPLAIN ANALYZE Optimization",
      "PostgreSQL Indexing Specialist",
      "Slow Query Tuning",
    ],
  },
  "cloudflare-edge-migration": {
    title: "Cloudflare Pages & OpenNext Edge Migration",
    metaDesc: "Migrate Next.js monolithic or AWS infrastructure to Cloudflare Pages edge compute. Sub-30ms global TTFB, zero cold starts, and 64% cloud bill reduction.",
    keywords: [
      "Cloudflare Pages Migration Consultant",
      "OpenNext Next.js 16 Architect",
      "Serverless Edge Optimization",
      "Cloud Cost Reduction AWS to Cloudflare",
      "Zero Downtime Edge Migration",
    ],
  },
  "architecture-audit": {
    title: "Systems Architecture & Codebase Diagnostic Audit",
    metaDesc: "A comprehensive architectural diagnostic inspection of your application, database queries, memory leaks, and cloud infrastructure costs with a 25+ page roadmap.",
    keywords: [
      "Systems Architecture Audit Consultant",
      "Codebase Diagnostic Review",
      "Technical Debt Remediation",
      "PostgreSQL Bottleneck Audit",
      "Staff Software Engineer Audit",
    ],
  },
  "mvp-feature-sprint": {
    title: "Full-Stack SaaS MVP Engineering Sprint",
    metaDesc: "High-velocity delivery from technical specifications to a production-grade web platform on Next.js 16, Supabase, and Cloudflare with 100% client IP ownership.",
    keywords: [
      "Full-Stack SaaS MVP Developer",
      "Hire Next.js 16 React 19 Engineer",
      "Supabase PostgreSQL SaaS Builder",
      "Production MVP in 4 Weeks",
      "Staff Full-Stack Architect",
    ],
  },
  "distributed-telemetry-engine": {
    title: "Distributed Telemetry & Event Streaming Architect",
    metaDesc: "High-throughput message streaming, pub/sub infrastructure, and sub-25ms WebSocket tick delivery built to handle 10M+ daily events with fault tolerance.",
    keywords: [
      "Distributed Systems Architect",
      "Event Streaming Engineer",
      "High-Throughput WebSocket Pipeline",
      "Go Tokio Concurrency Specialist",
      "Kafka Redis Streaming Architect",
    ],
  },
  "fractional-staff-engineer": {
    title: "Fractional Staff Systems Architect Retainer",
    metaDesc: "On-demand senior technical leadership, architectural RFC reviews, PR sign-offs, and critical path execution for growing engineering teams.",
    keywords: [
      "Fractional Staff Software Engineer",
      "Fractional Systems Architect",
      "Engineering Leadership Retainer",
      "Technical Advisory for Startups",
      "Staff Engineer on Demand",
    ],
  },
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Engineering Service Not Found | Abu Hanif" };
  }

  const customSeo = keywordMapping[service.slug] || {
    title: `${service.title} — Consulting & Architecture`,
    metaDesc: service.description,
    keywords: [service.title, "Systems Architecture", "Abu Hanif", "Staff Software Engineer"],
  };

  return {
    title: customSeo.title,
    description: customSeo.metaDesc,
    keywords: customSeo.keywords,
    alternates: {
      canonical: `${siteUrl}/services/${service.slug}`,
    },
    openGraph: {
      title: customSeo.title,
      description: customSeo.metaDesc,
      url: `${siteUrl}/services/${service.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: customSeo.title,
      description: customSeo.metaDesc,
      creator: "@abuhanif",
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const eco = getEcosystemForService(service.slug);
  const priceNum = parseInt(service.priceDisplay.replace(/[^0-9]/g, ""), 10) || 2500;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      alternateName: "Abu Hanif",
      jobTitle: "Staff Software Engineer & Systems Architect",
      url: siteUrl,
      email: "abuhanifmain@gmail.com",
    },
    offers: {
      "@type": "Offer",
      price: priceNum,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    termsOfService: `${siteUrl}/pricing`,
    areaServed: "Worldwide",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the delivery timeline for ${service.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The standard delivery timeline is ${service.timeline}. Milestone deadlines and sprint scope are locked in writing in the formal Statement of Work before kickoff.`,
        },
      },
      {
        "@type": "Question",
        name: "Who owns the intellectual property and code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "100% Client Ownership. All code, database schemas, deployment pipelines, and documentation are committed directly to your company's private Git repository from day one.",
        },
      },
      {
        "@type": "Question",
        name: "What warranty or SLA is included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every fixed-scope engagement includes an unconditional 30-day post-launch bug warranty and performance SLA verification at zero additional charge.",
        },
      },
      {
        "@type": "Question",
        name: "How are payments structured?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fixed-scope sprints are structured 50% upfront upon signing the SOW to reserve dedicated engineering calendar capacity, and 50% upon verified production sign-off.",
        },
      },
    ],
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
        name: "Pricing & SOW",
        item: `${siteUrl}/pricing`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `${siteUrl}/services/${service.slug}`,
      },
    ],
  };

  return (
    <div id="source-page-root" data-source-path={`/services/${service.slug}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div id="source-page-body" className="source-page-body js l2 section_10 abuhanif-portfolio-shell">
        <SiteHeader activePath="/pricing" />

        <div className="index" id="container">
          <div className="cwrap">
            <div id="main">
              <div className="mwrap">
                {/* Hero Header */}
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
                          Fixed-Scope Systems Architecture Sprint
                        </span>
                        <h1 style={{ margin: "4px 0 0 0", fontSize: "28px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {service.title}
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          Guaranteed Milestone Delivery • 100% Client IP Ownership • 30-Day Bug Warranty
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content" style={{ padding: "32px 24px" }}>
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <Link href="/">Home</Link> &gt; <Link href="/pricing">Pricing &amp; SOW</Link> &gt; <span>{service.title}</span>
                    </div>
                  </div>

                  <div className="bodytext" style={{ maxWidth: "880px", margin: "24px 0" }}>
                    {/* Key Stats Bar */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                        backgroundColor: "#0b132b",
                        border: "1px solid #1e293b",
                        borderTop: "3px solid #2563eb",
                        borderRadius: "8px",
                        padding: "20px 24px",
                        marginBottom: "32px",
                        boxShadow: "0 4px 16px rgba(11,25,44,0.3)",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Fixed Milestone Investment
                        </span>
                        <div style={{ fontSize: "28px", fontWeight: 900, color: "#10b981", margin: "2px 0" }}>
                          {service.priceDisplay}
                        </div>
                        <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                          Pricing Model: <strong>{service.pricingType.toUpperCase()}</strong>
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Guaranteed Timeline
                        </span>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "4px 0" }}>
                          ⏱ {service.timeline}
                        </div>
                        <span style={{ fontSize: "12px", color: "#38bdf8" }}>
                          ● Dedicated Sprint Bandwidth
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <a
                          href="https://cal.com/abuhanif/15min"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "10px 18px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "13px",
                            textDecoration: "none",
                            boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
                          }}
                        >
                          📅 Schedule 15-Min Discovery Call ↗
                        </a>
                        <Link
                          href="/pricing#sow-builder"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "8px 16px",
                            backgroundColor: "#111e38",
                            color: "#38bdf8",
                            border: "1px solid #1e293b",
                            borderRadius: "6px",
                            fontWeight: 600,
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          📋 Customize in SOW Builder
                        </Link>
                      </div>
                    </div>

                    {/* Executive Problem Overview */}
                    <div style={{ marginBottom: "32px" }}>
                      <h2 style={{ fontSize: "20px", color: "#0f172a", borderBottom: "2px solid #2563eb", paddingBottom: "8px", marginBottom: "14px" }}>
                        Overview &amp; Problem Diagnosis
                      </h2>
                      <p style={{ fontSize: "15px", lineHeight: "1.75", color: "#334155" }}>
                        {service.description}
                      </p>
                    </div>

                    {/* Complete Deliverables Breakdown */}
                    <div style={{ marginBottom: "36px" }}>
                      <h2 style={{ fontSize: "20px", color: "#0f172a", borderBottom: "2px solid #2563eb", paddingBottom: "8px", marginBottom: "16px" }}>
                        Scope of Deliverables &amp; Engineering Specifications
                      </h2>
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "20px 24px",
                        }}
                      >
                        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", lineHeight: "1.8", color: "#334155" }}>
                          {service.deliverables.map((deliv, idx) => (
                            <li key={idx} style={{ marginBottom: "8px" }}>
                              <strong>{deliv.split(" - ")[0] || deliv.split(": ")[0] || deliv}</strong>
                              {deliv.includes(" - ") ? ` — ${deliv.split(" - ")[1]}` : deliv.includes(": ") ? `: ${deliv.split(": ")[1]}` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Connected Ecosystem Card: Proof in Production & Lab Simulator */}
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderLeft: "4px solid #10b981",
                        borderRadius: "8px",
                        padding: "24px",
                        marginBottom: "36px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#047857", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        EMPIRICAL PROOF &bull; ARCHITECTURE ECOSYSTEM
                      </span>
                      <h3 style={{ margin: "4px 0 10px 0", fontSize: "18px", color: "#0f172a" }}>
                        Delivered in Production: {eco.projectTitle}
                      </h3>
                      <p style={{ margin: "0 0 16px 0", fontSize: "13.5px", color: "#475569", lineHeight: "1.6" }}>
                        This service package directly reflects the production architecture engineered for <strong>{eco.projectTitle}</strong>. You can inspect the live empirical telemetry benchmarks or read the complete technical deep-dive publication.
                      </p>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <Link
                          href={`/projects/${eco.projectSlug}`}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "12.5px",
                            textDecoration: "none",
                          }}
                        >
                          Read Production Case Study &rsaquo;
                        </Link>
                        <Link
                          href={eco.labAnchor}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#f1f5f9",
                            color: "#0f172a",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "12.5px",
                            textDecoration: "none",
                          }}
                        >
                          🔬 Open {eco.labToolName} &rsaquo;
                        </Link>
                        <Link
                          href={`/blog/${eco.blogSlug}`}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#f1f5f9",
                            color: "#8b5cf6",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "12.5px",
                            textDecoration: "none",
                          }}
                        >
                          📖 Read Technical Article &rsaquo;
                        </Link>
                      </div>
                    </div>

                    {/* Frequently Asked Questions (Google Rich Snippets) */}
                    <div style={{ marginBottom: "36px" }}>
                      <h2 style={{ fontSize: "20px", color: "#0f172a", borderBottom: "2px solid #2563eb", paddingBottom: "8px", marginBottom: "16px" }}>
                        Frequently Asked Questions &amp; Engagement Terms
                      </h2>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {faqSchema.mainEntity.map((faq, idx) => (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              borderRadius: "6px",
                              padding: "16px 20px",
                            }}
                          >
                            <h3 style={{ margin: "0 0 6px 0", fontSize: "15px", color: "#0f172a" }}>
                              {faq.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: "13.5px", color: "#475569", lineHeight: "1.6" }}>
                              {faq.acceptedAnswer.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Block */}
                    <div
                      style={{
                        padding: "24px",
                        backgroundColor: "#0b132b",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                        color: "#ffffff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "17px", color: "#ffffff", display: "block" }}>
                          Ready to kick off {service.title}?
                        </strong>
                        <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
                          Lock in dedicated sprint capacity or book a 15-minute discovery call.
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <a
                          href="https://cal.com/abuhanif/15min"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "10px 18px",
                            backgroundColor: "#10b981",
                            color: "#050e1d",
                            borderRadius: "6px",
                            fontWeight: 800,
                            fontSize: "13px",
                            textDecoration: "none",
                          }}
                        >
                          📅 Schedule 15-Min Call ↗
                        </a>
                        <Link
                          href="/pricing#inquiry"
                          style={{
                            padding: "10px 18px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            borderRadius: "6px",
                            fontWeight: 700,
                            fontSize: "13px",
                            textDecoration: "none",
                          }}
                        >
                          Submit Project RFP &rsaquo;
                        </Link>
                      </div>
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
