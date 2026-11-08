"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Zap,
  CircleDollarSign,
  Search,
  Menu,
  X,
} from "lucide-react";

export default function MobileBottomDock() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close drawer whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Synchronize menu state with site header drawer
  useEffect(() => {
    function handleToggleMenu() {
      setIsMenuOpen((prev) => !prev);
    }
    function handleCloseMenu() {
      setIsMenuOpen(false);
    }

    window.addEventListener("toggle-mobile-menu", handleToggleMenu);
    window.addEventListener("close-mobile-menu", handleCloseMenu);

    return () => {
      window.removeEventListener("toggle-mobile-menu", handleToggleMenu);
      window.removeEventListener("close-mobile-menu", handleCloseMenu);
    };
  }, []);

  function triggerHaptic() {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // Haptic not allowed or unsupported
      }
    }
  }

  function isActive(path: string) {
    if (isMenuOpen) return false;
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  }

  function handleOpenMenu(e: React.MouseEvent) {
    e.preventDefault();
    triggerHaptic();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
    }
  }

  function handleOpenSearch(e: React.MouseEvent) {
    e.preventDefault();
    triggerHaptic();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  }

  return (
    <nav
      className="mobile-bottom-dock"
      aria-label="Mobile Application Navigation"
      role="navigation"
    >
      {/* 1. Home Route */}
      <Link
        href="/"
        onClick={triggerHaptic}
        className={`dock-item ${isActive("/") ? "active" : ""}`}
        title="Home Feed"
      >
        <span className="dock-icon-wrapper">
          <Home
            size={20}
            strokeWidth={isActive("/") ? 2.5 : 1.9}
            className="dock-svg-icon"
          />
        </span>
        <span className="dock-label">Home</span>
      </Link>

      {/* 2. Projects Showcase Route */}
      <Link
        href="/projects"
        onClick={triggerHaptic}
        className={`dock-item ${isActive("/projects") ? "active" : ""}`}
        title="Engineering Projects"
      >
        <span className="dock-icon-wrapper">
          <Briefcase
            size={20}
            strokeWidth={isActive("/projects") ? 2.5 : 1.9}
            className="dock-svg-icon"
          />
        </span>
        <span className="dock-label">Projects</span>
      </Link>

      {/* 3. Systems Lab Route */}
      <Link
        href="/lab"
        onClick={triggerHaptic}
        className={`dock-item ${isActive("/lab") ? "active" : ""}`}
        title="Systems Engineering Lab"
      >
        <span className="dock-icon-wrapper">
          <Zap
            size={20}
            strokeWidth={isActive("/lab") ? 2.5 : 1.9}
            className="dock-svg-icon"
          />
        </span>
        <span className="dock-label">Lab</span>
      </Link>

      {/* 4. Transparent Pricing & SOW Route */}
      <Link
        href="/pricing"
        onClick={triggerHaptic}
        className={`dock-item ${isActive("/pricing") ? "active" : ""}`}
        title="Transparent Pricing & SOW"
      >
        <span className="dock-icon-wrapper">
          <CircleDollarSign
            size={20}
            strokeWidth={isActive("/pricing") ? 2.5 : 1.9}
            className="dock-svg-icon"
          />
        </span>
        <span className="dock-label">Pricing</span>
      </Link>

      {/* 5. Spotlight Search Action */}
      <button
        type="button"
        onClick={handleOpenSearch}
        className="dock-item"
        title="Spotlight Search (Ctrl+K)"
        aria-label="Spotlight Global Search"
      >
        <span className="dock-icon-wrapper">
          <Search size={20} strokeWidth={1.9} className="dock-svg-icon" />
        </span>
        <span className="dock-label">Search</span>
      </button>

      {/* 6. Mobile Drawer Menu Toggle */}
      <button
        type="button"
        onClick={handleOpenMenu}
        className={`dock-item ${isMenuOpen ? "active menu-open" : ""}`}
        title={isMenuOpen ? "Close Menu" : "Open Menu"}
        aria-label={isMenuOpen ? "Close Menu Drawer" : "Open Menu Drawer"}
        aria-expanded={isMenuOpen}
      >
        <span className="dock-icon-wrapper">
          {isMenuOpen ? (
            <X size={20} strokeWidth={2.4} className="dock-svg-icon" />
          ) : (
            <Menu size={20} strokeWidth={1.9} className="dock-svg-icon" />
          )}
        </span>
        <span className="dock-label">{isMenuOpen ? "Close" : "Menu"}</span>
      </button>
    </nav>
  );
}
