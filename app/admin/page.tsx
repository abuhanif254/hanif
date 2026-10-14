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
    descriptionMarkdown: "",
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

  // Add project handler
  function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      slug: newProject.slug || newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      summary: newProject.summary,
      descriptionMarkdown: newProject.descriptionMarkdown || newProject.summary,
      clientName: "Client Project",
      priceTag: newProject.priceTag,
      impactMetric: newProject.impactMetric,
      techStack: newProject.techStack.split(",").map((s) => s.trim()),
      demoUrl: newProject.demoUrl || undefined,
      githubUrl: newProject.githubUrl || undefined,
      isFeatured: true,
      published: true,
    };
    setProjects([item, ...projects]);
    setNewProject({
      title: "",
      slug: "",
      summary: "",
      priceTag: "$10,000 Scope",
      impactMetric: "<30ms P99 • 99.99% Uptime",
      techStack: "Next.js, TypeScript, PostgreSQL",
      demoUrl: "",
      githubUrl: "",
      descriptionMarkdown: "",
    });
    showNotification("Project successfully added to portfolio!");
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

  // Update inquiry status
  function updateInquiryStatus(id: string, status: InquiryRecord["status"]) {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    showNotification(`Inquiry status updated to ${status}`);
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

        <div>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>
            Admin: <strong>{profile.fullName}</strong>
          </span>
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
              <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 16px 0" }}>
                Work Showcase &amp; Projects Manager
              </h2>

              {/* Add Project Form */}
              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", color: "#38bdf8" }}>
                  + Add New Project to Showcase
                </h3>
                <form onSubmit={handleAddProject}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Project Title *</label>
                      <input
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g. Distributed Telemetry Pipeline"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Price / Scope Tag</label>
                      <input
                        value={newProject.priceTag}
                        onChange={(e) => setNewProject({ ...newProject, priceTag: e.target.value })}
                        placeholder="e.g. $18,500 Scope or $140/hr"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Impact Metric</label>
                      <input
                        value={newProject.impactMetric}
                        onChange={(e) => setNewProject({ ...newProject, impactMetric: e.target.value })}
                        placeholder="e.g. 12M Events/Sec • 99.99% Uptime"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Tech Stack (comma separated)</label>
                      <input
                        value={newProject.techStack}
                        onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                        placeholder="Go, Next.js, Redis, PostgreSQL"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Live Demo URL</label>
                      <input
                        value={newProject.demoUrl}
                        onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                        placeholder="https://example.com"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>GitHub Repo URL</label>
                      <input
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Summary *</label>
                    <textarea
                      required
                      rows={2}
                      value={newProject.summary}
                      onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                      placeholder="Concise overview of what was built and the technical problem solved..."
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Add Project to Portfolio
                  </button>
                </form>
              </div>

              {/* Projects List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    style={{
                      padding: "16px",
                      backgroundColor: "#0a192f",
                      border: "1px solid #1e293b",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "16px", color: "#ffffff" }}>{proj.title}</strong>
                      <span style={{ fontSize: "12px", color: "#10b981", marginLeft: "12px", fontWeight: "700" }}>
                        {proj.priceTag}
                      </span>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#94a3b8" }}>{proj.summary}</p>
                      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                        {proj.techStack.map((tech) => (
                          <span key={tech} style={{ fontSize: "10px", backgroundColor: "#071324", padding: "2px 6px", borderRadius: "2px", color: "#cbd5e1" }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProjects(projects.filter((p) => p.id !== proj.id));
                        showNotification("Project removed.");
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#7f1d1d",
                        color: "#fecaca",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === "services" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 16px 0" }}>
                Transparent Services &amp; Work Pricing Manager
              </h2>

              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", color: "#38bdf8" }}>
                  + Add New Pricing Package
                </h3>
                <form onSubmit={handleAddService}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Service Title *</label>
                      <input
                        required
                        value={newService.title}
                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                        placeholder="e.g. Performance Audit Sprint"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Price Display *</label>
                      <input
                        required
                        value={newService.priceDisplay}
                        onChange={(e) => setNewService({ ...newService, priceDisplay: e.target.value })}
                        placeholder="e.g. $3,500 or $140 / hr"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Timeline / Scope</label>
                      <input
                        value={newService.timeline}
                        onChange={(e) => setNewService({ ...newService, timeline: e.target.value })}
                        placeholder="e.g. 5 Business Days"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Deliverables (comma separated)</label>
                    <input
                      value={newService.deliverables}
                      onChange={(e) => setNewService({ ...newService, deliverables: e.target.value })}
                      placeholder="Deliverable 1, Deliverable 2, Deliverable 3"
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Brief overview of the scope and deliverables..."
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Add Pricing Package
                  </button>
                </form>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {services.map((serv) => (
                  <div key={serv.id} style={{ padding: "20px", backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>{serv.priceDisplay}</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#38bdf8", marginTop: "4px" }}>{serv.title}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 12px 0" }}>⏱ {serv.timeline}</div>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{serv.description}</p>
                    <button
                      onClick={() => {
                        setServices(services.filter((s) => s.id !== serv.id));
                        showNotification("Pricing package removed.");
                      }}
                      style={{
                        marginTop: "14px",
                        padding: "6px 10px",
                        backgroundColor: "#7f1d1d",
                        color: "#fecaca",
                        border: "none",
                        borderRadius: "3px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Remove Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BLOG */}
          {activeTab === "blog" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 16px 0" }}>
                Technical Blog &amp; Publishing Manager
              </h2>

              <div style={{ backgroundColor: "#0a192f", border: "1px solid #1e293b", borderRadius: "6px", padding: "24px", marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", color: "#38bdf8" }}>
                  + Publish New Technical Article
                </h3>
                <form onSubmit={handleAddPost}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Article Title *</label>
                      <input
                        required
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="e.g. Mastering Database Indexing for High Concurrency"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Tags (comma separated)</label>
                      <input
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        placeholder="PostgreSQL, Next.js, Architecture"
                        style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Excerpt / Summary *</label>
                    <input
                      required
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                      placeholder="Short synopsis shown on the blog archive and search results..."
                      style={{ width: "100%", padding: "8px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Full Content (Markdown format) *</label>
                    <textarea
                      required
                      rows={8}
                      value={newPost.contentMarkdown}
                      onChange={(e) => setNewPost({ ...newPost, contentMarkdown: e.target.value })}
                      placeholder="Write your technical article in Markdown with headers, code blocks (```typescript), and lists..."
                      style={{ width: "100%", padding: "10px", backgroundColor: "#071324", border: "1px solid #1e293b", color: "#fff", borderRadius: "4px", fontFamily: "monospace" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Publish Article to Blog
                  </button>
                </form>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      padding: "16px",
                      backgroundColor: "#0a192f",
                      border: "1px solid #1e293b",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "16px", color: "#ffffff" }}>{post.title}</strong>
                      <span style={{ fontSize: "12px", color: "#38bdf8", marginLeft: "10px" }}>
                        ⏱ {post.readingTimeMinutes} min read
                      </span>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#94a3b8" }}>{post.excerpt}</p>
                    </div>
                    <button
                      onClick={() => {
                        setBlogPosts(blogPosts.filter((p) => p.id !== post.id));
                        showNotification("Article deleted.");
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#7f1d1d",
                        color: "#fecaca",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
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

                    <div style={{ fontSize: "11px", color: "#64748b" }}>
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
        </main>
      </div>
    </div>
  );
}
