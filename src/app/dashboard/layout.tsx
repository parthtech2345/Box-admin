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
} from "lucide-react";
import { HOME_SECTIONS_LIST } from "@/lib/defaultHomeData";
import { ABOUT_SECTIONS_LIST } from "@/lib/defaultAboutData";

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Sync dropdown states strictly with the active route
  useEffect(() => {
    setHomeDropdownOpen(Boolean(pathname?.includes("/dashboard/home-sections")));
    setAboutDropdownOpen(Boolean(pathname?.includes("/dashboard/about-sections")));
    setProductsDropdownOpen(Boolean(pathname?.includes("/dashboard/products")));
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
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/products/banner"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles
                          className={`w-3.5 h-3.5 shrink-0 ${
                            pathname === "/dashboard/products/banner"
                              ? "text-[#E97835]"
                              : "text-[#687378]"
                          }`}
                        />
                        <span className="truncate">Hero Banner & Mascot</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                          pathname === "/dashboard/products/banner"
                            ? "bg-[#E97835] text-white"
                            : "bg-[#E97835]/15 text-[#E97835]"
                        }`}
                      >
                        Banner/GIF
                      </span>
                    </Link>

                    {/* 2. Category */}
                    <Link
                      href="/dashboard/products/categories"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname === "/dashboard/products/categories"
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FolderKanban
                          className={`w-3.5 h-3.5 shrink-0 ${
                            pathname === "/dashboard/products/categories"
                              ? "text-[#E97835]"
                              : "text-[#687378]"
                          }`}
                        />
                        <span className="truncate">Categories</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#E4DED3]/60 text-[#687378]">
                        6 Main
                      </span>
                    </Link>

                    {/* 3. Sub Category / Products */}
                    <Link
                      href="/dashboard/products/items"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        pathname?.startsWith("/dashboard/products/items")
                          ? "bg-[#FFF6F0] text-[#E97835] font-bold border-l-4 border-[#E97835] shadow-2xs"
                          : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <PackageCheck
                          className={`w-3.5 h-3.5 shrink-0 ${
                            pathname?.startsWith("/dashboard/products/items")
                              ? "text-[#E97835]"
                              : "text-[#687378]"
                          }`}
                        />
                        <span className="truncate">Sub Categories / Products</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#E4DED3]/60 text-[#687378]">
                        30 Items
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3.5 border-t border-[#E4DED3] bg-[#FAF9F5] text-xs text-[#687378]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-[#202A2E]">MongoDB Sync</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Active
              </span>
            </div>
            <p className="text-[10px] text-[#847B70]">
              box-website database synced in real-time.
            </p>
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
