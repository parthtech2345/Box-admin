"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  MessageSquareText,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Mail,
  Leaf,
} from "lucide-react";
import {
  DEFAULT_SUSTAINABILITY_DATA,
  SustainabilityCTAData,
} from "@/lib/defaultSustainabilityData";

export default function SustainabilityCTAEditorPage() {
  const [data, setData] = useState<SustainabilityCTAData>(DEFAULT_SUSTAINABILITY_DATA.cta);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/sustainability?section=cta");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load CTA data:", err);
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
        body: JSON.stringify({ section: "cta", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Collaboration CTA saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save CTA");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save CTA" });
    } finally {
      setSaving(false);
    }
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
            <span className="text-[#E97835]">Collaboration CTA Banner</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Responsible Collaboration Call-to-Action
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure the bottom engagement banner, consultation heading, description, and dual call-to-action buttons.
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

      {/* Live Visual Preview */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E]">
          Live CTA Banner Preview
        </span>

        <div className="bg-[#202A2E] rounded-3xl p-6 sm:p-8 text-white border border-[#344247] shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#78846A]/25 border border-[#78846A]/40 text-[#D1B48C] text-[10px] font-bold uppercase tracking-widest">
                <Leaf className="w-3 h-3 text-[#D1B48C]" />
                <span>{data.badge || "RESPONSIBLE COLLABORATION"}</span>
              </div>

              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                {data.title || "Let's Make Better Packaging Choices Together."}
              </h2>

              <p className="text-xs sm:text-sm text-[#F5F2EB]/85 font-normal leading-relaxed">
                {data.description || "Looking for packaging solutions that balance product protection, practical design, and responsible material choices?"}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-3">
              <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#E97835] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                <span>{data.primaryButtonText || "Explore Our Products"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>

              <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-[#F5F2EB] border border-white/20 text-xs font-bold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#D1B48C]" />
                <span>{data.secondaryButtonText || "Contact Our Team"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Controls */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-[#202A2E] flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-[#E97835]" />
          <span>Call to Action Content</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="e.g. RESPONSIBLE COLLABORATION"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Banner Heading Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="e.g. Let's Make Better Packaging Choices Together."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
            Narrative Description
          </label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E4DED3]">
          {/* Primary Action Button */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E4DED3] space-y-3">
            <span className="text-xs font-bold text-[#E97835] block">
              Primary Button (Orange Solid)
            </span>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={data.primaryButtonText}
                onChange={(e) => setData({ ...data, primaryButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white"
                placeholder="Explore Our Products"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Link URL
              </label>
              <input
                type="text"
                value={data.primaryButtonLink}
                onChange={(e) => setData({ ...data, primaryButtonLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white font-mono"
                placeholder="/products"
              />
            </div>
          </div>

          {/* Secondary Action Button */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E4DED3] space-y-3">
            <span className="text-xs font-bold text-[#78846A] block">
              Secondary Button (Outline / Ghost)
            </span>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={data.secondaryButtonText}
                onChange={(e) => setData({ ...data, secondaryButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white"
                placeholder="Contact Our Team"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Link URL
              </label>
              <input
                type="text"
                value={data.secondaryButtonLink}
                onChange={(e) => setData({ ...data, secondaryButtonLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white font-mono"
                placeholder="/#contact"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
