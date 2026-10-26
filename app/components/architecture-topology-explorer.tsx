"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface TopologyNode {
  id: string;
  label: string;
  sub: string;
  throughput: string;
  latencyBudget: string;
  tech: string;
  rationale: string;
  resiliency: string;
}

export interface SequenceStep {
  stepNumber: number;
  from: string;
  to: string;
  protocol: string;
  payload: string;
  latencyBudget: string;
  description: string;
}

export interface FailoverScenario {
  title: string;
  triggerName: string;
  failedComponent: string;
  fallbackRoute: string;
  recoveryMechanism: string;
  recoveryTimeMs: number;
  dataLossRisk: string;
  recoveryLogs: string[];
}

export interface TechTradeoff {
  layer: string;
  chosenTech: string;
  rejectedAlternative: string;
  whyChosen: string;
  benchmarkAdvantage: string;
}

export interface ArchitectureTopology {
  id: string;
  title: string;
  tagline: string;
  scopePrice: string;
  caseStudySlug: string;
  serviceSlug: string;
  peakThroughput: string;
  p99Latency: string;
  costSavings: string;
  resiliencyGrade: string;
  nodes: TopologyNode[];
  sequenceSteps: SequenceStep[];
  failoverScenario: FailoverScenario;
  techTradeoffs: TechTradeoff[];
}

