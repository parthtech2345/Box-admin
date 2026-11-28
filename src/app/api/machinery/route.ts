import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  DEFAULT_MACHINERY_BANNER,
  DEFAULT_MACHINERY_INTRO,
  DEFAULT_MACHINERY_GRID_HEADER,
  DEFAULT_MACHINERY_WHY_MATTERS,
  DEFAULT_MACHINERY_CTA,
  DEFAULT_MACHINERY_SEO,
  DEFAULT_MACHINERY_ITEMS,
  DEFAULT_FULL_MACHINERY_DATA,
  MachineItem,
  FullMachineryData,
} from "@/lib/defaultMachineryData";

const CACHE_FILE = path.resolve(process.cwd(), "data", "machinery_cache.json");

async function readCache(): Promise<FullMachineryData> {
  try {
    const data = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_FULL_MACHINERY_DATA;
  }
}

async function writeCache(cacheData: FullMachineryData) {
  try {
    await writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write machinery cache file:", e);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const slug = searchParams.get("slug");

    const db = await getDb();
    const cache = await readCache();

    // 1. Single machine by slug
    if (slug) {
      if (db) {
        try {
          const item = await db.collection("website_machinery_items").findOne({ slug });
          if (item) {
            const { _id, ...clean } = item;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find machine error:", dbErr);
        }
      }
      const foundInCache = cache.items?.find((m: MachineItem) => m.slug === slug);
      if (foundInCache) {
        return NextResponse.json({ success: true, data: foundInCache });
      }
      const foundInDefaults = DEFAULT_MACHINERY_ITEMS.find((m) => m.slug === slug);
      if (foundInDefaults) {
        return NextResponse.json({ success: true, data: foundInDefaults });
      }
      return NextResponse.json({ success: false, message: "Machine not found" }, { status: 404 });
    }

    // 2. Banner section
    if (section === "banner") {
      if (db) {
        try {
          const bannerDoc = await db.collection("website_machinery_settings").findOne({ sectionId: "banner" });
          if (bannerDoc) {
            const { _id, ...clean } = bannerDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find banner error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.banner || DEFAULT_MACHINERY_BANNER });
    }

    // 3. Intro section
    if (section === "intro") {
      if (db) {
        try {
          const introDoc = await db.collection("website_machinery_settings").findOne({ sectionId: "intro" });
          if (introDoc) {
            const { _id, ...clean } = introDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find intro error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.intro || DEFAULT_MACHINERY_INTRO });
    }

    // 4. Grid header section
    if (section === "grid-header" || section === "gridHeader") {
      if (db) {
        try {
          const gridDoc = await db.collection("website_machinery_settings").findOne({ sectionId: "grid-header" });
          if (gridDoc) {
            const { _id, ...clean } = gridDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find grid header error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.gridHeader || DEFAULT_MACHINERY_GRID_HEADER });
    }

    // 5. Why matters / Operational advantage section
    if (section === "why-matters" || section === "whyMatters") {
      if (db) {
        try {
          const whyDoc = await db.collection("website_machinery_settings").findOne({ sectionId: "why-matters" });
          if (whyDoc) {
            const { _id, ...clean } = whyDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find why-matters error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.whyMatters || DEFAULT_MACHINERY_WHY_MATTERS });
    }

    // 6. CTA section
    if (section === "cta") {
      if (db) {
        try {
          const ctaDoc = await db.collection("website_machinery_settings").findOne({ sectionId: "cta" });
          if (ctaDoc) {
            const { _id, ...clean } = ctaDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find cta error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.cta || DEFAULT_MACHINERY_CTA });
    }

    // 7. SEO section
    if (section === "seo") {
      if (db) {
        try {
          const seoDoc = await db.collection("website_machinery_settings").findOne({ sectionId: "seo" });
          if (seoDoc) {
            const { _id, ...clean } = seoDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find seo error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.seo || DEFAULT_MACHINERY_SEO });
    }

    // 8. Items only
    if (section === "items") {
      if (db) {
        try {
          const items = await db.collection("website_machinery_items").find({}).toArray();
          if (items && items.length > 0) {
            const clean = items.map(({ _id, ...rest }) => rest);
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find all items error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.items || DEFAULT_MACHINERY_ITEMS });
    }

    // Default: Return full machinery data
    return NextResponse.json({ success: true, data: cache });
  } catch (error: any) {
    console.error("GET /api/machinery error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, action, data, items, id, slug } = body;

    const db = await getDb();
    const cache = await readCache();
    const now = new Date().toISOString();

    // ACTION: Save individual machine
    if (action === "save-item") {
      const itemData: MachineItem = {
        ...data,
        updatedAt: now,
      };

      if (!itemData.slug) {
        return NextResponse.json({ success: false, message: "Machine slug is required" }, { status: 400 });
      }

      // Update in MongoDB
      if (db) {
        try {
          await db.collection("website_machinery_items").updateOne(
            { slug: itemData.slug },
            { $set: itemData },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("MongoDB update machine item error:", dbErr);
        }
      }

      // Update in cache
      const existingItems = cache.items || DEFAULT_MACHINERY_ITEMS;
      const index = existingItems.findIndex((m) => m.slug === itemData.slug || m.id === itemData.id);
      if (index >= 0) {
        existingItems[index] = itemData;
      } else {
        existingItems.push(itemData);
      }
      cache.items = existingItems;
      await writeCache(cache);

      return NextResponse.json({ success: true, data: itemData, message: "Machine saved successfully" });
    }

    // ACTION: Delete individual machine
    if (action === "delete-item") {
      const targetSlug = slug || (id ? cache.items?.find((m) => m.id === id)?.slug : undefined);
      if (!targetSlug && !id) {
        return NextResponse.json({ success: false, message: "Machine slug or ID is required" }, { status: 400 });
      }

      if (db && targetSlug) {
        try {
          await db.collection("website_machinery_items").deleteOne({ slug: targetSlug });
        } catch (dbErr) {
          console.error("MongoDB delete machine error:", dbErr);
        }
      }

      cache.items = (cache.items || DEFAULT_MACHINERY_ITEMS).filter(
        (m) => m.slug !== targetSlug && m.id !== id
      );
      await writeCache(cache);

      return NextResponse.json({ success: true, message: "Machine deleted successfully" });
    }

    // ACTION: Bulk Save all machines
    if (action === "save-all-items") {
      const allItems: MachineItem[] = items || [];
      if (db) {
        try {
          await db.collection("website_machinery_items").deleteMany({});
          if (allItems.length > 0) {
            await db.collection("website_machinery_items").insertMany(allItems.map((item) => ({ ...item, updatedAt: now })));
          }
        } catch (dbErr) {
          console.error("MongoDB save all machines error:", dbErr);
        }
      }
      cache.items = allItems;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: allItems, message: "All machines updated successfully" });
    }

    // SECTIONS UPDATE
    if (section === "banner") {
      const bannerData = { ...data, updatedAt: now };
      if (db) {
        try {
          await db.collection("website_machinery_settings").updateOne(
            { sectionId: "banner" },
            { $set: { sectionId: "banner", ...bannerData } },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("MongoDB update banner error:", dbErr);
        }
      }
      cache.banner = bannerData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: bannerData, message: "Machinery Banner saved successfully" });
    }

    if (section === "intro") {
      const introData = { ...data, updatedAt: now };
      if (db) {
        try {
          await db.collection("website_machinery_settings").updateOne(
            { sectionId: "intro" },
            { $set: { sectionId: "intro", ...introData } },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("MongoDB update intro error:", dbErr);
        }
      }
      cache.intro = introData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: introData, message: "Intro section saved successfully" });
    }

    if (section === "grid-header" || section === "gridHeader") {
      const gridHeaderData = { ...data, updatedAt: now };
      if (db) {
        try {
          await db.collection("website_machinery_settings").updateOne(
            { sectionId: "grid-header" },
            { $set: { sectionId: "grid-header", ...gridHeaderData } },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("MongoDB update grid-header error:", dbErr);
        }
      }
      cache.gridHeader = gridHeaderData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: gridHeaderData, message: "Grid header saved successfully" });
    }

    if (section === "why-matters" || section === "whyMatters") {
      const whyMattersData = { ...data, updatedAt: now };
      if (db) {
        try {
          await db.collection("website_machinery_settings").updateOne(
            { sectionId: "why-matters" },
            { $set: { sectionId: "why-matters", ...whyMattersData } },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("MongoDB update why-matters error:", dbErr);
        }
      }
      cache.whyMatters = whyMattersData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: whyMattersData, message: "Why Matters section saved successfully" });
    }

    if (section === "cta") {
      const ctaData = { ...data, updatedAt: now };
      if (db) {
        try {
          await db.collection("website_machinery_settings").updateOne(
            { sectionId: "cta" },
            { $set: { sectionId: "cta", ...ctaData } },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("MongoDB update cta error:", dbErr);
        }
      }
      cache.cta = ctaData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: ctaData, message: "Consultation CTA saved successfully" });
    }

    if (section === "seo") {
      const seoData = { ...data, updatedAt: now };
      if (db) {
        try {
          await db.collection("website_machinery_settings").updateOne(
            { sectionId: "seo" },
            { $set: { sectionId: "seo", ...seoData } },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("MongoDB update seo error:", dbErr);
        }
      }
      cache.seo = seoData;
      await writeCache(cache);
      return NextResponse.json({ success: true, data: seoData, message: "SEO Settings saved successfully" });
    }

    return NextResponse.json({ success: false, message: "Invalid section or action parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/machinery error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
