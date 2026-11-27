import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  DEFAULT_INDUSTRIES_BANNER,
  DEFAULT_INDUSTRIES_LANDING,
  DEFAULT_INDUSTRIES_LIST,
  IndustryItem,
} from "@/lib/defaultIndustryData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "industries_cache.json");

async function readCache() {
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      banner: DEFAULT_INDUSTRIES_BANNER,
      landing: DEFAULT_INDUSTRIES_LANDING,
      items: DEFAULT_INDUSTRIES_LIST,
    };
  }
}

async function writeCache(data: any) {
  try {
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write industries local cache:", err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "banner" | "landing" | "items"
  const slug = searchParams.get("slug");

  try {
    const db = await getDb();

    // 1. Single industry detail query
    if (slug) {
      if (db) {
        const found = await db.collection("industries").findOne({ slug });
        if (found) {
          const { _id, ...clean } = found;
          return NextResponse.json({ success: true, data: clean, source: "mongodb" });
        }
      }
      const cache = await readCache();
      const match = (cache.items || DEFAULT_INDUSTRIES_LIST).find((i: IndustryItem) => i.slug === slug);
      if (match) {
        return NextResponse.json({ success: true, data: match, source: "cache" });
      }
      return NextResponse.json({ success: false, message: "Industry not found" }, { status: 404 });
    }

    // 2. Banner query
    if (type === "banner") {
      if (db) {
        const found = await db.collection("industry_sections").findOne({ sectionId: "banner" });
        if (found) {
          const { _id, ...clean } = found;
          return NextResponse.json({ success: true, data: clean, source: "mongodb" });
        }
      }
      const cache = await readCache();
      return NextResponse.json({
        success: true,
        data: cache.banner || DEFAULT_INDUSTRIES_BANNER,
        source: "cache",
      });
    }

    // 3. Landing sections query
    if (type === "landing") {
      if (db) {
        const found = await db.collection("industry_sections").findOne({ sectionId: "landing" });
        if (found) {
          const { _id, ...clean } = found;
          return NextResponse.json({ success: true, data: clean, source: "mongodb" });
        }
      }
      const cache = await readCache();
      return NextResponse.json({
        success: true,
        data: cache.landing || DEFAULT_INDUSTRIES_LANDING,
        source: "cache",
      });
    }

    // 4. Default: all industries list
    if (db) {
      const allDocs = await db.collection("industries").find({}).toArray();
      if (allDocs && allDocs.length > 0) {
        const cleanList = allDocs.map(({ _id, ...rest }) => rest);
        return NextResponse.json({ success: true, data: cleanList, source: "mongodb" });
      }
    }

    const cache = await readCache();
    return NextResponse.json({
      success: true,
      data: cache.items || DEFAULT_INDUSTRIES_LIST,
      source: "cache",
    });
  } catch (error: any) {
    const cache = await readCache();
    if (slug) {
      const match = (cache.items || DEFAULT_INDUSTRIES_LIST).find((i: IndustryItem) => i.slug === slug);
      return NextResponse.json({ success: Boolean(match), data: match, source: "cache" });
    }
    if (type === "banner") {
      return NextResponse.json({ success: true, data: cache.banner || DEFAULT_INDUSTRIES_BANNER, source: "cache" });
    }
    if (type === "landing") {
      return NextResponse.json({ success: true, data: cache.landing || DEFAULT_INDUSTRIES_LANDING, source: "cache" });
    }
    return NextResponse.json({ success: true, data: cache.items || DEFAULT_INDUSTRIES_LIST, source: "cache" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, slug, data } = body;

    if (!data) {
      return NextResponse.json({ success: false, message: "Missing data payload" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const cache = await readCache();
    const db = await getDb();

    // A. Update Banner
    if (type === "banner") {
      const bannerData = { ...data, sectionId: "banner", updatedAt: timestamp };
      if (db) {
        try {
          await db.collection("industry_sections").updateOne(
            { sectionId: "banner" },
            { $set: bannerData },
            { upsert: true }
          );
        } catch (e) {
          console.warn("MongoDB industry banner save warning:", e);
        }
      }
      cache.banner = bannerData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: bannerData, message: "Banner updated successfully" });
    }

    // B. Update Landing Sections
    if (type === "landing") {
      const landingData = { ...data, sectionId: "landing", updatedAt: timestamp };
      if (db) {
        try {
          await db.collection("industry_sections").updateOne(
            { sectionId: "landing" },
            { $set: landingData },
            { upsert: true }
          );
        } catch (e) {
          console.warn("MongoDB industry landing save warning:", e);
        }
      }
      cache.landing = landingData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: landingData, message: "Landing content updated successfully" });
    }

    // C. Update/Upsert Single Industry Item
    const targetSlug = slug || data.slug;
    if (!targetSlug) {
      return NextResponse.json({ success: false, message: "Industry slug is required" }, { status: 400 });
    }

    const itemData = {
      ...data,
      slug: targetSlug,
      updatedAt: timestamp,
    };

    if (db) {
      try {
        await db.collection("industries").updateOne(
          { slug: targetSlug },
          { $set: itemData },
          { upsert: true }
        );
      } catch (e) {
        console.warn("MongoDB industry item save warning:", e);
      }
    }

    // Update cache
    const currentItems: IndustryItem[] = cache.items || [...DEFAULT_INDUSTRIES_LIST];
    const existingIndex = currentItems.findIndex((i) => i.slug === targetSlug);
    if (existingIndex >= 0) {
      currentItems[existingIndex] = itemData;
    } else {
      currentItems.push(itemData);
    }
    cache.items = currentItems;
    await writeCache(cache);

    return NextResponse.json({
      success: true,
      data: itemData,
      message: `Industry ${itemData.name || targetSlug} saved successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
