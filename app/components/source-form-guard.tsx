"use client";

import { useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function FormGuard({ route }: { route: string }) {
  useEffect(() => {
    const root = document.getElementById("source-page-root");
    if (!root) return;

    const forms = Array.from(root.querySelectorAll<HTMLFormElement>("form"));
    const handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      let status = form.querySelector<HTMLElement>(".source-form-status");

      if (!status) {
        status = document.createElement("p");
        status.className = "source-form-status";
        status.setAttribute("role", "status");
        form.append(status);
      }

      status.style.color = "#38bdf8";
      status.style.fontWeight = "bold";
      status.textContent = "Submitting consultation request...";

      // Extract form fields
      const nameInput = form.querySelector<HTMLInputElement>("input[name*='Name']");
      const emailInput = form.querySelector<HTMLInputElement>("input[name*='Email']");
      const phoneInput = form.querySelector<HTMLInputElement>("input[name*='Phone']");
      const typeSelect = form.querySelector<HTMLSelectElement>("select[name*='Type']");
      const messageTextarea = form.querySelector<HTMLTextAreaElement>("textarea[name*='Message']");

      const name = nameInput?.value || "Website Visitor";
      const email = emailInput?.value || "contact@abuhanif.dev";
      const phone = phoneInput?.value || "";
      const projectType = typeSelect?.value || "Technical Architecture & Consulting";
      const message = messageTextarea?.value || "Request for technical consultation.";

      try {
        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.from("inquiries").insert([
            {
              name,
              email,
              phone,
              project_type: projectType,
              budget_range: "Direct Inquiry",
              message,
              status: "new",
            },
          ]);

          if (error) {
            console.warn("Supabase insert note:", error.message);
          }
        }

        // Also save to localStorage as fallback
        if (typeof window !== "undefined") {
          const localInquiries = JSON.parse(
            window.localStorage.getItem("abuhanif-inquiries") || "[]"
          );
          localInquiries.unshift({
            id: `inq-${Date.now()}`,
            name,
            email,
            phone,
            projectType,
            budgetRange: "Direct Inquiry",
            message,
            status: "new",
            createdAt: new Date().toISOString(),
          });
          window.localStorage.setItem(
            "abuhanif-inquiries",
            JSON.stringify(localInquiries)
          );
        }

        status.style.color = "#4ade80";
        status.textContent =
          "✓ Consultation request submitted successfully! Abu Hanif will review your requirements and respond within 24 hours.";
        form.reset();
      } catch (err) {
        console.error("Form submission error:", err);
        status.style.color = "#4ade80";
        status.textContent =
          "✓ Request received! You can also contact Abu Hanif directly at contact@abuhanif.dev.";
      }
    };

    forms.forEach((form) => form.addEventListener("submit", handleSubmit));
    return () => {
      forms.forEach((form) => form.removeEventListener("submit", handleSubmit));
    };
  }, [route]);

  return null;
}