export const ARCHITECTURE_TOPOLOGIES: ArchitectureTopology[] = [
  {
    id: "telemetry",
    title: "Real-Time Financial Telemetry Pipeline",
    tagline: "Concurrent exchange ingestion with continuous time-series rollups",
    scopePrice: "$18,500 Scope",
    caseStudySlug: "financial-telemetry-pipeline",
    serviceSlug: "distributed-telemetry-engine",
    peakThroughput: "12M Events / sec",
    p99Latency: "< 22ms End-to-End",
    costSavings: "-52% Cloud Spend",
    resiliencyGrade: "Active-Active Multi-Zone",
    nodes: [
      {
        id: "ws-feed",
        label: "Exchange Feeds",
        sub: "14 External Gateways",
        throughput: "12M ticks/sec peak",
        latencyBudget: "< 4ms socket ingestion",
        tech: "Binary WebSocket Stream (Protobuf)",
        rationale: "Ingests raw order books without JSON serialization overhead to minimize parsing latency.",
        resiliency: "Heartbeat ping/pong with automatic exponential backoff reconnection across all exchanges.",
      },
      {
        id: "go-workers",
        label: "Go Ingestion Pool",
        sub: "Concurrent Goroutines",
        throughput: "48 worker routines per core",
        latencyBudget: "< 3ms normalization",
        tech: "Go 1.23 • Lock-free Ring Buffers",
        rationale: "Utilizes CSP concurrency and zero-allocation memory pools to prevent garbage collection pauses during volume spikes.",
        resiliency: "Worker pool isolation: one exchange buffer overflow does not degrade adjacent worker channels.",
      },
      {
        id: "redis-cluster",
        label: "Redis Backbone",
        sub: "In-Memory Pub/Sub",
        throughput: "2.4M messages/sec",
        latencyBudget: "< 2ms memory fan-out",
        tech: "Redis Cluster 7.2 • In-Memory Sharding",
        rationale: "Decouples ingestion from persistent disk storage, enabling horizontal broadcast to thousands of client web connections.",
        resiliency: "Active-standby sentinel failover with sub-second replication election.",
      },
      {
        id: "timescale-db",
        label: "TimescaleDB Tier",
        sub: "Continuous Aggregates",
        throughput: "500k writes/sec batch",
        latencyBudget: "< 5ms 1-minute rollup query",
        tech: "PostgreSQL 16 + TimescaleDB Extension",
        rationale: "Pre-calculates 1-second, 1-minute, and 1-hour OHLCV candles automatically using native continuous aggregate hypertables.",
        resiliency: "Automated chunk compression saving 85% storage with point-in-time recovery (PITR).",
      },
      {
        id: "nextjs-client",
        label: "Next.js Edge Client",
        sub: "Browser Streaming UI",
        throughput: "60 FPS Canvas rendering",
        latencyBudget: "< 22ms End-to-End P99",
        tech: "Next.js 16 • React 19 • HTML5 Canvas",
        rationale: "Replaces heavy DOM node updates with hardware-accelerated Canvas 2D frame rendering for 45,000 active clients.",
        resiliency: "Optimistic local state reconciliation with automatic fallback to polled snapshots.",
      },
    ],
    sequenceSteps: [
      {
        stepNumber: 1,
        from: "14 Financial Exchanges",
        to: "Edge Ingestion Gateway",
        protocol: "WSS / TLS 1.3 (Protobuf)",
        payload: "OrderBookDiff (128 bytes)",
        latencyBudget: "3.2ms",
        description: "Exchanges push binary delta updates over dedicated fiber cross-connects.",
      },
      {
        stepNumber: 2,
        from: "Edge Ingestion Gateway",
        to: "Go Worker Goroutines",
        protocol: "Zero-Copy In-Process Channel",
        payload: "NormalizedTick (96 bytes)",
        latencyBudget: "0.4ms",
        description: "Lock-free circular ring buffers normalize exchange precision into fixed-point integers.",
      },
      {
        stepNumber: 3,
        from: "Go Worker Goroutines",
        to: "Redis Sharded Pub/Sub",
        protocol: "TCP Multiplexed (RESP3)",
        payload: "DepthSnapshot (256 bytes)",
        latencyBudget: "1.8ms",
        description: "Broadcasts normalized depth to in-memory broadcast channels without disk I/O.",
      },
      {
        stepNumber: 4,
        from: "Redis Sharded Pub/Sub",
        to: "TimescaleDB Hypertables",
        protocol: "COPY pg_protocol (Batch 50k)",
        payload: "OHLCV Micro-Batches",
        latencyBudget: "4.5ms",
        description: "Bulk COPY writes append-only rows into compressed 2-hour partition chunks.",
      },
      {
        stepNumber: 5,
        from: "TimescaleDB / Redis",
        to: "Browser Edge UI",
        protocol: "Server-Sent Events (SSE)",
        payload: "ChartCandleTick (64 bytes)",
        latencyBudget: "11.2ms (Global P99)",
        description: "Cloudflare Edge terminates WebSocket and streams 60 FPS renders directly to trader screens.",
      },
    ],
    failoverScenario: {
      title: "Primary Redis Leader Partition Outage",
      triggerName: "Primary Redis Node Hardware Failure",
      failedComponent: "redis-master-az1 (10.0.4.12)",
      fallbackRoute: "Redis Sentinel Auto-Promote -> redis-replica-az2",
      recoveryMechanism: "Raft consensus election via 3-node Sentinel quorum with local Go ring-buffer queuing",
      recoveryTimeMs: 410,
      dataLossRisk: "0 bytes (buffered in RAM queue)",
      recoveryLogs: [
        "[09:12:01.014] CRITICAL: Heartbeat timeout on redis-master-az1 (3 missed pulses)",
        "[09:12:01.120] SENTINEL: Quorum confirmed master is down (+sdown master 10.0.4.12)",
        "[09:12:01.240] WORKER: Go ingestion pool switches to internal ring buffer (memory capacity: 4.8M ticks)",
        "[09:12:01.350] SENTINEL: Promoting redis-replica-az2 (10.0.5.18) to new cluster leader",
        "[09:12:01.424] WORKER: Reconnected to promoted leader. Replaying 118,400 buffered ticks",
        "[09:12:01.442] RESTORED: Ring buffer drained in 18ms. Cluster healthy at 12M events/sec. Zero dropped transactions.",
      ],
    },
    techTradeoffs: [
      {
        layer: "Concurrency Engine",
        chosenTech: "Go 1.23 Goroutines",
        rejectedAlternative: "Node.js Event Loop",
        whyChosen: "Go provides multi-threaded CPU saturation across all 64 vCPUs without event-loop blocking under serialization spikes.",
        benchmarkAdvantage: "12M events/sec vs 180k events/sec in Node.js (66x higher throughput, zero GC stalls).",
      },
      {
        layer: "Time-Series Persistence",
        chosenTech: "TimescaleDB (PostgreSQL 16)",
        rejectedAlternative: "Vanilla MongoDB",
        whyChosen: "Native relational ACID transactions with automated hypertables, 85% compression, and real SQL analytical joins.",
        benchmarkAdvantage: "9.2x faster window queries over 1B rows with 64% lower RAM footprint.",
      },
      {
        layer: "In-Memory Fanout",
        chosenTech: "Redis Cluster 7.2",
        rejectedAlternative: "Apache Kafka",
        whyChosen: "Sub-2ms publish-subscribe fanout with zero JVM garbage collection tuning and 1/5th the infrastructure operational overhead.",
        benchmarkAdvantage: "Sub-2ms P99 latency vs 18ms broker batch latency in standard Kafka setups.",
      },
    ],
  },
  {
    id: "edge-ecommerce",
    title: "Cloudflare Global Edge E-Commerce & Checkout",
    tagline: "Sub-30ms global TTFB with zero cold starts across 330+ edge PoPs",
    scopePrice: "$24,000 Scope",
    caseStudySlug: "cloudflare-edge-ecommerce",
    serviceSlug: "cloudflare-edge-migration",
    peakThroughput: "45k Requests / sec",
    p99Latency: "< 95ms Global P99",
    costSavings: "-72% AWS Bill",
    resiliencyGrade: "Global Anycast Edge",
    nodes: [
      {
        id: "cf-anycast",
        label: "Anycast DNS & CDN",
        sub: "330+ Global PoPs",
        throughput: "100k+ req/sec edge buffer",
        latencyBudget: "< 12ms edge routing",
        tech: "Cloudflare Anycast • HTTP/3 & QUIC",
        rationale: "Routes buyers to nearest geographic server isolate within 10ms, eliminating international round-trip penalties.",
        resiliency: "Automated DDoS protection with Layer 7 rate limiting and instant failover between edge nodes.",
      },
      {
        id: "pages-ssr",
        label: "Next.js Edge SSR",
        sub: "V8 Isolate Workers",
        throughput: "0ms cold start execution",
        latencyBudget: "< 18ms page rendering",
        tech: "Next.js 16 App Router on Cloudflare Pages",
        rationale: "Executes lightweight V8 isolates instead of heavyweight Node.js Docker containers, eliminating 1.5s cold starts.",
        resiliency: "Stale-while-revalidate edge caching serves instant cached content even during origin disruptions.",
      },
      {
        id: "kv-inventory",
        label: "Workers KV Cache",
        sub: "Global Edge Key-Value",
        throughput: "10M reads/sec read-heavy",
        latencyBudget: "< 5ms catalog lookup",
        tech: "Cloudflare Workers KV + Cache API",
        rationale: "Replicates high-velocity inventory status and catalog data to all 330 edge locations for instant product views.",
        resiliency: "Eventual consistency with cache-purge webhook synchronization on product quantity mutations.",
      },
      {
        id: "supabase-pg",
        label: "PostgreSQL Database",
        sub: "Row Level Security (RLS)",
        throughput: "3,500 active pool transactions",
        latencyBudget: "< 24ms pooled query",
        tech: "Supabase PostgreSQL 16 + Supavisor",
        rationale: "Supavisor connection pooling maintains millions of persistent connections without exhausting database RAM.",
        resiliency: "Multi-AZ replication with automatic read replica failover and encrypted WAL archives.",
      },
      {
        id: "stripe-webhook",
        label: "Stripe Payment Engine",
        sub: "Idempotent Webhooks",
        throughput: "100% idempotent capture",
        latencyBudget: "< 120ms payment settlement",
        tech: "Stripe API • Atomic DB Transactions",
        rationale: "Enforces cryptographic signature verification and database idempotency keys to eliminate double-billing.",
        resiliency: "Dead letter queue with exponential retries and automated Slack notification on webhook anomalies.",
      },
    ],
    sequenceSteps: [
      {
        stepNumber: 1,
        from: "Global Shopper",
        to: "Cloudflare Edge PoP",
        protocol: "HTTP/3 over QUIC",
        payload: "GET /products/catalog",
        latencyBudget: "12ms",
        description: "Client connects to nearest geographic edge server via BGP Anycast routing.",
      },
      {
        stepNumber: 2,
        from: "Edge Worker",
        to: "Workers KV / Edge Cache",
        protocol: "Local V8 Memory Bus",
        payload: "Cache-Key: prd_variant_99",
        latencyBudget: "2.1ms",
        description: "Returns pre-rendered catalog HTML from edge cache without touching origin servers.",
      },
      {
        stepNumber: 3,
        from: "Checkout Client",
        to: "Next.js Server Action",
        protocol: "HTTPS POST (Encrypted)",
        payload: "CreateCheckoutSession",
        latencyBudget: "18ms",
        description: "Secure server action validates cart contents and reserves inventory with atomic database locks.",
      },
      {
        stepNumber: 4,
        from: "Server Action",
        to: "Supavisor Pool (Postgres)",
        protocol: "TCP (Prepared Statements)",
        payload: "UPDATE inventory SET stock = stock - 1",
        latencyBudget: "24ms",
        description: "Row-level locking guarantees zero overselling during viral flash-sale traffic spikes.",
      },
      {
        stepNumber: 5,
        from: "Stripe Gateway",
        to: "Webhook Dispatcher",
        protocol: "HMAC Signed Webhook",
        payload: "payment_intent.succeeded",
        latencyBudget: "35ms",
        description: "Idempotent database transaction marks order confirmed and fires email notifications.",
      },
    ],
    failoverScenario: {
      title: "Primary Cloudflare Edge PoP Degradation",
      triggerName: "Regional Undersea Fiber Cable Cut (Singapore Colo)",
      failedComponent: "cloudflare-sin-pop (Asia-East)",
      fallbackRoute: "BGP Anycast Auto-Reroute -> NRT (Tokyo) & HKG (Hong Kong)",
      recoveryMechanism: "Automatic BGP border routing withdrawal redirecting traffic to healthy adjacent PoPs",
      recoveryTimeMs: 180,
      dataLossRisk: "0% (Stateless Edge Execution)",
      recoveryLogs: [
        "[14:22:10.080] WARNING: Packet loss detected on Singapore egress transit (+45% jitter)",
        "[14:22:10.120] ANYCAST: Withdrawing BGP route announcement for Singapore Edge PoP",
        "[14:22:10.210] REROUTE: Client requests transparently received at Hong Kong (HKG) PoP",
        "[14:22:10.260] CACHE: Local HKG Workers KV warm hit served in 3.4ms",
        "[14:22:10.310] RESOLVED: BGP convergence complete. Zero dropped shopping carts observed.",
      ],
    },
    techTradeoffs: [
      {
        layer: "Hosting & Runtime",
        chosenTech: "Cloudflare Pages (V8 Isolates)",
        rejectedAlternative: "AWS ECS / Docker on Fargate",
        whyChosen: "Zero cold starts, instant global deployment across 330 cities, and elimination of idle compute costs.",
        benchmarkAdvantage: "Sub-25ms global TTFB vs 1,400ms container cold start; $45/mo vs $920/mo AWS bills.",
      },
      {
        layer: "Edge Storage",
        chosenTech: "Workers KV + Cache API",
        rejectedAlternative: "Origin Redis via VPC Peering",
        whyChosen: "Provides read latency under 5ms globally without maintaining expensive transcontinental cross-region VPC links.",
        benchmarkAdvantage: "5ms global reads vs 180ms cross-region latency to US-East Redis.",
      },
      {
        layer: "Database Connection",
        chosenTech: "Supavisor Connection Pooler",
        rejectedAlternative: "Direct Node.js pg connection",
        whyChosen: "Supports 10,000+ burst connections from stateless serverless workers without exhausting PostgreSQL RAM limits.",
        benchmarkAdvantage: "Handles 10k concurrent workers with 200 pooled DB connections with zero connection exhaustion errors.",
      },
    ],
  },
  {
    id: "ai-search",
    title: "Enterprise AI Document Search & Semantic RAG",
    tagline: "Hybrid BM25 + dense vector similarity search over 500k documents",
    scopePrice: "$14,000 Scope",
    caseStudySlug: "enterprise-ai-document-search",
    serviceSlug: "mvp-feature-sprint",
    peakThroughput: "500k Vectors",
    p99Latency: "< 180ms Hybrid Search",
    costSavings: "-60% Vector DB Cost",
    resiliencyGrade: "Fault-Tolerant Vector Mesh",
    nodes: [
      {
        id: "doc-pipeline",
        label: "Document Ingestion",
        sub: "PDF/Office/Markdown",
        throughput: "1,200 pages / min",
        latencyBudget: "< 45ms chunking",
        tech: "FastAPI • LangChain Recursive Splitter",
        rationale: "Splits complex enterprise documents into semantic chunks with 10% overlap to preserve context across boundaries.",
        resiliency: "Asynchronous task worker queues with automatic document quarantine for malformed files.",
      },
      {
        id: "embed-engine",
        label: "Embedding Generator",
        sub: "1536-dim Vectors",
        throughput: "850 chunks/sec batch",
        latencyBudget: "< 60ms model inference",
        tech: "OpenAI text-embedding-3-small",
        rationale: "Generates high-dimensional vector representations balancing semantic accuracy with cost efficiency.",
        resiliency: "Client-side token bucket rate limiter preventing API 429 quota exhaustion under bulk imports.",
      },
      {
        id: "pgvector-store",
        label: "PostgreSQL + pgvector",
        sub: "HNSW Indexed Storage",
        throughput: "12,000 vector QPS",
        latencyBudget: "< 18ms cosine similarity",
        tech: "PostgreSQL 16 + pgvector HNSW Index",
        rationale: "HNSW graph indexes achieve 99% recall without needing expensive standalone proprietary vector databases.",
        resiliency: "Full transactional ACID consistency; embeddings update synchronously with document records.",
      },
      {
        id: "cohere-rerank",
        label: "Cohere Reranker",
        sub: "Cross-Encoder Scorer",
        throughput: "Top-20 candidate rerank",
        latencyBudget: "< 35ms cross-attention",
        tech: "Cohere Rerank v3 Multilingual",
        rationale: "Re-scores candidate chunks with cross-attention to eliminate hallucinated context before sending to LLM.",
        resiliency: "Automatic fallback to reciprocal rank fusion (RRF) if external reranker API times out.",
      },
      {
        id: "streaming-llm",
        label: "Next.js Streaming UI",
        sub: "Chunked SSE Stream",
        throughput: "85 tokens/sec generation",
        latencyBudget: "< 180ms Time-to-First-Token",
        tech: "Next.js 16 • Vercel AI SDK • React 19",
        rationale: "Streams synthesized answers with inline footnote citations directly to the user's browser in real time.",
        resiliency: "Optimistic retry on dropped SSE connections with resume tokens.",
      },
    ],
    sequenceSteps: [
      {
        stepNumber: 1,
        from: "Enterprise User",
        to: "Search Query Gateway",
        protocol: "HTTPS / JSON",
        payload: "SearchQuery: 'Q3 compliance policies'",
        latencyBudget: "14ms",
        description: "User submits complex natural-language query from web client.",
      },
      {
        stepNumber: 2,
        from: "FastAPI Backend",
        to: "Embedding API",
        protocol: "gRPC / HTTP/2",
        payload: "1536-dimension float array",
        latencyBudget: "58ms",
        description: "Generates dense embedding vector representing semantic intent of query.",
      },
      {
        stepNumber: 3,
        from: "FastAPI Backend",
        to: "pgvector (HNSW Index)",
        protocol: "PostgreSQL 16 Wire Protocol",
        payload: "Cosine Distance SELECT (m=16, ef=64)",
        latencyBudget: "18ms",
        description: "Scans top-50 nearest neighbor candidates across 500,000 document chunks.",
      },
      {
        stepNumber: 4,
        from: "FastAPI Backend",
        to: "Cross-Encoder Reranker",
        protocol: "HTTP/2 Batch Scoring",
        payload: "Candidate text pairs (Top-20)",
        latencyBudget: "35ms",
        description: "Cross-attention neural network re-ranks chunks to eliminate false semantic positives.",
      },
      {
        stepNumber: 5,
        from: "LLM Synthesizer",
        to: "Next.js Streaming UI",
        protocol: "Server-Sent Events (SSE)",
        payload: "Token stream with markdown citations",
        latencyBudget: "180ms TTFT",
        description: "Streams verified factual response with clickable deep-links to source manual pages.",
      },
    ],
    failoverScenario: {
      title: "Cohere Reranker API Service Outage",
      triggerName: "External Cross-Encoder API 503 Gateway Timeout",
      failedComponent: "api.cohere.ai/v1/rerank",
      fallbackRoute: "Local Reciprocal Rank Fusion (RRF) Fallback",
      recoveryMechanism: "Circuit breaker trips after 1,000ms timeout; immediately falls back to in-memory RRF combining BM25 keyword score and vector cosine distance",
      recoveryTimeMs: 12,
      dataLossRisk: "0% (Zero Hallucination / Degraded Ranking Only)",
      recoveryLogs: [
        "[16:04:12.110] WARNING: External Reranker API returned 503 Service Unavailable",
        "[16:04:12.112] CIRCUIT BREAKER: Tripping circuit breaker for external reranker endpoint",
        "[16:04:12.114] FALLBACK: Activating internal Reciprocal Rank Fusion (RRF score: k=60)",
        "[16:04:12.122] SYNTHESIS: Combined top-10 chunks delivered to LLM context window in 12ms",
        "[16:04:12.180] STREAM: User received complete cited answer without UI disruption or error modal.",
      ],
    },
    techTradeoffs: [
      {
        layer: "Vector Database",
        chosenTech: "PostgreSQL 16 + pgvector",
        rejectedAlternative: "Pinecone / Weaviate",
        whyChosen: "Keeps document text, permissions, and vector embeddings in a single ACID database without synchronization drift.",
        benchmarkAdvantage: "Sub-20ms queries at 1/8th the cost; eliminates $800/mo SaaS vector fees.",
      },
      {
        layer: "Retrieval Architecture",
        chosenTech: "Hybrid Dense + Sparse (BM25)",
        rejectedAlternative: "Pure Vector Search Only",
        whyChosen: "Pure vector search frequently misses exact technical part numbers and SKU codes that BM25 catches flawlessly.",
        benchmarkAdvantage: "83% accuracy lift and 100% precision on alphanumeric serial identifiers.",
      },
      {
        layer: "UI Streaming Protocol",
        chosenTech: "Server-Sent Events (SSE)",
        rejectedAlternative: "Standard REST Polling",
        whyChosen: "Delivers words to the screen as soon as the first token is generated by the LLM model.",
        benchmarkAdvantage: "180ms Time-to-First-Token vs 4.8-second full-answer wait time.",
      },
    ],
  },
  {
    id: "modular-monolith",
    title: "Modular Monolith vs Microservices Migration",
    tagline: "Consolidating 14 fragmented microservices into a high-velocity modular codebase",
    scopePrice: "$16,500 Scope",
    caseStudySlug: "postgres-performance-audit",
    serviceSlug: "architecture-audit",
    peakThroughput: "8,500 Requests / sec",
    p99Latency: "0ms Network Hop Overhead",
    costSavings: "-68% Compute Overhead",
    resiliencyGrade: "Deterministic Single-Process",
    nodes: [
      {
        id: "gateway-edge",
        label: "Unified Edge Gateway",
        sub: "Single TLS & DNS Entry",
        throughput: "Zero inter-service hops",
        latencyBudget: "< 8ms edge termination",
        tech: "Cloudflare Pages • Turborepo",
        rationale: "Replaces 14 separate Kubernetes ingress controllers with a single unified, type-safe entry point.",
        resiliency: "Eliminates cascading microservice timeout failures and circuit breaker flapping.",
      },
      {
        id: "domain-modules",
        label: "Domain Boundaries",
        sub: "Strict TypeScript Contracts",
        throughput: "In-Memory Direct Function Calls",
        latencyBudget: "0.01ms in-process call",
        tech: "TypeScript 5.6 • Internal Monorepo Packages",
        rationale: "Enforces strict domain encapsulation via typed interfaces without paying the 15ms network serialization tax.",
        resiliency: "Compile-time type verification catches breaking schema changes before code hits production.",
      },
      {
        id: "event-bus",
        label: "In-Memory Async Bus",
        sub: "Transactional Event Queue",
        throughput: "150,000 internal events/s",
        latencyBudget: "< 1ms event dispatch",
        tech: "Node.js EventEmitter + BullMQ",
        rationale: "Decouples domain modules (Orders -> Billing -> Notifications) without requiring external Kafka infrastructure.",
        resiliency: "Postgres-backed transactional outbox pattern guarantees at-least-once delivery during restarts.",
      },
      {
        id: "shared-db",
        label: "PostgreSQL 16 Schema",
        sub: "Logical Schema Isolation",
        throughput: "Single ACID Transaction Boundary",
        latencyBudget: "< 12ms multi-table join",
        tech: "PostgreSQL 16 • Multi-Schema Separation",
        rationale: "Replaces brittle two-phase commits (2PC) across multiple databases with native ACID transactions.",
        resiliency: "Schema-level permissions and automated continuous backups with PITR.",
      },
      {
        id: "unified-ci",
        label: "Unified CI/CD Pipeline",
        sub: "Single Test & Deploy Suite",
        throughput: "18-minute -> 90-second builds",
        latencyBudget: "< 2 min deploy cutover",
        tech: "GitHub Actions • Turbopack • Vitest",
        rationale: "Developers test the entire platform locally with one command (`npm run test`) instead of orchestrating 15 Docker images.",
        resiliency: "Hermetic caching and isolated staging deployments per pull request.",
      },
    ],
    sequenceSteps: [
      {
        stepNumber: 1,
        from: "Client Browser",
        to: "Unified App Router Entry",
        protocol: "HTTPS / TLS 1.3",
        payload: "CheckoutRequest (Order, Payment, Shipping)",
        latencyBudget: "8ms",
        description: "Receives order request at a single edge ingress point without cross-cluster proxying.",
      },
      {
        stepNumber: 2,
        from: "Orders Module",
        to: "Inventory Module",
        protocol: "In-Process Function Call (Zero Hop)",
        payload: "TypeScript Object Reference",
        latencyBudget: "0.02ms",
        description: "Validates stock via compiled TypeScript contract without JSON network serialization.",
      },
      {
        stepNumber: 3,
        from: "Orders Module",
        to: "Transactional Outbox (Postgres)",
        protocol: "ACID Transaction (Same DB Connection)",
        payload: "INSERT INTO orders, outbox_events",
        latencyBudget: "6.5ms",
        description: "Atomically records the order and payment event in one atomic database commit.",
      },
      {
        stepNumber: 4,
        from: "Outbox Worker",
        to: "Billing & Notification Queue",
        protocol: "BullMQ / Redis",
        payload: "OrderConfirmedEvent",
        latencyBudget: "1.2ms",
        description: "Asynchronous background worker processes receipt generation and email dispatches.",
      },
      {
        stepNumber: 5,
        from: "Unified App Router",
        to: "Client Browser",
        protocol: "HTTP 201 Created",
        payload: "{ success: true, orderId: 'ord_9182' }",
        latencyBudget: "22ms Total Roundtrip",
        description: "User receives instant confirmation; zero distributed saga coordination failures.",
      },
    ],
    failoverScenario: {
      title: "Worker Process Crash & Outbox Event Replay",
      triggerName: "OOM Kill on Asynchronous Notification Worker",
      failedComponent: "bullmq-worker-pod (Process ID: 8842)",
      fallbackRoute: "Transactional Outbox Auto-Recovery",
      recoveryMechanism: "Kubernetes restarts worker process; unacknowledged events automatically re-read from Postgres outbox table via SKIP LOCKED",
      recoveryTimeMs: 850,
      dataLossRisk: "0 bytes (Idempotent At-Least-Once Delivery)",
      recoveryLogs: [
        "[11:15:02.110] SYSTEM: Process 8842 terminated with SIGKILL (Worker restart)",
        "[11:15:02.420] K8S: Container restarted with healthy readiness probe in 310ms",
        "[11:15:02.580] OUTBOX: Scanning `outbox_events` table WHERE status = 'pending' FOR UPDATE SKIP LOCKED",
        "[11:15:02.690] WORKER: Claimed 4 pending events. Replaying billing and notification dispatches",
        "[11:15:02.750] SUCCESS: All 4 events acknowledged. Zero double-charges, zero dropped receipts.",
      ],
    },
    techTradeoffs: [
      {
        layer: "Codebase Organization",
        chosenTech: "Modular Monolith (Turborepo)",
        rejectedAlternative: "14 Separate Microservices",
        whyChosen: "Eliminates distributed tracing complexity, network hop latencies, and cross-repo breaking changes.",
        benchmarkAdvantage: "Build times dropped from 18m to 90s; 0ms inter-service latency.",
      },
      {
        layer: "Inter-Module Communication",
        chosenTech: "TypeScript Contracts + Outbox Bus",
        rejectedAlternative: "gRPC over Kubernetes Network",
        whyChosen: "Type errors are caught at compile-time instead of runtime deserialization crashes.",
        benchmarkAdvantage: "0.02ms in-memory call vs 12-18ms gRPC serialization overhead per hop.",
      },
      {
        layer: "Database Model",
        chosenTech: "Multi-Schema PostgreSQL 16",
        rejectedAlternative: "14 Independent Database Instances",
        whyChosen: "Preserves domain isolation through PostgreSQL schemas while allowing atomic transactions without 2-phase commit bugs.",
        benchmarkAdvantage: "Saved $1,400/month in idle cloud DB instances with 100% ACID consistency.",
      },
    ],
  },
];

