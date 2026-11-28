"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
  Cpu,
  ShieldCheck,
  Gauge,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_MACHINERY_INTRO,
  MachineryIntroData,
} from "@/lib/defaultMachineryData";

export default function MachineryIntroEditorPage() {
  const [data, setData] = useState<MachineryIntroData>(DEFAULT_MACHINERY_INTRO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadIntro() {
      try {
        setLoading(true);
        const res = await fetch("/api/machinery?section=intro");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load machinery intro:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadIntro();
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
        body: JSON.stringify({ section: "intro", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Machinery Intro section saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save machinery intro");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save intro section" });
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updated = [...data.features];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, features: updated });
  };

  const addFeature = () => {
    if (data.features.length >= 6) return;
    setData({
      ...data,
      features: [
        ...data.features,
        {
          icon: "Cpu",
          title: "New Plant Capability",
          desc: "Description of the machinery performance and capability point.",
        },
      ],
    });
  };

  const removeFeature = (index: number) => {
    if (data.features.length <= 1) return;
    setData({
      ...data,
      features: data.features.filter((_, i) => i !== index),
    });
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
            <span className="text-[#E97835]">Plant Intro & Highlights</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Plant Intro &amp; Manufacturing Highlights
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the section headline, introductory narratives, 4 feature pillars, and facility operational stats.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Intro Section"}</span>
        </button>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Header & Text */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Header &amp; Paragraphs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Highlight Word
                </label>
                <input
                  type="text"
                  value={data.highlightText}
                  onChange={(e) => setData({ ...data, highlightText: e.target.value })}
                  placeholder="Every Box"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Primary Narrative (Paragraph 1)
              </label>
              <textarea
                rows={3}
                value={data.description1}
                onChange={(e) => setData({ ...data, description1: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Secondary Narrative (Paragraph 2)
              </label>
              <textarea
                rows={3}
                value={data.description2}
                onChange={(e) => setData({ ...data, description2: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* 2. Plant Facility Image & Stats Card */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Plant Image &amp; Operational Capability Card
            </h2>

            <MediaUploader
              label="Facility Showcase Image"
              value={data.image}
              mediaType="image"
              allowedTypes={["image"]}
              onChange={(url) => setData({ ...data, image: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Image Alt Text
              </label>
              <input
                type="text"
                value={data.imageAlt}
                onChange={(e) => setData({ ...data, imageAlt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Card Title
                </label>
                <input
                  type="text"
                  value={data.cardTitle}
                  onChange={(e) => setData({ ...data, cardTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Card Badge
                </label>
                <input
                  type="text"
                  value={data.cardBadge}
                  onChange={(e) => setData({ ...data, cardBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] text-center">
                <input
                  type="text"
                  value={data.cardStat1Value}
                  onChange={(e) => setData({ ...data, cardStat1Value: e.target.value })}
                  placeholder="3 / 5 / 7 Ply"
                  className="w-full text-center text-xs font-bold text-[#202A2E] bg-white border border-[#E4DED3] rounded-md py-1 mb-1 outline-none"
                />
                <input
                  type="text"
                  value={data.cardStat1Label}
                  onChange={(e) => setData({ ...data, cardStat1Label: e.target.value })}
                  placeholder="Board Profiles"
                  className="w-full text-center text-[10px] text-[#687378] bg-transparent outline-none"
                />
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] text-center">
                <input
                  type="text"
                  value={data.cardStat2Value}
                  onChange={(e) => setData({ ...data, cardStat2Value: e.target.value })}
                  placeholder="B, C, E Flute"
                  className="w-full text-center text-xs font-bold text-[#202A2E] bg-white border border-[#E4DED3] rounded-md py-1 mb-1 outline-none"
                />
                <input
                  type="text"
                  value={data.cardStat2Label}
                  onChange={(e) => setData({ ...data, cardStat2Label: e.target.value })}
                  placeholder="Fluting Types"
                  className="w-full text-center text-[10px] text-[#687378] bg-transparent outline-none"
                />
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] text-center">
                <input
                  type="text"
                  value={data.cardStat3Value}
                  onChange={(e) => setData({ ...data, cardStat3Value: e.target.value })}
                  placeholder="100% Eco"
                  className="w-full text-center text-xs font-bold text-[#202A2E] bg-white border border-[#E4DED3] rounded-md py-1 mb-1 outline-none"
                />
                <input
                  type="text"
                  value={data.cardStat3Label}
                  onChange={(e) => setData({ ...data, cardStat3Label: e.target.value })}
                  placeholder="Starch Bonding"
                  className="w-full text-center text-[10px] text-[#687378] bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Card Footnote Note
              </label>
              <textarea
                rows={2}
                value={data.cardFootnote}
                onChange={(e) => setData({ ...data, cardFootnote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>
          </div>

          {/* 3. 4 Feature Cards */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                Feature Highlights ({data.features.length})
              </h2>
              {data.features.length < 6 && (
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-[#E97835] hover:bg-[#E97835]/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {data.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF7F2] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E97835]">
                      Pillar 0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Icon Type
                      </label>
                      <select
                        value={feat.icon}
                        onChange={(e) => handleFeatureChange(idx, "icon", e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg border border-[#E4DED3] text-xs bg-white text-[#202A2E] outline-none"
                      >
                        <option value="Cpu">Cpu</option>
                        <option value="Layers">Layers</option>
                        <option value="Gauge">Gauge</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                        <option value="Target">Target</option>
                        <option value="Zap">Zap</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Feature Title
                      </label>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs font-bold text-[#202A2E] bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                      Feature Description
                    </label>
                    <textarea
                      rows={2}
                      value={feat.desc}
                      onChange={(e) => handleFeatureChange(idx, "desc", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] bg-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#E4DED3]">
              <Eye className="w-3.5 h-3.5 text-[#E97835]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                Live Layout Preview
              </span>
            </div>

            <div className="space-y-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E4DED3]">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#A65D32]/10 text-[#A65D32] text-[10px] font-bold uppercase tracking-wider">
                {data.badge || "MANUFACTURING EXCELLENCE"}
              </div>

              <div>
                <h3 className="font-heading font-bold text-lg text-[#202A2E] leading-snug">
                  {data.title}{" "}
                  {data.highlightText && (
                    <span className="text-[#A65D32]">{data.highlightText}</span>
                  )}
                </h3>
                <p className="text-xs text-[#62574D] mt-2 line-clamp-2">
                  {data.description1}
                </p>
              </div>

              {/* Plant Image Preview */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-white border border-[#E4DED3]">
                <img
                  src={getMediaUrl(data.image)}
                  alt={data.imageAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = "/Machinery/intro-machinery.png";
                    if (target.src !== fallback) target.src = fallback;
                  }}
                />
              </div>

              {/* Stats Card Preview */}
              <div className="bg-white p-3 rounded-xl border border-[#E4DED3] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#202A2E]">
                  <span>{data.cardTitle}</span>
                  <span className="text-[10px] text-[#A65D32] bg-[#A65D32]/10 px-2 py-0.5 rounded-full">
                    {data.cardBadge}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                    <span className="text-xs font-bold block text-[#202A2E]">{data.cardStat1Value}</span>
                    <span className="text-[9px] text-[#687378] block">{data.cardStat1Label}</span>
                  </div>
                  <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                    <span className="text-xs font-bold block text-[#202A2E]">{data.cardStat2Value}</span>
                    <span className="text-[9px] text-[#687378] block">{data.cardStat2Label}</span>
                  </div>
                  <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                    <span className="text-xs font-bold block text-[#202A2E]">{data.cardStat3Value}</span>
                    <span className="text-[9px] text-[#687378] block">{data.cardStat3Label}</span>
                  </div>
                </div>
              </div>

              {/* Feature Preview List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C989E]">
                  Features ({data.features.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {data.features.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white rounded-lg border border-[#E4DED3] space-y-1"
                    >
                      <span className="text-xs font-bold text-[#202A2E] block truncate">
                        {f.title}
                      </span>
                      <p className="text-[10px] text-[#687378] line-clamp-2">
                        {f.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
