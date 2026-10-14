import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPosts } from "../../lib/portfolio-store";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${post.title} | Abu Hanif (MD Abu Hanif Mia) Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div id="source-page-root" data-source-path={`/blog/${post.slug}`}>
      <div id="source-page-body" className="source-page-body js l2 section_83 justia-robertjfleming-com">
        {/* Sticky Top Bar */}
        <div className="top-numbers-v3 tnv3-sticky" id="top-numbers-v3">
          <ul>
            <li>
              Available for High-Impact Contracts &amp; Consulting: <strong> contact@abuhanif.dev </strong>
              <a className="tnv3-button" href="/#contactform">Request Project Quote</a>
            </li>
          </ul>
        </div>

        <div className="index" id="container">
          <div className="cwrap">
            {/* Header */}
            <div id="header">
              <div className="wrapper">
                <div id="head">
                  <div id="logo">
                    <a data-title="Abu Hanif - Staff Software Engineer" href="/" title="Back to Home">
                      <img alt="Abu Hanif - Staff Software Engineer" id="mainlogo" src="/images/abuhanif-logo-v3.svg" />
                      Abu Hanif Staff Software Engineer Home
                    </a>
                  </div>
                  <div id="tagline">
                    <a href="/#contactform" title="Discuss an Engineering Project">
                      Discuss an Engineering Project with Abu Hanif
                    </a>
                  </div>
                </div>
                <div id="topnav">
                  <ul id="tnav-toplevel">
                    <li className="priority_1" id="fc"><a href="/">Home</a></li>
                    <li className="priority_3"><a href="/#about">About Alex</a></li>
                    <li className="priority_4"><a href="/#competencies">Engineering Focus</a></li>
                    <li className="priority_2"><a href="/#work">Work Showcase</a></li>
                    <li className="priority_4"><a href="/#pricing">Work Prices</a></li>
                    <li className="selected priority_5"><a href="/blog">Technical Blog</a></li>
                    <li className="priority_6"><a href="/#feedback">Client Feedback</a></li>
                    <li className="category_141"><a href="/admin">Admin Panel</a></li>
                    <li className="contactus priority_1" id="lc"><a href="/#contactform">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div id="ed"></div>
              <div className="clr"></div>
            </div>

            {/* Main Content */}
            <div id="main">
              <div className="mwrap">
                <div className="imgwrap">
                  <div id="img1">
                    <div className="banner-text-wrapper">
                      <div>
                        <h1 style={{ margin: 0, fontSize: "28px", lineHeight: "1.3" }}>
                          {post.title}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="content">
                  <div id="breadcrumbs">
                    <div className="wrapper">
                      <a href="/">Home</a> &gt; <a href="/blog">Technical Blog</a> &gt; <span>{post.title}</span>
                    </div>
                  </div>

                  <div className="bodytext">
                    <div className="description">
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px", fontSize: "13px", color: "#64748b" }}>
                        <strong>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </strong>
                        <span>•</span>
                        <span style={{ color: "#16a34a", fontWeight: "bold" }}>⏱ {post.readingTimeMinutes} min read</span>
                        <span>•</span>
                        <span>By MD Abu Hanif Mia</span>
                      </div>

                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: "11px",
                              fontWeight: "bold",
                              backgroundColor: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              padding: "2px 8px",
                              borderRadius: "3px",
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Content Body */}
                      <div
                        style={{
                          fontSize: "15px",
                          lineHeight: "1.8",
                          color: "#272727",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {post.contentMarkdown}
                      </div>

                      <div
                        style={{
                          marginTop: "35px",
                          padding: "20px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderLeft: "4px solid #053056",
                          borderRadius: "4px",
                        }}
                      >
                        <h3 style={{ margin: "0 0 8px 0", color: "#053056" }}>
                          Need an architectural review or custom full-stack execution?
                        </h3>
                        <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#475569" }}>
                          I help startups and engineering teams solve performance bottlenecks, scale databases, and launch Next.js platforms.
                        </p>
                        <a className="btn" href="/#contactform" style={{ display: "inline-block", padding: "8px 18px", fontSize: "13px" }}>
                          Request Technical Consultation
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subpage Sidebar */}
                <div className="sidebar secondary-sidebar">
                  <div className="widget" id="articles-thumbs">
                    <div className="description" style={{ textAlign: "center", padding: "10px 0" }}>
                      <div style={{ background: "#053056", color: "#ffffff", padding: "14px", borderRadius: "3px" }}>
                        <div style={{ fontSize: "11px", fontWeight: "bold", color: "#9CBE41", textTransform: "uppercase" }}>Production Track Record</div>
                        <div style={{ fontSize: "22px", fontWeight: "bold", margin: "4px 0" }}>99.99% UPTIME</div>
                        <div style={{ fontSize: "12px", color: "#d9d9d9" }}>50+ Shipped Deployments</div>
                      </div>
                    </div>
                  </div>

                  <div className="widget contactform" id="contactform">
                    <strong className="heading4 widget-title"><a href="/#contactform">Project Inquiry</a></strong>
                    <div className="formdesc">
                      <span className="free-consultation">Free Consultation</span>
                      <span className="phone-numbers">
                        contact@abuhanif.dev <br/>
                        +880 1700-000000
                      </span>
                    </div>
                    <div style={{ padding: "0 0 10px 0" }}>
                      <a className="btn" href="/#contactform" style={{ fontSize: "13px" }}>
                        Submit Project Inquiry
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stpr"></div>
            </div>

            {/* Footer */}
            <div id="footer">
              <div className="fcontainer">
                <div id="address">
                  <div className="slocation location_86">
                    <div><strong>MD Abu Hanif Mia (Abu Hanif)</strong></div>
                    <div>Staff Software Engineer &amp; Systems Architect</div>
                    <div itemProp="streetAddress">Dhaka, Bangladesh / Remote Worldwide</div>
                    <span className="contacts">
                      <span>Email: <a href="mailto:contact@abuhanif.dev">contact@abuhanif.dev</a></span>
                      <span>Phone: +880 1700-000000</span>
                    </span>
                  </div>
                </div>
                <div id="footernav">
                  <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/#work">Work Showcase</a></li>
                    <li><a href="/#pricing">Services &amp; Pricing</a></li>
                    <li><a href="/blog">Technical Blog</a></li>
                    <li><a href="/admin" style={{ fontWeight: "bold", color: "#053056" }}>Admin Panel</a></li>
                    <li><a href="/#contactform">Contact</a></li>
                  </ul>
                </div>
                <div className="copyright">
                  <p>Copyright © 2026 MD Abu Hanif Mia. All rights reserved. Deployed to Cloudflare Pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
