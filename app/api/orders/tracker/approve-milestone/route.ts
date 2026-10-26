import { NextRequest, NextResponse } from "next/server";
import { approveOrderMilestone } from "../../../../lib/oms-service";
import { dispatchNotification } from "../../../../lib/notification-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, milestoneId, approverName, notes } = body;

    if (!token || typeof token !== "string" || token.trim().length < 16) {
      return NextResponse.json(
        { success: false, error: "A valid cryptographic access token is required." },
        { status: 400 }
      );
    }

    if (!milestoneId || typeof milestoneId !== "string") {
      return NextResponse.json(
        { success: false, error: "Milestone ID is required." },
        { status: 400 }
      );
    }

    if (!approverName || typeof approverName !== "string" || approverName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Full legal name or title is required for milestone sign-off." },
        { status: 400 }
      );
    }

    const clientIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const result = await approveOrderMilestone(
      token.trim(),
      milestoneId.trim(),
      approverName.trim(),
      notes,
      clientIp
    );

    await dispatchNotification({
      type: "MILESTONE_APPROVED",
      title: `Milestone Phase ${result.milestone.milestoneIndex} Signed Off: ${result.order.orderNumber}`,
      description: `${approverName} formally approved Phase ${result.milestone.milestoneIndex} (${result.milestone.title}) deliverables ($${result.milestone.amount.toLocaleString()} USD).`,
      data: {
        orderNumber: result.order.orderNumber,
        milestoneIndex: result.milestone.milestoneIndex,
        phaseTitle: result.milestone.title,
        approverName,
        signatureHash: result.milestone.approvalSignatureHash,
        ipAddress: clientIp,
        amount: result.milestone.amount,
        orderStatus: result.order.status,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Milestone Phase ${result.milestone.milestoneIndex} successfully approved.`,
      milestone: result.milestone,
      order: {
        orderNumber: result.order.orderNumber,
        status: result.order.status,
        completedAt: result.order.completedAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process milestone approval." },
      { status: 400 }
    );
  }
}
