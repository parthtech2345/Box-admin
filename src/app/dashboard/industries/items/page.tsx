"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Edit,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Factory,
  Plus,
} from "lucide-react";
import {
  DEFAULT_INDUSTRIES_LIST,
  IndustryItem,
} from "@/lib/defaultIndustryData";

export default function IndustriesListPage() {
  const [industries, setIndustries] = useState<IndustryItem[]>(DEFAULT_INDUSTRIES_LIST);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadIndustries() {
      try {
        setLoading(true);
        const res = await fetch("/api/industries");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setIndustries(json.data);
        }
      } catch (e) {
        // Fallback to defaults
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadIndustries();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = industries.filter((ind) =>
    ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ind.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ind.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Industries</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              All Industries & SEO
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            All Industries & Detail Pages
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage industry-specific copy, packaging challenges, requirements, business examples, applications, FAQs, and full Google SEO metadata.
          </p>
        </div>

        <Link
          href="/dashboard/industries/items/new"
          className="px-5 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Industry</span>
        </Link>
      </div>

      {/* Search & Quick Stats Filter Strip */}
      <div className="bg-white rounded-2xl border border-[#E4DED3] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#687378] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search industry by name, slug or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] text-xs text-[#202A2E] focus:bg-white focus:border-[#E97835] outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#687378] self-end sm:self-auto font-medium">
          <span>Total Sectors:</span>
          <span className="font-bold text-[#202A2E] bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-[#E4DED3]">
            {filtered.length} of {industries.length}
          </span>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ind, idx) => (
          <div
            key={ind.slug || idx}
            className="bg-white rounded-2xl border border-[#E4DED3] overflow-hidden shadow-xs hover:border-[#D1B48C] hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Preview with Category / Slug Overlay */}
              <div className="relative w-full aspect-[16/10] bg-[#FAF9F5] overflow-hidden">
                <Image
                  src={ind.image || "/home/industries/automotive.jpg"}
                  alt={ind.imageAlt || ind.name}
                  fill
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#202A2E]/80 backdrop-blur-xs text-white text-[11px] font-mono font-semibold tracking-wide">
                    /industries/{ind.slug}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-heading font-bold text-base text-[#202A2E] group-hover:text-[#E97835] transition-colors leading-snug">
                  {ind.name}
                </h3>

                <p className="text-xs text-[#687378] line-clamp-2 leading-relaxed">
                  {ind.shortDescription}
                </p>

                {/* Sub Features Count Badges */}
                <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] text-[#687378]">
                  <span className="bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E4DED3]">
                    {ind.packagingRequirements?.length || 4} Specs
                  </span>
                  <span className="bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E4DED3]">
                    {ind.packagingApplications?.length || 4} Applications
                  </span>
                  <span className="bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E4DED3]">
                    {ind.faqs?.length || 5} FAQs
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#FAF9F5] border-t border-[#E4DED3] flex items-center justify-end">
              <Link
                href={`/dashboard/industries/items/${ind.slug}`}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Industry & SEO</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
