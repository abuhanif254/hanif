"use client";

import React, { useState } from "react";
import { initialServices, ServicePricing } from "../data/portfolio-data";

export interface AddonOption {
  id: string;
  category: "data" | "security" | "edge" | "warranty";
  name: string;
  price: number;
  timelineDays: number;
  description: string;
}

export const availableAddons: AddonOption[] = [
  {
    id: "migration",
    category: "data",
    name: "Zero-Downtime Live Data Migration & CDC",
    price: 3500,
    timelineDays: 5,
    description: "Safe schema extraction, ETL transformation, and replication cutover with zero downtime.",
  },
  {
    id: "backup_failover",
    category: "data",
    name: "Automated Failover & Point-in-Time Recovery",
    price: 1800,
    timelineDays: 3,
    description: "Continuous WAL archiving, automated read replica promotion, and drill-tested recovery plans.",
  },
  {
    id: "security_rls",
    category: "security",
    name: "Row-Level Security (RLS) & Access Audit",
    price: 2800,
    timelineDays: 4,
    description: "Granular Supabase/Postgres RLS policies, audit logging, and vulnerability remediation.",
  },
  {
    id: "zero_trust_auth",
    category: "security",
    name: "Zero-Trust Distributed RBAC & Session Revocation",
    price: 2200,
    timelineDays: 3,
    description: "HMAC-signed session tokens, cryptographic passkey verification, and instant token blacklisting.",
  },
  {
    id: "cloudflare_edge",
    category: "edge",
    name: "Cloudflare Worker V8 Isolate Micro-Caching",
    price: 2500,
    timelineDays: 4,
    description: "Edge key-value caching, geo-distributed routing, and static asset pre-warming for sub-20ms TTFB.",
  },
  {
    id: "load_testing",
    category: "edge",
    name: "Automated k6 Load Testing & SLA Certification",
    price: 2400,
    timelineDays: 3,
    description: "Synthetic load generation simulating 10,000 concurrent VUs with automated P99 regression gates.",
  },
  {
    id: "ai_rag",
    category: "warranty",
    name: "Enterprise pgvector AI & Hybrid Semantic Search",
    price: 4200,
    timelineDays: 6,
    description: "Embeddings pipeline, HNSW vector indexing, hybrid keyword search, and streaming completions.",
  },
  {
    id: "extended_warranty",
    category: "warranty",
    name: "Extended 60-Day Emergency SLA Warranty",
    price: 1800,
    timelineDays: 0,
    description: "Doubles standard 30-day warranty with guaranteed 2-hour emergency escalation response.",
  },
];

export function calculateSowBreakdown(
  service: ServicePricing,
  selectedAddonIds: string[]
) {
  const basePriceNum =
    parseInt(service.priceDisplay.replace(/[^0-9]/g, ""), 10) || 0;
  const chosenAddons = availableAddons.filter((a) =>
    selectedAddonIds.includes(a.id)
  );
  const addonsTotal = chosenAddons.reduce((acc, a) => acc + a.price, 0);
  const totalInvestment = basePriceNum + addonsTotal;

  // Milestone breakdown: 25% kickoff, 50% core implementation, 25% production signoff
  const milestone1 = Math.round(totalInvestment * 0.25);
  const milestone2 = Math.round(totalInvestment * 0.5);
  const milestone3 = totalInvestment - milestone1 - milestone2;

  return {
    basePriceNum,
    chosenAddons,
    addonsTotal,
    totalInvestment,
    milestones: [
      {
        number: "01",
        name: "Discovery, RFC Spec & Architecture Blueprint",
        percentage: 25,
        amount: milestone1,
        deliverables: "Technical specification document, schema definitions, CI/CD pipeline setup.",
      },
      {
        number: "02",
        name: "Core Systems Implementation & Optimization",
        percentage: 50,
        amount: milestone2,
        deliverables: "Production codebase execution, automated test coverage, and benchmark verification.",
      },
      {
        number: "03",
        name: "Staging Acceptance, Production Cutover & Warranty",
        percentage: 25,
        amount: milestone3,
        deliverables: "Final DNS cutover, 100% git/documentation handover, and 30-day bug warranty inception.",
      },
    ],
  };
}

