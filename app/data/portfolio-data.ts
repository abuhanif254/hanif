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
    discord: string;
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
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const initialProfile: ProfileData = {
  fullName: "MD Abu Hanif Mia",
  kicker: "Staff Software Engineer & Systems Architect",
  headline: "Clean Architecture • High Performance • Scalable Systems",
  bio: "Senior Full-Stack Software Engineer & Systems Architect with 9+ years designing high-throughput distributed applications, edge networks, and developer platforms. Specializing in TypeScript, Next.js, Go, PostgreSQL, and Cloudflare Pages.",
  email: "contact@abuhanif.dev",
  phone: "+880 1700-000000",
  location: "Dhaka, Bangladesh / Remote Worldwide",
  availabilityStatus: "Available for Q4 Contracts & High-Impact Roles",
  isAvailable: true,
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
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
    demoUrl: "https://example.com/demo",
    githubUrl: "https://github.com/example/telemetry",
    priceTag: "$18,500 Scope",
    impactMetric: "12M Events/Sec • <22ms P99",
    techStack: ["Go", "Next.js", "WebSockets", "TimescaleDB", "Redis", "Docker"],
    isFeatured: true,
    published: true,
  },
  {
    id: "proj-2",
    title: "Cloudflare Edge Multi-Tenant E-Commerce Core",
    slug: "edge-ecommerce-platform",
    summary: "Serverless multi-tenant storefront platform rendering personalized product catalogs at the global edge.",
    descriptionMarkdown: `### The Challenge
A direct-to-consumer brand aggregator struggled with slow dynamic page loads during global flash sales, resulting in cart abandonment and high server scaling bills.

### Architectural Solution
- Re-architected catalog generation onto Cloudflare Pages and Workers Edge with Next.js 16.
- Implemented Supabase PostgreSQL with read-replicas and regional caching.
- Built instant checkout flows with optimistic UI state transitions and idempotent order processing.

### Measurable Impact
- **Conversion Rate**: Lifted checkout conversion by 28%.
- **Global Latency**: Average initial page render reduced from 1.8s to 95ms worldwide.
- **Cost Reduction**: Cut monthly cloud compute costs by 64%.`,
    clientName: "Retail Holdings",
    demoUrl: "https://example.com/demo",
    githubUrl: "https://github.com/example/ecommerce",
    priceTag: "$24,000 Scope",
    impactMetric: "95ms Global P99 • 28% Conversion Lift",
    techStack: ["Next.js 16", "Cloudflare Pages", "Supabase", "TypeScript", "Tailwind CSS"],
    isFeatured: true,
    published: true,
  },
  {
    id: "proj-3",
    title: "Enterprise AI Knowledge Retrieval & RAG Pipeline",
    slug: "enterprise-rag-pipeline",
    summary: "Autonomous document ingestion and vector semantic search engine indexing 500,000+ internal technical docs.",
    descriptionMarkdown: `### The Challenge
Engineering teams spent an average of 4.5 hours per week looking for internal system documentation, API contracts, and architecture design records scattered across Jira, Confluence, and GitHub.

### Architectural Solution
- Built an event-driven webhook pipeline indexing markdown, PDF, and source code into pgvector embeddings.
- Configured hybrid BM25 + dense semantic vector search with re-ranking.
- Created an interactive AI chat interface with strict citation verification and RBAC permission enforcement.

### Measurable Impact
- **Query Resolution**: Search and answer discovery speed reduced by 82%.
- **Accuracy**: 96.4% verified citation accuracy on internal knowledge evaluations.`,
    clientName: "Enterprise Software Corp",
    demoUrl: "https://example.com/demo",
    priceTag: "$14,000 Scope",
    impactMetric: "82% Faster Discovery • 500k+ Docs Indexed",
    techStack: ["Python", "FastAPI", "pgvector", "PostgreSQL", "React", "Anthropic Claude"],
    isFeatured: true,
    published: true,
  },
  {
    id: "proj-4",
    title: "Zero-Trust Distributed Auth & RBAC Microservice",
    slug: "zero-trust-auth-service",
    summary: "Centralized identity provider service supporting multi-organization tenancy, SAML SSO, and Passkeys.",
    descriptionMarkdown: `### The Challenge
A SaaS company with multiple sub-products needed to consolidate disparate login systems into a unified identity provider meeting enterprise SOC2 Type II requirements.

### Architectural Solution
- Developed an RFC 6749 compliant OAuth2/OIDC provider with granular scope delegation.
- Added WebAuthn passkey registration, biometric sign-in, and instantaneous session revocation via Redis.
- Implemented audit logging with cryptographic hash chaining for tamper resistance.

### Measurable Impact
- **Scale**: Managing 3,500,000+ active enterprise user identities.
- **Security**: Passed third-party penetration audit with zero critical or high vulnerabilities.`,
    clientName: "B2B SaaS Group",
    priceTag: "$12,500 Scope",
    impactMetric: "3.5M Identities • Zero Security Incidents",
    techStack: ["Go", "PostgreSQL", "Redis", "OAuth2", "WebAuthn", "Docker"],
    isFeatured: true,
    published: true,
  },
  {
    id: "proj-5",
    title: "High-Performance Developer Documentation Engine",
    slug: "developer-docs-engine",
    summary: "Ultra-fast headless documentation portal with full-text search, live API playground, and dark mode.",
    descriptionMarkdown: `### The Challenge
Developers were bouncing from legacy docs due to sluggish navigation, lack of interactive code execution, and broken mobile formatting.

### Architectural Solution
- Designed and built a static-first Next.js portal utilizing Turbopack and MDX compilation.
- Embedded interactive API request builders with copyable curl/JavaScript/Python snippets.
- Integrated Algolia DocSearch with instant keyboard navigation (Cmd+K).

### Measurable Impact
- **Lighthouse**: Perfect 100/100 across Performance, Accessibility, Best Practices, and SEO.
- **Engagement**: Increased average developer session duration by 140%.`,
    clientName: "Developer Tooling Startup",
    demoUrl: "https://example.com/demo",
    githubUrl: "https://github.com/example/docs",
    priceTag: "$8,500 Scope",
    impactMetric: "100/100 Lighthouse • 140% Session Duration",
    techStack: ["Next.js", "TypeScript", "MDX", "Tailwind CSS", "Algolia"],
    isFeatured: true,
    published: true,
  },
  {
    id: "proj-6",
    title: "Autonomous Data Ingestion & ETL Automation Engine",
    slug: "etl-automation-engine",
    summary: "Fault-tolerant data extraction and pipeline engine processing daily multi-gigabyte client reporting feeds.",
    descriptionMarkdown: `### The Challenge
Manual data entry and fragile overnight Python scripts caused frequent data corruption and delayed client reporting by up to 36 hours.

### Architectural Solution
- Implemented a queue-backed Node.js and BullMQ worker pipeline with automated exponential backoff retries.
- Integrated schema validation via Zod to quarantine corrupted inputs before database insertion.
- Created an automated notification webhook for Slack alerts and Prometheus telemetry.

### Measurable Impact
- **Cost Savings**: Saved client $48,000 annually in manual developer intervention hours.
- **Delivery**: Report generation time dropped from 36 hours to under 8 minutes.`,
    clientName: "Logistics Platform",
    priceTag: "$11,000 Scope",
    impactMetric: "8 Min Delivery (from 36h) • $48k/yr Saved",
    techStack: ["Node.js", "BullMQ", "PostgreSQL", "AWS S3", "Zod", "Docker"],
    isFeatured: true,
    published: true,
  },
];

