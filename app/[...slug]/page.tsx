import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SourceDocument from "../components/source-document";
import { getSourcePage, getSourcePageSlugs } from "../lib/source-pages";

type SourceRouteProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getSourcePageSlugs();
}

function getPageFromSlug(slug: string[]) {
  return getSourcePage(`/${slug.join("/")}`);
}

export async function generateMetadata({ params }: SourceRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageFromSlug(slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      locale: "en_US",
    },
  };
}

export default async function SourceRoute({ params }: SourceRouteProps) {
  const { slug } = await params;
  const page = getPageFromSlug(slug);

  if (!page) notFound();

  return <SourceDocument page={page} />;
}
