"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Leaf,
  Layers,
  Recycle,
  ShieldCheck,
  Package,
  Trash2,
  HelpCircle,
  MessageSquareText,
  Globe,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

interface SectionCard {
  title: string;
  description: string;
  route: string;
  icon: any;
  tag: string;
  itemCount?: string;
}

const SECTIONS: SectionCard[] = [
  {
    title: "1. Hero Banner & Mascot",
    description: "Header background, page title, breadcrumb paths, speaking Eco-Specialist mascot character & speech bubble.",
    route: "/dashboard/sustainability/banner",
    icon: Sparkles,
    tag: "Visual Brand",
  },
  {
    title: "2. Introduction & Principles",
    description: "Introductory narrative, natural kraft arrangement photograph, and 3 foundational highlight pillars.",
    route: "/dashboard/sustainability/intro",
    icon: Layers,
    tag: "Narrative",
  },
  {
    title: "3. Corrugated Advantages",
    description: "The 4 core environmental principles of corrugated board (Recyclable, Reusable, Right-Sized, Product Protection).",
    route: "/dashboard/sustainability/difference",
    icon: Recycle,
    tag: "4 Principles",
  },
  {
    title: "4. Responsible Manufacturing",
    description: "4-stage disciplined production lifecycle from material selection to rigorous quality checkpoints.",
    route: "/dashboard/sustainability/manufacturing",
    icon: SlidersHorizontal,
    tag: "4 Stages",
  },
  {
    title: "5. Sustainable Solutions",
    description: "Custom-sized boxes, caliper ply selection, mono-material paperboard, and reusable utility options.",
    route: "/dashboard/sustainability/solutions",
    icon: Package,
    tag: "4 Solutions",
  },
  {
    title: "6. Practical Waste Reduction",
    description: "4 deliberate packaging decisions (Right-Sized, Board Caliper, Material Planning, Responsible Waste Handling).",
    route: "/dashboard/sustainability/waste-reduction",
    icon: ShieldCheck,
    tag: "4 Methods",
  },
  {
    title: "7. Sustainability FAQs",
    description: "Frequently asked questions covering recyclability, multi-trip reuse, kraft types, and packaging audits.",
    route: "/dashboard/sustainability/faqs",
    icon: HelpCircle,
    tag: "Q&A Accordion",
  },
  {
    title: "8. Collaboration CTA Banner",
    description: "Bottom consultation card driving inquiries and product catalog exploration with dual action buttons.",
    route: "/dashboard/sustainability/cta",
    icon: MessageSquareText,
    tag: "Action Prompt",
  },
  {
    title: "9. SEO Optimization",
    description: "Meta tags, open graph preview, canonical URL, and Google SERP snippet preview.",
    route: "/dashboard/sustainability/seo",
    icon: Globe,
    tag: "Search Metadata",
  },
];

export default function SustainabilityOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    async function checkData() {
      try {
        const res = await fetch("/api/sustainability");
        const json = await res.json();
        if (json.success && json.data) {
          setLastSync(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
      } catch (err) {
        console.error("Failed to check sustainability status:", err);
      } finally {
        setLoading(false);
      }
    }
    checkData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#202A2E] via-[#2B383E] to-[#202A2E] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-[#344247]">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#78846A]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78846A]/25 border border-[#78846A]/40 text-[#D1B48C] text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-[#D1B48C]" />
              <span>Environmental &amp; Circular Operations</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
              Sustainability Management
            </h1>
            <p className="text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed">
              Manage all 8 content sections of your live Sustainability page. All edits sync in real-time with MongoDB Atlas and maintain local fallback caching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <a
              href="http://localhost:3000/sustainability"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#202A2E] text-xs font-bold hover:bg-[#FAF7F2] transition-colors shadow-sm"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E97835]" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-[#202A2E] flex items-center gap-2">
            <span>Dynamic Sustainability Modules</span>
            <span className="text-xs font-normal text-[#687378]">({SECTIONS.length} Sections)</span>
          </h2>
          {lastSync && (
            <div className="flex items-center gap-1.5 text-xs text-[#687378]">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Synced at {lastSync}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.route}
                href={sec.route}
                className="group bg-white rounded-2xl border border-[#E4DED3] p-5 sm:p-6 hover:border-[#78846A] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#78846A]/10 text-[#78846A] flex items-center justify-center group-hover:bg-[#78846A] group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#78846A] bg-[#78846A]/10 px-2.5 py-1 rounded-full border border-[#78846A]/20">
                      {sec.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#202A2E] group-hover:text-[#A65D32] transition-colors">
                    {sec.title}
                  </h3>

                  <p className="text-xs text-[#687378] leading-relaxed line-clamp-2">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-bold text-[#A65D32] group-hover:text-[#78846A] transition-colors">
                  <span>Edit Section Content</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
