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

    // Mobile dock menu toggle listener
    function onToggleMobileMenu() {
      setMobileMenuOpen((prev) => !prev);
      setIsVisible(true);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("open-command-palette", onOpenPalette);
    window.addEventListener("toggle-mobile-menu", onToggleMobileMenu);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("open-command-palette", onOpenPalette);
      window.removeEventListener("toggle-mobile-menu", onToggleMobileMenu);
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "/", id: "fc", key: "/" },
    { label: "About", href: "/#about", key: "/#about" },
    { label: "Engineering Focus", href: "/#competencies", key: "/#competencies" },
    { label: "Services", href: "/services", key: "/services" },
    { label: "Work Showcase", href: "/projects", key: "/projects" },
    { label: "Pricing & SOW", href: "/pricing", key: "/pricing" },
    { label: "Systems Lab", href: "/lab", key: "/lab" },
    { label: "Technical Blog", href: "/blog", key: "/blog" },
    { label: "Resume / CV", href: "/resume", key: "/resume" },
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
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "inline-block",
                  boxShadow: "0 0 10px #10b981",
                  flexShrink: 0,
                }}
              />
              <span>
                Available for Q4 Contracts • 2 Dedicated Slots •{" "}
                <Link
                  href="/status"
                  style={{
                    color: "#38bdf8",
                    fontWeight: "600",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                  title="View Real-Time Edge Health & Latency Dashboard"
                >
                  99.99% Production SLA ↗
                </Link>
                {" "}• Direct:{" "}
                <strong style={{ color: "#ffffff" }}>abuhanifmain@gmail.com</strong>
              </span>
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
                  background: "#0b132b",
                  color: "#e2e8f0",
                  border: "1px solid #1e293b",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "border-color 0.15s ease",
                }}
                title="Press Ctrl+K or Cmd+K to open global search palette"
              >
                <span>🔍 Quick Search</span>
                <kbd
                  style={{
                    fontSize: "10px",
                    backgroundColor: "#050e1d",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: "1px solid #1e293b",
                    color: "#38bdf8",
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
                  width={326}
                  height={79}
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
                background: "#0b132b",
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

          {/* Mobile Drawer Navigation (Native App Style) */}
          {mobileMenuOpen && (
            <div
              className="mobile-nav-drawer"
              style={{
                background: "#070f1e",
                borderTop: "2px solid #2563eb",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxHeight: "82vh",
                overflowY: "auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              {/* Profile Card in Drawer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #1e293b",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #2563eb",
                    flexShrink: 0,
                    background: "#0b132b",
                  }}
                >
                  <img
                    src="/images/profile.png"
                    alt="Abu Hanif"
                    width={40}
                    height={40}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "#10b981",
                      color: "#050e1d",
                      fontSize: "8px",
                      fontWeight: 900,
                      padding: "1px 3px",
                      borderRadius: "50%",
                    }}
                  >
                    ✓
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "14px", color: "#ffffff", lineHeight: 1.2 }}>
                    MD Abu Hanif Mia
                  </strong>
                  <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 700 }}>
                    Staff Software Engineer
                  </span>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                    Programming Hero Batch-12 • WEB12-3991
                  </span>
                </div>
              </div>

              {/* Navigation Links Grid with 48px touch targets */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {navLinks.map((link) => {
                  const selected = isSelected(link.key);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: selected ? "#38bdf8" : "#ffffff",
                        fontWeight: selected ? "800" : "600",
                        padding: "12px 14px",
                        borderRadius: "6px",
                        background: selected
                          ? "rgba(56, 189, 248, 0.12)"
                          : "rgba(255, 255, 255, 0.03)",
                        border: selected ? "1px solid #0284c7" : "1px solid transparent",
                        textDecoration: "none",
                        fontSize: "14px",
                        minHeight: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{link.label}</span>
                      <span style={{ color: selected ? "#38bdf8" : "#64748b", fontSize: "12px" }}>
                        &rsaquo;
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Quick Actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  paddingTop: "12px",
                  borderTop: "1px solid #1e293b",
                }}
              >
                <Link
                  href="/pricing#inquiry"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "13px",
                    borderRadius: "4px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Request Project Consultation &rsaquo;
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-command-palette"));
                    }
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    background: "#072b4c",
                    color: "#e2e8f0",
                    border: "1px solid #0e4475",
                    fontWeight: 700,
                    fontSize: "12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  🔍 Open Quick Search Palette (Ctrl+K)
                </button>
              </div>
            </div>
          )}
        </div>
        <div id="ed"></div>
        <div className="clr"></div>
      </div>
    </header>
  );
}
