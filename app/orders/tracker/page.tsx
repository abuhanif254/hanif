"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { OrderRecord, OrderMilestoneRecord } from "../../lib/oms-types";

function OrderTrackerContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Digital E-Sign Approval Modal State
  const [approvingMilestone, setApprovingMilestone] = useState<OrderMilestoneRecord | null>(null);
  const [approverName, setApproverName] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);
  const [submittingApproval, setSubmittingApproval] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<{ success: boolean; message: string } | null>(null);

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
          if (data.order.customer?.primaryContactName) {
            setApproverName(data.order.customer.primaryContactName);
          }
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

  async function handleMilestoneSignOff(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !approvingMilestone || !hasConfirmedCheckbox || !approverName.trim()) {
      return;
    }

    setSubmittingApproval(true);
    setApprovalFeedback(null);

    try {
      const res = await fetch("/api/orders/tracker/approve-milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          milestoneId: approvingMilestone.id,
          approverName: approverName.trim(),
          notes: approvalNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.milestone) {
        // Update local order state with the newly approved milestone
        if (order) {
          const updatedMilestones = order.milestones.map((m) =>
            m.id === data.milestone.id ? { ...m, ...data.milestone } : m
          );
          setOrder({
            ...order,
            status: data.order?.status || order.status,
            completedAt: data.order?.completedAt || order.completedAt,
            milestones: updatedMilestones,
          });
        }
        setApprovalFeedback({
          success: true,
          message: `Phase ${approvingMilestone.milestoneIndex} successfully signed off! Cryptographic audit hash recorded.`,
        });
        setTimeout(() => {
          setApprovingMilestone(null);
          setApprovalFeedback(null);
          setHasConfirmedCheckbox(false);
          setApprovalNotes("");
        }, 2200);
      } else {
        setApprovalFeedback({
          success: false,
          message: data.error || "Failed to submit milestone approval.",
        });
      }
    } catch {
      setApprovalFeedback({
        success: false,
        message: "Network error submitting digital approval.",
      });
    } finally {
      setSubmittingApproval(false);
    }
  }

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
    <div style={{ maxWidth: "1050px", margin: "0 auto", padding: "40px 20px" }}>
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

        {/* Progress Bar & Actions */}
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

        {/* Quick Commercial Invoicing Banner */}
        <div
          style={{
            marginTop: "20px",
            padding: "12px 16px",
            backgroundColor: "#071324",
            border: "1px solid #1e293b",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>📄</span>
            <span style={{ fontSize: "13px", color: "#e2e8f0" }}>
              Institutional Commercial Invoice (INV-{order.orderNumber.replace("ORD-", "")}) is ready for accounting.
            </span>
          </div>

          <Link
            href={`/orders/invoice?token=${token}`}
            target="_blank"
            style={{
              padding: "6px 14px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              color: "#38bdf8",
              fontSize: "12px",
              fontWeight: "700",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🖨️</span> View &amp; Print Official Tax Invoice ↗
          </Link>
        </div>
      </div>

      {/* Grid: Milestones & Contract Specifications */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "30px" }}>
        {/* Left: Milestones List & Vault */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 16px 0" }}>
            Contract Milestones &amp; Deliverables Vault
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {order.milestones.map((m) => {
              const isSubmittedForReview = m.status === "submitted";
              const isApproved = m.status === "client_approved" || m.status === "paid";

              return (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: "#0a192f",
                    border: isSubmittedForReview
                      ? "1px solid #f59e0b"
                      : isApproved
                      ? "1px solid #059669"
                      : "1px solid #1e293b",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: isSubmittedForReview ? "0 4px 16px rgba(245, 158, 11, 0.15)" : undefined,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase" }}>
                        Phase {m.milestoneIndex}
                      </span>
                      <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#ffffff", margin: "2px 0 4px 0" }}>
                        {m.title}
                      </h3>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#4ade80" }}>
                        ${m.amount.toLocaleString()} USD
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          backgroundColor: isApproved
                            ? "#065f46"
                            : isSubmittedForReview
                            ? "#78350f"
                            : m.status === "in_progress"
                            ? "#1e1b4b"
                            : "#1e293b",
                          color: isApproved
                            ? "#34d399"
                            : isSubmittedForReview
                            ? "#fde047"
                            : m.status === "in_progress"
                            ? "#c084fc"
                            : "#94a3b8",
                        }}
                      >
                        {m.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 12px 0" }}>
                    {m.deliverablesSummary}
                  </p>

                  {/* Deliverable Artifacts Vault Links */}
                  {m.deliverableArtifacts && m.deliverableArtifacts.length > 0 && (
                    <div style={{ backgroundColor: "#071324", padding: "10px 14px", borderRadius: "6px", marginBottom: "12px", border: "1px solid #1e293b" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>
                        📦 Verified Deliverable Artifacts &amp; Staging Links:
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {m.deliverableArtifacts.map((art, artIdx) => (
                          <a
                            key={artIdx}
                            href={art.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "12px",
                              padding: "4px 10px",
                              backgroundColor: "#1e293b",
                              color: "#38bdf8",
                              borderRadius: "4px",
                              textDecoration: "none",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>{art.type === "staging" ? "🌐" : art.type === "github" ? "🐙" : art.type === "benchmark" ? "📊" : "📑"}</span>
                            {art.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* If in 'submitted' status: Call to Action for Client Review & Sign-Off */}
                  {isSubmittedForReview && (
                    <div
                      style={{
                        backgroundColor: "#1c1917",
                        border: "1px solid #d97706",
                        borderRadius: "6px",
                        padding: "14px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "#fef08a" }}>
                            🔔 Deliverables Awaiting Acceptance Sign-Off
                          </div>
                          <div style={{ fontSize: "12px", color: "#d6d3d1", marginTop: "2px" }}>
                            Review the deliverables above. When satisfied, click below to record your formal cryptographic acceptance.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setApprovingMilestone(m);
                            setApprovalFeedback(null);
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#16a34a",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 2px 8px rgba(22, 163, 74, 0.4)",
                          }}
                        >
                          <span>✍️</span> Review &amp; Sign Off Phase {m.milestoneIndex}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Approved Meta Record */}
                  {isApproved && m.approvedBy && (
                    <div
                      style={{
                        backgroundColor: "#071324",
                        border: "1px solid #065f46",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        fontSize: "11px",
                        color: "#34d399",
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      <div>
                        ✓ Formally approved by: <strong>{m.approvedBy}</strong>
                        {m.approvedAt && ` on ${new Date(m.approvedAt).toLocaleDateString()}`}
                      </div>
                      {m.approvalSignatureHash && (
                        <div style={{ fontFamily: "monospace", color: "#94a3b8" }}>
                          SIG: {m.approvalSignatureHash.substring(0, 16)}...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Footer Meta & Phase Invoice */}
                  <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{m.dueDate ? `Target Due Date: ${m.dueDate}` : "Scheduled Sprint"}</span>
                    <Link
                      href={`/orders/invoice?token=${token}&milestone=${m.milestoneIndex}`}
                      target="_blank"
                      style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "600" }}
                    >
                      🧾 Phase {m.milestoneIndex} Invoice ↗
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Contract Specifications & Legal Terms */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 16px 0" }}>
            Contract Specifications
          </h2>

          <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>
              <div style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: "700", marginBottom: "2px" }}>Principal Architect:</div>
              <strong style={{ color: "#ffffff", fontSize: "15px" }}>Abu Hanif Mia</strong>
              <div style={{ color: "#38bdf8", marginTop: "2px" }}>contact@abuhanifmia.com</div>
            </div>

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>
              <div style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: "700", marginBottom: "2px" }}>Service Agreement:</div>
              <strong style={{ color: "#ffffff" }}>{order.serviceTier}</strong>
            </div>

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>
              <div style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: "700", marginBottom: "2px" }}>Target Completion:</div>
              <strong style={{ color: "#ffffff" }}>{order.targetCompletionDate || "Per Sprint Schedule"}</strong>
            </div>

            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", fontSize: "12px", color: "#94a3b8" }}>
              <div style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: "700", marginBottom: "4px" }}>Contractual Invariants:</div>
              <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px", color: "#cbd5e1", lineHeight: "1.6" }}>
                <li>100% Client IP Assignment upon settlement</li>
                <li>30-Day Post-Cutover Bug Warranty</li>
                <li>Mutual Confidentiality &amp; NDA Active</li>
                <li>Zero Vendor Lock-in &amp; Docker Handover</li>
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              href={`/orders/invoice?token=${token}`}
              target="_blank"
              style={{
                display: "block",
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                textAlign: "center",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              📄 Download / Print Tax Invoice
            </Link>

            <a
              href={`mailto:contact@abuhanifmia.com?subject=Regarding%20Engagement%20${order.orderNumber}`}
              style={{
                display: "block",
                padding: "10px",
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                color: "#e2e8f0",
                textAlign: "center",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              ✉️ Contact Principal Architect
            </a>

            <Link
              href="/"
              style={{
                display: "block",
                padding: "8px",
                color: "#94a3b8",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "12px",
              }}
            >
              ‹ Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* DIGITAL MILESTONE APPROVAL MODAL */}
      {approvingMilestone && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#0a192f",
              border: "1px solid #334155",
              borderRadius: "8px",
              maxWidth: "560px",
              width: "100%",
              padding: "26px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                  Formal Milestone Sign-Off &amp; Acceptance
                </h3>
                <div style={{ fontSize: "12px", color: "#38bdf8", marginTop: "2px" }}>
                  Phase {approvingMilestone.milestoneIndex}: {approvingMilestone.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApprovingMilestone(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMilestoneSignOff}>
              <div style={{ backgroundColor: "#071324", padding: "12px 14px", borderRadius: "6px", marginBottom: "16px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Deliverables Being Approved:</div>
                <div style={{ fontSize: "13px", color: "#e2e8f0", marginTop: "4px" }}>
                  {approvingMilestone.deliverablesSummary}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#4ade80", marginTop: "6px" }}>
                  Settlement Escrow Value: ${approvingMilestone.amount.toLocaleString()} USD
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>
                  Authorized Signatory Full Legal Name *
                </label>
                <input
                  required
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins (VP of Engineering)"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    backgroundColor: "#071324",
                    border: "1px solid #1e293b",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>
                  Acceptance Notes / Feedback (Optional)
                </label>
                <textarea
                  rows={2}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Optional note: Acceptance testing completed on staging environment."
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    backgroundColor: "#071324",
                    border: "1px solid #1e293b",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12px", color: "#cbd5e1", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={hasConfirmedCheckbox}
                    onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
                    style={{ marginTop: "3px" }}
                  />
                  <span>
                    I confirm that the deliverables for <strong>Phase {approvingMilestone.milestoneIndex}</strong> have been reviewed and meet the agreed technical acceptance criteria. This sign-off will generate an immutable cryptographic audit record.
                  </span>
                </label>
              </div>

              {approvalFeedback && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    marginBottom: "16px",
                    backgroundColor: approvalFeedback.success ? "#065f46" : "#450a0a",
                    color: approvalFeedback.success ? "#6ee7b7" : "#fca5a5",
                    border: `1px solid ${approvalFeedback.success ? "#059669" : "#991b1b"}`,
                  }}
                >
                  {approvalFeedback.message}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #1e293b", paddingTop: "14px" }}>
                <button
                  type="button"
                  disabled={submittingApproval}
                  onClick={() => setApprovingMilestone(null)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#334155",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasConfirmedCheckbox || !approverName.trim() || submittingApproval}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: !hasConfirmedCheckbox || !approverName.trim() || submittingApproval ? "#475569" : "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: !hasConfirmedCheckbox || !approverName.trim() || submittingApproval ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {submittingApproval ? "Recording Audit Signature..." : "Confirm & Sign Off Phase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackerPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#071324", color: "#ffffff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Suspense
        fallback={
          <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            <h1 style={{ fontSize: "16px", color: "#ffffff", margin: "0 10px 0 0" }}>Abu Hanif Client Order Tracker</h1>
            <span>Loading Tracker...</span>
          </div>
        }
      >
        <OrderTrackerContent />
      </Suspense>
    </div>
  );
}
