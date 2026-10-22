import type { Metadata } from "next";
import ResumeClientView from "./resume-client-view";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Technical Resume & Credentials | MD Abu Hanif Mia (Staff Software Engineer)",
  description:
    "Official resume of MD Abu Hanif Mia (Abu Hanif) - Staff Software Engineer & Systems Architect. 9+ years experience, 99.99% uptime track record, B.Sc. in CSE, Programming Hero Batch-12 certified (WEB12-3991), and freeCodeCamp accreditations.",
  keywords: [
    "MD Abu Hanif Mia Resume",
    "Staff Software Engineer CV",
    "Abu Hanif Resume",
    "Programming Hero Batch 12",
    "WEB12-3991",
    "freeCodeCamp Certified Developer",
    "Rust Systems Engineer",
    "Next.js 16 Architect",
    "PostgreSQL Performance Specialist",
    "Software Engineer Bangladesh",
    "Distributed Systems Architect",
  ],
  alternates: {
    canonical: `${siteUrl}/resume`,
  },
  openGraph: {
    title: "Technical Resume & Credentials | MD Abu Hanif Mia",
    description:
      "Verified track record: 99.99% uptime, 12M events/sec, Programming Hero Honor (WEB12-3991), freeCodeCamp, and Rust systems architecture.",
    url: `${siteUrl}/resume`,
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Resume & Credentials | MD Abu Hanif Mia",
    description:
      "Staff Software Engineer & Systems Architect resume. 9+ years experience, Programming Hero Batch-12 honor, freeCodeCamp certifications, and Rust systems expertise.",
    creator: "@abuhanif",
  },
};

const resumeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/resume#webpage`,
      url: `${siteUrl}/resume`,
      name: "Technical Resume & Credentials | MD Abu Hanif Mia",
      description:
        "Staff Software Engineer & Systems Architect resume. 9+ years experience, Programming Hero Batch-12 honor, freeCodeCamp certifications, and Rust systems expertise.",
      dateCreated: "2024-01-01T00:00:00Z",
      dateModified: "2026-10-22T00:00:00Z",
      mainEntity: {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "MD Abu Hanif Mia",
        alternateName: ["Abu Hanif", "md abu hanif mia"],
        jobTitle: "Staff Software Engineer & Systems Architect",
        description:
          "Staff Software Engineer and Systems Architect with 9+ years experience designing high-throughput distributed applications, edge networks, and developer platforms.",
        url: siteUrl,
        image: `${siteUrl}/images/profile.png`,
        email: "abuhanifmain@gmail.com",
        sameAs: [
          "https://github.com/abuhanifmain-art",
          "https://github.com/abuhanif254",
          "https://linkedin.com/in/abuhanif",
          "https://x.com/abuhanif",
        ],
        alumniOf: [
          {
            "@type": "EducationalOrganization",
            name: "Bachelor of Science in Computer Science & Engineering (B.Sc. in CSE)",
          },
          {
            "@type": "EducationalOrganization",
            name: "Programming Hero",
            url: "https://programming-hero.com",
          },
        ],
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
            url: `${siteUrl}/images/programming-hero-certificate.png`,
            validIn: {
              "@type": "AdministrativeArea",
              name: "Global",
            },
            description:
              "Batch-12 honor distinction certified by CEO Jhankar Mahbub covering Modern JavaScript, TypeScript, React 19 architecture, Node.js, Express, and full-stack engineering.",
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "JavaScript Algorithms and Data Structures",
            credentialCategory: "Verified Developer Accreditation",
            recognizedBy: {
              "@type": "Organization",
              name: "freeCodeCamp",
              url: "https://www.freecodecamp.org",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "TypeScript Production Engineering",
            credentialCategory: "Verified Developer Accreditation",
            recognizedBy: {
              "@type": "Organization",
              name: "freeCodeCamp",
              url: "https://www.freecodecamp.org",
            },
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Scientific Computing with Python",
            credentialCategory: "Verified Developer Accreditation",
            recognizedBy: {
              "@type": "Organization",
              name: "freeCodeCamp",
              url: "https://www.freecodecamp.org",
            },
          },
        ],
        knowsAbout: [
          "Rust Systems Programming",
          "Tokio Concurrency",
          "Go (Golang)",
          "TypeScript",
          "Next.js 16",
          "React 19",
          "PostgreSQL 16 Query Tuning",
          "Cloudflare Pages & Workers Edge",
          "TimescaleDB Telemetry",
          "High-Throughput Distributed Architecture",
        ],
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Technical Resume",
            item: `${siteUrl}/resume`,
          },
        ],
      },
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Abu Hanif Engineering Portfolio",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Technical Resume",
          item: `${siteUrl}/resume`,
        },
      ],
    },
  ],
};

export default function ResumePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeJsonLd) }}
      />
      <ResumeClientView />
    </>
  );
}
