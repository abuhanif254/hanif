import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName) || ".png";
  const baseName = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
  return `${Date.now()}-${baseName || "project-asset"}${ext.toLowerCase()}`;
}

async function processSingleFile(file: File): Promise<{
  url: string;
  filename: string;
  size: number;
  storage: "supabase" | "local";
}> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File "${file.name}" exceeds the maximum allowed size of 10MB.`);
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(
      `File "${file.name}" has an unsupported format (${file.type}). Allowed: JPG, PNG, WebP, GIF, SVG.`
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cleanFilename = sanitizeFilename(file.name);

  // 1. Attempt Supabase Storage Upload if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from("project-assets")
        .upload(cleanFilename, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from("project-assets")
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            filename: cleanFilename,
            size: file.size,
            storage: "supabase",
          };
        }
      } else {
        console.warn("Supabase storage upload returned error, falling back to local disk:", error?.message);
      }
    } catch (err: any) {
      console.warn("Supabase storage exception, falling back to local disk:", err?.message);
    }
  }

  // 2. Fallback to Local Persistent Disk (/public/uploads/projects/)
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
    const diskPath = path.join(uploadDir, cleanFilename);
    await writeFile(diskPath, buffer);

    return {
      url: `/uploads/projects/${cleanFilename}`,
      filename: cleanFilename,
      size: file.size,
      storage: "local",
    };
  } catch (fsErr: any) {
    console.error("Local disk write error:", fsErr);
    throw new Error(`Failed to save file on server disk: ${fsErr.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Check for multiple files or single file
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const filesToProcess: File[] = [];
    if (files && files.length > 0) {
      for (const f of files) {
        if (f && typeof f === "object" && "name" in f && f.size > 0) {
          filesToProcess.push(f);
        }
      }
    } else if (singleFile && singleFile.size > 0) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid image files provided." },
        { status: 400 }
      );
    }

    const results = [];
    for (const file of filesToProcess) {
      const uploaded = await processSingleFile(file);
      results.push(uploaded);
    }

    return NextResponse.json({
      success: true,
      url: results[0].url,
      filename: results[0].filename,
      size: results[0].size,
      storage: results[0].storage,
      files: results,
    });
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during image upload.",
      },
      { status: 500 }
    );
  }
}
