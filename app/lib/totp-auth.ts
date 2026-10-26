import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Decodes an RFC 4648 Base32 string into a Uint8Array byte buffer.
 */
export function base32ToBuffer(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) {
      throw new Error(`Invalid Base32 character: ${clean[i]}`);
    }
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

/**
 * Encodes raw bytes to an RFC 4648 Base32 string (useful for generating new 2FA secrets).
 */
export function bufferToBase32(buffer: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Generates an RFC 6238 TOTP 6-digit code for a given Base32 secret key.
 */
export function generateTotpCode(
  secretBase32: string,
  timeStepMs: number = 30000,
  timestampMs: number = Date.now()
): string {
  const key = base32ToBuffer(secretBase32);
  const timeStep = Math.floor(timestampMs / timeStepMs);

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(timeStep), 0);

  const hmac = crypto.createHmac("sha1", Buffer.from(key));
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation (RFC 4226 Section 5.4)
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Verifies a 6-digit TOTP code against a Base32 secret key with ±1 window drift tolerance (±30s).
 */
export function verifyTotpCode(
  inputCode: string | undefined | null,
  secretBase32: string | undefined | null,
  windowDrift: number = 1
): boolean {
  if (!inputCode || !secretBase32 || typeof inputCode !== "string") {
    return false;
  }
  const cleanCode = inputCode.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleanCode)) {
    return false;
  }

  const now = Date.now();
  const timeStepMs = 30000;

  for (let drift = -windowDrift; drift <= windowDrift; drift++) {
    const candidateTimestamp = now + drift * timeStepMs;
    try {
      const expected = generateTotpCode(secretBase32, timeStepMs, candidateTimestamp);
      if (crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(expected))) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Determines whether 2FA TOTP enforcement is active via environment configuration.
 */
export function isTotpConfigured(): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET;
  return Boolean(secret && secret.trim().length >= 16);
}

/**
 * Generates an otpauth:// URI to display in a QR code for authenticator apps.
 */
export function generateTotpUri(
  account: string = "admin@abuhanifmia.com",
  issuer: string = "Abu Hanif Architecture",
  secretBase32: string
): string {
  const encodedAccount = encodeURIComponent(account);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
