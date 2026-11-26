"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sliders,
  Image as ImageIcon,
  Compass,
  FileText,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  ExternalLink,
} from "lucide-react";
import MediaUploader from "@/components/MediaUploader";
import { DEFAULT_MANAGEMENT_DATA, ManagementData } from "@/lib/defaultManagementData";

export default function ManagementPage() {
  const [data, setData] = useState<ManagementData>(DEFAULT_MANAGEMENT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"logo" | "navbar" | "footer">("logo");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load configuration from API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch("/api/management");
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            setData(DEFAULT_MANAGEMENT_DATA);
          }
        }
      } catch (err) {
        if (isMounted) {
          setData(DEFAULT_MANAGEMENT_DATA);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setToast({
          type: "success",
          message: "Site management settings updated successfully!",
        });
      } else {
        setToast({
          type: "error",
          message: json.message || "Failed to save settings",
        });
      }
    } catch (e: any) {
      setToast({ type: "error", message: e.message || "Network error while saving" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-[#202A2E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#687378] font-semibold">Loading management configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-5 sm:p-6 shadow-sm">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687378] hover:text-[#202A2E] mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="font-heading font-extrabold text-2xl text-[#202A2E]">
          Site Management
        </h1>
        <p className="text-xs text-[#687378] mt-1">
          Configure site-wide branding, logos, favicon, header navigation, and footer details.
        </p>
      </div>

      {/* Notification Toast */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border ${
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

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("logo")}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "logo"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:text-[#202A2E] hover:bg-white"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Logos & Favicon</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("navbar")}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "navbar"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:text-[#202A2E] hover:bg-white"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Navbar / Header</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("footer")}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "footer"
              ? "bg-[#E97835] text-white shadow-xs"
              : "text-[#687378] hover:text-[#202A2E] hover:bg-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Footer Details</span>
        </button>
      </div>

      {/* TAB 1: LOGOS & FAVICON */}
      {activeTab === "logo" && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                Brand Identity & Titles
              </h2>
              <p className="text-xs text-[#687378] mt-0.5">
                Manage your main business title and tagline across the site.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Brand Name / Site Title
                </label>
                <input
                  type="text"
                  value={data.logo?.siteTitle || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      logo: { ...data.logo, siteTitle: e.target.value },
                    })
                  }
                  placeholder="e.g. AAVRIT PACKAGING"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={data.logo?.tagline || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      logo: { ...data.logo, tagline: e.target.value },
                    })
                  }
                  placeholder="e.g. Protection Begins With Better Packaging"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                Logos & Favicon Files
              </h2>
              <p className="text-xs text-[#687378] mt-0.5">
                Upload and preview your vector or transparent logos for light/dark backgrounds and browser tab favicon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Light Background Logo */}
              <div className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3">
                <MediaUploader
                  label="Light Background Logo (Navbar Default)"
                  value={data.logo?.lightLogo || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  helperText="Displayed when header is on white background (e.g. /images/aavrit_logo_light_bg.svg)."
                  onChange={(url) =>
                    setData({
                      ...data,
                      logo: { ...data.logo, lightLogo: url },
                    })
                  }
                />
              </div>

              {/* Dark Background Logo */}
              <div className="p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3">
                <MediaUploader
                  label="Dark Background Logo (Hero Transparent & Footer)"
                  value={data.logo?.darkLogo || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  helperText="Displayed over dark hero images and in footer (e.g. /images/aavrit_logo_dark_bg.svg)."
                  onChange={(url) =>
                    setData({
                      ...data,
                      logo: { ...data.logo, darkLogo: url },
                    })
                  }
                />
              </div>

              {/* Favicon & Browser Icon */}
              <div className="md:col-span-2 p-4 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl space-y-3">
                <MediaUploader
                  label="Favicon & Browser Tab Icon"
                  value={data.logo?.favicon || ""}
                  mediaType="image"
                  allowedTypes={["image"]}
                  helperText="Square icon for browser tabs (.ico, .png, or .svg, e.g. /favicon.ico)."
                  onChange={(url) =>
                    setData({
                      ...data,
                      logo: { ...data.logo, favicon: url },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NAVBAR / HEADER */}
      {activeTab === "navbar" && (
        <div className="space-y-6">
          {/* Top Bar Contacts */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3">
              <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                Top Information Strip
              </h2>
              <p className="text-xs text-[#687378] mt-0.5">
                Contact information shown at the top banner of the website.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Contact Phone</span>
                </label>
                <input
                  type="text"
                  value={data.navbar?.phone || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      navbar: { ...data.navbar, phone: e.target.value },
                    })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Contact Email</span>
                </label>
                <input
                  type="email"
                  value={data.navbar?.email || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      navbar: { ...data.navbar, email: e.target.value },
                    })
                  }
                  placeholder="inquiry@aavritpackaging.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Factory / Office Location</span>
                </label>
                <input
                  type="text"
                  value={data.navbar?.address || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      navbar: { ...data.navbar, address: e.target.value },
                    })
                  }
                  placeholder="Plot No. 42, Phase II GIDC, Gujarat, India"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Google Maps Destination Link</span>
                </label>
                <input
                  type="text"
                  value={data.navbar?.mapsUrl || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      navbar: { ...data.navbar, mapsUrl: e.target.value },
                    })
                  }
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Header Action Button */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#202A2E] border-b border-[#E4DED3] pb-3">
              Header Action Button (CTA)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={data.navbar?.ctaText || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      navbar: { ...data.navbar, ctaText: e.target.value },
                    })
                  }
                  placeholder="e.g. Request a Quote"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                  CTA Destination URL
                </label>
                <input
                  type="text"
                  value={data.navbar?.ctaLink || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      navbar: { ...data.navbar, ctaLink: e.target.value },
                    })
                  }
                  placeholder="e.g. /contact#inquiry-form"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E4DED3] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#202A2E]">
                  Header Navigation Links
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Configure the primary links displayed in the desktop and mobile navigation menu.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const links = [...(data.navbar?.navLinks || [])];
                  links.push({ label: "New Link", href: "/new-page" });
                  setData({
                    ...data,
                    navbar: { ...data.navbar, navLinks: links },
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Nav Link</span>
              </button>
            </div>

            <div className="space-y-3">
              {(data.navbar?.navLinks || []).map((link, lIdx) => (
                <div
                  key={lIdx}
                  className="p-3 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] flex items-center justify-center font-bold text-xs shrink-0">
                    {lIdx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label || ""}
                      onChange={(e) => {
                        const links = [...(data.navbar?.navLinks || [])];
                        links[lIdx] = { ...links[lIdx], label: e.target.value };
                        setData({
                          ...data,
                          navbar: { ...data.navbar, navLinks: links },
                        });
                      }}
                      placeholder="Link Label (e.g. About Us)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />

                    <input
                      type="text"
                      value={link.href || ""}
                      onChange={(e) => {
                        const links = [...(data.navbar?.navLinks || [])];
                        links[lIdx] = { ...links[lIdx], href: e.target.value };
                        setData({
                          ...data,
                          navbar: { ...data.navbar, navLinks: links },
                        });
                      }}
                      placeholder="Destination URL (e.g. /about)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const links = (data.navbar?.navLinks || []).filter((_, i) => i !== lIdx);
                      setData({
                        ...data,
                        navbar: { ...data.navbar, navLinks: links },
                      });
                    }}
                    className="p-1.5 text-[#687378] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FOOTER */}
      {activeTab === "footer" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#FAF9F5] border border-[#E4DED3] rounded-2xl p-5">
            <h3 className="font-heading font-bold text-base text-[#202A2E]">
              Website Footer Structure (4 Columns + Sub-Footer)
            </h3>
            <p className="text-xs text-[#687378] mt-1">
              Configure each column of the footer exactly as displayed on the live website: Brand Bio &amp; Socials, Navigation Links, Products Links, and Plant &amp; Office Contacts.
            </p>
          </div>

          {/* COLUMN 1: BRAND BIO & SOCIAL MEDIA */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-[#E4DED3] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded">
                  Column 1
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-1">
                  Brand Summary &amp; Social Links
                </h2>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                Company Description / Bio
              </label>
              <textarea
                rows={3}
                value={data.footer?.companyDescription || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    footer: { ...data.footer, companyDescription: e.target.value },
                  })
                }
                placeholder="Manufacturers of heavy-duty industrial cartons, 3-ply, 5-ply, 7-ply corrugated boxes..."
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="border-t border-[#E4DED3] pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1">
                    Social Media Section Heading
                  </label>
                  <input
                    type="text"
                    value={data.footer?.socialTitle || "FOLLOW US"}
                    onChange={(e) =>
                      setData({
                        ...data,
                        footer: { ...data.footer, socialTitle: e.target.value },
                      })
                    }
                    placeholder="FOLLOW US"
                    className="w-64 px-3 py-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202A2E] mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    value={data.footer?.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        footer: {
                          ...data.footer,
                          socialLinks: {
                            ...data.footer.socialLinks,
                            instagram: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://instagram.com"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202A2E] mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={data.footer?.socialLinks?.youtube || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        footer: {
                          ...data.footer,
                          socialLinks: {
                            ...data.footer.socialLinks,
                            youtube: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://youtube.com"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202A2E] mb-1">
                    X (Twitter) Profile URL
                  </label>
                  <input
                    type="text"
                    value={data.footer?.socialLinks?.twitter || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        footer: {
                          ...data.footer,
                          socialLinks: {
                            ...data.footer.socialLinks,
                            twitter: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://x.com"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202A2E] mb-1">
                    LinkedIn Company URL
                  </label>
                  <input
                    type="text"
                    value={data.footer?.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        footer: {
                          ...data.footer,
                          socialLinks: {
                            ...data.footer.socialLinks,
                            linkedin: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="https://linkedin.com"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: NAVIGATION LINKS */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded">
                  Column 2
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-1">
                  Footer Navigation Links
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Page links displayed under the Navigation column.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const links = [...(data.footer?.quickLinks || [])];
                  links.push({ label: "New Page", href: "/new-page" });
                  setData({
                    ...data,
                    footer: { ...data.footer, quickLinks: links },
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Navigation Link</span>
              </button>
            </div>

            <div className="w-full sm:w-72">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1">
                Column Heading Text
              </label>
              <input
                type="text"
                value={data.footer?.navigationTitle || "NAVIGATION"}
                onChange={(e) =>
                  setData({
                    ...data,
                    footer: { ...data.footer, navigationTitle: e.target.value },
                  })
                }
                placeholder="NAVIGATION"
                className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
              />
            </div>

            <div className="space-y-2.5">
              {(data.footer?.quickLinks || []).map((link, lIdx) => (
                <div
                  key={lIdx}
                  className="p-3 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] flex items-center justify-center font-bold text-xs shrink-0">
                    {lIdx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label || ""}
                      onChange={(e) => {
                        const links = [...(data.footer?.quickLinks || [])];
                        links[lIdx] = { ...links[lIdx], label: e.target.value };
                        setData({
                          ...data,
                          footer: { ...data.footer, quickLinks: links },
                        });
                      }}
                      placeholder="Label (e.g. About Us)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />

                    <input
                      type="text"
                      value={link.href || ""}
                      onChange={(e) => {
                        const links = [...(data.footer?.quickLinks || [])];
                        links[lIdx] = { ...links[lIdx], href: e.target.value };
                        setData({
                          ...data,
                          footer: { ...data.footer, quickLinks: links },
                        });
                      }}
                      placeholder="Path (e.g. /about)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const links = (data.footer?.quickLinks || []).filter((_, i) => i !== lIdx);
                      setData({
                        ...data,
                        footer: { ...data.footer, quickLinks: links },
                      });
                    }}
                    className="p-1.5 text-[#687378] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: PRODUCTS LINKS */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded">
                  Column 3
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-1">
                  Footer Products Links
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Packaging category links displayed under the Products column.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const links = [...(data.footer?.productLinks || [])];
                  links.push({ label: "New Product", href: "/products?category=custom" });
                  setData({
                    ...data,
                    footer: { ...data.footer, productLinks: links },
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product Link</span>
              </button>
            </div>

            <div className="w-full sm:w-72">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1">
                Column Heading Text
              </label>
              <input
                type="text"
                value={data.footer?.productsTitle || "PRODUCTS"}
                onChange={(e) =>
                  setData({
                    ...data,
                    footer: { ...data.footer, productsTitle: e.target.value },
                  })
                }
                placeholder="PRODUCTS"
                className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
              />
            </div>

            <div className="space-y-2.5">
              {(data.footer?.productLinks || []).map((link, lIdx) => (
                <div
                  key={lIdx}
                  className="p-3 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] flex items-center justify-center font-bold text-xs shrink-0">
                    {lIdx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label || ""}
                      onChange={(e) => {
                        const links = [...(data.footer?.productLinks || [])];
                        links[lIdx] = { ...links[lIdx], label: e.target.value };
                        setData({
                          ...data,
                          footer: { ...data.footer, productLinks: links },
                        });
                      }}
                      placeholder="Category (e.g. Corrugated Boxes)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />

                    <input
                      type="text"
                      value={link.href || ""}
                      onChange={(e) => {
                        const links = [...(data.footer?.productLinks || [])];
                        links[lIdx] = { ...links[lIdx], href: e.target.value };
                        setData({
                          ...data,
                          footer: { ...data.footer, productLinks: links },
                        });
                      }}
                      placeholder="URL (e.g. /products?category=...)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const links = (data.footer?.productLinks || []).filter((_, i) => i !== lIdx);
                      setData({
                        ...data,
                        footer: { ...data.footer, productLinks: links },
                      });
                    }}
                    className="p-1.5 text-[#687378] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 4: PLANT & OFFICE CONTACTS */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded">
                Column 4
              </span>
              <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-1">
                Plant &amp; Office Contacts
              </h2>
              <p className="text-xs text-[#687378] mt-0.5">
                Physical plant address, telephone, and email communication channels.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1">
                Column Heading Text
              </label>
              <input
                type="text"
                value={data.footer?.plantTitle || "PLANT & OFFICE"}
                onChange={(e) =>
                  setData({
                    ...data,
                    footer: { ...data.footer, plantTitle: e.target.value },
                  })
                }
                placeholder="PLANT & OFFICE"
                className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-lg text-xs font-bold text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Plant &amp; Factory Address</span>
                </label>
                <input
                  type="text"
                  value={data.footer?.address || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, address: e.target.value },
                    })
                  }
                  placeholder="Plot No. 42, Phase II GIDC Industrial Estate, Gujarat 382445, India"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  value={data.footer?.phone || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, phone: e.target.value },
                    })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Inquiry Email</span>
                </label>
                <input
                  type="email"
                  value={data.footer?.email || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, email: e.target.value },
                    })
                  }
                  placeholder="inquiry@aavritpackaging.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[#E97835]" />
                  <span>Google Maps Pin URL</span>
                </label>
                <input
                  type="text"
                  value={data.footer?.mapsUrl || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, mapsUrl: e.target.value },
                    })
                  }
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SUB-FOOTER: LEGAL & COPYRIGHT */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-[#E4DED3] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E97835] bg-[#E97835]/10 px-2 py-0.5 rounded">
                  Sub-Footer
                </span>
                <h2 className="font-heading font-bold text-lg text-[#202A2E] mt-1">
                  Copyright &amp; Legal Links
                </h2>
                <p className="text-xs text-[#687378] mt-0.5">
                  Bottom copyright statement and privacy policy links.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const links = [...(data.footer?.legalLinks || [])];
                  links.push({ label: "Disclaimer", href: "/disclaimer" });
                  setData({
                    ...data,
                    footer: { ...data.footer, legalLinks: links },
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#E97835] text-white text-xs font-bold hover:bg-[#d66a2a] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Legal Link</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                Copyright Statement
              </label>
              <input
                type="text"
                value={data.footer?.copyrightText || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    footer: { ...data.footer, copyrightText: e.target.value },
                  })
                }
                placeholder="© 2026 AAVRIT PACKAGING. All Rights Reserved."
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-xs text-[#202A2E] focus:ring-2 focus:ring-[#E97835] focus:outline-none"
              />
            </div>

            <div className="space-y-2.5">
              {(data.footer?.legalLinks || []).map((link, lIdx) => (
                <div
                  key={lIdx}
                  className="p-3 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#E97835]/10 text-[#E97835] flex items-center justify-center font-bold text-xs shrink-0">
                    {lIdx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label || ""}
                      onChange={(e) => {
                        const links = [...(data.footer?.legalLinks || [])];
                        links[lIdx] = { ...links[lIdx], label: e.target.value };
                        setData({
                          ...data,
                          footer: { ...data.footer, legalLinks: links },
                        });
                      }}
                      placeholder="Label (e.g. Privacy Policy)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />

                    <input
                      type="text"
                      value={link.href || ""}
                      onChange={(e) => {
                        const links = [...(data.footer?.legalLinks || [])];
                        links[lIdx] = { ...links[lIdx], href: e.target.value };
                        setData({
                          ...data,
                          footer: { ...data.footer, legalLinks: links },
                        });
                      }}
                      placeholder="URL (e.g. /privacy-policy)"
                      className="px-3 py-1.5 bg-white border border-[#E4DED3] rounded-lg text-xs text-[#202A2E] focus:ring-1 focus:ring-[#E97835] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const links = (data.footer?.legalLinks || []).filter((_, i) => i !== lIdx);
                      setData({
                        ...data,
                        footer: { ...data.footer, legalLinks: links },
                      });
                    }}
                    className="p-1.5 text-[#687378] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Save Bar */}
      <div className="sticky bottom-4 z-20 bg-[#FFFFFF] text-[#202A2E] p-4 rounded-2xl shadow-lg flex items-center justify-between border border-[#E4DED3]">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[#687378]">Ready to update:</span>
          <span className="text-[#E97835] font-bold font-mono">Site Management</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#E97835] hover:bg-[#d66a2a] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}
