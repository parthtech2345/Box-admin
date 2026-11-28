"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  DEFAULT_SUSTAINABILITY_DATA,
  SustainabilityFAQsData,
  SustainabilityFAQItem,
} from "@/lib/defaultSustainabilityData";

export default function SustainabilityFAQsEditorPage() {
  const [data, setData] = useState<SustainabilityFAQsData>(DEFAULT_SUSTAINABILITY_DATA.faqs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/sustainability?section=faqs");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load FAQs data:", err);
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
        body: JSON.stringify({ section: "faqs", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Sustainability FAQs saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save FAQs");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save FAQs" });
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
            <span className="text-[#E97835]">Sustainability FAQs</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Frequently Asked Questions Editor
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage common customer and procurement questions regarding board recyclability, multi-trip reusability, and paper sourcing.
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

      {/* Section Header Controls */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-[#202A2E]">
          Section Header &amp; Subtitle
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="CLARITY & GUIDANCE"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Main Heading Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              placeholder="Frequently Asked Questions"
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
              placeholder="About Sustainable Packaging"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
            Right Column Subtitle Narrative
          </label>
          <textarea
            rows={2}
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-[#202A2E]">
            FAQ Accordion Items ({data.faqs.length})
          </h3>
          <button
            type="button"
            onClick={() => {
              const next = [
                ...data.faqs,
                {
                  question: "New Sustainability Question?",
                  answer: "Provide a clear, practical, and transparent answer.",
                },
              ];
              setData({ ...data, faqs: next });
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#E97835] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {data.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3 relative group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E4DED3]/70">
                <span className="font-mono font-bold text-xs text-[#78846A]">
                  Question #0{idx + 1}
                </span>

                {data.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = data.faqs.filter((_, i) => i !== idx);
                      setData({ ...data, faqs: next });
                    }}
                    className="text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const next = [...data.faqs];
                    next[idx].question = e.target.value;
                    setData({ ...data, faqs: next });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                  Detailed Answer
                </label>
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...data.faqs];
                    next[idx].answer = e.target.value;
                    setData({ ...data, faqs: next });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
