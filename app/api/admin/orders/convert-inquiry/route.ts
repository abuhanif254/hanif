import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../../lib/admin-auth";
import {
  convertInquiryToOrderPayload,
  createOrder,
} from "../../../../lib/oms-service";
import { dispatchNotification } from "../../../../lib/notification-service";

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
    const { inquiry, customAmount } = body;

    if (!inquiry || !inquiry.name || !inquiry.email) {
      return NextResponse.json(
        { success: false, error: "Valid inquiry details are required for conversion." },
        { status: 400 }
      );
    }

    const payload = convertInquiryToOrderPayload(inquiry, customAmount ? Number(customAmount) : undefined);
    const createdOrder = await createOrder(payload, "Admin (Lead Converter)");

    await dispatchNotification({
      type: "ORDER_CREATED",
      title: `Inquiry Converted to Order: ${createdOrder.orderNumber}`,
      description: `Inbound lead '${inquiry.name}' converted to formal contract order ($${createdOrder.totalAmount.toLocaleString()} ${createdOrder.currency}).`,
      data: {
        orderNumber: createdOrder.orderNumber,
        companyName: createdOrder.customer?.companyName,
        clientName: createdOrder.customer?.primaryContactName,
        email: createdOrder.customer?.email,
        totalAmount: createdOrder.totalAmount,
        currency: createdOrder.currency,
        serviceTier: createdOrder.serviceTier,
        trackerUrl: `/orders/tracker?token=${createdOrder.clientAccessToken}`,
      },
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        message: `Inquiry successfully converted to Order ${createdOrder.orderNumber}!`,
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Conversion failed.";
    return NextResponse.json({ success: false, error: message }, { status: 422 });
  }
}
