import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abuhanifmia.com";

export const metadata: Metadata = {
  title: "Order Invoice & Payment Settlement | Abu Hanif",
  description: "Official institutional invoice, milestone sign-off, and wire settlement details.",
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
    canonical: `${siteUrl}/orders/invoice`,
  },
};

export default function InvoiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
