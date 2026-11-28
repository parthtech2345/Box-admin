"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  Eye,
  ArrowRight,
  Phone,
  Sparkles,
} from "lucide-react";
import {
  DEFAULT_MACHINERY_CTA,
  MachineryCTAData,
  MachineryCTAItem,
} from "@/lib/defaultMachineryData";

export default function MachineryCTAEditorPage() {
  const [data, setData] = useState<MachineryCTAData>(DEFAULT_MACHINERY_CTA);
  const [activeTab, setActiveTab] = useState<"listing" | "detail">("listing");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCTA() {
      try {
        setLoading(true);
        const res = await fetch("/api/machinery?section=cta");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load machinery CTA:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCTA();
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
        body: JSON.stringify({ section: "cta", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Consultation CTA banners saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save consultation CTA");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save CTA banner" });
    } finally {
      setSaving(false);
    }
  };

  const currentItem = activeTab === "listing" ? data.listing : data.detail;

  const updateCurrentItem = (field: keyof MachineryCTAItem, val: string) => {
    if (activeTab === "listing") {
      setData({ ...data, listing: { ...data.listing, [field]: val } });
    } else {
      setData({ ...data, detail: { ...data.detail, [field]: val } });
    }
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
            <span className="text-[#E97835]">Consultation CTA</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Consultation Call-to-Action (CTA)
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the bottom consultation cards for both the machinery catalog page and machine detail pages.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save CTA Banners"}</span>
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
          <FileText className="w-3.5 h-3.5" />
          <span>Listing Page CTA (/machinery)</span>
        </button>

        <button
          onClick={() => setActiveTab("detail")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "detail"
              ? "bg-[#E97835] text-white shadow-xs"
              : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Detail Page CTA (/machinery/[slug])</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              {activeTab === "listing" ? "Catalog Listing CTA Content" : "Detail Page CTA Content"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={currentItem.badge}
                  onChange={(e) => updateCurrentItem("badge", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Highlight Word
                </label>
                <input
                  type="text"
                  value={currentItem.highlightText}
                  onChange={(e) => updateCurrentItem("highlightText", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={currentItem.title}
                onChange={(e) => updateCurrentItem("title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Description Narrative
              </label>
              <textarea
                rows={3}
                value={currentItem.description}
                onChange={(e) => updateCurrentItem("description", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={currentItem.buttonText}
                  onChange={(e) => updateCurrentItem("buttonText", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={currentItem.buttonLink}
                  onChange={(e) => updateCurrentItem("buttonLink", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] font-mono focus:border-[#E97835] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Direct Phone Number
                </label>
                <input
                  type="text"
                  value={currentItem.phone}
                  onChange={(e) => updateCurrentItem("phone", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Phone Protocol Link
                </label>
                <input
                  type="text"
                  value={currentItem.phoneLink}
                  onChange={(e) => updateCurrentItem("phoneLink", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] font-mono focus:border-[#E97835] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#E4DED3]">
              <Eye className="w-3.5 h-3.5 text-[#E97835]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                Card Live Preview
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E4DED3] space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A65D32]/10 border border-[#A65D32]/20 text-[#A65D32] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#A65D32]" />
                <span>{currentItem.badge}</span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-lg text-[#202A2E] leading-snug">
                  {currentItem.title}{" "}
                  {currentItem.highlightText && (
                    <span className="text-[#A65D32]">{currentItem.highlightText}</span>
                  )}
                </h3>
                <p className="text-xs text-[#62574D] mt-1.5 leading-relaxed">
                  {currentItem.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="w-full py-2.5 rounded-xl bg-[#A65D32] text-white text-xs font-bold uppercase text-center flex items-center justify-center gap-2 shadow-xs">
                  <span>{currentItem.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                <div className="w-full py-2 rounded-xl bg-white text-[#493629] text-xs font-semibold text-center border border-[#D1B48C]/70 flex items-center justify-center gap-2">
                  <Phone className="w-3 h-3 text-[#A65D32]" />
                  <span>{currentItem.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
