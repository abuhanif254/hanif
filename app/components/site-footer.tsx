import Link from "next/link";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="global-site-footer">
      {/* =========================================================================
          TIER 1: Pre-Footer Consultation & Timezone Availability Ribbon
          ========================================================================= */}
      <div className="global-footer-ribbon">
        <div className="wrapper global-footer-ribbon-content">
          <div className="global-footer-ribbon-text">
            <span className="global-footer-ribbon-kicker">
              Available for Strategic Engineering Contracts &amp; Advisory
            </span>
            <h3 className="global-footer-ribbon-title">
              Architecting High-Throughput, Fault-Tolerant Systems for Scale.
            </h3>
            <p className="global-footer-ribbon-sub">
              Specialized in distributed backend pipelines, database optimization, Next.js 16 edge delivery, and full-stack technical leadership.
            </p>
          </div>
          <div className="global-footer-ribbon-actions">
            <Link href="/pricing#inquiry" className="global-footer-btn-primary">
              Request Project Consultation &rsaquo;
            </Link>
            <Link href="/pricing" className="global-footer-btn-secondary">
              View Pricing Matrix &rsaquo;
            </Link>
            <div className="global-footer-timezone-pill">
              <span className="uptime-dot">●</span> Active Timezones: US Pacific (UTC-8) • Central European (UTC+2) • Asia/Dhaka (UTC+6)
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: 5-Column High-Density Engineering Directory
          ========================================================================= */}
      <div className="wrapper">
        <div className="global-footer-grid">
          {/* Column 1: Identity & Authority Profile */}
          <div className="global-footer-col col-profile">
            <div className="footer-brand-header">
              <strong className="footer-author-name">MD Abu Hanif Mia</strong>
              <span className="footer-author-title">Staff Software Engineer &amp; Systems Architect</span>
            </div>
            <p className="footer-bio-text">
              Building mission-critical production platforms with high observability, deterministic database throughput, and sub-30ms global edge latency across startups and enterprise ecosystems.
            </p>
            <div className="footer-sla-badge">
              <span className="badge-bullet">●</span> <strong>99.99% Production Uptime SLA</strong>
            </div>
            <div className="footer-contact-details">
              <div>
                <strong>Direct Email:</strong>{" "}
                <a href="mailto:contact@abuhanif.dev" className="footer-highlight-link">
                  contact@abuhanif.dev
                </a>
              </div>
              <div>
                <strong>Location:</strong> Dhaka, Bangladesh (Global Remote)
              </div>
            </div>
            <div className="footer-ecosystem-badges">
              <span className="eco-badge">Next.js 16</span>
              <span className="eco-badge">Go</span>
              <span className="eco-badge">PostgreSQL</span>
              <span className="eco-badge">Cloudflare</span>
              <span className="eco-badge">Supabase</span>
            </div>
          </div>

          {/* Column 2: Architecture & Focus Domains */}
          <div className="global-footer-col">
            <h4 className="footer-col-title">Architecture Domains</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/#competencies">Distributed Systems &amp; Pipelines</Link>
              </li>
              <li>
                <Link href="/#competencies">Next.js 16 App Router &amp; React 19</Link>
              </li>
              <li>
                <Link href="/#competencies">PostgreSQL Query &amp; Index Tuning</Link>
              </li>
              <li>
                <Link href="/#competencies">Cloudflare Pages &amp; Edge Compute</Link>
              </li>
              <li>
                <Link href="/#competencies">Real-Time WebSockets &amp; Telemetry</Link>
              </li>
              <li>
                <Link href="/#competencies">AI Document Search &amp; RAG (pgvector)</Link>
              </li>
              <li>
                <Link href="/#competencies">Microservices to Modular Monoliths</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Work Showcase & Case Studies */}
          <div className="global-footer-col">
            <h4 className="footer-col-title">Work &amp; Case Studies</h4>
            <ul className="footer-links-list case-studies-list">
              <li>
                <Link href="/projects/financial-telemetry-pipeline" className="footer-project-link">
                  <strong>Financial Telemetry Pipeline</strong>
                  <span className="footer-meta-pill">$18,500 Scope • 12M events/s</span>
                </Link>
              </li>
              <li>
                <Link href="/projects/cloudflare-edge-ecommerce" className="footer-project-link">
                  <strong>Cloudflare Edge E-Commerce</strong>
                  <span className="footer-meta-pill">$24,000 Scope • 95ms P99</span>
                </Link>
              </li>
              <li>
                <Link href="/projects/enterprise-ai-document-search" className="footer-project-link">
                  <strong>Enterprise AI Document Search</strong>
                  <span className="footer-meta-pill">$14,000 Scope • 500k Docs</span>
                </Link>
              </li>
              <li>
                <Link href="/projects/postgres-performance-audit" className="footer-project-link">
                  <strong>PostgreSQL Performance Audit</strong>
                  <span className="footer-meta-pill">$4,800 Scope • 10x Throughput</span>
                </Link>
              </li>
              <li className="footer-cta-link-item">
                <Link href="/projects" className="footer-view-all">
                  View All Work Projects &rsaquo;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Transparent Services & Pricing */}
          <div className="global-footer-col">
            <h4 className="footer-col-title">Services &amp; Pricing</h4>
            <ul className="footer-links-list pricing-list">
              <li>
                <Link href="/pricing" className="footer-price-item">
                  <span className="service-name">Codebase &amp; Architecture Audit</span>
                  <span className="price-tag">$3,500</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-price-item">
                  <span className="service-name">PostgreSQL Performance Tuning</span>
                  <span className="price-tag">$4,800</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-price-item">
                  <span className="service-name">Edge Web Platform Build</span>
                  <span className="price-tag">$8,500</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-price-item">
                  <span className="service-name">Full-Stack MVP Engineering</span>
                  <span className="price-tag">$15,000</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-price-item">
                  <span className="service-name">Fractional Tech Lead Retainer</span>
                  <span className="price-tag">$6,500/mo</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-price-item">
                  <span className="service-name">Ad-Hoc Advisory Rate Card</span>
                  <span className="price-tag">$140/hr</span>
                </Link>
              </li>
              <li className="footer-cta-link-item">
                <Link href="/pricing" className="footer-view-all">
                  View Full Pricing Matrix &rsaquo;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Technical Articles & Whitepapers */}
          <div className="global-footer-col">
            <h4 className="footer-col-title">Technical Blog</h4>
            <ul className="footer-links-list articles-list">
              <li>
                <Link href="/blog/nextjs-16-cloudflare-pages-architecture" className="footer-article-link">
                  <span>Next.js 16 on Cloudflare Pages</span>
                  <span className="read-time">12 min read</span>
                </Link>
              </li>
              <li>
                <Link href="/blog/realtime-telemetry-supabase-postgres-cdc" className="footer-article-link">
                  <span>Supabase Postgres CDC Telemetry</span>
                  <span className="read-time">9 min read</span>
                </Link>
              </li>
              <li>
                <Link href="/blog/swapping-microservices-for-modular-monolith" className="footer-article-link">
                  <span>Microservices to Modular Monolith</span>
                  <span className="read-time">11 min read</span>
                </Link>
              </li>
              <li>
                <Link href="/blog/mastering-postgres-indexing-query-optimization" className="footer-article-link">
                  <span>Postgres Indexing for Concurrency</span>
                  <span className="read-time">8 min read</span>
                </Link>
              </li>
              <li className="footer-cta-link-item">
                <Link href="/blog" className="footer-view-all">
                  View Technical Blog Archive &rsaquo;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================================================
            TIER 3: Cloud & Edge Infrastructure Telemetry Strip
            ========================================================================= */}
        <div className="global-footer-telemetry">
          <div className="telemetry-item">
            <span className="telemetry-label">Framework Engine:</span>
            <span className="telemetry-value">Next.js 16.3 (Turbopack + SSG)</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">Edge Network:</span>
            <span className="telemetry-value">Cloudflare Pages (330+ Cities)</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">Database Tier:</span>
            <span className="telemetry-value">Supabase PostgreSQL 16 (RLS)</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">Delivery SLA:</span>
            <span className="telemetry-value">99.99% Production Uptime</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">Latency Metric:</span>
            <span className="telemetry-value">&lt; 30ms Global P99</span>
          </div>
        </div>

        {/* =========================================================================
            TIER 4: Global Primary Navigation Bar
            ========================================================================= */}
        <div id="footernav" className="global-footer-nav">
          <ul>
            <li className="first">
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#about">About Abu Hanif</Link>
            </li>
            <li>
              <Link href="/#competencies">Engineering Focus</Link>
            </li>
            <li>
              <Link href="/projects">Work Showcase</Link>
            </li>
            <li>
              <Link href="/pricing">Services &amp; Pricing</Link>
            </li>
            <li>
              <Link href="/blog">Technical Blog</Link>
            </li>
            <li>
              <Link href="/pricing#inquiry">Consultation Inquiry</Link>
            </li>
            <li className="last">
              <Link href="/admin" style={{ color: "#38bdf8", fontWeight: "700" }}>
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* =========================================================================
            TIER 5: Legal, Intellectual Property & Compliance Strip
            ========================================================================= */}
        <div className="global-footer-legal">
          <div className="legal-sow-statement">
            <strong>Professional Engagement Guarantee:</strong> All engineering contracts, architecture blueprints, and codebase implementations are executed under explicit Statement of Work (SOW) agreements with 100% intellectual property assignment and a comprehensive 30-day post-launch warranty.
          </div>
          <div className="legal-meta-row">
            <div className="copyright-text">
              &copy; {currentYear} <strong>MD Abu Hanif Mia (Abu Hanif)</strong>. All rights reserved. Deployed statically to Cloudflare Pages edge network.
            </div>
            <div className="compliance-links">
              <span>MIT License for Open Source Snippets</span>
              <span className="divider">•</span>
              <span>Mutual NDA Protected</span>
              <span className="divider">•</span>
              <span>Zero Tracking Pixels</span>
              <span className="divider">•</span>
              <Link href="/admin" className="admin-access-link">
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
