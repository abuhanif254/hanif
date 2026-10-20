import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects, PROJECT_SLUG_ALIASES } from "../../lib/portfolio-store";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import ProjectScreenshotGallery from "../../components/project-screenshot-gallery";
import ProjectCaseStudyActions from "../../components/project-case-study-actions";
import ProjectEcosystemCard from "../../components/project-ecosystem-card";

function renderInlineFormatting(text: string): React.ReactNode {
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600, color: "#0f172a" }}>
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            backgroundColor: "#f1f5f9",
            color: "#1e293b",
            padding: "2px 5px",
            borderRadius: "4px",
            fontSize: "13px",
            fontFamily: "monospace",
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}

function RenderProjectMarkdown({ markdown }: { markdown: string }) {
  const normalized = (markdown || "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");

  const lines = normalized.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: string[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = (key: string) => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        blocks.push(
          <p key={key} style={{ margin: "0 0 16px 0", fontSize: "15px", lineHeight: "1.75", color: "#334155" }}>
            {renderInlineFormatting(text)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={key} style={{ margin: "12px 0 20px 24px", paddingLeft: "8px", listStyleType: "disc" }}>
          {currentList.map((item, idx) => (
            <li key={idx} style={{ marginBottom: "8px", fontSize: "15px", lineHeight: "1.65", color: "#334155" }}>
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(`p-${index}`);
      flushList(`l-${index}`);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph(`p-before-h3-${index}`);
      flushList(`l-before-h3-${index}`);
      blocks.push(
        <h3
          key={`h3-${index}`}
          style={{
            fontSize: "19px",
            fontWeight: 700,
            color: "#0f172a",
            marginTop: "28px",
            marginBottom: "12px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "6px",
          }}
        >
          {trimmed.replace("### ", "").trim()}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph(`p-before-h2-${index}`);
      flushList(`l-before-h2-${index}`);
      blocks.push(
        <h2
          key={`h2-${index}`}
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            marginTop: "32px",
            marginBottom: "14px",
            borderBottom: "2px solid #cbd5e1",
            paddingBottom: "6px",
          }}
        >
          {trimmed.replace("## ", "").trim()}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph(`p-before-list-${index}`);
      currentList.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }

    // Regular paragraph line
    flushList(`l-before-p-${index}`);
    currentParagraph.push(trimmed);
  });

  flushParagraph("p-final");
  flushList("l-final");

  return <div className="case-study-markdown-body">{blocks}</div>;
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  const slugSet = new Set<string>();
  projects.forEach((p) => slugSet.add(p.slug));
  Object.keys(PROJECT_SLUG_ALIASES).forEach((alias) => slugSet.add(alias));
  return Array.from(slugSet).map((slug) => ({
    slug,
  }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Case Study Not Found" };
  }

  return {
    title: `${project.title} | Abu Hanif (MD Abu Hanif Mia) Case Studies`,
    description: project.summary,
    keywords: [
      project.title,
      ...project.techStack,
      "Software Engineering Case Study",
      "Systems Architecture",
      "Abu Hanif",
      "MD Abu Hanif Mia",
    ],
    alternates: {
      canonical: `${siteUrl}/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${siteUrl}/projects/${project.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      creator: "@abuhanif",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cloud / Edge",
    author: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      url: siteUrl,
      jobTitle: "Staff Software Engineer & Systems Architect",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${siteUrl}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <div id="source-page-root" data-source-path={`/projects/${project.slug}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div id="source-page-body" className="source-page-body js l2 section_10 justia-robertjfleming-com">
        <SiteHeader activePath="/projects" />

        <div className="index" id="container">
          <div className="cwrap">
            {/* Main Content */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <h1 style={{ margin: 0, fontSize: "28px", lineHeight: "1.3" }}>
                          {project.title}
                        </h1>
                        <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#e2e8f0" }}>
                          Technical Case Study &amp; Production Architecture
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <a href="/">Home</a> &gt; <a href="/projects">Projects</a> &gt; <span>{project.title}</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      {/* Metric & Scope Summary Box */}
                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #2563eb",
                          padding: "20px 24px",
                          borderRadius: "8px",
                          marginBottom: "24px",
                          boxShadow: "0 2px 8px -2px rgba(11, 19, 43, 0.05)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginBottom: "12px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13.5px",
                              fontWeight: "bold",
                              color: "#047857",
                              backgroundColor: "#ecfdf5",
                              padding: "4px 12px",
                              borderRadius: "6px",
                              border: "1px solid #a7f3d0",
                            }}
                          >
                            💰 Scope: {project.priceTag || "Scoped Contract"}
                          </span>

                          <div style={{ display: "flex", gap: "12px" }}>
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                  color: "#2563eb",
                                  textDecoration: "underline",
                                }}
                              >
                                Live Demo ↗
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                  color: "#2563eb",
                                  textDecoration: "underline",
                                }}
                              >
                                GitHub Repo ↗
                              </a>
                            )}
                          </div>
                        </div>

                        <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.7" }}>
                          <div>🏢 <strong>Client / Engagement:</strong> {project.clientName || "Confidential Enterprise Client"}</div>
                          <div>⚡ <strong>Verified Production SLA:</strong> <span style={{ color: "#047857", fontWeight: "bold" }}>{project.impactMetric}</span></div>
                          <div>🛠 <strong>Core Technologies:</strong> {(project.techStack || []).join(" • ")}</div>
                        </div>
                      </div>

                      {/* Case Study Actions: Copy Dossier, Print, Share */}
                      <ProjectCaseStudyActions project={project} />

                      {/* Project Cover & Interactive Screenshots Lightbox */}
                      <ProjectScreenshotGallery
                        title={project.title}
                        coverImage={project.imageUrl}
                        screenshots={project.screenshots}
                      />

                      {/* Executive Summary */}
                      <h2 style={{ color: "#0f172a", fontSize: "20px", marginTop: "16px", marginBottom: "8px" }}>Executive Architecture Summary</h2>
                      <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#334155" }}>
                        {project.summary}
                      </p>

                      {/* Case Study Content */}
                      <div
                        style={{
                          marginTop: "24px",
                          fontSize: "15px",
                          lineHeight: "1.7",
                          color: "#1e293b",
                        }}
                      >
                        <RenderProjectMarkdown markdown={project.descriptionMarkdown} />
                      </div>

                      {/* Technology Stack Pills */}
                      <div style={{ marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a" }}>
                          Technologies Deployed:
                        </h4>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {(project.techStack || []).map((tech) => (
                            <span
                              key={tech}
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                backgroundColor: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                color: "#1d4ed8",
                                padding: "4px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              #{tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Connected Engineering Ecosystem: Lab, Article, Fixed SOW */}
                      <ProjectEcosystemCard projectSlug={project.slug} />

                      {/* Bottom Back Button & Scoping CTA */}
                      <div
                        style={{
                          marginTop: "32px",
                          padding: "24px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "16px", color: "#0f172a", display: "block" }}>
                            Have a similar architecture challenge?
                          </strong>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>
                            Abu Hanif is available for targeted audits, performance tuning, and greenfield platform builds.
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <Link
                            href="/projects"
                            style={{
                              fontSize: "13px",
                              padding: "8px 16px",
                              border: "1px solid #cbd5e1",
                              backgroundColor: "#ffffff",
                              color: "#0f172a",
                              fontWeight: "bold",
                              borderRadius: "6px",
                              textDecoration: "none",
                            }}
                          >
                            ‹ All Projects
                          </Link>
                          <a
                            href="/pricing#inquiry"
                            style={{
                              fontSize: "13px",
                              padding: "8px 18px",
                              backgroundColor: "#2563eb",
                              color: "#ffffff",
                              fontWeight: "bold",
                              borderRadius: "6px",
                              textDecoration: "none",
                              transition: "background-color 0.15s ease",
                            }}
                          >
                            Request Project Quote ›
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Sidebar */}
                <div className="sidebar secondary-sidebar">
                  <div className="widget" id="wdgt-contact">
                    <strong className="heading4 widget-title">
                      <a href="/pricing#inquiry">Direct Scoping Inquiry</a>
                    </strong>
                    <div className="description">
                      <p>
                        Engage Abu Hanif for specialized systems architecture, distributed backends, or Cloudflare Pages deployments.
                      </p>
                      <div style={{ padding: "10px 0" }}>
                        <a
                          className="btn"
                          href="/pricing#inquiry"
                          style={{
                            display: "block",
                            textAlign: "center",
                            padding: "10px 16px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            fontWeight: "bold",
                            textDecoration: "none",
                            borderRadius: "6px",
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          Request Consultation ›
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="widget amp-include" id="wdgt-competencies">
                    <strong className="heading4 widget-title">
                      <a href="/projects">Other Case Studies</a>
                    </strong>
                    <div className="description">
                      <ul style={{ margin: "0", paddingLeft: "18px", fontSize: "13px", lineHeight: "1.8" }}>
                        <li><Link href="/projects#financial-telemetry-pipeline" style={{ color: "#2563eb" }}>Real-Time Financial Telemetry</Link></li>
                        <li><Link href="/projects#cloudflare-edge-ecommerce" style={{ color: "#2563eb" }}>Cloudflare Edge E-Commerce</Link></li>
                        <li><Link href="/projects#enterprise-ai-document-search" style={{ color: "#2563eb" }}>Enterprise AI Document Search</Link></li>
                        <li><Link href="/projects#postgres-performance-audit" style={{ color: "#2563eb" }}>PostgreSQL Performance Audit</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="widget" id="wdgt-lab-link">
                    <strong className="heading4 widget-title">
                      <a href="/lab">Interactive Systems Lab</a>
                    </strong>
                    <div className="description">
                      <p style={{ margin: "0 0 10px 0", fontSize: "12.5px", color: "#475569", lineHeight: "1.5" }}>
                        Empirical telemetry tools: Live edge latency radar and PostgreSQL query visualizer.
                      </p>
                      <Link
                        href="/lab"
                        style={{
                          display: "block",
                          textAlign: "center",
                          padding: "8px 12px",
                          backgroundColor: "#0b132b",
                          color: "#38bdf8",
                          border: "1px solid #1e293b",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "12px",
                          textDecoration: "none",
                        }}
                      >
                        ⚡ Launch Systems Lab &rsaquo;
                      </Link>
                    </div>
                  </div>

                  <div className="widget" id="wdgt-admin">
                    <div style={{ padding: "14px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}>
                      <strong style={{ color: "#0f172a" }}>Admin Portal</strong>
                      <p style={{ margin: "4px 0 8px 0", color: "#64748b" }}>
                        Edit or update case study parameters.
                      </p>
                      <Link
                        href="/admin"
                        style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "underline" }}
                      >
                        Open Admin Panel ›
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stpr"></div>
            </div>

            {/* Bottom Contact Stripe */}
            <div className="stripes detailedform" id="stripe-01">
              <div className="stripewrap">
                <div className="widget contactform" id="bottom-scf">
                  <div className="formdesc">
                    <span className="free-consultation">Technical Consultation</span>
                    <span className="phone-numbers">
                      abuhanifmain@gmail.com <br />
                      +880 1700-000000
                    </span>
                  </div>
                  <div style={{ padding: "0 0 10px 0" }}>
                    <p>
                      Discuss project scopes, architecture reviews, or performance SLAs with Abu Hanif.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Footer */}
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
