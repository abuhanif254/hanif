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

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
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
                  marginTop: "10px",
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="img2">
        <div className="wrapper">
          <Link className="pabttn pa1" href="/projects?category=systems">
            Distributed <br /> Systems
          </Link>
          <Link className="pabttn pa2" href="/projects?category=web">
            Full-Stack <br /> Engineering
          </Link>
          <Link className="pabttn pa3" href="/pricing">
            Architecture <br /> &amp; Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
