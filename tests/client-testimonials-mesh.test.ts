import { describe, it, expect } from "vitest";
import { getTestimonials } from "../app/lib/portfolio-store";
import { initialProjects, initialServices } from "../app/data/portfolio-data";

describe("Client Social Proof & Testimonial Verification Mesh", () => {
  const projectSlugs = new Set(initialProjects.map((p) => p.slug));
  const serviceSlugs = new Set(initialServices.map((s) => s.slug));

  it("returns all 6 verified enterprise endorsements", async () => {
    const testimonials = await getTestimonials();
    expect(testimonials.length).toBe(6);
  });

  it("verifies every testimonial contains complete author, company, and quotation data", async () => {
    const testimonials = await getTestimonials();

    for (const t of testimonials) {
      expect(t.id).toBeTruthy();
      expect(t.author.length).toBeGreaterThan(3);
      expect(t.role.length).toBeGreaterThan(5);
      expect(t.company.length).toBeGreaterThan(3);
      expect(t.quote.length).toBeGreaterThan(60);
      expect(t.verifiedMetric).toBeTruthy();
      expect(t.deliverableTag).toBeTruthy();
    }
  });

  it("verifies engagement scope, duration, and milestone verification badges", async () => {
    const testimonials = await getTestimonials();

    for (const t of testimonials) {
      expect(t.engagementScope).toMatch(/^\$\d+/);
      expect(t.engagementDuration).toMatch(/\d+\s+(Weeks?|Days?)/i);
      expect(t.verificationBadge).toContain("Verified Milestone");
      expect(t.deliverablesCompleted).toBeDefined();
      expect(t.deliverablesCompleted!.length).toBeGreaterThanOrEqual(3);

      t.deliverablesCompleted!.forEach((del) => {
        expect(del.length).toBeGreaterThan(20);
      });
    }
  });

  it("verifies every testimonial links to real case studies and service sprints", async () => {
    const testimonials = await getTestimonials();

    for (const t of testimonials) {
      if (t.projectSlug) {
        expect(
          projectSlugs.has(t.projectSlug),
          `Invalid projectSlug ${t.projectSlug} in testimonial ${t.author}`
        ).toBe(true);
      }
      if (t.serviceSlug) {
        expect(
          serviceSlugs.has(t.serviceSlug),
          `Invalid serviceSlug ${t.serviceSlug} in testimonial ${t.author}`
        ).toBe(true);
      }
    }
  });

  it("verifies categories span all core engineering disciplines", async () => {
    const testimonials = await getTestimonials();
    const categories = new Set(testimonials.map((t) => t.category));

    expect(categories.has("telemetry")).toBe(true);
    expect(categories.has("edge")).toBe(true);
    expect(categories.has("postgres")).toBe(true);
    expect(categories.has("ai")).toBe(true);
    expect(categories.has("security")).toBe(true);
    expect(categories.has("fullstack")).toBe(true);
  });
});
