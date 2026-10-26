import { describe, it, expect } from "vitest";
import {
  calculateSowBreakdown,
  availableAddons,
} from "../app/components/sow-generator";
import { initialServices } from "../app/data/portfolio-data";

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
});
