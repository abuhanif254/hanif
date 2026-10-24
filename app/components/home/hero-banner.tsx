"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  "10x PostgreSQL Query Throughput via Composite & Partial Indexing",
  "99.99% Production Uptime SLA Across 10M+ Daily Requests",
  "Sub-25ms Global P99 Latency on Cloudflare Pages Edge",
  "Reduced Cloud Infrastructure Spend by 64% via V8 Isolates",
  "Zero Security Incidents Across 3.5M Enterprise Identities",
];

interface TerminalCommand {
  label: string;
  cmd: string;
  output: string;
}

const defaultCommands: TerminalCommand[] = [
  {
    label: "Edge Ping",
    cmd: "curl -sI /api/ping",
    output: "HTTP/2 200 OK • Region: DAC • Live Cloudflare Edge • TTFB: 18ms",
  },
  {
    label: "Postgres Tuning",
    cmd: "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 1;",
    output: "idx_orders_composite hit 100% • sequential scans: 0 • p99: 4.2ms",
  },
  {
    label: "Rust Concurrency",
    cmd: "tokio::runtime::Builder::new_multi_thread().worker_threads(8).build()",
    output: "Thread pool initialized • 12,000,000 events/sec channel capacity",
  },
];

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isPinging, setIsPinging] = useState(false);
  const [livePingResult, setLivePingResult] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  async function handleRunLivePing() {
    setIsPinging(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/ping", { cache: "no-store" });
      const elapsed = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setLivePingResult(
          `HTTP/2 200 OK • Region: ${data.region || "DAC"} • Real-Time Browser TTFB: ${elapsed}ms • Edge SLA: 99.99%`
        );
      } else {
        setLivePingResult(`HTTP ${res.status} • Measured in ${elapsed}ms`);
      }
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setLivePingResult(`Ping Completed (${elapsed}ms) • Local Node Environment`);
    } finally {
      setIsPinging(false);
    }
  }

  const currentCommand = defaultCommands[activeTab];
  const currentOutput =
    activeTab === 0 && livePingResult ? livePingResult : currentCommand.output;

  return (
    <div className="imgwrap">
      <div id="img1">
        <div
          className="text-wrapper"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
            gap: "32px",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left Column: Core Engineering Value Proposition + Interactive Terminal */}
          <div style={{ flex: "1 1 560px" }}>
            <div
              id="banner-tagline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                padding: "5px 12px",
                borderRadius: "999px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                  display: "inline-block",
                }}
              />
              <span>Clean Architecture • High Performance • Scalable Systems</span>
            </div>

            <div
              style={{
                fontSize: "clamp(24px, 3vw, 33px)",
                fontWeight: 900,
                lineHeight: 1.18,
                color: "#f8fafc",
                letterSpacing: "-0.02em",
                marginBottom: "10px",
              }}
            >
              Architecting Sub-25ms Distributed Systems, Next.js 16 Edge Platforms &amp; Tuned Databases.
            </div>

            <div id="slideshow" style={{ minHeight: "28px" }}>
              {slides.map((text, idx) => (
                <div
                  key={idx}
                  className={`slide slide${idx + 1}`}
                  style={{
                    display: activeSlide === idx ? "flex" : "none",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    fontSize: "15.5px",
                    color: "#38bdf8",
                    marginTop: "4px",
                  }}
                >
                  <span style={{ color: "#10b981" }}>✓</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Interactive Systems Telemetry Terminal */}
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                backgroundColor: "rgba(6, 11, 25, 0.96)",
                border: "1px solid rgba(56, 189, 248, 0.32)",
                borderRadius: "8px",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "12.5px",
                width: "100%",
                maxWidth: "620px",
                boxShadow: "0 8px 28px rgba(0, 0, 0, 0.45)",
              }}
            >
              {/* Terminal Switcher Tabs */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "8px",
                  borderBottom: "1px solid rgba(30, 41, 59, 0.85)",
                  paddingBottom: "8px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: "4px", marginRight: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                </div>

                {defaultCommands.map((item, idx) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    style={{
                      background: activeTab === idx ? "rgba(37, 99, 235, 0.3)" : "transparent",
                      color: activeTab === idx ? "#38bdf8" : "#94a3b8",
                      border: activeTab === idx ? "1px solid #2563eb" : "1px solid transparent",
                      borderRadius: "4px",
                      padding: "2px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.label}
                  </button>
                ))}

                {activeTab === 0 && (
                  <button
                    type="button"
                    onClick={handleRunLivePing}
                    disabled={isPinging}
                    style={{
                      marginLeft: "auto",
                      background: isPinging ? "#1e293b" : "#10b981",
                      color: isPinging ? "#94a3b8" : "#050e1d",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: isPinging ? "default" : "pointer",
                      transition: "all 0.15s ease",
                    }}
                    title="Send a real-time fetch request to Cloudflare Edge API"
                  >
                    {isPinging ? "Pinging..." : "⚡ Run Live Ping"}
                  </button>
                )}
              </div>

              <div style={{ color: "#38bdf8", marginBottom: "4px", fontWeight: "600", wordBreak: "break-all" }}>
                <span style={{ color: "#10b981" }}>hanif@edge:~$</span> {currentCommand.cmd}
              </div>
              <div style={{ color: "#cbd5e1", fontSize: "11.5px", lineHeight: "1.4" }}>
                &rsaquo; <span style={{ color: activeTab === 0 && livePingResult ? "#4ade80" : "inherit" }}>{currentOutput}</span>
              </div>
            </div>

            {/* High-Conversion Hero Action Buttons */}
            <div
              className="hero-action-buttons"
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minHeight: "44px",
                  padding: "10px 20px",
                  background: "#2563eb",
                  color: "#ffffff",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 2px 10px rgba(37,99,235,0.4)",
                  transition: "all 0.15s ease",
                }}
              >
                Explore Case Studies ⚡
              </Link>

              <Link
                href="/pricing#sow-builder"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minHeight: "44px",
                  padding: "10px 18px",
                  background: "rgba(15, 23, 42, 0.85)",
                  color: "#f8fafc",
                  border: "1px solid #38bdf8",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                Instant SOW Builder 📋
              </Link>

              <Link
                href="/pricing#inquiry"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minHeight: "44px",
                  padding: "10px 18px",
                  background: "transparent",
                  color: "#cbd5e1",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                Book Discovery Call 📅
              </Link>
            </div>
          </div>

          {/* Right Column: Executive Architect Identity Card (Clean Framed Portrait) */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
              maxWidth: "360px",
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "132px",
                height: "132px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #38bdf8",
                background: "radial-gradient(circle at 50% 35%, #1e293b 0%, #0b132b 100%)",
                boxShadow: "0 0 24px rgba(56, 189, 248, 0.25)",
                marginBottom: "14px",
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/profile.png"
                alt="MD Abu Hanif Mia - Staff Software Engineer & Systems Architect"
                width={132}
                height={132}
                priority
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </div>

            <div style={{ fontSize: "19px", fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
              MD Abu Hanif Mia
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginTop: "4px",
                marginBottom: "14px",
              }}
            >
              Staff Software Engineer &amp; Architect
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                width: "100%",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  background: "#060b19",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  padding: "8px",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#10b981" }}>99.99%</div>
                <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>Production SLA</div>
              </div>
              <div
                style={{
                  background: "#060b19",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  padding: "8px",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#38bdf8" }}>12M/sec</div>
                <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>Peak Telemetry</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                width: "100%",
                paddingTop: "10px",
                borderTop: "1px solid #1e293b",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <a
                href="https://github.com/abuhanif254"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cbd5e1", textDecoration: "none" }}
              >
                GitHub ↗
              </a>
              <span style={{ color: "#334155" }}>•</span>
              <a
                href="https://linkedin.com/in/abuhanif"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cbd5e1", textDecoration: "none" }}
              >
                LinkedIn ↗
              </a>
              <span style={{ color: "#334155" }}>•</span>
              <Link href="/resume" style={{ color: "#38bdf8", textDecoration: "none" }}>
                Resume / CV ›
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="img2">
        <div className="wrapper">
          <Link className="pabttn pa1" href="/projects?category=systems" title="View Distributed Systems Architecture">
            Distributed <br /> Systems ⚡
          </Link>
          <Link className="pabttn pa2" href="/projects?category=web" title="Explore Full-Stack Engineering Case Studies">
            Full-Stack <br /> Engineering 🛠
          </Link>
          <Link className="pabttn pa3" href="/pricing" title="View Fixed Sprints & SOW Pricing Matrix">
            Fixed Sprints <br /> &amp; Pricing 💰
          </Link>
        </div>
      </div>
    </div>
  );
}
