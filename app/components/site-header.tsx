"use client";

import { useState } from "react";
import Link from "next/link";

interface SiteHeaderProps {
  activePath?: string;
}

export default function SiteHeader({ activePath = "/" }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", id: "fc", key: "/" },
    { label: "About Abu Hanif", href: "/#about", key: "/#about" },
    { label: "Engineering Focus", href: "/#competencies", key: "/#competencies" },
    { label: "Work Showcase", href: "/projects", key: "/projects" },
    { label: "Work Prices", href: "/pricing", key: "/pricing" },
    { label: "Technical Blog", href: "/blog", key: "/blog" },
    { label: "Resume / CV", href: "/resume", key: "/resume" },
    { label: "Admin Panel", href: "/admin", key: "/admin" },
    { label: "Contact", href: "/pricing#inquiry", id: "lc", key: "/contact" },
  ];

  function isSelected(key: string) {
    if (key === "/" && activePath === "/") return true;
    if (key !== "/" && activePath.startsWith(key)) return true;
    return false;
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="top-numbers-v3 tnv3-sticky" id="top-numbers-v3">
        <ul>
          <li>
            Available for High-Impact Contracts &amp; Consulting:{" "}
            <strong>contact@abuhanif.dev</strong>
            <Link className="tnv3-button" href="/pricing#inquiry">
              Request Project Quote
            </Link>
          </li>
        </ul>
      </div>

      {/* Header Container */}
      <div id="header">
        <div className="wrapper">
          <div id="head">
            <div id="logo">
              <Link data-title="Abu Hanif - Staff Software Engineer" href="/" title="Back to Home">
                <img
                  alt="Abu Hanif - Staff Software Engineer"
                  id="mainlogo"
                  src="/images/abuhanif-logo-v3.svg"
                />
                Abu Hanif Staff Software Engineer Home
              </Link>
            </div>
            <div id="tagline">
              <Link href="/pricing#inquiry" title="Discuss an Engineering Project">
                Discuss an Engineering Project with Abu Hanif
              </Link>
            </div>

            {/* Mobile Hamburger Button (visible on mobile only) */}
            <button
              type="button"
              className="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              style={{
                display: "none",
                position: "absolute",
                right: "12px",
                top: "16px",
                background: "#083155",
                color: "#ffffff",
                border: "1px solid #1e293b",
                borderRadius: "4px",
                padding: "8px 12px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                zIndex: 100,
              }}
            >
              {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div id="topnav">
            <ul id="tnav-toplevel">
              {navLinks.map((link) => {
                const selected = isSelected(link.key);
                return (
                  <li
                    key={link.label}
                    id={link.id}
                    className={`${selected ? "selected " : ""}priority_3`}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile Drawer Navigation (when open) */}
          {mobileMenuOpen && (
            <div
              className="mobile-nav-drawer"
              style={{
                background: "#05223c",
                borderTop: "2px solid #9CBE41",
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {navLinks.map((link) => {
                const selected = isSelected(link.key);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      color: selected ? "#9CBE41" : "#ffffff",
                      fontWeight: selected ? "bold" : "normal",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      background: selected ? "rgba(156, 190, 65, 0.15)" : "transparent",
                      textDecoration: "none",
                      fontSize: "15px",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div id="ed"></div>
        <div className="clr"></div>
      </div>
    </>
  );
}
