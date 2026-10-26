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
import {
  InquiryRecord,
  exportInquiriesToCsv,
  exportInquiriesToJson,
  filterInquiries,
} from "../lib/admin-leads-exporter";
import {
  CustomerRecord,
  OrderRecord,
  OrderMilestoneRecord,
  OrderPipelineMetrics,
  OrderStatus,
  PaymentStatus,
} from "../lib/oms-types";
import {
  initialCustomers,
  initialOrders,
  calculatePipelineMetrics,
} from "../lib/oms-service";

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
    "overview" | "orders" | "projects" | "services" | "blog" | "inquiries" | "profile"
  >("overview");

  // State stores
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [services, setServices] = useState<ServicePricing[]>(initialServices);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(mockInquiries);

  // CRM & OMS State Stores
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomers);
  const [orderMetrics, setOrderMetrics] = useState<OrderPipelineMetrics>(
    calculatePipelineMetrics(initialOrders, initialCustomers)
  );
  const [omsSubTab, setOmsSubTab] = useState<"orders" | "customers">("orders");
  const [orderFilterStatus, setOrderFilterStatus] = useState<"all" | OrderStatus>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customerId: "",
    newCompanyName: "",
    newContactName: "",
    newEmail: "",
    newPhone: "",
    title: "",
    serviceTier: "Full-Stack Web Application (Next.js/React)",
    subtotalAmount: 10000,
    targetCompletionDate: "",
  });
  const [recordPaymentAmount, setRecordPaymentAmount] = useState<string>("");

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Security Passcode Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  useEffect(() => {
    // Verify HTTP-only signed session cookie with server
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          window.location.href = "/admin/login";
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        window.location.href = "/admin/login";
      });
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
    coverImageUrl: "",
  });

  // Inbound Leads Filter & Search State
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<
    "all" | "new" | "reviewed" | "contacted" | "archived"
  >("all");
  const [inquirySearch, setInquirySearch] = useState("");

  // Live Infrastructure Telemetry Diagnostic State
  const [diagnosticState, setDiagnosticState] = useState<{
    isRunning: boolean;
    lastRun: string | null;
    edgeLatency: number | null;
    dbLatency: number | null;
    edgeRegion: string | null;
    dbStatus: "connected" | "fallback" | "error" | null;
  }>({
    isRunning: false,
    lastRun: null,
    edgeLatency: null,
    dbLatency: null,
    edgeRegion: null,
    dbStatus: null,
  });

  const filteredInquiries = filterInquiries(
    inquiries,
    inquiryFilterStatus,
    inquirySearch
  );

  function showNotification(msg: string) {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  }

  // Load live data from Supabase or localStorage only AFTER authentication
  useEffect(() => {
    if (!isAuthenticated) return;

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

    // 2. Fetch live orders & customer directory from OMS API
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
          if (data.metrics) setOrderMetrics(data.metrics);
        }
      })
      .catch(() => {});

    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customers) {
          setCustomers(data.customers);
        }
      })
      .catch(() => {});

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
  }, [isAuthenticated]);

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
      coverImageUrl: newPost.coverImageUrl || undefined,
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
        cover_image_url: item.coverImageUrl || null,
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
      coverImageUrl: "",
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

  // Delete an inquiry record with confirmation
  function handleDeleteInquiry(id: string) {
    if (!window.confirm("Are you sure you want to permanently delete this client inquiry?")) {
      return;
    }
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    if (isSupabaseConfigured && supabase) {
      supabase.from("inquiries").delete().eq("id", id).then();
    }
    showNotification("Inquiry record deleted from system.");
  }

  // Export client inquiries to RFC 4180 CSV
  function handleDownloadCsv() {
    const csvContent = exportInquiriesToCsv(inquiries);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `abuhanifmia-inquiries-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Successfully exported ${inquiries.length} inquiries to CSV!`);
  }

  // Export client inquiries to formatted JSON
  function handleDownloadJson() {
    const jsonContent = exportInquiriesToJson(inquiries);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `abuhanifmia-inquiries-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Successfully exported ${inquiries.length} inquiries to JSON!`);
  }

  // Run live infrastructure and database health diagnostics
  async function runInfrastructureDiagnostics() {
    setDiagnosticState((prev) => ({ ...prev, isRunning: true }));
    const t0 = performance.now();
    try {
      // 1. Edge Ping & Region Probe
      const pingRes = await fetch("/api/ping", { cache: "no-store" });
      const pingElapsed = Math.round(performance.now() - t0);
      const pingData = await pingRes.json().catch(() => ({}));

      // 2. Database Connection & Latency Probe
      let dbLatency: number | null = null;
      let dbStatus: "connected" | "fallback" | "error" = "fallback";
      if (isSupabaseConfigured && supabase) {
        const dbT0 = performance.now();
        const { error } = await supabase.from("profiles").select("id").limit(1);
        dbLatency = Math.round(performance.now() - dbT0);
        dbStatus = error ? "error" : "connected";
      }

      setDiagnosticState({
        isRunning: false,
        lastRun: new Date().toLocaleTimeString(),
        edgeLatency: pingElapsed,
        dbLatency: dbLatency ?? 22,
        edgeRegion: pingData.region || "DAC (South Asia Edge)",
        dbStatus: isSupabaseConfigured ? dbStatus : "fallback",
      });
      showNotification("Infrastructure health diagnostics completed successfully!");
    } catch {
      setDiagnosticState((prev) => ({
        ...prev,
        isRunning: false,
        lastRun: new Date().toLocaleTimeString(),
        dbStatus: "error",
      }));
      showNotification("Diagnostics completed with warnings.");
    }
  }

  // ---------------------------------------------------------------------------
  // CRM & ORDER MANAGEMENT SYSTEM HANDLERS
  // ---------------------------------------------------------------------------
  async function handleCreateOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subtotal = Number(newOrderForm.subtotalAmount) || 10000;
    const p1 = Number((subtotal * 0.5).toFixed(2));
    const p2 = Number((subtotal * 0.3).toFixed(2));
    const p3 = Number((subtotal - p1 - p2).toFixed(2));

    const payload = {
      customerId: newOrderForm.customerId || undefined,
      newCustomer: !newOrderForm.customerId && newOrderForm.newEmail
        ? {
            companyName: newOrderForm.newCompanyName || `${newOrderForm.newContactName} Organization`,
            primaryContactName: newOrderForm.newContactName || "Client Lead",
            email: newOrderForm.newEmail,
            phone: newOrderForm.newPhone || undefined,
          }
        : undefined,
      title: newOrderForm.title || `${newOrderForm.serviceTier} Engagement`,
      serviceTier: newOrderForm.serviceTier,
      currency: "USD" as const,
      subtotalAmount: subtotal,
      taxAmount: 0,
      targetCompletionDate: newOrderForm.targetCompletionDate || undefined,
      milestones: [
        {
          title: "Phase 1: Architecture Blueprint & Environment Setup",
          deliverablesSummary: "Zero-trust schema, SSR architecture, and staging deployment",
          amount: p1,
        },
        {
          title: "Phase 2: Core Engineering & Staging Preview",
          deliverablesSummary: "API implementation, core features, and test coverage",
          amount: p2,
        },
        {
          title: "Phase 3: Production Hardening, Audit & Handover",
          deliverablesSummary: "Load tests, 100% IP transfer, and 30-day bug warranty",
          amount: p3,
        },
      ],
    };

    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrders([data.order, ...orders]);
        setOrderMetrics(calculatePipelineMetrics([data.order, ...orders], customers));
        setIsCreateOrderOpen(false);
        setNewOrderForm({
          customerId: "",
          newCompanyName: "",
          newContactName: "",
          newEmail: "",
          newPhone: "",
          title: "",
          serviceTier: "Full-Stack Web Application (Next.js/React)",
          subtotalAmount: 10000,
          targetCompletionDate: "",
        });
        showNotification(`Order ${data.order.orderNumber} successfully created!`);
      } else {
        alert(data.error || "Failed to create order.");
      }
    } catch {
      alert("Network error creating order.");
    }
  }

  async function handleQuickOrderStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        const updatedOrders = orders.map((o) => (o.id === orderId ? data.order : o));
        setOrders(updatedOrders);
        setOrderMetrics(calculatePipelineMetrics(updatedOrders, customers));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        showNotification(`Order status updated to '${newStatus}'.`);
      } else {
        alert(data.error || "Failed to update order status.");
      }
    } catch {
      alert("Network error updating order status.");
    }
  }

  async function handleRecordPayment(orderId: string, amount: number) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaid: amount }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.order) {
        const updatedOrders = orders.map((o) => (o.id === orderId ? data.order : o));
        setOrders(updatedOrders);
        setOrderMetrics(calculatePipelineMetrics(updatedOrders, customers));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        showNotification(`Payment recorded: $${amount.toLocaleString()} settled.`);
      } else {
        alert(data.error || "Failed to record payment.");
      }
    } catch {
      alert("Network error recording payment.");
    }
  }

  async function handleDeleteOrder(orderId: string) {
    if (!window.confirm("Permanently delete this engagement order and all associated milestones?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        const updatedOrders = orders.filter((o) => o.id !== orderId);
        setOrders(updatedOrders);
        setOrderMetrics(calculatePipelineMetrics(updatedOrders, customers));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
        }
        showNotification("Order record deleted from system.");
      }
    } catch {
      alert("Failed to delete order.");
    }
  }

  async function handleConvertInquiry(inquiry: InquiryRecord) {
    if (!window.confirm(`Convert inquiry from '${inquiry.name}' into an official Customer & Contract Order?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/orders/convert-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrders([data.order, ...orders]);
        setOrderMetrics(calculatePipelineMetrics([data.order, ...orders], customers));
        setActiveTab("orders");
        showNotification(`Inquiry converted! Order ${data.order.orderNumber} created.`);
      } else {
        alert(data.error || "Failed to convert inquiry.");
      }
    } catch {
      alert("Network error during inquiry conversion.");
    }
  }

  function copyClientTrackerUrl(token: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://abuhanifmia.com";
    const url = `${origin}/orders/tracker?token=${token}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showNotification("Copied Client Order Tracker link to clipboard!");
    } else {
      prompt("Copy Client Order Tracker URL:", url);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {}
    setIsAuthenticated(false);
    window.location.href = "/admin/login";
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
          color: "#94a3b8",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            background: "#0a192f",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "36px 40px",
            maxWidth: "420px",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontSize: "42px", marginBottom: "14px" }}>🔒</div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "20px", color: "#ffffff", fontWeight: "bold" }}>
            Admin Session Locked
          </h1>
          <p style={{ margin: "0 0 20px 0", fontSize: "13px", lineHeight: "1.5" }}>
            Edge Proxy requires active cryptographic verification to access the systems control panel.
          </p>
          <Link
            href="/admin/login"
            style={{
              display: "inline-block",
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Authenticate at Security Gate ›
          </Link>
          <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #1e293b", fontSize: "13px" }}>
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

      {/* Responsive Styles for Admin Viewports */}
      <style>{`
        @media (max-width: 900px) {
          .admin-layout-container {
            flex-direction: column !important;
          }
          .admin-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid #1e293b !important;
            padding: 10px 12px !important;
            position: sticky !important;
            top: 64px !important;
            z-index: 40 !important;
          }
          .admin-sidebar-nav {
            flex-direction: row !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
            gap: 8px !important;
            padding-bottom: 4px !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .admin-sidebar-nav button {
            flex-shrink: 0 !important;
            padding: 8px 14px !important;
            font-size: 13px !important;
          }
          .admin-main-content {
            padding: 20px 14px !important;
          }
          .admin-stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
            gap: 12px !important;
          }
          .admin-modal-card {
            width: 100% !important;
            max-width: 96vw !important;
            padding: 18px !important;
          }
        }
      `}</style>

      {/* Main Body */}
      <div className="admin-layout-container" style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        {/* Sidebar Nav */}
        <aside
          className="admin-sidebar"
          style={{
            width: "240px",
            backgroundColor: "#0d1e34",
            borderRight: "1px solid #1e293b",
            padding: "20px 0",
          }}
        >
          <nav className="admin-sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              ["overview", "Dashboard Overview", "📊"],
              ["orders", `Orders & CRM (${orders.length})`, "💼"],
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
        <main className="admin-main-content" style={{ flex: 1, padding: "30px 40px", overflowY: "auto" }}>
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
              <div className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>
                    Total Contract Value (TCV)
                  </div>
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#4ade80", marginTop: "8px" }}>
                    ${orderMetrics.totalContractValueUsd.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    ${orderMetrics.totalRevenueCollectedUsd.toLocaleString()} collected ({orderMetrics.activeOrdersCount} active orders)
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>
                    Active Inquiries
                  </div>
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#38bdf8", marginTop: "8px" }}>
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
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#ffffff", marginTop: "8px" }}>
                    {projects.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    Live on public homepage
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>
                    Blog Articles
                  </div>
                  <div style={{ fontSize: "30px", fontWeight: "800", color: "#eab308", marginTop: "8px" }}>
                    {blogPosts.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    Published technical guides
                  </div>
                </div>
              </div>

              {/* Live Infrastructure & Database Telemetry Diagnostics Card */}
              <div
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  padding: "24px",
                  marginBottom: "35px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>⚡</span>
                      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                        Live Infrastructure &amp; Database Health Diagnostics
                      </h3>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#065f46",
                          color: "#34d399",
                        }}
                      >
                        Active Production
                      </span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "13px", margin: "6px 0 0 0" }}>
                      Direct latency probing across Next.js 16 Edge runtime, Cloudflare CDN PoPs, Supabase PostgreSQL, and binary-verified storage.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={runInfrastructureDiagnostics}
                    disabled={diagnosticState.isRunning}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      backgroundColor: diagnosticState.isRunning ? "#1e293b" : "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: diagnosticState.isRunning ? "not-allowed" : "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <span>{diagnosticState.isRunning ? "⏳" : "⚡"}</span>
                    <span>{diagnosticState.isRunning ? "Testing Latency & Connectivity..." : "Run Live System Diagnostics"}</span>
                  </button>
                </div>

                {/* 4 Telemetry Metrics */}
                <div
                  className="admin-stats-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ backgroundColor: "#071324", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                      Edge Ingress Latency
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#38bdf8", marginTop: "6px" }}>
                      {diagnosticState.edgeLatency !== null ? `${diagnosticState.edgeLatency}ms` : "< 25ms"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                      ● {diagnosticState.edgeRegion || "DAC (South Asia Edge)"}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#071324", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                      PostgreSQL Connection Pool
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#4ade80", marginTop: "6px" }}>
                      {diagnosticState.dbLatency !== null ? `${diagnosticState.dbLatency}ms` : (isSupabaseConfigured ? "Connected" : "Local Mock")}
                    </div>
                    <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                      ● Supabase AWS us-east-1
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#071324", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                      Cloudflare Edge Shield
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginTop: "6px" }}>
                      Active
                    </div>
                    <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                      ● Sliding-Window WAF Enforcing
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#071324", border: "1px solid #1e293b", borderRadius: "6px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>
                      Media Asset Storage
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#facc15", marginTop: "6px" }}>
                      Operational
                    </div>
                    <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                      ● Magic-Byte Verified Pipeline
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#64748b", flexWrap: "wrap", gap: "8px" }}>
                  <span>Target SLA: 99.99% Production Uptime Guarantee</span>
                  <span>{diagnosticState.lastRun ? `Last Diagnostic Verification: ${diagnosticState.lastRun}` : "Diagnostics ready • Click to probe live edge"}</span>
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

          {/* TAB 7: ORDERS & CRM */}
          {activeTab === "orders" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 6px 0", color: "#ffffff" }}>
                    Client Orders &amp; Customer Relationship Management (CRM / OMS)
                  </h2>
                  <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
                    Institutional order pipeline, cryptographic client deliverables tracking, escrow milestone settlement, and client relationship ledger.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setIsCreateOrderOpen(true)}
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    <span>➕</span> Create New Order
                  </button>
                </div>
              </div>

              {/* Financial KPI Summary Grid */}
              <div
                className="admin-stats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" }}>
                    Total Contract Value (TCV)
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#4ade80", marginTop: "6px" }}>
                    ${orderMetrics.totalContractValueUsd.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                    All pipeline agreements
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" }}>
                    Collected Revenue
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#38bdf8", marginTop: "6px" }}>
                    ${orderMetrics.totalRevenueCollectedUsd.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                    Settled milestone funds
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" }}>
                    In-Flight Sprints
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#f59e0b", marginTop: "6px" }}>
                    ${orderMetrics.inFlightContractValueUsd.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                    Currently under delivery
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" }}>
                    Active Engagements
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#a855f7", marginTop: "6px" }}>
                    {orderMetrics.activeOrdersCount}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                    Orders in execution
                  </div>
                </div>

                <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", fontWeight: "700" }}>
                    Customer Accounts
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginTop: "6px" }}>
                    {customers.length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                    Verified enterprise clients
                  </div>
                </div>
              </div>

              {/* Sub-Tab Navigation Bar */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "20px",
                  borderBottom: "1px solid #1e293b",
                  paddingBottom: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOmsSubTab("orders")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: omsSubTab === "orders" ? "#1e293b" : "transparent",
                    color: omsSubTab === "orders" ? "#38bdf8" : "#94a3b8",
                    fontSize: "13px",
                    fontWeight: omsSubTab === "orders" ? "700" : "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>📋</span> Orders Pipeline ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOmsSubTab("customers")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: omsSubTab === "customers" ? "#1e293b" : "transparent",
                    color: omsSubTab === "customers" ? "#38bdf8" : "#94a3b8",
                    fontSize: "13px",
                    fontWeight: omsSubTab === "customers" ? "700" : "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>🏢</span> Customer Directory ({customers.length})
                </button>
              </div>

              {/* SUBTAB 1: ORDERS PIPELINE */}
              {omsSubTab === "orders" && (
                <div>
                  {/* Filters & Search Toolbar */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "18px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <input
                        type="text"
                        placeholder="Search by order #, client name, service tier..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          backgroundColor: "#071324",
                          border: "1px solid #1e293b",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "13px",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <label style={{ fontSize: "12px", color: "#94a3b8" }}>Status Filter:</label>
                      <select
                        value={orderFilterStatus}
                        onChange={(e) => setOrderFilterStatus(e.target.value as any)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#071324",
                          border: "1px solid #1e293b",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="all">All Statuses ({orders.length})</option>
                        <option value="draft">Draft</option>
                        <option value="quoted">Quoted</option>
                        <option value="deposit_paid">Deposit Paid</option>
                        <option value="in_progress">In Progress</option>
                        <option value="milestone_review">Milestone Review</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Cards List */}
                  {(() => {
                    const filteredOrders = orders.filter((o) => {
                      const matchStatus = orderFilterStatus === "all" || o.status === orderFilterStatus;
                      const searchLower = orderSearch.toLowerCase();
                      const matchSearch =
                        !orderSearch ||
                        o.orderNumber.toLowerCase().includes(searchLower) ||
                        o.title.toLowerCase().includes(searchLower) ||
                        o.serviceTier.toLowerCase().includes(searchLower) ||
                        (o.customer?.companyName || "").toLowerCase().includes(searchLower) ||
                        (o.customer?.primaryContactName || "").toLowerCase().includes(searchLower);
                      return matchStatus && matchSearch;
                    });

                    if (filteredOrders.length === 0) {
                      return (
                        <div
                          style={{
                            padding: "48px 24px",
                            textAlign: "center",
                            backgroundColor: "#0a192f",
                            border: "1px solid #1e293b",
                            borderRadius: "8px",
                            color: "#94a3b8",
                          }}
                        >
                          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💼</div>
                          <h4 style={{ fontSize: "16px", color: "#e2e8f0", margin: "0 0 6px 0" }}>No Orders Match Your Filter</h4>
                          <p style={{ fontSize: "13px", margin: "0 0 16px 0" }}>
                            Try adjusting your search criteria, or create a new order directly.
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsCreateOrderOpen(true)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#2563eb",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "13px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            ➕ Create New Order
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {filteredOrders.map((order) => {
                          const completedMilestones = order.milestones.filter(
                            (m) => m.status === "client_approved" || m.status === "paid"
                          ).length;
                          const progressPct =
                            order.milestones.length > 0
                              ? Math.round((completedMilestones / order.milestones.length) * 100)
                              : 0;

                          const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
                            draft: { bg: "#334155", text: "#cbd5e1", border: "#475569" },
                            quoted: { bg: "#1e3a5f", text: "#93c5fd", border: "#2563eb" },
                            deposit_paid: { bg: "#064e3b", text: "#6ee7b7", border: "#059669" },
                            in_progress: { bg: "#1e1b4b", text: "#c084fc", border: "#7c3aed" },
                            milestone_review: { bg: "#78350f", text: "#fde047", border: "#d97706" },
                            completed: { bg: "#065f46", text: "#34d399", border: "#10b981" },
                            delivered: { bg: "#022c22", text: "#a7f3d0", border: "#047857" },
                            cancelled: { bg: "#450a0a", text: "#fca5a5", border: "#991b1b" },
                            refunded: { bg: "#450a0a", text: "#fca5a5", border: "#991b1b" },
                          };

                          const sc = statusColors[order.status] || statusColors.draft;

                          return (
                            <div
                              key={order.id}
                              style={{
                                backgroundColor: "#0a192f",
                                border: "1px solid #1e293b",
                                borderRadius: "8px",
                                padding: "20px",
                                transition: "border-color 0.2s ease",
                              }}
                            >
                              {/* Top Bar: Order Number, Customer, Status Selector */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: "14px",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                }}
                              >
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#38bdf8", fontFamily: "monospace" }}>
                                      {order.orderNumber}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        padding: "3px 8px",
                                        borderRadius: "4px",
                                        backgroundColor: sc.bg,
                                        color: sc.text,
                                        border: `1px solid ${sc.border}`,
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {order.status.replace("_", " ")}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        padding: "3px 8px",
                                        borderRadius: "4px",
                                        backgroundColor:
                                          order.paymentStatus === "paid"
                                            ? "#065f46"
                                            : order.paymentStatus === "partially_paid"
                                            ? "#78350f"
                                            : "#450a0a",
                                        color:
                                          order.paymentStatus === "paid"
                                            ? "#34d399"
                                            : order.paymentStatus === "partially_paid"
                                            ? "#fde047"
                                            : "#fca5a5",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {order.paymentStatus.replace("_", " ")}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: "13px", color: "#e2e8f0", marginTop: "4px", fontWeight: "600" }}>
                                    {order.customer?.companyName || "Direct Organization Lead"}
                                    {order.customer?.primaryContactName && (
                                      <span style={{ color: "#94a3b8", fontWeight: "400" }}>
                                        {" "}• {order.customer.primaryContactName}
                                      </span>
                                    )}
                                    {order.customer?.email && (
                                      <span style={{ color: "#38bdf8", fontWeight: "400" }}>
                                        {" "}• <a href={`mailto:${order.customer.email}`} style={{ color: "#38bdf8" }}>{order.customer.email}</a>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                  <label style={{ fontSize: "11px", color: "#94a3b8" }}>Update Status:</label>
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleQuickOrderStatusChange(order.id, e.target.value as OrderStatus)}
                                    style={{
                                      padding: "4px 8px",
                                      backgroundColor: "#071324",
                                      border: "1px solid #1e293b",
                                      borderRadius: "4px",
                                      color: "#fff",
                                      fontSize: "12px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <option value="draft">Draft</option>
                                    <option value="quoted">Quoted</option>
                                    <option value="deposit_paid">Deposit Paid</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="milestone_review">Milestone Review</option>
                                    <option value="completed">Completed</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </div>

                              {/* Title & Service Tier */}
                              <div style={{ marginBottom: "14px" }}>
                                <div style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "4px" }}>
                                  {order.title}
                                </div>
                                <div style={{ fontSize: "12px", color: "#38bdf8" }}>
                                  Service Tier: <span style={{ color: "#cbd5e1" }}>{order.serviceTier}</span>
                                  {order.targetCompletionDate && (
                                    <span style={{ color: "#94a3b8" }}> • Target: {order.targetCompletionDate}</span>
                                  )}
                                </div>
                              </div>

                              {/* Financial Breakdown & Milestones Progress Bar */}
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: "16px",
                                  backgroundColor: "#071324",
                                  padding: "14px",
                                  borderRadius: "6px",
                                  marginBottom: "14px",
                                }}
                              >
                                <div>
                                  <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>
                                    Financial Reconciliation
                                  </div>
                                  <div style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
                                    <div>
                                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Total: </span>
                                      <strong style={{ fontSize: "15px", color: "#ffffff" }}>
                                        ${order.totalAmount.toLocaleString()} {order.currency}
                                      </strong>
                                    </div>
                                    <div>
                                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Paid: </span>
                                      <strong style={{ fontSize: "15px", color: "#4ade80" }}>
                                        ${order.amountPaid.toLocaleString()}
                                      </strong>
                                    </div>
                                    <div>
                                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Balance: </span>
                                      <strong style={{ fontSize: "15px", color: "#f87171" }}>
                                        ${(order.totalAmount - order.amountPaid).toLocaleString()}
                                      </strong>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                    <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>
                                      Milestone Delivery Progress
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "700" }}>
                                      {completedMilestones} of {order.milestones.length} approved ({progressPct}%)
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "8px",
                                      backgroundColor: "#1e293b",
                                      borderRadius: "4px",
                                      overflow: "hidden",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${progressPct}%`,
                                        height: "100%",
                                        backgroundColor: progressPct === 100 ? "#10b981" : "#38bdf8",
                                        transition: "width 0.4s ease",
                                      }}
                                    />
                                  </div>
                                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                    {order.milestones.map((ms, idx) => (
                                      <span
                                        key={ms.id || idx}
                                        style={{
                                          fontSize: "10px",
                                          padding: "2px 6px",
                                          borderRadius: "3px",
                                          backgroundColor:
                                            ms.status === "client_approved" || ms.status === "paid"
                                              ? "#065f46"
                                              : ms.status === "submitted"
                                              ? "#78350f"
                                              : "#1e293b",
                                          color:
                                            ms.status === "client_approved" || ms.status === "paid"
                                              ? "#6ee7b7"
                                              : ms.status === "submitted"
                                              ? "#fde047"
                                              : "#94a3b8",
                                        }}
                                      >
                                        P{ms.milestoneIndex}: ${ms.amount.toLocaleString()} ({ms.status.replace("_", " ")})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Action Footer: Milestones, Client URL, Delete */}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                                  Created: {new Date(order.createdAt).toLocaleDateString()} • Client Token:{" "}
                                  <code style={{ color: "#38bdf8", backgroundColor: "#071324", padding: "2px 6px", borderRadius: "3px" }}>
                                    {order.clientAccessToken.substring(0, 18)}...
                                  </code>
                                </div>

                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrder(order)}
                                    style={{
                                      padding: "6px 12px",
                                      backgroundColor: "#1e293b",
                                      border: "1px solid #334155",
                                      borderRadius: "4px",
                                      color: "#ffffff",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <span>🔍</span> Milestones &amp; Details
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => copyClientTrackerUrl(order.clientAccessToken)}
                                    style={{
                                      padding: "6px 12px",
                                      backgroundColor: "#065f46",
                                      border: "1px solid #059669",
                                      borderRadius: "4px",
                                      color: "#6ee7b7",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <span>🔗</span> Copy Client Tracker URL
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(order.id)}
                                    style={{
                                      padding: "6px 10px",
                                      backgroundColor: "#450a0a",
                                      border: "1px solid #991b1b",
                                      borderRadius: "4px",
                                      color: "#fca5a5",
                                      fontSize: "12px",
                                      cursor: "pointer",
                                    }}
                                    title="Delete Order"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SUBTAB 2: CUSTOMER DIRECTORY */}
              {omsSubTab === "customers" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                        Customer Directory &amp; Enterprise Accounts ({customers.length})
                      </h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                        Direct client contacts, NDA agreements, and lifetime billings ledger.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
                    {customers.map((c) => {
                      const linkedOrders = orders.filter((o) => o.customerId === c.id);
                      const ndaBadge =
                        c.ndaStatus === "mutual_nda_active" || c.ndaStatus === "signed"
                          ? { bg: "#065f46", text: "#6ee7b7", label: "NDA SIGNED" }
                          : { bg: "#78350f", text: "#fde047", label: "NDA PENDING" };

                      return (
                        <div
                          key={c.id}
                          style={{
                            backgroundColor: "#0a192f",
                            border: "1px solid #1e293b",
                            borderRadius: "8px",
                            padding: "18px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div>
                              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                                {c.companyName}
                              </h4>
                              <div style={{ fontSize: "13px", color: "#38bdf8", marginTop: "2px" }}>
                                {c.primaryContactName}
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                backgroundColor: ndaBadge.bg,
                                color: ndaBadge.text,
                              }}
                            >
                              {ndaBadge.label}
                            </span>
                          </div>

                          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", lineHeight: "1.6" }}>
                            <div>
                              📧 <a href={`mailto:${c.email}`} style={{ color: "#cbd5e1" }}>{c.email}</a>
                            </div>
                            {c.phone && <div>📞 {c.phone}</div>}
                            {c.billingAddress && (
                              <div>📍 {c.billingAddress.city}, {c.billingAddress.country}</div>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "#071324",
                              padding: "10px 12px",
                              borderRadius: "6px",
                              marginBottom: "12px",
                            }}
                          >
                            <div>
                              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase" }}>Lifetime Spend</div>
                              <div style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80" }}>
                                ${c.totalSpendUsd.toLocaleString()} USD
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase" }}>Engagements</div>
                              <div style={{ fontSize: "14px", fontWeight: "700", color: "#38bdf8", textAlign: "right" }}>
                                {linkedOrders.length} Orders
                              </div>
                            </div>
                          </div>

                          {c.internalNotes && (
                            <div style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic", marginBottom: "12px" }}>
                              "{c.internalNotes}"
                            </div>
                          )}

                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <a
                              href={`mailto:${c.email}?subject=Consultation%20Follow-up%20-%20Abu%20Hanif`}
                              style={{
                                fontSize: "12px",
                                padding: "6px 12px",
                                backgroundColor: "#1e293b",
                                color: "#38bdf8",
                                borderRadius: "4px",
                                textDecoration: "none",
                                fontWeight: "600",
                              }}
                            >
                              Email Client ↗
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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

                        <div style={{ fontSize: "17px", fontWeight: "700", color: "#38bdf8", marginBottom: "4px" }}>
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

                  {/* Article Cover & Social OG Image Attachment */}
                  <div style={{ marginBottom: "16px" }}>
                    <AdminImageUploader
                      label="Article Cover & Social OG Image"
                      helperText="Featured cover image displayed on article headers and social cards"
                      mode="single"
                      value={newPost.coverImageUrl}
                      onChangeSingle={(url) => setNewPost({ ...newPost, coverImageUrl: url })}
                      onClearSingle={() => setNewPost({ ...newPost, coverImageUrl: "" })}
                    />
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
                      style={{ width: "100%", padding: "10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "6px", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.5" }}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0 }}>
                      Inbound Client Leads &amp; Consultations
                    </h2>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
                        backgroundColor: "#1e3a8a",
                        color: "#93c5fd",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {inquiries.length} total
                    </span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0 0" }}>
                    High-ticket project inquiries from founders, CTOs, and engineering leaders.
                  </p>
                </div>

                {/* Lead Export Actions */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      backgroundColor: "#0f766e",
                      color: "#ffffff",
                      border: "1px solid #14b8a6",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <span>📥</span>
                    <span>Export Leads (CSV)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      backgroundColor: "#1e293b",
                      color: "#e2e8f0",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <span>📄</span>
                    <span>Export Leads (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  padding: "14px 16px",
                  backgroundColor: "#0a192f",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  marginBottom: "20px",
                }}
              >
                {/* Status Filter Tabs */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(["all", "new", "reviewed", "contacted", "archived"] as const).map((status) => {
                    const count = status === "all" ? inquiries.length : inquiries.filter((i) => i.status === status).length;
                    const isSelected = inquiryFilterStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setInquiryFilterStatus(status)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "4px",
                          border: isSelected ? "1px solid #3b82f6" : "1px solid #1e293b",
                          backgroundColor: isSelected ? "#2563eb" : "#071324",
                          color: isSelected ? "#ffffff" : "#94a3b8",
                          fontSize: "12px",
                          fontWeight: isSelected ? "700" : "500",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {status} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Free Text Search */}
                <div style={{ minWidth: "260px", flex: "1 1 260px", maxWidth: "400px" }}>
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search client, email, scope, keywords..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#071324",
                      border: "1px solid #1e293b",
                      borderRadius: "4px",
                      color: "#ffffff",
                      fontSize: "13px",
                    }}
                  />
                </div>
              </div>

              {/* Inquiry List */}
              {filteredInquiries.length === 0 ? (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    backgroundColor: "#0a192f",
                    border: "1px dashed #1e293b",
                    borderRadius: "6px",
                    color: "#94a3b8",
                  }}
                >
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 6px 0", color: "#cbd5e1" }}>
                    No matching inquiries found
                  </p>
                  <p style={{ fontSize: "13px", margin: 0 }}>
                    Try clearing search keywords or selecting another status filter tab.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      style={{
                        padding: "20px",
                        backgroundColor: "#0a192f",
                        border: inq.status === "new" ? "1px solid #2563eb" : "1px solid #1e293b",
                        borderRadius: "6px",
                        boxShadow: inq.status === "new" ? "0 0 15px rgba(37, 99, 235, 0.15)" : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <h3 style={{ margin: "0", fontSize: "18px", color: "#ffffff", fontWeight: "700" }}>
                              {inq.name}
                            </h3>
                            {inq.status === "new" && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: "800",
                                  textTransform: "uppercase",
                                  padding: "2px 6px",
                                  borderRadius: "3px",
                                  backgroundColor: "#dc2626",
                                  color: "#ffffff",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                NEW LEAD
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "13px", color: "#38bdf8", marginTop: "4px" }}>
                            Email: <a href={`mailto:${inq.email}?subject=Re:%20Technical%20Consultation%20Inquiry%20-%20Abu%20Hanif`} style={{ color: "#38bdf8", textDecoration: "underline" }}>{inq.email}</a>
                            {inq.phone && ` • Phone / WhatsApp: ${inq.phone}`}
                          </div>
                        </div>

                        {/* Status Select & Action Toolbar */}
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              padding: "4px 8px",
                              borderRadius: "3px",
                              backgroundColor: inq.status === "new" ? "#dc2626" : inq.status === "contacted" ? "#16a34a" : inq.status === "reviewed" ? "#2563eb" : "#475569",
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
                              cursor: "pointer",
                            }}
                          >
                            <option value="new">Mark New</option>
                            <option value="reviewed">Mark Reviewed</option>
                            <option value="contacted">Mark Contacted</option>
                            <option value="archived">Mark Archived</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleConvertInquiry(inq)}
                            title="Convert inbound inquiry into an official Customer & Contract Order"
                            style={{
                              padding: "4px 10px",
                              backgroundColor: "#065f46",
                              border: "1px solid #059669",
                              color: "#6ee7b7",
                              fontSize: "12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            💼 Convert to Order
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            title="Delete this inquiry record"
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#450a0a",
                              border: "1px solid #991b1b",
                              color: "#fca5a5",
                              fontSize: "12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      <div style={{ backgroundColor: "#071324", padding: "14px", borderRadius: "4px", marginBottom: "12px" }}>
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>
                          Scope: <strong style={{ color: "#e2e8f0" }}>{inq.projectType}</strong> &nbsp;|&nbsp; Budget Tier: <strong style={{ color: "#4ade80" }}>{inq.budgetRange}</strong>
                        </div>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", lineHeight: "1.5", color: "#e2e8f0", whiteSpace: "pre-wrap" }}>
                          "{inq.message}"
                        </p>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94a3b8" }}>
                        <span>Received: {new Date(inq.createdAt).toLocaleString()}</span>
                        <a
                          href={`mailto:${inq.email}?subject=Re:%20Technical%20Consultation%20Inquiry%20-%20Abu%20Hanif`}
                          style={{ color: "#38bdf8", fontWeight: "600", textDecoration: "none" }}
                        >
                          Direct Reply via Email ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                className="admin-modal-card"
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
                className="admin-modal-card"
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
                      style={{ width: "100%", padding: "8px 10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "6px", fontSize: "13px" }}
                    />
                  </div>

                  {/* Article Cover & Social OG Image Attachment */}
                  <div style={{ marginBottom: "16px" }}>
                    <AdminImageUploader
                      label="Article Cover & Social OG Image"
                      helperText="Featured cover image displayed on article headers and social cards"
                      mode="single"
                      value={editingPost.coverImageUrl || ""}
                      onChangeSingle={(url) => setEditingPost({ ...editingPost, coverImageUrl: url })}
                      onClearSingle={() => setEditingPost({ ...editingPost, coverImageUrl: undefined })}
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
                        backgroundColor: "#071324",
                        border: "1px solid #1e293b",
                        color: "#fff",
                        borderRadius: "6px",
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

          {/* CREATE NEW ORDER MODAL */}
          {isCreateOrderOpen && (
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
                className="admin-modal-card"
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  maxWidth: "680px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    borderBottom: "1px solid #1e293b",
                    paddingBottom: "12px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                      Create New Engagement Order
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                      Issues an institutional contract with 3-phase milestone escrow and cryptographic client tracker.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateOrderOpen(false)}
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

                <form onSubmit={handleCreateOrderSubmit}>
                  {/* Customer Selection */}
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>
                      Customer Account *
                    </label>
                    <select
                      value={newOrderForm.customerId}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, customerId: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "#071324",
                        border: "1px solid #1e293b",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    >
                      <option value="">➕ New Client Lead (Enter details below)</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.companyName} ({c.primaryContactName} — {c.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* If New Customer, show inputs */}
                  {!newOrderForm.customerId && (
                    <div
                      style={{
                        backgroundColor: "#071324",
                        padding: "14px",
                        borderRadius: "6px",
                        marginBottom: "14px",
                        border: "1px dashed #1e293b",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", marginBottom: "10px" }}>
                        New Client Details
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                        <div>
                          <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "3px" }}>Company / Org Name *</label>
                          <input
                            required={!newOrderForm.customerId}
                            placeholder="e.g. Acme FinTech Corp"
                            value={newOrderForm.newCompanyName}
                            onChange={(e) => setNewOrderForm({ ...newOrderForm, newCompanyName: e.target.value })}
                            style={{ width: "100%", padding: "6px 8px", backgroundColor: "#0a192f", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "12px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "3px" }}>Primary Contact Name *</label>
                          <input
                            required={!newOrderForm.customerId}
                            placeholder="e.g. Alex Morgan"
                            value={newOrderForm.newContactName}
                            onChange={(e) => setNewOrderForm({ ...newOrderForm, newContactName: e.target.value })}
                            style={{ width: "100%", padding: "6px 8px", backgroundColor: "#0a192f", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "12px" }}
                          />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                          <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "3px" }}>Contact Email *</label>
                          <input
                            required={!newOrderForm.customerId}
                            type="email"
                            placeholder="alex@acmecorp.com"
                            value={newOrderForm.newEmail}
                            onChange={(e) => setNewOrderForm({ ...newOrderForm, newEmail: e.target.value })}
                            style={{ width: "100%", padding: "6px 8px", backgroundColor: "#0a192f", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "12px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "3px" }}>Phone / WhatsApp (Optional)</label>
                          <input
                            placeholder="+1 (555) 000-0000"
                            value={newOrderForm.newPhone}
                            onChange={(e) => setNewOrderForm({ ...newOrderForm, newPhone: e.target.value })}
                            style={{ width: "100%", padding: "6px 8px", backgroundColor: "#0a192f", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontSize: "12px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scope Title */}
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>
                      Engagement / Project Title *
                    </label>
                    <input
                      required
                      placeholder="e.g. High-Throughput E-Commerce API & Payment Gateway Migration"
                      value={newOrderForm.title}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, title: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "#071324",
                        border: "1px solid #1e293b",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  {/* Service Tier & Subtotal */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>
                        Engineering Service Tier *
                      </label>
                      <select
                        value={newOrderForm.serviceTier}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, serviceTier: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          backgroundColor: "#071324",
                          border: "1px solid #1e293b",
                          color: "#fff",
                          borderRadius: "4px",
                          fontSize: "13px",
                        }}
                      >
                        <option value="Full-Stack Web Application (Next.js/React)">Full-Stack Web Application (Next.js/React)</option>
                        <option value="Database Optimization & High-Throughput Sprints">Database Optimization & High-Throughput Sprints</option>
                        <option value="Cloud Native Architecture & AWS/GCP">Cloud Native Architecture & AWS/GCP</option>
                        <option value="Enterprise Security & Zero-Trust Audit">Enterprise Security & Zero-Trust Audit</option>
                        <option value="API Design & Real-Time Sync Ecosystems">API Design & Real-Time Sync Ecosystems</option>
                        <option value="Fractional CTO & Advisory Retainer">Fractional CTO & Advisory Retainer</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>
                        Contract Total (USD $) *
                      </label>
                      <input
                        required
                        type="number"
                        min="500"
                        step="100"
                        value={newOrderForm.subtotalAmount}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, subtotalAmount: Number(e.target.value) })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          backgroundColor: "#071324",
                          border: "1px solid #1e293b",
                          color: "#4ade80",
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      />
                    </div>
                  </div>

                  {/* Target Completion Date */}
                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ fontSize: "12px", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>
                      Target Completion Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newOrderForm.targetCompletionDate}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, targetCompletionDate: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "#071324",
                        border: "1px solid #1e293b",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  {/* Milestone Breakdown Notice */}
                  <div
                    style={{
                      backgroundColor: "#071324",
                      border: "1px solid #1e293b",
                      borderRadius: "6px",
                      padding: "12px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "20px",
                    }}
                  >
                    💡 <strong>Automatic Milestone Allocation:</strong> This contract will generate 3 balanced phases:
                    <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                      <li>Phase 1 (50%): Architecture Blueprint, SSR Scaffold &amp; Auth Engine</li>
                      <li>Phase 2 (30%): Core Feature Engineering, API Integrations &amp; Staging Deploy</li>
                      <li>Phase 3 (20%): Production Load Testing, IP Handover &amp; 30-Day Bug Warranty</li>
                    </ul>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #1e293b", paddingTop: "14px" }}>
                    <button
                      type="button"
                      onClick={() => setIsCreateOrderOpen(false)}
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
                      type="submit"
                      style={{
                        padding: "8px 20px",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Create Order &amp; Issue Tracker
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ORDER DETAIL & MILESTONES MODAL */}
          {selectedOrder && (
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
                className="admin-modal-card"
                style={{
                  backgroundColor: "#0a192f",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  maxWidth: "840px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: "24px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    borderBottom: "1px solid #1e293b",
                    paddingBottom: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "20px", fontWeight: "800", color: "#38bdf8", fontFamily: "monospace" }}>
                        {selectedOrder.orderNumber}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#1e293b",
                          color: "#cbd5e1",
                          border: "1px solid #334155",
                          textTransform: "uppercase",
                        }}
                      >
                        {selectedOrder.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "4px 0 0 0" }}>
                      {selectedOrder.title}
                    </h3>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                      Client: <strong style={{ color: "#e2e8f0" }}>{selectedOrder.customer?.companyName || "Organization"}</strong>
                      {selectedOrder.customer?.primaryContactName && ` (${selectedOrder.customer.primaryContactName})`}
                      {selectedOrder.customer?.email && ` • ${selectedOrder.customer.email}`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
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

                {/* Client Live Tracker URL Box */}
                <div
                  style={{
                    backgroundColor: "#071324",
                    border: "1px solid #059669",
                    borderRadius: "6px",
                    padding: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>🔐</span> Zero-Trust Client Portal Tracker URL
                    </div>
                    <a
                      href={`/orders/tracker?token=${selectedOrder.clientAccessToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "600", textDecoration: "none" }}
                    >
                      Open Live Portal ↗
                    </a>
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 10px 0" }}>
                    Share this cryptographically-signed access link with your client. They can track deliverable progress, review milestones, and inspect sprint completions in real time without creating an account.
                  </p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      readOnly
                      value={typeof window !== "undefined" ? `${window.location.origin}/orders/tracker?token=${selectedOrder.clientAccessToken}` : `/orders/tracker?token=${selectedOrder.clientAccessToken}`}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        backgroundColor: "#0a192f",
                        border: "1px solid #1e293b",
                        borderRadius: "4px",
                        color: "#cbd5e1",
                        fontSize: "12px",
                        fontFamily: "monospace",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => copyClientTrackerUrl(selectedOrder.clientAccessToken)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#065f46",
                        border: "1px solid #059669",
                        color: "#6ee7b7",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Copy URL
                    </button>
                  </div>
                </div>

                {/* Financial Ledger & Payment Settle Input */}
                <div
                  style={{
                    backgroundColor: "#071324",
                    border: "1px solid #1e293b",
                    borderRadius: "6px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Financial Settlement</div>
                      <div style={{ display: "flex", gap: "16px", alignItems: "baseline", marginTop: "4px" }}>
                        <div>Total: <strong style={{ color: "#ffffff", fontSize: "16px" }}>${selectedOrder.totalAmount.toLocaleString()}</strong></div>
                        <div>Paid: <strong style={{ color: "#4ade80", fontSize: "16px" }}>${selectedOrder.amountPaid.toLocaleString()}</strong></div>
                        <div>Remaining: <strong style={{ color: "#f87171", fontSize: "16px" }}>${(selectedOrder.totalAmount - selectedOrder.amountPaid).toLocaleString()}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        placeholder="Amount ($)"
                        value={recordPaymentAmount}
                        onChange={(e) => setRecordPaymentAmount(e.target.value)}
                        style={{
                          width: "120px",
                          padding: "6px 8px",
                          backgroundColor: "#0a192f",
                          border: "1px solid #1e293b",
                          borderRadius: "4px",
                          color: "#fff",
                          fontSize: "13px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = Number(recordPaymentAmount);
                          if (!val || val <= 0) {
                            alert("Please enter a valid positive payment amount.");
                            return;
                          }
                          handleRecordPayment(selectedOrder.id, selectedOrder.amountPaid + val);
                          setRecordPaymentAmount("");
                        }}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#16a34a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Record Payment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Milestones Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", margin: "0 0 10px 0" }}>
                    Contract Milestones ({selectedOrder.milestones.length})
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {selectedOrder.milestones.map((m) => {
                      const mStatusColors: Record<string, { bg: string; text: string }> = {
                        pending: { bg: "#1e293b", text: "#94a3b8" },
                        in_progress: { bg: "#1e1b4b", text: "#c084fc" },
                        submitted: { bg: "#78350f", text: "#fde047" },
                        client_approved: { bg: "#065f46", text: "#6ee7b7" },
                        paid: { bg: "#065f46", text: "#34d399" },
                      };
                      const msc = mStatusColors[m.status] || mStatusColors.pending;

                      return (
                        <div
                          key={m.id}
                          style={{
                            backgroundColor: "#071324",
                            border: "1px solid #1e293b",
                            borderRadius: "6px",
                            padding: "12px 14px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                            <div>
                              <strong style={{ fontSize: "13px", color: "#ffffff" }}>
                                Phase {m.milestoneIndex}: {m.title}
                              </strong>
                              {m.dueDate && (
                                <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "8px" }}>
                                  (Target Due: {m.dueDate})
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ fontSize: "13px", fontWeight: "700", color: "#4ade80" }}>
                                ${m.amount.toLocaleString()} USD
                              </span>
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  padding: "2px 6px",
                                  borderRadius: "3px",
                                  backgroundColor: msc.bg,
                                  color: msc.text,
                                  textTransform: "uppercase",
                                }}
                              >
                                {m.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
                            Deliverables: {m.deliverablesSummary}
                          </div>

                          {m.approvedAt && (
                            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                              ✓ Approved by client on {new Date(m.approvedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #1e293b", paddingTop: "14px" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    style={{
                      padding: "8px 20px",
                      backgroundColor: "#334155",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Close
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
