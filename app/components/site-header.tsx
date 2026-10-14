import Link from "next/link";

const navigation = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Portfolio", "/#projects"],
  ["Services & Pricing", "/#pricing"],
  ["Competencies", "/#competencies"],
  ["Blog", "/blog"],
  ["Contact", "/#contact"],
] as const;

export default function SiteHeader({
  fullName = "Abu Hanif",
  kicker = "Staff Software Engineer",
  subTitle = "Distributed Systems • Cloudflare • Next.js",
  phone = "+880 1700-000000",
  email = "contact@abuhanif.dev",
}: {
  fullName?: string;
  kicker?: string;
  subTitle?: string;
  phone?: string;
  email?: string;
}) {
  return (
    <div id="header">
      <div className="wrapper">
        <div id="head">
          <div id="logo">
            <Link className="engineer-wordmark" href="/" title={`${fullName} - Portfolio Home`}>
              <span className="wordmark-kicker">{kicker}</span>
              <strong>{fullName}</strong>
              <span className="wordmark-sub">{subTitle}</span>
            </Link>
          </div>
          <div className="engineer-tagline-cta">
            <a className="cta-badge" href="/#contact">
              Discuss a Project &nbsp;›
            </a>
          </div>
        </div>
        <div id="topnav">
          <ul id="tnav-toplevel">
            {navigation.map(([label, href], idx) => (
              <li key={label} className={idx === 0 ? "selected" : ""}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
