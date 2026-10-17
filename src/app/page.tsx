"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Snowflake,
  Droplets,
  Zap,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Star,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award,
  Wallet,
  Users,
  X,
  FileCheck,
} from "lucide-react";

interface ServiceData {
  id: string;
  name: string;
  urduName: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  description: string;
  inspectionFee: string;
  commonIssues: string[];
  gradient: string;
  accentColor: string;
}

const services: ServiceData[] = [
  {
    id: "mechanic",
    name: "Auto Mechanic",
    urduName: "آٹو مکینک",
    icon: Wrench,
    tag: "Emergency Breakdown & Tuning",
    description: "Expert car diagnostics, engine tuning, brake repairs, oil change, suspension, and roadside assistance anywhere.",
    inspectionFee: "Rs. 200",
    commonIssues: ["Engine Noise & Overheating", "Brake Pad Replacement", "Oil & Filter Service", "Battery & Starter Issues"],
    gradient: "from-rose-500/10 via-red-500/5 to-transparent",
    accentColor: "text-red-500 border-red-500/20 bg-red-50",
  },
  {
    id: "ac_repair",
    name: "AC Repair & Service",
    urduName: "اے سی سروس و ریپیئر",
    icon: Snowflake,
    tag: "Cooling & Inverter Specialist",
    description: "Inverter AC diagnostics, deep master wash cleaning, gas leakage detection, R410/R32 gas refill, and new installation.",
    inspectionFee: "Rs. 200",
    commonIssues: ["Low or No Cooling", "Gas Leakage & Refill", "Water Dripping Inside", "Inverter PCB Board Error"],
    gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    accentColor: "text-cyan-600 border-cyan-500/20 bg-cyan-50",
  },
  {
    id: "plumber",
    name: "Plumbing Services",
    urduName: "پلمبر سروس",
    icon: Droplets,
    tag: "Pipe Leakage & Sanitary",
    description: "Concealed pipeline leak detection, motor pump installation, bathroom sanitary fittings, drain unblocking, and geyser setup.",
    inspectionFee: "Rs. 200",
    commonIssues: ["Underground Pipe Leaks", "Water Motor / Pump Repair", "Blocked Drainage", "Tap & Mixer Replacement"],
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    accentColor: "text-blue-600 border-blue-500/20 bg-blue-50",
  },
  {
    id: "electrician",
    name: "Electrician Services",
    urduName: "الیکٹریشن سروس",
    icon: Zap,
    tag: "Wiring, Breakers & Solar",
    description: "Short circuit troubleshooting, distribution box breakers, ceiling fan & chandelier installation, UPS & solar wiring.",
    inspectionFee: "Rs. 200",
    commonIssues: ["Main Breaker Tripping", "Short Circuit Detection", "UPS / Solar Inverter Setup", "Switchboard Wiring"],
    gradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
    accentColor: "text-amber-600 border-amber-500/20 bg-amber-50",
  },
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

export default function PublicMarketplacePage() {
  const [selectedService, setSelectedService] = useState<ServiceData>(services[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "confirmed">("form");

  // Booking Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState(pakistaniCities[0]);
  const [problemDetail, setProblemDetail] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-[#1B5E20] selection:text-white">
      {/* ─── TOP TRUST ANNOUNCEMENT BAR ─── */}
      <div className="bg-[#0f3813] text-emerald-200 text-xs py-2 px-4 text-center font-medium border-b border-[#1B5E20]/40 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <span className="inline-flex items-center gap-1 font-bold text-white">
          🇵🇰 Pakistan&apos;s #1 Local On-Demand Service Network
        </span>
        <span className="hidden sm:inline text-emerald-400/50">•</span>
        <span>Flat Rs. 200 Initial Inspection Fee</span>
        <span className="hidden sm:inline text-emerald-400/50">•</span>
        <span>100% Cash Paid Directly to Technician After Work</span>
      </div>

      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-[#1B5E20]/20 border border-gray-200/80 p-0.5 bg-black transition-transform group-hover:scale-105">
              <img
                src="/logo.jpg"
                alt="KAMZO Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#111827]">
                  KAMZO
                </span>
                <span className="w-2 h-2 rounded-full bg-[#1B5E20]" />
              </div>
              <span className="text-[11px] font-semibold text-[#1B5E20] tracking-wide">
                آپ کی ضرورت، ہمارے ماہر
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-700">
            <a href="#services" className="hover:text-[#1B5E20] transition-colors">
              Our Services (خدمات)
            </a>
            <a href="#technicians" className="hover:text-[#1B5E20] transition-colors">
              Verified Experts
            </a>
            <a href="#how-it-works" className="hover:text-[#1B5E20] transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-[#1B5E20] transition-colors">
              Visit Fee (Rs. 200)
            </a>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-[#1B5E20] border border-gray-200 hover:border-[#1B5E20] rounded-xl transition-all flex items-center gap-1.5 shadow-sm bg-gray-50/50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>Admin Portal (ایڈمن)</span>
            </Link>

            <button
              onClick={() => handleOpenBooking()}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#1B5E20] hover:bg-[#144718] text-white rounded-xl shadow-lg shadow-[#1B5E20]/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Book a Worker</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#1B5E20]/10 border border-[#1B5E20]/20 rounded-full px-4 py-1.5 text-xs font-bold text-[#1B5E20]">
                <Sparkles className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>Pakistan&apos;s Most Trusted Home & Automobile Services</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.12]">
                Find A Trusted Worker Near You in Minutes.
                <span className="block text-[#1B5E20] mt-1">
                  بہترین کاریگر، اب آپ کی دہلیز پر۔
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Connect with verified local mechanics, AC technicians, plumbers, and electricians.
                Transparent flat <strong className="text-gray-900 font-semibold">Rs. 200 inspection fee</strong> and cash payment directly to the expert upon completion.
              </p>

              {/* Interactive Quick Service Selector */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/5 border border-gray-100 max-w-xl mx-auto lg:mx-0 text-left space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Select Required Service (سروس منتخب کریں):
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {services.map((srv) => {
                    const isSelected = selectedService.id === srv.id;
                    const Icon = srv.icon;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#1B5E20] text-white border-[#1B5E20] shadow-md shadow-[#1B5E20]/25 font-bold"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#1B5E20]"}`} />
                        <span className="text-xs font-bold leading-tight">{srv.name.split(" ")[0]}</span>
                        <span className={`text-[10px] ${isSelected ? "text-emerald-200" : "text-gray-500"}`}>
                          {srv.urduName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs text-gray-700">
                    <MapPin className="w-4 h-4 text-[#1B5E20] shrink-0" />
                    <span className="font-semibold text-gray-900 truncate">
                      {selectedCity}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-auto">Nearby</span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(selectedService)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#1B5E20]/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>Book {selectedService.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B5E20]" />
                    NADRA CNIC Verified
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1B5E20]" />
                    30 Min Fast Dispatch
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-[#1B5E20]" />
                    Cash on Delivery
                  </span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900">4.8/5.0</span>
                  <span className="text-xs text-gray-400">(1,840+ Reviews)</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                  <Users className="w-4 h-4 text-[#1B5E20]" />
                  <span>240+ Active Technicians</span>
                </div>
              </div>
            </div>

            {/* Right Image Showcase Column (Showcasing User's 4 Services Picture) */}
            <div className="lg:col-span-5 relative" id="technicians">
              {/* Decorative Frame */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-emerald-950/20 bg-gray-100 group relative">
                  <img
                    src="/services-grid.jpg"
                    alt="KAMZO Certified Pakistani Technicians - Electrician, Plumber, AC Repair, Mechanic"
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                        <div>
                          <p className="text-xs font-bold text-white">
                            Certified Pakistani Technicians
                          </p>
                          <p className="text-[10px] text-emerald-300">
                            Mechanic • AC Repair • Plumber • Electrician
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#1B5E20] px-2 py-1 rounded-md text-white">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Trust Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-2.5 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1B5E20]">
                    <ShieldCheck className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Security Check</p>
                    <p className="text-xs font-bold text-gray-900">100% CNIC Verified</p>
                  </div>
                </div>

                {/* Floating Trust Badge 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-2.5 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Transparent Fee</p>
                    <p className="text-xs font-bold text-gray-900">Rs. 200 Initial Inspection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 CORE SERVICES DETAILED SECTION ─── */}
      <section className="py-20 bg-gray-50/70 border-t border-b border-gray-100" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] text-xs font-bold">
              <span>ہماری 4 بنیادی خدمات</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Only The Best Certified Experts
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Launch services specifically designed for Pakistani households and vehicles. Transparent pricing with no hidden charges.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#1B5E20]/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-700">
                        Fee: {srv.inspectionFee}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors">
                        {srv.name}
                      </h3>
                      <p className="text-xs font-bold text-[#1B5E20]">{srv.urduName}</p>
                      <p className="text-[11px] font-medium text-emerald-700 mt-0.5">{srv.tag}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {srv.description}
                    </p>

                    {/* Common Issues Chips */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Common Repairs:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {srv.commonIssues.map((issue, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium"
                          >
                            • {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-6 mt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenBooking(srv)}
                      className="w-full py-2.5 px-4 bg-emerald-50 group-hover:bg-[#1B5E20] text-[#1B5E20] group-hover:text-white font-bold text-xs rounded-xl border border-emerald-200 group-hover:border-[#1B5E20] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
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

      {/* ─── HOW IT WORKS (تین آسان مراحل) ─── */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B5E20]">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              How KAMZO Works (تین آسان مراحل)
            </h2>
            <p className="text-sm text-gray-600">
              No complicated procedures. Experience local home repairs with maximum peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200/80 relative text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1B5E20] text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-[#1B5E20]/30">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Request Service & Pay Visit Fee
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose your required technician (Mechanic, AC, Plumber, Electrician), explain your issue, and pay the flat <strong>Rs. 200 inspection fee</strong> via JazzCash, Easypaisa, or Bank.
              </p>
              <div className="pt-2 text-[11px] font-bold text-[#1B5E20]">
                فلیٹ 200 روپے وزٹ فیس
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200/80 relative text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1B5E20] text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-[#1B5E20]/30">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Verified Expert Arrives at Doorstep
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The nearby verified technician accepts the booking, navigates directly to your location, inspects the fault thoroughly, and provides a clear diagnostic repair estimate.
              </p>
              <div className="pt-2 text-[11px] font-bold text-[#1B5E20]">
                30 منٹ کے اندر دہلیز پر آمد
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200/80 relative text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1B5E20] text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-[#1B5E20]/30">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Confirm Bill & Pay Cash on Completion
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Once the job is completed to your satisfaction, confirm the worker&apos;s bill and pay them directly in cash. Rate your experience to maintain community trust!
              </p>
              <div className="pt-2 text-[11px] font-bold text-[#1B5E20]">
                کام مکمل ہونے پر کیش ادائیگی
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PAKISTANI TRUST & PAYMENT PARTNERS ─── */}
      <section className="py-16 bg-[#0c2410] text-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Built Specifically for Pakistan
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Reliable Local Payment Verification
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                We strictly integrate with trusted Pakistani financial networks. Customers can pay the visit fee via JazzCash, Easypaisa, or 1Link Bank Transfer with manual screenshot receipt verification.
              </p>

              <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                    JC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">JazzCash</p>
                    <p className="text-[10px] text-gray-400">Instant Verification</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
                    EP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Easypaisa</p>
                    <p className="text-[10px] text-gray-400">Wallet Support</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    1L
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">1Link Bank</p>
                    <p className="text-[10px] text-gray-400">IBAN Transfer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Our 100% Assurance Guarantee
                  </h3>
                  <p className="text-xs text-emerald-300">
                    کوئی دھوکہ دہی نہیں، مکمل شفافیت
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Technicians background-checked via Pakistani CNIC</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard flat inspection charge of only Rs. 200</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Labor bill is only confirmed after you approve the work</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct phone support and booking dispute handling</span>
                </li>
              </ul>

              <button
                onClick={() => handleOpenBooking()}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-black/40 cursor-pointer"
              >
                Book Your Certified Worker Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black p-0.5 border border-gray-700">
                <img src="/logo.jpg" alt="KAMZO Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wider">KAMZO</span>
                <p className="text-[11px] text-[#1B5E20] font-bold">آپ کی ضرورت، ہمارے ماہر</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link href="/login" className="text-emerald-400 hover:text-white transition-colors bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                ⚡ Admin Portal Login (ایڈمن)
              </Link>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 KAMZO Pakistan. Designed for Pakistan&apos;s Home & Auto Service Industry.</p>
            <p className="text-emerald-500 font-semibold">Lahore • Karachi • Islamabad • Rawalpindi</p>
          </div>
        </div>
      </footer>

      {/* ─── INTERACTIVE ONLINE BOOKING MODAL ─── */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStep === "form" ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                {/* Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Service Request (فوری بکنگ)</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-950">
                    Book {selectedService.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedService.urduName} — Initial inspection fee: <strong className="text-gray-900">{selectedService.inspectionFee}</strong>
                  </p>
                </div>

                {/* Service Picker inside Modal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Choose Service Type:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((srv) => (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          selectedService.id === srv.id
                            ? "bg-[#1B5E20] text-white border-[#1B5E20]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <span>{srv.name.split(" ")[0]}</span>
                        <span className="text-[10px] font-normal opacity-80">({srv.urduName})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Select City (شہر):</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1B5E20]"
                  >
                    {pakistaniCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Your Full Name (آپ کا نام):</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Pakistani Mobile (موبائل نمبر):</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-xs font-bold text-gray-600">
                      +92
                    </span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="300 1234567"
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-xs focus:outline-none focus:border-[#1B5E20]"
                    />
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Problem Description (مسئلہ کی تفصیل):</label>
                  <textarea
                    rows={3}
                    required
                    value={problemDetail}
                    onChange={(e) => setProblemDetail(e.target.value)}
                    placeholder="Describe what needs repair or servicing..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#1B5E20] resize-none"
                  />
                </div>

                {/* Visit fee breakdown */}
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-emerald-950">
                    <span>Initial Inspection / Visit Fee:</span>
                    <span>Rs. 200</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Actual repair/labor charges will be estimated on-site and paid directly to the worker in cash upon completion.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#1B5E20]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Booking Request (درخواست بھیجیں)</span>
                </button>
              </form>
            ) : (
              /* Confirmation Screen */
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1B5E20] flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-950">Booking Confirmed!</h3>
                  <p className="text-xs text-emerald-700 font-bold mt-1">
                    درخواست کامیابی کے ساتھ رجسٹر ہو گئی ہے۔
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2 border border-gray-200 text-left">
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-500">Booking Reference:</span>
                    <span className="font-mono font-bold text-gray-900">{confirmedBookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-bold text-gray-900">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">City / Location:</span>
                    <span className="font-bold text-gray-900">{selectedCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer Name:</span>
                    <span className="font-bold text-gray-900">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mobile:</span>
                    <span className="font-bold text-gray-900">+92 {customerPhone}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-[#1B5E20] font-bold">
                    <span>Initial Inspection Fee:</span>
                    <span>Rs. 200</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Our nearest certified <strong>{selectedService.name}</strong> has been notified and will contact you via WhatsApp / Call within <strong>10 minutes</strong>.
                </p>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full py-2.5 bg-[#1B5E20] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
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
