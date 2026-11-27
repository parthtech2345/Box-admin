import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  DEFAULT_CUSTOM_PACKAGING_DATA,
  CUSTOM_PACKAGING_SECTIONS_LIST,
} from "@/lib/defaultCustomPackagingData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const BACKUP_FILE = path.join(process.cwd(), "data", "custom_packaging_cache.json");

async function readLocalCache(): Promise<Record<string, any>> {
  try {
    const content = await readFile(BACKUP_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { ...DEFAULT_CUSTOM_PACKAGING_DATA };
  }
}

async function writeLocalCache(data: Record<string, any>) {
  try {
    await mkdir(path.dirname(BACKUP_FILE), { recursive: true });
    await writeFile(BACKUP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write custom packaging local cache:", e);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");

  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection("custom_packaging");

      if (sectionId) {
        const found = await collection.findOne({ sectionId });
        if (found) {
          const { _id, ...clean } = found;
          return NextResponse.json({ success: true, data: clean, source: "mongodb" });
        }
        const defaultSec = DEFAULT_CUSTOM_PACKAGING_DATA[sectionId] || { sectionId };
        return NextResponse.json({ success: true, data: defaultSec, source: "defaults" });
      }

      // Return all sections
      const allDocs = await collection.find({}).toArray();
      const merged: Record<string, any> = { ...DEFAULT_CUSTOM_PACKAGING_DATA };
      allDocs.forEach((doc) => {
        if (doc.sectionId) {
          const { _id, ...clean } = doc;
          merged[doc.sectionId] = clean;
        }
      });

      return NextResponse.json({ success: true, data: merged, source: "mongodb" });
    }

    // Fallback to local cache / defaults
    const cached = await readLocalCache();
    if (sectionId) {
      const data = cached[sectionId] || DEFAULT_CUSTOM_PACKAGING_DATA[sectionId] || { sectionId };
      return NextResponse.json({ success: true, data, source: "cache" });
    }

    return NextResponse.json({ success: true, data: cached, source: "cache" });
  } catch (error: any) {
    const cached = await readLocalCache();
    if (sectionId) {
      const data = cached[sectionId] || DEFAULT_CUSTOM_PACKAGING_DATA[sectionId] || { sectionId };
      return NextResponse.json({ success: true, data, source: "cache", error: error.message });
    }
    return NextResponse.json({ success: true, data: cached, source: "cache", error: error.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionId, data } = body;

    if (!sectionId || !data) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: sectionId and data" },
        { status: 400 }
      );
    }

    const dataWithTimestamp = {
      ...data,
      sectionId,
      updatedAt: new Date().toISOString(),
    };

    // Update in MongoDB
    try {
      const db = await getDb();
      if (db) {
        const collection = db.collection("custom_packaging");
        await collection.updateOne(
          { sectionId },
          { $set: dataWithTimestamp },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn("MongoDB custom packaging update warning:", dbErr);
    }

    // Update local cache
    const currentCache = await readLocalCache();
    currentCache[sectionId] = dataWithTimestamp;
    await writeLocalCache(currentCache);

    return NextResponse.json({
      success: true,
      data: dataWithTimestamp,
      message: "Custom packaging section saved successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
