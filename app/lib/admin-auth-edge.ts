export const ADMIN_COOKIE_NAME = "abuhanif_admin_session";
export const ADMIN_SESSION_VERSION = process.env.ADMIN_SESSION_VERSION || "v1";

/**
 * Constant-time string equality check using bitwise XOR to mitigate timing attacks.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Edge-native session verification using Web Crypto API (crypto.subtle).
 * Fully compatible with V8 Isolates, Cloudflare Workers, and Next.js 16 Edge runtime.
 * Supports both:
 * - 4-part versioned tokens: admin.<expiresAt>.<version>.<sig>
 * - 3-part legacy tokens: admin.<expiresAt>.<sig>
 */
export async function verifySessionTokenWebCrypto(
  token: string | undefined | null,
  secret: string = process.env.ADMIN_SECRET_KEY || "hanif2026",
  requiredVersion: string = ADMIN_SESSION_VERSION
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const clean = token.trim();
  const parts = clean.split(".");

  if (parts.length < 3 || parts[0] !== "admin") return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  let payload = "";
  let providedSig = "";

  if (parts.length === 4) {
    const version = parts[2];
    if (version !== requiredVersion) {
      return false;
    }
    payload = `${parts[0]}.${parts[1]}.${parts[2]}`;
    providedSig = parts[3];
  } else if (parts.length === 3) {
    payload = `${parts[0]}.${parts[1]}`;
    providedSig = parts[2];
  } else {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    const payloadData = encoder.encode(payload);
    const expectedSigBuffer = await crypto.subtle.sign("HMAC", cryptoKey, payloadData);
    const expectedSigHex = Array.from(new Uint8Array(expectedSigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return timingSafeEqualString(providedSig, expectedSigHex);
  } catch {
    return false;
  }
}