export const initialServices: ServicePricing[] = [
  {
    id: "serv-1",
    title: "Architecture & Codebase Audit",
    slug: "architecture-audit",
    description: "A comprehensive, deep-dive architectural inspection of your existing application, database queries, security posture, and cloud hosting bills.",
    pricingType: "fixed",
    priceDisplay: "$2,500",
    timeline: "3–5 Business Days",
    deliverables: [
      "Full architecture review of frontend & backend systems",
      "Database index analysis and slow query bottlenecks report",
      "Security audit & dependency vulnerability scan",
      "Cloud hosting cost reduction roadmap (AWS/GCP/Cloudflare)",
      "Detailed 25+ page diagnostic report with prioritized fixes",
      "60-minute executive strategy walkthrough video call",
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: "serv-2",
    title: "Full-Stack MVP & Feature Sprint",
    slug: "mvp-feature-sprint",
    description: "High-velocity execution from technical requirements to a production-grade, tested, and deployed software product on Cloudflare Pages and Supabase.",
    pricingType: "fixed",
    priceDisplay: "$8,500",
    timeline: "2–3 Weeks",
    deliverables: [
      "Modern Next.js 16 + React 19 responsive web application",
      "Supabase PostgreSQL schema, migrations & Row Level Security",
      "Stripe payment or custom subscription billing integration",
      "Automated CI/CD build pipeline configured on Cloudflare",
      "Full TypeScript typing, Zod validation, and error boundaries",
      "30-day post-launch bug warranty and technical handover call",
    ],
    isPopular: true,
    isActive: true,
  },
  {
    id: "serv-3",
    title: "Fractional Staff / Principal Eng Retainer",
    slug: "fractional-staff-engineer",
    description: "On-demand senior technical leadership, architectural oversight, complex coding execution, and team mentorship for growing engineering teams.",
    pricingType: "retainer",
    priceDisplay: "$4,800 / mo",
    timeline: "Ongoing (15–20 hrs / week)",
    deliverables: [
      "Direct Slack/Discord access with guaranteed same-day response",
      "Weekly architecture planning sessions and PR reviews",
      "Hands-on coding for complex, mission-critical subsystems",
      "Hiring support, candidate technical interviews, and grading",
      "Infrastructure cost governance and emergency escalation support",
      "No long-term lock-in (month-to-month flexibility)",
    ],
    isPopular: false,
    isActive: true,
  },
];

export const initialBlogPosts: BlogPost[] = [
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
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    quote: "Alex transformed our core API architecture in just three weeks. Our P99 latency dropped by 75% and our infrastructure bill was cut in half. He is one of the rarest engineers who pairs deep systems knowledge with rapid execution velocity.",
    author: "David Vance",
    role: "VP of Engineering",
    company: "Apex Telemetry Labs",
  },
  {
    quote: "Working with Alex felt like having a Principal Architect and a full delivery team rolled into one. Clear technical communication, pristine documentation, and zero fluff. He delivered our Next.js edge platform ahead of schedule.",
    author: "Elena Rostova",
    role: "Founder & CEO",
    company: "Synthetix Cloud",
  },
];
