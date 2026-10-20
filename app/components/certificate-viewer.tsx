"use client";

import { useEffect, useState } from "react";

export default function CertificateViewer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open on hash #certificate-modal
    const checkHash = () => {
      if (window.location.hash === "#certificate-modal") {
        setIsOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    // Click handler for any element with data-certificate-trigger or id ph-certificate-trigger
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "[data-certificate-trigger], #ph-certificate-trigger, a[href='#certificate-modal']"
      );
      if (target) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("click", handleGlobalClick);

    // Escape key closes modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("hashchange", checkHash);
      document.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (window.location.hash === "#certificate-modal") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Programming Hero Verified Certificate Modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "rgba(4, 31, 54, 0.88)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflowY: "auto",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#0b132b",
          border: "2px solid #2563eb",
          borderRadius: "8px",
          maxWidth: "880px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 22px",
            borderBottom: "1px solid #1e293b",
            backgroundColor: "#070f1e",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "3px 8px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: "800",
                fontSize: "11px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              Verified Credential
            </span>
            <strong style={{ fontSize: "16px", color: "#ffffff" }}>
              Programming Hero • Certificate of Excellence
            </strong>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: "#111e38",
              border: "1px solid #1e293b",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Certificate Image Frame */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #2563eb",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <img
              src="/images/programming-hero-certificate.png"
              alt="Programming Hero Certificate of Completion with Excellence awarded to MD Abu Hanif Mia"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "4px",
                display: "block",
              }}
            />
          </div>

          {/* Verification Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              backgroundColor: "#070f1e",
              padding: "16px",
              borderRadius: "6px",
              border: "1px solid #1e293b",
              marginBottom: "18px",
              fontSize: "13px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "#cbd5e1", textTransform: "uppercase", fontWeight: "700" }}>
                Recipient:
              </span>
              <div style={{ fontWeight: "800", color: "#ffffff", marginTop: "2px" }}>
                MD Abu Hanif Mia
              </div>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#cbd5e1", textTransform: "uppercase", fontWeight: "700" }}>
                Course Completed:
              </span>
              <div style={{ fontWeight: "800", color: "#38bdf8", marginTop: "2px" }}>
                Complete Web Development Course
              </div>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#cbd5e1", textTransform: "uppercase", fontWeight: "700" }}>
                Credential Identifier:
              </span>
              <div style={{ fontWeight: "800", color: "#ffffff", fontFamily: "monospace", marginTop: "2px" }}>
                Batch-12 • ID: WEB12-3991
              </div>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#cbd5e1", textTransform: "uppercase", fontWeight: "700" }}>
                Issuing Authority:
              </span>
              <div style={{ fontWeight: "800", color: "#ffffff", marginTop: "2px" }}>
                Jhankar Mahbub (CEO, Programming Hero)
              </div>
            </div>
          </div>

          <div style={{ fontSize: "12.5px", color: "#e2e8f0", lineHeight: "1.6", marginBottom: "18px" }}>
            <strong>Curriculum &amp; Verified Competencies:</strong> Comprehensive mastery of modern JavaScript, HTML5 semantic structure, CSS3 responsive layouts, React ecosystem, state management, asynchronous REST APIs, and full-stack project deployment with strict production quality requirements.
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
            <a
              href="/images/programming-hero-certificate.png"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 18px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "13px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "background-color 0.15s ease",
              }}
            >
              📥 View Full High-Res PNG ↗
            </a>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: "8px 18px",
                backgroundColor: "#073a66",
                color: "#ffffff",
                border: "1px solid #0a365c",
                fontWeight: "700",
                fontSize: "13px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
