import { NextRequest, NextResponse } from "next/server";
import { validatePasscode, getAdminSecret, COOKIE_NAME, isRequestAuthorized } from "../../../lib/admin-auth";

export async function GET(request: NextRequest) {
  const isAuth = await isRequestAuthorized(request);
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!validatePasscode(passcode)) {
      return NextResponse.json(
        { success: false, error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: getAdminSecret(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Authentication request malformed." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
