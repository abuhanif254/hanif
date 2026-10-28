"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ServicePricing } from "../data/portfolio-data";

interface ServicesClientViewProps {
  services: ServicePricing[];
}

type ServiceCategory = "all" | "growth-seo" | "web-saas" | "systems-cloud";

export default function ServicesClientView({ services }: ServicesClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCardTab, setActiveCardTab] = useState<Record<string, "deliverables" | "stack" | "roi" | "process">>({});
  const [selectedBundle, setSelectedBundle] = useState<string[]>([]);
  const [explainPlanView, setExplainPlanView] = useState<"before" | "after">("after");
  const [estMonthlyTraffic, setEstMonthlyTraffic] = useState(15000);

  // Filter services by category and search
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchCategory =
        selectedCategory === "all" ||
        s.category === selectedCategory ||
        (selectedCategory === "web-saas" && (s.slug.includes("mvp") || s.slug.includes("custom"))) ||
        (selectedCategory === "systems-cloud" && (s.slug.includes("database") || s.slug.includes("cloudflare") || s.slug.includes("architecture") || s.slug.includes("telemetry") || s.slug.includes("fractional"))) ||
        (selectedCategory === "growth-seo" && (s.slug.includes("seo") || s.slug.includes("automation") || s.slug.includes("landing")));

      const matchSearch =
        searchQuery.trim() === "" ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.techStack && s.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchCategory && matchSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Bundle SOW calculations
  const bundleCalculation = useMemo(() => {
    if (selectedBundle.length === 0) return null;
    const selectedItems = services.filter((s) => selectedBundle.includes(s.id));
    const totalAmount = selectedItems.reduce((acc, curr) => {
      const num = parseInt(curr.priceDisplay.replace(/[^0-9]/g, ""), 10) || 0;
      return acc + num;
    }, 0);
    const discount = selectedItems.length >= 2 ? Math.round(totalAmount * 0.1) : 0;
    const finalAmount = totalAmount - discount;
    return {
      count: selectedItems.length,
      items: selectedItems,
      totalAmount,
      discount,
      finalAmount,
    };
  }, [selectedBundle, services]);

  function toggleBundleService(id: string) {
    setSelectedBundle((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function getCardTab(id: string) {
    return activeCardTab[id] || "deliverables";
  }

  function setCardTab(id: string, tab: "deliverables" | "stack" | "roi" | "process") {
    setActiveCardTab((prev) => ({ ...prev, [id]: tab }));
  }

  return (
    <div className="services-hub-wrapper" style={{ width: "100%", backgroundColor: "#060b19", color: "#e2e8f0" }}>
      {/* Visual Hero Header Bar */}
      <section
        className="services-hero-banner"
        style={{
          background: "linear-gradient(135deg, rgba(6, 11, 25, 0.98) 0%, rgba(11, 19, 43, 0.95) 55%, rgba(15, 23, 42, 0.92) 100%)",
          borderBottom: "1px solid rgba(56, 189, 248, 0.25)",
          padding: "36px 24px 28px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "10%",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              padding: "4px 12px",
              borderRadius: "999px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 10px #10b981",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>
              High-Velocity Engineering • Programmatic SEO • Custom SaaS &amp; Automation
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 900,
              lineHeight: 1.18,
              color: "#ffffff",
              letterSpacing: "-0.025em",
              marginBottom: "12px",
            }}
          >
            Engineering &amp; Growth Solutions: Built for Speed, Scale &amp; Dominance.
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 1.3vw, 16px)",
              color: "#94a3b8",
              maxWidth: "850px",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            From high-density <strong style={{ color: "#38bdf8" }}>Programmatic SEO</strong> and multi-channel{" "}
            <strong style={{ color: "#10b981" }}>Social Media Automation Bots</strong> to ultra-fast{" "}
            <strong style={{ color: "#ffffff" }}>Next.js 16 Landing Pages</strong> and production-grade{" "}
            <strong style={{ color: "#f59e0b" }}>Custom SaaS Platforms</strong>. Every engagement is delivered on a fixed-price,
            transparent milestone with 100% intellectual property ownership and an unconditional 30-day warranty.
          </p>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
              paddingTop: "14px",
              borderTop: "1px solid rgba(30, 41, 59, 0.8)",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px" }}>
              <span style={{ color: "#10b981", fontWeight: 800 }}>⚡ Sub-50ms TTFB</span>
              <span style={{ color: "#64748b" }}>•</span>
              <span style={{ color: "#cbd5e1" }}>Cloudflare V8 Isolates</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px" }}>
              <span style={{ color: "#38bdf8", fontWeight: 800 }}>🎯 100/100 Core Web Vitals</span>
              <span style={{ color: "#64748b" }}>•</span>
              <span style={{ color: "#cbd5e1" }}>Zero Layout Shift (CLS = 0)</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px" }}>
              <span style={{ color: "#f59e0b", fontWeight: 800 }}>🛡️ 100% Client IP</span>
              <span style={{ color: "#64748b" }}>•</span>
              <span style={{ color: "#cbd5e1" }}>Git Repo Handover</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px" }}>
              <span style={{ color: "#a855f7", fontWeight: 800 }}>⏱️ 5–14 Days Kickoff</span>
              <span style={{ color: "#64748b" }}>•</span>
              <span style={{ color: "#cbd5e1" }}>Fixed-Price SOW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Controls: Category Tabs & Search Filter */}
      <section style={{ maxWidth: "1140px", margin: "24px auto 16px auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            backgroundColor: "rgba(10, 18, 38, 0.85)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "10px",
            padding: "12px 16px",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {[
              { id: "all", label: "All Solutions", count: services.length },
              { id: "growth-seo", label: "Growth & SEO", count: 3 },
              { id: "web-saas", label: "Web & SaaS Engineering", count: 3 },
              { id: "systems-cloud", label: "Systems & Architecture", count: 5 },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as ServiceCategory)}
                  style={{
                    backgroundColor: isSelected ? "#2563eb" : "rgba(15, 23, 42, 0.6)",
                    color: isSelected ? "#ffffff" : "#94a3b8",
                    border: isSelected ? "1px solid #38bdf8" : "1px solid rgba(51, 65, 85, 0.8)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.18s ease",
                    boxShadow: isSelected ? "0 2px 10px rgba(37, 99, 235, 0.4)" : "none",
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    style={{
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.2)" : "rgba(30, 41, 59, 0.8)",
                      color: isSelected ? "#ffffff" : "#64748b",
                      borderRadius: "10px",
                      padding: "1px 6px",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div style={{ position: "relative", minWidth: "240px", flex: "1 1 240px", maxWidth: "340px" }}>
            <input
              type="text"
              placeholder="Search services (e.g., SEO, Next.js, Stripe, Postgres)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "rgba(6, 11, 25, 0.9)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "6px",
                padding: "8px 12px 8px 32px",
                fontSize: "12px",
                color: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid with Custom Animated Micro-Visualizers */}
      <section style={{ maxWidth: "1140px", margin: "0 auto 36px auto", padding: "0 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredServices.map((service) => {
            const currentTab = getCardTab(service.id);
            const isBundled = selectedBundle.includes(service.id);

            return (
              <article
                key={service.id}
                id={service.slug}
                style={{
                  backgroundColor: "rgba(10, 18, 38, 0.95)",
                  border: isBundled
                    ? "2px solid #10b981"
                    : "1px solid rgba(56, 189, 248, 0.28)",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: isBundled
                    ? "0 10px 30px rgba(16, 185, 129, 0.25)"
                    : "0 8px 25px rgba(0, 0, 0, 0.4)",
                  transition: "all 0.22s ease",
                }}
              >
                {/* Header Tag Bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                    <span
                      style={{
                        backgroundColor: "rgba(37, 99, 235, 0.2)",
                        border: "1px solid rgba(56, 189, 248, 0.4)",
                        color: "#38bdf8",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {service.category === "growth-seo"
                        ? "Growth & SEO"
                        : service.category === "web-saas"
                        ? "Web & SaaS"
                        : "Systems & Cloud"}
                    </span>
                    {service.isPopular && (
                      <span
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.2)",
                          border: "1px solid #10b981",
                          color: "#10b981",
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "11px",
                          fontWeight: 800,
                        }}
                      >
                        ★ Most Requested
                      </span>
                    )}
                  </div>

                  {/* Price & Timeline Badge */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                      {service.priceDisplay}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "3px" }}>
                      ⏱️ {service.timeline}
                    </div>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h2
                  style={{
                    fontSize: "19px",
                    fontWeight: 800,
                    color: "#f8fafc",
                    lineHeight: 1.3,
                    margin: "0 0 6px 0",
                  }}
                >
                  {service.title}
                </h2>

                <p style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                  {service.description}
                </p>

                {/* 🎨 DEDICATED ANIMATED MICRO-VISUALIZER CANVAS */}
                <div
                  style={{
                    backgroundColor: "rgba(6, 11, 25, 0.96)",
                    border: "1px solid rgba(30, 41, 59, 0.9)",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "16px",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "135px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {/* Visualizer 1: Programmatic & Technical SEO Radar */}
                  {service.slug.includes("seo") && (
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                          Lighthouse &amp; Schema Knowledge Radar
                        </span>
                        <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>● Active Indexing Engine</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", textAlign: "center" }}>
                        {[
                          { metric: "100", label: "Performance", color: "#10b981" },
                          { metric: "100", label: "SEO Score", color: "#10b981" },
                          { metric: "100", label: "Accessibility", color: "#10b981" },
                          { metric: "0.000", label: "CLS (Shift)", color: "#38bdf8" },
                        ].map((m) => (
                          <div
                            key={m.label}
                            style={{
                              backgroundColor: "rgba(15, 23, 42, 0.8)",
                              border: "1px solid rgba(56, 189, 248, 0.2)",
                              borderRadius: "6px",
                              padding: "6px 2px",
                            }}
                          >
                            <div style={{ fontSize: "15px", fontWeight: 900, color: m.color }}>{m.metric}</div>
                            <div style={{ fontSize: "9px", color: "#94a3b8" }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "10px",
                          fontFamily: "var(--font-mono), monospace",
                          color: "#38bdf8",
                          backgroundColor: "rgba(10, 18, 38, 0.6)",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        ✓ JSON-LD Graph Injected: /services/{service.slug} [Indexed]
                      </div>
                    </div>
                  )}

                  {/* Visualizer 2: Social Media Automation Dispatch Mesh */}
                  {service.slug.includes("automation") && (
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#a855f7", textTransform: "uppercase" }}>
                          Multi-Platform Webhook Dispatcher
                        </span>
                        <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>● Redis BullMQ Active</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                        {[
                          { platform: "X / Twitter", status: "Thread 1/5 Sent", icon: "🐦" },
                          { platform: "LinkedIn", status: "Card Published", icon: "💼" },
                          { platform: "Discord", status: "Rich Webhook OK", icon: "💬" },
                          { platform: "Telegram", status: "Bot Broadcast", icon: "✈️" },
                        ].map((p) => (
                          <div
                            key={p.platform}
                            style={{
                              backgroundColor: "rgba(15, 23, 42, 0.8)",
                              border: "1px solid rgba(168, 85, 247, 0.3)",
                              borderRadius: "6px",
                              padding: "6px 4px",
                              textAlign: "center",
                            }}
                          >
                            <div style={{ fontSize: "14px" }}>{p.icon}</div>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                              {p.platform}
                            </div>
                            <div style={{ fontSize: "8.5px", color: "#10b981", marginTop: "2px" }}>✓ {p.status}</div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "10px",
                          fontFamily: "var(--font-mono), monospace",
                          color: "#a855f7",
                          backgroundColor: "rgba(10, 18, 38, 0.6)",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        $ dispatch --queue=social_events --concurrency=8 [200 OK]
                      </div>
                    </div>
                  )}

                  {/* Visualizer 3: High-Converting Landing Pages & CRO */}
                  {service.slug.includes("landing") && (
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase" }}>
                          Conversion Funnel Flow &amp; Edge Speed
                        </span>
                        <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>TTFB: 38ms</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {[
                          { stage: "Sub-50ms Global Edge Render", pct: "100%", width: "100%", color: "#10b981" },
                          { stage: "Interactive SOW Calculator Engaged", pct: "64%", width: "64%", color: "#38bdf8" },
                          { stage: "Checkout / Consultation Booked", pct: "28%", width: "28%", color: "#f59e0b" },
                        ].map((f) => (
                          <div key={f.stage} style={{ fontSize: "9.5px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                              <span>{f.stage}</span>
                              <span style={{ fontWeight: 800, color: f.color }}>{f.pct}</span>
                            </div>
                            <div style={{ height: "4px", backgroundColor: "#1e293b", borderRadius: "2px", overflow: "hidden", marginTop: "2px" }}>
                              <div style={{ height: "100%", width: f.width, backgroundColor: f.color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "6px", fontSize: "10px", color: "#94a3b8", textAlign: "right" }}>
                        Lift: <strong style={{ color: "#10b981" }}>+28% Conversion vs Standard Templates</strong>
                      </div>
                    </div>
                  )}

                  {/* Visualizer 4: Bespoke Full-Stack Web Platform & SaaS */}
                  {service.slug.includes("custom") || service.slug.includes("mvp") ? (
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                          Enterprise Architecture Stack
                        </span>
                        <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>Next.js 16 + React 19</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                        <div style={{ background: "#0b132b", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "10px", fontWeight: 800, color: "#38bdf8" }}>App Router</div>
                          <div style={{ fontSize: "9px", color: "#94a3b8" }}>Server Components</div>
                        </div>
                        <div style={{ background: "#0b132b", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "10px", fontWeight: 800, color: "#10b981" }}>Supabase RLS</div>
                          <div style={{ fontSize: "9px", color: "#94a3b8" }}>PostgreSQL Policies</div>
                        </div>
                        <div style={{ background: "#0b132b", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px", textAlign: "center" }}>
                          <div style={{ fontSize: "10px", fontWeight: 800, color: "#f59e0b" }}>Stripe Billing</div>
                          <div style={{ fontSize: "9px", color: "#94a3b8" }}>Metered Invoicing</div>
                        </div>
                      </div>
                      <div style={{ marginTop: "8px", fontSize: "10px", color: "#cbd5e1", textAlign: "center" }}>
                        ✓ <strong style={{ color: "#ffffff" }}>100% Client Intellectual Property Handover</strong>
                      </div>
                    </div>
                  ) : null}

                  {/* Visualizer 5: PostgreSQL Database Query Optimization */}
                  {service.slug.includes("database") && (
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                          EXPLAIN ANALYZE Cost Optimizer
                        </span>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            type="button"
                            onClick={() => setExplainPlanView("before")}
                            style={{
                              background: explainPlanView === "before" ? "#ef4444" : "rgba(30, 41, 59, 0.6)",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "3px",
                              fontSize: "9px",
                              padding: "2px 6px",
                              cursor: "pointer",
                            }}
                          >
                            Before
                          </button>
                          <button
                            type="button"
                            onClick={() => setExplainPlanView("after")}
                            style={{
                              background: explainPlanView === "after" ? "#10b981" : "rgba(30, 41, 59, 0.6)",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "3px",
                              fontSize: "9px",
                              padding: "2px 6px",
                              cursor: "pointer",
                            }}
                          >
                            After
                          </button>
                        </div>
                      </div>
                      {explainPlanView === "before" ? (
                        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#f87171" }}>
                          <div>Seq Scan on orders (cost=0.00..58914.00)</div>
                          <div>Execution Time: <strong>4,210.4ms</strong> • Buffer Hits: 0.6%</div>
                          <div style={{ color: "#94a3b8", fontSize: "9px" }}>⚠️ High disk I/O &amp; connection deadlocks</div>
                        </div>
                      ) : (
                        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#4ade80" }}>
                          <div>Index Scan using idx_orders_composite (cost=0.42..8.44)</div>
                          <div>Execution Time: <strong>11.8ms</strong> • Buffer Hits: 100%</div>
                          <div style={{ color: "#38bdf8", fontSize: "9px" }}>✓ 99.7% Latency Drop • Sub-20ms P99 Verified</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Visualizer 6: Cloudflare Edge Migration & Telemetry */}
                  {(service.slug.includes("cloudflare") || service.slug.includes("telemetry") || service.slug.includes("architecture")) && (
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#10b981", textTransform: "uppercase" }}>
                          Global Edge Observability &amp; Latency
                        </span>
                        <span style={{ fontSize: "10px", color: "#38bdf8" }}>99.994% Uptime</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", fontSize: "10px" }}>
                        {[
                          { pop: "DAC", ping: "18ms" },
                          { pop: "SIN", ping: "22ms" },
                          { pop: "LHR", ping: "28ms" },
                          { pop: "IAD", ping: "32ms" },
                        ].map((p) => (
                          <div
                            key={p.pop}
                            style={{
                              backgroundColor: "rgba(15, 23, 42, 0.8)",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              borderRadius: "4px",
                              padding: "4px",
                              textAlign: "center",
                            }}
                          >
                            <span style={{ color: "#94a3b8", fontSize: "9px" }}>{p.pop}: </span>
                            <strong style={{ color: "#10b981" }}>{p.ping}</strong>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "6px", fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>
                        Cloud Bill Impact: <strong style={{ color: "#10b981" }}>-64% AWS compute spend eliminated</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Sub-Navigation Tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
                    paddingBottom: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {[
                    { id: "deliverables", label: "Deliverables" },
                    { id: "stack", label: "Tech Stack" },
                    { id: "roi", label: "Impact & ROI" },
                    { id: "process", label: "Roadmap" },
                  ].map((tab) => {
                    const isTabSelected = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCardTab(service.id, tab.id as any)}
                        style={{
                          backgroundColor: isTabSelected ? "rgba(37, 99, 235, 0.3)" : "transparent",
                          color: isTabSelected ? "#38bdf8" : "#94a3b8",
                          border: isTabSelected ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid transparent",
                          borderRadius: "4px",
                          padding: "3px 8px",
                          fontSize: "11px",
                          fontWeight: isTabSelected ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content Display */}
                <div style={{ flex: 1, minHeight: "130px", marginBottom: "16px" }}>
                  {currentTab === "deliverables" && (
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {service.deliverables.slice(0, 4).map((d, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#cbd5e1" }}>
                          <span style={{ color: "#10b981", fontWeight: 900, flexShrink: 0 }}>✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                      {service.deliverables.length > 4 && (
                        <li style={{ fontSize: "11px", color: "#38bdf8", marginTop: "2px" }}>
                          + {service.deliverables.length - 4} additional enterprise deliverables
                        </li>
                      )}
                    </ul>
                  )}

                  {currentTab === "stack" && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(service.techStack || ["Next.js 16", "TypeScript", "PostgreSQL", "Cloudflare Pages", "Docker"]).map((tech) => (
                        <span
                          key={tech}
                          style={{
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid rgba(56, 189, 248, 0.25)",
                            color: "#38bdf8",
                            borderRadius: "4px",
                            padding: "3px 8px",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {currentTab === "roi" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                      <div style={{ backgroundColor: "rgba(6, 11, 25, 0.6)", padding: "8px", borderRadius: "6px", border: "1px solid #1e293b" }}>
                        <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>Primary Measurable Benchmark:</div>
                        <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#10b981", marginTop: "2px" }}>
                          {service.roiMetric || "Sub-50ms Global P99 Latency & Zero Regressions"}
                        </div>
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#cbd5e1" }}>
                        🛡️ <strong>Unconditional 30-Day SLA Warranty</strong>: Every defect, performance regression, or configuration bug patched at zero extra charge.
                      </div>
                    </div>
                  )}

                  {currentTab === "process" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px", color: "#cbd5e1" }}>
                      {(service.engagementSteps || [
                        "1. Technical Discovery & Scope Alignment (Architecture RFC)",
                        "2. Milestone Sprint Execution (Weekly staging demo branch)",
                        "3. Security & Core Web Vitals Verification (100/100 Target)",
                        "4. Production Cutover & Full IP Code Handover",
                      ]).map((step, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "6px" }}>
                          <span style={{ color: "#38bdf8", fontWeight: 800 }}>•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(30, 41, 59, 0.8)",
                    marginTop: "auto",
                  }}
                >
                  <Link
                    href={`/pricing#inquiry`}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      borderRadius: "6px",
                      fontWeight: 700,
                      fontSize: "12.5px",
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
                      transition: "background 0.15s ease",
                      textAlign: "center",
                    }}
                  >
                    Book Sprint ⚡
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleBundleService(service.id)}
                    title={isBundled ? "Remove from custom SOW bundle" : "Add to custom SOW bundle"}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: isBundled ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.8)",
                      border: isBundled ? "1px solid #10b981" : "1px solid rgba(56, 189, 248, 0.3)",
                      color: isBundled ? "#10b981" : "#cbd5e1",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isBundled ? "✓ Added" : "+ SOW Bundle"}
                  </button>

                  <Link
                    href={`/services/${service.slug}`}
                    style={{
                      padding: "8px 10px",
                      color: "#94a3b8",
                      fontSize: "12px",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                    title="View comprehensive technical service specification"
                  >
                    Details ›
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Floating Multi-Service SOW Bundle Calculator Strip */}
      {bundleCalculation && (
        <aside
          aria-label="Custom Statement of Work Package Calculator"
          style={{
            position: "sticky",
            bottom: "16px",
            maxWidth: "1140px",
            margin: "0 auto 24px auto",
            padding: "0 16px",
            zIndex: 30,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(6, 11, 25, 0.98)",
              border: "2px solid #10b981",
              borderRadius: "10px",
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              boxShadow: "0 12px 35px rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>
                  📋 Custom SOW Package: {bundleCalculation.count} Services Selected
                </span>
                {bundleCalculation.discount > 0 && (
                  <span
                    style={{
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid #10b981",
                      color: "#10b981",
                      borderRadius: "4px",
                      padding: "1px 6px",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    10% Multi-Service Bundle Savings Applied!
                  </span>
                )}
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>
                Selected: {bundleCalculation.items.map((i) => i.title.split("&")[0]).join(" + ")}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ textAlign: "right" }}>
                {bundleCalculation.discount > 0 && (
                  <div style={{ fontSize: "11.5px", color: "#ef4444", textDecoration: "line-through" }}>
                    ${bundleCalculation.totalAmount.toLocaleString()}
                  </div>
                )}
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#10b981" }}>
                  ${bundleCalculation.finalAmount.toLocaleString()}
                </div>
              </div>

              <Link
                href={`/pricing#inquiry`}
                style={{
                  backgroundColor: "#10b981",
                  color: "#050e1d",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  fontSize: "13px",
                  textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(16, 185, 129, 0.4)",
                }}
              >
                Execute SOW Discovery Call ⚡
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* Frequently Asked Questions Section (with Schema Accordion) */}
      <section
        style={{
          maxWidth: "1140px",
          margin: "36px auto",
          padding: "32px 20px",
          backgroundColor: "rgba(10, 18, 38, 0.8)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          borderRadius: "12px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "0 0 8px 0" }}>
            Frequently Asked Engineering &amp; Engagement Questions
          </h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
            Everything you need to know about milestone deliverables, code IP handover, and production SLAs.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          {[
            {
              q: "Why fixed-price milestone sprints instead of hourly agency billing?",
              a: "Hourly billing penalizes rapid execution and encourages budget creep. Fixed-price milestone sprints ensure clear scope, fixed costs, and guaranteed timelines before a single line of code is written. I assume delivery risk, you get production-verified deliverables.",
            },
            {
              q: "Who owns the intellectual property and code repository?",
              a: "You do. 100% of all code, git history, documentation, database schemas, and assets belong exclusively to your company under standard clean IP assignment terms from day one.",
            },
            {
              q: "How does the Programmatic SEO engineering service differ from traditional SEO?",
              a: "Traditional SEO is manual and slow. Programmatic SEO creates automated data pipelines that generate thousands of fast, highly-targeted, indexable pages with full JSON-LD schema graphs and 100/100 Core Web Vitals to capture high-intent organic search volume.",
            },
            {
              q: "What is your typical turnaround time for kickoff?",
              a: "Landing pages and diagnostic audits commence within 48 to 72 hours of an executed Statement of Work. Full-Stack SaaS MVP builds are scheduled in dedicated engineering blocks to ensure 100% focus.",
            },
            {
              q: "Do you offer post-launch support and bug warranties?",
              a: "Yes. Every fixed sprint includes an unconditional 30-day post-launch warranty covering any bugs, edge regressions, or configuration defects at zero additional charge.",
            },
            {
              q: "Can you collaborate with our existing engineering team?",
              a: "Absolutely. I frequently operate as a fractional Staff Architect, reviewing PRs, designing system RFCs, and mentoring internal engineers in production-grade TypeScript, Go, and PostgreSQL patterns.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "rgba(6, 11, 25, 0.7)",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#38bdf8", margin: "0 0 8px 0" }}>
                {item.q}
              </h3>
              <p style={{ fontSize: "12.5px", color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion Banner (High-Contrast Midnight Slate) */}
      <section
        style={{
          maxWidth: "1140px",
          margin: "0 auto 48px auto",
          padding: "40px 28px",
          backgroundColor: "#0b152d",
          backgroundImage: "linear-gradient(135deg, #0b152d 0%, #0d2042 50%, #07152b 100%)",
          border: "1px solid rgba(56, 189, 248, 0.4)",
          borderRadius: "14px",
          textAlign: "center",
          boxShadow: "0 24px 50px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(37, 99, 235, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Decorative Glow */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "20%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              padding: "5px 16px",
              borderRadius: "999px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 8px #10b981",
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "1px" }}>
              ⚡ Fixed Sprints • 100% Client IP • Zero-Bug 30-Day SLA
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(22px, 2.5vw, 32px)",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 12px 0",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            Ready to Architect Your Next Scalable Breakthrough?
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "#cbd5e1",
              maxWidth: "680px",
              margin: "0 auto 20px auto",
              lineHeight: 1.6,
            }}
          >
            Schedule a direct 15-minute architecture discovery call or receive an instantaneous Statement of Work proposal.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
              margin: "0 auto 24px auto",
              maxWidth: "760px",
            }}
          >
            {[
              "⚡ 48-Hour Sprint Kickoff",
              "🔒 100% Git & Code Ownership",
              "🛡️ 30-Day Post-Launch Warranty",
              "🤝 Fixed-Scope Milestone Pricing",
            ].map((badge) => (
              <span
                key={badge}
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  color: "#94a3b8",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "6px",
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="/pricing#inquiry"
              style={{
                backgroundColor: "#2563eb",
                backgroundImage: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                padding: "12px 26px",
                borderRadius: "6px",
                fontWeight: 800,
                fontSize: "13.5px",
                textDecoration: "none",
                boxShadow: "0 4px 18px rgba(37,99,235,0.55)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Book 15-Min Discovery Call 📅
            </Link>
            <Link
              href="/pricing#sow-builder"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid #38bdf8",
                color: "#38bdf8",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "13.5px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Instant SOW Proposal Generator 📋
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
