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
*Generated via Abu Hanif Portfolio SOW Builder (https://abuhanif.dev/pricing)*
    `.trim();
  }

  function handleCopySow() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generateSowMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
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
        border: "1px solid #053056",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(5, 48, 86, 0.08)",
        margin: "32px 0",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: "#053056",
          color: "#ffffff",
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#9CBE41", textTransform: "uppercase", letterSpacing: "1px" }}>
            Self-Service Scoping Engine
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#ffffff" }}>
            Interactive Statement of Work (SOW) &amp; Budget Generator
          </h3>
        </div>
        <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
          Transparent Milestones • Zero Budget Creep
        </span>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Step 1: Pick Service */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#053056", marginBottom: "8px" }}>
            1. Select Core Technical Engagement:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            {initialServices.map((serv) => {
              const isSelected = selectedServiceSlug === serv.slug;
              return (
                <div
                  key={serv.slug}
                  onClick={() => setSelectedServiceSlug(serv.slug)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "4px",
                    border: isSelected ? "2px solid #9CBE41" : "1px solid #cbd5e1",
                    backgroundColor: isSelected ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "13px", color: "#053056" }}>{serv.title}</strong>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#166534" }}>{serv.priceDisplay}</span>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#64748b" }}>⏱ {serv.timeline}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Pick Add-ons */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#053056", marginBottom: "8px" }}>
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
                    padding: "10px 14px",
                    borderRadius: "4px",
                    border: checked ? "1px solid #16a34a" : "1px solid #e2e8f0",
                    backgroundColor: checked ? "#f0fdf4" : "#f8fafc",
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
                      <strong style={{ color: "#053056" }}>{addon.name}</strong>
                      <span style={{ fontWeight: "bold", color: "#166534" }}>+${addon.price.toLocaleString()}</span>
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
                borderRadius: "3px",
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
                borderRadius: "3px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Live Calculation Bar */}
        <div
          style={{
            backgroundColor: "#053056",
            borderRadius: "4px",
            padding: "18px 24px",
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
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#9CBE41" }}>
              ${totalInvestment.toLocaleString()}
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Includes 30-day post-launch warranty &bull; 100% Client IP Ownership
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleCopySow}
              style={{
                padding: "10px 16px",
                backgroundColor: "#042442",
                color: copied ? "#4ade80" : "#ffffff",
                border: "1px solid #0a365c",
                borderRadius: "4px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {copied ? "✓ Copied SOW Markdown!" : "📋 Copy SOW Proposal"}
            </button>

            <button
              type="button"
              onClick={handlePrefillInquiry}
              style={{
                padding: "10px 18px",
                backgroundColor: "#9CBE41",
                color: "#041f36",
                border: "none",
                borderRadius: "4px",
                fontWeight: "800",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Lock In This Scope &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
