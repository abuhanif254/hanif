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
import { getServiceSupabase } from "./supabase-admin";
import { InquiryRecord } from "./admin-leads-exporter";

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

let dynamicProjectsStore: ProjectItem[] = [...initialProjects];

export async function getAllProjectsAdmin(): Promise<ProjectItem[]> {
  await getProjects();
  return [...dynamicProjectsStore];
}

export async function createProject(
  projectData: Partial<ProjectItem>
): Promise<ProjectItem> {
  const id = projectData.id || `proj-${Date.now()}`;
  const slug =
    projectData.slug ||
    (projectData.title || "project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const newRecord: ProjectItem = {
    id,
    title: projectData.title || "Untitled Project",
    slug,
    summary: projectData.summary || "",
    descriptionMarkdown: projectData.descriptionMarkdown || projectData.summary || "",
    clientName: projectData.clientName || "Enterprise Client",
    priceTag: projectData.priceTag || "$10,000 Scope",
    impactMetric: projectData.impactMetric || "<30ms P99 • 99.99% Uptime",
    techStack: projectData.techStack || ["Next.js", "TypeScript", "PostgreSQL"],
    demoUrl: projectData.demoUrl,
    githubUrl: projectData.githubUrl,
    isFeatured: projectData.isFeatured !== false,
    published: projectData.published !== false,
    imageUrl: projectData.imageUrl,
    screenshots: projectData.screenshots || [],
  };

  dynamicProjectsStore = [
    newRecord,
    ...dynamicProjectsStore.filter((p) => p.id !== id && p.slug !== slug),
  ];

  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      await dbClient.from("projects").insert([
        {
          id: newRecord.id,
          title: newRecord.title,
          slug: newRecord.slug,
          summary: newRecord.summary,
          description_markdown: newRecord.descriptionMarkdown,
          client_name: newRecord.clientName,
          price_tag: newRecord.priceTag,
          impact_metric: newRecord.impactMetric,
          tech_stack: newRecord.techStack,
          demo_url: newRecord.demoUrl || null,
          github_url: newRecord.githubUrl || null,
          is_featured: newRecord.isFeatured,
          is_published: newRecord.published,
          image_url: newRecord.imageUrl || null,
          screenshots: newRecord.screenshots,
        },
      ]);
    } catch {
      // Graceful fallback
    }
  }

  return newRecord;
}

export async function updateProject(
  id: string,
  updates: Partial<ProjectItem>
): Promise<ProjectItem | null> {
  const index = dynamicProjectsStore.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  const current = dynamicProjectsStore[index];
  const updated: ProjectItem = {
    ...current,
    ...updates,
    id: current.id,
  };

  dynamicProjectsStore[index] = updated;

  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      const dbUpdates: Record<string, any> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
      if (updates.descriptionMarkdown !== undefined)
        dbUpdates.description_markdown = updates.descriptionMarkdown;
      if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
      if (updates.priceTag !== undefined) dbUpdates.price_tag = updates.priceTag;
      if (updates.impactMetric !== undefined)
        dbUpdates.impact_metric = updates.impactMetric;
      if (updates.techStack !== undefined) dbUpdates.tech_stack = updates.techStack;
      if (updates.demoUrl !== undefined) dbUpdates.demo_url = updates.demoUrl || null;
      if (updates.githubUrl !== undefined) dbUpdates.github_url = updates.githubUrl || null;
      if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
      if (updates.published !== undefined) dbUpdates.is_published = updates.published;
      if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl || null;
      if (updates.screenshots !== undefined) dbUpdates.screenshots = updates.screenshots;

      await dbClient.from("projects").update(dbUpdates).eq("id", current.id);
    } catch {
      // Graceful fallback
    }
  }

  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const prevLen = dynamicProjectsStore.length;
  dynamicProjectsStore = dynamicProjectsStore.filter((p) => p.id !== id && p.slug !== id);
  const deleted = dynamicProjectsStore.length < prevLen;

  const dbClient = getServiceSupabase() || supabase;
  if (deleted && dbClient) {
    try {
      await dbClient.from("projects").delete().eq("id", id);
    } catch {
      // Graceful fallback
    }
  }

  return deleted;
}

export async function toggleProjectPublished(id: string): Promise<ProjectItem | null> {
  const match = dynamicProjectsStore.find((p) => p.id === id || p.slug === id);
  if (!match) return null;
  return updateProject(match.id, { published: !match.published });
}

