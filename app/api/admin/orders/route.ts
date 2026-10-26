import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../lib/admin-auth";
import {
  getOrders,
  getCustomers,
  createOrder,
  calculatePipelineMetrics,
} from "../../../lib/oms-service";

export async function GET(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const [orders, customers] = await Promise.all([getOrders(), getCustomers()]);
    const metrics = calculatePipelineMetrics(orders, customers);

    return NextResponse.json({
      success: true,
      orders,
      metrics,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load orders.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const newOrder = await createOrder(body, "Admin");

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create order.";
    return NextResponse.json({ success: false, error: message }, { status: 422 });
  }
}
