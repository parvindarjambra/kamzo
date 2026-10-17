"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Snowflake,
  Droplets,
  Zap,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Wallet,
  Users,
  X,
  FileCheck,
  Moon,
  Sun,
  ArrowUp,
  MessageCircle,
  HelpCircle,
  Award,
  PhoneCall,
  Lock,
} from "lucide-react";

interface ServiceData {
  id: string;
  name: string;
  urduName: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  description: string;
  inspectionFee: string;
  popularItems: string[];
}

const services: ServiceData[] = [
  {
    id: "mechanic",
    name: "Auto Mechanic",
    urduName: "آٹو مکینک",
    category: "Automobile & Roadside",
    icon: Wrench,
    color: "#E11D48", // Rose Red
    badgeBg: "bg-rose-50 text-rose-600 border-rose-200",
    description: "Expert car diagnostics, engine tuning, brake repairs, oil change, suspension, and emergency roadside breakdown support.",
    inspectionFee: "Rs. 200",
    popularItems: ["Engine Noise & Overheating", "Brake Pad Replacement", "Oil & Filter Service", "Emergency Breakdown"],
  },
  {
    id: "ac_repair",
    name: "AC Repair & Service",
    urduName: "اے سی سروس و ریپیئر",
    category: "Cooling & Inverter PCB",
    icon: Snowflake,
    color: "#0284C7", // Sky Blue
    badgeBg: "bg-sky-50 text-sky-600 border-sky-200",
    description: "Inverter AC diagnostics, deep master wash chemical cleaning, gas leakage detection, R410/R32 refill, and new installation.",
    inspectionFee: "Rs. 200",
    popularItems: ["Low or No Cooling", "Gas Leakage & Refill", "Water Dripping Inside", "Inverter PCB Error"],
  },
  {
    id: "plumber",
    name: "Plumbing Services",
    urduName: "پلمبر سروس",
    category: "Leakage & Sanitary",
    icon: Droplets,
    color: "#0062FF", // STC Electric Blue
    badgeBg: "bg-blue-50 text-[#0062FF] border-blue-200",
    description: "Concealed pipeline leak detection, motor water pump installation, bathroom sanitary fittings, drain unblocking, and geyser setup.",
    inspectionFee: "Rs. 200",
    popularItems: ["Underground Pipe Leaks", "Water Motor / Pump Repair", "Blocked Drain Cleaning", "Tap & Mixer Fitting"],
  },
  {
    id: "electrician",
    name: "Electrician Services",
    urduName: "الیکٹریشن سروس",
    category: "Wiring & Breakers",
    icon: Zap,
    color: "#D97706", // Amber
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    description: "Short circuit troubleshooting, distribution box breakers, ceiling fan & chandelier installation, UPS & solar inverter wiring.",
    inspectionFee: "Rs. 200",
    popularItems: ["Main Breaker Tripping", "Short Circuit Detection", "UPS / Solar Inverter Setup", "Switchboard Wiring"],
  },
];

