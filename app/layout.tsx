import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import CookieBanner from "./components/cookie-banner";
import CertificateViewer from "./components/certificate-viewer";
import CommandPalette from "./components/command-palette";
import MobileBottomDock from "./components/mobile-bottom-dock";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

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
    images: [
      {
        url: `${siteUrl}/images/og-card.png`,
        width: 1200,
        height: 630,
        alt: "MD Abu Hanif Mia (Abu Hanif) - Staff Software Engineer & Systems Architect",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abu Hanif (MD Abu Hanif Mia) | Staff Software Engineer & Systems Architect",
    description:
      "Scalable Systems • Distributed Architecture • High-Performance Web Applications. View portfolio work showcase, transparent pricing, and technical blog.",
    creator: "@abuhanif",
    images: [`${siteUrl}/images/og-card.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#053056",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Abu Hanif Engineering Portfolio",
      description: "Portfolio and technical architecture publications of Staff Software Engineer MD Abu Hanif Mia.",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "MD Abu Hanif Mia",
      alternateName: ["Abu Hanif", "md abu hanif mia"],
      jobTitle: "Staff Software Engineer & Systems Architect",
      description:
        "Staff Software Engineer and Systems Architect with 9+ years experience designing high-throughput distributed applications, edge networks, and developer platforms.",
      url: siteUrl,
      email: "abuhanifmain@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "Bangladesh",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Bachelor of Science in Computer Science & Engineering (B.Sc. in CSE)",
      },
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Complete Web Development Course with Excellence",
          credentialCategory: "Certificate of Completion with Excellence",
          recognizedBy: {
            "@type": "Organization",
            name: "Programming Hero",
            url: "https://programming-hero.com",
          },
          identifier: "WEB12-3991",
          description: "Batch-12 honor distinction certified by CEO Jhankar Mahbub.",
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "freeCodeCamp Verified Accreditations (JavaScript, TypeScript, Python)",
          credentialCategory: "Developer Certification",
          recognizedBy: {
            "@type": "Organization",
            name: "freeCodeCamp",
            url: "https://www.freecodecamp.org",
          },
        },
      ],
      knowsAbout: [
        "Distributed Systems",
        "High-Throughput APIs",
        "Rust Systems Architecture",
        "Tokio Concurrency",
        "Next.js 16",
        "React 19",
        "PostgreSQL 16 Optimization",
        "Cloudflare Pages & Workers",
        "Supabase",
        "Go (Golang)",
        "TypeScript",
        "Python",
        "AI & LLM RAG Systems",
      ],
      sameAs: [
        "https://github.com",
        "https://linkedin.com",
        "https://x.com",
      ],
    },
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
        <CertificateViewer />
        <CommandPalette />
        <MobileBottomDock />
      </body>
    </html>
  );
}
