"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Search,
  BookOpen,
  Calendar,
  Clock,
  User,
  Star,
  ChevronRight,
  ArrowLeft,
  Sliders,
  Layers,
  HelpCircle,
  Globe,
  FileText,
  Table as TableIcon,
  ListPlus,
  Check,
  Eye,
  Link2,
  MessageSquare,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_BLOGS_DATA,
  NEW_BLOG_TEMPLATE,
  BLOG_CATEGORIES,
  BlogPost,
  BlogContentSection,
  BlogKeyTakeaway,
  BlogFAQ,
} from "@/lib/defaultBlogData";

export default function BlogArticlesEditorPage() {
  const [articles, setArticles] = useState<BlogPost[]>(DEFAULT_BLOGS_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);

  // Editing state
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<
    "basic" | "sections" | "takeaways" | "related" | "seo"
  >("basic");

  useEffect(() => {
    let isMounted = true;
    async function loadArticles() {
      try {
        setLoading(true);
        const res = await fetch("/api/blogs?section=articles");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setArticles(json.data);
        }
      } catch (err: any) {
        console.error("Failed to load articles:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveArticle = async () => {
    if (!editingBlog) return;
    if (!editingBlog.title.trim()) {
      setToast({ type: "error", message: "Article title is required." });
      return;
    }
    if (!editingBlog.slug.trim()) {
      setToast({ type: "error", message: "Article slug is required." });
      return;
    }

    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "article", data: editingBlog }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: `Article "${editingBlog.title}" saved successfully!` });
        // Update local list
        setArticles((prev) => {
          const index = prev.findIndex((a) => a.slug === editingBlog.slug);
          if (index >= 0) {
            const next = [...prev];
            next[index] = editingBlog;
            return next;
          }
          return [editingBlog, ...prev];
        });
        setEditingBlog(null);
        setIsCreating(false);
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save article");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save article" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
        setToast({ type: "success", message: `Article "${title}" deleted successfully.` });
        if (editingBlog?.slug === slug) {
          setEditingBlog(null);
          setIsCreating(false);
        }
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to delete article");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to delete article" });
    }
  };

  const toggleFeatured = async (blog: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...blog, featured: !blog.featured };
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "article", data: updated }),
      });
      const json = await res.json();
      if (json.success) {
        setArticles((prev) => prev.map((a) => (a.slug === blog.slug ? updated : a)));
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  const startCreate = () => {
    const newBlog: BlogPost = {
      ...NEW_BLOG_TEMPLATE,
      id: `blog-${Date.now().toString().slice(-4)}`,
      slug: `new-packaging-guide-${Date.now().toString().slice(-4)}`,
    };
    setEditingBlog(newBlog);
    setIsCreating(true);
    setActiveEditorTab("basic");
  };

  const startEdit = (blog: BlogPost) => {
    setEditingBlog(JSON.parse(JSON.stringify(blog))); // Deep clone
    setIsCreating(false);
    setActiveEditorTab("basic");
  };

  // Section Helpers
  const addSection = () => {
    if (!editingBlog) return;
    const newSec: BlogContentSection = {
      id: `section-${Date.now().toString().slice(-4)}`,
      heading: `${editingBlog.sections.length + 1}. New Heading`,
      content: ["Write the paragraph content here."],
    };
    setEditingBlog({
      ...editingBlog,
      sections: [...editingBlog.sections, newSec],
    });
  };

  const removeSection = (idx: number) => {
    if (!editingBlog) return;
    const next = [...editingBlog.sections];
    next.splice(idx, 1);
    setEditingBlog({ ...editingBlog, sections: next });
  };

  const updateSection = (idx: number, patch: Partial<BlogContentSection>) => {
    if (!editingBlog) return;
    const next = [...editingBlog.sections];
    next[idx] = { ...next[idx], ...patch };
    setEditingBlog({ ...editingBlog, sections: next });
  };

  // Bullet Points in Section
  const addBulletPoint = (secIdx: number) => {
    if (!editingBlog) return;
    const sec = editingBlog.sections[secIdx];
    const currentPoints = sec.bulletPoints || [];
    const updatedPoints = [
      ...currentPoints,
      { title: "Point Title:", text: "Detailed explanation of this point." },
    ];
    updateSection(secIdx, { bulletPoints: updatedPoints });
  };

  const removeBulletPoint = (secIdx: number, bpIdx: number) => {
    if (!editingBlog) return;
    const sec = editingBlog.sections[secIdx];
    if (!sec.bulletPoints) return;
    const updatedPoints = [...sec.bulletPoints];
    updatedPoints.splice(bpIdx, 1);
    updateSection(secIdx, {
      bulletPoints: updatedPoints.length > 0 ? updatedPoints : undefined,
    });
  };

  const updateBulletPoint = (
    secIdx: number,
    bpIdx: number,
    field: "title" | "text",
    value: string
  ) => {
    if (!editingBlog) return;
    const sec = editingBlog.sections[secIdx];
    if (!sec.bulletPoints) return;
    const updatedPoints = [...sec.bulletPoints];
    updatedPoints[bpIdx] = { ...updatedPoints[bpIdx], [field]: value };
    updateSection(secIdx, { bulletPoints: updatedPoints });
  };

  // Tables in Section
  const addTable = (secIdx: number) => {
    if (!editingBlog) return;
    updateSection(secIdx, {
      table: {
        headers: ["Parameter / Feature", "Specification / Rating", "Application Standard"],
        rows: [
          ["Single Wall 3-Ply", "ECT 32 / Burst Test 200", "Light eCommerce Shipments"],
          ["Double Wall 5-Ply", "ECT 44 / Burst Test 275", "Industrial & Heavy Goods"],
        ],
      },
    });
  };

  const removeTable = (secIdx: number) => {
    if (!editingBlog) return;
    updateSection(secIdx, { table: undefined });
  };

  const addTableColumn = (secIdx: number) => {
    if (!editingBlog) return;
    const table = editingBlog.sections[secIdx].table;
    if (!table) return;
    const newHeaders = [...table.headers, `Column ${table.headers.length + 1}`];
    const newRows = table.rows.map((r) => [...r, "Data"]);
    updateSection(secIdx, { table: { headers: newHeaders, rows: newRows } });
  };

  const removeTableColumn = (secIdx: number, colIdx: number) => {
    if (!editingBlog) return;
    const table = editingBlog.sections[secIdx].table;
    if (!table || table.headers.length <= 1) return;
    const newHeaders = [...table.headers];
    newHeaders.splice(colIdx, 1);
    const newRows = table.rows.map((r) => {
      const copy = [...r];
      copy.splice(colIdx, 1);
      return copy;
    });
    updateSection(secIdx, { table: { headers: newHeaders, rows: newRows } });
  };

  const addTableRow = (secIdx: number) => {
    if (!editingBlog) return;
    const table = editingBlog.sections[secIdx].table;
    if (!table) return;
    const emptyRow = new Array(table.headers.length).fill("Value");
    updateSection(secIdx, { table: { ...table, rows: [...table.rows, emptyRow] } });
  };

  const removeTableRow = (secIdx: number, rowIdx: number) => {
    if (!editingBlog) return;
    const table = editingBlog.sections[secIdx].table;
    if (!table || table.rows.length <= 1) return;
    const newRows = [...table.rows];
    newRows.splice(rowIdx, 1);
    updateSection(secIdx, { table: { ...table, rows: newRows } });
  };

  const updateTableCell = (
    secIdx: number,
    rowIdx: number,
    colIdx: number,
    value: string
  ) => {
    if (!editingBlog) return;
    const table = editingBlog.sections[secIdx].table;
    if (!table) return;
    const newRows = table.rows.map((row, rI) => {
      if (rI !== rowIdx) return row;
      const copy = [...row];
      copy[colIdx] = value;
      return copy;
    });
    updateSection(secIdx, { table: { ...table, rows: newRows } });
  };

  const updateTableHeader = (secIdx: number, colIdx: number, value: string) => {
    if (!editingBlog) return;
    const table = editingBlog.sections[secIdx].table;
    if (!table) return;
    const newHeaders = [...table.headers];
    newHeaders[colIdx] = value;
    updateSection(secIdx, { table: { ...table, headers: newHeaders } });
  };

  // Key Takeaways Helpers
  const addTakeaway = () => {
    if (!editingBlog) return;
    setEditingBlog({
      ...editingBlog,
      keyTakeaways: [
        ...editingBlog.keyTakeaways,
        { point: "Key Point", description: "Summary description of this takeaway." },
      ],
    });
  };

  const removeTakeaway = (idx: number) => {
    if (!editingBlog) return;
    const next = [...editingBlog.keyTakeaways];
    next.splice(idx, 1);
    setEditingBlog({ ...editingBlog, keyTakeaways: next });
  };

  const updateTakeaway = (idx: number, patch: Partial<BlogKeyTakeaway>) => {
    if (!editingBlog) return;
    const next = [...editingBlog.keyTakeaways];
    next[idx] = { ...next[idx], ...patch };
    setEditingBlog({ ...editingBlog, keyTakeaways: next });
  };

  // FAQ Helpers
  const addFAQ = () => {
    if (!editingBlog) return;
    setEditingBlog({
      ...editingBlog,
      faqs: [
        ...editingBlog.faqs,
        { question: "Question here?", answer: "Answer explaining the technical concept." },
      ],
    });
  };

  const removeFAQ = (idx: number) => {
    if (!editingBlog) return;
    const next = [...editingBlog.faqs];
    next.splice(idx, 1);
    setEditingBlog({ ...editingBlog, faqs: next });
  };

  const updateFAQ = (idx: number, patch: Partial<BlogFAQ>) => {
    if (!editingBlog) return;
    const next = [...editingBlog.faqs];
    next[idx] = { ...next[idx], ...patch };
    setEditingBlog({ ...editingBlog, faqs: next });
  };

  // Related Articles Toggle
  const toggleRelatedBlog = (slug: string) => {
    if (!editingBlog) return;
    const current = editingBlog.relatedBlogSlugs || [];
    const exists = current.includes(slug);
    const updated = exists ? current.filter((s) => s !== slug) : [...current, slug];
    setEditingBlog({ ...editingBlog, relatedBlogSlugs: updated });
  };

  // Filtered Articles
  const filteredArticles = articles.filter((art) => {
    if (filterFeaturedOnly && !art.featured) return false;
    const matchesCategory =
      selectedCategory === "All Articles" || art.category === selectedCategory;
    if (!searchTerm.trim()) return matchesCategory;

    const q = searchTerm.toLowerCase().trim();
    return (
      matchesCategory &&
      (art.title.toLowerCase().includes(q) ||
        art.slug.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q))
    );
  });

  // =========================================================================
  // VIEW 1: ARTICLE MODAL EDITOR
  // =========================================================================
  if (editingBlog) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-24">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
          <div>
            <button
              type="button"
              onClick={() => {
                setEditingBlog(null);
                setIsCreating(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E97835] hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Articles</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#687378] font-semibold">Blogs</span>
              <span className="text-[#A0ACB2] text-xs">/</span>
              <span className="text-xs font-bold text-[#E97835]">
                {isCreating ? "New Article" : "Edit Article"}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#202A2E] mt-1 line-clamp-1">
              {editingBlog.title || "Untitled Article"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setEditingBlog({
                  ...editingBlog,
                  featured: !editingBlog.featured,
                })
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border ${
                editingBlog.featured
                  ? "bg-[#FFF6F0] text-[#E97835] border-[#E97835] shadow-2xs"
                  : "bg-white text-[#687378] border-[#E4DED3] hover:text-[#202A2E] hover:border-[#8C989E]"
              }`}
              title="Toggle featured status for this blog"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  editingBlog.featured ? "fill-[#E97835] text-[#E97835]" : "text-[#8C989E]"
                }`}
              />
              <span>{editingBlog.featured ? "Featured Blog (Active)" : "Mark as Featured"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingBlog(null);
                setIsCreating(false);
              }}
              className="px-4 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs font-bold text-[#687378] hover:bg-[#FAF9F5] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveArticle}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Article</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-medium ${
              toast.type === "success"
                ? "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]"
                : "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveEditorTab("basic")}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeEditorTab === "basic"
                ? "bg-white text-[#E97835] shadow-xs"
                : "text-[#687378] hover:text-[#202A2E]"
            }`}
          >
            1. Basic Information
          </button>
          <button
            type="button"
            onClick={() => setActiveEditorTab("sections")}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeEditorTab === "sections"
                ? "bg-white text-[#E97835] shadow-xs"
                : "text-[#687378] hover:text-[#202A2E]"
            }`}
          >
            2. Editorial Sections ({editingBlog.sections.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveEditorTab("takeaways")}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeEditorTab === "takeaways"
                ? "bg-white text-[#E97835] shadow-xs"
                : "text-[#687378] hover:text-[#202A2E]"
            }`}
          >
            3. Takeaways &amp; FAQs
          </button>
          <button
            type="button"
            onClick={() => setActiveEditorTab("related")}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeEditorTab === "related"
                ? "bg-white text-[#E97835] shadow-xs"
                : "text-[#687378] hover:text-[#202A2E]"
            }`}
          >
            4. Related Articles ({editingBlog.relatedBlogSlugs?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveEditorTab("seo")}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeEditorTab === "seo"
                ? "bg-white text-[#E97835] shadow-xs"
                : "text-[#687378] hover:text-[#202A2E]"
            }`}
          >
            5. SEO Optimization
          </button>
        </div>

        {/* TAB 1: BASIC INFORMATION */}
        {activeEditorTab === "basic" && (
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-5">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Article Meta &amp; Publishing Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Article Title
                </label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  placeholder="e.g. Understanding Corrugated Boxes: Types, Structure and Uses"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  URL Slug
                </label>
                <div className="flex items-center rounded-xl border border-[#E4DED3] px-3 py-1.5 bg-[#FAF7F2]">
                  <span className="text-[11px] text-[#8C989E]">/blogs/</span>
                  <input
                    type="text"
                    value={editingBlog.slug}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    className="flex-1 bg-transparent text-xs text-[#202A2E] font-mono outline-none pl-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Category
                </label>
                <select
                  value={editingBlog.category}
                  onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none bg-white cursor-pointer"
                >
                  {BLOG_CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Card Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  placeholder="Learn how corrugated boxes are constructed, understand their different layers..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <MediaUploader
                  label="Article Cover Image"
                  value={editingBlog.coverImage}
                  mediaType="image"
                  allowedTypes={["image"]}
                  onChange={(url) => setEditingBlog({ ...editingBlog, coverImage: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Author Desk
                </label>
                <input
                  type="text"
                  value={editingBlog.author}
                  onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                  placeholder="Technical Packaging Desk"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Publication Date
                </label>
                <input
                  type="text"
                  value={editingBlog.publishedDate}
                  onChange={(e) => setEditingBlog({ ...editingBlog, publishedDate: e.target.value })}
                  placeholder="November 18, 2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={editingBlog.readTime}
                  onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                  placeholder="7 min read"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={Boolean(editingBlog.featured)}
                  onChange={(e) => setEditingBlog({ ...editingBlog, featured: e.target.checked })}
                  className="w-4 h-4 text-[#E97835] rounded-sm focus:ring-[#E97835] cursor-pointer"
                />
                <label
                  htmlFor="featuredCheckbox"
                  className="text-xs font-bold text-[#202A2E] cursor-pointer"
                >
                  Mark as Featured Article (Highlight on top of listing)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDITORIAL CONTENT SECTIONS */}
        {activeEditorTab === "sections" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                  Editorial Content Sections
                </h2>
                <p className="text-xs text-[#687378]">
                  Manage headings, paragraphs, callout boxes, rich bullet points, and data tables exactly as rendered on the website blog detail page.
                </p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="px-3.5 py-1.5 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            {editingBlog.sections.map((sec, secIdx) => (
              <div
                key={secIdx}
                className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] text-xs font-mono font-bold flex items-center justify-center">
                      {(secIdx + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#202A2E]">
                      {sec.heading || `Section #${secIdx + 1}`}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(secIdx)}
                    className="p-1 text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Heading & Subheading */}
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={(e) => updateSection(secIdx, { heading: e.target.value })}
                      placeholder="e.g. 1. Introduction: What Are Corrugated Boxes?"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1">
                      Subheading (Optional)
                    </label>
                    <input
                      type="text"
                      value={sec.subheading || ""}
                      onChange={(e) => updateSection(secIdx, { subheading: e.target.value })}
                      placeholder="Optional technical subheading"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  {/* Paragraphs Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#202A2E]">
                        Paragraphs ({sec.content.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          updateSection(secIdx, {
                            content: [...sec.content, "New paragraph..."],
                          });
                        }}
                        className="text-[11px] font-bold text-[#E97835] hover:underline cursor-pointer"
                      >
                        + Add Paragraph
                      </button>
                    </div>

                    <div className="space-y-2">
                      {sec.content.map((p, pIdx) => (
                        <div key={pIdx} className="flex gap-2 items-start">
                          <textarea
                            rows={2}
                            value={p}
                            onChange={(e) => {
                              const newContent = [...sec.content];
                              newContent[pIdx] = e.target.value;
                              updateSection(secIdx, { content: newContent });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newContent = [...sec.content];
                              newContent.splice(pIdx, 1);
                              updateSection(secIdx, { content: newContent });
                            }}
                            className="p-1 text-[#8C989E] hover:text-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Callout Box */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#A65D32] uppercase tracking-wider">
                        Callout Highlight Box (Optional)
                      </label>
                      {sec.callout ? (
                        <button
                          type="button"
                          onClick={() => updateSection(secIdx, { callout: undefined })}
                          className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Remove Callout
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(secIdx, {
                              callout: {
                                title: "Technical Distinction",
                                text: "Important notes on box flute geometry and board compression.",
                              },
                            })
                          }
                          className="text-[11px] font-bold text-[#E97835] hover:underline cursor-pointer"
                        >
                          + Add Callout Box
                        </button>
                      )}
                    </div>

                    {sec.callout && (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={sec.callout.title}
                          onChange={(e) =>
                            updateSection(secIdx, {
                              callout: {
                                title: e.target.value,
                                text: sec.callout?.text || "",
                              },
                            })
                          }
                          placeholder="Callout Title (e.g. Engineering Note)"
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none font-bold"
                        />
                        <textarea
                          rows={2}
                          value={sec.callout.text}
                          onChange={(e) =>
                            updateSection(secIdx, {
                              callout: {
                                title: sec.callout?.title || "Note",
                                text: e.target.value,
                              },
                            })
                          }
                          placeholder="Callout text..."
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bullet Points Block */}
                  <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[#E4DED3] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ListPlus className="w-3.5 h-3.5 text-[#E97835]" />
                        <label className="text-xs font-bold text-[#202A2E]">
                          Structured Bullet Points ({sec.bulletPoints?.length || 0})
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => addBulletPoint(secIdx)}
                        className="text-[11px] font-bold text-[#E97835] hover:underline cursor-pointer"
                      >
                        + Add Bullet Point
                      </button>
                    </div>

                    {sec.bulletPoints && sec.bulletPoints.length > 0 ? (
                      <div className="space-y-2.5">
                        {sec.bulletPoints.map((bp, bpI) => (
                          <div
                            key={bpI}
                            className="p-3 bg-white rounded-lg border border-[#E4DED3] space-y-1.5 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#8C989E]">
                                Point #{bpI + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeBulletPoint(secIdx, bpI)}
                                className="text-[#8C989E] hover:text-red-600 transition-colors p-0.5"
                                title="Delete Point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={bp.title}
                              onChange={(e) =>
                                updateBulletPoint(secIdx, bpI, "title", e.target.value)
                              }
                              placeholder="Point Title (e.g. Physical Durability:)"
                              className="w-full px-2.5 py-1 rounded border border-[#E4DED3] text-xs font-bold text-[#202A2E] outline-none"
                            />
                            <textarea
                              rows={2}
                              value={bp.text}
                              onChange={(e) =>
                                updateBulletPoint(secIdx, bpI, "text", e.target.value)
                              }
                              placeholder="Detailed explanation..."
                              className="w-full px-2.5 py-1 rounded border border-[#E4DED3] text-xs text-[#687378] outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#A0ACB2] italic">
                        No bullet points in this section. Click &ldquo;+ Add Bullet Point&rdquo; to insert formatted feature cards.
                      </p>
                    )}
                  </div>

                  {/* Informational Data Table */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TableIcon className="w-3.5 h-3.5 text-[#E97835]" />
                        <label className="text-xs font-bold text-[#202A2E]">
                          Informational Data Table
                        </label>
                      </div>

                      {sec.table ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => addTableColumn(secIdx)}
                            className="text-[11px] font-bold text-[#E97835] hover:underline cursor-pointer"
                          >
                            + Add Column
                          </button>
                          <span className="text-[#A0ACB2] text-xs">|</span>
                          <button
                            type="button"
                            onClick={() => addTableRow(secIdx)}
                            className="text-[11px] font-bold text-[#E97835] hover:underline cursor-pointer"
                          >
                            + Add Row
                          </button>
                          <span className="text-[#A0ACB2] text-xs">|</span>
                          <button
                            type="button"
                            onClick={() => removeTable(secIdx)}
                            className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                          >
                            Delete Table
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addTable(secIdx)}
                          className="text-[11px] font-bold text-[#E97835] hover:underline cursor-pointer"
                        >
                          + Add Data Table
                        </button>
                      )}
                    </div>

                    {sec.table ? (
                      <div className="overflow-x-auto border border-[#E4DED3] rounded-xl bg-white">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#FAF7F2] border-b border-[#E4DED3]">
                              {sec.table.headers.map((th, colI) => (
                                <th key={colI} className="p-2 border-r border-[#E4DED3] last:border-r-0">
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={th}
                                      onChange={(e) =>
                                        updateTableHeader(secIdx, colI, e.target.value)
                                      }
                                      className="w-full font-bold uppercase tracking-wider text-[11px] text-[#202A2E] bg-transparent outline-none"
                                    />
                                    {sec.table!.headers.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeTableColumn(secIdx, colI)}
                                        className="text-[#8C989E] hover:text-red-600 text-xs px-1"
                                        title="Delete column"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                </th>
                              ))}
                              <th className="w-8 p-1 text-center" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4DED3]">
                            {sec.table.rows.map((row, rowI) => (
                              <tr key={rowI} className="hover:bg-[#FAF9F5]">
                                {row.map((cell, colI) => (
                                  <td
                                    key={colI}
                                    className="p-1.5 border-r border-[#E4DED3] last:border-r-0"
                                  >
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) =>
                                        updateTableCell(secIdx, rowI, colI, e.target.value)
                                      }
                                      className="w-full px-2 py-1 text-xs text-[#687378] bg-transparent outline-none focus:bg-white focus:border focus:border-[#E97835] rounded"
                                    />
                                  </td>
                                ))}
                                <td className="p-1 text-center">
                                  {sec.table!.rows.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeTableRow(secIdx, rowI)}
                                      className="text-[#8C989E] hover:text-red-600 p-1"
                                      title="Delete row"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-[11px] text-[#A0ACB2] italic">
                        No table in this section. Click &ldquo;+ Add Data Table&rdquo; to insert technical comparison specifications.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: KEY TAKEAWAYS & FAQS */}
        {activeEditorTab === "takeaways" && (
          <div className="space-y-6">
            {/* Key Takeaways */}
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#202A2E]">
                    Key Takeaways Summary Cards
                  </h3>
                  <p className="text-xs text-[#687378]">
                    Displayed in a clean grid at the end of the article.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addTakeaway}
                  className="px-3 py-1 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86928] cursor-pointer"
                >
                  + Add Takeaway
                </button>
              </div>

              <div className="space-y-3">
                {editingBlog.keyTakeaways.map((kt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] flex items-start gap-3"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={kt.point}
                        onChange={(e) => updateTakeaway(i, { point: e.target.value })}
                        placeholder="Point headline"
                        className="px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold text-[#202A2E] outline-none"
                      />
                      <input
                        type="text"
                        value={kt.description}
                        onChange={(e) => updateTakeaway(i, { description: e.target.value })}
                        placeholder="Explanation description"
                        className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTakeaway(i)}
                      className="p-1 text-[#8C989E] hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Article FAQs */}
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#202A2E]">
                    Article-Specific FAQs
                  </h3>
                  <p className="text-xs text-[#687378]">
                    Rendered in an accordion format beneath the article.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addFAQ}
                  className="px-3 py-1 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86928] cursor-pointer"
                >
                  + Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {editingBlog.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A65D32]">
                        FAQ #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFAQ(i)}
                        className="text-[#8C989E] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(i, { question: e.target.value })}
                      placeholder="What is the difference between..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs font-bold text-[#202A2E] outline-none"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFAQ(i, { answer: e.target.value })}
                      placeholder="Detailed factual answer..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RELATED ARTICLES */}
        {activeEditorTab === "related" && (
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                Select Related Articles
              </h2>
              <p className="text-xs text-[#687378] mt-0.5">
                Choose which published articles to recommend at the bottom of this blog detail page under &ldquo;Related Articles&rdquo;.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {articles
                .filter((a) => a.slug !== editingBlog.slug)
                .map((art) => {
                  const isSelected = (editingBlog.relatedBlogSlugs || []).includes(art.slug);
                  return (
                    <div
                      key={art.slug}
                      onClick={() => toggleRelatedBlog(art.slug)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#FFF6F0] border-[#E97835] shadow-2xs"
                          : "bg-white border-[#E4DED3] hover:border-[#D1B48C]"
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A65D32] block">
                          {art.category}
                        </span>
                        <h4 className="text-xs font-bold text-[#202A2E] line-clamp-1 mt-0.5">
                          {art.title}
                        </h4>
                        <span className="text-[10px] text-[#8C989E]">/blogs/{art.slug}</span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? "bg-[#E97835] border-[#E97835] text-white"
                            : "border-[#E4DED3] bg-white text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 5: ARTICLE SEO */}
        {activeEditorTab === "seo" && (
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-5">
            <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Article Search Engine Optimization (SEO)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={editingBlog.seo.title}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      seo: { ...editingBlog.seo, title: e.target.value },
                    })
                  }
                  placeholder="Article Title | AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={editingBlog.seo.description}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      seo: { ...editingBlog.seo, description: e.target.value },
                    })
                  }
                  placeholder="Comprehensive guide to..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  value={editingBlog.seo.keywords || ""}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      seo: { ...editingBlog.seo, keywords: e.target.value },
                    })
                  }
                  placeholder="corrugated box types, fluting, paper GSM"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1">
                  Canonical URL (Optional)
                </label>
                <input
                  type="text"
                  value={editingBlog.seo.canonical || `/blogs/${editingBlog.slug}`}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      seo: { ...editingBlog.seo, canonical: e.target.value },
                    })
                  }
                  placeholder="/blogs/understanding-corrugated-boxes"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ALL ARTICLES LISTING
  // =========================================================================
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Blogs</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              All Articles &amp; Content
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            All Articles &amp; Editorial Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Browse, author, edit, or remove technical articles, packaging guides, and industry reports published on AAVRIT PACKAGING.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Article</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-medium ${
            toast.type === "success"
              ? "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]"
              : "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C989E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search article by title, slug, or content..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E4DED3] bg-white text-xs text-[#202A2E] placeholder:text-[#A0ACB2] outline-none focus:border-[#E97835]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {["All Articles", ...BLOG_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setFilterFeaturedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                !filterFeaturedOnly && selectedCategory === cat
                  ? "bg-[#202A2E] text-white shadow-xs"
                  : "bg-white text-[#687378] border border-[#E4DED3] hover:text-[#202A2E]"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Featured Blogs Filter Button */}
          <button
            type="button"
            onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterFeaturedOnly
                ? "bg-[#E97835] text-white border-[#E97835] shadow-xs"
                : "bg-white text-[#E97835] border-[#E97835]/40 hover:bg-[#FFF6F0]"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                filterFeaturedOnly ? "fill-white text-white" : "fill-[#E97835] text-[#E97835]"
              }`}
            />
            <span>Featured Blogs ({articles.filter((a) => a.featured).length})</span>
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-3xl border border-[#E4DED3] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Cover Image & Category Pill */}
              <div className="relative w-full aspect-[16/10] bg-[#FAF7F2] overflow-hidden">
                <Image
                  src={blog.coverImage || "/blog/Modern Packaging Workspace Scene.png"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-[#202A2E]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    {blog.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleFeatured(blog, e)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full border shadow-sm transition-colors cursor-pointer ${
                    blog.featured
                      ? "bg-[#E97835] border-[#E97835] text-white"
                      : "bg-white/80 border-white/40 text-[#687378] hover:text-[#E97835]"
                  }`}
                  title={blog.featured ? "Featured on Top" : "Mark as Featured"}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#8C989E]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{blog.publishedDate}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{blog.readTime}</span>
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-[#202A2E] leading-snug line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-[#687378] line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-[#8C989E]">
                  <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E4DED3]">
                    {blog.sections.length} Sections
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E4DED3]">
                    {blog.keyTakeaways?.length || 0} Takeaways
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E4DED3]">
                    {blog.faqs?.length || 0} FAQs
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-[#FAF7F2] bg-[#FAF9F5] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8C989E] truncate max-w-[130px]">
                /blogs/{blog.slug}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => toggleFeatured(blog, e)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border ${
                    blog.featured
                      ? "bg-[#FFF6F0] text-[#E97835] border-[#E97835]"
                      : "bg-white text-[#687378] border-[#E4DED3] hover:text-[#202A2E]"
                  }`}
                  title={blog.featured ? "Click to unmark featured" : "Click to mark as featured blog"}
                >
                  <Star className={`w-3 h-3 ${blog.featured ? "fill-[#E97835] text-[#E97835]" : "text-[#8C989E]"}`} />
                  <span>{blog.featured ? "Featured" : "Feature"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => startEdit(blog)}
                  className="px-3 py-1.5 rounded-lg bg-[#E97835] hover:bg-[#D86928] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteArticle(blog.slug, blog.title)}
                  className="p-1.5 text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center text-xs text-[#8C989E] bg-white rounded-3xl border border-[#E4DED3]">
          No articles match your search or filter.
        </div>
      )}
    </div>
  );
}
