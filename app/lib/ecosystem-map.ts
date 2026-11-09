export interface EcosystemRelation {
  projectSlug: string;
  projectTitle: string;
  blogSlug: string;
  blogTitle: string;
  blogExcerpt: string;
  labAnchor: string;
  labToolName: string;
  labBadge: string;
  serviceSlug: string;
  serviceTitle: string;
  servicePrice: string;
  serviceTimeline: string;
}

export const ecosystemRelations: EcosystemRelation[] = [
  {
    projectSlug: "cloudflare-edge-ecommerce",
    projectTitle: "Cloudflare Edge Multi-Tenant E-Commerce Platform",
    blogSlug: "nextjs-300-tools-platform-architecture-seo",
    blogTitle: "How I Built a 300+ Tool Calculator Platform with Next.js (Architecture & SEO Lessons)",
    blogExcerpt: "How a unified registry, next-intl localized routing, and client bundle isolation cut First Load JS by 94.9% across 3,200+ statically generated pages.",
    labAnchor: "/lab#edge-radar",
    labToolName: "Global Edge Latency Radar & Bundle Profiler",
    labBadge: "Static Edge SSG",
    serviceSlug: "technical-programmatic-seo",
    serviceTitle: "Technical & Programmatic SEO Engineering",
    servicePrice: "$3,800",
    serviceTimeline: "1-2 Weeks",
  },
  {
    projectSlug: "financial-telemetry-pipeline",
    projectTitle: "Real-Time Financial Telemetry Pipeline",
    blogSlug: "realtime-telemetry-supabase-postgres-cdc",
    blogTitle: "Zero-Latency Real-Time Telemetry with Supabase and Postgres CDC",
    blogExcerpt: "Architecting a financial-grade pipeline processing 50,000+ continuous events/sec with sub-25ms end-to-end delivery.",
    labAnchor: "/lab#edge-radar",
    labToolName: "Global Edge Latency Radar & WebSockets",
    labBadge: "Live P99 Benchmark",
    serviceSlug: "distributed-telemetry-engine",
    serviceTitle: "Distributed Telemetry & Event Streaming Engine",
    servicePrice: "$14,000",
    serviceTimeline: "3-4 Weeks",
  },
  {
    projectSlug: "cloudflare-edge-ecommerce",
    projectTitle: "Cloudflare Edge Multi-Tenant E-Commerce Platform",
    blogSlug: "nextjs-16-cloudflare-pages-architecture",
    blogTitle: "Architecting High-Throughput Next.js 16 Applications on Cloudflare Pages",
    blogExcerpt: "Deploying Next.js 16 on Cloudflare Pages using OpenNext. Sub-25ms global TTFB, zero cold starts, and 64% infrastructure cost reduction.",
    labAnchor: "/lab#edge-radar",
    labToolName: "Cloudflare Pages Global Edge Radar",
    labBadge: "Edge Network Telemetry",
    serviceSlug: "cloudflare-edge-migration",
    serviceTitle: "Cloudflare Edge & Serverless Migration",
    servicePrice: "$6,500",
    serviceTimeline: "1-2 Weeks",
  },
  {
    projectSlug: "postgres-performance-audit",
    projectTitle: "High-Concurrency PostgreSQL Performance Audit",
    blogSlug: "mastering-postgres-indexing-query-optimization",
    blogTitle: "Mastering Database Indexing: How We Dropped Query Times From 4.2s to 12ms",
    blogExcerpt: "A systematic approach to diagnosing slow PostgreSQL queries, eliminating sequential scans, and designing composite indexes for high concurrency.",
    labAnchor: "/lab#postgres-planner",
    labToolName: "PostgreSQL EXPLAIN ANALYZE Planner",
    labBadge: "Interactive Query Visualizer",
    serviceSlug: "database-optimization",
    serviceTitle: "PostgreSQL Performance & Query Sprint",
    servicePrice: "$4,500",
    serviceTimeline: "1-2 Weeks",
  },
  {
    projectSlug: "zero-trust-auth-service",
    projectTitle: "Zero-Trust Distributed Auth & RBAC Microservice",
    blogSlug: "swapping-microservices-for-modular-monolith",
    blogTitle: "Why We Swapped 12 Microservices for a Modular Monolith in 2026",
    blogExcerpt: "How consolidating distributed network overhead into clean in-process modular domain boundaries improved p99 latency by 78% and eliminated distributed deadlocks.",
    labAnchor: "/lab#topology-explorer",
    labToolName: "Streaming Topology & Failover Visualizer",
    labBadge: "Topology Blueprint",
    serviceSlug: "architecture-audit",
    serviceTitle: "Architecture & Codebase Diagnostic Audit",
    servicePrice: "$3,200",
    serviceTimeline: "3-5 Days",
  },
  {
    projectSlug: "enterprise-ai-document-search",
    projectTitle: "Enterprise AI Document Search & RAG Pipeline",
    blogSlug: "realtime-telemetry-supabase-postgres-cdc",
    blogTitle: "Zero-Latency Real-Time Telemetry with Supabase and Postgres CDC",
    blogExcerpt: "Scaling high-throughput embedding generation and vector search alongside real-time database change feeds.",
    labAnchor: "/lab#topology-explorer",
    labToolName: "Enterprise RAG & Event Topology",
    labBadge: "AI Systems Topology",
    serviceSlug: "mvp-feature-sprint",
    serviceTitle: "Full-Stack SaaS MVP Engineering Sprint",
    servicePrice: "$12,000",
    serviceTimeline: "3-4 Weeks",
  },
  {
    projectSlug: "developer-docs-engine",
    projectTitle: "High-Performance Developer Documentation Engine",
    blogSlug: "nextjs-16-cloudflare-pages-architecture",
    blogTitle: "Architecting High-Throughput Next.js 16 Applications on Cloudflare Pages",
    blogExcerpt: "How static-first MDX compilation with Turbopack and Cloudflare Edge caching achieves perfect 100/100 Lighthouse metrics.",
    labAnchor: "/lab#topology-explorer",
    labToolName: "Edge AST Compiler & CDN Simulator",
    labBadge: "Edge Performance",
    serviceSlug: "high-converting-landing-pages",
    serviceTitle: "High-Converting Next.js Landing Pages & CRO Architecture",
    servicePrice: "$2,800",
    serviceTimeline: "1-2 Weeks",
  },
  {
    projectSlug: "etl-automation-engine",
    projectTitle: "Autonomous Data Ingestion & ETL Automation Engine",
    blogSlug: "mastering-postgres-indexing-query-optimization",
    blogTitle: "Mastering Database Indexing: How We Dropped Query Times From 4.2s to 12ms",
    blogExcerpt: "Queue-backed BullMQ worker pipelines and range-partitioned PostgreSQL tables processing multi-gigabyte client reporting feeds.",
    labAnchor: "/lab#postgres-planner",
    labToolName: "PostgreSQL Partition & Query Planner",
    labBadge: "Batch Ingestion Simulator",
    serviceSlug: "database-optimization",
    serviceTitle: "PostgreSQL Performance & Query Sprint",
    servicePrice: "$4,500",
    serviceTimeline: "1-2 Weeks",
  },
];

