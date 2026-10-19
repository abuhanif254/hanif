import type { Metadata } from "next";
import { getProjects } from "../lib/portfolio-store";
import ProjectsClientView from "./projects-client-view";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Engineering Projects & Systems Showcase | Abu Hanif (MD Abu Hanif Mia)",
  description:
    "Explore production systems, distributed pipelines, Next.js edge applications, and database optimization case studies delivered by Staff Software Engineer Abu Hanif.",
  keywords: [
    "Software Engineering Projects",
    "Systems Architecture Portfolio",
    "Next.js 16 Production Systems",
    "PostgreSQL Optimization Case Studies",
    "Distributed Systems Telemetry",
    "Abu Hanif",
    "MD Abu Hanif Mia",
  ],
  alternates: {
    canonical: `${siteUrl}/projects`,
  },
  openGraph: {
    title: "Engineering Projects & Systems Showcase | Abu Hanif",
    description:
      "Explore production systems, distributed pipelines, and database optimization case studies delivered by Staff Software Engineer Abu Hanif.",
    url: `${siteUrl}/projects`,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Projects & Systems Showcase | Abu Hanif",
    description:
      "Explore production systems, distributed pipelines, and database optimization case studies delivered by Staff Software Engineer Abu Hanif.",
    creator: "@abuhanif",
  },
};

export default async function ProjectsIndexPage() {
  const projects = await getProjects();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Engineering Projects & Systems Showcase",
    description:
      "Production case studies and architecture blueprints delivered by Staff Software Engineer MD Abu Hanif Mia.",
    url: `${siteUrl}/projects`,
    publisher: {
      "@type": "Person",
      name: "MD Abu Hanif Mia",
      url: siteUrl,
    },
    hasPart: projects.map((p) => ({
      "@type": "SoftwareApplication",
      name: p.title,
      description: p.summary,
      url: `${siteUrl}/projects/${p.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectsClientView initialProjects={projects} />
    </>
  );
}
