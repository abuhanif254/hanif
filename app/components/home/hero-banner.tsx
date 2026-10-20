"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  "99.99% Production Uptime for 10M+ Daily Users",
  "Sub-25ms Global P99 Latency at the Edge",
  "Reduced Cloud Infrastructure Costs by 64%",
  "Zero Security Incidents Across 3.5M Identities",
  "10x PostgreSQL Query Throughput via Index Optimization",
];

const terminalCommands = [
  { cmd: "curl -sI https://abuhanifmia.com/api/ping", output: "HTTP/2 200 OK • Region: DAC • Edge TTFB: 18ms" },
  { cmd: "pg_stat_statements | summarize p99", output: "Top 50 queries tuned • 0 table sequential scans" },
  { cmd: "tokio::runtime::Builder::new_multi_thread()", output: "Concurrent worker pool active • 12M events/sec" },
];

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCmd, setActiveCmd] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
      setActiveCmd((prev) => (prev + 1) % terminalCommands.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="imgwrap">
      <div id="img1">
        <div className="text-wrapper">
          <div id="banner-tagline">Clean Architecture • High Performance • Scalable Systems</div>
          <div id="slideshow">
            {slides.map((text, idx) => (
              <div
                key={idx}
                className={`slide slide${idx + 1}`}
                style={{
                  display: activeSlide === idx ? "block" : "none",
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#ffffff",
                  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                  marginTop: "8px",
                }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Interactive Micro Terminal Widget */}
          <div
            style={{
              marginTop: "16px",
              padding: "10px 16px",
              backgroundColor: "rgba(7, 15, 30, 0.9)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "6px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "12.5px",
              display: "inline-block",
              maxWidth: "95%",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div style={{ color: "#38bdf8", marginBottom: "4px", fontWeight: "600" }}>
              <span style={{ color: "#10b981" }}>hanif@edge:~$</span> {terminalCommands[activeCmd].cmd}
            </div>
            <div style={{ color: "#cbd5e1", fontSize: "11.5px" }}>
              &rsaquo; {terminalCommands[activeCmd].output}
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
