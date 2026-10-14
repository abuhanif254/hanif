"use client";

import { useEffect, useState } from "react";

type Consent = "all" | "necessary" | "custom";

export default function CookieBanner() {
  const [visible, setVisible] = useState(true);
  const [manageOpen, setManageOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    if (window.localStorage.getItem("rjf-cookie-consent")) setVisible(false);
  }, []);

  function choose(consent: Consent) {
    window.localStorage.setItem("rjf-cookie-consent", consent);
    setVisible(false);
    setManageOpen(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-banner" aria-label="Cookie preferences">
      <button
        className="cookie-close"
        aria-label="Close cookie notice"
        onClick={() => choose("necessary")}
        type="button"
      >
        ×
      </button>
      {manageOpen ? (
        <>
          <p><strong>Cookie preferences</strong></p>
          <p>Necessary cookies are always on. Choose whether to allow analytics and marketing cookies.</p>
          <label className="cookie-toggle">
            <input
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              type="checkbox"
            />
            Analytics and marketing cookies
          </label>
          <div className="cookie-actions">
            <button onClick={() => choose(analytics ? "custom" : "necessary")} type="button">
              Save Preferences
            </button>
            <button className="text-action" onClick={() => setManageOpen(false)} type="button">
              Back
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            We use cookies for site operations, enhanced functionality, analytics, and marketing purposes. You can review our{" "}
            <a href="/cookie-policy.html">Cookie Policy</a> for more details.
          </p>
          <div className="cookie-actions">
            <button onClick={() => choose("all")} type="button">Accept All</button>
            <button onClick={() => choose("necessary")} type="button">Necessary Cookies Only</button>
            <button className="text-action" onClick={() => setManageOpen(true)} type="button">Manage Cookies</button>
          </div>
        </>
      )}
    </aside>
  );
}
