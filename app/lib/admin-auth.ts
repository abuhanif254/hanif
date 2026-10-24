import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "hanif2026";
const COOKIE_NAME = "abuhanif_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to prevent timing leak on length
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function getAdminSecret(): string {
  return ADMIN_SECRET;
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  const clean = token.trim();

  // Strictly require signed HMAC session token (admin.<expiresAt>.<sig>)
  const parts = clean.split(".");
  if (parts.length === 3 && parts[0] === "admin") {
    const expiresAt = Number(parts[1]);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return false;
    }
    const payload = `${parts[0]}.${parts[1]}`;
    const expectedSig = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payload)
      .digest("hex");
    return safeEqual(parts[2], expectedSig);
  }

  return false;
}

export function validatePasscode(input: string): boolean {
  if (!input || typeof input !== "string") return false;
  const cleanInput = input.trim();
  if (!cleanInput) return false;
  return safeEqual(cleanInput, ADMIN_SECRET);
}

export async function isRequestAuthorized(request?: Request): Promise<boolean> {
  // 1. Check Bearer token in Authorization header (signed token or direct API key)
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (verifySessionToken(token) || validatePasscode(token)) {
        return true;
      }
    }
  }

  // 2. Check HTTP-only signed cookie via next/headers
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (sessionCookie && verifySessionToken(sessionCookie.value)) {
      return true;
    }
  } catch {
    // If called outside Next request context
  }

  return false;
}

export { COOKIE_NAME };
