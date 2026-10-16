"use client";

import React, { useState } from "react";

export default function SqlOptimizationExplorer() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");

  return (
    <div
      className="sql-optimization-card"
      style={{
        background: "#071324",
        border: "1px solid #1e293b",
        borderRadius: "6px",
        padding: "20px",
        margin: "24px 0",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", borderBottom: "1px solid #1e293b", paddingBottom: "12px", marginBottom: "16px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>
            PostgreSQL Query Tuning Case Study Explorer
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#94a3b8" }}>
            High-Concurrency Production Optimization • 4.2M Records Table
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("before")}
            style={{
              background: activeTab === "before" ? "#ef4444" : "#1e293b",
              color: "#ffffff",
              border: "none",
              borderRadius: "3px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ⚠️ Before (1,240ms)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("after")}
            style={{
              background: activeTab === "after" ? "#16a34a" : "#1e293b",
              color: "#ffffff",
              border: "none",
              borderRadius: "3px",
              padding: "6px 14px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ✓ After (3.8ms)
          </button>
        </div>
      </div>

      {activeTab === "before" ? (
        <div>
          <div style={{ background: "#450a0a", border: "1px solid #991b1b", padding: "10px 14px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px", color: "#fecaca" }}>
            <strong>The Problem:</strong> Full table sequential scan caused database CPU spikes up to 92% and connection pool timeouts during morning market opens.
          </div>

          <div style={{ background: "#020817", border: "1px solid #1e293b", borderRadius: "4px", padding: "14px", fontFamily: "monospace", fontSize: "12.5px", color: "#e2e8f0", overflowX: "auto", marginBottom: "14px" }}>
            <span style={{ color: "#94a3b8" }}>-- Unindexed Query (Spilling to Disk)</span><br />
            <span style={{ color: "#38bdf8" }}>SELECT</span> user_id, sum(amount), count(*)<br />
            <span style={{ color: "#38bdf8" }}>FROM</span> orders<br />
            <span style={{ color: "#38bdf8" }}>WHERE</span> status = <span style={{ color: "#fde047" }}>&apos;settled&apos;</span><br />
            &nbsp;&nbsp;<span style={{ color: "#38bdf8" }}>AND</span> created_at &gt;= <span style={{ color: "#fde047" }}>NOW() - INTERVAL &apos;30 days&apos;</span><br />
            <span style={{ color: "#38bdf8" }}>GROUP BY</span> user_id;<br /><br />
            <span style={{ color: "#ef4444" }}>EXPLAIN ANALYZE:</span><br />
            -&gt; Seq Scan on orders (cost=0.00..84210.00 rows=4210452 width=142)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;Buffers: shared hit=1240 read=41829, temp written=1824<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<strong>Execution Time: 1240.23 ms</strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "12px", textAlign: "center" }}>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", border: "1px solid #374151" }}>
              <span style={{ color: "#9ca3af", display: "block" }}>Execution Time</span>
              <strong style={{ color: "#ef4444", fontSize: "16px" }}>1,240 ms</strong>
            </div>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", border: "1px solid #374151" }}>
              <span style={{ color: "#9ca3af", display: "block" }}>Buffer Spill</span>
              <strong style={{ color: "#ef4444", fontSize: "16px" }}>41.8 MB to Disk</strong>
            </div>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", border: "1px solid #374151" }}>
              <span style={{ color: "#9ca3af", display: "block" }}>Connection Pool</span>
              <strong style={{ color: "#ef4444", fontSize: "16px" }}>92% Saturation</strong>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ background: "#064e3b", border: "1px solid #059669", padding: "10px 14px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px", color: "#ecfdf5" }}>
            <strong>The Solution:</strong> Designed a concurrent composite partial covering index and rewritten CTE that satisfies the query entirely from RAM without touching the heap.
          </div>

          <div style={{ background: "#020817", border: "1px solid #1e293b", borderRadius: "4px", padding: "14px", fontFamily: "monospace", fontSize: "12.5px", color: "#e2e8f0", overflowX: "auto", marginBottom: "14px" }}>
            <span style={{ color: "#94a3b8" }}>-- Specialized Composite Partial Covering Index</span><br />
            <span style={{ color: "#38bdf8" }}>CREATE INDEX CONCURRENTLY</span> idx_orders_settled_recent<br />
            <span style={{ color: "#38bdf8" }}>ON</span> orders (user_id, created_at <span style={{ color: "#38bdf8" }}>DESC</span>)<br />
            <span style={{ color: "#38bdf8" }}>INCLUDE</span> (amount)<br />
            <span style={{ color: "#38bdf8" }}>WHERE</span> status = <span style={{ color: "#fde047" }}>&apos;settled&apos;</span>;<br /><br />
            <span style={{ color: "#4ade80" }}>EXPLAIN ANALYZE:</span><br />
            -&gt; Index Only Scan using idx_orders_settled_recent (cost=0.43..12.45 rows=482 width=24)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;Buffers: shared hit=42 read=0, temp written=0<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<strong>Execution Time: 3.82 ms (326x faster)</strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", fontSize: "12px", textAlign: "center" }}>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", border: "1px solid #374151" }}>
              <span style={{ color: "#9ca3af", display: "block" }}>Execution Time</span>
              <strong style={{ color: "#4ade80", fontSize: "16px" }}>3.8 ms (326x)</strong>
            </div>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", border: "1px solid #374151" }}>
              <span style={{ color: "#9ca3af", display: "block" }}>Disk Temp Spills</span>
              <strong style={{ color: "#4ade80", fontSize: "16px" }}>0 KB (100% RAM)</strong>
            </div>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", border: "1px solid #374151" }}>
              <span style={{ color: "#9ca3af", display: "block" }}>Database CPU</span>
              <strong style={{ color: "#4ade80", fontSize: "16px" }}>&lt; 6% Flat</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
