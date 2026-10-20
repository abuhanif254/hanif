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
];

export function getEcosystemForProject(projectSlug: string): EcosystemRelation {
  const match = ecosystemRelations.find((e) => e.projectSlug === projectSlug);
  return match || ecosystemRelations[0];
}

export function getEcosystemForBlog(blogSlug: string): EcosystemRelation {
  const match = ecosystemRelations.find((e) => e.blogSlug === blogSlug);
  return match || ecosystemRelations[0];
}

export function getEcosystemForService(serviceSlug: string): EcosystemRelation {
  const match = ecosystemRelations.find((e) => e.serviceSlug === serviceSlug);
  return match || ecosystemRelations[0];
}
