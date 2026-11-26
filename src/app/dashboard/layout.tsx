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
} from "lucide-react";
import { HOME_SECTIONS_LIST } from "@/lib/defaultHomeData";

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
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Automatically keep Home dropdown open if user is browsing a home section
  useEffect(() => {
    if (pathname.includes("/dashboard/home-sections")) {
      setHomeDropdownOpen(true);
    }
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
      <header className="h-16 bg-[#202A2E] text-[#FFFFFF] border-b border-[#2C383D] sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-[#D1B48C] hover:bg-[#2C383D] transition-colors"
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#D1B48C] text-[#202A2E] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tracking-tight text-[#FFFFFF]">
                  Aavrit Packaging
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#D1B48C]/20 text-[#D1B48C] uppercase tracking-wider border border-[#D1B48C]/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-[#A0ACB2] hidden sm:block">
                Industrial Packaging Dynamic Content CMS
              </p>
            </div>
          </Link>
        </div>

        {/* Right Navbar Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Website Link */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C383D] hover:bg-[#38484E] text-[#D1B48C] text-xs font-semibold border border-[#38484E] transition-all"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Database Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#182023] border border-[#2C383D] text-[11px] text-[#A0ACB2]">
            <Database className="w-3 h-3 text-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MongoDB Connected</span>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#2C383D]">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#FFFFFF]">Admin User</div>
              <div className="text-[10px] text-[#D1B48C]">Super Administrator</div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign Out"
              className="p-2 rounded-lg bg-[#2C383D] hover:bg-red-950/60 hover:text-red-400 text-[#A0ACB2] transition-colors flex items-center gap-1.5 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-16 left-0 z-40 w-72 bg-[#FFFFFF] border-r border-[#E4DED3] flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    pathname === "/dashboard"
                      ? "bg-[#202A2E] text-[#D1B48C] shadow-sm"
                      : "text-[#202A2E] hover:bg-[#F5F2EB]"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard Overview</span>
                </Link>
              </nav>
            </div>

            {/* Home Dynamic Content Dropdown Section */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#687378] px-3 mb-2 flex items-center justify-between">
                <span>Homepage CMS</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D1B48C]/30 text-[#845B32] font-bold">
                  14 Sections
                </span>
              </div>

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
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                            active
                              ? "bg-[#202A2E] text-[#D1B48C] font-semibold"
                              : "text-[#202A2E] hover:bg-[#F5F2EB] font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`text-[10px] font-mono shrink-0 w-4 text-center ${
                                active ? "text-[#D1B48C]" : "text-[#A0ACB2]"
                              }`}
                            >
                              {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <IconComponent
                              className={`w-3.5 h-3.5 shrink-0 ${
                                active ? "text-[#D1B48C]" : "text-[#687378]"
                              }`}
                            />
                            <span className="truncate">{sec.name}</span>
                          </div>

                          {isHero && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                                active
                                  ? "bg-[#D1B48C] text-[#202A2E]"
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
