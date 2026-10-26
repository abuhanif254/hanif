import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifySessionTokenWebCrypto,
  ADMIN_COOKIE_NAME,
} from "./app/lib/admin-auth-edge";

export const config = {
  matcher: ["/admin/:path*"],
};

/**
 * Next.js 16 Edge Proxy (formerly middleware)
 * Enforces Zero-Trust edge gating for all administrative routes.
 * Completely blocks unauthenticated visitors from downloading the admin JavaScript bundle.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
  const isAuth = sessionCookie
    ? await verifySessionTokenWebCrypto(sessionCookie.value)
    : false;

  // 1. If user is at /admin/login
  if (pathname === "/admin/login") {
    // If already authenticated with valid HMAC session, redirect to /admin dashboard
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Otherwise allow access to login gateway
    return NextResponse.next();
  }

  // 2. For all other /admin routes (/admin, /admin/settings, etc.)
  if (!isAuth) {
    // Zero bundle leakage: Redirect unauthenticated requests to /admin/login
    const loginUrl = new URL("/admin/login", request.url);
    // Store original destination to redirect after login if desired
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
