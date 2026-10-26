"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { OrderRecord } from "../../lib/oms-types";

function OrderTrackerContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No order access token was provided in the URL.");
      setLoading(false);
      return;
    }

    fetch(`/api/orders/tracker?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Unable to locate engagement order for this token.");
        }
      })
      .catch(() => {
        setError("Network connection error. Please refresh and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
          <h2 style={{ color: "#ffffff", fontSize: "18px", margin: "0 0 6px 0" }}>Verifying Cryptographic Order Token...</h2>
          <p style={{ margin: 0, fontSize: "13px" }}>Loading live milestone radar and deliverables.</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div
          style={{
            backgroundColor: "#0a192f",
            border: "1px solid #7f1d1d",
            borderRadius: "8px",
            padding: "36px 40px",
            maxWidth: "480px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛡️</div>
          <h1 style={{ color: "#ffffff", fontSize: "20px", margin: "0 0 8px 0", fontWeight: "800" }}>
            Invalid or Expired Order Token
          </h1>
          <p style={{ color: "#fca5a5", fontSize: "13px", lineHeight: "1.5", margin: "0 0 20px 0" }}>
            {error || "The access token provided does not match any active project order."}
          </p>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 24px 0" }}>
            Please check the link in your Statement of Work email or contact Abu Hanif directly.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            ‹ Return to Main Website
          </Link>
        </div>
      </div>
    );
  }

  // Calculate milestone progress percentage
  const completedMilestones = (order.milestones || []).filter(
    (m) => m.status === "client_approved" || m.status === "paid"
  ).length;
  const progressPercent = order.milestones.length > 0
    ? Math.round((completedMilestones / order.milestones.length) * 100)
    : 0;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Executive Header */}
      <div
        style={{
          backgroundColor: "#0a192f",
          border: "1px solid #1e293b",
          borderRadius: "8px",
          padding: "28px 32px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Official Client Engagement Tracker
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: order.status === "completed" || order.status === "delivered" ? "#065f46" : "#1e3a8a",
                  color: order.status === "completed" || order.status === "delivered" ? "#34d399" : "#93c5fd",
                }}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", margin: "0 0 6px 0" }}>
              {order.title}
            </h1>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>
              Order Reference: <strong style={{ color: "#ffffff" }}>{order.orderNumber}</strong> • Client: <strong style={{ color: "#38bdf8" }}>{order.customer?.companyName || "Private Client"}</strong>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700" }}>Total Contract Value</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#4ade80", marginTop: "2px" }}>
              ${order.totalAmount.toLocaleString()} <span style={{ fontSize: "14px", color: "#94a3b8" }}>{order.currency}</span>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
              Paid: <strong style={{ color: "#ffffff" }}>${order.amountPaid.toLocaleString()}</strong> ({order.paymentStatus})
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: "6px" }}>
            <span>Milestone Progress: <strong>{completedMilestones} of {order.milestones.length} Phases Delivered</strong></span>
            <span><strong>{progressPercent}% Completed</strong></span>
          </div>
          <div style={{ width: "100%", height: "8px", backgroundColor: "#071324", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                backgroundColor: progressPercent === 100 ? "#10b981" : "#2563eb",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Milestones & Financial Balance */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "30px" }}>
        {/* Left: Milestones List */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 16px 0" }}>
            Contract Milestones &amp; Deliverables
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {order.milestones.map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: "#0a192f",
                  border: m.status === "in_progress" || m.status === "submitted" ? "1px solid #3b82f6" : "1px solid #1e293b",
                  borderRadius: "6px",
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase" }}>
                      Phase {m.milestoneIndex}
                    </span>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", margin: "2px 0 4px 0" }}>
                      {m.title}
                    </h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#4ade80" }}>
                      ${m.amount.toLocaleString()}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        backgroundColor: m.status === "client_approved" || m.status === "paid" ? "#065f46" : m.status === "submitted" ? "#7c2d12" : "#1e293b",
                        color: m.status === "client_approved" || m.status === "paid" ? "#34d399" : m.status === "submitted" ? "#fdba74" : "#94a3b8",
                      }}
                    >
                      {m.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 10px 0" }}>
                  {m.deliverablesSummary}
                </p>

                <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                  <span>{m.dueDate ? `Target Due: ${m.dueDate}` : "Scheduled Sprint"}</span>
                  {m.approvedAt && <span style={{ color: "#34d399" }}>✓ Client Sign-off: {new Date(m.approvedAt).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contract Info & Actions */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 16px 0" }}>
            Contract Specifications
          </h2>

          <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
              <div>Lead Systems Architect:</div>
              <strong style={{ color: "#ffffff", fontSize: "14px" }}>MD Abu Hanif Mia</strong>
              <div style={{ color: "#38bdf8", marginTop: "2px" }}>abuhanifmain@gmail.com</div>
            </div>

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
              <div>Service Package:</div>
              <strong style={{ color: "#ffffff" }}>{order.serviceTier}</strong>
            </div>

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
              <div>Target Completion:</div>
              <strong style={{ color: "#ffffff" }}>{order.targetCompletionDate || "Per Sprint Schedule"}</strong>
            </div>

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", fontSize: "12px", color: "#94a3b8" }}>
              <div>Legal Invariants:</div>
              <ul style={{ margin: "6px 0 0 0", paddingLeft: "16px", color: "#cbd5e1", lineHeight: "1.6" }}>
                <li>100% Client IP Assignment upon completion</li>
                <li>30-Day Post-Launch Bug Warranty</li>
                <li>Mutual Confidentiality &amp; NDA Active</li>
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href={`mailto:abuhanifmain@gmail.com?subject=Inquiry%20regarding%20${order.orderNumber}`}
              style={{
                display: "block",
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                textAlign: "center",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              ✉️ Contact Lead Architect
            </a>

            <Link
              href="/"
              style={{
                display: "block",
                padding: "10px",
                backgroundColor: "#071324",
                border: "1px solid #1e293b",
                color: "#94a3b8",
                textAlign: "center",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "12px",
              }}
            >
              ‹ Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackerPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#071324", color: "#ffffff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Suspense
        fallback={
          <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            Loading Tracker...
          </div>
        }
      >
        <OrderTrackerContent />
      </Suspense>
    </div>
  );
}