export async function getProjects(): Promise<ProjectItem[]> {
  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      const { data, error } = await dbClient
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

        // Merge any initial or dynamic projects not currently in Supabase by matching slug or aliases
        const existingSlugs = new Set(
          supabaseProjects.flatMap((p) => [
            p.slug,
            ...Object.entries(PROJECT_SLUG_ALIASES)
              .filter(([_, canonical]) => canonical === p.slug)
              .map(([alias]) => alias),
          ])
        );

        const merged = [...supabaseProjects];
        for (const item of dynamicProjectsStore) {
          if (!existingSlugs.has(item.slug)) {
            merged.push(item);
          }
        }
        for (const initProj of initialProjects) {
          if (!existingSlugs.has(initProj.slug) && !merged.some((m) => m.slug === initProj.slug)) {
            merged.push(initProj);
          }
        }
        return merged;
      }
    } catch {
      // Fallback
    }
  }
  return [...dynamicProjectsStore];
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

let dynamicBlogStore: BlogPost[] = [...initialBlogPosts];

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  await getBlogPosts();
  return [...dynamicBlogStore];
}

export async function createBlogPost(
  postData: Partial<BlogPost>
): Promise<BlogPost> {
  const id = postData.id || `blog-${Date.now()}`;
  const slug =
    postData.slug ||
    (postData.title || "article")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const newRecord: BlogPost = {
    id,
    title: postData.title || "Untitled Article",
    slug,
    excerpt: postData.excerpt || "",
    contentMarkdown: postData.contentMarkdown || postData.excerpt || "",
    tags: postData.tags || ["Architecture", "Performance"],
    readingTimeMinutes: postData.readingTimeMinutes || 5,
    publishedAt: postData.publishedAt || new Date().toISOString(),
    isPublished: postData.isPublished !== false,
    coverImageUrl: postData.coverImageUrl,
  };

  dynamicBlogStore = [
    newRecord,
    ...dynamicBlogStore.filter((b) => b.id !== id && b.slug !== slug),
  ];

  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      await dbClient.from("blog_posts").insert([
        {
          id: newRecord.id,
          title: newRecord.title,
          slug: newRecord.slug,
          excerpt: newRecord.excerpt,
          content_markdown: newRecord.contentMarkdown,
          tags: newRecord.tags,
          reading_time_minutes: newRecord.readingTimeMinutes,
          cover_image_url: newRecord.coverImageUrl || null,
          published_at: newRecord.publishedAt,
          is_published: newRecord.isPublished,
        },
      ]);
    } catch {
      // Graceful fallback
    }
  }

  return newRecord;
}

export async function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>
): Promise<BlogPost | null> {
  const index = dynamicBlogStore.findIndex((b) => b.id === id || b.slug === id);
  if (index === -1) return null;

  const current = dynamicBlogStore[index];
  const updated: BlogPost = {
    ...current,
    ...updates,
    id: current.id,
  };

  dynamicBlogStore[index] = updated;

  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      const dbUpdates: Record<string, any> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.excerpt !== undefined) dbUpdates.excerpt = updates.excerpt;
      if (updates.contentMarkdown !== undefined)
        dbUpdates.content_markdown = updates.contentMarkdown;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.readingTimeMinutes !== undefined)
        dbUpdates.reading_time_minutes = updates.readingTimeMinutes;
      if (updates.coverImageUrl !== undefined)
        dbUpdates.cover_image_url = updates.coverImageUrl || null;
      if (updates.isPublished !== undefined)
        dbUpdates.is_published = updates.isPublished;
      if (updates.publishedAt !== undefined)
        dbUpdates.published_at = updates.publishedAt;

      await dbClient.from("blog_posts").update(dbUpdates).eq("id", current.id);
    } catch {
      // Graceful fallback
    }
  }

  return updated;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const prevLen = dynamicBlogStore.length;
  dynamicBlogStore = dynamicBlogStore.filter((b) => b.id !== id && b.slug !== id);
  const deleted = dynamicBlogStore.length < prevLen;

  const dbClient = getServiceSupabase() || supabase;
  if (deleted && dbClient) {
    try {
      await dbClient.from("blog_posts").delete().eq("id", id);
    } catch {
      // Graceful fallback
    }
  }

  return deleted;
}

