import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import CookieBanner from "./components/cookie-banner";

export const metadata: Metadata = {
  title: {
    default: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    template: "%s | Abu Hanif",
  },
  description:
    "Portfolio of MD Abu Hanif Mia (Abu Hanif) - Staff Software Engineer & Systems Architect specializing in distributed systems, Next.js, Supabase, and high-performance cloud architecture.",
  keywords: [
    "Abu Hanif",
    "MD Abu Hanif Mia",
    "Staff Software Engineer",
    "Systems Architect",
    "Cloudflare Pages",
    "Next.js",
    "Supabase",
    "PostgreSQL",
    "Software Portfolio",
    "Distributed Systems",
  ],
  openGraph: {
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description:
      "Scalable Systems • Distributed Architecture • High-Performance Web Applications. View portfolio, pricing, and technical blog.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
