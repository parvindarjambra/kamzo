"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if already logged in, or pre-fill saved credentials
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("kamzo_admin_authenticated") === "true";
      const hasCookie = document.cookie.includes("kamzo_admin_auth=true");
      
      // If already logged in, redirect directly to /admin
      if (isAuth && hasCookie) {
        router.push("/admin");
        return;
      }

      // Pre-fill saved credentials if remembered
      const savedEmail = localStorage.getItem("kamzo_admin_saved_email");
      const savedPass = localStorage.getItem("kamzo_admin_saved_password");
      const savedRemember = localStorage.getItem("kamzo_admin_remember");

      if (savedEmail) setEmail(savedEmail);
      if (savedPass) setPassword(savedPass);
      if (savedRemember !== null) setRememberMe(savedRemember === "true");
    }
  }, [router]);

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
          // 1-Year Persistent Cookie (31,536,000 seconds = 365 days)
          document.cookie = "kamzo_admin_auth=true; path=/; max-age=31536000; SameSite=Lax";

          if (rememberMe) {
            localStorage.setItem("kamzo_admin_saved_email", validEmail);
            localStorage.setItem("kamzo_admin_saved_password", password);
            localStorage.setItem("kamzo_admin_remember", "true");
          } else {
            localStorage.removeItem("kamzo_admin_saved_email");
            localStorage.removeItem("kamzo_admin_saved_password");
            localStorage.removeItem("kamzo_admin_remember");
          }
        }
        router.push("/admin");
      } else {
        setError("Invalid admin email or password. Access denied.");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#16A34A] selection:text-white">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#16A34A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Site</span>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Restricted Admin Portal</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <div className="bg-[#0B132B]/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/30 transition-transform hover:scale-105">
              <img
                src="/logo.png"
                alt="KAMZO Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                KAM<span className="text-[#16A34A]">ZO</span> Control Center
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                SERVICES MARKETPLACE
              </p>
              <p className="text-xs text-emerald-400 font-medium mt-1">
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
                <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-colors placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-colors pr-10 placeholder:text-slate-500"
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

            {/* Remember Me / Save Credentials */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#16A34A] focus:ring-0 bg-black/40 border-slate-700 cursor-pointer accent-[#16A34A]"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Save Password & Keep Signed In (پاسورڈ محفوظ رکھیں)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
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
