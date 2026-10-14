import type { Metadata } from "next";
import SourceDocument from "./components/source-document";
import { getEngineerHomepage } from "./lib/engineer-homepage";

const homepage = getEngineerHomepage();

export const metadata: Metadata = {
  title: homepage.title,
  description: homepage.description,
  openGraph: {
    title: homepage.title,
    description: homepage.description,
    type: "website",
    locale: "en_US",
  },
};

export default function HomePage() {
  return <SourceDocument page={homepage} />;
}
