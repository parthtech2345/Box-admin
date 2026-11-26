"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Award,
  Users,
  Package,
  MapPin,
  TrendingUp,
  Layers,
  Compass,
  Boxes,
  ShieldCheck,
  HelpCircle,
  PlaySquare,
  Building2,
  Check,
  Quote,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import { ABOUT_SECTIONS_LIST, DEFAULT_ABOUT_DATA } from "@/lib/defaultAboutData";

export default function AboutSectionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const sectionId = (params?.sectionId as string) || "about-hero";

  const meta = ABOUT_SECTIONS_LIST.find((s) => s.id === sectionId) || {
    id: sectionId,
    name: "About Section",
    description: "Manage this about section",
    icon: "Building2",
  };

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch section data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/about-sections?sectionId=${sectionId}`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            setData(DEFAULT_ABOUT_DATA[sectionId] || { sectionId });
          }
        }
      } catch (err) {
        if (isMounted) {
          setData(DEFAULT_ABOUT_DATA[sectionId] || { sectionId });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [sectionId]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch("/api/about-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, data }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setToast({
          type: "success",
          message: `${meta.name} saved successfully!`,
        });
      } else {
        setToast({
          type: "error",
          message: json.message || "Failed to save changes",
        });
      }
    } catch (e: any) {
      setToast({ type: "error", message: e.message || "Network error while saving" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-[#202A2E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#687378] font-semibold">Loading section content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header Card */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-5 sm:p-6 shadow-sm">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687378] hover:text-[#202A2E] mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#E97835]/10 text-[#E97835] text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>About Us Page CMS</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#202A2E]">
              {meta.name}
            </h1>
          </div>
          <span className="text-xs text-[#687378] font-mono self-start sm:self-auto">
            #{sectionId}
          </span>
        </div>
      </div>

      {/* Notification Toast */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border ${
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

      {/* ======================================================== */}
      {/* 1. HERO BANNER & MASCOT CHARACTER / GIF                  */}
      {/* ======================================================== */}
      {sectionId === "about-hero" && (
        <div className="space-y-6">
          {/* Main Title & Breadcrumbs */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Hero Banner Headings &amp; Breadcrumb
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Page Main Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="About Us"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Current Breadcrumb Label
                </label>
                <input
                  type="text"
                  value={data?.breadcrumbCurrent || ""}
                  onChange={(e) => setData({ ...data, breadcrumbCurrent: e.target.value })}
                  placeholder="About Us"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Banner Media Displays */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Banner Background &amp; Employee Mascot / GIF
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Background Packaging Display */}
              <div className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3">
                <MediaUploader
                  label="Banner Background Display Image"
                  value={data?.backgroundImage || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  helperText="Full-width corrugated packaging display behind title."
                  onChange={(url) => setData({ ...data, backgroundImage: url })}
                />
              </div>

              {/* Standing Worker Character / Mascot / GIF */}
              <div className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3">
                <MediaUploader
                  label="Standing Employee Mascot Character (Image / GIF)"
                  value={data?.mascotImage || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  helperText="Transparent PNG or animated GIF mascot with wave animation."
                  onChange={(url) => setData({ ...data, mascotImage: url })}
                />
              </div>
            </div>
          </div>

          {/* Connected Speech Bubble Dialogue */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Mascot Speech Bubble Dialogue
            </h2>
            <p className="text-xs text-[#687378]">
              The dialogue balloon appearing next to the mascot character on the banner.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Speech Greeting Title
                </label>
                <input
                  type="text"
                  value={data?.speechBubbleTitle || ""}
                  onChange={(e) => setData({ ...data, speechBubbleTitle: e.target.value })}
                  placeholder="Let's Get to Know Us!"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Speech Subtitle / Narrative
                </label>
                <input
                  type="text"
                  value={data?.speechBubbleSubtitle || ""}
                  onChange={(e) => setData({ ...data, speechBubbleSubtitle: e.target.value })}
                  placeholder="Discover the passion & precision behind every box"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. COMPANY HISTORY & STATISTICS                          */}
      {/* ======================================================== */}
      {sectionId === "company-history" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Introduction Headings &amp; Facility Image
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Badge / Eyebrow Text
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="ABOUT AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Protection Begins With Better Packaging."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Lead Story Paragraph
                </label>
                <textarea
                  rows={2}
                  value={data?.firstParagraph || ""}
                  onChange={(e) => setData({ ...data, firstParagraph: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Secondary Story Paragraph
                </label>
                <textarea
                  rows={2}
                  value={data?.secondParagraph || ""}
                  onChange={(e) => setData({ ...data, secondParagraph: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3 mt-2">
              <MediaUploader
                label="Manufacturing Facility Image"
                value={data?.facilityImage || ""}
                mediaType="image"
                allowedTypes={["image"]}
                helperText="Left column photo showing facility / corrugation plant."
                onChange={(url) => setData({ ...data, facilityImage: url })}
              />
            </div>
          </div>

          {/* 6 Brand Qualities */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Brand Qualities Checkmarks
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  6 key credibility badges displayed next to the company introduction.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const qualities = [...(data?.qualities || [])];
                  qualities.push("New Brand Quality");
                  setData({ ...data, qualities });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quality</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(data?.qualities || []).map((q: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl"
                >
                  <div className="w-5 h-5 rounded-md bg-[#E97835]/15 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#E97835]" />
                  </div>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const qualities = [...(data?.qualities || [])];
                      qualities[idx] = e.target.value;
                      setData({ ...data, qualities });
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const qualities = (data?.qualities || []).filter((_: any, i: number) => i !== idx);
                      setData({ ...data, qualities });
                    }}
                    className="p-1 text-[#687378] hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Live Statistics Counters */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              4 Live Counter Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data?.statistics || []).map((stat: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E97835]">Card 0{idx + 1}</span>
                    <span className="text-[10px] font-mono text-[#687378]">{stat.icon}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Count Value
                      </label>
                      <input
                        type="number"
                        value={stat.value ?? 0}
                        onChange={(e) => {
                          const statistics = [...(data?.statistics || [])];
                          statistics[idx] = { ...statistics[idx], value: Number(e.target.value) };
                          setData({ ...data, statistics });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Suffix (+, %, etc.)
                      </label>
                      <input
                        type="text"
                        value={stat.suffix || "+"}
                        onChange={(e) => {
                          const statistics = [...(data?.statistics || [])];
                          statistics[idx] = { ...statistics[idx], suffix: e.target.value };
                          setData({ ...data, statistics });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => {
                        const statistics = [...(data?.statistics || [])];
                        statistics[idx] = { ...statistics[idx], label: e.target.value };
                        setData({ ...data, statistics });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={stat.subtext || ""}
                      onChange={(e) => {
                        const statistics = [...(data?.statistics || [])];
                        statistics[idx] = { ...statistics[idx], subtext: e.target.value };
                        setData({ ...data, statistics });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#687378] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. OUR JOURNEY & MANUFACTURING MILESTONES               */}
      {/* ======================================================== */}
      {sectionId === "growth-journey" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Header &amp; Subtitle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="OUR JOURNEY"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Our Journey & Manufacturing Milestones."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Right Column Description
                </label>
                <input
                  type="text"
                  value={data?.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="From our foundational corrugation lines in 2008..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Milestones List with Media / Image Upload */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Manufacturing Journey Milestones
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Historical milestones with custom workshop photos, year, headline, and phase description.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const milestones = [...(data?.milestones || [])];
                  milestones.push({
                    id: `milestone-${Date.now()}`,
                    year: "2026",
                    phaseTitle: "New Chapter",
                    headline: "Next Generation Corrugation",
                    description:
                      "Expanding high-speed automated carton lines to serve expanding commercial distribution nationwide.",
                    keyHighlight: "Expanded high-capacity manufacturing lines",
                    statBadge: "Expansion",
                    image: "/about/growth-journey/journey-2008-inception.png",
                  });
                  setData({ ...data, milestones });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-6">
              {(data?.milestones || []).map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 bg-[#FAF9F5] border border-[#E4DED3] rounded-2xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#E97835] text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span className="font-heading text-sm font-bold text-[#E97835]">
                        {m.year || "Year"} • {m.headline || m.title || "Milestone Headline"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const milestones = (data?.milestones || []).filter((_: any, i: number) => i !== idx);
                        setData({ ...data, milestones });
                      }}
                      className="p-1.5 text-[#687378] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Left Column: Milestone Photo MediaUploader */}
                    <div className="md:col-span-5 bg-white p-3.5 border border-[#E4DED3] rounded-xl space-y-2">
                      <MediaUploader
                        label={`Milestone Photo (${m.year || "Card"})`}
                        value={m.image || m.imageSrc || ""}
                        mediaType="image"
                        allowedTypes={["image"]}
                        helperText="Real workshop or facility photo for this milestone."
                        onChange={(url) => {
                          const milestones = [...(data?.milestones || [])];
                          milestones[idx] = { ...milestones[idx], image: url, imageSrc: url };
                          setData({ ...data, milestones });
                        }}
                      />
                    </div>

                    {/* Right Column: Milestone Details */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                            Year (e.g. 2008)
                          </label>
                          <input
                            type="text"
                            value={m.year || ""}
                            onChange={(e) => {
                              const milestones = [...(data?.milestones || [])];
                              milestones[idx] = { ...milestones[idx], year: e.target.value };
                              setData({ ...data, milestones });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#E97835] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                            Phase Title
                          </label>
                          <input
                            type="text"
                            value={m.phaseTitle || m.phaseLabel || ""}
                            onChange={(e) => {
                              const milestones = [...(data?.milestones || [])];
                              milestones[idx] = {
                                ...milestones[idx],
                                phaseTitle: e.target.value,
                                phaseLabel: e.target.value,
                              };
                              setData({ ...data, milestones });
                            }}
                            placeholder="e.g. The Inception"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                            Stat / Badge
                          </label>
                          <input
                            type="text"
                            value={m.statBadge || m.tag || ""}
                            onChange={(e) => {
                              const milestones = [...(data?.milestones || [])];
                              milestones[idx] = {
                                ...milestones[idx],
                                statBadge: e.target.value,
                                tag: e.target.value,
                              };
                              setData({ ...data, milestones });
                            }}
                            placeholder="e.g. Inception & Core Setup"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                          Milestone Headline / Title
                        </label>
                        <input
                          type="text"
                          value={m.headline || m.title || ""}
                          onChange={(e) => {
                            const milestones = [...(data?.milestones || [])];
                            milestones[idx] = {
                              ...milestones[idx],
                              headline: e.target.value,
                              title: e.target.value,
                            };
                            setData({ ...data, milestones });
                          }}
                          placeholder="e.g. Foundations of Quality Packaging"
                          className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={m.description || ""}
                          onChange={(e) => {
                            const milestones = [...(data?.milestones || [])];
                            milestones[idx] = { ...milestones[idx], description: e.target.value };
                            setData({ ...data, milestones });
                          }}
                          placeholder="Aavrit Packaging started in 2008 with a simple ambition..."
                          className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                          Key Technical Highlight
                        </label>
                        <input
                          type="text"
                          value={m.keyHighlight || ""}
                          onChange={(e) => {
                            const milestones = [...(data?.milestones || [])];
                            milestones[idx] = { ...milestones[idx], keyHighlight: e.target.value };
                            setData({ ...data, milestones });
                          }}
                          placeholder="e.g. Manual corrugation lines & foundational quality standards"
                          className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#687378] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. OUR CORE VALUES (5-PLY PHILOSOPHY)                    */}
      {/* ======================================================== */}
      {sectionId === "core-values" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Header &amp; Subtitle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="OUR CORE VALUES"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="What We Stand For Shapes Everything We Do."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Right Column Context Description
                </label>
                <textarea
                  rows={2}
                  value={data?.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Our values guide the way we work, the solutions we create and the relationships we build..."
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E4DED3]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Diagram Title
                </label>
                <input
                  type="text"
                  value={data?.diagramHeading || "INTERACTIVE CORRUGATED CROSS-SECTION"}
                  onChange={(e) => setData({ ...data, diagramHeading: e.target.value })}
                  placeholder="INTERACTIVE CORRUGATED CROSS-SECTION"
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Diagram Badge / Subtitle
                </label>
                <input
                  type="text"
                  value={data?.diagramBadge || "5-Ply Structural Metaphor"}
                  onChange={(e) => setData({ ...data, diagramBadge: e.target.value })}
                  placeholder="5-Ply Structural Metaphor"
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5 Corrugated Board Layers */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  5-Ply Corrugated Board Layers &amp; Core Principles
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Each value card maps to a corresponding structural layer in the 5-ply cross-section.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(data?.values || []).map((val: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#E97835] text-white flex items-center justify-center font-bold text-xs">
                        {val.number || `0${idx + 1}`}
                      </span>
                      <span className="font-heading text-sm font-bold text-[#202A2E]">
                        {val.title || `Core Value 0${idx + 1}`}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E97835]/10 text-[#E97835] border border-[#E97835]/25">
                      {val.layerName || `Layer 0${idx + 1}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Core Value Title
                      </label>
                      <input
                        type="text"
                        value={val.title || ""}
                        onChange={(e) => {
                          const values = [...(data?.values || [])];
                          values[idx] = { ...values[idx], title: e.target.value };
                          setData({ ...data, values });
                        }}
                        placeholder="e.g. Quality First"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Corrugated Layer Name
                      </label>
                      <input
                        type="text"
                        value={val.layerName || ""}
                        onChange={(e) => {
                          const values = [...(data?.values || [])];
                          values[idx] = { ...values[idx], layerName: e.target.value };
                          setData({ ...data, values });
                        }}
                        placeholder="e.g. Top Outer Liner"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Structural Metaphor &amp; Role
                      </label>
                      <input
                        type="text"
                        value={val.layerRole || ""}
                        onChange={(e) => {
                          const values = [...(data?.values || [])];
                          values[idx] = { ...values[idx], layerRole: e.target.value };
                          setData({ ...data, values });
                        }}
                        placeholder="e.g. Shielding Surface & Puncture Resistance"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Description / Principle
                      </label>
                      <textarea
                        rows={2}
                        value={val.description || ""}
                        onChange={(e) => {
                          const values = [...(data?.values || [])];
                          values[idx] = { ...values[idx], description: e.target.value };
                          setData({ ...data, values });
                        }}
                        placeholder="We focus on maintaining quality and consistency throughout our packaging processes."
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. VISION & MISSION                                      */}
      {/* ======================================================== */}
      {sectionId === "vision-mission" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Headings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="OUR VISION & MISSION"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="From Vision to Reality."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={data?.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="One purpose. Every box. A better packaging future."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded">
                Card 01 • Vision
              </span>
              <h3 className="font-heading font-bold text-base text-[#202A2E]">
                Vision Statement
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={data?.vision?.title || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      vision: { ...data?.vision, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={data?.vision?.description || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      vision: { ...data?.vision, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Checkpoints */}
              <div className="pt-2 border-t border-[#E4DED3] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#202A2E]">Vision Checkpoints</span>
                  <button
                    type="button"
                    onClick={() => {
                      const checkpoints = [...(data?.vision?.checkpoints || [])];
                      checkpoints.push("New strategic objective");
                      setData({
                        ...data,
                        vision: { ...data?.vision, checkpoints },
                      });
                    }}
                    className="text-[11px] font-bold text-[#E97835] hover:underline"
                  >
                    + Add Point
                  </button>
                </div>

                {(data?.vision?.checkpoints || []).map((cp: string, cIdx: number) => (
                  <div key={cIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cp}
                      onChange={(e) => {
                        const checkpoints = [...(data?.vision?.checkpoints || [])];
                        checkpoints[cIdx] = e.target.value;
                        setData({
                          ...data,
                          vision: { ...data?.vision, checkpoints },
                        });
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const checkpoints = (data?.vision?.checkpoints || []).filter(
                          (_: any, i: number) => i !== cIdx
                        );
                        setData({
                          ...data,
                          vision: { ...data?.vision, checkpoints },
                        });
                      }}
                      className="p-1 text-[#687378] hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded">
                Card 02 • Mission
              </span>
              <h3 className="font-heading font-bold text-base text-[#202A2E]">
                Mission Statement
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={data?.mission?.title || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      mission: { ...data?.mission, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={data?.mission?.description || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      mission: { ...data?.mission, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Checkpoints */}
              <div className="pt-2 border-t border-[#E4DED3] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#202A2E]">Mission Checkpoints</span>
                  <button
                    type="button"
                    onClick={() => {
                      const checkpoints = [...(data?.mission?.checkpoints || [])];
                      checkpoints.push("New operational commitment");
                      setData({
                        ...data,
                        mission: { ...data?.mission, checkpoints },
                      });
                    }}
                    className="text-[11px] font-bold text-[#E97835] hover:underline"
                  >
                    + Add Point
                  </button>
                </div>

                {(data?.mission?.checkpoints || []).map((cp: string, cIdx: number) => (
                  <div key={cIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cp}
                      onChange={(e) => {
                        const checkpoints = [...(data?.mission?.checkpoints || [])];
                        checkpoints[cIdx] = e.target.value;
                        setData({
                          ...data,
                          mission: { ...data?.mission, checkpoints },
                        });
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const checkpoints = (data?.mission?.checkpoints || []).filter(
                          (_: any, i: number) => i !== cIdx
                        );
                        setData({
                          ...data,
                          mission: { ...data?.mission, checkpoints },
                        });
                      }}
                      className="p-1 text-[#687378] hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MANUFACTURING SHOWCASE                                */}
      {/* ======================================================== */}
      {sectionId === "manufacturing-experience" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Header &amp; Subtitle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="OUR MANUFACTURING EXPERIENCE"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Packaging Solutions, Made with Purpose."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Right Column Description
                </label>
                <textarea
                  rows={2}
                  value={data?.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Explore illustrative packaging applications demonstrating how different products and industries are served with precision-engineered corrugated packaging solutions."
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Project Cards */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Showcase Projects
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Industry-tailored corrugated packaging examples with technical specifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const projects = [...(data?.projects || [])];
                  projects.push({
                    id: `project-${Date.now()}`,
                    category: "CUSTOM PACKAGING",
                    title: "Specialized Shipping Container",
                    description: "High-grade corrugated shipping box for secure commercial transit.",
                    applicationLabel: "Commercial Distribution",
                    imageSrc: "/about/manufacturing-experience/automotive-component-packaging.png",
                    imageAlt: "Custom corrugated shipping box",
                    recommendedFlute: "BC-Flute Double Wall",
                    targetProtection: "High impact resistance",
                    typicalUsage: "Industrial components",
                    sustainabilityNote: "100% recyclable kraft board",
                  });
                  setData({ ...data, projects });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {(data?.projects || []).map((proj: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2">
                    <span className="text-xs font-bold text-[#E97835]">
                      Project 0{idx + 1}: {proj.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const projects = (data?.projects || []).filter((_: any, i: number) => i !== idx);
                        setData({ ...data, projects });
                      }}
                      className="p-1 text-[#687378] hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      title="Remove Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Category Badge
                      </label>
                      <input
                        type="text"
                        value={proj.category || ""}
                        onChange={(e) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], category: e.target.value };
                          setData({ ...data, projects });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.title || ""}
                        onChange={(e) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], title: e.target.value };
                          setData({ ...data, projects });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Application Label
                      </label>
                      <input
                        type="text"
                        value={proj.applicationLabel || ""}
                        onChange={(e) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], applicationLabel: e.target.value };
                          setData({ ...data, projects });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={proj.description || ""}
                        onChange={(e) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], description: e.target.value };
                          setData({ ...data, projects });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <MediaUploader
                        label="Project Showcase Image"
                        value={proj.imageSrc || ""}
                        mediaType="image"
                        allowedTypes={["image"]}
                        onChange={(url) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], imageSrc: url };
                          setData({ ...data, projects });
                        }}
                      />
                    </div>

                    {/* Technical Details */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Recommended Flute
                      </label>
                      <input
                        type="text"
                        value={proj.recommendedFlute || ""}
                        onChange={(e) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], recommendedFlute: e.target.value };
                          setData({ ...data, projects });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Target Protection
                      </label>
                      <input
                        type="text"
                        value={proj.targetProtection || ""}
                        onChange={(e) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], targetProtection: e.target.value };
                          setData({ ...data, projects });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Typical Usage
                      </label>
                      <input
                        type="text"
                        value={proj.typicalUsage || ""}
                        onChange={(e) => {
                          const projects = [...(data?.projects || [])];
                          projects[idx] = { ...projects[idx], typicalUsage: e.target.value };
                          setData({ ...data, projects });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. LEADERSHIP & MANAGEMENT TEAM                          */}
      {/* ======================================================== */}
      {sectionId === "leadership-team" && (
        <div className="space-y-6">
          {/* Part 1: Founder & Managing Director Spotlight */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#E97835] bg-[#E97835]/10 px-2.5 py-1 rounded-full inline-block mb-1">
                  Part 1 &bull; Executive Spotlight
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Founder &amp; Managing Director Spotlight
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="MEET OUR LEADERSHIP"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Leadership That Drives Our Vision."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Founder Name
                </label>
                <input
                  type="text"
                  value={data?.owner?.name || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      owner: { ...data?.owner, name: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={data?.owner?.designation || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      owner: { ...data?.owner, designation: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={data?.owner?.companyName || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      owner: { ...data?.owner, companyName: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <MediaUploader
                  label="Founder Portrait Photo"
                  value={data?.owner?.photoUrl || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  onChange={(url) =>
                    setData({
                      ...data,
                      owner: { ...data?.owner, photoUrl: url },
                    })
                  }
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Featured Leadership Quote
                </label>
                <textarea
                  rows={2}
                  value={data?.owner?.quote || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      owner: { ...data?.owner, quote: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none italic"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Bio Paragraph 1
                </label>
                <textarea
                  rows={2}
                  value={data?.owner?.bioFirst || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      owner: { ...data?.owner, bioFirst: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                  Bio Paragraph 2
                </label>
                <textarea
                  rows={2}
                  value={data?.owner?.bioSecond || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      owner: { ...data?.owner, bioSecond: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Part 2: Departmental Management Team */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#E97835] bg-[#E97835]/10 px-2.5 py-1 rounded-full inline-block mb-1">
                  Part 2 &bull; Management Team Grid
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Meet Our Management Team
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  const team = [
                    ...(data?.team || []),
                    {
                      id: `member-${Date.now()}`,
                      name: "New Member",
                      designation: "Manager",
                      department: "Operations",
                      photoUrl: "/about/management-team/rajesh-patel.png",
                    },
                  ];
                  setData({ ...data, team });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#E4DED3] text-[#202A2E] rounded-xl text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#E97835]" />
                Add Member
              </button>
            </div>

            {/* Team Section Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Team Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.teamBadge || ""}
                  onChange={(e) => setData({ ...data, teamBadge: e.target.value })}
                  placeholder="THE PEOPLE BEHIND OUR WORK"
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Team Main Heading
                </label>
                <input
                  type="text"
                  value={data?.teamTitle || ""}
                  onChange={(e) => setData({ ...data, teamTitle: e.target.value })}
                  placeholder="Meet Our Management Team"
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Team Subtitle
                </label>
                <input
                  type="text"
                  value={data?.teamSubtitle || ""}
                  onChange={(e) => setData({ ...data, teamSubtitle: e.target.value })}
                  placeholder="A dedicated team working together to keep our operations organized..."
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>

            {/* Members Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {(data?.team || []).map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3.5 relative"
                >
                  <div className="flex items-center justify-between border-b border-[#E4DED3]/70 pb-2">
                    <span className="text-xs font-bold text-[#E97835]">
                      Member 0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const team = (data?.team || []).filter((_: any, i: number) => i !== idx);
                        setData({ ...data, team });
                      }}
                      className="text-[#687378] hover:text-[#D9383A] p-1 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={m.name || ""}
                        onChange={(e) => {
                          const team = [...(data?.team || [])];
                          team[idx] = { ...team[idx], name: e.target.value };
                          setData({ ...data, team });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={m.designation || ""}
                        onChange={(e) => {
                          const team = [...(data?.team || [])];
                          team[idx] = { ...team[idx], designation: e.target.value };
                          setData({ ...data, team });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Department / Specialty
                      </label>
                      <input
                        type="text"
                        value={m.department || ""}
                        onChange={(e) => {
                          const team = [...(data?.team || [])];
                          team[idx] = { ...team[idx], department: e.target.value };
                          setData({ ...data, team });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <MediaUploader
                        label="Member Portrait Photo"
                        value={m.photoUrl || ""}
                        mediaType="image"
                        allowedTypes={["image"]}
                        onChange={(url) => {
                          const team = [...(data?.team || [])];
                          team[idx] = { ...team[idx], photoUrl: url };
                          setData({ ...data, team });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. WORKING PRINCIPLES                                    */}
      {/* ======================================================== */}
      {sectionId === "working-principles" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Headings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="HOW WE WORK"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="The Principles Behind Every Box We Create."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={data?.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Our approach brings together thoughtful manufacturing, customer-focused solutions and a consistent commitment to quality."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3 Principles Pillars */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              3 Principle Pillars
            </h2>

            <div className="space-y-6">
              {(data?.principles || []).map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2">
                    <span className="text-xs font-bold text-[#E97835]">
                      Pillar 0{idx + 1}: {p.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Category Label
                      </label>
                      <input
                        type="text"
                        value={p.label || ""}
                        onChange={(e) => {
                          const principles = [...(data?.principles || [])];
                          principles[idx] = { ...principles[idx], label: e.target.value };
                          setData({ ...data, principles });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Pillar Heading
                      </label>
                      <input
                        type="text"
                        value={p.heading || ""}
                        onChange={(e) => {
                          const principles = [...(data?.principles || [])];
                          principles[idx] = { ...principles[idx], heading: e.target.value };
                          setData({ ...data, principles });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={p.description || ""}
                        onChange={(e) => {
                          const principles = [...(data?.principles || [])];
                          principles[idx] = { ...principles[idx], description: e.target.value };
                          setData({ ...data, principles });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Key Checkpoints / Bullet Points */}
                    <div className="sm:col-span-2 bg-white border border-[#E4DED3] rounded-xl p-4 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#E4DED3]/70 pb-2">
                        <div>
                          <label className="block text-xs font-bold text-[#202A2E] uppercase tracking-wider">
                            Key Checkpoints / Feature Points
                          </label>
                          <p className="text-[11px] text-[#687378]">
                            Numbered bullet points displayed beside this principle on the website
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const principles = [...(data?.principles || [])];
                            const currentBullets = principles[idx]?.bulletPoints || [];
                            principles[idx] = {
                              ...principles[idx],
                              bulletPoints: [...currentBullets, "New checkpoint point"],
                            };
                            setData({ ...data, principles });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E97835]/10 hover:bg-[#E97835]/20 text-[#E97835] border border-[#E97835]/30 rounded-lg text-xs font-bold transition-all shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Point
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(p.bulletPoints || []).map((bp: string, bpIdx: number) => (
                          <div key={bpIdx} className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-[#A65D32] bg-[#FAF7F2] border border-[#E8D5B8] px-2 py-1 rounded-md shrink-0">
                              Point 0{bpIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={bp}
                              onChange={(e) => {
                                const principles = [...(data?.principles || [])];
                                const currentBullets = [...(principles[idx]?.bulletPoints || [])];
                                currentBullets[bpIdx] = e.target.value;
                                principles[idx] = {
                                  ...principles[idx],
                                  bulletPoints: currentBullets,
                                };
                                setData({ ...data, principles });
                              }}
                              placeholder="Enter checkpoint description..."
                              className="flex-1 px-3 py-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs font-medium text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const principles = [...(data?.principles || [])];
                                const currentBullets = (principles[idx]?.bulletPoints || []).filter(
                                  (_: any, i: number) => i !== bpIdx
                                );
                                principles[idx] = {
                                  ...principles[idx],
                                  bulletPoints: currentBullets,
                                };
                                setData({ ...data, principles });
                              }}
                              className="text-[#687378] hover:text-[#D9383A] p-1.5 rounded-lg hover:bg-[#D9383A]/10 transition-colors"
                              title="Delete point"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Full width dashed Add Another Point button */}
                        <button
                          type="button"
                          onClick={() => {
                            const principles = [...(data?.principles || [])];
                            const currentBullets = principles[idx]?.bulletPoints || [];
                            principles[idx] = {
                              ...principles[idx],
                              bulletPoints: [...currentBullets, "New checkpoint point"],
                            };
                            setData({ ...data, principles });
                          }}
                          className="w-full py-2 border-2 border-dashed border-[#E4DED3] hover:border-[#E97835] rounded-lg text-xs font-bold text-[#687378] hover:text-[#E97835] hover:bg-[#E97835]/5 flex items-center justify-center gap-1.5 transition-colors mt-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Another Checkpoint Point
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <MediaUploader
                        label="Pillar Image"
                        value={p.imageSrc || ""}
                        mediaType="image"
                        allowedTypes={["image"]}
                        onChange={(url) => {
                          const principles = [...(data?.principles || [])];
                          principles[idx] = { ...principles[idx], imageSrc: url };
                          setData({ ...data, principles });
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Metric Accent Value
                      </label>
                      <input
                        type="text"
                        value={p.metricValue || ""}
                        onChange={(e) => {
                          const principles = [...(data?.principles || [])];
                          principles[idx] = { ...principles[idx], metricValue: e.target.value };
                          setData({ ...data, principles });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                        Metric Accent Label
                      </label>
                      <input
                        type="text"
                        value={p.metricLabel || ""}
                        onChange={(e) => {
                          const principles = [...(data?.principles || [])];
                          principles[idx] = { ...principles[idx], metricLabel: e.target.value };
                          setData({ ...data, principles });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. ABOUT FAQ                                             */}
      {/* ======================================================== */}
      {sectionId === "about-faq" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Section Headings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={data?.badge || ""}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="HAVE QUESTIONS?"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data?.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Frequently Asked Questions"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={data?.subtitle || ""}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Find answers to common questions about our company, packaging solutions and manufacturing approach."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  FAQ Accordion Questions &amp; Answers
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Frequently asked questions shown in the interactive accordion on the About Us page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const faqs = [...(data?.faqs || [])];
                  faqs.push({
                    id: `about-faq-${Date.now()}`,
                    number: (faqs.length + 1).toString().padStart(2, "0"),
                    q: "New About Question?",
                    a: "Detailed explanation answering this question.",
                  });
                  setData({ ...data, faqs });
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-4">
              {(data?.faqs || []).map((faq: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center font-bold text-xs">
                      {faq.number || (idx + 1).toString().padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const faqs = (data?.faqs || []).filter((_: any, i: number) => i !== idx);
                        setData({ ...data, faqs });
                      }}
                      className="p-1 text-[#687378] hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={faq.q || ""}
                      onChange={(e) => {
                        const faqs = [...(data?.faqs || [])];
                        faqs[idx] = { ...faqs[idx], q: e.target.value };
                        setData({ ...data, faqs });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#687378] uppercase mb-1">
                      Answer Text
                    </label>
                    <textarea
                      rows={2}
                      value={faq.a || ""}
                      onChange={(e) => {
                        const faqs = [...(data?.faqs || [])];
                        faqs[idx] = { ...faqs[idx], a: e.target.value };
                        setData({ ...data, faqs });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Save Bar */}
      <div className="sticky bottom-4 z-20 bg-[#FFFFFF] text-[#202A2E] p-4 rounded-2xl shadow-lg flex items-center justify-between border border-[#E4DED3]">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[#687378]">Ready to update:</span>
          <span className="text-[#E97835] font-bold font-mono">{meta.name}</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}
