import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../lib/admin-auth";
import {
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublished,
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
    const projects = await getAllProjectsAdmin();
    return NextResponse.json({
      success: true,
      projects,
      totalCount: projects.length,
      publishedCount: projects.filter((p) => p.published).length,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load projects.";
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
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { success: false, error: "Project title is required." },
        { status: 400 }
      );
    }

    const project = await createProject(body);

    await dispatchNotification({
      type: "ORDER_CREATED",
      title: `Portfolio Project Added: ${project.title}`,
      description: `New project published with slug /projects/${project.slug} (${project.priceTag})`,
      data: {
        clientName: project.clientName,
        url: `/projects/${project.slug}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      project,
      message: "Project successfully added to portfolio and database.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create project.";
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
        { success: false, error: "Project ID is required for update." },
        { status: 400 }
      );
    }

    const updated = await updateProject(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project: updated,
      message: "Project successfully updated in database.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update project.";
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
    const { action, id } = body;

    if (action === "toggle_published" && id) {
      const updated = await toggleProjectPublished(id);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Project not found." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, project: updated });
    }

    if (id) {
      const updated = await updateProject(id, body);
      return NextResponse.json({ success: Boolean(updated), project: updated });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to perform patch operation.";
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required for deletion." },
        { status: 400 }
      );
    }

    const deleted = await deleteProject(id);
    return NextResponse.json({
      success: deleted,
      message: deleted
        ? "Project deleted from portfolio and database."
        : "Project not found.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete project.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
