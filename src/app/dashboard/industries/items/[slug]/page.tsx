"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  Eye,
  FileText,
  HelpCircle,
  ShieldCheck,
  Building2,
  Package,
  Globe,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_INDUSTRIES_LIST,
  IndustryItem,
  generateIndustrySEO,
} from "@/lib/defaultIndustryData";

export default function IndustryItemEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "automotive";
  const isNew = slug === "new";

  const [data, setData] = useState<IndustryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "requirements" | "businesses" | "applications" | "faqs" | "seo">("content");

  useEffect(() => {
    let isMounted = true;
    async function loadItem() {
      if (slug === "new") {
        setData({
          slug: "",
          name: "",
          shortDescription: "",
          heroTagline: "",
          image: "/home/industries/automotive.jpg",
          detailedOverview: [
            "We engineer custom corrugated boxes designed specifically for the unique demands and logistics stresses of this sector.",
          ],
          packagingChallenges: [
            "Transit shock and vibration damage during inter-facility dispatch",
            "Atmospheric humidity and moisture causing corrugated board degradation",
            "Warehouse compression stress under multiple stacked pallet layers",
          ],
          corrugatedBenefits: [
            "Calibrated high Edge Crush Test (ECT) ratings ensuring stack reliability",
            "Custom-molded internal protective partitions preventing component abrasion",
            "100% recyclable, sustainable bio-degradable virgin and recycled kraft board",
          ],
          packagingRequirements: [
            { title: "Box Construction", description: "Heavy-duty 5-Ply or 7-Ply corrugated board" },
            { title: "Compression Strength", description: "Engineered high Edge Crush Test (ECT) rating" },
          ],
          businessExamples: [
            { name: "Original Equipment Manufacturers (OEM)", type: "Automotive & Industrial", packagingRelevance: "Bulk transit and supply line delivery cartons" },
            { name: "Tier 1 & Tier 2 Suppliers", type: "Component Fabricators", packagingRelevance: "Standardized internal warehouse handling cartons" },
          ],
          packagingApplications: [
            { name: "Heavy Component Master Shippers", description: "Reinforced corrugated containers for large payloads", image: "/home/industries/automotive.jpg" },
            { name: "Segmented Partition Cartons", description: "Internal die-cut grid cells preventing component collision", image: "/home/industries/automotive.jpg" },
          ],
          relatedProductSlugs: ["5-ply-corrugated-boxes", "7-ply-corrugated-boxes", "regular-slotted-cartons"],
          faqs: [
            { question: "What flute grade is recommended for this industry?", answer: "We recommend BC-Flute double wall or 7-ply triple wall depending on product density." },
            { question: "Can custom branding and handling warning symbols be printed?", answer: "Yes, up to 4-colour flexographic printing is supported." },
          ],
          seo: {
            metaTitle: "Packaging Solutions | AAVRIT PACKAGING",
            metaDescription: "Custom heavy-duty corrugated packaging engineered for industrial performance.",
            metaKeywords: "corrugated packaging, industrial boxes, custom cartons",
            canonicalLink: "https://aavritpackaging.com/industries",
            schemaMarkup: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Industrial Packaging Solutions",
              description: "Custom heavy-duty corrugated packaging engineered for industrial performance.",
              brand: { "@type": "Brand", name: "AAVRIT PACKAGING" },
            }, null, 2),
          },
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/industries?slug=${slug}`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            const fallback = DEFAULT_INDUSTRIES_LIST.find((i) => i.slug === slug) || DEFAULT_INDUSTRIES_LIST[0];
            setData(fallback);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          const fallback = DEFAULT_INDUSTRIES_LIST.find((i) => i.slug === slug) || DEFAULT_INDUSTRIES_LIST[0];
          setData(fallback);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadItem();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleSave = async () => {
    if (!data) return;
    if (!data.name?.trim()) {
      setToast({ type: "error", message: "Industry Name is required" });
      return;
    }
    const cleanSlug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")).trim();
    if (!cleanSlug) {
      setToast({ type: "error", message: "A valid URL slug is required" });
      return;
    }
    const itemToSave: IndustryItem = {
      ...data,
      slug: cleanSlug,
    };

    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/industries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "item", slug: cleanSlug, data: itemToSave }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: `${itemToSave.name} saved successfully!` });
        if (isNew) {
          setTimeout(() => {
            router.push(`/dashboard/industries/items/${cleanSlug}`);
          }, 1200);
        } else {
          setTimeout(() => setToast(null), 4000);
        }
      } else {
        throw new Error(json.message || "Failed to save industry");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save industry" });
    } finally {
      setSaving(false);
    }
  };

  const handleAutoGenerateSEO = () => {
    if (!data) return;
    const generated = generateIndustrySEO(data.name, data.slug, data.shortDescription);
    setData({
      ...data,
      seo: {
        ...generated,
      },
    });
    setToast({ type: "success", message: "Auto-generated SEO metadata applied!" });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading || !data) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Industry Data & SEO...
      </div>
    );
  }

  const serpTitle = data.seo?.metaTitle || `${data.name} | AAVRIT PACKAGING`;
  const serpUrl = data.seo?.canonicalLink || `https://aavritpackaging.com/industries/${data.slug}`;
  const serpDesc = data.seo?.metaDescription || data.shortDescription || "";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/industries/items"
              className="text-xs text-[#687378] hover:text-[#202A2E] font-semibold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Industries</span>
            </Link>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              {isNew ? "Create New" : data.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            {isNew ? (data.name ? `New: ${data.name}` : "Create New Industry") : data.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1 font-mono">
            /industries/{data.slug || (isNew ? "your-new-slug" : "")}
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
                <span>{isNew ? "Creating Industry..." : "Saving Changes..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNew ? "Create Industry" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Section Tabs */}
      <div className="bg-white rounded-2xl border border-[#E4DED3] p-1.5 flex gap-1 overflow-x-auto shadow-xs">
        {[
          { id: "content", label: "Overview & Copy", icon: FileText },
          { id: "requirements", label: "Requirements", icon: ShieldCheck },
          { id: "businesses", label: "Client Sectors", icon: Building2 },
          { id: "applications", label: "Packaging Applications", icon: Package },
          { id: "faqs", label: "FAQs (Bespoke)", icon: HelpCircle },
          { id: "seo", label: "SEO & Search Snippet", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW & COPY */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Industry Identifiers & Headline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Industry Name
                </label>
                <input
                  type="text"
                  value={data.name || ""}
                  onChange={(e) => {
                    const newName = e.target.value;
                    const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                    setData({
                      ...data,
                      name: newName,
                      slug: isNew && (!data.slug || data.slug === data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")) ? autoSlug : data.slug,
                    });
                  }}
                  placeholder="e.g. Aerospace & Aviation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  URL Slug (/industries/[slug])
                </label>
                <input
                  type="text"
                  value={data.slug || ""}
                  onChange={(e) => setData({ ...data, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Hero Tagline (Displayed on Industry Details Banner)
                </label>
                <input
                  type="text"
                  value={data.heroTagline || ""}
                  onChange={(e) => setData({ ...data, heroTagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={data.shortDescription || ""}
                  onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Industry Hero Image & SEO Alt Tag
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <MediaUploader
                  label="Industry Cover Image"
                  value={data.image || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  onChange={(url) => setData({ ...data, image: url })}
                />

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Image Alt Tag (SEO Critical)
                  </label>
                  <input
                    type="text"
                    value={data.imageAlt || ""}
                    onChange={(e) => setData({ ...data, imageAlt: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs"
                  />
                </div>
              </div>

              <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E4DED3] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378] block">
                  Image Preview
                </span>
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-white border border-[#E4DED3]">
                  <Image
                    src={data.image || "/home/industries/automotive.jpg"}
                    alt={data.imageAlt || data.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <p className="text-[11px] text-[#687378] font-mono truncate">
                  {data.image}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                  Detailed Overview Paragraphs ({data.detailedOverview?.length || 0})
                </h2>
                <p className="text-[11px] text-[#687378]">
                  Technical narrative displayed on the left side of the overview section.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    detailedOverview: [...(data.detailedOverview || []), ""],
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#E97835] hover:text-white text-[#202A2E] text-xs font-bold border border-[#E4DED3] transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            <div className="space-y-3">
              {(data.detailedOverview || []).map((para, pIdx) => (
                <div key={pIdx} className="flex gap-2 items-start">
                  <span className="w-6 h-6 rounded-lg bg-[#FAF9F5] border border-[#E4DED3] text-[#687378] text-xs font-bold flex items-center justify-center shrink-0 mt-2">
                    {pIdx + 1}
                  </span>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const updated = [...(data.detailedOverview || [])];
                      updated[pIdx] = e.target.value;
                      setData({ ...data, detailedOverview: updated });
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(data.detailedOverview || [])];
                      updated.splice(pIdx, 1);
                      setData({ ...data, detailedOverview: updated });
                    }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mt-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-[#202A2E]">
                  Packaging Challenges
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      packagingChallenges: [...(data.packagingChallenges || []), ""],
                    })
                  }
                  className="text-xs text-[#E97835] font-bold hover:underline"
                >
                  + Add Challenge
                </button>
              </div>

              <div className="space-y-2">
                {(data.packagingChallenges || []).map((ch, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ch}
                      onChange={(e) => {
                        const updated = [...(data.packagingChallenges || [])];
                        updated[cIdx] = e.target.value;
                        setData({ ...data, packagingChallenges: updated });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(data.packagingChallenges || [])];
                        updated.splice(cIdx, 1);
                        setData({ ...data, packagingChallenges: updated });
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-2">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-[#202A2E]">
                  Corrugated Packaging Benefits
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      corrugatedBenefits: [...(data.corrugatedBenefits || []), ""],
                    })
                  }
                  className="text-xs text-[#E97835] font-bold hover:underline"
                >
                  + Add Benefit
                </button>
              </div>

              <div className="space-y-2">
                {(data.corrugatedBenefits || []).map((bn, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bn}
                      onChange={(e) => {
                        const updated = [...(data.corrugatedBenefits || [])];
                        updated[bIdx] = e.target.value;
                        setData({ ...data, corrugatedBenefits: updated });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(data.corrugatedBenefits || [])];
                        updated.splice(bIdx, 1);
                        setData({ ...data, corrugatedBenefits: updated });
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
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

      {/* TAB 2: REQUIREMENTS */}
      {activeTab === "requirements" && (
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                Specific Packaging Requirements ({data.packagingRequirements?.length || 0} Cards)
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  packagingRequirements: [
                    ...(data.packagingRequirements || []),
                    { title: "New Requirement", description: "Requirement details" },
                  ],
                })
              }
              className="px-3.5 py-2 rounded-xl bg-[#E97835] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Requirement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(data.packagingRequirements || []).map((req, rIdx) => (
              <div
                key={rIdx}
                className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-[#E4DED3]/60">
                  <span className="text-[11px] font-bold text-[#E97835]">
                    Requirement #{rIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(data.packagingRequirements || [])];
                      updated.splice(rIdx, 1);
                      setData({ ...data, packagingRequirements: updated });
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#687378] mb-1">
                    Requirement Title
                  </label>
                  <input
                    type="text"
                    value={req.title || ""}
                    onChange={(e) => {
                      const updated = [...(data.packagingRequirements || [])];
                      updated[rIdx] = { ...updated[rIdx], title: e.target.value };
                      setData({ ...data, packagingRequirements: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#687378] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={req.description || ""}
                    onChange={(e) => {
                      const updated = [...(data.packagingRequirements || [])];
                      updated[rIdx] = { ...updated[rIdx], description: e.target.value };
                      setData({ ...data, packagingRequirements: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESSES */}
      {activeTab === "businesses" && (
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                Examples of Businesses in This Industry ({data.businessExamples?.length || 0})
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  businessExamples: [
                    ...(data.businessExamples || []),
                    {
                      name: "New Sector Client",
                      type: "Manufacturing & Distribution Hubs",
                      packagingRelevance: "Packaging relevance details",
                    },
                  ],
                })
              }
              className="px-3.5 py-2 rounded-xl bg-[#E97835] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Business Example</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.businessExamples || []).map((biz, bIdx) => (
              <div
                key={bIdx}
                className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-[#E4DED3]/60">
                  <span className="text-[11px] font-bold text-[#202A2E]">
                    #{bIdx + 1} {biz.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(data.businessExamples || [])];
                      updated.splice(bIdx, 1);
                      setData({ ...data, businessExamples: updated });
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#687378] mb-1">
                      Business Group / Name
                    </label>
                    <input
                      type="text"
                      value={biz.name || ""}
                      onChange={(e) => {
                        const updated = [...(data.businessExamples || [])];
                        updated[bIdx] = { ...updated[bIdx], name: e.target.value };
                        setData({ ...data, businessExamples: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#687378] mb-1">
                      Sector / Business Type
                    </label>
                    <input
                      type="text"
                      value={biz.type || ""}
                      onChange={(e) => {
                        const updated = [...(data.businessExamples || [])];
                        updated[bIdx] = { ...updated[bIdx], type: e.target.value };
                        setData({ ...data, businessExamples: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-[#687378] mb-1">
                      Packaging Relevance & Application
                    </label>
                    <textarea
                      rows={2}
                      value={biz.packagingRelevance || ""}
                      onChange={(e) => {
                        const updated = [...(data.businessExamples || [])];
                        updated[bIdx] = { ...updated[bIdx], packagingRelevance: e.target.value };
                        setData({ ...data, businessExamples: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                Common Packaging Applications ({data.packagingApplications?.length || 0} Cards)
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  packagingApplications: [
                    ...(data.packagingApplications || []),
                    {
                      name: "New Application Box",
                      description: "Application description",
                      image: "/Product/items/regular-slotted-cartons.png",
                    },
                  ],
                })
              }
              className="px-3.5 py-2 rounded-xl bg-[#E97835] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Application</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(data.packagingApplications || []).map((app, aIdx) => (
              <div
                key={aIdx}
                className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-[#E4DED3]/60">
                  <span className="text-[11px] font-bold text-[#E97835]">
                    Application #{aIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(data.packagingApplications || [])];
                      updated.splice(aIdx, 1);
                      setData({ ...data, packagingApplications: updated });
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#687378] mb-1">
                    Application Box Name
                  </label>
                  <input
                    type="text"
                    value={app.name || ""}
                    onChange={(e) => {
                      const updated = [...(data.packagingApplications || [])];
                      updated[aIdx] = { ...updated[aIdx], name: e.target.value };
                      setData({ ...data, packagingApplications: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#687378] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={app.description || ""}
                    onChange={(e) => {
                      const updated = [...(data.packagingApplications || [])];
                      updated[aIdx] = { ...updated[aIdx], description: e.target.value };
                      setData({ ...data, packagingApplications: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs"
                  />
                </div>

                <MediaUploader
                  label="Application Box Image"
                  value={app.image || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  onChange={(url) => {
                    const updated = [...(data.packagingApplications || [])];
                    updated[aIdx] = { ...updated[aIdx], image: url };
                    setData({ ...data, packagingApplications: updated });
                  }}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E4DED3]">
            <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
              Related Product Slugs (Comma-separated from catalogue)
            </label>
            <input
              type="text"
              value={(data.relatedProductSlugs || []).join(", ")}
              onChange={(e) => {
                const slugs = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                setData({ ...data, relatedProductSlugs: slugs });
              }}
              placeholder="e.g. automobile-component-boxes, 7-ply-corrugated-boxes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* TAB 5: FAQS */}
      {activeTab === "faqs" && (
        <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                Bespoke Industry FAQs ({data.faqs?.length || 0})
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  faqs: [
                    ...(data.faqs || []),
                    {
                      question: "New Question regarding this industry?",
                      answer: "Detailed technical answer.",
                    },
                  ],
                })
              }
              className="px-3.5 py-2 rounded-xl bg-[#E97835] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.faqs || []).map((faq, fIdx) => (
              <div
                key={fIdx}
                className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-2"
              >
                <div className="flex items-center justify-between pb-1 border-b border-[#E4DED3]/60">
                  <span className="text-[11px] font-bold text-[#E97835]">
                    Question #{fIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(data.faqs || [])];
                      updated.splice(fIdx, 1);
                      setData({ ...data, faqs: updated });
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#687378] mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question || ""}
                    onChange={(e) => {
                      const updated = [...(data.faqs || [])];
                      updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                      setData({ ...data, faqs: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#687378] mb-1">
                    Answer
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answer || ""}
                    onChange={(e) => {
                      const updated = [...(data.faqs || [])];
                      updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                      setData({ ...data, faqs: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SEO OPTIMIZATION SUITE */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#E97835]" />
                  <span>Google SEO Meta Optimization</span>
                </h2>
                <p className="text-[11px] text-[#687378]">
                  Configure exact meta title, description, keywords, canonical link, and JSON-LD schema.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoGenerateSEO}
                className="px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#E97835] hover:text-white text-[#202A2E] text-xs font-bold border border-[#E4DED3] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E97835] group-hover:text-white" />
                <span>Auto-Generate SEO</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#202A2E]">
                    SEO Meta Title *
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      (data.seo?.metaTitle || "").length >= 50 && (data.seo?.metaTitle || "").length <= 60
                        ? "text-emerald-700 font-bold"
                        : "text-[#687378]"
                    }`}
                  >
                    {(data.seo?.metaTitle || "").length} / 60 chars (Recommended: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={data.seo?.metaTitle || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...(data.seo || ({} as any)), metaTitle: e.target.value },
                    })
                  }
                  placeholder="Automotive Packaging Solutions | Corrugated Boxes | AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-semibold text-[#202A2E]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#202A2E]">
                    SEO Meta Description *
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      (data.seo?.metaDescription || "").length >= 140 && (data.seo?.metaDescription || "").length <= 160
                        ? "text-emerald-700 font-bold"
                        : "text-[#687378]"
                    }`}
                  >
                    {(data.seo?.metaDescription || "").length} / 160 chars (Recommended: 150-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={data.seo?.metaDescription || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...(data.seo || ({} as any)), metaDescription: e.target.value },
                    })
                  }
                  placeholder="Heavy-duty 5-ply & 7-ply corrugated packaging for automotive components..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  SEO Meta Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={data.seo?.metaKeywords || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...(data.seo || ({} as any)), metaKeywords: e.target.value },
                    })
                  }
                  placeholder="automotive packaging, corrugated boxes manufacturer, automotive parts boxes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Canonical URL Link
                </label>
                <input
                  type="text"
                  value={data.seo?.canonicalLink || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...(data.seo || ({} as any)), canonicalLink: e.target.value },
                    })
                  }
                  placeholder={`https://aavritpackaging.com/industries/${data.slug}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5 flex items-center justify-between">
                  <span>Structured Data Schema Markup (Schema.org JSON-LD)</span>
                  <span className="text-[10px] text-[#687378] font-normal">Valid JSON</span>
                </label>
                <textarea
                  rows={6}
                  value={data.seo?.schemaMarkup || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...(data.seo || ({} as any)), schemaMarkup: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-[#E4DED3] text-xs font-mono bg-[#FAF9F5]"
                />
              </div>
            </div>
          </div>

          {/* Live Google SERP Snippet Preview */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4DED3]">
              <span className="text-xs font-bold text-[#202A2E] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#E97835]" />
                <span>Live Google Search Result Preview (SERP)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Desktop Google Preview
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] space-y-1 max-w-2xl font-sans">
              <div className="flex items-center gap-2 text-xs text-[#202124]">
                <span className="w-4 h-4 rounded-full bg-[#E97835] text-white text-[9px] font-bold flex items-center justify-center">
                  A
                </span>
                <span className="truncate text-[12px] text-[#4d5156]">
                  {serpUrl}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer truncate">
                {serpTitle}
              </h4>

              <p className="text-xs sm:text-sm text-[#4d5156] line-clamp-2 leading-relaxed">
                {serpDesc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
