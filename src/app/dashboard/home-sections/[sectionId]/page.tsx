"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PlaySquare,
  Image as ImageIcon,
  Plus,
  Trash2,
  Film,
  Layers,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import { HOME_SECTIONS_LIST, DEFAULT_HOME_DATA } from "@/lib/defaultHomeData";

export default function SectionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const sectionId = (params?.sectionId as string) || "hero";

  const meta = HOME_SECTIONS_LIST.find((s) => s.id === sectionId) || {
    id: sectionId,
    name: "Section Editor",
    description: "Manage this section",
    icon: "Boxes",
  };

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch section data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/home-sections?sectionId=${sectionId}`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            setData(DEFAULT_HOME_DATA[sectionId] || { sectionId });
          }
        }
      } catch (err) {
        if (isMounted) {
          setData(DEFAULT_HOME_DATA[sectionId] || { sectionId });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [sectionId]);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/home-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, data }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setToast({
          type: "success",
          message: `Changes saved to MongoDB successfully!`,
        });
      } else {
        setToast({
          type: "error",
          message: json.message || "Failed to save section",
        });
      }
    } catch (e: any) {
      setToast({ type: "error", message: e.message || "Network error while saving" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleResetDefaults = () => {
    if (confirm(`Reset "${meta.name}" back to live website defaults?`)) {
      const def = DEFAULT_HOME_DATA[sectionId] || { sectionId };
      setData({ ...def });
    }
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-[#202A2E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#687378] font-semibold">Loading section configuration...</p>
      </div>
    );
  }

  const isHero = sectionId === "hero";

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687378] hover:text-[#202A2E] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-2xl text-[#202A2E]">
              {meta.name}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E4DED3] text-[#845B32]">
              #{sectionId}
            </span>
          </div>
          <p className="text-xs text-[#687378] mt-1">{meta.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#EAE4D7] text-[#687378] hover:text-[#202A2E] text-xs font-bold border border-[#E4DED3] transition-all flex items-center gap-1.5"
            title="Reset to website default data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <a
            href={`http://localhost:3000#${sectionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#F5F2EB] hover:bg-[#EAE4D7] text-[#202A2E] text-xs font-bold border border-[#E4DED3] transition-all flex items-center gap-1.5"
          >
            <span>Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#202A2E] hover:bg-[#2b383e] text-[#D1B48C] text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving to MongoDB..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border ${
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

      {/* --- HERO SECTION SPECIFIC EDITOR --- */}
      {isHero ? (
        <div className="space-y-6">
          {/* Hero Media Mode Toggle Card */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Primary Display Switcher
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                Hero Background Media Mode
              </h2>
              <p className="text-xs text-[#687378] mt-1">
                Choose whether the Hero displays a high-impact interactive video or a high-resolution static banner image.
              </p>
            </div>

            {/* Mode Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setData({ ...data, mediaType: "video" })}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  data.mediaType === "video"
                    ? "bg-[#202A2E] text-[#FFFFFF] border-[#202A2E] shadow-md ring-2 ring-[#D1B48C]"
                    : "bg-[#FAF9F5] hover:bg-[#F5F2EB] text-[#202A2E] border-[#E4DED3]"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    data.mediaType === "video"
                      ? "bg-[#D1B48C] text-[#202A2E]"
                      : "bg-[#E4DED3] text-[#687378]"
                  }`}
                >
                  <PlaySquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>Video Mode</span>
                    {data.mediaType === "video" && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#D1B48C] text-[#202A2E]">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 leading-normal ${
                      data.mediaType === "video" ? "text-[#A0ACB2]" : "text-[#687378]"
                    }`}
                  >
                    Interactive 80-frame scroll scrubbing video or custom uploaded video file.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setData({ ...data, mediaType: "image" })}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  data.mediaType === "image"
                    ? "bg-[#202A2E] text-[#FFFFFF] border-[#202A2E] shadow-md ring-2 ring-[#D1B48C]"
                    : "bg-[#FAF9F5] hover:bg-[#F5F2EB] text-[#202A2E] border-[#E4DED3]"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    data.mediaType === "image"
                      ? "bg-[#D1B48C] text-[#202A2E]"
                      : "bg-[#E4DED3] text-[#687378]"
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>Image Mode</span>
                    {data.mediaType === "image" && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#D1B48C] text-[#202A2E]">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 leading-normal ${
                      data.mediaType === "image" ? "text-[#A0ACB2]" : "text-[#687378]"
                    }`}
                  >
                    High-resolution packaging factory or box banner image with responsive cover.
                  </p>
                </div>
              </button>
            </div>

            {/* Video Mode Sub-Configuration */}
            {data.mediaType === "video" && (
              <div className="pt-4 border-t border-[#E4DED3] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                    Video Playback Style
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setData({ ...data, videoMode: "frames" })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        data.videoMode === "frames"
                          ? "bg-[#202A2E] text-[#D1B48C]"
                          : "bg-[#FAF9F5] text-[#687378] hover:bg-[#F5F2EB]"
                      }`}
                    >
                      Interactive Frames (80-Frame Scrub)
                    </button>
                    <button
                      type="button"
                      onClick={() => setData({ ...data, videoMode: "video-url" })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        data.videoMode === "video-url"
                          ? "bg-[#202A2E] text-[#D1B48C]"
                          : "bg-[#FAF9F5] text-[#687378] hover:bg-[#F5F2EB]"
                      }`}
                    >
                      Uploaded Video File (MP4/WebM)
                    </button>
                  </div>
                </div>

                {data.videoMode === "video-url" && (
                  <MediaUploader
                    label="Upload Custom Hero Video (MP4 / WebM)"
                    value={data.videoUrl || ""}
                    mediaType="video"
                    allowedTypes={["video"]}
                    helperText="Upload an MP4 or WebM video file, or enter an external video URL to play on the homepage hero."
                    onChange={(url) => setData({ ...data, videoUrl: url })}
                  />
                )}

                {data.videoMode === "frames" && (
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] text-xs text-[#687378] flex items-start gap-3">
                    <Film className="w-5 h-5 text-[#845B32] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#202A2E] block">
                        Interactive 80-Frame Scroll Scrubbing Active
                      </strong>
                      <span>
                        Hero scrubs dynamically through 80 sequential frames (/home/hero-frames/frame_00.jpg to frame_79.jpg) locked smoothly to the user mousewheel.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Mode Sub-Configuration */}
            {data.mediaType === "image" && (
              <div className="pt-4 border-t border-[#E4DED3] space-y-4">
                <MediaUploader
                  label="Hero Banner Image"
                  value={data.imageUrl || "/home/hero-poster.jpg"}
                  mediaType="image"
                  allowedTypes={["image"]}
                  helperText="Upload high-res JPG, PNG or WebP image (e.g. 1920x1080) for the hero banner."
                  onChange={(url) => setData({ ...data, imageUrl: url })}
                />
              </div>
            )}
          </div>

          {/* Hero Content Texts & CTA */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Hero Headlines & Action Buttons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#D1B48C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Hero Subtitle / Description
                </label>
                <input
                  type="text"
                  value={data.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#D1B48C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Primary Button Text & Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Explore Products"
                    value={data.primaryButtonText || ""}
                    onChange={(e) => setData({ ...data, primaryButtonText: e.target.value })}
                    className="w-1/2 px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E]"
                  />
                  <input
                    type="text"
                    placeholder="/products"
                    value={data.primaryButtonLink || ""}
                    onChange={(e) => setData({ ...data, primaryButtonLink: e.target.value })}
                    className="w-1/2 px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Secondary Button Text & Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Get Instant Quote"
                    value={data.secondaryButtonText || ""}
                    onChange={(e) => setData({ ...data, secondaryButtonText: e.target.value })}
                    className="w-1/2 px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E]"
                  />
                  <input
                    type="text"
                    placeholder="/contact"
                    value={data.secondaryButtonLink || ""}
                    onChange={(e) => setData({ ...data, secondaryButtonLink: e.target.value })}
                    className="w-1/2 px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- ALL OTHER SECTIONS EDITOR --- */
        <div className="space-y-6">
          {/* Section Main Header / Badge & Title */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Header & Headings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Badge / Eyebrow Text
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="e.g. ABOUT AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#D1B48C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Section headline"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#D1B48C] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || data.description || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData({
                      ...data,
                      subtitle: val,
                      description: val,
                    });
                  }}
                  placeholder="Detailed context or description text"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#D1B48C] focus:outline-none"
                />
              </div>
            </div>

            {/* Optional Section Media (Video, Image or GIF) */}
            {(data.mediaUrl !== undefined || data.image !== undefined) && (
              <div className="pt-4 border-t border-[#E4DED3]">
                <MediaUploader
                  label="Section Visual Media (Video / Image / GIF)"
                  value={data.mediaUrl || data.image || ""}
                  mediaType={data.mediaType || "image"}
                  allowedTypes={["image", "video", "gif"]}
                  helperText="Upload any video (MP4/WebM), image (PNG/JPG), or animated GIF for this section."
                  onChange={(url, detectedType) => {
                    setData({
                      ...data,
                      mediaUrl: url,
                      image: url,
                      mediaType: detectedType,
                    });
                  }}
                />
              </div>
            )}
          </div>

          {/* Section Dynamic Items List */}
          {renderDynamicItems(sectionId, data, setData)}
        </div>
      )}

      {/* Bottom Sticky Save Bar */}
      <div className="sticky bottom-4 z-20 bg-[#202A2E] text-[#FFFFFF] p-4 rounded-2xl shadow-xl flex items-center justify-between border border-[#38484E]">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Ready to update:</span>
          <span className="text-[#D1B48C] font-mono">{meta.name}</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#D1B48C] hover:bg-[#c2a275] text-[#202A2E] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving to MongoDB..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}

// Helper to render dynamic item lists for all sections (categories, features, stages, etc.)
function renderDynamicItems(sectionId: string, data: any, setData: (d: any) => void) {
  // Determine item array name based on section
  const listKey =
    data.categories ? "categories" :
    data.features ? "features" :
    data.stages ? "stages" :
    data.industries ? "industries" :
    data.applications ? "applications" :
    data.plyOptions ? "plyOptions" :
    data.principles ? "principles" :
    data.clients ? "clients" :
    data.testimonials ? "testimonials" :
    data.faqs ? "faqs" :
    data.stats ? "stats" :
    data.steps ? "steps" : null;

  if (!listKey || !Array.isArray(data[listKey])) {
    return null;
  }

  const items: any[] = data[listKey];

  const updateItem = (index: number, updatedFields: any) => {
    const nextList = [...items];
    nextList[index] = { ...nextList[index], ...updatedFields };
    setData({ ...data, [listKey]: nextList });
  };

  const addItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: "New Item",
      name: "New Item",
      description: "Description of the new item",
      image: "/home/placeholder.png",
      tag: "Feature",
      number: (items.length + 1).toString().padStart(2, "0"),
    };
    setData({ ...data, [listKey]: [...items, newItem] });
  };

  const deleteItem = (index: number) => {
    if (confirm("Remove this item?")) {
      const nextList = items.filter((_, i) => i !== index);
      setData({ ...data, [listKey]: nextList });
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
        <div>
          <h2 className="font-heading font-bold text-lg text-[#202A2E]">
            List Items & Features ({items.length})
          </h2>
          <p className="text-xs text-[#687378] mt-0.5">
            Modify card titles, descriptions, and upload media (video, image, or gif) for each item.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="px-3.5 py-1.5 rounded-xl bg-[#202A2E] text-[#D1B48C] text-xs font-bold hover:bg-[#2c383d] transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Item</span>
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const itemMedia = item.image || item.mediaUrl || item.logo || "";

          return (
            <div
              key={item.id || index}
              className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] hover:border-[#D1B48C] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-[#845B32] px-2 py-0.5 rounded bg-[#E4DED3]/40">
                  Item #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => deleteItem(index)}
                  className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Title / Name / Question */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                    Title / Headline / Question
                  </label>
                  <input
                    type="text"
                    value={item.title || item.name || item.q || item.label || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateItem(index, { title: v, name: v, q: v, label: v });
                    }}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E]"
                  />
                </div>

                {/* Tag / Category / Badge / Number */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                    Tag / Category / Badge / Number
                  </label>
                  <input
                    type="text"
                    value={item.tag || item.category || item.badge || item.number || item.suffix || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateItem(index, { tag: v, category: v, badge: v, number: v, suffix: v });
                    }}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E]"
                  />
                </div>

                {/* Description / Answer / Subtext */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                    Description / Subtitle / Answer
                  </label>
                  <textarea
                    rows={2}
                    value={item.description || item.a || item.subtext || item.quote || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateItem(index, { description: v, a: v, subtext: v, quote: v });
                    }}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E]"
                  />
                </div>

                {/* Media Uploader for this item (if applicable) */}
                {(item.image !== undefined || item.mediaUrl !== undefined || item.logo !== undefined) && (
                  <div className="md:col-span-2">
                    <MediaUploader
                      label="Item Media (Video / Image / GIF)"
                      value={itemMedia}
                      mediaType={item.mediaType || "image"}
                      allowedTypes={["image", "video", "gif"]}
                      onChange={(url, detectedType) => {
                        updateItem(index, {
                          image: url,
                          mediaUrl: url,
                          logo: url,
                          mediaType: detectedType,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
