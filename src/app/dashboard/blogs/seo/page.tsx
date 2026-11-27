"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Search,
  Code2,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import { DEFAULT_BLOG_SEO, BlogSEOData } from "@/lib/defaultBlogData";

export default function BlogSEOEditorPage() {
  const [data, setData] = useState<BlogSEOData>(DEFAULT_BLOG_SEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSEO() {
      try {
        setLoading(true);
        const res = await fetch("/api/blogs?section=seo");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load blog SEO config:", err);
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
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "seo", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Blogs SEO metadata saved successfully!" });
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

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Blogs SEO Configuration...
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
              SEO Optimization
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Blogs Landing Page SEO &amp; Social
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure Google search rankings, Meta tags, social share previews, and structured Schema markup for /blogs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
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
                <span>Save Changes</span>
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

      {/* Google SERP Live Snippet Preview */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#E97835]" />
            <h2 className="font-heading font-bold text-sm text-[#202A2E]">
              Google Search Result Snippet Preview
            </h2>
          </div>
          <span className="text-[11px] text-[#687378] font-mono">
            SERP Desktop Simulation
          </span>
        </div>

        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-1 max-w-2xl">
          <div className="text-xs text-[#202124] flex items-center gap-1.5">
            <span className="font-semibold">AAVRIT PACKAGING</span>
            <span className="text-[#5f6368]">https://aavritpackaging.com/blogs</span>
          </div>
          <h3 className="text-base sm:text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
            {data.metaTitle || "Packaging Insights & Knowledge | AAVRIT PACKAGING"}
          </h3>
          <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
            {data.metaDescription || "Explore educational guides, technical articles, and practical insights on corrugated box structures..."}
          </p>
        </div>
      </div>

      {/* Editor Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Meta Tags */}
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#E97835]" />
            <span>Search Engine Meta Tags</span>
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#202A2E]">
                  Meta Title
                </label>
                <span className="text-[10px] text-[#8C989E] font-mono">
                  {data.metaTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={data.metaTitle}
                onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                placeholder="Packaging Insights & Knowledge | AAVRIT PACKAGING"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#202A2E]">
                  Meta Description
                </label>
                <span className="text-[10px] text-[#8C989E] font-mono">
                  {data.metaDescription.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={data.metaDescription}
                onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                placeholder="Explore educational guides, technical articles..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Meta Keywords (comma separated)
              </label>
              <input
                type="text"
                value={data.metaKeywords}
                onChange={(e) => setData({ ...data, metaKeywords: e.target.value })}
                placeholder="corrugated boxes blog, packaging knowledge..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
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
                placeholder="/blogs"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Social OpenGraph & Schema */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#E97835]" />
              <span>Social Share Preview (OpenGraph)</span>
            </h2>

            <div className="space-y-4">
              <MediaUploader
                label="OpenGraph Thumbnail (1200x630)"
                value={data.ogImage || ""}
                mediaType="image"
                allowedTypes={["image"]}
                onChange={(url) => setData({ ...data, ogImage: url })}
              />

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Social Image Alt Text
                </label>
                <input
                  type="text"
                  value={data.ogImageAlt || ""}
                  onChange={(e) => setData({ ...data, ogImageAlt: e.target.value })}
                  placeholder="AAVRIT PACKAGING Packaging Insights & Knowledge"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#E97835]" />
              <span>Schema.org JSON-LD Structured Data</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Custom JSON-LD Code Block
              </label>
              <textarea
                rows={4}
                value={data.schemaMarkup || ""}
                onChange={(e) => setData({ ...data, schemaMarkup: e.target.value })}
                placeholder='{"@context": "https://schema.org", "@type": "Blog"}'
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
