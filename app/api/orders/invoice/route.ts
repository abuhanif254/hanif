import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdOrToken, generateInvoiceForOrder } from "../../../lib/oms-service";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const milestoneParam = req.nextUrl.searchParams.get("milestone");

  if (!token || token.trim().length < 16) {
    return NextResponse.json(
      { success: false, error: "A valid cryptographic access token is required to generate invoices." },
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

    const milestoneIndex = milestoneParam ? parseInt(milestoneParam, 10) : undefined;
    const invoice = generateInvoiceForOrder(order, order.customer, milestoneIndex);

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate invoice." },
      { status: 500 }
    );
  }
}
