import { describe, it, expect } from "vitest";
import {
  PROJECT_ARCHITECTURES,
  getProjectArchitecture,
} from "../app/lib/project-architectures";
import { initialProjects, initialServices } from "../app/data/portfolio-data";

describe("Case Study Interactive Architecture Engine", () => {
  const serviceSlugs = new Set(initialServices.map((s) => s.slug));

  it("verifies all major case studies have rich architectural blueprints defined", () => {
    const expectedSlugs = [
      "financial-telemetry-pipeline",
      "cloudflare-edge-ecommerce",
      "enterprise-ai-document-search",
      "postgres-performance-audit",
      "zero-trust-auth-service",
      "developer-docs-engine",
      "etl-automation-engine",
    ];

    expectedSlugs.forEach((slug) => {
      const arch = getProjectArchitecture(slug);
      expect(arch).toBeDefined();
      expect(arch?.title.length).toBeGreaterThan(10);
      expect(arch?.tagline.length).toBeGreaterThan(15);
      expect(arch?.scopePrice).toMatch(/^\$\d+/);
      expect(arch?.peakThroughput.length).toBeGreaterThan(0);
      expect(arch?.p99Latency.length).toBeGreaterThan(0);
      expect(arch?.costSavings.length).toBeGreaterThan(0);
      expect(arch?.resiliencyGrade.length).toBeGreaterThan(0);
      expect(serviceSlugs.has(arch!.primaryServiceSlug)).toBe(true);
    });
  });

  it("verifies each architecture defines 5 sequential nodes with complete rationale and code blueprints", () => {
    Object.values(PROJECT_ARCHITECTURES).forEach((arch) => {
      expect(arch.nodes.length).toBe(5);

      arch.nodes.forEach((node, idx) => {
        expect(node.id).toBeTruthy();
        expect(node.label).toBeTruthy();
        expect(node.sub).toBeTruthy();
        expect(node.tech).toBeTruthy();
        expect(node.throughput).toBeTruthy();
        expect(node.latencyBudget).toBeTruthy();
        expect(node.rationale.length).toBeGreaterThan(25);
        expect(node.resiliency.length).toBeGreaterThan(25);
        expect(node.codeSnippet.length).toBeGreaterThan(30);
        expect(["go", "typescript", "sql", "python", "ini", "javascript"]).toContain(
          node.codeSnippetLang
        );
      });
    });
  });

  it("verifies sequence steps specify protocols and realistic in-flight payloads", () => {
    Object.values(PROJECT_ARCHITECTURES).forEach((arch) => {
      expect(arch.sequenceSteps.length).toBe(5);

      arch.sequenceSteps.forEach((step, idx) => {
        expect(step.stepNumber).toBe(idx + 1);
        expect(step.from).toBeTruthy();
        expect(step.to).toBeTruthy();
        expect(step.protocol).toBeTruthy();
        expect(step.payload.length).toBeGreaterThan(10);
        expect(step.latencyBudget).toBeTruthy();
        expect(step.description.length).toBeGreaterThan(20);
      });
    });
  });

  it("verifies chaos failover scenarios guarantee sub-second MTTR with real recovery log steps", () => {
    Object.values(PROJECT_ARCHITECTURES).forEach((arch) => {
      const chaos = arch.failoverScenario;
      expect(chaos.title).toBeTruthy();
      expect(chaos.triggerName).toBeTruthy();
      expect(chaos.failedComponent).toBeTruthy();
      expect(chaos.fallbackRoute).toBeTruthy();
      expect(chaos.recoveryMechanism).toBeTruthy();
      expect(chaos.recoveryTimeMs).toBeGreaterThan(0);
      expect(chaos.recoveryTimeMs).toBeLessThanOrEqual(1000); // Sub-second SLA
      expect(chaos.recoveryLogs.length).toBeGreaterThanOrEqual(4);

      // Verify recovery log sequence has error/trigger and pass states
      const hasCriticalOrWarn = chaos.recoveryLogs.some((l) =>
        l.includes("CRIT") || l.includes("WARN")
      );
      const hasPass = chaos.recoveryLogs.some((l) => l.includes("PASS"));
      expect(hasCriticalOrWarn).toBe(true);
      expect(hasPass).toBe(true);
    });
  });

  it("verifies technology trade-offs document chosen vs rejected alternatives with empirical advantage", () => {
    Object.values(PROJECT_ARCHITECTURES).forEach((arch) => {
      expect(arch.techTradeoffs.length).toBeGreaterThanOrEqual(3);

      arch.techTradeoffs.forEach((tradeoff) => {
        expect(tradeoff.layer).toBeTruthy();
        expect(tradeoff.chosenTech).toBeTruthy();
        expect(tradeoff.rejectedAlternative).toBeTruthy();
        expect(tradeoff.whyChosen.length).toBeGreaterThan(25);
        expect(tradeoff.benchmarkAdvantage.length).toBeGreaterThan(15);
      });
    });
  });

  it("handles unknown project slugs gracefully with null fallback", () => {
    const unknown = getProjectArchitecture("non-existent-project-xyz");
    expect(unknown).toBeNull();
  });
});
