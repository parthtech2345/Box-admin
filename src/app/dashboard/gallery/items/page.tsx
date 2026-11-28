"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  FolderKanban,
  ExternalLink,
  Layers,
  Search,
  ZoomIn,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_GALLERY_DATA,
  DEFAULT_GALLERY_CATEGORIES,
  GalleryShowcaseData,
  GalleryItemDetails,
} from "@/lib/defaultGalleryData";

export default function GalleryItemsPage() {
  const [data, setData] = useState<GalleryShowcaseData>(DEFAULT_GALLERY_DATA.showcase!);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter & search state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/gallery?section=showcase");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (e) {
        console.error("Failed to load gallery items:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: "showcase",
          data,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage(json.message || "Failed to save gallery items.");
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const categories = data.categories && data.categories.length > 0 ? data.categories : DEFAULT_GALLERY_CATEGORIES;

  const filteredItems = (data.items || []).filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddItem = () => {
    const newItem: GalleryItemDetails = {
      id: `item-${Date.now()}`,
      title: "New Packaging Showcase",
      image: "/Gallery/Kraft Packaging Gallery Montage.png",
      category: selectedCategory !== "All" ? selectedCategory : categories[0],
      description: "Description of the packaging product, machinery line, or industrial application.",
      keypoints: [
        "High-strength corrugated construction",
        "Custom dimension and drop-tested durability",
        "100% recyclable paperboard material",
      ],
      link: "/products",
      linkText: "Learn More",
    };

    setData({
      ...data,
      items: [newItem, ...(data.items || [])],
    });
    setActiveItemIndex(0);
  };

  const handleRemoveItem = (id: string) => {
    if (!confirm("Are you sure you want to remove this gallery showcase item?")) return;
    const next = (data.items || []).filter((item) => item.id !== id);
    setData({ ...data, items: next });
    setActiveItemIndex(null);
  };

  const updateItem = (index: number, updated: GalleryItemDetails) => {
    const next = [...(data.items || [])];
    next[index] = updated;
    setData({ ...data, items: next });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#687378]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#A65D32]" />
          <span>Loading Showcase Items...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E4DED3]">
        <div className="space-y-1">
          <Link
            href="/dashboard/gallery"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#A65D32] hover:underline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Gallery Overview</span>
          </Link>
          <h1 className="font-heading font-extrabold text-2xl text-[#202A2E]">
            Showcase Items &amp; Categories ({data.items?.length || 0})
          </h1>
          <p className="text-xs text-[#687378]">
            Manage the visual cards, category taxonomy, high-res images, and modal narrative details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddItem}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#A65D32] text-xs font-bold text-[#A65D32] hover:bg-[#FAF7F2] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Showcase Item</span>
          </button>

          <Link
            href="http://localhost:3000/gallery"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E4DED3] text-xs font-bold text-[#202A2E] hover:bg-[#FAF9F5] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#687378]" />
            <span>View Live</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#A65D32] hover:bg-[#8f4f29] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving Changes..." : "Save Items"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Showcase items saved successfully to database &amp; live cache!</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7E72]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, keyword, or machine name..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
            />
          </div>

          <span className="text-xs font-bold text-[#8C7E72] shrink-0">
            Showing {filteredItems.length} of {data.items?.length || 0} items
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "All"
                ? "bg-[#202A2E] text-white shadow-xs"
                : "bg-[#FAF9F5] border border-[#E4DED3] text-[#687378] hover:bg-[#F5F2EB]"
            }`}
          >
            All Items ({data.items?.length || 0})
          </button>
          {categories.map((cat) => {
            const count = (data.items || []).filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#A65D32] text-white shadow-xs"
                    : "bg-[#FAF9F5] border border-[#E4DED3] text-[#687378] hover:bg-[#F5F2EB]"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-[#E4DED3] text-[#202A2E]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items List & Editor */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#A65D32] flex items-center justify-center mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#202A2E]">
              No Showcase Items Found
            </h3>
            <p className="text-xs text-[#687378] max-w-sm mx-auto">
              No items matched your current category or search filter. Try resetting your search or add a new item.
            </p>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 rounded-xl bg-[#A65D32] text-white text-xs font-bold cursor-pointer"
            >
              Add Item to {selectedCategory !== "All" ? selectedCategory : "Gallery"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item, originalIdx) => {
              const actualIdx = (data.items || []).findIndex((i) => i.id === item.id);
              const isExpanded = activeItemIndex === actualIdx;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#E4DED3] rounded-2xl p-5 shadow-xs transition-all space-y-4"
                >
                  {/* Item Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]/70">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-[#FAF9F5] border border-[#E4DED3] overflow-hidden shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `http://localhost:3000${item.image.startsWith("/") ? "" : "/"}${encodeURI(item.image)}`;
                          }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#A65D32]/10 text-[#A65D32] border border-[#A65D32]/20">
                            {item.category}
                          </span>
                          <span className="text-[11px] font-mono text-[#8C7E72]">
                            #{item.id}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-[#202A2E] mt-0.5">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveItemIndex(isExpanded ? null : actualIdx)}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F5F2EB] border border-[#E4DED3] text-xs font-bold text-[#202A2E] cursor-pointer"
                      >
                        {isExpanded ? "Collapse Editor" : "Edit Details"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 rounded-lg text-[#8C7E72] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Form */}
                  {isExpanded && (
                    <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              updateItem(actualIdx, { ...item, title: e.target.value });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                            placeholder="Product or Machinery title"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                            Category Taxonomy
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) => {
                              updateItem(actualIdx, { ...item, category: e.target.value });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none bg-white cursor-pointer"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                          Short Narrative Description (Shown in Lightbox Modal)
                        </label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            updateItem(actualIdx, { ...item, description: e.target.value });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none resize-none leading-relaxed"
                          placeholder="Describe the application, engineering features, or material construction..."
                        />
                      </div>

                      {/* Keypoints list */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-[#202A2E]">
                          Modal Key Highlights (3 Bullet Points)
                        </label>
                        <div className="space-y-1.5">
                          {(item.keypoints || []).map((point, ptIdx) => (
                            <div key={ptIdx} className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#A65D32] w-5 text-center shrink-0">
                                #{ptIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const nextPts = [...(item.keypoints || [])];
                                  nextPts[ptIdx] = e.target.value;
                                  updateItem(actualIdx, { ...item, keypoints: nextPts });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                                placeholder={`Key highlight point ${ptIdx + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Link & Media Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                              Target Detail Route Link
                            </label>
                            <input
                              type="text"
                              value={item.link || ""}
                              onChange={(e) => {
                                updateItem(actualIdx, { ...item, link: e.target.value });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                              placeholder="/machinery/corrugation-machine or /products"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                              Button Label Text
                            </label>
                            <input
                              type="text"
                              value={item.linkText || ""}
                              onChange={(e) => {
                                updateItem(actualIdx, { ...item, linkText: e.target.value });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#A65D32] outline-none"
                              placeholder="Explore Machine / View Products"
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <MediaUploader
                            label="Showcase Image"
                            value={item.image}
                            onChange={(url) => {
                              updateItem(actualIdx, { ...item, image: url });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
}
