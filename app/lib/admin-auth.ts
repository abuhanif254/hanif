import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "hanif2026";
const COOKIE_NAME = "abuhanif_admin_session";

// A simple HMAC-like or signature verification for session token
export function getAdminSecret(): string {
  return ADMIN_SECRET;
}

export function validatePasscode(input: string): boolean {
  if (!input) return false;
  const cleanInput = input.trim();
  return cleanInput === ADMIN_SECRET;
}

export async function isRequestAuthorized(request?: Request): Promise<boolean> {
  // 1. Check Bearer token in Authorization header
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token === ADMIN_SECRET) {
        return true;
      }
    }
  }

  // 2. Check HTTP-only cookie via next/headers
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (sessionCookie && sessionCookie.value === ADMIN_SECRET) {
      return true;
    }
  } catch {
    // If called outside Next request context
  }

  return false;
}

export { COOKIE_NAME };