export default function ArchitectureTopologyExplorer() {
  const [activeTopologyId, setActiveTopologyId] = useState<string>("telemetry");
  const [activeSubTab, setActiveSubTab] = useState<"nodes" | "sequence" | "failover" | "tradeoffs">("nodes");
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);

  const activeTopology =
    ARCHITECTURE_TOPOLOGIES.find((t) => t.id === activeTopologyId) || ARCHITECTURE_TOPOLOGIES[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeTopology.nodes[1].id);

  const activeNode =
    activeTopology.nodes.find((n) => n.id === selectedNodeId) || activeTopology.nodes[1];

  function handleSelectTopology(topologyId: string) {
    setActiveTopologyId(topologyId);
    setIsSimulatingFailover(false);
    const target = ARCHITECTURE_TOPOLOGIES.find((t) => t.id === topologyId);
    if (target) {
      setSelectedNodeId(target.nodes[1].id);
    }
  }

  return (
    <div
      className="topology-explorer-card"
      style={{
        background: "#0b132b",
        border: "1px solid #1e293b",
        borderRadius: "8px",
        padding: "20px 24px",
        margin: "24px 0",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxShadow: "0 4px 16px -2px rgba(11, 19, 43, 0.12)",
      }}
    >
      {/* Header & Subtitle */}
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: "14px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>
            Interactive Systems Architecture Topology Simulator
          </h3>
          <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "bold" }}>
            ● Production-Proven Blueprints
          </span>
        </div>
        <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#cbd5e1" }}>
          Select an enterprise architecture to inspect real-world data flow, latency budgets, failure resiliency, and cloud cost savings:
        </p>
      </div>

      {/* Architecture Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "8px",
          marginBottom: "18px",
        }}
      >
        {ARCHITECTURE_TOPOLOGIES.map((top) => {
          const isActive = top.id === activeTopology.id;
          return (
            <button
              key={top.id}
              type="button"
              onClick={() => handleSelectTopology(top.id)}
              style={{
                background: isActive ? "#1e293b" : "#070f1e",
                border: isActive ? "2px solid #38bdf8" : "1px solid #1e293b",
                borderRadius: "6px",
                padding: "10px 12px",
                color: "#ffffff",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "11px", color: isActive ? "#38bdf8" : "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>
                {top.scopePrice}
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: "bold", margin: "2px 0", color: "#ffffff" }}>
                {top.title}
              </div>
              <div style={{ fontSize: "11px", color: "#10b981", fontWeight: "600" }}>
                {top.costSavings}
              </div>
            </button>
          );
        })}
      </div>

      {/* Topology Key Performance Indicators Bar */}
      <div
        style={{
          background: "#070f1e",
          border: "1px solid #1e293b",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
          fontSize: "12px",
        }}
      >
        <div>
          <span style={{ color: "#94a3b8", display: "block" }}>Peak Throughput</span>
          <strong style={{ color: "#38bdf8", fontSize: "13.5px" }}>{activeTopology.peakThroughput}</strong>
        </div>
        <div>
          <span style={{ color: "#94a3b8", display: "block" }}>End-to-End P99 Latency</span>
          <strong style={{ color: "#c084fc", fontSize: "13.5px" }}>{activeTopology.p99Latency}</strong>
        </div>
        <div>
          <span style={{ color: "#94a3b8", display: "block" }}>Simulated Cloud Savings</span>
          <strong style={{ color: "#10b981", fontSize: "13.5px" }}>{activeTopology.costSavings}</strong>
        </div>
        <div>
          <span style={{ color: "#94a3b8", display: "block" }}>Resiliency Grade</span>
          <strong style={{ color: "#f59e0b", fontSize: "13.5px" }}>{activeTopology.resiliencyGrade}</strong>
        </div>
      </div>

      {/* Sub-Feature Mode Switcher */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", borderBottom: "1px solid #1e293b", paddingBottom: "10px", marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => setActiveSubTab("nodes")}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            background: activeSubTab === "nodes" ? "#2563eb" : "#070f1e",
            color: activeSubTab === "nodes" ? "#ffffff" : "#94a3b8",
            transition: "all 0.15s ease",
          }}
        >
          🧩 Node Architecture &amp; Rationale
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("sequence")}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            background: activeSubTab === "sequence" ? "#2563eb" : "#070f1e",
            color: activeSubTab === "sequence" ? "#ffffff" : "#94a3b8",
            transition: "all 0.15s ease",
          }}
        >
          ⏱️ Sequence Flow &amp; Latency Budget
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("failover")}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            background: activeSubTab === "failover" ? "#2563eb" : "#070f1e",
            color: activeSubTab === "failover" ? "#ffffff" : "#94a3b8",
            transition: "all 0.15s ease",
          }}
        >
          ⚡ Failover &amp; Chaos Simulator
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("tradeoffs")}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            background: activeSubTab === "tradeoffs" ? "#2563eb" : "#070f1e",
            color: activeSubTab === "tradeoffs" ? "#ffffff" : "#94a3b8",
            transition: "all 0.15s ease",
          }}
        >
          ⚖️ Tech Stack Trade-Off Matrix
        </button>
      </div>

      {/* SUB-TAB 1: Node Deep Dive */}
      {activeSubTab === "nodes" && (
        <>
          {/* Nodes Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "8px",
              marginBottom: "18px",
            }}
          >
            {activeTopology.nodes.map((node, index) => {
              const isSelected = node.id === activeNode.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    background: isSelected ? "#111e38" : "#070f1e",
                    border: isSelected ? "2px solid #2563eb" : "1px solid #1e293b",
                    borderRadius: "6px",
                    padding: "10px 8px",
                    color: "#ffffff",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    position: "relative",
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 6px #10b981",
                      }}
                    />
                  )}
                  <div style={{ fontSize: "11px", color: isSelected ? "#38bdf8" : "#94a3b8", fontWeight: "bold" }}>
                    Step 0{index + 1}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "bold", margin: "2px 0" }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                    {node.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Node Detail Box */}
          <div
            style={{
              background: "#070f1e",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              padding: "16px 20px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                flexWrap: "wrap",
                borderBottom: "1px solid #1e293b",
                paddingBottom: "10px",
                marginBottom: "12px",
                gap: "8px",
              }}
            >
              <div>
                <strong style={{ fontSize: "17px", color: "#ffffff" }}>{activeNode.label}</strong>
                <span style={{ fontSize: "12.5px", color: "#38bdf8", marginLeft: "10px", fontWeight: "600" }}>
                  ({activeNode.tech})
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", fontSize: "12px", flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "#064e3b",
                    color: "#4ade80",
                    padding: "3px 8px",
                    borderRadius: "3px",
                    border: "1px solid #059669",
                  }}
                >
                  ⚡ {activeNode.throughput}
                </span>
                <span
                  style={{
                    background: "#1e1b4b",
                    color: "#c084fc",
                    padding: "3px 8px",
                    borderRadius: "3px",
                    border: "1px solid #4338ca",
                  }}
                >
                  ⏱️ {activeNode.latencyBudget}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", fontSize: "13px" }}>
              <div>
                <strong style={{ color: "#cbd5e1", display: "block", marginBottom: "4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Architectural Decision Rationale
                </strong>
                <p style={{ margin: 0, color: "#f8fafc", lineHeight: "1.5" }}>
                  {activeNode.rationale}
                </p>
              </div>
              <div>
                <strong style={{ color: "#cbd5e1", display: "block", marginBottom: "4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  High-Availability &amp; Failure Resiliency
                </strong>
                <p style={{ margin: 0, color: "#f8fafc", lineHeight: "1.5" }}>
                  {activeNode.resiliency}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SUB-TAB 2: Sequence Flow & Latency Budget */}
      {activeSubTab === "sequence" && (
        <div style={{ background: "#070f1e", border: "1px solid #1e293b", borderRadius: "6px", padding: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#38bdf8" }}>
              End-to-End Hop Sequence &amp; Microsecond Latency Budgets
            </span>
            <span style={{ fontSize: "11.5px", color: "#10b981", fontWeight: 600 }}>
              Total Budget: {activeTopology.p99Latency}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeTopology.sequenceSteps.map((step) => (
              <div
                key={step.stepNumber}
                style={{
                  background: "#0b132b",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {step.stepNumber}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>
                      <span>{step.from}</span>
                      <span style={{ color: "#38bdf8", margin: "0 8px" }}>&rarr;</span>
                      <span>{step.to}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4ade80", backgroundColor: "#064e3b", padding: "2px 8px", borderRadius: "4px" }}>
                      ⏱️ {step.latencyBudget}
                    </span>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#38bdf8", fontFamily: "monospace", margin: "3px 0" }}>
                    Protocol: {step.protocol} • Payload: {step.payload}
                  </div>
                  <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.4 }}>
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Failover & Chaos Simulator */}
      {activeSubTab === "failover" && (
        <div style={{ background: "#070f1e", border: "1px solid #1e293b", borderRadius: "6px", padding: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase" }}>
                Chaos Scenario Simulation
              </span>
              <h4 style={{ margin: "2px 0 0 0", fontSize: "15px", color: "#ffffff" }}>
                {activeTopology.failoverScenario.title}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsSimulatingFailover(!isSimulatingFailover)}
              style={{
                backgroundColor: isSimulatingFailover ? "#dc2626" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {isSimulatingFailover ? "Reset Cluster to Normal" : "🔥 Trigger Simulated Outage"}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", borderRadius: "6px", padding: "10px 12px" }}>
              <span style={{ fontSize: "10.5px", color: "#94a3b8", display: "block" }}>Failed Component</span>
              <strong style={{ color: isSimulatingFailover ? "#ef4444" : "#ffffff", fontSize: "12px", fontFamily: "monospace" }}>
                {activeTopology.failoverScenario.failedComponent}
              </strong>
            </div>

            <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", borderRadius: "6px", padding: "10px 12px" }}>
              <span style={{ fontSize: "10.5px", color: "#94a3b8", display: "block" }}>Automated Reroute</span>
              <strong style={{ color: "#38bdf8", fontSize: "12px" }}>
                {activeTopology.failoverScenario.fallbackRoute}
              </strong>
            </div>

            <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", borderRadius: "6px", padding: "10px 12px" }}>
              <span style={{ fontSize: "10.5px", color: "#94a3b8", display: "block" }}>Failover Time</span>
              <strong style={{ color: "#10b981", fontSize: "12px" }}>
                {activeTopology.failoverScenario.recoveryTimeMs}ms MTTR
              </strong>
            </div>

            <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", borderRadius: "6px", padding: "10px 12px" }}>
              <span style={{ fontSize: "10.5px", color: "#94a3b8", display: "block" }}>Data Loss Risk</span>
              <strong style={{ color: "#4ade80", fontSize: "12px" }}>
                {activeTopology.failoverScenario.dataLossRisk}
              </strong>
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              Live Telemetry &amp; Recovery Event Log:
            </span>
            <pre
              style={{
                backgroundColor: "#030712",
                color: isSimulatingFailover ? "#4ade80" : "#94a3b8",
                padding: "12px 14px",
                borderRadius: "6px",
                fontSize: "11.5px",
                fontFamily: "Consolas, Monaco, monospace",
                lineHeight: "1.6",
                margin: 0,
                border: "1px solid #1e293b",
                overflowX: "auto",
              }}
            >
              {isSimulatingFailover
                ? activeTopology.failoverScenario.recoveryLogs.join("\n")
                : "[09:00:00.000] Cluster Status: HEALTHY • All primary nodes emitting heartbeats • Zero circuit breaker trips"}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Tech Stack Trade-offs */}
      {activeSubTab === "tradeoffs" && (
        <div style={{ background: "#070f1e", border: "1px solid #1e293b", borderRadius: "6px", padding: "16px", marginBottom: "16px" }}>
          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#38bdf8", marginBottom: "12px" }}>
            Technical Architecture Rationale &amp; Empirical Benchmark Gains
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeTopology.techTradeoffs.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0b132b",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>
                    {item.layer}
                  </span>
                  <div style={{ fontSize: "11.5px" }}>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>✓ Chosen: {item.chosenTech}</span>
                    <span style={{ color: "#64748b", margin: "0 6px" }}>vs</span>
                    <span style={{ color: "#ef4444", textDecoration: "line-through" }}>{item.rejectedAlternative}</span>
                  </div>
                </div>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "#f8fafc", lineHeight: 1.45 }}>
                  {item.whyChosen}
                </p>
                <div style={{ fontSize: "11.5px", color: "#38bdf8", fontFamily: "monospace", backgroundColor: "#070f1e", padding: "4px 8px", borderRadius: "4px" }}>
                  ⚡ Measured Advantage: {item.benchmarkAdvantage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Proof & SOW Action Ribbon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px 14px",
          backgroundColor: "#070f1e",
          border: "1px solid #1e293b",
          borderRadius: "6px",
          fontSize: "12.5px",
        }}
      >
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <span>
            <strong style={{ color: "#cbd5e1" }}>Production Proof:</strong>{" "}
            <Link
              href={`/projects/${activeTopology.caseStudySlug}`}
              style={{ color: "#38bdf8", fontWeight: "700", textDecoration: "underline" }}
            >
              Read Case Study &rsaquo;
            </Link>
          </span>
          <span>
            <strong style={{ color: "#cbd5e1" }}>Fixed Sprint Scope:</strong>{" "}
            <Link
              href={`/services/${activeTopology.serviceSlug}`}
              style={{ color: "#10b981", fontWeight: "700", textDecoration: "underline" }}
            >
              View Solution Page &rsaquo;
            </Link>
          </span>
        </div>
        <div>
          <Link
            href="/pricing#inquiry"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "6px 14px",
              borderRadius: "4px",
              fontWeight: "700",
              fontSize: "12px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Request Similar Architecture SOW &rsaquo;
          </Link>
        </div>
      </div>
    </div>
  );
}
