"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface SiteHeaderProps {
  activePath?: string;
}

export default function SiteHeader({ activePath = "/" }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const lastScrollY = useRef(0);
  const isMenuOpenRef = useRef(mobileMenuOpen);
  isMenuOpenRef.current = mobileMenuOpen;

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

          // 1. Calculate reading scroll percentage (0% to 100%)
          if (maxScroll > 0) {
            const pct = Math.min(
              100,
              Math.max(0, (currentScrollY / maxScroll) * 100)
            );
            setScrollProgress(pct);
          }

          // 2. Add elevation drop shadow when scrolled past top
          setIsScrolled(currentScrollY > 15);

          // 3. Always keep visible when near the top (<= 75px)
          if (currentScrollY <= 75) {
            setIsVisible(true);
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          // 4. Guard against rubber-banding / bounce overscroll at bottom
          if (
            currentScrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 15
          ) {
            ticking = false;
            return;
          }

          // 5. Keep header visible while mobile drawer menu is open
          if (isMenuOpenRef.current) {
            setIsVisible(true);
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          const delta = currentScrollY - lastScrollY.current;

          // 6. Thresholds: scroll down > 8px -> hide; scroll up < -6px -> reveal
          if (delta > 8) {
            setIsVisible(false);
          } else if (delta < -6) {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }

    // Command palette opened listener to keep header revealed
    function onOpenPalette() {
      setIsVisible(true);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("open-command-palette", onOpenPalette);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("open-command-palette", onOpenPalette);
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "/", id: "fc", key: "/" },
    { label: "About Abu Hanif", href: "/#about", key: "/#about" },
    { label: "Engineering Focus", href: "/#competencies", key: "/#competencies" },
    { label: "Work Showcase", href: "/projects", key: "/projects" },
    { label: "Work Prices", href: "/pricing", key: "/pricing" },
    { label: "Systems Lab", href: "/lab", key: "/lab" },
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
    <header
      id="site-master-header"
      className={`site-master-header ${
        isVisible ? "header-visible" : "header-hidden"
      } ${isScrolled ? "header-scrolled" : ""}`}
      onFocusCapture={() => setIsVisible(true)}
      role="banner"
    >
      {/* Interactive 2.5px Reading Scroll Progress Bar */}
      <div className="site-header-progress-track" aria-hidden="true">
        <div
          className="site-header-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Top Numbers & Action Bar */}
      <div className="top-numbers-v3 tnv3-sticky" id="top-numbers-v3">
        <ul>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span>
              Available for High-Impact Contracts &amp; Consulting:{" "}
              <strong>contact@abuhanif.dev</strong>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-command-palette"));
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#042442",
                  color: "#e2e8f0",
                  border: "1px solid #0e4475",
                  padding: "4px 10px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                title="Press Ctrl+K or Cmd+K to open global search palette"
              >
                <span>🔍 Quick Search</span>
                <kbd
                  style={{
                    fontSize: "10px",
                    backgroundColor: "#021627",
                    padding: "1px 5px",
                    borderRadius: "2px",
                    border: "1px solid #0e4475",
                    color: "#9CBE41",
                  }}
                >
                  Ctrl+K
                </kbd>
              </button>
              <Link className="tnv3-button" href="/pricing#inquiry">
                Request Project Quote
              </Link>
            </div>
          </li>
        </ul>
      </div>

      {/* Header Container */}
      <div id="header">
        <div className="wrapper">
          <div id="head">
            <div id="logo">
              <Link
                data-title="Abu Hanif - Staff Software Engineer"
                href="/"
                title="Back to Home"
              >
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

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={
                mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
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
                      background: selected
                        ? "rgba(156, 190, 65, 0.15)"
                        : "transparent",
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
    </header>
  );
}
