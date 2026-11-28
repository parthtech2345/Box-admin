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
  Globe,
  Share2,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_GALLERY_DATA,
  GallerySEOData,
} from "@/lib/defaultGalleryData";

export default function GallerySEOPage() {
  const [data, setData] = useState<GallerySEOData>(DEFAULT_GALLERY_DATA.seo!);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/gallery?section=seo");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        console.error("Failed to load gallery SEO settings:", e);
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
          sectionId: "seo",
          data,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage(json.message || "Failed to save SEO settings.");
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
          <span>Loading SEO Settings...</span>
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
            Gallery SEO &amp; Social Share Metadata
          </h1>
          <p className="text-xs text-[#687378]">
            Optimize search engine ranking and OpenGraph preview cards for social media platforms.
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
            <span>{saving ? "Saving Changes..." : "Save SEO"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>SEO settings saved and updated across MongoDB and live website!</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google SERP Live Snippet Preview */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#202A2E] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#A65D32]" />
            Google SERP Snippet Preview
          </span>
          <span className="text-[10px] text-[#8C7E72] font-mono">https://aavritpackaging.com/gallery</span>
        </div>

        <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E4DED3]/80 space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#202124]">
            <div className="w-4 h-4 rounded-full bg-[#E97835] flex items-center justify-center text-[10px] text-white font-bold">
              A
            </div>
            <span className="text-[11px] text-[#4d5156]">AAVRIT PACKAGING</span>
            <span className="text-[11px] text-[#5f6368]">&rsaquo; gallery</span>
          </div>

          <h3 className="text-base sm:text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
            {data.metaTitle || "Packaging Gallery | Products, Machinery & Manufacturing – AAVRIT PACKAGING"}
          </h3>

          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            {data.metaDescription ||
              "Explore AAVRIT PACKAGING's gallery featuring corrugated packaging products, custom packaging, manufacturing machinery, industries, and production processes."}
          </p>
        </div>
      </div>

      {/* Social Media Share Preview */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#202A2E] flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-[#A65D32]" />
            OpenGraph Social Card Preview
          </span>
          <span className="text-[10px] text-[#8C7E72]">1200 x 630 Ratio</span>
        </div>

        <div className="max-w-md rounded-2xl overflow-hidden border border-[#E4DED3] bg-[#FAF9F5] shadow-xs">
          <div className="relative w-full h-44 bg-white overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.ogImage || "/Gallery/Kraft Packaging Gallery Montage.png"}
              alt={data.ogImageAlt || "Social card banner"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "http://localhost:3000/Gallery/Kraft%20Packaging%20Gallery%20Montage.png";
              }}
            />
          </div>

          <div className="p-3.5 space-y-1 bg-white border-t border-[#E4DED3]">
            <span className="text-[10px] uppercase font-bold text-[#8C7E72] tracking-wider">
              aavritpackaging.com
            </span>
            <h4 className="font-heading font-bold text-xs text-[#202A2E] line-clamp-1">
              {data.metaTitle || "Packaging Gallery | Products, Machinery & Manufacturing"}
            </h4>
            <p className="text-[11px] text-[#687378] line-clamp-2 leading-relaxed">
              {data.metaDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Editor Form Controls */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="font-heading font-bold text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          Meta Tags Configuration
        </h3>

        <div>
          <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
            Meta Title Tag (Ideal: 50-60 characters)
          </label>
          <input
            type="text"
            value={data.metaTitle}
            onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
            placeholder="Packaging Gallery | Products, Machinery & Manufacturing – AAVRIT PACKAGING"
          />
          <div className="text-[10px] text-[#8C7E72] mt-1 text-right">
            {(data.metaTitle || "").length} characters
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
            Meta Description Tag (Ideal: 140-160 characters)
          </label>
          <textarea
            rows={3}
            value={data.metaDescription}
            onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none resize-none leading-relaxed"
            placeholder="Explore AAVRIT PACKAGING's gallery featuring corrugated packaging products..."
          />
          <div className="text-[10px] text-[#8C7E72] mt-1 text-right">
            {(data.metaDescription || "").length} characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Target Canonical URL
            </label>
            <input
              type="text"
              value={data.canonicalLink}
              onChange={(e) => setData({ ...data, canonicalLink: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
              placeholder="/gallery"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Meta Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={data.metaKeywords || ""}
              onChange={(e) => setData({ ...data, metaKeywords: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
              placeholder="packaging gallery, corrugated packaging showcase, custom boxes"
            />
          </div>
        </div>

        <div>
          <MediaUploader
            label="OpenGraph Social Share Image (1200 x 630 px)"
            value={data.ogImage || ""}
            onChange={(url) => setData({ ...data, ogImage: url })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
            Social Image Alt Tag
          </label>
          <input
            type="text"
            value={data.ogImageAlt || ""}
            onChange={(e) => setData({ ...data, ogImageAlt: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
            placeholder="AAVRIT PACKAGING Visual Gallery"
          />
        </div>
      </div>
    </form>
  );
}
