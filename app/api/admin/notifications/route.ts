import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../lib/admin-auth";
import { getRecentNotificationEvents } from "../../../lib/notification-service";

export async function GET(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access to notification ledger." },
      { status: 401 }
    );
  }

  try {
    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 25;
    const events = await getRecentNotificationEvents(limit);

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retrieve notification events." },
      { status: 500 }
    );
  }
}
