"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FolderKanban,
  Eye,
  Globe,
} from "lucide-react";

interface GalleryStats {
  totalItems: number;
  categoryCounts: Record<string, number>;
  hasBanner: boolean;
  hasCta: boolean;
  hasSeo: boolean;
  updatedAt?: string;
}

export default function GalleryOverviewPage() {
  const [stats, setStats] = useState<GalleryStats>({
    totalItems: 0,
    categoryCounts: {},
    hasBanner: false,
    hasCta: false,
    hasSeo: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const items = d.showcase?.items || [];
        const counts: Record<string, number> = {};
        items.forEach((item: any) => {
          const cat = item.category || "Uncategorized";
          counts[cat] = (counts[cat] || 0) + 1;
        });

        setStats({
          totalItems: items.length,
          categoryCounts: counts,
          hasBanner: Boolean(d.banner?.title),
          hasCta: Boolean(d.cta?.title),
          hasSeo: Boolean(d.seo?.metaTitle),
          updatedAt: d.showcase?.updatedAt || d.banner?.updatedAt,
        });
      }
    } catch (e) {
      console.error("Failed to fetch gallery stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const SECTIONS = [
    {
      id: "banner",
      title: "Hero Banner & Mascot",
      desc: "Title, breadcrumb navigation, panoramic background, and speaking curator mascot.",
      icon: ImageIcon,
      href: "/dashboard/gallery/banner",
      status: stats.hasBanner ? "Active" : "Default",
      stat: "1 Panoramic Stage",
    },
    {
      id: "items",
      title: "Visual Showcase & Items",
      desc: "Manage the interactive grid of showcase images, categories, descriptions, keypoints, and detail modal links.",
      icon: FolderKanban,
      href: "/dashboard/gallery/items",
      status: "Active",
      stat: `${stats.totalItems} Showcase Items`,
    },
    {
      id: "cta",
      title: "Call to Action Consultation",
      desc: "Inquiry consultation card, direct product exploration link, and contact team triggers.",
      icon: Sparkles,
      href: "/dashboard/gallery/cta",
      status: stats.hasCta ? "Active" : "Default",
      stat: "Consultation CTA",
    },
    {
      id: "seo",
      title: "SEO & Social Sharing",
      desc: "Meta title, SERP snippet, search keywords, canonical URL, and OpenGraph social banner preview.",
      icon: Globe,
      href: "/dashboard/gallery/seo",
      status: stats.hasSeo ? "Configured" : "Default",
      stat: "SERP & OpenGraph",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#A65D32] uppercase tracking-wider">
              Media &amp; Portfolio Management
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E] tracking-tight">
            Packaging Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Control the visual showcase items, categories, hero banner, and modal details on the live website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E4DED3] text-xs font-bold text-[#202A2E] hover:bg-[#FAF9F5] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#687378] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="http://localhost:3000/gallery"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-[#202A2E] hover:bg-[#A65D32] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span>View Live Page</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#687378] uppercase">Showcase Items</span>
            <div className="w-7 h-7 rounded-lg bg-[#A65D32]/10 text-[#A65D32] flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-[#202A2E]">
            {stats.totalItems}
          </div>
          <p className="text-[11px] text-[#8C7E72] mt-1">Images across 5 core categories</p>
        </div>

        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#687378] uppercase">Active Categories</span>
            <div className="w-7 h-7 rounded-lg bg-[#78846A]/10 text-[#78846A] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-[#202A2E]">
            {Object.keys(stats.categoryCounts).length || 5}
          </div>
          <p className="text-[11px] text-[#8C7E72] mt-1">Organized portfolio taxonomy</p>
        </div>

        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#687378] uppercase">Interactive Modal</span>
            <div className="w-7 h-7 rounded-lg bg-[#E97835]/10 text-[#E97835] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-[#202A2E]">
            Detailed
          </div>
          <p className="text-[11px] text-[#8C7E72] mt-1">Zoom, key highlights &amp; links</p>
        </div>

        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#687378] uppercase">Sync Status</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-heading font-bold text-base text-emerald-600 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Active</span>
          </div>
          <p className="text-[10px] text-[#8C7E72] mt-1">MongoDB &amp; JSON cache synced</p>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      {Object.keys(stats.categoryCounts).length > 0 && (
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
              Category Breakdown
            </h3>
            <Link
              href="/dashboard/gallery/items"
              className="text-xs font-bold text-[#A65D32] hover:underline flex items-center gap-1"
            >
              <span>Manage Items</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.categoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] text-xs font-semibold text-[#202A2E]"
              >
                <span>{cat}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#A65D32]/15 text-[#A65D32] text-[10px] font-bold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Editors Grid */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-[#202A2E]">
          Gallery Content Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.id}
                href={sec.href}
                className="group bg-white border border-[#E4DED3] hover:border-[#A65D32] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E4DED3] text-[#A65D32] flex items-center justify-center group-hover:bg-[#A65D32] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-[#E4DED3] text-[#687378]">
                      {sec.stat}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base text-[#202A2E] group-hover:text-[#A65D32] transition-colors flex items-center gap-1.5">
                      <span>{sec.title}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#A65D32]" />
                    </h3>
                    <p className="text-xs text-[#687378] mt-1 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E4DED3]/70 flex items-center justify-between text-xs font-bold text-[#A65D32]">
                  <span>Edit Settings</span>
                  <span className="text-[11px] font-normal text-[#8C7E72]">
                    Status: <strong className="text-emerald-600 font-semibold">{sec.status}</strong>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
