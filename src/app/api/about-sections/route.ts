import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { DEFAULT_ABOUT_DATA } from "@/lib/defaultAboutData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const BACKUP_FILE = path.join(process.cwd(), "data", "about_sections_cache.json");

// Helper to read backup cache
async function readLocalCache(): Promise<Record<string, any>> {
  try {
    const content = await readFile(BACKUP_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { ...DEFAULT_ABOUT_DATA };
  }
}

// Helper to write backup cache
async function writeLocalCache(data: Record<string, any>) {
  try {
    await mkdir(path.dirname(BACKUP_FILE), { recursive: true });
    await writeFile(BACKUP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write about local cache:", e);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");

  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection("about_sections");

      if (sectionId) {
        const found = await collection.findOne({ sectionId });
        if (found) {
          const { _id, ...clean } = found;
          return NextResponse.json({ success: true, data: clean, source: "mongodb" });
        }
        // Fallback to default
        const defaultSec = DEFAULT_ABOUT_DATA[sectionId] || { sectionId };
        return NextResponse.json({ success: true, data: defaultSec, source: "defaults" });
      }

      // Return all sections
      const allDocs = await collection.find({}).toArray();
      const merged: Record<string, any> = { ...DEFAULT_ABOUT_DATA };

      allDocs.forEach((doc) => {
        if (doc.sectionId) {
          const { _id, ...clean } = doc;
          merged[doc.sectionId] = clean;
        }
      });

      return NextResponse.json({ success: true, data: merged, source: "mongodb" });
    }
  } catch (err) {
    console.warn("MongoDB unavailable in GET /api/about-sections, using fallback:", err);
  }

  // Fallback to local cache or defaults
  const cached = await readLocalCache();
  if (sectionId) {
    return NextResponse.json({
      success: true,
      data: cached[sectionId] || DEFAULT_ABOUT_DATA[sectionId] || { sectionId },
      source: "cache",
    });
  }

  return NextResponse.json({ success: true, data: cached, source: "cache" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, data, action } = body;

    // Handle full initial seed
    if (action === "seed") {
      const db = await getDb();
      if (db) {
        const collection = db.collection("about_sections");
        for (const [key, val] of Object.entries(DEFAULT_ABOUT_DATA)) {
          await collection.updateOne(
            { sectionId: key },
            { $set: { ...val, updatedAt: new Date().toISOString() } },
            { upsert: true }
          );
        }
      }
      await writeLocalCache(DEFAULT_ABOUT_DATA);
      return NextResponse.json({ success: true, message: "All about sections seeded successfully" });
    }

    if (!sectionId || !data) {
      return NextResponse.json(
        { success: false, message: "Missing sectionId or data" },
        { status: 400 }
      );
    }

    const payload = {
      ...data,
      sectionId,
      updatedAt: new Date().toISOString(),
    };

    // Update MongoDB
    let mongoSaved = false;
    try {
      const db = await getDb();
      if (db) {
        const collection = db.collection("about_sections");
        await collection.updateOne(
          { sectionId },
          { $set: payload },
          { upsert: true }
        );
        mongoSaved = true;
      }
    } catch (e) {
      console.warn("Could not save to MongoDB:", e);
    }

    // Always persist to local cache as reliable backup
    const cached = await readLocalCache();
    cached[sectionId] = payload;
    await writeLocalCache(cached);

    return NextResponse.json({
      success: true,
      message: `Section '${sectionId}' saved successfully`,
      data: payload,
      savedToMongo: mongoSaved,
    });
  } catch (error: any) {
    console.error("Save about section error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save about section" },
      { status: 500 }
    );
  }
}
