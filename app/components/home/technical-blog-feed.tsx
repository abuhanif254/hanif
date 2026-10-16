import Link from "next/link";

export default function TechnicalBlogFeed() {
  const articles = [
    {
      slug: "nextjs-16-cloudflare-pages-architecture",
      title: "Architecting High-Throughput Next.js 16 Applications on Cloudflare Pages",
      date: "October 14, 2026",
      summary:
        "How to leverage Next.js App Router, edge caching, and serverless compute on Cloudflare to achieve sub-50ms global latency...",
    },
    {
      slug: "realtime-telemetry-supabase-postgres-cdc",
      title: "Zero-Latency Real-Time Telemetry with Supabase and Postgres CDC",
      date: "September 28, 2026",
      summary:
        "A deep dive into Postgres Write-Ahead Logs (WAL), Change Data Capture, and broadcasting live state across tens of thousands of WebSocket clients...",
    },
    {
      slug: "swapping-microservices-for-modular-monolith",
      title: "Why We Swapped 12 Microservices for a Modular Monolith in 2026",
      date: "August 15, 2026",
      summary:
        "How distributed complexity, gRPC serialization overhead, and debugging friction led our engineering team back to a clean modular monolith...",
    },
  ];

  return (
    <div className="cfrags">
      <div className="widget rss_feed" id="rss_feed">
        <strong className="heading4 widget-title">
          <Link href="/blog">Engineering Architecture Blog</Link>
        </strong>
        <div className="fragcontent">
          <div
            className="rss_items jwfeeds jwfeeds-length-150 jwfeeds-has-description jwfeeds-no-dates jwfeeds-count-3 jwfeeds-order-desc"
            id="jwfeeds-feed-1347"
          >
            <ul className="rss_items">
              {articles.map((item, idx) => (
                <li key={item.slug} className="rss_item jwfeed-post" id={`jwfeeds-item-${idx}`}>
                  <meta content={item.date} itemProp="dateCreated" name="dateCreated" />
                  <strong>
                    <Link href={`/blog/${item.slug}`} itemProp="url" rel="bookmark">
                      <span className="entry-title" itemProp="name">
                        {item.title}
                      </span>
                    </Link>
                  </strong>
                  <span className="rss_item_descr entry-summary" itemProp="description">
                    {item.summary}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
