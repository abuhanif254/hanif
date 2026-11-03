import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  calculateSowBreakdown,
  availableAddons,
} from "../app/components/sow-generator";
import { initialServices } from "../app/data/portfolio-data";
import { POST as postInquiry } from "../app/api/inquiries/route";
import { getAllInquiriesAdmin } from "../app/lib/portfolio-store";

describe("Statement of Work (SOW) Engine & Pricing Logic", () => {
  it("should calculate correct base investment for a standalone service", () => {
    const service = initialServices.find((s) => s.slug === "database-optimization")!;
    expect(service).toBeDefined();

    const breakdown = calculateSowBreakdown(service, []);
    expect(breakdown.basePriceNum).toBe(4500);
    expect(breakdown.addonsTotal).toBe(0);
    expect(breakdown.totalInvestment).toBe(4500);

    // Verify milestone breakdown (25% + 50% + 25% = 100%)
    const sumMilestones = breakdown.milestones.reduce((acc, m) => acc + m.amount, 0);
    expect(sumMilestones).toBe(4500);
    expect(breakdown.milestones[0].percentage).toBe(25);
    expect(breakdown.milestones[1].percentage).toBe(50);
    expect(breakdown.milestones[2].percentage).toBe(25);
  });

  it("should calculate correct total investment with multiple architectural add-ons", () => {
    const service = initialServices.find((s) => s.slug === "cloudflare-edge-migration")!;
    expect(service).toBeDefined(); // $6,500 base

    const selectedAddonIds = ["migration", "security_rls", "ai_rag"];
    const breakdown = calculateSowBreakdown(service, selectedAddonIds);

    // Expected addons: 3500 + 2800 + 4200 = 10,500
    expect(breakdown.addonsTotal).toBe(10500);
    expect(breakdown.totalInvestment).toBe(6500 + 10500); // 17,000

    const sumMilestones = breakdown.milestones.reduce((acc, m) => acc + m.amount, 0);
    expect(sumMilestones).toBe(17000);
    expect(breakdown.chosenAddons.length).toBe(3);
  });

  it("should verify available add-ons have valid categories and non-zero prices", () => {
    expect(availableAddons.length).toBeGreaterThanOrEqual(6);
    availableAddons.forEach((addon) => {
      expect(addon.id).toBeDefined();
      expect(addon.price).toBeGreaterThan(0);
      expect(addon.name.length).toBeGreaterThan(5);
      expect(addon.description.length).toBeGreaterThan(10);
      expect(["data", "security", "edge", "warranty"]).toContain(addon.category);
    });
  });

  describe("SOW Submission & Lead Pipeline Integration", () => {
    it("should accept Statement of Work submission via /api/inquiries and record in lead pipeline", async () => {
      const sowPayload = {
        name: "Devin Vance",
        email: "devin@enterprise-cloud.io",
        phone: "+1 (555) 234-5678",
        projectType: "Full-Stack Web App MVP (SOW: SOW-2026-TEST)",
        budgetRange: "$14,500 USD",
        message: `[STATEMENT OF WORK SUBMISSION: Ref #SOW-2026-TEST]
Service Package: Full-Stack Web App MVP ($6,500)
Estimated Total Investment: $14,500 USD
Target Timeline: 3-4 Weeks
Target Kick-off Date: 2026-11-15
Client Organization: Vance Cloud Solutions
Client Contact: Devin Vance

--- Selected Architectural Add-ons ---
• PostgreSQL Partitioning & Multi-Region Read Replicas ($3,500 USD)
• Row-Level Security & Zero-Trust Audit ($2,800 USD)

--- Milestone & Payment Schedule ---
• Phase 1 (25% Kick-off Deposit): $3,625 USD
• Phase 2 (50% Core Delivery): $7,250 USD
• Phase 3 (25% Production Sign-off): $3,625 USD`,
      };

      const req = new NextRequest("http://localhost:3000/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sowPayload),
      });

      const res = await postInquiry(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.inquiryId).toBeDefined();

      // Verify the SOW inquiry is recorded in the admin pipeline
      const allInquiries = await getAllInquiriesAdmin();
      const matched = allInquiries.find((i) => i.id === json.inquiryId);
      expect(matched).toBeDefined();
      expect(matched?.name).toBe("Devin Vance");
      expect(matched?.projectType).toContain("SOW: SOW-2026-TEST");
      expect(matched?.message).toContain("Selected Architectural Add-ons");
    });
  });
});
