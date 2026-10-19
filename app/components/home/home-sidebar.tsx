"use client";

import { useState } from "react";
import Link from "next/link";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function HomeSidebar() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Full-Stack Web App",
    budget: "$5,000 - $15,000",
    message: "",
    disclaimer: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const record = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      project_type: formData.projectType,
      budget_range: formData.budget,
      message: formData.message,
      status: "new",
      created_at: new Date().toISOString(),
    };

    try {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("abuhanif-inquiries");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({ ...record, id: `local-${Date.now()}` });
        window.localStorage.setItem("abuhanif-inquiries", JSON.stringify(list));
      }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("inquiries").insert([record]);
        if (error) {
          console.warn("Supabase insert error:", error);
        }
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMessage("Something went wrong. Please email directly at abuhanifmain@gmail.com.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="sidebar secondary-sidebar">
      {/* Production Track Record */}
      <div className="widget" id="articles-thumbs">
        <div className="description" style={{ textAlign: "center", padding: "6px 0" }}>
          <div style={{ background: "#053056", color: "#ffffff", padding: "14px", borderRadius: "3px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "#9CBE41",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Production Track Record
            </div>
            <div style={{ fontSize: "22px", fontWeight: "bold", margin: "4px 0" }}>99.99% UPTIME</div>
            <div style={{ fontSize: "12px", color: "#d9d9d9" }}>50+ Shipped Deployments</div>
          </div>
        </div>
      </div>

      {/* Contact Form Widget */}
      <div className="widget contactform" id="contactform">
        <strong className="heading4 widget-title">
          <a href="#contactform">Project Inquiry</a>
        </strong>

        {submitted ? (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "4px",
              color: "#166534",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>
              ✓ Consultation Request Received
            </strong>
            Thank you! Abu Hanif will review your project requirements and respond within 24 hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} id="genericcontactform" name="genericcontactform">
            <div className="formdesc">
              <span className="free-consultation">Free Consultation</span>
              <span className="phone-numbers">
                abuhanifmain@gmail.com <br />
                +880 1700-000000
              </span>
            </div>
            <div className="col-1">
              <span className="fld">
                <label htmlFor="Name">Name (Required)</label>
                <input
                  autoComplete="name"
                  id="Name"
                  name="10_Name"
                  placeholder="Name (Required)"
                  required
                  size={40}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </span>
              <span className="fld">
                <label htmlFor="Email">Email (Required)</label>
                <input
                  autoComplete="email"
                  id="Email"
                  name="20_Email"
                  placeholder="Work Email (Required)"
                  required
                  size={40}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </span>
              <span className="fld">
                <label htmlFor="Phone">Phone (Optional)</label>
                <input
                  autoComplete="tel"
                  id="Phone"
                  name="30_Phone"
                  placeholder="Phone (Optional)"
                  size={40}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </span>
            </div>
            <span className="option">
              <label htmlFor="CaseType">Scope / Project Type:</label>
              <select
                id="CaseType"
                name="40_Type_of_Case"
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              >
                <option value="Full-Stack Web App">Full-Stack Web App (Next.js/React)</option>
                <option value="Cloud & Edge Architecture">Cloud &amp; Edge Architecture</option>
                <option value="Database Optimization">Database Optimization &amp; Indexing</option>
                <option value="Architecture & Code Audit">Architecture &amp; Code Audit</option>
                <option value="Fractional Tech Lead">Fractional Tech Lead Retainer</option>
                <option value="AI / LLM Integration">AI / LLM Agent Integration</option>
                <option value="Other Project">Other Technical Scope</option>
              </select>
            </span>
            <span className="fld">
              <label htmlFor="malpracticeinput">Budget Range</label>
              <select
                id="malpracticeinput"
                name="50_Budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                style={{
                  width: "100%",
                  height: "2.5em",
                  marginBottom: "0.5em",
                  padding: "0 10px",
                  borderRadius: "3px",
                }}
              >
                <option value="$2,500 - $5,000">$2,500 – $5,000 (Small Scope / Audit)</option>
                <option value="$5,000 - $15,000">$5,000 – $15,000 (MVP / Feature Sprint)</option>
                <option value="$15,000 - $30,000">$15,000 – $30,000 (Full-Stack Platform)</option>
                <option value="$30,000+">$30,000+ (Enterprise / Retainer)</option>
              </select>
            </span>
            <span className="textarea">
              <label htmlFor="Message">Project Details</label>
              <textarea
                cols={20}
                id="Message"
                name="60_Message"
                placeholder="Brief overview of challenges, existing stack, timeline..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </span>
            <span className="disc">
              <input
                className="checkb"
                id="scf_Disclaimer"
                name="70_Disclaimer"
                required
                type="checkbox"
                checked={formData.disclaimer}
                onChange={(e) => setFormData({ ...formData, disclaimer: e.target.checked })}
              />
              <label htmlFor="scf_Disclaimer">
                <span>I consent to be contacted regarding this project. (Required)</span>
              </label>
              <p>Direct confidentiality: All shared requirements and architecture specifications remain strictly confidential.</p>
            </span>
            {errorMessage && (
              <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errorMessage}</p>
            )}
            <div className="clr"></div>
            <span className="submit">
              <button name="submitbtn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </span>
          </form>
        )}
      </div>

      {/* Evaluation / Estimate CTA Button */}
      <div className="widget amp-include" id="wdgt-evaluation-button">
        <div className="description">
          <center>
            <Link className="btn" href="/pricing#inquiry">
              Click Here for <br /> Free Project Consultation
            </Link>
          </center>
        </div>
      </div>

      {/* Competencies Widget */}
      <div className="widget" id="pr_ar">
        <strong className="heading4 widget-title">
          <Link href="#work">Core Competencies</Link>
        </strong>
        <div className="fragcontent">
          <ul className="toplevel">
            <li className="li2 practiceareasub_11">
              <strong>
                <Link href="#work">Systems &amp; Architecture</Link>
              </strong>
              <ul>
                <li className="li1"><Link href="/projects?category=systems">Distributed Systems</Link></li>
                <li className="li2"><Link href="/projects?category=systems">High-Throughput APIs</Link></li>
                <li className="li3"><Link href="/lab">PostgreSQL Optimization</Link></li>
                <li className="li4"><Link href="/lab">Cloudflare Edge Architecture</Link></li>
                <li className="li5"><Link href="/pricing">Zero-Trust Authentication</Link></li>
                <li className="li6"><Link href="/blog/swapping-microservices-for-modular-monolith">Microservices Decomposition</Link></li>
              </ul>
            </li>
            <li className="li3 practiceareasub_21">
              <strong>
                <Link href="#work">Frontend &amp; Platform</Link>
              </strong>
              <ul>
                <li className="li1"><Link href="/blog/nextjs-16-cloudflare-pages-architecture">Next.js 16 App Router</Link></li>
                <li className="li2"><Link href="/projects?category=web">React 19 &amp; Server Components</Link></li>
                <li className="li3"><Link href="/resume">TypeScript Architecture</Link></li>
                <li className="li4"><Link href="/projects?category=ai">AI &amp; LLM RAG Pipelines</Link></li>
                <li className="li5"><Link href="/pricing">CI/CD &amp; Infrastructure as Code</Link></li>
                <li className="li6"><Link href="/pricing">System Performance Audits</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Client Feedback Widget */}
      <div className="widget amp-include" id="wdgt-feedback">
        <strong className="heading4 widget-title">
          <a href="#feedback">Client Feedback</a>
        </strong>
        <div className="description">
          <p>
            &quot;Abu Hanif transformed our core API architecture in just three weeks. Our P99 latency dropped by 75% and our infrastructure bill was cut in half. Clear technical communication, pristine documentation, and zero fluff. If you need a top-tier software architect, I wholeheartedly recommend Abu Hanif!&quot;
            <br /><br />
            <em>- D. Vance</em> <br />VP of Engineering, Apex Telemetry Labs
          </p>
          <p>
            &quot;Working with Abu Hanif felt like having a Principal Architect and a full delivery team rolled into one. He took our complex distributed specifications and delivered our Next.js edge platform ahead of schedule with 99.99% uptime. You could not ask for a better engineering partner.&quot;
            <br /><br />
            <em>- E. Rostova</em> <br />Founder &amp; CEO, Synthetix Cloud
          </p>
        </div>
      </div>
    </div>
  );
}
