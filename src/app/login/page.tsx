"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials. Please verify your login details.");
      }
    } catch (err: any) {
      setError("Network or server error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F2EB] relative overflow-hidden px-4 py-12">
      {/* Background Decorative Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D1B48C]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#E97835]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#202A2E 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#202A2E] text-[#D1B48C] shadow-lg shadow-[#202A2E]/20 mb-4 border border-[#E4DED3]">
            <Package className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1B48C]/20 border border-[#D1B48C]/40 mb-3 text-[11px] font-bold uppercase tracking-widest text-[#845B32]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Gateway</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#202A2E] tracking-tight">
            Aavrit Packaging
          </h1>
          <p className="text-sm text-[#687378] mt-1 font-medium">
            Homepage Content Management & Operations
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-2xl p-7 sm:p-9 shadow-xl shadow-[#202A2E]/5 relative">
          <div className="border-b border-[#E4DED3] pb-5 mb-6">
            <h2 className="font-heading font-bold text-lg text-[#202A2E]">
              Sign in to Dashboard
            </h2>
            <p className="text-xs text-[#687378] mt-0.5">
              Enter your administrative credentials to manage live website sections.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E] mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#687378]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-sm text-[#202A2E] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D1B48C] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#202A2E]">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#687378]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F5] border border-[#E4DED3] rounded-xl text-sm text-[#202A2E] placeholder-[#A0988A] focus:outline-none focus:ring-2 focus:ring-[#D1B48C] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#687378] hover:text-[#202A2E] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Hint */}
            <div className="p-3 bg-[#F5F2EB]/70 border border-[#E4DED3] rounded-xl text-[11px] text-[#687378] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#202A2E]">Default Access: </span>
                <span className="font-mono text-[#845B32]">admin / password123</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsername("admin");
                  setPassword("password123");
                }}
                className="text-[11px] font-bold text-[#E97835] hover:underline"
              >
                Autofill
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#202A2E] hover:bg-[#2b383e] active:scale-[0.99] text-[#FFFFFF] font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Database Info Pill */}
          <div className="mt-6 pt-5 border-t border-[#E4DED3] flex items-center justify-between text-[11px] text-[#687378]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database: <strong className="text-[#202A2E] font-medium">MongoDB Connected</strong></span>
            </div>
            <span className="font-mono">v1.0.0</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-[#847B70] mt-6">
          &copy; {new Date().getFullYear()} Aavrit Corrugated Packaging. All rights reserved.
        </p>
      </div>
    </div>
  );
}
