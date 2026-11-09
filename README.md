# MD Abu Hanif Mia — Staff Software Engineer & Systems Architect

Production platform, interactive systems lab, technical case studies, transparent service pricing, and engineering publication portfolio for **MD Abu Hanif Mia (Abu Hanif)** — Staff Software Engineer & Distributed Systems Architect.

Deployed globally on **Next.js 16 (App Router with Turbopack)**, **React 19**, **TypeScript**, **Supabase PostgreSQL 16**, and **Cloudflare Pages Edge**.

---

## 🏛️ Platform Architecture Overview

```
                                      [ Internet & Googlebot ]
                                                 │
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │    Cloudflare Anycast Global Edge     │
                             │ (WAF, Security Headers, Edge Caching) │
                             └───────────────────┬───────────────────┘
                                                 │
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │       Next.js 16 App Router (SSG)     │
                             │  • 71 Pre-Rendered Routes & Slugs     │
                             │  • Sub-25ms Global TTFB on Edge       │
                             │  • Canonical URL Self-Referencing     │
                             └───────┬───────────────────────┬───────┘
                                     │                       │
                 Public Client Layer │                       │ Server-Side APIs
                                     ▼                       ▼
              ┌─────────────────────────────┐   ┌─────────────────────────────┐
              │   Interactive Systems Lab   │   │   Privileged Admin Engine   │
              │  • Global Edge Latency Radar│   │  • Server Role Supabase     │
              │  • EXPLAIN ANALYZE Planner  │   │  • HMAC Session Auth        │
              │  • SOW Builder & Calculator │   │  • Order Management (OMS)   │
              └─────────────────────────────┘   └──────────────┬──────────────┘
                                                               │
                                                               ▼
                                                ┌─────────────────────────────┐
                                                │   Supabase PostgreSQL 16   │
                                                │  • Row-Level Security (RLS) │
                                                │  • Partitioned Tables       │
                                                │  • In-Memory Store Fallback │
                                                └─────────────────────────────┘
```

---

## 🚀 Key Systems & Engineering Features

### 1. 7 Production Case Studies with SVG Architecture Topologies
Every project features an interactive, production-grade SVG architecture blueprint (`1200x630`) located in `public/images/projects/`, paired with deep topology explorers, sequence step breakdowns, and chaos failover scenarios:
1. **Real-Time Financial Telemetry Pipeline** (`/projects/financial-telemetry-pipeline`): 12M events/sec with sub-22ms P99 latency.
2. **Cloudflare Edge Multi-Tenant E-Commerce Platform** (`/projects/cloudflare-edge-ecommerce`): Sub-100ms global commerce with -64% cloud spend.
3. **Enterprise AI Document Search & RAG Pipeline** (`/projects/enterprise-ai-document-search`): pgvector semantic indexing of 500,000+ technical documents.
4. **High-Concurrency PostgreSQL Performance Audit** (`/projects/postgres-performance-audit`): EXPLAIN ANALYZE tuning reducing CPU from 92% to 28% with zero deadlocks.
5. **Zero-Trust Distributed Auth & RBAC Microservice** (`/projects/zero-trust-auth-service`): Go OAuth2/OIDC identity provider with WebAuthn passkeys managing 3.5M identities.
6. **High-Performance Developer Documentation Engine** (`/projects/developer-docs-engine`): Turbopack MDX AST compilation with 100/100 Lighthouse score.
7. **Autonomous Data Ingestion & ETL Automation Engine** (`/projects/etl-automation-engine`): BullMQ queue worker pipeline reducing 36-hour batch delivery to 7.8 minutes.

### 2. Statement of Work (SOW) Builder & Lead Conversion Pipeline
- **Interactive Scoping Engine** (`/pricing#sow-builder`): Real-time pricing calculator for engineering services, architectural add-ons, milestone payments (25% deposit / 50% core delivery / 25% production sign-off), and markdown export.
- **Architectural Lead Ingestion** (`POST /api/inquiries`): Prospective clients submit configured SOW packages directly into the lead pipeline with instant confirmation and internal notifications.

### 3. Privileged Supabase Server-Side Architecture
- **Zero Client-Side RLS Impasse**: Administrative reads and mutations route securely through `/api/admin/*` (`inquiries`, `projects`, `blog`, `orders`, `services`, `customers`), executed on the server via `getServiceSupabase()` using `SUPABASE_SERVICE_ROLE_KEY`.
- **HMAC-SHA256 Session Cryptography**: Custom session token validation with timing-safe comparison protecting administrative endpoints against brute-force and timing attacks.
- **Deterministic Store Fallback**: Complete in-memory/localStorage fallback in `portfolio-store.ts` ensuring 100% offline development and zero-dependency test execution.

### 4. Client Order Management System (OMS) & Milestone Sign-Off
- **Zero-Trust Order Tracker** (`/orders/tracker`): IDOR-immune tracking authenticated strictly via cryptographically random 32-character tokens (`?token=...`).
- **Digital Milestone Sign-Off** (`/api/orders/tracker/approve-milestone`): Allows institutional clients to review deliverables and authorize milestone progression.
- **Institutional PDF Invoicing** (`/orders/invoice`): Formal statement and tax-compliant invoice generator for completed and in-flight contracts.

