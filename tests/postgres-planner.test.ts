import { describe, it, expect } from "vitest";
import {
  workloads,
  WorkloadKey,
  TableScaleKey,
  StrategyKey,
} from "../app/components/lab-postgres-planner";

describe("LabPostgresPlanner Dataset & Strategy Rules", () => {
  const expectedWorkloads: WorkloadKey[] = [
    "fintech_ledger",
    "timeseries_telemetry",
    "catalog_search",
  ];
  const expectedScales: TableScaleKey[] = ["100k", "2m", "25m"];
  const expectedStrategies: StrategyKey[] = [
    "seq_scan",
    "single_btree",
    "composite_partial",
    "advanced_specialized",
  ];

  it("exports all 3 enterprise workloads with complete metadata", () => {
    expectedWorkloads.forEach((wKey) => {
      const workload = workloads[wKey];
      expect(workload).toBeDefined();
      expect(workload.id).toBe(wKey);
      expect(workload.title).toBeTruthy();
      expect(workload.subtitle).toBeTruthy();
      expect(workload.tableName).toBeTruthy();
      expect(workload.querySql).toContain("SELECT");
    });
  });

  it("defines comprehensive matrix coverage across 3 scales and 4 strategies (36 plan outcomes)", () => {
    let outcomeCount = 0;

    expectedWorkloads.forEach((wKey) => {
      const workload = workloads[wKey];
      expectedScales.forEach((scale) => {
        const scaleData = workload.data[scale];
        expect(scaleData).toBeDefined();

        expectedStrategies.forEach((strat) => {
          const outcome = scaleData[strat];
          expect(outcome).toBeDefined();
          expect(outcome.strategyName).toBeTruthy();
          expect(outcome.scanType).toBeTruthy();
          expect(outcome.totalCost).toMatch(/\.\./);
          expect(outcome.executionTimeMs).toBeGreaterThan(0);
          expect(outcome.speedup).toBeTruthy();
          expect(outcome.planOutput).toBeTruthy();
          expect(outcome.treeNodes.length).toBeGreaterThan(0);

          outcomeCount++;
        });
      });
    });

    expect(outcomeCount).toBe(36);
  });

  it("demonstrates progressive optimization: optimized strategies beat sequential scan at all scales", () => {
    expectedWorkloads.forEach((wKey) => {
      const workload = workloads[wKey];
      expectedScales.forEach((scale) => {
        const seqTime = workload.data[scale].seq_scan.executionTimeMs;
        const compTime = workload.data[scale].composite_partial.executionTimeMs;
        const advTime = workload.data[scale].advanced_specialized.executionTimeMs;

        // Composite partial or advanced specialized should always be faster than baseline seq scan
        expect(compTime).toBeLessThan(seqTime);
        expect(advTime).toBeLessThan(seqTime);
      });
    });
  });

  it("provides valid zero-downtime DDL with CONCURRENTLY index creation and rollback scripts", () => {
    expectedWorkloads.forEach((wKey) => {
      const workload = workloads[wKey];
      const prodOutcome = workload.data["2m"].composite_partial;
      expect(prodOutcome.indexSql).toContain("CREATE INDEX CONCURRENTLY");
      expect(prodOutcome.rollbackSql).toContain("DROP INDEX CONCURRENTLY");

      const advOutcome = workload.data["25m"].advanced_specialized;
      expect(advOutcome.indexSql).toContain("CREATE INDEX CONCURRENTLY");
      expect(advOutcome.rollbackSql).toContain("DROP INDEX CONCURRENTLY");
    });
  });

  it("flags execution bottlenecks with hotspot nodes in sequential scans", () => {
    expectedWorkloads.forEach((wKey) => {
      const workload = workloads[wKey];
      expectedScales.forEach((scale) => {
        const seqNodes = workload.data[scale].seq_scan.treeNodes;
        const hasHotspot = seqNodes.some((n) => n.isHotspot);
        expect(hasHotspot).toBe(true);
      });
    });
  });
});
