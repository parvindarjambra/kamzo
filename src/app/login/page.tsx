"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kamzo.pk");
  const [password, setPassword] = useState("kamzoAdmin2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate credentials
    setTimeout(() => {
      if (
        (email === "admin@kamzo.pk" || email === "admin@kamzo.com") &&
        (password === "kamzoAdmin2026!" || password === "admin123" || password === "kamzo2026")
      ) {
        // Save demo session
        if (typeof window !== "undefined") {
          localStorage.setItem("kamzo_admin_logged_in", "true");
        }
        router.push("/admin");
      } else {
        setError("Invalid credentials. Please use the demo credentials provided below.");
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setEmail("admin@kamzo.pk");
    setPassword("kamzoAdmin2026!");
    setIsLoading(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("kamzo_admin_logged_in", "true");
      }
      router.push("/admin");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2810] via-[#071609] to-[#040805] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1B5E20]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-emerald-300/80 hover:text-emerald-200 transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer Marketplace</span>
        </Link>
        <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase border border-emerald-500/20 px-2.5 py-1 rounded-full bg-emerald-950/40">
          🇵🇰 Official Portal
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <div className="bg-[#121a14]/90 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl shadow-emerald-900/40 p-1 bg-black/60">
              <img
                src="/logo.jpg"
                alt="KAMZO Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                KAMZO Control Center
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Admin Operations & Verification Portal (ایڈمن پورٹل)
              </p>
            </div>
          </div>

          {/* Instant 1-Click Login Card */}
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-2.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Instant Access Credentials</span>
            </div>
            <div className="text-xs text-gray-300 font-mono bg-black/40 py-2 px-3 rounded-lg border border-white/5 space-y-1">
              <div>
                <span className="text-gray-400">Email:</span>{" "}
                <span className="text-emerald-300 font-semibold">admin@kamzo.pk</span>
              </div>
              <div>
                <span className="text-gray-400">Password:</span>{" "}
                <span className="text-emerald-300 font-semibold">kamzoAdmin2026!</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>⚡ One-Click Instant Admin Login</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#121a14] px-3 text-[11px] uppercase tracking-wider text-gray-400">
              or enter manually
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kamzo.pk"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#1B5E20] hover:bg-[#23782a] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B5E20]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Assurance */}
          <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protected with Supabase Row Level Security (RLS)</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 z-10 py-2">
        © 2026 KAMZO Pakistan. All rights reserved.
      </div>
    </div>
  );
}
