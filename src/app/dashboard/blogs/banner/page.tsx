"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ChevronRight,
  FileText,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_BLOG_BANNER,
  DEFAULT_BLOG_DETAIL_BANNER,
  BlogBannerData,
  BlogDetailBannerData,
} from "@/lib/defaultBlogData";

export default function BlogBannerEditorPage() {
  const [activeTab, setActiveTab] = useState<"listing" | "detail">("listing");
  const [listingBanner, setListingBanner] = useState<BlogBannerData>(DEFAULT_BLOG_BANNER);
  const [detailBanner, setDetailBanner] = useState<BlogDetailBannerData>(DEFAULT_BLOG_DETAIL_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadBanners() {
      try {
        setLoading(true);
        const [listingRes, detailRes] = await Promise.all([
          fetch("/api/blogs?section=banner"),
          fetch("/api/blogs?section=detail-banner"),
        ]);
        const listingJson = await listingRes.json();
        const detailJson = await detailRes.json();

        if (isMounted) {
          if (listingJson.success && listingJson.data) {
            setListingBanner(listingJson.data);
          }
          if (detailJson.success && detailJson.data) {
            setDetailBanner(detailJson.data);
          }
        }
      } catch (err: any) {
        console.error("Failed to load blog banner configs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveListing = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "banner", data: listingBanner }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Listing Hero Banner saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save listing banner config");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save listing banner config" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDetail = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "detail-banner", data: detailBanner }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Blog Detail Page Banner saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save detail banner config");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save detail banner config" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Blogs Banner Configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Blogs</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              Banners Configuration
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Hero &amp; Detail Page Banners
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure the hero panorama and mascot dialogue on the main blogs listing page, or the top banner displayed on every individual article detail page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={activeTab === "listing" ? handleSaveListing : handleSaveDetail}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save {activeTab === "listing" ? "Listing Banner" : "Detail Banner"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#E4DED3] text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("listing")}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "listing"
              ? "bg-white text-[#E97835] shadow-xs"
              : "text-[#687378] hover:text-[#202A2E]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Listing Page Hero Banner &amp; Mascot (/blogs)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("detail")}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "detail"
              ? "bg-white text-[#E97835] shadow-xs"
              : "text-[#687378] hover:text-[#202A2E]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Blog Detail Page Banner (/blogs/[slug])</span>
        </button>
      </div>

      {/* TAB 1: LISTING HERO BANNER */}
      {activeTab === "listing" && (
        <div className="space-y-6">
          {/* Live Desktop Banner Preview */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E97835]" />
                <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                  Live Listing Banner Preview
                </h2>
              </div>
              <span className="text-[11px] text-[#687378] font-mono">
                Exact 1:1 Rendering of Website Hero
              </span>
            </div>

            <div className="relative w-full h-[220px] sm:h-[260px] rounded-xl overflow-hidden bg-[#202A2E] text-white shadow-inner">
              <Image
                src={listingBanner.backgroundImage || "/blog/blog_banner_pano.png"}
                alt={listingBanner.backgroundImageAlt || "Blogs Banner Preview"}
                fill
                className="object-cover object-center pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#202A2E]/95 via-[#202A2E]/65 to-transparent w-full sm:w-1/2 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

              {/* Banner Content Layout */}
              <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none">
                {/* Upper: Title & Breadcrumbs */}
                <div className="max-w-md pointer-events-auto">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow-md">
                    {listingBanner.title || "Blogs & Insights"}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#F5F2EB]/90 mt-1">
                    <span>{listingBanner.breadcrumbRoot || "Home"}</span>
                    <ChevronRight className="w-3 h-3 text-[#D1B48C]" />
                    <span className="text-[#D1B48C] font-semibold">
                      {listingBanner.breadcrumbCurrent || "Blogs"}
                    </span>
                  </div>
                </div>

                {/* Lower: Author Mascot & Speech Bubble */}
                <div className="flex items-end gap-3 pointer-events-auto">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0">
                    <Image
                      src={listingBanner.characterImage || "/blog/character_blog_author.png"}
                      alt={listingBanner.characterAlt || "Packaging Author Mascot"}
                      fill
                      className="object-contain object-bottom drop-shadow-xl"
                    />
                  </div>

                  <div className="relative max-w-xs mb-2">
                    <div className="px-3.5 py-2.5 rounded-xl bg-[#202A2E]/85 backdrop-blur-md border border-white/20 text-white shadow-xl">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm">{listingBanner.dialogueIcon || "📚"}</span>
                        <h4 className="font-heading font-extrabold text-xs sm:text-sm text-white">
                          {listingBanner.dialogueTitle || "Packaging Insights & Trends!"}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#D1B48C] font-medium leading-tight">
                        {listingBanner.dialogueSubtext || "Technical guides, GSM calculations & industry knowledge"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-[#E4DED3] pb-3">
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#E97835]" />
                  <span>Background Banner &amp; Copy</span>
                </h2>
              </div>

              <div className="space-y-4">
                <MediaUploader
                  label="Banner Background Panorama"
                  value={listingBanner.backgroundImage}
                  mediaType="image"
                  allowedTypes={["image"]}
                  onChange={(url) => setListingBanner({ ...listingBanner, backgroundImage: url })}
                />

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Background Image Alt Text (SEO)
                  </label>
                  <input
                    type="text"
                    value={listingBanner.backgroundImageAlt}
                    onChange={(e) => setListingBanner({ ...listingBanner, backgroundImageAlt: e.target.value })}
                    placeholder="Blogs Banner - AAVRIT PACKAGING"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Page Headline
                  </label>
                  <input
                    type="text"
                    value={listingBanner.title}
                    onChange={(e) => setListingBanner({ ...listingBanner, title: e.target.value })}
                    placeholder="Blogs & Insights"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Breadcrumb Root
                    </label>
                    <input
                      type="text"
                      value={listingBanner.breadcrumbRoot}
                      onChange={(e) => setListingBanner({ ...listingBanner, breadcrumbRoot: e.target.value })}
                      placeholder="Home"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Breadcrumb Current
                    </label>
                    <input
                      type="text"
                      value={listingBanner.breadcrumbCurrent}
                      onChange={(e) => setListingBanner({ ...listingBanner, breadcrumbCurrent: e.target.value })}
                      placeholder="Blogs"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-[#E4DED3] pb-3">
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E97835]" />
                  <span>Technical Author Mascot</span>
                </h2>
              </div>

              <div className="space-y-4">
                <MediaUploader
                  label="Author Character Cutout"
                  value={listingBanner.characterImage}
                  mediaType="image"
                  allowedTypes={["image"]}
                  onChange={(url) => setListingBanner({ ...listingBanner, characterImage: url })}
                />

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Icon Emoji
                    </label>
                    <input
                      type="text"
                      value={listingBanner.dialogueIcon}
                      onChange={(e) => setListingBanner({ ...listingBanner, dialogueIcon: e.target.value })}
                      placeholder="📚"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-center text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Dialogue Heading
                    </label>
                    <input
                      type="text"
                      value={listingBanner.dialogueTitle}
                      onChange={(e) => setListingBanner({ ...listingBanner, dialogueTitle: e.target.value })}
                      placeholder="Packaging Insights & Trends!"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Speech Bubble Subtext
                  </label>
                  <textarea
                    rows={3}
                    value={listingBanner.dialogueSubtext}
                    onChange={(e) => setListingBanner({ ...listingBanner, dialogueSubtext: e.target.value })}
                    placeholder="Technical guides, GSM calculations & industry knowledge"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAIL BANNER */}
      {activeTab === "detail" && (
        <div className="space-y-6">
          {/* Live Detail Banner Preview */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E97835]" />
                <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                  Live Detail Page Banner Preview
                </h2>
              </div>
              <span className="text-[11px] text-[#687378] font-mono">
                Rendered on /blogs/[slug]
              </span>
            </div>

            <div className="relative w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden bg-[#202A2E] text-white shadow-inner">
              <Image
                src={detailBanner.backgroundImage || "/blog/blog_banner_pano.png"}
                alt={detailBanner.backgroundImageAlt || "Blog Details Banner Preview"}
                fill
                className="object-cover object-center pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#202A2E]/85 via-[#202A2E]/55 to-transparent w-full sm:w-1/2 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute inset-0 flex items-center p-6 sm:p-8">
                <div className="max-w-md">
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md mb-2">
                    {detailBanner.title || "Blog Details"}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#F5F2EB]/90">
                    <span>{detailBanner.breadcrumbRoot || "Home"}</span>
                    <ChevronRight className="w-3 h-3 text-[#D1B48C]" />
                    <span>Blogs</span>
                    <ChevronRight className="w-3 h-3 text-[#D1B48C]" />
                    <span className="text-[#D1B48C] font-semibold">
                      {detailBanner.breadcrumbCurrent || "Blog Details"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
            <div className="border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                Blog Detail Page Banner Configuration
              </h2>
            </div>

            <div className="space-y-4">
              <MediaUploader
                label="Detail Page Background Panorama"
                value={detailBanner.backgroundImage}
                mediaType="image"
                allowedTypes={["image"]}
                onChange={(url) => setDetailBanner({ ...detailBanner, backgroundImage: url })}
              />

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Background Image Alt Text
                </label>
                <input
                  type="text"
                  value={detailBanner.backgroundImageAlt}
                  onChange={(e) => setDetailBanner({ ...detailBanner, backgroundImageAlt: e.target.value })}
                  placeholder="Blog Details Banner - AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Banner Headline
                </label>
                <input
                  type="text"
                  value={detailBanner.title}
                  onChange={(e) => setDetailBanner({ ...detailBanner, title: e.target.value })}
                  placeholder="Blog Details"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Breadcrumb Root
                  </label>
                  <input
                    type="text"
                    value={detailBanner.breadcrumbRoot}
                    onChange={(e) => setDetailBanner({ ...detailBanner, breadcrumbRoot: e.target.value })}
                    placeholder="Home"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Breadcrumb Current
                  </label>
                  <input
                    type="text"
                    value={detailBanner.breadcrumbCurrent}
                    onChange={(e) => setDetailBanner({ ...detailBanner, breadcrumbCurrent: e.target.value })}
                    placeholder="Blog Details"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
