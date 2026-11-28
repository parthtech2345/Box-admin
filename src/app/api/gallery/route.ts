import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  DEFAULT_GALLERY_DATA,
  GalleryPageData,
} from "@/lib/defaultGalleryData";

const CACHE_FILE = path.resolve(process.cwd(), "data", "gallery_cache.json");

async function readCache(): Promise<GalleryPageData> {
  try {
    const data = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_GALLERY_DATA;
  }
}

async function writeCache(cacheData: GalleryPageData) {
  try {
    await writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write gallery cache file:", e);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || searchParams.get("sectionId");

    const db = await getDb();
    const cache = await readCache();

    const sectionKeyMap: Record<string, keyof GalleryPageData> = {
      banner: "banner",
      hero: "banner",
      showcase: "showcase",
      items: "showcase",
      cta: "cta",
      seo: "seo",
    };

    if (section && section !== "all") {
      const canonicalKey = sectionKeyMap[section] || (section as keyof GalleryPageData);

      if (db) {
        try {
          const doc = await db.collection("website_gallery_settings").findOne({ sectionId: section });
          if (doc) {
            const { _id, ...clean } = doc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error(`MongoDB find gallery section "${section}" error:`, dbErr);
        }
      }

      if (canonicalKey && cache[canonicalKey]) {
        return NextResponse.json({ success: true, data: cache[canonicalKey] });
      }

      if (canonicalKey && DEFAULT_GALLERY_DATA[canonicalKey]) {
        return NextResponse.json({ success: true, data: DEFAULT_GALLERY_DATA[canonicalKey] });
      }

      return NextResponse.json({ success: false, message: `Section "${section}" not found` }, { status: 404 });
    }

    // Return all sections
    let allData: GalleryPageData = { ...cache };
    if (db) {
      try {
        const docs = await db.collection("website_gallery_settings").find({}).toArray();
        if (docs && docs.length > 0) {
          docs.forEach(({ _id, sectionId, ...clean }) => {
            const key = sectionKeyMap[sectionId] || (sectionId as keyof GalleryPageData);
            if (key) {
              (allData as any)[key] = clean;
            }
          });
        }
      } catch (dbErr) {
        console.error("MongoDB get all gallery settings error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: allData });
  } catch (error: any) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectionId, data } = body;

    if (!sectionId || !data) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: sectionId, data" },
        { status: 400 }
      );
    }

    const sectionKeyMap: Record<string, keyof GalleryPageData> = {
      banner: "banner",
      hero: "banner",
      showcase: "showcase",
      items: "showcase",
      cta: "cta",
      seo: "seo",
    };

    const canonicalKey = sectionKeyMap[sectionId] || (sectionId as keyof GalleryPageData);
    const db = await getDb();
    const payload = {
      ...data,
      sectionId,
      updatedAt: new Date().toISOString(),
    };

    let savedToMongo = false;
    if (db) {
      try {
        await db.collection("website_gallery_settings").updateOne(
          { sectionId },
          { $set: payload },
          { upsert: true }
        );
        savedToMongo = true;
      } catch (dbErr) {
        console.error("MongoDB update error, falling back to JSON cache:", dbErr);
      }
    }

    // Update JSON Cache
    const cache = await readCache();
    if (canonicalKey) {
      (cache as any)[canonicalKey] = payload;
      await writeCache(cache);
    }

    return NextResponse.json({
      success: true,
      message: `Gallery ${sectionId} updated successfully`,
      savedToMongo,
      data: payload,
    });
  } catch (error: any) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
