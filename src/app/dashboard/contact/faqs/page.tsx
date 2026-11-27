"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  DEFAULT_CONTACT_FAQS,
  ContactFAQsData,
  ContactFAQItem,
} from "@/lib/defaultContactData";

export default function ContactFAQsEditorPage() {
  const [data, setData] = useState<ContactFAQsData>(DEFAULT_CONTACT_FAQS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [previewOpenIndex, setPreviewOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    let isMounted = true;
    async function loadFAQs() {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?section=faqs");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load contact faqs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFAQs();
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
        body: JSON.stringify({ section: "faqs", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Contact FAQs saved successfully!" });
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

  const handleFAQChange = (index: number, field: keyof ContactFAQItem, val: string) => {
    const updated = [...data.faqs];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, faqs: updated });
  };

  const handleAddFAQ = () => {
    const newFAQ: ContactFAQItem = {
      question: "New inquiry question?",
      answer: "Provide a detailed and transparent answer for prospective packaging buyers...",
    };
    setData({ ...data, faqs: [...data.faqs, newFAQ] });
  };

  const handleDeleteFAQ = (index: number) => {
    if (data.faqs.length <= 1) return;
    const updated = data.faqs.filter((_, i) => i !== index);
    setData({ ...data, faqs: updated });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.faqs.length) return;
    const updated = [...data.faqs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setData({ ...data, faqs: updated });
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Contact FAQs Configuration...
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
              Contact FAQs
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Contact FAQs & Guidance
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the frequently asked questions accordion addressing quotes, bulk MOQ, dieline specifications, and customer assistance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddFAQ}
            className="px-4 py-2.5 rounded-xl border border-[#E4DED3] bg-white hover:bg-[#FAF7F2] text-[#202A2E] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E97835]" />
            <span>Add Question</span>
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
                <span>Saving FAQs...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save FAQs</span>
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

      {/* 2-Column Split: Header Inputs & FAQ Editor + Live Accordion Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Copy */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              FAQ Section Header
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="CLARITY & GUIDANCE"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Frequently Asked Questions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Subtitle Description
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

          {/* Questions List */}
          <div className="space-y-4">
            {data.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] text-xs font-mono font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#202A2E]">
                      Question #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 text-[#8C989E] hover:text-[#202A2E] disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.faqs.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 text-[#8C989E] hover:text-[#202A2E] disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {data.faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteFAQ(idx)}
                        className="p-1 text-[#8C989E] hover:text-red-600 transition-colors ml-1 cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFAQChange(idx, "question", e.target.value)}
                      placeholder="How can I request a packaging quotation?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Detailed Answer
                    </label>
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => handleFAQChange(idx, "answer", e.target.value)}
                      placeholder="You can submit your requirements through our online inquiry form..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Live Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A65D32]">
                Interactive Accordion Preview
              </span>
              <span className="text-[11px] text-[#687378] font-mono">Live Toggle</span>
            </div>

            <div className="space-y-3">
              {data.faqs.map((faq, i) => {
                const isOpen = previewOpenIndex === i;
                return (
                  <div
                    key={i}
                    className={`bg-[#FAF7F2] rounded-xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-[#A65D32]/50 shadow-xs"
                        : "border-[#E4DED3]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewOpenIndex(isOpen ? null : i)}
                      className="w-full text-left p-3.5 flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-[#A65D32] shrink-0" />
                        <span className="font-heading font-bold text-xs text-[#202A2E] line-clamp-1">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#62574D] shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-[#62574D] leading-relaxed border-t border-[#E4DED3]/60 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
