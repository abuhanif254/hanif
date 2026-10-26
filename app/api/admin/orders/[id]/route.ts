import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../../lib/admin-auth";
import {
  getOrderByIdOrToken,
  updateOrder,
  deleteOrder,
} from "../../../../lib/oms-service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const order = await getOrderByIdOrToken(id);

  if (!order) {
    return NextResponse.json(
      { success: false, error: `Order ${id} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, order });
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  try {
    const body = await req.json();
    const updated = await updateOrder(id, body, "Admin");
    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order.";
    return NextResponse.json({ success: false, error: message }, { status: 422 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const deleted = await deleteOrder(id, "Admin");

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: `Order ${id} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: `Order ${id} deleted.` });
}
