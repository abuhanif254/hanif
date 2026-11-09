export interface ProfileData {
  fullName: string;
  kicker: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  availabilityStatus: string;
  isAvailable: boolean;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    facebook?: string;
    instagram?: string;
    discord?: string;
  };
}

export interface Competency {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  descriptionMarkdown: string;
  clientName: string;
  demoUrl?: string;
  githubUrl?: string;
  priceTag: string;
  impactMetric: string;
  techStack: string[];
  isFeatured: boolean;
  published: boolean;
  imageUrl?: string;
  screenshots?: string[];
}

export interface ServicePricing {
  id: string;
  title: string;
  slug: string;
  description: string;
  pricingType: "fixed" | "hourly" | "retainer";
  priceDisplay: string;
  timeline: string;
  deliverables: string[];
  isPopular: boolean;
  isActive: boolean;
  category?: "growth-seo" | "web-saas" | "systems-architecture" | "systems-cloud";
  tagline?: string;
  roiMetric?: string;
  techStack?: string[];
  engagementSteps?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  isPublished: boolean;
  coverImageUrl?: string;
}

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  authorAvatar?: string;
  verifiedMetric?: string;
  deliverableTag?: string;
  projectSlug?: string;
  serviceSlug?: string;
  engagementScope?: string;
  engagementDuration?: string;
  deliverablesCompleted?: string[];
  verificationBadge?: string;
  category?: "telemetry" | "edge" | "postgres" | "ai" | "security" | "fullstack";
}

export const initialProfile: ProfileData = {
  fullName: "MD Abu Hanif Mia",
  kicker: "Staff Software Engineer & Systems Architect",
  headline: "Clean Architecture • High Performance • Scalable Systems",
  bio: "Senior Full-Stack Software Engineer & Systems Architect with 9+ years designing high-throughput distributed applications, edge networks, and developer platforms. Specializing in TypeScript, Next.js, Go, PostgreSQL, and Cloudflare Pages.",
  email: "abuhanifmain@gmail.com",
  phone: "+880 1724-010261",
  location: "Sadar Upazila, Kishoreganj, Dhaka, Bangladesh",
  availabilityStatus: "Available for Q4 Contracts & High-Impact Roles",
  isAvailable: true,
  socialLinks: {
    github: "https://github.com/abuhanif254",
    linkedin: "https://www.linkedin.com/in/md-abu-hanif-mia",
    twitter: "https://x.com/MohammadBitull1",
    facebook: "https://www.facebook.com/bitulla",
    instagram: "https://www.instagram.com/bitullah_aj",
    discord: "https://discord.com",
  },
};

export const competencies: Competency[] = [
  {
    title: "Distributed Systems",
    slug: "distributed-systems",
    tagline: "Fault-tolerant, high-concurrency event-driven backends",
    description: "Designing message queues, worker pools, partition-tolerant storage, and resilient consensus algorithms capable of handling millions of requests per minute.",
    skills: ["Go", "Kafka", "Redis", "gRPC", "Docker", "Kubernetes"],
  },
  {
    title: "High-Throughput APIs",
    slug: "high-throughput-apis",
    tagline: "Ultra-low latency REST, GraphQL & WebSocket services",
    description: "Building production-grade APIs optimized for sub-50ms P99 response times with robust rate limiting, caching strategies, and zero-downtime deployments.",
    skills: ["Node.js", "TypeScript", "FastAPI", "WebSockets", "Cloudflare Workers"],
  },
  {
    title: "Next.js & React Applications",
    slug: "nextjs-react-apps",
    tagline: "Accessible, interactive, server-rendered web applications",
    description: "Crafting modern web apps utilizing Next.js App Router, React Server Components, state management, and strict TypeScript types with 100/100 Core Web Vitals.",
    skills: ["Next.js 16", "React 19", "Tailwind CSS", "Zustand", "Radix UI"],
  },
  {
    title: "PostgreSQL & Database Optimization",
    slug: "database-optimization",
    tagline: "Complex schema modeling, query indexing & RLS security",
    description: "Architecting relational schemas, optimizing slow query plans with EXPLAIN ANALYZE, writing migration workflows, and configuring connection pooling.",
    skills: ["PostgreSQL", "Supabase", "Prisma", "pgvector", "TimescaleDB"],
  },
  {
    title: "Cloud Infrastructure & DevOps",
    slug: "cloud-devops",
    tagline: "Automated CI/CD, Infrastructure as Code & Edge Hosting",
    description: "Deploying immutable infrastructure on AWS, GCP, and Cloudflare with Terraform, automated GitHub Actions pipelines, and comprehensive Prometheus telemetry.",
    skills: ["Cloudflare Pages", "AWS ECS/Lambda", "Terraform", "GitHub Actions"],
  },
  {
    title: "AI & LLM Agent Integrations",
    slug: "ai-llm-integrations",
    tagline: "Semantic search, RAG pipelines & autonomous agent workflows",
    description: "Integrating modern LLMs into business logic via vector embeddings, structured outputs, streaming completions, and multi-step tool-use agents.",
    skills: ["OpenAI", "Anthropic Claude", "LangChain", "pgvector", "LlamaIndex"],
  },
  {
    title: "Security & Auth Architecture",
    slug: "security-auth",
    tagline: "Zero-trust auth, OAuth2, RBAC & compliance readiness",
    description: "Implementing hardened authentication, session revocation, cryptographic signatures, SOC2 compliance guardrails, and role-based permissions.",
    skills: ["OAuth2 / OIDC", "Supabase Auth", "JWT", "WebAuthn / Passkeys"],
  },
  {
    title: "CI/CD & Deployment Automation",
    slug: "cicd-automation",
    tagline: "Fast, reliable testing and deployment pipelines",
    description: "Eliminating manual release anxiety with preview environments, automated unit & integration testing, semantic versioning, and blue-green rollouts.",
    skills: ["GitHub Actions", "Docker Buildx", "Turborepo", "Vitest", "Playwright"],
  },
  {
    title: "Microservices & Event Architecture",
    slug: "microservices-event-architecture",
    tagline: "Decoupled domain services with transactional consistency",
    description: "Breaking monolithic bottlenecks into bounded context services using outbox patterns, CQRS, and message-driven synchronization.",
    skills: ["RabbitMQ", "Apache Pulsar", "Event Sourcing", "Domain-Driven Design"],
  },
  {
    title: "Mobile & Cross-Platform Apps",
    slug: "mobile-apps",
    tagline: "High-performance React Native & responsive progressive web apps",
    description: "Delivering native mobile experiences with shared business logic, offline-first syncing, and biometric hardware authentication.",
    skills: ["React Native", "Expo", "PWA", "SQLite", "Native Modules"],
  },
  {
    title: "Technical Debt Remediation",
    slug: "technical-debt-remediation",
    tagline: "Surgical refactoring of legacy codebases without breaking changes",
    description: "Systematically modernizing brittle legacy systems, increasing test coverage, untangling tight coupling, and lowering developer onboarding friction.",
    skills: ["Strangler Fig Pattern", "TypeScript Migration", "Code Audits"],
  },
  {
    title: "System Performance Audits",
    slug: "performance-audits",
    tagline: "Profiling memory leaks, CPU bottlenecks & network latency",
    description: "Deep profiling with Chrome DevTools, Flamegraphs, and synthetic load tests to identify and eliminate latency bottlenecks across client and server.",
    skills: ["k6 Load Testing", "Flamegraph", "Core Web Vitals", "Lighthouse"],
  },
];

