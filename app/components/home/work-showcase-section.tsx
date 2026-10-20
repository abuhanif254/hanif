import Link from "next/link";
import { initialProjects, ProjectItem } from "../../data/portfolio-data";

interface WorkShowcaseSectionProps {
  projects?: ProjectItem[];
}

export default function WorkShowcaseSection({ projects }: WorkShowcaseSectionProps) {
  const displayProjects = projects && projects.length > 0
    ? projects.filter((p) => p.published).slice(0, 4)
    : initialProjects.filter((p) => p.published).slice(0, 4);

  return (
    <>
      {/* WORK SHOWCASE SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          margin: "40px 0 16px 0",
          borderBottom: "2px solid #2563eb",
          paddingBottom: "8px",
        }}
      >
        <h2 id="work" style={{ fontSize: "1.5em", margin: 0, color: "#0f172a", borderBottom: "none", paddingBottom: 0 }}>
          Work Showcase &amp; Engineering Case Studies
        </h2>
        <Link href="/projects" style={{ fontSize: "13px", color: "#2563eb", fontWeight: "bold", textDecoration: "underline" }}>
          View All Projects &amp; Architectures ›
        </Link>
      </div>
      <p style={{ margin: "0 0 24px 0", color: "#475569", lineHeight: "1.6" }}>
        Below is a selection of recent production systems delivered, detailing the core architectural challenge, solution, and measurable production outcome:
      </p>

      {displayProjects.map((project) => (
        <div
          key={project.id || project.slug}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderLeft: "4px solid #2563eb",
            borderRadius: "8px",
            padding: "24px 26px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
            <strong style={{ fontSize: "18px", color: "#0f172a" }}>
              <Link href={`/projects/${project.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                {project.title}
              </Link>
            </strong>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#047857",
                background: "#ecfdf5",
                padding: "4px 10px",
                borderRadius: "4px",
                border: "1px solid #a7f3d0",
              }}
            >
              {project.priceTag}
            </span>
          </div>

          <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
            <strong style={{ color: "#0f172a" }}>System Summary:</strong> {project.summary}
          </p>

          <p style={{ margin: "0 0 12px 0", fontSize: "13.5px", color: "#475569", lineHeight: "1.5" }}>
            <strong style={{ color: "#0f172a" }}>Core Architecture:</strong> {project.techStack.join(" • ")}
          </p>

          <div style={{ fontSize: "13px", fontWeight: "600", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
            <span style={{ color: "#047857" }}>✓ Verified Outcome: {project.impactMetric}</span>
            <Link
              href={`/projects/${project.slug}`}
              style={{ color: "#2563eb", textDecoration: "underline", fontSize: "13px", fontWeight: "700" }}
            >
              Read Full Case Study &rsaquo;
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
