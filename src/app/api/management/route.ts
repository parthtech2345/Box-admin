import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { DEFAULT_MANAGEMENT_DATA, ManagementData } from "@/lib/defaultManagementData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "site_management_cache.json");

// Helper to read local cache
async function readLocalCache(): Promise<ManagementData> {
  try {
    const content = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { ...DEFAULT_MANAGEMENT_DATA };
  }
}

// Helper to write local cache
async function writeLocalCache(data: ManagementData) {
  try {
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write site management local cache:", e);
  }
}

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection("site_management");
      const found = await collection.findOne({ type: "global" });
      if (found) {
        const { _id, type, ...clean } = found;
        return NextResponse.json({ success: true, data: clean, source: "mongodb" });
      }
    }
  } catch (err) {
    console.warn("MongoDB unavailable in GET /api/management, using fallback cache:", err);
  }

  // Fallback to local cache
  const cached = await readLocalCache();
  return NextResponse.json({ success: true, data: cached, source: "cache" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await readLocalCache();

    const dataToSave: ManagementData = {
      logo: {
        ...DEFAULT_MANAGEMENT_DATA.logo,
        ...current.logo,
        ...(body.logo || {}),
      },
      navbar: {
        ...DEFAULT_MANAGEMENT_DATA.navbar,
        ...current.navbar,
        ...(body.navbar || {}),
        navLinks: body.navbar?.navLinks || current.navbar?.navLinks || DEFAULT_MANAGEMENT_DATA.navbar.navLinks,
      },
      footer: {
        ...DEFAULT_MANAGEMENT_DATA.footer,
        ...current.footer,
        ...(body.footer || {}),
        socialLinks: {
          ...DEFAULT_MANAGEMENT_DATA.footer.socialLinks,
          ...current.footer?.socialLinks,
          ...(body.footer?.socialLinks || {}),
        },
        quickLinks: body.footer?.quickLinks || current.footer?.quickLinks || DEFAULT_MANAGEMENT_DATA.footer.quickLinks,
        productLinks: body.footer?.productLinks || current.footer?.productLinks || DEFAULT_MANAGEMENT_DATA.footer.productLinks,
        legalLinks: body.footer?.legalLinks || current.footer?.legalLinks || DEFAULT_MANAGEMENT_DATA.footer.legalLinks,
      },
      updatedAt: new Date().toISOString(),
    };

    // 1. Try to persist to MongoDB
    try {
      const db = await getDb();
      if (db) {
        const collection = db.collection("site_management");
        await collection.updateOne(
          { type: "global" },
          { $set: { ...dataToSave, type: "global" } },
          { upsert: true }
        );
      }
    } catch (e) {
      console.warn("Could not save management data to MongoDB:", e);
    }

    // 2. Always persist to local cache file
    await writeLocalCache(dataToSave);

    return NextResponse.json({
      success: true,
      data: dataToSave,
      message: "Site management configuration updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save management settings" },
      { status: 500 }
    );
  }
}
