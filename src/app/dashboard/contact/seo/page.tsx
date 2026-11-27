"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sparkles,
  Search,
  Code2,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_CONTACT_SEO,
  ContactSEOData,
} from "@/lib/defaultContactData";

export default function ContactSEOEditorPage() {
  const [data, setData] = useState<ContactSEOData>(DEFAULT_CONTACT_SEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSEO() {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?section=seo");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load contact SEO data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSEO();
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
        body: JSON.stringify({ section: "seo", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Contact SEO metadata saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save SEO metadata");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save SEO metadata" });
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGenerateSEO = () => {
    const defaultMeta = {
      metaTitle: "Contact Us | Industrial Corrugated Packaging | AAVRIT PACKAGING",
      metaDescription:
        "Connect with AAVRIT PACKAGING for high-volume corrugated boxes, custom dieline quotations, factory plant audits, and recurring B2B supply agreements.",
      metaKeywords:
        "contact aavrit packaging, corrugated box manufacturer, packaging inquiry, custom box quote, packaging supplier gujarat",
      canonicalLink: "https://aavritpackaging.com/contact",
      ogImage: "/contact/Contact Support Workspace.png",
      ogImageAlt: "AAVRIT PACKAGING Customer Support Desk",
      schemaMarkup: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact AAVRIT PACKAGING",
          url: "https://aavritpackaging.com/contact",
          mainEntity: {
            "@type": "Organization",
            name: "AAVRIT PACKAGING",
            telephone: "+91-98765-43210",
            email: "inquiry@aavritpackaging.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Plot No. 42, Phase II GIDC Industrial Estate",
              addressRegion: "Gujarat",
              postalCode: "382445",
              addressCountry: "IN",
            },
          },
        },
        null,
        2
      ),
    };
    setData({ ...data, ...defaultMeta });
    setToast({ type: "success", message: "Auto-optimized B2B SEO metadata loaded!" });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Contact SEO Configuration...
      </div>
    );
  }

  const serpTitle = data.metaTitle || "Contact Us | AAVRIT PACKAGING";
  const serpUrl = data.canonicalLink || "https://aavritpackaging.com/contact";
  const serpDesc =
    data.metaDescription ||
    "Connect with AAVRIT PACKAGING for industrial corrugated box inquiries, custom packaging quotations, and factory visits.";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Contact</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              SEO Optimization
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Contact Page SEO &amp; Schema
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure Google SERP title tags, meta description, canonical URLs, OpenGraph share banners, and JSON-LD schema markup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAutoGenerateSEO}
            className="px-4 py-2.5 rounded-xl border border-[#E4DED3] bg-white hover:bg-[#FAF7F2] text-[#202A2E] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E97835]" />
            <span>Auto-Generate SEO</span>
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
                <span>Saving SEO...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save SEO</span>
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

      {/* 2-Column Split: Form Fields + Live SERP Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Core Meta Tags */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#E97835]" />
              <span>Search Engine Meta Tags</span>
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#202A2E]">
                    Meta Title (Browser Tab &amp; Google Headline)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      data.metaTitle.length > 60
                        ? "text-amber-600 font-bold"
                        : "text-[#8C989E]"
                    }`}
                  >
                    {data.metaTitle.length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={data.metaTitle}
                  onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                  placeholder="Contact Us | AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#202A2E]">
                    Meta Description (SERP Snippet)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      data.metaDescription.length > 160
                        ? "text-amber-600 font-bold"
                        : "text-[#8C989E]"
                    }`}
                  >
                    {data.metaDescription.length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={data.metaDescription}
                  onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Focus Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={data.metaKeywords}
                  onChange={(e) => setData({ ...data, metaKeywords: e.target.value })}
                  placeholder="contact aavrit packaging, corrugated box inquiry, box quote"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={data.canonicalLink}
                  onChange={(e) => setData({ ...data, canonicalLink: e.target.value })}
                  placeholder="https://aavritpackaging.com/contact"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: OpenGraph Share Media */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#E97835]" />
              <span>Social Media &amp; OpenGraph Card</span>
            </h2>

            <MediaUploader
              label="Social Share Image (1200 × 630 recommended)"
              value={data.ogImage || ""}
              mediaType="image"
              allowedTypes={["image"]}
              onChange={(url) => setData({ ...data, ogImage: url })}
            />

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                OG Image Alt Text
              </label>
              <input
                type="text"
                value={data.ogImageAlt || ""}
                onChange={(e) => setData({ ...data, ogImageAlt: e.target.value })}
                placeholder="AAVRIT PACKAGING Contact Support Workspace"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>
          </div>

          {/* Card 3: JSON-LD Schema Markup */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#E97835]" />
                <span>Structured Data Schema (JSON-LD)</span>
              </h2>
              <span className="text-[11px] text-[#78846A] font-bold bg-[#78846A]/10 px-2 py-0.5 rounded-full">
                Valid JSON
              </span>
            </div>

            <div>
              <textarea
                rows={10}
                value={data.schemaMarkup}
                onChange={(e) => setData({ ...data, schemaMarkup: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed bg-[#FAF9F5]"
              />
              <p className="text-[10px] text-[#8C989E] mt-1.5">
                This schema is rendered directly in the page head tag as a rich result snippet for Google crawlers.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live Google SERP Snippet Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A65D32]">
                Google Search Result Preview
              </span>
              <span className="text-[11px] text-[#687378] font-mono">SERP Simulator</span>
            </div>

            {/* Google Result Box */}
            <div className="p-4 bg-white rounded-xl border border-[#E4DED3] shadow-xs space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs text-[#202124]">
                <div className="w-5 h-5 rounded-full bg-[#E97835]/15 text-[#E97835] flex items-center justify-center text-[10px] font-bold">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#202124] leading-tight">
                    AAVRIT PACKAGING
                  </span>
                  <span className="text-[11px] text-[#5f6368] font-mono leading-tight">
                    {serpUrl}
                  </span>
                </div>
              </div>

              <h3 className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer leading-snug line-clamp-2">
                {serpTitle}
              </h3>

              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                {serpDesc}
              </p>
            </div>

            {/* Social Share Card Preview */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A65D32] block mb-2">
                Social Card Preview
              </span>
              <div className="border border-[#E4DED3] rounded-xl overflow-hidden bg-[#FAF7F2]">
                {data.ogImage ? (
                  <div className="relative w-full aspect-[1.91/1]">
                    <Image
                      src={data.ogImage}
                      alt={data.ogImageAlt || "OG Preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[1.91/1] bg-[#202A2E] flex items-center justify-center text-xs text-white/40">
                    No Social Image
                  </div>
                )}
                <div className="p-3 bg-white border-t border-[#E4DED3]">
                  <span className="text-[10px] text-[#8C989E] uppercase tracking-wider block">
                    aavritpackaging.com
                  </span>
                  <h4 className="font-heading font-bold text-xs text-[#202A2E] line-clamp-1 mt-0.5">
                    {serpTitle}
                  </h4>
                  <p className="text-[11px] text-[#62574D] line-clamp-2 mt-0.5">
                    {serpDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
