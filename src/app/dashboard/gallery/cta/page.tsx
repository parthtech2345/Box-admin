"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Mail,
  PackageCheck,
} from "lucide-react";
import {
  DEFAULT_GALLERY_DATA,
  GalleryCTAData,
} from "@/lib/defaultGalleryData";

export default function GalleryCTAPage() {
  const [data, setData] = useState<GalleryCTAData>(DEFAULT_GALLERY_DATA.cta!);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/gallery?section=cta");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        console.error("Failed to load gallery CTA settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: "cta",
          data,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage(json.message || "Failed to save CTA settings.");
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#687378]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#A65D32]" />
          <span>Loading Consultation CTA Editor...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4DED3]">
        <div className="space-y-1">
          <Link
            href="/dashboard/gallery"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#A65D32] hover:underline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Gallery Overview</span>
          </Link>
          <h1 className="font-heading font-extrabold text-2xl text-[#202A2E]">
            Consultation Call to Action
          </h1>
          <p className="text-xs text-[#687378]">
            Configure the final dark-themed consultation card, prompt text, and action buttons at the bottom of the gallery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="http://localhost:3000/gallery"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E4DED3] text-xs font-bold text-[#202A2E] hover:bg-[#FAF9F5] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#687378]" />
            <span>Preview Live</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#A65D32] hover:bg-[#8f4f29] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save CTA"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>CTA card settings saved and live in MongoDB &amp; website cache!</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E4DED3]">
        <div className="bg-[#202A2E] rounded-3xl p-6 sm:p-8 text-white border border-[#344247] shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A65D32]/25 border border-[#A65D32]/40">
                <PackageCheck className="w-3.5 h-3.5 text-[#D1B48C]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5F2EB]">
                  {data.badge || "MANUFACTURING CAPABILITIES"}
                </span>
              </div>

              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                {data.title || "Want to Explore Our Packaging Solutions?"}
              </h2>

              <p className="text-xs sm:text-sm text-[#F5F2EB]/85 font-normal leading-relaxed">
                {data.description ||
                  "Discover our products and customized packaging solutions designed for different business requirements."}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <span className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#E97835] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                <span>{data.primaryButtonText || "Explore Products"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>

              <span className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 text-[#F5F2EB] border border-white/20 text-xs font-bold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-[#D1B48C]" />
                <span>{data.secondaryButtonText || "Contact Us"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form Controls */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="font-heading font-bold text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          Consultation Card Content
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
              placeholder="MANUFACTURING CAPABILITIES"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Main Heading Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
              placeholder="Want to Explore Our Packaging Solutions?"
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
            className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none resize-none leading-relaxed"
            placeholder="Discover our products and customized packaging solutions..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E4DED3]">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A65D32]">
              Primary Action Button
            </h4>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={data.primaryButtonText}
                onChange={(e) => setData({ ...data, primaryButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                placeholder="Explore Products"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Button Target Link
              </label>
              <input
                type="text"
                value={data.primaryButtonLink}
                onChange={(e) => setData({ ...data, primaryButtonLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                placeholder="/products"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A65D32]">
              Secondary Action Button
            </h4>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={data.secondaryButtonText}
                onChange={(e) => setData({ ...data, secondaryButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                placeholder="Contact Us"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                Button Target Link
              </label>
              <input
                type="text"
                value={data.secondaryButtonLink}
                onChange={(e) => setData({ ...data, secondaryButtonLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                placeholder="/#contact"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
