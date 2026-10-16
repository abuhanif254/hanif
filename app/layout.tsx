import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import CookieBanner from "./components/cookie-banner";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanif.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    template: "%s | Abu Hanif",
  },
  description:
    "Portfolio of MD Abu Hanif Mia (Abu Hanif) - Staff Software Engineer & Systems Architect specializing in distributed systems, Next.js 16, PostgreSQL optimization, and Cloudflare edge architecture.",
  keywords: [
    "Abu Hanif",
    "MD Abu Hanif Mia",
    "Staff Software Engineer",
    "Systems Architect",
    "Cloudflare Pages",
    "Next.js 16",
    "Supabase",
    "PostgreSQL",
    "Software Portfolio",
    "Distributed Systems",
    "High-Throughput APIs",
    "Full-Stack Engineer",
  ],
  authors: [{ name: "MD Abu Hanif Mia", url: siteUrl }],
  creator: "MD Abu Hanif Mia",
  publisher: "MD Abu Hanif Mia",
  openGraph: {
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description:
      "Scalable Systems • Distributed Architecture • High-Performance Web Applications. View portfolio work showcase, transparent pricing, and technical blog.",
    url: siteUrl,
    siteName: "Abu Hanif Engineering Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description:
      "Scalable Systems • Distributed Architecture • High-Performance Web Applications. View portfolio work showcase, transparent pricing, and technical blog.",
    creator: "@abuhanif",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "MD Abu Hanif Mia",
  alternateName: "Abu Hanif",
  jobTitle: "Staff Software Engineer & Systems Architect",
  description:
    "Staff Software Engineer and Systems Architect with 9+ years experience designing high-throughput distributed applications, edge networks, and developer platforms.",
  url: siteUrl,
  email: "contact@abuhanif.dev",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "Bangladesh",
  },
  knowsAbout: [
    "Distributed Systems",
    "High-Throughput APIs",
    "Next.js 16",
    "React 19",
    "PostgreSQL Optimization",
    "Cloudflare Pages & Workers",
    "Supabase",
    "Go",
    "TypeScript",
    "AI & LLM RAG Systems",
  ],
  sameAs: [
    "https://github.com",
    "https://linkedin.com",
    "https://x.com",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
