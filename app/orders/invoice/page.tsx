"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { InvoiceRecord } from "../../lib/oms-types";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const milestoneParam = searchParams.get("milestone");

  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Cryptographic client access token is missing.");
      setLoading(false);
      return;
    }

    const query = milestoneParam
      ? `/api/orders/invoice?token=${encodeURIComponent(token)}&milestone=${encodeURIComponent(milestoneParam)}`
      : `/api/orders/invoice?token=${encodeURIComponent(token)}`;

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.invoice) {
          setInvoice(data.invoice);
        } else {
          setError(data.error || "Unable to retrieve invoice.");
        }
      })
      .catch(() => setError("Network error fetching invoice."))
      .finally(() => setLoading(false));
  }, [token, milestoneParam]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#071324", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>📄</div>
          <div>Generating institutional invoice...</div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#071324", padding: "60px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "480px", backgroundColor: "#0a192f", border: "1px solid #7f1d1d", borderRadius: "8px", padding: "30px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
          <h2 style={{ fontSize: "20px", color: "#f87171", margin: "0 0 10px 0" }}>Invoice Access Error</h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 20px 0" }}>
            {error || "We could not find an invoice corresponding to this access token."}
          </p>
          <Link
            href="/"
            style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "#1e293b", color: "#38bdf8", borderRadius: "4px", textDecoration: "none", fontSize: "13px" }}
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = invoice.paymentStatus === "paid";
  const isPartial = invoice.paymentStatus === "partially_paid";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b1329", padding: "40px 20px" }}>
      {/* Top Action Bar (Hidden in Print) */}
      <div
        className="no-print"
        style={{
          maxWidth: "850px",
          margin: "0 auto 24px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Link
          href={`/orders/tracker?token=${token}`}
          style={{
            color: "#38bdf8",
            fontSize: "13px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>←</span> Back to Live Order Tracker
        </Link>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            }}
          >
            <span>🖨️</span> Download / Print PDF Invoice
          </button>
        </div>
      </div>

      {/* Official White Invoice Paper Document */}
      <div
        className="invoice-paper"
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderRadius: "8px",
          padding: "50px 60px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Header: Issuer & Invoice Meta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #e2e8f0", paddingBottom: "28px", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
              {invoice.issuer.name}
            </h1>
            <div style={{ fontSize: "14px", color: "#475569", fontWeight: "600", marginBottom: "6px" }}>
              {invoice.issuer.title}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>
              {invoice.issuer.address}
              <br />
              Email: {invoice.issuer.email}
              {invoice.issuer.taxId && <span> • Tax ID: {invoice.issuer.taxId}</span>}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "28px", fontWeight: "900", color: "#1e293b", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              INVOICE
            </div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#2563eb", fontFamily: "monospace", marginTop: "4px" }}>
              #{invoice.invoiceNumber}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                backgroundColor: isPaid ? "#dcfce7" : isPartial ? "#fef3c7" : "#fee2e2",
                color: isPaid ? "#15803d" : isPartial ? "#b45309" : "#b91c1c",
              }}
            >
              {isPaid ? "✓ PAID IN FULL" : isPartial ? "PARTIALLY PAID" : "PAYMENT DUE"}
            </div>
          </div>
        </div>

        {/* Billed To & Dates Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px", marginBottom: "36px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              Billed To (Client Organization)
            </div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
              {invoice.customer.companyName}
            </div>
            <div style={{ fontSize: "13px", color: "#334155", marginBottom: "2px" }}>
              Attn: {invoice.customer.primaryContactName}
            </div>
            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
              {invoice.customer.email}
            </div>
            {invoice.customer.billingAddress && (
              <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                {invoice.customer.billingAddress.street && `${invoice.customer.billingAddress.street}, `}
                {invoice.customer.billingAddress.city}, {invoice.customer.billingAddress.country}
              </div>
            )}
            {invoice.customer.vatTaxId && (
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                VAT / Tax ID: {invoice.customer.vatTaxId}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: "#f8fafc", padding: "16px 20px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
              <span style={{ color: "#64748b" }}>Order Contract Ref:</span>
              <strong style={{ color: "#0f172a", fontFamily: "monospace" }}>{invoice.orderNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
              <span style={{ color: "#64748b" }}>Invoice Issue Date:</span>
              <strong style={{ color: "#0f172a" }}>{invoice.issueDate}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
              <span style={{ color: "#64748b" }}>Payment Due Date:</span>
              <strong style={{ color: isPaid ? "#0f172a" : "#b91c1c" }}>{invoice.dueDate}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderTop: "1px dashed #cbd5e1", paddingTop: "8px" }}>
              <span style={{ color: "#64748b" }}>Currency:</span>
              <strong style={{ color: "#0f172a" }}>{invoice.currency} (USD)</strong>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div style={{ marginBottom: "36px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#0f172a", color: "#ffffff", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", borderRadius: "4px 0 0 4px" }}>
                  Description &amp; Deliverables
                </th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", width: "80px" }}>
                  Qty
                </th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right", width: "130px" }}>
                  Rate
                </th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right", width: "130px", borderRadius: "0 4px 4px 0" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "16px", fontSize: "13px", color: "#1e293b", lineHeight: "1.5" }}>
                    <div style={{ fontWeight: "600" }}>{item.description}</div>
                  </td>
                  <td style={{ padding: "16px", fontSize: "13px", color: "#475569", textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: "16px", fontSize: "13px", color: "#475569", textAlign: "right", fontFamily: "monospace" }}>
                    ${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "#0f172a", textAlign: "right", fontFamily: "monospace" }}>
                    ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Wire Remittance Box */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px", marginBottom: "40px" }}>
          {/* Wire Details */}
          <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "18px 20px" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
              Wire Transfer &amp; Payment Remittance
            </div>
            <div style={{ fontSize: "12px", color: "#334155", lineHeight: "1.6" }}>
              <div><strong>Bank Name:</strong> {invoice.issuer.wireDetails.bankName}</div>
              <div><strong>SWIFT / BIC:</strong> <code style={{ backgroundColor: "#e2e8f0", padding: "2px 4px", borderRadius: "3px" }}>{invoice.issuer.wireDetails.swiftBic}</code></div>
              <div><strong>Account / IBAN:</strong> <code style={{ backgroundColor: "#e2e8f0", padding: "2px 4px", borderRadius: "3px" }}>{invoice.issuer.wireDetails.accountOrIban}</code></div>
              {invoice.issuer.wireDetails.cryptoUsdtErc20 && (
                <div style={{ marginTop: "4px" }}>
                  <strong>Digital Asset:</strong> {invoice.issuer.wireDetails.cryptoUsdtErc20}
                </div>
              )}
            </div>
          </div>

          {/* Totals Table */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px", color: "#475569" }}>
              <span>Subtotal:</span>
              <span style={{ fontFamily: "monospace", fontWeight: "600" }}>${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px", color: "#475569" }}>
              <span>Tax / VAT (0.00% Reverse Charge):</span>
              <span style={{ fontFamily: "monospace" }}>${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "15px", fontWeight: "800", color: "#0f172a", borderTop: "1px solid #cbd5e1" }}>
              <span>Total Invoice Amount:</span>
              <span style={{ fontFamily: "monospace" }}>${invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {invoice.currency}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px", color: "#16a34a" }}>
              <span>Amount Paid / Settled:</span>
              <span style={{ fontFamily: "monospace", fontWeight: "600" }}>- ${invoice.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                fontSize: "16px",
                fontWeight: "900",
                backgroundColor: isPaid ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${isPaid ? "#bbf7d0" : "#fecaca"}`,
                borderRadius: "6px",
                marginTop: "10px",
                color: isPaid ? "#15803d" : "#b91c1c",
              }}
            >
              <span>Balance Due:</span>
              <span style={{ fontFamily: "monospace" }}>${invoice.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })} {invoice.currency}</span>
            </div>
          </div>
        </div>

        {/* Footer Terms & Legal Sign-off */}
        <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "20px", fontSize: "11px", color: "#64748b", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 12px 0" }}>
            <strong>Institutional Terms of Delivery:</strong> {invoice.notes}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8" }}>
                SEC-SIG: HMAC-SHA256 • NON-REPUDIATION VERIFIED • ABU HANIF ARCHITECTURE
              </div>
            </div>
            <div style={{ textAlign: "right", borderTop: "1px solid #94a3b8", width: "200px", paddingTop: "6px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>Abu Hanif Mia</div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>Authorized Digital Signatory</div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Print CSS */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-paper {
            max-width: 100% !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          @page {
            margin: 1.5cm;
            size: A4 portrait;
          }
        }
      `}</style>
    </div>
  );
}

export default function OrderInvoicePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#071324", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
          <h1 style={{ fontSize: "16px", color: "#ffffff", margin: "0 10px 0 0" }}>Abu Hanif Official Commercial Invoice</h1>
          <span>Loading invoice...</span>
        </div>
      }
    >
      <InvoiceContent />
    </Suspense>
  );
}
