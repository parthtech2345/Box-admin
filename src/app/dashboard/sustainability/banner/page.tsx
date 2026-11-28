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
  ArrowLeft,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_SUSTAINABILITY_DATA,
  SustainabilityBannerData,
} from "@/lib/defaultSustainabilityData";

export default function SustainabilityBannerEditorPage() {
  const [data, setData] = useState<SustainabilityBannerData>(DEFAULT_SUSTAINABILITY_DATA.banner);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/sustainability?section=banner");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load banner data:", err);
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
        body: JSON.stringify({ section: "banner", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Hero Banner & Mascot saved successfully!" });
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

  const getMediaUrl = (val: string) => {
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
            <Link href="/dashboard/sustainability" className="hover:text-[#202A2E]">
              Sustainability
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E97835]">Hero Banner &amp; Mascot</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Hero Banner &amp; Eco-Officer Mascot
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure the panoramic header image, main titles, breadcrumbs, and the speaking Sustainability Specialist character.
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

      {/* Live Preview Card */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E]">
            Live Banner Visual Preview
          </span>
          <a
            href="http://localhost:3000/sustainability"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E97835] hover:underline"
          >
            <span>Open live page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#202A2E] border border-[#344247]">
          {data.backgroundImage && (
            <img
              src={getMediaUrl(data.backgroundImage)}
              alt={data.backgroundImageAlt || "Banner Preview"}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== "/Sustanablity/sustainability_banner_pano.png") {
                  target.src = "/Sustanablity/sustainability_banner_pano.png";
                }
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#202A2E]/95 via-[#202A2E]/65 to-transparent w-full sm:w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-1 drop-shadow-md">
                {data.title || "Sustainability"}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#F5F2EB]/90">
                <span>{data.breadcrumbRoot || "Home"}</span>
                <ChevronRight className="w-3 h-3 text-[#D1B48C]" />
                <span className="text-[#D1B48C] font-semibold">{data.breadcrumbCurrent || "Sustainability"}</span>
              </div>
            </div>

            {/* Mascot Preview */}
            <div className="flex items-end gap-3 self-end sm:self-auto sm:ml-auto">
              {/* Dialogue Bubble */}
              <div className="bg-[#FAF7F2] text-[#202A2E] rounded-2xl p-2.5 sm:p-3 border border-[#E4DED3] shadow-md max-w-xs text-left">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#202A2E]">
                  <span>{data.dialogueIcon || "🌱"}</span>
                  <span>{data.dialogueTitle || "100% Recyclable Kraft!"}</span>
                </div>
                <p className="text-[10px] text-[#687378] mt-0.5">
                  {data.dialogueSubtext || "Eco-friendly, biodegradable & FSC-aligned production"}
                </p>
              </div>

              {/* Character */}
              {data.characterImage && (
                <div className="w-20 sm:w-24 shrink-0">
                  <img
                    src={getMediaUrl(data.characterImage)}
                    alt={data.characterAlt || "Mascot"}
                    className="w-full h-auto object-contain drop-shadow-lg"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== "/Sustanablity/character_sustainability_officer.png") {
                        target.src = "/Sustanablity/character_sustainability_officer.png";
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner Settings */}
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-[#202A2E] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E97835]" />
            <span>Panoramic Header Configuration</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Page Heading Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="e.g. Sustainability"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                placeholder="Home"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Breadcrumb Current
              </label>
              <input
                type="text"
                value={data.breadcrumbCurrent}
                onChange={(e) => setData({ ...data, breadcrumbCurrent: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                placeholder="Sustainability"
              />
            </div>
          </div>

          <div>
            <MediaUploader
              label="Banner Background Image"
              value={data.backgroundImage}
              onChange={(url) => setData({ ...data, backgroundImage: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Banner Image Alt Tag
            </label>
            <input
              type="text"
              value={data.backgroundImageAlt || ""}
              onChange={(e) => setData({ ...data, backgroundImageAlt: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="Descriptive alt text for SEO"
            />
          </div>
        </div>

        {/* Mascot & Speech Dialogue Settings */}
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-[#202A2E] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#78846A]" />
            <span>Speaking Mascot Specialist</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Dialogue Icon (Emoji)
              </label>
              <input
                type="text"
                value={data.dialogueIcon}
                onChange={(e) => setData({ ...data, dialogueIcon: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none text-center text-base"
                placeholder="🌱"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Speech Bubble Title
              </label>
              <input
                type="text"
                value={data.dialogueTitle}
                onChange={(e) => setData({ ...data, dialogueTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                placeholder="e.g. 100% Recyclable Kraft!"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Speech Bubble Subtitle Narrative
            </label>
            <textarea
              rows={2}
              value={data.dialogueSubtext}
              onChange={(e) => setData({ ...data, dialogueSubtext: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none resize-none"
              placeholder="e.g. Eco-friendly, biodegradable & FSC-aligned production"
            />
          </div>

          <div>
            <MediaUploader
              label="Mascot Character Image (Transparent PNG / WebP)"
              value={data.characterImage}
              onChange={(url) => setData({ ...data, characterImage: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Mascot Character Alt Tag
            </label>
            <input
              type="text"
              value={data.characterAlt}
              onChange={(e) => setData({ ...data, characterAlt: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="Sustainability Specialist - AAVRIT PACKAGING"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
