"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialServices, ServicePricing } from "../data/portfolio-data";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export default function PricingClientView() {
  const [services] = useState<ServicePricing[]>(initialServices);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("serv-4");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Full-Stack SaaS MVP Engineering Sprint",
    budgetRange: "$10,000 – $25,000",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add-ons Definition
  const addonsList = [
    { id: "addon-migration", title: "Zero-Downtime Data Migration & Cutover", price: 3500, desc: "Safe schema extraction, ETL transformation, and live replication cutover." },
    { id: "addon-security", title: "SOC2 Compliance & Security Hardening", price: 2800, desc: "Penetration testing remediations, cryptographic key rotation, and RLS audit." },
    { id: "addon-ai", title: "Custom LLM & Vector RAG Pipeline Integration", price: 4200, desc: "Embedding generation, pgvector indexing, streaming UI, and tool-calling agents." },
    { id: "addon-warranty", title: "Extended 60-Day Dedicated Post-Launch SLA", price: 1800, desc: "Doubles the standard 30-day warranty with guaranteed 2-hour emergency escalation." },
  ];

  // Calculate dynamic investment estimate
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const basePriceNumber = parseInt(currentService.priceDisplay.replace(/[^0-9]/g, ""), 10) || 0;
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = addonsList.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);
  const totalEstimate = basePriceNumber + addonsTotal;

  function toggleAddon(id: string) {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  }

  function handleSelectPackageForBooking(serv: ServicePricing) {
    setSelectedServiceId(serv.id);
    setFormState((prev) => ({
      ...prev,
      projectType: serv.title,
      budgetRange: serv.priceDisplay,
      message: `Hi Abu Hanif, I would like to book the "${serv.title}" package (${serv.priceDisplay}, ${serv.timeline}). Our target kickoff date is...`,
    }));
    const el = document.getElementById("inquiry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSubmittedMessage(null);

    const record = {
      id: `inq-${Date.now()}`,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      project_type: formState.projectType,
      budget_range: formState.budgetRange,
      message: formState.message,
      status: "new",
      created_at: new Date().toISOString(),
    };

    try {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("abuhanif-inquiries");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(record);
        window.localStorage.setItem("abuhanif-inquiries", JSON.stringify(list));
      }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("inquiries").insert([record]);
        if (error) {
          console.warn("Supabase inquiry insert error:", error);
        }
      }

      setSubmittedMessage(
        "Thank you! Your project scope inquiry has been received. Abu Hanif will review your technical requirements and respond within 24 hours to schedule an architecture discovery call."
      );
      setFormState({
        name: "",
        email: "",
        phone: "",
        projectType: currentService.title,
        budgetRange: currentService.priceDisplay,
        message: "",
      });
    } catch (err: any) {
      setErrorMessage(
        "An unexpected error occurred. You can also email directly at contact@abuhanif.dev."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const faqs = [
    {
      q: "Why do you use fixed-price milestones instead of open-ended hourly billing?",
      a: "Hourly billing misaligns incentives: slower development yields higher contractor bills, while efficient engineering is penalized. By structuring projects around transparent, fixed-scope milestones, you know the exact cost and delivery timeline before code is written. I assume the delivery risk, and you receive verified production deliverables without budget creep.",
    },
    {
      q: "Who owns the intellectual property and source code?",
      a: "You do. 100% of all intellectual property, git commit histories, documentation, schemas, and assets belong to you from the moment they are written. Work is committed directly to your private GitHub or GitLab organization under standard clean IP assignment terms.",
    },
    {
      q: "Do you sign Mutual Non-Disclosure Agreements (NDAs)?",
      a: "Yes, standard practice. Prior to reviewing your private repositories, product specs, or database architectures, we sign a mutual NDA to guarantee complete confidentiality.",
    },
    {
      q: "How are milestone payments structured?",
      a: "For fixed-scope sprints, payments are typically split 50% upfront upon signing the Statement of Work (reserving dedicated engineering calendar capacity) and 50% upon verified staging acceptance and production deployment. For monthly retainers, billing occurs on the 1st of each month with month-to-month flexibility.",
    },
    {
      q: "What happens if technical requirements change during a sprint?",
      a: "Software is iterative. If a requirement evolves during development, we evaluate the delta: minor adjustments are absorbed immediately without bureaucracy. If a major new capability is desired, we document an additive RFC with an explicit scope adjustment so you always remain in full control.",
    },
    {
      q: "What is included in the 30-Day Post-Launch Warranty?",
      a: "Every fixed-scope project includes 30 days of complimentary production bug warranty. If any bug or deviation from the agreed specification surfaces post-deployment, it is diagnosed and resolved with high priority at zero additional cost.",
    },
    {
      q: "Can you work alongside our existing in-house engineering team?",
      a: "Yes. In the Fractional Staff Architect or sprint model, I integrate directly into your team's Slack/Discord, attend weekly sprint plannings, conduct peer PR reviews, mentor mid-level engineers, and tackle the hardest technical subsystems.",
    },
    {
      q: "What technology stack do you specialize in?",
      a: "TypeScript/JavaScript, Next.js 16 (App Router, Server Components), React 19, Supabase PostgreSQL, Go, Redis, Cloudflare Pages & Workers, Docker, Tailwind CSS, TimescaleDB, and Stripe billing infrastructure.",
    },
    {
      q: "How fast can an engagement begin?",
      a: "Diagnostic audits can typically begin within 2–3 business days. Dedicated full-stack sprints and monthly retainers are booked 1–2 weeks in advance depending on current sprint bandwidth.",
    },
    {
      q: "How do we get started?",
      a: "Submit the project inquiry form below or email contact@abuhanif.dev. We will schedule a free 30-minute technical discovery call to review your architecture, evaluate scope fit, and deliver a formal Statement of Work (SOW).",
    },
  ];

  return (
    <div id="source-page-root" data-source-path="/pricing">
      <div id="source-page-body" className="source-page-body js l2 section_29 justia-robertjfleming-com">
        <SiteHeader activePath="/pricing" />

        <div className="index" id="container">
          <div className="cwrap">
            {/* Main Content */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <h1 style={{ margin: 0, fontSize: "28px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          Transparent Work Pricing &amp; Engineering Engagements
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", fontWeight: "normal", color: "#e2e8f0" }}>
                          Fixed-Scope Sprints • Production Platforms • Fractional Architecture Retainers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tcfrags"></div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <a href="/">Home</a> &gt; <span>Work Pricing &amp; Engagement Models</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      <h2>Predictable Engineering Investment. Zero Budget Creep.</h2>
                      <p>
                        Senior engineering leadership should be transparent, accountable, and driven by measurable production outcomes. As <strong>Abu Hanif (MD Abu Hanif Mia)</strong>, Staff Software Engineer &amp; Systems Architect, I operate on fixed-scope milestone deliverables and clearly defined retainer models.
                      </p>
                      <p>
                        Every engagement includes explicit architectural specifications, clean git histories with 100% intellectual property ownership assigned to your company, automated CI/CD pipelines, and an unconditional 30-day post-launch warranty.
                      </p>

                      {/* 4 Pillars Summary Strip */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                          gap: "12px",
                          margin: "24px 0 32px 0",
                        }}
                      >
                        <div style={{ padding: "14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                          <strong style={{ display: "block", color: "#053056", fontSize: "13px" }}>Fixed-Scope Sprints</strong>
                          <span style={{ fontSize: "12px", color: "#334155" }}>Guaranteed delivery dates &amp; fixed milestone costs.</span>
                        </div>
                        <div style={{ padding: "14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                          <strong style={{ display: "block", color: "#053056", fontSize: "13px" }}>100% Client IP</strong>
                          <span style={{ fontSize: "12px", color: "#334155" }}>Direct commits to your private Git repo from day one.</span>
                        </div>
                        <div style={{ padding: "14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                          <strong style={{ display: "block", color: "#053056", fontSize: "13px" }}>Production SLAs</strong>
                          <span style={{ fontSize: "12px", color: "#334155" }}>Sub-30ms P99 latency and 99.99% uptime targets.</span>
                        </div>
                        <div style={{ padding: "14px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                          <strong style={{ display: "block", color: "#053056", fontSize: "13px" }}>30-Day Warranty</strong>
                          <span style={{ fontSize: "12px", color: "#334155" }}>Post-deployment bug fixes at zero extra cost.</span>
                        </div>
                      </div>

                      {/* SECTION 1: THE 6 CORE PACKAGES */}
                      <div style={{ borderBottom: "2px solid #9CBE41", paddingBottom: "6px", margin: "32px 0 20px 0" }}>
                        <h2 style={{ fontSize: "20px", color: "#053056", margin: 0 }}>
                          Standard Production Packages &amp; Sprints
                        </h2>
                      </div>
                      <p style={{ fontSize: "13px", color: "#475569", marginBottom: "24px" }}>
                        Select a package below to inspect the detailed technical deliverables, timeline, and pricing. You can click &ldquo;Select This Scope&rdquo; to pre-fill your consultation request.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                        {services.map((serv) => (
                          <div
                            key={serv.id}
                            style={{
                              backgroundColor: serv.isPopular ? "#f0fdf4" : "#ffffff",
                              border: serv.isPopular ? "2px solid #16a34a" : "1px solid #cbd5e1",
                              borderRadius: "6px",
                              padding: "24px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              position: "relative",
                              boxShadow: serv.isPopular ? "0 4px 12px rgba(22, 163, 74, 0.08)" : "none",
                            }}
                          >
                            {serv.isPopular && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-12px",
                                  right: "20px",
                                  backgroundColor: "#16a34a",
                                  color: "#ffffff",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  padding: "3px 10px",
                                  borderRadius: "12px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Most Popular
                              </div>
                            )}

                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#334155", textTransform: "uppercase" }}>
                                  {serv.pricingType === "retainer" ? "Monthly Retainer" : "Fixed Scope Sprint"}
                                </span>
                                <span style={{ fontSize: "12px", color: "#053056", fontWeight: "600" }}>
                                  ⏱ {serv.timeline}
                                </span>
                              </div>

                              <h3 style={{ fontSize: "19px", color: "#053056", margin: "0 0 10px 0", lineHeight: "1.3" }}>
                                {serv.title}
                              </h3>

                              <div style={{ fontSize: "28px", fontWeight: "800", color: "#053056", marginBottom: "12px" }}>
                                {serv.priceDisplay}
                              </div>

                              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", marginBottom: "18px" }}>
                                {serv.description}
                              </p>

                              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px", marginBottom: "20px" }}>
                                <strong style={{ fontSize: "12px", color: "#053056", display: "block", marginBottom: "10px", textTransform: "uppercase" }}>
                                  Key Engineering Deliverables:
                                </strong>
                                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#334155", lineHeight: "1.6" }}>
                                  {serv.deliverables.map((deliv, idx) => (
                                    <li key={idx} style={{ marginBottom: "6px" }}>
                                      {deliv}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSelectPackageForBooking(serv)}
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                backgroundColor: serv.isPopular ? "#16a34a" : "#053056",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "4px",
                                fontWeight: "700",
                                fontSize: "13px",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                            >
                              Select This Scope &amp; Book &rsaquo;
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* SECTION 2: INTERACTIVE SCOPE & COST ESTIMATOR */}
                      <div
                        style={{
                          backgroundColor: "#053056",
                          color: "#ffffff",
                          borderRadius: "6px",
                          padding: "28px",
                          marginBottom: "40px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
                          <div>
                            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#9CBE41", fontWeight: "700" }}>
                              Interactive Configuration
                            </span>
                            <h3 style={{ fontSize: "22px", margin: "4px 0 0 0", color: "#ffffff" }}>
                              Engineering Scope &amp; Investment Estimator
                            </h3>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "12px", color: "#e2e8f0" }}>Estimated Investment</div>
                            <div style={{ fontSize: "32px", fontWeight: "800", color: "#9CBE41" }}>
                              ${totalEstimate.toLocaleString()}
                              {currentService.pricingType === "retainer" && <span style={{ fontSize: "14px", color: "#cbd5e1" }}> / mo</span>}
                            </div>
                          </div>
                        </div>

                        <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "20px" }}>
                          Customize your engineering engagement by pairing a base production package with specialized architectural add-ons (such as zero-downtime data migration or security hardening).
                        </p>

                        <div style={{ marginBottom: "20px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#e2e8f0", display: "block", marginBottom: "6px" }}>
                            1. Select Primary Architecture Package:
                          </label>
                          <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              backgroundColor: "#071c33",
                              border: "1px solid #1e3a5f",
                              color: "#ffffff",
                              borderRadius: "4px",
                              fontSize: "14px",
                            }}
                          >
                            {services.map((serv) => (
                              <option key={serv.id} value={serv.id}>
                                {serv.title} — {serv.priceDisplay} ({serv.timeline})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#e2e8f0", display: "block", marginBottom: "8px" }}>
                            2. Specialized Technical Add-Ons (Optional):
                          </label>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
                            {addonsList.map((addon) => {
                              const checked = selectedAddons.includes(addon.id);
                              return (
                                <div
                                  key={addon.id}
                                  onClick={() => toggleAddon(addon.id)}
                                  style={{
                                    padding: "12px",
                                    backgroundColor: checked ? "#0f2e52" : "#071c33",
                                    border: checked ? "1px solid #9CBE41" : "1px solid #1e3a5f",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {}}
                                    style={{ marginTop: "3px", cursor: "pointer" }}
                                  />
                                  <div>
                                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>
                                      {addon.title} (+${addon.price.toLocaleString()})
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "2px" }}>
                                      {addon.desc}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #1e3a5f", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
                            Selected Scope: <strong>{currentService.title}</strong>
                            {selectedAddons.length > 0 && ` + ${selectedAddons.length} specialized add-on(s)`}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectPackageForBooking(currentService)}
                            style={{
                              padding: "10px 22px",
                              backgroundColor: "#9CBE41",
                              color: "#053056",
                              border: "none",
                              borderRadius: "4px",
                              fontWeight: "800",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            Lock In This Estimate &amp; Inquire Below &rsaquo;
                          </button>
                        </div>
                      </div>

                      {/* SECTION 3: COMPREHENSIVE SCOPE COMPARISON MATRIX */}
                      <div style={{ borderBottom: "2px solid #9CBE41", paddingBottom: "6px", margin: "36px 0 20px 0" }}>
                        <h2 style={{ fontSize: "20px", color: "#053056", margin: 0 }}>
                          Engineering Deliverables Comparison Matrix
                        </h2>
                      </div>
                      <p style={{ fontSize: "13px", color: "#475569", marginBottom: "18px" }}>
                        A detailed breakdown of technical deliverables, guarantees, and collaboration channels across service tiers:
                      </p>

                      <div style={{ overflowX: "auto", marginBottom: "40px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", border: "1px solid #cbd5e1" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#053056", color: "#ffffff" }}>
                              <th style={{ padding: "12px 14px", textAlign: "left", width: "28%" }}>Scope &amp; Engineering Feature</th>
                              <th style={{ padding: "12px 10px", textAlign: "center" }}>Diagnostic Audit</th>
                              <th style={{ padding: "12px 10px", textAlign: "center" }}>Postgres Tuning</th>
                              <th style={{ padding: "12px 10px", textAlign: "center" }}>Edge Migration</th>
                              <th style={{ padding: "12px 10px", textAlign: "center", backgroundColor: "#064e3b" }}>Full MVP Sprint</th>
                              <th style={{ padding: "12px 10px", textAlign: "center" }}>Fractional Staff</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { feature: "System Architecture RFC & Diagram", audit: "✓", pg: "✓", edge: "✓", mvp: "✓", frac: "✓" },
                              { feature: "Full Source Code Handover (100% IP)", audit: "N/A (Report)", pg: "✓", edge: "✓", mvp: "✓", frac: "✓" },
                              { feature: "Automated CI/CD Deployment Pipeline", audit: "Recommendations", pg: "Guardrails", edge: "✓ Cloudflare", mvp: "✓ Cloudflare", frac: "✓ Ongoing" },
                              { feature: "PostgreSQL Indexing & RLS Policies", audit: "Audit Only", pg: "✓ Comprehensive", edge: "Connection Pool", mvp: "✓ Full Schema", frac: "✓ Architectural" },
                              { feature: "Automated k6 Load Testing Benchmarks", audit: "Synthetic", pg: "✓ Simulated", edge: "✓ Global TTFB", mvp: "✓ Core Vitals", frac: "✓ Continuous" },
                              { feature: "30-Day Production Bug Warranty", audit: "Walkthrough Call", pg: "14-Day Monitor", edge: "30 Days", mvp: "30 Days", frac: "Active Retainer" },
                              { feature: "Direct Private Slack/Discord Access", audit: "Email + Call", pg: "Sprint Duration", edge: "Sprint Duration", mvp: "Sprint Duration", frac: "Guaranteed 2-Hour" },
                              { feature: "Candidate Technical Interviewing", audit: "—", pg: "—", edge: "—", mvp: "—", frac: "✓ Included" },
                            ].map((row, i) => (
                              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ padding: "10px 14px", fontWeight: "700", color: "#053056" }}>{row.feature}</td>
                                <td style={{ padding: "10px", textAlign: "center", color: "#334155" }}>{row.audit}</td>
                                <td style={{ padding: "10px", textAlign: "center", color: "#334155" }}>{row.pg}</td>
                                <td style={{ padding: "10px", textAlign: "center", color: "#334155" }}>{row.edge}</td>
                                <td style={{ padding: "10px", textAlign: "center", fontWeight: "700", color: "#16a34a", backgroundColor: i % 2 === 0 ? "#f0fdf4" : "#ecfdf5" }}>{row.mvp}</td>
                                <td style={{ padding: "10px", textAlign: "center", color: "#334155" }}>{row.frac}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* SECTION 4: HOURLY RATE CARD */}
                      <div style={{ borderBottom: "2px solid #9CBE41", paddingBottom: "6px", margin: "36px 0 20px 0" }}>
                        <h2 style={{ fontSize: "20px", color: "#053056", margin: 0 }}>
                          Ad-Hoc Consulting &amp; Incident Rate Card
                        </h2>
                      </div>
                      <p style={{ fontSize: "13px", color: "#475569", marginBottom: "18px" }}>
                        For advisory sessions, ad-hoc architectural code pairing, and emergency database incident remediation:
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "40px" }}>
                        <div style={{ padding: "20px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#ffffff" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#334155", textTransform: "uppercase" }}>Standard Consulting</span>
                          <h4 style={{ fontSize: "18px", color: "#053056", margin: "6px 0" }}>Senior Architecture Advisory</h4>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#053056", margin: "8px 0" }}>$140 <span style={{ fontSize: "14px", fontWeight: "normal", color: "#334155" }}>/ hour</span></div>
                          <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", margin: 0 }}>
                            1:1 pair programming, architectural design reviews, query plan troubleshooting, and technical strategy calls. Booked in 5-hour or 10-hour blocks.
                          </p>
                        </div>

                        <div style={{ padding: "20px", border: "1px solid #b91c1c", borderRadius: "6px", backgroundColor: "#fef2f2" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#b91c1c", textTransform: "uppercase" }}>Critical Priority</span>
                          <h4 style={{ fontSize: "18px", color: "#991b1b", margin: "6px 0" }}>P0 Production Incident Triage</h4>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#991b1b", margin: "8px 0" }}>$220 <span style={{ fontSize: "14px", fontWeight: "normal", color: "#7f1d1d" }}>/ hour</span></div>
                          <p style={{ fontSize: "12px", color: "#7f1d1d", lineHeight: "1.5", margin: 0 }}>
                            Immediate response within 2 hours for active database lockups, data corruption emergencies, or critical cloud infrastructure failure.
                          </p>
                        </div>
                      </div>

                      {/* SECTION 5: ENGAGEMENT PROTOCOL */}
                      <div style={{ borderBottom: "2px solid #9CBE41", paddingBottom: "6px", margin: "36px 0 20px 0" }}>
                        <h2 style={{ fontSize: "20px", color: "#053056", margin: 0 }}>
                          The 5-Stage Engineering Engagement Protocol
                        </h2>
                      </div>
                      <p style={{ fontSize: "13px", color: "#475569", marginBottom: "20px" }}>
                        How we take your product from initial requirements to verified production delivery:
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
                        {[
                          { step: "01", title: "Technical Discovery Call (30 Minutes, Free)", desc: "We evaluate your system architecture, project requirements, existing codebase, and target delivery deadline to verify technical alignment." },
                          { step: "02", title: "Statement of Work (SOW) & Architecture Proposal", desc: "You receive an explicit engineering SOW detailing exact deliverables, milestone delivery dates, technical topology, and a fixed price." },
                          { step: "03", title: "High-Velocity CI/CD Sprint Execution", desc: "Work begins in your private repository. Staging preview branches are continuously deployed to Cloudflare Pages for asynchronous progress reviews." },
                          { step: "04", title: "Automated Benchmarking & Load Testing", desc: "Prior to sign-off, automated unit test suites, Core Web Vitals checks, and k6 load tests are executed to prove production readiness." },
                          { step: "05", title: "Production Cutover & 30-Day Bug Warranty", desc: "Full ownership handover of all git branches, DNS configuration, and documentation, backed by an unconditional 30-day bug warranty." },
                        ].map((item) => (
                          <div key={item.step} style={{ display: "flex", gap: "16px", padding: "16px", border: "1px solid #e2e8f0", borderRadius: "4px", backgroundColor: "#ffffff" }}>
                            <div style={{ fontSize: "20px", fontWeight: "800", color: "#9CBE41", minWidth: "36px" }}>
                              {item.step}
                            </div>
                            <div>
                              <strong style={{ fontSize: "14px", color: "#053056", display: "block", marginBottom: "4px" }}>
                                {item.title}
                              </strong>
                              <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
                      <div style={{ borderBottom: "2px solid #9CBE41", paddingBottom: "6px", margin: "36px 0 20px 0" }}>
                        <h2 style={{ fontSize: "20px", color: "#053056", margin: 0 }}>
                          Engineering Engagement &amp; Contract FAQ
                        </h2>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
                        {faqs.map((faq, idx) => {
                          const isOpen = activeFaq === idx;
                          return (
                            <div
                              key={idx}
                              style={{
                                border: "1px solid #cbd5e1",
                                borderRadius: "4px",
                                backgroundColor: "#ffffff",
                                overflow: "hidden",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setActiveFaq(isOpen ? null : idx)}
                                style={{
                                  width: "100%",
                                  padding: "14px 18px",
                                  backgroundColor: isOpen ? "#f8fafc" : "#ffffff",
                                  border: "none",
                                  textAlign: "left",
                                  cursor: "pointer",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  color: "#053056",
                                }}
                              >
                                <span>{faq.q}</span>
                                <span style={{ fontSize: "16px", color: "#9CBE41", marginLeft: "12px" }}>
                                  {isOpen ? "−" : "+"}
                                </span>
                              </button>
                              {isOpen && (
                                <div style={{ padding: "14px 18px", borderTop: "1px solid #e2e8f0", fontSize: "13px", color: "#334155", lineHeight: "1.6", backgroundColor: "#ffffff" }}>
                                  {faq.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* SECTION 7: INQUIRY & BOOKING FORM */}
                      <div id="inquiry" style={{ margin: "40px 0 20px 0" }}>
                        <div id="stripe-01">
                          <div id="contactform">
                            <h3 style={{ fontSize: "22px", color: "#053056", margin: "0 0 8px 0" }}>
                              Book an Engineering Scope or Discovery Call
                            </h3>
                            <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#475569" }}>
                              Fill out the technical requirements below. Abu Hanif will review your scope, verify capacity, and schedule a technical discovery call within 24 hours.
                            </p>

                            {submittedMessage && (
                              <div
                                style={{
                                  padding: "16px",
                                  backgroundColor: "#064e3b",
                                  color: "#a7f3d0",
                                  border: "1px solid #059669",
                                  borderRadius: "4px",
                                  marginBottom: "20px",
                                  fontSize: "14px",
                                  lineHeight: "1.5",
                                }}
                              >
                                {submittedMessage}
                              </div>
                            )}

                            {errorMessage && (
                              <div
                                style={{
                                  padding: "16px",
                                  backgroundColor: "#7f1d1d",
                                  color: "#fecaca",
                                  border: "1px solid #dc2626",
                                  borderRadius: "4px",
                                  marginBottom: "20px",
                                  fontSize: "14px",
                                }}
                              >
                                {errorMessage}
                              </div>
                            )}

                            <form onSubmit={handleInquirySubmit}>
                              <div className="form-group" style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#053056", marginBottom: "4px" }}>
                                  Your Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={formState.name}
                                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                  placeholder="e.g. Marcus Thorne"
                                  style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "14px" }}
                                />
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                                <div className="form-group">
                                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#053056", marginBottom: "4px" }}>
                                    Work Email *
                                  </label>
                                  <input
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    placeholder="e.g. marcus@venture.io"
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "14px" }}
                                  />
                                </div>
                                <div className="form-group">
                                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#053056", marginBottom: "4px" }}>
                                    Phone / WhatsApp (Optional)
                                  </label>
                                  <input
                                    type="tel"
                                    value={formState.phone}
                                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "14px" }}
                                  />
                                </div>
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                                <div className="form-group">
                                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#053056", marginBottom: "4px" }}>
                                    Selected Engineering Scope *
                                  </label>
                                  <select
                                    value={formState.projectType}
                                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "14px", backgroundColor: "#ffffff" }}
                                  >
                                    {services.map((s) => (
                                      <option key={s.id} value={s.title}>
                                        {s.title} ({s.priceDisplay})
                                      </option>
                                    ))}
                                    <option value="Custom Engineering Architecture">Custom Engineering Architecture</option>
                                    <option value="Hourly Architecture Advisory ($140/hr)">Hourly Architecture Advisory ($140/hr)</option>
                                  </select>
                                </div>

                                <div className="form-group">
                                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#053056", marginBottom: "4px" }}>
                                    Estimated Project Budget *
                                  </label>
                                  <select
                                    value={formState.budgetRange}
                                    onChange={(e) => setFormState({ ...formState, budgetRange: e.target.value })}
                                    style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "14px", backgroundColor: "#ffffff" }}
                                  >
                                    <option value="$2,500 – $5,000 (Diagnostic / Audit)">$2,500 – $5,000 (Diagnostic / Audit)</option>
                                    <option value="$5,000 – $10,000 (Database / Edge Sprint)">$5,000 – $10,000 (Database / Edge Sprint)</option>
                                    <option value="$10,000 – $25,000 (Full-Stack Platform / MVP)">$10,000 – $25,000 (Full-Stack Platform / MVP)</option>
                                    <option value="$25,000+ (Enterprise Architecture / Distributed Pipeline)">$25,000+ (Enterprise Architecture)</option>
                                    <option value="$5,500 / month (Fractional Retainer)">$5,500 / month (Fractional Retainer)</option>
                                  </select>
                                </div>
                              </div>

                              <div className="form-group" style={{ marginBottom: "18px" }}>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#053056", marginBottom: "4px" }}>
                                  System Architecture Details &amp; Objectives *
                                </label>
                                <textarea
                                  required
                                  rows={4}
                                  value={formState.message}
                                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                  placeholder="Describe your current tech stack, performance bottlenecks, target launch timeline, or specific engineering goals..."
                                  style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "14px" }}
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                  padding: "12px 28px",
                                  backgroundColor: "#053056",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontWeight: "800",
                                  fontSize: "14px",
                                  cursor: isSubmitting ? "not-allowed" : "pointer",
                                  opacity: isSubmitting ? 0.7 : 1,
                                }}
                              >
                                {isSubmitting ? "Submitting Scope..." : "Submit Project Scope & Request Discovery Call ›"}
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Sidebar */}
                <div className="sidebar secondary-sidebar">
                  <div className="wrapper">
                    {/* Profile Snapshot */}
                    <div className="block" style={{ backgroundColor: "#f8fafc", padding: "18px", border: "1px solid #e2e8f0", borderRadius: "4px", marginBottom: "20px" }}>
                      <img
                        src="/images/profile.png"
                        alt="MD Abu Hanif Mia"
                        style={{
                          width: "100%",
                          borderRadius: "4px",
                          marginBottom: "12px",
                          border: "1px solid #cbd5e1",
                          display: "block",
                        }}
                      />
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#053056" }}>
                        MD Abu Hanif Mia
                      </h3>
                      <div style={{ fontSize: "12px", color: "#334155", fontWeight: "700", marginBottom: "8px" }}>
                        Staff Software Engineer &amp; Systems Architect
                      </div>
                      <div style={{ fontSize: "11px", color: "#065f46", fontWeight: "700", marginBottom: "12px" }}>
                        ● Q4 2026 / Booking Engineering Sprints
                      </div>
                      <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", margin: 0 }}>
                        9+ years architecting high-throughput distributed backends, Supabase integrations, and Next.js platforms deployed on Cloudflare Pages.
                      </p>
                    </div>

                    {/* SLA Guarantees */}
                    <div className="block" style={{ backgroundColor: "#053056", color: "#ffffff", padding: "18px", borderRadius: "4px", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#9CBE41", textTransform: "uppercase" }}>
                        Engineering Commitments
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", lineHeight: "1.6", color: "#e2e8f0" }}>
                        <li style={{ marginBottom: "6px" }}><strong>100% Client IP:</strong> You own all source code and assets.</li>
                        <li style={{ marginBottom: "6px" }}><strong>Mutual NDA First:</strong> Guaranteed confidentiality.</li>
                        <li style={{ marginBottom: "6px" }}><strong>30-Day Warranty:</strong> Free post-launch bug fixes.</li>
                        <li style={{ marginBottom: "6px" }}><strong>No Junior Hand-offs:</strong> Direct execution with Abu Hanif.</li>
                        <li><strong>Fixed Costs:</strong> SOW milestones with zero budget surprises.</li>
                      </ul>
                    </div>

                    {/* Client Feedback Quote */}
                    <div className="block" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px", borderRadius: "4px", marginBottom: "20px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", textTransform: "uppercase", marginBottom: "6px" }}>
                        Verified Client Review
                      </div>
                      <blockquote style={{ margin: 0, fontSize: "12px", color: "#1e3a5f", fontStyle: "italic", lineHeight: "1.5" }}>
                        &ldquo;Abu Hanif diagnosed and re-indexed our Postgres database during a peak scale sprint. P99 query latency fell from 1.8s to 18ms. Exceptional velocity and technical depth.&rdquo;
                      </blockquote>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "8px", fontWeight: "600" }}>
                        — Lead Architect, FinTech Platform
                      </div>
                    </div>

                    {/* Direct Contact Block */}
                    <div className="block" style={{ border: "1px solid #cbd5e1", padding: "16px", borderRadius: "4px", backgroundColor: "#ffffff", marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#053056" }}>
                        Direct Contact Info
                      </h4>
                      <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
                        <div><strong>Email:</strong> <a href="mailto:contact@abuhanif.dev" style={{ color: "#053056" }}>contact@abuhanif.dev</a></div>
                        <div><strong>Location:</strong> Dhaka, Bangladesh / Worldwide Remote</div>
                        <div><strong>GitHub:</strong> <a href="https://github.com/abuhanif254" target="_blank" rel="noopener noreferrer" style={{ color: "#053056" }}>abuhanif254</a></div>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="block" style={{ border: "1px solid #e2e8f0", padding: "14px", borderRadius: "4px", backgroundColor: "#f8fafc" }}>
                      <strong style={{ display: "block", fontSize: "12px", color: "#053056", marginBottom: "8px" }}>Portfolio Links:</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                        <Link href="/projects" style={{ color: "#053056", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Work Showcase &amp; Projects
                        </Link>
                        <Link href="/blog" style={{ color: "#053056", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Technical Architecture Blog
                        </Link>
                        <Link href="/admin" style={{ color: "#053056", textDecoration: "none", fontWeight: "600" }}>
                          &rsaquo; Admin Management Portal
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="clr"></div>
              </div>
            </div>

            {/* Global Footer */}
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
