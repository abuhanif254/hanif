import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "../../../lib/admin-auth";
import {
  getAllBlogPostsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogPostPublished,
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
    const posts = await getAllBlogPostsAdmin();
    return NextResponse.json({
      success: true,
      posts,
      totalCount: posts.length,
      publishedCount: posts.filter((p) => p.isPublished).length,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load blog posts.";
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
        { success: false, error: "Article title is required." },
        { status: 400 }
      );
    }

    const post = await createBlogPost(body);

    await dispatchNotification({
      type: "ORDER_CREATED",
      title: `Technical Article Published: ${post.title}`,
      description: `New article published with slug /blog/${post.slug} (${post.readingTimeMinutes} min read)`,
      data: {
        url: `/blog/${post.slug}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      post,
      message: "Article published to technical blog and database.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create article.";
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
        { success: false, error: "Article ID is required for update." },
        { status: 400 }
      );
    }

    const updated = await updateBlogPost(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Article not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: updated,
      message: "Article successfully updated in database.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update article.";
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
      const updated = await toggleBlogPostPublished(id);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Article not found." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, post: updated });
    }

    if (id) {
      const updated = await updateBlogPost(id, body);
      return NextResponse.json({ success: Boolean(updated), post: updated });
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
        { success: false, error: "Article ID is required for deletion." },
        { status: 400 }
      );
    }

    const deleted = await deleteBlogPost(id);
    return NextResponse.json({
      success: deleted,
      message: deleted
        ? "Article deleted from technical blog and database."
        : "Article not found.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete article.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
