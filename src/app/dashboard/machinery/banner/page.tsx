"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Cpu,
  Layers,
  Eye,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_MACHINERY_BANNER,
  MachineryBannerData,
} from "@/lib/defaultMachineryData";

export default function MachineryBannerEditorPage() {
  const [activeTab, setActiveTab] = useState<"listing" | "detail">("listing");
  const [banner, setBanner] = useState<MachineryBannerData>(DEFAULT_MACHINERY_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadBanner() {
      try {
        setLoading(true);
        const res = await fetch("/api/machinery?section=banner");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setBanner(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load machinery banner:", err);
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
      const res = await fetch("/api/machinery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "banner", data: banner }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Machinery Hero Banner saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save machinery banner config");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save banner config" });
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
            <span>Machinery</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E97835]">Hero Banner & Mascot</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Hero Banner &amp; Mascot
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the panorama background image, page title, and the plant engineer mascot speech bubble.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Banner"}</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-2">
        <button
          onClick={() => setActiveTab("listing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "listing"
              ? "bg-[#E97835] text-white shadow-xs"
              : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Machinery Listing Banner (/machinery)</span>
        </button>

        <button
          onClick={() => setActiveTab("detail")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "detail"
              ? "bg-[#E97835] text-white shadow-xs"
              : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Machine Detail Default Banner (/machinery/[slug])</span>
        </button>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === "listing" ? (
            <>
              {/* 1. Header Information */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
                  <Sparkles className="w-4 h-4 text-[#E97835]" />
                  <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                    Main Heading &amp; Breadcrumb
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Banner Main Title
                    </label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Breadcrumb Root
                      </label>
                      <input
                        type="text"
                        value={banner.breadcrumbRoot}
                        onChange={(e) => setBanner({ ...banner, breadcrumbRoot: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Breadcrumb Current
                      </label>
                      <input
                        type="text"
                        value={banner.breadcrumbCurrent}
                        onChange={(e) => setBanner({ ...banner, breadcrumbCurrent: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Panoramic Banner Background Image */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
                  <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                    Panorama Background Image
                  </h2>
                </div>

                <div className="space-y-4">
                  <MediaUploader
                    label="Machinery Hero Panorama Banner"
                    value={banner.backgroundImage}
                    mediaType="image"
                    allowedTypes={["image"]}
                    onChange={(url) => setBanner({ ...banner, backgroundImage: url })}
                  />

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Background Alt Text (SEO)
                    </label>
                    <input
                      type="text"
                      value={banner.backgroundImageAlt}
                      onChange={(e) => setBanner({ ...banner, backgroundImageAlt: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Mascot Character & Dialogue */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
                  <span className="text-base">⚡</span>
                  <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                    Plant Automation Engineer Mascot
                  </h2>
                </div>

                <div className="space-y-4">
                  <MediaUploader
                    label="Mascot Character Image"
                    value={banner.characterImage}
                    mediaType="image"
                    allowedTypes={["image"]}
                    onChange={(url) => setBanner({ ...banner, characterImage: url })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Icon Emoji
                      </label>
                      <input
                        type="text"
                        value={banner.dialogueIcon}
                        onChange={(e) => setBanner({ ...banner, dialogueIcon: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-center font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Speech Title
                      </label>
                      <input
                        type="text"
                        value={banner.dialogueTitle}
                        onChange={(e) => setBanner({ ...banner, dialogueTitle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Speech Subtext
                    </label>
                    <input
                      type="text"
                      value={banner.dialogueSubtext}
                      onChange={(e) => setBanner({ ...banner, dialogueSubtext: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Detail Banner Configuration */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
                  <Layers className="w-4 h-4 text-[#E97835]" />
                  <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                    Detail Page Banner Settings
                  </h2>
                </div>

                <div className="space-y-4">
                  <MediaUploader
                    label="Detail Hero Background Panorama"
                    value={banner.detailBannerImage || banner.backgroundImage}
                    mediaType="image"
                    allowedTypes={["image"]}
                    onChange={(url) => setBanner({ ...banner, detailBannerImage: url })}
                  />

                  <MediaUploader
                    label="Detail Mascot Character Image"
                    value={banner.detailCharacterImage || banner.characterImage}
                    mediaType="image"
                    allowedTypes={["image"]}
                    onChange={(url) => setBanner({ ...banner, detailCharacterImage: url })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Icon Emoji
                      </label>
                      <input
                        type="text"
                        value={banner.detailDialogueIcon || "⚡"}
                        onChange={(e) => setBanner({ ...banner, detailDialogueIcon: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-center font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Dialogue Subtext Note
                      </label>
                      <input
                        type="text"
                        value={banner.detailDialogueSubtext || "High-speed precision automated manufacturing in operation"}
                        onChange={(e) => setBanner({ ...banner, detailDialogueSubtext: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#E4DED3]">
              <Eye className="w-3.5 h-3.5 text-[#E97835]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                {activeTab === "listing" ? "Listing Banner Preview" : "Detail Banner Preview"}
              </span>
            </div>

            {/* Banner Canvas */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#202A2E] border border-[#E4DED3]">
              <img
                src={getMediaUrl(
                  activeTab === "listing"
                    ? banner.backgroundImage
                    : banner.detailBannerImage || banner.backgroundImage
                )}
                alt="Banner Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = "/Machinery/machinery_banner_pano.png";
                  if (target.src !== fallback) target.src = fallback;
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#202A2E]/95 via-[#202A2E]/60 to-transparent pointer-events-none" />

              {/* Text Layout */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg drop-shadow-md">
                    {activeTab === "listing" ? banner.title : "Automatic Corrugation Machine"}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-[#F5F2EB]/90 mt-0.5">
                    <span>{banner.breadcrumbRoot || "Home"}</span>
                    <ChevronRight className="w-2.5 h-2.5 text-[#D1B48C]" />
                    <span className="text-[#D1B48C]">
                      {activeTab === "listing" ? banner.breadcrumbCurrent : "Automatic Corrugation Machine"}
                    </span>
                  </div>
                </div>

                {/* Mascot speech */}
                <div className="flex items-end gap-2">
                  <div className="w-10 sm:w-12 shrink-0">
                    <img
                      src={getMediaUrl(
                        activeTab === "listing"
                          ? banner.characterImage
                          : banner.detailCharacterImage || banner.characterImage
                      )}
                      alt="Mascot"
                      className="w-full h-auto drop-shadow-md"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = "/Machinery/character_plant_engineer.png";
                        if (target.src !== fallback) target.src = fallback;
                      }}
                    />
                  </div>
                  <div className="bg-white/95 text-[#202A2E] rounded-xl p-2 shadow-md max-w-[200px] border border-[#E4DED3]">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-[#E97835]">
                      <span>{activeTab === "listing" ? banner.dialogueIcon : banner.detailDialogueIcon || "⚡"}</span>
                      <span className="truncate">
                        {activeTab === "listing"
                          ? banner.dialogueTitle
                          : "Corrugation Line!"}
                      </span>
                    </div>
                    <p className="text-[8px] text-[#687378] leading-tight line-clamp-2 mt-0.5">
                      {activeTab === "listing"
                        ? banner.dialogueSubtext
                        : banner.detailDialogueSubtext || "High-speed precision automated manufacturing in operation"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
