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
  Award,
  Search,
  Smartphone,
  Home,
  Layers,
  Download,
  Upload,
  FileText,
  Briefcase,
  CreditCard,
} from "lucide-react";

interface ServiceData {
  id: string;
  name: string;
  urduName: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
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
    image: "/worker-mechanic.jpg",
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
    image: "/worker-ac.jpg",
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
    image: "/worker-plumber.jpg",
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
    image: "/worker-electrician.jpg",
    color: "#D97706",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    description: "Short circuit troubleshooting, distribution box breakers, ceiling fan & chandelier installation, UPS & solar inverter wiring.",
    inspectionFee: "Rs. 200",
    popularItems: ["Main Breaker Tripping", "Short Circuit Detection", "UPS / Solar Inverter Setup", "Switchboard Wiring"],
  },
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

// Set to false when app is officially launched on Play Store / Hostinger
const SHOW_BROWSER_APP_INSTALL = true;

export default function STCStyleMarketplacePage() {
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [selectedService, setSelectedService] = useState<ServiceData>(services[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "confirmed">("details");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState(pakistaniCities[0]); // Defaults to Umerkot!
  const [customCityName, setCustomCityName] = useState("");
  const [problemDetail, setProblemDetail] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  // Payment Proof State (Customer Rs. 200 visit fee transfer)
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa" | "bank_transfer">("jazzcash");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState("");

  // Worker Join Onboarding State
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerStep, setWorkerStep] = useState<"form" | "confirmed">("form");
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");
  const [workerSkill, setWorkerSkill] = useState("Auto Mechanic (آٹو مکینک)");
  const [workerCity, setWorkerCity] = useState(pakistaniCities[0]);
  const [workerExperience, setWorkerExperience] = useState("3");
  const [workerCnic, setWorkerCnic] = useState("");
  const [workerCnicFileName, setWorkerCnicFileName] = useState("");

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
    setBookingStep("details");
    setIsBookingModalOpen(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = "KMZ-" + Math.floor(100000 + Math.random() * 900000);
    setConfirmedBookingId(randomId);
    setBookingStep("confirmed");
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkerStep("confirmed");
  };

  const handleWorkerCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWorkerCnicFileName(file.name);
    }
  };

  const effectiveCity = selectedCity.startsWith("Other") ? (customCityName || "Custom Location") : selectedCity;

  return (
    <div className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden ${isDarkMode ? "bg-[#0B132B] text-slate-100" : "bg-white text-[#0A1128]"} font-sans transition-colors duration-200 selection:bg-[#0062FF] selection:text-white relative pb-24 md:pb-0`}>
      {/* Subtle MedicoEngineer Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* ─── OFFICIAL CLEAN NAVBAR (No Admin Link, Perfect Mobile Spacing) ─── */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? "bg-[#0B132B]/95 border-slate-800" : "bg-white/95 border-slate-100"} backdrop-blur-md border-b transition-colors w-full overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo Brand: Official KAMZO App Icon & Typography (Secret 5-Tap Gateway for Admin) */}
          <Link href="/" onClick={handleLogoSecretTap} className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 select-none cursor-pointer">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-md shadow-blue-500/25 transition-all group-hover:scale-105 shrink-0">
              <img
                src="/logo.png"
                alt="KAMZO Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-baseline gap-0.5">
                <span className={`text-xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0B132B]"}`}>
                  KAM
                </span>
                <span className="text-xl sm:text-3xl font-black tracking-tight text-[#0062FF]">
                  ZO
                </span>
              </div>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400 dark:text-slate-400 -mt-0.5">
                SERVICES MARKETPLACE
              </p>
            </div>
          </Link>

          {/* Centered Navigation Links (Only Essential Links) */}
          <nav className="hidden xl:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#services" className="hover:text-[#0062FF] transition-colors py-1">
              {lang === "ur" ? "خدمات" : "Services"}
            </a>
            <a href="#how-it-works" className="hover:text-[#0062FF] transition-colors py-1">
              {lang === "ur" ? "طریقہ کار" : "How It Works"}
            </a>
            <a href="#benefits" className="hover:text-[#0062FF] transition-colors py-1">
              {lang === "ur" ? "فوائد" : "Why KAMZO"}
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* PWA Install Button (For Desktop / Laptop; on mobile it is in the bottom navigation bar) */}
            {!isAppInstalled && (
              <button
                onClick={handleInstallApp}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-blue-500/30 bg-blue-50/70 hover:bg-blue-100 text-[#0062FF] dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700/50 transition-all cursor-pointer shrink-0 shadow-xs"
                title="Install KAMZO Application on your Phone or Laptop"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{lang === "ur" ? "ایپ انسٹال" : "Install App"}</span>
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
              {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Language Selector: English & Urdu */}
            <div className="flex items-center rounded-xl p-0.5 border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-[#0062FF] text-white shadow-sm font-black"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("ur")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                  lang === "ur"
                    ? "bg-[#0062FF] text-white shadow-sm font-black"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                اردو
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className={`lg:col-span-7 space-y-6 ${lang === "ur" ? "text-center lg:text-right" : "text-center lg:text-left"}`}>
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#0062FF] text-xs font-extrabold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>
                  {lang === "ur"
                    ? "پاکستان کا نمبر 1 لوکل سروس مارکیٹ پلیس"
                    : "PAKISTAN'S #1 ON-DEMAND SERVICE MARKETPLACE"}
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                  {lang === "ur" ? "آپ کے قریبی تصدیق شدہ ماہر کاریگر" : "Certified Local Service Experts Near You."}
                </h1>
                <p className="text-2xl sm:text-3xl font-black text-[#0062FF] leading-snug">
                  {lang === "ur" ? "آپ کی ضرورت، ہمارے ماہر کاریگر۔" : "Your Need, Our Verified Experts."}
                </p>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {lang === "ur"
                  ? "پاکستان بھر میں تصدیق شدہ مکینک، اے سی ٹیکنیشن، پلمبر اور الیکٹریشن سے رابطہ کریں۔ وزٹ فیس صرف 200 روپے، اور کام تسلی بخش مکمل ہونے پر کیش ادا کریں۔"
                  : "Connect with verified local mechanics, AC technicians, plumbers, and electricians anywhere in Pakistan. Transparent flat Rs. 200 inspection fee and pay cash directly after satisfactory completion."}
              </p>

              {/* Quick Interactive Booking Card */}
              <div className={`${isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/80"} rounded-2xl p-4 sm:p-5 shadow-xl shadow-blue-900/5 border max-w-xl mx-auto lg:mx-0 text-left space-y-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0062FF]">
                    {lang === "ur" ? "سروس منتخب کریں:" : "Select Service:"}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {lang === "ur" ? "وزٹ فیس: " : "Visit Fee: "}
                    <strong className="text-[#0062FF]">{lang === "ur" ? "200 روپے" : "Rs. 200"}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {services.map((srv) => {
                    const isSelected = selectedService.id === srv.id;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#0062FF] text-white border-[#0062FF] shadow-md shadow-blue-500/20 font-bold scale-102"
                            : isDarkMode
                            ? "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        <img
                          src={srv.image}
                          alt={srv.name}
                          className={`w-9 h-9 rounded-full object-cover border-2 shadow-sm ${
                            isSelected ? "border-white" : "border-blue-400"
                          }`}
                        />
                        <span className="text-xs font-bold leading-tight">
                          {lang === "ur" ? srv.urduName : srv.name.split(" ")[0]}
                        </span>
                        <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                          {lang === "ur" ? srv.category : srv.urduName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dual Role Call-to-Actions: Customer Booking vs Worker Join */}
                <div className="space-y-2.5 pt-1">
                  <div className={`w-full ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"} border rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-slate-700`}>
                    <MapPin className="w-4 h-4 text-[#0062FF] shrink-0" />
                    <span className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"} truncate`}>
                      {lang === "ur" ? `منتخب علاقہ: ${effectiveCity}` : `Selected Area: ${effectiveCity}`}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto font-medium">
                      {lang === "ur" ? "فلیٹ وزٹ فیس 200 روپے" : "Flat Rs. 200 Visit Fee"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Button 1: Customer Booking */}
                    <button
                      onClick={() => handleOpenBooking(selectedService)}
                      className="w-full py-3.5 px-4 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold truncate">
                          {lang === "ur" ? "1. گاہک بکنگ (سروس آرڈر کریں)" : "1. Book as Customer"}
                        </div>
                        <div className="text-[10px] text-blue-100 truncate font-normal">
                          {lang === "ur" ? "کاریگر بلوائیں • 200 وزٹ فیس ادا کریں" : `Order ${selectedService.name.split(" ")[0]} • Pay Visit Fee`}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 text-white" />
                    </button>

                    {/* Button 2: Worker Join / Registration */}
                    <button
                      onClick={() => {
                        setWorkerStep("form");
                        setIsWorkerModalOpen(true);
                      }}
                      className={`w-full py-3.5 px-4 font-bold text-xs sm:text-sm rounded-xl border transition-all flex items-center justify-center gap-2.5 cursor-pointer text-left ${
                        isDarkMode
                          ? "bg-emerald-950/70 text-emerald-300 border-emerald-600/70 hover:bg-emerald-900/60"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm"
                      }`}
                    >
                      <Briefcase className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold truncate">
                          {lang === "ur" ? "2. کاریگر رجسٹریشن (ہنر رجسٹر کریں)" : "2. Join as Worker"}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-300 truncate font-normal">
                          {lang === "ur" ? "نیٹ ورک میں شامل ہوں • روزانہ کام حاصل کریں" : "Register Skill • Earn & Get Daily Jobs"}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </div>
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
                  <span className="text-xs text-slate-400">
                    {lang === "ur" ? "(2,100+ جائزے)" : "(2,100+ Reviews)"}
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Users className="w-4 h-4 text-[#0062FF]" />
                  <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                    {lang === "ur" ? "320+ تصدیق شدہ کاریگر" : "320+ Active Technicians"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Image Showcase Column (Badges placed OUTSIDE image: Above & Below so picture is 100% crystal clear) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none space-y-3.5">
                {/* ─── UPER (ABOVE IMAGE): Security Check & Visit Fee Badges ─── */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Top-Left Badge: Security Check */}
                  <div className={`rounded-2xl p-3 shadow-sm border flex items-center gap-2.5 transition-all ${
                    isDarkMode ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-800"
                  }`}>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0062FF] shrink-0 border border-blue-100 dark:border-blue-900/50">
                      <ShieldCheck className="w-5 h-5 text-[#0062FF]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight truncate">
                        {lang === "ur" ? "سیکیورٹی چیک" : "Security Check"}
                      </p>
                      <p className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate">
                        {lang === "ur" ? "100% شناختی کارڈ تصدیق" : "100% CNIC Verified"}
                      </p>
                    </div>
                  </div>

                  {/* Top-Right Badge: Visit Fee */}
                  <div className={`rounded-2xl p-3 shadow-sm border flex items-center gap-2.5 transition-all ${
                    isDarkMode ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-800"
                  }`}>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0062FF] shrink-0 border border-blue-100 dark:border-blue-900/50">
                      <Wallet className="w-4 h-4 text-[#0062FF]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight truncate">
                        {lang === "ur" ? "وزٹ فیس" : "Visit Fee"}
                      </p>
                      <p className="text-xs font-black text-[#0062FF] leading-tight truncate">
                        {lang === "ur" ? "فلیٹ 200 روپے" : "Flat Rs. 200"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ─── CLEAR & UNOBSTRUCTED IMAGE (Picture 100% Clear Show Hogi) ─── */}
                <div className={`rounded-3xl overflow-hidden shadow-2xl border-4 ${
                  isDarkMode ? "border-slate-800 shadow-blue-950/20" : "border-white shadow-blue-900/10"
                } bg-slate-100 group relative`}>
                  <img
                    src="/services-grid.jpg"
                    alt="KAMZO Certified Pakistani Technicians - Electrician, Plumber, AC Repair, Mechanic"
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-102"
                  />
                </div>

                {/* ─── NICHA (BELOW IMAGE): Certified Pakistani Technicians Banner ─── */}
                <div className={`p-3.5 sm:p-4 rounded-2xl shadow-md border transition-all ${
                  isDarkMode ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0062FF] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0062FF]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black truncate">
                          {lang === "ur" ? "سرٹیفائیڈ پاکستانی ماہر کاریگر" : "Certified Pakistani Technicians"}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {lang === "ur" ? "مکینک • اے سی سروس • پلمبر • الیکٹریشن" : "Mechanic • AC Repair • Plumber • Electrician"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-extrabold bg-[#0062FF] text-white px-3 py-1.5 rounded-xl shadow-md shadow-blue-500/25 shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === "ur" ? "تصدیق شدہ" : "Verified"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETAILED 4 SERVICES CARDS ─── */}
      <section className="py-20" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
              {lang === "ur" ? "بنیادی خدمات" : "CORE SERVICES"}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              {lang === "ur" ? "گھر اور دکان کی فوری و تسلی بخش مرمت" : "Comprehensive On-Demand Solutions"}
            </h2>
            <p className="text-sm text-slate-500">
              {lang === "ur"
                ? "اپنی مطلوبہ سروس منتخب کریں اور فوری طور پر تصدیق شدہ ماہر کاریگر بلوائیں۔"
                : "Select your required category and get an immediate verified expert at your location."}
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
                    {/* Real Worker Image Header */}
                    <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-100 group-hover:shadow-md transition-all border border-slate-200/60">
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Fee Badge Overlay */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg border border-white/60 bg-white/95 text-slate-900 shadow-sm backdrop-blur-sm">
                          {lang === "ur" ? "فیس: 200 روپے" : `Fee: ${srv.inspectionFee}`}
                        </span>
                      </div>
                      {/* Certified Badge Overlay */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#0062FF] text-white shadow-sm flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          <span>{lang === "ur" ? "تصدیق شدہ کاریگر" : "Certified Technician"}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"} group-hover:text-[#0062FF] transition-colors`}>
                        {lang === "ur" ? srv.urduName : srv.name}
                      </h3>
                      <p className="text-xs font-bold text-[#0062FF]">{lang === "ur" ? srv.name : srv.urduName}</p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{srv.category}</p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {srv.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {lang === "ur" ? "عام مسائل:" : "Common Issues:"}
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
                      <span>
                        {lang === "ur" ? `ابھی ${srv.urduName} بک کریں` : `Book ${srv.name.split(" ")[0]} Now`}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STC STYLE: "BENEFITS" SECTION ─── */}
      <section className={`py-20 border-t ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/60 border-slate-100"}`} id="benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
              {lang === "ur" ? "فوائد" : "BENEFITS"}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              {lang === "ur" ? "صارفین کامزو کا انتخاب کیوں کرتے ہیں؟" : "Why Customers Choose KAMZO"}
            </h2>
            <p className="text-sm text-slate-500">
              {lang === "ur"
                ? "پاکستان میں ہنر مند کاریگر ہائر کرنے کا سب سے محفوظ اور شفاف پلیٹ فارم۔"
                : "The safest and most reliable way to hire skilled trade workers in Pakistan."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} p-8 rounded-3xl border shadow-sm text-center space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {lang === "ur" ? "100% نادرا شناختی کارڈ تصدیق شدہ" : "100% CNIC Background Verified"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "ur"
                  ? "ہر سروس پروفیشنل کی مکمل جانچ پڑتال نادرا قومی شناختی کارڈ کے ساتھ کی جاتی ہے۔"
                  : "Every service professional is thoroughly screened and identity-verified with Pakistani NADRA CNIC registration."}
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} p-8 rounded-3xl border shadow-sm text-center space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {lang === "ur" ? "فلیٹ 200 روپے وزٹ فیس" : "Fixed Rs. 200 Initial Visit Fee"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "ur"
                  ? "کوئی چھپے ہوئے چارجز نہیں۔ صرف 200 روپے فیس، اور کام کے پیسے تسلی بخش مکمل ہونے کے بعد کیش میں ادا کریں۔"
                  : "Zero surprise charges. Pay a flat Rs. 200 inspection fee, and pay the repair amount in cash only when you approve the work."}
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"} p-8 rounded-3xl border shadow-sm text-center space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {lang === "ur" ? "30 منٹ کے اندر دہلیز پر آمد" : "Rapid 30-Minute Doorstep Arrival"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "ur"
                  ? "ہمارا سسٹم آپ کے قریبی ایکٹو پارٹنر کو فوری الرٹ بھیجتا ہے تا کہ وہ جلد از جلد آپ تک پہنچ سکے۔"
                  : "Our automated algorithm connects you with the nearest active partner in your locality for prompt response."}
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
              {lang === "ur" ? "طریقہ کار" : "HOW IT WORKS"}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              {lang === "ur" ? "تین آسان مراحل" : "Three Simple Steps"}
            </h2>
            <p className="text-sm text-slate-500">
              {lang === "ur"
                ? "کوئی لمبی کالز یا بحث نہیں۔ آسان اور شفاف طریقے سے کام کروائیں۔"
                : "No complicated calls or bargaining. Experience smooth, transparent service delivery."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} p-8 rounded-3xl border text-center space-y-4`}>
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                01
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {lang === "ur" ? "سروس منتخب کریں اور 200 فیس دیں" : "Request Service & Pay Visit Fee"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "ur"
                  ? "اپنی مطلوبہ سروس اور شہر منتخب کریں اور جاز کیش، ایزی پیسہ یا بینک سے 200 روپے وزٹ فیس منتقل کریں۔"
                  : "Select your service (Mechanic, AC, Plumber, Electrician), select your city, and pay flat Rs. 200 fee via JazzCash, Easypaisa, or 1Link."}
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} p-8 rounded-3xl border text-center space-y-4`}>
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                02
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {lang === "ur" ? "تصدیق شدہ کاریگر کی آمد" : "Certified Expert Arrives"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "ur"
                  ? "نزدیکی تصدیق شدہ کاریگر آپ کے پتے پر پہنچ کر معائنہ کرے گا اور مناسب خرچ بتائے گا۔"
                  : "The nearby verified technician navigates to your doorstep, performs on-site diagnostics, and gives a clear price quotation."}
              </p>
            </div>

            <div className={`${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} p-8 rounded-3xl border text-center space-y-4`}>
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                03
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {lang === "ur" ? "کام کی تسلی اور کیش ادائیگی" : "Confirm Bill & Pay Cash"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "ur"
                  ? "کام مکمل ہونے پر فائنل بل کاریگر کو موقع پر کیش ادا کریں۔ اور کاریگر کو سٹار ریٹنگ دیں۔"
                  : "Once the job is completed, confirm the worker's final bill and pay cash directly. Rate the worker to keep standards high!"}
              </p>
            </div>
          </div>
        </div>
      </section>

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
              <a href="#services" className="hover:text-white transition-colors">Services (خدمات)</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works (طریقہ کار)</a>
              <a href="#benefits" className="hover:text-white transition-colors">Why KAMZO (فوائد)</a>
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

        {/* Install App (Auto-switchable when deployed to Play Store / Hostinger) */}
        {SHOW_BROWSER_APP_INSTALL ? (
          <button
            onClick={handleInstallApp}
            className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#0062FF] flex-1 transition-colors"
          >
            <Smartphone className="w-5 h-5 text-[#0062FF]" />
            <span className="text-[10px] font-bold text-[#0062FF] mt-0.5">App</span>
          </button>
        ) : (
          <a
            href="https://play.google.com/store/apps/details?id=com.kamzo.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#0062FF] flex-1 transition-colors"
          >
            <Smartphone className="w-5 h-5 text-[#0062FF]" />
            <span className="text-[10px] font-bold text-[#0062FF] mt-0.5">Play Store</span>
          </a>
        )}
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

            {bookingStep === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0062FF]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Step 1 of 2: Service & Location Details (مرحلہ 1: بکنگ معلومات)</span>
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
                        className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          selectedService.id === srv.id
                            ? "bg-[#0062FF] text-white border-[#0062FF]"
                            : isDarkMode
                            ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <img
                          src={srv.image}
                          alt={srv.name}
                          className="w-7 h-7 rounded-lg object-cover border border-white/40 shadow-xs shrink-0"
                        />
                        <span className="truncate">{srv.name.split(" ")[0]}</span>
                        <span className="text-[10px] opacity-80 shrink-0">({srv.urduName})</span>
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

                  {/* If user selected "Other / Type Your City" */}
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
                  <label className="text-xs font-bold text-slate-600">Your Full Name (گاہک کا نام):</label>
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
                      placeholder="319 7318425"
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
                    Next step: Transfer Rs. 200 visit fee via JazzCash/Easypaisa to confirm technician dispatch.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next: Proceed to Visit Fee Payment (فیس ادائیگی)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT & RECEIPT PROOF ATTACHMENT */}
            {bookingStep === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0062FF]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Step 2 of 2: Transfer Rs. 200 Visit Fee (وزٹ فیس ادائیگی)</span>
                  </div>
                  <h3 className="text-xl font-black">
                    Attach Payment Proof (رسید ثبوت)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Send Rs. 200 advance inspection fee to any account below and upload the screenshot.
                  </p>
                </div>

                {/* Payment Method Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("jazzcash")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      paymentMethod === "jazzcash"
                        ? "bg-[#0062FF] text-white border-[#0062FF] shadow-sm"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    JazzCash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("easypaisa")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      paymentMethod === "easypaisa"
                        ? "bg-[#0062FF] text-white border-[#0062FF] shadow-sm"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Easypaisa
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      paymentMethod === "bank_transfer"
                        ? "bg-[#0062FF] text-white border-[#0062FF] shadow-sm"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Bank
                  </button>
                </div>

                {/* Official Account Box */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-blue-900 font-bold">
                    <span>Deposit Account Details:</span>
                    <span className="text-xs bg-[#0062FF] text-white px-2 py-0.5 rounded-full font-mono">
                      Rs. 200
                    </span>
                  </div>

                  {paymentMethod === "jazzcash" && (
                    <div className="space-y-1 text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">JazzCash Mobile:</span>
                        <span className="font-mono font-black text-sm text-[#0062FF]">0319 7318425</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold">KAMZO Services / Parvindar</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "easypaisa" && (
                    <div className="space-y-1 text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Easypaisa Mobile:</span>
                        <span className="font-mono font-black text-sm text-[#0062FF]">0319 7318425</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold">KAMZO Services / Parvindar</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank_transfer" && (
                    <div className="space-y-1 text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bank Name:</span>
                        <span className="font-bold">Allied Bank / Meezan Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account / IBAN:</span>
                        <span className="font-mono font-bold text-xs">03197318425 / PK36MEZN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold">KAMZO Marketplace</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-blue-700 pt-1 border-t border-blue-200/60">
                    Open your {paymentMethod === "jazzcash" ? "JazzCash" : paymentMethod === "easypaisa" ? "Easypaisa" : "Bank"} App, send Rs. 200, then paste the TID below.
                  </p>
                </div>

                {/* Transaction Reference / TID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                    <span>Transaction ID / TID (ٹرانزیکشن ریفرنس):</span>
                    <span className="text-[10px] text-slate-400">Required</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. TID 04982189421 / SMS Ref"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"} text-xs font-mono focus:outline-none focus:border-[#0062FF]`}
                  />
                </div>

                {/* Screenshot Upload with Preview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                    <span>Attach Payment Screenshot / Proof (رسید کی تصویر):</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Fast Approval</span>
                  </label>

                  <div className={`border-2 border-dashed rounded-2xl p-3 text-center transition-colors ${
                    receiptPreview
                      ? "border-emerald-400 bg-emerald-50/50"
                      : isDarkMode
                      ? "border-slate-700 bg-slate-800/50 hover:border-blue-500"
                      : "border-slate-200 bg-slate-50/70 hover:border-blue-400"
                  }`}>
                    <input
                      type="file"
                      id="receipt-file-input"
                      accept="image/*"
                      onChange={handleReceiptChange}
                      className="hidden"
                    />
                    <label htmlFor="receipt-file-input" className="cursor-pointer block">
                      {receiptPreview ? (
                        <div className="flex items-center gap-3 text-left">
                          <img
                            src={receiptPreview}
                            alt="Receipt Preview"
                            className="w-14 h-14 object-cover rounded-xl border border-emerald-300 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Receipt Proof Attached</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{receiptFileName || "screenshot.png"}</p>
                            <span className="text-[10px] text-[#0062FF] underline font-semibold">Change Screenshot</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2.5 space-y-1">
                          <Upload className="w-6 h-6 text-[#0062FF] mx-auto" />
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Tap to Upload Screenshot / Receipt
                          </div>
                          <p className="text-[10px] text-slate-400">
                            JPEG, PNG or Camera photo from your phone
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Modal Navigation Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setBookingStep("details")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                      isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Payment Proof & Confirm (رسید جمع کروائیں)</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: BOOKING CONFIRMED */}
            {bookingStep === "confirmed" && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0062FF] flex items-center justify-center mx-auto border-2 border-blue-200">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Booking Registered!</h3>
                  <p className="text-xs text-[#0062FF] font-bold mt-1">
                    درخواست اور رسید کامیابی کے ساتھ موصول ہو گئی ہے۔
                  </p>
                  <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                    ⏳ Payment Status: Under Admin Verification (تصدیق زیر التواء)
                  </div>
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
                    <span className="text-slate-400">Customer:</span>
                    <span className="font-bold">{customerName} (+92 {customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Method & TID:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {paymentMethod.toUpperCase()} • {transactionRef || "Proof Attached"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-[#0062FF] font-bold">
                    <span>Initial Visit Fee Transferred:</span>
                    <span>Rs. 200</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 leading-relaxed text-left">
                  <p className="font-semibold pb-1">اگلا مرحلہ (Next Steps):</p>
                  <p>1. ایڈمن 5 سے 10 منٹ میں آپ کی ٹرانزیکشن رسید کی تصدیق کرے گا۔</p>
                  <p>2. تصدیق ہوتے ہی نزدیکی سرٹیفائیڈ کاریگر کو آپ کے پتے پر روانہ کیا جائے گا۔</p>
                  <p>3. کام مکمل ہونے پر فائنل ریپیرنگ لیبر چارجز کاریگر کو موقع پر کیش میں ادا کیے جائیں گے۔</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/923197318425"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp (+92 319 7318425)</span>
                  </a>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="py-2.5 px-5 bg-[#0062FF] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Done (مکمل)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── WORKER JOIN / ONBOARDING REGISTRATION MODAL ─── */}
      {isWorkerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`${isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-100"} rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border relative space-y-5 max-h-[90vh] overflow-y-auto`}>
            {/* Close Button */}
            <button
              onClick={() => setIsWorkerModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {workerStep === "form" ? (
              <form onSubmit={handleWorkerSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Worker Registration (کاریگر رجسٹریشن فارم)</span>
                  </div>
                  <h3 className="text-xl font-black">
                    Join KAMZO as Service Professional
                  </h3>
                  <p className="text-xs text-slate-400">
                    Register your trade, earn daily income with verified client bookings in your city.
                  </p>
                </div>

                {/* Worker Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Full Name (کاریگر کا پورا نام):</label>
                  <input
                    type="text"
                    required
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar / Muhammad Usman"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"} text-xs focus:outline-none focus:border-emerald-600`}
                  />
                </div>

                {/* Worker Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Pakistani Mobile / WhatsApp (موبائل نمبر):</label>
                  <div className="flex">
                    <span className={`inline-flex items-center px-3 rounded-l-xl border border-r-0 ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"} text-xs font-bold`}>
                      +92
                    </span>
                    <input
                      type="tel"
                      required
                      value={workerPhone}
                      onChange={(e) => setWorkerPhone(e.target.value)}
                      placeholder="300 1234567"
                      className={`w-full px-3.5 py-2.5 rounded-r-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"} text-xs focus:outline-none focus:border-emerald-600`}
                    />
                  </div>
                </div>

                {/* Skill / Trade Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Primary Skill / Trade (مہارت کا انتخاب):</label>
                  <select
                    value={workerSkill}
                    onChange={(e) => setWorkerSkill(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} text-xs font-semibold focus:outline-none focus:border-emerald-600`}
                  >
                    <option value="Auto Mechanic (آٹو مکینک)">Auto Mechanic (آٹو مکینک)</option>
                    <option value="AC & Refrigeration (اے سی ٹیکنیشن)">AC & Refrigeration (اے سی ٹیکنیشن)</option>
                    <option value="Plumber & Sanitary (پلمبر)">Plumber & Sanitary (پلمبر)</option>
                    <option value="Electrician & Wiring (الیکٹریشن)">Electrician & Wiring (الیکٹریشن)</option>
                    <option value="Carpenter & Woodwork (بڑھئی)">Carpenter & Woodwork (بڑھئی)</option>
                    <option value="Home Appliances Repair (گھریلو سامان مرمت)">Home Appliances Repair (گھریلو سامان مرمت)</option>
                  </select>
                </div>

                {/* City Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Your Base City (شہر / علاقہ):</label>
                  <select
                    value={workerCity}
                    onChange={(e) => setWorkerCity(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} text-xs font-semibold focus:outline-none focus:border-emerald-600`}
                  >
                    {pakistaniCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Experience in Years */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Experience (تجربہ - سال):</label>
                  <select
                    value={workerExperience}
                    onChange={(e) => setWorkerExperience(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"} text-xs font-semibold focus:outline-none focus:border-emerald-600`}
                  >
                    <option value="1">1 Year Experience</option>
                    <option value="2">2 Years Experience</option>
                    <option value="3">3 - 5 Years Experience</option>
                    <option value="5">5 - 10 Years (Senior Master)</option>
                    <option value="10">10+ Years (Ustadh / Expert)</option>
                  </select>
                </div>

                {/* CNIC Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                    <span>CNIC Number (قومی شناختی کارڈ نمبر):</span>
                    <span className="text-[10px] text-slate-400">13 Digits</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={workerCnic}
                    onChange={(e) => setWorkerCnic(e.target.value)}
                    placeholder="44102-1234567-1"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"} text-xs font-mono focus:outline-none focus:border-emerald-600`}
                  />
                </div>

                {/* CNIC Photo Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">CNIC Card Photo / Document:</label>
                  <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/40 rounded-xl p-3 text-center">
                    <input
                      type="file"
                      id="cnic-file-input"
                      accept="image/*,.pdf"
                      onChange={handleWorkerCnicChange}
                      className="hidden"
                    />
                    <label htmlFor="cnic-file-input" className="cursor-pointer block text-xs">
                      {workerCnicFileName ? (
                        <div className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{workerCnicFileName} Attached</span>
                        </div>
                      ) : (
                        <div className="text-slate-600">
                          <Upload className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                          <span className="font-semibold text-emerald-700">Upload CNIC Front & Back Photo</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Submit Worker Application (درخواست جمع کروائیں)</span>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Application Received!</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    کاریگر رجسٹریشن درخواست موصول ہو گئی ہے۔
                  </p>
                </div>

                <div className={`${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"} rounded-2xl p-4 text-xs space-y-2 border text-left`}>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Worker Name:</span>
                    <span className="font-bold">{workerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trade / Skill:</span>
                    <span className="font-bold">{workerSkill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City / Location:</span>
                    <span className="font-bold">{workerCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobile / WhatsApp:</span>
                    <span className="font-bold">+92 {workerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CNIC Verification:</span>
                    <span className="font-bold text-amber-600">Pending Review by Admin</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed text-left">
                  <p className="font-semibold pb-1">تصدیقی عمل (Verification Process):</p>
                  <p>1. ایڈمن ٹیم 24 گھنٹوں کے اندر آپ کے شناختی کارڈ اور تجربے کی تصدیق کرے گی۔</p>
                  <p>2. تصدیق کے بعد آپ کا اکاؤنٹ فعال ہو جائے گا اور آپ کو آپ کے شہر کے کسٹمر آرڈرز براہ راست WhatsApp پر ملنا شروع ہو جائیں گے۔</p>
                </div>

                <button
                  onClick={() => setIsWorkerModalOpen(false)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
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
