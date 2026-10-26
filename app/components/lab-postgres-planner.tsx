"use client";

import React, { useState } from "react";
import Link from "next/link";

export type WorkloadKey = "fintech_ledger" | "timeseries_telemetry" | "catalog_search";
export type TableScaleKey = "100k" | "2m" | "25m";
export type StrategyKey = "seq_scan" | "single_btree" | "composite_partial" | "advanced_specialized";

export interface PlanNode {
  name: string;
  cost: string;
  timeMs: number;
  buffers: string;
  isHotspot: boolean;
  description: string;
}

export interface PlanOutcome {
  strategyName: string;
  badge: string;
  scanType: string;
  totalCost: string;
  executionTimeMs: number;
  bufferHits: string;
  diskReads: string;
  ramCacheRatio: string;
  speedup: string;
  indexSql: string;
  rollbackSql: string;
  tuningRationale: string;
  treeNodes: PlanNode[];
  planOutput: string;
}

export interface WorkloadDefinition {
  id: WorkloadKey;
  title: string;
  subtitle: string;
  querySql: string;
  tableName: string;
  strategies: Record<StrategyKey, { label: string; badge: string }>;
  data: Record<TableScaleKey, Record<StrategyKey, PlanOutcome>>;
}

export const workloads: Record<WorkloadKey, WorkloadDefinition> = {
  fintech_ledger: {
    id: "fintech_ledger",
    title: "High-Concurrency Multi-Tenant Ledger",
    subtitle: "High write throughput, sub-5ms P99 pagination across millions of ledger transactions",
    tableName: "transactions",
    querySql: `SELECT id, amount, currency, created_at
FROM transactions
WHERE tenant_id = 't_enterprise_99'
  AND status = 'completed'
ORDER BY created_at DESC
LIMIT 50;`,
    strategies: {
      seq_scan: { label: "Seq Scan (No Index)", badge: "Unindexed Baseline" },
      single_btree: { label: "Single B-Tree (tenant_id)", badge: "Naive Indexing" },
      composite_partial: { label: "Composite Partial B-Tree", badge: "Surgical Production Index" },
      advanced_specialized: { label: "Covering Index (INCLUDE)", badge: "Zero-Heap Index Only" },
    },
    data: {
      "100k": {
        seq_scan: {
          strategyName: "Sequential Table Scan (No Index)",
          badge: "Baseline",
          scanType: "Seq Scan on transactions",
          totalCost: "0.00..2,450.00",
          executionTimeMs: 142.5,
          bufferHits: "30 blocks",
          diskReads: "1,210 blocks",
          ramCacheRatio: "2.4% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "Sequential scan reads entire heap from disk into shared buffers, causing cache thrashing.",
          treeNodes: [
            { name: "Limit", cost: "2449.10..2450.00", timeMs: 142.4, buffers: "1240", isHotspot: false, description: "Extracts first 50 matched rows" },
            { name: "Sort (created_at DESC)", cost: "2400.00..2449.10", timeMs: 138.2, buffers: "1240", isHotspot: true, description: "In-memory Quicksort across 1,240 filtered candidates" },
            { name: "Seq Scan (transactions)", cost: "0.00..2200.00", timeMs: 110.5, buffers: "1210 read", isHotspot: true, description: "Full table scan reading 100,000 tuples" },
          ],
          planOutput: `Limit  (cost=2449.10..2450.00 rows=50 width=48) (actual time=142.120..142.410 rows=50 loops=1)
  Buffers: shared read=1210 hit=30
  ->  Sort  (cost=2400.00..2449.10 rows=1240 width=48) (actual time=142.110..142.150 rows=50 loops=1)
        Sort Key: created_at DESC
        Sort Method: top-N heapsort  Memory: 32kB
        ->  Seq Scan on transactions  (cost=0.00..2200.00 rows=1240 width=48) (actual time=0.042..136.200 rows=1240 loops=1)
              Filter: ((tenant_id = 't_enterprise_99') AND (status = 'completed'))
              Rows Removed by Filter: 98760
Execution Time: 142.512 ms`,
        },
        single_btree: {
          strategyName: "Single B-Tree on tenant_id",
          badge: "Naive B-Tree",
          scanType: "Bitmap Heap Scan on transactions",
          totalCost: "12.40..340.00",
          executionTimeMs: 14.8,
          bufferHits: "310 blocks",
          diskReads: "24 blocks",
          ramCacheRatio: "92.8% RAM Hit",
          speedup: "9.6x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_tenant ON transactions (tenant_id);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_tenant;`,
          tuningRationale: "Reduces scan space to tenant records, but still performs in-memory sorting and heap lookups.",
          treeNodes: [
            { name: "Limit", cost: "338.00..340.00", timeMs: 14.7, buffers: "334", isHotspot: false, description: "Top 50 results" },
            { name: "Sort (created_at DESC)", cost: "310.00..338.00", timeMs: 13.9, buffers: "334", isHotspot: true, description: "Sorts unsorted tenant heap rows" },
            { name: "Bitmap Heap Scan", cost: "12.40..290.00", timeMs: 8.2, buffers: "310 hit, 24 read", isHotspot: false, description: "Fetches table blocks to test status = 'completed'" },
            { name: "Bitmap Index Scan", cost: "0.00..12.00", timeMs: 1.1, buffers: "12 hit", isHotspot: false, description: "Scans idx_trans_tenant for matching pointers" },
          ],
          planOutput: `Limit  (cost=338.00..340.00 rows=50 width=48) (actual time=14.500..14.720 rows=50 loops=1)
  Buffers: shared hit=310 read=24
  ->  Sort  (cost=310.00..338.00 rows=1240 width=48) (actual time=14.480..14.510 rows=50 loops=1)
        Sort Key: created_at DESC
        Sort Method: top-N heapsort  Memory: 32kB
        ->  Bitmap Heap Scan on transactions  (cost=12.40..290.00 rows=1240 width=48) (actual time=1.210..13.800 rows=1240 loops=1)
              Recheck Cond: (tenant_id = 't_enterprise_99')
              Filter: (status = 'completed')
              ->  Bitmap Index Scan on idx_trans_tenant  (cost=0.00..12.00 rows=3800) (actual time=0.820..0.820 rows=3800 loops=1)
Execution Time: 14.802 ms`,
        },
        composite_partial: {
          strategyName: "Composite Partial B-Tree (Surgical)",
          badge: "Surgical Index",
          scanType: "Index Scan Backward on idx_trans_tenant_created",
          totalCost: "0.42..8.45",
          executionTimeMs: 0.82,
          bufferHits: "6 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "173x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_tenant_created
ON transactions (tenant_id, created_at DESC)
WHERE status = 'completed';`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_tenant_created;`,
          tuningRationale: "Zero in-memory sort required. Index is pre-ordered by created_at DESC and only stores completed rows (reducing index RAM size by 78%).",
          treeNodes: [
            { name: "Limit", cost: "0.42..8.45", timeMs: 0.81, buffers: "6 hit", isHotspot: false, description: "Returns first 50 already-sorted tuples" },
            { name: "Index Scan (Direct B-Tree)", cost: "0.42..8.45", timeMs: 0.78, buffers: "6 hit (100% RAM)", isHotspot: false, description: "Traverses B-Tree leaves directly, stops after 50 hits" },
          ],
          planOutput: `Limit  (cost=0.42..8.45 rows=50 width=48) (actual time=0.024..0.780 rows=50 loops=1)
  Buffers: shared hit=6
  ->  Index Scan using idx_trans_tenant_created on transactions  (cost=0.42..208.50 rows=1240 width=48) (actual time=0.022..0.740 rows=50 loops=1)
        Index Cond: (tenant_id = 't_enterprise_99')
Execution Time: 0.820 ms`,
        },
        advanced_specialized: {
          strategyName: "Covering Index with INCLUDE (Index-Only Scan)",
          badge: "Index-Only Scan",
          scanType: "Index Only Scan Backward",
          totalCost: "0.42..4.12",
          executionTimeMs: 0.38,
          bufferHits: "4 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "375x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_covering
ON transactions (tenant_id, created_at DESC)
INCLUDE (amount, currency)
WHERE status = 'completed';`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_covering;`,
          tuningRationale: "Index-Only Scan eliminates heap table access entirely. All SELECT columns are answered directly from B-Tree leaf pages.",
          treeNodes: [
            { name: "Limit", cost: "0.42..4.12", timeMs: 0.37, buffers: "4 hit", isHotspot: false, description: "Top 50 results directly from index" },
            { name: "Index Only Scan", cost: "0.42..4.12", timeMs: 0.35, buffers: "4 hit", isHotspot: false, description: "Zero heap lookups (Visibility Map 100%)" },
          ],
          planOutput: `Limit  (cost=0.42..4.12 rows=50 width=48) (actual time=0.015..0.360 rows=50 loops=1)
  Buffers: shared hit=4
  ->  Index Only Scan using idx_trans_covering on transactions  (cost=0.42..98.10 rows=1240 width=48) (actual time=0.014..0.340 rows=50 loops=1)
        Index Cond: (tenant_id = 't_enterprise_99')
        Heap Fetches: 0
Execution Time: 0.380 ms`,
        },
      },
      "2m": {
        seq_scan: {
          strategyName: "Sequential Table Scan (No Index)",
          badge: "Baseline",
          scanType: "Seq Scan on transactions (Table Thrashing)",
          totalCost: "0.00..58,914.00",
          executionTimeMs: 4210.0,
          bufferHits: "1,450 blocks",
          diskReads: "28,500 blocks",
          ramCacheRatio: "4.8% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "Reads ~230MB of raw table blocks into Postgres shared buffers, evicting other cache entries and causing P99 spikes.",
          treeNodes: [
            { name: "Limit", cost: "58912.00..58914.00", timeMs: 4208.5, buffers: "29950", isHotspot: false, description: "Top 50 rows" },
            { name: "Sort (created_at DESC)", cost: "58200.00..58912.00", timeMs: 4180.0, buffers: "29950", isHotspot: true, description: "Memory overflow to temporary disk spill (work_mem exhaustion)" },
            { name: "Seq Scan on transactions", cost: "0.00..54100.00", timeMs: 3820.0, buffers: "28500 read", isHotspot: true, description: "Scanned 2,000,000 physical tuples" },
          ],
          planOutput: `Limit  (cost=58912.00..58914.00 rows=50 width=48) (actual time=4180.200..4208.500 rows=50 loops=1)
  Buffers: shared read=28500 hit=1450
  ->  Sort  (cost=58200.00..58912.00 rows=18400 width=48) (actual time=4180.180..4180.220 rows=50 loops=1)
        Sort Key: created_at DESC
        Sort Method: external merge Disk: 4820kB
        ->  Seq Scan on transactions  (cost=0.00..54100.00 rows=18400 width=48) (actual time=0.120..3950.000 rows=18400 loops=1)
              Filter: ((tenant_id = 't_enterprise_99') AND (status = 'completed'))
              Rows Removed by Filter: 1981600
Execution Time: 4210.000 ms`,
        },
        single_btree: {
          strategyName: "Single B-Tree on tenant_id",
          badge: "Naive B-Tree",
          scanType: "Bitmap Heap Scan on transactions",
          totalCost: "84.20..3,840.00",
          executionTimeMs: 248.0,
          bufferHits: "3,120 blocks",
          diskReads: "620 blocks",
          ramCacheRatio: "83.4% RAM Hit",
          speedup: "17x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_tenant ON transactions (tenant_id);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_tenant;`,
          tuningRationale: "Filters tenant rows, but 18,400 heap lookups and an in-memory Sort still take nearly a quarter of a second.",
          treeNodes: [
            { name: "Limit", cost: "3835.00..3840.00", timeMs: 247.5, buffers: "3740", isHotspot: false, description: "Returns 50 rows" },
            { name: "Sort (created_at DESC)", cost: "3600.00..3835.00", timeMs: 220.0, buffers: "3740", isHotspot: true, description: "Sorts 18,400 matched tuples" },
            { name: "Bitmap Heap Scan", cost: "84.20..3120.00", timeMs: 140.0, buffers: "3120 hit, 620 read", isHotspot: true, description: "Fetches table pages for status filter" },
            { name: "Bitmap Index Scan", cost: "0.00..84.00", timeMs: 8.5, buffers: "84 hit", isHotspot: false, description: "B-Tree scan on idx_trans_tenant" },
          ],
          planOutput: `Limit  (cost=3835.00..3840.00 rows=50 width=48) (actual time=242.000..247.500 rows=50 loops=1)
  Buffers: shared hit=3120 read=620
  ->  Sort  (cost=3600.00..3835.00 rows=18400 width=48) (actual time=241.980..242.040 rows=50 loops=1)
        Sort Key: created_at DESC
        Sort Method: top-N heapsort  Memory: 34kB
        ->  Bitmap Heap Scan on transactions  (cost=84.20..3120.00 rows=18400 width=48) (actual time=4.810..210.000 rows=18400 loops=1)
              Recheck Cond: (tenant_id = 't_enterprise_99')
              Filter: (status = 'completed')
              ->  Bitmap Index Scan on idx_trans_tenant  (cost=0.00..84.00 rows=48000) (actual time=3.200..3.200 rows=48000 loops=1)
Execution Time: 248.000 ms`,
        },
        composite_partial: {
          strategyName: "Composite Partial B-Tree (Surgical)",
          badge: "Surgical Index",
          scanType: "Index Scan Backward on idx_trans_tenant_created",
          totalCost: "0.42..14.80",
          executionTimeMs: 1.84,
          bufferHits: "14 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "2,288x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_tenant_created
ON transactions (tenant_id, created_at DESC)
WHERE status = 'completed';`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_tenant_created;`,
          tuningRationale: "Executes in under 2 milliseconds across 2 million rows. Drops from 4,210ms to 1.84ms with zero disk I/O.",
          treeNodes: [
            { name: "Limit", cost: "0.42..14.80", timeMs: 1.82, buffers: "14 hit", isHotspot: false, description: "Extracts top 50 in reverse index order" },
            { name: "Index Scan (Direct B-Tree)", cost: "0.42..14.80", timeMs: 1.76, buffers: "14 hit (100% RAM)", isHotspot: false, description: "Traverses index directly to retrieve matching tuples" },
          ],
          planOutput: `Limit  (cost=0.42..14.80 rows=50 width=48) (actual time=0.024..1.780 rows=50 loops=1)
  Buffers: shared hit=14
  ->  Index Scan using idx_trans_tenant_created on transactions  (cost=0.42..482.00 rows=18400 width=48) (actual time=0.022..1.720 rows=50 loops=1)
        Index Cond: (tenant_id = 't_enterprise_99')
Execution Time: 1.840 ms`,
        },
        advanced_specialized: {
          strategyName: "Covering Index with INCLUDE (Index-Only Scan)",
          badge: "Index-Only Scan",
          scanType: "Index Only Scan Backward",
          totalCost: "0.42..6.20",
          executionTimeMs: 0.64,
          bufferHits: "8 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "6,578x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_covering
ON transactions (tenant_id, created_at DESC)
INCLUDE (amount, currency)
WHERE status = 'completed';`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_covering;`,
          tuningRationale: "Pure RAM read. Sub-millisecond response time even under peak Black Friday concurrency.",
          treeNodes: [
            { name: "Limit", cost: "0.42..6.20", timeMs: 0.62, buffers: "8 hit", isHotspot: false, description: "Direct index pipeline" },
            { name: "Index Only Scan", cost: "0.42..6.20", timeMs: 0.58, buffers: "8 hit", isHotspot: false, description: "Zero heap fetch overhead" },
          ],
          planOutput: `Limit  (cost=0.42..6.20 rows=50 width=48) (actual time=0.016..0.590 rows=50 loops=1)
  Buffers: shared hit=8
  ->  Index Only Scan using idx_trans_covering on transactions  (cost=0.42..180.00 rows=18400 width=48) (actual time=0.015..0.560 rows=50 loops=1)
        Index Cond: (tenant_id = 't_enterprise_99')
        Heap Fetches: 0
Execution Time: 0.640 ms`,
        },
      },
      "25m": {
        seq_scan: {
          strategyName: "Sequential Table Scan (No Index)",
          badge: "Severe Latency Risk",
          scanType: "Seq Scan on transactions (Timeout Danger)",
          totalCost: "0.00..485,000.00",
          executionTimeMs: 38400.0,
          bufferHits: "8,200 blocks",
          diskReads: "320,000 blocks",
          ramCacheRatio: "2.5% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "Over 38 seconds of execution time. Web requests will time out, saturating pool connections and taking the app down.",
          treeNodes: [
            { name: "Limit", cost: "484900.00..485000.00", timeMs: 38390.0, buffers: "328200", isHotspot: true, description: "Waiting on disk I/O" },
            { name: "Sort (created_at DESC)", cost: "472000.00..484900.00", timeMs: 36500.0, buffers: "328200", isHotspot: true, description: "Huge temporary disk sort" },
            { name: "Seq Scan on transactions", cost: "0.00..420000.00", timeMs: 32000.0, buffers: "320000 read", isHotspot: true, description: "Reads 25 Million rows from storage volume" },
          ],
          planOutput: `Limit  (cost=484900.00..485000.00 rows=50 width=48) (actual time=38200.000..38390.000 rows=50 loops=1)
  Buffers: shared read=320000 hit=8200
  ->  Sort  (cost=472000.00..484900.00 rows=230000 width=48) (actual time=38198.000..38200.000 rows=50 loops=1)
        Sort Key: created_at DESC
        Sort Method: external merge Disk: 48500kB
        ->  Seq Scan on transactions  (cost=0.00..420000.00 rows=230000 width=48) (actual time=1.400..34200.000 rows=230000 loops=1)
              Filter: ((tenant_id = 't_enterprise_99') AND (status = 'completed'))
              Rows Removed by Filter: 24770000
Execution Time: 38400.000 ms (~38.4 Seconds!)`,
        },
        single_btree: {
          strategyName: "Single B-Tree on tenant_id",
          badge: "Naive B-Tree",
          scanType: "Bitmap Heap Scan on transactions",
          totalCost: "450.00..28,000.00",
          executionTimeMs: 1840.0,
          bufferHits: "14,500 blocks",
          diskReads: "4,200 blocks",
          ramCacheRatio: "77.5% RAM Hit",
          speedup: "20.8x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_tenant ON transactions (tenant_id);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_tenant;`,
          tuningRationale: "Takes nearly 2 seconds. Better than 38 seconds, but far exceeds 25ms SLA requirements.",
          treeNodes: [
            { name: "Limit", cost: "27800.00..28000.00", timeMs: 1835.0, buffers: "18700", isHotspot: false, description: "Top 50 results" },
            { name: "Sort (created_at DESC)", cost: "26000.00..27800.00", timeMs: 1720.0, buffers: "18700", isHotspot: true, description: "Sorts 230,000 matches" },
            { name: "Bitmap Heap Scan", cost: "450.00..22000.00", timeMs: 1150.0, buffers: "14500 hit, 4200 read", isHotspot: true, description: "Excessive random I/O reads across fragmented table blocks" },
          ],
          planOutput: `Limit  (cost=27800.00..28000.00 rows=50 width=48) (actual time=1810.000..1835.000 rows=50 loops=1)
  Buffers: shared hit=14500 read=4200
  ->  Sort  (cost=26000.00..27800.00 rows=230000 width=48) (actual time=1808.000..1810.000 rows=50 loops=1)
        Sort Key: created_at DESC
        ->  Bitmap Heap Scan on transactions  (cost=450.00..22000.00 rows=230000 width=48) (actual time=12.400..1520.000 rows=230000 loops=1)
              Recheck Cond: (tenant_id = 't_enterprise_99')
              Filter: (status = 'completed')
Execution Time: 1840.000 ms`,
        },
        composite_partial: {
          strategyName: "Composite Partial B-Tree (Surgical)",
          badge: "Surgical Index",
          scanType: "Index Scan Backward on idx_trans_tenant_created",
          totalCost: "0.42..24.50",
          executionTimeMs: 3.12,
          bufferHits: "22 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "12,307x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_tenant_created
ON transactions (tenant_id, created_at DESC)
WHERE status = 'completed';`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_tenant_created;`,
          tuningRationale: "Executes in 3.12ms on 25 million records. Bypasses 99.99% of data with 100% RAM buffer hit rate.",
          treeNodes: [
            { name: "Limit", cost: "0.42..24.50", timeMs: 3.10, buffers: "22 hit", isHotspot: false, description: "Extracts top 50 in pre-sorted order" },
            { name: "Index Scan", cost: "0.42..24.50", timeMs: 3.02, buffers: "22 hit (100% RAM)", isHotspot: false, description: "B-Tree scan on idx_trans_tenant_created" },
          ],
          planOutput: `Limit  (cost=0.42..24.50 rows=50 width=48) (actual time=0.032..3.020 rows=50 loops=1)
  Buffers: shared hit=22
  ->  Index Scan using idx_trans_tenant_created on transactions  (cost=0.42..940.00 rows=230000 width=48) (actual time=0.030..2.960 rows=50 loops=1)
        Index Cond: (tenant_id = 't_enterprise_99')
Execution Time: 3.120 ms`,
        },
        advanced_specialized: {
          strategyName: "Covering Index with INCLUDE (Index-Only Scan)",
          badge: "Index-Only Scan",
          scanType: "Index Only Scan Backward",
          totalCost: "0.42..11.20",
          executionTimeMs: 1.15,
          bufferHits: "12 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "33,391x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_trans_covering
ON transactions (tenant_id, created_at DESC)
INCLUDE (amount, currency)
WHERE status = 'completed';`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_trans_covering;`,
          tuningRationale: "Reduces execution time to 1.15ms. Massive speedup from 38,400ms baseline. Guarantees 99.99% production SLA.",
          treeNodes: [
            { name: "Limit", cost: "0.42..11.20", timeMs: 1.12, buffers: "12 hit", isHotspot: false, description: "Zero disk access" },
            { name: "Index Only Scan", cost: "0.42..11.20", timeMs: 1.08, buffers: "12 hit", isHotspot: false, description: "Index-Only Scan using idx_trans_covering" },
          ],
          planOutput: `Limit  (cost=0.42..11.20 rows=50 width=48) (actual time=0.021..1.080 rows=50 loops=1)
  Buffers: shared hit=12
  ->  Index Only Scan using idx_trans_covering on transactions  (cost=0.42..340.00 rows=230000 width=48) (actual time=0.019..1.020 rows=50 loops=1)
        Index Cond: (tenant_id = 't_enterprise_99')
        Heap Fetches: 0
Execution Time: 1.150 ms`,
        },
      },
    },
  },
  timeseries_telemetry: {
    id: "timeseries_telemetry",
    title: "High-Volume Time-Series Telemetry (Metrics)",
    subtitle: "Heavy append-only telemetry ingestion with window aggregation over recent time slices",
    tableName: "sensor_telemetry",
    querySql: `SELECT device_id, AVG(cpu_temperature), MAX(voltage)
FROM sensor_telemetry
WHERE recorded_at >= NOW() - INTERVAL '1 hour'
GROUP BY device_id;`,
    strategies: {
      seq_scan: { label: "Seq Scan (No Index)", badge: "Unindexed Baseline" },
      single_btree: { label: "Standard B-Tree (recorded_at)", badge: "High RAM Overhead" },
      composite_partial: { label: "BRIN (Block Range Index)", badge: "Ultra-Compact Footprint" },
      advanced_specialized: { label: "BRIN with 32 Pages / Range", badge: "Production Telemetry Standard" },
    },
    data: {
      "100k": {
        seq_scan: {
          strategyName: "Sequential Scan",
          badge: "Baseline",
          scanType: "Seq Scan on sensor_telemetry",
          totalCost: "0.00..1,850.00",
          executionTimeMs: 82.4,
          bufferHits: "12 blocks",
          diskReads: "940 blocks",
          ramCacheRatio: "1.3% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "Sequential table scan reads historical blocks despite only requesting the latest 1 hour.",
          treeNodes: [
            { name: "HashAggregate", cost: "1600.00..1850.00", timeMs: 81.9, buffers: "952", isHotspot: false, description: "Aggregates CPU & voltage by device_id" },
            { name: "Seq Scan", cost: "0.00..1400.00", timeMs: 65.0, buffers: "940 read", isHotspot: true, description: "Full table scan across 100K metrics" },
          ],
          planOutput: `HashAggregate  (cost=1600.00..1850.00 rows=250 width=40) (actual time=81.200..81.900 rows=250 loops=1)
  Group Key: device_id
  Buffers: shared read=940 hit=12
  ->  Seq Scan on sensor_telemetry  (cost=0.00..1400.00 rows=4200 width=24) (actual time=0.040..74.200 rows=4180 loops=1)
        Filter: (recorded_at >= (now() - '01:00:00'::interval))
Execution Time: 82.400 ms`,
        },
        single_btree: {
          strategyName: "B-Tree on recorded_at",
          badge: "Standard B-Tree",
          scanType: "Bitmap Heap Scan",
          totalCost: "24.00..420.00",
          executionTimeMs: 7.2,
          bufferHits: "180 blocks",
          diskReads: "18 blocks",
          ramCacheRatio: "90.9% RAM Hit",
          speedup: "11.4x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_time ON sensor_telemetry (recorded_at);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_time;`,
          tuningRationale: "B-Tree accelerates queries, but index size consumes 28MB RAM and incurs heavy write amplification.",
          treeNodes: [
            { name: "HashAggregate", cost: "380.00..420.00", timeMs: 7.1, buffers: "198", isHotspot: false, description: "In-memory aggregation" },
            { name: "Bitmap Heap Scan", cost: "24.00..360.00", timeMs: 5.4, buffers: "180 hit, 18 read", isHotspot: true, description: "Fetches table blocks" },
            { name: "Bitmap Index Scan", cost: "0.00..24.00", timeMs: 0.8, buffers: "8 hit", isHotspot: false, description: "Scans B-Tree on recorded_at" },
          ],
          planOutput: `HashAggregate  (cost=380.00..420.00 rows=250 width=40) (actual time=6.800..7.100 rows=250 loops=1)
  Buffers: shared hit=180 read=18
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=24.00..360.00 rows=4200 width=24) (actual time=0.820..4.900 rows=4180 loops=1)
        Recheck Cond: (recorded_at >= (now() - '01:00:00'::interval))
Execution Time: 7.200 ms`,
        },
        composite_partial: {
          strategyName: "BRIN Index (Block Range Index)",
          badge: "BRIN 128 Pages",
          scanType: "Bitmap Heap Scan (BRIN)",
          totalCost: "4.00..180.00",
          executionTimeMs: 2.4,
          bufferHits: "84 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "34x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_brin
ON sensor_telemetry USING BRIN (recorded_at);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_brin;`,
          tuningRationale: "BRIN index takes only 64KB RAM (99% smaller than B-Tree!) because time-series data is physically correlated on disk.",
          treeNodes: [
            { name: "HashAggregate", cost: "160.00..180.00", timeMs: 2.3, buffers: "84 hit", isHotspot: false, description: "Aggregation" },
            { name: "Bitmap Heap Scan (BRIN)", cost: "4.00..150.00", timeMs: 1.8, buffers: "84 hit", isHotspot: false, description: "Reads contiguous time-series blocks" },
            { name: "Bitmap Index Scan (BRIN)", cost: "0.00..4.00", timeMs: 0.15, buffers: "2 hit", isHotspot: false, description: "Tiny 64KB BRIN summary scan" },
          ],
          planOutput: `HashAggregate  (cost=160.00..180.00 rows=250 width=40) (actual time=2.100..2.300 rows=250 loops=1)
  Buffers: shared hit=84
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=4.00..150.00 rows=4200 width=24) (actual time=0.210..1.700 rows=4180 loops=1)
        Recheck Cond: (recorded_at >= (now() - '01:00:00'::interval))
Execution Time: 2.400 ms`,
        },
        advanced_specialized: {
          strategyName: "Surgically Sized BRIN (pages_per_range = 32)",
          badge: "Precision BRIN",
          scanType: "Bitmap Heap Scan (Precision BRIN)",
          totalCost: "2.00..90.00",
          executionTimeMs: 1.1,
          bufferHits: "42 blocks",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "75x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_brin_p32
ON sensor_telemetry USING BRIN (recorded_at) WITH (pages_per_range = 32);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_brin_p32;`,
          tuningRationale: "Narrowing pages_per_range to 32 reduces lossy recheck overhead while keeping index footprint under 128KB.",
          treeNodes: [
            { name: "HashAggregate", cost: "70.00..90.00", timeMs: 1.05, buffers: "42 hit", isHotspot: false, description: "Aggregates 250 device groups" },
            { name: "Bitmap Heap Scan", cost: "2.00..68.00", timeMs: 0.85, buffers: "42 hit", isHotspot: false, description: "Precision block ranges" },
          ],
          planOutput: `HashAggregate  (cost=70.00..90.00 rows=250 width=40) (actual time=1.000..1.050 rows=250 loops=1)
  Buffers: shared hit=42
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=2.00..68.00 rows=4200 width=24) (actual time=0.120..0.780 rows=4180 loops=1)
        Recheck Cond: (recorded_at >= (now() - '01:00:00'::interval))
Execution Time: 1.100 ms`,
        },
      },
      "2m": {
        seq_scan: {
          strategyName: "Sequential Scan",
          badge: "Baseline",
          scanType: "Seq Scan on sensor_telemetry",
          totalCost: "0.00..38,400.00",
          executionTimeMs: 2840.0,
          bufferHits: "620 blocks",
          diskReads: "18,400 blocks",
          ramCacheRatio: "3.2% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "2.8 seconds of disk churn. Saturates database I/O.",
          treeNodes: [
            { name: "HashAggregate", cost: "36000.00..38400.00", timeMs: 2835.0, buffers: "19020", isHotspot: false, description: "Grouping" },
            { name: "Seq Scan", cost: "0.00..32000.00", timeMs: 2600.0, buffers: "18400 read", isHotspot: true, description: "Full sequential disk scan" },
          ],
          planOutput: `HashAggregate  (cost=36000.00..38400.00 rows=1200 width=40) (actual time=2810.000..2835.000 rows=1200 loops=1)
  Buffers: shared read=18400 hit=620
  ->  Seq Scan on sensor_telemetry  (cost=0.00..32000.00 rows=84000 width=24) (actual time=0.180..2650.000 rows=83800 loops=1)
        Filter: (recorded_at >= (now() - '01:00:00'::interval))
Execution Time: 2840.000 ms`,
        },
        single_btree: {
          strategyName: "B-Tree on recorded_at",
          badge: "Standard B-Tree",
          scanType: "Bitmap Heap Scan",
          totalCost: "420.00..8,400.00",
          executionTimeMs: 94.0,
          bufferHits: "2,400 blocks",
          diskReads: "180 blocks",
          ramCacheRatio: "93.0% RAM Hit",
          speedup: "30.2x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_time ON sensor_telemetry (recorded_at);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_time;`,
          tuningRationale: "Executes in 94ms, but index size is 120MB, slowing down continuous high-speed INSERT transactions.",
          treeNodes: [
            { name: "HashAggregate", cost: "7800.00..8400.00", timeMs: 93.5, buffers: "2580", isHotspot: false, description: "Grouping" },
            { name: "Bitmap Heap Scan", cost: "420.00..7400.00", timeMs: 78.0, buffers: "2400 hit, 180 read", isHotspot: true, description: "Heap random I/O" },
          ],
          planOutput: `HashAggregate  (cost=7800.00..8400.00 rows=1200 width=40) (actual time=91.000..93.500 rows=1200 loops=1)
  Buffers: shared hit=2400 read=180
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=420.00..7400.00 rows=84000 width=24) (actual time=6.200..72.000 rows=83800 loops=1)
Execution Time: 94.000 ms`,
        },
        composite_partial: {
          strategyName: "BRIN Index (Block Range Index)",
          badge: "BRIN 128 Pages",
          scanType: "Bitmap Heap Scan (BRIN)",
          totalCost: "16.00..1,840.00",
          executionTimeMs: 8.4,
          bufferHits: "420 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "338x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_brin
ON sensor_telemetry USING BRIN (recorded_at);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_brin;`,
          tuningRationale: "8.4ms execution time. Index takes only 128KB of memory versus 120MB for B-Tree (99.8% smaller).",
          treeNodes: [
            { name: "HashAggregate", cost: "1600.00..1840.00", timeMs: 8.2, buffers: "420 hit", isHotspot: false, description: "Fast aggregation" },
            { name: "Bitmap Heap Scan (BRIN)", cost: "16.00..1520.00", timeMs: 6.4, buffers: "420 hit", isHotspot: false, description: "Reads contiguous RAM blocks" },
          ],
          planOutput: `HashAggregate  (cost=1600.00..1840.00 rows=1200 width=40) (actual time=8.000..8.200 rows=1200 loops=1)
  Buffers: shared hit=420
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=16.00..1520.00 rows=84000 width=24) (actual time=0.820..5.900 rows=83800 loops=1)
Execution Time: 8.400 ms`,
        },
        advanced_specialized: {
          strategyName: "Surgically Sized BRIN (pages_per_range = 32)",
          badge: "Precision BRIN",
          scanType: "Bitmap Heap Scan (Precision BRIN)",
          totalCost: "8.00..920.00",
          executionTimeMs: 3.2,
          bufferHits: "180 blocks",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "887x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_brin_p32
ON sensor_telemetry USING BRIN (recorded_at) WITH (pages_per_range = 32);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_brin_p32;`,
          tuningRationale: "3.2ms response time on 2 million time-series records. Negligible write overhead during live ingestion.",
          treeNodes: [
            { name: "HashAggregate", cost: "820.00..920.00", timeMs: 3.1, buffers: "180 hit", isHotspot: false, description: "Aggregation" },
            { name: "Bitmap Heap Scan", cost: "8.00..780.00", timeMs: 2.4, buffers: "180 hit", isHotspot: false, description: "Precision time-range scan" },
          ],
          planOutput: `HashAggregate  (cost=820.00..920.00 rows=1200 width=40) (actual time=3.000..3.100 rows=1200 loops=1)
  Buffers: shared hit=180
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=8.00..780.00 rows=84000 width=24) (actual time=0.340..2.100 rows=83800 loops=1)
Execution Time: 3.200 ms`,
        },
      },
      "25m": {
        seq_scan: {
          strategyName: "Sequential Scan",
          badge: "Severe Latency Risk",
          scanType: "Seq Scan on sensor_telemetry",
          totalCost: "0.00..320,000.00",
          executionTimeMs: 32400.0,
          bufferHits: "4,200 blocks",
          diskReads: "240,000 blocks",
          ramCacheRatio: "1.7% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "Over 32 seconds of disk reading. Completely unusable for live monitoring dashboards.",
          treeNodes: [
            { name: "HashAggregate", cost: "300000.00..320000.00", timeMs: 32350.0, buffers: "244200", isHotspot: true, description: "Waiting on disk" },
            { name: "Seq Scan", cost: "0.00..280000.00", timeMs: 29500.0, buffers: "240000 read", isHotspot: true, description: "Reads 25,000,000 time-series metrics" },
          ],
          planOutput: `HashAggregate  (cost=300000.00..320000.00 rows=4800 width=40) (actual time=32100.000..32350.000 rows=4800 loops=1)
  Buffers: shared read=240000 hit=4200
  ->  Seq Scan on sensor_telemetry  (cost=0.00..280000.00 rows=980000 width=24) (actual time=1.200..28500.000 rows=978000 loops=1)
Execution Time: 32400.000 ms`,
        },
        single_btree: {
          strategyName: "B-Tree on recorded_at",
          badge: "Standard B-Tree",
          scanType: "Bitmap Heap Scan",
          totalCost: "2,400.00..48,000.00",
          executionTimeMs: 1420.0,
          bufferHits: "28,000 blocks",
          diskReads: "4,800 blocks",
          ramCacheRatio: "85.3% RAM Hit",
          speedup: "22.8x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_time ON sensor_telemetry (recorded_at);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_time;`,
          tuningRationale: "B-Tree index size on 25 million rows grows to 1.8 Gigabytes, drastically degrading write performance.",
          treeNodes: [
            { name: "HashAggregate", cost: "42000.00..48000.00", timeMs: 1410.0, buffers: "32800", isHotspot: false, description: "Grouping" },
            { name: "Bitmap Heap Scan", cost: "2400.00..38000.00", timeMs: 1180.0, buffers: "28000 hit, 4800 read", isHotspot: true, description: "Heap random reads" },
          ],
          planOutput: `HashAggregate  (cost=42000.00..48000.00 rows=4800 width=40) (actual time=1380.000..1410.000 rows=4800 loops=1)
  Buffers: shared hit=28000 read=4800
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=2400.00..38000.00 rows=980000 width=24) (actual time=42.000..1050.000 rows=978000 loops=1)
Execution Time: 1420.000 ms`,
        },
        composite_partial: {
          strategyName: "BRIN Index (Block Range Index)",
          badge: "BRIN 128 Pages",
          scanType: "Bitmap Heap Scan (BRIN)",
          totalCost: "64.00..12,400.00",
          executionTimeMs: 48.0,
          bufferHits: "4,800 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "675x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_brin
ON sensor_telemetry USING BRIN (recorded_at);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_brin;`,
          tuningRationale: "BRIN index takes only 1.2 Megabytes on 25 million rows (vs 1.8GB B-Tree). Drops latency from 32s to 48ms.",
          treeNodes: [
            { name: "HashAggregate", cost: "10800.00..12400.00", timeMs: 47.5, buffers: "4800 hit", isHotspot: false, description: "Aggregates metrics" },
            { name: "Bitmap Heap Scan (BRIN)", cost: "64.00..9800.00", timeMs: 38.0, buffers: "4800 hit", isHotspot: false, description: "Sequential block streaming" },
          ],
          planOutput: `HashAggregate  (cost=10800.00..12400.00 rows=4800 width=40) (actual time=46.800..47.500 rows=4800 loops=1)
  Buffers: shared hit=4800
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=64.00..9800.00 rows=980000 width=24) (actual time=2.400..32.000 rows=978000 loops=1)
Execution Time: 48.000 ms`,
        },
        advanced_specialized: {
          strategyName: "Surgically Sized BRIN (pages_per_range = 32)",
          badge: "Precision BRIN",
          scanType: "Bitmap Heap Scan (Precision BRIN)",
          totalCost: "32.00..6,800.00",
          executionTimeMs: 18.2,
          bufferHits: "2,100 blocks",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "1,780x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_telemetry_brin_p32
ON sensor_telemetry USING BRIN (recorded_at) WITH (pages_per_range = 32);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_telemetry_brin_p32;`,
          tuningRationale: "Sub-20ms P99 across 25 million time-series data points with virtually zero index memory overhead.",
          treeNodes: [
            { name: "HashAggregate", cost: "5800.00..6800.00", timeMs: 18.0, buffers: "2100 hit", isHotspot: false, description: "Aggregation" },
            { name: "Bitmap Heap Scan", cost: "32.00..5400.00", timeMs: 14.5, buffers: "2100 hit", isHotspot: false, description: "Precision BRIN ranges" },
          ],
          planOutput: `HashAggregate  (cost=5800.00..6800.00 rows=4800 width=40) (actual time=17.600..18.000 rows=4800 loops=1)
  Buffers: shared hit=2100
  ->  Bitmap Heap Scan on sensor_telemetry  (cost=32.00..5400.00 rows=980000 width=24) (actual time=1.100..12.500 rows=978000 loops=1)
Execution Time: 18.200 ms`,
        },
      },
    },
  },
  catalog_search: {
    id: "catalog_search",
    title: "E-Commerce Catalog Full-Text & Attribute Filter",
    subtitle: "Complex multi-column query combining full-text search, category filtering, and rating sorting",
    tableName: "products",
    querySql: `SELECT id, title, price, rating
FROM products
WHERE category_id = 42
  AND tsv_title @@ to_tsquery('english', 'enterprise & cloud')
ORDER BY rating DESC
LIMIT 20;`,
    strategies: {
      seq_scan: { label: "Seq Scan (No Index)", badge: "Unindexed Baseline" },
      single_btree: { label: "GIN on Full-Text Only", badge: "Partial Acceleration" },
      composite_partial: { label: "Combined GIN + B-Tree (btree_gin)", badge: "Multi-Index Intersection" },
      advanced_specialized: { label: "Composite Multi-Column GIN", badge: "Surgical Production Standard" },
    },
    data: {
      "100k": {
        seq_scan: {
          strategyName: "Sequential Scan",
          badge: "Baseline",
          scanType: "Seq Scan on products",
          totalCost: "0.00..3,200.00",
          executionTimeMs: 112.0,
          bufferHits: "20 blocks",
          diskReads: "1,420 blocks",
          ramCacheRatio: "1.4% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "Executes expensive to_tsquery() text processing on every single row.",
          treeNodes: [
            { name: "Limit", cost: "3195.00..3200.00", timeMs: 111.8, buffers: "1440", isHotspot: false, description: "Top 20 products" },
            { name: "Sort (rating DESC)", cost: "3150.00..3195.00", timeMs: 108.0, buffers: "1440", isHotspot: true, description: "Quicksort" },
            { name: "Seq Scan", cost: "0.00..2900.00", timeMs: 95.0, buffers: "1420 read", isHotspot: true, description: "CPU-heavy full-text regex on 100K rows" },
          ],
          planOutput: `Limit  (cost=3195.00..3200.00 rows=20 width=64) (actual time=111.400..111.800 rows=20 loops=1)
  Buffers: shared read=1420 hit=20
  ->  Sort  (cost=3150.00..3195.00 rows=320 width=64) (actual time=111.380..111.410 rows=20 loops=1)
        Sort Key: rating DESC
        ->  Seq Scan on products  (cost=0.00..2900.00 rows=320 width=64) (actual time=0.840..106.000 rows=320 loops=1)
              Filter: ((category_id = 42) AND (tsv_title @@ '''enterpris'' & ''cloud'''::tsquery))
Execution Time: 112.000 ms`,
        },
        single_btree: {
          strategyName: "GIN on Full-Text (tsv_title)",
          badge: "GIN Only",
          scanType: "Bitmap Heap Scan",
          totalCost: "28.00..480.00",
          executionTimeMs: 12.4,
          bufferHits: "240 blocks",
          diskReads: "12 blocks",
          ramCacheRatio: "95.2% RAM Hit",
          speedup: "9.0x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_products_tsv ON products USING GIN (tsv_title);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_tsv;`,
          tuningRationale: "GIN resolves the text query fast, but must scan the heap to filter by category_id and perform in-memory Sort on rating.",
          treeNodes: [
            { name: "Limit", cost: "475.00..480.00", timeMs: 12.3, buffers: "252", isHotspot: false, description: "Top 20" },
            { name: "Sort (rating DESC)", cost: "440.00..475.00", timeMs: 11.2, buffers: "252", isHotspot: true, description: "Sorts filtered candidates" },
            { name: "Bitmap Heap Scan", cost: "28.00..420.00", timeMs: 7.8, buffers: "240 hit, 12 read", isHotspot: false, description: "Heap filter on category_id" },
          ],
          planOutput: `Limit  (cost=475.00..480.00 rows=20 width=64) (actual time=12.100..12.300 rows=20 loops=1)
  Buffers: shared hit=240 read=12
  ->  Sort  (cost=440.00..475.00 rows=320 width=64) (actual time=12.080..12.110 rows=20 loops=1)
        Sort Key: rating DESC
        ->  Bitmap Heap Scan on products  (cost=28.00..420.00 rows=320 width=64) (actual time=2.100..10.800 rows=320 loops=1)
              Recheck Cond: (tsv_title @@ '''enterpris'' & ''cloud'''::tsquery)
              Filter: (category_id = 42)
Execution Time: 12.400 ms`,
        },
        composite_partial: {
          strategyName: "Composite Multi-Column GIN (btree_gin extension)",
          badge: "Composite GIN",
          scanType: "Bitmap Heap Scan (Composite GIN)",
          totalCost: "16.00..140.00",
          executionTimeMs: 1.8,
          bufferHits: "38 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "62x Faster",
          indexSql: `CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE INDEX CONCURRENTLY idx_products_cat_tsv
ON products USING GIN (category_id, tsv_title);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_cat_tsv;`,
          tuningRationale: "Combines exact category_id filter with full-text search directly inside the GIN index structure.",
          treeNodes: [
            { name: "Limit", cost: "135.00..140.00", timeMs: 1.78, buffers: "38 hit", isHotspot: false, description: "Top 20" },
            { name: "Sort", cost: "120.00..135.00", timeMs: 1.40, buffers: "38 hit", isHotspot: false, description: "Sorts exact matches" },
            { name: "Bitmap Heap Scan", cost: "16.00..110.00", timeMs: 0.95, buffers: "38 hit", isHotspot: false, description: "Zero filter discards" },
          ],
          planOutput: `Limit  (cost=135.00..140.00 rows=20 width=64) (actual time=1.700..1.780 rows=20 loops=1)
  Buffers: shared hit=38
  ->  Sort  (cost=120.00..135.00 rows=320 width=64) (actual time=1.680..1.710 rows=20 loops=1)
        Sort Key: rating DESC
        ->  Bitmap Heap Scan on products  (cost=16.00..110.00 rows=320 width=64) (actual time=0.420..0.920 rows=320 loops=1)
              Recheck Cond: ((category_id = 42) AND (tsv_title @@ '''enterpris'' & ''cloud'''::tsquery))
Execution Time: 1.800 ms`,
        },
        advanced_specialized: {
          strategyName: "Pre-Sorted Partial B-Tree + GIN Rum Hybrid",
          badge: "Surgical Production Standard",
          scanType: "Index Scan (Direct B-Tree)",
          totalCost: "0.42..12.50",
          executionTimeMs: 0.65,
          bufferHits: "12 blocks",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "172x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_products_surgical
ON products (category_id, rating DESC)
WHERE tsv_title @@ to_tsquery('english', 'enterprise & cloud');`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_surgical;`,
          tuningRationale: "Sub-millisecond query execution. Eliminates heap visits and sorting completely.",
          treeNodes: [
            { name: "Limit", cost: "0.42..12.50", timeMs: 0.64, buffers: "12 hit", isHotspot: false, description: "Instant top-N" },
            { name: "Index Scan", cost: "0.42..12.50", timeMs: 0.60, buffers: "12 hit", isHotspot: false, description: "Pre-sorted rating index" },
          ],
          planOutput: `Limit  (cost=0.42..12.50 rows=20 width=64) (actual time=0.018..0.620 rows=20 loops=1)
  Buffers: shared hit=12
  ->  Index Scan using idx_products_surgical on products  (cost=0.42..180.00 rows=320 width=64) (actual time=0.016..0.580 rows=20 loops=1)
        Index Cond: (category_id = 42)
Execution Time: 0.650 ms`,
        },
      },
      "2m": {
        seq_scan: {
          strategyName: "Sequential Scan",
          badge: "Baseline",
          scanType: "Seq Scan on products",
          totalCost: "0.00..54,000.00",
          executionTimeMs: 3840.0,
          bufferHits: "480 blocks",
          diskReads: "26,000 blocks",
          ramCacheRatio: "1.8% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "3.84s CPU and disk thrashing across 2M rows.",
          treeNodes: [
            { name: "Limit", cost: "53800.00..54000.00", timeMs: 3835.0, buffers: "26480", isHotspot: false, description: "Limit 20" },
            { name: "Sort", cost: "52000.00..53800.00", timeMs: 3620.0, buffers: "26480", isHotspot: true, description: "Disk Sort" },
            { name: "Seq Scan", cost: "0.00..48000.00", timeMs: 3200.0, buffers: "26000 read", isHotspot: true, description: "Regex full-text scanning" },
          ],
          planOutput: `Limit  (cost=53800.00..54000.00 rows=20 width=64) (actual time=3810.000..3835.000 rows=20 loops=1)
  Buffers: shared read=26000 hit=480
  ->  Sort  (cost=52000.00..53800.00 rows=4800 width=64) (actual time=3808.000..3810.000 rows=20 loops=1)
        Sort Key: rating DESC
        ->  Seq Scan on products  (cost=0.00..48000.00 rows=4800 width=64) (actual time=4.200..3600.000 rows=4800 loops=1)
Execution Time: 3840.000 ms`,
        },
        single_btree: {
          strategyName: "GIN on Full-Text (tsv_title)",
          badge: "GIN Only",
          scanType: "Bitmap Heap Scan",
          totalCost: "450.00..4,800.00",
          executionTimeMs: 86.0,
          bufferHits: "2,100 blocks",
          diskReads: "180 blocks",
          ramCacheRatio: "92.1% RAM Hit",
          speedup: "44.6x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_products_tsv ON products USING GIN (tsv_title);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_tsv;`,
          tuningRationale: "86ms. Still requires fetching 4,800 table pages to check category_id and sort by rating.",
          treeNodes: [
            { name: "Limit", cost: "4750.00..4800.00", timeMs: 85.5, buffers: "2280", isHotspot: false, description: "Top 20" },
            { name: "Sort", cost: "4400.00..4750.00", timeMs: 76.0, buffers: "2280", isHotspot: true, description: "In-memory sort" },
            { name: "Bitmap Heap Scan", cost: "450.00..4200.00", timeMs: 52.0, buffers: "2100 hit, 180 read", isHotspot: true, description: "Heap reads" },
          ],
          planOutput: `Limit  (cost=4750.00..4800.00 rows=20 width=64) (actual time=84.500..85.500 rows=20 loops=1)
  Buffers: shared hit=2100 read=180
  ->  Sort  (cost=4400.00..4750.00 rows=4800 width=64) (actual time=84.480..84.520 rows=20 loops=1)
        Sort Key: rating DESC
Execution Time: 86.000 ms`,
        },
        composite_partial: {
          strategyName: "Composite Multi-Column GIN (btree_gin extension)",
          badge: "Composite GIN",
          scanType: "Bitmap Heap Scan (Composite GIN)",
          totalCost: "32.00..850.00",
          executionTimeMs: 6.2,
          bufferHits: "280 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "619x Faster",
          indexSql: `CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE INDEX CONCURRENTLY idx_products_cat_tsv
ON products USING GIN (category_id, tsv_title);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_cat_tsv;`,
          tuningRationale: "6.2ms execution. GIN resolves both filters in single index scan.",
          treeNodes: [
            { name: "Limit", cost: "820.00..850.00", timeMs: 6.1, buffers: "280 hit", isHotspot: false, description: "Top 20" },
            { name: "Sort", cost: "720.00..820.00", timeMs: 4.8, buffers: "280 hit", isHotspot: false, description: "Fast sort" },
            { name: "Bitmap Heap Scan", cost: "32.00..680.00", timeMs: 2.2, buffers: "280 hit", isHotspot: false, description: "Zero filter discards" },
          ],
          planOutput: `Limit  (cost=820.00..850.00 rows=20 width=64) (actual time=6.000..6.100 rows=20 loops=1)
  Buffers: shared hit=280
Execution Time: 6.200 ms`,
        },
        advanced_specialized: {
          strategyName: "Pre-Sorted Partial B-Tree + GIN Rum Hybrid",
          badge: "Surgical Production Standard",
          scanType: "Index Scan (Direct B-Tree)",
          totalCost: "0.42..18.40",
          executionTimeMs: 1.2,
          bufferHits: "18 blocks",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "3,200x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_products_surgical
ON products (category_id, rating DESC)
WHERE tsv_title @@ to_tsquery('english', 'enterprise & cloud');`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_surgical;`,
          tuningRationale: "1.2ms P99 across 2 million products. Directly traverses B-Tree leaf pages in reverse rating order.",
          treeNodes: [
            { name: "Limit", cost: "0.42..18.40", timeMs: 1.18, buffers: "18 hit", isHotspot: false, description: "Instant top-N" },
            { name: "Index Scan", cost: "0.42..18.40", timeMs: 1.12, buffers: "18 hit", isHotspot: false, description: "Pre-sorted rating" },
          ],
          planOutput: `Limit  (cost=0.42..18.40 rows=20 width=64) (actual time=0.022..1.150 rows=20 loops=1)
  Buffers: shared hit=18
  ->  Index Scan using idx_products_surgical on products  (cost=0.42..320.00 rows=4800 width=64) (actual time=0.020..1.100 rows=20 loops=1)
Execution Time: 1.200 ms`,
        },
      },
      "25m": {
        seq_scan: {
          strategyName: "Sequential Scan",
          badge: "Severe Latency Risk",
          scanType: "Seq Scan on products (Out of Memory / Timeout)",
          totalCost: "0.00..580,000.00",
          executionTimeMs: 46200.0,
          bufferHits: "2,400 blocks",
          diskReads: "360,000 blocks",
          ramCacheRatio: "0.7% RAM Hit",
          speedup: "1x Baseline",
          indexSql: "-- No index defined",
          rollbackSql: "-- No rollback required",
          tuningRationale: "46.2 seconds! Database crash / connection exhaustion risk.",
          treeNodes: [
            { name: "Limit", cost: "578000.00..580000.00", timeMs: 46180.0, buffers: "362400", isHotspot: true, description: "Timeout danger" },
            { name: "Sort", cost: "540000.00..578000.00", timeMs: 42000.0, buffers: "362400", isHotspot: true, description: "Exceeds work_mem" },
            { name: "Seq Scan", cost: "0.00..510000.00", timeMs: 38000.0, buffers: "360000 read", isHotspot: true, description: "Reads 25 Million products" },
          ],
          planOutput: `Limit  (cost=578000.00..580000.00 rows=20 width=64) (actual time=45900.000..46180.000 rows=20 loops=1)
  Buffers: shared read=360000 hit=2400
Execution Time: 46200.000 ms (~46.2 Seconds!)`,
        },
        single_btree: {
          strategyName: "GIN on Full-Text (tsv_title)",
          badge: "GIN Only",
          scanType: "Bitmap Heap Scan",
          totalCost: "3,800.00..42,000.00",
          executionTimeMs: 980.0,
          bufferHits: "18,400 blocks",
          diskReads: "2,400 blocks",
          ramCacheRatio: "88.5% RAM Hit",
          speedup: "47x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_products_tsv ON products USING GIN (tsv_title);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_tsv;`,
          tuningRationale: "Nearly 1 second response time. Still violates web SLAs under concurrent traffic.",
          treeNodes: [
            { name: "Limit", cost: "41500.00..42000.00", timeMs: 975.0, buffers: "20800", isHotspot: false, description: "Top 20" },
            { name: "Sort", cost: "38000.00..41500.00", timeMs: 890.0, buffers: "20800", isHotspot: true, description: "Sorts 48,000 rows" },
            { name: "Bitmap Heap Scan", cost: "3800.00..34000.00", timeMs: 620.0, buffers: "18400 hit, 2400 read", isHotspot: true, description: "Heavy random disk reads" },
          ],
          planOutput: `Limit  (cost=41500.00..42000.00 rows=20 width=64) (actual time=965.000..975.000 rows=20 loops=1)
Execution Time: 980.000 ms`,
        },
        composite_partial: {
          strategyName: "Composite Multi-Column GIN (btree_gin extension)",
          badge: "Composite GIN",
          scanType: "Bitmap Heap Scan (Composite GIN)",
          totalCost: "180.00..4,200.00",
          executionTimeMs: 24.5,
          bufferHits: "1,840 blocks (100% RAM)",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "1,885x Faster",
          indexSql: `CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE INDEX CONCURRENTLY idx_products_cat_tsv
ON products USING GIN (category_id, tsv_title);`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_cat_tsv;`,
          tuningRationale: "24.5ms. Completely contained in RAM. Zero disk reads.",
          treeNodes: [
            { name: "Limit", cost: "4150.00..4200.00", timeMs: 24.2, buffers: "1840 hit", isHotspot: false, description: "Top 20" },
            { name: "Sort", cost: "3800.00..4150.00", timeMs: 18.0, buffers: "1840 hit", isHotspot: false, description: "Fast sort" },
            { name: "Bitmap Heap Scan", cost: "180.00..3600.00", timeMs: 11.2, buffers: "1840 hit", isHotspot: false, description: "Zero filter discards" },
          ],
          planOutput: `Limit  (cost=4150.00..4200.00 rows=20 width=64) (actual time=24.000..24.200 rows=20 loops=1)
  Buffers: shared hit=1840
Execution Time: 24.500 ms`,
        },
        advanced_specialized: {
          strategyName: "Pre-Sorted Partial B-Tree + GIN Rum Hybrid",
          badge: "Surgical Production Standard",
          scanType: "Index Scan (Direct B-Tree)",
          totalCost: "0.42..34.50",
          executionTimeMs: 2.1,
          bufferHits: "26 blocks",
          diskReads: "0 blocks",
          ramCacheRatio: "100% RAM Hit",
          speedup: "22,000x Faster",
          indexSql: `CREATE INDEX CONCURRENTLY idx_products_surgical
ON products (category_id, rating DESC)
WHERE tsv_title @@ to_tsquery('english', 'enterprise & cloud');`,
          rollbackSql: `DROP INDEX CONCURRENTLY IF EXISTS idx_products_surgical;`,
          tuningRationale: "2.1ms across 25 Million products! Incredible 22,000x throughput multiplier.",
          treeNodes: [
            { name: "Limit", cost: "0.42..34.50", timeMs: 2.08, buffers: "26 hit", isHotspot: false, description: "Direct B-Tree top 20" },
            { name: "Index Scan", cost: "0.42..34.50", timeMs: 2.01, buffers: "26 hit", isHotspot: false, description: "Scans only 26 buffer pages" },
          ],
          planOutput: `Limit  (cost=0.42..34.50 rows=20 width=64) (actual time=0.026..2.050 rows=20 loops=1)
  Buffers: shared hit=26
  ->  Index Scan using idx_products_surgical on products  (cost=0.42..820.00 rows=48000 width=64) (actual time=0.024..1.980 rows=20 loops=1)
Execution Time: 2.100 ms`,
        },
      },
    },
  },
};

export default function LabPostgresPlanner() {
  const [selectedWorkload, setSelectedWorkload] = useState<WorkloadKey>("fintech_ledger");
  const [scale, setScale] = useState<TableScaleKey>("2m");
  const [strategy, setStrategy] = useState<StrategyKey>("composite_partial");
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"visual_tree" | "raw_plan" | "ddl">("visual_tree");

  const workload = workloads[selectedWorkload];
  const currentOutcome = workload.data[scale][strategy];
  const baselineOutcome = workload.data[scale]["seq_scan"];

  function handleCopySql(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  }

  return (
    <div
      id="postgres-planner"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(11, 25, 44, 0.08)",
        marginBottom: "32px",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          backgroundColor: "#0b132b",
          borderBottom: "1px solid #1e293b",
          color: "#ffffff",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#38bdf8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                backgroundColor: "#111e38",
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px solid #1e293b",
              }}
            >
              PostgreSQL 16 Engine
            </span>
            <span style={{ fontSize: "11.5px", color: "#10b981", fontWeight: "700" }}>
              ● EXPLAIN (ANALYZE, BUFFERS, TIMING)
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: "20px", color: "#ffffff", fontWeight: "800" }}>
            Interactive Query Execution Plan &amp; Index Optimizer
          </h3>
        </div>

        <Link
          href="/pricing#database-optimization"
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "6px",
            fontSize: "12.5px",
            fontWeight: "700",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
            transition: "all 0.15s ease",
          }}
        >
          Book Database Sprint ($4,500) &rsaquo;
        </Link>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Workload Selector Tabs */}
        <div style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
            Select Real-World Enterprise Workload:
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
            {(
              [
                { id: "fintech_ledger", name: "FinTech Multi-Tenant Ledger", tag: "Transactions" },
                { id: "timeseries_telemetry", name: "Time-Series Telemetry Engine", tag: "Metrics" },
                { id: "catalog_search", name: "E-Commerce Catalog Full-Text", tag: "Products" },
              ] as const
            ).map((w) => {
              const isSelected = selectedWorkload === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorkload(w.id)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: isSelected ? "2px solid #2563eb" : "1px solid #cbd5e1",
                    backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <strong style={{ fontSize: "13px", color: isSelected ? "#1d4ed8" : "#0f172a" }}>
                      {w.name}
                    </strong>
                    <span style={{ fontSize: "10.5px", fontWeight: "bold", color: "#64748b" }}>
                      {w.tag}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {workloads[w.id].subtitle.slice(0, 50)}...
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live SQL Query Banner */}
        <div
          style={{
            backgroundColor: "#070f1e",
            border: "1px solid #1e293b",
            borderRadius: "6px",
            padding: "14px 16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Target SQL Query
            </span>
            <button
              type="button"
              onClick={() => handleCopySql(workload.querySql)}
              style={{
                background: "transparent",
                border: "1px solid #334155",
                color: copiedSql ? "#10b981" : "#cbd5e1",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              {copiedSql ? "✓ Copied" : "Copy SQL"}
            </button>
          </div>
          <pre style={{ margin: 0, color: "#e2e8f0", fontSize: "12px", fontFamily: "monospace", overflowX: "auto", lineHeight: 1.5 }}>
            {workload.querySql}
          </pre>
        </div>

        {/* Dimension Toggles: Scale & Strategy */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          {/* Table Scale */}
          <div>
            <span style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>
              1. Simulated Table Scale:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(
                [
                  { id: "100k", label: "100,000 Rows" },
                  { id: "2m", label: "2,000,000 Rows" },
                  { id: "25m", label: "25,000,000 Rows" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScale(s.id)}
                  style={{
                    padding: "7px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: scale === s.id ? "#2563eb" : "#ffffff",
                    color: scale === s.id ? "#ffffff" : "#475569",
                    border: "1px solid " + (scale === s.id ? "#2563eb" : "#cbd5e1"),
                    transition: "all 0.15s ease",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Indexing Topology Strategy */}
          <div>
            <span style={{ display: "block", fontSize: "12px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>
              2. Index Topology &amp; Strategy:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(
                [
                  { id: "seq_scan", label: workload.strategies.seq_scan.label },
                  { id: "single_btree", label: workload.strategies.single_btree.label },
                  { id: "composite_partial", label: workload.strategies.composite_partial.label },
                  { id: "advanced_specialized", label: workload.strategies.advanced_specialized.label },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStrategy(st.id)}
                  style={{
                    padding: "7px 12px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: strategy === st.id ? "#0b132b" : "#ffffff",
                    color: strategy === st.id ? "#38bdf8" : "#334155",
                    border: "1px solid " + (strategy === st.id ? "#1e293b" : "#cbd5e1"),
                    transition: "all 0.15s ease",
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Empirical Metrics Scorecard */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", color: "#ffffff", padding: "14px", borderRadius: "6px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Execution Time</span>
            <strong style={{ fontSize: "22px", color: currentOutcome.executionTimeMs > 1000 ? "#f87171" : currentOutcome.executionTimeMs > 50 ? "#f59e0b" : "#10b981", lineHeight: 1.2 }}>
              {currentOutcome.executionTimeMs >= 1000 ? (currentOutcome.executionTimeMs / 1000).toFixed(2) + " s" : currentOutcome.executionTimeMs + " ms"}
            </strong>
            <span style={{ fontSize: "10.5px", color: "#64748b", display: "block", marginTop: "2px" }}>
              Baseline: {(baselineOutcome.executionTimeMs / 1000).toFixed(2)}s
            </span>
          </div>

          <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", color: "#ffffff", padding: "14px", borderRadius: "6px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Throughput Multiplier</span>
            <strong style={{ fontSize: "18px", color: "#10b981", lineHeight: 1.2 }}>
              {currentOutcome.speedup}
            </strong>
            <span style={{ fontSize: "10.5px", color: "#64748b", display: "block", marginTop: "2px" }}>
              vs Unindexed Table
            </span>
          </div>

          <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", color: "#ffffff", padding: "14px", borderRadius: "6px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>RAM Cache Hit Ratio</span>
            <strong style={{ fontSize: "18px", color: currentOutcome.ramCacheRatio.includes("100%") ? "#38bdf8" : "#cbd5e1", lineHeight: 1.2 }}>
              {currentOutcome.ramCacheRatio}
            </strong>
            <span style={{ fontSize: "10.5px", color: "#64748b", display: "block", marginTop: "2px" }}>
              Disk I/O: {currentOutcome.diskReads}
            </span>
          </div>

          <div style={{ backgroundColor: "#0b132b", border: "1px solid #1e293b", color: "#ffffff", padding: "14px", borderRadius: "6px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Planner Cost Range</span>
            <strong style={{ fontSize: "16px", color: "#e2e8f0", lineHeight: 1.2 }}>
              {currentOutcome.totalCost}
            </strong>
            <span style={{ fontSize: "10.5px", color: "#64748b", display: "block", marginTop: "2px" }}>
              Node: {currentOutcome.scanType.slice(0, 20)}
            </span>
          </div>
        </div>

        {/* View Mode Tabs: Visual Query Plan Tree vs Raw Output vs DDL */}
        <div style={{ borderBottom: "1px solid #e2e8f0", marginBottom: "16px", display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("visual_tree")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "visual_tree" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "visual_tree" ? "#2563eb" : "#64748b",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            🌳 Visual Execution Plan Tree
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("raw_plan")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "raw_plan" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "raw_plan" ? "#2563eb" : "#64748b",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            📄 Raw EXPLAIN (ANALYZE, BUFFERS)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ddl")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "ddl" ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === "ddl" ? "#2563eb" : "#64748b",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            ⚡ Production Index DDL
          </button>
        </div>

        {/* Tab 1: Visual Execution Plan Tree */}
        {activeTab === "visual_tree" && (
          <div>
            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a" }}>
                Execution Plan Hierarchy &amp; Latency Bottlenecks:
              </span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Total Nodes: {currentOutcome.treeNodes.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentOutcome.treeNodes.map((node, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: node.isHotspot ? "#fef2f2" : "#f8fafc",
                    border: node.isHotspot ? "1px solid #fecaca" : "1px solid #e2e8f0",
                    borderLeft: node.isHotspot ? "4px solid #ef4444" : "4px solid #10b981",
                    borderRadius: "6px",
                    padding: "12px 16px",
                    marginLeft: `${idx * 16}px`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#64748b" }}>
                        Node {idx + 1} &rarr;
                      </span>
                      <strong style={{ fontSize: "13.5px", color: node.isHotspot ? "#991b1b" : "#0f172a" }}>
                        {node.name}
                      </strong>
                      {node.isHotspot && (
                        <span style={{ background: "#ef4444", color: "#ffffff", fontSize: "10px", fontWeight: 800, padding: "2px 6px", borderRadius: "3px" }}>
                          HOTSPOT
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "14px", fontSize: "12px" }}>
                      <span style={{ color: "#64748b" }}>Cost: <strong>{node.cost}</strong></span>
                      <span style={{ color: node.isHotspot ? "#dc2626" : "#059669", fontWeight: "bold" }}>
                        Time: {node.timeMs >= 1000 ? (node.timeMs / 1000).toFixed(2) + "s" : node.timeMs + "ms"}
                      </span>
                      <span style={{ color: "#64748b" }}>Buffers: <strong>{node.buffers}</strong></span>
                    </div>
                  </div>
                  <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#475569" }}>
                    {node.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Staff Architect Insight Box */}
            <div
              style={{
                marginTop: "18px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderLeft: "4px solid #2563eb",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "12.5px",
                color: "#1e3a8a",
              }}
            >
              <strong>Staff Architect Tuning Note:</strong> {currentOutcome.tuningRationale}
            </div>
          </div>
        )}

        {/* Tab 2: Raw EXPLAIN Output */}
        {activeTab === "raw_plan" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a" }}>
                PostgreSQL Engine Console Output:
              </span>
              <button
                type="button"
                onClick={() => handleCopySql(currentOutcome.planOutput)}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  color: "#334155",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Copy Plan Output
              </button>
            </div>
            <pre
              style={{
                backgroundColor: "#070f1e",
                color: "#e2e8f0",
                padding: "16px",
                borderRadius: "6px",
                fontSize: "12px",
                lineHeight: "1.6",
                overflowX: "auto",
                margin: 0,
                border: "1px solid #1e293b",
                fontFamily: "Consolas, Monaco, monospace",
              }}
            >
              {currentOutcome.planOutput}
            </pre>
          </div>
        )}

        {/* Tab 3: Production DDL */}
        {activeTab === "ddl" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#0f172a" }}>
                Zero-Downtime Migration Blueprint (CONCURRENTLY):
              </span>
              <button
                type="button"
                onClick={() => handleCopySql(currentOutcome.indexSql)}
                style={{
                  background: "#2563eb",
                  border: "none",
                  color: "#ffffff",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {copiedSql ? "✓ Copied" : "Copy DDL"}
              </button>
            </div>

            <pre
              style={{
                backgroundColor: "#070f1e",
                color: "#4ade80",
                padding: "16px",
                borderRadius: "6px",
                fontSize: "12.5px",
                lineHeight: "1.6",
                overflowX: "auto",
                margin: "0 0 16px 0",
                border: "1px solid #1e293b",
                fontFamily: "Consolas, Monaco, monospace",
              }}
            >
              {currentOutcome.indexSql}
            </pre>

            <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px 16px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>
                Rollback DDL Script:
              </span>
              <code style={{ fontSize: "12px", color: "#dc2626", fontFamily: "monospace" }}>
                {currentOutcome.rollbackSql}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
