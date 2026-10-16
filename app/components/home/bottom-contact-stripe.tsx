"use client";

import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function BottomContactStripe() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Full-Stack Web App",
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
      setErrorMessage("Something went wrong. Please email directly at contact@abuhanif.dev.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="stripes">
      <div className="stripe stripe-01" id="stripe-01">
        <div className="stripewrap">
          <div className="widget contactform" id="bottom-scf">
            {submitted ? (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#053056",
                  color: "#9CBE41",
                  border: "2px solid #9CBE41",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontSize: "15px",
                }}
              >
                <strong>✓ Consultation Request Received</strong>
                <p style={{ margin: "6px 0 0 0", color: "#e2e8f0", fontSize: "13px" }}>
                  Thank you! Abu Hanif will review your project requirements and respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form_designer" id="genericcontactform_bottom-scf" name="genericcontactform_bottom-scf">
                <strong className="heading4 widget-title">
                  <a href="#contactform">
                    Contact Abu Hanif <span>Free Technical Consultation</span>
                  </a>
                </strong>
                <div className="cfyaw">
                  <span className="fld">
                    <label htmlFor="20_Name_Required">Name (Required)</label>
                    <input
                      id="20_Name_Required"
                      name="20_Name_Required"
                      placeholder="Name (Required)"
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </span>
                  <span className="fld">
                    <label htmlFor="30_Email_Required">Work Email (Required)</label>
                    <input
                      id="30_Email_Required"
                      name="30_Email_Required"
                      placeholder="Email (Required)"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </span>
                  <span className="fld">
                    <label htmlFor="40_Phone_Required">Phone (Optional)</label>
                    <input
                      id="40_Phone_Required"
                      name="40_Phone_Required"
                      placeholder="Phone (Optional)"
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </span>
                  <span className="option">
                    <label htmlFor="bcf_CaseType">Project Scope:</label>
                    <select
                      id="bcf_CaseType"
                      name="40_Type_of_Case"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    >
                      <option value="Full-Stack Web App">Full-Stack Web App (Next.js/React)</option>
                      <option value="Cloud Architecture">Cloud &amp; Edge Architecture</option>
                      <option value="Database Optimization">Database Optimization &amp; Indexing</option>
                      <option value="Architecture Audit">Architecture &amp; Codebase Audit</option>
                      <option value="Fractional Tech Lead">Fractional Tech Lead Retainer</option>
                    </select>
                  </span>
                  <span className="fld">
                    <label htmlFor="70_Message">Project Scope Description</label>
                    <textarea
                      cols={20}
                      id="70_Message"
                      name="70_Message"
                      placeholder="Brief description of the challenge or project requirements..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </span>
                  <span className="disc">
                    <input
                      className="checkb"
                      id="bcf_Disclaimer"
                      name="60_Disclaimer"
                      required
                      type="checkbox"
                      checked={formData.disclaimer}
                      onChange={(e) => setFormData({ ...formData, disclaimer: e.target.checked })}
                    />
                    <label htmlFor="bcf_Disclaimer">
                      <span>I consent to be contacted regarding this technical project. (Required)</span>
                    </label>
                  </span>
                </div>
                {errorMessage && (
                  <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>{errorMessage}</p>
                )}
                <span className="submit">
                  <button name="submitbtn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Consultation Request"}
                  </button>
                </span>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
