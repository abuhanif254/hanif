import { describe, it, expect } from "vitest";
import { POST, GET } from "../app/api/admin/auth/route";
import { createSessionToken, verifySessionToken } from "../app/lib/admin-auth";
import { NextRequest } from "next/server";

describe("Admin Authentication API Route (/api/admin/auth)", () => {
  it("should reject invalid passcodes with 401 status", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ passcode: "wrong-passcode" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("Invalid administrator credentials");
  });

  it("should accept valid passcode with 200 status and issue a signed HMAC token", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ passcode: "hanif2026" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);

    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
    expect(verifySessionToken("hanif2026")).toBe(false);
    expect(verifySessionToken("forged.signature")).toBe(false);
  });

  it("should return false for unauthenticated GET verification", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/auth", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.authenticated).toBe(false);
  });

  it("should return true for Bearer authenticated GET verification", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/auth", {
      method: "GET",
      headers: {
        Authorization: "Bearer hanif2026",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.authenticated).toBe(true);
  });
});
