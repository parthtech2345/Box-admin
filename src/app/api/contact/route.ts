import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  DEFAULT_CONTACT_HERO,
  DEFAULT_CONTACT_INFO_CARDS,
  DEFAULT_CONTACT_INQUIRY_FORM,
  DEFAULT_CONTACT_LOCATION_MAP,
  DEFAULT_WHY_CONTACT_US,
  DEFAULT_CONTACT_FAQS,
  DEFAULT_CONTACT_SEO,
} from "@/lib/defaultContactData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "contact_cache.json");

async function readCache() {
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      hero: DEFAULT_CONTACT_HERO,
      infoCards: DEFAULT_CONTACT_INFO_CARDS,
      inquiryForm: DEFAULT_CONTACT_INQUIRY_FORM,
      locationMap: DEFAULT_CONTACT_LOCATION_MAP,
      whyConnect: DEFAULT_WHY_CONTACT_US,
      faqs: DEFAULT_CONTACT_FAQS,
      seo: DEFAULT_CONTACT_SEO,
    };
  }
}

async function writeCache(data: any) {
  try {
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write contact local cache:", err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  try {
    const db = await getDb();

    if (section) {
      if (db) {
        try {
          const found = await db.collection("contact_sections").findOne({ sectionId: section });
          if (found) {
            const { _id, ...clean } = found;
            return NextResponse.json({ success: true, data: clean, source: "mongodb" });
          }
        } catch (e) {
          // fallback
        }
      }

      const cache = await readCache();
      const sectionKeyMap: Record<string, string> = {
        banner: "hero",
        hero: "hero",
        "info-cards": "infoCards",
        "inquiry-form": "inquiryForm",
        "location-map": "locationMap",
        "why-connect": "whyConnect",
        faqs: "faqs",
        seo: "seo",
      };
      const key = sectionKeyMap[section] || section;
      const data = cache[key] || null;

      if (data) {
        return NextResponse.json({ success: true, data, source: "cache" });
      }

      // Default fallbacks
      const fallbackMap: Record<string, any> = {
        hero: DEFAULT_CONTACT_HERO,
        infoCards: DEFAULT_CONTACT_INFO_CARDS,
        inquiryForm: DEFAULT_CONTACT_INQUIRY_FORM,
        locationMap: DEFAULT_CONTACT_LOCATION_MAP,
        whyConnect: DEFAULT_WHY_CONTACT_US,
        faqs: DEFAULT_CONTACT_FAQS,
        seo: DEFAULT_CONTACT_SEO,
      };

      return NextResponse.json({
        success: true,
        data: fallbackMap[key] || DEFAULT_CONTACT_HERO,
        source: "default",
      });
    }

    // All sections
    if (db) {
      try {
        const docs = await db.collection("contact_sections").find({}).toArray();
        if (docs && docs.length > 0) {
          const result: Record<string, any> = {};
          docs.forEach((doc) => {
            if (doc.sectionId) {
              const { _id, ...clean } = doc;
              result[doc.sectionId] = clean;
            }
          });
          return NextResponse.json({ success: true, data: result, source: "mongodb" });
        }
      } catch (e) {
        // fallback
      }
    }

    const cache = await readCache();
    return NextResponse.json({ success: true, data: cache, source: "cache" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, message: "Missing section or data payload" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const cache = await readCache();
    const db = await getDb();

    const sectionKeyMap: Record<string, string> = {
      banner: "hero",
      hero: "hero",
      "info-cards": "infoCards",
      "inquiry-form": "inquiryForm",
      "location-map": "locationMap",
      "why-connect": "whyConnect",
      faqs: "faqs",
      seo: "seo",
    };
    const key = sectionKeyMap[section] || section;

    const recordToSave = {
      ...data,
      sectionId: section,
      updatedAt: timestamp,
    };

    if (db) {
      try {
        await db.collection("contact_sections").updateOne(
          { sectionId: section },
          { $set: recordToSave },
          { upsert: true }
        );
      } catch (e) {
        console.warn("MongoDB contact section save warning:", e);
      }
    }

    cache[key] = recordToSave;
    await writeCache(cache);

    return NextResponse.json({
      success: true,
      message: `Section ${section} updated successfully`,
      data: recordToSave,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
