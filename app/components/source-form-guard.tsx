"use client";

import { useEffect } from "react";

export default function FormGuard({ route }: { route: string }) {
  useEffect(() => {
    const root = document.getElementById("source-page-root");
    if (!root) return;

    const forms = Array.from(root.querySelectorAll<HTMLFormElement>("form"));
    const handleSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      let status = form.querySelector<HTMLElement>(".source-form-status");

      if (!status) {
        status = document.createElement("p");
        status.className = "source-form-status";
        status.setAttribute("role", "status");
        form.append(status);
      }

      status.textContent =
        "This preview does not send messages or case details. Please contact the law office directly.";
    };

    forms.forEach((form) => form.addEventListener("submit", handleSubmit));
    return () => {
      forms.forEach((form) => form.removeEventListener("submit", handleSubmit));
    };
  }, [route]);

  return null;
}
