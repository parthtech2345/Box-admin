"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_GALLERY_DATA,
  GalleryBannerData,
} from "@/lib/defaultGalleryData";

export default function GalleryBannerPage() {
  const [data, setData] = useState<GalleryBannerData>(DEFAULT_GALLERY_DATA.banner!);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/gallery?section=banner");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        console.error("Failed to load banner settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: "banner",
          data,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage(json.message || "Failed to save banner settings.");
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#687378]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#A65D32]" />
          <span>Loading Panoramic Banner Editor...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4DED3]">
        <div className="space-y-1">
          <Link
            href="/dashboard/gallery"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#A65D32] hover:underline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Gallery Overview</span>
          </Link>
          <h1 className="font-heading font-extrabold text-2xl text-[#202A2E]">
            Hero Banner &amp; Speaking Mascot
          </h1>
          <p className="text-xs text-[#687378]">
            Configure the panoramic background image, title, breadcrumbs, and speaking curator mascot.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="http://localhost:3000/gallery"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E4DED3] text-xs font-bold text-[#202A2E] hover:bg-[#FAF9F5] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#687378]" />
            <span>Preview Live</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#A65D32] hover:bg-[#8f4f29] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Banner"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Banner settings saved and live in MongoDB &amp; website cache!</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Interactive Hero Preview Card */}
      <div className="bg-[#202A2E] rounded-2xl overflow-hidden border border-[#344247] shadow-lg relative text-white">
        <div className="relative w-full h-56 sm:h-64 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.backgroundImage || "/Gallery/gallery_banner_pano.png"}
            alt={data.backgroundImageAlt || "Banner preview"}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "http://localhost:3000/Gallery/gallery_banner_pano.png";
            }}
          />

          {/* Vignette gradients matching live website */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#202A2E]/95 via-[#202A2E]/65 to-transparent w-full sm:w-2/3 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Foreground content layout */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 pointer-events-none">
            {/* Upper text */}
            <div className="max-w-md pointer-events-auto">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md">
                {data.title || "Packaging Gallery"}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[#F5F2EB]/90 mt-1">
                <span>{data.breadcrumbRoot || "Home"}</span>
                <span>&gt;</span>
                <span className="text-[#D1B48C] font-semibold">{data.breadcrumbCurrent || "Gallery"}</span>
              </div>
            </div>

            {/* Speaking mascot bubble preview */}
            <div className="flex items-end gap-3 pointer-events-auto">
              <div className="w-14 sm:w-16 h-20 sm:h-22 relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.characterImage || "/Gallery/character_gallery_curator.png"}
                  alt={data.characterAlt || "Mascot"}
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "http://localhost:3000/Gallery/character_gallery_curator.png";
                  }}
                />
              </div>

              <div className="bg-white/95 backdrop-blur-xs text-[#202A2E] rounded-xl px-3 py-2 shadow-lg border border-[#E4DED3] max-w-xs text-xs mb-1">
                <div className="flex items-center gap-1 font-bold text-[11px] text-[#A65D32]">
                  <span>{data.dialogueIcon || "📸"}</span>
                  <span>{data.dialogueTitle || "See Our Work in Action!"}</span>
                </div>
                <p className="text-[10px] text-[#687378] mt-0.5 leading-tight">
                  {data.dialogueSubtext || "High-finish corrugated cartons, manufacturing & machinery"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form Controls */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="font-heading font-bold text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          1. Panoramic Banner &amp; Heading
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Page Main Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
              placeholder="Packaging Gallery"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Breadcrumb Root
              </label>
              <input
                type="text"
                value={data.breadcrumbRoot}
                onChange={(e) => setData({ ...data, breadcrumbRoot: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                placeholder="Home"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Current Page
              </label>
              <input
                type="text"
                value={data.breadcrumbCurrent}
                onChange={(e) => setData({ ...data, breadcrumbCurrent: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                placeholder="Gallery"
              />
            </div>
          </div>
        </div>

        <div>
          <MediaUploader
            label="Panoramic Banner Image"
            value={data.backgroundImage || ""}
            onChange={(url) => setData({ ...data, backgroundImage: url })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
            Banner Image Alt Text (Accessibility &amp; SEO)
          </label>
          <input
            type="text"
            value={data.backgroundImageAlt || ""}
            onChange={(e) => setData({ ...data, backgroundImageAlt: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
            placeholder="AAVRIT PACKAGING Visual Gallery - Products, Machinery & Manufacturing"
          />
        </div>
      </div>

      {/* Curator Mascot Settings */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="font-heading font-bold text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#A65D32]" />
          <span>2. Speaking Curator Mascot</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Dialogue Title / Header
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.dialogueIcon}
                onChange={(e) => setData({ ...data, dialogueIcon: e.target.value })}
                className="w-14 px-2 py-2.5 rounded-xl border border-[#E4DED3] text-center text-sm outline-none"
                placeholder="📸"
                title="Mascot Emoji"
              />
              <input
                type="text"
                value={data.dialogueTitle}
                onChange={(e) => setData({ ...data, dialogueTitle: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                placeholder="See Our Work in Action!"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Dialogue Subtext Bubble
            </label>
            <input
              type="text"
              value={data.dialogueSubtext}
              onChange={(e) => setData({ ...data, dialogueSubtext: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
              placeholder="High-finish corrugated cartons, manufacturing & machinery"
            />
          </div>
        </div>

        <div>
          <MediaUploader
            label="Curator Mascot Character Image (Transparent PNG / WebP)"
            value={data.characterImage || ""}
            onChange={(url) => setData({ ...data, characterImage: url })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
            Mascot Alt Tag
          </label>
          <input
            type="text"
            value={data.characterAlt || ""}
            onChange={(e) => setData({ ...data, characterAlt: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
            placeholder="Visual Showcase Curator - AAVRIT PACKAGING"
          />
        </div>
      </div>
    </form>
  );
}
