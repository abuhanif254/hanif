"use client";

import { FormEvent, useState } from "react";
import { submitInquiry } from "../lib/portfolio-store";

const projectTypes = [
  "Full-Stack Web Application (Next.js/React)",
  "Cloud & Edge Architecture (Cloudflare/AWS)",
  "Database Optimization & Scale (PostgreSQL)",
  "Codebase & Security Architecture Audit",
  "Fractional Staff / Principal Eng Retainer",
  "AI & LLM Vector Search / Agent Integration",
  "API & Microservice Development",
  "Other Engineering Project",
];

const budgetRanges = [
  "$2,500 – $5,000 (Small Scope / Audit)",
  "$5,000 – $15,000 (MVP / Feature Sprint)",
  "$15,000 – $30,000 (Full-Stack Platform)",
  "$30,000+ (Enterprise / Retainer)",
];

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      projectType: formData.get("projectType") as string,
      budgetRange: formData.get("budgetRange") as string,
      message: formData.get("message") as string,
    };

    const res = await submitInquiry(payload);
    setResultMessage(res.message);
    setSubmitting(false);
  }

  return (
    <div className="contactform widget" id="contactform">
      <h4 className="heading4" style={{ margin: "0 0 12px 0", padding: "8px 12px" }}>
        <span>Project Inquiry</span>
      </h4>
      <div className="formdesc" style={{ padding: "0 0 12px 0", color: "#cbd5e1", fontSize: "13px" }}>
        <span style={{ color: "#38bdf8", fontWeight: "bold" }}>● Fast Response Within 24 Hours</span>
        <br />
        Direct Email: <a href="mailto:alex@rivera-tech.io" style={{ color: "#ffffff", textDecoration: "underline" }}>alex@rivera-tech.io</a>
      </div>

      {resultMessage ? (
        <div
          style={{
            backgroundColor: "#064e3b",
            border: "1px solid #059669",
            color: "#ecfdf5",
            padding: "16px",
            borderRadius: "4px",
            fontSize: "13px",
            lineHeight: "1.5",
          }}
          role="status"
        >
          <p style={{ margin: "0 0 12px 0", fontWeight: "600" }}>✓ {resultMessage}</p>
          <button
            type="button"
            onClick={() => setResultMessage(null)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#10b981",
              color: "#ffffff",
              border: "none",
              borderRadius: "3px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="fld">
            <input
              autoComplete="name"
              id="name"
              name="name"
              placeholder="Your Name (Required)"
              required
              style={{ width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
            />
          </div>
          <div className="fld">
            <input
              autoComplete="email"
              id="email"
              name="email"
              placeholder="Work Email (Required)"
              required
              type="email"
              style={{ width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
            />
          </div>
          <div className="fld">
            <input
              autoComplete="tel"
              id="phone"
              name="phone"
              placeholder="Phone / WhatsApp (Optional)"
              type="tel"
              style={{ width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
            />
          </div>
          <div className="option">
            <select
              defaultValue=""
              id="projectType"
              name="projectType"
              required
              style={{ width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
            >
              <option value="" disabled>Select Project Scope / Type:</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="option">
            <select
              defaultValue=""
              id="budgetRange"
              name="budgetRange"
              required
              style={{ width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
            >
              <option value="" disabled>Estimated Budget Range:</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
          <div className="textarea">
            <textarea
              id="message"
              name="message"
              placeholder="Brief description of the challenge, existing tech stack, or timeline..."
              rows={4}
              required
              style={{ width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
            />
          </div>
          <div className="disc" style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 12px 0" }}>
            <label style={{ display: "flex", gap: "6px", alignItems: "flex-start", cursor: "pointer" }}>
              <input required type="checkbox" style={{ marginTop: "3px" }} />
              <span>I consent to be contacted regarding this technical project.</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "10px",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Transmitting Scope..." : "Request Technical Estimate"}
          </button>
        </form>
      )}
    </div>
  );
}