const SERVICE_ECOSYSTEM_ALIASES: Record<string, string> = {
  "technical-programmatic-seo": "developer-docs-engine",
  "social-media-automation": "etl-automation-engine",
  "custom-web-saas": "zero-trust-auth-service",
  "greenfield-mvp": "cloudflare-edge-ecommerce",
  "fractional-staff-architect": "postgres-performance-audit",
  "distributed-telemetry-engine": "financial-telemetry-pipeline",
  "architecture-audit": "zero-trust-auth-service",
  "mvp-feature-sprint": "enterprise-ai-document-search",
  "cloudflare-edge-migration": "cloudflare-edge-ecommerce",
  "database-optimization": "postgres-performance-audit",
};

export function getEcosystemForProject(projectSlug: string): EcosystemRelation {
  const match = ecosystemRelations.find((e) => e.projectSlug === projectSlug);
  return match || ecosystemRelations[0];
}

export function getEcosystemForBlog(blogSlug: string): EcosystemRelation {
  const match = ecosystemRelations.find((e) => e.blogSlug === blogSlug);
  return match || ecosystemRelations[0];
}

export function getEcosystemForService(serviceSlug: string): EcosystemRelation {
  const directMatch = ecosystemRelations.find((e) => e.serviceSlug === serviceSlug);
  if (directMatch) return directMatch;

  const targetProjectSlug = SERVICE_ECOSYSTEM_ALIASES[serviceSlug];
  if (targetProjectSlug) {
    const aliasMatch = ecosystemRelations.find((e) => e.projectSlug === targetProjectSlug);
    if (aliasMatch) return aliasMatch;
  }

  return ecosystemRelations[0];
}
