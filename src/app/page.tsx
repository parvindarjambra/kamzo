"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AdBanner } from "@/components/ads/ad-banner";
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
  Award,
  Search,
  Smartphone,
  Home,
  Layers,
  Download,
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
    color: "#E11D48",
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
    color: "#0284C7",
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
    color: "#D97706",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    description: "Short circuit troubleshooting, distribution box breakers, ceiling fan & chandelier installation, UPS & solar inverter wiring.",
    inspectionFee: "Rs. 200",
    popularItems: ["Main Breaker Tripping", "Short Circuit Detection", "UPS / Solar Inverter Setup", "Switchboard Wiring"],
  },
];

// STC Style Circular Badges
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

// Comprehensive Pakistani Cities List including Umerkot, Sindh, Punjab, KPK, Balochistan
const pakistaniCities = [
  "Umerkot (عمرکوٹ)",
  "Karachi (کراچی)",
  "Lahore (لاہور)",
  "Islamabad (اسلام آباد)",
  "Rawalpindi (راولپنڈی)",
  "Hyderabad (حیدرآباد)",
  "Mirpur Khas (میرپور خاص)",
  "Sukkur (سکھر)",
  "Larkana (لاڑکانہ)",
  "Nawabshah / SBA (نواب شاہ)",
  "Faisalabad (فیصل آباد)",
  "Multan (ملتان)",
  "Peshawar (پشاور)",
  "Gujranwala (گوجرانوالہ)",
  "Sialkot (سیالکوٹ)",
  "Quetta (کوئٹہ)",
  "Bahawalpur (بہاولپور)",
  "Sargodha (سرگودھا)",
  "Abbottabad (ایبٹ آباد)",
  "Mardan (مردان)",
  "Other / Type Your City (دیگر شہر / اپنا شہر لکھیں)",
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
  const [selectedCity, setSelectedCity] = useState(pakistaniCities[0]); // Defaults to Umerkot!
  const [customCityName, setCustomCityName] = useState("");
  const [problemDetail, setProblemDetail] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  // Secret Admin Access via 5 Rapid Logo Taps (For Mobile App & PWA where URL bar is hidden)
  const [logoTaps, setLogoTaps] = useState(0);

  // PWA Install State for Phone & Laptop Application Mode
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      if (isStandalone) {
        setIsAppInstalled(true);
      }

      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      window.addEventListener("appinstalled", () => {
        setIsAppInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      });

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult?.outcome === "accepted") {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSInstallGuide(true);
    } else {
      alert("KAMZO App install karne ke liye browser menu (3 dots ⋮) par tap karein aur 'Install app' ya 'Add to Home screen' select karein!");
    }
  };

  const handleLogoSecretTap = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = logoTaps + 1;
    if (nextCount >= 5) {
      setLogoTaps(0);
      window.location.href = "/login";
    } else {
      setLogoTaps(nextCount);
      setTimeout(() => setLogoTaps(0), 3000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
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

  const effectiveCity = selectedCity.startsWith("Other") ? (customCityName || "Custom Location") : selectedCity;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0B132B] text-slate-100" : "bg-white text-[#0A1128]"} font-sans transition-colors duration-200 selection:bg-[#0062FF] selection:text-white relative pb-20 md:pb-0`}>
      {/* Subtle MedicoEngineer Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* ─── MEDICOENGINEER STYLE TOP ANNOUNCEMENT TICKER ─── */}
      <div className="bg-[#0A1128] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="px-2 py-0.5 rounded-full bg-[#0062FF] text-[9px] font-black uppercase tracking-wider text-white shrink-0">
              ANNOUNCEMENT
            </span>
            <span className="text-slate-300 truncate">
              Unified KAMZO Network Live in <strong className="text-white">Umerkot, Karachi, Lahore & Nationwide</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 font-medium shrink-0">
            <span>⭐ 100% CNIC Verified Technicians</span>
            <span>•</span>
            <span className="text-[#0062FF] font-bold">Flat Rs. 200 Initial Inspection Fee</span>
          </div>
        </div>
      </div>

      {/* ─── STC / MEDICOENGINEER DEVELOPER STYLE NAVBAR (No Admin Link, Perfect Spacing) ─── */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? "bg-[#0B132B]/95 border-slate-800" : "bg-white/95 border-slate-100"} backdrop-blur-md border-b transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Brand: Official KAMZO App Icon & Typography (Secret 5-Tap Gateway for Admin) */}
          <Link href="/" onClick={handleLogoSecretTap} className="flex items-center gap-3.5 group shrink-0 select-none cursor-pointer">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl overflow-hidden shadow-md shadow-blue-500/25 transition-all group-hover:scale-105 shrink-0">
              <img
                src="/logo.png"
                alt="KAMZO Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-baseline gap-0.5">
                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0B132B]"}`}>
                  KAM
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0062FF]">
                  ZO
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-extrabold text-slate-400 dark:text-slate-400 -mt-1">
                SERVICES MARKETPLACE
              </p>
            </div>
          </Link>

          {/* Centered Navigation Links (Clean Customer Nav with Generous Spacing) */}
          <nav className="hidden xl:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#services" className="hover:text-[#0062FF] transition-colors py-1">
              Services
            </a>
            <a href="#specialise" className="hover:text-[#0062FF] transition-colors py-1">
              Specialisations
            </a>
            <a href="#benefits" className="hover:text-[#0062FF] transition-colors py-1">
              Benefits
            </a>
            <a href="#how-it-works" className="hover:text-[#0062FF] transition-colors py-1">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-[#0062FF] transition-colors py-1">
              Visit Fee (Rs. 200)
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* PWA Install Button (For Mobile & Desktop / Laptop) */}
            {!isAppInstalled && (
              <button
                onClick={handleInstallApp}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-blue-500/30 bg-blue-50/70 hover:bg-blue-100 text-[#0062FF] dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700/50 transition-all cursor-pointer shrink-0 shadow-xs"
                title="Install KAMZO Application on your Phone or Laptop"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">App</span>
              </button>
            )}

            {/* Dark Mode Moon/Sun Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle Dark Mode"
              className={`p-2 sm:p-2.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
                isDarkMode
                  ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button in STC Electric Blue */}
            <button
              onClick={() => handleOpenBooking()}
              className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-[#0062FF] hover:bg-[#0052D9] text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0"
            >
              <span>Book a Worker</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MEDICOENGINEER STYLE AD SLOT (Header Top Leaderboard) ─── */}
      <AdBanner slot="header_top" />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* STC Style Tiny Uppercase Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#0062FF] text-xs font-extrabold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>PAKISTAN&apos;S #1 ON-DEMAND SERVICE MARKETPLACE</span>
              </div>

              {/* Main Headline & Urdu Subtitle (Properly Separated) */}
              <div className="space-y-3">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                  Certified Local Service Experts Near You.
                </h1>
                <p className="text-2xl sm:text-3xl font-black text-[#0062FF] leading-snug" dir="rtl">
                  آپ کی ضرورت، ہمارے ماہر کاریگر۔
                </p>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Connect with verified local mechanics, AC technicians, plumbers, and electricians anywhere in Pakistan.
                Transparent flat <strong className={`${isDarkMode ? "text-white" : "text-slate-900"} font-bold`}>Rs. 200 inspection fee</strong> and pay cash directly after satisfactory completion.
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
                      {effectiveCity}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">Pakistan</span>
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

            {/* Right Image Showcase Column (Clean Frame without Overlapping Clutter) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className={`rounded-3xl overflow-hidden shadow-2xl border-4 ${isDarkMode ? "border-slate-800" : "border-white"} shadow-blue-950/15 bg-slate-100 group relative`}>
                  <img
                    src="/services-grid.jpg"
                    alt="KAMZO Certified Pakistani Technicians - Electrician, Plumber, AC Repair, Mechanic"
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/25 pointer-events-none" />

                  {/* Top-Left Floating Badge: Security Check */}
                  <div className="absolute top-3.5 left-3.5 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border border-slate-200/80 dark:border-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0062FF] shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#0062FF]" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400 leading-tight">Security Check</p>
                      <p className="text-[11px] font-extrabold text-slate-800 dark:text-white leading-tight">100% CNIC Verified</p>
                    </div>
                  </div>

                  {/* Top-Right Floating Badge: Visit Fee */}
                  <div className="absolute top-3.5 right-3.5 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-3 py-2 shadow-lg border border-slate-200/80 dark:border-slate-700 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0062FF] shrink-0">
                      <Wallet className="w-4 h-4 text-[#0062FF]" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400 leading-tight">Visit Fee</p>
                      <p className="text-[11px] font-extrabold text-[#0062FF] leading-tight">Flat Rs. 200</p>
                    </div>
                  </div>

                  {/* Bottom Banner: Certified Pakistani Technicians */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 text-white p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0062FF] animate-ping shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            Certified Pakistani Technicians
                          </p>
                          <p className="text-[10px] text-blue-200 truncate">
                            Mechanic • AC Repair • Plumber • Electrician
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#0062FF] px-2.5 py-1 rounded-md text-white shadow-sm shrink-0">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STC DEVELOPER STYLE: CIRCULAR ICONS SECTION ─── */}
      <section className={`py-14 border-t border-b ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/70 border-slate-100"}`} id="specialise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
              TRADES & TECHNOLOGY
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              Services We Specialise In
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-normal">
              Our certified technicians deliver high-performance solutions across Umerkot, Karachi, Lahore, and all cities.
            </p>
          </div>

          {/* STC Floating Circular Tech Pills */}
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

      {/* ─── DETAILED 4 SERVICES CARDS ─── */}
      <section className="py-20" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className={`${isDarkMode ? "bg-slate-900 border-slate-800 hover:border-[#0062FF]/50" : "bg-white border-slate-200/80 hover:border-[#0062FF]/40"} rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-blue-50"} text-[#0062FF] flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-[#0062FF]" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                        Fee: {srv.inspectionFee}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"} group-hover:text-[#0062FF] transition-colors`}>
                        {srv.name}
                      </h3>
                      <p className="text-xs font-bold text-[#0062FF]">{srv.urduName}</p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{srv.category}</p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {srv.description}
                    </p>

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

      {/* ─── MEDICOENGINEER STYLE IN-FEED NATIVE SPONSOR AD SLOT ─── */}
      <AdBanner slot="in_feed" />

      {/* ─── STC STYLE: "BENEFITS" SECTION ─── */}
      <section className={`py-20 border-t ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/60 border-slate-100"}`} id="benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

      {/* ─── HOW IT WORKS SECTION ─── */}
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
                Select your service (Mechanic, AC, Plumber, Electrician), select your city, and pay flat Rs. 200 fee via JazzCash, Easypaisa, or 1Link.
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

      {/* ─── MEDICOENGINEER STYLE FOOTER SPONSOR BANNER ─── */}
      <AdBanner slot="footer_banner" />

      {/* ─── FOOTER (Clean Customer Footer - No Admin Link) ─── */}
      <footer className={`${isDarkMode ? "bg-[#070D1E] border-slate-800" : "bg-[#0A1128] border-slate-900"} text-slate-400 py-12 border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3.5 cursor-pointer select-none" onClick={handleLogoSecretTap}>
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-blue-500/25 shrink-0">
                <img src="/logo.png" alt="KAMZO Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-white tracking-tight">KAM</span>
                  <span className="text-xl font-black text-[#0062FF] tracking-tight">ZO</span>
                </div>
                <p className="text-[9px] uppercase tracking-[0.24em] font-extrabold text-slate-400">SERVICES MARKETPLACE</p>
                <p className="text-[10px] text-[#0062FF] font-bold">آپ کی ضرورت، ہمارے ماہر</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 KAMZO Pakistan. Built for Pakistan&apos;s Local Services Industry.</p>
            <p className="text-[#0062FF] font-semibold">Umerkot • Karachi • Lahore • Islamabad • Nationwide</p>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING ACTION WIDGETS (Proper Grounded Positioning) ─── */}
      {/* Desktop/Tablet Floating WhatsApp Button */}
      <a
        href="https://wa.me/923197318425?text=Assalam-o-Alaikum%20KAMZO%20Support,%20I%20need%20assistance%20with%20service%20booking"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support"
        className="hidden md:flex fixed bottom-6 right-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white items-center justify-center shadow-xl shadow-green-900/30 transition-all hover:scale-110 cursor-pointer group"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-[#25D366]" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>WhatsApp: +92 319 7318425 (فوری رابطہ)</span>
        </span>
      </a>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0062FF] hover:bg-[#0052D9] text-white flex items-center justify-center shadow-xl shadow-blue-500/35 border-2 border-white/20 transition-all hover:scale-110 cursor-pointer animate-in fade-in group"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-y-0.5 transition-transform" />
          <span className="absolute right-14 sm:right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 hidden sm:inline-block">
            Scroll to Top (اوپر جائیں)
          </span>
        </button>
      )}

      {/* ─── APP-LIKE MOBILE BOTTOM NAVIGATION BAR (Phones Only) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl px-3 py-1.5 flex items-center justify-between safe-bottom">
        {/* Home */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#0062FF] flex-1 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </button>

        {/* Services */}
        <a
          href="#services"
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#0062FF] flex-1 transition-colors"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Services</span>
        </a>

        {/* Center Booking Action (Prominent App FAB) */}
        <button
          onClick={() => handleOpenBooking()}
          className="flex flex-col items-center justify-center -mt-5 py-0.5 px-2 flex-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#0062FF] text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-active:scale-95 transition-transform border-3 border-white dark:border-[#0B132B]">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-[#0062FF] mt-0.5 whitespace-nowrap">Rs. 200 Book</span>
        </button>

        {/* WhatsApp Support */}
        <a
          href="https://wa.me/923197318425?text=Assalam-o-Alaikum%20KAMZO%20Support"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex-1 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
        </a>

        {/* Install App */}
        <button
          onClick={handleInstallApp}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#0062FF] flex-1 transition-colors"
        >
          <Smartphone className="w-5 h-5 text-[#0062FF]" />
          <span className="text-[10px] font-bold text-[#0062FF] mt-0.5">App</span>
        </button>
      </nav>

      {/* ─── IOS PWA INSTALL GUIDE MODAL ─── */}
      {showIOSInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`${isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"} rounded-3xl max-w-sm w-full p-6 shadow-2xl border space-y-4`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#0062FF]" />
                <h4 className="font-bold text-sm">Install KAMZO on iPhone / iPad</h4>
              </div>
              <button
                onClick={() => setShowIOSInstallGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0062FF] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>Safari browser me neeche <strong>Share button</strong> (چوکور باکس تیر والا) par tap karein.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0062FF] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span>Menu ko scroll karein aur <strong>Add to Home Screen (ہوم اسکرین میں شامل کریں)</strong> select karein.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0062FF] font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span>Top right par <strong>Add</strong> par click karein. KAMZO aapke phone par app ki tarah save ho jayegi!</span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSInstallGuide(false)}
              className="w-full py-2.5 bg-[#0062FF] text-white text-xs font-bold rounded-xl shadow-md"
            >
              Samajh Gaya (Done)
            </button>
          </div>
        </div>
      )}

      {/* ─── INTERACTIVE ONLINE BOOKING MODAL WITH ANY CITY SUPPORT ─── */}
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

                {/* City Picker with Umerkot and Custom City Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                    <span>Select City / Location (شہر کا انتخاب کریں):</span>
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} text-xs font-semibold focus:outline-none focus:border-[#0062FF]`}
                  >
                    {pakistaniCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>

                  {/* If user selected "Other / Type Your City" or wants to specify area */}
                  {selectedCity.startsWith("Other") && (
                    <div className="pt-1 animate-in fade-in">
                      <input
                        type="text"
                        required
                        value={customCityName}
                        onChange={(e) => setCustomCityName(e.target.value)}
                        placeholder="Type your City / Town / Area name (اپنے شہر یا علاقے کا نام لکھیں)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200 bg-blue-50/40"} text-xs font-semibold focus:outline-none focus:border-[#0062FF] placeholder:text-slate-400`}
                      />
                    </div>
                  )}
                </div>

                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Your Full Name (آپ کا نام):</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Parvindar Kumar / Muhammad Ali"
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
                  <label className="text-xs font-bold text-slate-600">Problem / Work Detail (مسئلہ کی تفصیل):</label>
                  <textarea
                    rows={3}
                    required
                    value={problemDetail}
                    onChange={(e) => setProblemDetail(e.target.value)}
                    placeholder="Describe what needs repair, servicing, or installation..."
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
                    <span className="font-bold">{effectiveCity}</span>
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
                  Our nearest certified <strong>{selectedService.name}</strong> will contact you via WhatsApp (+92 319 7318425) / Call within <strong>10 minutes</strong>.
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
