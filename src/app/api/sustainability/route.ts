import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  DEFAULT_SUSTAINABILITY_DATA,
  SustainabilityPageData,
} from "@/lib/defaultSustainabilityData";

const CACHE_FILE = path.resolve(process.cwd(), "data", "sustainability_cache.json");

async function readCache(): Promise<SustainabilityPageData> {
  try {
    const data = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_SUSTAINABILITY_DATA;
  }
}

async function writeCache(cacheData: SustainabilityPageData) {
  try {
    await writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write sustainability cache file:", e);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || searchParams.get("sectionId");

    const db = await getDb();
    const cache = await readCache();

    // Map section aliases
    const sectionKeyMap: Record<string, keyof SustainabilityPageData> = {
      banner: "banner",
      intro: "intro",
      difference: "difference",
      advantages: "difference",
      manufacturing: "manufacturing",
      stages: "manufacturing",
      solutions: "solutions",
      "waste-reduction": "wasteReduction",
      wasteReduction: "wasteReduction",
      faqs: "faqs",
      faq: "faqs",
      cta: "cta",
      seo: "seo",
    };

    if (section && section !== "all") {
      const canonicalKey = sectionKeyMap[section] || (section as keyof SustainabilityPageData);

      if (db) {
        try {
          const doc = await db.collection("website_sustainability_settings").findOne({ sectionId: section });
          if (doc) {
            const { _id, ...clean } = doc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error(`MongoDB find sustainability section "${section}" error:`, dbErr);
        }
      }

      if (canonicalKey && cache[canonicalKey]) {
        return NextResponse.json({ success: true, data: cache[canonicalKey] });
      }

      if (canonicalKey && DEFAULT_SUSTAINABILITY_DATA[canonicalKey]) {
        return NextResponse.json({ success: true, data: DEFAULT_SUSTAINABILITY_DATA[canonicalKey] });
      }

      return NextResponse.json({ success: false, message: `Section "${section}" not found` }, { status: 404 });
    }

    // Return all sections
    let allData: SustainabilityPageData = { ...cache };
    if (db) {
      try {
        const docs = await db.collection("website_sustainability_settings").find({}).toArray();
        if (docs && docs.length > 0) {
          docs.forEach(({ _id, sectionId, ...clean }) => {
            const key = sectionKeyMap[sectionId] || (sectionId as keyof SustainabilityPageData);
            if (key) {
              (allData as any)[key] = clean;
            }
          });
        }
      } catch (dbErr) {
        console.error("MongoDB get all sustainability settings error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: allData });
  } catch (error: any) {
    console.error("GET /api/sustainability error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch sustainability data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const section = body.section || body.sectionId;
    const data = body.data || body;

    if (!section) {
      return NextResponse.json({ success: false, message: "Missing section identifier" }, { status: 400 });
    }

    const sectionKeyMap: Record<string, keyof SustainabilityPageData> = {
      banner: "banner",
      intro: "intro",
      difference: "difference",
      advantages: "difference",
      manufacturing: "manufacturing",
      stages: "manufacturing",
      solutions: "solutions",
      "waste-reduction": "wasteReduction",
      wasteReduction: "wasteReduction",
      faqs: "faqs",
      faq: "faqs",
      cta: "cta",
      seo: "seo",
    };

    const canonicalKey = sectionKeyMap[section] || (section as keyof SustainabilityPageData);
    const now = new Date().toISOString();
    const updatedData = { ...data, updatedAt: now };

    const db = await getDb();
    if (db) {
      try {
        await db.collection("website_sustainability_settings").updateOne(
          { sectionId: section },
          { $set: { sectionId: section, ...updatedData } },
          { upsert: true }
        );
      } catch (dbErr) {
        console.error(`MongoDB save sustainability section "${section}" error:`, dbErr);
      }
    }

    // Update Cache
    const cache = await readCache();
    if (canonicalKey) {
      (cache as any)[canonicalKey] = updatedData;
      await writeCache(cache);
    }

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: `Sustainability section "${section}" saved successfully`,
    });
  } catch (error: any) {
    console.error("POST /api/sustainability error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update sustainability data" },
      { status: 500 }
    );
  }
}
