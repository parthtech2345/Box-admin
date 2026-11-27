"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  ShieldCheck,
  Truck,
  Printer,
  Ruler,
  Maximize2,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_INDUSTRIES_LANDING,
  IndustriesLandingData,
} from "@/lib/defaultIndustryData";

export default function IndustriesLandingEditorPage() {
  const [data, setData] = useState<IndustriesLandingData>(DEFAULT_INDUSTRIES_LANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLanding() {
      try {
        setLoading(true);
        const res = await fetch("/api/industries?type=landing");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        // Fallback to default
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLanding();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/industries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "landing", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Industries landing page content saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save landing content");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save landing content" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Industries Landing Page Sections...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Industries</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              Landing Page Sections
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Landing Page Content
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the introductory sector overview, the 6 reasons why industries choose Aavrit, and the quotation CTA.
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Landing Content</span>
              </>
            )}
          </button>
        </div>
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
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Intro Section */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
          <span>1. Industries Intro Section</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={data.intro?.badge || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  intro: { ...data.intro, badge: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Intro Headline
            </label>
            <input
              type="text"
              value={data.intro?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  intro: { ...data.intro, title: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Primary Paragraph
            </label>
            <textarea
              rows={3}
              value={data.intro?.description1 || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  intro: { ...data.intro, description1: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Secondary Paragraph
            </label>
            <textarea
              rows={3}
              value={data.intro?.description2 || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  intro: { ...data.intro, description2: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <MediaUploader
              label="Intro Section Image"
              value={data.intro?.image || ""}
              mediaType="image"
              allowedTypes={["image"]}
              onChange={(url) =>
                setData({
                  ...data,
                  intro: { ...data.intro, image: url },
                })
              }
            />
          </div>
        </div>

        {/* Bullet Points */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-[#202A2E] mb-2">
            Key Engineering Bullet Points (4 items)
          </label>
          <div className="space-y-2">
            {(data.intro?.bullets || []).map((bullet: string, bIdx: number) => (
              <div key={bIdx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E97835]/15 text-[#E97835] text-[11px] font-bold flex items-center justify-center shrink-0">
                  {bIdx + 1}
                </span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => {
                    const updated = [...(data.intro?.bullets || [])];
                    updated[bIdx] = e.target.value;
                    setData({
                      ...data,
                      intro: { ...data.intro, bullets: updated },
                    });
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Why Choose Us Section */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          2. Why Leading Industries Choose Aavrit Packaging (6 Cards)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Section Eyebrow Badge
            </label>
            <input
              type="text"
              value={data.whyChooseUs?.badge || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  whyChooseUs: { ...data.whyChooseUs, badge: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={data.whyChooseUs?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  whyChooseUs: { ...data.whyChooseUs, title: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Section Subtitle
            </label>
            <textarea
              rows={2}
              value={data.whyChooseUs?.subtitle || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  whyChooseUs: { ...data.whyChooseUs, subtitle: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
            />
          </div>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-3">
          {(data.whyChooseUs?.reasons || []).map((reason: any, rIdx: number) => (
            <div
              key={rIdx}
              className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-2 hover:border-[#D1B48C] transition-all"
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#E4DED3]/60">
                <span className="text-[11px] font-bold text-[#E97835]">
                  Card #{rIdx + 1}
                </span>
                <span className="text-[10px] font-mono text-[#687378]">
                  Icon: {reason.icon || "Ruler"}
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  value={reason.title || ""}
                  onChange={(e) => {
                    const updated = [...(data.whyChooseUs?.reasons || [])];
                    updated[rIdx] = { ...updated[rIdx], title: e.target.value };
                    setData({
                      ...data,
                      whyChooseUs: { ...data.whyChooseUs, reasons: updated },
                    });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] text-xs font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={reason.description || ""}
                  onChange={(e) => {
                    const updated = [...(data.whyChooseUs?.reasons || [])];
                    updated[rIdx] = { ...updated[rIdx], description: e.target.value };
                    setData({
                      ...data,
                      whyChooseUs: { ...data.whyChooseUs, reasons: updated },
                    });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] text-xs bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CTA Section */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          3. Bottom Consultation CTA Strip
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              CTA Title
            </label>
            <input
              type="text"
              value={data.cta?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  cta: { ...data.cta, title: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={data.cta?.phone || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  cta: { ...data.cta, phone: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              CTA Subtitle
            </label>
            <textarea
              rows={2}
              value={data.cta?.subtitle || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  cta: { ...data.cta, subtitle: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Contact Email
            </label>
            <input
              type="text"
              value={data.cta?.email || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  cta: { ...data.cta, email: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
