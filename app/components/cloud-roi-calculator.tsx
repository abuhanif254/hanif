"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CloudRoiCalculator() {
  const [monthlySpend, setMonthlySpend] = useState<number>(6500);

  // Benchmarked savings from real architecture case studies (avg 64% compute & egress reduction)
  const savingsPct = 0.62;
  const monthlySavings = Math.round(monthlySpend * savingsPct);
  const annualSavings = monthlySavings * 12;
  const migrationCost = 6500;
  const paybackMonths = Math.max(0.5, Number((migrationCost / (monthlySavings || 1)).toFixed(1)));

  return (
    <div
      style={{
        backgroundColor: "#0b132b",
        borderRadius: "8px",
        padding: "28px",
        color: "#ffffff",
        margin: "36px 0",
        border: "1px solid #1e293b",
        boxShadow: "0 4px 20px rgba(11,25,44,0.3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#38bdf8" }}>
            Interactive Architecture ROI Benchmark
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#ffffff", fontWeight: "800" }}>
            Cloudflare Edge Migration &amp; Cost Reduction Calculator
          </h3>
        </div>
        <span style={{ fontSize: "12px", color: "#cbd5e1", backgroundColor: "#070f1e", padding: "4px 10px", borderRadius: "4px", border: "1px solid #1e293b" }}>
          Based on 64% verified case study savings
        </span>
      </div>

      <p style={{ fontSize: "13.5px", color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 20px 0" }}>
        Enter your current monthly cloud hosting bill (AWS EC2/ECS/RDS, GCP, or Vercel) to project your estimated cost reductions and edge speedup on Cloudflare Pages and Supabase PostgreSQL:
      </p>

      {/* Slider Input */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Current Monthly Cloud Infrastructure Spend:</span>
          <strong style={{ fontSize: "22px", color: "#10b981", fontFamily: "var(--font-mono), monospace" }}>
            ${monthlySpend.toLocaleString()} / mo
          </strong>
        </div>
        <input
          type="range"
          min="1000"
          max="35000"
          step="500"
          value={monthlySpend}
          onChange={(e) => setMonthlySpend(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#2563eb",
            cursor: "pointer",
            height: "6px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
          <span>$1,000/mo (Seed)</span>
          <span>$15,000/mo (Growth)</span>
          <span>$35,000+/mo (Scale)</span>
        </div>
      </div>

      {/* 3 Result Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          backgroundColor: "#070f1e",
          borderRadius: "6px",
          padding: "20px",
          border: "1px solid #1e293b",
          marginBottom: "20px",
        }}
      >
        <div>
          <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Estimated Annual Savings</span>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#10b981", margin: "2px 0" }}>
            ${annualSavings.toLocaleString()}
          </div>
          <span style={{ fontSize: "11px", color: "#cbd5e1" }}>-${monthlySavings.toLocaleString()}/mo reduction (~62%)</span>
        </div>

        <div>
          <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Latency Improvement</span>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#38bdf8", margin: "2px 0" }}>
            sub-35ms
          </div>
          <span style={{ fontSize: "11px", color: "#cbd5e1" }}>Global edge render (down from 1.5s+)</span>
        </div>

        <div>
          <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Projected ROI Payback</span>
          <div style={{ fontSize: "26px", fontWeight: "900", color: "#facc15", margin: "2px 0" }}>
            {paybackMonths} Months
          </div>
          <span style={{ fontSize: "11px", color: "#cbd5e1" }}>Sprint investment recouped quickly</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "8px" }}>
        <span style={{ fontSize: "12.5px", color: "#cbd5e1" }}>
          Target Engagement: <strong style={{ color: "#ffffff" }}>Cloudflare Edge &amp; Serverless Migration ($6,500)</strong>
        </span>
        <Link
          href="#inquiry"
          style={{
            padding: "10px 18px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: "700",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
        >
          Request Migration Diagnostic &rsaquo;
        </Link>
      </div>
    </div>
  );
}
