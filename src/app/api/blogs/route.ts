import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  DEFAULT_BLOG_BANNER,
  DEFAULT_BLOG_DETAIL_BANNER,
  DEFAULT_BLOG_LISTING_CTA,
  DEFAULT_BLOG_SEO,
  DEFAULT_BLOGS_DATA,
  BlogPost,
} from "@/lib/defaultBlogData";

const CACHE_FILE = path.resolve(process.cwd(), "data", "blogs_cache.json");

async function readCache(): Promise<any> {
  try {
    const data = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return {
      banner: DEFAULT_BLOG_BANNER,
      listingCta: DEFAULT_BLOG_LISTING_CTA,
      seo: DEFAULT_BLOG_SEO,
      articles: DEFAULT_BLOGS_DATA,
    };
  }
}

async function writeCache(cacheData: any) {
  try {
    await writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write blogs cache file:", e);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const slug = searchParams.get("slug");

    const db = await getDb();
    const cache = await readCache();

    // 1. Single article by slug
    if (slug) {
      if (db) {
        try {
          const article = await db.collection("blogs").findOne({ slug });
          if (article) {
            const { _id, ...clean } = article;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find blog error:", dbErr);
        }
      }
      const foundInCache = cache.articles?.find((a: BlogPost) => a.slug === slug);
      if (foundInCache) {
        return NextResponse.json({ success: true, data: foundInCache });
      }
      const foundInDefaults = DEFAULT_BLOGS_DATA.find((a) => a.slug === slug);
      if (foundInDefaults) {
        return NextResponse.json({ success: true, data: foundInDefaults });
      }
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    // 2. Banner section
    if (section === "banner") {
      if (db) {
        try {
          const bannerDoc = await db.collection("blogs_settings").findOne({ sectionId: "banner" });
          if (bannerDoc) {
            const { _id, ...clean } = bannerDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find banner error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.banner || DEFAULT_BLOG_BANNER });
    }

    // 2b. Detail Banner section
    if (section === "detail-banner" || section === "detailBanner") {
      if (db) {
        try {
          const bannerDoc = await db.collection("blogs_settings").findOne({ sectionId: "detail-banner" });
          if (bannerDoc) {
            const { _id, ...clean } = bannerDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find detail banner error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.detailBanner || DEFAULT_BLOG_DETAIL_BANNER });
    }

    // 3. CTA section
    if (section === "cta" || section === "listingCta") {
      if (db) {
        try {
          const ctaDoc = await db.collection("blogs_settings").findOne({ sectionId: "cta" });
          if (ctaDoc) {
            const { _id, ...clean } = ctaDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find cta error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.listingCta || DEFAULT_BLOG_LISTING_CTA });
    }

    // 4. SEO section
    if (section === "seo") {
      if (db) {
        try {
          const seoDoc = await db.collection("blogs_settings").findOne({ sectionId: "seo" });
          if (seoDoc) {
            const { _id, ...clean } = seoDoc;
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find seo error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.seo || DEFAULT_BLOG_SEO });
    }

    // 5. Articles list
    if (section === "articles" || !section) {
      if (db) {
        try {
          const articles = await db.collection("blogs").find({}).toArray();
          if (articles && articles.length > 0) {
            const clean = articles.map(({ _id, ...rest }) => rest);
            return NextResponse.json({ success: true, data: clean });
          }
        } catch (dbErr) {
          console.error("MongoDB find articles error:", dbErr);
        }
      }
      return NextResponse.json({ success: true, data: cache.articles || DEFAULT_BLOGS_DATA });
    }

    // 6. Return all data
    if (section === "all") {
      let articles = cache.articles || DEFAULT_BLOGS_DATA;
      let banner = cache.banner || DEFAULT_BLOG_BANNER;
      let listingCta = cache.listingCta || DEFAULT_BLOG_LISTING_CTA;
      let seo = cache.seo || DEFAULT_BLOG_SEO;

      if (db) {
        try {
          const dbArticles = await db.collection("blogs").find({}).toArray();
          if (dbArticles && dbArticles.length > 0) {
            articles = dbArticles.map(({ _id, ...rest }) => rest);
          }
          const dbBanner = await db.collection("blogs_settings").findOne({ sectionId: "banner" });
          if (dbBanner) {
            const { _id, ...clean } = dbBanner;
            banner = clean;
          }
          const dbCta = await db.collection("blogs_settings").findOne({ sectionId: "cta" });
          if (dbCta) {
            const { _id, ...clean } = dbCta;
            listingCta = clean;
          }
          const dbSeo = await db.collection("blogs_settings").findOne({ sectionId: "seo" });
          if (dbSeo) {
            const { _id, ...clean } = dbSeo;
            seo = clean;
          }
        } catch (dbErr) {
          console.error("MongoDB find all error:", dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          banner,
          listingCta,
          seo,
          articles,
        },
      });
    }

    return NextResponse.json({ success: false, message: "Invalid section" }, { status: 400 });
  } catch (error: any) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, message: "Missing required 'section' or 'data' payload" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const cache = await readCache();
    const now = new Date().toISOString();

    // 1. Save Banner
    if (section === "banner") {
      const bannerData = { ...data, updatedAt: now };
      if (db) {
        await db.collection("blogs_settings").updateOne(
          { sectionId: "banner" },
          { $set: { ...bannerData, sectionId: "banner" } },
          { upsert: true }
        );
      }
      cache.banner = bannerData;
      await writeCache(cache);
      return NextResponse.json({ success: true, message: "Banner saved successfully", data: bannerData });
    }

    // 1b. Save Detail Banner
    if (section === "detail-banner" || section === "detailBanner") {
      const bannerData = { ...data, updatedAt: now };
      if (db) {
        await db.collection("blogs_settings").updateOne(
          { sectionId: "detail-banner" },
          { $set: { ...bannerData, sectionId: "detail-banner" } },
          { upsert: true }
        );
      }
      cache.detailBanner = bannerData;
      await writeCache(cache);
      return NextResponse.json({ success: true, message: "Detail Banner saved successfully", data: bannerData });
    }

    // 2. Save CTA
    if (section === "cta" || section === "listingCta") {
      const ctaData = { ...data, updatedAt: now };
      if (db) {
        await db.collection("blogs_settings").updateOne(
          { sectionId: "cta" },
          { $set: { ...ctaData, sectionId: "cta" } },
          { upsert: true }
        );
      }
      cache.listingCta = ctaData;
      await writeCache(cache);
      return NextResponse.json({ success: true, message: "Listing CTA saved successfully", data: ctaData });
    }

    // 3. Save SEO
    if (section === "seo") {
      const seoData = { ...data, updatedAt: now };
      if (db) {
        await db.collection("blogs_settings").updateOne(
          { sectionId: "seo" },
          { $set: { ...seoData, sectionId: "seo" } },
          { upsert: true }
        );
      }
      cache.seo = seoData;
      await writeCache(cache);
      return NextResponse.json({ success: true, message: "SEO settings saved successfully", data: seoData });
    }

    // 4. Save Single Article (Create / Update)
    if (section === "article") {
      const articleData: BlogPost = {
        ...data,
        updatedAt: now,
      };

      if (!articleData.slug) {
        return NextResponse.json({ success: false, message: "Article slug is required" }, { status: 400 });
      }

      if (db) {
        await db.collection("blogs").updateOne(
          { slug: articleData.slug },
          { $set: articleData },
          { upsert: true }
        );
      }

      const existingIndex = cache.articles?.findIndex((a: BlogPost) => a.slug === articleData.slug);
      if (existingIndex !== undefined && existingIndex >= 0) {
        cache.articles[existingIndex] = articleData;
      } else {
        if (!cache.articles) cache.articles = [];
        cache.articles.unshift(articleData);
      }

      await writeCache(cache);
      return NextResponse.json({
        success: true,
        message: "Article saved successfully",
        data: articleData,
      });
    }

    // 5. Save Entire Articles Array (Reordering or bulk save)
    if (section === "articles") {
      const articlesArray: BlogPost[] = data;
      if (!Array.isArray(articlesArray)) {
        return NextResponse.json({ success: false, message: "Expected array for articles" }, { status: 400 });
      }

      if (db) {
        for (const item of articlesArray) {
          if (item.slug) {
            await db.collection("blogs").updateOne(
              { slug: item.slug },
              { $set: { ...item, updatedAt: now } },
              { upsert: true }
            );
          }
        }
      }

      cache.articles = articlesArray;
      await writeCache(cache);
      return NextResponse.json({
        success: true,
        message: "Articles updated successfully",
        data: articlesArray,
      });
    }

    return NextResponse.json({ success: false, message: "Unknown section type" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, message: "Article slug is required" }, { status: 400 });
    }

    const db = await getDb();
    if (db) {
      await db.collection("blogs").deleteOne({ slug });
    }

    const cache = await readCache();
    if (cache.articles) {
      cache.articles = cache.articles.filter((a: BlogPost) => a.slug !== slug);
      await writeCache(cache);
    }

    return NextResponse.json({ success: true, message: `Article '${slug}' deleted successfully` });
  } catch (error: any) {
    console.error("DELETE /api/blogs error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
