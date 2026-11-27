"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  MessageSquareText,
  Layers,
  Scissors,
  Truck,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DEFAULT_WHY_CONTACT_US,
  WhyContactUsData,
  WhyContactReasonItem,
} from "@/lib/defaultContactData";

const ICON_OPTIONS = [
  { label: "MessageSquareText (Consult)", value: "MessageSquareText" },
  { label: "Layers (Material/Ply)", value: "Layers" },
  { label: "Scissors (CAD / Sampling)", value: "Scissors" },
  { label: "Truck (Logistics & Bulk)", value: "Truck" },
];

function getWhyIcon(iconName: string) {
  switch (iconName) {
    case "MessageSquareText":
      return <MessageSquareText className="w-5 h-5 text-[#A65D32]" />;
    case "Layers":
      return <Layers className="w-5 h-5 text-[#A65D32]" />;
    case "Scissors":
      return <Scissors className="w-5 h-5 text-[#A65D32]" />;
    case "Truck":
      return <Truck className="w-5 h-5 text-[#A65D32]" />;
    default:
      return <MessageSquareText className="w-5 h-5 text-[#A65D32]" />;
  }
}

export default function ContactWhyConnectEditorPage() {
  const [data, setData] = useState<WhyContactUsData>(DEFAULT_WHY_CONTACT_US);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadWhyConnect() {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?section=why-connect");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load why connect data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadWhyConnect();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "why-connect", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Why Connect section saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save data");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save data" });
    } finally {
      setSaving(false);
    }
  };

  const handleReasonChange = (index: number, field: keyof WhyContactReasonItem, val: string) => {
    const updated = [...data.reasons];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, reasons: updated });
  };

  const handleAddReason = () => {
    const newReason: WhyContactReasonItem = {
      title: "New Collaboration Pillar",
      description: "Explain how our team partners with enterprise clients...",
      icon: "MessageSquareText",
      tag: "Direct Support",
    };
    setData({ ...data, reasons: [...data.reasons, newReason] });
  };

  const handleDeleteReason = (index: number) => {
    if (data.reasons.length <= 1) return;
    const updated = data.reasons.filter((_, i) => i !== index);
    setData({ ...data, reasons: updated });
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Why Connect Configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Contact</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              Why Connect Cards
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Why Connect With Us
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the direct collaboration pillars highlighting technical discussions, CAD sampling, and volume supply.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddReason}
            className="px-4 py-2.5 rounded-xl border border-[#E4DED3] bg-white hover:bg-[#FAF7F2] text-[#202A2E] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E97835]" />
            <span>Add Pillar</span>
          </button>

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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
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

      {/* Section Header Copy */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
          Section Headline & Subtitle
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Section Pill Badge
            </label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              placeholder="DIRECT COLLABORATION"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Section Title (H2)
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Why Connect With AAVRIT PACKAGING"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Subtitle Paragraph
            </label>
            <textarea
              rows={2}
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.reasons.map((reason, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E4DED3] flex items-center justify-center">
                    {getWhyIcon(reason.icon)}
                  </div>
                  <h3 className="font-heading font-bold text-sm text-[#202A2E]">
                    {reason.title || `Pillar #${idx + 1}`}
                  </h3>
                </div>

                {data.reasons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteReason(idx)}
                    className="p-1 text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete pillar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={reason.tag}
                    onChange={(e) => handleReasonChange(idx, "tag", e.target.value)}
                    placeholder="Technical Consult"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Icon
                  </label>
                  <select
                    value={reason.icon}
                    onChange={(e) => handleReasonChange(idx, "icon", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Pillar Headline
                </label>
                <input
                  type="text"
                  value={reason.title}
                  onChange={(e) => handleReasonChange(idx, "title", e.target.value)}
                  placeholder="Packaging Requirement Discussion"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={reason.description}
                  onChange={(e) => handleReasonChange(idx, "description", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
