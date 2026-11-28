"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Search,
  Cpu,
  Layers,
  HelpCircle,
  Globe,
  FileText,
  ChevronRight,
  ArrowLeft,
  Sliders,
  Eye,
  Check,
  Target,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_MACHINERY_ITEMS,
  DEFAULT_MACHINERY_GRID_HEADER,
  MachineryGridHeaderData,
  MachineItem,
  MachineStep,
  MachineRolePoint,
  MachineGalleryImage,
  MachineFAQ,
} from "@/lib/defaultMachineryData";

const NEW_MACHINE_TEMPLATE: MachineItem = {
  id: `machine-${Date.now()}`,
  slug: "new-machine",
  name: "New Industrial Machine",
  category: "Converting & Finishing",
  shortDescription: "High-performance equipment engineered for industrial packaging operations.",
  fullDescription: "Detailed technical description of this machine's engineering and operations.",
  purpose: "Primary industrial manufacturing purpose in the plant.",
  roleSummary: "Key role played in the corrugation and carton converting supply chain.",
  image: "/Machinery/corrugation-machine.png",
  highlights: [
    "Precision automated control unit",
    "High-speed continuous feed mechanism",
    "Rigid heavy-duty structural frame",
  ],
  workingSteps: [
    {
      step: "01",
      title: "Material Feed & Alignment",
      description: "Corrugated sheets are fed continuously into precision alignment guides.",
    },
    {
      step: "02",
      title: "Converting Operation",
      description: "High-precision mechanical processing performs accurate folding and cutting.",
    },
  ],
  rolePoints: [
    {
      title: "Batch Quality Assurance",
      description: "Provides consistent dimensional repeatability across production shifts.",
    },
  ],
  gallery: [
    {
      src: "/Machinery/gallery-plant-view.webp",
      alt: "Machine Front View",
      caption: "Front-angle operational view of the equipment.",
    },
  ],
  faqs: [
    {
      question: "What sheet thicknesses and plies are supported?",
      answer: "The machine accommodates single-wall 3-ply, double-wall 5-ply, and heavy 7-ply board.",
    },
  ],
  seo: {
    title: "New Industrial Machine | AAVRIT PACKAGING",
    description: "Discover our high-precision industrial packaging equipment.",
  },
};

