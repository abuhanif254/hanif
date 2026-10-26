"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getProjectArchitecture,
  ProjectArchitecture,
  ProjectTopologyNode,
} from "../lib/project-architectures";

interface CaseStudyArchitectureViewerProps {
  projectSlug: string;
  projectTitle: string;
}

export function generateArchitectureBlueprintHtml(arch: ProjectArchitecture): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const docRef = `ARCH-SPEC-2026-${arch.projectSlug.toUpperCase().replace(/[^A-Z0-9]/g, "-")}`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${docRef} - Architecture Blueprint - ${arch.title}</title>
    <style>
      @page {
        margin: 1.5cm 1.4cm;
        size: A4 portrait;
      }
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #0f172a;
        background: #ffffff;
        line-height: 1.55;
        font-size: 12.5px;
        margin: 0;
        padding: 24px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: block;
      }
      .print-toolbar {
        background-color: #0b132b;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 24px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      }
      .print-toolbar-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }
      .btn-print {
        background-color: #2563eb;
        color: #ffffff;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        font-weight: 700;
        font-size: 12.5px;
        cursor: pointer;
      }
      .btn-print:hover {
        background-color: #1d4ed8;
      }
      .btn-close {
        background-color: #334155;
        color: #ffffff;
        border: none;
        padding: 8px 14px;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
      }
      @media print {
        .no-print {
          display: none !important;
        }
        body {
          padding: 0 !important;
        }
        .page-break {
          page-break-before: always;
        }
        .avoid-break {
          page-break-inside: avoid;
        }
        tr {
          page-break-inside: avoid;
        }
      }
      .header-bar {
        border-bottom: 3px solid #0284c7;
        padding-bottom: 16px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .header-bar h1 {
        font-size: 20px;
        color: #0b132b;
        margin: 4px 0 2px 0;
        font-weight: 800;
        letter-spacing: -0.4px;
      }
      .doc-id {
        font-family: monospace;
        font-size: 11.5px;
        color: #0284c7;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .stamp-badge {
        display: inline-block;
        border: 1.5px solid #059669;
        color: #059669;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        padding: 3px 8px;
        border-radius: 4px;
        background-color: #f0fdf4;
      }
      .meta-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 22px;
      }
      .meta-box {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 10px 14px;
      }
      .meta-box-label {
        font-size: 10.5px;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.4px;
      }
      .meta-box-val {
        font-size: 14px;
        font-weight: 800;
        color: #0f172a;
        margin-top: 2px;
      }
      h2 {
        font-size: 14px;
        color: #0b132b;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 6px;
        margin: 22px 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0 18px 0;
        font-size: 11.5px;
      }
      th, td {
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        text-align: left;
      }
      th {
        background-color: #0b132b;
        color: #ffffff;
        font-weight: 700;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      tr:nth-child(even) {
        background-color: #f8fafc;
      }
      .code-pill {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        background-color: #f1f5f9;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        color: #0369a1;
        font-weight: 600;
      }
      .chaos-box {
        background-color: #090e17;
        color: #e2e8f0;
        border-radius: 6px;
        padding: 14px 18px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11px;
        margin: 10px 0 18px 0;
        border-left: 4px solid #ef4444;
      }
      .chaos-log-line {
        line-height: 1.6;
        color: #38bdf8;
      }
      .legal-box {
        background-color: #f8fafc;
        border-left: 3px solid #0284c7;
        padding: 10px 14px;
        margin: 16px 0 20px 0;
        font-size: 11.5px;
        color: #334155;
        border-radius: 0 4px 4px 0;
      }
      .signature-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 28px;
        margin-top: 24px;
        padding-top: 14px;
        page-break-inside: avoid;
      }
      .sig-line {
        border-top: 1px dashed #64748b;
        padding-top: 8px;
        font-size: 11.5px;
        color: #64748b;
      }
      .footer-note {
        margin-top: 26px;
        border-top: 1px solid #e2e8f0;
        padding-top: 10px;
        font-size: 11px;
        color: #94a3b8;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="no-print print-toolbar">
      <div class="print-toolbar-inner">
        <div>
          <strong>Architecture Blueprint Dossier &bull; Ref: ${docRef}</strong>
          <span style="margin-left: 10px; color: #94a3b8; font-size: 12px;">RFC Specification &amp; Failover Runbook</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
          <button type="button" onclick="window.close()" class="btn-close">✕ Close</button>
        </div>
      </div>
    </div>

    <div class="header-bar">
      <div>
        <span class="doc-id">DOC REF: ${docRef}</span>
        <h1>SYSTEMS ARCHITECTURE BLUEPRINT &bull; ${arch.title.toUpperCase()}</h1>
        <p style="margin: 0; color: #475569; font-size: 12.5px;">
          Principal Systems Architecture Specification &bull; Reference Implementation
        </p>
      </div>
      <div style="text-align: right; font-size: 12px; color: #64748b;">
        <span class="stamp-badge">✓ Verified Architecture Specification</span>
        <p style="margin: 6px 0 0 0;"><strong>Date:</strong> ${today}</p>
        <p style="margin: 2px 0 0 0;"><strong>Scope Allocation:</strong> ${arch.scopePrice}</p>
      </div>
    </div>

    <!-- 4 KPI Metrics -->
    <div class="meta-grid">
      <div class="meta-box">
        <div class="meta-box-label">Peak Throughput</div>
        <div class="meta-box-val" style="color: #0284c7;">${arch.peakThroughput}</div>
      </div>
      <div class="meta-box">
        <div class="meta-box-label">P99 Latency SLA</div>
        <div class="meta-box-val" style="color: #059669;">${arch.p99Latency}</div>
      </div>
      <div class="meta-box">
        <div class="meta-box-label">Infrastructure Impact</div>
        <div class="meta-box-val" style="color: #d97706;">${arch.costSavings}</div>
      </div>
      <div class="meta-box">
        <div class="meta-box-label">Disaster Recovery</div>
        <div class="meta-box-val" style="color: #7c3aed;">${arch.failoverScenario.recoveryTimeMs}ms MTTR</div>
      </div>
    </div>

    <p style="margin: 0 0 16px 0; font-size: 12.5px; color: #334155; line-height: 1.6;">
      <strong>Executive Summary:</strong> ${arch.tagline} Designed, benchmarked, and verified by Principal Systems Architect MD Abu Hanif Mia.
    </p>

    <!-- Section 1: 5-Tier Topology -->
    <h2>1. Distributed 5-Tier Topology Specification</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Node / Component</th>
          <th style="width: 26%;">Sub-System Role</th>
          <th style="width: 22%;">Technology Stack</th>
          <th style="width: 15%;">Throughput</th>
          <th style="width: 15%;">Latency Budget</th>
        </tr>
      </thead>
      <tbody>
        ${arch.nodes
          .map(
            (node) => `
          <tr>
            <td><strong>${node.label}</strong></td>
            <td>${node.sub}<br /><span style="font-size: 10.5px; color: #64748b;">${node.rationale}</span></td>
            <td><span class="code-pill">${node.tech}</span></td>
            <td style="font-weight: 700; color: #0284c7;">${node.throughput}</td>
            <td style="font-weight: 700; color: #059669;">${node.latencyBudget}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <!-- Section 2: Dataflow Protocol -->
    <h2>2. High-Throughput Dataflow Sequence Protocol</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">Hop</th>
          <th style="width: 22%;">Direction</th>
          <th style="width: 16%;">Protocol</th>
          <th style="width: 16%;">Payload Format</th>
          <th style="width: 12%;">Latency Budget</th>
          <th style="width: 26%;">Sequence Responsibility</th>
        </tr>
      </thead>
      <tbody>
        ${arch.sequenceSteps
          .map(
            (step) => `
          <tr>
            <td style="text-align: center; font-weight: bold; color: #0284c7;">#${step.stepNumber}</td>
            <td><strong>${step.from}</strong> &rarr; <strong>${step.to}</strong></td>
            <td><span class="code-pill">${step.protocol}</span></td>
            <td>${step.payload}</td>
            <td style="font-weight: 700; color: #059669;">${step.latencyBudget}</td>
            <td>${step.description}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <!-- Section 3: Chaos & Failover Protocol -->
    <div class="avoid-break">
      <h2>3. Chaos Engineering &amp; Disaster Recovery Protocol</h2>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
          <div><strong>Trigger Condition:</strong> ${arch.failoverScenario.triggerName}</div>
          <div><strong>Failed Component:</strong> ${arch.failoverScenario.failedComponent}</div>
          <div><strong>Fallback Route:</strong> ${arch.failoverScenario.fallbackRoute}</div>
          <div><strong>Recovery Mechanism:</strong> ${arch.failoverScenario.recoveryMechanism}</div>
          <div><strong>Verified MTTR:</strong> <span style="color: #059669; font-weight: 800;">${arch.failoverScenario.recoveryTimeMs}ms MTTR</span></div>
          <div><strong>Data Loss Risk:</strong> <span style="color: #0284c7; font-weight: 800;">${arch.failoverScenario.dataLossRisk}</span></div>
        </div>
      </div>

      <div class="chaos-box">
        <div style="color: #94a3b8; margin-bottom: 6px; font-weight: bold;">// Verified Failover Trace Execution Logs:</div>
        ${arch.failoverScenario.recoveryLogs
          .map((log) => `<div class="chaos-log-line">&gt; ${log}</div>`)
          .join("")}
      </div>
    </div>

    <!-- Section 4: Architecture Trade-Offs (ADR) -->
    <div class="avoid-break">
      <h2>4. Architecture Decision Records (ADR) &amp; Trade-off Matrix</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 16%;">Layer</th>
            <th style="width: 18%;">Chosen Technology</th>
            <th style="width: 18%;">Rejected Alternative</th>
            <th style="width: 28%;">Architectural Justification</th>
            <th style="width: 20%;">Benchmark Advantage</th>
          </tr>
        </thead>
        <tbody>
          ${(arch.techTradeoffs || [])
            .map(
              (item) => `
            <tr>
              <td><strong>${item.layer}</strong></td>
              <td style="color: #065f46; font-weight: 700; background-color: #f0fdf4;">✓ ${item.chosenTech}</td>
              <td style="color: #991b1b; text-decoration: line-through; background-color: #fef2f2;">${item.rejectedAlternative}</td>
              <td>${item.whyChosen}</td>
              <td style="color: #0369a1; font-weight: 600;">${item.benchmarkAdvantage}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Section 5: Handover Terms & Verification -->
    <div class="avoid-break">
      <h2>5. Commercial Certification &amp; IP Handover</h2>
      <div class="legal-box">
        <p style="margin: 0 0 4px 0;"><strong>1. 100% Client Intellectual Property:</strong> All topology diagrams, RFC documents, IaC Terraform/Pulumi manifests, and deployment runbooks are transferred to Client ownership upon milestone completion.</p>
        <p style="margin: 0 0 4px 0;"><strong>2. 30-Day Production Bug Warranty:</strong> Abu Hanif warrants zero performance regressions against agreed latency and throughput SLAs for 30 consecutive calendar days.</p>
        <p style="margin: 0;"><strong>3. Direct Principal Execution:</strong> Engineered and reviewed directly by MD Abu Hanif Mia. Zero junior delegation.</p>
      </div>

      <div class="signature-grid">
        <div>
          <div class="stamp-badge">✓ Verified Principal Architect</div>
          <p style="margin: 6px 0 2px 0; font-weight: bold; font-size: 13px;">MD Abu Hanif Mia</p>
          <p style="margin: 0 0 22px 0; font-size: 11.5px; color: #64748b;">Staff Software Engineer &amp; Systems Architect &bull; Batch-12 WEB12-3991</p>
          <div class="sig-line">
            <span>Authorized Signature &bull; Date: ${today}</span>
          </div>
        </div>
        <div>
          <div style="height: 22px;"></div>
          <p style="margin: 6px 0 2px 0; font-weight: bold; font-size: 13px;">Enterprise Technical Acceptance</p>
          <p style="margin: 0 0 22px 0; font-size: 11.5px; color: #64748b;">VP Engineering / Principal Architect Sponsor</p>
          <div class="sig-line">
            <span>Client Acceptance Signature &bull; Date</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-note">
      Generated via Abu Hanif Systems Architecture Blueprint Engine &bull; https://abuhanifmia.com/projects/${arch.projectSlug} &bull; abuhanifmain@gmail.com
    </div>

    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 250);
      };
    </script>
  </body>
</html>`;
}

export default function CaseStudyArchitectureViewer({
  projectSlug,
  projectTitle,
}: CaseStudyArchitectureViewerProps) {
  const architecture: ProjectArchitecture | null = getProjectArchitecture(projectSlug);

  // Fallback to default if slug not directly mapped
  const arch =
    architecture ||
    getProjectArchitecture("financial-telemetry-pipeline")!;

  const [activeTab, setActiveTab] = useState<"topology" | "dataflow" | "chaos" | "tradeoffs">("topology");
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingDataflow, setIsPlayingDataflow] = useState<boolean>(false);
  const [chaosState, setChaosState] = useState<"idle" | "running" | "recovered">("idle");
  const [visibleLogCount, setVisibleLogCount] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const selectedNode: ProjectTopologyNode = arch.nodes[selectedNodeIndex] || arch.nodes[0];
  const currentStep = arch.sequenceSteps[currentStepIndex] || arch.sequenceSteps[0];

  // Auto-play dataflow animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingDataflow) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % arch.sequenceSteps.length);
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlayingDataflow, arch.sequenceSteps.length]);

  // Chaos simulation sequence
  function triggerChaosSimulation() {
    setChaosState("running");
    setVisibleLogCount(1);

    const logs = arch.failoverScenario.recoveryLogs;
    logs.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleLogCount(idx + 1);
        if (idx === logs.length - 1) {
          setChaosState("recovered");
        }
      }, (idx + 1) * 320);
    });
  }

  function handleCopyCode(code: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2400);
    }
  }

  function handlePrintBlueprint() {
    if (typeof window === "undefined") return;
    const printWindow = window.open("", "_blank", "width=960,height=1000");
    if (!printWindow) return;
    const html = generateArchitectureBlueprintHtml(arch);
    printWindow.document.write(html);
    printWindow.document.close();
  }

  return (
    <div
      id="architecture-viewer"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 20px -2px rgba(11, 19, 43, 0.08)",
        margin: "28px 0 36px 0",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: "#0b132b",
          color: "#ffffff",
          padding: "20px 24px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-block",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 8px #10b981",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: "#6ee7b7",
              }}
            >
              Interactive Production Architecture
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                backgroundColor: "rgba(59, 130, 246, 0.18)",
                color: "#93c5fd",
                border: "1px solid rgba(59, 130, 246, 0.35)",
                padding: "3px 10px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {arch.scopePrice}
            </span>
            <span
              style={{
                fontSize: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.18)",
                color: "#a7f3d0",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                padding: "3px 10px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {arch.resiliencyGrade}
            </span>
            <button
              type="button"
              onClick={handlePrintBlueprint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "#1e293b",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                padding: "4px 10px",
                borderRadius: "5px",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="Export high-resolution architecture blueprint & RFC dossier (PDF / Print)"
            >
              🖨️ Export Blueprint (PDF)
            </button>
          </div>
        </div>

        <h3
          style={{
            margin: "0 0 6px 0",
            fontSize: "20px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.3px",
          }}
        >
          {arch.title}
        </h3>
        <p style={{ margin: "0 0 16px 0", fontSize: "13.5px", color: "#94a3b8", lineHeight: "1.5" }}>
          {arch.tagline}
        </p>

        {/* 4 Metric Badges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "10px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
              Peak Throughput
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#38bdf8", marginTop: "2px" }}>
              {arch.peakThroughput}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
              P99 Latency SLA
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#34d399", marginTop: "2px" }}>
              {arch.p99Latency}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
              Infrastructure Impact
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fbbf24", marginTop: "2px" }}>
              {arch.costSavings}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
              Failover MTTR
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#a78bfa", marginTop: "2px" }}>
              {arch.failoverScenario.recoveryTimeMs}ms MTTR
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#f1f5f9",
          borderBottom: "1px solid #cbd5e1",
          overflowX: "auto",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("topology")}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            borderBottom: activeTab === "topology" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "topology" ? "#ffffff" : "transparent",
            color: activeTab === "topology" ? "#1e293b" : "#64748b",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          1. Topology &amp; Nodes ({arch.nodes.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dataflow")}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            borderBottom: activeTab === "dataflow" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "dataflow" ? "#ffffff" : "transparent",
            color: activeTab === "dataflow" ? "#1e293b" : "#64748b",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          2. Live Dataflow Tracer ({arch.sequenceSteps.length} Hops)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("chaos")}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            borderBottom: activeTab === "chaos" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "chaos" ? "#ffffff" : "transparent",
            color: activeTab === "chaos" ? "#1e293b" : "#64748b",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          3. Chaos Failover Simulator
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tradeoffs")}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            borderBottom: activeTab === "tradeoffs" ? "3px solid #2563eb" : "3px solid transparent",
            backgroundColor: activeTab === "tradeoffs" ? "#ffffff" : "transparent",
            color: activeTab === "tradeoffs" ? "#1e293b" : "#64748b",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
        >
          4. Tech Trade-off Matrix ({arch.techTradeoffs.length})
        </button>
      </div>

      {/* Tab Body */}
      <div style={{ padding: "24px" }}>
        {/* TAB 1: TOPOLOGY & NODES */}
        {activeTab === "topology" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                Click Any Node to Inspect Specifications, Failover Logic &amp; Production Code:
              </span>
            </div>

            {/* Visual Node Chain */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              {arch.nodes.map((node, idx) => {
                const isSelected = idx === selectedNodeIndex;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeIndex(idx)}
                    style={{
                      padding: "12px 10px",
                      borderRadius: "6px",
                      textAlign: "left",
                      cursor: "pointer",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      backgroundColor: isSelected ? "#eff6ff" : "#f8fafc",
                      boxShadow: isSelected ? "0 4px 12px rgba(37, 99, 235, 0.15)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          color: isSelected ? "#1d4ed8" : "#64748b",
                        }}
                      >
                        Hop #{idx + 1}
                      </span>
                      {isSelected && (
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#2563eb",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: isSelected ? "#1e3a8a" : "#0f172a",
                        lineHeight: "1.3",
                      }}
                    >
                      {node.label}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        marginTop: "2px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {node.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Deep-Dive Card */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "14px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: "#dbeafe",
                        color: "#1e40af",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Hop {selectedNodeIndex + 1} of {arch.nodes.length}
                    </span>
                    <h4 style={{ margin: 0, fontSize: "17px", color: "#0f172a", fontWeight: 700 }}>
                      {selectedNode.label}
                    </h4>
                  </div>
                  <div style={{ fontSize: "13px", color: "#475569", marginTop: "3px" }}>
                    Technology: <strong>{selectedNode.tech}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      backgroundColor: "#f0fdf4",
                      color: "#166534",
                      border: "1px solid #bbf7d0",
                      padding: "4px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    ⚡ {selectedNode.throughput}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      border: "1px solid #fde68a",
                      padding: "4px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    ⏱ Budget: {selectedNode.latencyBudget}
                  </span>
                </div>
              </div>

              {/* Two Column Specifications */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#2563eb",
                      marginBottom: "6px",
                    }}
                  >
                    Architectural Rationale
                  </div>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: "1.6" }}>
                    {selectedNode.rationale}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#059669",
                      marginBottom: "6px",
                    }}
                  >
                    Resilience &amp; Failover Mechanism
                  </div>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: "1.6" }}>
                    {selectedNode.resiliency}
                  </p>
                </div>
              </div>

              {/* Production Blueprint / Code Snippet */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                    Production Blueprint ({selectedNode.codeSnippetLang.toUpperCase()}):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedNode.codeSnippet)}
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 600,
                      padding: "4px 10px",
                      backgroundColor: copiedCode ? "#059669" : "#0f172a",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    {copiedCode ? "✓ Copied to Clipboard" : "Copy Code Blueprint"}
                  </button>
                </div>

                <pre
                  style={{
                    margin: 0,
                    padding: "14px 16px",
                    backgroundColor: "#0b132b",
                    color: "#e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    lineHeight: "1.6",
                    overflowX: "auto",
                    border: "1px solid #1e293b",
                  }}
                >
                  <code>{selectedNode.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE DATAFLOW TRACER */}
        {activeTab === "dataflow" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div>
                <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                  Event Sequence Flow:
                </span>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                  Hop {currentStep.stepNumber} of {arch.sequenceSteps.length}: {currentStep.from} ➔ {currentStep.to}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsPlayingDataflow(!isPlayingDataflow)}
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "7px 14px",
                    backgroundColor: isPlayingDataflow ? "#ef4444" : "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {isPlayingDataflow ? "⏸ Pause Dataflow" : "▶ Auto-Trace Event Stream"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentStepIndex((prev) => (prev + 1) % arch.sequenceSteps.length)
                  }
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "7px 12px",
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    border: "1px solid #cbd5e1",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Next Hop ➔
                </button>
              </div>
            </div>

            {/* Step Progress Track */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "20px",
              }}
            >
              {arch.sequenceSteps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <button
                    key={step.stepNumber}
                    type="button"
                    onClick={() => setCurrentStepIndex(idx)}
                    style={{
                      flex: 1,
                      height: "8px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: isActive ? "#2563eb" : isPassed ? "#93c5fd" : "#e2e8f0",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    title={`Hop ${idx + 1}: ${step.from} -> ${step.to}`}
                  />
                );
              })}
            </div>

            {/* Current Hop Detail Card */}
            <div
              style={{
                backgroundColor: "#0b132b",
                color: "#ffffff",
                padding: "20px 24px",
                borderRadius: "8px",
                border: "1px solid #1e293b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: "#3b82f6",
                      color: "#ffffff",
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Hop #{currentStep.stepNumber}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc" }}>
                    {currentStep.from} ➔ {currentStep.to}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: "rgba(52, 211, 153, 0.15)",
                      color: "#34d399",
                      border: "1px solid rgba(52, 211, 153, 0.3)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}
                  >
                    Protocol: {currentStep.protocol}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: "rgba(251, 191, 36, 0.15)",
                      color: "#fbbf24",
                      border: "1px solid rgba(251, 191, 36, 0.3)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}
                  >
                    Latency: {currentStep.latencyBudget}
                  </span>
                </div>
              </div>

              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6" }}>
                {currentStep.description}
              </p>

              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#94a3b8",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  In-Flight Transmission Payload / Wire Frame:
                </span>
                <pre
                  style={{
                    margin: 0,
                    padding: "12px 14px",
                    backgroundColor: "#030712",
                    color: "#a7f3d0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontFamily: "ui-monospace, monospace",
                    lineHeight: "1.5",
                    overflowX: "auto",
                    border: "1px solid #1f2937",
                  }}
                >
                  <code>{currentStep.payload}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHAOS FAILOVER SIMULATOR */}
        {activeTab === "chaos" && (
          <div>
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "16px 20px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>⚠️</span>
                  <h4 style={{ margin: 0, fontSize: "15px", color: "#991b1b", fontWeight: 700 }}>
                    Chaos Scenario: {arch.failoverScenario.title}
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 700,
                    backgroundColor: "#fee2e2",
                    color: "#b91c1c",
                    padding: "3px 8px",
                    borderRadius: "4px",
                  }}
                >
                  Target: {arch.failoverScenario.failedComponent}
                </span>
              </div>

              <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#7f1d1d", lineHeight: "1.5" }}>
                <strong>Automated Recovery Route:</strong> {arch.failoverScenario.fallbackRoute}
                <br />
                <strong>Disaster Mechanism:</strong> {arch.failoverScenario.recoveryMechanism}
              </p>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={triggerChaosSimulation}
                  disabled={chaosState === "running"}
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    padding: "8px 16px",
                    backgroundColor: chaosState === "running" ? "#9ca3af" : "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: chaosState === "running" ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 6px rgba(220, 38, 38, 0.25)",
                  }}
                >
                  {chaosState === "running"
                    ? "Executing Live Chaos Test..."
                    : chaosState === "recovered"
                    ? "✓ Test Completed (Run Again)"
                    : "🔥 Trigger Simulated Disaster Failover"}
                </button>

                {chaosState === "recovered" && (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#166534",
                      backgroundColor: "#dcfce7",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    ✓ Recovered in {arch.failoverScenario.recoveryTimeMs}ms (Zero Data Loss)
                  </span>
                )}
              </div>
            </div>

            {/* Live Terminal Log Stream */}
            <div
              style={{
                backgroundColor: "#030712",
                color: "#e2e8f0",
                borderRadius: "8px",
                border: "1px solid #1f2937",
                padding: "16px 20px",
                fontFamily: "ui-monospace, monospace",
                fontSize: "12px",
                lineHeight: "1.7",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                  borderBottom: "1px solid #1f2937",
                  fontSize: "11px",
                  color: "#6b7280",
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                <span style={{ marginLeft: "8px" }}>terminal@production-cluster: /var/log/failover</span>
              </div>

              {visibleLogCount === 0 ? (
                <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                  Cluster operating at nominal state. Click &ldquo;Trigger Simulated Disaster Failover&rdquo; above to run empirical MTTR resilience verification.
                </div>
              ) : (
                <div>
                  {arch.failoverScenario.recoveryLogs.slice(0, visibleLogCount).map((log, idx) => {
                    const isError = log.includes("CRIT") || log.includes("WARN");
                    const isPass = log.includes("PASS");
                    return (
                      <div
                        key={idx}
                        style={{
                          color: isPass ? "#34d399" : isError ? "#f87171" : "#93c5fd",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {log}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TECH TRADE-OFFS MATRIX */}
        {activeTab === "tradeoffs" && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                Architectural Decision Records (ADRs) &amp; Empirical Benchmark Trade-Offs:
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#0b132b", color: "#ffffff" }}>
                    <th style={{ padding: "10px 14px", border: "1px solid #1e293b" }}>Layer</th>
                    <th style={{ padding: "10px 14px", border: "1px solid #1e293b", color: "#6ee7b7" }}>
                      Chosen Technology
                    </th>
                    <th style={{ padding: "10px 14px", border: "1px solid #1e293b", color: "#fca5a5" }}>
                      Rejected Alternative
                    </th>
                    <th style={{ padding: "10px 14px", border: "1px solid #1e293b" }}>Why Chosen</th>
                    <th style={{ padding: "10px 14px", border: "1px solid #1e293b", color: "#38bdf8" }}>
                      Benchmark Advantage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {arch.techTradeoffs.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <td style={{ padding: "12px 14px", border: "1px solid #e2e8f0", fontWeight: 700 }}>
                        {item.layer}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          border: "1px solid #e2e8f0",
                          color: "#065f46",
                          fontWeight: 600,
                          backgroundColor: "#f0fdf4",
                        }}
                      >
                        ✓ {item.chosenTech}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          border: "1px solid #e2e8f0",
                          color: "#991b1b",
                          textDecoration: "line-through",
                          backgroundColor: "#fef2f2",
                        }}
                      >
                        {item.rejectedAlternative}
                      </td>
                      <td style={{ padding: "12px 14px", border: "1px solid #e2e8f0", color: "#334155" }}>
                        {item.whyChosen}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          border: "1px solid #e2e8f0",
                          color: "#0369a1",
                          fontWeight: 600,
                        }}
                      >
                        {item.benchmarkAdvantage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Direct Scoping Callout Footer */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
            Need this architecture engineered, audited, or tuned?
          </div>
          <div style={{ fontSize: "12.5px", color: "#64748b" }}>
            Available for fixed-price milestones with guaranteed 30-day production warranty &bull; 100% Client IP handover.
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handlePrintBlueprint}
            style={{
              fontSize: "12.5px",
              fontWeight: 700,
              padding: "8px 14px",
              backgroundColor: "#0b132b",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            title="Download printable architecture dossier with full topology and failover protocols"
          >
            🖨️ Export Blueprint (PDF)
          </button>

          <Link
            href={`/pricing#sow-builder`}
            style={{
              fontSize: "12.5px",
              fontWeight: 700,
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "background-color 0.15s ease",
            }}
          >
            Configure SOW Proposal ({arch.scopePrice}) ›
          </Link>

          <Link
            href="/pricing#inquiry"
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              padding: "8px 14px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Schedule Discovery Call
          </Link>
        </div>
      </div>
    </div>
  );
}
