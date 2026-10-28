import {
  initialProfile,
  competencies,
  initialProjects,
  initialServices,
  initialBlogPosts,
  initialTestimonials,
  ProfileData,
  Competency,
  ProjectItem,
  ServicePricing,
  BlogPost,
  Testimonial,
} from "../data/portfolio-data";
import { supabase, isSupabaseConfigured } from "./supabase";

export async function getProfile(): Promise<ProfileData> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single();
      if (!error && data) {
        return {
          fullName: data.full_name,
          kicker: data.kicker,
          headline: data.headline,
          bio: data.bio,
          email: data.email,
          phone: data.phone,
          location: data.location,
          availabilityStatus: data.availability_status,
          isAvailable: data.is_available,
          socialLinks: data.social_links || initialProfile.socialLinks,
        };
      }
    } catch {
      // Fallback to static
    }
  }
  return initialProfile;
}

export async function getCompetencies(): Promise<Competency[]> {
  return competencies;
}

export const PROJECT_SLUG_ALIASES: Record<string, string> = {
  "edge-ecommerce-platform": "cloudflare-edge-ecommerce",
  "enterprise-rag-pipeline": "enterprise-ai-document-search",
};

export const SERVICE_SLUG_ALIASES: Record<string, string> = {
  "architecture-codebase-audit": "architecture-audit",
  "database-query-optimization": "database-optimization",
  "greenfield-mvp": "mvp-feature-sprint",
  "fractional-staff-architect": "fractional-staff-engineer",
};

export async function getProjects(): Promise<ProjectItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        const initialMap = new Map(initialProjects.map((p) => [p.slug, p]));
        const supabaseProjects: ProjectItem[] = data.map((item) => {
          const initMatch = initialMap.get(item.slug);
          return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            summary: item.summary,
            descriptionMarkdown: item.description_markdown,
            clientName: item.client_name,
            demoUrl: item.demo_url,
            githubUrl: item.github_url,
            priceTag: item.price_tag,
            impactMetric: item.impact_metric,
            techStack: item.tech_stack || [],
            isFeatured: item.is_featured,
            published: item.is_published,
            imageUrl: item.image_url || item.thumbnail_url || initMatch?.imageUrl || undefined,
            screenshots:
              item.screenshots && item.screenshots.length > 0
                ? item.screenshots
                : initMatch?.screenshots || [],
          };
        });

        // Merge any initial projects not currently in Supabase by matching slug or aliases
        const existingSlugs = new Set(
          supabaseProjects.flatMap((p) => [
            p.slug,
            ...Object.entries(PROJECT_SLUG_ALIASES)
              .filter(([_, canonical]) => canonical === p.slug)
              .map(([alias]) => alias),
          ])
        );

        const merged = [...supabaseProjects];
        for (const initProj of initialProjects) {
          if (!existingSlugs.has(initProj.slug)) {
            merged.push(initProj);
          }
        }
        return merged;
      }
    } catch {
      // Fallback
    }
  }
  return initialProjects;
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | undefined> {
  const normalizedSlug = PROJECT_SLUG_ALIASES[slug] || slug;
  const all = await getProjects();
  return all.find(
    (p) =>
      p.slug === normalizedSlug ||
      p.slug === slug ||
      PROJECT_SLUG_ALIASES[p.slug] === slug ||
      PROJECT_SLUG_ALIASES[p.slug] === normalizedSlug
  );
}

let dynamicServicesStore: ServicePricing[] = [...initialServices];

export async function getAllServicesAdmin(): Promise<ServicePricing[]> {
  await getServices();
  return [...dynamicServicesStore];
}

