"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  Scissors,
  Recycle,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_SUSTAINABILITY_DATA,
  SustainabilityIntroData,
  SustainabilityIntroHighlight,
} from "@/lib/defaultSustainabilityData";

export default function SustainabilityIntroEditorPage() {
  const [data, setData] = useState<SustainabilityIntroData>(DEFAULT_SUSTAINABILITY_DATA.intro);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/sustainability?section=intro");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load intro data:", err);
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
        body: JSON.stringify({ section: "intro", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Intro section saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save intro");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save intro" });
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
      {/* Toast */}
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
            <span className="text-[#E97835]">Intro &amp; Highlights</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Introduction: Why Sustainability Matters
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Edit the introductory narrative, kraft photograph display, and the 3 core highlight pillars.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Heading & Narrative */}
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-[#202A2E] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A65D32]" />
            <span>Headline &amp; Editorial Paragraphs</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="e.g. RESPONSIBLE PACKAGING"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Main Heading
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                placeholder="Why Sustainability"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Highlighted Text (Brown Accent)
              </label>
              <input
                type="text"
                value={data.highlightText}
                onChange={(e) => setData({ ...data, highlightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                placeholder="Matters in Packaging"
              />
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#202A2E]">
              Narrative Paragraphs
            </label>
            {data.paragraphs.map((p, idx) => (
              <div key={idx} className="relative">
                <span className="text-[10px] font-bold text-[#8C989E] block mb-1">
                  Paragraph {idx + 1}
                </span>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const next = [...data.paragraphs];
                    next[idx] = e.target.value;
                    setData({ ...data, paragraphs: next });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Editorial Image */}
          <div className="pt-2 border-t border-[#E4DED3]">
            <MediaUploader
              label="Arrangement Image"
              value={data.image}
              onChange={(url) => setData({ ...data, image: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Image Alt Tag
            </label>
            <input
              type="text"
              value={data.imageAlt}
              onChange={(e) => setData({ ...data, imageAlt: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="Natural kraft corrugated cardboard packaging arrangement"
            />
          </div>
        </div>

        {/* Right: 3 Foundation Highlight Pillars */}
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-[#202A2E] flex items-center gap-2">
              <Recycle className="w-4 h-4 text-[#78846A]" />
              <span>3 Highlight Pillars ({data.highlights.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                const next = [
                  ...data.highlights,
                  {
                    title: "New Highlight Pillar",
                    description: "Describe the environmental or structural principle.",
                    icon: "Layers",
                  },
                ];
                setData({ ...data, highlights: next });
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E97835] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E4DED3] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#78846A]">
                    Pillar #{idx + 1}
                  </span>
                  {data.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = data.highlights.filter((_, i) => i !== idx);
                        setData({ ...data, highlights: next });
                      }}
                      className="text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove pillar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                      Pillar Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...data.highlights];
                        next[idx].title = e.target.value;
                        setData({ ...data, highlights: next });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                      Icon Name
                    </label>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => {
                        const next = [...data.highlights];
                        next[idx].icon = e.target.value;
                        setData({ ...data, highlights: next });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white text-center"
                      placeholder="Layers / Scissors / Recycle"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...data.highlights];
                      next[idx].description = e.target.value;
                      setData({ ...data, highlights: next });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
