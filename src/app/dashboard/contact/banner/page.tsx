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
  Mail,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_CONTACT_HERO,
  ContactHeroData,
} from "@/lib/defaultContactData";

export default function ContactBannerEditorPage() {
  const [data, setData] = useState<ContactHeroData>(DEFAULT_CONTACT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadBanner() {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?section=hero");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load contact hero banner:", err);
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Contact Banner & Mascot saved successfully!" });
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
        Loading Contact Banner Configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Contact</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              Hero Banner & Mascot
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Contact Hero Banner & Mascot
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the top showcase banner, page headline, breadcrumbs, and customer support specialist mascot dialogue.
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
                <span>Saving Banner...</span>
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

      {/* 2-Column Split: Form Fields + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Title & Breadcrumbs */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Page Headline & Breadcrumbs
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Page Main Heading (H1)
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                  placeholder="Contact Us"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Breadcrumb Root
                  </label>
                  <input
                    type="text"
                    value={data.breadcrumbRoot}
                    onChange={(e) => setData({ ...data, breadcrumbRoot: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
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
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Banner Background Media */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Panoramic Banner Background
            </h2>

            <MediaUploader
              label="Banner Background Image"
              value={data.backgroundImage}
              mediaType="image"
              allowedTypes={["image"]}
              onChange={(url) => setData({ ...data, backgroundImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Image Alt Text (for Google SEO)
              </label>
              <input
                type="text"
                value={data.backgroundImageAlt || ""}
                onChange={(e) => setData({ ...data, backgroundImageAlt: e.target.value })}
                placeholder="Contact Support Workspace - AAVRIT PACKAGING"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>
          </div>

          {/* Card 3: Employee Mascot & Dialogue Bubble */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E97835]" />
              <span>Customer Support Mascot & Dialogue</span>
            </h2>

            <MediaUploader
              label="Support Mascot Graphic (PNG / GIF / WebP)"
              value={data.characterImage}
              mediaType={data.characterMediaType || "image"}
              allowedTypes={["image", "gif", "video"]}
              onChange={(url) => setData({ ...data, characterImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Mascot Alt Text (SEO)
              </label>
              <input
                type="text"
                value={data.characterAlt}
                onChange={(e) => setData({ ...data, characterAlt: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Dialogue Icon
                </label>
                <input
                  type="text"
                  value={data.dialogueIcon}
                  onChange={(e) => setData({ ...data, dialogueIcon: e.target.value })}
                  placeholder="💬"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none text-center"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Dialogue Title
                </label>
                <input
                  type="text"
                  value={data.dialogueTitle}
                  onChange={(e) => setData({ ...data, dialogueTitle: e.target.value })}
                  placeholder="We're Here to Help!"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Dialogue Subtext
              </label>
              <input
                type="text"
                value={data.dialogueSubtext}
                onChange={(e) => setData({ ...data, dialogueSubtext: e.target.value })}
                placeholder="Get instant quotes & custom packaging guidance"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Banner Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4DED3]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A65D32]">
                Live Banner Preview
              </span>
              <span className="text-[11px] text-[#687378] font-mono">1:1 Website Replica</span>
            </div>

            {/* Banner Miniature Preview Frame */}
            <div className="relative w-full h-[260px] rounded-xl overflow-hidden bg-[#202A2E] text-white shadow-inner">
              {data.backgroundImage ? (
                <Image
                  src={data.backgroundImage}
                  alt={data.backgroundImageAlt || "Banner preview"}
                  fill
                  className="object-cover object-center pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-[#202A2E] flex items-center justify-center text-xs text-white/40">
                  No background media
                </div>
              )}

              {/* Side Vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#202A2E]/95 via-[#202A2E]/70 to-transparent w-full pointer-events-none" />

              {/* Banner Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white tracking-tight drop-shadow-md">
                    {data.title || "Contact Us"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/80 mt-1">
                    <span>{data.breadcrumbRoot}</span>
                    <ChevronRight className="w-3 h-3 text-[#D1B48C]" />
                    <span className="text-[#D1B48C] font-semibold">{data.breadcrumbCurrent}</span>
                  </div>
                </div>

                {/* Mascot Dialogue Simulation */}
                <div className="flex items-end justify-end gap-2">
                  <div className="bg-white/95 backdrop-blur-xs text-[#202A2E] p-2.5 rounded-xl shadow-lg border border-[#E4DED3] text-right max-w-[200px]">
                    <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-[#E97835]">
                      <span>{data.dialogueIcon}</span>
                      <span>{data.dialogueTitle}</span>
                    </div>
                    <p className="text-[10px] text-[#687378] mt-0.5 leading-snug line-clamp-2">
                      {data.dialogueSubtext}
                    </p>
                  </div>

                  {data.characterImage && (
                    <div className="relative w-16 h-24 shrink-0">
                      <Image
                        src={data.characterImage}
                        alt={data.characterAlt || "Support Character"}
                        fill
                        className="object-contain object-bottom"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#8C989E] mt-3 leading-relaxed">
              This preview reflects the top banner on the Contact page. Changes saved here sync instantly with the live site and MongoDB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
