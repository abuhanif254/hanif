import FormGuard from "./source-form-guard";
import type { SourcePageRecord } from "../lib/source-pages";

export default function SourceDocument({ page }: { page: SourcePageRecord }) {
  const bodyClasses = ["source-page-body", "js", page.body_class]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div id="source-page-root" data-source-path={page.path}>
        <div
          id={page.body_id || "source-page-body"}
          className={bodyClasses}
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </div>
      <FormGuard route={page.path} />
    </>
  );
}
