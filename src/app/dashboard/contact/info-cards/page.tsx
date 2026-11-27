"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DEFAULT_CONTACT_INFO_CARDS,
  ContactInfoCardsData,
  ContactInfoCardItem,
} from "@/lib/defaultContactData";

const ICON_OPTIONS = [
  { label: "Phone", value: "Phone", icon: Phone },
  { label: "Mail", value: "Mail", icon: Mail },
  { label: "MapPin (Address)", value: "MapPin", icon: MapPin },
  { label: "Clock (Hours)", value: "Clock", icon: Clock },
];

function getCardIcon(iconName: string) {
  switch (iconName) {
    case "Phone":
      return <Phone className="w-5 h-5 text-[#A65D32]" />;
    case "Mail":
      return <Mail className="w-5 h-5 text-[#A65D32]" />;
    case "MapPin":
      return <MapPin className="w-5 h-5 text-[#A65D32]" />;
    case "Clock":
      return <Clock className="w-5 h-5 text-[#A65D32]" />;
    default:
      return <Phone className="w-5 h-5 text-[#A65D32]" />;
  }
}

export default function ContactInfoCardsEditorPage() {
  const [data, setData] = useState<ContactInfoCardsData>(DEFAULT_CONTACT_INFO_CARDS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadInfoCards() {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?section=info-cards");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load contact info cards:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInfoCards();
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
        body: JSON.stringify({ section: "info-cards", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Contact Information Cards saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save info cards");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save info cards" });
    } finally {
      setSaving(false);
    }
  };

  const handleCardChange = (index: number, field: keyof ContactInfoCardItem, val: string) => {
    const updated = [...data.cards];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, cards: updated });
  };

  const handleAddCard = () => {
    const newCard: ContactInfoCardItem = {
      title: "New Contact Channel",
      value: "+91 00000 00000",
      subtext: "Support desk & consultations",
      href: "tel:+910000000000",
      actionText: "Call Now",
      icon: "Phone",
    };
    setData({ ...data, cards: [...data.cards, newCard] });
  };

  const handleDeleteCard = (index: number) => {
    if (data.cards.length <= 1) return;
    const updated = data.cards.filter((_, i) => i !== index);
    setData({ ...data, cards: updated });
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Contact Info Cards Configuration...
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
              Contact Information Cards
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Contact Information Cards
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the direct phone line, email desk, plant address, and business operating hours displayed across the top strip.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddCard}
            className="px-4 py-2.5 rounded-xl border border-[#E4DED3] bg-white hover:bg-[#FAF7F2] text-[#202A2E] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E97835]" />
            <span>Add Card</span>
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
                <span>Saving Cards...</span>
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

      {/* Live Preview Strip */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E4DED3]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A65D32]">
            Live Website Cards Preview
          </span>
          <span className="text-[11px] text-[#687378] font-mono">Real-time Frontend Grid</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.cards.map((c, i) => (
            <div
              key={i}
              className="bg-[#FAF7F2] rounded-2xl border border-[#E4DED3] p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#E4DED3] flex items-center justify-center">
                    {getCardIcon(c.icon)}
                  </div>
                  {c.actionText && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A65D32]">
                      <span>{c.actionText}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C989E] block mb-0.5">
                  {c.title}
                </span>
                <h4 className="font-heading font-bold text-sm text-[#202A2E] leading-snug line-clamp-1 mb-0.5">
                  {c.value}
                </h4>
                <p className="text-[11px] text-[#62574D] line-clamp-2 leading-relaxed">
                  {c.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Fields: Editable Cards List */}
      <div className="space-y-4">
        {data.cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] text-xs font-mono font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                  {card.title || `Contact Card #${idx + 1}`}
                </h2>
              </div>

              {data.cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteCard(idx)}
                  className="p-1.5 text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Card Category / Title
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                  placeholder="Direct Phone Line"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Primary Value / Contact Text
                </label>
                <input
                  type="text"
                  value={card.value}
                  onChange={(e) => handleCardChange(idx, "value", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Icon
                </label>
                <select
                  value={card.icon}
                  onChange={(e) => handleCardChange(idx, "icon", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Subtext / Description
                </label>
                <input
                  type="text"
                  value={card.subtext}
                  onChange={(e) => handleCardChange(idx, "subtext", e.target.value)}
                  placeholder="Technical inquiries & rapid quotes"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Action Link Text (Optional)
                </label>
                <input
                  type="text"
                  value={card.actionText || ""}
                  onChange={(e) => handleCardChange(idx, "actionText", e.target.value)}
                  placeholder="Call Now / Send Email"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Link URL (e.g. tel:+91..., mailto:... or Google Maps URL)
                </label>
                <input
                  type="text"
                  value={card.href || ""}
                  onChange={(e) => handleCardChange(idx, "href", e.target.value)}
                  placeholder="tel:+919876543210 or mailto:inquiry@..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
