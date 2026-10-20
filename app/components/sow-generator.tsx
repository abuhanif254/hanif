"use client";

import React, { useState } from "react";
import { initialServices, ServicePricing } from "../data/portfolio-data";

interface AddonOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const availableAddons: AddonOption[] = [
  {
    id: "migration",
    name: "Zero-Downtime Live Data Migration",
    price: 3500,
    description: "Safe schema extraction, ETL transformation, and replication cutover with zero downtime.",
  },
  {
    id: "security",
    name: "SOC2 Compliance & RLS Hardening",
    price: 2800,
    description: "Granular Row Level Security (RLS) policies, session revocation, and security audit remediation.",
  },
  {
    id: "ai_rag",
    name: "Enterprise AI & pgvector RAG Integration",
    price: 4200,
    description: "Embedding generation, vector indexing, hybrid semantic search, and streaming completions.",
  },
  {
    id: "warranty",
    name: "Extended 60-Day Dedicated SLA Warranty",
    price: 1800,
    description: "Doubles standard 30-day warranty with guaranteed 2-hour emergency escalation response.",
  },
];

export default function StatementOfWorkGenerator() {
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>("database-optimization");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [clientCompany, setClientCompany] = useState<string>("");
  const [clientContact, setClientContact] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const selectedService: ServicePricing =
    initialServices.find((s) => s.slug === selectedServiceSlug) || initialServices[0];

  const basePriceNum = parseInt(selectedService.priceDisplay.replace(/[^0-9]/g, ""), 10) || 0;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const addon = availableAddons.find((a) => a.id === id);
    return acc + (addon ? addon.price : 0);
  }, 0);
  const totalInvestment = basePriceNum + addonsTotal;

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function generateSowMarkdown(): string {
    const chosenAddons = availableAddons.filter((a) => selectedAddons.includes(a.id));
    return `
# STATEMENT OF WORK (SOW) ESTIMATE
**Client Organization:** ${clientCompany || "[Company Name]"}  
**Contact / Sponsor:** ${clientContact || "[Contact Name]"}  
**Principal Architect:** MD Abu Hanif Mia (Staff Software Engineer & Systems Architect)  
**Date Generated:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}  

---

## 1. Selected Engagement Package
- **Package:** ${selectedService.title} (${selectedService.pricingType.toUpperCase()})
- **Estimated Timeline:** ${selectedService.timeline}
- **Base Milestone Investment:** ${selectedService.priceDisplay}

### Core Deliverables:
${selectedService.deliverables.map((d) => `- ${d}`).join("\n")}

${
  chosenAddons.length > 0
    ? `## 2. Technical Add-On Modules
${chosenAddons.map((a) => `- **${a.name}** (+$${a.price.toLocaleString()}): ${a.description}`).join("\n")}
`
    : ""
}
## 3. Total Estimated Investment
- **Base Milestone:** $${basePriceNum.toLocaleString()}
${chosenAddons.length > 0 ? `- **Add-On Modules:** +$${addonsTotal.toLocaleString()}` : ""}
- **TOTAL FIXED INVESTMENT:** **$${totalInvestment.toLocaleString()}**

## 4. Guarantees & Intellectual Property Terms
- **100% Client Intellectual Property**: All commit histories, schemas, documentation, and IP belong entirely to the Client upon final invoice settlement.
- **30-Day Post-Launch Warranty**: Comprehensive coverage for bug remediation and performance SLA verification at zero additional charge.
- **Payment Structure**: 50% upfront sprint capacity reservation, 50% upon verified production deployment.

---
*Generated via Abu Hanif Portfolio SOW Builder (https://abuhanifmia.com/pricing)*
    `.trim();
  }

  function handleDownloadSow() {
    if (typeof window === "undefined") return;
    const markdown = generateSowMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SOW-${selectedServiceSlug}-${Date.now()}.md`;
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
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;
    const chosenAddons = availableAddons.filter((a) => selectedAddons.includes(a.id));
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Statement of Work - ${selectedService.title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #0f172a; padding: 40px; max-width: 750px; margin: 0 auto; }
            h1 { font-size: 24px; color: #0b132b; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
            h2 { font-size: 18px; color: #0f172a; margin-top: 24px; }
            .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0; }
            .meta p { margin: 4px 0; font-size: 14px; }
            ul { padding-left: 20px; font-size: 14px; }
            li { margin-bottom: 6px; }
            .total { background: #ecfdf5; border: 2px solid #10b981; border-radius: 6px; padding: 16px; font-size: 18px; font-weight: bold; color: #047857; margin: 24px 0; }
            .footer { font-size: 12px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>STATEMENT OF WORK (SOW) ESTIMATE</h1>
          <div class="meta">
            <p><strong>Client Organization:</strong> ${clientCompany || "Client Organization"}</p>
            <p><strong>Contact / Sponsor:</strong> ${clientContact || "Technical Sponsor"}</p>
            <p><strong>Principal Architect:</strong> MD Abu Hanif Mia (Staff Software Engineer &amp; Systems Architect)</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <h2>1. Selected Engagement: ${selectedService.title}</h2>
          <p><strong>Pricing Model:</strong> ${selectedService.pricingType.toUpperCase()} &bull; <strong>Estimated Timeline:</strong> ${selectedService.timeline}</p>
          <h3>Core Deliverables:</h3>
          <ul>
            ${selectedService.deliverables.map((d) => `<li>${d}</li>`).join("")}
          </ul>
          ${chosenAddons.length > 0 ? `
            <h2>2. Technical Add-On Modules:</h2>
            <ul>
              ${chosenAddons.map((a) => `<li><strong>${a.name}</strong> (+$${a.price.toLocaleString()}): ${a.description}</li>`).join("")}
            </ul>
          ` : ""}
          <div class="total">
            TOTAL FIXED INVESTMENT: $${totalInvestment.toLocaleString()} USD
          </div>
          <h2>3. Intellectual Property &amp; SLA Terms</h2>
          <ul>
            <li><strong>100% Client Ownership:</strong> Full IP, source code, schemas, and credentials belong to Client upon invoice settlement.</li>
            <li><strong>30-Day Production Bug Warranty:</strong> Included at zero additional charge.</li>
            <li><strong>Payment Terms:</strong> 50% upfront sprint reservation, 50% upon verified staging/production signoff.</li>
          </ul>
          <div class="footer">
            Generated via Abu Hanif Systems Architecture Portfolio &bull; https://abuhanifmia.com/pricing
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function handlePrefillInquiry() {
    const el = document.getElementById("inquiry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    const messageInput = document.getElementById("message") as HTMLTextAreaElement | null;
    if (messageInput) {
      messageInput.value = `Hi Abu Hanif, I configured a Statement of Work for "${selectedService.title}" with total estimate of $${totalInvestment.toLocaleString()} (${selectedService.timeline}). Target start date: ...`;
    }
  }

  return (
    <div
      id="sow-generator"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(11, 25, 44, 0.08)",
        margin: "32px 0",
      }}
    >
      {/* Header Banner */}
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
          gap: "10px",
        }}
      >
        <div>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>
            Self-Service Scoping Engine
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#ffffff", fontWeight: "800" }}>
            Interactive Statement of Work (SOW) &amp; Budget Generator
          </h3>
        </div>
        <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
          Transparent Milestones • Zero Budget Creep
        </span>
      </div>

      <div style={{ padding: "28px" }}>
        {/* Step 1: Pick Service */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>
            1. Select Core Technical Engagement:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {initialServices.map((serv) => {
              const isSelected = selectedServiceSlug === serv.slug;
              return (
                <div
                  key={serv.slug}
                  onClick={() => setSelectedServiceSlug(serv.slug)}
                  style={{
                    padding: "14px",
                    borderRadius: "6px",
                    border: isSelected ? "2px solid #2563eb" : "1px solid #cbd5e1",
                    backgroundColor: isSelected ? "#f8faff" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>{serv.title}</strong>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#047857" }}>{serv.priceDisplay}</span>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#64748b" }}>⏱ {serv.timeline}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Pick Add-ons */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>
            2. Optional Architectural Add-On Modules:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
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
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAddon(addon.id)}
                    style={{ marginTop: "3px", cursor: "pointer" }}
                  />
                  <div style={{ fontSize: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
                      <strong style={{ color: "#0f172a" }}>{addon.name}</strong>
                      <span style={{ fontWeight: "bold", color: "#047857" }}>+${addon.price.toLocaleString()}</span>
                    </div>
                    <span style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "2px" }}>
                      {addon.description}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 3: Company & Contact (Optional for SOW personalization) */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "4px" }}>
              Company / Venture Name (Optional):
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
                borderRadius: "4px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "4px" }}>
              Sponsor / Technical Lead Name (Optional):
            </label>
            <input
              type="text"
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              placeholder="e.g. Sarah Jenkins (VP Eng)"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Live Calculation Bar */}
        <div
          style={{
            backgroundColor: "#0b132b",
            border: "1px solid #1e293b",
            borderRadius: "6px",
            padding: "20px 24px",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px" }}>
              Total Fixed Investment Estimate
            </span>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#10b981" }}>
              ${totalInvestment.toLocaleString()}
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Includes 30-day post-launch warranty &bull; 100% Client IP Ownership
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", width: "100%", maxWidth: "620px" }}>
            <button
              type="button"
              className="mobile-full-width-btn"
              onClick={handlePrintSow}
              style={{
                flex: "1 1 130px",
                padding: "10px 14px",
                backgroundColor: "#111e38",
                color: "#38bdf8",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s ease",
              }}
              title="Print formal proposal or save directly as PDF"
            >
              🖨️ Print / Save PDF
            </button>

            <button
              type="button"
              className="mobile-full-width-btn"
              onClick={handleCopySow}
              style={{
                flex: "1 1 120px",
                padding: "10px 14px",
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
                flex: "1 1 120px",
                padding: "10px 14px",
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
                flex: "1 1 150px",
                padding: "10px 16px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
              }}
            >
              Lock In Scope &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
