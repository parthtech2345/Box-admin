"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PackageCheck,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  Sparkles,
  Layers,
  ArrowRight,
  ChevronRight,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { ProductItemCMS, ProductCategoryCMS } from "@/lib/defaultProductData";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItemCMS[]>([]);
  const [categories, setCategories] = useState<ProductCategoryCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products/items"),
        fetch("/api/products/categories"),
      ]);

      const prodJson = await prodRes.json();
      const catJson = await catRes.json();

      if (prodJson.success && prodJson.data) {
        setProducts(prodJson.data);
      }
      if (catJson.success && catJson.data) {
        setCategories(catJson.data);
      }
    } catch (e) {
      console.error("Error loading products data:", e);
    } finally {
      setLoading(false);
    }
  }

  // Filter products by category and search term
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/products/items?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage({ type: "success", text: "Product deleted successfully" });
        setTimeout(() => setMessage(null), 3000);
        await fetchData();
      } else {
        setMessage({ type: "error", text: json.message || "Failed to delete" });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Error deleting product" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E97835]/15 text-[#E97835] text-[11px] font-bold uppercase tracking-wider mb-2">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Product Section CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Sub Categories & Products Management
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Manage individual products across the 6 categories, update technical specifications, images, and configure high-converting SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/categories"
            className="px-3.5 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors flex items-center gap-2"
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#E97835]" />
            <span>Manage 6 Categories</span>
          </Link>

          <Link
            href="/dashboard/products/items/new"
            className="px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4DED3] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#847B70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, category, or specifications..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835] bg-[#FAF9F5]"
            />
          </div>

          <div className="text-xs text-[#687378] font-medium">
            Showing <span className="font-bold text-[#202A2E]">{filteredProducts.length}</span> of {products.length} products
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#202A2E] text-white"
                : "bg-[#FAF7F2] text-[#687378] hover:bg-[#F5F2EB] hover:text-[#202A2E] border border-[#E4DED3]"
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            const isSelected = selectedCategory === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#E97835] text-white shadow-xs"
                    : "bg-[#FAF7F2] text-[#687378] hover:bg-[#F5F2EB] hover:text-[#202A2E] border border-[#E4DED3]"
                }`}
              >
                <span>{c.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#E4DED3] text-[#687378]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table / Grid View */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
          Loading products from database and cache...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
          No products found matching your search.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4DED3] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E4DED3] text-[11px] font-bold uppercase tracking-wider text-[#687378]">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Specifications</th>
                  <th className="py-3 px-4 text-center">SEO Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DED3]">
                {filteredProducts.map((p, idx) => {
                  const hasSEO = Boolean(
                    p.seo?.metaTitle &&
                    p.seo?.metaDescription &&
                    p.seo?.schemaMarkup
                  );

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#FAF7F2]/60 transition-colors group"
                    >
                      {/* # Number */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#847B70] text-center">
                        {(idx + 1).toString().padStart(2, "0")}
                      </td>

                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E4DED3] overflow-hidden shrink-0">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.imageAlt || p.name}
                                fill
                                className="object-cover object-center"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#A0ACB2]">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/products/items/${p.id}`}
                              className="font-heading font-bold text-xs sm:text-sm text-[#202A2E] group-hover:text-[#E97835] transition-colors"
                            >
                              {p.name}
                            </Link>
                            <div className="text-[11px] font-mono text-[#847B70] truncate max-w-xs">
                              /products/{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E4DED3] text-[#202A2E] text-[11px] font-semibold">
                          {p.categoryName || p.categoryId}
                        </span>
                      </td>

                      {/* Technical Specs Preview */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px] text-[#687378]">
                          {p.specifications?.plyRating && (
                            <div>
                              <span className="font-semibold text-[#202A2E]">Ply:</span> {p.specifications.plyRating}
                            </div>
                          )}
                          {p.specifications?.fluteType && (
                            <div>
                              <span className="font-semibold text-[#202A2E]">Flute:</span> {p.specifications.fluteType}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* SEO Status */}
                      <td className="py-3.5 px-4 text-center">
                        {hasSEO ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>100% SEO Ready</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Needs SEO</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/products/items/${p.id}`}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E97835] hover:text-white text-[#202A2E] border border-[#E4DED3] transition-colors"
                            title="Edit Product & SEO"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-red-50 hover:text-red-600 text-[#847B70] border border-[#E4DED3] transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
