import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Order Milestone & Deliverables Tracker | Abu Hanif",
  description: "Real-time order progress tracker, deliverable verification, and milestone sign-off gateway.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: `${siteUrl}/orders/tracker`,
  },
};

export default function TrackerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
