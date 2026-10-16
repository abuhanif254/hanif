import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "../../lib/portfolio-store";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Case Study Not Found" };
  }

  return {
    title: `${project.title} | Abu Hanif (MD Abu Hanif Mia) Case Studies`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div id="source-page-root" data-source-path={`/projects/${project.slug}`}>
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
                          borderLeft: "5px solid #053056",
                          padding: "18px 22px",
                          borderRadius: "4px",
                          marginBottom: "24px",
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
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "#16a34a",
                              backgroundColor: "#ecfdf5",
                              padding: "4px 12px",
                              borderRadius: "3px",
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
                                  color: "#053056",
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
                                  color: "#053056",
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
                          <div>⚡ <strong>Verified Production SLA:</strong> <span style={{ color: "#053056", fontWeight: "bold" }}>{project.impactMetric}</span></div>
                          <div>🛠 <strong>Core Technologies:</strong> {(project.techStack || []).join(" • ")}</div>
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <h2 style={{ color: "#053056", fontSize: "20px", marginTop: "10px" }}>Executive Architecture Summary</h2>
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
                        {project.descriptionMarkdown.split("\n\n").map((para, i) => {
                          if (para.startsWith("## ")) {
                            return (
                              <h3
                                key={i}
                                style={{
                                  color: "#053056",
                                  fontSize: "18px",
                                  marginTop: "24px",
                                  marginBottom: "8px",
                                  borderBottom: "1px solid #e2e8f0",
                                  paddingBottom: "4px",
                                }}
                              >
                                {para.replace("## ", "")}
                              </h3>
                            );
                          }
                          if (para.startsWith("- ")) {
                            const items = para.split("\n").map((item) => item.replace("- ", ""));
                            return (
                              <ul key={i} style={{ margin: "10px 0 16px 20px", paddingLeft: "10px" }}>
                                {items.map((item, idx) => (
                                  <li key={idx} style={{ marginBottom: "6px" }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p key={i} style={{ margin: "0 0 14px 0" }}>
                              {para}
                            </p>
                          );
                        })}
                      </div>

                      {/* Technology Stack Pills */}
                      <div style={{ marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", color: "#053056" }}>
                          Technologies Deployed:
                        </h4>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {(project.techStack || []).map((tech) => (
                            <span
                              key={tech}
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                backgroundColor: "#f1f5f9",
                                border: "1px solid #cbd5e1",
                                color: "#053056",
                                padding: "4px 10px",
                                borderRadius: "3px",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Back Button & Scoping CTA */}
                      <div
                        style={{
                          marginTop: "32px",
                          padding: "20px 24px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "16px", color: "#053056", display: "block" }}>
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
                              padding: "8px 14px",
                              border: "1px solid #cbd5e1",
                              backgroundColor: "#ffffff",
                              color: "#053056",
                              fontWeight: "bold",
                              borderRadius: "3px",
                              textDecoration: "none",
                            }}
                          >
                            ‹ All Projects
                          </Link>
                          <a
                            href="/#contactform"
                            style={{
                              fontSize: "13px",
                              padding: "8px 16px",
                              backgroundColor: "#053056",
                              color: "#ffffff",
                              fontWeight: "bold",
                              borderRadius: "3px",
                              textDecoration: "none",
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
                      <a href="/#contactform">Direct Scoping Inquiry</a>
                    </strong>
                    <div className="description">
                      <p>
                        Engage Abu Hanif for specialized systems architecture, distributed backends, or Cloudflare Pages deployments.
                      </p>
                      <div style={{ padding: "10px 0" }}>
                        <a
                          className="btn"
                          href="/#contactform"
                          style={{
                            display: "block",
                            textAlign: "center",
                            padding: "10px",
                            backgroundColor: "#053056",
                            color: "#ffffff",
                            fontWeight: "bold",
                            textDecoration: "none",
                            borderRadius: "3px",
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
                        <li><Link href="/projects#financial-telemetry-pipeline">Real-Time Financial Telemetry</Link></li>
                        <li><Link href="/projects#cloudflare-edge-ecommerce">Cloudflare Edge E-Commerce</Link></li>
                        <li><Link href="/projects#enterprise-ai-document-search">Enterprise AI Document Search</Link></li>
                        <li><Link href="/projects#postgres-performance-audit">PostgreSQL Performance Audit</Link></li>
                      </ul>
                    </div>
                  </div>

                  <div className="widget" id="wdgt-admin">
                    <div style={{ padding: "12px", backgroundColor: "#f1f5f9", borderRadius: "3px", border: "1px solid #cbd5e1", fontSize: "12px" }}>
                      <strong>Admin Portal</strong>
                      <p style={{ margin: "4px 0 8px 0", color: "#64748b" }}>
                        Edit or update case study parameters.
                      </p>
                      <Link
                        href="/admin"
                        style={{ color: "#053056", fontWeight: "bold", textDecoration: "underline" }}
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
                      contact@abuhanif.dev <br />
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
