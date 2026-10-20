"use client";

import React, { useState, useEffect } from "react";

export default function DhakaTimeBadge() {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    function updateDhakaTime() {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setTimeString(formatted);
      } catch {
        setTimeString("UTC+6");
      }
    }

    updateDhakaTime();
    const interval = setInterval(updateDhakaTime, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="global-footer-timezone-pill" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <span className="uptime-dot" style={{ color: "#4ade80" }}>●</span>
      <span>
        Dhaka (UTC+6): <strong>{timeString || "Active"}</strong> • Available for US (UTC-8) &amp; Europe (UTC+2) Collaboration
      </span>
    </div>
  );
}