export default function MachineryItemsEditorPage() {
  const [machines, setMachines] = useState<MachineItem[]>(DEFAULT_MACHINERY_ITEMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Grid Section Heading State
  const [gridHeader, setGridHeader] = useState<MachineryGridHeaderData>(DEFAULT_MACHINERY_GRID_HEADER);
  const [showHeaderSettings, setShowHeaderSettings] = useState(false);
  const [savingHeader, setSavingHeader] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Editing state
  const [editingMachine, setEditingMachine] = useState<MachineItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<
    "basic" | "steps" | "role" | "gallery" | "faqs" | "seo"
  >("basic");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [itemsRes, headerRes] = await Promise.all([
          fetch("/api/machinery?section=items"),
          fetch("/api/machinery?section=grid-header"),
        ]);
        const itemsJson = await itemsRes.json();
        const headerJson = await headerRes.json();

        if (isMounted) {
          if (itemsJson.success && itemsJson.data) {
            setMachines(itemsJson.data);
          }
          if (headerJson.success && headerJson.data) {
            setGridHeader(headerJson.data);
          }
        }
      } catch (err: any) {
        console.error("Failed to load machinery data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveGridHeader = async () => {
    setSavingHeader(true);
    try {
      const res = await fetch("/api/machinery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "grid-header", data: gridHeader }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Section Heading saved successfully!" });
        setTimeout(() => setToast(null), 3500);
      } else {
        throw new Error(json.message || "Failed to save heading");
      }
    } catch (e: any) {
      setToast({ type: "error", message: e.message || "Failed to save section heading" });
    } finally {
      setSavingHeader(false);
    }
  };

  const handleSaveMachine = async () => {
    if (!editingMachine) return;
    if (!editingMachine.name.trim()) {
      setToast({ type: "error", message: "Machine name is required." });
      return;
    }
    if (!editingMachine.slug.trim()) {
      setToast({ type: "error", message: "Machine slug is required." });
      return;
    }

    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/machinery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-item", data: editingMachine }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: `Machine "${editingMachine.name}" saved successfully!` });
        // Update local list
        setMachines((prev) => {
          const index = prev.findIndex((m) => m.slug === editingMachine.slug || m.id === editingMachine.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = editingMachine;
            return next;
          }
          return [...prev, editingMachine];
        });
        setEditingMachine(null);
        setIsCreating(false);
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save machine");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save machine" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMachine = async (machine: MachineItem) => {
    if (!confirm(`Are you sure you want to delete "${machine.name}"?`)) return;

    setSaving(true);
    try {
      const res = await fetch("/api/machinery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-item", slug: machine.slug, id: machine.id }),
      });
      const json = await res.json();
      if (json.success) {
        setMachines((prev) => prev.filter((m) => m.slug !== machine.slug));
        if (editingMachine?.slug === machine.slug) {
          setEditingMachine(null);
          setIsCreating(false);
        }
        setToast({ type: "success", message: `Machine "${machine.name}" deleted.` });
        setTimeout(() => setToast(null), 3000);
      } else {
        throw new Error(json.message || "Failed to delete machine");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to delete machine" });
    } finally {
      setSaving(false);
    }
  };

  const categories = ["All Categories", ...Array.from(new Set(machines.map((m) => m.category)))];

  const filteredMachines = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getMediaUrl = (val: string) => {
    if (!val) return "";
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:") || val.startsWith("blob:") || val.startsWith("/uploads/")) {
      return val;
    }
    const websiteBase = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";
    const cleanPath = val.startsWith("/") ? val : `/${val}`;
    return `${websiteBase}${encodeURI(cleanPath)}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C989E] mb-1">
            <span>Machinery</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E97835]">
              {editingMachine ? (isCreating ? "New Machine" : "Edit Machine Detail") : "All Machinery"}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E]">
            {editingMachine
              ? isCreating
                ? "Add New Plant Machine"
                : `Edit: ${editingMachine.name}`
              : "All Machinery & Detail Page Editor"}
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            {editingMachine
              ? "Update machine specifications, working checkpoints, manufacturing role, photo gallery, and FAQs."
              : `Manage all ${machines.length} machines operating in your plant. Edit specifications and detail components.`}
          </p>
        </div>

        {editingMachine ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingMachine(null);
                setIsCreating(false);
              }}
              className="px-4 py-2.5 rounded-xl border border-[#E4DED3] bg-white text-xs font-bold text-[#202A2E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveMachine}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Machine"}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingMachine({ ...NEW_MACHINE_TEMPLATE, id: `machine-${Date.now()}` });
                setIsCreating(true);
                setActiveEditorTab("basic");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Machine</span>
            </button>
          </div>
        )}
      </div>

      {/* MAIN VIEW: LIST OR EDIT */}
      {!editingMachine ? (
        <div className="space-y-6">
          {/* Section Header Controls (Badge, Title, Highlight, Subtitle) */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-[#FAF9F5] border-b border-[#E4DED3]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-sm text-[#202A2E]">
                    Catalog Section Heading &amp; Subtitle
                  </h3>
                  <p className="text-xs text-[#687378] truncate">
                    Currently: <span className="font-semibold text-[#202A2E]">{gridHeader.title} <span className="text-[#A65D32]">{gridHeader.highlightText}</span></span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHeaderSettings(!showHeaderSettings)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E4DED3] bg-white hover:bg-[#FAF7F2] text-xs font-bold text-[#202A2E] cursor-pointer transition-colors shrink-0"
              >
                {showHeaderSettings ? "Hide Heading Settings" : "Edit Section Heading"}
              </button>
            </div>

            {showHeaderSettings && (
              <div className="p-5 sm:p-6 space-y-4 bg-white animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={gridHeader.badge}
                      onChange={(e) => setGridHeader({ ...gridHeader, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                      placeholder="e.g. CORE PLANT INFRASTRUCTURE"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Main Heading Title
                    </label>
                    <input
                      type="text"
                      value={gridHeader.title}
                      onChange={(e) => setGridHeader({ ...gridHeader, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                      placeholder="e.g. Our Machinery &"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Highlighted Text (Brown Accent)
                    </label>
                    <input
                      type="text"
                      value={gridHeader.highlightText}
                      onChange={(e) => setGridHeader({ ...gridHeader, highlightText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                      placeholder="e.g. Equipment"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Subtitle Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={gridHeader.subtitle}
                    onChange={(e) => setGridHeader({ ...gridHeader, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none resize-none"
                    placeholder="Short narrative introducing the machinery grid..."
                  />
                </div>

                {/* Live Mini Preview */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E4DED3]">
                  <span className="text-[10px] font-bold text-[#8C989E] uppercase tracking-wider block mb-1">
                    Live Heading Preview:
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A65D32]/10 border border-[#A65D32]/25 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A65D32]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#A65D32]">
                      {gridHeader.badge}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-lg sm:text-xl text-[#202A2E] leading-snug">
                    {gridHeader.title} <span className="text-[#A65D32]">{gridHeader.highlightText}</span>
                  </h4>
                  <p className="text-xs text-[#62574D] mt-1 max-w-xl">
                    {gridHeader.subtitle}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveGridHeader}
                    disabled={savingHeader}
                    className="px-4 py-2 rounded-xl bg-[#E97835] hover:bg-[#D86825] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs disabled:opacity-50"
                  >
                    {savingHeader ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Section Heading</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8C989E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search machinery by name, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-[#8C989E] shrink-0">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E4DED3] text-xs font-semibold text-[#202A2E] bg-white outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Machinery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.map((machine, idx) => (
              <div
                key={machine.id || machine.slug}
                className="bg-white border border-[#E4DED3] rounded-2xl overflow-hidden shadow-xs hover:border-[#D1B48C] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Machine Thumbnail */}
                  <div className="relative w-full aspect-[16/10] bg-[#FAF7F2] border-b border-[#E4DED3] overflow-hidden">
                    <img
                      src={getMediaUrl(machine.image)}
                      alt={machine.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = "/Machinery/corrugation-machine.png";
                        if (target.src !== fallback) target.src = fallback;
                      }}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#E4DED3] text-[10px] font-bold text-[#A65D32] shadow-2xs">
                      {machine.category}
                    </div>
                  </div>

                  {/* Body Information */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-heading font-bold text-base text-[#202A2E] group-hover:text-[#E97835] transition-colors leading-snug">
                      {machine.name}
                    </h3>
                    <p className="text-xs text-[#687378] leading-relaxed line-clamp-2">
                      {machine.shortDescription}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-[#E4DED3]/60 text-center">
                      <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                        <span className="text-xs font-bold text-[#202A2E] block">
                          {machine.workingSteps?.length || 0}
                        </span>
                        <span className="text-[9px] text-[#8C989E] block">Steps</span>
                      </div>
                      <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                        <span className="text-xs font-bold text-[#202A2E] block">
                          {machine.rolePoints?.length || 0}
                        </span>
                        <span className="text-[9px] text-[#8C989E] block">Roles</span>
                      </div>
                      <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                        <span className="text-xs font-bold text-[#202A2E] block">
                          {machine.gallery?.length || 0}
                        </span>
                        <span className="text-[9px] text-[#8C989E] block">Photos</span>
                      </div>
                      <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                        <span className="text-xs font-bold text-[#202A2E] block">
                          {machine.faqs?.length || 0}
                        </span>
                        <span className="text-[9px] text-[#8C989E] block">FAQs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-[#FAF9F5] border-t border-[#E4DED3] flex items-center justify-between">
                  <a
                    href={`http://localhost:3000/machinery/${machine.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#687378] hover:text-[#202A2E]"
                  >
                    <span>View Detail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteMachine(machine)}
                      className="p-1.5 rounded-lg border border-[#E4DED3] bg-white text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                      title="Delete machine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMachine({ ...machine });
                        setIsCreating(false);
                        setActiveEditorTab("basic");
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86825] transition-colors shadow-2xs cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* DETAIL MACHINE EDITOR VIEW */
        <div className="space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveEditorTab("basic")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeEditorTab === "basic"
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Basic Specs &amp; Highlights</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("steps")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeEditorTab === "steps"
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>2. How It Works ({editingMachine.workingSteps?.length || 0} Steps)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("role")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeEditorTab === "role"
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>3. Manufacturing Role ({editingMachine.rolePoints?.length || 0} Points)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("gallery")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeEditorTab === "gallery"
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>4. Photo Gallery ({editingMachine.gallery?.length || 0} Photos)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("faqs")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeEditorTab === "faqs"
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>5. Machine FAQs ({editingMachine.faqs?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("seo")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeEditorTab === "seo"
                  ? "bg-[#E97835] text-white shadow-xs"
                  : "bg-white text-[#202A2E] hover:bg-[#FAF7F2] border border-[#E4DED3]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>6. SEO Metadata</span>
            </button>
          </div>

          {/* TAB 1: BASIC SPECS */}
          {activeEditorTab === "basic" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
                    Machine Name, Slug &amp; Category
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Machine Name
                      </label>
                      <input
                        type="text"
                        value={editingMachine.name}
                        onChange={(e) => setEditingMachine({ ...editingMachine, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        URL Slug (/machinery/[slug])
                      </label>
                      <input
                        type="text"
                        value={editingMachine.slug}
                        onChange={(e) => setEditingMachine({ ...editingMachine, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] font-mono focus:border-[#E97835] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Process Category
                    </label>
                    <input
                      type="text"
                      value={editingMachine.category}
                      onChange={(e) => setEditingMachine({ ...editingMachine, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Short Overview Summary (Listing &amp; Banner)
                    </label>
                    <textarea
                      rows={2}
                      value={editingMachine.shortDescription}
                      onChange={(e) => setEditingMachine({ ...editingMachine, shortDescription: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Full Engineering Description
                    </label>
                    <textarea
                      rows={4}
                      value={editingMachine.fullDescription}
                      onChange={(e) => setEditingMachine({ ...editingMachine, fullDescription: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
                    Purpose &amp; Structural Role
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Primary Operational Purpose
                    </label>
                    <textarea
                      rows={2}
                      value={editingMachine.purpose}
                      onChange={(e) => setEditingMachine({ ...editingMachine, purpose: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Role in Finished Box Strength
                    </label>
                    <textarea
                      rows={2}
                      value={editingMachine.roleSummary}
                      onChange={(e) => setEditingMachine({ ...editingMachine, roleSummary: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Highlights List */}
                <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
                    <h3 className="font-heading font-bold text-sm text-[#202A2E]">
                      Key Machine Highlights ({editingMachine.highlights?.length || 0})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingMachine({
                          ...editingMachine,
                          highlights: [...(editingMachine.highlights || []), "New engineering specification point"],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-[#E97835] hover:bg-[#E97835]/10 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Highlight</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editingMachine.highlights || []).map((hl, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#FAF7F2] text-[#E97835] font-mono text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => {
                            const updated = [...editingMachine.highlights];
                            updated[i] = e.target.value;
                            setEditingMachine({ ...editingMachine, highlights: updated });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] outline-none focus:border-[#E97835]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingMachine.highlights.filter((_, idx) => idx !== i);
                            setEditingMachine({ ...editingMachine, highlights: updated });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Image Uploader */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
                    Machine Primary Image
                  </h3>

                  <MediaUploader
                    label="Main Machine Cutout / Photo"
                    value={editingMachine.image}
                    mediaType="image"
                    allowedTypes={["image"]}
                    onChange={(url) => setEditingMachine({ ...editingMachine, image: url })}
                  />

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] text-xs text-[#687378]">
                    <p className="font-semibold text-[#202A2E] mb-1">Recommended Format:</p>
                    <p>Transparent PNG or high-res photography showing the equipment clearly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW IT WORKS (STEPS) */}
          {activeEditorTab === "steps" && (
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-4">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                    How This Machine Works: Checkpoints
                  </h3>
                  <p className="text-xs text-[#687378] mt-0.5">
                    Step-by-step operating checkpoints displayed on the machine detail page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingMachine({
                      ...editingMachine,
                      workingSteps: [
                        ...(editingMachine.workingSteps || []),
                        {
                          step: ((editingMachine.workingSteps?.length || 0) + 1).toString().padStart(2, "0"),
                          title: "New Processing Checkpoint",
                          description: "Description of what happens during this operational stage.",
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] text-[#E97835] hover:bg-[#E97835]/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-4">
                {(editingMachine.workingSteps || []).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF7F2] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#E97835] text-white font-mono font-bold text-xs flex items-center justify-center">
                          {step.step || idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#202A2E]">
                          Checkpoint #{idx + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingMachine.workingSteps.filter((_, i) => i !== idx);
                          setEditingMachine({ ...editingMachine, workingSteps: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                          Step Number
                        </label>
                        <input
                          type="text"
                          value={step.step}
                          onChange={(e) => {
                            const updated = [...editingMachine.workingSteps];
                            updated[idx] = { ...updated[idx], step: e.target.value };
                            setEditingMachine({ ...editingMachine, workingSteps: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs font-mono font-bold text-[#202A2E] bg-white outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                          Step Title
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updated = [...editingMachine.workingSteps];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setEditingMachine({ ...editingMachine, workingSteps: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs font-bold text-[#202A2E] bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Step Description
                      </label>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...editingMachine.workingSteps];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setEditingMachine({ ...editingMachine, workingSteps: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] bg-white outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ROLE IN MANUFACTURING */}
          {activeEditorTab === "role" && (
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-4">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                    Role in Corrugated Box Manufacturing
                  </h3>
                  <p className="text-xs text-[#687378] mt-0.5">
                    Structural and functional role points that explain how this machine impacts box quality.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingMachine({
                      ...editingMachine,
                      rolePoints: [
                        ...(editingMachine.rolePoints || []),
                        {
                          title: "New Functional Role",
                          description: "Description of the structural impact on finished box quality.",
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] text-[#E97835] hover:bg-[#E97835]/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role Point</span>
                </button>
              </div>

              <div className="space-y-4">
                {(editingMachine.rolePoints || []).map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF7F2] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#202A2E]">
                        Role Contribution #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingMachine.rolePoints.filter((_, i) => i !== idx);
                          setEditingMachine({ ...editingMachine, rolePoints: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={point.title}
                        onChange={(e) => {
                          const updated = [...editingMachine.rolePoints];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setEditingMachine({ ...editingMachine, rolePoints: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs font-bold text-[#202A2E] bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Role Description
                      </label>
                      <textarea
                        rows={2}
                        value={point.description}
                        onChange={(e) => {
                          const updated = [...editingMachine.rolePoints];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setEditingMachine({ ...editingMachine, rolePoints: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] bg-white outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHOTO GALLERY */}
          {activeEditorTab === "gallery" && (
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-4">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                    Machine Photo Gallery (Lightbox Viewer)
                  </h3>
                  <p className="text-xs text-[#687378] mt-0.5">
                    High-resolution photographs of the machine from front, operational angle, and material infeed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingMachine({
                      ...editingMachine,
                      gallery: [
                        ...(editingMachine.gallery || []),
                        {
                          src: "/Machinery/gallery-plant-view.webp",
                          alt: "Machine In-Action",
                          caption: "Close-up operational view during corrugation production.",
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] text-[#E97835] hover:bg-[#E97835]/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(editingMachine.gallery || []).map((photo, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF7F2] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#202A2E]">
                          Photo #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingMachine.gallery.filter((_, i) => i !== idx);
                            setEditingMachine({ ...editingMachine, gallery: updated });
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <MediaUploader
                        label={`Photo #${idx + 1}`}
                        value={photo.src}
                        mediaType="image"
                        allowedTypes={["image"]}
                        onChange={(url) => {
                          const updated = [...editingMachine.gallery];
                          updated[idx] = { ...updated[idx], src: url };
                          setEditingMachine({ ...editingMachine, gallery: updated });
                        }}
                      />

                      <div>
                        <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={photo.alt}
                          onChange={(e) => {
                            const updated = [...editingMachine.gallery];
                            updated[idx] = { ...updated[idx], alt: e.target.value };
                            setEditingMachine({ ...editingMachine, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] bg-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                          Lightbox Caption
                        </label>
                        <textarea
                          rows={2}
                          value={photo.caption}
                          onChange={(e) => {
                            const updated = [...editingMachine.gallery];
                            updated[idx] = { ...updated[idx], caption: e.target.value };
                            setEditingMachine({ ...editingMachine, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FAQS */}
          {activeEditorTab === "faqs" && (
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E4DED3] pb-4">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#202A2E]">
                    Machine-Specific FAQs
                  </h3>
                  <p className="text-xs text-[#687378] mt-0.5">
                    Frequently asked technical and operational questions displayed on the machine detail page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingMachine({
                      ...editingMachine,
                      faqs: [
                        ...(editingMachine.faqs || []),
                        {
                          question: "New machine capability question?",
                          answer: "Detailed answer explaining the technical specifications.",
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] text-[#E97835] hover:bg-[#E97835]/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {(editingMachine.faqs || []).map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E4DED3] bg-[#FAF7F2] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E97835]">
                        Question #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingMachine.faqs.filter((_, i) => i !== idx);
                          setEditingMachine({ ...editingMachine, faqs: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...editingMachine.faqs];
                          updated[idx] = { ...updated[idx], question: e.target.value };
                          setEditingMachine({ ...editingMachine, faqs: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-[#E4DED3] text-xs font-bold text-[#202A2E] bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#202A2E] mb-1">
                        Answer
                      </label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...editingMachine.faqs];
                          updated[idx] = { ...updated[idx], answer: e.target.value };
                          setEditingMachine({ ...editingMachine, faqs: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E4DED3] text-xs text-[#202A2E] bg-white outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SEO METADATA */}
          {activeEditorTab === "seo" && (
            <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4 max-w-3xl">
              <h3 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3">
                Machine Detail Search Engine Optimization (SEO)
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  value={editingMachine.seo?.title || ""}
                  onChange={(e) =>
                    setEditingMachine({
                      ...editingMachine,
                      seo: { ...(editingMachine.seo || { description: "" }), title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={editingMachine.seo?.description || ""}
                  onChange={(e) =>
                    setEditingMachine({
                      ...editingMachine,
                      seo: { ...(editingMachine.seo || { title: "" }), description: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
