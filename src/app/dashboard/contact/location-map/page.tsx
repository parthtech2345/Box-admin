"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Navigation,
} from "lucide-react";
import {
  DEFAULT_CONTACT_LOCATION_MAP,
  ContactLocationMapData,
} from "@/lib/defaultContactData";

export default function ContactLocationMapEditorPage() {
  const [data, setData] = useState<ContactLocationMapData>(DEFAULT_CONTACT_LOCATION_MAP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLocationMap() {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?section=location-map");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load contact location map:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLocationMap();
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
        body: JSON.stringify({ section: "location-map", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Plant Location & Map configuration saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save location map");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save location map" });
    } finally {
      setSaving(false);
    }
  };

  const handleHighlightChange = (index: number, val: string) => {
    const updated = [...data.transitHighlights];
    updated[index] = val;
    setData({ ...data, transitHighlights: updated });
  };

  const handleAddHighlight = () => {
    setData({
      ...data,
      transitHighlights: [...data.transitHighlights, "New transit logistics point..."],
    });
  };

  const handleDeleteHighlight = (index: number) => {
    if (data.transitHighlights.length <= 1) return;
    const updated = data.transitHighlights.filter((_, i) => i !== index);
    setData({ ...data, transitHighlights: updated });
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Plant Map Configuration...
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
              Plant Map & Accessibility
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Plant Map & Accessibility
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the interactive Google Maps embed, factory physical address, and freight logistics transit highlights.
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

      {/* 2-Column Split: Form Fields + Live Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Copy */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Header Copy
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
                  placeholder="PLANT ACCESSIBILITY"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Section Headline (H2)
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Find Our Manufacturing Plant"
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

          {/* Plant Location & Maps Links */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E97835]" />
              <span>Plant Address & Map URLs</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Registered Plant / Organization Name
                </label>
                <input
                  type="text"
                  value={data.plantName}
                  onChange={(e) => setData({ ...data, plantName: e.target.value })}
                  placeholder="AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Full Factory Address
                </label>
                <textarea
                  rows={2}
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  placeholder="Plot No. 42, Phase II GIDC Industrial Estate, Gujarat 382445, India."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Google Maps Embed Iframe URL
                </label>
                <input
                  type="text"
                  value={data.embedUrl}
                  onChange={(e) => setData({ ...data, embedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none"
                />
                <p className="text-[10px] text-[#8C989E] mt-1">
                  Obtained from Google Maps &rarr; Share &rarr; Embed a map &rarr; copy the src URL.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Google Maps Direct Navigation URL
                </label>
                <input
                  type="text"
                  value={data.googleMapsUrl}
                  onChange={(e) => setData({ ...data, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Transit Highlights */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#E97835]" />
                <span>Logistics & Transit Highlights</span>
              </h2>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="text-xs font-bold text-[#E97835] hover:text-[#D86928] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.transitHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => handleHighlightChange(idx, e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                  {data.transitHighlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(idx)}
                      className="p-2 text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A65D32]">
                Interactive Map Preview
              </span>
              <span className="text-[11px] text-[#687378] font-mono">Live Iframe</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#E4DED3] h-60 bg-[#FAF7F2] relative">
              {data.embedUrl ? (
                <iframe
                  src={data.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  className="w-full h-full"
                  title="Map Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8C989E]">
                  No embed URL specified
                </div>
              )}
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#202A2E]">
                <MapPin className="w-4 h-4 text-[#A65D32]" />
                <span>{data.plantName || "Plant Location"}</span>
              </div>
              <p className="text-xs text-[#62574D] leading-relaxed">
                {data.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
