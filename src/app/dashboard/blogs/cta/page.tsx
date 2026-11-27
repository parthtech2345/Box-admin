"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { DEFAULT_BLOG_LISTING_CTA, BlogListingCTAData } from "@/lib/defaultBlogData";

export default function BlogListingCTAEditorPage() {
  const [data, setData] = useState<BlogListingCTAData>(DEFAULT_BLOG_LISTING_CTA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCTA() {
      try {
        setLoading(true);
        const res = await fetch("/api/blogs?section=cta");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load blog CTA config:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCTA();
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
        body: JSON.stringify({ section: "cta", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Listing CTA Banner saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save CTA config");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save CTA config" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading CTA Banner Configuration...
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
              Listing CTA Banner
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Listing Bottom CTA Banner
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the bottom conversion banner (&quot;Want to Know More About Packaging?&quot;) featured on the main Blogs listing page.
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

      {/* Live CTA Banner Preview */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E97835]" />
            <h2 className="font-heading font-bold text-sm text-[#202A2E]">
              Live CTA Preview
            </h2>
          </div>
          <span className="text-[11px] text-[#687378] font-mono">
            Exact 1:1 Rendering of Bottom Conversion Banner
          </span>
        </div>

        <div className="bg-[#202A2E] rounded-2xl p-6 sm:p-8 text-white border border-[#344247] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-[#A65D32]/25 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 rounded-full bg-[#E97835]/20 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-8 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 border border-white/15">
                <BookOpen className="w-3.5 h-3.5 text-[#E97835]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]">
                  {data.badge || "CONTINUE LEARNING"}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                {data.title || "Want to Know More About Packaging?"}
              </h3>

              <p className="text-xs sm:text-sm text-[#A6B2B8] max-w-xl leading-relaxed">
                {data.description}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end lg:items-end">
              <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#E97835] text-white font-bold text-xs tracking-wider uppercase shadow-md cursor-pointer">
                <span>{data.primaryButtonText || "Explore Products"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>

              <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/20 font-bold text-xs tracking-wider uppercase cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{data.secondaryButtonText || "Contact Us"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Inputs */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          Banner Content &amp; Button Links
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Pill Badge Text
            </label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              placeholder="CONTINUE LEARNING"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Banner Heading
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Want to Know More About Packaging?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Description Paragraph
            </label>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Explore our packaging solutions or connect with our team..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Primary Button Label
              </label>
              <input
                type="text"
                value={data.primaryButtonText}
                onChange={(e) => setData({ ...data, primaryButtonText: e.target.value })}
                placeholder="Explore Products"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Primary Button Destination URL
              </label>
              <input
                type="text"
                value={data.primaryButtonLink}
                onChange={(e) => setData({ ...data, primaryButtonLink: e.target.value })}
                placeholder="/products"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={data.secondaryButtonText}
                onChange={(e) => setData({ ...data, secondaryButtonText: e.target.value })}
                placeholder="Contact Us"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Secondary Button Destination URL
              </label>
              <input
                type="text"
                value={data.secondaryButtonLink}
                onChange={(e) => setData({ ...data, secondaryButtonLink: e.target.value })}
                placeholder="/contact"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
