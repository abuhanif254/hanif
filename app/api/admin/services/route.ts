import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../lib/admin-auth";
import {
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  toggleServicePopular,
  reorderServices,
} from "../../../lib/portfolio-store";
import { dispatchNotification } from "../../../lib/notification-service";

export async function GET(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const services = await getAllServicesAdmin();
    return NextResponse.json({
      success: true,
      services,
      totalCount: services.length,
      activeCount: services.filter((s) => s.isActive).length,
      popularCount: services.filter((s) => s.isPopular).length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load services.";
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
    if (!body.title || !body.priceDisplay) {
      return NextResponse.json(
        { success: false, error: "Service title and priceDisplay are required." },
        { status: 400 }
      );
    }

    const service = await createService(body);

    await dispatchNotification({
      type: "ORDER_CREATED",
      title: `Engineering Service Created: ${service.title}`,
      description: `New service published in category ${service.category || "systems-architecture"} at ${service.priceDisplay}`,
      data: {
        clientName: "Admin",
        clientEmail: "admin@abuhanifmia.com",
        url: `/services/${service.slug}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      service,
      message: "Service successfully created.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create service.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await isRequestAuthorized(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required for update." },
        { status: 400 }
      );
    }

    const updated = await updateService(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service: updated,
      message: "Service successfully updated.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update service.";
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
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required for deletion." },
        { status: 400 }
      );
    }

    const deleted = await deleteService(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? "Service deleted successfully." : "Service not found.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete service.";
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
    const { action, id, orderedIds } = body;

    if (action === "toggle_active" && id) {
      const updated = await toggleServiceActive(id);
      return NextResponse.json({ success: Boolean(updated), service: updated });
    }

    if (action === "toggle_popular" && id) {
      const updated = await toggleServicePopular(id);
      return NextResponse.json({ success: Boolean(updated), service: updated });
    }

    if (action === "reorder" && Array.isArray(orderedIds)) {
      const services = await reorderServices(orderedIds);
      return NextResponse.json({ success: true, services });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to perform patch operation.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
