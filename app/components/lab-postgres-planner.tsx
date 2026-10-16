"use client";

import React, { useState } from "react";

type TableScale = "100k" | "2m" | "25m";
type IndexStrategy = "none" | "single" | "composite_partial" | "brin";

interface PlanOutcome {
  strategyName: string;
  scanType: string;
  totalCost: string;
  executionTimeMs: number;
  bufferHits: string;
  diskReads: string;
  speedup: string;
  indexSql: string;
  planOutput: string;
}

const planMatrix: Record<TableScale, Record<IndexStrategy, PlanOutcome>> = {
  "100k": {
    none: {
      strategyName: "No Index (Sequential Table Scan)",
      scanType: "Seq Scan on transactions",
      totalCost: "0.00..2,450.00",
      executionTimeMs: 142.5,
      bufferHits: "1,240 blocks",
      diskReads: "1,210 blocks",
      speedup: "1x (Baseline)",
      indexSql: "-- No index defined",
      planOutput: `Seq Scan on transactions  (cost=0.00..2450.00 rows=1250 width=72) (actual time=0.042..142.120 rows=1240 loops=1)\n  Filter: ((account_id = 'acc_9281') AND (status = 'completed') AND (created_at >= '2026-01-01'))\n  Rows Removed by Filter: 98760\n  Buffers: shared read=1210 hit=30\nExecution Time: 142.512 ms`,
    },
    single: {
      strategyName: "Single B-Tree (account_id)",
      scanType: "Bitmap Heap Scan on transactions",
      totalCost: "12.40..340.00",
      executionTimeMs: 14.8,
      bufferHits: "310 blocks",
      diskReads: "24 blocks",
      speedup: "9.6x Faster",
      indexSql: `CREATE INDEX idx_trans_account ON transactions (account_id);`,
      planOutput: `Bitmap Heap Scan on transactions  (cost=12.40..340.00 rows=1250 width=72) (actual time=1.210..14.310 rows=1240 loops=1)\n  Recheck Cond: (account_id = 'acc_9281')\n  Filter: ((status = 'completed') AND (created_at >= '2026-01-01'))\n  Buffers: shared hit=310 read=24\n  ->  Bitmap Index Scan on idx_trans_account (cost=0.00..12.08 rows=4200)\nExecution Time: 14.802 ms`,
    },
    composite_partial: {
      strategyName: "Composite Partial B-Tree (Surgical)",
      scanType: "Index Scan on idx_trans_account_date",
      totalCost: "0.42..8.45",
      executionTimeMs: 0.82,
      bufferHits: "6 blocks (100% RAM)",
      diskReads: "0 blocks",
      speedup: "173x Faster",
      indexSql: `CREATE INDEX idx_trans_account_date\nON transactions (account_id, created_at DESC)\nWHERE status = 'completed';`,
      planOutput: `Index Scan using idx_trans_account_date on transactions  (cost=0.42..8.45 rows=1240 width=72) (actual time=0.018..0.780 rows=1240 loops=1)\n  Index Cond: ((account_id = 'acc_9281') AND (created_at >= '2026-01-01'))\n  Buffers: shared hit=6\nExecution Time: 0.820 ms`,
    },
    brin: {
      strategyName: "BRIN (Block Range Index on Timestamp)",
      scanType: "Bitmap Heap Scan (BRIN)",
      totalCost: "4.00..120.00",
      executionTimeMs: 4.6,
      bufferHits: "42 blocks",
      diskReads: "4 blocks",
      speedup: "31x Faster",
      indexSql: `CREATE INDEX idx_trans_brin_date ON transactions USING BRIN (created_at);`,
      planOutput: `Bitmap Heap Scan on transactions  (cost=4.00..120.00 rows=1250 width=72) (actual time=0.420..4.310 rows=1240 loops=1)\n  Recheck Cond: (created_at >= '2026-01-01')\n  Filter: ((account_id = 'acc_9281') AND (status = 'completed'))\n  Buffers: shared hit=42 read=4\nExecution Time: 4.610 ms`,
    },
  },
  "2m": {
    none: {
      strategyName: "No Index (Sequential Table Scan)",
      scanType: "Seq Scan on transactions",
      totalCost: "0.00..58,914.00",
      executionTimeMs: 4210.0,
      bufferHits: "1,450 blocks",
      diskReads: "28,500 blocks",
      speedup: "1x (Baseline)",
      indexSql: "-- No index defined",
      planOutput: `Seq Scan on transactions  (cost=0.00..58914.00 rows=184100 width=72) (actual time=0.120..4180.200 rows=18400 loops=1)\n  Filter: ((account_id = 'acc_9281') AND (status = 'completed') AND (created_at >= '2026-01-01'))\n  Rows Removed by Filter: 1981600\n  Buffers: shared read=28500 hit=1450\nExecution Time: 4210.000 ms`,
    },
    single: {
      strategyName: "Single B-Tree (account_id)",
      scanType: "Bitmap Heap Scan on transactions",
      totalCost: "84.20..3,840.00",
      executionTimeMs: 248.0,
      bufferHits: "3,120 blocks",
      diskReads: "620 blocks",
      speedup: "17x Faster",
      indexSql: `CREATE INDEX idx_trans_account ON transactions (account_id);`,
      planOutput: `Bitmap Heap Scan on transactions  (cost=84.20..3840.00 rows=18400 width=72) (actual time=4.810..242.000 rows=18400 loops=1)\n  Recheck Cond: (account_id = 'acc_9281')\n  Filter: ((status = 'completed') AND (created_at >= '2026-01-01'))\n  Buffers: shared hit=3120 read=620\nExecution Time: 248.000 ms`,
    },
    composite_partial: {
      strategyName: "Composite Partial B-Tree (Surgical)",
      scanType: "Index Scan on idx_trans_account_date",
      totalCost: "0.42..14.80",
      executionTimeMs: 1.84,
      bufferHits: "14 blocks (100% RAM)",
      diskReads: "0 blocks",
      speedup: "2,288x Faster",
      indexSql: `CREATE INDEX idx_trans_account_date\nON transactions (account_id, created_at DESC)\nWHERE status = 'completed';`,
      planOutput: `Index Scan using idx_trans_account_date on transactions  (cost=0.42..14.80 rows=18400 width=72) (actual time=0.024..1.780 rows=18400 loops=1)\n  Index Cond: ((account_id = 'acc_9281') AND (created_at >= '2026-01-01'))\n  Buffers: shared hit=14\nExecution Time: 1.840 ms`,
    },
    brin: {
      strategyName: "BRIN (Block Range Index on Timestamp)",
      scanType: "Bitmap Heap Scan (BRIN)",
      totalCost: "8.00..840.00",
      executionTimeMs: 38.5,
      bufferHits: "640 blocks",
      diskReads: "85 blocks",
      speedup: "109x Faster",
      indexSql: `CREATE INDEX idx_trans_brin_date ON transactions USING BRIN (created_at);`,
      planOutput: `Bitmap Heap Scan on transactions  (cost=8.00..840.00 rows=18400 width=72) (actual time=1.420..37.100 rows=18400 loops=1)\n  Recheck Cond: (created_at >= '2026-01-01')\n  Filter: ((account_id = 'acc_9281') AND (status = 'completed'))\n  Buffers: shared hit=640 read=85\nExecution Time: 38.500 ms`,
    },
  },
  "25m": {
    none: {
      strategyName: "No Index (Sequential Table Scan)",
      scanType: "Seq Scan on transactions (OOM / Timeout Risk)",
      totalCost: "0.00..485,000.00",
      executionTimeMs: 38400.0,
      bufferHits: "8,200 blocks",
      diskReads: "320,000 blocks",
      speedup: "1x (Baseline)",
      indexSql: "-- No index defined",
      planOutput: `Seq Scan on transactions  (cost=0.00..485000.00 rows=230000 width=72) (actual time=1.400..38200.000 rows=23000 loops=1)\n  Filter: ((account_id = 'acc_9281') AND (status = 'completed') AND (created_at >= '2026-01-01'))\n  Rows Removed by Filter: 24977000\n  Buffers: shared read=320000 hit=8200\nExecution Time: 38400.000 ms (~38.4s!)`,
    },
    single: {
      strategyName: "Single B-Tree (account_id)",
      scanType: "Bitmap Heap Scan on transactions",
      totalCost: "450.00..28,000.00",
      executionTimeMs: 1840.0,
      bufferHits: "14,500 blocks",
      diskReads: "4,200 blocks",
      speedup: "20.8x Faster",
      indexSql: `CREATE INDEX idx_trans_account ON transactions (account_id);`,
      planOutput: `Bitmap Heap Scan on transactions  (cost=450.00..28000.00 rows=23000 width=72) (actual time=12.400..1810.000 rows=23000 loops=1)\n  Recheck Cond: (account_id = 'acc_9281')\n  Filter: ((status = 'completed') AND (created_at >= '2026-01-01'))\n  Buffers: shared hit=14500 read=4200\nExecution Time: 1840.000 ms`,
    },
    composite_partial: {
      strategyName: "Composite Partial B-Tree (Surgical)",
      scanType: "Index Scan on idx_trans_account_date",
      totalCost: "0.42..24.50",
      executionTimeMs: 3.12,
      bufferHits: "22 blocks (100% RAM)",
      diskReads: "0 blocks",
      speedup: "12,307x Faster",
      indexSql: `CREATE INDEX idx_trans_account_date\nON transactions (account_id, created_at DESC)\nWHERE status = 'completed';`,
      planOutput: `Index Scan using idx_trans_account_date on transactions  (cost=0.42..24.50 rows=23000 width=72) (actual time=0.032..3.020 rows=23000 loops=1)\n  Index Cond: ((account_id = 'acc_9281') AND (created_at >= '2026-01-01'))\n  Buffers: shared hit=22\nExecution Time: 3.120 ms`,
    },
    brin: {
      strategyName: "BRIN (Block Range Index on Timestamp)",
      scanType: "Bitmap Heap Scan (BRIN)",
      totalCost: "16.00..4,200.00",
      executionTimeMs: 94.0,
      bufferHits: "1,840 blocks",
      diskReads: "340 blocks",
      speedup: "408x Faster",
      indexSql: `CREATE INDEX idx_trans_brin_date ON transactions USING BRIN (created_at);`,
      planOutput: `Bitmap Heap Scan on transactions  (cost=16.00..4200.00 rows=23000 width=72) (actual time=2.100..91.400 rows=23000 loops=1)\n  Recheck Cond: (created_at >= '2026-01-01')\n  Filter: ((account_id = 'acc_9281') AND (status = 'completed'))\n  Buffers: shared hit=1840 read=340\nExecution Time: 94.000 ms`,
    },
  },
};

