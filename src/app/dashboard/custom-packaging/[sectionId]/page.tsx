"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Boxes,
  Sliders,
  Layers,
  Calculator,
  Smile,
  Film,
  Eye,
  ChevronRight,
  ArrowLeft,
  Ruler,
  Palette,
  ShieldCheck,
  Zap,
  Repeat,
  FileText,
  Compass,
  CheckCircle,
  Truck,
  ArrowRight,
  Box,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  CUSTOM_PACKAGING_SECTIONS_LIST,
  DEFAULT_CUSTOM_PACKAGING_DATA,
} from "@/lib/defaultCustomPackagingData";

const ICON_OPTIONS = [
  "Ruler",
  "Layers",
  "Palette",
  "ShieldCheck",
  "Zap",
  "Repeat",
  "FileText",
  "Compass",
  "CheckCircle",
  "Truck",
  "Boxes",
  "Calculator",
];

export default function CustomPackagingSectionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const sectionId = (params?.sectionId as string) || "hero";

  const meta = CUSTOM_PACKAGING_SECTIONS_LIST.find((s) => s.id === sectionId) || {
    id: sectionId,
    name: "Custom Packaging Section",
    description: "Manage this section",
    icon: "Sparkles",
  };

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/custom-packaging?sectionId=${sectionId}`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            setData(DEFAULT_CUSTOM_PACKAGING_DATA[sectionId] || { sectionId });
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setData(DEFAULT_CUSTOM_PACKAGING_DATA[sectionId] || { sectionId });
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
    if (!data) return;
    try {
      setSaving(true);
      setToast(null);

      const res = await fetch("/api/custom-packaging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, data }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setToast({
          type: "success",
          message: `${meta.name} saved successfully!`,
        });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save section");
      }
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Failed to save section",
      });
    } finally {
      setSaving(false);
    }
  };

  // Box Types Handlers
  const handleAddBoxType = () => {
    if (!data) return;
    const newBox = {
      id: `box-${Date.now()}`,
      title: "New Custom Box Architecture",
      category: "Die-Cut Packaging",
      image: "/Product/items/mailer-boxes.png",
      idealFor: "E-commerce DTC, subscription kits, apparel & cosmetics",
      minOrder: "500 units",
      productionDays: "4-6 days",
      recommendedPly: "3-Ply E-Flute / B-Flute",
      buttonText: "Configure This Box",
    };
    setData({
      ...data,
      boxTypes: [...(data.boxTypes || []), newBox],
    });
  };

  const handleUpdateBoxType = (index: number, field: string, value: string) => {
    if (!data) return;
    const current = [...(data.boxTypes || [])];
    current[index] = { ...current[index], [field]: value };
    setData({ ...data, boxTypes: current });
  };

  const handleRemoveBoxType = (index: number) => {
    if (!data) return;
    const current = [...(data.boxTypes || [])];
    current.splice(index, 1);
    setData({ ...data, boxTypes: current });
  };

  // Capabilities Handlers
  const handleAddCapability = () => {
    if (!data) return;
    const newCap = {
      id: `cap-${Date.now()}`,
      icon: "Ruler",
      title: "New Technical Capability",
      description: "Description of structural packaging manufacturing capability.",
      highlight: "High precision tolerance",
    };
    setData({
      ...data,
      capabilities: [...(data.capabilities || []), newCap],
    });
  };

  const handleUpdateCapability = (index: number, field: string, value: string) => {
    if (!data) return;
    const current = [...(data.capabilities || [])];
    current[index] = { ...current[index], [field]: value };
    setData({ ...data, capabilities: current });
  };

  const handleRemoveCapability = (index: number) => {
    if (!data) return;
    const current = [...(data.capabilities || [])];
    current.splice(index, 1);
    setData({ ...data, capabilities: current });
  };

  // Process Handlers
  const handleAddStep = () => {
    if (!data) return;
    const count = (data.steps || []).length + 1;
    const newStep = {
      step: count.toString().padStart(2, "0"),
      title: "New Workflow Step",
      desc: "Detailed description of manufacturing or fitment confirmation stage.",
      icon: "Compass",
    };
    setData({
      ...data,
      steps: [...(data.steps || []), newStep],
    });
  };

  const handleUpdateStep = (index: number, field: string, value: string) => {
    if (!data) return;
    const current = [...(data.steps || [])];
    current[index] = { ...current[index], [field]: value };
    setData({ ...data, steps: current });
  };

  const handleRemoveStep = (index: number) => {
    if (!data) return;
    const current = [...(data.steps || [])];
    current.splice(index, 1);
    setData({ ...data, steps: current });
  };

  if (loading || !data) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Custom Packaging Section...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Custom Packaging</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              {meta.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            {meta.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            {meta.description}
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
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Section</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Navigation Strip */}
      <div className="bg-white rounded-2xl border border-[#E4DED3] p-1.5 flex gap-1 overflow-x-auto shadow-xs">
        {CUSTOM_PACKAGING_SECTIONS_LIST.map((sec, idx) => {
          const isActive = sec.id === sectionId;
          return (
            <Link
              key={sec.id}
              href={`/dashboard/custom-packaging/${sec.id}`}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors text-center shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{sec.name}</span>
            </Link>
          );
        })}
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

      {/* ======================================================== */}
      {/* 1. HERO BANNER & MASCOT                                  */}
      {/* ======================================================== */}
      {sectionId === "hero" && (
        <div className="space-y-6">
          {/* Headings */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Hero Banner Headings & Breadcrumbs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Custom Packaging"
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
                  placeholder="Home"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Breadcrumb Current
                </label>
                <input
                  type="text"
                  value={data.breadcrumbCurrent || "Custom Packaging"}
                  onChange={(e) => setData({ ...data, breadcrumbCurrent: e.target.value })}
                  placeholder="Custom Packaging"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                />
              </div>
            </div>
          </div>

          {/* Banner Media */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Showcase Banner Background Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <MediaUploader
                  label="Upload Banner Background"
                  value={data.backgroundImage || ""}
                  mediaType="image"
                  allowedTypes={["image", "gif", "video"]}
                  helperText="Full-width panoramic display shown behind headline and mascot."
                  onChange={(url) => setData({ ...data, backgroundImage: url })}
                />
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Background Alt Text
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
                  Background Preview
                </span>
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-[#202A2E] border border-[#E4DED3]">
                  <Image
                    src={data.backgroundImage || "/custom pack/custom_packaging_banner_pano.png"}
                    alt={data.backgroundImageAlt || "Banner"}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-4">
                    <span className="text-white text-xs font-bold font-heading">
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

          {/* Speaking Mascot */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Custom Packaging Design Engineer Mascot / Animated GIF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <MediaUploader
                  label="Mascot / GIF Media"
                  value={data.characterImage || ""}
                  mediaType="image"
                  allowedTypes={["image", "gif", "video"]}
                  helperText="Upload transparent standing engineer PNG or animated GIF."
                  onChange={(url) => setData({ ...data, characterImage: url })}
                />

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Character Alt Text
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
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={data.dialogueIcon || "📐"}
                      onChange={(e) => setData({ ...data, dialogueIcon: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-center font-bold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Speech Title
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
                    Speech Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={data.dialogueSubtext || ""}
                    onChange={(e) => setData({ ...data, dialogueSubtext: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E4DED3] space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378] block">
                  Mascot & Dialogue Preview
                </span>
                <div className="flex items-end gap-3 p-4 rounded-xl bg-[#202A2E] text-white">
                  <div className="relative w-20 h-28 shrink-0">
                    <Image
                      src={data.characterImage || "/custom pack/character_custom_designer.png"}
                      alt={data.characterAlt || "Mascot"}
                      fill
                      className="object-contain object-bottom"
                    />
                  </div>
                  <div className="bg-white text-[#202A2E] p-3 rounded-2xl rounded-bl-none shadow-md border border-[#E4DED3] space-y-0.5 max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{data.dialogueIcon || "📐"}</span>
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
      )}

      {/* ======================================================== */}
      {/* 2. CUSTOM BOX ARCHITECTURES                              */}
      {/* ======================================================== */}
      {sectionId === "box-types" && (
        <div className="space-y-6">
          {/* Headings */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Headings & Description
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="CUSTOMIZABLE STRUCTURES"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Select Your Custom Box Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Section Subtitle
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Every design is fabricated from scratch to match your dimensions, drop-test requirements, and material load thresholds."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Category Filter Tabs (Shown on Website)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(data.filterCategories || [
                { id: "all", label: "All Custom Styles" },
                { id: "die-cut", label: "Die-Cut Mailers" },
                { id: "corrugated", label: "Master Shippers (RSC)" },
                { id: "printed", label: "Branded Flexo" },
                { id: "industrial", label: "Industrial & Partitions" },
              ]).map((cat: any, cIdx: number) => (
                <div key={cIdx} className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#687378] block uppercase">
                    ID: {cat.id}
                  </span>
                  <input
                    type="text"
                    value={cat.label || ""}
                    onChange={(e) => {
                      const updated = [...(data.filterCategories || [])];
                      updated[cIdx] = { ...updated[cIdx], label: e.target.value };
                      setData({ ...data, filterCategories: updated });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-semibold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Box Types Cards */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                  Custom Box Architectures ({data.boxTypes?.length || 0} Cards)
                </h2>
                <p className="text-[11px] text-[#687378]">
                  Matches the exact card layout, labels, and specs displayed on the website.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBoxType}
                className="px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Box Architecture</span>
              </button>
            </div>

            <div className="space-y-6">
              {(data.boxTypes || []).map((box: any, idx: number) => (
                <div
                  key={box.id || idx}
                  className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E4DED3] space-y-5 hover:border-[#D1B48C] transition-all"
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#E97835] text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-heading font-bold text-sm text-[#202A2E]">
                        {box.title || "Custom Box Architecture"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#202A2E] text-white text-[10px] font-semibold">
                        {box.category}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBoxType(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Box"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 2-Column Split: Left Editor Fields + Right Live Website Card Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Input Fields */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={box.title || ""}
                            onChange={(e) => handleUpdateBoxType(idx, "title", e.target.value)}
                            placeholder="Roll-End Tuck Mailer Boxes"
                            className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                            Category Badge
                          </label>
                          <input
                            type="text"
                            value={box.category || ""}
                            onChange={(e) => handleUpdateBoxType(idx, "category", e.target.value)}
                            placeholder="Die-Cut Packaging"
                            className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <MediaUploader
                        label="Box Image (Showcased in Card)"
                        value={box.image || ""}
                        mediaType="image"
                        allowedTypes={["image"]}
                        onChange={(url) => handleUpdateBoxType(idx, "image", url)}
                      />

                      <div>
                        <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                          Ideal For
                        </label>
                        <input
                          type="text"
                          value={box.idealFor || ""}
                          onChange={(e) => handleUpdateBoxType(idx, "idealFor", e.target.value)}
                          placeholder="E-commerce DTC, subscription kits, apparel & cosmetics"
                          className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="col-span-3 sm:col-span-1">
                          <label className="block text-[10px] font-bold text-[#687378] mb-1">
                            Recommended Flute / Ply
                          </label>
                          <input
                            type="text"
                            value={box.recommendedPly || ""}
                            onChange={(e) => handleUpdateBoxType(idx, "recommendedPly", e.target.value)}
                            placeholder="3-Ply E-Flute / B-Flute"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#687378] mb-1">
                            MOQ
                          </label>
                          <input
                            type="text"
                            value={box.minOrder || ""}
                            onChange={(e) => handleUpdateBoxType(idx, "minOrder", e.target.value)}
                            placeholder="500 units"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#687378] mb-1">
                            Lead Time
                          </label>
                          <input
                            type="text"
                            value={box.productionDays || ""}
                            onChange={(e) => handleUpdateBoxType(idx, "productionDays", e.target.value)}
                            placeholder="4-6 days"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-semibold text-[#A65D32]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#687378] mb-1">
                          Button CTA Text
                        </label>
                        <input
                          type="text"
                          value={box.buttonText || "Configure This Box"}
                          onChange={(e) => handleUpdateBoxType(idx, "buttonText", e.target.value)}
                          placeholder="Configure This Box"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Right: Live Exact Website Card Preview */}
                    <div className="lg:col-span-5 bg-white p-3.5 rounded-2xl border border-[#E4DED3] shadow-sm space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#E4DED3]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378]">
                          Website Live Card Preview
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Exact Render
                        </span>
                      </div>

                      {/* The exact card replica as rendered on the website */}
                      <div className="flex flex-col bg-white rounded-2xl border border-[#E4DED3] overflow-hidden shadow-xs hover:border-[#D1B48C] transition-all">
                        <div className="relative w-full aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
                          <Image
                            src={box.image || "/Product/items/mailer-boxes.png"}
                            alt={box.title || "Custom Box"}
                            fill
                            className="object-cover object-center"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-md bg-[#202A2E]/80 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wide">
                              {box.category || "Packaging"}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between bg-white space-y-3">
                          <div>
                            <h3 className="font-heading font-bold text-base text-[#202A2E] mb-1.5">
                              {box.title || "Box Architecture Title"}
                            </h3>
                            <p className="text-xs text-[#62574D] leading-relaxed">
                              <strong className="text-[#202A2E]">Ideal For:</strong> {box.idealFor}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#E4DED3]/60 space-y-1.5 text-xs text-[#62574D]">
                            <div className="flex items-center justify-between">
                              <span>Recommended Flute / Ply:</span>
                              <span className="font-semibold text-[#202A2E]">
                                {box.recommendedPly}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>MOQ:</span>
                              <span className="font-semibold text-[#202A2E]">
                                {box.minOrder}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Lead Time:</span>
                              <span className="font-semibold text-[#A65D32]">
                                {box.productionDays}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF7F2] text-[#202A2E] text-xs font-bold border border-[#E4DED3]">
                              <span>{box.buttonText || "Configure This Box"}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#A65D32]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MANUFACTURING CAPABILITIES                            */}
      {/* ======================================================== */}
      {sectionId === "capabilities" && (
        <div className="space-y-6">
          {/* Headings */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Headings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Section Subtitle
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Capabilities Cards */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                Manufacturing Capabilities Cards ({data.capabilities?.length || 0})
              </h2>
              <button
                type="button"
                onClick={handleAddCapability}
                className="px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Capability</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data.capabilities || []).map((cap: any, idx: number) => (
                <div
                  key={cap.id || idx}
                  className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E4DED3]/60">
                    <span className="font-heading font-bold text-xs text-[#202A2E]">
                      #{idx + 1} {cap.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCapability(idx)}
                      className="p-1 text-red-500 hover:text-red-700 rounded transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-[#202A2E] mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={cap.title || ""}
                        onChange={(e) => handleUpdateCapability(idx, "title", e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#202A2E] mb-1">
                        Icon
                      </label>
                      <select
                        value={cap.icon || "Ruler"}
                        onChange={(e) => handleUpdateCapability(idx, "icon", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#202A2E] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={cap.description || ""}
                      onChange={(e) => handleUpdateCapability(idx, "description", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#E97835] mb-1">
                      Highlight Tag
                    </label>
                    <input
                      type="text"
                      value={cap.highlight || ""}
                      onChange={(e) => handleUpdateCapability(idx, "highlight", e.target.value)}
                      placeholder="e.g. ±0.5mm CNC dieline precision"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-medium text-[#A65D32]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MANUFACTURING PROCESS                                 */}
      {/* ======================================================== */}
      {sectionId === "process" && (
        <div className="space-y-6">
          {/* Headings */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Headings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Section Subtitle
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                Workflow Steps ({data.steps?.length || 0})
              </h2>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {(data.steps || []).map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E4DED3]/60">
                    <span className="font-heading font-bold text-xs text-[#202A2E]">
                      Step {step.step || `0${idx + 1}`}: {step.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 text-red-500 hover:text-red-700 rounded transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#202A2E] mb-1">
                        Step Number
                      </label>
                      <input
                        type="text"
                        value={step.step || ""}
                        onChange={(e) => handleUpdateStep(idx, "step", e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-mono font-bold text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-[#202A2E] mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={step.title || ""}
                        onChange={(e) => handleUpdateStep(idx, "title", e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#202A2E] mb-1">
                        Icon
                      </label>
                      <select
                        value={step.icon || "Compass"}
                        onChange={(e) => handleUpdateStep(idx, "icon", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#202A2E] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={step.desc || ""}
                      onChange={(e) => handleUpdateStep(idx, "desc", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. INTERACTIVE CONFIGURATOR & FORM                       */}
      {/* ======================================================== */}
      {sectionId === "configurator" && (
        <div className="space-y-6">
          {/* Headings */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Configurator Section Headings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Section Subtitle
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Form Defaults & Labels */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Default Inputs & Dimension Units
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Default Unit
                </label>
                <select
                  value={data.defaultUnit || "inch"}
                  onChange={(e) => setData({ ...data, defaultUnit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold bg-[#FAF9F5]"
                >
                  <option value="inch">Inches (in)</option>
                  <option value="mm">Millimeters (mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Default Length
                </label>
                <input
                  type="text"
                  value={data.defaultLength || "12"}
                  onChange={(e) => setData({ ...data, defaultLength: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Default Width
                </label>
                <input
                  type="text"
                  value={data.defaultWidth || "10"}
                  onChange={(e) => setData({ ...data, defaultWidth: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Default Height
                </label>
                <input
                  type="text"
                  value={data.defaultHeight || "8"}
                  onChange={(e) => setData({ ...data, defaultHeight: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Default Ply
                </label>
                <select
                  value={data.defaultPly || "5-ply"}
                  onChange={(e) => setData({ ...data, defaultPly: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs"
                >
                  <option value="3-ply">3-Ply (Single Wall)</option>
                  <option value="5-ply">5-Ply (Double Wall)</option>
                  <option value="7-ply">7-Ply (Triple Wall)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Default Printing
                </label>
                <select
                  value={data.defaultPrinting || "2-colour"}
                  onChange={(e) => setData({ ...data, defaultPrinting: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs"
                >
                  <option value="unprinted">Plain Kraft (Unprinted)</option>
                  <option value="1-colour">1 Colour Flexo</option>
                  <option value="2-colour">2 Colour Flexo</option>
                  <option value="4-colour">4 Colour Full Brand</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Default Batch Quantity
                </label>
                <input
                  type="text"
                  value={data.defaultQuantity || "2500"}
                  onChange={(e) => setData({ ...data, defaultQuantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Submit Button Label
                </label>
                <input
                  type="text"
                  value={data.submitButtonText || ""}
                  onChange={(e) => setData({ ...data, submitButtonText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#A65D32]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Success Feedback Text
                </label>
                <textarea
                  rows={2}
                  value={data.successMessage || ""}
                  onChange={(e) => setData({ ...data, successMessage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Fitment & Guarantee Note
                </label>
                <textarea
                  rows={2}
                  value={data.guaranteeNote || ""}
                  onChange={(e) => setData({ ...data, guaranteeNote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E4DED3]">
        <Link
          href="/dashboard"
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
              <span>Save {meta.name}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
