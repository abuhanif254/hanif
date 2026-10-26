import { describe, it, expect } from "vitest";
import {
  calculateSowBreakdown,
  generateSowPrintHtml,
  SowPrintData,
} from "../app/components/sow-generator";
import {
  generateArchitectureBlueprintHtml,
} from "../app/components/case-study-architecture-viewer";
import {
  getProjectArchitecture,
  PROJECT_ARCHITECTURES,
} from "../app/lib/project-architectures";
import { initialServices } from "../app/data/portfolio-data";

describe("Automated SOW PDF & Print Engine", () => {
  it("should generate a complete corporate printable SOW HTML document", () => {
    const service = initialServices.find((s) => s.slug === "database-optimization")!;
    expect(service).toBeDefined();

    const breakdown = calculateSowBreakdown(service, ["migration", "security_rls"]);
    const printData: SowPrintData = {
      service,
      breakdown,
      clientCompany: "Acme Corp International",
      clientContact: "Sarah Jenkins, VP of Engineering",
      targetStartDate: "Immediate (Within 7 Days)",
      documentId: "SOW-2026-DATA-9876",
    };

    const html = generateSowPrintHtml(printData);

    // Verify valid HTML document structure
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html lang=\"en\">");
    expect(html).toContain("</html>");
    expect(html).toContain("SOW-2026-DATA-9876");

    // Verify print CSS & page break rules
    expect(html).toContain("@page");
    expect(html).toContain("size: A4 portrait");
    expect(html).toContain("@media print");
    expect(html).toContain(".no-print");
    expect(html).toContain("page-break-inside: avoid");

    // Verify parties & credentials
    expect(html).toContain("Acme Corp International");
    expect(html).toContain("Sarah Jenkins, VP of Engineering");
    expect(html).toContain("MD Abu Hanif Mia");
    expect(html).toContain("B.Sc. in CSE");
    expect(html).toContain("WEB12-3991");
    expect(html).toContain("abuhanifmain@gmail.com");

    // Verify milestones table & total
    expect(html).toContain("M01");
    expect(html).toContain("M02");
    expect(html).toContain("M03");
    expect(html).toContain("TOTAL FIXED SOW INVESTMENT");
    expect(html).toContain(`$${breakdown.totalInvestment.toLocaleString()} USD`);

    // Verify legal and warranty terms
    expect(html).toContain("100% Client IP Ownership");
    expect(html).toContain("30-Day Production Bug Warranty");
    expect(html).toContain("Mutual NDA &amp; Confidentiality");
    expect(html).toContain("Direct Execution");

    // Verify dual signature block
    expect(html).toContain("Verified Principal Architect");
    expect(html).toContain("Client Acceptance Signature");
    expect(html).toContain("window.print()");
  });
});

describe("Printable Architecture Blueprint & RFC Export Engine", () => {
  it("should generate a high-definition architecture blueprint for financial-telemetry-pipeline", () => {
    const arch = getProjectArchitecture("financial-telemetry-pipeline");
    expect(arch).toBeDefined();

    const html = generateArchitectureBlueprintHtml(arch!);

    // Document structure & reference
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("ARCH-SPEC-2026-FINANCIAL-TELEMETRY-PIPELINE");
    expect(html).toContain(arch!.title.toUpperCase());

    // Executive KPI metrics
    expect(html).toContain(arch!.peakThroughput);
    expect(html).toContain(arch!.p99Latency);
    expect(html).toContain(arch!.costSavings);
    expect(html).toContain(`${arch!.failoverScenario.recoveryTimeMs}ms MTTR`);

    // 5-Tier Topology section
    expect(html).toContain("Distributed 5-Tier Topology Specification");
    arch!.nodes.forEach((node) => {
      expect(html).toContain(node.label);
      expect(html).toContain(node.tech);
      expect(html).toContain(node.latencyBudget);
    });

    // Dataflow Sequence Protocol section
    expect(html).toContain("High-Throughput Dataflow Sequence Protocol");
    arch!.sequenceSteps.forEach((step) => {
      expect(html).toContain(step.protocol);
      expect(html).toContain(step.latencyBudget);
    });

    // Chaos & Disaster Recovery section
    expect(html).toContain("Chaos Engineering &amp; Disaster Recovery Protocol");
    expect(html).toContain(arch!.failoverScenario.triggerName);
    expect(html).toContain(arch!.failoverScenario.failedComponent);
    expect(html).toContain(arch!.failoverScenario.recoveryMechanism);
    arch!.failoverScenario.recoveryLogs.forEach((log) => {
      expect(html).toContain(log);
    });

    // Architecture Decision Records (ADR) Trade-offs
    expect(html).toContain("Architecture Decision Records (ADR) &amp; Trade-off Matrix");
    arch!.techTradeoffs.forEach((item) => {
      expect(html).toContain(item.chosenTech);
      expect(html).toContain(item.rejectedAlternative);
      expect(html).toContain(item.benchmarkAdvantage);
    });

    // IP Handover & Dual Signatures
    expect(html).toContain("100% Client Intellectual Property");
    expect(html).toContain("30-Day Production Bug Warranty");
    expect(html).toContain("Enterprise Technical Acceptance");
    expect(html).toContain("MD Abu Hanif Mia");
    expect(html).toContain("window.print()");
  });

  it("should successfully generate blueprint HTML for all 7 registered architectures", () => {
    const slugs = Object.keys(PROJECT_ARCHITECTURES);
    expect(slugs.length).toBeGreaterThanOrEqual(7);

    slugs.forEach((slug) => {
      const arch = PROJECT_ARCHITECTURES[slug];
      expect(arch).toBeDefined();

      const html = generateArchitectureBlueprintHtml(arch);
      expect(html).toContain("SYSTEMS ARCHITECTURE BLUEPRINT");
      expect(html).toContain(arch.title.toUpperCase());
      expect(html).toContain("Distributed 5-Tier Topology Specification");
      expect(html).toContain("Chaos Engineering &amp; Disaster Recovery Protocol");
      expect(html).toContain("MD Abu Hanif Mia");
      expect(html.length).toBeGreaterThan(1500);
    });
  });
});
