import sourcePageData from "../data/source-pages.json";

export interface SourcePageRecord {
  path: string;
  url: string;
  status: number;
  title: string;
  description: string;
  h1: string[];
  body_id: string;
  body_class: string;
  html: string;
}

export const sourcePages = sourcePageData as SourcePageRecord[];

const sourcePagesByPath = new Map(sourcePages.map((page) => [page.path, page]));

export function getSourcePage(path: string): SourcePageRecord | undefined {
  return sourcePagesByPath.get(path);
}

export function getSourcePageSlugs(): Array<{ slug: string[] }> {
  return sourcePages
    .filter((page) => page.path !== "/")
    .map((page) => ({ slug: page.path.replace(/^\//, "").split("/") }));
}
