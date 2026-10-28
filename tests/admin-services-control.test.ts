import { describe, it, expect } from "vitest";
import {
  getAllServicesAdmin,
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  toggleServicePopular,
  reorderServices,
} from "../app/lib/portfolio-store";
import { GET as getAdminServices, POST as postAdminService, PUT as putAdminService, DELETE as deleteAdminService } from "../app/api/admin/services/route";
import { NextRequest } from "next/server";

describe("Admin Services Full Control & Persistence Engine", () => {
  it("should retrieve all admin services including categories and rich metadata", async () => {
    const all = await getAllServicesAdmin();
    expect(all.length).toBeGreaterThanOrEqual(10);

    const seoService = all.find((s) => s.slug === "technical-programmatic-seo");
    expect(seoService).toBeDefined();
    expect(seoService?.category).toBe("growth-seo");
    expect(seoService?.tagline).toBeDefined();
    expect(seoService?.roiMetric).toBeDefined();
    expect(seoService?.deliverables.length).toBeGreaterThanOrEqual(4);
  });

  it("should create a new custom service with full metadata and retrieve it immediately", async () => {
    const created = await createService({
      title: "Autonomous AI Agent Workflow Orchestration",
      slug: "ai-agent-orchestration",
      description: "Self-healing distributed agent workers processing continuous background tasks.",
      pricingType: "fixed",
      priceDisplay: "$7,500",
      timeline: "2-3 Weeks",
      deliverables: ["Agent mesh architecture", "BullMQ queue clustering", "Prompt evaluation harness", "30-day warranty"],
      category: "growth-seo",
      tagline: "Autonomous Agentic Pipelines with Real-Time Telemetry",
      roiMetric: "10x Engineering Velocity",
      techStack: ["Next.js 16", "BullMQ", "LangChain", "Redis"],
      engagementSteps: ["1. Workflow Audit", "2. Agent State Graph Design", "3. Implementation Sprint", "4. SLA Handover"],
      isPopular: true,
      isActive: true,
    });

    expect(created.id).toBeDefined();
    expect(created.slug).toBe("ai-agent-orchestration");
    expect(created.isPopular).toBe(true);

    const resolved = await getServiceBySlug("ai-agent-orchestration");
    expect(resolved).toBeDefined();
    expect(resolved?.title).toBe("Autonomous AI Agent Workflow Orchestration");
    expect(resolved?.roiMetric).toBe("10x Engineering Velocity");
  });

  it("should update existing service fields and preserve ID", async () => {
    const updated = await updateService("ai-agent-orchestration", {
      priceDisplay: "$8,500",
      timeline: "3 Weeks",
      tagline: "Enterprise Multi-Agent Swarms with Fallback Guardrails",
    });

    expect(updated).not.toBeNull();
    expect(updated?.priceDisplay).toBe("$8,500");
    expect(updated?.timeline).toBe("3 Weeks");
    expect(updated?.tagline).toBe("Enterprise Multi-Agent Swarms with Fallback Guardrails");

    const fetched = await getServiceBySlug("ai-agent-orchestration");
    expect(fetched?.priceDisplay).toBe("$8,500");
  });

  it("should toggle active status and reflect on public getServices query", async () => {
    const toggledOff = await toggleServiceActive("ai-agent-orchestration");
    expect(toggledOff?.isActive).toBe(false);

    // Should NOT appear in public active services
    const publicServices = await getServices();
    expect(publicServices.some((s) => s.slug === "ai-agent-orchestration")).toBe(false);

    // Toggle back on
    const toggledOn = await toggleServiceActive("ai-agent-orchestration");
    expect(toggledOn?.isActive).toBe(true);

    const publicServicesAgain = await getServices();
    expect(publicServicesAgain.some((s) => s.slug === "ai-agent-orchestration")).toBe(true);
  });

  it("should toggle popular highlight status", async () => {
    const popularOff = await toggleServicePopular("ai-agent-orchestration");
    expect(popularOff?.isPopular).toBe(false);

    const popularOn = await toggleServicePopular("ai-agent-orchestration");
    expect(popularOn?.isPopular).toBe(true);
  });

  it("should reorder services and preserve custom sort order", async () => {
    const all = await getAllServicesAdmin();
    const firstTwo = [all[1].id, all[0].id, ...all.slice(2).map((s) => s.id)];

    const reordered = await reorderServices(firstTwo);
    expect(reordered[0].id).toBe(all[1].id);
    expect(reordered[1].id).toBe(all[0].id);
  });

  it("should delete a service cleanly", async () => {
    const deleted = await deleteService("ai-agent-orchestration");
    expect(deleted).toBe(true);

    const check = await getServiceBySlug("ai-agent-orchestration");
    expect(check).toBeUndefined();
  });

  it("should protect admin services API route against unauthorized requests", async () => {
    const unauthReq = new NextRequest("http://localhost:3000/api/admin/services");
    const res = await getAdminServices(unauthReq);
    expect(res.status).toBe(401);
  });
});
