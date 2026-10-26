import { describe, it, expect } from "vitest";
import { ARCHITECTURE_TOPOLOGIES } from "../app/components/architecture-topology-explorer";
import { initialProjects, initialServices } from "../app/data/portfolio-data";

describe("Interactive Architecture Topology & Sequence Flow Simulator", () => {
  const projectSlugs = new Set(initialProjects.map((p) => p.slug));
  const serviceSlugs = new Set(initialServices.map((s) => s.slug));

  it("defines all 4 core enterprise architectures with full metadata", () => {
    expect(ARCHITECTURE_TOPOLOGIES.length).toBe(4);
    const expectedIds = ["telemetry", "edge-ecommerce", "ai-search", "modular-monolith"];

    expectedIds.forEach((id) => {
      const top = ARCHITECTURE_TOPOLOGIES.find((t) => t.id === id);
      expect(top).toBeDefined();
      expect(top?.title.length).toBeGreaterThan(10);
      expect(top?.scopePrice).toMatch(/^\$\d+/);
      expect(top?.peakThroughput.length).toBeGreaterThan(0);
      expect(top?.p99Latency.length).toBeGreaterThan(0);
      expect(top?.costSavings).toMatch(/-\d+%/);
    });
  });

  it("verifies every topology links to verified production case studies and service sprints", () => {
    for (const top of ARCHITECTURE_TOPOLOGIES) {
      expect(projectSlugs.has(top.caseStudySlug)).toBe(true);
      expect(serviceSlugs.has(top.serviceSlug)).toBe(true);
    }
  });

  it("verifies each architecture contains 5 sequential nodes with complete technical rationale", () => {
    for (const top of ARCHITECTURE_TOPOLOGIES) {
      expect(top.nodes.length).toBe(5);

      for (const node of top.nodes) {
        expect(node.id).toBeTruthy();
        expect(node.label).toBeTruthy();
        expect(node.throughput).toBeTruthy();
        expect(node.latencyBudget).toBeTruthy();
        expect(node.rationale.length).toBeGreaterThan(20);
        expect(node.resiliency.length).toBeGreaterThan(20);
      }
    }
  });

  it("verifies message sequence steps define protocols and latency budgets for all hops", () => {
    for (const top of ARCHITECTURE_TOPOLOGIES) {
      expect(top.sequenceSteps.length).toBeGreaterThanOrEqual(5);

      top.sequenceSteps.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.from).toBeTruthy();
        expect(step.to).toBeTruthy();
        expect(step.protocol).toBeTruthy();
        expect(step.payload).toBeTruthy();
        expect(step.latencyBudget).toBeTruthy();
        expect(step.description.length).toBeGreaterThan(15);
      });
    }
  });

  it("verifies failover and chaos engineering scenarios have verified MTTR and recovery logs", () => {
    for (const top of ARCHITECTURE_TOPOLOGIES) {
      const chaos = top.failoverScenario;
      expect(chaos).toBeDefined();
      expect(chaos.title).toBeTruthy();
      expect(chaos.triggerName).toBeTruthy();
      expect(chaos.failedComponent).toBeTruthy();
      expect(chaos.fallbackRoute).toBeTruthy();
      expect(chaos.recoveryTimeMs).toBeGreaterThan(0);
      expect(chaos.recoveryTimeMs).toBeLessThanOrEqual(1000); // Sub-second MTTR
      expect(chaos.recoveryLogs.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("verifies tech stack trade-offs document chosen vs rejected alternatives with empirical evidence", () => {
    for (const top of ARCHITECTURE_TOPOLOGIES) {
      expect(top.techTradeoffs.length).toBeGreaterThanOrEqual(3);

      for (const tradeoff of top.techTradeoffs) {
        expect(tradeoff.layer).toBeTruthy();
        expect(tradeoff.chosenTech).toBeTruthy();
        expect(tradeoff.rejectedAlternative).toBeTruthy();
        expect(tradeoff.whyChosen.length).toBeGreaterThan(25);
        expect(tradeoff.benchmarkAdvantage.length).toBeGreaterThan(15);
      }
    }
  });
});
