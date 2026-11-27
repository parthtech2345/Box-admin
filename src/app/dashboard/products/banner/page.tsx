"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Eye,
  Film,
  Smile,
  Layers,
  ArrowLeft,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  ProductBannerCMS,
  DEFAULT_PRODUCT_BANNER,
} from "@/lib/defaultProductData";

export default function ProductBannerEditorPage() {
  const [data, setData] = useState<ProductBannerCMS>(DEFAULT_PRODUCT_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/products/banner");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        // Fallback to default
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setToast(null);

      const res = await fetch("/api/products/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setToast({
          type: "success",
          message: "Product Page Hero Banner & Mascot saved successfully!",
        });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save banner");
      }
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "An error occurred while saving banner settings",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Product Banner configuration...
      </div>
    );
  }

  const isMascotGif = data.characterImage?.toLowerCase().endsWith(".gif");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/products/items"
              className="inline-flex items-center gap-1.5 text-xs text-[#687378] hover:text-[#E97835] font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Product Section</span>
            </Link>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              Banner & Mascot
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Product Page Hero Banner & Mascot
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure the full-width showcase packaging banner, page typography, and speaking QC Inspector mascot or animated GIF.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Banner Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
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

      {/* 1. Page Title & Breadcrumbs Configuration */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
          <Layers className="w-4 h-4 text-[#E97835]" />
          <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
            1. Banner Headings & Breadcrumbs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Main Banner Headline *
            </label>
            <input
              type="text"
              required
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Our Products"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Breadcrumb Root Label
            </label>
            <input
              type="text"
              value={data.breadcrumbRoot}
              onChange={(e) => setData({ ...data, breadcrumbRoot: e.target.value })}
              placeholder="Home"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Current Page Breadcrumb Label
            </label>
            <input
              type="text"
              value={data.breadcrumbCurrent}
              onChange={(e) => setData({ ...data, breadcrumbCurrent: e.target.value })}
              placeholder="Products"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
            />
          </div>
        </div>
      </div>

      {/* 2. Banner Background Media */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
          <Film className="w-4 h-4 text-[#E97835]" />
          <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
            2. Showcase Banner Background Display (Image / Video / GIF)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <MediaUploader
              label="Upload Banner Background"
              value={data.backgroundImage}
              mediaType="image"
              allowedTypes={["image", "gif", "video"]}
              helperText="Full-width display shown behind headline and mascot."
              onChange={(url) => setData({ ...data, backgroundImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Banner Background Alt Text (for SEO)
              </label>
              <input
                type="text"
                value={data.backgroundImageAlt || ""}
                onChange={(e) => setData({ ...data, backgroundImageAlt: e.target.value })}
                placeholder="AAVRIT PACKAGING - Products Banner"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
              />
            </div>
          </div>

          <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E4DED3] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378] block">
              Current Background Media
            </span>
            <div className="relative w-full h-36 rounded-lg overflow-hidden bg-[#202A2E] border border-[#E4DED3]">
              <Image
                src={data.backgroundImage || "/Product/Kraft Packaging Showcase Banner.png"}
                alt={data.backgroundImageAlt || "Banner"}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-4">
                <span className="text-white text-xs font-bold font-heading drop-shadow-sm">
                  {data.title}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#687378] font-mono truncate">
              {data.backgroundImage}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Speaking Mascot Character / Animated GIF */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-[#E97835]" />
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
              3. Speaking QC Inspector Mascot / Animated GIF Character
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E97835]/15 text-[#E97835] border border-[#E97835]/25">
            Interactive Mascot / GIF
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Mascot Image & Dialogue settings */}
          <div className="space-y-4">
            <MediaUploader
              label="Mascot / GIF Media"
              value={data.characterImage}
              mediaType="image"
              allowedTypes={["image", "gif", "video"]}
              helperText="Upload standing inspector character PNG or transparent animated GIF."
              onChange={(url) => setData({ ...data, characterImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Character Alt Text
              </label>
              <input
                type="text"
                value={data.characterAlt}
                onChange={(e) => setData({ ...data, characterAlt: e.target.value })}
                placeholder="Quality Control Specialist - AAVRIT PACKAGING"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Dialogue Icon
                </label>
                <input
                  type="text"
                  value={data.dialogueIcon}
                  onChange={(e) => setData({ ...data, dialogueIcon: e.target.value })}
                  placeholder="📦"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-center font-bold text-[#202A2E]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Speech Bubble Title *
                </label>
                <input
                  type="text"
                  value={data.dialogueTitle}
                  onChange={(e) => setData({ ...data, dialogueTitle: e.target.value })}
                  placeholder="Quality Tested Packaging!"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Speech Bubble Subtitle / Guidance
              </label>
              <textarea
                rows={2}
                value={data.dialogueSubtext}
                onChange={(e) => setData({ ...data, dialogueSubtext: e.target.value })}
                placeholder="High-burst strength & precision corrugated cartons"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
              />
            </div>
          </div>

          {/* Right: Character Preview & Dialogue Card */}
          <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E4DED3] space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378] block">
              Mascot & Speech Bubble Preview
            </span>

            <div className="flex items-end gap-3 p-4 rounded-xl bg-[#202A2E] text-white">
              <div className="relative w-20 h-28 shrink-0">
                <Image
                  src={data.characterImage || "/Product/character_qc_inspector.png"}
                  alt={data.characterAlt || "QC Inspector"}
                  fill
                  className="object-contain object-bottom"
                />
              </div>

              <div className="bg-white text-[#202A2E] p-3 rounded-2xl rounded-bl-none shadow-md border border-[#E4DED3] space-y-0.5 max-w-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{data.dialogueIcon || "📦"}</span>
                  <span className="text-xs font-bold font-heading text-[#202A2E]">
                    {data.dialogueTitle}
                  </span>
                </div>
                <p className="text-[11px] text-[#687378] leading-tight">
                  {data.dialogueSubtext}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-[#687378] space-y-1">
              <p>
                ✓ Supports transparent PNGs and animated GIF characters.
              </p>
              <p>
                ✓ Automatically animated using GSAP smooth wave & greeting on page load.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full Live Banner Preview */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
          <Eye className="w-4 h-4 text-[#E97835]" />
          <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
            4. Live Website Banner Preview (As Seen on /products)
          </h2>
        </div>

        <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden bg-[#202A2E] shadow-inner border border-[#E4DED3]">
          <Image
            src={data.backgroundImage || "/Product/Kraft Packaging Showcase Banner.png"}
            alt={data.backgroundImageAlt || "Banner"}
            fill
            className="object-cover object-center pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#202A2E]/95 via-[#202A2E]/65 to-transparent w-full sm:w-1/2 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Banner Contents */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 pointer-events-none">
            {/* Upper: Headline & Breadcrumbs */}
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md mb-1">
                {data.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-[#F5F2EB]/90">
                <span>{data.breadcrumbRoot}</span>
                <ChevronRight className="w-3 h-3 text-[#D1B48C]" />
                <span className="text-[#D1B48C] font-semibold">{data.breadcrumbCurrent}</span>
              </div>
            </div>

            {/* Lower: Mascot & Speech Bubble */}
            <div className="flex items-end gap-3 self-end pointer-events-auto">
              <div className="bg-white text-[#202A2E] p-3 rounded-2xl rounded-br-none shadow-lg border border-[#E4DED3] max-w-[220px] sm:max-w-[260px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm">{data.dialogueIcon}</span>
                  <span className="text-xs font-bold text-[#202A2E] font-heading truncate">
                    {data.dialogueTitle}
                  </span>
                </div>
                <p className="text-[10px] text-[#687378] leading-tight line-clamp-2">
                  {data.dialogueSubtext}
                </p>
              </div>

              <div className="relative w-20 sm:w-24 h-28 sm:h-36">
                <Image
                  src={data.characterImage || "/Product/character_qc_inspector.png"}
                  alt={data.characterAlt}
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E4DED3]">
        <Link
          href="/dashboard/products/items"
          className="px-4 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#687378] hover:bg-[#F5F2EB] transition-colors"
        >
          Cancel
        </Link>

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
              <span>Save Banner Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
