import type { Metadata } from "next";
import PricingPage from "../pricing/page";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanif.dev";

export const metadata: Metadata = {
  title: "Engineering Services & Work Prices | Abu Hanif",
  description:
    "Transparent pricing for staff-level software engineering, PostgreSQL performance tuning sprints, Cloudflare edge migrations, and full-stack SaaS MVP architecture.",
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
};

export default PricingPage;
