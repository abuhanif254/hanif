import Link from "next/link";
import { initialBlogPosts, BlogPost } from "../../data/portfolio-data";

interface TechnicalBlogFeedProps {
  articles?: BlogPost[];
}

export default function TechnicalBlogFeed({ articles }: TechnicalBlogFeedProps) {
  const displayArticles = articles && articles.length > 0
    ? articles.filter((a) => a.isPublished).slice(0, 3)
    : initialBlogPosts.filter((a) => a.isPublished).slice(0, 3);

  return (
    <div className="cfrags">
      <div className="widget rss_feed" id="rss_feed">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px" }}>
          <strong className="heading4 widget-title" style={{ borderBottom: "none", paddingBottom: 0, margin: 0 }}>
            <Link href="/blog">Engineering Architecture Blog</Link>
          </strong>
          <Link href="/feed.xml" style={{ fontSize: "11px", color: "#f97316", fontWeight: "bold" }}>
            RSS Feed 📡
          </Link>
        </div>
        <div className="fragcontent" style={{ marginTop: "10px" }}>
          <div
            className="rss_items jwfeeds jwfeeds-length-150 jwfeeds-has-description jwfeeds-no-dates jwfeeds-count-3 jwfeeds-order-desc"
            id="jwfeeds-feed-1347"
          >
            <ul className="rss_items">
              {displayArticles.map((item, idx) => {
                const formattedDate = new Date(item.publishedAt || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                return (
                  <li key={item.slug} className="rss_item jwfeed-post" id={`jwfeeds-item-${idx}`}>
                    <meta content={item.publishedAt} itemProp="dateCreated" name="dateCreated" />
                    <strong>
                      <Link href={`/blog/${item.slug}`} itemProp="url" rel="bookmark">
                        <span className="entry-title" itemProp="name">
                          {item.title}
                        </span>
                      </Link>
                    </strong>
                    <div style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 4px 0" }}>
                      Published: {formattedDate} • {item.readingTimeMinutes} min read
                    </div>
                    <span className="rss_item_descr entry-summary" itemProp="description">
                      {item.excerpt}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
