import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../../lib/admin-auth";
import {
  convertInquiryToOrderPayload,
  createOrder,
} from "../../../../lib/oms-service";

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
