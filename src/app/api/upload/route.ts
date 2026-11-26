import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique prefix
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(originalName).toLowerCase();
    const timestamp = Date.now();
    const fileName = `${timestamp}_${originalName}`;

    // Target upload directories
    const adminUploadDir = path.join(process.cwd(), "public", "uploads");
    const websiteUploadDir = path.resolve(process.cwd(), "..", "Box-website", "public", "uploads");

    // Ensure directories exist
    await mkdir(adminUploadDir, { recursive: true });
    try {
      await mkdir(websiteUploadDir, { recursive: true });
    } catch (e) {
      // If Box-website path fails, continue
    }

    // Save in Admin public/uploads
    await writeFile(path.join(adminUploadDir, fileName), buffer);

    // Also mirror to Box-website public/uploads so the website displays it instantly
    try {
      await writeFile(path.join(websiteUploadDir, fileName), buffer);
    } catch (e) {
      console.warn("Could not mirror file to Box-website uploads directory:", e);
    }

    // Determine media type
    let mediaType = "image";
    if (ext === ".mp4" || ext === ".webm" || ext === ".ogg" || ext === ".mov") {
      mediaType = "video";
    } else if (ext === ".gif") {
      mediaType = "gif";
    }

    const relativeUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      fileName,
      mediaType,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
