import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="imgwrap">
      <div id="img1">
        <div className="text-wrapper">
          <div id="banner-tagline">Clean Architecture • High Performance • Scalable Systems</div>
          <div id="slideshow">
            <div className="slide slide1">99.99% Production Uptime for 10M+ Daily Users</div>
            <div className="slide slide2">Sub-25ms Global P99 Latency at the Edge</div>
            <div className="slide slide3">Reduced Cloud Infrastructure Costs by 64%</div>
            <div className="slide slide4">Zero Security Incidents Across 3.5M Identities</div>
            <div className="slide slide5">10x PostgreSQL Query Throughput via Index Optimization</div>
          </div>
        </div>
      </div>
      <div id="img2">
        <div className="wrapper">
          <Link className="pabttn pa1" href="/projects?category=systems">
            Distributed <br /> Systems
          </Link>
          <Link className="pabttn pa2" href="/projects?category=web">
            Full-Stack <br /> Engineering
          </Link>
          <Link className="pabttn pa3" href="/pricing">
            Architecture <br /> &amp; Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
