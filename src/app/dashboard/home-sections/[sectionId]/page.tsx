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
  Play,
  Pause,
  Video,
  Factory,
  Printer,
  Scissors,
  Package,
  ShieldCheck,
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
  const [heroFrameIndex, setHeroFrameIndex] = useState(0);
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [activeProcessTab, setActiveProcessTab] = useState<number | null>(null);
  const [activeIndustryTab, setActiveIndustryTab] = useState<number | null>(null);

  // Auto-play interactive 80-frame hero preview when enabled
  useEffect(() => {
    if (!heroPlaying) return;
    const interval = setInterval(() => {
      setHeroFrameIndex((prev) => (prev >= 79 ? 0 : prev + 1));
    }, 45); // ~22 fps
    return () => clearInterval(interval);
  }, [heroPlaying]);

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
  const isAboutUs = sectionId === "about-us";
  const isCustomPackaging = sectionId === "custom-packaging";
  const isManufacturingProcess = sectionId === "manufacturing-process";
  const isIndustriesWeServe = sectionId === "industries-we-serve";

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
            className="px-5 py-2 rounded-xl bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
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
          {/* 1. Live Hero Background Media Preview Card */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4DED3] pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                  Live Website Background
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Current Hero Media Preview
                </h2>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E97835]/15 text-[#E97835] border border-[#E97835]/25 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E97835] animate-pulse" />
                  {data.mediaType === "image"
                    ? "Static Banner Image Active"
                    : data.videoMode === "video-url"
                    ? "Custom MP4 Video Active"
                    : "Interactive 80-Frame Video Active"}
                </span>
              </div>
            </div>

            {/* Media Player / Canvas Preview Container */}
            <div className="relative aspect-[16/9] w-full max-h-[380px] bg-[#1A1816] rounded-xl overflow-hidden border border-[#E4DED3] flex items-center justify-center">
              {data.mediaType === "image" ? (
                // Banner Image Preview
                <img
                  src={data.imageUrl || "/home/company img.png"}
                  alt="Hero Banner Image Preview"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = "true";
                      target.src = `http://localhost:3000${(data.imageUrl || "/home/company img.png").startsWith("/") ? "" : "/"}${encodeURI(data.imageUrl || "/home/company img.png")}`;
                    }
                  }}
                />
              ) : data.videoMode === "video-url" && data.videoUrl ? (
                // Custom Video File Preview
                <video
                  src={data.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                // Interactive 80-Frame Manufacturing Video Preview
                <div className="relative w-full h-full flex flex-col justify-between">
                  <img
                    src={`http://localhost:3000/home/hero-frames/frame_${heroFrameIndex.toString().padStart(2, "0")}.jpg`}
                    alt={`Hero manufacturing frame ${heroFrameIndex}`}
                    className="w-full h-full object-cover object-center select-none"
                  />
                  {/* Overlay Controls */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-white font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setHeroPlaying(!heroPlaying)}
                          className="px-2.5 py-1 rounded-lg bg-[#E97835] hover:bg-[#d66a2a] text-white flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          {heroPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{heroPlaying ? "Pause Video" : "Play Video"}</span>
                        </button>
                        <span className="text-[11px] text-white/90">
                          Frame: <strong className="text-white font-mono">{heroFrameIndex + 1} / 80</strong>
                        </span>
                      </div>
                      <span className="text-[11px] text-[#D1B48C]">
                        Scroll-scrubbed on live website
                      </span>
                    </div>

                    {/* Scrub Slider */}
                    <input
                      type="range"
                      min={0}
                      max={79}
                      value={heroFrameIndex}
                      onChange={(e) => {
                        setHeroPlaying(false);
                        setHeroFrameIndex(Number(e.target.value));
                      }}
                      className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#E97835]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Choose Hero Media Mode & Upload Options */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Hero Background Switcher & Upload
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                Choose or Upload Hero Media
              </h2>
              <p className="text-xs text-[#687378] mt-1">
                Select between the interactive 80-frame manufacturing video, your own custom uploaded video, or a static high-resolution banner image.
              </p>
            </div>

            {/* 3 Tab Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: 80-Frame Interactive Video */}
              <button
                type="button"
                onClick={() => setData({ ...data, mediaType: "video", videoMode: "frames" })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  data.mediaType === "video" && (data.videoMode === "frames" || !data.videoMode)
                    ? "bg-[#FFF8F3] text-[#202A2E] border-2 border-[#E97835] shadow-xs ring-2 ring-[#E97835]/15"
                    : "bg-[#FFFFFF] hover:bg-[#FAF9F5] text-[#202A2E] border-[#E4DED3] hover:border-[#D1B48C]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    data.mediaType === "video" && (data.videoMode === "frames" || !data.videoMode)
                      ? "bg-[#E97835] text-white"
                      : "bg-[#F5F2EB] text-[#687378]"
                  }`}>
                    <Film className="w-4 h-4" />
                  </div>
                  {data.mediaType === "video" && (data.videoMode === "frames" || !data.videoMode) && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E97835] text-white font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs">Interactive 80-Frame Video</div>
                  <p className="text-[11px] text-[#687378] mt-0.5 leading-snug">
                    Mousewheel-scrubbed manufacturing video (Website default).
                  </p>
                </div>
              </button>

              {/* Option 2: Upload Custom Video */}
              <button
                type="button"
                onClick={() => setData({ ...data, mediaType: "video", videoMode: "video-url" })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  data.mediaType === "video" && data.videoMode === "video-url"
                    ? "bg-[#FFF8F3] text-[#202A2E] border-2 border-[#E97835] shadow-xs ring-2 ring-[#E97835]/15"
                    : "bg-[#FFFFFF] hover:bg-[#FAF9F5] text-[#202A2E] border-[#E4DED3] hover:border-[#D1B48C]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    data.mediaType === "video" && data.videoMode === "video-url"
                      ? "bg-[#E97835] text-white"
                      : "bg-[#F5F2EB] text-[#687378]"
                  }`}>
                    <Video className="w-4 h-4" />
                  </div>
                  {data.mediaType === "video" && data.videoMode === "video-url" && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E97835] text-white font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs">Upload Custom Video</div>
                  <p className="text-[11px] text-[#687378] mt-0.5 leading-snug">
                    Upload an MP4 / WebM video file to autoplay in the background.
                  </p>
                </div>
              </button>

              {/* Option 3: Banner Image */}
              <button
                type="button"
                onClick={() => setData({ ...data, mediaType: "image" })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                  data.mediaType === "image"
                    ? "bg-[#FFF8F3] text-[#202A2E] border-2 border-[#E97835] shadow-xs ring-2 ring-[#E97835]/15"
                    : "bg-[#FFFFFF] hover:bg-[#FAF9F5] text-[#202A2E] border-[#E4DED3] hover:border-[#D1B48C]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    data.mediaType === "image"
                      ? "bg-[#E97835] text-white"
                      : "bg-[#F5F2EB] text-[#687378]"
                  }`}>
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  {data.mediaType === "image" && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E97835] text-white font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs">Upload Banner Image</div>
                  <p className="text-[11px] text-[#687378] mt-0.5 leading-snug">
                    Upload a high-resolution banner photo for the hero background.
                  </p>
                </div>
              </button>
            </div>

            {/* DIRECT UPLOAD CONTROLS BASED ON ACTIVE TAB */}
            {data.mediaType === "video" && data.videoMode === "video-url" && (
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-3">
                <MediaUploader
                  label="Upload Custom Hero Video (MP4 / WebM)"
                  value={data.videoUrl || ""}
                  mediaType="video"
                  allowedTypes={["video"]}
                  helperText="Upload an MP4 or WebM video file, or select a factory video from the website."
                  onChange={(url) => setData({ ...data, videoUrl: url, mediaType: "video", videoMode: "video-url" })}
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E4DED3]">
                  <span className="text-[11px] font-bold text-[#687378]">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        videoUrl: "/home/Cardboard_box_manufacturing_process_5dda02d1_1080p_gwr_video_mvp.mp4",
                        mediaType: "video",
                        videoMode: "video-url",
                      })
                    }
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:border-[#E97835] hover:text-[#E97835] font-semibold transition-colors cursor-pointer"
                  >
                    🎬 1080p Factory Process Video (MP4)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        videoUrl: "/home/sustainability/factory-worker-packing.mp4",
                        mediaType: "video",
                        videoMode: "video-url",
                      })
                    }
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:border-[#E97835] hover:text-[#E97835] font-semibold transition-colors cursor-pointer"
                  >
                    📦 Worker Packing Video (MP4)
                  </button>
                </div>
              </div>
            )}

            {data.mediaType === "image" && (
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-3">
                <MediaUploader
                  label="Upload Hero Banner Image (JPG / PNG / WebP)"
                  value={data.imageUrl || "/home/company img.png"}
                  mediaType="image"
                  allowedTypes={["image"]}
                  helperText="Upload a high-resolution background banner image (e.g. 1920x1080) for the homepage hero."
                  onChange={(url) => setData({ ...data, imageUrl: url, mediaType: "image" })}
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E4DED3]">
                  <span className="text-[11px] font-bold text-[#687378]">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, imageUrl: "/home/company img.png", mediaType: "image" })}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:border-[#E97835] hover:text-[#E97835] font-semibold transition-colors cursor-pointer"
                  >
                    🏭 Factory Facility Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, imageUrl: "/home/hero-frames/frame_00.jpg", mediaType: "image" })}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] hover:border-[#E97835] hover:text-[#E97835] font-semibold transition-colors cursor-pointer"
                  >
                    📦 Cardboard Frame #00
                  </button>
                </div>
              </div>
            )}

            {(data.mediaType === "video" && (data.videoMode === "frames" || !data.videoMode)) && (
              <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#E97835]/30 text-xs text-[#202A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Film className="w-5 h-5 text-[#E97835] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-bold text-[#202A2E]">
                      Interactive 80-Frame Scroll Scrubbing Active on Website
                    </strong>
                    <p className="text-xs text-[#687378] mt-1">
                      Visitors scrub dynamically through 80 sequential frames (/home/hero-frames/frame_00.jpg to frame_79.jpg) locked smoothly to their mousewheel. Use the live preview above to scrub or play it.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setData({ ...data, mediaType: "video", videoMode: "video-url" })}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-[#E4DED3] hover:border-[#E97835] text-[#202A2E] font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Upload Video (MP4) &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, mediaType: "image" })}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-[#E4DED3] hover:border-[#E97835] text-[#202A2E] font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Upload Image &rarr;
                  </button>
                </div>
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
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
      ) : isAboutUs ? (
        /* --- DEDICATED ABOUT US & STATISTICS EDITOR --- */
        <div className="space-y-6">
          {/* Card 1: Section Eyebrow Badge & Main Title */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Eyebrow & Main Title
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Category Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="ABOUT AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Section Headline
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Protection Begins With Better Packaging."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Company Facility Image (Live Preview & Upload) */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Manufacturing Facility Visual
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                About Section Factory Image
              </h2>
              <p className="text-xs text-[#687378] mt-1">
                Displays on the left 50% column of the About Us section on the homepage. Default: /home/company img.png
              </p>
            </div>

            <MediaUploader
              label="Company Facility / Factory Image"
              value={data.mediaUrl || data.image || "/home/company img.png"}
              mediaType="image"
              allowedTypes={["image"]}
              helperText="Upload a high-resolution factory image or enter an asset path. Changes update the live factory photo on the website."
              onChange={(url) => {
                setData({
                  ...data,
                  mediaUrl: url,
                  image: url,
                });
              }}
            />
          </div>

          {/* Card 3: Story Paragraphs (First & Second Paragraph) */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Company Story Paragraphs
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center justify-between">
                  <span>First Paragraph (Core Mission)</span>
                  <span className="text-[10px] text-[#E97835] font-semibold">Primary Text</span>
                </label>
                <textarea
                  rows={3}
                  value={data.description || ""}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="At AAVRIT Packaging, we believe packaging is more than just a box. It is an essential part of protecting products, maintaining quality and helping businesses deliver with confidence."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center justify-between">
                  <span>Second Paragraph (Capabilities & Practical Value)</span>
                  <span className="text-[10px] text-[#E97835] font-semibold">Detailed Story</span>
                </label>
                <textarea
                  rows={3}
                  value={
                    data.secondParagraph !== undefined
                      ? data.secondParagraph
                      : "From customized corrugated boxes to dependable bulk packaging solutions, our focus is on understanding business requirements and creating packaging that combines strength, practicality and value."
                  }
                  onChange={(e) => setData({ ...data, secondParagraph: e.target.value })}
                  placeholder="From customized corrugated boxes to dependable bulk packaging solutions, our focus is on understanding business requirements and creating packaging that combines strength, practicality and value."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 4: 6 Brand Qualities (Checkmark Grid) */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Brand Value Checkmarks
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  The 6 interactive checkmark points displayed below the story paragraphs on the website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentQualities = data.qualities || [
                    "Built Around Your Requirements",
                    "Certified In-House Lab Testing",
                    "Strength in Every Layer",
                    "High-Speed Automated Capacity",
                    "Focused on Reliable Packaging",
                    "Eco-Friendly 100% Recyclable",
                  ];
                  setData({
                    ...data,
                    qualities: [...currentQualities, "New Quality Point"],
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quality</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                data.qualities || [
                  "Built Around Your Requirements",
                  "Certified In-House Lab Testing",
                  "Strength in Every Layer",
                  "High-Speed Automated Capacity",
                  "Focused on Reliable Packaging",
                  "Eco-Friendly 100% Recyclable",
                ]
              ).map((quality: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] hover:border-[#E97835]/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-md bg-[#E97835]/15 text-[#E97835] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={quality}
                    onChange={(e) => {
                      const list = [
                        ...(data.qualities || [
                          "Built Around Your Requirements",
                          "Certified In-House Lab Testing",
                          "Strength in Every Layer",
                          "High-Speed Automated Capacity",
                          "Focused on Reliable Packaging",
                          "Eco-Friendly 100% Recyclable",
                        ]),
                      ];
                      list[idx] = e.target.value;
                      setData({ ...data, qualities: list });
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = (data.qualities || [
                        "Built Around Your Requirements",
                        "Certified In-House Lab Testing",
                        "Strength in Every Layer",
                        "High-Speed Automated Capacity",
                        "Focused on Reliable Packaging",
                        "Eco-Friendly 100% Recyclable",
                      ]).filter((_: any, i: number) => i !== idx);
                      setData({ ...data, qualities: list });
                    }}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                    title="Remove quality"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Statistics Impact Counters (4 Metric Cards with Number, Suffix, Label, Subtext) */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                  Impact Metrics
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                  Live Animated Statistics Counters
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  4 counter cards with animated numeric rollups on the website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentStats = data.stats || [];
                  const newStat = {
                    id: `stat-${Date.now()}`,
                    value: 100,
                    suffix: "+",
                    label: "New Metric",
                    subtext: "Description of metric",
                  };
                  setData({ ...data, stats: [...currentStats, newStat] });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                data.stats || [
                  { id: "stat-1", value: 25, suffix: "+", label: "Years of Experience", subtext: "Dedicated manufacturing journey" },
                  { id: "stat-2", value: 500, suffix: "+", label: "Clients Served", subtext: "Across major industrial sectors" },
                  { id: "stat-3", value: 1200, suffix: "+", label: "Packaging Solutions", subtext: "Engineered box designs" },
                  { id: "stat-4", value: 65, suffix: "+", label: "Cities Reached", subtext: "Pan-India delivery network" },
                ]
              ).map((stat: any, idx: number) => {
                const statId = stat.id || `stat-${idx + 1}`;
                return (
                  <div
                    key={statId}
                    className="p-5 rounded-2xl border border-[#E4DED3] bg-[#FAF9F5] hover:border-[#E97835]/60 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded">
                          Metric #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#202A2E]">
                          Live Counter: <span className="text-[#E97835] font-extrabold text-sm">{stat.value}{stat.suffix || ""}</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentStats = data.stats || [
                            { id: "stat-1", value: 25, suffix: "+", label: "Years of Experience", subtext: "Dedicated manufacturing journey" },
                            { id: "stat-2", value: 500, suffix: "+", label: "Clients Served", subtext: "Across major industrial sectors" },
                            { id: "stat-3", value: 1200, suffix: "+", label: "Packaging Solutions", subtext: "Engineered box designs" },
                            { id: "stat-4", value: 65, suffix: "+", label: "Cities Reached", subtext: "Pan-India delivery network" },
                          ];
                          setData({
                            ...data,
                            stats: currentStats.filter((_: any, i: number) => i !== idx),
                          });
                        }}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove metric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Counter Number (Value)
                        </label>
                        <input
                          type="number"
                          value={stat.value !== undefined ? stat.value : 0}
                          onChange={(e) => {
                            const currentStats = [
                              ...(data.stats || [
                                { id: "stat-1", value: 25, suffix: "+", label: "Years of Experience", subtext: "Dedicated manufacturing journey" },
                                { id: "stat-2", value: 500, suffix: "+", label: "Clients Served", subtext: "Across major industrial sectors" },
                                { id: "stat-3", value: 1200, suffix: "+", label: "Packaging Solutions", subtext: "Engineered box designs" },
                                { id: "stat-4", value: 65, suffix: "+", label: "Cities Reached", subtext: "Pan-India delivery network" },
                              ]),
                            ];
                            currentStats[idx] = {
                              ...currentStats[idx],
                              value: e.target.value === "" ? 0 : Number(e.target.value),
                            };
                            setData({ ...data, stats: currentStats });
                          }}
                          placeholder="25"
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Suffix / Unit
                        </label>
                        <input
                          type="text"
                          value={stat.suffix !== undefined ? stat.suffix : "+"}
                          onChange={(e) => {
                            const currentStats = [
                              ...(data.stats || [
                                { id: "stat-1", value: 25, suffix: "+", label: "Years of Experience", subtext: "Dedicated manufacturing journey" },
                                { id: "stat-2", value: 500, suffix: "+", label: "Clients Served", subtext: "Across major industrial sectors" },
                                { id: "stat-3", value: 1200, suffix: "+", label: "Packaging Solutions", subtext: "Engineered box designs" },
                                { id: "stat-4", value: 65, suffix: "+", label: "Cities Reached", subtext: "Pan-India delivery network" },
                              ]),
                            ];
                            currentStats[idx] = {
                              ...currentStats[idx],
                              suffix: e.target.value,
                            };
                            setData({ ...data, stats: currentStats });
                          }}
                          placeholder="+"
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#E97835] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Metric Label / Title
                        </label>
                        <input
                          type="text"
                          value={stat.label || ""}
                          onChange={(e) => {
                            const currentStats = [
                              ...(data.stats || [
                                { id: "stat-1", value: 25, suffix: "+", label: "Years of Experience", subtext: "Dedicated manufacturing journey" },
                                { id: "stat-2", value: 500, suffix: "+", label: "Clients Served", subtext: "Across major industrial sectors" },
                                { id: "stat-3", value: 1200, suffix: "+", label: "Packaging Solutions", subtext: "Engineered box designs" },
                                { id: "stat-4", value: 65, suffix: "+", label: "Cities Reached", subtext: "Pan-India delivery network" },
                              ]),
                            ];
                            currentStats[idx] = {
                              ...currentStats[idx],
                              label: e.target.value,
                            };
                            setData({ ...data, stats: currentStats });
                          }}
                          placeholder="Years of Experience"
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Subtext / Explanation
                        </label>
                        <input
                          type="text"
                          value={stat.subtext || ""}
                          onChange={(e) => {
                            const currentStats = [
                              ...(data.stats || [
                                { id: "stat-1", value: 25, suffix: "+", label: "Years of Experience", subtext: "Dedicated manufacturing journey" },
                                { id: "stat-2", value: 500, suffix: "+", label: "Clients Served", subtext: "Across major industrial sectors" },
                                { id: "stat-3", value: 1200, suffix: "+", label: "Packaging Solutions", subtext: "Engineered box designs" },
                                { id: "stat-4", value: 65, suffix: "+", label: "Cities Reached", subtext: "Pan-India delivery network" },
                              ]),
                            ];
                            currentStats[idx] = {
                              ...currentStats[idx],
                              subtext: e.target.value,
                            };
                            setData({ ...data, stats: currentStats });
                          }}
                          placeholder="Dedicated manufacturing journey"
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#687378] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : isCustomPackaging ? (
        /* --- CUSTOM PACKAGING DEDICATED EDITOR --- */
        <div className="space-y-6">
          {/* Card 1: Section Main Header & Headings */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Section Presentation
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                Section Header & Headings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="CUSTOM PACKAGING SOLUTIONS"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
                  placeholder="Packaging Designed Around Your Needs."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || data.description || ""}
                  onChange={(e) =>
                    setData({ ...data, subtitle: e.target.value, description: e.target.value })
                  }
                  placeholder="Every product has different packaging requirements. Tell us what you need, and we'll help create customized corrugated packaging solutions that fit your product, dimensions and business requirements."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Precision Kraft Engineering Concept & Process Steps */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Process & Concept
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                Precision Kraft Engineering Concept & Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Concept Headline
                </label>
                <input
                  type="text"
                  value={data.conceptTitle || ""}
                  onChange={(e) => setData({ ...data, conceptTitle: e.target.value })}
                  placeholder="Precision Kraft Engineering from Concept to Prototype"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Concept Description
                </label>
                <textarea
                  rows={2}
                  value={data.conceptDesc || ""}
                  onChange={(e) => setData({ ...data, conceptDesc: e.target.value })}
                  placeholder="Whether shipping fragile automotive electronics, high-volume retail goods..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>

            {/* Process Steps List with Add Step Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                    From Your Idea to Your Packaging Steps
                  </label>
                  <p className="text-[11px] text-[#62574D]">Progressive development steps shown in the concept box.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = data.processSteps || [
                      { num: "01", title: "Share Your Requirements", desc: "Tell us about your product, dimensions and packaging needs." },
                      { num: "02", title: "Discuss Your Design", desc: "Explore suitable box structures, board strength and printing options." },
                      { num: "03", title: "Get Your Custom Solution", desc: "Our team reviews your requirements and works towards a suitable packaging solution." },
                    ];
                    const nextNum = (current.length + 1).toString().padStart(2, "0");
                    setData({
                      ...data,
                      processSteps: [
                        ...current,
                        {
                          num: nextNum,
                          title: `Step ${current.length + 1}`,
                          desc: "Enter packaging process step details.",
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              {(
                data.processSteps || [
                  { num: "01", title: "Share Your Requirements", desc: "Tell us about your product, dimensions and packaging needs." },
                  { num: "02", title: "Discuss Your Design", desc: "Explore suitable box structures, board strength and printing options." },
                  { num: "03", title: "Get Your Custom Solution", desc: "Our team reviews your requirements and works towards a suitable packaging solution." },
                ]
              ).map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#E97835] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {step.num || `0${idx + 1}`}
                      </span>
                      <span className="text-xs font-bold text-[#202A2E]">Step {idx + 1}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = [
                          ...(data.processSteps || [
                            { num: "01", title: "Share Your Requirements", desc: "Tell us about your product, dimensions and packaging needs." },
                            { num: "02", title: "Discuss Your Design", desc: "Explore suitable box structures, board strength and printing options." },
                            { num: "03", title: "Get Your Custom Solution", desc: "Our team reviews your requirements and works towards a suitable packaging solution." },
                          ]),
                        ];
                        const updated = current
                          .filter((_, i) => i !== idx)
                          .map((s, newIdx) => ({
                            ...s,
                            num: (newIdx + 1).toString().padStart(2, "0"),
                          }));
                        setData({ ...data, processSteps: updated });
                      }}
                      className="p-1.5 text-[#62574D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title || ""}
                        onChange={(e) => {
                          const steps = [
                            ...(data.processSteps || [
                              { num: "01", title: "Share Your Requirements", desc: "Tell us about your product, dimensions and packaging needs." },
                              { num: "02", title: "Discuss Your Design", desc: "Explore suitable box structures, board strength and printing options." },
                              { num: "03", title: "Get Your Custom Solution", desc: "Our team reviews your requirements and works towards a suitable packaging solution." },
                            ]),
                          ];
                          steps[idx] = { ...steps[idx], title: e.target.value };
                          setData({ ...data, processSteps: steps });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                        Step Description
                      </label>
                      <input
                        type="text"
                        value={step.desc || ""}
                        onChange={(e) => {
                          const steps = [
                            ...(data.processSteps || [
                              { num: "01", title: "Share Your Requirements", desc: "Tell us about your product, dimensions and packaging needs." },
                              { num: "02", title: "Discuss Your Design", desc: "Explore suitable box structures, board strength and printing options." },
                              { num: "03", title: "Get Your Custom Solution", desc: "Our team reviews your requirements and works towards a suitable packaging solution." },
                            ]),
                          ];
                          steps[idx] = { ...steps[idx], desc: e.target.value };
                          setData({ ...data, processSteps: steps });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Packaging Capabilities Cards with Add Capability Button */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                  Packaging Capabilities
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                  Core Capability Feature Cards
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = data.capabilities || [
                    { id: "cap-1", title: "Custom Dimensions", desc: "Box sizes designed around your product measurements.", icon: "Ruler" },
                    { id: "cap-2", title: "Box Styles", desc: "Different structural designs to suit your packaging requirements.", icon: "Box" },
                    { id: "cap-3", title: "Corrugated Strength", desc: "Choose suitable board construction for your packaging needs.", icon: "Layers" },
                    { id: "cap-4", title: "Custom Printing", desc: "Add your branding and product information through customized printing.", icon: "Printer" },
                  ];
                  setData({
                    ...data,
                    capabilities: [
                      ...current,
                      {
                        id: `cap-${Date.now()}`,
                        title: "New Capability",
                        desc: "Details about this packaging capability or specification option.",
                        icon: "Box",
                      },
                    ],
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Capability</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                data.capabilities || [
                  { id: "cap-1", title: "Custom Dimensions", desc: "Box sizes designed around your product measurements.", icon: "Ruler" },
                  { id: "cap-2", title: "Box Styles", desc: "Different structural designs to suit your packaging requirements.", icon: "Box" },
                  { id: "cap-3", title: "Corrugated Strength", desc: "Choose suitable board construction for your packaging needs.", icon: "Layers" },
                  { id: "cap-4", title: "Custom Printing", desc: "Add your branding and product information through customized printing.", icon: "Printer" },
                ]
              ).map((cap: any, idx: number) => (
                <div
                  key={cap.id || idx}
                  className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded">
                        Capability #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#202A2E]">{cap.title}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = [
                          ...(data.capabilities || [
                            { id: "cap-1", title: "Custom Dimensions", desc: "Box sizes designed around your product measurements.", icon: "Ruler" },
                            { id: "cap-2", title: "Box Styles", desc: "Different structural designs to suit your packaging requirements.", icon: "Box" },
                            { id: "cap-3", title: "Corrugated Strength", desc: "Choose suitable board construction for your packaging needs.", icon: "Layers" },
                            { id: "cap-4", title: "Custom Printing", desc: "Add your branding and product information through customized printing.", icon: "Printer" },
                          ]),
                        ];
                        const updated = current.filter((_, i) => i !== idx);
                        setData({ ...data, capabilities: updated });
                      }}
                      className="p-1.5 text-[#62574D] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Capability"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={cap.title || ""}
                          onChange={(e) => {
                            const list = [
                              ...(data.capabilities || [
                                { id: "cap-1", title: "Custom Dimensions", desc: "Box sizes designed around your product measurements.", icon: "Ruler" },
                                { id: "cap-2", title: "Box Styles", desc: "Different structural designs to suit your packaging requirements.", icon: "Box" },
                                { id: "cap-3", title: "Corrugated Strength", desc: "Choose suitable board construction for your packaging needs.", icon: "Layers" },
                                { id: "cap-4", title: "Custom Printing", desc: "Add your branding and product information through customized printing.", icon: "Printer" },
                              ]),
                            ];
                            list[idx] = { ...list[idx], title: e.target.value };
                            setData({ ...data, capabilities: list });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Icon
                        </label>
                        <select
                          value={cap.icon || "Box"}
                          onChange={(e) => {
                            const list = [
                              ...(data.capabilities || [
                                { id: "cap-1", title: "Custom Dimensions", desc: "Box sizes designed around your product measurements.", icon: "Ruler" },
                                { id: "cap-2", title: "Box Styles", desc: "Different structural designs to suit your packaging requirements.", icon: "Box" },
                                { id: "cap-3", title: "Corrugated Strength", desc: "Choose suitable board construction for your packaging needs.", icon: "Layers" },
                                { id: "cap-4", title: "Custom Printing", desc: "Add your branding and product information through customized printing.", icon: "Printer" },
                              ]),
                            ];
                            list[idx] = { ...list[idx], icon: e.target.value };
                            setData({ ...data, capabilities: list });
                          }}
                          className="w-full px-2.5 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        >
                          <option value="Ruler">Ruler</option>
                          <option value="Box">Box</option>
                          <option value="Layers">Layers</option>
                          <option value="Printer">Printer</option>
                          <option value="ShieldCheck">Shield</option>
                          <option value="CheckCircle2">Checkmark</option>
                          <option value="Sparkles">Sparkles</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={cap.desc || cap.description || ""}
                        onChange={(e) => {
                          const list = [
                            ...(data.capabilities || [
                              { id: "cap-1", title: "Custom Dimensions", desc: "Box sizes designed around your product measurements.", icon: "Ruler" },
                              { id: "cap-2", title: "Box Styles", desc: "Different structural designs to suit your packaging requirements.", icon: "Box" },
                              { id: "cap-3", title: "Corrugated Strength", desc: "Choose suitable board construction for your packaging needs.", icon: "Layers" },
                              { id: "cap-4", title: "Custom Printing", desc: "Add your branding and product information through customized printing.", icon: "Printer" },
                            ]),
                          ];
                          list[idx] = { ...list[idx], desc: e.target.value, description: e.target.value };
                          setData({ ...data, capabilities: list });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Fast 24-Hour Design Turnaround CTA Banner */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Bottom Action Card
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                Fast 24-Hour Turnaround Inquiry CTA
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  CTA Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.ctaBadge || ""}
                  onChange={(e) => setData({ ...data, ctaBadge: e.target.value })}
                  placeholder="FAST 24-HOUR DESIGN TURNAROUND"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  CTA Main Headline
                </label>
                <input
                  type="text"
                  value={data.ctaTitle || ""}
                  onChange={(e) => setData({ ...data, ctaTitle: e.target.value })}
                  placeholder="Have a Packaging Requirement?"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  CTA Description
                </label>
                <input
                  type="text"
                  value={data.ctaDesc || ""}
                  onChange={(e) => setData({ ...data, ctaDesc: e.target.value })}
                  placeholder="Share your idea with us. Let's discuss the right corrugated packaging solution for your business."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={data.ctaButtonText || ""}
                  onChange={(e) => setData({ ...data, ctaButtonText: e.target.value })}
                  placeholder="Request Custom Packaging"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={data.ctaButtonLink || ""}
                  onChange={(e) => setData({ ...data, ctaButtonLink: e.target.value })}
                  placeholder="#quote"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isManufacturingProcess ? (
        /* --- MANUFACTURING PROCESS DEDICATED EDITOR --- */
        <div className="space-y-6">
          {/* Card 1: Section Main Header & Headings */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Section Presentation
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                Section Header & Headings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="OUR MANUFACTURING PROCESS"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
                  placeholder="From Raw Material to Ready-to-Ship Packaging."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || data.description || ""}
                  onChange={(e) =>
                    setData({ ...data, subtitle: e.target.value, description: e.target.value })
                  }
                  placeholder="Every corrugated box goes through a carefully coordinated manufacturing process. From selecting quality raw materials to final inspection, each stage focuses on strength, precision and consistency."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: 6 Production Stages Workflow */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4DED3] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                  Production Stages Workflow
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                  {(data.stages || []).length} Manufacturing Stages
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Manage stage titles, factory machinery photos, and manufacturing & quality engineering standards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const current = data.stages || [];
                  const nextNum = (current.length + 1).toString().padStart(2, "0");
                  const newStage = {
                    id: `stage-${nextNum}`,
                    number: nextNum,
                    title: `Stage ${current.length + 1}`,
                    description: "Describe the machinery, process or operations in this manufacturing phase.",
                    visualLabel: "Production Line Specification",
                    icon: "Factory",
                    mediaType: "image",
                    image: "/home/manufacturing-process/raw-material-selection.png",
                    technicalSpecs: [
                      "Quality specification standard 1",
                      "Operational testing parameter 2",
                      "Precision compliance standard 3",
                    ],
                  };
                  setData({ ...data, stages: [...current, newStage] });
                  setActiveProcessTab(current.length);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            {/* Quick Stage Filter / Tab Navigator */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveProcessTab(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeProcessTab === null
                    ? "bg-[#202A2E] text-white shadow-xs"
                    : "bg-[#FAF9F5] border border-[#E4DED3] text-[#62574D] hover:bg-white"
                }`}
              >
                Show All Stages ({(data.stages || []).length})
              </button>

              {(data.stages || []).map((stg: any, sIdx: number) => (
                <button
                  key={stg.id || sIdx}
                  type="button"
                  onClick={() => setActiveProcessTab(sIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeProcessTab === sIdx
                      ? "bg-[#E97835] text-white shadow-xs"
                      : "bg-[#FAF9F5] border border-[#E4DED3] text-[#62574D] hover:bg-white"
                  }`}
                >
                  <span className="font-mono">{stg.number || `0${sIdx + 1}`}</span>
                  <span className="truncate max-w-[140px]">{stg.title || `Stage ${sIdx + 1}`}</span>
                </button>
              ))}
            </div>

            {/* Stages List */}
            <div className="space-y-6">
              {(data.stages || []).map((stage: any, sIdx: number) => {
                if (activeProcessTab !== null && activeProcessTab !== sIdx) return null;

                const specs = Array.isArray(stage.technicalSpecs) ? stage.technicalSpecs : [];

                return (
                  <div
                    key={stage.id || sIdx}
                    className="p-5 sm:p-6 rounded-2xl border border-[#E4DED3] bg-[#FAF9F5] space-y-5 relative group shadow-2xs"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#E97835] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                          {stage.number || `0${sIdx + 1}`}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[#E97835] uppercase">
                              STAGE {stage.number || `0${sIdx + 1}`} OF{" "}
                              {String((data.stages || []).length).padStart(2, "0")}
                            </span>
                            {stage.visualLabel && (
                              <span className="text-[10px] font-semibold text-[#62574D] bg-[#E4DED3]/50 px-2 py-0.5 rounded">
                                {stage.visualLabel}
                              </span>
                            )}
                          </div>
                          <h3 className="font-heading font-bold text-base text-[#202A2E]">
                            {stage.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Remove Stage ${stage.number || sIdx + 1} ("${stage.title}")?`
                            )
                          ) {
                            const updated = (data.stages || []).filter(
                              (_: any, i: number) => i !== sIdx
                            );
                            setData({ ...data, stages: updated });
                            if (activeProcessTab === sIdx) setActiveProcessTab(null);
                          }
                        }}
                        className="p-2 text-[#62574D] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Stage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stage Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Stage Number (e.g. 01)
                        </label>
                        <input
                          type="text"
                          value={stage.number || ""}
                          onChange={(e) => {
                            const stages = [...(data.stages || [])];
                            stages[sIdx] = { ...stages[sIdx], number: e.target.value };
                            setData({ ...data, stages });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Stage Title
                        </label>
                        <input
                          type="text"
                          value={stage.title || ""}
                          onChange={(e) => {
                            const stages = [...(data.stages || [])];
                            stages[sIdx] = { ...stages[sIdx], title: e.target.value };
                            setData({ ...data, stages });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Stage Timeline Icon
                        </label>
                        <select
                          value={stage.icon || "Layers"}
                          onChange={(e) => {
                            const stages = [...(data.stages || [])];
                            stages[sIdx] = { ...stages[sIdx], icon: e.target.value };
                            setData({ ...data, stages });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        >
                          <option value="Layers">Layers (Stage 01 Raw Material)</option>
                          <option value="Factory">Factory (Stage 02 Corrugation)</option>
                          <option value="Printer">Printer (Stage 03 Printing)</option>
                          <option value="Scissors">Scissors (Stage 04 Die-Cutting)</option>
                          <option value="Package">Package (Stage 05 Folding & Assembly)</option>
                          <option value="ShieldCheck">ShieldCheck (Stage 06 Quality QA)</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Line Sub-headline / Visual Label (e.g. Continuous Corrugation Line)
                        </label>
                        <input
                          type="text"
                          value={stage.visualLabel || ""}
                          onChange={(e) => {
                            const stages = [...(data.stages || [])];
                            stages[sIdx] = { ...stages[sIdx], visualLabel: e.target.value };
                            setData({ ...data, stages });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Stage Description
                        </label>
                        <textarea
                          rows={2}
                          value={stage.description || ""}
                          onChange={(e) => {
                            const stages = [...(data.stages || [])];
                            stages[sIdx] = { ...stages[sIdx], description: e.target.value };
                            setData({ ...data, stages });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>
                    </div>

                    {/* Stage Photo Uploader */}
                    <div className="pt-2 border-t border-[#E4DED3]">
                      <MediaUploader
                        label={`Stage ${stage.number || sIdx + 1} Production Photo`}
                        value={stage.image || ""}
                        mediaType={stage.mediaType || "image"}
                        allowedTypes={["image", "video", "gif"]}
                        helperText="High-resolution factory photo illustrating this specific manufacturing phase."
                        onChange={(url, detectedType) => {
                          const stages = [...(data.stages || [])];
                          stages[sIdx] = { ...stages[sIdx], image: url, mediaType: detectedType };
                          setData({ ...data, stages });
                        }}
                      />
                    </div>

                    {/* Manufacturing & Quality Standards (Bullet points) */}
                    <div className="pt-2 border-t border-[#E4DED3] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                            Manufacturing & Quality Standards (Checklist)
                          </label>
                          <p className="text-[11px] text-[#62574D]">
                            Engineering parameters, certifications, and quality control bullet points.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const stages = [...(data.stages || [])];
                            const currentSpecs = Array.isArray(stages[sIdx].technicalSpecs)
                              ? stages[sIdx].technicalSpecs
                              : [];
                            stages[sIdx] = {
                              ...stages[sIdx],
                              technicalSpecs: [...currentSpecs, "New quality specification standard"],
                            };
                            setData({ ...data, stages });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E4DED3] hover:border-[#E97835] hover:text-[#E97835] text-[#202A2E] text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Standard</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {specs.map((spec: string, specIdx: number) => (
                          <div key={specIdx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#E97835]/15 text-[#E97835] flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="text"
                              value={spec}
                              onChange={(e) => {
                                const stages = [...(data.stages || [])];
                                const currentSpecs = [...(stages[sIdx].technicalSpecs || [])];
                                currentSpecs[specIdx] = e.target.value;
                                stages[sIdx] = { ...stages[sIdx], technicalSpecs: currentSpecs };
                                setData({ ...data, stages });
                              }}
                              className="flex-1 px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const stages = [...(data.stages || [])];
                                const currentSpecs = (stages[sIdx].technicalSpecs || []).filter(
                                  (_: any, i: number) => i !== specIdx
                                );
                                stages[sIdx] = { ...stages[sIdx], technicalSpecs: currentSpecs };
                                setData({ ...data, stages });
                              }}
                              className="p-1 text-[#62574D] hover:text-red-500 rounded transition-colors cursor-pointer"
                              title="Delete Standard"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : isIndustriesWeServe ? (
        /* --- INDUSTRIES WE SERVE DEDICATED EDITOR --- */
        <div className="space-y-6">
          {/* Card 1: Section Main Header & Headings */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                Section Presentation
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                Section Header & Headings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="INDUSTRIES WE SERVE"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
                  placeholder="Packaging Solutions Across Every Industry"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || data.description || ""}
                  onChange={(e) =>
                    setData({ ...data, subtitle: e.target.value, description: e.target.value })
                  }
                  placeholder="From automotive components to everyday consumer products, our corrugated packaging solutions support diverse industries with reliable protection, practical design and dependable quality."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: 8 Industries Cards Manager */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4DED3] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E97835]">
                  Target Sectors
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-0.5">
                  {(data.industries || []).length} Industry Categories
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Manage industry titles, routing slugs, dedicated photography, and packaged products / application tags.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const current = data.industries || [];
                  const newInd = {
                    id: `industry-${Date.now()}`,
                    slug: `new-industry-${current.length + 1}`,
                    name: `New Industry ${current.length + 1}`,
                    title: `New Industry ${current.length + 1}`,
                    description: "Corrugated packaging solutions tailored for this industry.",
                    mediaType: "image",
                    image: "/home/industries/automotive.jpg",
                    applications: ["Custom Cartons", "Bulk Packaging", "Protective Boxes"],
                  };
                  setData({ ...data, industries: [...current, newInd] });
                  setActiveIndustryTab(current.length);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Industry</span>
              </button>
            </div>

            {/* Quick Industry Tab Navigator */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveIndustryTab(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeIndustryTab === null
                    ? "bg-[#202A2E] text-white shadow-xs"
                    : "bg-[#FAF9F5] border border-[#E4DED3] text-[#62574D] hover:bg-white"
                }`}
              >
                Show All ({(data.industries || []).length})
              </button>

              {(data.industries || []).map((ind: any, iIdx: number) => (
                <button
                  key={ind.id || iIdx}
                  type="button"
                  onClick={() => setActiveIndustryTab(iIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    activeIndustryTab === iIdx
                      ? "bg-[#E97835] text-white shadow-xs"
                      : "bg-[#FAF9F5] border border-[#E4DED3] text-[#62574D] hover:bg-white"
                  }`}
                >
                  <span className="font-mono">#{iIdx + 1}</span>
                  <span className="truncate max-w-[130px]">{ind.name || ind.title || `Industry ${iIdx + 1}`}</span>
                </button>
              ))}
            </div>

            {/* Industries Cards Grid / List */}
            <div className="space-y-6">
              {(data.industries || []).map((ind: any, iIdx: number) => {
                if (activeIndustryTab !== null && activeIndustryTab !== iIdx) return null;

                const apps = Array.isArray(ind.applications) ? ind.applications : [];

                return (
                  <div
                    key={ind.id || iIdx}
                    className="p-5 sm:p-6 rounded-2xl border border-[#E4DED3] bg-[#FAF9F5] space-y-5 relative group shadow-2xs"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#E97835] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                          {String(iIdx + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[#E97835] uppercase">
                              INDUSTRY #{iIdx + 1}
                            </span>
                            {ind.slug && (
                              <span className="text-[10px] font-mono text-[#62574D] bg-[#E4DED3]/50 px-2 py-0.5 rounded">
                                /industries/{ind.slug}
                              </span>
                            )}
                          </div>
                          <h3 className="font-heading font-bold text-base text-[#202A2E]">
                            {ind.name || ind.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove industry "${ind.name || ind.title}"?`)) {
                            const updated = (data.industries || []).filter(
                              (_: any, i: number) => i !== iIdx
                            );
                            setData({ ...data, industries: updated });
                            if (activeIndustryTab === iIdx) setActiveIndustryTab(null);
                          }
                        }}
                        className="p-2 text-[#62574D] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Industry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Industry Name
                        </label>
                        <input
                          type="text"
                          value={ind.name || ind.title || ""}
                          onChange={(e) => {
                            const list = [...(data.industries || [])];
                            list[iIdx] = { ...list[iIdx], name: e.target.value, title: e.target.value };
                            setData({ ...data, industries: list });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Page URL Slug (e.g. automotive, ecommerce)
                        </label>
                        <input
                          type="text"
                          value={ind.slug || ""}
                          onChange={(e) => {
                            const list = [...(data.industries || [])];
                            list[iIdx] = { ...list[iIdx], slug: e.target.value };
                            setData({ ...data, industries: list });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase text-[#202A2E] mb-1">
                          Industry Description
                        </label>
                        <textarea
                          rows={2}
                          value={ind.description || ""}
                          onChange={(e) => {
                            const list = [...(data.industries || [])];
                            list[iIdx] = { ...list[iIdx], description: e.target.value };
                            setData({ ...data, industries: list });
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:outline-none focus:ring-1 focus:ring-[#E97835]"
                        />
                      </div>
                    </div>

                    {/* Image Uploader */}
                    <div className="pt-2 border-t border-[#E4DED3]">
                      <MediaUploader
                        label={`${ind.name || "Industry"} Card Photography`}
                        value={ind.image || ""}
                        mediaType={ind.mediaType || "image"}
                        allowedTypes={["image", "video", "gif"]}
                        helperText="High-resolution industry photography (4:3 ratio recommended)."
                        onChange={(url, detectedType) => {
                          const list = [...(data.industries || [])];
                          list[iIdx] = { ...list[iIdx], image: url, mediaType: detectedType };
                          setData({ ...data, industries: list });
                        }}
                      />
                    </div>

                    {/* Applications / Products List */}
                    <div className="pt-2 border-t border-[#E4DED3] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                            Applications & Key Sectors Served
                          </label>
                          <p className="text-[11px] text-[#62574D]">
                            Typical goods, parts, and packaging use cases in this sector.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const list = [...(data.industries || [])];
                            const currentApps = Array.isArray(list[iIdx].applications)
                              ? list[iIdx].applications
                              : [];
                            list[iIdx] = {
                              ...list[iIdx],
                              applications: [...currentApps, "New Application"],
                            };
                            setData({ ...data, industries: list });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E4DED3] hover:border-[#E97835] hover:text-[#E97835] text-[#202A2E] text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Application</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        {apps.map((app: string, aIdx: number) => (
                          <div key={aIdx} className="flex items-center gap-1.5 bg-white border border-[#E4DED3] rounded-lg px-2.5 py-1.5">
                            <input
                              type="text"
                              value={app}
                              onChange={(e) => {
                                const list = [...(data.industries || [])];
                                const currentApps = [...(list[iIdx].applications || [])];
                                currentApps[aIdx] = e.target.value;
                                list[iIdx] = { ...list[iIdx], applications: currentApps };
                                setData({ ...data, industries: list });
                              }}
                              className="flex-1 bg-transparent text-xs text-[#202A2E] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(data.industries || [])];
                                const currentApps = (list[iIdx].applications || []).filter(
                                  (_: any, i: number) => i !== aIdx
                                );
                                list[iIdx] = { ...list[iIdx], applications: currentApps };
                                setData({ ...data, industries: list });
                              }}
                              className="p-1 text-[#62574D] hover:text-red-500 rounded transition-colors cursor-pointer"
                              title="Delete Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
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
      <div className="sticky bottom-4 z-20 bg-[#FFFFFF] text-[#202A2E] p-4 rounded-2xl shadow-lg flex items-center justify-between border border-[#E4DED3]">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[#687378]">Ready to update:</span>
          <span className="text-[#E97835] font-bold font-mono">{meta.name}</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
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
          className="px-3.5 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 shadow-xs"
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
