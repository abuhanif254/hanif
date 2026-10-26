import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdOrToken } from "../../../lib/oms-service";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token || token.trim().length < 16) {
    return NextResponse.json(
      { success: false, error: "A valid cryptographic client access token is required." },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderByIdOrToken(token.trim());

    if (!order) {
      return NextResponse.json(
        { success: false, error: "No matching engagement order found for this token." },
        { status: 404 }
      );
    }

    // Return client-safe order view (scrub internal notes from customer)
    const clientSafeOrder = {
      orderNumber: order.orderNumber,
      title: order.title,
      serviceTier: order.serviceTier,
      status: order.status,
      paymentStatus: order.paymentStatus,
      currency: order.currency,
      subtotalAmount: order.subtotalAmount,
      taxAmount: order.taxAmount,
      totalAmount: order.totalAmount,
      amountPaid: order.amountPaid,
      startDate: order.startDate,
      targetCompletionDate: order.targetCompletionDate,
      sowDocumentUrl: order.sowDocumentUrl,
      milestones: order.milestones,
      customer: order.customer
        ? {
            companyName: order.customer.companyName,
            primaryContactName: order.customer.primaryContactName,
            email: order.customer.email,
          }
        : undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json({
      success: true,
      order: clientSafeOrder,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load order tracker.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