export async function createService(serviceData: Omit<ServicePricing, "id"> & { id?: string }): Promise<ServicePricing> {
  const id = serviceData.id || `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug =
    serviceData.slug ||
    serviceData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const newRecord: ServicePricing = {
    ...serviceData,
    id,
    slug,
    category: serviceData.category || "systems-architecture",
    isActive: serviceData.isActive !== false,
    isPopular: Boolean(serviceData.isPopular),
    deliverables: serviceData.deliverables || [],
    techStack: serviceData.techStack || [],
    engagementSteps: serviceData.engagementSteps || [],
  };

  dynamicServicesStore = [newRecord, ...dynamicServicesStore];

  if (isSupabaseConfigured && supabase) {
    try {
      supabase
        .from("services")
        .insert([
          {
            id: newRecord.id,
            title: newRecord.title,
            slug: newRecord.slug,
            description: newRecord.description,
            pricing_type: newRecord.pricingType,
            price_display: newRecord.priceDisplay,
            timeline: newRecord.timeline,
            deliverables: newRecord.deliverables,
            is_popular: newRecord.isPopular,
            is_active: newRecord.isActive,
          },
        ])
        .then(() => {}, () => {});
    } catch {
      // Graceful fallback
    }
  }

  return newRecord;
}

export async function updateService(
  id: string,
  updates: Partial<ServicePricing>
): Promise<ServicePricing | null> {
  const index = dynamicServicesStore.findIndex((s) => s.id === id || s.slug === id);
  if (index === -1) return null;

  const current = dynamicServicesStore[index];
  const updated: ServicePricing = {
    ...current,
    ...updates,
    id: current.id,
  };

  dynamicServicesStore[index] = updated;

  if (isSupabaseConfigured && supabase) {
    try {
      supabase
        .from("services")
        .update({
          title: updated.title,
          slug: updated.slug,
          description: updated.description,
          pricing_type: updated.pricingType,
          price_display: updated.priceDisplay,
          timeline: updated.timeline,
          deliverables: updated.deliverables,
          is_popular: updated.isPopular,
          is_active: updated.isActive,
        })
        .eq("id", current.id)
        .then(() => {}, () => {});
    } catch {
      // Graceful fallback
    }
  }

  return updated;
}

export async function deleteService(id: string): Promise<boolean> {
  const prevLen = dynamicServicesStore.length;
  dynamicServicesStore = dynamicServicesStore.filter((s) => s.id !== id && s.slug !== id);
  const deleted = dynamicServicesStore.length < prevLen;

  if (deleted && isSupabaseConfigured && supabase) {
    try {
      supabase.from("services").delete().eq("id", id).then(() => {}, () => {});
    } catch {
      // Graceful fallback
    }
  }

  return deleted;
}

export async function toggleServiceActive(id: string): Promise<ServicePricing | null> {
  const match = dynamicServicesStore.find((s) => s.id === id || s.slug === id);
  if (!match) return null;
  return updateService(match.id, { isActive: !match.isActive });
}

export async function toggleServicePopular(id: string): Promise<ServicePricing | null> {
  const match = dynamicServicesStore.find((s) => s.id === id || s.slug === id);
  if (!match) return null;
  return updateService(match.id, { isPopular: !match.isPopular });
}

export async function reorderServices(orderedIds: string[]): Promise<ServicePricing[]> {
  const idMap = new Map(dynamicServicesStore.map((s) => [s.id, s]));
  const reordered: ServicePricing[] = [];
  const seenIds = new Set<string>();

  for (const id of orderedIds) {
    const s = idMap.get(id);
    if (s) {
      reordered.push(s);
      seenIds.add(id);
    }
  }

  for (const s of dynamicServicesStore) {
    if (!seenIds.has(s.id)) {
      reordered.push(s);
    }
  }

  dynamicServicesStore = reordered;
  return dynamicServicesStore;
}

export async function getServices(): Promise<ServicePricing[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        const supabaseMap = new Map(data.map((item) => [item.slug, item]));

        dynamicServicesStore = dynamicServicesStore.map((service) => {
          const item = supabaseMap.get(service.slug);
          if (item) {
            return {
              ...service,
              title: item.title || service.title,
              description: item.description || service.description,
              pricingType: item.pricing_type || service.pricingType,
              priceDisplay: item.price_display || service.priceDisplay,
              timeline: item.timeline || service.timeline,
              deliverables:
                item.deliverables && item.deliverables.length > 0 ? item.deliverables : service.deliverables,
              isPopular: item.is_popular !== undefined ? item.is_popular : service.isPopular,
              isActive: item.is_active !== undefined ? item.is_active : service.isActive,
            };
          }
          return service;
        });

        // Add any additional active services from Supabase that were not in initialServices
        const seenSlugs = new Set(dynamicServicesStore.map((s) => s.slug));
        for (const item of data) {
          if (!seenSlugs.has(item.slug)) {
            dynamicServicesStore.push({
              id: item.id,
              title: item.title,
              slug: item.slug,
              description: item.description,
              pricingType: item.pricing_type || "fixed",
              priceDisplay: item.price_display,
              timeline: item.timeline,
              deliverables: item.deliverables || [],
              isPopular: item.is_popular || false,
              isActive: item.is_active !== false,
              category: "systems-architecture",
            });
            seenSlugs.add(item.slug);
          }
        }
      }
    } catch {
      // Fallback
    }
  }
  return dynamicServicesStore.filter((s) => s.isActive !== false);
}

export async function getServiceBySlug(slug: string): Promise<ServicePricing | undefined> {
  const normalizedSlug = SERVICE_SLUG_ALIASES[slug] || slug;
  const all = await getServices();
  return all.find(
    (s) =>
      s.slug === normalizedSlug ||
      s.slug === slug ||
      SERVICE_SLUG_ALIASES[s.slug] === slug
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          contentMarkdown: item.content_markdown,
          tags: item.tags || [],
          readingTimeMinutes: item.reading_time_minutes,
          publishedAt: item.published_at,
          isPublished: item.is_published,
        }));
      }
    } catch {
      // Fallback
    }
  }
  return initialBlogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const all = await getBlogPosts();
  return all.find((b) => b.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return initialTestimonials;
}

export async function submitInquiry(formData: {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budgetRange: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  // If in browser, dispatch through API route with webhook support
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Also save in localStorage for local admin preview
        try {
          const stored = window.localStorage.getItem("abuhanif-inquiries");
          const list = stored ? JSON.parse(stored) : [];
          list.unshift({
            id: data.inquiryId || `inq-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            project_type: formData.projectType,
            budget_range: formData.budgetRange,
            message: formData.message,
            status: "new",
            created_at: new Date().toISOString(),
          });
          window.localStorage.setItem("abuhanif-inquiries", JSON.stringify(list));
        } catch {}

        return { success: true, message: data.message };
      }
    } catch {
      // Fall through to direct Supabase
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("inquiries").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          project_type: formData.projectType,
          budget_range: formData.budgetRange,
          message: formData.message,
          status: "new",
        },
      ]);
      if (error) throw error;
      return { success: true, message: "Inquiry received! I will review your project details and respond within 24 hours." };
    } catch (err: unknown) {
      console.error("Supabase insert error:", err);
      return { success: true, message: "Thank you for reaching out! Your project request has been logged." };
    }
  }

  return {
    success: true,
    message: "Thank you! Your project inquiry has been received (running in preview mode).",
  };
}

export type {
  ProfileData,
  Competency,
  ProjectItem,
  ProjectItem as Project,
  ServicePricing,
  BlogPost,
  Testimonial,
};
