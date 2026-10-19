"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  initialProfile,
  initialProjects,
  initialServices,
  initialBlogPosts,
  ProfileData,
  ProjectItem,
  ServicePricing,
  BlogPost,
} from "../data/portfolio-data";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import AdminBlogSeoAssistant from "../components/admin-blog-seo-assistant";
import AdminImageUploader from "../components/admin-image-uploader";

interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: "new" | "reviewed" | "contacted" | "archived";
  createdAt: string;
}

const mockInquiries: InquiryRecord[] = [
  {
    id: "inq-1",
    name: "Sarah Jenkins",
    email: "sarah@apexventures.co",
    phone: "+1 (415) 555-0192",
    projectType: "Full-Stack Web Application (Next.js/React)",
    budgetRange: "$15,000 – $30,000 (Full-Stack Platform)",
    message: "We need an edge-deployed customer portal with Supabase authentication and Stripe subscription billing. Our target launch is 6 weeks.",
    status: "new",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inq-2",
    name: "Marcus Thorne",
    email: "m.thorne@cloudscale.io",
    projectType: "Database Optimization & Scale (PostgreSQL)",
    budgetRange: "$5,000 – $15,000 (MVP / Feature Sprint)",
    message: "Our primary PostgreSQL database is hitting 90% CPU spikes during peak hours. Need an architectural query audit and indexing strategy.",
    status: "reviewed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "services" | "blog" | "inquiries" | "profile"
  >("overview");

  // State stores
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [services, setServices] = useState<ServicePricing[]>(initialServices);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(mockInquiries);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Security Passcode Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = window.sessionStorage.getItem("abuhanif_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Project editing & modal states
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [projectSearch, setProjectSearch] = useState("");

  // Service editing & modal states
  const [editingService, setEditingService] = useState<ServicePricing | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServicePricing | null>(null);
  const [serviceSearch, setServiceSearch] = useState("");

  // Blog editing & modal states
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [blogSearch, setBlogSearch] = useState("");

  // Forms state
  const [newProject, setNewProject] = useState({
    title: "",
    slug: "",
    summary: "",
    priceTag: "$10,000 Scope",
    impactMetric: "<30ms P99 • 99.99% Uptime",
    techStack: "Next.js, TypeScript, PostgreSQL",
    demoUrl: "",
    githubUrl: "",
    clientName: "",
    descriptionMarkdown: "",
    imageUrl: "",
    screenshots: [] as string[],
  });

  const [newService, setNewService] = useState({
    title: "",
    slug: "",
    description: "",
    pricingType: "fixed" as const,
    priceDisplay: "$3,500",
    timeline: "1-2 Weeks",
    deliverables: "Architecture review, Diagnostic report, Implementation",
    isPopular: false,
  });

  const [newPost, setNewPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    tags: "Architecture, Performance, Next.js",
    readingTimeMinutes: 5,
    contentMarkdown: "",
  });

  function showNotification(msg: string) {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  }

  // Load live data from Supabase or localStorage on mount
  useEffect(() => {
    // 1. Load local inquiries from window.localStorage if available
    if (typeof window !== "undefined") {
      const savedInquiries = window.localStorage.getItem("abuhanif-inquiries");
      if (savedInquiries) {
        try {
          const parsed = JSON.parse(savedInquiries);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInquiries((prev) => [
              ...parsed,
              ...prev.filter((p) => !parsed.some((x: any) => x.id === p.id)),
            ]);
          }
        } catch {}
      }
    }

    // 2. Fetch from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      // Inquiries
      supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped: InquiryRecord[] = data.map((d: any) => ({
              id: d.id,
              name: d.name,
              email: d.email,
              phone: d.phone,
              projectType: d.project_type,
              budgetRange: d.budget_range,
              message: d.message,
              status: d.status,
              createdAt: d.created_at,
            }));
            setInquiries(mapped);
          }
        });

      // Projects
      supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setProjects(
              data.map((d: any) => ({
                id: d.id,
                title: d.title,
                slug: d.slug,
                summary: d.summary,
                descriptionMarkdown: d.description_markdown,
                clientName: d.client_name,
                demoUrl: d.demo_url,
                githubUrl: d.github_url,
                priceTag: d.price_tag,
                impactMetric: d.impact_metric,
                techStack: d.tech_stack || [],
                isFeatured: d.is_featured,
                published: d.is_published,
                imageUrl: d.image_url || d.thumbnail_url || undefined,
                screenshots: d.screenshots || [],
              }))
            );
          }
        });

      // Services
      supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setServices(
              data.map((d: any) => ({
                id: d.id,
                title: d.title,
                slug: d.slug,
                description: d.description,
                pricingType: d.pricing_type,
                priceDisplay: d.price_display,
                timeline: d.timeline,
                deliverables: d.deliverables || [],
                isPopular: d.is_popular,
                isActive: d.is_active,
              }))
            );
          }
        });

      // Blog posts
      supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setBlogPosts(
              data.map((d: any) => ({
                id: d.id,
                title: d.title,
                slug: d.slug,
                excerpt: d.excerpt,
                contentMarkdown: d.content_markdown,
                tags: d.tags || [],
                readingTimeMinutes: d.reading_time_minutes,
                publishedAt: d.published_at,
                isPublished: d.is_published,
              }))
            );
          }
        });

      // Profile
      supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile({
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
            });
          }
        });
    }
  }, []);

  // Add project handler
  function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      slug: newProject.slug || newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      summary: newProject.summary,
      descriptionMarkdown: newProject.descriptionMarkdown || newProject.summary,
      clientName: newProject.clientName || "Client Project",
      priceTag: newProject.priceTag,
      impactMetric: newProject.impactMetric,
      techStack: newProject.techStack.split(",").map((s) => s.trim()),
      demoUrl: newProject.demoUrl || undefined,
      githubUrl: newProject.githubUrl || undefined,
      isFeatured: true,
      published: true,
      imageUrl: newProject.imageUrl || undefined,
      screenshots: newProject.screenshots || [],
    };
    setProjects([item, ...projects]);

    if (isSupabaseConfigured && supabase) {
      supabase.from("projects").insert([{
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        description_markdown: item.descriptionMarkdown,
        client_name: item.clientName,
        price_tag: item.priceTag,
        impact_metric: item.impactMetric,
        tech_stack: item.techStack,
        demo_url: item.demoUrl,
        github_url: item.githubUrl,
        is_featured: true,
        is_published: true,
        image_url: item.imageUrl,
        screenshots: item.screenshots,
      }]).then();
    }

    setNewProject({
      title: "",
      slug: "",
      summary: "",
      priceTag: "$10,000 Scope",
      impactMetric: "<30ms P99 • 99.99% Uptime",
      techStack: "Next.js, TypeScript, PostgreSQL",
      demoUrl: "",
      githubUrl: "",
      clientName: "",
      descriptionMarkdown: "",
      imageUrl: "",
      screenshots: [],
    });
    showNotification("Project successfully added to portfolio!");
  }

  // Save Project Edit
  function handleSaveProjectEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProject) return;

    setProjects(projects.map((p) => (p.id === editingProject.id ? editingProject : p)));

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("projects")
        .update({
          title: editingProject.title,
          slug: editingProject.slug,
          summary: editingProject.summary,
          description_markdown: editingProject.descriptionMarkdown,
          client_name: editingProject.clientName,
          price_tag: editingProject.priceTag,
          impact_metric: editingProject.impactMetric,
          tech_stack: editingProject.techStack,
          demo_url: editingProject.demoUrl || null,
          github_url: editingProject.githubUrl || null,
          is_featured: editingProject.isFeatured,
          is_published: editingProject.published,
          image_url: editingProject.imageUrl || null,
          screenshots: editingProject.screenshots || [],
        })
        .eq("id", editingProject.id)
        .then();
    }

    setEditingProject(null);
    showNotification("Project successfully updated in database!");
  }

  // Confirm Delete Project
  function handleConfirmDeleteProject() {
    if (!projectToDelete) return;

    setProjects(projects.filter((p) => p.id !== projectToDelete.id));

    if (isSupabaseConfigured && supabase) {
      supabase.from("projects").delete().eq("id", projectToDelete.id).then();
    }

    setProjectToDelete(null);
    showNotification("Project deleted from portfolio and database.");
  }

  // Toggle Project Published status
  function toggleProjectPublished(id: string) {
    const updated = projects.map((p) => {
      if (p.id === id) {
        const nextPub = !p.published;
        if (isSupabaseConfigured && supabase) {
          supabase.from("projects").update({ is_published: nextPub }).eq("id", id).then();
        }
        return { ...p, published: nextPub };
      }
      return p;
    });
    setProjects(updated);
    showNotification("Project visibility updated.");
  }

  // Toggle Project Featured status
  function toggleProjectFeatured(id: string) {
    const updated = projects.map((p) => {
      if (p.id === id) {
        const nextFeat = !p.isFeatured;
        if (isSupabaseConfigured && supabase) {
          supabase.from("projects").update({ is_featured: nextFeat }).eq("id", id).then();
        }
        return { ...p, isFeatured: nextFeat };
      }
      return p;
    });
    setProjects(updated);
    showNotification("Project featured showcase status updated.");
  }

  // Add service handler
  function handleAddService(e: React.FormEvent) {
    e.preventDefault();
    const item: ServicePricing = {
      id: `serv-${Date.now()}`,
      title: newService.title,
      slug: newService.slug || newService.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: newService.description,
      pricingType: newService.pricingType,
      priceDisplay: newService.priceDisplay,
      timeline: newService.timeline,
      deliverables: newService.deliverables.split(",").map((s) => s.trim()),
      isPopular: newService.isPopular,
      isActive: true,
    };
    setServices([...services, item]);

    if (isSupabaseConfigured && supabase) {
      supabase.from("services").insert([{
        title: item.title,
        slug: item.slug,
        description: item.description,
        pricing_type: item.pricingType,
        price_display: item.priceDisplay,
        timeline: item.timeline,
        deliverables: item.deliverables,
        is_popular: item.isPopular,
        is_active: true,
      }]).then();
    }

    setNewService({
      title: "",
      slug: "",
      description: "",
      pricingType: "fixed",
      priceDisplay: "$3,500",
      timeline: "1-2 Weeks",
      deliverables: "Architecture review, Diagnostic report, Implementation",
      isPopular: false,
    });
    showNotification("Service & pricing tier added!");
  }

  // Save Service Edit
  function handleSaveServiceEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingService) return;

    setServices(services.map((s) => (s.id === editingService.id ? editingService : s)));

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("services")
        .update({
          title: editingService.title,
          slug: editingService.slug,
          description: editingService.description,
          pricing_type: editingService.pricingType,
          price_display: editingService.priceDisplay,
          timeline: editingService.timeline,
          deliverables: editingService.deliverables,
          is_popular: editingService.isPopular,
          is_active: editingService.isActive,
        })
        .eq("id", editingService.id)
        .then();
    }

    setEditingService(null);
    showNotification("Pricing package successfully updated in database!");
  }

  // Confirm Delete Service
  function handleConfirmDeleteService() {
    if (!serviceToDelete) return;

    setServices(services.filter((s) => s.id !== serviceToDelete.id));

    if (isSupabaseConfigured && supabase) {
      supabase.from("services").delete().eq("id", serviceToDelete.id).then();
    }

    setServiceToDelete(null);
    showNotification("Pricing package deleted from database.");
  }

  // Toggle Service Active status
  function toggleServiceActive(id: string) {
    const updated = services.map((s) => {
      if (s.id === id) {
        const nextActive = !s.isActive;
        if (isSupabaseConfigured && supabase) {
          supabase.from("services").update({ is_active: nextActive }).eq("id", id).then();
        }
        return { ...s, isActive: nextActive };
      }
      return s;
    });
    setServices(updated);
    showNotification("Service status updated.");
  }

  // Toggle Service Popular status
  function toggleServicePopular(id: string) {
    const updated = services.map((s) => {
      if (s.id === id) {
        const nextPopular = !s.isPopular;
        if (isSupabaseConfigured && supabase) {
          supabase.from("services").update({ is_popular: nextPopular }).eq("id", id).then();
        }
        return { ...s, isPopular: nextPopular };
      }
      return s;
    });
    setServices(updated);
    showNotification("Service popular badge status updated.");
  }

  // Add blog post handler
  function handleAddPost(e: React.FormEvent) {
    e.preventDefault();
    const item: BlogPost = {
      id: `blog-${Date.now()}`,
      title: newPost.title,
      slug: newPost.slug || newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: newPost.excerpt,
      contentMarkdown: newPost.contentMarkdown || newPost.excerpt,
      tags: newPost.tags.split(",").map((t) => t.trim()),
      readingTimeMinutes: Number(newPost.readingTimeMinutes) || 5,
      publishedAt: new Date().toISOString(),
      isPublished: true,
    };
    setBlogPosts([item, ...blogPosts]);

    if (isSupabaseConfigured && supabase) {
      supabase.from("blog_posts").insert([{
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content_markdown: item.contentMarkdown,
        tags: item.tags,
        reading_time_minutes: item.readingTimeMinutes,
        published_at: item.publishedAt,
        is_published: true,
      }]).then();
    }

    setNewPost({
      title: "",
      slug: "",
      excerpt: "",
      tags: "Architecture, Performance, Next.js",
      readingTimeMinutes: 5,
      contentMarkdown: "",
    });
    showNotification("Article published to technical blog!");
  }

  // Save Blog Post Edit
  function handleSavePostEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPost) return;

    setBlogPosts(blogPosts.map((p) => (p.id === editingPost.id ? editingPost : p)));

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("blog_posts")
        .update({
          title: editingPost.title,
          slug: editingPost.slug,
          excerpt: editingPost.excerpt,
          content_markdown: editingPost.contentMarkdown,
          tags: editingPost.tags,
          reading_time_minutes: editingPost.readingTimeMinutes,
          cover_image_url: editingPost.coverImageUrl || null,
          is_published: editingPost.isPublished,
        })
        .eq("id", editingPost.id)
        .then();
    }

    setEditingPost(null);
    showNotification("Article successfully updated in database!");
  }

  // Confirm Delete Blog Post
  function handleConfirmDeletePost() {
    if (!postToDelete) return;

    setBlogPosts(blogPosts.filter((p) => p.id !== postToDelete.id));

    if (isSupabaseConfigured && supabase) {
      supabase.from("blog_posts").delete().eq("id", postToDelete.id).then();
    }

    setPostToDelete(null);
    showNotification("Article deleted from technical blog and database.");
  }

  // Toggle Post Published status
  function togglePostPublished(id: string) {
    const updated = blogPosts.map((p) => {
      if (p.id === id) {
        const nextPub = !p.isPublished;
        if (isSupabaseConfigured && supabase) {
          supabase.from("blog_posts").update({ is_published: nextPub }).eq("id", id).then();
        }
        return { ...p, isPublished: nextPub };
      }
      return p;
    });
    setBlogPosts(updated);
    showNotification("Article publication status updated.");
  }

  // Update inquiry status
  function updateInquiryStatus(id: string, status: InquiryRecord["status"]) {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from("inquiries").update({ status }).eq("id", id).then();
    }

    showNotification(`Inquiry status updated to ${status}`);
  }

  function handlePasscodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passcode.trim() === "2026" || passcode.trim() === "admin2026" || passcode.trim() === "hanif2026") {
      setIsAuthenticated(true);
      setPasscodeError(false);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("abuhanif_admin_auth", "true");
      }
    } else {
      setPasscodeError(true);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPasscode("");
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("abuhanif_admin_auth");
    }
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#071324",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            background: "#0a192f",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "36px 40px",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "42px", marginBottom: "14px" }}>🔒</div>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "20px", color: "#ffffff", fontWeight: "bold" }}>
            Admin Portal Authentication
          </h1>
          <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
            Enter your authorized administrator security passcode to manage projects, blog articles, services, and live inquiries.
          </p>

          <form onSubmit={handlePasscodeSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="password"
                placeholder="Enter Passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                autoFocus
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  background: "#071324",
                  border: passcodeError ? "1px solid #ef4444" : "1px solid #1e293b",
                  borderRadius: "4px",
                  color: "#ffffff",
                  fontSize: "16px",
                  textAlign: "center",
                  letterSpacing: "4px",
                }}
              />
              {passcodeError && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>
                  Invalid security passcode. Please try again.
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Unlock Control Panel &nbsp;›
            </button>
          </form>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #1e293b", fontSize: "13px" }}>
            <Link href="/" style={{ color: "#38bdf8", textDecoration: "none" }}>
              ‹ Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#071324", color: "#ffffff", fontFamily: "sans-serif" }}>
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "#0a192f",
          borderBottom: "1px solid #1e293b",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ color: "#38bdf8", fontWeight: "800", fontSize: "18px", textDecoration: "none" }}>
            ‹ Back to Live Portfolio
          </Link>
          <span style={{ color: "#334155" }}>|</span>
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#ffffff" }}>
            Portfolio Admin Control Panel
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: isSupabaseConfigured ? "#064e3b" : "#3b82f6",
              color: "#ffffff",
              fontWeight: "600",
            }}
          >
            {isSupabaseConfigured ? "● Supabase Connected" : "● Interactive Preview Mode"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>
            Admin: <strong>{profile.fullName}</strong>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: "#1e293b",
              color: "#f87171",
              border: "1px solid #334155",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🔒 Lock Console
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {statusMessage && (
        <div
          style={{
            backgroundColor: "#16a34a",
            color: "#ffffff",
            padding: "12px 24px",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ✓ {statusMessage}
        </div>
      )}

      {/* Main Body */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        {/* Sidebar Nav */}
        <aside
          style={{
            width: "240px",
            backgroundColor: "#0d1e34",
            borderRight: "1px solid #1e293b",
            padding: "20px 0",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              ["overview", "Dashboard Overview", "📊"],
              ["projects", "Work & Portfolio", "💻"],
              ["services", "Services & Pricing", "🏷️"],
              ["blog", "Technical Blog", "📝"],
              ["inquiries", `Inquiries Inbox (${inquiries.filter((i) => i.status === "new").length})`, "📬"],
              ["profile", "Profile & Settings", "⚙️"],
            ].map(([key, label, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 20px",
                  backgroundColor: activeTab === key ? "#2563eb" : "transparent",
                  color: activeTab === key ? "#ffffff" : "#cbd5e1",
                  border: "none",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: activeTab === key ? "700" : "500",
                  cursor: "pointer",
                  transition: "background-color 0.1s ease",
                }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: "30px 40px", overflowY: "auto" }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px 0" }}>
                Portfolio Systems Dashboard
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 28px 0" }}>
                Live state of your developer portfolio, incoming leads, and published content.
              </p>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "35px" }}>
                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>
                    Active Inquiries
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#38bdf8", marginTop: "8px" }}>
                    {inquiries.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#10b981", marginTop: "4px" }}>
                    {inquiries.filter((i) => i.status === "new").length} pending response
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>
                    Featured Projects
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginTop: "8px" }}>
                    {projects.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    Live on public homepage
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>
                    Pricing Packages
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#16a34a", marginTop: "8px" }}>
                    {services.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    Transparent client rates
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>
                    Blog Articles
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#eab308", marginTop: "8px" }}>
                    {blogPosts.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    Published technical guides
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
                    Latest Incoming Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontWeight: "600" }}
                  >
                    View All Inquiries ›
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {inquiries.slice(0, 3).map((inq) => (
                    <div
                      key={inq.id}
                      style={{
                        padding: "14px",
                        backgroundColor: "#071324",
                        border: "1px solid #1e293b",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#ffffff", fontSize: "14px" }}>{inq.name}</strong>
                        <span style={{ color: "#94a3b8", fontSize: "13px", marginLeft: "10px" }}>{inq.email}</span>
                        <div style={{ fontSize: "12px", color: "#38bdf8", marginTop: "3px" }}>
                          {inq.projectType} • {inq.budgetRange}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          borderRadius: "3px",
                          backgroundColor: inq.status === "new" ? "#b91c1c" : "#065f46",
                          color: "#ffffff",
                        }}
                      >
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === "projects" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 6px 0" }}>
                    Work Showcase &amp; Projects Manager
                  </h2>
                  <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
                    Add, edit, and curate full-stack projects, architecture case studies, and transparent pricing scopes synced with Supabase.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "4px", color: "#e2e8f0" }}>
                    Total: <strong style={{ color: "#38bdf8" }}>{projects.length}</strong>
                  </span>
                  <span style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#064e3b", border: "1px solid #047857", borderRadius: "4px", color: "#6ee7b7" }}>
                    Published: <strong>{projects.filter((p) => p.published).length}</strong>
                  </span>
                  <span style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#78350f", border: "1px solid #b45309", borderRadius: "4px", color: "#fcd34d" }}>
                    Featured: <strong>{projects.filter((p) => p.isFeatured).length}</strong>
                  </span>
                </div>
              </div>

              {/* Add Project Form */}
              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", color: "#38bdf8" }}>
                  + Add New Project to Showcase
                </h3>
                <form onSubmit={handleAddProject}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Project Title *</label>
                      <input
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g. Distributed Telemetry Pipeline"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>URL Slug (optional, auto-derived)</label>
                      <input
                        value={newProject.slug}
                        onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                        placeholder="e.g. distributed-telemetry-pipeline"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Price / Scope Tag</label>
                      <input
                        value={newProject.priceTag}
                        onChange={(e) => setNewProject({ ...newProject, priceTag: e.target.value })}
                        placeholder="e.g. $18,500 Scope or $140/hr"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Impact Metric / SLA</label>
                      <input
                        value={newProject.impactMetric}
                        onChange={(e) => setNewProject({ ...newProject, impactMetric: e.target.value })}
                        placeholder="e.g. 12M Events/Sec • 99.99% Uptime"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Client Name / Organization</label>
                      <input
                        value={newProject.clientName}
                        onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                        placeholder="e.g. FinTech Global or Abu Hanif Labs"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Tech Stack (comma separated)</label>
                      <input
                        value={newProject.techStack}
                        onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                        placeholder="Go, Next.js, Redis, PostgreSQL"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Live Demo URL (optional)</label>
                      <input
                        value={newProject.demoUrl}
                        onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                        placeholder="https://example.com"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>GitHub Repo URL (optional)</label>
                      <input
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/abuhanif254/..."
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Executive Summary *</label>
                    <textarea
                      required
                      rows={2}
                      value={newProject.summary}
                      onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                      placeholder="Concise overview of what was built and the technical problem solved..."
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Architecture Deep-Dive &amp; Deliverables (Markdown)</label>
                    <textarea
                      rows={4}
                      value={newProject.descriptionMarkdown}
                      onChange={(e) => setNewProject({ ...newProject, descriptionMarkdown: e.target.value })}
                      placeholder="### Architecture Challenge&#10;&#10;Detailed breakdown of architectural decisions, benchmarks, and engineering trade-offs..."
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px", fontFamily: "monospace" }}
                    />
                  </div>

                  {/* Project Images & Screenshots Attachment */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                    <AdminImageUploader
                      label="Primary Project Cover Image"
                      helperText="Featured cover image & card thumbnail"
                      mode="single"
                      value={newProject.imageUrl}
                      onChangeSingle={(url) => setNewProject({ ...newProject, imageUrl: url })}
                      onClearSingle={() => setNewProject({ ...newProject, imageUrl: "" })}
                    />
                    <AdminImageUploader
                      label="Project Screenshots Gallery"
                      helperText="Add screenshots, architecture diagrams & UI preview images"
                      mode="multiple"
                      values={newProject.screenshots}
                      onChangeMultiple={(urls) => setNewProject({ ...newProject, screenshots: urls })}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "10px 22px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    + Add Project to Portfolio
                  </button>
                </form>
              </div>

              {/* Filter and Search Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 300px" }}>
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects by title, stack, summary, or pricing..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#071324",
                      border: "1px solid #1e293b",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                  />
                  {projectSearch && (
                    <button
                      type="button"
                      onClick={() => setProjectSearch("")}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#334155",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Showing{" "}
                  <strong style={{ color: "#ffffff" }}>
                    {projects.filter((p) => {
                      if (!projectSearch.trim()) return true;
                      const q = projectSearch.toLowerCase();
                      return (
                        p.title.toLowerCase().includes(q) ||
                        p.summary.toLowerCase().includes(q) ||
                        p.priceTag.toLowerCase().includes(q) ||
                        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
                        p.clientName?.toLowerCase().includes(q)
                      );
                    }).length}
                  </strong>{" "}
                  of {projects.length} projects
                </div>
              </div>

              {/* Projects List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {projects
                  .filter((p) => {
                    if (!projectSearch.trim()) return true;
                    const q = projectSearch.toLowerCase();
                    return (
                      p.title.toLowerCase().includes(q) ||
                      p.summary.toLowerCase().includes(q) ||
                      p.priceTag.toLowerCase().includes(q) ||
                      p.techStack.some((t) => t.toLowerCase().includes(q)) ||
                      p.clientName?.toLowerCase().includes(q)
                    );
                  })
                  .map((proj) => (
                    <div
                      key={proj.id}
                      style={{
                        padding: "18px 20px",
                        backgroundColor: "#0a192f",
                        border: "1px solid #1e293b",
                        borderRadius: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap", marginBottom: "8px" }}>
                        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                          {/* Project Cover Thumbnail Preview */}
                          <div
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "4px",
                              overflow: "hidden",
                              backgroundColor: "#071324",
                              border: "1px solid #1e293b",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {proj.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={proj.imageUrl}
                                alt={proj.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: "20px", color: "#64748b" }}>📁</span>
                            )}
                          </div>

                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                                {proj.title}
                              </h3>
                              <code style={{ fontSize: "11px", backgroundColor: "#071324", padding: "2px 6px", borderRadius: "3px", color: "#38bdf8", border: "1px solid #1e293b" }}>
                                /{proj.slug}
                              </code>
                              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "700", backgroundColor: "#064e3b22", padding: "2px 8px", borderRadius: "3px", border: "1px solid #065f46" }}>
                                {proj.priceTag}
                              </span>
                              {proj.screenshots && proj.screenshots.length > 0 && (
                                <span style={{ fontSize: "11px", color: "#38bdf8", backgroundColor: "#0284c722", padding: "2px 6px", borderRadius: "3px", border: "1px solid #0284c744" }}>
                                  📷 {proj.screenshots.length} screenshots
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                              ⚡ Impact: <strong style={{ color: "#e2e8f0" }}>{proj.impactMetric}</strong>
                              {proj.clientName && (
                                <span> • Client: <strong style={{ color: "#cbd5e1" }}>{proj.clientName}</strong></span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Pills and Action Buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          {/* Published Toggle Pill */}
                          <button
                            type="button"
                            onClick={() => toggleProjectPublished(proj.id)}
                            title="Click to toggle public visibility"
                            style={{
                              padding: "4px 10px",
                              borderRadius: "3px",
                              fontSize: "11px",
                              fontWeight: "700",
                              border: "none",
                              cursor: "pointer",
                              backgroundColor: proj.published ? "#065f46" : "#334155",
                              color: proj.published ? "#a7f3d0" : "#94a3b8",
                            }}
                          >
                            {proj.published ? "● Published" : "○ Draft / Hidden"}
                          </button>

                          {/* Featured Toggle Pill */}
                          <button
                            type="button"
                            onClick={() => toggleProjectFeatured(proj.id)}
                            title="Click to toggle featured homepage showcase"
                            style={{
                              padding: "4px 10px",
                              borderRadius: "3px",
                              fontSize: "11px",
                              fontWeight: "700",
                              border: "none",
                              cursor: "pointer",
                              backgroundColor: proj.isFeatured ? "#78350f" : "#1e293b",
                              color: proj.isFeatured ? "#fde68a" : "#cbd5e1",
                            }}
                          >
                            {proj.isFeatured ? "★ Featured" : "☆ Standard"}
                          </button>

                          {/* View Live */}
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#071324",
                              border: "1px solid #334155",
                              color: "#38bdf8",
                              borderRadius: "4px",
                              fontSize: "12px",
                              textDecoration: "none",
                              fontWeight: "600",
                            }}
                          >
                            ↗ View Live
                          </Link>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => setEditingProject({ ...proj })}
                            style={{
                              padding: "5px 12px",
                              backgroundColor: "#1e3a8a",
                              color: "#bfdbfe",
                              border: "1px solid #2563eb",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setProjectToDelete(proj)}
                            style={{
                              padding: "5px 12px",
                              backgroundColor: "#7f1d1d",
                              color: "#fecaca",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      <p style={{ margin: "8px 0 10px 0", fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
                        {proj.summary}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {proj.techStack.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                fontSize: "11px",
                                backgroundColor: "#071324",
                                border: "1px solid #1e293b",
                                padding: "2px 7px",
                                borderRadius: "3px",
                                color: "#cbd5e1",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#38bdf8", textDecoration: "none" }}
                            >
                              Demo URL ↗
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#94a3b8", textDecoration: "none" }}
                            >
                              GitHub Repo ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {projects.filter((p) => {
                  if (!projectSearch.trim()) return true;
                  const q = projectSearch.toLowerCase();
                  return (
                    p.title.toLowerCase().includes(q) ||
                    p.summary.toLowerCase().includes(q) ||
                    p.priceTag.toLowerCase().includes(q) ||
                    p.techStack.some((t) => t.toLowerCase().includes(q)) ||
                    p.clientName?.toLowerCase().includes(q)
                  );
                }).length === 0 && (
                  <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", color: "#94a3b8" }}>
                    No projects found matching &ldquo;{projectSearch}&rdquo;.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === "services" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 6px 0" }}>
                    Work Pricing &amp; Engineering Services Manager
                  </h2>
                  <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
                    Add, edit, and curate transparent engineering packages, deliverables, timelines, and rates synced with Supabase.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "4px", color: "#e2e8f0" }}>
                    Total Packages: <strong style={{ color: "#38bdf8" }}>{services.length}</strong>
                  </span>
                  <span style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#064e3b", border: "1px solid #047857", borderRadius: "4px", color: "#6ee7b7" }}>
                    Active: <strong>{services.filter((s) => s.isActive).length}</strong>
                  </span>
                  <span style={{ fontSize: "12px", padding: "6px 12px", backgroundColor: "#78350f", border: "1px solid #b45309", borderRadius: "4px", color: "#fcd34d" }}>
                    Popular: <strong>{services.filter((s) => s.isPopular).length}</strong>
                  </span>
                </div>
              </div>

              {/* Add Pricing Package Form */}
              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", color: "#38bdf8" }}>
                  + Add New Pricing Package
                </h3>
                <form onSubmit={handleAddService}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Service Title *</label>
                      <input
                        required
                        value={newService.title}
                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                        placeholder="e.g. Performance Audit Sprint"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>URL Slug (optional)</label>
                      <input
                        value={newService.slug}
                        onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                        placeholder="e.g. performance-audit-sprint"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Pricing Model *</label>
                      <select
                        value={newService.pricingType}
                        onChange={(e) => setNewService({ ...newService, pricingType: e.target.value as any })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      >
                        <option value="fixed">Fixed-Scope Milestone</option>
                        <option value="retainer">Monthly Retainer</option>
                        <option value="hourly">Hourly Advisory</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Price Display *</label>
                      <input
                        required
                        value={newService.priceDisplay}
                        onChange={(e) => setNewService({ ...newService, priceDisplay: e.target.value })}
                        placeholder="e.g. $4,500 or $5,500 / mo"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Timeline / Capacity</label>
                      <input
                        value={newService.timeline}
                        onChange={(e) => setNewService({ ...newService, timeline: e.target.value })}
                        placeholder="e.g. 1 Week or 15–20h / wk"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Key Deliverables (comma separated) *</label>
                    <input
                      required
                      value={newService.deliverables}
                      onChange={(e) => setNewService({ ...newService, deliverables: e.target.value })}
                      placeholder="e.g. Full query plan analysis, B-tree indexing, Connection pooling, 30-day warranty"
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Scope Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Detailed overview of technical problems solved and execution approach..."
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "18px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e2e8f0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={newService.isPopular}
                        onChange={(e) => setNewService({ ...newService, isPopular: e.target.checked })}
                      />
                      <span>Mark as &ldquo;Most Popular&rdquo; highlighted package</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "10px 22px",
                      backgroundColor: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    + Add Pricing Package
                  </button>
                </form>
              </div>

              {/* Filter and Search Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 300px" }}>
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search packages by title, description, pricing, or deliverables..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#071324",
                      border: "1px solid #1e293b",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                  />
                  {serviceSearch && (
                    <button
                      type="button"
                      onClick={() => setServiceSearch("")}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#334155",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Showing{" "}
                  <strong style={{ color: "#ffffff" }}>
                    {services.filter((s) => {
                      if (!serviceSearch.trim()) return true;
                      const q = serviceSearch.toLowerCase();
                      return (
                        s.title.toLowerCase().includes(q) ||
                        s.description.toLowerCase().includes(q) ||
                        s.priceDisplay.toLowerCase().includes(q) ||
                        s.deliverables.some((d) => d.toLowerCase().includes(q))
                      );
                    }).length}
                  </strong>{" "}
                  of {services.length} packages
                </div>
              </div>

              {/* Services Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {services
                  .filter((serv) => {
                    if (!serviceSearch.trim()) return true;
                    const q = serviceSearch.toLowerCase();
                    return (
                      serv.title.toLowerCase().includes(q) ||
                      serv.description.toLowerCase().includes(q) ||
                      serv.priceDisplay.toLowerCase().includes(q) ||
                      serv.deliverables.some((d) => d.toLowerCase().includes(q))
                    );
                  })
                  .map((serv) => (
                    <div
                      key={serv.id}
                      style={{
                        padding: "20px",
                        backgroundColor: "#0a192f",
                        border: serv.isPopular ? "1px solid #16a34a" : "1px solid #1e293b",
                        borderRadius: "6px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                          <div>
                            <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700" }}>
                              {serv.pricingType}
                            </span>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", margin: "2px 0 4px 0" }}>
                              {serv.priceDisplay}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {/* Active Toggle Button */}
                            <button
                              type="button"
                              onClick={() => toggleServiceActive(serv.id)}
                              title="Toggle public visibility"
                              style={{
                                padding: "4px 8px",
                                borderRadius: "3px",
                                fontSize: "11px",
                                fontWeight: "700",
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: serv.isActive ? "#065f46" : "#334155",
                                color: serv.isActive ? "#a7f3d0" : "#94a3b8",
                              }}
                            >
                              {serv.isActive ? "● Active" : "○ Inactive"}
                            </button>
                            {/* Popular Toggle Button */}
                            <button
                              type="button"
                              onClick={() => toggleServicePopular(serv.id)}
                              title="Toggle popular highlight badge"
                              style={{
                                padding: "4px 8px",
                                borderRadius: "3px",
                                fontSize: "11px",
                                fontWeight: "700",
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: serv.isPopular ? "#78350f" : "#1e293b",
                                color: serv.isPopular ? "#fde68a" : "#cbd5e1",
                              }}
                            >
                              {serv.isPopular ? "★ Popular" : "☆ Standard"}
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: "17px", fontWeight: "700", color: "#9CBE41", marginBottom: "4px" }}>
                          {serv.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
                          ⏱ Timeline: <strong style={{ color: "#e2e8f0" }}>{serv.timeline}</strong>
                        </div>

                        <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 14px 0" }}>
                          {serv.description}
                        </p>

                        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "10px", marginBottom: "16px" }}>
                          <strong style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                            Included Deliverables ({serv.deliverables.length}):
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
                            {serv.deliverables.map((deliv, idx) => (
                              <li key={idx} style={{ marginBottom: "3px" }}>
                                {deliv}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1e293b", paddingTop: "12px", marginTop: "10px" }}>
                        <Link
                          href="/pricing"
                          target="_blank"
                          style={{
                            fontSize: "12px",
                            color: "#38bdf8",
                            textDecoration: "none",
                            fontWeight: "600",
                          }}
                        >
                          ↗ View on Site
                        </Link>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => setEditingService({ ...serv })}
                            style={{
                              padding: "5px 12px",
                              backgroundColor: "#1e3a8a",
                              color: "#bfdbfe",
                              border: "1px solid #2563eb",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setServiceToDelete(serv)}
                            style={{
                              padding: "5px 12px",
                              backgroundColor: "#7f1d1d",
                              color: "#fecaca",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {services.filter((s) => {
                if (!serviceSearch.trim()) return true;
                const q = serviceSearch.toLowerCase();
                return (
                  s.title.toLowerCase().includes(q) ||
                  s.description.toLowerCase().includes(q) ||
                  s.priceDisplay.toLowerCase().includes(q) ||
                  s.deliverables.some((d) => d.toLowerCase().includes(q))
                );
              }).length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", color: "#94a3b8" }}>
                  No packages found matching &ldquo;{serviceSearch}&rdquo;.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BLOG */}
          {activeTab === "blog" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0" }}>
                    Technical Blog &amp; Publishing Manager ({blogPosts.length})
                  </h2>
                  <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                    Manage engineering articles, markdown content, tags, and publication statuses.
                  </p>
                </div>
                <Link
                  href="/blog"
                  target="_blank"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    backgroundColor: "#0a192f",
                    border: "1px solid #1e3a8a",
                    color: "#38bdf8",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  ↗ Open Live Technical Blog
                </Link>
              </div>

              {/* Metrics Summary Strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                    Total Articles
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", marginTop: "4px" }}>
                    {blogPosts.length}
                  </div>
                </div>
                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                    Published Live
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>
                    {blogPosts.filter((p) => p.isPublished).length}
                  </div>
                </div>
                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                    Draft / Unpublished
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b", marginTop: "4px" }}>
                    {blogPosts.filter((p) => !p.isPublished).length}
                  </div>
                </div>
                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                    Avg Reading Time
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#38bdf8", marginTop: "4px" }}>
                    {Math.round(blogPosts.reduce((acc, p) => acc + (p.readingTimeMinutes || 5), 0) / (blogPosts.length || 1))} min
                  </div>
                </div>
              </div>

              {/* Add New Article Form */}
              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", color: "#38bdf8" }}>
                  + Publish New Technical Article
                </h3>
                <form onSubmit={handleAddPost}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Article Title *</label>
                      <input
                        required
                        value={newPost.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          setNewPost({ ...newPost, title, slug: newPost.slug ? newPost.slug : slug });
                        }}
                        placeholder="e.g. Architecting Distributed Cache Invalidation with Redis & PostgreSQL"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>URL Slug (optional)</label>
                      <input
                        value={newPost.slug}
                        onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                        placeholder="auto-generated-slug"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Read Time (Minutes)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={newPost.readingTimeMinutes}
                        onChange={(e) => setNewPost({ ...newPost, readingTimeMinutes: parseInt(e.target.value) || 5 })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Tags (comma separated)</label>
                      <input
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        placeholder="PostgreSQL, Next.js, Architecture"
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Excerpt / Summary *</label>
                      <input
                        required
                        value={newPost.excerpt}
                        onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                        placeholder="Executive synopsis shown on blog archive cards and meta tags..."
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Full Article Content (Markdown format) *</label>
                      <span style={{ fontSize: "11px", color: "#cbd5e1" }}>Supports ## Headings, ```lang code fences, lists, blockquotes</span>
                    </div>
                    <textarea
                      required
                      rows={8}
                      value={newPost.contentMarkdown}
                      onChange={(e) => setNewPost({ ...newPost, contentMarkdown: e.target.value })}
                      placeholder="## Introduction&#10;&#10;In high-throughput environments, optimizing data flow is critical...&#10;&#10;```typescript&#10;const config = { timeoutMs: 250 };&#10;```"
                      style={{ width: "100%", padding: "10px", backgroundColor: "#053056", border: "1px solid #0a365c", color: "#fff", borderRadius: "4px", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.5" }}
                    />
                  </div>

                  {/* Real-Time Editorial SEO Assistant & SERP Simulator */}
                  <AdminBlogSeoAssistant
                    title={newPost.title}
                    slug={newPost.slug || newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
                    excerpt={newPost.excerpt}
                    contentMarkdown={newPost.contentMarkdown}
                    tags={newPost.tags}
                  />

                  <button
                    type="submit"
                    style={{
                      padding: "10px 22px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Publish Article to Blog
                  </button>
                </form>
              </div>

              {/* Search & Filter Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#0a192f",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  padding: "14px 18px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "14px" }}>🔍</span>
                  <input
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    placeholder="Search articles by title, slug, excerpt, or tags..."
                    style={{
                      width: "100%",
                      backgroundColor: "#071324",
                      border: "1px solid #1e293b",
                      padding: "8px 12px",
                      color: "#fff",
                      borderRadius: "4px",
                      fontSize: "13px",
                    }}
                  />
                  {blogSearch && (
                    <button
                      type="button"
                      onClick={() => setBlogSearch("")}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#334155",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Showing{" "}
                  <strong style={{ color: "#38bdf8" }}>
                    {
                      blogPosts.filter((p) => {
                        if (!blogSearch.trim()) return true;
                        const q = blogSearch.toLowerCase();
                        return (
                          p.title.toLowerCase().includes(q) ||
                          p.slug.toLowerCase().includes(q) ||
                          p.excerpt.toLowerCase().includes(q) ||
                          p.tags.some((t) => t.toLowerCase().includes(q))
                        );
                      }).length
                    }
                  </strong>{" "}
                  of {blogPosts.length} articles
                </div>
              </div>

              {/* Articles Stream */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {blogPosts
                  .filter((post) => {
                    if (!blogSearch.trim()) return true;
                    const q = blogSearch.toLowerCase();
                    return (
                      post.title.toLowerCase().includes(q) ||
                      post.slug.toLowerCase().includes(q) ||
                      post.excerpt.toLowerCase().includes(q) ||
                      post.tags.some((t) => t.toLowerCase().includes(q))
                    );
                  })
                  .map((post) => (
                    <div
                      key={post.id}
                      style={{
                        backgroundColor: "#0a192f",
                        border: "1px solid #1e293b",
                        borderRadius: "6px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                            <strong style={{ fontSize: "17px", color: "#ffffff" }}>{post.title}</strong>
                            <code style={{ fontSize: "11px", backgroundColor: "#071324", padding: "2px 6px", borderRadius: "3px", color: "#94a3b8" }}>
                              /{post.slug}
                            </code>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                            <span>⏱ {post.readingTimeMinutes} min read</span>
                            <span>•</span>
                            <span>📅 {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}</span>
                            <span>•</span>
                            <span>✍️ MD Abu Hanif Mia</span>
                          </div>
                        </div>

                        {/* Status Toggle Button */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => togglePostPublished(post.id)}
                            style={{
                              padding: "4px 10px",
                              backgroundColor: post.isPublished ? "#064e3b" : "#78350f",
                              color: post.isPublished ? "#6ee7b7" : "#fcd34d",
                              border: `1px solid ${post.isPublished ? "#059669" : "#d97706"}`,
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            {post.isPublished ? "● Published" : "○ Draft"}
                          </button>
                        </div>
                      </div>

                      <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {post.tags.map((t, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: "11px",
                                backgroundColor: "#071324",
                                border: "1px solid #1e293b",
                                color: "#38bdf8",
                                padding: "2px 8px",
                                borderRadius: "3px",
                              }}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions Strip */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid #1e293b",
                          paddingTop: "12px",
                          marginTop: "4px",
                        }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          style={{
                            fontSize: "12px",
                            color: "#38bdf8",
                            textDecoration: "none",
                            fontWeight: "600",
                          }}
                        >
                          ↗ Read Article Page
                        </Link>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => setEditingPost({ ...post })}
                            style={{
                              padding: "5px 12px",
                              backgroundColor: "#1e3a8a",
                              color: "#bfdbfe",
                              border: "1px solid #2563eb",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Edit Article
                          </button>
                          <button
                            type="button"
                            onClick={() => setPostToDelete(post)}
                            style={{
                              padding: "5px 12px",
                              backgroundColor: "#7f1d1d",
                              color: "#fecaca",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {blogPosts.filter((p) => {
                if (!blogSearch.trim()) return true;
                const q = blogSearch.toLowerCase();
                return (
                  p.title.toLowerCase().includes(q) ||
                  p.slug.toLowerCase().includes(q) ||
                  p.excerpt.toLowerCase().includes(q) ||
                  p.tags.some((t) => t.toLowerCase().includes(q))
                );
              }).length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", color: "#94a3b8" }}>
                  No articles found matching &ldquo;{blogSearch}&rdquo;.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 16px 0" }}>
                Project Inquiries &amp; Client Leads ({inquiries.length})
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    style={{
                      padding: "20px",
                      backgroundColor: "#0a192f",
                      border: "1px solid #1e293b",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "#ffffff" }}>{inq.name}</h3>
                        <div style={{ fontSize: "13px", color: "#38bdf8" }}>
                          Email: <a href={`mailto:${inq.email}`} style={{ color: "#38bdf8" }}>{inq.email}</a>
                          {inq.phone && ` • Phone: ${inq.phone}`}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            borderRadius: "3px",
                            backgroundColor: inq.status === "new" ? "#dc2626" : inq.status === "contacted" ? "#16a34a" : "#2563eb",
                            color: "#fff",
                          }}
                        >
                          {inq.status}
                        </span>
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                          style={{
                            backgroundColor: "#071324",
                            border: "1px solid #1e293b",
                            color: "#fff",
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          <option value="new">Mark New</option>
                          <option value="reviewed">Mark Reviewed</option>
                          <option value="contacted">Mark Contacted</option>
                          <option value="archived">Mark Archived</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ backgroundColor: "#071324", padding: "12px", borderRadius: "4px", marginBottom: "12px" }}>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
                        Scope: <strong>{inq.projectType}</strong> &nbsp;|&nbsp; Budget: <strong style={{ color: "#4ade80" }}>{inq.budgetRange}</strong>
                      </div>
                      <p style={{ margin: "8px 0 0 0", fontSize: "14px", lineHeight: "1.5", color: "#e2e8f0" }}>
                        "{inq.message}"
                      </p>
                    </div>

                    <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                      Received: {new Date(inq.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === "profile" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 16px 0" }}>
                Engineer Profile &amp; Availability Settings
              </h2>

              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px", maxWidth: "700px" }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showNotification("Profile settings updated!");
                  }}
                >
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Full Name</label>
                    <input
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Role Title / Kicker</label>
                    <input
                      value={profile.kicker}
                      onChange={(e) => setProfile({ ...profile, kicker: e.target.value })}
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Availability Status Banner Text</label>
                    <input
                      value={profile.availabilityStatus}
                      onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Direct Email</label>
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Phone Number</label>
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Bio Description</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* EDIT PROJECT MODAL */}
          {editingProject && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  maxWidth: "760px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    Edit Project: {editingProject.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "20px",
                      cursor: "pointer",
                      padding: "0 4px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveProjectEdit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Project Title *</label>
                      <input
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>URL Slug *</label>
                      <input
                        required
                        value={editingProject.slug}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Price / Scope Tag</label>
                      <input
                        value={editingProject.priceTag}
                        onChange={(e) => setEditingProject({ ...editingProject, priceTag: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Impact Metric / SLA</label>
                      <input
                        value={editingProject.impactMetric}
                        onChange={(e) => setEditingProject({ ...editingProject, impactMetric: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Client Name / Org</label>
                      <input
                        value={editingProject.clientName || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Tech Stack (comma separated)</label>
                      <input
                        value={editingProject.techStack.join(", ")}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Demo URL</label>
                      <input
                        value={editingProject.demoUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                        placeholder="https://..."
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>GitHub Repo URL</label>
                      <input
                        value={editingProject.githubUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "24px", marginBottom: "14px", padding: "10px 12px", backgroundColor: "#071324", borderRadius: "4px", border: "1px solid #1e293b" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e2e8f0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingProject.published}
                        onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                      />
                      <span>Published on public website</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e2e8f0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingProject.isFeatured}
                        onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                      />
                      <span>Featured in primary showcase</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Executive Summary *</label>
                    <textarea
                      required
                      rows={2}
                      value={editingProject.summary}
                      onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Architecture Deep-Dive &amp; Benchmarks (Markdown)</label>
                    <textarea
                      rows={6}
                      value={editingProject.descriptionMarkdown || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, descriptionMarkdown: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px", fontFamily: "monospace" }}
                    />
                  </div>

                  {/* Project Images & Screenshots Attachment */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                    <AdminImageUploader
                      label="Primary Project Cover Image"
                      helperText="Featured cover image & card thumbnail"
                      mode="single"
                      value={editingProject.imageUrl || ""}
                      onChangeSingle={(url) => setEditingProject({ ...editingProject, imageUrl: url })}
                      onClearSingle={() => setEditingProject({ ...editingProject, imageUrl: undefined })}
                    />
                    <AdminImageUploader
                      label="Project Screenshots Gallery"
                      helperText="Add, delete, or manage screenshots for this project"
                      mode="multiple"
                      values={editingProject.screenshots || []}
                      onChangeMultiple={(urls) => setEditingProject({ ...editingProject, screenshots: urls })}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #1e293b", paddingTop: "16px" }}>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      style={{
                        padding: "8px 18px",
                        backgroundColor: "#334155",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "8px 22px",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Save Changes to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DELETE CONFIRMATION MODAL */}
          {projectToDelete && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #7f1d1d",
                  borderRadius: "8px",
                  maxWidth: "480px",
                  width: "100%",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f87171", margin: "0 0 12px 0" }}>
                  Confirm Project Deletion
                </h3>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 20px 0" }}>
                  Are you sure you want to permanently delete <strong style={{ color: "#ffffff" }}>{projectToDelete.title}</strong> (<code>/{projectToDelete.slug}</code>)?
                  <br /><br />
                  This will remove the project from the public showcase, the live site, and the Supabase database. This action cannot be undone.
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setProjectToDelete(null)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#334155",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteProject}
                    style={{
                      padding: "8px 18px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT SERVICE MODAL */}
          {editingService && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  maxWidth: "700px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    Edit Pricing Package: {editingService.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "20px",
                      cursor: "pointer",
                      padding: "0 4px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveServiceEdit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Service Title *</label>
                      <input
                        required
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>URL Slug *</label>
                      <input
                        required
                        value={editingService.slug}
                        onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Pricing Model *</label>
                      <select
                        value={editingService.pricingType}
                        onChange={(e) => setEditingService({ ...editingService, pricingType: e.target.value as any })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      >
                        <option value="fixed">Fixed-Scope Milestone</option>
                        <option value="retainer">Monthly Retainer</option>
                        <option value="hourly">Hourly Advisory</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Price Display *</label>
                      <input
                        required
                        value={editingService.priceDisplay}
                        onChange={(e) => setEditingService({ ...editingService, priceDisplay: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Timeline / Capacity *</label>
                    <input
                      required
                      value={editingService.timeline}
                      onChange={(e) => setEditingService({ ...editingService, timeline: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "24px", marginBottom: "14px", padding: "10px 12px", backgroundColor: "#071324", borderRadius: "4px", border: "1px solid #1e293b" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e2e8f0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingService.isActive}
                        onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                      />
                      <span>Active on public website</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e2e8f0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingService.isPopular}
                        onChange={(e) => setEditingService({ ...editingService, isPopular: e.target.checked })}
                      />
                      <span>Mark as &ldquo;Most Popular&rdquo; highlight badge</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Key Deliverables (comma separated) *</label>
                    <textarea
                      required
                      rows={3}
                      value={editingService.deliverables.join(", ")}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          deliverables: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Scope Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #1e293b", paddingTop: "16px" }}>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      style={{
                        padding: "8px 18px",
                        backgroundColor: "#334155",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "8px 22px",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Save Package Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DELETE SERVICE CONFIRMATION MODAL */}
          {serviceToDelete && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #7f1d1d",
                  borderRadius: "8px",
                  maxWidth: "480px",
                  width: "100%",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f87171", margin: "0 0 12px 0" }}>
                  Confirm Package Deletion
                </h3>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 20px 0" }}>
                  Are you sure you want to permanently delete the pricing package <strong style={{ color: "#ffffff" }}>{serviceToDelete.title}</strong> ({serviceToDelete.priceDisplay})?
                  <br /><br />
                  This will remove the package from the public pricing page and the Supabase database.
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setServiceToDelete(null)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#334155",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteService}
                    style={{
                      padding: "8px 18px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT BLOG POST MODAL */}
          {editingPost && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  maxWidth: "760px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    Edit Technical Article: {editingPost.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "20px",
                      cursor: "pointer",
                      padding: "0 4px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSavePostEdit}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Article Title *</label>
                      <input
                        required
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>URL Slug *</label>
                      <input
                        required
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Read Time (min) *</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        required
                        value={editingPost.readingTimeMinutes}
                        onChange={(e) => setEditingPost({ ...editingPost, readingTimeMinutes: parseInt(e.target.value) || 5 })}
                        style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "24px", marginBottom: "14px", padding: "10px 12px", backgroundColor: "#071324", borderRadius: "4px", border: "1px solid #1e293b" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#e2e8f0", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingPost.isPublished}
                        onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.checked })}
                      />
                      <span>Published (visible on public technical blog)</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Tags (comma separated) *</label>
                    <input
                      required
                      value={editingPost.tags ? editingPost.tags.join(", ") : ""}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Excerpt / Summary *</label>
                    <textarea
                      required
                      rows={2}
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#053056", border: "1px solid #0a365c", color: "#fff", borderRadius: "4px", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Full Article Content (Markdown format) *</label>
                      <span style={{ fontSize: "11px", color: "#cbd5e1" }}>Supports ## Headings, ```code, - lists, &gt; blockquotes</span>
                    </div>
                    <textarea
                      required
                      rows={12}
                      value={editingPost.contentMarkdown}
                      onChange={(e) => setEditingPost({ ...editingPost, contentMarkdown: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#053056",
                        border: "1px solid #0a365c",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontFamily: "monospace",
                        lineHeight: "1.5",
                      }}
                    />
                  </div>

                  {/* Real-Time Editorial SEO Assistant & SERP Simulator */}
                  <AdminBlogSeoAssistant
                    title={editingPost.title}
                    slug={editingPost.slug}
                    excerpt={editingPost.excerpt}
                    contentMarkdown={editingPost.contentMarkdown}
                    tags={editingPost.tags.join(", ")}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #1e293b", paddingTop: "16px" }}>
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      style={{
                        padding: "8px 18px",
                        backgroundColor: "#334155",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "8px 22px",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Save Article Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DELETE BLOG POST CONFIRMATION MODAL */}
          {postToDelete && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #7f1d1d",
                  borderRadius: "8px",
                  maxWidth: "480px",
                  width: "100%",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f87171", margin: "0 0 12px 0" }}>
                  Confirm Article Deletion
                </h3>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 20px 0" }}>
                  Are you sure you want to permanently delete the article <strong style={{ color: "#ffffff" }}>{postToDelete.title}</strong> (<code>/{postToDelete.slug}</code>)?
                  <br /><br />
                  This will remove the article from the public blog archive, the reader route, and the Supabase database. This action cannot be undone.
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setPostToDelete(null)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#334155",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeletePost}
                    style={{
                      padding: "8px 18px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
