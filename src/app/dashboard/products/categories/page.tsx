"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Globe,
  Sparkles,
  Layers,
  ArrowRight,
  Code,
  Image as ImageIcon,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import { ProductCategoryCMS } from "@/lib/defaultProductData";

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategoryCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Active category being edited in modal/panel
  const [editingCategory, setEditingCategory] = useState<ProductCategoryCMS | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "media" | "seo">("general");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/products/categories");
      const json = await res.json();
      if (json.success && json.data) {
        setCategories(json.data);
      }
    } catch (e) {
      console.error("Error loading categories:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/products/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await fetchCategories();
        setEditingCategory(null);
      } else {
        setSaveError(json.message || "Failed to save category");
      }
    } catch (err: any) {
      setSaveError(err.message || "Error saving category");
    } finally {
      setSaving(false);
    }
  }

  function handleCreateNew() {
    const newCat: ProductCategoryCMS = {
      id: `category-${Date.now()}`,
      title: "New Product Category",
      slug: "new-product-category",
      image: "/home/product-categories/corrugated-boxes.png",
      imageAlt: "New Product Category - AAVRIT PACKAGING",
      imageName: "new-product-category.png",
      description: "Description of the new product category.",
      itemCount: 0,
      order: categories.length + 1,
      seo: {
        metaTitle: "New Product Category Manufacturer | Aavrit Packaging",
        metaDescription: "Description of new product category by Aavrit Packaging.",
        metaKeywords: "corrugated packaging, Aavrit Packaging",
        canonicalLink: "https://aavritpackaging.com/products",
        schemaMarkup: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "New Product Category",
          "provider": {
            "@type": "Organization",
            "name": "Aavrit Packaging",
            "url": "https://aavritpackaging.com"
          }
        }, null, 2),
      },
    };
    setEditingCategory(newCat);
    setActiveTab("general");
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E97835]/15 text-[#E97835] text-[11px] font-bold uppercase tracking-wider mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Product Section CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Product Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage the 6 main product categories, catalog descriptions, showcase images, and search engine optimization (SEO) metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/items"
            className="px-3.5 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors flex items-center gap-2"
          >
            <span>View Sub-Categories</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E97835]" />
          </Link>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Category changes have been successfully saved to database and live cache!</span>
        </div>
      )}

      {/* Error Notification */}
      {saveError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
          Loading product categories from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#E4DED3] hover:border-[#E97835]/60 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              {/* Category Image Header */}
              <div className="relative aspect-[16/10] bg-[#FAF7F2] border-b border-[#E4DED3] overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.imageAlt || cat.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#A0ACB2]">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#202A2E]/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                    0{idx + 1}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-[#E97835] text-white text-[10px] font-bold">
                    {cat.itemCount || 5} Products
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-[#202A2E] group-hover:text-[#E97835] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] font-mono text-[#847B70] mt-0.5">
                    /products?category={cat.slug}
                  </p>
                  <p className="text-xs text-[#687378] mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-[#E4DED3] flex items-center justify-end text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(cat);
                      setActiveTab("general");
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#E97835] hover:text-white text-[#202A2E] border border-[#E4DED3] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Category</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E4DED3] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E4DED3] flex items-center justify-between bg-[#FAF9F5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#202A2E]">
                    Edit Category: {editingCategory.title}
                  </h3>
                  <p className="text-[11px] text-[#687378]">
                    Configure category details, display image, and SEO search snippets.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="w-8 h-8 rounded-lg bg-white border border-[#E4DED3] text-[#687378] hover:text-red-600 flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Tab Controls */}
            <div className="px-5 pt-3 border-b border-[#E4DED3] bg-white flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "general"
                    ? "border-[#E97835] text-[#E97835]"
                    : "border-transparent text-[#687378] hover:text-[#202A2E]"
                }`}
              >
                1. General Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "media"
                    ? "border-[#E97835] text-[#E97835]"
                    : "border-transparent text-[#687378] hover:text-[#202A2E]"
                }`}
              >
                2. Media & SEO Image
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "seo"
                    ? "border-[#E97835] text-[#E97835]"
                    : "border-transparent text-[#687378] hover:text-[#202A2E]"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3. SEO & Schema</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Category Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCategory.title}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCategory.slug}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            slug: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-mono font-semibold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Category Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingCategory.description}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingCategory.order || 1}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            order: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Item Count Badge
                      </label>
                      <input
                        type="number"
                        value={editingCategory.itemCount || 5}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            itemCount: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-4">
                  <MediaUploader
                    label="Category Showcase Image"
                    value={editingCategory.image}
                    onChange={(url) =>
                      setEditingCategory({
                        ...editingCategory,
                        image: url,
                      })
                    }
                    helperText="Upload a high-resolution JPG/PNG image illustrating this packaging category."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        SEO Image Alt Text *
                      </label>
                      <input
                        type="text"
                        value={editingCategory.imageAlt || ""}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            imageAlt: e.target.value,
                          })
                        }
                        placeholder="e.g. Standard & Heavy Duty Corrugated Boxes - AAVRIT PACKAGING"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                      />
                      <p className="text-[10px] text-[#687378] mt-1">
                        Descriptive text used by search engine crawlers and screen readers.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        SEO Image File Name *
                      </label>
                      <input
                        type="text"
                        value={editingCategory.imageName || ""}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            imageName: e.target.value,
                          })
                        }
                        placeholder="e.g. corrugated-boxes.png"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-mono text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                      />
                      <p className="text-[10px] text-[#687378] mt-1">
                        Keyword-friendly file name for image search indexing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-4">
                  {/* Google Preview Snippet */}
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E4DED3]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#687378] mb-2 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#E97835]" />
                      <span>Google Search Snippet Preview</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-[#1a0dab] truncate">
                        {editingCategory.seo?.canonicalLink || `https://aavritpackaging.com/products?category=${editingCategory.slug}`}
                      </div>
                      <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer">
                        {editingCategory.seo?.metaTitle || `${editingCategory.title} | Aavrit Packaging`}
                      </div>
                      <div className="text-xs text-[#4d5156] line-clamp-2">
                        {editingCategory.seo?.metaDescription || editingCategory.description}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#202A2E]">
                        SEO Meta Title
                      </label>
                      <span className="text-[10px] text-[#687378]">
                        {(editingCategory.seo?.metaTitle || "").length} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editingCategory.seo?.metaTitle || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          seo: { ...editingCategory.seo, metaTitle: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#202A2E]">
                        SEO Meta Description
                      </label>
                      <span className="text-[10px] text-[#687378]">
                        {(editingCategory.seo?.metaDescription || "").length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editingCategory.seo?.metaDescription || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          seo: { ...editingCategory.seo, metaDescription: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      SEO Meta Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingCategory.seo?.metaKeywords || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          seo: { ...editingCategory.seo, metaKeywords: e.target.value },
                        })
                      }
                      placeholder="e.g. corrugated boxes, industrial boxes, Aavrit Packaging"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Canonical Link URL
                    </label>
                    <input
                      type="url"
                      value={editingCategory.seo?.canonicalLink || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          seo: { ...editingCategory.seo, canonicalLink: e.target.value },
                        })
                      }
                      placeholder="https://aavritpackaging.com/products?category=..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-mono text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5 flex items-center justify-between">
                      <span>Schema Markup (JSON-LD Structured Data)</span>
                      <span className="text-[10px] font-mono text-[#E97835]">@type: CollectionPage</span>
                    </label>
                    <textarea
                      rows={5}
                      value={editingCategory.seo?.schemaMarkup || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          seo: { ...editingCategory.seo, schemaMarkup: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] text-[11px] font-mono text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E4DED3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#687378] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Category...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
