"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Send,
  Plus,
  Trash2,
  FileCheck,
  Upload,
  LayoutTemplate,
  Sliders,
  Image as ImageIcon,
  Check,
  Eye,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import {
  DEFAULT_CONTACT_INQUIRY_FORM,
  DEFAULT_CONTACT_FORM_FIELDS,
  ContactInquiryFormData,
  ContactFormFieldsConfig,
  ContactShowcaseCard,
} from "@/lib/defaultContactData";

export default function ContactInquiryFormEditorPage() {
  const [data, setData] = useState<ContactInquiryFormData>(DEFAULT_CONTACT_INQUIRY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "cards">("form");
  const [previewTab, setPreviewTab] = useState<"form" | "cards" | "full">("full");

  // Local helper for options tag management
  const [newInquiryType, setNewInquiryType] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newBoxType, setNewBoxType] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadInquiryForm() {
      try {
        setLoading(true);
        const res = await fetch("/api/contact?section=inquiry-form");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData({
            ...DEFAULT_CONTACT_INQUIRY_FORM,
            ...json.data,
            form: {
              ...DEFAULT_CONTACT_FORM_FIELDS,
              ...(json.data.form || {}),
            },
          });
        }
      } catch (err: any) {
        console.error("Failed to load inquiry form config:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInquiryForm();
    return () => {
      isMounted = false;
    };
  }, []);

  const form = data.form || DEFAULT_CONTACT_FORM_FIELDS;

  const updateForm = (field: keyof ContactFormFieldsConfig, value: any) => {
    setData((prev) => ({
      ...prev,
      form: {
        ...form,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "inquiry-form", data }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: "success", message: "Contact Form & Showcase Cards saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      } else {
        throw new Error(json.message || "Failed to save contact form config");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to save contact form config" });
    } finally {
      setSaving(false);
    }
  };

  const handleShowcaseChange = (index: number, field: keyof ContactShowcaseCard, val: string) => {
    const updated = [...data.showcaseCards];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, showcaseCards: updated });
  };

  const addOption = (
    field: "inquiryTypeOptions" | "categoryOptions" | "boxTypeOptions" | "quantityOptions",
    val: string,
    clearFn: (v: string) => void
  ) => {
    if (!val.trim()) return;
    const current = form[field] || [];
    if (!current.includes(val.trim())) {
      updateForm(field, [...current, val.trim()]);
    }
    clearFn("");
  };

  const removeOption = (
    field: "inquiryTypeOptions" | "categoryOptions" | "boxTypeOptions" | "quantityOptions",
    index: number
  ) => {
    const current = [...(form[field] || [])];
    current.splice(index, 1);
    updateForm(field, current);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-[#687378] bg-white rounded-2xl border border-[#E4DED3]">
        Loading Contact Form Configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#687378] font-semibold">Contact</span>
            <span className="text-[#A0ACB2] text-xs">/</span>
            <span className="text-xs font-bold text-[#E97835] bg-[#E97835]/15 px-2 py-0.5 rounded-full border border-[#E97835]/25">
              Contact Form &amp; Showcase
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A2E]">
            Contact Form &amp; Visual Showcase
          </h1>
          <p className="text-xs sm:text-sm text-[#687378] mt-1">
            Configure the customer inquiry form fields, dropdown choices, and the side visual showcase cards.
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
                <span>Saving Changes...</span>
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

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
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

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-[#F5F2EB] rounded-2xl border border-[#E4DED3]">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "form"
                  ? "bg-white text-[#E97835] shadow-xs"
                  : "text-[#687378] hover:text-[#202A2E]"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Contact Form Fields &amp; Options</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cards")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "cards"
                  ? "bg-white text-[#E97835] shadow-xs"
                  : "text-[#687378] hover:text-[#202A2E]"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Side Showcase Cards ({data.showcaseCards.length})</span>
            </button>
          </div>

          {/* TAB 1: CONTACT FORM CONFIG */}
          {activeTab === "form" && (
            <div className="space-y-6">
              {/* 1. Header Copy */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-[#E97835]" />
                  <span>Form Header &amp; Subtitle</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Section Pill Badge
                    </label>
                    <input
                      type="text"
                      value={data.badge}
                      onChange={(e) => setData({ ...data, badge: e.target.value })}
                      placeholder="DIRECT INQUIRY DESK"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Form Heading
                    </label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => setData({ ...data, title: e.target.value })}
                      placeholder="Send Us Your Inquiry"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Description Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="Tell us a little about your packaging requirements..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 2. Contact Details Section */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center justify-between">
                  <span>Part 1: Contact Details Fields</span>
                  <span className="text-[11px] text-[#A65D32] font-mono bg-[#A65D32]/10 px-2 py-0.5 rounded-md">
                    Personal &amp; Company Info
                  </span>
                </h2>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Section Subheading
                  </label>
                  <input
                    type="text"
                    value={form.section1Title}
                    onChange={(e) => updateForm("section1Title", e.target.value)}
                    placeholder="1. Contact Details"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Name Label
                    </label>
                    <input
                      type="text"
                      value={form.nameLabel}
                      onChange={(e) => updateForm("nameLabel", e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Name Placeholder
                    </label>
                    <input
                      type="text"
                      value={form.namePlaceholder}
                      onChange={(e) => updateForm("namePlaceholder", e.target.value)}
                      placeholder="e.g. Rajesh Patel"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Company Label
                    </label>
                    <input
                      type="text"
                      value={form.companyLabel}
                      onChange={(e) => updateForm("companyLabel", e.target.value)}
                      placeholder="Company Name"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Company Placeholder
                    </label>
                    <input
                      type="text"
                      value={form.companyPlaceholder}
                      onChange={(e) => updateForm("companyPlaceholder", e.target.value)}
                      placeholder="e.g. Acme Logistics Pvt Ltd"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Email Label
                    </label>
                    <input
                      type="text"
                      value={form.emailLabel}
                      onChange={(e) => updateForm("emailLabel", e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Email Placeholder
                    </label>
                    <input
                      type="text"
                      value={form.emailPlaceholder}
                      onChange={(e) => updateForm("emailPlaceholder", e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Phone / WhatsApp Label
                    </label>
                    <input
                      type="text"
                      value={form.phoneLabel}
                      onChange={(e) => updateForm("phoneLabel", e.target.value)}
                      placeholder="Phone / WhatsApp Number"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Phone Placeholder
                    </label>
                    <input
                      type="text"
                      value={form.phonePlaceholder}
                      onChange={(e) => updateForm("phonePlaceholder", e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Packaging Specifications Dropdowns */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-5">
                <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center justify-between">
                  <span>Part 2: Packaging Specifications &amp; Dropdowns</span>
                  <span className="text-[11px] text-[#A65D32] font-mono bg-[#A65D32]/10 px-2 py-0.5 rounded-md">
                    Custom Options
                  </span>
                </h2>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Section Subheading
                  </label>
                  <input
                    type="text"
                    value={form.section2Title}
                    onChange={(e) => updateForm("section2Title", e.target.value)}
                    placeholder="2. Packaging Specifications"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>

                {/* Option Group 1: Inquiry Types */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#202A2E]">
                      Dropdown 1: Inquiry Types
                    </label>
                    <span className="text-[10px] text-[#687378]">
                      {form.inquiryTypeOptions?.length || 0} options
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.inquiryTypeOptions?.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] text-xs text-[#202A2E] shadow-2xs"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => removeOption("inquiryTypeOptions", i)}
                          className="text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInquiryType}
                      onChange={(e) => setNewInquiryType(e.target.value)}
                      placeholder="Add inquiry option (e.g. Export Packaging)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addOption("inquiryTypeOptions", newInquiryType, setNewInquiryType);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addOption("inquiryTypeOptions", newInquiryType, setNewInquiryType)}
                      className="px-3 py-1.5 rounded-lg bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86928] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Option Group 2: Product Categories */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#202A2E]">
                      Dropdown 2: Product Categories
                    </label>
                    <span className="text-[10px] text-[#687378]">
                      {form.categoryOptions?.length || 0} options
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.categoryOptions?.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] text-xs text-[#202A2E] shadow-2xs"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => removeOption("categoryOptions", i)}
                          className="text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add category (e.g. Heavy Duty Boxes)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addOption("categoryOptions", newCategory, setNewCategory);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addOption("categoryOptions", newCategory, setNewCategory)}
                      className="px-3 py-1.5 rounded-lg bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86928] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Option Group 3: Box Construction / Ply */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#202A2E]">
                      Dropdown 3: Box Construction / Ply Options
                    </label>
                    <span className="text-[10px] text-[#687378]">
                      {form.boxTypeOptions?.length || 0} options
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.boxTypeOptions?.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] text-xs text-[#202A2E] shadow-2xs"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => removeOption("boxTypeOptions", i)}
                          className="text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBoxType}
                      onChange={(e) => setNewBoxType(e.target.value)}
                      placeholder="Add box type (e.g. 9-Ply Heavy Duty)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addOption("boxTypeOptions", newBoxType, setNewBoxType);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addOption("boxTypeOptions", newBoxType, setNewBoxType)}
                      className="px-3 py-1.5 rounded-lg bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86928] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Option Group 4: Target Quantities */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E4DED3] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#202A2E]">
                      Dropdown 4: Target Quantity Tiers
                    </label>
                    <span className="text-[10px] text-[#687378]">
                      {form.quantityOptions?.length || 0} options
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.quantityOptions?.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E4DED3] text-xs text-[#202A2E] shadow-2xs"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => removeOption("quantityOptions", i)}
                          className="text-[#8C989E] hover:text-red-600 transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      placeholder="Add quantity tier (e.g. 20,000+ units)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DED3] bg-white text-xs text-[#202A2E] outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addOption("quantityOptions", newQuantity, setNewQuantity);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addOption("quantityOptions", newQuantity, setNewQuantity)}
                      className="px-3 py-1.5 rounded-lg bg-[#E97835] text-white text-xs font-bold hover:bg-[#D86928] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Message & File Upload Labels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Message Field Label
                    </label>
                    <input
                      type="text"
                      value={form.messageLabel}
                      onChange={(e) => updateForm("messageLabel", e.target.value)}
                      placeholder="Message / Additional Requirements"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Message Placeholder
                    </label>
                    <input
                      type="text"
                      value={form.messagePlaceholder}
                      onChange={(e) => updateForm("messagePlaceholder", e.target.value)}
                      placeholder="Please specify box dimensions..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      File Upload Label
                    </label>
                    <input
                      type="text"
                      value={form.fileUploadLabel}
                      onChange={(e) => updateForm("fileUploadLabel", e.target.value)}
                      placeholder="Upload Reference Drawing / Artwork"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      File Upload Hint Text
                    </label>
                    <input
                      type="text"
                      value={form.fileUploadHint}
                      onChange={(e) => updateForm("fileUploadHint", e.target.value)}
                      placeholder="(Optional, PDF/JPG/PNG up to 10MB)"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Actions & Confirmation */}
              <div className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-sm text-[#202A2E] border-b border-[#E4DED3] pb-3 flex items-center justify-between">
                  <span>Part 3: Submit Action &amp; Success Notice</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Submit Button Text
                    </label>
                    <input
                      type="text"
                      value={form.submitButtonText}
                      onChange={(e) => updateForm("submitButtonText", e.target.value)}
                      placeholder="Submit Inquiry"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                      Success Card Title
                    </label>
                    <input
                      type="text"
                      value={form.successTitle}
                      onChange={(e) => updateForm("successTitle", e.target.value)}
                      placeholder="Inquiry Received Successfully!"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Privacy Note / Disclaimer
                  </label>
                  <input
                    type="text"
                    value={form.privacyNote}
                    onChange={(e) => updateForm("privacyNote", e.target.value)}
                    placeholder="Your information will only be used to respond to your inquiry."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                    Success Confirmation Message
                  </label>
                  <textarea
                    rows={2}
                    value={form.successMessage}
                    onChange={(e) => updateForm("successMessage", e.target.value)}
                    placeholder="Thank you! Your packaging inquiry has been received..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIDE SHOWCASE CARDS */}
          {activeTab === "cards" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-1 border-b border-[#E4DED3]">
                <h2 className="font-heading font-bold text-sm text-[#202A2E]">
                  Side Visual Showcase Cards (2 Cards)
                </h2>
                <span className="text-xs text-[#687378]">
                  Appear adjacent to the contact form on large screens
                </span>
              </div>

              {data.showcaseCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E4DED3] rounded-2xl p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-[#E4DED3] pb-3">
                    <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] text-xs font-mono font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#202A2E]">
                      {card.title || `Showcase Card #${idx + 1}`}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <MediaUploader
                      label={`Card #${idx + 1} Graphic`}
                      value={card.image}
                      mediaType="image"
                      allowedTypes={["image"]}
                      onChange={(url) => handleShowcaseChange(idx, "image", url)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                          Card Tag
                        </label>
                        <input
                          type="text"
                          value={card.tag}
                          onChange={(e) => handleShowcaseChange(idx, "tag", e.target.value)}
                          placeholder="CUSTOM PACKAGING"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                          Image Alt Text
                        </label>
                        <input
                          type="text"
                          value={card.imageAlt || ""}
                          onChange={(e) => handleShowcaseChange(idx, "imageAlt", e.target.value)}
                          placeholder="Image description for SEO"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Card Heading
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleShowcaseChange(idx, "title", e.target.value)}
                        placeholder="Precision-Cut Corrugated Solutions"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs font-bold text-[#202A2E] focus:border-[#E97835] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#202A2E] mb-1.5">
                        Card Narrative
                      </label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => handleShowcaseChange(idx, "description", e.target.value)}
                        placeholder="Tailored flute calibers and custom-dimensioned master cartons..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4DED3] text-xs text-[#202A2E] focus:border-[#E97835] outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Full Interactive Live Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-8 space-y-4">
          <div className="bg-white border border-[#E4DED3] rounded-2xl p-4 shadow-xs space-y-4">
            {/* Preview Viewport Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#E97835]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                  Live Preview
                </span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] rounded-lg border border-[#E4DED3]">
                <button
                  type="button"
                  onClick={() => setPreviewTab("full")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewTab === "full"
                      ? "bg-white text-[#E97835] shadow-xs"
                      : "text-[#687378] hover:text-[#202A2E]"
                  }`}
                >
                  Full View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("form")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewTab === "form"
                      ? "bg-white text-[#E97835] shadow-xs"
                      : "text-[#687378] hover:text-[#202A2E]"
                  }`}
                >
                  Form Only
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("cards")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewTab === "cards"
                      ? "bg-white text-[#E97835] shadow-xs"
                      : "text-[#687378] hover:text-[#202A2E]"
                  }`}
                >
                  Cards Only
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="max-h-[750px] overflow-y-auto pr-1 space-y-4">
              {/* 1. Contact Form Preview */}
              {(previewTab === "form" || previewTab === "full") && (
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E4DED3] space-y-4">
                  <div className="border-b border-[#E4DED3] pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A65D32] block mb-0.5">
                      {data.badge || "DIRECT INQUIRY DESK"}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-[#202A2E]">
                      {data.title || "Send Us Your Inquiry"}
                    </h3>
                    <p className="text-xs text-[#62574D] mt-0.5 leading-snug">
                      {data.description}
                    </p>
                  </div>

                  {/* Section 1 preview */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#202A2E] border-l-2 border-[#A65D32] pl-2">
                      {form.section1Title || "1. Contact Details"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.nameLabel}</span>
                        <span className="text-[#202A2E] text-xs font-medium">{form.namePlaceholder}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.companyLabel}</span>
                        <span className="text-[#202A2E] text-xs font-medium">{form.companyPlaceholder}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.emailLabel}</span>
                        <span className="text-[#202A2E] text-xs font-medium truncate block">{form.emailPlaceholder}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.phoneLabel}</span>
                        <span className="text-[#202A2E] text-xs font-medium">{form.phonePlaceholder}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 preview */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#202A2E] border-l-2 border-[#A65D32] pl-2">
                      {form.section2Title || "2. Packaging Specifications"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.inquiryTypeLabel}</span>
                        <span className="text-[#202A2E] text-xs font-bold truncate block">
                          {form.inquiryTypeOptions?.[0] || "Product Inquiry"}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.categoryLabel}</span>
                        <span className="text-[#202A2E] text-xs font-bold truncate block">
                          {form.categoryOptions?.[0] || "Corrugated Boxes"}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.boxTypeLabel}</span>
                        <span className="text-[#202A2E] text-xs font-bold truncate block">
                          {form.boxTypeOptions?.[1] || "5-Ply Double Wall"}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#E4DED3]">
                        <span className="text-[10px] text-[#8C989E] block">{form.quantityLabel}</span>
                        <span className="text-[#202A2E] text-xs font-bold truncate block">
                          {form.quantityOptions?.[1] || "1,000 - 5,000 units"}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-[#E4DED3] text-xs">
                      <span className="text-[10px] text-[#8C989E] block">{form.messageLabel}</span>
                      <p className="text-[11px] text-[#62574D] line-clamp-2 mt-0.5">
                        {form.messagePlaceholder}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-dashed border-[#D1B48C] text-center text-xs text-[#8C989E] flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-[#A65D32]" />
                      <span>{form.fileUploadLabel}</span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <div className="w-full py-2.5 rounded-full bg-[#E97835] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
                        <span>{form.submitButtonText}</span>
                        <Send className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-[10px] text-[#8C989E] mt-1.5 text-center">
                        {form.privacyNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Side Showcase Cards Preview */}
              {(previewTab === "cards" || previewTab === "full") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-[#202A2E]">
                      Side Showcase Cards
                    </span>
                    <span className="text-[10px] text-[#8C989E] font-mono">
                      {data.showcaseCards.length} Cards
                    </span>
                  </div>

                  {data.showcaseCards.map((sc, i) => (
                    <div
                      key={i}
                      className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E4DED3] space-y-2.5"
                    >
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-white border border-[#E4DED3]">
                        {sc.image ? (
                          <img
                            src={
                              sc.image.startsWith("http://") ||
                              sc.image.startsWith("https://") ||
                              sc.image.startsWith("data:") ||
                              sc.image.startsWith("blob:") ||
                              sc.image.startsWith("/uploads/")
                                ? sc.image
                                : `${process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"}${encodeURI(
                                    sc.image.startsWith("/") ? sc.image : `/${sc.image}`
                                  )}`
                            }
                            alt={sc.imageAlt || sc.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== sc.image) {
                                target.src = sc.image;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#8C989E]">
                            No image uploaded
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#A65D32] bg-[#A65D32]/10 px-2 py-0.5 rounded-full mb-1">
                          {sc.tag}
                        </span>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#202A2E] leading-snug">
                          {sc.title}
                        </h4>
                        <p className="text-[11px] text-[#62574D] mt-1 leading-relaxed line-clamp-2">
                          {sc.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}