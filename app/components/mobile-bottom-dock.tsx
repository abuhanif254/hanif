"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomDock() {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  }

  function handleOpenMenu(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
    }
  }

  function handleOpenSearch(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  }

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Bottom App Navigation">
      <Link
        href="/"
        className={`dock-item ${isActive("/") ? "active" : ""}`}
        title="Home"
      >
        <span className="dock-icon">🏠</span>
        <span>Home</span>
      </Link>

      <Link
        href="/projects"
        className={`dock-item ${isActive("/projects") ? "active" : ""}`}
        title="Work Projects"
      >
        <span className="dock-icon">💼</span>
        <span>Projects</span>
      </Link>

      <Link
        href="/lab"
        className={`dock-item ${isActive("/lab") ? "active" : ""}`}
        title="Systems Engineering Lab"
      >
        <span className="dock-icon">⚡</span>
        <span>Lab</span>
      </Link>

      <Link
        href="/pricing"
        className={`dock-item ${isActive("/pricing") ? "active" : ""}`}
        title="Work Prices & SOW"
      >
        <span className="dock-icon">💰</span>
        <span>Pricing</span>
      </Link>

      <button
        type="button"
        onClick={handleOpenSearch}
        className="dock-item"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        title="Global Quick Search (Ctrl+K)"
      >
        <span className="dock-icon">🔍</span>
        <span>Search</span>
      </button>

      <button
        type="button"
        onClick={handleOpenMenu}
        className="dock-item"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        title="More Navigation Menu"
      >
        <span className="dock-icon">☰</span>
        <span>Menu</span>
      </button>
    </nav>
  );
}
