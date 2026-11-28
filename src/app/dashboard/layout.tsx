"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  LayoutDashboard,
  Home as HomeIcon,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LogOut,
  PlaySquare,
  Building2,
  Boxes,
  ShieldCheck,
  Sliders,
  Factory,
  Layers,
  Briefcase,
  Layers3,
  Leaf,
  Handshake,
  MessageSquareQuote,
  HelpCircle,
  Sparkles,
  Database,
  Menu,
  X,
  CheckCircle2,
  TrendingUp,
  Compass,
  Users,
  Info,
  FolderKanban,
  PackageCheck,
  ShoppingBag,
  Calculator,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquareText,
  Globe,
  BookOpen,
  FileText,
  Cpu,
} from "lucide-react";
import { HOME_SECTIONS_LIST } from "@/lib/defaultHomeData";
import { ABOUT_SECTIONS_LIST } from "@/lib/defaultAboutData";
import { CUSTOM_PACKAGING_SECTIONS_LIST } from "@/lib/defaultCustomPackagingData";

// Icon mapping helper
const ICON_MAP: Record<string, React.ElementType> = {
  PlaySquare,
  Building2,
  Boxes,
  ShieldCheck,
  Sliders,
  Factory,
  Layers,
  Briefcase,
  Layers3,
  Leaf,
  Handshake,
  MessageSquareQuote,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Compass,
  Users,
  Info,
  Calculator,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Dropdown is ONLY open if the user is currently on that section
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/home-sections"))
  );
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/about-sections"))
  );
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/products"))
  );
  const [customPackagingDropdownOpen, setCustomPackagingDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/custom-packaging"))
  );
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/industries"))
  );
  const [contactDropdownOpen, setContactDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/contact"))
  );
  const [blogsDropdownOpen, setBlogsDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/blogs"))
  );
  const [machineryDropdownOpen, setMachineryDropdownOpen] = useState(
    () => Boolean(pathname?.includes("/dashboard/machinery"))
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Sync dropdown states strictly with the active route
  useEffect(() => {
    setHomeDropdownOpen(Boolean(pathname?.includes("/dashboard/home-sections")));
    setAboutDropdownOpen(Boolean(pathname?.includes("/dashboard/about-sections")));
    setProductsDropdownOpen(Boolean(pathname?.includes("/dashboard/products")));
    setCustomPackagingDropdownOpen(Boolean(pathname?.includes("/dashboard/custom-packaging")));
    setIndustriesDropdownOpen(Boolean(pathname?.includes("/dashboard/industries")));
    setContactDropdownOpen(Boolean(pathname?.includes("/dashboard/contact")));
    setBlogsDropdownOpen(Boolean(pathname?.includes("/dashboard/blogs")));
    setMachineryDropdownOpen(Boolean(pathname?.includes("/dashboard/machinery")));
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col text-[#202A2E]">
      {/* Top Navbar */}
      <header className="h-16 bg-[#FFFFFF] text-[#202A2E] border-b border-[#E4DED3] sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-[#687378] hover:bg-[#F5F2EB] transition-colors"
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E97835] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tracking-tight text-[#202A2E]">
                  Aavrit Packaging
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E97835]/15 text-[#E97835] uppercase tracking-wider border border-[#E97835]/25">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-[#687378] hidden sm:block">
                Industrial Packaging Dynamic Content CMS
              </p>
            </div>
          </Link>
        </div>

        {/* Right Navbar Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#202A2E]">Admin User</div>
              <div className="text-[10px] text-[#E97835] font-semibold">Super Administrator</div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign Out"
              className="p-2 rounded-lg bg-[#F5F2EB] hover:bg-red-50 hover:text-red-600 text-[#687378] border border-[#E4DED3] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-40 w-72 bg-[#FFFFFF] border-r border-[#E4DED3] flex flex-col justify-between transition-transform duration-200 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:shrink-0 md:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Scrollable Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* General Section */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#687378] px-3 mb-2">
                Core Navigation
              </div>
              <nav className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname === "/dashboard"
                    ? "bg-[#E97835] text-white shadow-xs"
                    : "text-[#202A2E] hover:bg-[#F5F2EB]"
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard Overview</span>
                </Link>

                <Link
                  href="/dashboard/management"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname === "/dashboard/management"
                    ? "bg-[#E97835] text-white shadow-xs"
                    : "text-[#202A2E] hover:bg-[#F5F2EB]"
                    }`}
                >
                  <Sliders className="w-4 h-4 shrink-0" />
                  <span>Management</span>
                </Link>
              </nav>
            </div>

            {/* Home Dynamic Content Dropdown Section */}
            <div>


              {/* Collapsible Home Section Dropdown */}
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <HomeIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Home Section</span>
                  </div>
                  {homeDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List from Hero to CTA */}
                {homeDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto">
                    {HOME_SECTIONS_LIST.map((sec, index) => {
                      const IconComponent = ICON_MAP[sec.icon] || Boxes;
                      const active = pathname === `/dashboard/home-sections/${sec.id}`;
                      const isHero = sec.id === "hero";

                      return (
                        <Link
                          key={sec.id}
                          href={`/dashboard/home-sections/${sec.id}`}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${active
                            ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                            : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`text-[10px] font-mono shrink-0 w-4 text-center ${active ? "text-[#E97835] font-bold" : "text-[#A0ACB2]"
                                }`}
                            >
                              {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <IconComponent
                              className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#E97835]" : "text-[#687378]"
                                }`}
                            />
                            <span className="truncate">{sec.name}</span>
                          </div>

                          {isHero && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${active
                                ? "bg-[#E97835] text-white"
                                : "bg-[#E97835]/15 text-[#E97835]"
                                }`}
                            >
                              Video/Img
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* About Us Dynamic Content Dropdown Section */}
            <div>


              {/* Collapsible About Section Dropdown */}
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <Info className="w-3.5 h-3.5" />
                    </div>
                    <span>About Section</span>
                  </div>
                  {aboutDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List for About Us */}
                {aboutDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto">
                    {ABOUT_SECTIONS_LIST.map((sec, index) => {
                      const IconComponent = ICON_MAP[sec.icon] || Building2;
                      const active = pathname === `/dashboard/about-sections/${sec.id}`;

                      return (
                        <Link
                          key={sec.id}
                          href={`/dashboard/about-sections/${sec.id}`}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${active
                              ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                              : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                            }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`text-[10px] font-mono shrink-0 w-4 text-center ${active ? "text-[#E97835] font-bold" : "text-[#A0ACB2]"
                                }`}
                            >
                              {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <IconComponent
                              className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#E97835]" : "text-[#687378]"
                                }`}
                            />
                            <span className="truncate">{sec.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Product Dynamic Content Dropdown Section */}
            <div>
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <span>Product Section</span>
                  </div>
                  {productsDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List for Products */}
                {productsDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5">
                    {/* 1. Hero Banner & Mascot */}
                    <Link
                      href="/dashboard/products/banner"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/products/banner"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/products/banner"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Hero Banner & Mascot</span>
                    </Link>

                    {/* 2. Category */}
                    <Link
                      href="/dashboard/products/categories"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/products/categories"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <FolderKanban
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/products/categories"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Categories</span>
                    </Link>

                    {/* 3. Sub Category / Products */}
                    <Link
                      href="/dashboard/products/items"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname?.startsWith("/dashboard/products/items")
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <PackageCheck
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname?.startsWith("/dashboard/products/items")
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Sub Categories / Products</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Packaging Dynamic Content Dropdown Section */}
            <div>
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setCustomPackagingDropdownOpen(!customPackagingDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <Boxes className="w-3.5 h-3.5" />
                    </div>
                    <span>Custom Packaging Section</span>
                  </div>
                  {customPackagingDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List for Custom Packaging */}
                {customPackagingDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5">
                    {CUSTOM_PACKAGING_SECTIONS_LIST.map((sec) => {
                      const Icon = ICON_MAP[sec.icon] || Boxes;
                      const href = `/dashboard/custom-packaging/${sec.id}`;
                      const isActive = pathname === href;

                      return (
                        <Link
                          key={sec.id}
                          href={href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                            isActive
                              ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                              : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                          }`}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? "text-[#E97835]" : "text-[#687378]"
                            }`}
                          />
                          <span className="truncate">{sec.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Industries Dynamic Content Dropdown Section */}
            <div>
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setIndustriesDropdownOpen(!industriesDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <Factory className="w-3.5 h-3.5" />
                    </div>
                    <span>Industries Section</span>
                  </div>
                  {industriesDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List for Industries */}
                {industriesDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5">
                    {/* 1. Hero Banner & Mascot */}
                    <Link
                      href="/dashboard/industries/banner"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/industries/banner"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/industries/banner"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Hero Banner & Mascot</span>
                    </Link>

                    {/* 2. Landing Page Content */}
                    <Link
                      href="/dashboard/industries/landing"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/industries/landing"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Layers
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/industries/landing"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Landing Page Content</span>
                    </Link>

                    {/* 3. All Industries & SEO */}
                    <Link
                      href="/dashboard/industries/items"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname?.startsWith("/dashboard/industries/items")
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Building2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname?.startsWith("/dashboard/industries/items")
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">All Industries & SEO</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Dynamic Content Dropdown Section */}
            <div>
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setContactDropdownOpen(!contactDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span>Contact Section</span>
                  </div>
                  {contactDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List for Contact Page */}
                {contactDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5">
                    {/* 1. Hero Banner & Mascot */}
                    <Link
                      href="/dashboard/contact/banner"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/contact/banner"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/contact/banner"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Hero Banner & Mascot</span>
                    </Link>

                    {/* 2. Contact Information Cards */}
                    <Link
                      href="/dashboard/contact/info-cards"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/contact/info-cards"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Phone
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/contact/info-cards"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Contact Information Cards</span>
                    </Link>

                    {/* 3. Contact Form & Showcase */}
                    <Link
                      href="/dashboard/contact/inquiry-form"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/contact/inquiry-form"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Send
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/contact/inquiry-form"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Contact Form & Showcase</span>
                    </Link>

                    {/* 4. Plant Map & Accessibility */}
                    <Link
                      href="/dashboard/contact/location-map"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/contact/location-map"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/contact/location-map"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Plant Map & Directions</span>
                    </Link>

                    {/* 5. Why Connect Cards */}
                    <Link
                      href="/dashboard/contact/why-connect"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/contact/why-connect"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <MessageSquareText
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/contact/why-connect"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Why Connect Cards</span>
                    </Link>

                    {/* 6. Contact FAQs */}
                    <Link
                      href="/dashboard/contact/faqs"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/contact/faqs"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <HelpCircle
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/contact/faqs"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Contact FAQs</span>
                    </Link>

                    {/* 7. SEO Optimization */}
                    <Link
                      href="/dashboard/contact/seo"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/contact/seo"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Globe
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/contact/seo"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">SEO Optimization</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Blogs Dynamic Content Dropdown Section */}
            <div>
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setBlogsDropdownOpen(!blogsDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span>Blogs Section</span>
                  </div>
                  {blogsDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List for Blogs */}
                {blogsDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5">
                    {/* 1. Hero Banner & Mascot */}
                    <Link
                      href="/dashboard/blogs/banner"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/blogs/banner"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/blogs/banner"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Hero Banner &amp; Mascot</span>
                    </Link>

                    {/* 2. All Articles & Content */}
                    <Link
                      href="/dashboard/blogs/articles"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname?.startsWith("/dashboard/blogs/articles")
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <FileText
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname?.startsWith("/dashboard/blogs/articles")
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">All Articles &amp; Content</span>
                    </Link>

                    {/* 3. Listing CTA Banner */}
                    <Link
                      href="/dashboard/blogs/cta"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/blogs/cta"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <MessageSquareText
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/blogs/cta"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Listing CTA Banner</span>
                    </Link>

                    {/* 4. SEO Optimization */}
                    <Link
                      href="/dashboard/blogs/seo"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/blogs/seo"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Globe
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/blogs/seo"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">SEO Optimization</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Machinery Dynamic Content Dropdown Section */}
            <div>
              <div className="rounded-xl border border-[#E4DED3] overflow-hidden bg-[#FAF9F5]">
                <button
                  type="button"
                  onClick={() => setMachineryDropdownOpen(!machineryDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#202A2E] hover:bg-[#F5F2EB] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <span>Machinery Section</span>
                  </div>
                  {machineryDropdownOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#687378]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#687378]" />
                  )}
                </button>

                {/* Dropdown Items List for Machinery */}
                {machineryDropdownOpen && (
                  <div className="border-t border-[#E4DED3] bg-[#FFFFFF] py-1 px-1.5 space-y-0.5">
                    {/* 1. Hero Banner & Mascot */}
                    <Link
                      href="/dashboard/machinery/banner"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/machinery/banner"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/machinery/banner"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Hero Banner &amp; Mascot</span>
                    </Link>

                    {/* 2. Plant Intro & Highlights */}
                    <Link
                      href="/dashboard/machinery/intro"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/machinery/intro"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Layers
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/machinery/intro"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Plant Intro &amp; Highlights</span>
                    </Link>

                    {/* 3. All Machinery & Detail Editor */}
                    <Link
                      href="/dashboard/machinery/items"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname?.startsWith("/dashboard/machinery/items")
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Cpu
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname?.startsWith("/dashboard/machinery/items")
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">All Machinery &amp; Details</span>
                    </Link>

                    {/* 4. Operational Advantage */}
                    <Link
                      href="/dashboard/machinery/why-matters"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/machinery/why-matters"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <ShieldCheck
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/machinery/why-matters"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Operational Advantage</span>
                    </Link>

                    {/* 5. Consultation CTA */}
                    <Link
                      href="/dashboard/machinery/cta"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/machinery/cta"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <MessageSquareText
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/machinery/cta"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">Consultation CTA</span>
                    </Link>

                    {/* 6. SEO Optimization */}
                    <Link
                      href="/dashboard/machinery/seo"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/machinery/seo"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <Globe
                        className={`w-3.5 h-3.5 shrink-0 ${
                          pathname === "/dashboard/machinery/seo"
                            ? "text-[#E97835]"
                            : "text-[#687378]"
                        }`}
                      />
                      <span className="truncate">SEO Optimization</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Footer - Company Brand & Motto */}
          <div className="p-3.5 border-t border-[#E4DED3] bg-[#FAF9F5]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-md bg-[#E97835]/15 text-[#E97835] flex items-center justify-center">
                <Package className="w-3 h-3" />
              </div>
              <span className="font-heading font-bold text-xs text-[#202A2E]">
                Aavrit Packaging
              </span>
            </div>
            <p className="text-[11px] text-[#687378] leading-relaxed">
              Precision German corrugation engineering &amp; heavy-duty industrial box manufacturing.
            </p>
            <div className="flex items-center justify-between text-[10px] text-[#8C7E72] mt-2 pt-2 border-t border-[#E4DED3]/70">
              <span className="font-medium">Quality &bull; Protection &bull; Speed</span>
              <span className="font-mono text-[#A0ACB2]">v2.4</span>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        {/* Right Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
