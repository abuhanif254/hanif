import { describe, it, expect } from "vitest";
import { POST } from "../app/api/upload/route";
import { NextRequest } from "next/server";

const AUTH_HEADER = { Authorization: "Bearer hanif2026" };

describe("Upload API Route (/api/upload)", () => {
  it("should reject unauthenticated requests with status 401", async () => {
    const formData = new FormData();
    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("Unauthorized");
  });

  it("should reject authorized requests without files with status 400", async () => {
    const formData = new FormData();
    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      headers: AUTH_HEADER,
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("No valid image files provided");
  });

  it("should successfully process a valid image file and return an asset URL when authorized", async () => {
    const samplePngBytes = new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137,
    ]);
    const blob = new Blob([samplePngBytes], { type: "image/png" });
    const file = new File([blob], "test-architecture-diagram.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);

    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      headers: AUTH_HEADER,
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.url).toBeDefined();
    expect(typeof json.url).toBe("string");
    expect(json.url.length).toBeGreaterThan(0);
    expect(json.filename).toContain("test-architecture-diagram");
  });
});
