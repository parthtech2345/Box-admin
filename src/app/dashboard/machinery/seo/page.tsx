"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  ChevronRight,
  Eye,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_MACHINERY_SEO,
  MachinerySEOData,
} from "@/lib/defaultMachineryData";

export default function MachinerySEOEditorPage() {
  const [data, setData] = useState<MachinerySEOData>(DEFAULT_MACHINERY_SEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSEO() {
      try {
        setLoading(true);
        const res = await fetch("/api/machinery?section=seo");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load machinery SEO:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSEO();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/machinery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "seo", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Machinery SEO settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save SEO config");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save SEO config" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <span>Machinery</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E97835]">SEO Optimization</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Machinery Catalog SEO Optimization
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure Google search titles, descriptions, indexing keywords, and OpenGraph social preview cards.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Search Engine Meta Tags
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Meta Title Tag (Recommended 50–60 characters)
              </label>
              <input
                type="text"
                value={data.metaTitle}
                onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
              />
              <span className="text-[10px] text-[#8C989E] block mt-1">
                {data.metaTitle.length} characters
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Meta Description (Recommended 140–160 characters)
              </label>
              <textarea
                rows={3}
                value={data.metaDescription}
                onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
              />
              <span className="text-[10px] text-[#8C989E] block mt-1">
                {data.metaDescription.length} characters
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={data.metaKeywords}
                onChange={(e) => setData({ ...data, metaKeywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Canonical Link URL
              </label>
              <input
                type="text"
                value={data.canonicalLink}
                onChange={(e) => setData({ ...data, canonicalLink: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] font-mono focus:border-[#E97835] outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              OpenGraph Social Share Card
            </h2>

            <MediaUploader
              label="OG Image (1200 x 630 recommended)"
              value={data.ogImage}
              mediaType="image"
              allowedTypes={["image"]}
              onChange={(url) => setData({ ...data, ogImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                OG Image Alt Text
              </label>
              <input
                type="text"
                value={data.ogImageAlt}
                onChange={(e) => setData({ ...data, ogImageAlt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#E4DED3]">
              <Eye className="w-3.5 h-3.5 text-[#E97835]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                Google Search Result Preview
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E4DED3] space-y-1.5 shadow-2xs font-sans">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#FAF7F2] text-[#A65D32] text-[10px] flex items-center justify-center font-bold">
                  A
                </span>
                <span className="text-xs text-[#202124] truncate">
                  {data.canonicalLink || "https://aavritpackaging.com/machinery"}
                </span>
              </div>

              <h4 className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer line-clamp-1 leading-snug">
                {data.metaTitle}
              </h4>

              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {data.metaDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
