import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { isRequestAuthorized } from "../../lib/admin-auth";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// Strict raster image formats only (SVG excluded to prevent stored XSS)
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function detectMagicBytesMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // GIF: GIF87a or GIF89a (47 49 46 38 37/39 61)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "image/gif";
  }

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function sanitizeFilename(originalName: string, verifiedMime: string): string {
  const rawExt = path.extname(originalName);
  const safeExt = MIME_TO_EXT[verifiedMime] || ".png";
  const baseName = path
    .basename(originalName, rawExt)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
  return `${Date.now()}-${baseName || "project-asset"}${safeExt}`;
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
      `File "${file.name}" has an unsupported format (${file.type}). Allowed: JPG, PNG, WebP, GIF.`
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const verifiedMime = detectMagicBytesMime(buffer);
  if (!verifiedMime || !ALLOWED_MIME_TYPES.has(verifiedMime)) {
    throw new Error(
      `File "${file.name}" failed binary signature verification. Only genuine PNG, JPG, WebP, and GIF images are permitted.`
    );
  }

  const cleanFilename = sanitizeFilename(file.name, verifiedMime);

  // 1. Attempt Supabase Storage Upload if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from("project-assets")
        .upload(cleanFilename, buffer, {
          contentType: verifiedMime,
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("Supabase storage exception, falling back to local disk:", msg);
    }
  }

  // 2. Fallback to Local Persistent Disk (/public/uploads/projects/)
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
    await mkdir(uploadDir, { recursive: true });
    const diskPath = path.join(uploadDir, cleanFilename);
    await writeFile(diskPath, buffer);

    return {
      url: `/uploads/projects/${cleanFilename}`,
      filename: cleanFilename,
      size: file.size,
      storage: "local",
    };
  } catch (fsErr: unknown) {
    const msg = fsErr instanceof Error ? fsErr.message : String(fsErr);
    console.error("Local disk write error:", fsErr);
    throw new Error(`Failed to save file on server disk: ${msg}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isRequestAuthorized(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

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
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during image upload.";
    console.error("Upload API route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
