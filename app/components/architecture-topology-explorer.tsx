"use client";

import React, { useState } from "react";

interface TopologyNode {
  id: string;
  label: string;
  sub: string;
  throughput: string;
  latencyBudget: string;
  tech: string;
  rationale: string;
  resiliency: string;
}

const nodes: TopologyNode[] = [
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
    sub: "Concurrent Microservices",
    throughput: "48 worker goroutines per core",
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
];

export default function ArchitectureTopologyExplorer() {
  const [selectedId, setSelectedId] = useState<string>("go-workers");
  const activeNode = nodes.find((n) => n.id === selectedId) || nodes[1];

  return (
    <div
      className="topology-explorer-card"
      style={{
        background: "#053056",
        border: "1px solid #0a365c",
        borderRadius: "6px",
        padding: "20px",
        margin: "24px 0",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ borderBottom: "1px solid #0a365c", paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#9CBE41", textTransform: "uppercase", letterSpacing: "1px" }}>
            Interactive Architecture Topology Viewer
          </h3>
          <span style={{ fontSize: "12px", color: "#4ade80", fontWeight: "bold" }}>
            Real-Time Telemetry Pipeline (12M Events/s)
          </span>
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#cbd5e1" }}>
          Click on any architectural node below to inspect throughput budgets, technology choices, and failover mechanics:
        </p>
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
        {nodes.map((node, index) => {
          const isSelected = node.id === selectedId;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedId(node.id)}
              style={{
                background: isSelected ? "#042442" : "#031c33",
                border: isSelected ? "2px solid #9CBE41" : "1px solid #0a365c",
                borderRadius: "4px",
                padding: "10px 8px",
                color: "#ffffff",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out",
              }}
            >
              <div style={{ fontSize: "11px", color: isSelected ? "#9CBE41" : "#cbd5e1", fontWeight: "bold" }}>
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
          background: "#042442",
          border: "1px solid #0a365c",
          borderRadius: "4px",
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", borderBottom: "1px solid #0a365c", paddingBottom: "10px", marginBottom: "12px" }}>
          <div>
            <strong style={{ fontSize: "18px", color: "#ffffff" }}>{activeNode.label}</strong>
            <span style={{ fontSize: "13px", color: "#9CBE41", marginLeft: "10px", fontWeight: "600" }}>({activeNode.tech})</span>
          </div>
          <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
            <span style={{ background: "#064e3b", color: "#4ade80", padding: "3px 8px", borderRadius: "3px", border: "1px solid #059669" }}>
              ⚡ {activeNode.throughput}
            </span>
            <span style={{ background: "#1e1b4b", color: "#c084fc", padding: "3px 8px", borderRadius: "3px", border: "1px solid #4338ca" }}>
              ⏱️ {activeNode.latencyBudget}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "13px" }}>
          <div>
            <strong style={{ color: "#cbd5e1", display: "block", marginBottom: "4px", fontSize: "12px", textTransform: "uppercase" }}>
              Architectural Decision Rationale
            </strong>
            <p style={{ margin: 0, color: "#f8fafc", lineHeight: "1.5" }}>
              {activeNode.rationale}
            </p>
          </div>
          <div>
            <strong style={{ color: "#cbd5e1", display: "block", marginBottom: "4px", fontSize: "12px", textTransform: "uppercase" }}>
              High-Availability &amp; Failure Resiliency
            </strong>
            <p style={{ margin: 0, color: "#f8fafc", lineHeight: "1.5" }}>
              {activeNode.resiliency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
