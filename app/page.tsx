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
import EnterpriseTestimonialsSection from "./components/enterprise-testimonials-section";
import { getProjects, getBlogPosts, getTestimonials } from "./lib/portfolio-store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description:
      "Scalable Systems • Distributed Architecture • High-Performance Web Applications. View portfolio work showcase, transparent pricing, systems lab, and technical blog.",
    creator: "@abuhanif",
  },
};

export default async function HomePage() {
  const [projects, blogPosts, testimonials] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getTestimonials(),
  ]);

  return (
    <>
      <div id="source-page-root" data-source-path="/">
        <div id="index" className="source-page-body js abuhanif-portfolio-shell">
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
                        <WorkShowcaseSection projects={projects} />
                        <EnterpriseTestimonialsSection testimonials={testimonials} />
                      </div>
                    </div>

                    <div className="sidebar primary-sidebar"></div>
                    <TechnicalBlogFeed articles={blogPosts} />
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
