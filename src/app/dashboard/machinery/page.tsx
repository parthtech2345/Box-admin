"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  Target,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ExternalLink,
} from "lucide-react";

export default function MachineryDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchSummary() {
      try {
        setLoading(true);
        const res = await fetch("/api/machinery");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load machinery dashboard summary:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalMachines = data?.items?.length || 6;

  const sections = [
    {
      title: "Hero Banner & Mascot",
      desc: "Customize the listing banner image, title, and plant engineer mascot dialogues.",
      href: "/dashboard/machinery/banner",
      icon: Sparkles,
      count: "Listing & Detail",
      tag: "Live on Website",
    },
    {
      title: "Plant Intro & Highlights",
      desc: "Configure manufacturing excellence headline, narrative, 4 feature pillars, and plant stats.",
      href: "/dashboard/machinery/intro",
      icon: Layers,
      count: "4 Features",
      tag: "Section 02",
    },
    {
      title: "All Machinery & Detail Editor",
      desc: "Edit all 6 industrial machines: working steps, role points, image galleries, and FAQs.",
      href: "/dashboard/machinery/items",
      icon: Cpu,
      count: `${totalMachines} Machines`,
      tag: "Core Equipment",
    },
    {
      title: "Operational Advantage",
      desc: "Manage the 4 value blocks explaining why machinery investments matter.",
      href: "/dashboard/machinery/why-matters",
      icon: Target,
      count: "4 Value Pillars",
      tag: "Section 04",
    },
    {
      title: "Consultation CTA",
      desc: "Manage call-to-action cards, consultation headlines, and direct telephone links.",
      href: "/dashboard/machinery/cta",
      icon: FileText,
      count: "Listing & Detail CTA",
      tag: "Conversion",
    },
    {
      title: "SEO Optimization",
      desc: "Configure search meta tags, OpenGraph preview cards, keywords, and canonical URLs.",
      href: "/dashboard/machinery/seo",
      icon: HelpCircle,
      count: "Google Search Ready",
      tag: "SEO Settings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C989E] mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E97835]">Machinery & Technology</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            Machinery &amp; Technology CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage your plant infrastructure equipment, detail pages, working steps, galleries, and FAQs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="http://localhost:3000/machinery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E4DED3] text-xs font-bold text-[#202A2E] hover:border-[#E97835] hover:text-[#E97835] transition-colors shadow-2xs"
          >
            <span>View Live Machinery</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E]">
            Active Machines
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-heading font-black text-2xl text-[#202A2E]">
              {totalMachines}
            </span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded-full">
              Full Detail Ready
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E]">
            Listing Sections
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-heading font-black text-2xl text-[#202A2E]">5</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Synced
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E]">
            Detail Components
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-heading font-black text-2xl text-[#202A2E]">7</span>
            <span className="text-xs font-bold text-[#202A2E] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E4DED3]">
              Per Machine
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C989E]">
            Database Mode
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-heading font-black text-lg text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Live Sync
            </span>
            <span className="text-[10px] text-[#8C989E]">JSON + Mongo</span>
          </div>
        </div>
      </div>

      {/* Grid of Section Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <Link
              key={idx}
              href={sec.href}
              className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs hover:border-[#E97835] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E97835]/15 text-[#E97835] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#A65D32] bg-[#A65D32]/10 px-2 py-0.5 rounded-full">
                    {sec.tag}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-[#202A2E] group-hover:text-[#E97835] transition-colors mb-1.5">
                  {sec.title}
                </h3>
                <p className="text-xs text-[#687378] leading-relaxed mb-4">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4DED3] flex items-center justify-between text-xs font-semibold text-[#8C989E] group-hover:text-[#E97835]">
                <span>{sec.count}</span>
                <div className="flex items-center gap-1 text-[#E97835] font-bold">
                  <span>Edit Section</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
