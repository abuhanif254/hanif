import Link from "next/link";

export default function WorkShowcaseSection() {
  return (
    <>
      {/* WORK SHOWCASE SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          margin: "1.4em 0 0.5em 0",
          borderBottom: "2px solid #9CBE41",
          paddingBottom: "6px",
        }}
      >
        <h2 id="work" style={{ fontSize: "1.5em", margin: 0, color: "#053056", borderBottom: "none", paddingBottom: 0 }}>
          Work Showcase &amp; Engineering Case Studies
        </h2>
        <Link href="/projects" style={{ fontSize: "13px", color: "#053056", fontWeight: "bold", textDecoration: "underline" }}>
          View All Projects &amp; Architectures ›
        </Link>
      </div>
      <p>
        Below is a selection of recent production systems delivered, detailing the core architectural challenge, solution, and measurable production outcome:
      </p>

      {/* Project 1 */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderLeft: "4px solid #053056",
          padding: "16px 20px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
          <strong style={{ fontSize: "17px", color: "#053056" }}>
            <Link href="/projects/financial-telemetry-pipeline" style={{ color: "inherit", textDecoration: "none" }}>
              Real-Time Financial Telemetry Pipeline
            </Link>
          </strong>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#16a34a",
              background: "#ecfdf5",
              padding: "3px 8px",
              borderRadius: "3px",
              border: "1px solid #a7f3d0",
            }}
          >
            $18,500 Scope
          </span>
        </div>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
          <strong>The Challenge:</strong> Aggregate and normalize raw order-book streams from 14 exchanges and fan out live market depth to over 45,000 concurrent browser clients with sub-25ms latency.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
          <strong>Architecture:</strong> Concurrent Go ingestion workers, Redis Pub/Sub cluster, TimescaleDB continuous aggregates, and Next.js WebSocket UI with Canvas charts.
        </p>
        <div style={{ fontSize: "13px", color: "#053056", fontWeight: "bold" }}>
          ✓ Outcome: Processed 12,000,000 events/sec at peak with 22ms P99 delivery and 99.995% uptime across 18 months.
        </div>
      </div>

      {/* Project 2 */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderLeft: "4px solid #053056",
          padding: "16px 20px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
          <strong style={{ fontSize: "17px", color: "#053056" }}>
            <Link href="/projects/cloudflare-edge-ecommerce" style={{ color: "inherit", textDecoration: "none" }}>
              Cloudflare Edge Multi-Tenant E-Commerce Platform
            </Link>
          </strong>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#16a34a",
              background: "#ecfdf5",
              padding: "3px 8px",
              borderRadius: "3px",
              border: "1px solid #a7f3d0",
            }}
          >
            $24,000 Scope
          </span>
        </div>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
          <strong>The Challenge:</strong> High serverless cold starts and dynamic database queries caused slow product catalog loads and high shopping cart abandonment during international flash sales.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
          <strong>Architecture:</strong> Next.js 16 App Router on Cloudflare Pages, Supabase PostgreSQL with read-replicas, regional edge caching, and optimistic UI transitions.
        </p>
        <div style={{ fontSize: "13px", color: "#053056", fontWeight: "bold" }}>
          ✓ Outcome: Cut global page render time from 1.8s down to 95ms; lifted checkout conversions by 28% and reduced cloud hosting costs by 64%.
        </div>
      </div>

      {/* Project 3 */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderLeft: "4px solid #053056",
          padding: "16px 20px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
          <strong style={{ fontSize: "17px", color: "#053056" }}>
            <Link href="/projects/enterprise-ai-document-search" style={{ color: "inherit", textDecoration: "none" }}>
              Enterprise AI Document Search &amp; RAG Pipeline
            </Link>
          </strong>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "#16a34a",
              background: "#ecfdf5",
              padding: "3px 8px",
              borderRadius: "3px",
              border: "1px solid #a7f3d0",
            }}
          >
            $14,000 Scope
          </span>
        </div>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
          <strong>The Challenge:</strong> Engineering and operations teams were losing over 4 hours per week hunting down scattered technical documentation and API specifications across Confluence and GitHub.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
          <strong>Architecture:</strong> Python/FastAPI ingestion service, PostgreSQL with pgvector embeddings, hybrid BM25 + semantic reranking, and citation-enforced interactive AI assistant.
        </p>
        <div style={{ fontSize: "13px", color: "#053056", fontWeight: "bold" }}>
          ✓ Outcome: Reduced technical query resolution time by 82% across 500,000+ indexed documents with 96.4% citation accuracy.
        </div>
      </div>

      {/* WORK PRICES & SERVICES SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          margin: "1.4em 0 0.5em 0",
          borderBottom: "2px solid #9CBE41",
          paddingBottom: "6px",
        }}
      >
        <h2 id="pricing" style={{ fontSize: "1.5em", margin: 0, color: "#053056", borderBottom: "none", paddingBottom: 0 }}>
          Services &amp; Transparent Work Pricing
        </h2>
        <Link href="/pricing" style={{ fontSize: "12px", fontWeight: "bold", color: "#053056", textDecoration: "none" }}>
          View Full Pricing &amp; Comparison Matrix &rsaquo;
        </Link>
      </div>
      <p>
        All engineering engagements are scoped transparently with defined deliverables, clear milestone schedules, and zero hidden overages:
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0 24px 0", fontSize: "14px" }}>
        <thead>
          <tr style={{ background: "#053056", color: "#ffffff", textAlign: "left" }}>
            <th style={{ padding: "10px 14px" }}>Service Package</th>
            <th style={{ padding: "10px 14px" }}>Investment / Rate</th>
            <th style={{ padding: "10px 14px" }}>Timeline</th>
            <th style={{ padding: "10px 14px" }}>Core Deliverables</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
            <td style={{ padding: "12px 14px", fontWeight: "bold", color: "#053056" }}>Architecture &amp; Codebase Audit</td>
            <td style={{ padding: "12px 14px", fontWeight: "bold", color: "#16a34a" }}>$2,500 Fixed</td>
            <td style={{ padding: "12px 14px" }}>3–5 Days</td>
            <td style={{ padding: "12px 14px" }}>
              25+ page diagnostic report, SQL slow query analysis, security audit, cloud hosting savings plan, 60-min debrief call.
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
            <td style={{ padding: "12px 14px", fontWeight: "bold", color: "#053056" }}>Full-Stack MVP &amp; Feature Sprint</td>
            <td style={{ padding: "12px 14px", fontWeight: "bold", color: "#16a34a" }}>$8,500 Fixed</td>
            <td style={{ padding: "12px 14px" }}>2–3 Weeks</td>
            <td style={{ padding: "12px 14px" }}>
              Production-grade Next.js 16 + React 19 app, Supabase PostgreSQL schema with RLS, auth, CI/CD, 30-day warranty.
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
            <td style={{ padding: "12px 14px", fontWeight: "bold", color: "#053056" }}>Fractional Staff / Principal Eng</td>
            <td style={{ padding: "12px 14px", fontWeight: "bold", color: "#16a34a" }}>$4,800 / month</td>
            <td style={{ padding: "12px 14px" }}>Ongoing (15-20h/wk)</td>
            <td style={{ padding: "12px 14px" }}>
              Dedicated Slack access, weekly architecture reviews, PR approvals, core subsystem coding, engineering hiring support.
            </td>
          </tr>
        </tbody>
      </table>

      {/* 12 COMPETENCIES LIST */}
      <h3 id="competencies" style={{ fontSize: "1.25em", margin: "1.4em 0 0.5em 0", color: "#053056" }}>
        Core Technical Competencies
      </h3>
      <p>
        Abu Hanif provides deep technical expertise across the following core software engineering disciplines:
      </p>
      <ul className="no-spacing-list">
        <li><Link href="/projects?category=systems">Rust &amp; Go Systems Concurrency (Tokio, Axum, Channels)</Link></li>
        <li><Link href="/projects?category=web">Modern React 19 &amp; Next.js 16 Web Applications</Link></li>
        <li><Link href="/projects?category=systems">Distributed Systems Architecture</Link></li>
        <li><Link href="/projects?category=systems">High-Throughput API Engineering</Link></li>
        <li><Link href="/lab">PostgreSQL Query &amp; Index Optimization (Systems Lab)</Link></li>
        <li><Link href="/lab">Cloudflare Pages &amp; Edge Infrastructure (Live Radar)</Link></li>
        <li><Link href="/projects?category=ai">Python Scientific Computing &amp; Automation</Link></li>
        <li><Link href="/projects?category=ai">AI &amp; LLM Semantic Vector Search (pgvector)</Link></li>
        <li><Link href="/pricing">Zero-Trust Authentication &amp; RBAC</Link></li>
        <li><Link href="/pricing">CI/CD &amp; Infrastructure Automation</Link></li>
        <li><Link href="/blog/swapping-microservices-for-modular-monolith">Microservices &amp; Event Sourcing</Link></li>
        <li><Link href="/pricing">Technical Debt Remediation &amp; Code Auditing</Link></li>
      </ul>

      <strong className="heading4">Email contact@abuhanif.dev Today for Architecture Inquiries</strong>
      <p>
        Every technical engagement receives the direct, personal attention of Abu Hanif who can quickly evaluate requirements, untangle complex bottlenecks, and ship high-velocity solutions.
      </p>
    </>
  );
}
