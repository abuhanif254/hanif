import type { Metadata } from "next";
import PricingClientView from "./pricing-client-view";
import { initialServices } from "../data/portfolio-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanif.dev";

export const metadata: Metadata = {
  title: "Engineering Services & Work Pricing | Abu Hanif (MD Abu Hanif Mia)",
  description:
    "Transparent pricing for staff-level software engineering, PostgreSQL performance tuning sprints, Cloudflare edge migrations, and full-stack SaaS MVP architecture.",
  keywords: [
    "Software Engineering Pricing",
    "Staff Software Engineer Rates",
    "PostgreSQL Optimization Consultant",
    "Next.js Architecture Consulting",
    "Cloudflare Edge Migration Pricing",
    "Full-Stack MVP Development",
    "Abu Hanif",
    "MD Abu Hanif Mia",
  ],
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
  openGraph: {
    title: "Engineering Services & Work Pricing | Abu Hanif",
    description:
      "Transparent engineering tiers: Architecture Audits, Postgres Query Sprints, Edge Migrations, and Full-Stack MVP builds.",
    url: `${siteUrl}/pricing`,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Services & Work Pricing | Abu Hanif",
    description:
      "Transparent engineering tiers: Architecture Audits, Postgres Query Sprints, Edge Migrations, and Full-Stack MVP builds.",
    creator: "@abuhanif",
  },
};

const pricingFaqs = [
  {
    q: "Why do you use fixed-price milestones instead of open-ended hourly billing?",
    a: "Hourly billing misaligns incentives: slower development yields higher contractor bills, while efficient engineering is penalized. By structuring projects around transparent, fixed-scope milestones, you know the exact cost and delivery timeline before code is written. I assume the delivery risk, and you receive verified production deliverables without budget creep.",
  },
  {
    q: "Who owns the intellectual property and source code?",
    a: "You do. 100% of all intellectual property, git commit histories, documentation, schemas, and assets belong to you from the moment they are written. Work is committed directly to your private GitHub or GitLab organization under standard clean IP assignment terms.",
  },
  {
    q: "What is your typical project kickoff turnaround time?",
    a: "Diagnostic audits and database tuning sprints typically commence within 48 to 72 hours of an executed Statement of Work. Larger MVP builds and architecture refactors are scheduled in prioritized engineering blocks to ensure 100% focused attention.",
  },
  {
    q: "How do you handle post-launch bugs, production issues, and warranty?",
    a: "Every fixed-price milestone includes an unconditional 30-day post-launch warranty covering any bugs, edge regressions, or configuration defects at zero additional charge. An optional extended 60-day SLA is also available.",
  },
  {
    q: "Can you collaborate with our existing in-house engineering team?",
    a: "Yes. I frequently operate as a fractional Staff Architect or senior delivery lead embedded directly into internal teams, mentoring developers, running PR reviews, and instilling strict production-grade patterns.",
  },
  {
    q: "What are your payment terms and invoicing methods?",
    a: "Fixed milestones are split into 50% upfront to reserve sprint capacity and 50% upon verified production deployment. Invoicing is processed through Stripe (Credit Card, Wire, ACH) or direct international bank transfer with full tax receipts.",
  },
];

const offerCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Software Engineering & Architecture Consulting Services",
  itemListElement: initialServices.map((service, index) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.title,
      description: service.description,
      provider: {
        "@type": "Person",
        name: "MD Abu Hanif Mia",
        url: siteUrl,
      },
    },
    price: service.priceDisplay.replace(/[^0-9]/g, ""),
    priceCurrency: "USD",
    position: index + 1,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
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
      name: "Pricing & Services",
      item: `${siteUrl}/pricing`,
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PricingClientView />
    </>
  );
}
