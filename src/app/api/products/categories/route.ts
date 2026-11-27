import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { DEFAULT_PRODUCT_CATEGORIES, ProductCategoryCMS } from "@/lib/defaultProductData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const BACKUP_FILE = path.join(process.cwd(), "data", "product_categories_cache.json");

async function readLocalCache(): Promise<ProductCategoryCMS[]> {
  try {
    const content = await readFile(BACKUP_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [...DEFAULT_PRODUCT_CATEGORIES];
  }
}

async function writeLocalCache(data: ProductCategoryCMS[]) {
  try {
    await mkdir(path.dirname(BACKUP_FILE), { recursive: true });
    await writeFile(BACKUP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write categories local cache:", e);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection("product_categories");

      if (id || slug) {
        const query = id ? { id } : { slug };
        const found = await collection.findOne(query);
        if (found) {
          const { _id, ...clean } = found;
          return NextResponse.json({ success: true, data: clean, source: "mongodb" });
        }
        const defaultCat = DEFAULT_PRODUCT_CATEGORIES.find((c) => (id ? c.id === id : c.slug === slug));
        if (defaultCat) {
          return NextResponse.json({ success: true, data: defaultCat, source: "defaults" });
        }
        return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
      }

      const allDocs = await collection.find({}).sort({ order: 1 }).toArray();
      if (allDocs && allDocs.length > 0) {
        const cleanDocs = allDocs.map(({ _id, ...rest }) => rest as ProductCategoryCMS);
        return NextResponse.json({ success: true, data: cleanDocs, source: "mongodb" });
      }
    }

    // Fallback to cache / defaults
    const cached = await readLocalCache();
    if (id || slug) {
      const found = cached.find((c) => (id ? c.id === id : c.slug === slug));
      if (found) {
        return NextResponse.json({ success: true, data: found, source: "cache" });
      }
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cached, source: "cache" });
  } catch (error: any) {
    const cached = await readLocalCache();
    return NextResponse.json({ success: true, data: cached, source: "cache", error: error.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category: ProductCategoryCMS = body.category || body;

    if (!category.id || !category.title) {
      return NextResponse.json({ success: false, message: "Missing required fields: id and title" }, { status: 400 });
    }

    const categoryWithMeta: ProductCategoryCMS = {
      ...category,
      updatedAt: new Date().toISOString(),
    };

    // Update in MongoDB
    try {
      const db = await getDb();
      if (db) {
        const collection = db.collection("product_categories");
        await collection.updateOne(
          { id: categoryWithMeta.id },
          { $set: categoryWithMeta },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn("MongoDB update warning:", dbErr);
    }

    // Update local cache
    const currentCache = await readLocalCache();
    const existingIndex = currentCache.findIndex((c) => c.id === categoryWithMeta.id);
    let updatedList: ProductCategoryCMS[];

    if (existingIndex >= 0) {
      updatedList = [...currentCache];
      updatedList[existingIndex] = categoryWithMeta;
    } else {
      updatedList = [...currentCache, categoryWithMeta];
    }

    updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
    await writeLocalCache(updatedList);

    return NextResponse.json({
      success: true,
      data: categoryWithMeta,
      message: "Category saved successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Category ID required" }, { status: 400 });
    }

    // Delete in MongoDB
    try {
      const db = await getDb();
      if (db) {
        await db.collection("product_categories").deleteOne({ id });
      }
    } catch (e) {
      console.warn("MongoDB delete warning:", e);
    }

    // Delete in cache
    const currentCache = await readLocalCache();
    const updated = currentCache.filter((c) => c.id !== id);
    await writeLocalCache(updated);

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
