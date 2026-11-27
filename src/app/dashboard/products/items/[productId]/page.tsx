"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Code,
  Tag,
  Sliders,
  Check,
  HelpCircle,
  FileText,
  ShieldCheck,
  Calculator,
  Phone,
  ArrowUp,
  ArrowDown,
  Award,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  ProductItemCMS,
  ProductCategoryCMS,
  ProductFAQItem,
  ProductTechnicalGuide,
  DEFAULT_PRODUCTS,
  generateProductSEO,
} from "@/lib/defaultProductData";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;
  const isNew = productId === "new";

  const [categories, setCategories] = useState<ProductCategoryCMS[]>([]);
  const [product, setProduct] = useState<ProductItemCMS | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "general" | "media" | "specs" | "technical" | "faqs" | "seo"
  >("general");

  // Temporary application tag input
  const [newAppTag, setNewAppTag] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch categories for dropdown
        const catRes = await fetch("/api/products/categories");
        const catJson = await catRes.json();
        if (catJson.success && catJson.data) {
          setCategories(catJson.data);
        }

        if (isNew) {
          const firstCat = catJson.data?.[0];
          const newProduct: ProductItemCMS = {
            id: `prod-${Date.now()}`,
            name: "New Packaging Product",
            slug: "new-packaging-product",
            categoryId: firstCat?.id || "corrugated-boxes",
            categoryName: firstCat?.title || "Corrugated Boxes",
            image: "/Product/items/real-3-ply-corrugated-boxes.png",
            imageAlt: "New Packaging Product - AAVRIT PACKAGING",
            imageName: "new-packaging-product.png",
            fallbackImage: "/home/product-categories/corrugated-boxes.png",
            shortDescription:
              "Short description highlighting primary protection and usage of the packaging carton.",
            fullDescription:
              "Detailed technical and structural description of the packaging product, flute profiles, paper liners, and intended commercial dispatch applications.",
            specifications: {
              plyRating: "3-Ply (Single Wall)",
              fluteType: "B-Flute / C-Flute",
              burstingStrength: "10 – 16 kg/cm²",
              loadCapacity: "Up to 15 kg",
              customPrinting: "Up to 4-Colour Flexo Available",
              moistureResistance: "Standard / Hydrophobic sizing available",
              closureType: "Adhesive Tape / Flap Closure",
              applications: ["E-commerce", "Retail", "Industrial Logistics"],
            },
            keyFeatures: [
              "Engineered from high-burst virgin and recycled kraft board",
              "Precision creasing and slotting for quick case assembly",
              "100% recyclable, biodegradable, and sustainable",
              "High Edge Crush Resistance (ECT) for uniform warehouse stacking",
            ],
            faqs: [
              {
                question: "What products is this packaging carton best suited for?",
                answer:
                  "Designed for protective B2B dispatch, e-commerce order fulfillment, and high-impact industrial warehouse stacking.",
              },
              {
                question: "Can these boxes be custom printed with our brand logo and graphics?",
                answer:
                  "Yes, we provide high-definition 1 to 4 colour flexographic printing with custom logos, barcode labels, and fragile handling symbols.",
              },
              {
                question: "What minimum order quantity (MOQ) applies?",
                answer:
                  "MOQ varies depending on the dimensions, ply construction, and flute profile. Contact our desk for tailored quotes.",
              },
              {
                question: "Are these boxes 100% recyclable and eco-friendly?",
                answer:
                  "Yes, all our corrugated containers are manufactured from certified renewable kraft paper and starch-based adhesives, making them 100% recyclable.",
              },
              {
                question: "Do you supply customized dimensional sizing?",
                answer:
                  "Every carton is precision slot-cut to your exact Length × Width × Height specifications with ±0.5mm accuracy.",
              },
            ],
            technicalGuide: {
              recommendedPly: "3 Ply",
              plyGuideTitle: "Understanding Corrugated Box Specifications",
              plyGuideSubtitle:
                "Corrugated packaging performance depends on structural ply construction, fluting geometry, and raw paper liner grades. Explore our manufacturing capabilities below with recommended configurations highlighted.",
              recommendedFlute: "B Flute",
              flutesSubtitle:
                "Flute profiles determine the thickness, stacking strength, and cushioning performance of each corrugated box.",
              sizingGuideTitle: "Custom Box Sizes & Dimensions",
              sizingGuideSubtitle:
                "All boxes are custom manufactured to your payload requirements: Length × Width × Height",
              internalDimensionsNote:
                "When specifying dimensions, our team confirms internal cavity dimensions (for product fit) and outer dimensions (for pallet stacking efficiency).",
              moqNote:
                "Minimum order quantities (MOQ) depend on sheet size and total square meterage.",
              contactPhone: "+919876543210",
              callButtonText: "Call with this Size",
            },
            order: 1,
            seo: generateProductSEO(
              "New Packaging Product",
              "new-packaging-product",
              firstCat?.title || "Corrugated Boxes",
              "Short description highlighting primary protection and usage of the packaging carton.",
              "/Product/items/real-3-ply-corrugated-boxes.png"
            ),
          };
          setProduct(newProduct);
        } else {
          const res = await fetch(`/api/products/items?id=${productId}`);
          const json = await res.json();
          if (json.success && json.data) {
            setProduct(json.data);
          } else {
            // Fallback to local default if found
            const fallback = DEFAULT_PRODUCTS.find((p) => p.id === productId);
            if (fallback) setProduct(fallback);
          }
        }
      } catch (e: any) {
        setSaveError("Error loading product: " + e.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId, isNew]);

  async function handleSave() {
    if (!product) return;

    if (!product.name.trim()) {
      setSaveError("Product name is required.");
      return;
    }

    if (!product.slug.trim()) {
      setSaveError("Product slug is required.");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const res = await fetch("/api/products/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save product");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);

      if (isNew) {
        router.push(`/dashboard/products/items/${product.id}`);
      }
    } catch (err: any) {
      setSaveError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function handleAutoGenerateSlug() {
    if (!product) return;
    const generated = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setProduct({
      ...product,
      slug: generated,
      seo: {
        ...product.seo,
        canonicalLink: `https://aavritpackaging.com/products/${generated}`,
      },
    });
  }

  function handleCategoryChange(catId: string) {
    if (!product) return;
    const selectedCat = categories.find((c) => c.id === catId);
    setProduct({
      ...product,
      categoryId: catId,
      categoryName: selectedCat ? selectedCat.title : product.categoryName,
    });
  }

  function handleAddApplicationTag() {
    if (!product || !newAppTag.trim()) return;
    const current = product.specifications.applications || [];
    if (!current.includes(newAppTag.trim())) {
      setProduct({
        ...product,
        specifications: {
          ...product.specifications,
          applications: [...current, newAppTag.trim()],
        },
      });
    }
    setNewAppTag("");
  }

  function handleRemoveApplicationTag(tag: string) {
    if (!product) return;
    const current = product.specifications.applications || [];
    setProduct({
      ...product,
      specifications: {
        ...product.specifications,
        applications: current.filter((t) => t !== tag),
      },
    });
  }

  function handleAddFeature() {
    if (!product) return;
    setProduct({
      ...product,
      keyFeatures: [...(product.keyFeatures || []), "New product specification highlight"],
    });
  }

  function handleUpdateFeature(index: number, value: string) {
    if (!product) return;
    const current = [...(product.keyFeatures || [])];
    current[index] = value;
    setProduct({
      ...product,
      keyFeatures: current,
    });
  }

  function handleRemoveFeature(index: number) {
    if (!product) return;
    const current = [...(product.keyFeatures || [])];
    current.splice(index, 1);
    setProduct({
      ...product,
      keyFeatures: current,
    });
  }

  // FAQ Handlers
  function handleAddFaq() {
    if (!product) return;
    const newFaq: ProductFAQItem = {
      question: `What are the benefits of ${product.name}?`,
      answer:
        "Engineered for high structural endurance, optimal stacking strength, and custom brand flexo printing.",
    };
    setProduct({
      ...product,
      faqs: [...(product.faqs || []), newFaq],
    });
  }

  function handleUpdateFaq(index: number, field: "question" | "answer", value: string) {
    if (!product) return;
    const current = [...(product.faqs || [])];
    current[index] = { ...current[index], [field]: value };
    setProduct({
      ...product,
      faqs: current,
    });
  }

  function handleRemoveFaq(index: number) {
    if (!product) return;
    const current = [...(product.faqs || [])];
    current.splice(index, 1);
    setProduct({
      ...product,
      faqs: current,
    });
  }

  function handleMoveFaq(index: number, direction: "up" | "down") {
    if (!product) return;
    const current = [...(product.faqs || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    setProduct({
      ...product,
      faqs: current,
    });
  }

  // Technical Guide Handler
  function handleUpdateTechnicalGuide(field: keyof ProductTechnicalGuide, value: string) {
    if (!product) return;
    setProduct({
      ...product,
      technicalGuide: {
        ...(product.technicalGuide || {}),
        [field]: value,
      },
    });
  }

  if (loading || !product) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading product information...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <Link
            href="/dashboard/products/items"
            className="inline-flex items-center gap-1.5 text-xs text-[#687378] hover:text-[#E97835] font-semibold transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
              {isNew ? "Create New Product" : product.name}
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E97835]/15 text-[#E97835] border border-[#E97835]/25">
              {product.categoryName || "Packaging"}
            </span>
          </div>
          <p className="text-xs text-[#687378] mt-1 font-mono">
            /products/{product.slug}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#687378] bg-[#FAF9F5] border border-[#E4DED3] px-3 py-1.5 rounded-xl font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MongoDB Ready</span>
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Product, Technical Guide, FAQs, and SEO saved successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {saveError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-[#E4DED3] p-1.5 flex gap-1 overflow-x-auto shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center ${
            activeTab === "general"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
          }`}
        >
          1. General Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center ${
            activeTab === "media"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
          }`}
        >
          2. Media & Images
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center ${
            activeTab === "specs"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
          }`}
        >
          3. Specs & Highlights
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("technical")}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
            activeTab === "technical"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>4. Technical & Sizing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
            activeTab === "faqs"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>5. FAQs ({product.faqs?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
            activeTab === "seo"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:bg-[#FAF7F2] hover:text-[#202A2E]"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>6. SEO & Schema</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-[#E4DED3] p-6 shadow-xs">
        {/* TAB 1: GENERAL DETAILS */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#202A2E]">
                    URL Slug *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSlug}
                    className="text-[10px] text-[#E97835] hover:underline font-bold cursor-pointer"
                  >
                    Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={product.slug}
                  onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Parent Category *
                </label>
                <select
                  value={product.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] bg-white focus:outline-hidden focus:border-[#E97835]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={product.order || 1}
                  onChange={(e) =>
                    setProduct({ ...product, order: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Short Description (Overview Summary)
              </label>
              <textarea
                rows={2}
                value={product.shortDescription}
                onChange={(e) =>
                  setProduct({ ...product, shortDescription: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Full Description (Detailed Engineering & Use Cases)
              </label>
              <textarea
                rows={4}
                value={product.fullDescription}
                onChange={(e) =>
                  setProduct({ ...product, fullDescription: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
              />
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA & SEO IMAGES */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Product Hero Image
                  </label>
                  <MediaUploader
                    label="Upload Product Image"
                    value={product.image}
                    onChange={(url: string) => setProduct({ ...product, image: url })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Image File Path / URL
                  </label>
                  <input
                    type="text"
                    value={product.image}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Fallback Image URL
                  </label>
                  <input
                    type="text"
                    value={product.fallbackImage}
                    onChange={(e) =>
                      setProduct({ ...product, fallbackImage: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E]"
                  />
                </div>
              </div>

              {/* SEO Image Attributes */}
              <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E4DED3] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#202A2E]">
                  <ImageIcon className="w-4 h-4 text-[#E97835]" />
                  <span>Image SEO Optimization</span>
                </div>
                <p className="text-[11px] text-[#687378]">
                  Descriptive alt text and keyword-rich file naming boost image ranking in Google Images search results.
                </p>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Image Alt Text *
                  </label>
                  <input
                    type="text"
                    value={product.imageAlt || ""}
                    onChange={(e) =>
                      setProduct({ ...product, imageAlt: e.target.value })
                    }
                    placeholder="e.g. 3 Ply Corrugated Boxes - Single Wall Heavy Duty Carton"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Image File Name (for SEO slugging)
                  </label>
                  <input
                    type="text"
                    value={product.imageName || ""}
                    onChange={(e) =>
                      setProduct({ ...product, imageName: e.target.value })
                    }
                    placeholder="e.g. 3-ply-corrugated-boxes-kraft.png"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-mono text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                  />
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-[#687378] uppercase tracking-wider block mb-1">
                    Live Image Preview
                  </span>
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-white border border-[#E4DED3]">
                    <Image
                      src={product.image || "/Product/items/real-3-ply-corrugated-boxes.png"}
                      alt={product.imageAlt || product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SPECS & HIGHLIGHTS */}
        {activeTab === "specs" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Product Engineering Specifications</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Ply Rating
                  </label>
                  <input
                    type="text"
                    value={product.specifications?.plyRating || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specifications: {
                          ...product.specifications,
                          plyRating: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 3-Ply (Single Wall)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Flute Type
                  </label>
                  <input
                    type="text"
                    value={product.specifications?.fluteType || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specifications: {
                          ...product.specifications,
                          fluteType: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. B-Flute / C-Flute"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Bursting Strength
                  </label>
                  <input
                    type="text"
                    value={product.specifications?.burstingStrength || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specifications: {
                          ...product.specifications,
                          burstingStrength: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 10 – 16 kg/cm²"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Load Capacity
                  </label>
                  <input
                    type="text"
                    value={product.specifications?.loadCapacity || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specifications: {
                          ...product.specifications,
                          loadCapacity: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Up to 15 kg"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Custom Printing
                  </label>
                  <input
                    type="text"
                    value={product.specifications?.customPrinting || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specifications: {
                          ...product.specifications,
                          customPrinting: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Up to 4-Colour Flexo"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Moisture Resistance
                  </label>
                  <input
                    type="text"
                    value={product.specifications?.moistureResistance || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specifications: {
                          ...product.specifications,
                          moistureResistance: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Standard / Hydrophobic sizing"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Closure Type
                  </label>
                  <input
                    type="text"
                    value={product.specifications?.closureType || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        specifications: {
                          ...product.specifications,
                          closureType: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Adhesive Tape / Flap Closure / Interlocking Tab"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="pt-4 border-t border-[#E4DED3]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Industry Applications</span>
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {(product.specifications?.applications || []).map((app) => (
                  <span
                    key={app}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#E4DED3] text-xs font-medium text-[#202A2E]"
                  >
                    <span>{app}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveApplicationTag(app)}
                      className="text-[#687378] hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newAppTag}
                  onChange={(e) => setNewAppTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddApplicationTag();
                    }
                  }}
                  placeholder="Add application (e.g. Automotive Spares)"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                />
                <button
                  type="button"
                  onClick={handleAddApplicationTag}
                  className="px-4 py-2 rounded-xl bg-[#202A2E] text-white text-xs font-bold hover:bg-[#E97835] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Key Features Bullet List */}
            <div className="pt-4 border-t border-[#E4DED3]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Product Highlights (Bullet Points)</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-xs text-[#E97835] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Highlight</span>
                </button>
              </div>

              <div className="space-y-2">
                {(product.keyFeatures || []).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#E97835] w-6 shrink-0 text-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-[#687378] hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Remove highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TECHNICAL & SIZING GUIDE */}
        {activeTab === "technical" && (
          <div className="space-y-8">
            {/* Guide Section Headers */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E4DED3] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#202A2E]">
                <Layers className="w-4 h-4 text-[#E97835]" />
                <span>B2B Technical Guide Heading & Intro</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={
                      product.technicalGuide?.plyGuideTitle ||
                      "Understanding Corrugated Box Specifications"
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("plyGuideTitle", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Section Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={
                      product.technicalGuide?.plyGuideSubtitle ||
                      "Corrugated packaging performance depends on structural ply construction, fluting geometry, and raw paper liner grades."
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("plyGuideSubtitle", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E]"
                  />
                </div>
              </div>
            </div>

            {/* A. Corrugated Ply Construction Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>A. Corrugated Ply Construction Options</span>
                  </h3>
                  <p className="text-[11px] text-[#687378]">
                    Select which Ply configuration is marked as <strong>Recommended</strong> for {product.name}:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#202A2E]">Recommended Ply:</span>
                  <select
                    value={product.technicalGuide?.recommendedPly || "5 Ply"}
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("recommendedPly", e.target.value)
                    }
                    className="px-3 py-1.5 rounded-xl border border-[#E97835] text-xs font-bold bg-[#E97835]/10 text-[#E97835] focus:outline-hidden"
                  >
                    <option value="3 Ply">3 Ply (Single Wall)</option>
                    <option value="5 Ply">5 Ply (Double Wall)</option>
                    <option value="7 Ply">7 Ply (Triple Wall)</option>
                    <option value="9 Ply">9 Ply (Ultra Heavy)</option>
                  </select>
                </div>
              </div>

              {/* 4 Ply Cards Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 3 Ply */}
                <div
                  onClick={() => handleUpdateTechnicalGuide("recommendedPly", "3 Ply")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    (product.technicalGuide?.recommendedPly || "5 Ply") === "3 Ply"
                      ? "border-2 border-[#E97835] bg-white shadow-xs"
                      : "border-[#E4DED3] bg-[#FAF7F2] hover:border-[#D1B48C]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A65D32]/10 text-[#A65D32]">
                      Single Wall
                    </span>
                    {(product.technicalGuide?.recommendedPly || "5 Ply") === "3 Ply" && (
                      <span className="text-[10px] font-bold text-white bg-[#E97835] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" />
                        <span>Recommended</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#202A2E] mb-1">3 Ply Construction</h4>
                  <p className="text-[11px] text-[#62574D] leading-snug mb-2">
                    1 fluted medium sandwiched between 2 kraft liners. Ideal for lightweight goods up to 15 kg.
                  </p>
                  <span className="text-[10px] font-semibold text-[#8C7E72] block">Payload: Lightweight / Standard</span>
                </div>

                {/* 5 Ply */}
                <div
                  onClick={() => handleUpdateTechnicalGuide("recommendedPly", "5 Ply")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    (product.technicalGuide?.recommendedPly || "5 Ply") === "5 Ply"
                      ? "border-2 border-[#E97835] bg-white shadow-xs"
                      : "border-[#E4DED3] bg-[#FAF7F2] hover:border-[#D1B48C]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A65D32]/10 text-[#A65D32]">
                      Double Wall
                    </span>
                    {(product.technicalGuide?.recommendedPly || "5 Ply") === "5 Ply" && (
                      <span className="text-[10px] font-bold text-white bg-[#E97835] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" />
                        <span>Recommended</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#202A2E] mb-1">5 Ply Construction</h4>
                  <p className="text-[11px] text-[#62574D] leading-snug mb-2">
                    2 fluted mediums and 3 kraft liners. Engineered for appliances and transit up to 45 kg.
                  </p>
                  <span className="text-[10px] font-semibold text-[#8C7E72] block">Payload: Medium to Heavy Industrial</span>
                </div>

                {/* 7 Ply */}
                <div
                  onClick={() => handleUpdateTechnicalGuide("recommendedPly", "7 Ply")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    (product.technicalGuide?.recommendedPly || "5 Ply") === "7 Ply"
                      ? "border-2 border-[#E97835] bg-white shadow-xs"
                      : "border-[#E4DED3] bg-[#FAF7F2] hover:border-[#D1B48C]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A65D32]/10 text-[#A65D32]">
                      Triple Wall
                    </span>
                    {(product.technicalGuide?.recommendedPly || "5 Ply") === "7 Ply" && (
                      <span className="text-[10px] font-bold text-white bg-[#E97835] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" />
                        <span>Recommended</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#202A2E] mb-1">7 Ply Construction</h4>
                  <p className="text-[11px] text-[#62574D] leading-snug mb-2">
                    3 fluted mediums and 4 kraft liners. Industrial crate replacement for export machinery parts.
                  </p>
                  <span className="text-[10px] font-semibold text-[#8C7E72] block">Payload: Heavy Duty & Ocean Export</span>
                </div>

                {/* 9 Ply */}
                <div
                  onClick={() => handleUpdateTechnicalGuide("recommendedPly", "9 Ply")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    (product.technicalGuide?.recommendedPly || "5 Ply") === "9 Ply"
                      ? "border-2 border-[#E97835] bg-white shadow-xs"
                      : "border-[#E4DED3] bg-[#FAF7F2] hover:border-[#D1B48C]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A65D32]/10 text-[#A65D32]">
                      Ultra Heavy
                    </span>
                    {(product.technicalGuide?.recommendedPly || "5 Ply") === "9 Ply" && (
                      <span className="text-[10px] font-bold text-white bg-[#E97835] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" />
                        <span>Recommended</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#202A2E] mb-1">9 Ply Construction</h4>
                  <p className="text-[11px] text-[#62574D] leading-snug mb-2">
                    Configurable multi-wall construction for specialized bulk gaylord pallets and oversized equipment.
                  </p>
                  <span className="text-[10px] font-semibold text-[#8C7E72] block">Payload: Custom Heavy Machinery</span>
                </div>
              </div>
            </div>

            {/* B. Recommended Flute Profiles */}
            <div className="pt-5 border-t border-[#E4DED3]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>B. Recommended Flute Profiles for this Product</span>
                  </h3>
                  <p className="text-[11px] text-[#687378]">
                    Select which flute profile is highlighted as <strong>Recommended</strong> for this product:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#202A2E]">Recommended Flute:</span>
                  <select
                    value={product.technicalGuide?.recommendedFlute || "B Flute"}
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("recommendedFlute", e.target.value)
                    }
                    className="px-3 py-1.5 rounded-xl border border-[#E97835] text-xs font-bold bg-[#E97835]/10 text-[#E97835] focus:outline-hidden"
                  >
                    <option value="B Flute">B Flute (2.5 – 3.0 mm)</option>
                    <option value="C Flute">C Flute (3.5 – 4.0 mm)</option>
                    <option value="E Flute">E Flute (1.2 – 1.6 mm)</option>
                    <option value="F Flute">F Flute (0.8 – 1.0 mm)</option>
                    <option value="BC Flute">BC Flute (6.0 – 7.0 mm, Double Wall)</option>
                    <option value="EB Flute">EB Flute (4.0 – 4.5 mm, Double Wall Fine)</option>
                    <option value="AB Flute">AB Flute (7.0 – 8.0 mm, Double Wall Heavy)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: "B Flute", profile: "2.5 mm – 3.0 mm", desc: "Dense spacing offering high crush resistance & flat flexo surface.", best: "Canned goods, eCommerce mailers, retail boxes." },
                  { name: "C Flute", profile: "3.5 mm – 4.0 mm", desc: "Most versatile shipping flute balancing crush strength & stacking.", best: "Shipping master cartons, general FMCG cargo." },
                  { name: "E Flute", profile: "1.2 mm – 1.6 mm", desc: "Micro-flute with ultra-flat print surface & clean die-cut folds.", best: "Cosmetic cartons, pizza boxes, luxury DTC mailers." },
                  { name: "F Flute", profile: "0.8 mm – 1.0 mm", desc: "Extra-fine micro-flute replacing solid paperboard with rigid corrugated.", best: "Fast-food containers, bakery packs, retail luxury." },
                ].map((flute) => {
                  const isRec = (product.technicalGuide?.recommendedFlute || "B Flute") === flute.name;
                  return (
                    <div
                      key={flute.name}
                      onClick={() => handleUpdateTechnicalGuide("recommendedFlute", flute.name)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isRec
                          ? "border-2 border-[#E97835] bg-white shadow-xs"
                          : "border-[#E4DED3] bg-[#FAF7F2] hover:border-[#D1B48C]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-heading font-bold text-xs text-[#202A2E]">{flute.name}</span>
                        {isRec && (
                          <span className="text-[9px] font-bold text-white bg-[#E97835] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Recommended</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#A65D32] font-semibold block mb-1">{flute.profile}</span>
                      <p className="text-[11px] text-[#62574D] leading-snug mb-1.5">{flute.desc}</p>
                      <span className="text-[10px] text-[#8C7E72] block border-t border-[#E4DED3]/60 pt-1">
                        <strong>Best for:</strong> {flute.best}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* C. Paper & Board Quality Parameters Display Reference */}
            <div className="pt-5 border-t border-[#E4DED3]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>C. Paper & Board Quality Parameters (Frontend Reference)</span>
              </h3>
              <p className="text-[11px] text-[#687378] mb-3">
                The product detail page automatically renders both Liner & Medium Paper Grades (Virgin Kraft, Recycled Kraft, Testliner, White Top) and Standard Quality Testing Parameters (GSM, BF, Burst Strength, ECT, Cobb Value, BCT).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { abbr: "GSM", name: "Grams per Sq. Meter" },
                  { abbr: "BF", name: "Burst Factor" },
                  { abbr: "Burst", name: "Bursting Pressure" },
                  { abbr: "ECT", name: "Edge Crush Test" },
                  { abbr: "Cobb", name: "Water Absorption" },
                  { abbr: "BCT", name: "Box Compression Test" },
                ].map((item) => (
                  <div key={item.abbr} className="p-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] text-center">
                    <span className="text-xs font-bold text-[#E97835] block">{item.abbr}</span>
                    <span className="text-[10px] text-[#687378] block truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* D. Tailored Sizing Guide & Inquiry Settings */}
            <div className="pt-5 border-t border-[#E4DED3]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] mb-3 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                <span>D. Tailored Sizing Guide & Dimension Calculator Content</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Sizing Guide Title
                  </label>
                  <input
                    type="text"
                    value={
                      product.technicalGuide?.sizingGuideTitle ||
                      "Custom Box Sizes & Dimensions"
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("sizingGuideTitle", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Sizing Guide Subtitle
                  </label>
                  <input
                    type="text"
                    value={
                      product.technicalGuide?.sizingGuideSubtitle ||
                      "All boxes are custom manufactured to your payload requirements: Length × Width × Height"
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("sizingGuideSubtitle", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Internal vs External Dimensions Note
                  </label>
                  <textarea
                    rows={2}
                    value={
                      product.technicalGuide?.internalDimensionsNote ||
                      "When specifying dimensions, our team confirms internal cavity dimensions (for product fit) and outer dimensions (for pallet stacking efficiency)."
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("internalDimensionsNote", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Minimum Order Quantity (MOQ) Note
                  </label>
                  <textarea
                    rows={2}
                    value={
                      product.technicalGuide?.moqNote ||
                      "Minimum order quantities (MOQ) depend on sheet size and total square meterage."
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("moqNote", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#E97835]" />
                    <span>Inquiry Contact Phone</span>
                  </label>
                  <input
                    type="text"
                    value={
                      product.technicalGuide?.contactPhone || "+919876543210"
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("contactPhone", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1">
                    Calculator Action Button Label
                  </label>
                  <input
                    type="text"
                    value={
                      product.technicalGuide?.callButtonText || "Call with this Size"
                    }
                    onChange={(e) =>
                      handleUpdateTechnicalGuide("callButtonText", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRODUCT FAQS */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#E97835] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Product-Specific FAQs ({product.faqs?.length || 0} Questions)</span>
                </h3>
                <p className="text-[11px] text-[#687378]">
                  These tailored questions & answers appear in the interactive accordion on the product detail page and are indexed for Google FAQ Schema.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {(!product.faqs || product.faqs.length === 0) ? (
              <div className="p-8 text-center bg-[#FAF9F5] rounded-xl border border-[#E4DED3]">
                <HelpCircle className="w-8 h-8 text-[#687378] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#687378] mb-3">No custom FAQs added for this product yet.</p>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-4 py-2 rounded-xl bg-[#202A2E] text-white text-xs font-bold hover:bg-[#E97835] transition-colors"
                >
                  Create First FAQ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {product.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF9F5] border border-[#E4DED3] rounded-2xl p-4 sm:p-5 space-y-3 transition-all hover:border-[#D1B48C]"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E4DED3]/60">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E97835] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#202A2E]">
                          FAQ Item #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveFaq(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 text-[#687378] hover:text-[#202A2E] disabled:opacity-30 rounded-lg hover:bg-white cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFaq(idx, "down")}
                          disabled={idx === (product.faqs?.length || 0) - 1}
                          className="p-1.5 text-[#687378] hover:text-[#202A2E] disabled:opacity-30 rounded-lg hover:bg-white cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-1"
                          title="Delete this FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] uppercase mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                        placeholder="Enter the question..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] uppercase mb-1">
                        Answer (Detailed Response)
                      </label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                        placeholder="Enter the technical explanation or customer guidance..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E] leading-relaxed focus:outline-hidden focus:border-[#E97835]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SEO & SCHEMA */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            {/* SERP Google Preview */}
            <div className="bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl border border-[#E4DED3] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#687378] block mb-1">
                Google Search Result Preview
              </span>
              <div className="text-[11px] text-[#202124] flex items-center gap-1 font-mono">
                <span>https://aavritpackaging.com</span>
                <span>› products › {product.slug}</span>
              </div>
              <div className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer truncate">
                {product.seo?.metaTitle || `${product.name} | AAVRIT PACKAGING`}
              </div>
              <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {product.seo?.metaDescription || product.shortDescription}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Meta Title *
                </label>
                <input
                  type="text"
                  value={product.seo?.metaTitle || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      seo: { ...product.seo, metaTitle: e.target.value },
                    })
                  }
                  placeholder="e.g. 3 Ply Corrugated Boxes Manufacturer | AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                />
                <span className="text-[10px] text-[#687378] mt-1 block">
                  Recommended: 50–60 characters (Current: {(product.seo?.metaTitle || "").length})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Meta Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={product.seo?.metaKeywords || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      seo: { ...product.seo, metaKeywords: e.target.value },
                    })
                  }
                  placeholder="3 ply corrugated box, shipping carton, kraft boxes India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Meta Description *
              </label>
              <textarea
                rows={3}
                value={product.seo?.metaDescription || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    seo: { ...product.seo, metaDescription: e.target.value },
                  })
                }
                placeholder="High-grade 3 Ply single wall corrugated shipping boxes engineered for industrial packaging, lightweight dispatch, and e-commerce logistics."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
              />
              <span className="text-[10px] text-[#687378] mt-1 block">
                Recommended: 150–160 characters (Current: {(product.seo?.metaDescription || "").length})
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                Canonical Link
              </label>
              <input
                type="url"
                value={product.seo?.canonicalLink || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    seo: { ...product.seo, canonicalLink: e.target.value },
                  })
                }
                placeholder="https://aavritpackaging.com/products/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-mono text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#202A2E] flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Schema.org Structured Data (JSON-LD Product Schema)</span>
                </label>
                <span className="text-[10px] font-mono text-[#E97835]">@type: Product</span>
              </div>
              <textarea
                rows={6}
                value={product.seo?.schemaMarkup || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    seo: { ...product.seo, schemaMarkup: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] bg-[#FAF9F5] text-[11px] font-mono text-[#202A2E] focus:outline-hidden focus:border-[#E97835]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E4DED3]">
        <Link
          href="/dashboard/products/items"
          className="px-4 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-semibold text-[#687378] hover:bg-[#F5F2EB] transition-colors"
        >
          Cancel
        </Link>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Product...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
