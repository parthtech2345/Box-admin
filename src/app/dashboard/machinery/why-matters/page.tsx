"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Target,
  ChevronRight,
  Eye,
  Plus,
  Trash2,
  Zap,
  ShieldCheck,
} from "lucide-react";
import {
  DEFAULT_MACHINERY_WHY_MATTERS,
  MachineryWhyMattersData,
} from "@/lib/defaultMachineryData";

export default function MachineryWhyMattersEditorPage() {
  const [data, setData] = useState<MachineryWhyMattersData>(DEFAULT_MACHINERY_WHY_MATTERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadWhyMatters() {
      try {
        setLoading(true);
        const res = await fetch("/api/machinery?section=why-matters");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load machinery why-matters:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadWhyMatters();
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
        body: JSON.stringify({ section: "why-matters", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Operational Advantage section saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save operational advantage section");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save operational advantage section" });
    } finally {
      setSaving(false);
    }
  };

  const handleBlockChange = (index: number, field: string, value: string) => {
    const updated = [...data.blocks];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, blocks: updated });
  };

  const addBlock = () => {
    if (data.blocks.length >= 6) return;
    setData({
      ...data,
      blocks: [
        ...data.blocks,
        {
          icon: "ShieldCheck",
          title: "New Value Advantage",
          description: "Description of the operational benefit and manufacturing reliability.",
        },
      ],
    });
  };

  const removeBlock = (index: number) => {
    if (data.blocks.length <= 1) return;
    setData({
      ...data,
      blocks: data.blocks.filter((_, i) => i !== index),
    });
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
            <span className="text-[#E97835]">Operational Advantage</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Operational Advantage (Why Machinery Matters)
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the 4 value pillars explaining how machinery investments support consistent manufacturing.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Operational Advantage"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header config */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Header &amp; Subtitle
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
                  placeholder="Manufacturing"
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
                Context Narrative / Subtitle
              </label>
              <textarea
                rows={2}
                value={data.subtitle}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Value Blocks */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                Value Blocks ({data.blocks.length})
              </h2>
              {data.blocks.length < 6 && (
                <button
                  type="button"
                  onClick={addBlock}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-[#E97835] hover:bg-[#E97835]/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Block</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {data.blocks.map((block, idx) => (
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
                      onClick={() => removeBlock(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Icon
                      </label>
                      <select
                        value={block.icon}
                        onChange={(e) => handleBlockChange(idx, "icon", e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg border border-[#E4DED3] text-xs bg-white text-[#202A2E] outline-none"
                      >
                        <option value="Zap">Zap</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                        <option value="Target">Target</option>
                        <option value="CheckCircle2">CheckCircle2</option>
                        <option value="Cpu">Cpu</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Pillar Title
                      </label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => handleBlockChange(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs font-bold text-[#202A2E] bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                      Pillar Description
                    </label>
                    <textarea
                      rows={2}
                      value={block.description}
                      onChange={(e) => handleBlockChange(idx, "description", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] bg-white outline-none leading-relaxed"
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
                Section Preview
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E4DED3] space-y-4 text-center">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#A65D32]/10 text-[#A65D32] text-[10px] font-bold uppercase tracking-wider">
                {data.badge || "OPERATIONAL ADVANTAGE"}
              </div>

              <div>
                <h3 className="font-heading font-bold text-lg text-[#202A2E] leading-snug">
                  {data.title}{" "}
                  {data.highlightText && (
                    <span className="text-[#A65D32]">{data.highlightText}</span>
                  )}
                </h3>
                <p className="text-xs text-[#62574D] mt-1 max-w-sm mx-auto line-clamp-2">
                  {data.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                {data.blocks.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-xl border border-[#E4DED3] space-y-1 shadow-2xs"
                  >
                    <span className="text-xs font-bold text-[#202A2E] block truncate">
                      {b.title}
                    </span>
                    <p className="text-[10px] text-[#687378] line-clamp-2">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
