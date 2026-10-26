"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [isTotpRequired, setIsTotpRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [strikesRemaining, setStrikesRemaining] = useState<number | null>(null);

  // Probe auth status & 2FA requirement on mount
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace("/admin");
        }
        if (data.totpConfigured) {
          setIsTotpRequired(true);
        }
      })
      .catch(() => {});
  }, [router]);

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: passcode.trim(),
          totpCode: totpCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful authentication: redirect to admin control center
        window.location.href = "/admin";
      } else {
        setErrorMessage(data.error || "Authentication failed. Invalid credentials.");
        if (typeof data.strikesRemaining === "number") {
          setStrikesRemaining(data.strikesRemaining);
        }
        if (data.totpRequired) {
          setIsTotpRequired(true);
        }
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Network or server connection error. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#071324",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "#0a192f",
          border: "1px solid #1e293b",
          borderRadius: "8px",
          padding: "36px 40px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛡️</div>

        <h1 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "#ffffff", fontWeight: "800" }}>
          Zero-Trust Security Gate
        </h1>
        <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
          Enter authorized administrative credentials to unlock the systems console.
        </p>

        {errorMessage && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              padding: "10px 14px",
              color: "#fca5a5",
              fontSize: "13px",
              marginBottom: "18px",
              textAlign: "left",
            }}
          >
            <strong>Security Warning:</strong> {errorMessage}
            {strikesRemaining !== null && strikesRemaining < 5 && (
              <div style={{ fontSize: "11px", color: "#f87171", marginTop: "4px" }}>
                ⚠️ Warning: {strikesRemaining} failed attempts remaining before 15-minute IP lockout.
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          {/* Factor 1: Master Passcode */}
          <div style={{ marginBottom: isTotpRequired ? "14px" : "20px", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#cbd5e1",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Master Passcode
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setErrorMessage(null);
              }}
              required
              autoFocus
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                background: "#071324",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                color: "#ffffff",
                fontSize: "16px",
                letterSpacing: "2px",
                outline: "none",
              }}
            />
          </div>

          {/* Factor 2: TOTP 6-Digit Code (if active) */}
          {isTotpRequired && (
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#38bdf8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  2FA Authenticator Code
                </label>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>RFC 6238 TOTP</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000 000"
                value={totpCode}
                onChange={(e) => {
                  setTotpCode(e.target.value.replace(/\D/g, ""));
                  setErrorMessage(null);
                }}
                required={isTotpRequired}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  background: "#071324",
                  border: "1px solid #0284c7",
                  borderRadius: "6px",
                  color: "#38bdf8",
                  fontSize: "20px",
                  textAlign: "center",
                  letterSpacing: "8px",
                  fontWeight: "700",
                  outline: "none",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: isLoading ? "#334155" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            {isLoading ? "Verifying Credentials..." : "Authenticate & Enter Console ›"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #1e293b", fontSize: "13px" }}>
          <Link href="/" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "500" }}>
            ‹ Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
