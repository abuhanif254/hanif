import type { Metadata } from "next";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import HeroBanner from "./components/home/hero-banner";
import BadgesBar from "./components/home/badges-bar";
import BioAndCredentials from "./components/home/bio-and-credentials";
import WorkShowcaseSection from "./components/home/work-showcase-section";
import TechnicalBlogFeed from "./components/home/technical-blog-feed";
import HomeSidebar from "./components/home/home-sidebar";
import BottomContactStripe from "./components/home/bottom-contact-stripe";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanif.dev";

export const metadata: Metadata = {
  title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
  description:
    "MD Abu Hanif Mia (Abu Hanif) - Staff Software Engineer & Systems Architect specializing in distributed systems, Next.js 16, PostgreSQL optimization, and Cloudflare edge architecture.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description:
      "Scalable Systems • Distributed Architecture • High-Performance Web Applications. View portfolio work showcase, transparent pricing, systems lab, and technical blog.",
    url: siteUrl,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/images/og-card.png`,
        width: 1200,
        height: 630,
        alt: "MD Abu Hanif Mia (Abu Hanif) - Staff Software Engineer & Systems Architect",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description:
      "Scalable Systems • Distributed Architecture • High-Performance Web Applications. View portfolio work showcase, transparent pricing, systems lab, and technical blog.",
    creator: "@abuhanif",
    images: [`${siteUrl}/images/og-card.png`],
  },
};

export default function HomePage() {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "MD Abu Hanif Mia",
    alternateName: "Abu Hanif",
    jobTitle: "Staff Software Engineer & Systems Architect",
    description:
      "Staff Software Engineer specializing in distributed systems, PostgreSQL performance optimization, Cloudflare edge compute, and full-stack Next.js architecture.",
    url: siteUrl,
    image: `${siteUrl}/images/profile.png`,
    email: "contact@abuhanif.dev",
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Programming Hero",
        description: "Complete Web Development Course with Excellence (Batch-12 • WEB12-3991)",
      },
    ],
    knowsAbout: [
      "Distributed Systems",
      "PostgreSQL Query Optimization",
      "Next.js 16 & React 19",
      "Rust Tokio Concurrency",
      "Go CSP Goroutines",
      "Cloudflare Pages Edge Compute",
      "TypeScript",
      "AI pgvector RAG Architecture",
    ],
    sameAs: [
      "https://github.com/abuhanif",
      "https://linkedin.com/in/abuhanif",
      "https://twitter.com/abuhanif",
    ],
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Abu Hanif Engineering Portfolio",
    url: siteUrl,
    description:
      "Official portfolio, interactive systems lab, technical blog, and architectural case studies of Staff Software Engineer Abu Hanif.",
    author: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />

      <div id="source-page-root" data-source-path="/">
        <div id="index" className="source-page-body js justia-robertjfleming-com">
          <SiteHeader activePath="/" />

          <div id="container" className="index">
            <div className="cwrap">
              <div id="main">
                <div className="mwrap">
                  <HeroBanner />
                  <div className="tcfrags"></div>

                  <div id="content">
                    <div id="breadcrumbs">
                      <div className="wrapper"></div>
                    </div>

                    <div className="bodytext">
                      <div className="description">
                        <BadgesBar />
                        <BioAndCredentials />
                        <WorkShowcaseSection />
                      </div>
                    </div>

                    <div className="sidebar primary-sidebar"></div>
                    <TechnicalBlogFeed />
                  </div>

                  <HomeSidebar />
                </div>
                <div className="stpr"></div>
              </div>

              <BottomContactStripe />
              <SiteFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
