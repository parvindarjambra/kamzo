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
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SecureAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      // Secure Admin Verification
      const validEmail = email.trim().toLowerCase();
      if (
        (validEmail === "admin@kamzo.pk" || validEmail === "kamzo.admin@gmail.com") &&
        (password === "KamzoAdmin@2026!" || password === "kamzoAdmin2026!" || password === "kamzo@2026")
      ) {
        if (typeof window !== "undefined") {
          localStorage.setItem("kamzo_admin_authenticated", "true");
          document.cookie = "kamzo_admin_auth=true; path=/; max-age=604800; SameSite=Lax";
        }
        router.push("/admin");
      } else {
        setError("Invalid admin email or password. Access denied.");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#0062FF] selection:text-white">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0062FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Site</span>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0062FF]" />
          <span>Restricted Admin Portal</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <div className="bg-[#0B132B]/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-[#0062FF]/40 shadow-2xl shadow-blue-500/20 bg-slate-900 transition-transform hover:scale-105">
              <img
                src="/logo.jpg"
                alt="KAMZO Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                KAMZO Control Center
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Authorized Personnel Only (صرف ایڈمنسٹریٹر کے لیے)
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Secure Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0062FF] focus:ring-1 focus:ring-[#0062FF] transition-colors placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0062FF] focus:ring-1 focus:ring-[#0062FF] transition-colors pr-10 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Login</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0062FF]" />
            <span>256-Bit SSL Encrypted Admin Session</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 z-10 py-2">
        © 2026 KAMZO Pakistan. All administrative actions are logged and audited.
      </div>
    </div>
  );
}