export const initialProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Real-Time Financial Telemetry Pipeline",
    slug: "financial-telemetry-pipeline",
    summary: "High-throughput stream processing pipeline ingesting crypto & equities order books with sub-25ms latency.",
    descriptionMarkdown: `### The Challenge
A high-frequency trading platform needed to aggregate raw order-book events from 14 exchanges, normalize data formats, and fan out real-time market depth to over 45,000 active browser clients.

### Architectural Solution
- Built a concurrent Go microservice layer connected to exchange WebSocket feeds.
- Implemented a Redis cluster pub/sub backbone paired with TimescaleDB for continuous tick aggregations.
- Deployed a Next.js client utilizing binary WebSocket streaming and Canvas-based chart rendering.

### Measurable Impact
- **Throughput**: 12,000,000 events processed per second at peak.
- **Latency**: P99 delivery to browser under 22ms.
- **Uptime**: 99.995% reliability across 18 consecutive months.`,
    clientName: "Fintech Venture",
    demoUrl: "/lab",
    githubUrl: "https://github.com/abuhanif254",
    priceTag: "$18,500 Scope",
    impactMetric: "12M Events/Sec • <22ms P99",
    techStack: ["Go", "Next.js", "WebSockets", "TimescaleDB", "Redis", "Docker"],
    isFeatured: true,
    published: true,
    imageUrl: "/images/projects/telemetry-pipeline-arch.svg",
    screenshots: [
      "/images/projects/telemetry-pipeline-arch.svg",
      "/images/projects/postgres-audit-arch.svg",
    ],
  },
  {
    id: "proj-2",
    title: "Cloudflare Edge Multi-Tenant E-Commerce Platform",
    slug: "cloudflare-edge-ecommerce",
    summary: "Serverless multi-tenant storefront platform rendering personalized product catalogs at the global edge.",
    descriptionMarkdown: `## The Challenge
A direct-to-consumer brand aggregator struggled with slow dynamic page loads during global flash sales, resulting in cart abandonment and high server scaling bills.

## Architectural Solution
- Re-architected catalog generation onto Cloudflare Pages and Workers Edge with Next.js 16.
- Implemented Supabase PostgreSQL with read-replicas and regional caching.
- Built instant checkout flows with optimistic UI state transitions and idempotent order processing.

## Measurable Impact
- **Conversion Rate**: Lifted checkout conversion by 28%.
- **Global Latency**: Average initial page render reduced from 1.8s to 95ms worldwide.
- **Cost Reduction**: Cut monthly cloud compute costs by 64%.`,
    clientName: "Retail Holdings",
    demoUrl: "/lab",
    githubUrl: "https://github.com/abuhanif254",
    priceTag: "$24,000 Scope",
    impactMetric: "95ms Global P99 • 28% Conversion Lift",
    techStack: ["Next.js 16", "Cloudflare Pages", "Supabase", "TypeScript", "Tailwind CSS"],
    isFeatured: true,
    published: true,
    imageUrl: "/images/projects/cloudflare-edge-arch.svg",
    screenshots: [
      "/images/projects/cloudflare-edge-arch.svg",
      "/images/projects/telemetry-pipeline-arch.svg",
    ],
  },
  {
    id: "proj-3",
    title: "Enterprise AI Document Search & RAG Pipeline",
    slug: "enterprise-ai-document-search",
    summary: "Autonomous document ingestion and vector semantic search engine indexing 500,000+ internal technical docs.",
    descriptionMarkdown: `## The Challenge
Engineering teams spent an average of 4.5 hours per week looking for internal system documentation, API contracts, and architecture design records scattered across Jira, Confluence, and GitHub.

## Architectural Solution
- Built an event-driven webhook pipeline indexing markdown, PDF, and source code into pgvector embeddings.
- Configured hybrid BM25 + dense semantic vector search with re-ranking.
- Created an interactive AI chat interface with strict citation verification and RBAC permission enforcement.

## Measurable Impact
- **Query Resolution**: Search and answer discovery speed reduced by 82%.
- **Accuracy**: 96.4% verified citation accuracy on internal knowledge evaluations.`,
    clientName: "Enterprise Software Corp",
    demoUrl: "/lab",
    priceTag: "$14,000 Scope",
    impactMetric: "82% Faster Discovery • 500k+ Docs Indexed",
    techStack: ["Python", "FastAPI", "pgvector", "PostgreSQL", "React", "Anthropic Claude"],
    isFeatured: true,
    published: true,
    imageUrl: "/images/projects/ai-rag-pipeline-arch.svg",
    screenshots: [
      "/images/projects/ai-rag-pipeline-arch.svg",
    ],
  },
  {
    id: "proj-4",
    title: "High-Concurrency PostgreSQL Performance Audit",
    slug: "postgres-performance-audit",
    summary: "Diagnostic query profiling, connection pool tuning, and index redesign eliminating deadlocks for 3.5M active accounts.",
    descriptionMarkdown: `## The Challenge
A high-throughput SaaS platform faced persistent connection pool exhaustion and frequent transaction deadlocks during daily peak traffic spikes.

## Architectural Solution
- Conducted deep EXPLAIN (ANALYZE, BUFFERS) profiling on the 50 highest-impact query paths.
- Rebuilt composite B-Tree indexes, partial indexes, and BRIN indexes on large append-only telemetry tables.
- Installed PgBouncer with transaction-level pooling and tuned max_connections and shared_buffers.
- Hardened Row Level Security (RLS) policies without introducing query degradation.

## Measurable Impact
- **CPU Reduction**: Reduced median database CPU utilization from 92% to 28%.
- **Zero Deadlocks**: 0 connection drops or transaction deadlocks observed over 12 consecutive months.
- **Query Latency**: Sub-5ms P99 query latency on multi-million row joined tables.`,
    clientName: "Nexus Cloud Platform",
    demoUrl: "/lab",
    priceTag: "$11,000 Scope",
    impactMetric: "-68% CPU • 0 Deadlocks Observed",
    techStack: ["PostgreSQL 16", "PgBouncer", "EXPLAIN ANALYZE", "Linux Performance", "Supabase"],
    isFeatured: true,
    published: true,
    imageUrl: "/images/projects/postgres-audit-arch.svg",
    screenshots: [
      "/images/projects/postgres-audit-arch.svg",
    ],
  },
  {
    id: "proj-5",
    title: "Zero-Trust Distributed Auth & RBAC Microservice",
    slug: "zero-trust-auth-service",
    summary: "Centralized identity provider service supporting multi-organization tenancy, SAML SSO, and Passkeys.",
    descriptionMarkdown: `## The Challenge
A SaaS company with multiple sub-products needed to consolidate disparate login systems into a unified identity provider meeting enterprise SOC2 Type II requirements.

## Architectural Solution
- Developed an RFC 6749 compliant OAuth2/OIDC provider with granular scope delegation.
- Added WebAuthn passkey registration, biometric sign-in, and instantaneous session revocation via Redis.
- Implemented audit logging with cryptographic hash chaining for tamper resistance.

## Measurable Impact
- **Scale**: Managing 3,500,000+ active enterprise user identities.
- **Security**: Passed third-party penetration audit with zero critical or high vulnerabilities.`,
    clientName: "B2B SaaS Group",
    priceTag: "$12,500 Scope",
    impactMetric: "3.5M Identities • Zero Security Incidents",
    techStack: ["Go", "PostgreSQL", "Redis", "OAuth2", "WebAuthn", "Docker"],
    isFeatured: true,
    published: true,
    imageUrl: "/images/projects/zero-trust-auth-arch.svg",
    screenshots: [
      "/images/projects/zero-trust-auth-arch.svg",
    ],
  },
  {
    id: "proj-6",
    title: "High-Performance Developer Documentation Engine",
    slug: "developer-docs-engine",
    summary: "Ultra-fast headless documentation portal with full-text search, live API playground, and dark mode.",
    descriptionMarkdown: `## The Challenge
Developers were bouncing from legacy docs due to sluggish navigation, lack of interactive code execution, and broken mobile formatting.

## Architectural Solution
- Designed and built a static-first Next.js portal utilizing Turbopack and MDX compilation.
- Embedded interactive API request builders with copyable curl/JavaScript/Python snippets.
- Integrated Algolia DocSearch with instant keyboard navigation (Cmd+K).

## Measurable Impact
- **Lighthouse**: Perfect 100/100 across Performance, Accessibility, Best Practices, and SEO.
- **Engagement**: Increased average developer session duration by 140%.`,
    clientName: "Developer Tooling Startup",
    demoUrl: "/lab",
    githubUrl: "https://github.com/abuhanif254",
    priceTag: "$8,500 Scope",
    impactMetric: "100/100 Lighthouse • 140% Session Duration",
    techStack: ["Next.js", "TypeScript", "MDX", "Tailwind CSS", "Algolia"],
    isFeatured: true,
    published: true,
    imageUrl: "/images/projects/developer-docs-arch.svg",
    screenshots: [
      "/images/projects/developer-docs-arch.svg",
    ],
  },
  {
    id: "proj-7",
    title: "Autonomous Data Ingestion & ETL Automation Engine",
    slug: "etl-automation-engine",
    summary: "Fault-tolerant data extraction and pipeline engine processing daily multi-gigabyte client reporting feeds.",
    descriptionMarkdown: `## The Challenge
Manual data entry and fragile overnight Python scripts caused frequent data corruption and delayed client reporting by up to 36 hours.

## Architectural Solution
- Implemented a queue-backed Node.js and BullMQ worker pipeline with automated exponential backoff retries.
- Integrated schema validation via Zod to quarantine corrupted inputs before database insertion.
- Created an automated notification webhook for Slack alerts and Prometheus telemetry.

## Measurable Impact
- **Cost Savings**: Saved client $48,000 annually in manual developer intervention hours.
- **Delivery**: Report generation time dropped from 36 hours to under 8 minutes.`,
    clientName: "Logistics Platform",
    priceTag: "$11,000 Scope",
    impactMetric: "8 Min Delivery (from 36h) • $48k/yr Saved",
    techStack: ["Node.js", "BullMQ", "PostgreSQL", "AWS S3", "Zod", "Docker"],
    isFeatured: true,
    published: true,
    imageUrl: "/images/projects/etl-automation-arch.svg",
    screenshots: [
      "/images/projects/etl-automation-arch.svg",
    ],
  },
];

