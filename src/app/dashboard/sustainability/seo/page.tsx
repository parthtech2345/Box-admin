"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  ChevronRight,
  ExternalLink,
  Search,
  Share2,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_SUSTAINABILITY_DATA,
  SustainabilitySEOData,
} from "@/lib/defaultSustainabilityData";

export default function SustainabilitySEOEditorPage() {
  const [data, setData] = useState<SustainabilitySEOData>(DEFAULT_SUSTAINABILITY_DATA.seo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/sustainability?section=seo");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load SEO data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/sustainability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "seo", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "SEO & Social metadata saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save SEO");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save SEO" });
    } finally {
      setSaving(false);
    }
  };

  const getMediaUrl = (val?: string) => {
    if (!val) return "";
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:") || val.startsWith("blob:") || val.startsWith("/uploads/")) {
      return val;
    }
    const websiteBase = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";
    const cleanPath = val.startsWith("/") ? val : `/${val}`;
    return `${websiteBase}${encodeURI(cleanPath)}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C989E] mb-1">
            <Link href="/dashboard/sustainability" className="hover:text-[#202A2E]">
              Sustainability
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E97835]">SEO Optimization</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Search Engine &amp; Social Share Optimization
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure Google search rankings, meta descriptions, canonical routing, and Open Graph social sharing cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/sustainability"
            className="px-4 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-bold text-[#202A2E] hover:bg-[#FAF7F2] transition-colors"
          >
            Back
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Controls */}
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-[#202A2E] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#E97835]" />
            <span>Search &amp; Meta Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Meta Title (Browser Tab &amp; Google Title)
            </label>
            <input
              type="text"
              value={data.metaTitle}
              onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="e.g. Sustainable Corrugated Packaging | AAVRIT PACKAGING"
            />
            <span className="text-[10px] text-[#8C989E] mt-1 block">
              Character count: {data.metaTitle.length} / 60 recommended
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={data.metaDescription}
              onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none resize-none leading-relaxed"
              placeholder="Concise summary for search engine snippet..."
            />
            <span className="text-[10px] text-[#8C989E] mt-1 block">
              Character count: {data.metaDescription.length} / 160 recommended
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Target SEO Keywords
            </label>
            <input
              type="text"
              value={data.metaKeywords || ""}
              onChange={(e) => setData({ ...data, metaKeywords: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="sustainable packaging, eco friendly boxes, recyclable kraft"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Canonical URL Link
            </label>
            <input
              type="text"
              value={data.canonicalLink || ""}
              onChange={(e) => setData({ ...data, canonicalLink: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none font-mono"
              placeholder="/sustainability"
            />
          </div>

          <div className="pt-2 border-t border-[#E4DED3]">
            <MediaUploader
              label="Open Graph (OG) Share Image"
              value={data.ogImage || ""}
              onChange={(url) => setData({ ...data, ogImage: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              OG Image Alt Tag
            </label>
            <input
              type="text"
              value={data.ogImageAlt || ""}
              onChange={(e) => setData({ ...data, ogImageAlt: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="AAVRIT PACKAGING Sustainable Packaging"
            />
          </div>
        </div>

        {/* Live Snippet Previews */}
        <div className="space-y-6">
          {/* Google SERP Snippet */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Google SERP Search Result Snippet</span>
            </span>

            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-1">
              <div className="text-[11px] text-[#202124] flex items-center gap-1.5">
                <span className="font-semibold">aavritpackaging.com</span>
                <span className="text-[#5f6368]">&rsaquo; sustainability</span>
              </div>
              <h4 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer line-clamp-1 leading-snug">
                {data.metaTitle || "Sustainable Corrugated Packaging | AAVRIT PACKAGING"}
              </h4>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {data.metaDescription || "Explore responsible corrugated packaging solutions, paper-based materials, efficient packaging design, and sustainable manufacturing practices at AAVRIT PACKAGING."}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E] flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#E97835]" />
              <span>Social Media Link Share Card</span>
            </span>

            <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5] shadow-xs">
              <div className="relative w-full aspect-[16/9] bg-[#202A2E]">
                {data.ogImage && (
                  <img
                    src={getMediaUrl(data.ogImage)}
                    alt={data.ogImageAlt || "Social Share Preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== "/Sustanablity/Eco-Friendly Packaging and Renewable Earth.png") {
                        target.src = "/Sustanablity/Eco-Friendly Packaging and Renewable Earth.png";
                      }
                    }}
                  />
                )}
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#8C989E] tracking-wider block">
                  AAVRITPACKAGING.COM
                </span>
                <h5 className="font-heading font-bold text-sm text-[#202A2E] line-clamp-1">
                  {data.metaTitle}
                </h5>
                <p className="text-xs text-[#687378] line-clamp-2 leading-relaxed">
                  {data.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
