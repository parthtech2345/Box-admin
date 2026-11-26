"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  Database,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  PlaySquare,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Building2,
  Boxes,
  ShieldCheck,
  Factory,
  Briefcase,
  Layers3,
  Leaf,
  Handshake,
  MessageSquareQuote,
  HelpCircle,
} from "lucide-react";
import { HOME_SECTIONS_LIST } from "@/lib/defaultHomeData";

const ICON_MAP: Record<string, React.ElementType> = {
  PlaySquare,
  Building2,
  Boxes,
  ShieldCheck,
  Sliders,
  Factory,
  Layers,
  Briefcase,
  Layers3,
  Leaf,
  Handshake,
  MessageSquareQuote,
  HelpCircle,
  Sparkles,
};

export default function DashboardOverviewPage() {
  const [sectionsData, setSectionsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/home-sections");
      const data = await res.json();
      if (data.success) {
        setSectionsData(data.data || {});
      }
    } catch (e) {
      console.error("Failed to load sections", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSeedDefaults = async () => {
    if (!confirm("This will synchronize all 14 homepage sections with website defaults in MongoDB. Proceed?")) {
      return;
    }
    setSeeding(true);
    setSeedSuccess(null);
    try {
      const res = await fetch("/api/home-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess("All 14 homepage sections successfully seeded to MongoDB!");
        await fetchSections();
      }
    } catch (e) {
      alert("Error seeding defaults: " + e);
    } finally {
      setSeeding(false);
    }
  };

  const heroData = sectionsData["hero"] || {};
  const heroMediaType = heroData.mediaType || "video";

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D1B48C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E97835]/10 border border-[#E97835]/20 text-[#E97835] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Packaging CMS</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E] tracking-tight">
            Homepage Content Management
          </h1>
          <p className="text-sm text-[#687378] mt-2 leading-relaxed">
            Manage, upload media (video, image, or gif), and customize all 14 sections of the Aavrit Packaging homepage. All changes sync directly to MongoDB and display in real time on the website.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl bg-[#F5F2EB] hover:bg-[#EAE4D7] text-[#202A2E] text-xs font-bold border border-[#E4DED3] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
            <span>{seeding ? "Syncing..." : "Seed All Defaults to MongoDB"}</span>
          </button>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#202A2E] hover:bg-[#2b383e] text-[#D1B48C] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{seedSuccess}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sections */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687378]">
              Total Sections
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D1B48C]/20 text-[#845B32] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-3xl text-[#202A2E]">
            14
          </div>
          <p className="text-xs text-[#687378] mt-1">From Hero to Final CTA</p>
        </div>

        {/* Hero Section Media Mode */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687378]">
              Hero Media Mode
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
              {heroMediaType === "video" ? (
                <PlaySquare className="w-4 h-4" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-[#202A2E] capitalize flex items-center gap-2">
            <span>{heroMediaType} Mode</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                heroMediaType === "video"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              Active
            </span>
          </div>
          <Link
            href="/dashboard/home-sections/hero"
            className="text-xs text-[#E97835] font-bold hover:underline mt-1 inline-block"
          >
            Switch to {heroMediaType === "video" ? "Image" : "Video"} &rarr;
          </Link>
        </div>

        {/* Database Status */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687378]">
              MongoDB Database
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-[#202A2E]">
            box-website
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Collection: home_sections
          </p>
        </div>

        {/* Media Formats Supported */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687378]">
              Media Supported
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#202A2E] text-[#D1B48C] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-[#202A2E]">
            Video / Image / GIF
          </div>
          <p className="text-xs text-[#687378] mt-1">Multi-format upload engine</p>
        </div>
      </div>

      {/* Homepage Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-xl text-[#202A2E]">
              Homepage Sections
            </h2>
            <p className="text-xs text-[#687378] mt-0.5">
              Select any section to edit its content, upload media, or modify parameters.
            </p>
          </div>
          <span className="text-xs text-[#845B32] font-bold bg-[#D1B48C]/20 px-3 py-1 rounded-full border border-[#D1B48C]/40">
            14 Sections Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOME_SECTIONS_LIST.map((sec, idx) => {
            const IconComponent = ICON_MAP[sec.icon] || Boxes;
            const currentData = sectionsData[sec.id] || {};
            const isHero = sec.id === "hero";
            const updated = currentData.updatedAt
              ? new Date(currentData.updatedAt).toLocaleDateString()
              : "Default";

            return (
              <div
                key={sec.id}
                className="bg-[#FFFFFF] border border-[#E4DED3] hover:border-[#D1B48C] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] text-[#202A2E] flex items-center justify-center group-hover:bg-[#202A2E] group-hover:text-[#D1B48C] transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-[#A0ACB2]">
                        #{(idx + 1).toString().padStart(2, "0")}
                      </span>
                      {isHero && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E97835]/15 text-[#E97835]">
                          {heroMediaType.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#202A2E] group-hover:text-[#E97835] transition-colors">
                    {sec.name}
                  </h3>
                  <p className="text-xs text-[#687378] mt-1.5 line-clamp-2 leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E4DED3] flex items-center justify-between">
                  <span className="text-[11px] text-[#A0ACB2]">
                    Updated: <strong className="text-[#687378]">{updated}</strong>
                  </span>
                  <Link
                    href={`/dashboard/home-sections/${sec.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F2EB] group-hover:bg-[#202A2E] text-[#202A2E] group-hover:text-[#D1B48C] text-xs font-bold transition-all"
                  >
                    <span>Edit Section</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
