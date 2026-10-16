"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { initialProjects, initialBlogPosts, initialServices } from "../data/portfolio-data";
import { blogCategoryPillars } from "../data/blog-categories";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const router = useRouter();

  // Toggle Command Palette on Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAction(label);
      setTimeout(() => setCopiedAction(null), 2500);
    }
  };

  const triggerCertificateModal = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-certificate-modal", { detail: "programming-hero" }));
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "rgba(4, 31, 54, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "min(80px, 8vh) 16px 20px 16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px #053056",
          border: "2px solid #053056",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
      >
        <Command label="Global Command Palette">
          {/* Header & Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 18px",
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#053056" }}>🔍</span>
            <Command.Input
              autoFocus
              placeholder="Search projects, technical articles, topic pillars, pricing, or actions..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "15px",
                color: "#0f172a",
                fontWeight: "500",
              }}
            />
            <kbd
              style={{
                fontSize: "11px",
                padding: "2px 6px",
                backgroundColor: "#e2e8f0",
                color: "#475569",
                borderRadius: "3px",
                border: "1px solid #cbd5e1",
                fontFamily: "monospace",
              }}
            >
              ESC
            </kbd>
          </div>

          {/* Copied Feedback Alert */}
          {copiedAction && (
            <div
              style={{
                padding: "8px 18px",
                backgroundColor: "#ecfdf5",
                color: "#065f46",
                fontSize: "12px",
                fontWeight: "bold",
                borderBottom: "1px solid #a7f3d0",
              }}
            >
              ✓ Copied {copiedAction} to clipboard!
            </div>
          )}

          {/* List of Results */}
          <Command.List
            style={{
              overflowY: "auto",
              padding: "10px",
              maxHeight: "420px",
            }}
          >
            <Command.Empty
              style={{
                padding: "30px 20px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              No engineering records found matching that query.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group
              heading="Quick Actions & Direct Contact"
              style={{
                color: "#053056",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "6px 8px 4px 8px",
              }}
            >
              <Command.Item
                onSelect={() => handleCopy("contact@abuhanif.dev", "Email Address")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1e293b",
                }}
              >
                <span>✉️ Copy Direct Email (contact@abuhanif.dev)</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Action</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleCopy("+880 1700-000000", "Phone / WhatsApp")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1e293b",
                }}
              >
                <span>📱 Copy Phone / WhatsApp (+880 1700-000000)</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Action</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/pricing#inquiry"))}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1e293b",
                }}
              >
                <span>💼 Request Technical Project Quote / Scope</span>
                <span style={{ fontSize: "11px", color: "#9CBE41", fontWeight: "bold" }}>/pricing</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/resume"))}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1e293b",
                }}
              >
                <span>🖨️ View &amp; Print Curriculum Vitae (ATS PDF)</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>/resume</span>
              </Command.Item>
            </Command.Group>

            {/* Verified Credentials */}
            <Command.Group
              heading="Verified Accreditations & Credentials"
              style={{
                color: "#053056",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "10px 8px 4px 8px",
              }}
            >
              <Command.Item
                onSelect={triggerCertificateModal}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1e293b",
                }}
              >
                <span>🎓 <strong>Programming Hero Certificate of Excellence</strong> (Batch-12 • WEB12-3991)</span>
                <span style={{ fontSize: "11px", color: "#9CBE41", fontWeight: "bold" }}>Inspect ↗</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/resume#education"))}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1e293b",
                }}
              >
                <span>🏛️ <strong>Bachelor of Science in Computer Science &amp; Engineering</strong> (4-Year Formal Degree)</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>B.Sc. CSE</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/resume#education"))}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1e293b",
                }}
              >
                <span>📜 <strong>freeCodeCamp Certified</strong> (JS Algorithms, TypeScript, Python)</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Verified</span>
              </Command.Item>
            </Command.Group>

            {/* Shipped Systems & Case Studies */}
            <Command.Group
              heading="Production Systems & Case Studies"
              style={{
                color: "#053056",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "10px 8px 4px 8px",
              }}
            >
              {initialProjects.map((project) => (
                <Command.Item
                  key={project.slug}
                  onSelect={() => runCommand(() => router.push(`/projects/${project.slug}`))}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13.5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#1e293b",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "600", color: "#053056" }}>⚡ {project.title}</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{project.impactMetric}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#166534", fontWeight: "bold" }}>
                    {project.priceTag}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Topic Category Pillars */}
            <Command.Group
              heading="Topic Category Pillars"
              style={{
                color: "#053056",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "10px 8px 4px 8px",
              }}
            >
              {blogCategoryPillars.map((pillar) => (
                <Command.Item
                  key={pillar.slug}
                  onSelect={() => runCommand(() => router.push(`/blog/category/${pillar.slug}`))}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13.5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#1e293b",
                  }}
                >
                  <span>🏛️ {pillar.name}</span>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Topic Hub</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Technical Articles */}
            <Command.Group
              heading="Technical Engineering Articles"
              style={{
                color: "#053056",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "10px 8px 4px 8px",
              }}
            >
              {initialBlogPosts.map((post) => (
                <Command.Item
                  key={post.slug}
                  onSelect={() => runCommand(() => router.push(`/blog/${post.slug}`))}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13.5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#1e293b",
                  }}
                >
                  <span>📝 {post.title}</span>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{post.readingTimeMinutes} min</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Consulting Services */}
            <Command.Group
              heading="Consulting Services & Sprints"
              style={{
                color: "#053056",
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "10px 8px 4px 8px",
              }}
            >
              {initialServices.map((service) => (
                <Command.Item
                  key={service.slug}
                  onSelect={() => runCommand(() => router.push(`/pricing#${service.slug}`))}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "13.5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#1e293b",
                  }}
                >
                  <span>💰 {service.title} ({service.timeline})</span>
                  <span style={{ fontSize: "11px", color: "#053056", fontWeight: "bold" }}>
                    {service.priceDisplay}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer Bar */}
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <span>Use <kbd style={{ padding: "1px 5px", backgroundColor: "#e2e8f0", borderRadius: "2px" }}>↑</kbd> <kbd style={{ padding: "1px 5px", backgroundColor: "#e2e8f0", borderRadius: "2px" }}>↓</kbd> to navigate</span>
              <span><kbd style={{ padding: "1px 5px", backgroundColor: "#e2e8f0", borderRadius: "2px" }}>↵</kbd> to select</span>
            </div>
            <span>MD Abu Hanif Mia • Staff Software Engineer</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
