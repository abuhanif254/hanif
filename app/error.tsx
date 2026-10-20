"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error caught:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0b132b",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          background: "#111e38",
          border: "1px solid #1e293b",
          borderTop: "4px solid #ef4444",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ fontSize: "22px", margin: "0 0 10px 0", color: "#f87171" }}>
          System Runtime Exception
        </h2>
        <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px 0" }}>
          An unexpected error occurred while executing this component. You can attempt to reset the application state or return to safety.
        </p>

        {error.digest && (
          <div
            style={{
              padding: "8px 12px",
              background: "#071324",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#94a3b8",
              fontFamily: "monospace",
              marginBottom: "24px",
              wordBreak: "break-all",
            }}
          >
            Digest ID: {error.digest}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(37,99,235,0.4)",
            }}
          >
            ↻ Retry Execution
          </button>
          <Link
            href="/"
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#e2e8f0",
              border: "1px solid #334155",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
