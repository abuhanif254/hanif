import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../lib/admin-auth";
import {
  getAllInquiriesAdmin,
  updateInquiryStatus,
  deleteInquiry,
} from "../../../lib/portfolio-store";

export async function GET(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const inquiries = await getAllInquiriesAdmin();
    return NextResponse.json({
      success: true,
      inquiries,
      totalCount: inquiries.length,
      newCount: inquiries.filter((i) => i.status === "new").length,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load inquiries.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Inquiry ID is required." },
        { status: 400 }
      );
    }

    if (!status || typeof status !== "string") {
      return NextResponse.json(
        { success: false, error: "Inquiry status is required." },
        { status: 400 }
      );
    }

    const updated = await updateInquiryStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: updated,
      message: `Inquiry status updated to '${status}'.`,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update inquiry.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Inquiry ID is required for deletion." },
        { status: 400 }
      );
    }

    const deleted = await deleteInquiry(id);
    return NextResponse.json({
      success: deleted,
      message: deleted
        ? "Inquiry record deleted successfully."
        : "Inquiry not found.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete inquiry.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