export async function toggleBlogPostPublished(id: string): Promise<BlogPost | null> {
  const match = dynamicBlogStore.find((b) => b.id === id || b.slug === id);
  if (!match) return null;
  return updateBlogPost(match.id, { isPublished: !match.isPublished });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      const { data, error } = await dbClient
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map((item) => ({
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
        const existingSlugs = new Set(mapped.map((b) => b.slug));
        const merged = [...mapped];
        for (const item of dynamicBlogStore) {
          if (!existingSlugs.has(item.slug)) {
            merged.push(item);
          }
        }
        for (const initPost of initialBlogPosts) {
          if (!existingSlugs.has(initPost.slug) && !merged.some((m) => m.slug === initPost.slug)) {
            merged.push(initPost);
          }
        }
        return merged;
      }
    } catch {
      // Fallback
    }
  }
  return [...dynamicBlogStore];
}

let dynamicInquiriesStore: InquiryRecord[] = [
  {
    id: "inq-1",
    name: "Sarah Jenkins",
    email: "sarah@apexventures.co",
    phone: "+1 (415) 555-0192",
    projectType: "Full-Stack Web Application (Next.js/React)",
    budgetRange: "$15,000 – $30,000 (Full-Stack Platform)",
    message:
      "We need an edge-deployed customer portal with Supabase authentication and Stripe subscription billing. Our target launch is 6 weeks.",
    status: "new",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "inq-2",
    name: "Marcus Thorne",
    email: "m.thorne@cloudscale.io",
    phone: "+1 (555) 019-2834",
    projectType: "Database Optimization & Scale (PostgreSQL)",
    budgetRange: "$5,000 – $15,000 (MVP / Feature Sprint)",
    message:
      "Our primary PostgreSQL database is hitting 90% CPU spikes during peak hours. Need an architectural query audit and indexing strategy.",
    status: "reviewed",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export async function getAllInquiriesAdmin(): Promise<InquiryRecord[]> {
  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      const { data, error } = await dbClient
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: InquiryRecord[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          phone: d.phone,
          projectType: d.project_type,
          budgetRange: d.budget_range,
          message: d.message,
          status: d.status || "new",
          createdAt: d.created_at,
        }));
        const existingIds = new Set(mapped.map((i) => i.id));
        for (const item of dynamicInquiriesStore) {
          if (!existingIds.has(item.id)) {
            mapped.push(item);
          }
        }
        dynamicInquiriesStore = mapped;
        return mapped;
      }
    } catch {
      // Fallback
    }
  }
  return [...dynamicInquiriesStore];
}

export async function recordInboundInquiry(
  inquiry: Partial<InquiryRecord> & {
    name: string;
    email: string;
    projectType: string;
    message: string;
  }
): Promise<InquiryRecord> {
  const fullRecord: InquiryRecord = {
    id: inquiry.id || `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    projectType: inquiry.projectType,
    budgetRange: inquiry.budgetRange || "Flexible",
    message: inquiry.message,
    status: inquiry.status || "new",
    createdAt: inquiry.createdAt || new Date().toISOString(),
  };

  const existingIdx = dynamicInquiriesStore.findIndex((i) => i.id === fullRecord.id);
  if (existingIdx !== -1) {
    dynamicInquiriesStore[existingIdx] = fullRecord;
  } else {
    dynamicInquiriesStore = [fullRecord, ...dynamicInquiriesStore];
  }

  return fullRecord;
}

export async function updateInquiryStatus(
  id: string,
  status: string,
  notes?: string
): Promise<InquiryRecord | null> {
  await getAllInquiriesAdmin();
  const index = dynamicInquiriesStore.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const current = dynamicInquiriesStore[index];
  const updated: InquiryRecord = {
    ...current,
    status: status as any,
  };
  dynamicInquiriesStore[index] = updated;

  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      await dbClient.from("inquiries").update({ status }).eq("id", id);
    } catch {}
  }

  return updated;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const prevLen = dynamicInquiriesStore.length;
  dynamicInquiriesStore = dynamicInquiriesStore.filter((i) => i.id !== id);
  const deleted = dynamicInquiriesStore.length < prevLen;

  const dbClient = getServiceSupabase() || supabase;
  if (dbClient) {
    try {
      await dbClient.from("inquiries").delete().eq("id", id);
    } catch {}
  }

  return true;
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
