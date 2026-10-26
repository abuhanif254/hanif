import { describe, it, expect } from "vitest";
import {
  validateOrderFinancials,
  isValidOrderTransition,
  generateClientAccessToken,
  calculatePipelineMetrics,
  convertInquiryToOrderPayload,
  initialCustomers,
  initialOrders,
  getOrderByIdOrToken,
  updateOrder,
  _resetOmsStoresForTesting,
} from "../app/lib/oms-service";
import { OrderRecord, CustomerRecord, OrderStatus } from "../app/lib/oms-types";

describe("Customer & Order Management System (CRM / OMS)", () => {
  describe("Financial Balance & Integrity Validator", () => {
    it("should accept valid balanced order with milestones matching total", () => {
      const result = validateOrderFinancials(10000, 0, 10000, [
        { amount: 5000 },
        { amount: 3000 },
        { amount: 2000 },
      ]);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should accept orders with tax properly summed", () => {
      const result = validateOrderFinancials(10000, 1000, 11000, [
        { amount: 5500 },
        { amount: 5500 },
      ]);
      expect(result.valid).toBe(true);
    });

    it("should reject negative financial inputs", () => {
      const result = validateOrderFinancials(-500, 0, -500, [{ amount: -500 }]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("negative");
    });

    it("should reject total mismatch when total != subtotal + tax", () => {
      const result = validateOrderFinancials(10000, 0, 9500, [{ amount: 9500 }]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("must equal subtotal");
    });

    it("should reject orders with zero milestones", () => {
      const result = validateOrderFinancials(5000, 0, 5000, []);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("at least 1 milestone");
    });

    it("should reject orders when sum of milestones != total order amount", () => {
      const result = validateOrderFinancials(10000, 0, 10000, [
        { amount: 4000 },
        { amount: 4000 },
      ]); // Sum is 8000 != 10000
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Sum of milestone amounts");
    });

    it("should handle floating-point precision cleanly (e.g. 1/3 splits)", () => {
      const result = validateOrderFinancials(10000, 0, 10000, [
        { amount: 3333.33 },
        { amount: 3333.33 },
        { amount: 3333.34 },
      ]);
      expect(result.valid).toBe(true);
    });
  });

  describe("Deterministic Order State Machine Guard", () => {
    it("should allow legitimate progressive transitions", () => {
      expect(isValidOrderTransition("draft", "quoted")).toBe(true);
      expect(isValidOrderTransition("quoted", "deposit_paid")).toBe(true);
      expect(isValidOrderTransition("deposit_paid", "in_progress")).toBe(true);
      expect(isValidOrderTransition("in_progress", "milestone_review")).toBe(true);
      expect(isValidOrderTransition("milestone_review", "completed")).toBe(true);
      expect(isValidOrderTransition("completed", "delivered")).toBe(true);
    });

    it("should allow feedback loop transition from milestone_review back to in_progress", () => {
      expect(isValidOrderTransition("milestone_review", "in_progress")).toBe(true);
    });

    it("should allow cancellation from early stages", () => {
      expect(isValidOrderTransition("draft", "cancelled")).toBe(true);
      expect(isValidOrderTransition("quoted", "cancelled")).toBe(true);
    });

    it("should allow refunds from active or completed stages", () => {
      expect(isValidOrderTransition("deposit_paid", "refunded")).toBe(true);
      expect(isValidOrderTransition("in_progress", "refunded")).toBe(true);
      expect(isValidOrderTransition("completed", "refunded")).toBe(true);
    });

    it("should forbid illegal jumps across stages", () => {
      expect(isValidOrderTransition("draft", "delivered")).toBe(false);
      expect(isValidOrderTransition("draft", "completed")).toBe(false);
      expect(isValidOrderTransition("completed", "draft")).toBe(false);
    });

    it("should forbid transitions out of terminal states", () => {
      expect(isValidOrderTransition("delivered", "in_progress")).toBe(false);
      expect(isValidOrderTransition("cancelled", "draft")).toBe(false);
      expect(isValidOrderTransition("refunded", "in_progress")).toBe(false);
    });

    it("should allow self-transition (idempotent status updates)", () => {
      const statuses: OrderStatus[] = [
        "draft",
        "quoted",
        "deposit_paid",
        "in_progress",
        "milestone_review",
        "completed",
        "delivered",
        "cancelled",
        "refunded",
      ];
      for (const s of statuses) {
        expect(isValidOrderTransition(s, s)).toBe(true);
      }
    });
  });

  describe("HMAC-SHA256 Cryptographic Client Access Token Generator", () => {
    it("should generate tokens prefixed with ord_live_", () => {
      const token = generateClientAccessToken("ord-test-1", "cust-1", "2026-10-26T12:00:00Z");
      expect(token).toMatch(/^ord_live_[a-f0-9]{36}$/);
    });

    it("should generate distinct tokens for different orders", () => {
      const token1 = generateClientAccessToken("ord-1", "cust-1", "2026-10-26T12:00:00Z");
      const token2 = generateClientAccessToken("ord-2", "cust-1", "2026-10-26T12:00:00Z");
      expect(token1).not.toBe(token2);
    });

    it("should generate reproducible token for same parameters", () => {
      const token1 = generateClientAccessToken("ord-1", "cust-1", "2026-10-26T12:00:00Z");
      const token2 = generateClientAccessToken("ord-1", "cust-1", "2026-10-26T12:00:00Z");
      expect(token1).toBe(token2);
    });
  });

  describe("Pipeline Financial & Delivery Metrics Calculator", () => {
    it("should accurately compute pipeline metrics from order set", () => {
      const testOrders: OrderRecord[] = [
        {
          id: "o1",
          orderNumber: "ORD-001",
          customerId: "c1",
          title: "Order 1",
          serviceTier: "Web App",
          status: "in_progress",
          paymentStatus: "partially_paid",
          currency: "USD",
          subtotalAmount: 10000,
          taxAmount: 0,
          totalAmount: 10000,
          amountPaid: 5000,
          clientAccessToken: "token1",
          milestones: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "o2",
          orderNumber: "ORD-002",
          customerId: "c2",
          title: "Order 2",
          serviceTier: "Database",
          status: "milestone_review",
          paymentStatus: "paid",
          currency: "USD",
          subtotalAmount: 20000,
          taxAmount: 0,
          totalAmount: 20000,
          amountPaid: 20000,
          clientAccessToken: "token2",
          milestones: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "o3",
          orderNumber: "ORD-003",
          customerId: "c1",
          title: "Order 3 (Cancelled)",
          serviceTier: "Cloud",
          status: "cancelled",
          paymentStatus: "unpaid",
          currency: "USD",
          subtotalAmount: 5000,
          taxAmount: 0,
          totalAmount: 5000,
          amountPaid: 0,
          clientAccessToken: "token3",
          milestones: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const testCustomers: CustomerRecord[] = [
        { ...initialCustomers[0], id: "c1" },
        { ...initialCustomers[1], id: "c2" },
      ];

      const metrics = calculatePipelineMetrics(testOrders, testCustomers);

      // Excludes cancelled: 10000 + 20000 = 30000
      expect(metrics.totalContractValueUsd).toBe(30000);
      // Collected: 5000 + 20000 = 25000
      expect(metrics.totalRevenueCollectedUsd).toBe(25000);
      // In-flight: o1 (in_progress, 10000) + o2 (milestone_review, 20000) = 30000
      expect(metrics.inFlightContractValueUsd).toBe(30000);
      // Active orders: o1 and o2 = 2
      expect(metrics.activeOrdersCount).toBe(2);
      // Milestone review: o2 = 1
      expect(metrics.pendingApprovalsCount).toBe(1);
      // Total customers: 2
      expect(metrics.totalClientsCount).toBe(2);
    });
  });

  describe("1-Click Inquiry-to-Order Conversion Payload Builder", () => {
    it("should parse budget range string and split into 3 balanced milestones", () => {
      const inquiry = {
        id: "inq-audit",
        name: "Elena Rostova",
        email: "elena@vanguardfin.ch",
        phone: "+41 22 555 1234",
        projectType: "Full-Stack Web Application (Next.js/React)",
        budgetRange: "$15,000 – $30,000 (MVP / Feature Sprint)",
        message: "Need a high-performance wealth management dashboard.",
      };

      const payload = convertInquiryToOrderPayload(inquiry);

      expect(payload.subtotalAmount).toBe(15000);
      expect(payload.newCustomer?.companyName).toContain("Elena Rostova");
      expect(payload.newCustomer?.email).toBe("elena@vanguardfin.ch");
      expect(payload.milestones).toHaveLength(3);

      const msTotal = payload.milestones.reduce((acc, m) => acc + m.amount, 0);
      expect(msTotal).toBe(15000);

      // Verify the 3-phase progression
      expect(payload.milestones[0].amount).toBe(7500); // 50%
      expect(payload.milestones[1].amount).toBe(4500); // 30%
      expect(payload.milestones[2].amount).toBe(3000); // 20%
    });

    it("should respect custom total amount when provided", () => {
      const inquiry = {
        id: "inq-custom",
        name: "David Kim",
        email: "david@stride.com",
        projectType: "Cloud Architecture",
        budgetRange: "$5,000 Scope",
        message: "AWS ECS migration",
      };

      const payload = convertInquiryToOrderPayload(inquiry, 25000);
      expect(payload.subtotalAmount).toBe(25000);
      const sum = payload.milestones.reduce((acc, m) => acc + m.amount, 0);
      expect(sum).toBe(25000);
    });
  });

  describe("Zero-Trust Public Order Tracker Access", () => {
    it("should retrieve initial order by client access token", async () => {
      _resetOmsStoresForTesting();
      const seedOrder = initialOrders[0];
      const retrieved = await getOrderByIdOrToken(seedOrder.clientAccessToken);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(seedOrder.id);
      expect(retrieved?.orderNumber).toBe(seedOrder.orderNumber);
      expect(retrieved?.customer?.companyName).toBe(initialCustomers[0].companyName);
      expect(retrieved?.milestones.length).toBeGreaterThan(0);
    });

    it("should return null for invalid or malicious access tokens", async () => {
      const result = await getOrderByIdOrToken("ord_live_invalid_forged_token_12345");
      expect(result).toBeNull();
    });
  });

  describe("Payment Settlement & State Progression Ledger", () => {
    it("should record partial and full payments, automatically updating paymentStatus", async () => {
      _resetOmsStoresForTesting();
      const seedOrder = initialOrders[1]; // Subtotal 15000

      // Update payment to partial
      const partial = await updateOrder(seedOrder.id, { amountPaid: 7500 });
      expect(partial.paymentStatus).toBe("partially_paid");
      expect(partial.amountPaid).toBe(7500);

      // Update payment to full
      const full = await updateOrder(seedOrder.id, { amountPaid: 15000 });
      expect(full.paymentStatus).toBe("paid");
      expect(full.amountPaid).toBe(15000);
    });

    it("should reject illegal status transition through updateOrder", async () => {
      _resetOmsStoresForTesting();
      const seedOrder = initialOrders[0]; // in_progress
      // in_progress -> draft is not allowed
      await expect(updateOrder(seedOrder.id, { status: "draft" as any })).rejects.toThrow();
    });
  });
});