### 5. Technical SEO & Googlebot Indexing Parity
- **Self-Referencing Canonical URLs**: Every public indexable route explicitly defines its own canonical URL in `metadata` or `generateMetadata`.
- **Zero-Index Private Protection**: Server-side metadata blocks Googlebot from indexing `/admin/*` and `/orders/*` with `noindex, nofollow, nocache`.
- **Crawlable Internal Linking Mesh**: Triangular internal links connecting Blog Articles (`/blog/[slug]`), Case Studies (`/projects/[slug]`), Services (`/services/[slug]`), and the SOW Builder (`/pricing#sow-builder`).
- **Cloudflare Edge Rules**: Custom `public/_headers` (HSTS, CSP, X-Frame-Options) and `public/_redirects` (permanent 308 redirects).

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | Next.js 16.3.6 (Turbopack, App Router, React Server Components) |
| **Runtime & Language** | React 19.2.1, TypeScript 5.6.3, Node.js 22 |
| **Styling & UI** | Tailwind CSS v4, Lucide React, Radix UI Primitives, JetBrains Mono |
| **Database & Auth** | Supabase PostgreSQL 16 (pgvector, RLS), Redis, HMAC-SHA256 Sessions |
| **Testing Suite** | Vitest 2.1.4 (24 test suites, 193 automated unit & integration tests) |
| **Deployment Target** | Cloudflare Pages / Vercel (Edge Runtime compatible) |

---

## 💻 Local Development Workflow

```bash
# 1. Clone the repository
git clone https://github.com/abuhanif254/robert-fleming-site.git
cd robert-fleming-site

# 2. Install dependencies (clean pnpm installation)
pnpm install

# 3. Configure environment variables
cp .env.local.example .env.local
# (Edit .env.local with your Supabase credentials or leave empty for offline store)

# 4. Start local development server (Turbopack)
pnpm dev

# 5. Run TypeScript static type check
pnpm check

# 6. Run the complete automated test suite (24 files, 193 tests)
pnpm test

# 7. Execute production build
pnpm build
```

---

## 📂 Project Directory Structure

```
├── app/
│   ├── admin/                   # Authenticated Admin Dashboard & CRM
│   ├── api/
│   │   ├── admin/               # Protected Admin APIs (Inquiries, Projects, Blog, Orders)
│   │   ├── inquiries/           # Public Inbound Lead & SOW Submission Handler
│   │   ├── orders/              # Order Tracker & Milestone Digital Sign-Off
│   │   ├── telemetry/           # Edge Latency Real-Time Telemetry Stream
│   │   └── upload/              # Binary Signature-Verified Asset Upload Gateway
│   ├── blog/                    # Technical Publication Archive & Article Reader
│   ├── components/              # Reusable UI, SOW Builder, Badges & Footers
│   ├── data/                    # Canonical Datasets (Projects, Services, Testimonials)
│   ├── lib/
│   │   ├── admin-auth.ts        # HMAC-SHA256 Token Signing & Validation
│   │   ├── ecosystem-map.ts     # Internal Link Equity & Semantic Topic Mesh
│   │   ├── edge-rate-limiter.ts # Sliding-Window Ingress Rate Limiting
│   │   ├── oms-service.ts       # Order Management System & Milestone Progress
│   │   ├── portfolio-store.ts   # Unified Persistence Layer (Supabase + In-Memory)
│   │   ├── project-architectures.ts # 7 Deep Interactive Architecture Topologies
│   │   ├── supabase.ts          # Public Supabase Client Factory
│   │   └── supabase-admin.ts    # Privileged Server-Only Service Role Client
│   ├── orders/                  # Public Client Order Tracker & Invoice Viewer
│   ├── pricing/                 # Scoped Packages, SOW Builder & Discovery Call
│   ├── projects/                # Work Showcase, Lightbox & Case Study Readers
│   ├── services/                # Programmatic Engineering Solution Pages
│   ├── layout.tsx               # Root Layout, Title Templates & JSON-LD Knowledge Graph
│   ├── robots.ts                # Dynamic Robots.txt with Strict Disallow Rules
│   └── sitemap.ts               # Automated XML Sitemap Engine
├── public/
│   ├── _headers                 # Cloudflare Edge Security Headers & Caching
│   ├── _redirects               # Cloudflare Edge Permanent Redirects (308)
│   └── images/
│       └── projects/            # 7 Production Architectural SVG Diagrams (1200x630)
├── tests/                       # 24 Automated Vitest Unit & Integration Suites
├── supabase-schema.sql          # Idempotent Supabase PostgreSQL Schema with RLS
└── next.config.ts               # Next.js 16 Compiler & Turbopack Configuration
```

---

## 📬 Direct Contact & Scoping

- **Principal Architect**: MD Abu Hanif Mia (Abu Hanif)
- **Direct Email**: [abuhanifmain@gmail.com](mailto:abuhanifmain@gmail.com)
- **Phone / WhatsApp**: [+880 1724-010261](tel:+8801724010261)
- **Address**: Sadar Upazila, Kishoreganj, Dhaka, Bangladesh
- **LinkedIn**: [linkedin.com/in/md-abu-hanif-mia](https://www.linkedin.com/in/md-abu-hanif-mia)
- **GitHub**: [github.com/abuhanif254](https://github.com/abuhanif254)
- **X (Twitter)**: [@MohammadBitull1](https://x.com/MohammadBitull1)
- **Facebook**: [facebook.com/bitulla](https://www.facebook.com/bitulla)
- **Instagram**: [instagram.com/bitullah_aj](https://www.instagram.com/bitullah_aj)
- **Availability**: Available for Strategic Engineering Contracts, Performance Audits & Technical Advisory
