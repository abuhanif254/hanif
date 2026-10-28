import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import ServicesClientView from "./services-client-view";
import { getServices } from "../lib/portfolio-store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Engineering & Growth Services | Technical SEO, Social Automation, Custom Web & SaaS | Abu Hanif",
  description:
    "Enterprise-grade technical services by Staff Software Engineer Abu Hanif: Programmatic SEO, automated social media bots, high-converting landing pages, custom Next.js SaaS platforms, and PostgreSQL performance tuning.",
  keywords: [
    "Programmatic SEO Engineer",
    "Technical SEO Specialist",
    "Social Media Automation Developer",
    "Next.js 16 Landing Page Specialist",
    "Custom Full-Stack SaaS Developer",
    "PostgreSQL Query Optimization Consultant",
    "Cloudflare Edge Migration Architect",
    "High-Conversion Web Applications",
    "Staff Software Engineer Services",
    "Abu Hanif",
    "MD Abu Hanif Mia",
  ],
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Engineering & Growth Services | Abu Hanif",
    description:
      "Programmatic SEO, autonomous social media bots, sub-50ms landing pages, custom SaaS platforms, and database optimization delivered on fixed-price milestones with 100% IP handover.",
    url: `${siteUrl}/services`,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering & Growth Services | Abu Hanif",
    description:
      "Programmatic SEO, autonomous social media bots, sub-50ms landing pages, custom SaaS platforms, and database optimization.",
    creator: "@abuhanif",
  },
};

const servicesFaqs = [
  {
    q: "Why fixed-price milestone sprints instead of hourly agency billing?",
    a: "Hourly billing penalizes rapid execution and encourages budget creep. Fixed-price milestone sprints ensure clear scope, fixed costs, and guaranteed timelines before a single line of code is written. I assume delivery risk, you get production-verified deliverables.",
  },
  {
    q: "Who owns the intellectual property and code repository?",
    a: "You do. 100% of all code, git history, documentation, database schemas, and assets belong exclusively to your company under standard clean IP assignment terms from day one.",
  },
  {
    q: "How does the Programmatic SEO engineering service differ from traditional SEO?",
    a: "Traditional SEO is manual and slow. Programmatic SEO creates automated data pipelines that generate thousands of fast, highly-targeted, indexable pages with full JSON-LD schema graphs and 100/100 Core Web Vitals to capture high-intent organic search volume.",
  },
  {
    q: "What is your typical turnaround time for kickoff?",
    a: "Landing pages and diagnostic audits commence within 48 to 72 hours of an executed Statement of Work. Full-Stack SaaS MVP builds are scheduled in dedicated engineering blocks to ensure 100% focus.",
  },
  {
    q: "Do you offer post-launch support and bug warranties?",
    a: "Yes. Every fixed sprint includes an unconditional 30-day post-launch warranty covering any bugs, edge regressions, or configuration defects at zero additional charge.",
  },
  {
    q: "Can you collaborate with our existing engineering team?",
    a: "Absolutely. I frequently operate as a fractional Staff Architect, reviewing PRs, designing system RFCs, and mentoring internal engineers in production-grade TypeScript, Go, and PostgreSQL patterns.",
  },
];

export default async function ServicesHubPage() {
  const services = await getServices();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Engineering & Growth Services Catalog",
    description: "Enterprise software engineering, programmatic SEO, automation bots, and database optimization services by Staff Software Engineer MD Abu Hanif Mia.",
    itemListElement: services.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Person",
          name: "MD Abu Hanif Mia",
          jobTitle: "Staff Software Engineer & Systems Architect",
          url: siteUrl,
        },
        areaServed: {
          "@type": "Place",
          name: "Worldwide (Remote)",
        },
      },
      price: service.priceDisplay.replace(/[^0-9]/g, "") || "3500",
      priceCurrency: "USD",
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: servicesFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
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
        name: "Services & Solutions",
        item: `${siteUrl}/services`,
      },
    ],
  };

  return (
    <div id="source-page-root" data-source-path="/services">
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
        <SiteHeader activePath="/services" />

        <div className="index" id="container">
          <div className="cwrap">
            <div id="main">
              <div className="mwrap">
                <div id="content" style={{ width: "100%", maxWidth: "100%", float: "none", margin: 0, padding: 0 }}>
                  {/* Semantic Breadcrumbs */}
                  <div id="breadcrumbs" style={{ padding: "12px 24px", background: "rgba(6, 11, 25, 0.95)", borderBottom: "1px solid #1e293b" }}>
                    <div className="wrapper" style={{ fontSize: "12px", color: "#94a3b8" }}>
                      <Link href="/" style={{ color: "#38bdf8", textDecoration: "none" }}>
                        Home
                      </Link>{" "}
                      &gt; <span style={{ color: "#ffffff", fontWeight: 700 }}>Engineering &amp; Growth Services</span>
                    </div>
                  </div>

                  {/* High-Impact Visual Client Experience */}
                  <ServicesClientView services={services} />
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
