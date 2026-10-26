import { describe, it, expect, beforeEach } from "vitest";
import {
  generateInvoiceForOrder,
  generateApprovalSignature,
  approveOrderMilestone,
  initialOrders,
  initialCustomers,
  _resetOmsStoresForTesting,
  getOrderByIdOrToken,
} from "../app/lib/oms-service";

describe("Institutional Invoicing & Milestone Digital Sign-Off Engine", () => {
  beforeEach(() => {
    _resetOmsStoresForTesting();
  });

  describe("Tax-Compliant Commercial Invoice Generator (INV-YYYY-XXXX)", () => {
    it("should generate full contract invoice matching total amounts and milestones", () => {
      const order = initialOrders[0]; // ord-apex-1001 ($22,500 total, $11,250 paid)
      const customer = initialCustomers[0];

      const invoice = generateInvoiceForOrder(order, customer);

      expect(invoice.invoiceNumber).toBe("INV-2026-1001");
      expect(invoice.orderNumber).toBe("ORD-2026-1001");
      expect(invoice.totalAmount).toBe(22500);
      expect(invoice.subtotal).toBe(22500);
      expect(invoice.taxAmount).toBe(0);
      expect(invoice.amountPaid).toBe(11250);
      expect(invoice.balanceDue).toBe(11250);
      expect(invoice.paymentStatus).toBe("partially_paid");
      expect(invoice.lineItems).toHaveLength(3);

      // Verify line items correspond to milestones
      expect(invoice.lineItems[0].unitPrice).toBe(11250);
      expect(invoice.lineItems[1].unitPrice).toBe(6750);
      expect(invoice.lineItems[2].unitPrice).toBe(4500);

      // Verify issuer and wire details
      expect(invoice.issuer.name).toContain("Abu Hanif");
      expect(invoice.issuer.wireDetails.swiftBic).toBe("SCBLBDDX");
      expect(invoice.issuer.wireDetails.accountOrIban).toBeDefined();

      // Verify customer details
      expect(invoice.customer.companyName).toBe("Apex Ventures & Fintech");
      expect(invoice.customer.primaryContactName).toBe("Sarah Jenkins");
    });

    it("should generate single-phase invoice when milestoneIndex is specified", () => {
      const order = initialOrders[0];
      const customer = initialCustomers[0];

      const phase1Invoice = generateInvoiceForOrder(order, customer, 1);
      expect(phase1Invoice.invoiceNumber).toBe("INV-2026-1001-M1");
      expect(phase1Invoice.lineItems).toHaveLength(1);
      expect(phase1Invoice.totalAmount).toBe(11250);
      expect(phase1Invoice.lineItems[0].description).toContain("Phase 1");

      const phase2Invoice = generateInvoiceForOrder(order, customer, 2);
      expect(phase2Invoice.invoiceNumber).toBe("INV-2026-1001-M2");
      expect(phase2Invoice.totalAmount).toBe(6750);
      expect(phase2Invoice.lineItems[0].description).toContain("Phase 2");
    });

    it("should mark invoice as paid in full when amountPaid equals totalAmount", () => {
      const paidOrder = initialOrders[1]; // ord-cloudscale-1002 ($15,000 total, $15,000 paid)
      const invoice = generateInvoiceForOrder(paidOrder, initialCustomers[1]);

      expect(invoice.totalAmount).toBe(15000);
      expect(invoice.amountPaid).toBe(15000);
      expect(invoice.balanceDue).toBe(0);
      expect(invoice.paymentStatus).toBe("paid");
    });
  });

  describe("Cryptographic Digital Sign-Off Hash Generator", () => {
    it("should produce a deterministic sha256 signature hash", () => {
      const sig1 = generateApprovalSignature("ord-1", "ms-1", "Sarah Jenkins", "2026-10-26T12:00:00Z");
      const sig2 = generateApprovalSignature("ord-1", "ms-1", "Sarah Jenkins", "2026-10-26T12:00:00Z");

      expect(sig1).toMatch(/^sig_sha256_[a-f0-9]{32}$/);
      expect(sig1).toBe(sig2);
    });

    it("should change hash if approver or timestamp changes (tamper-evident)", () => {
      const sig1 = generateApprovalSignature("ord-1", "ms-1", "Sarah Jenkins", "2026-10-26T12:00:00Z");
      const sig2 = generateApprovalSignature("ord-1", "ms-1", "Marcus Thorne", "2026-10-26T12:00:00Z");

      expect(sig1).not.toBe(sig2);
    });
  });

  describe("Client Milestone Approval & Deliverables Acceptance Engine", () => {
    it("should allow client to approve a milestone in 'submitted' status", async () => {
      const order = initialOrders[1]; // CloudScale order has ms-cloud-2 in 'submitted' status
      const submittedMs = order.milestones.find((m) => m.id === "ms-cloud-2");
      expect(submittedMs?.status).toBe("submitted");

      const result = await approveOrderMilestone(
        order.clientAccessToken,
        "ms-cloud-2",
        "Marcus Thorne, Chief Architect",
        "P99 benchmark verified at 24ms under 50k QPS load spike.",
        "198.51.100.42"
      );

      expect(result.milestone.status).toBe("client_approved");
      expect(result.milestone.approvedBy).toBe("Marcus Thorne, Chief Architect");
      expect(result.milestone.approvedAt).toBeDefined();
      expect(result.milestone.approvalSignatureHash).toMatch(/^sig_sha256_/);

      // Since ms-cloud-1 and ms-cloud-2 are now both approved, order status should transition to 'completed'
      expect(result.order.status).toBe("completed");
      expect(result.order.completedAt).toBeDefined();
    });

    it("should reject approval if approver name is empty or whitespace", async () => {
      const order = initialOrders[1];
      await expect(
        approveOrderMilestone(order.clientAccessToken, "ms-cloud-2", "   ")
      ).rejects.toThrow("Approver name is required");
    });

    it("should reject approval if milestone is not in 'submitted' status", async () => {
      const order = initialOrders[0];
      // ms-apex-2 is in 'in_progress', not 'submitted'
      await expect(
        approveOrderMilestone(order.clientAccessToken, "ms-apex-2", "Sarah Jenkins")
      ).rejects.toThrow("must be in 'submitted' status");
    });

    it("should reject approval if access token does not match any order", async () => {
      await expect(
        approveOrderMilestone("ord_live_invalid_token_99999", "ms-cloud-2", "Marcus Thorne")
      ).rejects.toThrow("Order not found or access token invalid");
    });

    it("should be idempotent when approving an already approved milestone", async () => {
      const order = initialOrders[0];
      // ms-apex-1 is already 'client_approved'
      const result = await approveOrderMilestone(
        order.clientAccessToken,
        "ms-apex-1",
        "Sarah Jenkins"
      );
      expect(result.milestone.status).toBe("client_approved");
    });
  });
});
