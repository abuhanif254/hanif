import { NextRequest, NextResponse } from "next/server";
import {
  validatePasscode,
  createSessionToken,
  COOKIE_NAME,
  isRequestAuthorized,
} from "../../../lib/admin-auth";

// In-memory brute-force rate limiter per IP
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

export async function GET(request: NextRequest) {
  const isAuth = await isRequestAuthorized(request);
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();
    const record = failedAttempts.get(ip);

    if (record && now < record.resetAt && record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed authentication attempts. Please wait 15 minutes.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { passcode } = body;

    if (!validatePasscode(passcode)) {
      const current =
        record && now < record.resetAt
          ? { count: record.count + 1, resetAt: record.resetAt }
          : { count: 1, resetAt: now + WINDOW_MS };
      failedAttempts.set(ip, current);

      return NextResponse.json(
        { success: false, error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    failedAttempts.delete(ip);

    const signedToken = createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: signedToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Authentication request malformed.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
