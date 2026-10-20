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
  },
];

export default function ArchitectureTopologyExplorer() {
  const [activeTopologyId, setActiveTopologyId] = useState<string>("telemetry");
  const activeTopology =
    ARCHITECTURE_TOPOLOGIES.find((t) => t.id === activeTopologyId) || ARCHITECTURE_TOPOLOGIES[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeTopology.nodes[1].id);

  // If selected node is not in current topology, reset to second node of new topology
  const activeNode =
    activeTopology.nodes.find((n) => n.id === selectedNodeId) || activeTopology.nodes[1];

  function handleSelectTopology(topologyId: string) {
    setActiveTopologyId(topologyId);
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
