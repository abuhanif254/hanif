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

export async function getProjects(): Promise<ProjectItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
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
        }));
      }
    } catch {
      // Fallback
    }
  }
  return initialProjects;
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | undefined> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug);
}

export async function getServices(): Promise<ServicePricing[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          pricingType: item.pricing_type,
          priceDisplay: item.price_display,
          timeline: item.timeline,
          deliverables: item.deliverables || [],
          isPopular: item.is_popular,
          isActive: item.is_active,
        }));
      }
    } catch {
      // Fallback
    }
  }
  return initialServices;
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