export const initialServices: ServicePricing[] = [
  {
    id: "serv-seo",
    title: "Technical & Programmatic SEO Engineering",
    slug: "technical-programmatic-seo",
    description: "Automated programmatic SEO architectures, rich Schema.org knowledge graph injection, and 100/100 Core Web Vitals engineering to dominate organic search intent at scale.",
    pricingType: "fixed",
    priceDisplay: "$3,500",
    timeline: "1–2 Weeks",
    category: "growth-seo",
    tagline: "Programmatic URL Graphs, Schema Knowledge Injection & Sub-1.2s LCP",
    roiMetric: "100/100 Lighthouse • 10k+ Indexable Pages • 0 CLS",
    techStack: ["Next.js 16", "TypeScript", "Schema.org", "Google Indexing API", "Tailwind CSS", "Cloudflare Pages"],
    deliverables: [
      "Programmatic URL generation architecture supporting 10,000+ targeted indexable pages",
      "Comprehensive Schema.org JSON-LD knowledge graph (Organization, Service, FAQ, Article)",
      "Dynamic automated XML sitemap generation with Google Indexing API auto-pinging",
      "Core Web Vitals 100/100 audit (sub-1.2s LCP, CLS = 0.000, sub-50ms INP)",
      "Semantic keyword clustering, crawl-budget optimization & internal linking graph",
      "Automated canonicalization and hreflang tag configuration",
      "Real-time Google Search Console indexation telemetry and rankings monitoring",
    ],
    engagementSteps: [
      "1. Crawl & Indexing Audit (Search intent, site taxonomy, and keyword gaps)",
      "2. Programmatic Schema Architecture (JSON-LD knowledge graphs & metadata pipelines)",
      "3. Core Web Vitals Optimization (Eliminating render-blocking resources, 0 CLS)",
      "4. Launch & Search Console Mesh (Auto-pinging sitemaps & rank monitoring)",
    ],
    isPopular: true,
    isActive: true,
  },
  {
    id: "serv-automation",
    title: "Social Media Automation & Growth Bot Systems",
    slug: "social-media-automation",
    description: "Autonomous multi-platform content syndication pipelines, scheduling engines, and webhook-driven engagement bots across X/Twitter, LinkedIn, Discord, and Telegram.",
    pricingType: "fixed",
    priceDisplay: "$4,000",
    timeline: "2 Weeks",
    category: "growth-seo",
    tagline: "Autonomous Multi-Platform Syndication & Scheduled Engagement Queues",
    roiMetric: "100% Automated Syndication • 4 Major Social Networks • 0 Manual Effort",
    techStack: ["Node.js", "BullMQ", "Twitter API v2", "LinkedIn API", "Discord Webhooks", "Telegram Bot API", "Redis"],
    deliverables: [
      "Multi-platform automated syndication engine connecting X/Twitter, LinkedIn, Discord & Telegram",
      "Headless BullMQ queuing worker with automatic exponential backoff retry mechanisms",
      "AI-assisted post hook formatting and automated dynamic OpenGraph image rendering",
      "RSS-to-social ingestion pipeline turning blog posts into platform-native threads",
      "Real-time webhook dispatcher mesh with Slack/Discord operational alerts",
      "Tamper-resistant HMAC signature authentication on all incoming webhook triggers",
      "Delivery telemetry dashboard with post analytics and engagement logs",
    ],
    engagementSteps: [
      "1. Channel Architecture & API Provisioning (Twitter v2, LinkedIn, Discord tokens)",
      "2. Queue Worker & Ingestion Pipeline (BullMQ worker setup with Redis storage)",
      "3. Content Formatting Engine (Thread splitting, hashtag optimization & dynamic cards)",
      "4. Production Deployment & Telemetry (Webhook health check & automated failover)",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "serv-landing",
    title: "High-Converting Next.js Landing Pages & CRO",
    slug: "high-converting-landing-pages",
    description: "Ultra-fast, performance-engineered landing pages built on Next.js 16 App Router with sub-50ms TTFB, high-converting interactive widgets, and friction-free payment checkouts.",
    pricingType: "fixed",
    priceDisplay: "$2,800",
    timeline: "5–7 Business Days",
    category: "growth-seo",
    tagline: "Sub-50ms Global Edge TTFB, Frictionless Checkout Funnels & Micro-Interactions",
    roiMetric: "+28% Checkout Conversion • Sub-50ms TTFB • 0 Layout Shifts",
    techStack: ["Next.js 16", "React 19", "Tailwind CSS", "Stripe API", "Cloudflare Pages", "TypeScript"],
    deliverables: [
      "Next.js 16 App Router + React 19 responsive, high-performance landing page",
      "Sub-50ms global edge TTFB via Cloudflare Pages and V8 isolate caching",
      "Interactive pricing/SOW calculator widgets and conversion-tested layout architecture",
      "Frictionless Stripe payment gateway or custom subscription onboarding integration",
      "WCAG 2.1 AAA accessibility, 0 layout shifts (CLS = 0), and mobile-first touch optimization",
      "Privacy-first analytics telemetry (PostHog / Plausible) with zero cookie-banner latency",
      "A/B testing readiness and 30-day post-launch conversion warranty",
    ],
    engagementSteps: [
      "1. Conversion Blueprint & Wireframing (Information hierarchy and offer framing)",
      "2. Next.js 16 Edge Development (Interactive calculators, micro-animations, fast forms)",
      "3. Payment & Analytics Hookup (Stripe checkout, event tracking & lead routing)",
      "4. Edge Launch & Performance SLA (Cloudflare DNS cutover & sub-50ms verification)",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "serv-custom-web",
    title: "Bespoke Custom Web Applications & Enterprise SaaS",
    slug: "custom-web-saas",
    description: "Production-grade, full-stack software platforms engineered from technical requirements to scalable cloud deployment in 3 to 4 weeks on Next.js 16, Supabase, and Cloudflare.",
    pricingType: "fixed",
    priceDisplay: "$14,500",
    timeline: "3–4 Weeks",
    category: "web-saas",
    tagline: "Enterprise Full-Stack Architecture, Zero-Trust Auth & Real-Time Sync",
    roiMetric: "100% Client IP Ownership • Production SaaS in 4 Weeks • 99.99% SLA",
    techStack: ["Next.js 16", "Supabase", "PostgreSQL", "React 19", "Tailwind CSS", "Stripe", "Cloudflare Pages"],
    deliverables: [
      "Production-grade Next.js 16 App Router web platform with React 19 Server Components",
      "Supabase PostgreSQL relational schema, migrations, and Row Level Security (RLS)",
      "Zero-trust authentication (Email Magic Links, OAuth2, Passkeys / WebAuthn)",
      "Stripe subscription billing, metered usage invoices, and customer management portal",
      "Real-time WebSocket collaboration engine and background job queues",
      "Automated CI/CD deployment pipeline with staging preview branches",
      "100% Client Intellectual Property handover + 30-day post-launch warranty",
    ],
    engagementSteps: [
      "1. Technical RFC & Schema Modeling (Database ERD, auth models, API contracts)",
      "2. Sprint 1: Core Platform & Auth (Next.js 16 App Router, Supabase RLS, layout)",
      "3. Sprint 2: Business Logic & Billing (Stripe checkout, WebSockets, background tasks)",
      "4. Sprint 3: Polish, CI/CD & IP Handover (Edge deploy, documentation & repository transfer)",
    ],
    isPopular: true,
    isActive: true,
  },
  {
    id: "serv-1",
    title: "Architecture & Codebase Diagnostic Audit",
    slug: "architecture-audit",
    description: "A comprehensive, deep-dive architectural inspection of your existing application, database queries, memory bottlenecks, security posture, and cloud hosting bills.",
    pricingType: "fixed",
    priceDisplay: "$2,500",
    timeline: "3–5 Business Days",
    deliverables: [
      "Full architecture review of frontend, backend, and API systems",
      "Database index analysis and slow query bottlenecks report (EXPLAIN ANALYZE)",
      "Memory leak profiling, CPU Flamegraph analysis & Core Web Vitals audit",
      "Security audit, dependency vulnerability scan, and RLS inspection",
      "Cloud hosting cost reduction roadmap (AWS/GCP/Cloudflare bills cut by 30-60%)",
      "Detailed 25+ page diagnostic report with prioritized technical debt fixes",
      "60-minute executive strategy walkthrough video call with full Q&A",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "serv-2",
    title: "PostgreSQL Performance & Query Sprint",
    slug: "database-optimization",
    description: "Surgical database tuning, connection pool configuration, composite indexing, and query plan rewrites to achieve sub-20ms P99 latencies under high concurrency.",
    pricingType: "fixed",
    priceDisplay: "$4,500",
    timeline: "1 Week",
    deliverables: [
      "Deep query plan profiling via pg_stat_statements & EXPLAIN (ANALYZE, BUFFERS)",
      "B-tree, GIN (JSONB), and BRIN partial indexing strategy implementation",
      "Connection pooling & transaction isolation tuning (PgBouncer / Supavisor)",
      "Autovacuum, table bloat mitigation, and lock contention remediation",
      "Sub-20ms P99 query latency verification benchmark under simulated load",
      "Zero-downtime migration scripts and developer schema guardrails",
      "Post-deployment production telemetry and 14-day query monitoring",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "serv-3",
    title: "Cloudflare Edge & Serverless Migration",
    slug: "cloudflare-edge-migration",
    description: "Re-architecting monolithic applications or slow multi-region AWS infrastructure onto Cloudflare Pages and Workers Edge for sub-30ms global TTFB and drastic cost savings.",
    pricingType: "fixed",
    priceDisplay: "$6,500",
    timeline: "1–2 Weeks",
    deliverables: [
      "Migration topology design for Next.js App Router on Cloudflare Pages",
      "Edge caching policies, stale-while-revalidate, and global KV/D1 integration",
      "Elimination of serverless cold-start delays using lightweight V8 isolates",
      "Zero-downtime DNS cutover, custom domain SSL/TLS, and automated CI/CD",
      "Cloud infrastructure bill reduction: typical 50% to 75% savings over AWS ECS/EC2",
      "Full staging environment preview deployment on GitHub pull requests",
      "30-day post-migration uptime guarantee and performance SLA verification",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "serv-4",
    title: "Full-Stack SaaS MVP Engineering Sprint",
    slug: "mvp-feature-sprint",
    description: "High-velocity execution from technical requirements to a production-grade, tested, and deployed software platform on Next.js 16, Supabase, and Cloudflare Pages.",
    pricingType: "fixed",
    priceDisplay: "$14,500",
    timeline: "3–4 Weeks",
    deliverables: [
      "Next.js 16 App Router + React 19 responsive, high-performance web platform",
      "Supabase PostgreSQL schema, migrations & granular Row Level Security (RLS)",
      "Stripe payment or custom subscription/metered usage billing integration",
      "Hardened authentication (Email Magic Links, OAuth2, Passkeys / WebAuthn)",
      "Automated CI/CD build pipeline configured on Cloudflare with preview branches",
      "100/100 Core Web Vitals score, strict TypeScript typing, and Zod validation",
      "Complete git repository handover (100% Client IP) + 30-day post-launch warranty",
    ],
    isPopular: true,
    isActive: true,
  },
  {
    id: "serv-5",
    title: "Distributed Telemetry & Event Streaming Engine",
    slug: "distributed-telemetry-engine",
    description: "High-throughput concurrent message streaming, pub/sub infrastructure, and continuous tick aggregations built to process 10M+ events/day with fault tolerance.",
    pricingType: "fixed",
    priceDisplay: "$22,500",
    timeline: "4–6 Weeks",
    deliverables: [
      "Concurrent Go or Node.js streaming ingestion worker layer",
      "Redis Cluster Pub/Sub or Apache Pulsar/Kafka message brokering",
      "TimescaleDB or pgvector analytical aggregations with continuous rollups",
      "Binary WebSocket streaming engine to browser clients (<25ms P99 latency)",
      "Backpressure handling, dead letter queues, and exponential retry mechanisms",
      "Prometheus & Grafana telemetry dashboards with automated alerting",
      "Automated k6 load test suite validating 50,000 concurrent client connections",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "serv-6",
    title: "Fractional Staff Architect / Engineering Retainer",
    slug: "fractional-staff-engineer",
    description: "On-demand senior technical leadership, architectural oversight, complex coding execution, and team mentorship for growing engineering teams and venture-backed startups.",
    pricingType: "retainer",
    priceDisplay: "$5,500 / mo",
    timeline: "Ongoing (15–20 hrs / week)",
    deliverables: [
      "Direct private Slack/Discord channel access with guaranteed 2-hour response",
      "Weekly architecture planning sessions, RFC design reviews, and PR approvals",
      "Hands-on coding execution for complex, mission-critical subsystems",
      "Engineering hiring support, candidate technical interviews, and grading",
      "Infrastructure cost governance, reliability reviews, and disaster recovery plans",
      "Quarterly technical roadmap and executive engineering advisory",
      "Month-to-month flexibility with zero long-term vendor lock-in",
    ],
    isPopular: false,
    isActive: true,
  },
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog-5",
    title: "How I Built a 300+ Tool Calculator Platform with Next.js (Architecture & SEO Lessons)",
    slug: "nextjs-300-tools-platform-architecture-seo",
    excerpt: "Architecture, next-intl i18n, Core Web Vitals fixes, and honest Google Search Console data (379k impressions, 611 clicks) from building nexuscalculator.net.",
    contentMarkdown: `Two years ago, I set out to build a fast, clean website of online calculators. Today, [nexuscalculator.net](https://nexuscalculator.net) has **312 interactive tools** (177 calculators plus 135 developer, PDF, image and media utilities, including a QR code studio), **190 guides**, and more than **3,200 statically generated pages** in four languages, all from a single Next.js 15 App Router codebase.

This is the behind-the-scenes story: the registry architecture, the next-intl routing details, the Core Web Vitals work that cut First Load JS by 94.9%, and my real Google Search Console numbers, including 379k impressions, only 611 clicks, and what that gap taught me about search intent.

If you are building a large, content-rich or multilingual Next.js application, this should save you weeks of trial and error.

![Nexus Calculator Hub, a privacy-first platform with 312 interactive tools in four languages](/images/nexuscalculator-homepage.png)
*Figure 1: Nexus Calculator Hub, a privacy-first platform with 312 interactive tools in four languages.*

## High-Level Architecture Overview

Before writing a single calculator, I set three rules:

1. **Privacy-first processing.** Files and text entered into the PDF, image, formatter and calculator tools are processed in the user's browser (WebAssembly and Canvas APIs), not uploaded to my servers.
2. **Programmatic scalability.** Adding the 300th tool should take about as much effort as adding the 3rd.
3. **Crawl efficiency and edge performance.** Every page is pre-rendered with Static Site Generation (SSG), loads fast, and carries complete JSON-LD structured data.

\`\`\`mermaid
graph TD
Client["Browser / Client"] -->|"HTTPS request"| CDN["Vercel Edge Network"]
CDN -->|"Canonical 301, locale detection, 410 filters"| MW["middleware.ts"]
MW -->|"Static cache hit: SSG HTML + RSC"| EdgeCache["Edge Static Cache"]
MW -->|"Dynamic / API execution"| AppRouter["Next.js 15 App Router"]
subgraph "Core System Registries"
AppRouter --> UnifiedReg["lib/registry: 312 tools"]
AppRouter --> ToolCompReg["lib/toolComponentRegistry: lazy client wrappers"]
AppRouter --> Routing["i18n/routing: en, es, fr, de"]
end
subgraph "SEO and Data Layer"
UnifiedReg --> Sitemap["app/sitemap.ts: single XML sitemap"]
UnifiedReg --> Schema["JSON-LD: SoftwareApplication, HowTo, MathSolver, FAQ"]
AppRouter --> RateLimiter["In-memory rate limiting: 10-30 req/min"]
end
\`\`\`

## Why Next.js 15 (App Router) and Vercel?

With thousands of URLs, client-side SPAs struggle with SEO and traditional CMS setups get slow to maintain. I chose Next.js 15 with the App Router for three reasons:

1. **Static Site Generation.** Calculator pages are mostly static reference content wrapped around an interactive widget. Next.js pre-renders all 3,200+ pages at build time, and serving pre-rendered HTML from the edge keeps time-to-first-byte under 80 ms in my tests.
2. **First-class metadata and route generation.** \`generateStaticParams\`, \`generateMetadata\` and \`app/sitemap.ts\` derive SEO tags, alternates and XML sitemaps directly from TypeScript registries, with no fragile plugins.
3. **Server and Client Component separation.** Layouts, guides, formulas, FAQs and navigation render as lightweight Server Components. Only the interactive form controls and charts ship client-side JavaScript.

I host on Vercel for its zero-config edge CDN, automatic preview deployments for every branch, and built-in handling of localized routing and dynamic OpenGraph images.

## Architecture: Scaling to 300+ Tools Without Code Sprawl

The most expensive mistake on a multi-tool site is a copy-pasted page route per calculator. With 312 tools, that becomes unmaintainable. Nexus uses a central tool registry plus dynamic route templates instead.

### 1. The unified registry (lib/registry/index.ts)

Every tool is defined once as a typed TypeScript object. The search, sitemap, category hubs and internal linking all read from this single source of truth:

\`\`\`typescript
// lib/registry/index.ts (architecture snapshot)
import { calculators } from '@/lib/data/calculators';
import { allToolsConfig } from '@/lib/data/tools';
import { comparisons } from '@/lib/data/comparisons';
import { collections } from '@/lib/data/collections';

export type ToolType = 'calculator' | 'developer-tool' | 'comparison' | 'collection';

export interface UnifiedToolEntry {
  slug: string;
  type: ToolType;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  keywords: string;
  href: string;
  status: 'published';
  lastUpdated?: string;
}

// Aggregated at build time: 177 calculators + 135 developer tools = 312 utilities
export const allTools: readonly UnifiedToolEntry[] = Object.freeze(registry);
\`\`\`

### 2. Avoiding the 3.54 MB bundle trap with ToolViewWrapper

Early on I hit a classic App Router pitfall: importing every tool view into one top-level registry made the build trace bundle all tool dependencies into a 3.54 MB initial client chunk.

The fix was to separate the static metadata registry from the client component registry, and load each widget dynamically inside a dedicated client wrapper:

\`\`\`typescript
// lib/toolComponentRegistry.ts
// Single source of truth mapping tool slugs to client components.
// Imported ONLY by Client Components (ToolViewWrapper.tsx) so Next.js
// build traces do not bundle all 135 tool chunks into every route.
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export const toolRegistry: Record<string, ComponentType<any>> = {
  'json-formatter': dynamic(() =>
    import('@/app/components/tools/JsonFormatterTool').then(m => m.JsonFormatterTool)),
  'diff-checker': dynamic(() =>
    import('@/app/components/tools/DiffCheckerTool').then(m => m.DiffCheckerTool)),
  'sql-formatter': dynamic(() =>
    import('@/app/components/tools/SqlFormatterTool').then(m => m.SqlFormatterTool)),
  'qr-code-generator': dynamic(() =>
    import('@/app/components/tools/QrCodeGeneratorTool').then(m => m.QrCodeGeneratorTool)),
  // ...split the same way across all utilities
};
\`\`\`

The Server Component page (\`app/[locale]/tools/[slug]/page.tsx\`) pre-renders an instant server-side workspace preview. Once hydrated, \`ToolViewWrapper\` lazily loads only the widget that page needs.

## Multilingual Routing with next-intl and Localized Slugs

To capture international search demand, the site is available in **English (\`en\`)**, **Spanish (\`es\`)**, **French (\`fr\`)** and **German (\`de\`)**.

Real localization is more than a \`?lang=es\` parameter. Route paths should match how people search in each language:

| Concept | English URL | Spanish URL | German URL | French URL |
| :--- | :--- | :--- | :--- | :--- |
| **Mortgage Calculator** | \`/en/calculators/mortgage-calculator\` | \`/es/calculadoras/calculadora-de-hipotecas\` | \`/de/rechner/hypothekenrechner\` | \`/fr/calculatrices/calculateur-de-pret-immobilier\` |
| **UK Mortgage** | \`/en/tools/mortgage-calculator-uk\` | \`/es/herramientas/calculadora-hipoteca-reino-unido\` | \`/de/werkzeuge/hypothekenrechner-uk\` | \`/fr/outils/calculateur-hypotheque-royaume-uni\` |
| **JSON Formatter** | \`/en/tools/json-formatter\` | \`/es/herramientas/json-formatter\` | \`/de/werkzeuge/json-formatierer\` | \`/fr/outils/formateur-json\` |

### hreflang and self-referencing canonicals

To avoid duplicate-content problems across 3,200+ pages, one helper in \`seoUtils.ts\` outputs the canonical URL and all language alternates:

\`\`\`typescript
// lib/utils/seoUtils.ts
export function getCanonicalAndAlternates(pathnameKey: string, currentLocale: string, genericSlug?: string) {
  // Generates absolute canonical URL + locale alternates for en, es, fr, de, and x-default
  return {
    canonical: \`\${baseUrl}/\${currentLocale}\${localizedPath}\`,
    languages: {
      en: \`\${baseUrl}/en\${enPath}\`,
      es: \`\${baseUrl}/es\${esPath}\`,
      fr: \`\${baseUrl}/fr\${frPath}\`,
      de: \`\${baseUrl}/de\${dePath}\`,
      'x-default': \`\${baseUrl}/en\${enPath}\`,
    },
  };
}
\`\`\`

> **Key SEO insight:** Do not translate keywords literally. German users search for *Hypothekenrechner*, not a word-for-word version of *Mortgage Calculator*. Translate the search intent, not the vocabulary. This is what helped my localized pages start showing up in European results.

## Backend Security, Auth and Rate Limiting

About 95% of the calculators run entirely client-side. A few utilities, such as HTTP header lookups, DNS inspection, AI mockup generation and my database privacy tools, need server-side execution. To protect those endpoints without slowing serverless responses, I added tailored in-memory rate limiting and auth:

1. **AI image and prompt mockup API (\`/api/tools/ai-image-generator\`):** limited to 10 requests per minute per IP, with an automatic procedural SVG fallback to protect external AI token budgets.
2. **DNS and HTTP header inspector (\`/api/check-headers\`):** capped at 30 requests per minute per IP to prevent outbound socket exhaustion and SSRF-style scanning.
3. **Database privacy endpoints (\`/api/privacy/*\`):** protected by JWT authentication, verifying Firebase bearer tokens (\`adminAuth.verifyIdToken\`) with a fallback to Supabase session cookies.
4. **410 filter in \`middleware.ts\`:** malformed crawler URLs and bot probes (\`/wp-admin\`, \`/Producer\`, \`/Author\`) get an HTTP 410 Gone response, which helps Google drop those dead URLs from its crawl queue.

## Performance Engineering: Cutting First Load JS by 94.9%

The first Lighthouse runs showed two serious bottlenecks:

1. **Bundle bloat.** Every tool view sat in the main client bundle, pushing First Load JS above 3.5 MB.
2. **Font and CSS delays.** Layout shifts from web fonts and render-blocking CSS hurt Core Web Vitals.

### 1. Code-splitting with dynamic client shells

I moved modal overlays (\`CommandPalette\`, \`InstallPrompt\`, \`BackToTop\`, \`CookieBanner\`) into a deferred \`<ClientShell />\` and turned all 312 tool widgets into dynamic imports via \`lib/toolComponentRegistry.ts\`. First Load JS dropped from 3.54 MB to about 180 KB, a 94.9% reduction.

### 2. Self-hosted, subsetted fonts

Instead of calling Google Fonts at runtime (extra DNS lookups and blocking requests), I used \`next/font/google\`, which downloads and self-hosts the font files at build time:

\`\`\`typescript
import { Inter } from 'next/font/google';

// Weights 800/900 removed, saving about 50 KB.
// next/font/google self-hosts the font files from our own domain.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});
\`\`\`

### 3. Removing loading.tsx from dynamic calculator routes

Nested \`loading.tsx\` skeletons on 1,938 dynamic calculator pages risked crawlers reading the loading state instead of the real content. I removed them in favor of instant, statically rendered HTML shells, so Googlebot always sees the full text and formulas on first load.

### The performance scorecard

- **Lighthouse Performance:** from 58 to **96+**
- **Largest Contentful Paint (LCP):** from 4.2 s to **1.1 s**
- **Cumulative Layout Shift (CLS):** **0.00**
- **First Load JS:** down **94.9%** (about 3.54 MB to under 180 KB)

## Technical SEO: Schema Automation and a Single Sitemap

Fast pages are not enough to compete with established calculator sites. Search engines also need a clear, structured understanding of each tool.

### Automated JSON-LD on every calculator page

The page template injects a rich set of schemas:

- **\`SoftwareApplication\`:** marks the tool as a free web utility (\`price: "0"\`), with a \`SpeakableSpecification\` for voice assistants.
- **\`HowTo\`:** generated from the calculator's input fields (enter your values, check units, run the formula).
- **\`MathSolver\` and \`LearningResource\`:** with Google-compliant \`SolveMathAction\` and \`eduQuestionType\` properties.
- **\`FAQPage\`:** structured Q&A covering edge cases, tax brackets and formula explanations.
- **\`BreadcrumbList\`:** Home, Category, Tool.

### The Next.js 15 sitemap conflict

When the site passed 3,000 pages, I tried splitting the sitemap with \`generateSitemaps()\`. With next-intl, the \`[locale]\` middleware segment intercepted the generated child sitemap index and returned an HTML 404 page to Googlebot.

The fix was a single programmatic sitemap (\`app/sitemap.ts\`) with \`revalidate = false\`, served permanently from Vercel's edge CDN:

\`\`\`typescript
// app/sitemap.ts (excerpt)
export const revalidate = false; // served from edge CDN, no ISR overhead

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Maps core pages, 177 calculators, 135 tools,
  // 190 guides, categories and comparisons across all 4 locales.
  return [...coreEntries, ...calcEntries, ...toolEntries, ...dataPrivacyEntries];
}
\`\`\`

## The Honest Data: What 379,000 Impressions Taught Me

Most case studies show only the flattering numbers. Here are my unedited Google Search Console figures for the latest 3-month period (August 8 to November 1, 2026):

![Google Search Console performance report for nexuscalculator.net showing 379k impressions and 611 clicks](/images/gsc-performance-3months.png)
*Figure 2: Search Console performance, August 8 to November 1, 2026.*

- **Total impressions:** 379,000
- **Total clicks:** 611
- **Average CTR:** 0.2%
- **Average position:** 42.5
- **URLs submitted in the sitemap:** 3,200+ localized pages

### Reading the chart

1. **The October jump.** Through August and September, impressions stayed around 1,000 to 3,000 per day. In mid-October, around the same time I shipped the bundle reduction, the expanded JSON-LD schemas and the redirect cleanup, impressions climbed to 10,000 to 15,000+ per day. I cannot prove which change caused it, but the timing is hard to ignore.
2. **The click gap.** Impressions approached 380k, yet total clicks were 611, with the peak at the start of November. Why such a wide gap?

### 4 SEO lessons from this data

1. **Indexed does not mean ranking**
   Having thousands of pages in Google proves the technical foundation works: valid sitemaps, coherent canonicals, fast TTFB. But indexing only gets you into the stadium. It does not put you on the podium.
2. **Head terms are an authority trap for new domains**
   Queries like *mortgage calculator* and *bmi calculator* have enormous search volume. Google shows my pages for them (tens of thousands of impressions), but a young domain lands on pages 4 to 8 (positions 40 to 80). At position 65, CTR is effectively 0%.
3. **Low CTR on page one means a snippet mismatch**
   For localized queries in Germany and Spain where I ranked between positions 7 and 13, CTR was still under 1%. The content was fine, but my titles and descriptions were too generic. I added automated title enrichment in \`seoUtils.ts\`, adding phrases like *with Amortization Schedule & PDF Export* to make the snippet more specific.
4. **Niche, long-tail intent earns the clicks**
   My best-performing queries were not generic tools but specific ones: developer formatters, particular tax tools and localized European calculation guides. On those, CTR reached 6% to 19%.

## What I Am Doing Next

1. **Rewriting titles and meta descriptions** for my top 50 high-impression tools, aiming to lift CTR from 0.2% to 1.5% or more.
2. **Going deeper on long-tail features**, such as regional tax exemptions and loan comparison modes, to rank for low-competition, high-intent searches.
3. **Adding one-click scenario presets** (for example, a first-time homebuyer on a 30-year fixed loan) to increase time on page.
4. **Building topical clusters** by linking my 190 guides and the calculators to each other in both directions.

I will update this post with new numbers after the next 3-month period.

## Key Takeaways for Next.js Developers

- **Registry first.** Never hardcode repetitive pages. Build one typed registry and let a single route template render everything.
- **Mind your build traces.** Do not import client component maps into Server Components. Isolate dynamic imports in a client wrapper to protect First Load JS.
- **Handle redirects once.** Do canonicalization, locale fallbacks and redirects in a single middleware hop.
- **Self-host fonts and trim CSS.** Remove third-party render-blocking requests.
- **Watch position, not only impressions.** High impressions with low clicks show which queries Google already associates with your pages. They are your starting list for title, snippet and content work.

## Frequently Asked Questions

**How many tools and pages does nexuscalculator.net have?**
312 interactive tools, 190 guides, and over 3,200 statically generated pages across four languages.

**Why Next.js instead of plain React?**
Static generation gives crawlable HTML and fast loads, and the App Router includes metadata, sitemap and robots APIs.

**Which i18n library did you use?**
\`next-intl\`, with localized route paths, locale-prefixed URLs and hreflang alternates.

**Why so many impressions but so few clicks?**
Most impressions come from generic head terms where my average position is far below page one. Pages that do rank on page one need stronger titles and descriptions to earn clicks.

Building a high-performance Next.js application, SaaS platform or programmatic SEO project? Explore the [Calculator-Hub GitHub repository](https://github.com/abuhanif254) or [get in touch](/pricing#inquiry).`,
    tags: ["Next.js", "Architecture", "SEO", "Performance"],
    readingTimeMinutes: 9,
    publishedAt: "2026-11-09T08:00:00Z",
    isPublished: true,
    coverImageUrl: "/images/nexuscalculator-homepage.png",
  },
  {
    id: "blog-1",
    title: "Architecting High-Throughput Next.js 16 Applications on Cloudflare Pages",
    slug: "nextjs-16-cloudflare-pages-architecture",
    excerpt: "How to leverage the Next.js App Router, edge caching, and serverless compute on Cloudflare to achieve sub-50ms global latency.",
    contentMarkdown: `## Introduction

Building web applications in 2026 requires balancing rich client interactivity with near-instant worldwide page delivery. Deploying Next.js to Cloudflare Pages allows developers to run logic at hundreds of edge data centers worldwide without paying exorbitant traditional server hosting fees.

## Why the Global Edge Matters

Traditional servers hosted in a single AWS region (such as \`us-east-1\`) subject international users to hundreds of milliseconds in unavoidable speed-of-light roundtrip latency. By deploying our application to Cloudflare Pages:

- **Static assets** are served from the closest edge node.
- **Edge computing** evaluates requests right at the border.
- **Database queries** connect through pooled connections with regional caching.

\`\`\`typescript
// Example: Next.js edge configuration for low-latency routes
export const runtime = "edge";

export async function GET(request: Request) {
  const data = await fetchFromEdgeCache("global-stats");
  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
\`\`\`

## Eliminating Cold Starts

One common pain point with standard serverless functions is cold start latency. Cloudflare Workers and Pages run on V8 isolates rather than containerized Node.js VMs. The startup penalty drops from 300ms down to less than 5ms.

## Conclusion

By pairing Next.js App Router with Cloudflare Pages and Supabase PostgreSQL, developers gain enterprise-grade durability, predictable scaling, and zero server maintenance overhead.`,
    tags: ["Next.js", "Cloudflare", "Performance", "Architecture"],
    readingTimeMinutes: 6,
    publishedAt: "2026-09-28T10:00:00Z",
    isPublished: true,
    coverImageUrl: "/images/projects/cloudflare-edge-arch.svg",
  },
  {
    id: "blog-2",
    title: "Zero-Latency Real-Time Telemetry with Supabase and Postgres CDC",
    slug: "realtime-telemetry-supabase-postgres-cdc",
    excerpt: "A deep dive into Postgres Write-Ahead Logs (WAL), Change Data Capture, and broadcasting live state across tens of thousands of WebSocket clients.",
    contentMarkdown: `## Understanding Change Data Capture (CDC)

When building collaborative systems, polling the database on an interval degrades both database CPU and client battery life. PostgreSQL’s native logical replication stream allows us to tap into the Write-Ahead Log (WAL) to emit real-time event notifications with virtually zero query overhead.

\`\`\`sql
-- Enable replication on your critical telemetry table
alter table telemetry_events replica identity full;

-- Create publication for CDC subscribers
create publication telemetry_pub for table telemetry_events;
\`\`\`

## Subscribing on the Frontend

Using Supabase Realtime, subscribing to database mutations in React takes just a few lines of clean code:

\`\`\`typescript
import { supabase } from "@/lib/supabase";

export function useTelemetryStream(deviceId: string) {
  useEffect(() => {
    const channel = supabase
      .channel(\`device:\${deviceId}\`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "telemetry_events",
          filter: \`device_id=eq.\${deviceId}\`,
        },
        (payload) => {
          console.log("New measurement received:", payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deviceId]);
}
\`\`\`

## Key Takeaway

Postgres is not just a storage warehouse; configured properly, it is a high-speed real-time event dispatcher capable of powering mission-critical real-time applications.`,
    tags: ["PostgreSQL", "Supabase", "WebSockets", "Databases"],
    readingTimeMinutes: 8,
    publishedAt: "2026-08-14T14:30:00Z",
    isPublished: true,
    coverImageUrl: "/images/projects/telemetry-pipeline-arch.svg",
  },
  {
    id: "blog-3",
    title: "Why We Swapped 12 Microservices for a Modular Monolith in 2026",
    slug: "swapping-microservices-for-modular-monolith",
    excerpt: "How distributed complexity, gRPC serialization overhead, and debugging friction led us back to a clean, well-tested modular codebase.",
    contentMarkdown: `## The Microservice Hangover

Over the last decade, countless startups adopted microservices prematurely. Instead of solving scaling issues, many teams traded simple in-memory function calls for network latency, distributed transactions, and complicated deployment manifests.

### The Hidden Costs of Distributed Systems
1. **Network Hops**: A single user action triggers 7 internal gRPC calls, multiplying tail latency.
2. **Schema Drift**: Maintaining synchronized protocol buffers across 12 repos burns engineering velocity.
3. **Local Development Nightmare**: Requiring engineers to run 15 Docker containers locally just to submit a login form.

## The Modular Monolith Alternative

A modular monolith keeps code in a single repository with strictly enforced domain boundaries. Instead of network calls, modules communicate via typed interfaces within the same process.

\`\`\`typescript
// Domain boundary enforced by module interfaces
export interface BillingModule {
  chargeCustomer(customerId: string, amountCents: number): Promise<TransactionResult>;
}

export class StripeBillingService implements BillingModule {
  async chargeCustomer(customerId: string, amountCents: number) {
    // In-process execution: 0ms network penalty
    return processPayment(customerId, amountCents);
  }
}
\`\`\`

## Result

Deployment takes 2 minutes instead of 45, unit tests run in seconds, and our team shipped twice as many features with half the operational overhead.`,
    tags: ["System Design", "DevOps", "Microservices", "Clean Code"],
    readingTimeMinutes: 5,
    publishedAt: "2026-07-02T09:15:00Z",
    isPublished: true,
    coverImageUrl: "/images/projects/ai-rag-pipeline-arch.svg",
  },
  {
    id: "blog-4",
    title: "Mastering Database Indexing: How We Dropped Query Times From 4.2s to 12ms",
    slug: "mastering-postgres-indexing-query-optimization",
    excerpt: "Practical guide to B-Trees, partial indexes, multi-column ordering, and analyzing execution plans with EXPLAIN ANALYZE.",
    contentMarkdown: `## The 4.2-Second Query

During an audit of an enterprise SaaS reporting dashboard, we identified a critical bottleneck: loading monthly summaries for accounts with over 2,000,000 transaction rows took more than 4 seconds.

## Reading EXPLAIN ANALYZE

Running \`EXPLAIN ANALYZE\` revealed a dreaded **Sequential Scan**:

\`\`\`text
Seq Scan on transactions  (cost=0.00..58914.00 rows=184100 width=72)
  Filter: ((account_id = 'acc_9281') AND (status = 'completed') AND (created_at >= '2026-01-01'))
\`\`\`

PostgreSQL was reading every single row off the disk because the existing single-column index on \`account_id\` was insufficient.

## Constructing the Composite Partial Index

By analyzing the query access patterns, we constructed a targeted composite index covering exactly the filtered columns:

\`\`\`sql
-- Create a high-efficiency composite index
create index concurrently idx_transactions_account_date
on transactions (account_id, created_at desc)
where status = 'completed';
\`\`\`

## The Result

The sequential scan transformed into an **Index Scan**:
- Execution time dropped from **4,210ms** down to **11.8ms**.
- Database buffer read IO dropped by **99.4%**.

Never guess—always measure with \`EXPLAIN ANALYZE\`.`,
    tags: ["Databases", "PostgreSQL", "SQL", "Performance"],
    readingTimeMinutes: 7,
    publishedAt: "2026-05-19T11:00:00Z",
    isPublished: true,
    coverImageUrl: "/images/projects/postgres-audit-arch.svg",
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    author: "David Vance",
    role: "VP of Engineering",
    company: "Apex Telemetry Labs",
    category: "telemetry",
    quote: "Abu Hanif transformed our core API architecture in just three weeks. Our P99 latency dropped by 75% and our infrastructure bill was cut in half. He is one of the rarest engineers who pairs deep systems knowledge with rapid execution velocity.",
    verifiedMetric: "⚡ -75% P99 Latency & -50% Cloud Spend",
    deliverableTag: "Distributed Streaming Engine",
    projectSlug: "financial-telemetry-pipeline",
    serviceSlug: "distributed-telemetry-engine",
    engagementScope: "$18,500 Fixed Milestone Sprint",
    engagementDuration: "3 Weeks Delivery",
    verificationBadge: "✓ Verified Milestone Settlement & Code IP Handover",
    deliverablesCompleted: [
      "Concurrent Go 1.23 WebSocket ingress layer handling 12M events/sec",
      "Redis Cluster in-memory sharding with sub-2ms pub/sub broadcast",
      "TimescaleDB hypertables with automated 1-minute continuous aggregates",
      "HTML5 Canvas GPU order-book visualizer achieving 60 FPS",
    ],
  },
  {
    id: "test-2",
    author: "Elena Rostova",
    role: "Founder & CEO",
    company: "Synthetix Cloud",
    category: "edge",
    quote: "Working with Abu Hanif felt like having a Principal Architect and a full delivery team rolled into one. Clear technical communication, pristine documentation, and zero fluff. He delivered our Next.js edge platform ahead of schedule with 95ms global TTFB.",
    verifiedMetric: "🚀 95ms Global P99 & 100% Edge Cold-Start Elimination",
    deliverableTag: "Next.js 16 Edge Platform",
    projectSlug: "cloudflare-edge-ecommerce",
    serviceSlug: "cloudflare-edge-migration",
    engagementScope: "$24,000 Multi-Tenant Milestone Sprint",
    engagementDuration: "4 Weeks Delivery",
    verificationBadge: "✓ Verified Milestone Settlement & Code IP Handover",
    deliverablesCompleted: [
      "Next.js 16 App Router deployment on Cloudflare Pages via OpenNext",
      "Global edge catalog caching with stale-while-revalidate headers",
      "Supabase PostgreSQL read-replicas handling 15,000 concurrent pools",
      "Idempotent Stripe checkout queues with cryptographic replay protection",
    ],
  },
  {
    id: "test-3",
    author: "Marcus Thorne",
    role: "Head of Infrastructure",
    company: "BlockScale Capital",
    category: "postgres",
    quote: "Abu Hanif's surgical PostgreSQL audit resolved our database lock contention during morning volume spikes. CPU utilization fell from 94% down to 18%, and our heaviest reporting queries dropped from 4.2 seconds to 11.8ms.",
    verifiedMetric: "🎯 4.2s → 12ms Query Latency & -76% DB CPU Load",
    deliverableTag: "PostgreSQL Performance Audit",
    projectSlug: "postgres-performance-audit",
    serviceSlug: "database-optimization",
    engagementScope: "$11,000 Diagnostic & Optimization Sprint",
    engagementDuration: "10 Days Delivery",
    verificationBadge: "✓ Verified Milestone Settlement & Code IP Handover",
    deliverablesCompleted: [
      "EXPLAIN (ANALYZE, BUFFERS) profiling on 50 highest-impact query paths",
      "Partial composite B-Tree indexes reducing index memory footprint by 82%",
      "PgBouncer transaction-mode pool configuration with zero connection drops",
      "WAL storage isolation and autovacuum tuning eliminating transaction deadlocks",
    ],
  },
  {
    id: "test-4",
    author: "Sarah Jenkins",
    role: "Chief Technology Officer",
    company: "Nexus Health AI",
    category: "ai",
    quote: "Abu Hanif designed and shipped our production vector search pipeline over 500k technical documents. Clean TypeScript, hardened pgvector indexing, and comprehensive end-to-end load tests. Exceptional engineering leadership.",
    verifiedMetric: "🔍 500k Vectors Indexed with <180ms Hybrid Search",
    deliverableTag: "Enterprise AI Document Search",
    projectSlug: "enterprise-ai-document-search",
    serviceSlug: "mvp-feature-sprint",
    engagementScope: "$14,000 Hybrid RAG Sprint",
    engagementDuration: "3 Weeks Delivery",
    verificationBadge: "✓ Verified Milestone Settlement & Code IP Handover",
    deliverablesCompleted: [
      "FastAPI webhook ingestion pipeline processing Jira, Confluence, and GitHub",
      "PostgreSQL 16 pgvector HNSW indexing (m=16, ef_construction=64)",
      "Hybrid search combining dense embeddings with BM25 keyword rank",
      "Claude 3.5 Sonnet RAG agent with verified citation grounding",
    ],
  },
  {
    id: "test-5",
    author: "Roland Wright",
    role: "Director of Information Security",
    company: "Apex Vault Systems",
    category: "security",
    quote: "Abu Hanif engineered our zero-trust identity microservice from RFC specifications to full SOC2 compliance readiness. His implementation of biometric Passkeys and Ed25519 token minting passed our external penetration test with zero vulnerabilities.",
    verifiedMetric: "🛡️ 3.5M Identities Secured & Zero Audit Findings",
    deliverableTag: "Zero-Trust Auth & RBAC Microservice",
    projectSlug: "zero-trust-auth-service",
    serviceSlug: "architecture-audit",
    engagementScope: "$12,500 Security Architecture Sprint",
    engagementDuration: "2 Weeks Delivery",
    verificationBadge: "✓ Verified Milestone Settlement & Code IP Handover",
    deliverablesCompleted: [
      "Go RFC 6749 OAuth2/OIDC provider with WebAuthn / Passkey support",
      "Sub-second JWT revocation broadcast mesh powered by Redis Cluster",
      "PostgreSQL Row Level Security (RLS) multi-tenant data boundaries",
      "SHA-256 Merkle hash chain audit logger for immutable SOC2 compliance",
    ],
  },
  {
    id: "test-6",
    author: "Maya Lin",
    role: "Head of Developer Experience",
    company: "HyperScale Tooling",
    category: "fullstack",
    quote: "Abu Hanif rebuilt our developer documentation portal into a lightning-fast static engine with instant search and live API execution. Our developer session duration jumped 140% and our Lighthouse score reached a perfect 100/100 across all four metrics.",
    verifiedMetric: "⚡ 100/100 Lighthouse & +140% Session Duration",
    deliverableTag: "Developer Documentation Engine",
    projectSlug: "developer-docs-engine",
    serviceSlug: "mvp-feature-sprint",
    engagementScope: "$8,500 Headless Portal Sprint",
    engagementDuration: "10 Days Delivery",
    verificationBadge: "✓ Verified Milestone Settlement & Code IP Handover",
    deliverablesCompleted: [
      "Next.js 16 Rust MDX compilation with build-time syntax highlighting",
      "Algolia DocSearch integration with offline Web Worker fallback",
      "Interactive sandboxed API playground with real-time response inspector",
      "Service worker caching strategy enabling offline documentation browsing",
    ],
  },
];
