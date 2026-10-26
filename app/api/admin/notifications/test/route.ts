import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../../lib/admin-auth";
import { dispatchNotification } from "../../../../lib/notification-service";

export async function POST(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access to notification engine." },
      { status: 401 }
    );
  }

  try {
    const event = await dispatchNotification({
      type: "TEST_PING",
      title: "Notification Mesh Diagnostic Ping",
      description: "A manual test notification was dispatched from the Admin Control Panel.",
      data: {
        actor: "Admin",
        environment: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test notification dispatched through webhook channels.",
      event,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to dispatch test notification." },
      { status: 500 }
    );
  }
}
