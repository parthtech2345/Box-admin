"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Factory,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_INDUSTRIES_BANNER,
  IndustriesBannerData,
} from "@/lib/defaultIndustryData";

export default function IndustriesBannerEditorPage() {
  const [data, setData] = useState<IndustriesBannerData>(DEFAULT_INDUSTRIES_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadBanner() {
      try {
        setLoading(true);
        const res = await fetch("/api/industries?type=banner");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        // Fallback to default
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBanner();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/industries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "banner", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Industries Banner & Mascot saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save banner");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save banner" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Industries Banner & Mascot Settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Industries</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              Hero Banner & Mascot
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Hero Banner & Speaking Mascot
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the top showcase banner, page headline, breadcrumbs, and logistics specialist mascot for the Industries section.
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
                <span>Save Banner</span>
              </>
            )}
          </button>
        </div>
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
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Banner Headings */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          Page Title & Breadcrumb Navigation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Headline Title
            </label>
            <input
              type="text"
              value={data.title || "Industries"}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Breadcrumb Root
            </label>
            <input
              type="text"
              value={data.breadcrumbRoot || "Home"}
              onChange={(e) => setData({ ...data, breadcrumbRoot: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Breadcrumb Current
            </label>
            <input
              type="text"
              value={data.breadcrumbCurrent || "Industries"}
              onChange={(e) => setData({ ...data, breadcrumbCurrent: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
            />
          </div>
        </div>
      </div>

      {/* Banner Media & Live Preview */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          Showcase Banner Media
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <MediaUploader
              label="Banner Background Image"
              value={data.backgroundImage || ""}
              mediaType="image"
              allowedTypes={["image", "gif", "video"]}
              helperText="Wide panoramic image displayed across full width of Industries banner."
              onChange={(url) => setData({ ...data, backgroundImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Background Alt Text (SEO)
              </label>
              <input
                type="text"
                value={data.backgroundImageAlt || ""}
                onChange={(e) => setData({ ...data, backgroundImageAlt: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
              />
            </div>
          </div>

          <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E4DED3] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378] block">
              Live Banner Preview
            </span>
            <div className="relative w-full h-36 rounded-lg overflow-hidden bg-[#202A2E] border border-[#E4DED3]">
              <Image
                src={data.backgroundImage || "/Industries/industries_banner_pano.png"}
                alt={data.backgroundImageAlt || "Banner"}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent flex items-center p-4">
                <span className="text-white text-base font-bold font-heading">
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

      {/* Mascot & Dialogue Bubble */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          Logistics Specialist Mascot / Animated GIF & Dialogue
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <MediaUploader
              label="Mascot / GIF Media"
              value={data.characterImage || ""}
              mediaType="image"
              allowedTypes={["image", "gif", "video"]}
              helperText="Upload transparent PNG character or animated GIF of the logistics director."
              onChange={(url) => setData({ ...data, characterImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Character Alt Text (SEO)
              </label>
              <input
                type="text"
                value={data.characterAlt || ""}
                onChange={(e) => setData({ ...data, characterAlt: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Dialogue Emoji
                </label>
                <input
                  type="text"
                  value={data.dialogueIcon || "🏭"}
                  onChange={(e) => setData({ ...data, dialogueIcon: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-center font-bold"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Speech Bubble Title
                </label>
                <input
                  type="text"
                  value={data.dialogueTitle || ""}
                  onChange={(e) => setData({ ...data, dialogueTitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Speech Bubble Subtext
              </label>
              <textarea
                rows={2}
                value={data.dialogueSubtext || ""}
                onChange={(e) => setData({ ...data, dialogueSubtext: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
              />
            </div>
          </div>

          {/* Visual Mascot Preview */}
          <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E4DED3] space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378] block">
              Mascot & Dialogue Speech Preview
            </span>
            <div className="flex items-end gap-3 p-4 rounded-xl bg-[#202A2E] text-white">
              <div className="relative w-20 h-28 shrink-0">
                <Image
                  src={data.characterImage || "/Industries/character_logistics_manager.png"}
                  alt={data.characterAlt || "Mascot"}
                  fill
                  className="object-contain object-bottom"
                />
              </div>
              <div className="bg-white text-[#202A2E] p-3 rounded-2xl rounded-bl-none shadow-md border border-[#E4DED3] space-y-0.5 max-w-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{data.dialogueIcon || "🏭"}</span>
                  <span className="text-xs font-bold font-heading text-[#202A2E]">
                    {data.dialogueTitle}
                  </span>
                </div>
                <p className="text-[11px] text-[#687378] leading-tight">
                  {data.dialogueSubtext}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