export default function LabPostgresPlanner() {
  const [scale, setScale] = useState<TableScale>("2m");
  const [strategy, setStrategy] = useState<IndexStrategy>("composite_partial");

  const currentOutcome = planMatrix[scale][strategy];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderLeft: "5px solid #053056",
        borderRadius: "4px",
        padding: "24px",
        marginBottom: "28px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ marginBottom: "18px" }}>
        <span style={{ fontSize: "11px", fontWeight: "800", color: "#9CBE41", textTransform: "uppercase", letterSpacing: "1px" }}>
          Telemetry Tool 02 • PostgreSQL 16 Architecture
        </span>
        <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#053056" }}>
          Interactive EXPLAIN (ANALYZE, BUFFERS) Cost &amp; Execution Simulator
        </h3>
        <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#475569" }}>
          Select database volume and toggle index topologies to observe how composite partial indexes eradicate disk I/O bottlenecks.
        </p>
      </div>

      {/* Controls Strip */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "16px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Table Size Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12.5px", fontWeight: "bold", color: "#053056", minWidth: "120px" }}>
            Database Scale:
          </span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(
              [
                { id: "100k", label: "100,000 Rows" },
                { id: "2m", label: "2,000,000 Rows" },
                { id: "25m", label: "25,000,000 Rows" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScale(s.id)}
                style={{
                  padding: "8px 14px",
                  minHeight: "38px",
                  fontSize: "12px",
                  fontWeight: "700",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: scale === s.id ? "#053056" : "#ffffff",
                  color: scale === s.id ? "#ffffff" : "#475569",
                  border: "1px solid " + (scale === s.id ? "#053056" : "#cbd5e1"),
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Index Strategy Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12.5px", fontWeight: "bold", color: "#053056", minWidth: "120px" }}>
            Index Topology:
          </span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(
              [
                { id: "none", label: "Seq Scan (No Index)" },
                { id: "single", label: "Single B-Tree" },
                { id: "composite_partial", label: "Composite Partial B-Tree (Surgical)" },
                { id: "brin", label: "BRIN (Block Range)" },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStrategy(st.id)}
                style={{
                  padding: "8px 14px",
                  minHeight: "38px",
                  fontSize: "12px",
                  fontWeight: "700",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: strategy === st.id ? "#9CBE41" : "#ffffff",
                  color: strategy === st.id ? "#041f36" : "#475569",
                  border: "1px solid " + (strategy === st.id ? "#9CBE41" : "#cbd5e1"),
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metric Scorecard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ backgroundColor: "#041f36", color: "#ffffff", padding: "12px 14px", borderRadius: "4px" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Execution Latency</span>
          <strong style={{ fontSize: "20px", color: strategy === "none" ? "#f87171" : "#4ade80" }}>
            {currentOutcome.executionTimeMs} ms
          </strong>
        </div>

        <div style={{ backgroundColor: "#041f36", color: "#ffffff", padding: "12px 14px", borderRadius: "4px" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Planner Total Cost</span>
          <strong style={{ fontSize: "16px", color: "#e2e8f0" }}>{currentOutcome.totalCost}</strong>
        </div>

        <div style={{ backgroundColor: "#041f36", color: "#ffffff", padding: "12px 14px", borderRadius: "4px" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Buffer Memory Hits</span>
          <strong style={{ fontSize: "15px", color: "#cbd5e1" }}>{currentOutcome.bufferHits}</strong>
        </div>

        <div style={{ backgroundColor: "#041f36", color: "#ffffff", padding: "12px 14px", borderRadius: "4px" }}>
          <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Throughput Boost</span>
          <strong style={{ fontSize: "16px", color: "#9CBE41" }}>{currentOutcome.speedup}</strong>
        </div>
      </div>

      {/* Plan Visual Output */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#053056" }}>
            PostgreSQL EXPLAIN ANALYZE Output
          </span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            Node: <code>{currentOutcome.scanType}</code>
          </span>
        </div>
        <pre
          style={{
            backgroundColor: "#031a2e",
            color: "#e2e8f0",
            padding: "14px",
            borderRadius: "4px",
            fontSize: "12px",
            lineHeight: "1.6",
            overflowX: "auto",
            margin: 0,
            border: "1px solid #0a365c",
            fontFamily: "Consolas, Monaco, monospace",
          }}
        >
          {currentOutcome.planOutput}
        </pre>
      </div>

      {/* DDL Snippet */}
      {currentOutcome.indexSql !== "-- No index defined" && (
        <div style={{ backgroundColor: "#f1f5f9", padding: "12px 14px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "12px" }}>
          <span style={{ fontWeight: "bold", color: "#053056", display: "block", marginBottom: "4px" }}>
            Index DDL Blueprint:
          </span>
          <code style={{ color: "#0f172a", fontFamily: "monospace" }}>{currentOutcome.indexSql}</code>
        </div>
      )}
    </div>
  );
}
