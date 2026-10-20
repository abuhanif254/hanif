"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only reveal if user has never dismissed the privacy notice
    const dismissed =
      window.localStorage.getItem("hanif-privacy-dismissed") ||
      window.localStorage.getItem("rjf-cookie-consent");
    if (!dismissed) {
      // Delay slightly so it doesn't jarringly animate during initial paint
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleDismiss() {
    window.localStorage.setItem("hanif-privacy-dismissed", "true");
    window.localStorage.setItem("rjf-cookie-consent", "necessary");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      className="privacy-telemetry-notice"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        maxWidth: "420px",
        width: "calc(100vw - 48px)",
        backgroundColor: "#0b132b",
        border: "1px solid #1e293b",
        borderRadius: "8px",
        padding: "18px 20px",
        color: "#ffffff",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45)",
        zIndex: 9999,
        fontFamily: "var(--font-sans), sans-serif",
        lineHeight: 1.5,
      }}
      aria-label="Privacy & Telemetry Notice"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              display: "inline-block",
              boxShadow: "0 0 8px #10b981",
            }}
          />
          <strong style={{ fontSize: "13px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Privacy &amp; Telemetry Notice
          </strong>
        </div>
        <button
          onClick={handleDismiss}
          type="button"
          aria-label="Dismiss notice"
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: "18px",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
          }}
        >
          &times;
        </button>
      </div>

      <p style={{ fontSize: "12.5px", color: "#cbd5e1", margin: "0 0 14px 0" }}>
        This portfolio uses essential browser storage for UI preferences and Cloudflare edge latency benchmarks.{" "}
        <strong style={{ color: "#ffffff" }}>Zero third-party marketing pixels or tracking cookies are deployed.</strong>
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <Link
          href="/status"
          style={{
            fontSize: "12px",
            color: "#38bdf8",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            fontWeight: "600",
          }}
        >
          View Live SLA &amp; Telemetry &rsaquo;
        </Link>
        <button
          onClick={handleDismiss}
          type="button"
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
        >
          Acknowledge &amp; Dismiss
        </button>
      </div>
    </aside>
  );
}
