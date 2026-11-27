import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { DEFAULT_PRODUCTS, ProductItemCMS } from "@/lib/defaultProductData";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const BACKUP_FILE = path.join(process.cwd(), "data", "products_cache.json");

async function readLocalCache(): Promise<ProductItemCMS[]> {
  try {
    const content = await readFile(BACKUP_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [...DEFAULT_PRODUCTS];
  }
}

async function writeLocalCache(data: ProductItemCMS[]) {
  try {
    await mkdir(path.dirname(BACKUP_FILE), { recursive: true });
    await writeFile(BACKUP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write products local cache:", e);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const categoryId = searchParams.get("categoryId");

  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection("products");

      if (id || slug) {
        const query = id ? { id } : { slug };
        const found = await collection.findOne(query);
        if (found) {
          const { _id, ...clean } = found;
          return NextResponse.json({ success: true, data: clean, source: "mongodb" });
        }
        const defaultProd = DEFAULT_PRODUCTS.find((p) => (id ? p.id === id : p.slug === slug));
        if (defaultProd) {
          return NextResponse.json({ success: true, data: defaultProd, source: "defaults" });
        }
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
      }

      const query = categoryId ? { categoryId } : {};
      const allDocs = await collection.find(query).sort({ order: 1 }).toArray();
      if (allDocs && allDocs.length > 0) {
        const cleanDocs = allDocs.map(({ _id, ...rest }) => rest as ProductItemCMS);
        return NextResponse.json({ success: true, data: cleanDocs, source: "mongodb" });
      }
    }

    // Fallback to local cache / defaults
    const cached = await readLocalCache();
    if (id || slug) {
      const found = cached.find((p) => (id ? p.id === id : p.slug === slug));
      if (found) {
        return NextResponse.json({ success: true, data: found, source: "cache" });
      }
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    let results = cached;
    if (categoryId) {
      results = results.filter((p) => p.categoryId === categoryId);
    }
    return NextResponse.json({ success: true, data: results, source: "cache" });
  } catch (error: any) {
    const cached = await readLocalCache();
    let results = cached;
    if (categoryId) {
      results = results.filter((p) => p.categoryId === categoryId);
    }
    return NextResponse.json({ success: true, data: results, source: "cache", error: error.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product: ProductItemCMS = body.product || body;

    if (!product.id || !product.name || !product.categoryId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: id, name, and categoryId" },
        { status: 400 }
      );
    }

    const productWithMeta: ProductItemCMS = {
      ...product,
      updatedAt: new Date().toISOString(),
    };

    // Update in MongoDB
    try {
      const db = await getDb();
      if (db) {
        const collection = db.collection("products");
        await collection.updateOne(
          { id: productWithMeta.id },
          { $set: productWithMeta },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn("MongoDB product update warning:", dbErr);
    }

    // Update local cache
    const currentCache = await readLocalCache();
    const existingIndex = currentCache.findIndex((p) => p.id === productWithMeta.id);
    let updatedList: ProductItemCMS[];

    if (existingIndex >= 0) {
      updatedList = [...currentCache];
      updatedList[existingIndex] = productWithMeta;
    } else {
      updatedList = [...currentCache, productWithMeta];
    }

    updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
    await writeLocalCache(updatedList);

    return NextResponse.json({
      success: true,
      data: productWithMeta,
      message: "Product saved successfully",
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
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    // Delete in MongoDB
    try {
      const db = await getDb();
      if (db) {
        await db.collection("products").deleteOne({ id });
      }
    } catch (e) {
      console.warn("MongoDB delete warning:", e);
    }

    // Delete in cache
    const currentCache = await readLocalCache();
    const updated = currentCache.filter((p) => p.id !== id);
    await writeLocalCache(updated);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
