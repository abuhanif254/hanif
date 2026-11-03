import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Client Order & Milestone Hub | Abu Hanif",
  description: "Secure client portal for order tracking, milestone verification, and institutional invoicing.",
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
};

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
