import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { DEFAULT_PRODUCT_BANNER, ProductBannerCMS } from "@/lib/defaultProductData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const BACKUP_FILE = path.join(process.cwd(), "data", "product_banner_cache.json");

async function readLocalCache(): Promise<ProductBannerCMS> {
  try {
    const content = await readFile(BACKUP_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { ...DEFAULT_PRODUCT_BANNER };
  }
}

async function writeLocalCache(data: ProductBannerCMS) {
  try {
    await mkdir(path.dirname(BACKUP_FILE), { recursive: true });
    await writeFile(BACKUP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write product banner cache:", e);
  }
}

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection("product_banner");
      const found = await collection.findOne({ type: "hero-banner" });
      if (found) {
        const { _id, type, ...clean } = found;
        return NextResponse.json({ success: true, data: clean, source: "mongodb" });
      }
    }

    const cached = await readLocalCache();
    return NextResponse.json({ success: true, data: cached, source: "cache" });
  } catch (error: any) {
    const cached = await readLocalCache();
    return NextResponse.json({
      success: true,
      data: cached,
      source: "cache",
      error: error.message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bannerData: ProductBannerCMS = body.data || body;

    const dataWithTimestamp: ProductBannerCMS = {
      ...bannerData,
      updatedAt: new Date().toISOString(),
    };

    // Save to MongoDB
    try {
      const db = await getDb();
      if (db) {
        const collection = db.collection("product_banner");
        await collection.updateOne(
          { type: "hero-banner" },
          { $set: { type: "hero-banner", ...dataWithTimestamp } },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn("MongoDB product banner update warning:", dbErr);
    }

    // Save to local cache
    await writeLocalCache(dataWithTimestamp);

    return NextResponse.json({
      success: true,
      data: dataWithTimestamp,
      message: "Product Banner saved successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