// STC Style Circular Badges (from the user's screenshot)
const circularBadges = [
  { label: "Mechanic", urdu: "مکینک", icon: Wrench, color: "text-rose-500", bg: "bg-rose-50" },
  { label: "AC Repair", urdu: "اے سی", icon: Snowflake, color: "text-sky-500", bg: "bg-sky-50" },
  { label: "Plumber", urdu: "پلمبر", icon: Droplets, color: "text-[#0062FF]", bg: "bg-blue-50" },
  { label: "Electrician", urdu: "الیکٹریشن", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "CNIC Verified", urdu: "تصدیق شدہ", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Flat Rs. 200", urdu: "فیس", icon: Wallet, color: "text-indigo-500", bg: "bg-indigo-50" },
  { label: "JazzCash", urdu: "جاز کیش", icon: CheckCircle2, color: "text-red-500", bg: "bg-red-50" },
  { label: "Easypaisa", urdu: "ایزی پیسہ", icon: Award, color: "text-green-500", bg: "bg-green-50" },
];

const pakistaniCities = [
  "Lahore (لاہور)",
  "Karachi (کراچی)",
  "Islamabad (اسلام آباد)",
  "Rawalpindi (راولپنڈی)",
  "Faisalabad (فیصل آباد)",
  "Multan (ملتان)",
  "Peshawar (پشاور)",
  "Gujranwala (گوجرانوالہ)",
  "Sialkot (سیالکوٹ)",
  "Quetta (کوئٹہ)",
];

export default function STCStyleMarketplacePage() {
  const [selectedService, setSelectedService] = useState<ServiceData>(services[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "confirmed">("form");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState(pakistaniCities[0]);
  const [problemDetail, setProblemDetail] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenBooking = (service?: ServiceData) => {
    if (service) setSelectedService(service);
    setBookingStep("form");
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = "KMZ-" + Math.floor(100000 + Math.random() * 900000);
    setConfirmedBookingId(randomId);
    setBookingStep("confirmed");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0B132B] text-slate-100" : "bg-white text-[#0A1128]"} font-sans transition-colors duration-200 selection:bg-[#0062FF] selection:text-white relative`}>
      {/* ─── STC DEVELOPER STYLE NAVBAR ─── */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? "bg-[#0B132B]/90 border-slate-800" : "bg-white/95 border-slate-100"} backdrop-blur-md border-b transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand matching STC Developer style */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full overflow-hidden shadow-md shadow-blue-500/10 border-2 border-[#0062FF]/20 p-0.5 bg-black transition-transform group-hover:scale-105">
              <img
                src="/logo.jpg"
                alt="KAMZO Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                KAMZO
              </span>
              <span className="text-2xl font-black text-[#0062FF]">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links (STC Developer Header Links) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link
              href="/"
              className="text-[#0062FF] relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0062FF] font-bold"
            >
              Home
            </Link>
            <a href="#services" className="hover:text-[#0062FF] transition-colors">
              Services
            </a>
            <a href="#specialise" className="hover:text-[#0062FF] transition-colors">
              Technologies & Trades
            </a>
            <a href="#benefits" className="hover:text-[#0062FF] transition-colors">
              Benefits
            </a>
            <a href="#how-it-works" className="hover:text-[#0062FF] transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-[#0062FF] transition-colors">
              Visit Fee (Rs. 200)
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3.5">
            {/* Dark Mode Moon/Sun Toggle from STC Screenshot */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Dark Mode"
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDarkMode
                  ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Portal Direct Button */}
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#0062FF] border border-slate-200 hover:border-[#0062FF] rounded-xl transition-all shadow-sm bg-white hover:bg-blue-50/50 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#0062FF]" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>

            {/* Primary Action Button in STC Electric Blue */}
            <button
              onClick={() => handleOpenBooking()}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#0062FF] hover:bg-[#0052D9] text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Book a Worker</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
        {/* Soft radial background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* STC Style Tiny Uppercase Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0062FF] text-xs font-extrabold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>PAKISTAN&apos;S #1 ON-DEMAND SERVICE MARKETPLACE</span>
              </div>

              {/* Main Headline */}
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.14] ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                Certified Local Service Experts Near You.
                <span className="block text-[#0062FF] mt-1">
                  آپ کی ضرورت، ہمارے ماہر کاریگر۔
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Connect with verified local mechanics, AC technicians, plumbers, and electricians across Pakistan.
                Transparent flat <strong className={`${isDarkMode ? "text-white" : "text-slate-900"} font-bold`}>Rs. 200 visit/inspection fee</strong> and pay cash directly after satisfactory completion.
              </p>

              {/* Quick Interactive Booking Card */}
              <div className={`${isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/80"} rounded-2xl p-4 sm:p-5 shadow-xl shadow-blue-900/5 border max-w-xl mx-auto lg:mx-0 text-left space-y-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0062FF]">
                    Select Service (سروس منتخب کریں):
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Visit Fee: <strong className="text-[#0062FF]">Rs. 200</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {services.map((srv) => {
                    const isSelected = selectedService.id === srv.id;
                    const Icon = srv.icon;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-[#0062FF] text-white border-[#0062FF] shadow-md shadow-blue-500/20 font-bold"
                            : isDarkMode
                            ? "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#0062FF]"}`} />
                        <span className="text-xs font-bold leading-tight">{srv.name.split(" ")[0]}</span>
                        <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                          {srv.urduName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <div className={`w-full sm:flex-1 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"} border rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-slate-700`}>
                    <MapPin className="w-4 h-4 text-[#0062FF] shrink-0" />
                    <span className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"} truncate`}>
                      {selectedCity}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">Nearby</span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(selectedService)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>Book {selectedService.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>4.9/5.0</span>
                  <span className="text-xs text-slate-400">(2,100+ Reviews)</span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Users className="w-4 h-4 text-[#0062FF]" />
                  <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>320+ Active Technicians</span>
                </div>
              </div>
            </div>

            {/* Right Image Showcase Column (User's Technicians Image in STC frame) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className={`rounded-3xl overflow-hidden shadow-2xl border-4 ${isDarkMode ? "border-slate-800" : "border-white"} shadow-blue-950/15 bg-slate-100 group relative`}>
                  <img
                    src="/services-grid.jpg"
                    alt="KAMZO Certified Pakistani Technicians - Electrician, Plumber, AC Repair, Mechanic"
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-[#0062FF] animate-ping" />
                        <div>
                          <p className="text-xs font-bold text-white">
                            Certified Pakistani Technicians
                          </p>
                          <p className="text-[10px] text-blue-200">
                            Mechanic • AC Repair • Plumber • Electrician
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#0062FF] px-2.5 py-1 rounded-md text-white shadow-sm">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating STC Badge 1 */}
                <div className={`absolute -top-4 -left-4 ${isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"} rounded-2xl p-3 shadow-xl border flex items-center gap-2.5 hidden sm:flex`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0062FF]">
                    <ShieldCheck className="w-6 h-6 text-[#0062FF]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Security Check</p>
                    <p className="text-xs font-bold">100% CNIC Verified</p>
                  </div>
                </div>

                {/* Floating STC Badge 2 */}
                <div className={`absolute -bottom-4 -right-4 ${isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"} rounded-2xl p-3 shadow-xl border flex items-center gap-2.5 hidden sm:flex`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0062FF]">
                    <Wallet className="w-5 h-5 text-[#0062FF]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Standard Visit Fee</p>
                    <p className="text-xs font-bold text-[#0062FF]">Flat Rs. 200 Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STC DEVELOPER STYLE: "STACK" CIRCULAR ICONS SECTION ─── */}
      <section className={`py-14 border-t border-b ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/70 border-slate-100"}`} id="specialise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* STC Uppercase Subtitle */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
              TRADES & TECHNOLOGY
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              Services We Specialise In
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-normal">
              Our certified technicians deliver high-performance solutions using state-of-the-art tools and equipment.
            </p>
          </div>

          {/* STC Floating Circular Tech Pills (Exactly like JS, React, Node circles!) */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap pt-4">
            {circularBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1"
                >
                  <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full ${isDarkMode ? "bg-slate-800 border-slate-700 shadow-slate-950/40" : "bg-white border-slate-100 shadow-slate-200/60"} border shadow-lg flex items-center justify-center transition-all group-hover:border-[#0062FF]/40 group-hover:shadow-xl`}>
                    <Icon className={`w-8 h-8 ${badge.color} transition-transform group-hover:scale-110`} />
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {badge.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium -mt-1">
                    {badge.urdu}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DETAILED 4 SERVICES CARDS (STC STYLE) ─── */}
      <section className="py-20" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
              CORE SERVICES
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              Comprehensive On-Demand Solutions
            </h2>
            <p className="text-sm text-slate-500">
              Select your required category and get an immediate verified expert at your location.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className={`${isDarkMode ? "bg-slate-900 border-slate-800 hover:border-[#0062FF]/50" : "bg-white border-slate-200/80 hover:border-[#0062FF]/40"} rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-blue-50"} text-[#0062FF] flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-[#0062FF]" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                        Fee: {srv.inspectionFee}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"} group-hover:text-[#0062FF] transition-colors`}>
                        {srv.name}
                      </h3>
                      <p className="text-xs font-bold text-[#0062FF]">{srv.urduName}</p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{srv.category}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {srv.description}
                    </p>

                    {/* Common Repairs */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Common Issues:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {srv.popularItems.map((issue, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded-md ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"} font-medium`}
                          >
                            • {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenBooking(srv)}
                      className="w-full py-2.5 px-4 bg-blue-50 group-hover:bg-[#0062FF] text-[#0062FF] group-hover:text-white font-bold text-xs rounded-xl border border-blue-200 group-hover:border-[#0062FF] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Book {srv.name.split(" ")[0]} Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STC STYLE: "BENEFITS" SECTION (from screenshot bottom) ─── */}
      <section className={`py-20 border-t ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/60 border-slate-100"}`} id="benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* STC Uppercase Subtitle: BENEFITS */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
              BENEFITS
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              Why Customers Choose KAMZO
            </h2>
            <p className="text-sm text-slate-500">
              The safest and most reliable way to hire skilled trade workers in Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} p-8 rounded-3xl border shadow-sm text-center space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                100% CNIC Background Verified
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every service professional is thoroughly screened and identity-verified with Pakistani NADRA CNIC registration.
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} p-8 rounded-3xl border shadow-sm text-center space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                Fixed Rs. 200 Initial Visit Fee
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero surprise charges. Pay a flat Rs. 200 inspection fee, and pay the repair amount in cash only when you approve the work.
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} p-8 rounded-3xl border shadow-sm text-center space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                Rapid 30-Minute Doorstep Arrival
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our automated algorithm connects you with the nearest active partner in your locality for prompt response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (HOW IT WORKS SECTION) ─── */}
      <section className="py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
              HOW IT WORKS
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              Three Simple Steps (تین آسان مراحل)
            </h2>
            <p className="text-sm text-slate-500">
              No complicated calls or bargaining. Experience smooth, transparent service delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} p-8 rounded-3xl border text-center space-y-4`}>
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                01
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                Request Service & Pay Visit Fee
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your service (Mechanic, AC, Plumber, Electrician), explain the issue, and pay flat Rs. 200 fee via JazzCash, Easypaisa, or 1Link.
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} p-8 rounded-3xl border text-center space-y-4`}>
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                02
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                Certified Expert Arrives
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The nearby verified technician navigates to your doorstep, performs on-site diagnostics, and gives a clear price quotation.
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} p-8 rounded-3xl border text-center space-y-4`}>
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                03
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                Confirm Bill & Pay Cash
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once the job is completed, confirm the worker&apos;s final bill and pay cash directly. Rate the worker to keep standards high!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={`${isDarkMode ? "bg-[#070D1E] border-slate-800" : "bg-[#0A1128] border-slate-900"} text-slate-400 py-12 border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-black p-0.5 border border-slate-700">
                <img src="/logo.jpg" alt="KAMZO Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wider">KAMZO <span className="text-[#0062FF]">Marketplace</span></span>
                <p className="text-[11px] text-[#0062FF] font-bold">آپ کی ضرورت، ہمارے ماہر</p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs font-semibold">
              <Link href="/login" className="text-blue-400 hover:text-white transition-colors bg-blue-950/60 px-3.5 py-1.5 rounded-lg border border-blue-800/50">
                ⚡ Admin Portal Login (ایڈمن)
              </Link>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 KAMZO Pakistan. Built for Pakistan&apos;s Local Services Industry.</p>
            <p className="text-[#0062FF] font-semibold">Lahore • Karachi • Islamabad • Rawalpindi</p>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING ACTION WIDGETS (FROM STC SCREENSHOT BOTTOM RIGHT) ─── */}
      {/* 1. Floating WhatsApp Button */}
      <a
        href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20KAMZO%20Support,%20I%20need%20assistance%20with%20service%20booking"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support"
        className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-green-900/30 transition-all hover:scale-110 cursor-pointer group"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        {/* Tooltip */}
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
          Chat on WhatsApp (فوری رابطہ)
        </span>
      </a>

      {/* 2. Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center shadow-lg border border-slate-200/80 transition-all hover:scale-110 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 text-slate-700" />
        </button>
      )}

      {/* ─── INTERACTIVE ONLINE BOOKING MODAL ─── */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`${isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-100"} rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border relative space-y-5 max-h-[90vh] overflow-y-auto`}>
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStep === "form" ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0062FF]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Service Request (فوری بکنگ)</span>
                  </div>
                  <h3 className="text-xl font-black">
                    Book {selectedService.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedService.urduName} — Initial inspection fee: <strong className="text-[#0062FF]">{selectedService.inspectionFee}</strong>
                  </p>
                </div>

                {/* Service Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Choose Service Type:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((srv) => (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          selectedService.id === srv.id
                            ? "bg-[#0062FF] text-white border-[#0062FF]"
                            : isDarkMode
                            ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{srv.name.split(" ")[0]}</span>
                        <span className="text-[10px] opacity-80">({srv.urduName})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Select City (شہر):</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} text-xs font-semibold focus:outline-none focus:border-[#0062FF]`}
                  >
                    {pakistaniCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Your Full Name (آپ کا نام):</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"} text-xs focus:outline-none focus:border-[#0062FF]`}
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Pakistani Mobile (موبائل نمبر):</label>
                  <div className="flex">
                    <span className={`inline-flex items-center px-3 rounded-l-xl border border-r-0 ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"} text-xs font-bold`}>
                      +92
                    </span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="300 1234567"
                      className={`w-full px-3.5 py-2.5 rounded-r-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"} text-xs focus:outline-none focus:border-[#0062FF]`}
                    />
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Problem Description (مسئلہ کی تفصیل):</label>
                  <textarea
                    rows={3}
                    required
                    value={problemDetail}
                    onChange={(e) => setProblemDetail(e.target.value)}
                    placeholder="Describe what needs repair or servicing..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"} text-xs focus:outline-none focus:border-[#0062FF] resize-none`}
                  />
                </div>

                {/* Visit fee breakdown */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-blue-950">
                    <span>Initial Inspection / Visit Fee:</span>
                    <span className="text-[#0062FF]">Rs. 200</span>
                  </div>
                  <p className="text-[11px] text-blue-700">
                    Actual repair/labor charges will be estimated on-site and paid directly to the worker in cash upon completion.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Booking Request (درخواست بھیجیں)</span>
                </button>
              </form>
            ) : (
              /* Confirmation Screen */
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0062FF] flex items-center justify-center mx-auto border-2 border-blue-200">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Booking Confirmed!</h3>
                  <p className="text-xs text-[#0062FF] font-bold mt-1">
                    درخواست کامیابی کے ساتھ رجسٹر ہو گئی ہے۔
                  </p>
                </div>

                <div className={`${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"} rounded-2xl p-4 text-xs space-y-2 border text-left`}>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-400">Booking Reference:</span>
                    <span className="font-mono font-bold text-[#0062FF]">{confirmedBookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-bold">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City / Location:</span>
                    <span className="font-bold">{selectedCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Customer Name:</span>
                    <span className="font-bold">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobile:</span>
                    <span className="font-bold">+92 {customerPhone}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-[#0062FF] font-bold">
                    <span>Initial Inspection Fee:</span>
                    <span>Rs. 200</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Our nearest certified <strong>{selectedService.name}</strong> will contact you via WhatsApp / Call within <strong>10 minutes</strong>.
                </p>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full py-2.5 bg-[#0062FF] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Done (مکمل)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
