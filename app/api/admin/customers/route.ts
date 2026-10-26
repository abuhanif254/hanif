import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../lib/admin-auth";
import { getCustomers } from "../../../lib/oms-service";

export async function GET(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const customers = await getCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load customers.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
