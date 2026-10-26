export interface BlogCategoryPillar {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  matchingTags: string[];
  consultingServiceSlug: string;
  consultingServiceTitle: string;
  consultingPrice: string;
}

export const blogCategoryPillars: BlogCategoryPillar[] = [
  {
    slug: "postgresql",
    name: "PostgreSQL & Database Systems",
    tagline: "Deep-dive query profiling, indexing strategies, CDC streaming, and connection pooling.",
    description: "Architectural blueprints and surgical performance tuning patterns for PostgreSQL 16, partial and composite indexing, connection pooling with PgBouncer/Supavisor, Change Data Capture (CDC), and sub-20ms P99 query latency under high concurrency.",
    keywords: [
      "PostgreSQL Optimization",
      "Postgres Indexing",
      "EXPLAIN ANALYZE",
      "Supabase CDC",
      "Database Tuning Consultant",
      "PostgreSQL Performance Audit",
    ],
    matchingTags: ["PostgreSQL", "Databases", "SQL", "Supabase"],
    consultingServiceSlug: "database-optimization",
    consultingServiceTitle: "PostgreSQL Performance & Query Sprint",
    consultingPrice: "$4,500",
  },
  {
    slug: "nextjs",
    name: "Next.js 16 & React 19 Architecture",
    tagline: "Server Components, App Router patterns, edge runtimes, and zero-bundle-cost data fetching.",
    description: "Production engineering with Next.js 16 App Router, React 19 Server Components, streaming SSR, edge caching with stale-while-revalidate, and high-velocity frontend architecture.",
    keywords: [
      "Next.js 16 Architecture",
      "React 19 Server Components",
      "App Router Best Practices",
      "Next.js Edge Deployment",
      "Next.js Consultant",
    ],
    matchingTags: ["Next.js", "React"],
    consultingServiceSlug: "fullstack-mvp",
    consultingServiceTitle: "Full-Stack SaaS MVP Engineering Sprint",
    consultingPrice: "$12,500",
  },
  {
    slug: "cloudflare",
    name: "Cloudflare Pages & Edge Delivery",
    tagline: "Sub-30ms global TTFB, V8 isolate compute, and serverless edge deployments.",
    description: "Re-architecting traditional Node.js/AWS monoliths onto Cloudflare Pages and Workers edge network across 330+ cities worldwide for sub-30ms global TTFB and massive cloud bill reductions.",
    keywords: [
      "Cloudflare Pages Architecture",
      "Cloudflare Workers Edge",
      "V8 Isolates Serverless",
      "Edge Migration Consultant",
      "Cloudflare Next.js",
    ],
    matchingTags: ["Cloudflare", "DevOps"],
    consultingServiceSlug: "cloudflare-edge-migration",
    consultingServiceTitle: "Cloudflare Edge & Serverless Migration",
    consultingPrice: "$6,500",
  },
  {
    slug: "architecture",
    name: "Distributed Systems & Modular Monoliths",
    tagline: "High-throughput APIs, telemetry streaming, event-driven decoupling, and clean domain design.",
    description: "Strategic software architecture for enterprise web applications: choosing between microservices and modular monoliths, designing event-driven telemetry pipelines (12M+ events/s), and eliminating distributed systems debt.",
    keywords: [
      "Distributed Systems Architecture",
      "Modular Monolith vs Microservices",
      "Event-Driven Telemetry",
      "High-Throughput APIs",
      "Staff Software Engineer Advisory",
    ],
    matchingTags: ["Architecture", "System Design", "Microservices", "Clean Code"],
    consultingServiceSlug: "architecture-audit",
    consultingServiceTitle: "Architecture & Codebase Diagnostic Audit",
    consultingPrice: "$2,500",
  },
  {
    slug: "performance",
    name: "Performance Engineering & P99 Latency",
    tagline: "CPU flamegraph analysis, memory leak isolation, and Core Web Vitals optimization.",
    description: "Systematic performance profiling: diagnosing slow event loops, database lock contention, memory bloat, and optimizing Core Web Vitals (LCP, INP, CLS) for enterprise web applications.",
    keywords: [
      "Performance Engineering",
      "Sub-50ms P99 Latency",
      "Core Web Vitals Optimization",
      "Memory Leak Profiling",
      "High-Concurrency WebSockets",
    ],
    matchingTags: ["Performance", "WebSockets"],
    consultingServiceSlug: "architecture-audit",
    consultingServiceTitle: "Performance & Diagnostic Sprint",
    consultingPrice: "$2,500",
  },
  {
    slug: "rust",
    name: "Rust Systems & Concurrency",
    tagline: "Zero-cost abstractions, memory safety without garbage collection, and Tokio async runtimes.",
    description: "Systems programming with Rust: high-throughput multi-threaded daemons, Tokio event loops, Axum microservices, and compiling Rust to WebAssembly (Wasm) for edge execution.",
    keywords: [
      "Rust Systems Programming",
      "Rust Tokio Concurrency",
      "Rust WebAssembly Edge",
      "Rust vs Go Concurrency",
      "Rust Software Engineer",
    ],
    matchingTags: ["Rust", "Systems", "WebAssembly"],
    consultingServiceSlug: "architecture-audit",
    consultingServiceTitle: "Rust & Systems Concurrency Advisory",
    consultingPrice: "$2,500",
  },
  {
    slug: "security",
    name: "Security Engineering & Zero-Trust Architecture",
    tagline: "Row-Level Security (RLS), HMAC session revocation, passkeys, and distributed RBAC.",
    description: "Enterprise application and infrastructure security: PostgreSQL Row-Level Security (RLS) policies, cryptographically signed tokens, zero-trust RBAC, and vulnerability remediation.",
    keywords: [
      "Zero-Trust Architecture",
      "PostgreSQL RLS",
      "Passkeys WebAuthn",
      "HMAC Token Security",
      "Security Audit Consultant",
    ],
    matchingTags: ["Security", "Authentication", "Zero-Trust", "RLS"],
    consultingServiceSlug: "security-hardening",
    consultingServiceTitle: "Security Hardening & SOC2 Readiness Sprint",
    consultingPrice: "$3,800",
  },
];

export function getCategoryPillarBySlug(slug: string): BlogCategoryPillar | undefined {
  return blogCategoryPillars.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}
