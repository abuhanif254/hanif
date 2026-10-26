import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import {
  verifySessionTokenWebCrypto,
  timingSafeEqualString,
  ADMIN_COOKIE_NAME,
} from "../app/lib/admin-auth-edge";
import { createSessionToken, verifySessionToken } from "../app/lib/admin-auth";
import {
  base32ToBuffer,
  bufferToBase32,
  generateTotpCode,
  verifyTotpCode,
  generateTotpUri,
} from "../app/lib/totp-auth";

describe("Enterprise Security & Zero-Trust Edge Perimeter", () => {
  const secretKey = "hanif2026";
  const testBase32Secret = "JBSWY3DPEHPK3PXP"; // Standard RFC test vector for TOTP

  describe("Web Crypto Edge Session Verification", () => {
    it("should verify valid 4-part versioned session token", async () => {
      const validToken = createSessionToken("v1");
      const isValid = await verifySessionTokenWebCrypto(validToken, secretKey, "v1");
      expect(isValid).toBe(true);
    });

    it("should reject expired tokens", async () => {
      const expiredTimestamp = Date.now() - 10000; // in the past
      const payload = `admin.${expiredTimestamp}.v1`;
      const token = `${payload}.dummy_signature`;
      const isValid = await verifySessionTokenWebCrypto(token, secretKey, "v1");
      expect(isValid).toBe(false);
    });

    it("should reject token with mismatched session version (remote invalidation)", async () => {
      const tokenV1 = createSessionToken("v1");
      // If server rotated to v2, v1 token must be rejected
      const isValid = await verifySessionTokenWebCrypto(tokenV1, secretKey, "v2");
      expect(isValid).toBe(false);
    });

    it("should reject forged or tampered signatures", async () => {
      const validToken = createSessionToken("v1");
      const tampered = validToken.substring(0, validToken.length - 4) + "abcd";
      const isValid = await verifySessionTokenWebCrypto(tampered, secretKey, "v1");
      expect(isValid).toBe(false);
    });

    it("should perform constant-time string comparisons without throwing", () => {
      expect(timingSafeEqualString("hello", "hello")).toBe(true);
      expect(timingSafeEqualString("hello", "world")).toBe(false);
      expect(timingSafeEqualString("short", "longerstring")).toBe(false);
    });
  });

  describe("Next.js 16 Edge Proxy Gate (proxy.ts)", () => {
    it("should intercept unauthenticated request to /admin and redirect to /admin/login", async () => {
      const req = new NextRequest("https://abuhanifmia.com/admin");
      const res = await proxy(req);

      // Must be a 307 redirect
      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toContain("/admin/login");
    });

    it("should permit unauthenticated access to /admin/login so credentials can be entered", async () => {
      const req = new NextRequest("https://abuhanifmia.com/admin/login");
      const res = await proxy(req);

      // Should call NextResponse.next() (status 200, no redirect)
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("should redirect authenticated user from /admin/login to /admin dashboard", async () => {
      const token = createSessionToken("v1");
      const req = new NextRequest("https://abuhanifmia.com/admin/login", {
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${token}`,
        },
      });

      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/admin");
    });

    it("should allow authenticated user with valid HMAC cookie to access /admin directly", async () => {
      const token = createSessionToken("v1");
      const req = new NextRequest("https://abuhanifmia.com/admin", {
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${token}`,
        },
      });

      const res = await proxy(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });
  });

  describe("TOTP RFC 6238 Engine", () => {
    it("should encode and decode Base32 buffers reversibly", () => {
      const raw = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      const base32 = bufferToBase32(raw);
      expect(base32).toBe("JBSWY3DP");

      const decoded = base32ToBuffer(base32);
      expect(Array.from(decoded)).toEqual([72, 101, 108, 108, 111]);
    });

    it("should generate standard 6-digit TOTP codes", () => {
      const code = generateTotpCode(testBase32Secret);
      expect(code).toMatch(/^\d{6}$/);
    });

    it("should verify valid TOTP code within current 30s window", () => {
      const code = generateTotpCode(testBase32Secret);
      const isValid = verifyTotpCode(code, testBase32Secret);
      expect(isValid).toBe(true);
    });

    it("should tolerate ±1 window drift (clock skew of 30 seconds)", () => {
      const pastTime = Date.now() - 30000;
      const pastCode = generateTotpCode(testBase32Secret, 30000, pastTime);
      const isValidPast = verifyTotpCode(pastCode, testBase32Secret, 1);
      expect(isValidPast).toBe(true);

      const futureTime = Date.now() + 30000;
      const futureCode = generateTotpCode(testBase32Secret, 30000, futureTime);
      const isValidFuture = verifyTotpCode(futureCode, testBase32Secret, 1);
      expect(isValidFuture).toBe(true);
    });

    it("should reject expired codes beyond drift tolerance", () => {
      const oldTime = Date.now() - 120000; // 2 minutes ago
      const oldCode = generateTotpCode(testBase32Secret, 30000, oldTime);
      const isValid = verifyTotpCode(oldCode, testBase32Secret, 1);
      expect(isValid).toBe(false);
    });

    it("should reject malformed or non-numeric TOTP inputs", () => {
      expect(verifyTotpCode("abc123", testBase32Secret)).toBe(false);
      expect(verifyTotpCode("123", testBase32Secret)).toBe(false);
      expect(verifyTotpCode("", testBase32Secret)).toBe(false);
      expect(verifyTotpCode(undefined, testBase32Secret)).toBe(false);
    });

    it("should construct valid otpauth:// URI for authenticator QR setup", () => {
      const uri = generateTotpUri("admin@abuhanifmia.com", "Abu Hanif Architecture", testBase32Secret);
      expect(uri).toContain("otpauth://totp/");
      expect(uri).toContain("secret=" + testBase32Secret);
      expect(uri).toContain("algorithm=SHA1");
      expect(uri).toContain("digits=6");
      expect(uri).toContain("period=30");
    });
  });
});