export default function StatementOfWorkGenerator() {
  const [selectedServiceSlug, setSelectedServiceSlug] =
    useState<string>("database-optimization");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    "security_rls",
  ]);
  const [clientCompany, setClientCompany] = useState<string>("");
  const [clientContact, setClientContact] = useState<string>("");
  const [targetStartDate, setTargetStartDate] = useState<string>("Within 7 Days");
  const [activeTab, setActiveTab] = useState<"configurator" | "preview">(
    "configurator"
  );
  const [copied, setCopied] = useState<boolean>(false);

  const selectedService: ServicePricing =
    initialServices.find((s) => s.slug === selectedServiceSlug) ||
    initialServices[0];

  const breakdown = calculateSowBreakdown(selectedService, selectedAddons);
  const documentId = `SOW-2026-${selectedService.slug.toUpperCase().slice(0, 4)}-${Math.abs(selectedService.slug.length * 317 + breakdown.totalInvestment).toString().slice(-4)}`;

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function generateSowMarkdown(): string {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `
# STATEMENT OF WORK (SOW) & ARCHITECTURE PROPOSAL
**Document Reference:** ${documentId}  
**Date:** ${today}  
**Target Commencement:** ${targetStartDate}  

---

## PARTIES & ROLES
- **Client Organization:** ${clientCompany || "Client Organization"}  
- **Technical Sponsor / Contact:** ${clientContact || "Engineering Leadership"}  
- **Principal Systems Architect:** MD Abu Hanif Mia (Staff Software Engineer & Systems Architect)  
  *Credentials: B.Sc. in Computer Science & Engineering • Programming Hero Batch-12 (WEB12-3991)*  
  *Contact: abuhanifmain@gmail.com • https://abuhanifmia.com*  

---

## 1. SCOPE OF ENGAGEMENT
- **Core Package:** ${selectedService.title} (${selectedService.pricingType.toUpperCase()})  
- **Base Milestone Timeline:** ${selectedService.timeline}  
- **Base Investment:** ${selectedService.priceDisplay}  

### Core Technical Deliverables:
${selectedService.deliverables.map((d) => `- ${d}`).join("\n")}

${
  breakdown.chosenAddons.length > 0
    ? `### Selected Architectural Add-On Modules:
${breakdown.chosenAddons.map((a) => `- **${a.name}** (+$${a.price.toLocaleString()}): ${a.description}`).join("\n")}
`
    : ""
}

---

## 2. MILESTONE INVESTMENT SCHEDULE
| Milestone | Scope Description | Share (%) | Investment |
|:---|:---|:---:|:---|
${breakdown.milestones
  .map(
    (m) =>
      `| M${m.number}: ${m.name} | ${m.deliverables} | ${m.percentage}% | $${m.amount.toLocaleString()} USD |`
  )
  .join("\n")}
| **TOTAL FIXED INVESTMENT** | **Guaranteed fixed-bid pricing with zero budget creep** | **100%** | **$${breakdown.totalInvestment.toLocaleString()} USD** |

---

## 3. INTELLECTUAL PROPERTY & OPERATIONAL TERMS
1. **100% Client Intellectual Property**: All commit histories, architecture blueprints, database schemas, codebases, and credentials belong exclusively to the Client upon milestone settlement.
2. **Mutual Non-Disclosure & Confidentiality**: All shared proprietary data, schemas, trade secrets, and access tokens are strictly guarded under standard mutual NDA provisions.
3. **30-Day Production Bug Warranty**: Full bug remediation and performance SLA guarantees are provided for 30 consecutive calendar days post-deployment at zero additional billing.
4. **Direct Execution**: 100% of the engineering work is performed directly by Staff Engineer Abu Hanif. Zero junior developer hand-offs.

---
*Authorized Proposal &bull; Generated via Abu Hanif Systems Architecture SOW Engine (https://abuhanifmia.com/pricing)*
`.trim();
  }

  function handleDownloadSow() {
    if (typeof window === "undefined") return;
    const markdown = generateSowMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentId}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleCopySow() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generateSowMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  function handlePrintSow() {
    if (typeof window === "undefined") return;
    const printWindow = window.open("", "_blank", "width=880,height=1000");
    if (!printWindow) return;

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentId} - Statement of Work - ${selectedService.title}</title>
          <meta charset="utf-8" />
          <style>
            @page { margin: 1.8cm 1.6cm; size: A4; }
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              line-height: 1.5;
              font-size: 13px;
              margin: 0;
              padding: 24px;
            }
            .header-bar {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .header-bar h1 {
              font-size: 22px;
              color: #0b132b;
              margin: 0 0 4px 0;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .doc-id {
              font-family: monospace;
              font-size: 12px;
              color: #2563eb;
              font-weight: 700;
            }
            .parties-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 16px;
              margin-bottom: 24px;
            }
            .party-box h4 {
              margin: 0 0 6px 0;
              font-size: 11px;
              text-transform: uppercase;
              color: #64748b;
              letter-spacing: 0.5px;
            }
            .party-box p {
              margin: 2px 0;
              font-size: 13px;
            }
            h2 {
              font-size: 15px;
              color: #0b132b;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 6px;
              margin: 24px 0 12px 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            ul {
              margin: 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 6px;
              font-size: 12.5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 9px 12px;
              text-align: left;
            }
            th {
              background-color: #0b132b;
              color: #ffffff;
              font-weight: 700;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .total-row {
              background-color: #ecfdf5 !important;
              font-weight: 800;
              color: #065f46;
              font-size: 13.5px;
            }
            .legal-box {
              background-color: #f8fafc;
              border-left: 3px solid #2563eb;
              padding: 12px 16px;
              margin: 20px 0;
              font-size: 12px;
              color: #334155;
            }
            .signature-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
              margin-top: 36px;
              padding-top: 16px;
              page-break-inside: avoid;
            }
            .sig-line {
              border-top: 1px dashed #64748b;
              padding-top: 8px;
              font-size: 12px;
            }
            .sig-stamp {
              display: inline-block;
              border: 2px solid #059669;
              color: #059669;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              padding: 2px 8px;
              border-radius: 4px;
              margin-bottom: 8px;
            }
            .footer-note {
              margin-top: 32px;
              border-top: 1px solid #e2e8f0;
              padding-top: 10px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <span class="doc-id">DOC REF: ${documentId}</span>
              <h1>ENGINEERING STATEMENT OF WORK (SOW)</h1>
              <p style="margin: 0; color: #475569; font-size: 13px;">Fixed-Price Milestone Architecture Agreement</p>
            </div>
            <div style="text-align: right; font-size: 12px; color: #64748b;">
              <p style="margin: 0;"><strong>Date:</strong> ${today}</p>
              <p style="margin: 2px 0 0 0;"><strong>Target Kickoff:</strong> ${targetStartDate}</p>
            </div>
          </div>

          <div class="parties-grid">
            <div class="party-box">
              <h4>Client Organization (Party A)</h4>
              <p><strong>Organization:</strong> ${clientCompany || "Client Organization"}</p>
              <p><strong>Technical Sponsor:</strong> ${clientContact || "Engineering Leadership"}</p>
              <p><strong>Jurisdiction:</strong> Standard Commercial</p>
            </div>
            <div class="party-box">
              <h4>Principal Systems Architect (Party B)</h4>
              <p><strong>Engineer:</strong> MD Abu Hanif Mia</p>
              <p><strong>Credentials:</strong> B.Sc. in CSE • Batch-12 PH Honor (WEB12-3991)</p>
              <p><strong>Direct Email:</strong> abuhanifmain@gmail.com</p>
            </div>
          </div>

          <h2>1. Engagement Scope: ${selectedService.title}</h2>
          <p style="margin: 0 0 8px 0; font-size: 13px;">
            <strong>Engagement Model:</strong> ${selectedService.pricingType.toUpperCase()} Milestone Sprint &bull;
            <strong>Delivery Timeline:</strong> ${selectedService.timeline}
          </p>
          <p style="margin: 0 0 10px 0; font-size: 12.5px; color: #334155;">${selectedService.description}</p>

          <h3 style="font-size: 13px; color: #0b132b; margin: 12px 0 6px 0;">Contract Deliverables Breakdown:</h3>
          <ul>
            ${selectedService.deliverables.map((d) => `<li>${d}</li>`).join("")}
          </ul>

          ${
            breakdown.chosenAddons.length > 0
              ? `
            <h3 style="font-size: 13px; color: #0b132b; margin: 16px 0 6px 0;">Integrated Architectural Add-On Modules:</h3>
            <ul>
              ${breakdown.chosenAddons
                .map(
                  (a) =>
                    `<li><strong>${a.name} (+$${a.price.toLocaleString()} USD):</strong> ${a.description}</li>`
                )
                .join("")}
            </ul>
          `
              : ""
          }

          <h2>2. Milestone Delivery &amp; Investment Schedule</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Milestone</th>
                <th style="width: 55%;">Engineering Deliverables</th>
                <th style="width: 15%; text-align: center;">Allocation</th>
                <th style="width: 15%; text-align: right;">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              ${breakdown.milestones
                .map(
                  (m) => `
                <tr>
                  <td><strong>M${m.number}</strong></td>
                  <td><strong>${m.name}</strong><br /><span style="color: #64748b; font-size: 11px;">${m.deliverables}</span></td>
                  <td style="text-align: center;">${m.percentage}%</td>
                  <td style="text-align: right; font-weight: bold;">$${m.amount.toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
              <tr class="total-row">
                <td colspan="2">TOTAL FIXED SOW INVESTMENT</td>
                <td style="text-align: center;">100%</td>
                <td style="text-align: right;">$${breakdown.totalInvestment.toLocaleString()} USD</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Intellectual Property, Warranty &amp; SLA Terms</h2>
          <div class="legal-box">
            <p style="margin: 0 0 6px 0;"><strong>1. 100% Client IP Ownership:</strong> Upon settlement of final milestone invoice, all git histories, pull requests, architectures, schemas, and deployed codebases become the sole and exclusive intellectual property of the Client.</p>
            <p style="margin: 0 0 6px 0;"><strong>2. 30-Day Production Bug Warranty:</strong> Abu Hanif warrants the codebase for 30 consecutive calendar days against regressions or SLA deviations with zero additional charge.</p>
            <p style="margin: 0 0 6px 0;"><strong>3. Mutual NDA &amp; Confidentiality:</strong> All technical schemas, database tokens, proprietary logic, and business requirements remain strictly confidential under mutual non-disclosure obligations.</p>
            <p style="margin: 0;"><strong>4. Direct Execution:</strong> 100% of architectural and code tasks are delivered directly by Abu Hanif with no offshore junior delegation.</p>
          </div>

          <div class="signature-grid">
            <div>
              <div class="sig-stamp">✓ Verified Principal Architect</div>
              <p style="margin: 0 0 4px 0; font-weight: bold;">MD Abu Hanif Mia</p>
              <p style="margin: 0 0 24px 0; font-size: 11.5px; color: #64748b;">Staff Software Engineer &amp; Systems Architect</p>
              <div class="sig-line">
                <span>Authorized Signature &bull; Date: ${today}</span>
              </div>
            </div>
            <div>
              <div style="height: 24px;"></div>
              <p style="margin: 0 0 4px 0; font-weight: bold;">${clientContact || "Client Technical Sponsor"}</p>
              <p style="margin: 0 0 24px 0; font-size: 11.5px; color: #64748b;">${clientCompany || "Client Organization"}</p>
              <div class="sig-line">
                <span>Client Acceptance Signature &bull; Date</span>
              </div>
            </div>
          </div>

          <div class="footer-note">
            Generated via Abu Hanif Systems Architecture SOW Engine &bull; https://abuhanifmia.com/pricing &bull; abuhanifmain@gmail.com
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function handlePrefillInquiry() {
    const sowMessage = `Hi Abu Hanif,\n\nI configured an official Statement of Work (Ref: ${documentId}) for the "${selectedService.title}" package with a total estimated investment of $${breakdown.totalInvestment.toLocaleString()} USD (${selectedService.timeline}).\n\nSelected Add-ons:\n${breakdown.chosenAddons.length > 0 ? breakdown.chosenAddons.map((a) => `- ${a.name} ($${a.price})`).join("\n") : "None"}\n\nClient Organization: ${clientCompany || "Not specified"}\nTechnical Contact: ${clientContact || "Not specified"}\nTarget Start: ${targetStartDate}\n\nPlease confirm availability for our technical kickoff discovery call.`;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("sow-prefill-inquiry", {
          detail: {
            projectType: selectedService.title,
            budgetRange: `$${breakdown.totalInvestment.toLocaleString()} USD`,
            message: sowMessage,
          },
        })
      );
      const el = document.getElementById("inquiry");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  return (
    <div
      id="sow-builder"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(11, 25, 44, 0.08)",
        margin: "32px 0 44px 0",
      }}
    >
      {/* Top Command Header Bar */}
      <div
        style={{
          backgroundColor: "#0b132b",
          borderBottom: "1px solid #1e293b",
          color: "#ffffff",
          padding: "20px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                backgroundColor: "#111e38",
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px solid #1e293b",
              }}
            >
              Enterprise SOW Engine
            </span>
            <span style={{ fontSize: "11.5px", color: "#10b981", fontWeight: "700" }}>
              ● Ref: {documentId}
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: "21px", color: "#ffffff", fontWeight: "800", letterSpacing: "-0.3px" }}>
            Interactive Statement of Work &amp; Milestone Budget Engine
          </h3>
        </div>

        {/* View Mode Switcher */}
        <div
          style={{
            display: "inline-flex",
            backgroundColor: "#060b19",
            padding: "4px",
            borderRadius: "6px",
            border: "1px solid #1e293b",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("configurator")}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "none",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
              backgroundColor: activeTab === "configurator" ? "#2563eb" : "transparent",
              color: activeTab === "configurator" ? "#ffffff" : "#94a3b8",
            }}
          >
            ⚙️ Scope Configurator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "none",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
              backgroundColor: activeTab === "preview" ? "#2563eb" : "transparent",
              color: activeTab === "preview" ? "#ffffff" : "#94a3b8",
            }}
          >
            📄 Live Contract Preview
          </button>
        </div>
      </div>

      {activeTab === "configurator" ? (
        <div style={{ padding: "28px" }}>
          {/* Step 1: Core Service Package Grid */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <label style={{ fontSize: "13.5px", fontWeight: "800", color: "#0f172a" }}>
                1. Select Core Technical Engagement:
              </label>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Fixed-scope sprint deliverables
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
              {initialServices.map((serv) => {
                const isSelected = selectedServiceSlug === serv.slug;
                return (
                  <div
                    key={serv.slug}
                    onClick={() => setSelectedServiceSlug(serv.slug)}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                      cursor: "pointer",
                      boxShadow: isSelected ? "0 4px 14px rgba(37,99,235,0.12)" : "0 1px 3px rgba(0,0,0,0.03)",
                      transition: "all 0.15s ease",
                      position: "relative",
                    }}
                  >
                    {isSelected && (
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "#2563eb",
                          color: "#ffffff",
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        SELECTED
                      </span>
                    )}
                    <strong style={{ fontSize: "13.5px", color: "#0f172a", display: "block", marginBottom: "6px", paddingRight: "60px" }}>
                      {serv.title}
                    </strong>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "14px", fontWeight: "900", color: "#047857" }}>
                        {serv.priceDisplay}
                      </span>
                      <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "600" }}>
                        ⏱ {serv.timeline}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Categorized Technical Add-ons */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <label style={{ fontSize: "13.5px", fontWeight: "800", color: "#0f172a" }}>
                2. Architectural Add-On Modules (Optional):
              </label>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                {selectedAddons.length} module{selectedAddons.length === 1 ? "" : "s"} enabled (+${breakdown.addonsTotal.toLocaleString()})
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "10px" }}>
              {availableAddons.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "6px",
                      border: checked ? "1px solid #2563eb" : "1px solid #e2e8f0",
                      backgroundColor: checked ? "#f8faff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(addon.id)}
                      style={{ marginTop: "3px", cursor: "pointer", accentColor: "#2563eb" }}
                    />
                    <div style={{ fontSize: "12px", width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "baseline" }}>
                        <strong style={{ color: "#0f172a", fontSize: "12.5px" }}>{addon.name}</strong>
                        <span style={{ fontWeight: "800", color: "#047857", whiteSpace: "nowrap" }}>
                          +${addon.price.toLocaleString()}
                        </span>
                      </div>
                      <span style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "3px", lineHeight: "1.4" }}>
                        {addon.description}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step 3: Client Organization & Target Timeline */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "18px 20px",
              marginBottom: "28px",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Client Organization / Venture:
              </label>
              <input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="e.g. Acme FinTech Corp"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "5px",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Technical Sponsor / Contact Name:
              </label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="e.g. Sarah Jenkins (VP Engineering)"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "5px",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Desired Kickoff Window:
              </label>
              <select
                value={targetStartDate}
                onChange={(e) => setTargetStartDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "5px",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="Immediate (Within 7 Days)">Immediate (Within 7 Days)</option>
                <option value="Next 2-3 Weeks">Next 2–3 Weeks</option>
                <option value="Next Month (Reserve Calendar)">Next Month (Reserve Calendar)</option>
                <option value="Quarterly Roadmap Scoping">Quarterly Roadmap Scoping</option>
              </select>
            </div>
          </div>

          {/* Step 4: Transparent Milestone Schedule Table */}
          <div style={{ marginBottom: "28px" }}>
            <h4 style={{ fontSize: "13.5px", fontWeight: "800", color: "#0f172a", margin: "0 0 10px 0" }}>
              3. Transparent Milestone Payment Schedule (Zero Budget Creep):
            </h4>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", border: "1px solid #e2e8f0" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0b132b", color: "#ffffff" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", width: "12%" }}>Milestone</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", width: "58%" }}>Scope &amp; Acceptance Criteria</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", width: "15%" }}>Allocation</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", width: "15%" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.milestones.map((m) => (
                    <tr key={m.number} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px 14px", fontWeight: "bold", color: "#2563eb" }}>M{m.number}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <strong style={{ color: "#0f172a", display: "block" }}>{m.name}</strong>
                        <span style={{ fontSize: "11.5px", color: "#64748b" }}>{m.deliverables}</span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: "bold", color: "#334155" }}>
                        {m.percentage}%
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: "bold", color: "#0f172a" }}>
                        ${m.amount.toLocaleString()} USD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* LIVE CONTRACT PREVIEW TAB */
        <div style={{ padding: "32px", backgroundColor: "#f8fafc" }}>
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "36px 40px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            {/* Document Header */}
            <div
              style={{
                borderBottom: "3px solid #2563eb",
                paddingBottom: "18px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#2563eb", fontWeight: 700 }}>
                  DOC REF: {documentId}
                </span>
                <h2 style={{ fontSize: "22px", color: "#0b132b", margin: "4px 0 0 0", fontWeight: 900 }}>
                  ENGINEERING STATEMENT OF WORK
                </h2>
                <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                  Fixed-Scope Architecture Sprint Agreement
                </p>
              </div>

              <div style={{ textAlign: "right", fontSize: "12px", color: "#475569" }}>
                <div><strong>Effective Date:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                <div style={{ marginTop: "2px" }}><strong>Target Kickoff:</strong> {targetStartDate}</div>
              </div>
            </div>

            {/* Parties Box */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "16px 20px",
                marginBottom: "24px",
                fontSize: "12.5px",
              }}
            >
              <div>
                <h5 style={{ margin: "0 0 6px 0", fontSize: "11px", textTransform: "uppercase", color: "#64748b", letterSpacing: "0.5px" }}>
                  Party A (Client)
                </h5>
                <div><strong>Organization:</strong> {clientCompany || "Client Organization"}</div>
                <div><strong>Technical Sponsor:</strong> {clientContact || "Engineering Leadership"}</div>
              </div>
              <div>
                <h5 style={{ margin: "0 0 6px 0", fontSize: "11px", textTransform: "uppercase", color: "#64748b", letterSpacing: "0.5px" }}>
                  Party B (Principal Architect)
                </h5>
                <div><strong>Engineer:</strong> MD Abu Hanif Mia</div>
                <div><strong>Credentials:</strong> B.Sc. in CSE • Batch-12 PH Honor (WEB12-3991)</div>
                <div><strong>Direct Contact:</strong> abuhanifmain@gmail.com</div>
              </div>
            </div>

            {/* Scope Summary */}
            <h4 style={{ fontSize: "14px", textTransform: "uppercase", color: "#0b132b", borderBottom: "1px solid #cbd5e1", paddingBottom: "6px", margin: "20px 0 10px 0" }}>
              1. Selected Engagement: {selectedService.title}
            </h4>
            <p style={{ fontSize: "12.5px", color: "#334155", margin: "0 0 12px 0" }}>
              {selectedService.description}
            </p>
            <ul style={{ fontSize: "12px", paddingLeft: "18px", color: "#334155", marginBottom: "16px" }}>
              {selectedService.deliverables.map((d, i) => (
                <li key={i} style={{ marginBottom: "4px" }}>{d}</li>
              ))}
            </ul>

            {breakdown.chosenAddons.length > 0 && (
              <>
                <h5 style={{ fontSize: "12.5px", color: "#0b132b", margin: "14px 0 6px 0" }}>
                  Integrated Add-On Modules:
                </h5>
                <ul style={{ fontSize: "12px", paddingLeft: "18px", color: "#334155", marginBottom: "16px" }}>
                  {breakdown.chosenAddons.map((a) => (
                    <li key={a.id} style={{ marginBottom: "4px" }}>
                      <strong>{a.name} (+$${a.price.toLocaleString()} USD):</strong> {a.description}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Milestones in Preview */}
            <h4 style={{ fontSize: "14px", textTransform: "uppercase", color: "#0b132b", borderBottom: "1px solid #cbd5e1", paddingBottom: "6px", margin: "24px 0 10px 0" }}>
              2. Commercial Investment &amp; Payment Schedule
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", margin: "12px 0" }}>
              <thead>
                <tr style={{ backgroundColor: "#0b132b", color: "#ffffff" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>Phase</th>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>Scope Deliverables</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.milestones.map((m) => (
                  <tr key={m.number} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "8px 10px", fontWeight: "bold" }}>M{m.number} ({m.percentage}%)</td>
                    <td style={{ padding: "8px 10px" }}>{m.name}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: "bold" }}>${m.amount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#ecfdf5", fontWeight: "bold", color: "#065f46" }}>
                  <td colSpan={2} style={{ padding: "10px" }}>TOTAL FIXED INVESTMENT</td>
                  <td style={{ textAlign: "right", padding: "10px" }}>${breakdown.totalInvestment.toLocaleString()} USD</td>
                </tr>
              </tbody>
            </table>

            {/* Signature Block */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginTop: "32px",
                paddingTop: "20px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    border: "2px solid #059669",
                    color: "#059669",
                    fontSize: "10px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                >
                  ✓ Verified Principal Architect
                </span>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>MD Abu Hanif Mia</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "16px" }}>
                  Staff Software Engineer &bull; Batch-12 WEB12-3991
                </div>
                <div style={{ borderTop: "1px dashed #94a3b8", paddingTop: "6px", fontSize: "11px", color: "#64748b" }}>
                  Authorized Digital Seal
                </div>
              </div>

              <div>
                <div style={{ height: "26px" }}></div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  {clientContact || "Client Technical Sponsor"}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "16px" }}>
                  {clientCompany || "Client Organization"}
                </div>
                <div style={{ borderTop: "1px dashed #94a3b8", paddingTop: "6px", fontSize: "11px", color: "#64748b" }}>
                  Client Acceptance Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Live Executive Calculation & Action Bar */}
      <div
        style={{
          backgroundColor: "#0b132b",
          borderTop: "1px solid #1e293b",
          padding: "20px 28px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
            Total Guaranteed Fixed Investment
          </span>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#10b981", lineHeight: 1.1 }}>
            ${breakdown.totalInvestment.toLocaleString()} USD
          </div>
          <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
            ⏱ {selectedService.timeline} &bull; Includes 30-Day Bug Warranty &bull; 100% Client IP Handover
          </span>
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", width: "100%", maxWidth: "620px" }}>
          <button
            type="button"
            className="mobile-full-width-btn"
            onClick={handlePrintSow}
            style={{
              flex: "1 1 130px",
              padding: "11px 16px",
              backgroundColor: "#111e38",
              color: "#38bdf8",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "12.5px",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.15s ease",
            }}
            title="Generate high-resolution printable PDF with digital seal"
          >
            🖨️ Export PDF
          </button>

          <button
            type="button"
            className="mobile-full-width-btn"
            onClick={handleCopySow}
            style={{
              flex: "1 1 110px",
              padding: "11px 14px",
              backgroundColor: "#070f1e",
              color: copied ? "#10b981" : "#ffffff",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy SOW"}
          </button>

          <button
            type="button"
            className="mobile-full-width-btn"
            onClick={handleDownloadSow}
            style={{
              flex: "1 1 100px",
              padding: "11px 14px",
              backgroundColor: "#070f1e",
              color: "#e2e8f0",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            💾 .md File
          </button>

          <button
            type="button"
            className="mobile-full-width-btn"
            onClick={handlePrefillInquiry}
            style={{
              flex: "1 1 160px",
              padding: "11px 18px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(37,99,235,0.4)",
              transition: "all 0.15s ease",
            }}
          >
            Lock In Scope &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}
