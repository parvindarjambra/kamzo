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
  Smartphone,
  Home,
  Layers,
  Upload,
  Briefcase,
  CreditCard,
  Globe,
  Lock,
  Check,
  AlertTriangle,
  ArrowLeft,
  Percent,
  Info,
  Camera,
  MapPin,
  User,
  LogIn,
  LogOut,
  PackageCheck,
  UserCheck,
  KeyRound,
  ChevronDown,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";

interface ServiceData {
  id: string;
  name: string;
  urduName: string;
  sindhiName: string;
  category: string;
  categoryUrdu: string;
  categorySindhi: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  color: string;
  badgeBg: string;
  description: string;
  descriptionUrdu: string;
  descriptionSindhi: string;
  inspectionFee: string;
  inspectionFeeUrdu: string;
  inspectionFeeSindhi: string;
  popularItems: string[];
  popularItemsUrdu: string[];
  popularItemsSindhi: string[];
}

const services: ServiceData[] = [
  {
    id: "mechanic",
    name: "Auto Mechanic",
    urduName: "آٹو مکینک",
    sindhiName: "آٽو ميڪينڪ",
    category: "Automobile & Roadside Assistance",
    categoryUrdu: "گاڑی اور روڈ سائیڈ سروس",
    categorySindhi: "گاڏي ۽ روڊ سائيڊ سروس",
    icon: Wrench,
    image: "/worker-mechanic.jpg",
    color: "#E11D48",
    badgeBg: "bg-rose-50 text-rose-600 border-rose-200",
    description: "Expert car diagnostics, engine tuning, brake repairs, oil change, suspension, and roadside breakdown support.",
    descriptionUrdu: "گاڑی کا معائنہ، انجن ٹیوننگ، بریک ریپیئر، آئل چینج اور روڈ پر خرابی کی فوری مدد۔",
    descriptionSindhi: "گاڏي جي چيڪنگ، انجڻ ٽيوننگ، بريڪ مرمت، آئل چينج ۽ روڊ تي فوري مدد۔",
    inspectionFee: "Rs. 200",
    inspectionFeeUrdu: "200 روپے",
    inspectionFeeSindhi: "200 رپيا",
    popularItems: ["Engine Noise & Overheating", "Brake Pad Replacement", "Oil & Filter Service", "Emergency Breakdown"],
    popularItemsUrdu: ["انجن کی آواز اور گرم ہونا", "بریک پیڈ کی تبدیلی", "آئل اور فلٹر سروس", "روڈ پر ایمرجنسی خرابی"],
    popularItemsSindhi: ["انجڻ جو آواز ۽ گرم ٿيڻ", "بريڪ پيڊ مٽائڻ", "آئل ۽ فلٽر سروس", "روڊ تي ايمرجنسي خرابي"],
  },
  {
    id: "ac_repair",
    name: "AC Repair & Service",
    urduName: "اے سی سروس و ریپیئر",
    sindhiName: "اي سي سروس ۽ مرمت",
    category: "Cooling & Inverter PCB",
    categoryUrdu: "کولنگ اور انورٹر پی سی بی",
    categorySindhi: "اي سي کولنگ ۽ وائرنگ",
    icon: Snowflake,
    image: "/worker-ac.jpg",
    color: "#0284C7",
    badgeBg: "bg-sky-50 text-sky-600 border-sky-200",
    description: "Inverter AC diagnostics, deep master wash chemical cleaning, gas leakage detection, R410/R32 refill, and installation.",
    descriptionUrdu: "انورٹر اے سی کا معائنہ، کیمیکل ماسٹر واش، گیس لیکیج چیک اور ری فل، اور نئی فٹنگ۔",
    descriptionSindhi: "انورٽر اي سي چيڪنگ، ڪيميڪل واش، گئس ليڪيج چيڪ ۽ نئين فٽنگ۔",
    inspectionFee: "Rs. 200",
    inspectionFeeUrdu: "200 روپے",
    inspectionFeeSindhi: "200 رپيا",
    popularItems: ["Low or No Cooling", "Gas Leakage & Refill", "Water Dripping Inside", "Inverter PCB Error"],
    popularItemsUrdu: ["کم یا بند کولنگ", "گیس لیکیج اور چارجنگ", "اندر پانی ٹپکنا", "انورٹر پی سی بی مسئلہ"],
    popularItemsSindhi: ["گهٽ کولنگ يا کولنگ بند", "گئس ليڪيج ۽ چارجنگ", "اندر پاڻي ٽمڻ", "انورٽر پي سي بي مسئلو"],
  },
  {
    id: "plumber",
    name: "Plumbing Services",
    urduName: "پلمبر سروس",
    sindhiName: "پلمبر سروس",
    category: "Leakage & Sanitary",
    categoryUrdu: "پانی لیکیج اور سینیٹری",
    categorySindhi: "پاڻي لڪيج ۽ فٽنگ",
    icon: Droplets,
    image: "/worker-plumber.jpg",
    color: "#16A34A",
    badgeBg: "bg-emerald-50 text-[#16A34A] border-emerald-200",
    description: "Concealed pipeline leak detection, motor water pump repair, sanitary fittings, drain unblocking, and geyser setup.",
    descriptionUrdu: "پائپ لائن لیکیج کا سراغ، موٹر پمپ مرمت، باتھ روم سینیٹری، نالی کی صفائی اور گیزر فٹنگ۔",
    descriptionSindhi: "پائپ ليڪيج چيڪنگ، پاڻي واري موٽر مرمت، غسل خاني جي فٽنگ ۽ نالي صفائي۔",
    inspectionFee: "Rs. 200",
    inspectionFeeUrdu: "200 روپے",
    inspectionFeeSindhi: "200 رپيا",
    popularItems: ["Underground Pipe Leaks", "Water Motor / Pump Repair", "Blocked Drain Cleaning", "Tap & Mixer Fitting"],
    popularItemsUrdu: ["زمین دوز پائپ لیکیج", "پانی کی موٹر کی مرمت", "بند نالی اور گٹر صفائی", "نلکا اور مکسر فٹنگ"],
    popularItemsSindhi: ["پائپ ليڪيج مسئلو", "پاڻي واري موٽر جي مرمت", "بند نالي صفائي", "نلڪو ۽ مڪسر فٽنگ"],
  },
  {
    id: "electrician",
    name: "Electrician Services",
    urduName: "الیکٹریشن سروس",
    sindhiName: "اليڪٽريشن سروس",
    category: "Wiring & Breakers",
    categoryUrdu: "وائرنگ اور بریکر",
    categorySindhi: "بجلي وائرنگ ۽ بريڪر",
    icon: Zap,
    image: "/worker-electrician.jpg",
    color: "#D97706",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    description: "Short circuit troubleshooting, distribution box breakers, ceiling fan installation, UPS & solar inverter wiring.",
    descriptionUrdu: "شارٹ سرکٹ چیکنگ، مین بریکر بکس، پنکھے کی فٹنگ، اور یو پی ایس و سولر انورٹر وائرنگ۔",
    descriptionSindhi: "شارٽ سرڪٽ چيڪنگ، مين بريڪر باڪس، پکن جي فٽنگ، ۽ يو پي ايس وائرنگ۔",
    inspectionFee: "Rs. 200",
    inspectionFeeUrdu: "200 روپے",
    inspectionFeeSindhi: "200 رپيا",
    popularItems: ["Main Breaker Tripping", "Short Circuit Detection", "UPS / Solar Inverter Setup", "Switchboard Wiring"],
    popularItemsUrdu: ["مین بریکر کا گرنا", "شارٹ سرکٹ کی تلاش", "یو پی ایس اور سولر فٹنگ", "سوئچ بورڈ کی وائرنگ"],
    popularItemsSindhi: ["مين بريڪر ڪرڻ", "شارٽ سرڪٽ مسئلو", "يو پي ايس ۽ سولر فٽنگ", "سوئچ بورڊ وائرنگ"],
  },
];

// Pure Language Pakistani Cities Lists (Zero Mixed Scripts)
const pakistaniCities = {
  en: [
    "Umerkot",
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Hyderabad",
    "Mirpur Khas",
    "Sukkur",
    "Larkana",
    "Nawabshah",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Gujranwala",
    "Sialkot",
    "Quetta",
    "Bahawalpur",
    "Sargodha",
    "Abbottabad",
    "Mardan",
    "Other / Type Below",
  ],
  ur: [
    "عمرکوٹ",
    "کراچی",
    "لاہور",
    "اسلام آباد",
    "راولپنڈی",
    "حیدرآباد",
    "میرپور خاص",
    "سکھر",
    "لاڑکانہ",
    "نواب شاہ",
    "فیصل آباد",
    "ملتان",
    "پشاور",
    "گوجرانوالہ",
    "سیالکوٹ",
    "کوئٹہ",
    "بہاولپور",
    "سرگودھا",
    "ایبٹ آباد",
    "مردان",
    "دیگر شہر / اپنا شہر لکھیں",
  ],
  sd: [
    "عمرڪوٽ",
    "ڪراچي",
    "لاهور",
    "اسلام آباد",
    "راولپنڊي",
    "حيدرآباد",
    "ميرپور خاص",
    "سکر",
    "لاڙڪاڻو",
    "نواب شاهه",
    "فيصل آباد",
    "ملتان",
    "پشاور",
    "گوجرانوالا",
    "سيالڪوٽ",
    "ڪوئيٽا",
    "بهاولپور",
    "سرگوڌا",
    "ايڊٽ آباد",
    "مردان",
    "ٻيو شهر / پنهنجو شهر لکو",
  ],
};

const workerSkillsList = {
  en: [
    "Auto Mechanic",
    "AC & Refrigeration",
    "Plumber & Sanitary",
    "Electrician & Wiring",
    "Carpenter & Woodwork",
    "Home Appliances Repair",
  ],
  ur: [
    "آٹو مکینک",
    "اے سی و ریفریجریشن",
    "پلمبر و سینیٹری",
    "الیکٹریشن و وائرنگ",
    "کارپینٹر (بڑھئی)",
    "گھریلو سامان مرمت",
  ],
  sd: [
    "آٽو ميڪينڪ",
    "اي سي ۽ ريفريجريشن",
    "پلمبر ۽ فٽنگ",
    "اليڪٽريشن ۽ وائرنگ",
    "واڍو (ڪارپينٽر)",
    "گھريلو سامان مرمت",
  ],
};

// Website Content Translations
const siteContent = {
  en: {
    selectLanguage: "Language:",
    taglineBadge: "PAKISTAN'S #1 ON-DEMAND SERVICE MARKETPLACE",
    mainHeadline: "Pakistan's Trusted On-Demand Services Marketplace",
    subHeadline: "Your Need, Our Verified Experts.",
    heroSubtitle: "Connect with verified local mechanics, AC technicians, plumbers, and electricians anywhere in Pakistan. Transparent diagnostics and pay cash directly after satisfactory completion.",
    bookAsCustomer: "1. Book as Customer",
    bookAsCustomerSub: "Order Service • Verified Technician",
    joinAsWorker: "2. Join as Worker",
    joinAsWorkerSub: "Register Skill • Earn & Get Daily Jobs",
    reviewsCount: "(2,100+ Reviews)",
    activeTechnicians: "320+ Active Technicians",
    securityCheck: "Security Check",
    cnicVerified: "100% CNIC Verified",
    visitFeeLabel: "Visit Fee",
    visitFeeValue: "Advance Diagnostic Fee",
    certifiedTechsBanner: "Certified Pakistani Technicians",
    techsListBanner: "Mechanic • AC Repair • Plumber • Electrician",
    verifiedBadge: "Verified",
    coreServicesTag: "CORE SERVICES",
    coreServicesTitle: "Comprehensive On-Demand Solutions",
    coreServicesSub: "Select your required category and get an immediate verified expert at your location.",
    commonIssuesLabel: "Common Issues:",
    feePrefix: "",
    unlockBookingBadge: "Unlock Booking",
    certifiedTechBadge: "Certified Technician",
    bookNowPrefix: "Book ",
    bookNowSuffix: " Now",
    whyChooseTag: "BENEFITS",
    whyChooseTitle: "Why Customers Choose KAMZO",
    whyChooseSub: "The safest and most reliable way to hire skilled trade workers in Pakistan.",
    benefit1Title: "100% CNIC Background Verified",
    benefit1Desc: "Every service professional is thoroughly screened and identity-verified with Pakistani NADRA CNIC registration.",
    benefit2Title: "Fair & Transparent Diagnostic Rates",
    benefit2Desc: "Zero surprise charges. Clear upfront inspection quote, and you pay the final repair amount in cash only when you approve the work.",
    benefit3Title: "Rapid 30-Minute Doorstep Arrival",
    benefit3Desc: "Our automated algorithm connects you with the nearest active partner in your locality for prompt response.",
    howItWorksTag: "HOW IT WORKS",
    howItWorksTitle: "Three Simple Steps",
    howItWorksSub: "No complicated calls or bargaining. Experience smooth, transparent service delivery.",
    step1Title: "Request Service & Unlock Booking",
    step1Desc: "Select your service, choose your city, and submit diagnostic visit fee via JazzCash, Easypaisa, or Bank.",
    step2Title: "Certified Expert Arrives",
    step2Desc: "The nearby verified technician navigates to your doorstep, performs on-site diagnostics, and gives a clear price quotation.",
    step3Title: "Confirm Bill & Pay Cash",
    step3Desc: "Once the job is completed, confirm the worker's final bill and pay cash directly. Rate the worker to keep standards high!",
    navServices: "Services",
    navHowItWorks: "How It Works",
    navWhyUs: "Why KAMZO",
    footerTagline: "Your Need, Our Verified Experts",
    footerCopyright: "© 2026 KAMZO Pakistan. Built for Pakistan's Local Services Industry.",
    footerLocations: "Umerkot • Karachi • Lahore • Islamabad • Nationwide",
    whatsappTooltip: "WhatsApp Support: +92 319 7318425",
    scrollTopTooltip: "Scroll to Top",
    installAppBtn: "Install App",
    bottomNavBook: "Book",
    bottomNavJoinWorker: "Join as Worker",
  },
  ur: {
    selectLanguage: "زبان:",
    taglineBadge: "پاکستان کا نمبر 1 لوکل سروس مارکیٹ پلیس",
    mainHeadline: "پاکستان کا بااعتماد سروس مارکیٹ پلیس",
    subHeadline: "آپ کی ضرورت، ہمارے ماہر کاریگر۔",
    heroSubtitle: "پاکستان بھر میں تصدیق شدہ مکینک، اے سی ٹیکنیشن، پلمبر اور الیکٹریشن سے رابطہ کریں۔ شفاف معائنہ، اور کام تسلی بخش مکمل ہونے پر کیش ادا کریں۔",
    bookAsCustomer: "1. گاہک بکنگ",
    bookAsCustomerSub: "کاریگر بلوائیں • تصدیق شدہ سروس",
    joinAsWorker: "2. کاریگر رجسٹریشن",
    joinAsWorkerSub: "ہنر رجسٹر کریں • روزانہ کام حاصل کریں",
    reviewsCount: "(2,100+ جائزے)",
    activeTechnicians: "320+ تصدیق شدہ کاریگر",
    securityCheck: "سیکیورٹی چیک",
    cnicVerified: "100% شناختی کارڈ تصدیق",
    visitFeeLabel: "وزٹ فیس",
    visitFeeValue: "معائنہ فیس",
    certifiedTechsBanner: "سرٹیفائیڈ پاکستانی ماہر کاریگر",
    techsListBanner: "مکینک • اے سی سروس • پلمبر • الیکٹریشن",
    verifiedBadge: "تصدیق شدہ",
    coreServicesTag: "بنیادی خدمات",
    coreServicesTitle: "گھر اور دکان کی فوری و تسلی بخش مرمت",
    coreServicesSub: "اپنی مطلوبہ سروس منتخب کریں اور فوری طور پر تصدیق شدہ ماہر کاریگر بلوائیں۔",
    commonIssuesLabel: "عام مسائل:",
    feePrefix: "",
    unlockBookingBadge: "بکنگ انلاک",
    certifiedTechBadge: "تصدیق شدہ کاریگر",
    bookNowPrefix: "ابھی ",
    bookNowSuffix: " بک کریں",
    whyChooseTag: "فوائد",
    whyChooseTitle: "صارفین کامزو کا انتخاب کیوں کرتے ہیں؟",
    whyChooseSub: "پاکستان میں ہنر مند کاریگر ہائر کرنے کا سب سے محفوظ اور شفاف پلیٹ فارم۔",
    benefit1Title: "100% نادرا شناختی کارڈ تصدیق شدہ",
    benefit1Desc: "ہر سروس پروفیشنل کی مکمل جانچ پڑتال نادرا قومی شناختی کارڈ کے ساتھ کی جاتی ہے۔",
    benefit2Title: "شفاف اور مناسب قیمت",
    benefit2Desc: "کوئی چھپے ہوئے اضافی چارجز نہیں۔ کام تسلی بخش مکمل ہونے کے بعد کاریگر کو کیش میں ادائیگی کریں۔",
    benefit3Title: "30 منٹ کے اندر دہلیز پر آمد",
    benefit3Desc: "ہمارا سسٹم آپ کے قریبی ایکٹو پارٹنر کو فوری الرٹ بھیجتا ہے تا کہ وہ جلد از جلد آپ تک پہنچ سکے۔",
    howItWorksTag: "طریقہ کار",
    howItWorksTitle: "تین آسان مراحل",
    howItWorksSub: "کوئی لمبی کالز یا بحث نہیں۔ آسان اور شفاف طریقے سے کام کروائیں۔",
    step1Title: "سروس منتخب کریں اور بکنگ انلاک کریں",
    step1Desc: "اپنی مطلوبہ سروس اور شہر منتخب کریں اور جاز کیش، ایزی پیسہ یا بینک سے وزٹ فیس منتقل کریں۔",
    step2Title: "تصدیق شدہ کاریگر کی آمد",
    step2Desc: "نزدیکی تصدیق شدہ کاریگر آپ کے پتے پر پہنچ کر معائنہ کرے گا اور مناسب خرچ بتائے گا۔",
    step3Title: "کام کی تسلی اور کیش ادائیگی",
    step3Desc: "کام مکمل ہونے پر فائنل بل کاریگر کو موقع پر کیش ادا کریں۔ اور کاریگر کو سٹار ریٹنگ دیں۔",
    navServices: "خدمات",
    navHowItWorks: "طریقہ کار",
    navWhyUs: "فوائد",
    footerTagline: "آپ کی ضرورت، ہمارے ماہر",
    footerCopyright: "© 2026 کامزو پاکستان۔ لوکل سروسز مارکیٹ پلیس۔",
    footerLocations: "عمرکوٹ • کراچی • لاہور • اسلام آباد • پورے پاکستان میں",
    whatsappTooltip: "واٹس ایپ رابطہ: +92 319 7318425",
    scrollTopTooltip: "اوپر جائیں",
    installAppBtn: "ایپ انسٹال کریں",
    bottomNavBook: "بک کریں",
    bottomNavJoinWorker: "کاریگر بنیں",
  },
  sd: {
    selectLanguage: "ٻولي:",
    taglineBadge: "پاڪستان جو نمبر 1 مقامي سروس مارڪيٽ پليس",
    mainHeadline: "پاڪستان جو معتبر مقامي سروس مارڪيٽ پليس",
    subHeadline: "توهان جي ضرورت، اسان جا ماهر ڪاريگر۔",
    heroSubtitle: "سڄي پاڪستان ۾ تصديق ٿيل ميڪينڪ، اي سي ٽيڪنيشن، پلمبر ۽ اليڪٽريشن۔ صاف معائنو، ۽ ڪم پورو ٿيڻ تي هٿ تي ڪيش ادا ڪريو۔",
    bookAsCustomer: "1. گراهڪ بڪنگ",
    bookAsCustomerSub: "ڪاريگر گهرايو • تصديق ٿيل سروس",
    joinAsWorker: "2. ڪاريگر رجسٽريشن",
    joinAsWorkerSub: "هنر رجسٽر ڪريو • روزانو ڪم حاصل ڪريو",
    reviewsCount: "(2,100+ رايا)",
    activeTechnicians: "320+ تصديق ٿيل ڪاريگر",
    securityCheck: "سيڪيورٽي چيڪ",
    cnicVerified: "100% سڃاڻپ ڪارڊ تصديق",
    visitFeeLabel: "وزٽ فيس",
    visitFeeValue: "معائنو فيس",
    certifiedTechsBanner: "تصديق ٿيل پاڪستاني ماهر ڪاريگر",
    techsListBanner: "ميڪينڪ • اي سي سروس • پلمبر • اليڪٽريشن",
    verifiedBadge: "تصديق ٿيل",
    coreServicesTag: "مکيه خدمتون",
    coreServicesTitle: "گهر ۽ دڪان جي فوري و تسلي بخش مرمت",
    coreServicesSub: "پنهنجي گهربل سروس چونڊيو ۽ فوري طور ماهر ڪاريگر گهرايو۔",
    commonIssuesLabel: "عام مسئلا:",
    feePrefix: "",
    unlockBookingBadge: "بڪنگ انلاڪ",
    certifiedTechBadge: "تصديق ٿيل ڪاريگر",
    bookNowPrefix: "هاڻي ",
    bookNowSuffix: " بڪ ڪريو",
    whyChooseTag: "فائدا",
    whyChooseTitle: "ماڻهو ڪامزو ڇو چونڊيندا آهن؟",
    whyChooseSub: "پاڪستان ۾ ڪاريگر گهرائڻ جو سڀ کان محفوظ ۽ آسان طريقو۔",
    benefit1Title: "100% نادرا سڃاڻپ ڪارڊ تصديق ٿيل",
    benefit1Desc: "هر ڪاريگر جي مڪمل چڪاس نادرا قومي سڃاڻپ ڪارڊ ذريعي ڪئي وڃي ٿي۔",
    benefit2Title: "شفاف ۽ مناسب اگهه",
    benefit2Desc: "ڪو به لڪيل خرچ ناهي۔ تسلي بخش ڪم مڪمل ٿيڻ بعد ڪاريگر کي هٿ تي ڪيش ادا ڪريو۔",
    benefit3Title: "30 منٽن ۾ گهر پهچ",
    benefit3Desc: "اسان جو سسٽم توهان جي ويجھي ڪاريگر کي فوري اطلاع موڪلي ٿو ته جيئن هو جلدي پهچي۔",
    howItWorksTag: "طريقو",
    howItWorksTitle: "ٽي سولا مرحلا",
    howItWorksSub: "ڪا به ڏکيائي ناهي۔ سولو ۽ شفاف طريقي سان ڪم ڪرايو۔",
    step1Title: "سروس چونڊيو ۽ بڪنگ انلاڪ ڪريو",
    step1Desc: "پنهنجي گهربل سروس ۽ شهر چونڊيو ۽ جاز ڪيش، ايزي پئسا يا بينڪ مان وزٽ فيس ادا ڪريو۔",
    step2Title: "تصديق ٿيل ڪاريگر جي پهچ",
    step2Desc: "ويجھو تصديق ٿيل ڪاريگر توهان جي گهر اچي ڪم ڏسي مناسب اگهه ٻڌائيندو۔",
    step3Title: "ڪم جي تسلي ۽ ڪيش ادائيگي",
    step3Desc: "ڪم مڪمل ٿيڻ بعد بل ڪاريگر کي هٿ تي ڪيش ڏيو ۽ ريٽنگ ڏيو۔",
    navServices: "خدمتون",
    navHowItWorks: "طريقو",
    navWhyUs: "فائدا",
    footerTagline: "توهان جي ضرورت، اسان جا ماهر",
    footerCopyright: "© 2026 ڪامزو پاڪستان۔ مقامي سروسز مارڪيٽ پليس۔",
    footerLocations: "عمرڪوٽ • ڪراچي • لاهور • اسلام آباد • سڄي پاڪستان ۾",
    whatsappTooltip: "واٽس ايپ رابطو: +92 319 7318425",
    scrollTopTooltip: "مٿي وڃو",
    installAppBtn: "ايپ انسٽال ڪريو",
    bottomNavBook: "بڪ ڪريو",
    bottomNavJoinWorker: "ڪاريگر ٿيو",
  },
};

// Modal Translations
const modalContent = {
  en: {
    bookingStep1Badge: "Step 1 of 2: Service & Location Details",
    bookTitle: "Book",
    initialInspectionFee: "Initial inspection fee:",
    chooseServiceLabel: "Choose Service Type:",
    selectCityLabel: "Select City / Location:",
    customCityPlaceholder: "Type your City / Town / Area name",
    fullNameLabel: "Your Full Name:",
    fullNamePlaceholder: "e.g. Parvindar Kumar / Ali Khan",
    mobileLabel: "Pakistani Mobile Number:",
    problemLabel: "Problem / Work Details:",
    problemPlaceholder: "Describe what needs repair, servicing, or installation...",
    feeBreakdownTitle: "Initial Inspection / Visit Fee:",
    feeBreakdownSub: "Next step: Transfer Rs. 200 visit fee via JazzCash/Easypaisa to confirm technician dispatch.",
    nextPaymentBtn: "Next: Proceed to Visit Fee Payment",
    bookingStep2Badge: "Step 2 of 2: Transfer Visit Fee",
    attachProofTitle: "Attach Payment Proof",
    attachProofSub: "Send advance inspection fee to any account below and upload the screenshot.",
    depositDetails: "Deposit Account Details:",
    transferInstruction: (method: string) => `Open your ${method} App, send the visit fee, then paste the TID below.`,
    tidLabel: "Transaction ID / TID:",
    tidRequired: "Required",
    tidPlaceholder: "e.g. TID 04982189421 / SMS Ref",
    receiptProofLabel: "Attach Payment Screenshot / Proof:",
    fastApproval: "Fast Approval",
    receiptAttached: "Receipt Proof Attached",
    changeScreenshot: "Change Screenshot",
    tapUploadReceipt: "Tap to Upload Screenshot / Receipt",
    uploadFormats: "JPEG, PNG or Camera photo from your phone",
    backBtn: "Back",
    submitProofBtn: "Submit Payment Proof & Confirm Booking",
    bookingRegistered: "Booking Registered!",
    bookingSuccessMsg: "Your request and payment proof have been received successfully.",
    underVerification: "⏳ Payment Status: Under Admin Verification",
    bookingRef: "Booking Reference:",
    serviceLabel: "Service:",
    cityLabel: "City / Location:",
    customerLabel: "Customer:",
    methodAndTid: "Method & TID:",
    initialFeeTransferred: "Initial Visit Fee Transferred:",
    nextStepsTitle: "Next Steps:",
    step1AdminVerify: "1. Admin will verify your transaction within 5 to 10 minutes.",
    step2Dispatch: "2. Upon verification, the nearest certified expert will be dispatched to your address.",
    step3PayCash: "3. Final repair and labor charges will be paid directly in cash to the technician after satisfactory completion.",
    doneBtn: "Done",

    // Worker Modal & 3-Step Registration (English)
    workerBadge: "Worker Registration & Partner Portal",
    workerModalTitle: "Join KAMZO as Service Professional",
    workerModalSub: "Register your skill, receive direct client bookings in your area, and earn daily cash income.",
    tabRegister: "1. Worker Registration",
    tabDashboard: "2. Commission & Earnings",
    workerStep1Tag: "Step 1: Personal Details",
    workerStep2Tag: "Step 2: Professional Details",
    workerStep3Tag: "Step 3: Verification & Payout",
    workerNameLabel: "Full Name:",
    workerNamePlaceholder: "e.g. Ramesh Kumar / Muhammad Usman",
    workerMobileLabel: "Mobile Number (+92):",
    workerWhatsAppLabel: "WhatsApp Number (Optional):",
    workerWhatsAppPlaceholder: "e.g. 319 1234567",
    workerCityLabel: "Base City:",
    workerAreaLabel: "Area / Locality / Sector:",
    workerAreaPlaceholder: "e.g. Clifton, Gulshan-e-Iqbal, Saddar, Main Bazaar",
    workerAddressLabel: "Workshop / Shop Address (Optional):",
    workerAddressPlaceholder: "Shop #, Market, or Street address",
    nextStep2Btn: "Continue to Step 2: Professional Details →",

    // Step 2
    workerTradeLabel: "Primary Service Category:",
    categoryMechanic: "Auto Mechanic",
    categoryAC: "AC Repair & Cooling",
    categoryPlumber: "Plumbing & Sanitary",
    categoryElectrician: "Electrician & Wiring",
    workerExpLabel: "Years of Experience:",
    exp1Year: "1 Year Experience",
    exp2Years: "2 Years Experience",
    exp3Years: "3 - 5 Years Experience",
    exp5Years: "5 - 10 Years (Senior Master)",
    exp10Years: "10+ Years (Ustadh / Expert)",
    workerSkillsDescLabel: "Specific Skills / Services Offered:",
    workerSkillsDescPlaceholder: "e.g. Inverter AC PCB diagnosis, Brake overhaul, Concealed pipe leaks, Solar inverter wiring...",
    workTypeLabel: "Service Work Location Type:",
    workTypeDoorstep: "Customer's Doorstep (Ghar Par)",
    workTypeWorkshop: "At My Own Workshop / Shop",
    workTypeBoth: "Both Doorstep & Workshop",
    serviceRadiusLabel: "Service Coverage Area / Radius:",
    radius5km: "Within 5 km radius",
    radius10km: "Within 10 km radius",
    radius20km: "Within 20 km radius",
    radiusEntireCity: "Entire City / Surrounding Areas",
    profilePhotoLabel: "Profile Photo (Passport size / Face photo):",
    uploadProfilePhoto: "Upload Profile Photo",
    photoAttached: "Profile Photo Attached",
    nextStep3Btn: "Continue to Step 3: Verification & Payout →",

    // Step 3
    cnicLabel: "CNIC Number (13 Digits):",
    cnicDigits: "13 Digits",
    cnicPlaceholder: "44102-1234567-1",
    cnicFrontLabel: "CNIC Front Photo:",
    uploadCnicFront: "Upload CNIC Front Photo",
    cnicBackLabel: "CNIC Back Photo:",
    uploadCnicBack: "Upload CNIC Back Photo",
    cnicFrontAttached: "CNIC Front Attached",
    cnicBackAttached: "CNIC Back Attached",
    payoutMethodLabel: "Your Payment Receiving Account (Bank / Wallet):",
    accountTitleLabel: "Account Holder Title (Name):",
    accountTitlePlaceholder: "e.g. Muhammad Usman",
    accountNumberLabel: "Account Number / IBAN / Mobile Wallet:",
    accountNumberPlaceholder: "e.g. 0300 1234567 or IBAN PK...",
    termsAgreementLabel: "I agree to KAMZO Worker Terms and 10% Platform Commission Policy.",
    termsNotice: "You will collect full repair fees from customers in cash. 10% platform commission must be transferred within 7 days.",
    backStepBtn: "← Back",
    submitWorkerBtn: "Submit Registration for Verification",

    // Step 4: Status (Pending Verification)
    workerSuccessTitle: "Registration Submitted — Pending Verification",
    workerSuccessSub: "Your technician application has been submitted successfully to the KAMZO Admin Operations team.",
    statusPendingBadge: "Status: Pending Admin CNIC Verification",
    noBookingsNoticeTitle: "Important Dispatch Policy:",
    noBookingsNoticeDesc: "Before admin approval, workers cannot receive customer bookings. Our team will verify your CNIC and credentials within 24 hours.",
    viewDashboardBtn: "Open Worker Commission Dashboard",

    // Commission Dashboard
    commissionDashboardTitle: "Worker Commission & Job Ledger",
    commissionPolicyTitle: "How KAMZO 10% Commission Works:",
    commissionRule1: "1. Collect 100% repair bill directly from customer in CASH upon job completion.",
    commissionRule2: "2. Platform calculates KAMZO's 10% commission on the job bill.",
    commissionRule3: "3. You keep 90% of your earnings immediately.",
    exampleBoxTitle: "Commission Calculation Example:",
    exampleBill: "Repair Bill: Rs. 3,000",
    exampleCommission: "KAMZO 10% Commission: Rs. 300",
    exampleTakehome: "Worker Keeps: Rs. 2,700",
    calculatorTitle: "Interactive 10% Commission Calculator",
    enterBillLabel: "Enter Job Repair Bill (PKR):",
    youCollectLabel: "You Collect from Customer (Cash):",
    kamzoFeeLabel: "Platform Commission (10%):",
    yourShareLabel: "Your Net Income (90%):",
    commissionDueTitle: "Your Commission Status:",
    commissionDueLabel: "Commission Due:",
    commissionPaidLabel: "Commission Paid:",
    completedJobsLabel: "Completed Jobs:",
    overdueNoticeTitle: "7-Day Overdue Policy:",
    overdueNoticeDesc: "If commission due is not paid within the 7-day grace period, new customer bookings are temporarily paused until payment is approved.",
    payCommissionTitle: "Pay Commission via JazzCash / Easypaisa:",
    tidInputLabel: "Deposit TID / Reference Number:",
    tidPlaceholder: "e.g. TID 0938472918",
    uploadDepositProof: "Upload Deposit Screenshot",
    submitDepositBtn: "Submit Commission Payment Proof",
    depositSubmittedSuccess: "Commission payment proof submitted! Admin will verify and clear your ledger shortly.",

    // Customer Auth & Account (Daraz-style)
    customerLoginBtn: "Login / Sign Up",
    myBookingsBtn: "My Bookings",
    customerLogout: "Sign Out",
    welcomeCustomer: "Welcome Back",
    authModalTitle: "Sign In or Create Account",
    authModalSub: "Just like Daraz: Login to confirm your repair booking and track technician arrival.",
    tabSignIn: "1. Sign In",
    tabRegister: "2. New Account",
    tabQuickLogin: "3. Fast Mobile OTP",
    phoneInputLabel: "Mobile Number (03XX XXXXXXX):",
    passwordInputLabel: "Password:",
    passwordPlaceholder: "Enter your password",
    nameInputLabel: "Full Name:",
    namePlaceholder: "e.g. Ali Khan",
    cityInputLabel: "Your City:",
    loginSubmitBtn: "Sign In & Proceed to Book",
    registerSubmitBtn: "Create Account & Continue",
    quickLoginSubmitBtn: "Verify & Enter",
    alreadyHaveAccount: "Already have an account? Sign In",
    needNewAccount: "New customer? Create an account",
    guestNotice: "All your bookings, invoices, and technician warranties will be safely stored under your mobile number.",
    myBookingsTitle: "My Service Bookings & Orders",
    myBookingsSub: "Real-time tracking of technician dispatch, visit fees, and completion bills.",
    noBookingsFound: "No bookings found yet. Book your first service today!",
    bookNewService: "Book a Service Now",
    callSupport: "WhatsApp Support",
    continueWithGoogle: "Continue with Google",
    emailInputLabel: "Gmail / Email Address:",
    emailPlaceholder: "example@gmail.com",
    orDividerText: "OR SIGN IN WITH GMAIL / PHONE",
    authStepBadge: "Final Step: Sign In to Confirm Order",
    authStepTitle: "Confirm Account & Order",
    authStepSub: "Connect your account to receive live tracking and technician warranty.",
    authTabGmail: "Gmail & Password",
    authTabPhone: "Mobile Number",
  },
  ur: {
    bookingStep1Badge: "مرحلہ 1: سروس اور پتہ کی تفصیلات",
    bookTitle: "بک کریں",
    initialInspectionFee: "ابتدائی وزٹ فیس:",
    chooseServiceLabel: "سروس کی قسم منتخب کریں:",
    selectCityLabel: "شہر کا انتخاب کریں:",
    customCityPlaceholder: "اپنے شہر یا علاقے کا نام لکھیں",
    fullNameLabel: "آپ کا پورا نام:",
    fullNamePlaceholder: "مثال: علی خان / محمد احمد",
    mobileLabel: "پاکستانی موبائل نمبر:",
    problemLabel: "مسئلہ یا کام کی تفصیل:",
    problemPlaceholder: "خرابی یا مطلوبہ کام کی تفصیل بیان کریں...",
    feeBreakdownTitle: "ابتدائی وزٹ فیس:",
    feeBreakdownSub: "اگلا مرحلہ: کاریگر روانگی کی تصدیق کے لیے جاز کیش یا ایزی پیسہ سے وزٹ فیس ادا کریں۔",
    nextPaymentBtn: "اگلا: وزٹ فیس ادائیگی کی طرف جائیں",
    bookingStep2Badge: "مرحلہ 2: وزٹ فیس منتقل کریں",
    attachProofTitle: "رسید کا ثبوت منسلک کریں",
    attachProofSub: "نیچے دیے گئے کسی بھی اکاؤنٹ میں وزٹ فیس بھیجیں اور اسکرین شاٹ اپ لوڈ کریں۔",
    depositDetails: "اکاؤنٹ کی تفصیلات:",
    transferInstruction: (method: string) => `اپنا ${method} ایپ کھولیں، رقم بھیجیں اور نیچے TID درج کریں۔`,
    tidLabel: "ٹرانزیکشن آئی ڈی / TID:",
    tidRequired: "لازمی",
    tidPlaceholder: "مثال: TID 04982189421 یا SMS ریفرنس",
    receiptProofLabel: "رسید کی تصویر / ثبوت لگائیں:",
    fastApproval: "فوری منظوری",
    receiptAttached: "رسید کا ثبوت منسلک ہو گیا",
    changeScreenshot: "تصویر تبدیل کریں",
    tapUploadReceipt: "رسید یا اسکرین شاٹ اپ لوڈ کرنے کے لیے کلک کریں",
    uploadFormats: "تصویر، اسکرین شاٹ یا کیمرے کا فوٹو",
    backBtn: "پیچھے",
    submitProofBtn: "رسید جمع کروائیں اور بکنگ تصدیق کریں",
    bookingRegistered: "بکنگ رجسٹر ہو گئی!",
    bookingSuccessMsg: "آپ کی درخواست اور رسید کامیابی سے موصول ہو گئی ہے۔",
    underVerification: "⏳ ادائیگی کی کیفیت: ایڈمن تصدیق زیر التواء",
    bookingRef: "بکنگ ریفرنس:",
    serviceLabel: "سروس:",
    cityLabel: "شہر / علاقہ:",
    customerLabel: "گاہک:",
    methodAndTid: "طریقہ اور TID:",
    initialFeeTransferred: "منتقل شدہ وزٹ فیس:",
    nextStepsTitle: "اگلے مراحل:",
    step1AdminVerify: "1. ایڈمن 5 سے 10 منٹ میں آپ کی رسید کی تصدیق کرے گا۔",
    step2Dispatch: "2. تصدیق ہوتے ہی قریبی کاریگر آپ کے پتے پر روانہ ہوگا۔",
    step3PayCash: "3. فائنل کام کا بل کام مکمل ہونے پر کاریگر کو کیش ادا کریں۔",
    doneBtn: "مکمل",

    // Worker Modal & 3-Step Registration (Urdu)
    workerBadge: "کاریگر رجسٹریشن اور پورٹل",
    workerModalTitle: "کامزو میں بطور کاریگر شامل ہوں",
    workerModalSub: "اپنا ہنر رجسٹر کریں، اپنے علاقے میں براہ راست کسٹمر کے آرڈرز حاصل کریں، اور روزانہ کیش کمائیں۔",
    tabRegister: "1. کاریگر رجسٹریشن",
    tabDashboard: "2. کمیشن اور ڈیش بورڈ",
    workerStep1Tag: "مرحلہ 1: ذاتی معلومات",
    workerStep2Tag: "مرحلہ 2: پیشہ ورانہ تفصیلات",
    workerStep3Tag: "مرحلہ 3: شناختی تصدیق و اکاؤنٹ",
    workerNameLabel: "کاریگر کا پورا نام:",
    workerNamePlaceholder: "مثال: محمد عثمان / رمیش کمار",
    workerMobileLabel: "موبائل نمبر (+92):",
    workerWhatsAppLabel: "واٹس ایپ نمبر (اختیاری):",
    workerWhatsAppPlaceholder: "مثال: 319 1234567",
    workerCityLabel: "آپ کا شہر:",
    workerAreaLabel: "علاقہ / محلہ / ٹاؤن:",
    workerAreaPlaceholder: "مثال: کلفٹن، گلشن اقبال، صدر، مین بازار",
    workerAddressLabel: "دکان یا ورکشاپ کا پتہ (اختیاری):",
    workerAddressPlaceholder: "دکان نمبر، مارکیٹ یا گلی کا پتہ",
    nextStep2Btn: "مرحلہ 2 کی طرف جائیں: پیشہ ورانہ تفصیلات →",

    // Step 2
    workerTradeLabel: "بنیادی سروس کی قسم:",
    categoryMechanic: "آٹو مکینک",
    categoryAC: "اے سی سروس و کولنگ",
    categoryPlumber: "پلمبر و سینیٹری",
    categoryElectrician: "الیکٹریشن و وائرنگ",
    workerExpLabel: "تجربہ (کتنے سال):",
    exp1Year: "1 سال کا تجربہ",
    exp2Years: "2 سال کا تجربہ",
    exp3Years: "3 سے 5 سال کا تجربہ",
    exp5Years: "5 سے 10 سال (سینئر کاریگر)",
    exp10Years: "10 سال سے زیادہ (استاد / ایکسپرٹ)",
    workerSkillsDescLabel: "مخصوص مہارتیں اور خدمات:",
    workerSkillsDescPlaceholder: "مثال: انورٹر پی سی بی، انجن ٹیوننگ، لیکیج چیکنگ، مین بریکر بکس فٹنگ...",
    workTypeLabel: "کام کی جگہ کی نوعیت:",
    workTypeDoorstep: "کسٹمر کے گھر پر (ہوم وزٹ)",
    workTypeWorkshop: "اپنی ورکشاپ / دکان پر",
    workTypeBoth: "دونوں (گھر اور ورکشاپ)",
    serviceRadiusLabel: "سروس کا دائرہ کار:",
    radius5km: "5 کلومیٹر کے اندر",
    radius10km: "10 کلومیٹر کے اندر",
    radius20km: "20 کلومیٹر کے اندر",
    radiusEntireCity: "پورا شہر اور قریبی علاقے",
    profilePhotoLabel: "پروفائل تصویر (پاسپورٹ سائز فوٹو):",
    uploadProfilePhoto: "پروفائل تصویر اپ لوڈ کریں",
    photoAttached: "پروفائل تصویر منسلک ہے",
    nextStep3Btn: "مرحلہ 3 کی طرف جائیں: تصدیق و اکاؤنٹ →",

    // Step 3
    cnicLabel: "قومی شناختی کارڈ نمبر (13 ہندسے):",
    cnicDigits: "13 ہندسے",
    cnicPlaceholder: "44102-1234567-1",
    cnicFrontLabel: "شناختی کارڈ سامنے کا رخ:",
    uploadCnicFront: "سامنے کی تصویر اپ لوڈ کریں",
    cnicBackLabel: "شناختی کارڈ پچھلا رخ:",
    uploadCnicBack: "پچھلی تصویر اپ لوڈ کریں",
    cnicFrontAttached: "سامنے کی تصویر منسلک ہے",
    cnicBackAttached: "پچھلی تصویر منسلک ہے",
    payoutMethodLabel: "رقم وصولی کا ذریعہ (جاز کیش / ایزی پیسہ / بینک):",
    accountTitleLabel: "اکاؤنٹ ہولڈر کا نام:",
    accountTitlePlaceholder: "مثال: محمد عثمان",
    accountNumberLabel: "اکاؤنٹ یا موبائل والیٹ نمبر:",
    accountNumberPlaceholder: "مثال: 0300 1234567 یا IBAN",
    termsAgreementLabel: "میں کامزو کی شرائط اور 10 فیصد کمیشن پالیسی سے متفق ہوں۔",
    termsNotice: "آپ کسٹمر سے مرمت کے تمام پیسے براہ راست کیش لیں گے۔ کامزو کی 10% کمیشن 7 دن میں جمع کروانی ہوگی۔",
    backStepBtn: "← پیچھے",
    submitWorkerBtn: "رجسٹریشن مکمل کریں اور جمع کروائیں",

    // Step 4: Status
    workerSuccessTitle: "رجسٹریشن جمع ہو گئی — تصدیق زیر التواء ہے",
    workerSuccessSub: "آپ کی کاریگر رجسٹریشن درخواست کامیابی سے کامزو ایڈمن کو موصول ہو گئی ہے۔",
    statusPendingBadge: "کیفیت: ایڈمن شناختی تصدیق زیر التواء",
    noBookingsNoticeTitle: "اہم پالیسی ہدایت:",
    noBookingsNoticeDesc: "ایڈمن کی تصدیق اور منظوری سے پہلے آپ کو کسٹمر آرڈر موصول نہیں ہو سکتے۔ ہماری ٹیم 24 گھنٹوں میں آپ کے شناختی کارڈ کی تصدیق کرے گی۔",
    viewDashboardBtn: "ورکر کمیشن ڈیش بورڈ کھولیں",

    // Commission Dashboard
    commissionDashboardTitle: "کاریگر کمیشن اور آمدنی لیجر",
    commissionPolicyTitle: "کامزو 10% کمیشن سسٹم کیسے کام کرتا ہے؟",
    commissionRule1: "1. کام مکمل ہونے پر کسٹمر سے پورا بل براہ راست نقد (CASH) میں لیں۔",
    commissionRule2: "2. ایپ میں فائنل بل درج کریں، سسٹم خود بخود 10 فیصد پلیٹ فارم کمیشن کا حساب لگائے گا۔",
    commissionRule3: "3. 90 فیصد کمائی فوری طور پر آپ کے پاس رہے گی۔",
    exampleBoxTitle: "کمیشن کا واضح حساب کتاب:",
    exampleBill: "مرمت کا بل: 3,000 روپے",
    exampleCommission: "کامزو کمیشن (10%): 300 روپے",
    exampleTakehome: "کاریگر کے پاس بچا: 2,700 روپے",
    calculatorTitle: "لائیو 10% کمیشن کیلکولیٹر",
    enterBillLabel: "کام کا کل بل درج کریں (روپے):",
    youCollectLabel: "کسٹمر سے وصول کی گئی رقم (کیش):",
    kamzoFeeLabel: "کامزو کمیشن (10%):",
    yourShareLabel: "آپ کا خالص منافع (90%):",
    commissionDueTitle: "آپ کا کمیشن اسٹیٹس:",
    commissionDueLabel: "واجب الادا کمیشن:",
    commissionPaidLabel: "ادا شدہ کمیشن:",
    completedJobsLabel: "مکمل شدہ جابز:",
    overdueNoticeTitle: "7 روزہ ڈیڈ لائن پالیسی:",
    overdueNoticeDesc: "اگر واجب الادا کمیشن 7 دن کے اندر جمع نہ کرایا جائے تو نئے کسٹمر آرڈرز عارضی طور پر روک دیے جاتے ہیں۔ ادائیگی کی تصدیق کے بعد فوری طور پر آرڈرز بحال ہو جاتے ہیں۔",
    payCommissionTitle: "کمیشن جاز کیش یا ایزی پیسہ سے ادا کریں:",
    tidInputLabel: "ٹرانزیکشن ریفرنس (TID):",
    tidPlaceholder: "مثال: TID 0938472918",
    uploadDepositProof: "رسید کا اسکرین شاٹ اپ لوڈ کریں",
    submitDepositBtn: "کمیشن رسید جمع کروائیں",
    depositSubmittedSuccess: "کمیشن رسید جمع ہو گئی! ایڈمن تصدیق کے بعد آپ کا کھاتہ کلیئر کر دے گا۔",

    // Customer Auth & Account (Daraz-style)
    customerLoginBtn: "لاگ ان / سائن اپ",
    myBookingsBtn: "میری بکنگز",
    customerLogout: "لاگ آؤٹ",
    welcomeCustomer: "خوش آمدید",
    authModalTitle: "لاگ ان یا نیا اکاؤنٹ بنائیں",
    authModalSub: "دراز کی طرح: اپنی سروس بکنگ کنفرم کرنے اور کاریگر ٹریک کرنے کے لیے لاگ ان کریں۔",
    tabSignIn: "1. لاگ ان",
    tabRegister: "2. نیا اکاؤنٹ",
    tabQuickLogin: "3. فوری موبائل تصدیق",
    phoneInputLabel: "پاکستانی موبائل نمبر (03XX XXXXXXX):",
    passwordInputLabel: "پاس ورڈ:",
    passwordPlaceholder: "اپنا پاس ورڈ درج کریں",
    nameInputLabel: "پورا نام:",
    namePlaceholder: "مثال: علی خان",
    cityInputLabel: "آپ کا شہر:",
    loginSubmitBtn: "لاگ ان کریں اور آگے بڑھیں",
    registerSubmitBtn: "اکاؤنٹ بنائیں اور جاری رکھیں",
    quickLoginSubmitBtn: "موبائل تصدیق کریں اور داخل ہوں",
    alreadyHaveAccount: "پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں",
    needNewAccount: "نیا گاہک ہیں؟ نیا اکاؤنٹ بنائیں",
    guestNotice: "آپ کے تمام آرڈرز، رسیدیں اور وارنٹی آپ کے موبائل نمبر کے ساتھ محفوظ رہیں گی۔",
    myBookingsTitle: "میری سروس بکنگز اور آرڈرز",
    myBookingsSub: "کاریگر کی آمد، وزٹ فیس اور کام کی پیش رفت کی لائیو معلومات۔",
    noBookingsFound: "ابھی تک کوئی بکنگ موجود نہیں ہے۔ آج ہی سروس بک کروائیں!",
    bookNewService: "ابھی سروس بک کریں",
    callSupport: "واٹس ایپ ہیلپ لائن",
    continueWithGoogle: "گوگل کے ساتھ لاگ ان کریں",
    emailInputLabel: "جی میل / ای میل ایڈریس:",
    emailPlaceholder: "example@gmail.com",
    orDividerText: "یا جی میل / موبائل نمبر سے لاگ ان کریں",
    authStepBadge: "آخری مرحلہ: آرڈر کنفرم کرنے کے لیے لاگ ان کریں",
    authStepTitle: "اپنا اکاؤنٹ اور بکنگ کنفرم کریں",
    authStepSub: "لائیو ٹریکنگ، وارنٹی اور اپ ڈیٹس کے لیے اپنا اکاؤنٹ کنیکٹ کریں۔",
    authTabGmail: "جی میل اور پاس ورڈ",
    authTabPhone: "موبائل نمبر",
  },
  sd: {
    bookingStep1Badge: "مرحلو 1: سروس ۽ پتي جا تفصيل",
    bookTitle: "بڪ ڪريو",
    initialInspectionFee: "شروعاتي وزٽ فيس:",
    chooseServiceLabel: "سروس جو قسم چونڊيو:",
    selectCityLabel: "شهر چونڊيو:",
    customCityPlaceholder: "پنهنجي شهر يا ڳوٺ جو نالو لکو",
    fullNameLabel: "توهان جو پورو نالو:",
    fullNamePlaceholder: "مثال: رميش ڪمار / علي خان",
    mobileLabel: "موبائل نمبر:",
    problemLabel: "مسئلي يا ڪم جا تفصيل:",
    problemPlaceholder: "خرابي يا گهربل ڪم جا تفصيل لکو...",
    feeBreakdownTitle: "شروعاتي وزٽ فيس:",
    feeBreakdownSub: "اڳيان مرحلو: ڪاريگر جي اچڻ جي تصديق لاءِ وزٽ فيس جاز ڪيش يا ايزي پئسا ذريعي ادا ڪريو۔",
    nextPaymentBtn: "اڳيان: وزٽ فيس ادائيگي ڏانهن وڃو",
    bookingStep2Badge: "مرحلو 2: وزٽ فيس موڪليو",
    attachProofTitle: "رسيد جو ثبوت لڳايو",
    attachProofSub: "هيٺ ڏنل ڪنهن به اڪائونٽ ۾ رقم موڪليو ۽ اسڪرين شاٽ اپلوڊ ڪريو۔",
    depositDetails: "اڪائونٽ جا تفصيل:",
    transferInstruction: (method: string) => `پنهنجي ${method} ائپ مان رقم موڪليو ۽ هيٺ TID داخل ڪريو۔`,
    tidLabel: "ٽرانزيڪشن آءِ ڊي / TID:",
    tidRequired: "لازمي",
    tidPlaceholder: "مثال: TID 04982189421 يا SMS ريفرنس",
    receiptProofLabel: "رسيد جو فوٽو / ثبوت لڳايو:",
    fastApproval: "فوري منظوري",
    receiptAttached: "رسيد جو ثبوت لڳي ويو",
    changeScreenshot: "فوٽو مٽايو",
    tapUploadReceipt: "رسيد يا اسڪرين شاٽ اپلوڊ ڪرڻ لاءِ هتي ڪلڪ ڪريو",
    uploadFormats: "فوٽو، اسڪرين شاٽ يا ڪيمرا تصوير",
    backBtn: "واپس",
    submitProofBtn: "رسيد جمع ڪريو ۽ بڪنگ پڪي ڪريو",
    bookingRegistered: "بڪنگ رجسٽر ٿي وئي!",
    bookingSuccessMsg: "توهان جي درخواست ۽ رسيد ڪاميابي سان ملي وئي آهي۔",
    underVerification: "⏳ ادائيگي حيثيت: ايڊمن تصديق هيٺ",
    bookingRef: "بڪنگ ريفرنس:",
    serviceLabel: "سروس:",
    cityLabel: "شهر / علائقو:",
    customerLabel: "گراهڪ:",
    methodAndTid: "طريقو ۽ TID:",
    initialFeeTransferred: "ادا ڪيل وزٽ فيس:",
    nextStepsTitle: "اڳيان مرحلا:",
    step1AdminVerify: "1. ايڊمن 5 کان 10 منٽن ۾ توهان جي رسيد جي تصديق ڪندو۔",
    step2Dispatch: "2. تصديق بعد ويجھو ماهر ڪاريگر توهان جي گهر روانو ٿيندو۔",
    step3PayCash: "3. فائنل ڪم جو بل ڪم پورو ٿيڻ بعد ڪاريگر کي ڪيش ادا ڪريو۔",
    doneBtn: "پورو",

    // Worker Modal & 3-Step Registration (Sindhi)
    workerBadge: "ڪاريگر رجسٽريشن ۽ پورٽل",
    workerModalTitle: "ڪامزو ۾ بحيثيت ڪاريگر شامل ٿيو",
    workerModalSub: "پنهنجو هنر رجسٽر ڪريو، پنهنجي علائقي ۾ گراهڪن جا سڌا آرڊر حاصل ڪريو، ۽ روزانو نقد ڪمائو۔",
    tabRegister: "1. ڪاريگر رجسٽريشن",
    tabDashboard: "2. ڪميشن ۽ ڪمائي",
    workerStep1Tag: "مرحلو 1: ذاتي تفصيل",
    workerStep2Tag: "مرحلو 2: پيشيورانه تفصيل",
    workerStep3Tag: "مرحلو 3: سڃاڻپ ۽ اڪائونٽ",
    workerNameLabel: "ڪاريگر جو پورو نالو:",
    workerNamePlaceholder: "مثال: رميش ڪمار / محمد عثمان",
    workerMobileLabel: "موبائل نمبر (+92):",
    workerWhatsAppLabel: "واٽس ايپ نمبر (اختياري):",
    workerWhatsAppPlaceholder: "مثال: 319 1234567",
    workerCityLabel: "توهان جو شهر:",
    workerAreaLabel: "علائقو / پاڙو / ٽائون:",
    workerAreaPlaceholder: "مثال: صدر، مين بازار، گلشن",
    workerAddressLabel: "دڪان يا ورڪشاپ جو پتو (اختياري):",
    workerAddressPlaceholder: "دڪان نمبر يا مارڪيٽ جو پتو",
    nextStep2Btn: "مرحلي 2 ڏانهن وڃو: پيشيورانه تفصيل →",

    // Step 2
    workerTradeLabel: "مکيه سروس جو شعبو:",
    categoryMechanic: "آٽو ميڪينڪ",
    categoryAC: "اي سي سروس ۽ کولنگ",
    categoryPlumber: "پلمبر ۽ فٽنگ",
    categoryElectrician: "اليڪٽريشن ۽ وائرنگ",
    workerExpLabel: "تجربو (ڪيترا سال):",
    exp1Year: "1 سال تجربو",
    exp2Years: "2 سال تجربو",
    exp3Years: "3 کان 5 سال تجربو",
    exp5Years: "5 کان 10 سال (سينئر ڪاريگر)",
    exp10Years: "10 سال کان وڌيڪ (استاد / ماهر)",
    workerSkillsDescLabel: "خاص مهارتون ۽ خدمتون:",
    workerSkillsDescPlaceholder: "مثال: انورٽر پي سي بي، انجڻ ٽيوننگ، پائپ ليڪيج، مين بريڪر وائرنگ...",
    workTypeLabel: "ڪم ڪرڻ جو قسم:",
    workTypeDoorstep: "گراهڪ جي گهر تي (هوم وزٽ)",
    workTypeWorkshop: "پنهنجي ورڪشاپ يا دڪان تي",
    workTypeBoth: "ٻئي (گهر ۽ ورڪشاپ)",
    serviceRadiusLabel: "سروس جي حد:",
    radius5km: "5 ڪلوميٽر اندر",
    radius10km: "10 ڪلوميٽر اندر",
    radius20km: "20 ڪلوميٽر اندر",
    radiusEntireCity: "پورو شهر ۽ ويجھا علائقا",
    profilePhotoLabel: "پروفائل تصوير (پاسپورٽ سائيز فوٽو):",
    uploadProfilePhoto: "پروفائل تصوير اپلوڊ ڪريو",
    photoAttached: "تصوير لڳي وئي",
    nextStep3Btn: "مرحلي 3 ڏانهن وڃو: تصديق ۽ اڪائونٽ →",

    // Step 3
    cnicLabel: "قومي سڃاڻپ ڪارڊ نمبر (13 انگ):",
    cnicDigits: "13 انگ",
    cnicPlaceholder: "44102-1234567-1",
    cnicFrontLabel: "سڃاڻپ ڪارڊ سامهون واري تصوير:",
    uploadCnicFront: "سامهون واري تصوير اپلوڊ ڪريو",
    cnicBackLabel: "سڃاڻپ ڪارڊ پٺيان واري تصوير:",
    uploadCnicBack: "پٺيان واري تصوير اپلوڊ ڪريو",
    cnicFrontAttached: "سامهون واري تصوير لڳي وئي",
    cnicBackAttached: "پٺيان واري تصوير لڳي وئي",
    payoutMethodLabel: "رقم وصولي جو طريقو (جاز ڪيش / ايزي پئسا / بينڪ):",
    accountTitleLabel: "اڪائونٽ هولڊر جو نالو:",
    accountTitlePlaceholder: "مثال: رميش ڪمار",
    accountNumberLabel: "اڪائونٽ يا موبائل والٽ نمبر:",
    accountNumberPlaceholder: "مثال: 0300 1234567 يا IBAN",
    termsAgreementLabel: "مان ڪامزو جي شرطن ۽ 10 سيڪڙو ڪميشن پاليسي سان متفق آهيان۔",
    termsNotice: "توهان گراهڪ کان مرمت جا سڀ پئسا هٿ تي نقد کڻندا۔ 10% ڪميشن 7 ڏينهن اندر منتقل ڪرڻي پوندي۔",
    backStepBtn: "← واپس",
    submitWorkerBtn: "رجسٽريشن مڪمل ڪريو ۽ جمع ڪريو",

    // Step 4: Status
    workerSuccessTitle: "رجسٽريشن جمع ٿي وئي — تصديق هيٺ آهي",
    workerSuccessSub: "توهان جي ڪاريگر رجسٽريشن درخواست ڪاميابي سان ملي وئي آهي۔",
    statusPendingBadge: "حيثيت: ايڊمن سڃاڻپ تصديق هيٺ",
    noBookingsNoticeTitle: "اهم هدايت:",
    noBookingsNoticeDesc: "ايڊمن جي منظوري کان اڳ توهان کي گراهڪن جا آرڊر نه ملندا۔ اسان جي ٽيم 24 ڪلاڪن اندر چڪاس ڪندي۔",
    viewDashboardBtn: "ڪاريگر ڪميشن ڊيش بورڊ ڏسو",

    // Commission Dashboard
    commissionDashboardTitle: "ڪاريگر ڪميشن ۽ ڪمائي لکپڙهه",
    commissionPolicyTitle: "ڪامزو 10% ڪميشن سسٽم ڪيئن ڪم ڪري ٿو؟",
    commissionRule1: "1. ڪم مڪمل ٿيڻ بعد گراهڪ کان سڄو بل هٿ تي نقد (CASH) ۾ وٺو۔",
    commissionRule2: "2. ائپ ۾ فائنل بل لکو، سسٽم 10 سيڪڙو ڪميشن ڳڻيندو۔",
    commissionRule3: "3. 90 سيڪڙو ڪمائي فوري طور تي توهان جي کيسي ۾ رهندي۔",
    exampleBoxTitle: "ڪميشن جو سولو حساب ڪتاب:",
    exampleBill: "مرمت جو بل: 3,000 رپيا",
    exampleCommission: "ڪامزو ڪميشن (10%): 300 رپيا",
    exampleTakehome: "ڪاريگر وٽ بچيو: 2,700 رپيا",
    calculatorTitle: "لائيو 10% ڪميشن ڪيلڪيوليٽر",
    enterBillLabel: "ڪم جو ڪل بل لکو (رپيا):",
    youCollectLabel: "گراهڪ کان نقد وصولي:",
    kamzoFeeLabel: "ڪامزو ڪميشن (10%):",
    yourShareLabel: "توهان جو صاف منافعو (90%):",
    commissionDueTitle: "توهان جي ڪميشن حيثيت:",
    commissionDueLabel: "واجب الادا ڪميشن:",
    commissionPaidLabel: "ادا ڪيل ڪميشن:",
    completedJobsLabel: "مڪمل ٿيل جابز:",
    overdueNoticeTitle: "7 ڏينهن واري مهلت پاليسي:",
    overdueNoticeDesc: "جيڪڏهن ڪميشن 7 ڏينهن اندر جمع نه ٿي ته نوان آرڊر عارضي طور روڪيا ويندا۔ ادائيگي چڪاس بعد فوري طور بحال ٿيندا۔",
    payCommissionTitle: "ڪميشن جاز ڪيش يا ايزي پئسا مان جمع ڪريو:",
    tidInputLabel: "ٽرانزيڪشن ريفرنس (TID):",
    tidPlaceholder: "مثال: TID 0938472918",
    uploadDepositProof: "رسيد جو اسڪرين شاٽ اپلوڊ ڪريو",
    submitDepositBtn: "ڪميشن رسيد موڪليو",
    depositSubmittedSuccess: "ڪميشن رسيد موڪلي وئي! ايڊمن چڪاس بعد توهان جو کاتو صاف ڪندو۔",

    // Customer Auth & Account (Daraz-style)
    customerLoginBtn: "لاگ ان / سائن اپ",
    myBookingsBtn: "منهنجي بڪنگس",
    customerLogout: "لاگ آئوٽ",
    welcomeCustomer: "ڀلي ڪري آيا",
    authModalTitle: "لاگ ان يا نئون کاتو ٺاهيو",
    authModalSub: "دراز وانگر: پنهنجي سروس بڪنگ پڪي ڪرڻ ۽ ڪاريگر کي ٽريڪ ڪرڻ لاءِ لاگ ان ڪريو۔",
    tabSignIn: "1. لاگ ان",
    tabRegister: "2. نئون کاتو",
    tabQuickLogin: "3. فوري موبائل لاگ ان",
    phoneInputLabel: "پاڪستاني موبائل نمبر (03XX XXXXXXX):",
    passwordInputLabel: "پاس ورڊ:",
    passwordPlaceholder: "پنهنجو پاس ورڊ داخل ڪريو",
    nameInputLabel: "پورو نالو:",
    namePlaceholder: "مثال: رميش ڪمار / علي خان",
    cityInputLabel: "توهان جو شهر:",
    loginSubmitBtn: "لاگ ان ڪريو ۽ اڳتي وڌو",
    registerSubmitBtn: "کاتو ٺاهيو ۽ اڳتي وڌو",
    quickLoginSubmitBtn: "موبائل تصديق ڪريو ۽ داخل ٿيو",
    alreadyHaveAccount: "پهرين کاتو آهي؟ لاگ ان ڪريو",
    needNewAccount: "نئون گراهڪ آهيو؟ نئون کاتو ٺاهيو",
    guestNotice: "توهان جون سڀ بڪنگس، رسيدون ۽ وارنٽي توهان جي موبائل نمبر سان محفوظ رهنديون۔",
    myBookingsTitle: "منهنجون سروس بڪنگس ۽ آرڊر",
    myBookingsSub: "ڪاريگر جي اچڻ، وزٽ فيس ۽ فائنل بل جي لائيو معلومات۔",
    noBookingsFound: "اڃا تائين ڪا به بڪنگ موجود ناهي۔ اڄ ئي سروس بڪ ڪريو!",
    bookNewService: "هاڻي ئي سروس بڪ ڪريو",
    callSupport: "واٽس ائپ سپورٽ",
    continueWithGoogle: "گوگل سان لاگ ان ڪريو",
    emailInputLabel: "جي ميل / اي ميل ايڊريس:",
    emailPlaceholder: "example@gmail.com",
    orDividerText: "يا جي ميل / موبائل نمبر سان لاگ ان ڪريو",
    authStepBadge: "آخري مرحلو: بڪنگ پڪي ڪرڻ لاءِ لاگ ان ڪريو",
    authStepTitle: "پنهنجو کاتو ۽ بڪنگ پڪي ڪريو",
    authStepSub: "لائيو ٽريڪنگ ۽ ڪاريگر وارنٽي لاءِ پنهنجو کاتو لاگ ان ڪريو۔",
    authTabGmail: "جي ميل ۽ پاس ورڊ",
    authTabPhone: "موبائل نمبر",
  },
};

// Set to false when app is officially launched on Play Store / Hostinger
const SHOW_BROWSER_APP_INSTALL = true;

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
}

export default function STCStyleMarketplacePage() {
  const [lang, setLang] = useState<"en" | "ur" | "sd">("en");
  const [selectedService, setSelectedService] = useState<ServiceData>(services[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "auth" | "confirmed">("details");
  const [authMethod, setAuthMethod] = useState<"gmail" | "phone">("gmail");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Customer Authentication & Orders State (Daraz/Uber style)
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "register" | "quick">("signin");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authCity, setAuthCity] = useState("Umerkot");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [pendingServiceAfterAuth, setPendingServiceAfterAuth] = useState<ServiceData | null>(null);

  // My Bookings & Order History State
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [customerBookingsList, setCustomerBookingsList] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState("Umerkot");
  const [customCityName, setCustomCityName] = useState("");
  const [problemDetail, setProblemDetail] = useState("");
  const [confirmedBookingId, setConfirmedBookingId] = useState("");

  // Payment Proof State (Customer Rs. 200 visit fee transfer)
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa" | "bank_transfer">("jazzcash");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState("");

  // Dynamic Visit Fee & Submission State (Synchronized with Admin Settings)
  const [platformVisitFee, setPlatformVisitFee] = useState<number>(0);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [isSubmittingWorker, setIsSubmittingWorker] = useState(false);

  // Worker Join Onboarding & Commission State
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerModalTab, setWorkerModalTab] = useState<"register" | "dashboard">("register");
  const [workerStepNumber, setWorkerStepNumber] = useState<1 | 2 | 3 | 4>(1); // 1: Personal, 2: Professional, 3: Verification, 4: Status

  // Step 1: Personal Details
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");
  const [workerWhatsApp, setWorkerWhatsApp] = useState("");
  const [workerCity, setWorkerCity] = useState("Umerkot");
  const [workerArea, setWorkerArea] = useState("");
  const [workerAddress, setWorkerAddress] = useState("");

  // Step 2: Professional Details
  const [workerCategories, setWorkerCategories] = useState<string[]>(["Auto Mechanic"]);
  const [workerExperience, setWorkerExperience] = useState("3");
  const [workerSkillsDesc, setWorkerSkillsDesc] = useState("");
  const [workerWorkType, setWorkerWorkType] = useState<"doorstep" | "workshop" | "both">("both");
  const [workerServiceRadius, setWorkerServiceRadius] = useState("10 km");
  const [workerProfilePhotoName, setWorkerProfilePhotoName] = useState("");
  const [workerProfilePhotoPreview, setWorkerProfilePhotoPreview] = useState<string | null>(null);

  // Step 3: Verification & Payout Details
  const [workerCnic, setWorkerCnic] = useState("");
  const [workerCnicFrontName, setWorkerCnicFrontName] = useState("");
  const [workerCnicBackName, setWorkerCnicBackName] = useState("");
  const [workerPayoutMethod, setWorkerPayoutMethod] = useState<"jazzcash" | "easypaisa" | "bank_transfer">("jazzcash");
  const [workerAccountTitle, setWorkerAccountTitle] = useState("");
  const [workerAccountNumber, setWorkerAccountNumber] = useState("");
  const [workerAgreedToTerms, setWorkerAgreedToTerms] = useState(false);

  // Commission Dashboard State
  const [calcBillAmount, setCalcBillAmount] = useState("3000");
  const [commissionDepositTid, setCommissionDepositTid] = useState("");
  const [commissionDepositReceipt, setCommissionDepositReceipt] = useState("");
  const [commissionDepositSubmitted, setCommissionDepositSubmitted] = useState(false);

  // Secret Admin Access via 5 Rapid Logo Taps
  const [logoTaps, setLogoTaps] = useState(0);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Synchronize city on language change
  useEffect(() => {
    setSelectedCity(pakistaniCities[lang][0]);
    setWorkerCity(pakistaniCities[lang][0]);
  }, [lang]);

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

  // Synchronize dynamic visit fee set by admin
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kamzo_visit_fee");
      if (saved !== null) setPlatformVisitFee(Number(saved));
    } catch (_) {}

    async function loadPlatformSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings && data.settings.visit_fee !== undefined) {
            const fee = Number(data.settings.visit_fee);
            setPlatformVisitFee(fee);
            try { localStorage.setItem("kamzo_visit_fee", fee.toString()); } catch (_) {}
          }
        }
      } catch (_) {}
    }
    loadPlatformSettings();
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
      alert(
        lang === "ur"
          ? "کامزو ایپ انسٹال کرنے کے لیے براؤزر مینو (3 نقطے ⋮) پر ٹیپ کریں اور 'Install app' یا 'Add to Home screen' منتخب کریں۔"
          : lang === "sd"
          ? "ڪامزو ائپ انسٽال ڪرڻ لاءِ برائوزر مينيو (3 ٽٻڪا ⋮) تي ڪلڪ ڪريو ۽ 'Install app' چونڊيو۔"
          : "To install KAMZO App, open browser menu (3 dots ⋮) and select 'Install app' or 'Add to Home screen'."
      );
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

  // Load saved customer session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("kamzo_customer_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.phone) {
          setCustomerUser(parsed);
          setCustomerName(parsed.name || "");
          setCustomerPhone(parsed.phone || "");
          if (parsed.city) setSelectedCity(parsed.city);
        }
      }
    } catch (_) {}
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const payload: any = {
        action: authTab === "register" ? "register" : authTab === "quick" ? "quick_phone_login" : "login",
        phone: authPhone.trim(),
        password: authPassword,
      };
      if (authTab === "register") {
        payload.name = authName.trim();
        payload.email = authEmail.trim();
        payload.city = authCity;
      }
      if (authTab === "quick") {
        payload.name = authName.trim() || undefined;
        payload.city = authCity;
      }

      const res = await fetch("/api/auth/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success || !data.customer) {
        setAuthError(data.error || "Authentication failed. Please check your credentials.");
        setIsAuthLoading(false);
        return;
      }

      const customer: CustomerUser = data.customer;
      setCustomerUser(customer);
      try {
        localStorage.setItem("kamzo_customer_user", JSON.stringify(customer));
      } catch (_) {}

      // Pre-fill booking fields
      setCustomerName(customer.name);
      setCustomerPhone(customer.phone);
      if (customer.city) setSelectedCity(customer.city);

      setIsAuthModalOpen(false);
      setAuthError(null);

      // If they were trying to book a service, immediately launch the booking modal!
      if (pendingServiceAfterAuth) {
        setSelectedService(pendingServiceAfterAuth);
        setBookingStep("details");
        setIsBookingModalOpen(true);
        setPendingServiceAfterAuth(null);
      }
    } catch (err: any) {
      setAuthError(err.message || "Network error. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleCustomerLogout = () => {
    setCustomerUser(null);
    try {
      localStorage.removeItem("kamzo_customer_user");
      document.cookie = "kamzo_customer_phone=; path=/; max-age=0";
    } catch (_) {}
    setIsUserMenuOpen(false);
  };

  const handleFetchMyBookings = async () => {
    if (!customerUser?.phone) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsLoadingBookings(true);
    setIsMyBookingsOpen(true);
    setIsUserMenuOpen(false);

    // 1. Immediately hydrate from localStorage for instant, offline-safe display
    let localList: any[] = [];
    try {
      const saved = localStorage.getItem("kamzo_customer_bookings");
      if (saved) {
        localList = JSON.parse(saved);
        if (Array.isArray(localList)) {
          setCustomerBookingsList(localList);
        }
      }
    } catch (_) {}

    setIsLoadingBookings(true);
    try {
      const res = await fetch(`/api/customer/bookings?phone=${encodeURIComponent(customerUser.phone)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        // Merge without losing any locally preserved bookings
        const merged = [...data.bookings];
        localList.forEach((lb) => {
          if (!merged.some((b) => b.booking_number === lb.booking_number)) {
            merged.push(lb);
          }
        });
        setCustomerBookingsList(merged);
        try {
          localStorage.setItem("kamzo_customer_bookings", JSON.stringify(merged));
        } catch (_) {}
      }
    } catch (_) {
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleOpenBooking = (service?: ServiceData) => {
    const s = service || selectedService;
    setSelectedService(s);

    // Pre-fill fields if customer is already logged in
    if (customerUser) {
      setCustomerName(customerUser.name);
      setCustomerPhone(customerUser.phone);
      if (customerUser.city) setSelectedCity(customerUser.city);
    }
    setBookingStep("details");
    setIsBookingModalOpen(true);
  };

  const executeBookingSubmission = async (activeCustomer?: CustomerUser | null) => {
    setIsSubmittingBooking(true);
    const userToUse = activeCustomer || customerUser;
    const finalName = userToUse?.name || customerName.trim() || "Customer";
    const finalPhone = userToUse?.phone || customerPhone.trim();
    const effectiveCity = isOtherCity ? customCityName.trim() : selectedCity;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: finalName,
          customerPhone: finalPhone,
          serviceId: selectedService.id,
          serviceName: getServiceName(selectedService),
          city: effectiveCity,
          problem: problemDetail.trim() || "Service visit diagnostic requested",
          visitFee: platformVisitFee,
          paymentMethod: platformVisitFee === 0 ? "free" : paymentMethod,
          transactionRef: platformVisitFee === 0 ? "FREE-INSPECTION" : transactionRef.trim(),
          proofUrl: receiptPreview || "",
        }),
      });
      const data = await res.json();
      const bkgNumber = data.bookingNumber || "KMZ-" + Math.floor(100000 + Math.random() * 900000);
      setConfirmedBookingId(bkgNumber);
      setBookingStep("confirmed");

      // Persist to customer's localStorage
      const localRecord = {
        id: "bkg_" + Date.now(),
        booking_number: bkgNumber,
        customer_name: finalName,
        customer_phone: finalPhone,
        service_name: getServiceName(selectedService),
        city: effectiveCity,
        problem: problemDetail.trim() || "Service visit diagnostic requested",
        visit_fee: platformVisitFee,
        payment_method: platformVisitFee === 0 ? "free" : paymentMethod,
        transaction_reference: platformVisitFee === 0 ? "FREE-INSPECTION" : transactionRef.trim(),
        status: platformVisitFee === 0 ? "accepted" : "payment_pending",
        created_at: new Date().toISOString(),
      };
      try {
        const prev = JSON.parse(localStorage.getItem("kamzo_customer_bookings") || "[]");
        const filtered = prev.filter((b: any) => b.booking_number !== bkgNumber);
        filtered.unshift(localRecord);
        localStorage.setItem("kamzo_customer_bookings", JSON.stringify(filtered));
      } catch (_) {}
    } catch (err) {
      const randomId = "KMZ-" + Math.floor(100000 + Math.random() * 900000);
      setConfirmedBookingId(randomId);
      setBookingStep("confirmed");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleGoogleConnect = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const gEmail = authEmail.trim() || (customerPhone ? `${customerPhone.replace(/\D/g, "")}@gmail.com` : `customer_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`);
      const gName = customerName.trim() || authName.trim() || "Google Customer";
      const gPhone = customerPhone.trim() || authPhone.trim() || "03197318425";

      const res = await fetch("/api/auth/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "google_login",
          email: gEmail,
          name: gName,
          phone: gPhone,
          city: isOtherCity ? customCityName.trim() : selectedCity,
        }),
      });

      const data = await res.json();
      if (data.success && data.customer) {
        setCustomerUser(data.customer);
        try {
          localStorage.setItem("kamzo_customer_user", JSON.stringify(data.customer));
        } catch (_) {}

        setIsAuthModalOpen(false);

        // If in booking modal at auth step, immediately execute submission!
        if (isBookingModalOpen && bookingStep === "auth") {
          await executeBookingSubmission(data.customer);
        }
      } else {
        setAuthError(data.error || "Google authentication failed.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Google connection failed. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(lang === "ur" ? "براہ کرم اپنا نام اور موبائل نمبر درج کریں۔" : lang === "sd" ? "مهرباني ڪري پنهنجو نالو ۽ فون نمبر داخل ڪريو۔" : "Please enter your name and phone number.");
      return;
    }

    if (platformVisitFee === 0) {
      // Free Visit Fee -> If user already authenticated, submit directly. Otherwise, show auth step before confirmation!
      if (customerUser) {
        await executeBookingSubmission(customerUser);
      } else {
        setBookingStep("auth");
      }
    } else {
      // Visit fee > 0 -> Move to Step 2 (payment)
      setBookingStep("payment");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      alert(lang === "ur" ? "براہ کرم ٹرانزیکشن ریفرنس TID درج کریں۔" : lang === "sd" ? "مهرباني ڪري TID داخل ڪريو۔" : "Please enter your payment Transaction ID (TID).");
      return;
    }

    // If user already authenticated, submit directly. Otherwise, show auth step before confirmation!
    if (customerUser) {
      await executeBookingSubmission(customerUser);
    } else {
      setBookingStep("auth");
    }
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

  const handleToggleWorkerCategory = (cat: string) => {
    if (workerCategories.includes(cat)) {
      if (workerCategories.length > 1) {
        setWorkerCategories(workerCategories.filter((c) => c !== cat));
      }
    } else {
      setWorkerCategories([...workerCategories, cat]);
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWorkerProfilePhotoName(file.name);
      const reader = new FileReader();
      reader.onload = () => setWorkerProfilePhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCnicFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setWorkerCnicFrontName(file.name);
  };

  const handleCnicBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setWorkerCnicBackName(file.name);
  };

  const handleWorkerStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !workerPhone.trim() || !workerArea.trim()) {
      alert(lang === "ur" ? "براہ کرم تمام لازمی خانے پر کریں۔" : lang === "sd" ? "مهرباني ڪري سڀ ضروري خانا ڀريو۔" : "Please fill in all required fields.");
      return;
    }
    setWorkerStepNumber(2);
  };

  const handleWorkerStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (workerCategories.length === 0) {
      alert(lang === "ur" ? "کم از کم ایک سروس کی قسم منتخب کریں۔" : lang === "sd" ? "گهٽ ۾ گهٽ هڪ سروس چونڊيو۔" : "Please select at least one service category.");
      return;
    }
    setWorkerStepNumber(3);
  };

  const handleWorkerFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerAgreedToTerms) {
      alert(lang === "ur" ? "براہ کرم کامزو کی 10% کمیشن پالیسی اور شرائط سے اتفاق کریں۔" : lang === "sd" ? "مهرباني ڪري 10 سيڪڙو ڪميشن پاليسي سان متفق ٿيو۔" : "Please agree to the 10% commission policy and terms.");
      return;
    }
    setIsSubmittingWorker(true);
    try {
      await fetch("/api/workers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workerName.trim(),
          phone: workerPhone.trim(),
          whatsapp: workerWhatsApp.trim(),
          city: workerCity,
          area: workerArea.trim(),
          workAddress: workerAddress.trim(),
          categories: workerCategories,
          experience: Number(workerExperience) || 0,
          skills: workerSkillsDesc.trim(),
          workType: workerWorkType,
          cnic: workerCnic.trim(),
          payoutMethod: workerPayoutMethod,
          payoutAccount: workerAccountNumber.trim(),
        }),
      });
    } catch (_) {}
    finally {
      setIsSubmittingWorker(false);
      setWorkerStepNumber(4); // Shows "Registration Submitted — Pending Verification"
    }
  };

  const handleCommissionDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionDepositTid.trim()) {
      alert(lang === "ur" ? "براہ کرم ٹرانزیکشن ریفرنس TID درج کریں۔" : lang === "sd" ? "مهرباني ڪري TID داخل ڪريو۔" : "Please enter the transaction reference TID.");
      return;
    }
    setCommissionDepositSubmitted(true);
    setTimeout(() => {
      setCommissionDepositSubmitted(false);
      setCommissionDepositTid("");
      setCommissionDepositReceipt("");
    }, 4000);
  };

  const isOtherCity =
    selectedCity.startsWith("Other") ||
    selectedCity.startsWith("دیگر") ||
    selectedCity.startsWith("ٻيو");

  const effectiveCity = isOtherCity
    ? customCityName || (lang === "en" ? "Custom Location" : lang === "ur" ? "مخصوص علاقہ" : "خاص علائقو")
    : selectedCity;

  const t = siteContent[lang];
  const m = modalContent[lang];

  const getServiceName = (srv: ServiceData) => {
    if (lang === "ur") return srv.urduName;
    if (lang === "sd") return srv.sindhiName;
    return srv.name;
  };

  const getServiceCategory = (srv: ServiceData) => {
    if (lang === "ur") return srv.categoryUrdu;
    if (lang === "sd") return srv.categorySindhi;
    return srv.category;
  };

  const getServiceDescription = (srv: ServiceData) => {
    if (lang === "ur") return srv.descriptionUrdu;
    if (lang === "sd") return srv.descriptionSindhi;
    return srv.description;
  };

  const getServiceFee = (srv: ServiceData) => {
    if (platformVisitFee === 0) {
      if (lang === "ur") return "مفت معائنہ (Rs. 0)";
      if (lang === "sd") return "مفت معائنو (Rs. 0)";
      return "Free Diagnostic (Rs. 0)";
    }
    return `Rs. ${platformVisitFee}`;
  };

  const getServiceItems = (srv: ServiceData) => {
    if (lang === "ur") return srv.popularItemsUrdu;
    if (lang === "sd") return srv.popularItemsSindhi;
    return srv.popularItems;
  };

  return (
    <div
      dir="ltr"
      className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden ${
        isDarkMode ? "bg-[#0B132B] text-slate-100" : "bg-white text-[#0A1128]"
      } font-sans transition-colors duration-200 selection:bg-[#16A34A] selection:text-white relative pb-24 md:pb-0`}
    >
      {/* Subtle MedicoEngineer Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* ─── OFFICIAL NAVBAR WITH TRILINGUAL SELECTOR ─── */}
      <header
        className={`sticky top-0 z-40 ${
          isDarkMode ? "bg-[#0B132B]/95 border-slate-800" : "bg-white/95 border-slate-100"
        } backdrop-blur-md border-b transition-colors w-full overflow-hidden`}
        dir="ltr"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4" dir="ltr">
          {/* Logo Brand: Official KAMZO App Icon & Typography */}
          <Link
            href="/"
            onClick={handleLogoSecretTap}
            className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 select-none cursor-pointer"
            dir="ltr"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-md shadow-emerald-500/25 transition-all group-hover:scale-105 shrink-0">
              <img src="/logo.png" alt="KAMZO Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col shrink-0 text-left" dir="ltr">
              <div className="flex items-baseline gap-0.5" dir="ltr">
                <span className={`text-xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0B132B]"}`}>
                  KAM
                </span>
                <span className="text-xl sm:text-3xl font-black tracking-tight text-[#16A34A]">
                  ZO
                </span>
              </div>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400 dark:text-slate-400 -mt-0.5" dir="ltr">
                SERVICES MARKETPLACE
              </p>
            </div>
          </Link>

          {/* Centered Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#services" className="hover:text-[#16A34A] transition-colors py-1">
              {t.navServices}
            </a>
            <a href="#how-it-works" className="hover:text-[#16A34A] transition-colors py-1">
              {t.navHowItWorks}
            </a>
            <a href="#benefits" className="hover:text-[#16A34A] transition-colors py-1">
              {t.navWhyUs}
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Customer Account / Login Button (Daraz-style) */}
            {customerUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[90px] sm:max-w-[120px] truncate">{customerUser.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-left">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{customerUser.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono" dir="ltr">{customerUser.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleFetchMyBookings}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4 text-[#16A34A]" />
                      <span>{t.myBookingsBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCustomerLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.customerLogout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthTab("signin");
                  setAuthError(null);
                  setIsAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-[#16A34A] transition-all cursor-pointer shadow-xs"
                title="Login or Register Account"
              >
                <LogIn className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="hidden xs:inline">{t.customerLoginBtn}</span>
                <span className="xs:hidden">Login</span>
              </button>
            )}

            {/* Join as Worker Button (Header) */}
            <button
              onClick={() => {
                setWorkerModalTab("register");
                setWorkerStepNumber(1);
                setIsWorkerModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-emerald-600 bg-[#16A34A] hover:bg-[#15803D] text-white transition-all cursor-pointer shrink-0 shadow-xs"
              title="Join KAMZO as Service Worker"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t.joinAsWorker}</span>
            </button>

            {/* PWA Install Button (For Desktop / Laptop) */}
            {!isAppInstalled && (
              <button
                onClick={handleInstallApp}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-emerald-500/30 bg-emerald-50/70 hover:bg-emerald-100 text-[#16A34A] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/50 transition-all cursor-pointer shrink-0 shadow-xs"
                title="Install KAMZO Application on your Phone or Laptop"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t.installAppBtn}</span>
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

            {/* Trilingual Language Selector: English, Urdu, Sindhi */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 hidden sm:inline-block" />
              <span className="text-[10px] font-semibold text-slate-500 hidden sm:inline-block mr-0.5">
                {t.selectLanguage}
              </span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-[11px] sm:text-xs ${
                  lang === "en"
                    ? "bg-[#16A34A] text-white shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("ur")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-[11px] sm:text-xs font-bold ${
                  lang === "ur"
                    ? "bg-[#16A34A] text-white shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => setLang("sd")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-[11px] sm:text-xs font-bold ${
                  lang === "sd"
                    ? "bg-[#16A34A] text-white shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                سنڌي
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[#16A34A] text-xs font-extrabold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>{t.taglineBadge}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {t.mainHeadline}
              </h1>
              <p className="text-2xl sm:text-3xl font-black text-[#16A34A] leading-snug">
                {t.subHeadline}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Clean Action Box: ONLY 2 Buttons (Customer Booking & Worker Join) */}
            <div
              className={`${
                isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/80"
              } rounded-2xl p-4 sm:p-5 shadow-xl shadow-emerald-950/5 border max-w-xl mx-auto`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Button 1: Customer Booking */}
                <button
                  onClick={() => handleOpenBooking(selectedService)}
                  className="w-full py-4 px-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-between gap-3 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold truncate text-sm">
                        {t.bookAsCustomer}
                      </div>
                      <div className="text-[10px] text-emerald-100 truncate font-normal">
                        {t.bookAsCustomerSub}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-white" />
                </button>

                {/* Button 2: Worker Join / Registration */}
                <button
                  onClick={() => {
                    setWorkerModalTab("register");
                    setWorkerStepNumber(1);
                    setIsWorkerModalOpen(true);
                  }}
                  className={`w-full py-4 px-4 font-bold text-xs sm:text-sm rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer text-left ${
                    isDarkMode
                      ? "bg-emerald-950/70 text-emerald-300 border-emerald-600/70 hover:bg-emerald-900/60"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600/15 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold truncate text-sm">
                        {t.joinAsWorker}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-300 truncate font-normal">
                        {t.joinAsWorkerSub}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="pt-2 flex items-center justify-center gap-6 text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>4.9/5.0</span>
                <span className="text-xs text-slate-400">{t.reviewsCount}</span>
              </div>
              <div className="h-4 w-px bg-slate-300" />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Users className="w-4 h-4 text-[#16A34A]" />
                <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                  {t.activeTechnicians}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETAILED 4 SERVICES CARDS (With Real Worker Images) ─── */}
      <section className="py-20" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#16A34A]">
              {t.coreServicesTag}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              {t.coreServicesTitle}
            </h2>
            <p className="text-sm text-slate-500">
              {t.coreServicesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => {
              const displayName = getServiceName(srv);
              const displayCategory = getServiceCategory(srv);
              const displayFee = getServiceFee(srv);

              return (
                <div
                  key={srv.id}
                  className={`${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 hover:border-[#16A34A]/60 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
                      : "bg-white border-slate-200/80 hover:border-[#16A34A]/50 shadow-[0_18px_42px_-10px_rgba(0,0,0,0.14),0_6px_22px_-4px_rgba(22,163,74,0.14)]"
                  } rounded-3xl p-6 border ring-1 ring-slate-900/[0.04] dark:ring-white/[0.06] hover:shadow-[0_26px_55px_-10px_rgba(0,0,0,0.22),0_12px_30px_-4px_rgba(22,163,74,0.28)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div className="space-y-4">
                    {/* Real Worker Image Header */}
                    <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-100 shadow-md group-hover:shadow-lg transition-all border border-slate-200/60">
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Fee Badge Overlay - Unlock Booking */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-50/95 text-[#16A34A] dark:bg-emerald-950/90 dark:text-emerald-300 shadow-sm backdrop-blur-sm flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#16A34A]" />
                          <span>{t.unlockBookingBadge}</span>
                        </span>
                      </div>
                      {/* Certified Badge Overlay */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#16A34A] text-white shadow-sm flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          <span>{t.certifiedTechBadge}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          isDarkMode ? "text-white" : "text-[#0A1128]"
                        } group-hover:text-[#16A34A] transition-colors`}
                      >
                        {displayName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-1">{displayCategory}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenBooking(srv)}
                      className="w-full py-3.5 px-4 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-[#16A34A] text-[#16A34A] hover:text-white font-bold text-xs sm:text-sm rounded-2xl border border-emerald-300/90 dark:border-emerald-800 hover:border-[#16A34A] shadow-[0_4px_14px_rgba(22,163,74,0.16)] hover:shadow-[0_8px_24px_rgba(22,163,74,0.35)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>
                        {t.bookNowPrefix}{displayName}{t.bookNowSuffix}
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

      {/* ─── BENEFITS SECTION ─── */}
      <section
        className={`py-20 border-t ${
          isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50/60 border-slate-100"
        }`}
        id="benefits"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#16A34A]">
              {t.whyChooseTag}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              {t.whyChooseTitle}
            </h2>
            <p className="text-sm text-slate-500">
              {t.whyChooseSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`${
                isDarkMode ? "bg-slate-800 border-slate-700 shadow-slate-950/50" : "bg-white border-slate-200/80 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08),0_4px_12px_rgba(22,163,74,0.05)]"
              } p-8 rounded-3xl border hover:shadow-[0_20px_45px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 text-center space-y-4`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {t.benefit1Title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.benefit1Desc}
              </p>
            </div>

            <div
              className={`${
                isDarkMode ? "bg-slate-800 border-slate-700 shadow-slate-950/50" : "bg-white border-slate-200/80 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08),0_4px_12px_rgba(22,163,74,0.05)]"
              } p-8 rounded-3xl border hover:shadow-[0_20px_45px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 text-center space-y-4`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {t.benefit2Title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.benefit2Desc}
              </p>
            </div>

            <div
              className={`${
                isDarkMode ? "bg-slate-800 border-slate-700 shadow-slate-950/50" : "bg-white border-slate-200/80 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08),0_4px_12px_rgba(22,163,74,0.05)]"
              } p-8 rounded-3xl border hover:shadow-[0_20px_45px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 text-center space-y-4`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {t.benefit3Title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.benefit3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section className="py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#16A34A]">
              {t.howItWorksTag}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
              {t.howItWorksTitle}
            </h2>
            <p className="text-sm text-slate-500">
              {t.howItWorksSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
              } p-8 rounded-3xl border text-center space-y-4`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#16A34A] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                01
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {t.step1Title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div
              className={`${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
              } p-8 rounded-3xl border text-center space-y-4`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#16A34A] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                02
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {t.step2Title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div
              className={`${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
              } p-8 rounded-3xl border text-center space-y-4`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#16A34A] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                03
              </div>
              <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                {t.step3Title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className={`${
          isDarkMode ? "bg-[#070D1E] border-slate-800" : "bg-[#0A1128] border-slate-900"
        } text-slate-400 py-12 border-t`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3.5 cursor-pointer select-none" onClick={handleLogoSecretTap} dir="ltr">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-emerald-500/25 shrink-0">
                <img src="/logo.png" alt="KAMZO Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left" dir="ltr">
                <div className="flex items-baseline gap-0.5" dir="ltr">
                  <span className="text-xl font-black text-white tracking-tight">KAM</span>
                  <span className="text-xl font-black text-[#16A34A] tracking-tight">ZO</span>
                </div>
                <p className="text-[9px] uppercase tracking-[0.24em] font-extrabold text-slate-400" dir="ltr">
                  SERVICES MARKETPLACE
                </p>
                <p className="text-[10px] text-[#16A34A] font-bold">{t.footerTagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold">
              <a href="#services" className="hover:text-white transition-colors">{t.navServices}</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">{t.navHowItWorks}</a>
              <a href="#benefits" className="hover:text-white transition-colors">{t.navWhyUs}</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>{t.footerCopyright}</p>
            <p className="text-[#16A34A] font-semibold">{t.footerLocations}</p>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING ACTION WIDGETS ─── */}
      <a
        href="https://wa.me/923197318425?text=%23KAMZO%20Support%20Inquiry%20-%20Assalam-o-Alaikum"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support"
        className="hidden md:flex fixed bottom-6 right-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white items-center justify-center shadow-xl shadow-green-900/30 transition-all hover:scale-110 cursor-pointer group"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-[#25D366]" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>{t.whatsappTooltip}</span>
        </span>
      </a>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center justify-center shadow-xl shadow-emerald-500/35 border-2 border-white/20 transition-all hover:scale-110 cursor-pointer animate-in fade-in group"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-y-0.5 transition-transform" />
          <span className="absolute right-14 sm:right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 hidden sm:inline-block">
            {t.scrollTopTooltip}
          </span>
        </button>
      )}

      {/* ─── APP MOBILE BOTTOM NAVIGATION BAR (Phones Only) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl px-3 py-1.5 flex items-center justify-between safe-bottom">
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#16A34A] flex-1 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </button>

        <a
          href="#services"
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#16A34A] flex-1 transition-colors"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">{t.navServices}</span>
        </a>

        {/* Center Join Worker Action (Prominent App Button) */}
        <button
          onClick={() => {
            setWorkerModalTab("register");
            setWorkerStepNumber(1);
            setIsWorkerModalOpen(true);
          }}
          className="flex flex-col items-center justify-center -mt-5 py-0.5 px-2 flex-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 group-active:scale-95 transition-transform border-3 border-white dark:border-[#0B132B]">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-[#16A34A] mt-0.5 whitespace-nowrap">{t.bottomNavJoinWorker}</span>
        </button>

        <a
          href="https://wa.me/923197318425?text=%23KAMZO%20Support%20Inquiry%20-%20Assalam-o-Alaikum"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex-1 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
        </a>

        {SHOW_BROWSER_APP_INSTALL ? (
          <button
            onClick={handleInstallApp}
            className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#16A34A] flex-1 transition-colors"
          >
            <Smartphone className="w-5 h-5 text-[#16A34A]" />
            <span className="text-[10px] font-bold text-[#16A34A] mt-0.5">App</span>
          </button>
        ) : (
          <a
            href="https://play.google.com/store/apps/details?id=com.kamzo.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#16A34A] flex-1 transition-colors"
          >
            <Smartphone className="w-5 h-5 text-[#16A34A]" />
            <span className="text-[10px] font-bold text-[#16A34A] mt-0.5">Play Store</span>
          </a>
        )}
      </nav>

      {/* ─── IOS PWA INSTALL GUIDE MODAL ─── */}
      {showIOSInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`${
              isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"
            } rounded-3xl max-w-sm w-full p-6 shadow-2xl border space-y-4`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#16A34A]" />
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
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>Safari browser me neeche <strong>Share button</strong> par tap karein.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>Menu ko scroll karein aur <strong>Add to Home Screen</strong> select karein.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>Top right par <strong>Add</strong> par click karein. KAMZO aapke phone par app ki tarah save ho jayegi!</span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSInstallGuide(false)}
              className="w-full py-2.5 bg-[#16A34A] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              OK (Done)
            </button>
          </div>
        </div>
      )}

      {/* ─── INTERACTIVE ONLINE BOOKING MODAL ─── */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`${
              isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-100"
            } rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border relative space-y-5 max-h-[90vh] overflow-y-auto`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingStep === "details" && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{m.bookingStep1Badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {m.bookTitle} {getServiceName(selectedService)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {m.initialInspectionFee} <strong className="text-[#16A34A]">{getServiceFee(selectedService)}</strong>
                  </p>
                </div>

                {/* Service Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {m.chooseServiceLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {services.map((srv) => (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-2.5 rounded-xl border text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                          selectedService.id === srv.id
                            ? "bg-[#16A34A] text-white border-[#16A34A] shadow-md shadow-emerald-600/20"
                            : isDarkMode
                            ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <img
                          src={srv.image}
                          alt={srv.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/40 shadow-xs shrink-0"
                        />
                        <span className="truncate">{getServiceName(srv)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {m.selectCityLabel}
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    } text-sm font-semibold focus:outline-none focus:border-[#16A34A]`}
                  >
                    {pakistaniCities[lang].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  {/* If user selected "Other" */}
                  {isOtherCity && (
                    <div className="pt-1 animate-in fade-in">
                      <input
                        type="text"
                        required
                        value={customCityName}
                        onChange={(e) => setCustomCityName(e.target.value)}
                        placeholder={m.customCityPlaceholder}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200 bg-emerald-50/40"
                        } text-sm font-semibold focus:outline-none focus:border-[#16A34A] placeholder:text-slate-400`}
                      />
                    </div>
                  )}
                </div>

                {/* Customer Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {m.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={m.fullNamePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                    } text-sm font-medium focus:outline-none focus:border-[#16A34A]`}
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {m.mobileLabel}
                  </label>
                  <div className="flex" dir="ltr">
                    <span
                      className={`inline-flex items-center px-3.5 rounded-l-xl border border-r-0 ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
                      } text-sm font-bold`}
                    >
                      +92
                    </span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="319 7318425"
                      className={`w-full px-4 py-3 rounded-r-xl border ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                      } text-sm font-medium focus:outline-none focus:border-[#16A34A]`}
                    />
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {m.problemLabel}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={problemDetail}
                    onChange={(e) => setProblemDetail(e.target.value)}
                    placeholder={m.problemPlaceholder}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                    } text-sm font-medium focus:outline-none focus:border-[#16A34A] resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-75 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {isSubmittingBooking ? (
                    <span>Submitting Booking...</span>
                  ) : platformVisitFee === 0 ? (
                    <>
                      <span>
                        {lang === "ur"
                          ? "بکنگ تصدیق کریں (مفت معائنہ)"
                          : lang === "sd"
                          ? "بڪنگ جي تصديق ڪريو (مفت معائنو)"
                          : "Confirm Booking (Free Inspection)"}
                      </span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>
                        {lang === "ur"
                          ? `آگے بڑھیں: وزٹ فیس (Rs. ${platformVisitFee}) کی ادائیگی`
                          : lang === "sd"
                          ? `اڳتي وڌو: وزٽ فيس (Rs. ${platformVisitFee}) جي ادائيگي`
                          : `Next: Proceed to Pay Rs. ${platformVisitFee}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT & RECEIPT PROOF ATTACHMENT */}
            {bookingStep === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>
                      {lang === "ur"
                        ? `مرحلہ 2: وزٹ فیس (Rs. ${platformVisitFee}) منتقل کریں`
                        : lang === "sd"
                        ? `مرحلو 2: وزٽ فيس (Rs. ${platformVisitFee}) موڪليو`
                        : `Step 2 of 2: Transfer Rs. ${platformVisitFee} Visit Fee`}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">{m.attachProofTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {lang === "ur"
                      ? `نیچے دیے گئے کسی بھی اکاؤنٹ میں Rs. ${platformVisitFee} وزٹ فیس بھیجیں اور اسکرین شاٹ اپ لوڈ کریں۔`
                      : lang === "sd"
                      ? `هيٺ ڏنل ڪنهن به اڪائونٽ ۾ Rs. ${platformVisitFee} وزٽ فيس موڪليو ۽ اسڪرين شاٽ اپلوڊ ڪريو۔`
                      : `Send Rs. ${platformVisitFee} advance inspection fee to any account below and upload the screenshot.`}
                  </p>
                </div>

                {/* Payment Method Tabs */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("jazzcash")}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all text-center ${
                      paymentMethod === "jazzcash"
                        ? "bg-[#16A34A] text-white border-[#16A34A] shadow-md shadow-emerald-600/20"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    JazzCash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("easypaisa")}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all text-center ${
                      paymentMethod === "easypaisa"
                        ? "bg-[#16A34A] text-white border-[#16A34A] shadow-md shadow-emerald-600/20"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Easypaisa
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all text-center ${
                      paymentMethod === "bank_transfer"
                        ? "bg-[#16A34A] text-white border-[#16A34A] shadow-md shadow-emerald-600/20"
                        : isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Bank
                  </button>
                </div>

                {/* Official Account Box */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-bold">
                    <span>{m.depositDetails}</span>
                    <span className="text-xs bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
                      Rs. {platformVisitFee}
                    </span>
                  </div>

                  {paymentMethod === "jazzcash" && (
                    <div className="space-y-1.5 text-slate-800 dark:text-slate-200 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">JazzCash Mobile:</span>
                        <span className="font-mono font-black text-base text-[#16A34A]" dir="ltr">0319 7318425</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Account Title:</span>
                        <span className="font-bold">KAMZO Services / Parvindar</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "easypaisa" && (
                    <div className="space-y-1.5 text-slate-800 dark:text-slate-200 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Easypaisa Mobile:</span>
                        <span className="font-mono font-black text-base text-[#16A34A]" dir="ltr">0319 7318425</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Account Title:</span>
                        <span className="font-bold">KAMZO Services / Parvindar</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank_transfer" && (
                    <div className="space-y-1.5 text-slate-800 dark:text-slate-200 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Bank Name:</span>
                        <span className="font-bold">Allied Bank / Meezan Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Account / IBAN:</span>
                        <span className="font-mono font-bold text-xs sm:text-sm" dir="ltr">03197318425 / PK36MEZN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Account Title:</span>
                        <span className="font-bold">KAMZO Marketplace</span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-emerald-700 dark:text-emerald-300 pt-1.5 border-t border-emerald-200/60 dark:border-emerald-900/50">
                    {m.transferInstruction(paymentMethod === "jazzcash" ? "JazzCash" : paymentMethod === "easypaisa" ? "Easypaisa" : "Bank")}
                  </p>
                </div>

                {/* Transaction Reference / TID */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>{m.tidLabel}</span>
                    <span className="text-xs text-slate-400 font-normal">{m.tidRequired}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder={m.tidPlaceholder}
                    dir="ltr"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                    } text-sm font-mono focus:outline-none focus:border-[#16A34A]`}
                  />
                </div>

                {/* Screenshot Upload with Preview */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>{m.receiptProofLabel}</span>
                    <span className="text-xs text-emerald-600 font-bold">{m.fastApproval}</span>
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-4 text-center transition-colors ${
                      receiptPreview
                        ? "border-emerald-400 bg-emerald-50/50"
                        : isDarkMode
                        ? "border-slate-700 bg-slate-800/50 hover:border-emerald-500"
                        : "border-slate-200 bg-slate-50/70 hover:border-emerald-400"
                    }`}
                  >
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
                            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                              <FileCheck className="w-4 h-4 text-emerald-600" />
                              <span>{m.receiptAttached}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{receiptFileName || "screenshot.png"}</p>
                            <span className="text-xs text-[#16A34A] underline font-semibold">{m.changeScreenshot}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 space-y-1.5">
                          <Upload className="w-7 h-7 text-[#16A34A] mx-auto" />
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {m.tapUploadReceipt}
                          </div>
                          <p className="text-xs text-slate-400">{m.uploadFormats}</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Modal Navigation Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep("details")}
                    className={`py-3.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                      isDarkMode
                        ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {m.backBtn}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{m.submitProofBtn}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2.5: AUTHENTICATE / SIGN IN TO CONFIRM BOOKING (DARAZ / UBER STYLE) */}
            {bookingStep === "auth" && (
              <div className="space-y-4 text-left animate-in fade-in">
                {/* Header Badge & Title */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{m.authStepBadge || "Final Step: Account Verification"}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {m.authStepTitle || "Sign in to Confirm Booking"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {m.authStepSub || "Connect with Google or sign in with your Gmail/Phone. Your booking will be confirmed immediately."}
                  </p>
                </div>

                {/* Summary Pill: Service + City + Visit Fee */}
                <div
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    isDarkMode
                      ? "bg-slate-800/80 border-slate-700 text-slate-200"
                      : "bg-emerald-50/60 border-emerald-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {selectedService.image ? (
                      <img
                        src={selectedService.image}
                        alt={selectedService.name}
                        className="w-9 h-9 rounded-xl object-cover shrink-0 border border-emerald-500/20"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold">
                        <Wrench className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {getServiceName(selectedService)}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {effectiveCity} • {customerName || "Customer"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">{m.visitFeeLabel}</span>
                    <span className="font-extrabold text-[#16A34A]">
                      {platformVisitFee === 0 ? m.freeVisitTag : `Rs. ${platformVisitFee}`}
                    </span>
                  </div>
                </div>

                {/* 1-Click Google Connect Button */}
                <button
                  type="button"
                  onClick={handleGoogleConnect}
                  disabled={isAuthLoading || isSubmittingBooking}
                  className="w-full py-3.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    {isAuthLoading
                      ? "Connecting..."
                      : m.continueWithGoogle || "Continue with Google"}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {m.orDividerText || "OR SIGN IN WITH GMAIL / PHONE"}
                  </span>
                </div>

                {/* Error Banner */}
                {authError && (
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="font-semibold">{authError}</span>
                  </div>
                )}

                {/* Method Switcher: Gmail & Password vs Mobile Phone */}
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("gmail");
                      setAuthError(null);
                    }}
                    className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      authMethod === "gmail"
                        ? "bg-white dark:bg-slate-900 text-[#16A34A] shadow-xs font-black"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{m.authTabGmail || "Gmail & Password"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("phone");
                      setAuthError(null);
                    }}
                    className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      authMethod === "phone"
                        ? "bg-white dark:bg-slate-900 text-[#16A34A] shadow-xs font-black"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{m.authTabPhone || "Mobile Phone"}</span>
                  </button>
                </div>

                {/* Direct Credentials Form for Checkout */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsAuthLoading(true);
                    setAuthError(null);
                    try {
                      const identifier =
                        authMethod === "gmail"
                          ? authEmail.trim()
                          : (authPhone.trim() || customerPhone.trim());
                      if (!identifier) {
                        setAuthError(
                          authMethod === "gmail"
                            ? "Please enter your Gmail address."
                            : "Please enter your mobile phone number."
                        );
                        setIsAuthLoading(false);
                        return;
                      }

                      // Try login first
                      const res = await fetch("/api/auth/customer", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "login",
                          email: authMethod === "gmail" ? identifier : "",
                          phone: authMethod === "phone" ? identifier : customerPhone.trim(),
                          password: authPassword || "pass123",
                        }),
                      });
                      const data = await res.json();

                      if (data.success && data.customer) {
                        setCustomerUser(data.customer);
                        try {
                          localStorage.setItem(
                            "kamzo_customer_user",
                            JSON.stringify(data.customer)
                          );
                        } catch (_) {}
                        await executeBookingSubmission(data.customer);
                      } else {
                        // If user doesn't exist yet, auto-register seamless customer account!
                        const regRes = await fetch("/api/auth/customer", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            action: "register",
                            name:
                              customerName.trim() ||
                              (authMethod === "gmail"
                                ? identifier.split("@")[0]
                                : "Customer"),
                            email: authMethod === "gmail" ? identifier : "",
                            phone:
                              authMethod === "phone"
                                ? identifier
                                : customerPhone.trim() ||
                                  "03" +
                                    Math.floor(
                                      100000000 + Math.random() * 900000000
                                    ),
                            password: authPassword || "pass123",
                            city: effectiveCity,
                          }),
                        });
                        const regData = await regRes.json();
                        if (regData.success && regData.customer) {
                          setCustomerUser(regData.customer);
                          try {
                            localStorage.setItem(
                              "kamzo_customer_user",
                              JSON.stringify(regData.customer)
                            );
                          } catch (_) {}
                          await executeBookingSubmission(regData.customer);
                        } else {
                          setAuthError(
                            regData.error ||
                              data.error ||
                              "Sign in failed. Please check credentials."
                          );
                        }
                      }
                    } catch (err: any) {
                      setAuthError(err.message || "Failed to sign in. Please try again.");
                    } finally {
                      setIsAuthLoading(false);
                    }
                  }}
                  className="space-y-3"
                >
                  {authMethod === "gmail" ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {m.emailInputLabel || "Gmail / Email Address"} *
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder={m.emailPlaceholder || "yourname@gmail.com"}
                        dir="ltr"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                            : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        } text-xs focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {t.phoneInputLabel} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={authPhone || customerPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="0300 1234567"
                        dir="ltr"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                            : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        } text-xs font-mono focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.passwordInputLabel}
                    </label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder || "Enter or choose a password"}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                          : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                      } text-xs focus:outline-none focus:border-[#16A34A]`}
                    />
                  </div>

                  {/* Navigation Buttons: Back and Submit */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBookingStep(platformVisitFee === 0 ? "details" : "payment")
                      }
                      className={`py-3.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                        isDarkMode
                          ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {m.backBtn}
                    </button>

                    <button
                      type="submit"
                      disabled={isAuthLoading || isSubmittingBooking}
                      className="flex-1 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                    >
                      {isAuthLoading || isSubmittingBooking ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{m.savingBooking}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {m.submitBookingBtn || "Confirm & Submit Booking"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: BOOKING CONFIRMED */}
            {bookingStep === "confirmed" && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">{m.bookingRegistered}</h3>
                  <p className="text-xs text-[#16A34A] font-bold mt-1">{m.bookingSuccessMsg}</p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                    {m.underVerification}
                  </div>
                </div>

                {/* Worker Details Locked Notice until payment verification */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5 text-left">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-xs">
                      {lang === "ur"
                        ? "کاریگر کی تفصیلات محفوظ (Locked) ہیں"
                        : lang === "sd"
                        ? "ڪاريگر جا تفصيل لاڪ (Locked) آهن"
                        : "Worker Contact & Details Locked"}
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {lang === "ur"
                        ? "ایڈمن کی طرف سے رسید کی تصدیق مکمل ہوتے ہی قریبی کاریگر کا نام، موبائل نمبر اور لائیو لوکیشن فوری انلاک ہو جائے گی۔"
                        : lang === "sd"
                        ? "ايڊمن پاران فيس چڪاس مڪمل ٿيندي ئي ڪاريگر جو نالو ۽ نمبر فوري انلاڪ ٿيندا۔"
                        : "Worker profile, phone number, and live tracking will automatically unlock the moment KAMZO Admin confirms your deposit receipt."}
                    </p>
                  </div>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  } rounded-2xl p-4 text-xs space-y-2 border text-left`}
                >
                  <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">{m.bookingRef}</span>
                    <span className="font-mono font-bold text-[#16A34A]" dir="ltr">{confirmedBookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.serviceLabel}</span>
                    <span className="font-bold">{getServiceName(selectedService)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.cityLabel}</span>
                    <span className="font-bold">{effectiveCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.customerLabel}</span>
                    <span className="font-bold">{customerName} (+92 {customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.methodAndTid}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300" dir="ltr">
                      {paymentMethod.toUpperCase()} • {transactionRef || "Proof Attached"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-[#16A34A] font-bold">
                    <span>{m.initialFeeTransferred}</span>
                    <span>{platformVisitFee > 0 ? `Rs. ${platformVisitFee}` : "Free (Rs. 0)"}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed text-left">
                  <p className="font-semibold pb-1">{m.nextStepsTitle}</p>
                  <p>{m.step1AdminVerify}</p>
                  <p>{m.step2Dispatch}</p>
                  <p>{m.step3PayCash}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/923197318425?text=${encodeURIComponent(
                      `#KAMZO Service Booking Inquiry\nAssalam-o-Alaikum Admin!\nBooking ID: ${confirmedBookingId || "KMZ-NEW"}\nCustomer: ${customerName} (${customerPhone})\nService: ${getServiceName(selectedService)}\nCity: ${effectiveCity}\nVisit Fee: ${platformVisitFee > 0 ? "Rs. " + platformVisitFee : "Free (Rs. 0)"}\nPayment: ${paymentMethod.toUpperCase()} (TID: ${transactionRef || "Free/Proof"})\nPlease confirm my booking status.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span dir="ltr">WhatsApp (+92 319 7318425)</span>
                  </a>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="py-2.5 px-5 bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    {m.doneBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── WORKER JOIN ONBOARDING & COMMISSION DASHBOARD MODAL ─── */}
      {isWorkerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`${
              isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-100"
            } rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border relative space-y-5 max-h-[92vh] overflow-y-auto`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsWorkerModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Top Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 pr-8">
              <button
                type="button"
                onClick={() => setWorkerModalTab("register")}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  workerModalTab === "register"
                    ? "bg-[#16A34A] text-white shadow-md shadow-emerald-600/30"
                    : isDarkMode
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{m.tabRegister}</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkerModalTab("dashboard")}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  workerModalTab === "dashboard"
                    ? "bg-[#16A34A] text-white shadow-md shadow-emerald-600/30"
                    : isDarkMode
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>{m.tabDashboard}</span>
              </button>
            </div>

            {/* TAB 1: 3-STEP WORKER REGISTRATION */}
            {workerModalTab === "register" && (
              <div className="space-y-4">
                {/* Registration Step Progress Bar */}
                {workerStepNumber <= 3 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className={workerStepNumber >= 1 ? "text-[#16A34A]" : ""}>
                        1. {lang === "en" ? "Personal" : lang === "ur" ? "ذاتی" : "ذاتي"}
                      </span>
                      <span className={workerStepNumber >= 2 ? "text-[#16A34A]" : ""}>
                        2. {lang === "en" ? "Professional" : lang === "ur" ? "پیشہ ورانہ" : "پيشيورانه"}
                      </span>
                      <span className={workerStepNumber >= 3 ? "text-[#16A34A]" : ""}>
                        3. {lang === "en" ? "Verification" : lang === "ur" ? "تصدیق و اکاؤنٹ" : "تصديق ۽ اڪائونٽ"}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#16A34A] transition-all duration-300"
                        style={{
                          width:
                            workerStepNumber === 1
                              ? "33%"
                              : workerStepNumber === 2
                              ? "66%"
                              : "100%",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* ─── STEP 1: PERSONAL DETAILS ─── */}
                {workerStepNumber === 1 && (
                  <form onSubmit={handleWorkerStep1Next} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{m.workerStep1Tag}</span>
                      </div>
                      <h3 className="text-xl font-black">{m.workerModalTitle}</h3>
                      <p className="text-xs text-slate-400">{m.workerModalSub}</p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerNameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={workerName}
                        onChange={(e) => setWorkerName(e.target.value)}
                        placeholder={m.workerNamePlaceholder}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                        } text-xs focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>

                    {/* Mobile Number (+92) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerMobileLabel} *
                      </label>
                      <div className="flex" dir="ltr">
                        <span
                          className={`inline-flex items-center px-3 rounded-l-xl border border-r-0 ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
                          } text-xs font-bold`}
                        >
                          +92
                        </span>
                        <input
                          type="tel"
                          required
                          value={workerPhone}
                          onChange={(e) => setWorkerPhone(e.target.value)}
                          placeholder="300 1234567"
                          className={`w-full px-3.5 py-2.5 rounded-r-xl border ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                          } text-xs focus:outline-none focus:border-[#16A34A]`}
                        />
                      </div>
                    </div>

                    {/* WhatsApp Number (Optional) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerWhatsAppLabel}
                      </label>
                      <div className="flex" dir="ltr">
                        <span
                          className={`inline-flex items-center px-3 rounded-l-xl border border-r-0 ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
                          } text-xs font-bold`}
                        >
                          +92
                        </span>
                        <input
                          type="tel"
                          value={workerWhatsApp}
                          onChange={(e) => setWorkerWhatsApp(e.target.value)}
                          placeholder={m.workerWhatsAppPlaceholder}
                          className={`w-full px-3.5 py-2.5 rounded-r-xl border ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                          } text-xs focus:outline-none focus:border-[#16A34A]`}
                        />
                      </div>
                    </div>

                    {/* City Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerCityLabel} *
                      </label>
                      <select
                        value={workerCity}
                        onChange={(e) => setWorkerCity(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        } text-xs font-semibold focus:outline-none focus:border-[#16A34A]`}
                      >
                        {pakistaniCities[lang].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Area / Locality */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerAreaLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={workerArea}
                        onChange={(e) => setWorkerArea(e.target.value)}
                        placeholder={m.workerAreaPlaceholder}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                        } text-xs focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>

                    {/* Work Address / Workshop (Optional) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerAddressLabel}
                      </label>
                      <input
                        type="text"
                        value={workerAddress}
                        onChange={(e) => setWorkerAddress(e.target.value)}
                        placeholder={m.workerAddressPlaceholder}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                        } text-xs focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{m.nextStep2Btn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* ─── STEP 2: PROFESSIONAL DETAILS ─── */}
                {workerStepNumber === 2 && (
                  <form onSubmit={handleWorkerStep2Next} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{m.workerStep2Tag}</span>
                      </div>
                      <h3 className="text-xl font-black">{m.workerStep2Tag}</h3>
                      <p className="text-xs text-slate-400">
                        {lang === "ur"
                          ? "اپنی مہارت، کام کی جگہ اور سروس کے دائرہ کار کا انتخاب کریں۔"
                          : lang === "sd"
                          ? "پنهنجي مهارت، ڪم جي جاءِ ۽ حد چونڊيو۔"
                          : "Select your skills, work environment, and coverage area."}
                      </p>
                    </div>

                    {/* Service Category: Auto Mechanic, AC Repair, Plumber, Electrician */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerTradeLabel} *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "Auto Mechanic", title: m.categoryMechanic, icon: Wrench },
                          { id: "AC Repair", title: m.categoryAC, icon: Snowflake },
                          { id: "Plumber", title: m.categoryPlumber, icon: Droplets },
                          { id: "Electrician", title: m.categoryElectrician, icon: Zap },
                        ].map((cat) => {
                          const IconComp = cat.icon;
                          const isSelected = workerCategories.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleToggleWorkerCategory(cat.id)}
                              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                                isSelected
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-[#16A34A] text-[#16A34A] shadow-sm"
                                  : isDarkMode
                                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "bg-[#16A34A] text-white"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold block truncate">{cat.title}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#16A34A] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Experience (Years) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerExpLabel} *
                      </label>
                      <select
                        value={workerExperience}
                        onChange={(e) => setWorkerExperience(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        } text-xs font-semibold focus:outline-none focus:border-[#16A34A]`}
                      >
                        <option value="1">{m.exp1Year}</option>
                        <option value="2">{m.exp2Years}</option>
                        <option value="3">{m.exp3Years}</option>
                        <option value="5">{m.exp5Years}</option>
                        <option value="10">{m.exp10Years}</option>
                      </select>
                    </div>

                    {/* Skills / Services Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workerSkillsDescLabel}
                      </label>
                      <textarea
                        rows={2}
                        value={workerSkillsDesc}
                        onChange={(e) => setWorkerSkillsDesc(e.target.value)}
                        placeholder={m.workerSkillsDescPlaceholder}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                        } text-xs focus:outline-none focus:border-[#16A34A] resize-none`}
                      />
                    </div>

                    {/* Work Type: Customer doorstep, own workshop, or both */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.workTypeLabel} *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "doorstep", title: m.workTypeDoorstep },
                          { id: "workshop", title: m.workTypeWorkshop },
                          { id: "both", title: m.workTypeBoth },
                        ].map((wt) => (
                          <button
                            key={wt.id}
                            type="button"
                            onClick={() => setWorkerWorkType(wt.id as any)}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                              workerWorkType === wt.id
                                ? "bg-emerald-50 dark:bg-emerald-950/60 border-[#16A34A] text-[#16A34A]"
                                : isDarkMode
                                ? "bg-slate-800 border-slate-700 text-slate-400"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            {wt.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Service Area / Radius */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.serviceRadiusLabel} *
                      </label>
                      <select
                        value={workerServiceRadius}
                        onChange={(e) => setWorkerServiceRadius(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        } text-xs font-semibold focus:outline-none focus:border-[#16A34A]`}
                      >
                        <option value="5 km">{m.radius5km}</option>
                        <option value="10 km">{m.radius10km}</option>
                        <option value="20 km">{m.radius20km}</option>
                        <option value="entire_city">{m.radiusEntireCity}</option>
                      </select>
                    </div>

                    {/* Profile Photo */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.profilePhotoLabel}
                      </label>
                      <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-3 text-center">
                        <input
                          type="file"
                          id="profile-photo-input"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                          className="hidden"
                        />
                        <label htmlFor="profile-photo-input" className="cursor-pointer block text-xs">
                          {workerProfilePhotoPreview ? (
                            <div className="flex items-center gap-3 text-left">
                              <img
                                src={workerProfilePhotoPreview}
                                alt="Profile Preview"
                                className="w-12 h-12 object-cover rounded-full border-2 border-[#16A34A] shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
                                  <FileCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                                  <span>{m.photoAttached}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate">{workerProfilePhotoName}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="py-2 text-slate-600 dark:text-slate-300">
                              <Camera className="w-6 h-6 text-[#16A34A] mx-auto mb-1" />
                              <span className="font-semibold text-[#16A34A]">
                                {m.uploadProfilePhoto}
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Step 2 Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setWorkerStepNumber(1)}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                          isDarkMode
                            ? "bg-slate-800 text-slate-300 border-slate-700"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {m.backStepBtn}
                      </button>

                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{m.nextStep3Btn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── STEP 3: VERIFICATION & PAYOUT DETAILS ─── */}
                {workerStepNumber === 3 && (
                  <form onSubmit={handleWorkerFinalSubmit} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{m.workerStep3Tag}</span>
                      </div>
                      <h3 className="text-xl font-black">{m.workerStep3Tag}</h3>
                      <p className="text-xs text-slate-400">
                        {lang === "ur"
                          ? "اپنی شناختی تصدیق اور جاز کیش، ایزی پیسہ یا بینک اکاؤنٹ درج کریں۔"
                          : lang === "sd"
                          ? "پنهنجي سڃاڻپ ۽ جاز ڪيش، ايزي پئسا يا بينڪ اڪائونٽ جا تفصيل ڏيو۔"
                          : "Provide identity verification and your payout receiving account."}
                      </p>
                    </div>

                    {/* CNIC Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>{m.cnicLabel} *</span>
                        <span className="text-[10px] text-slate-400">{m.cnicDigits}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={workerCnic}
                        onChange={(e) => setWorkerCnic(e.target.value)}
                        placeholder={m.cnicPlaceholder}
                        dir="ltr"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                        } text-xs font-mono focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>

                    {/* CNIC Front & Back Photo Uploads */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {m.cnicFrontLabel}
                        </label>
                        <div className="border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-2.5 text-center">
                          <input
                            type="file"
                            id="cnic-front-input"
                            accept="image/*"
                            onChange={handleCnicFrontChange}
                            className="hidden"
                          />
                          <label htmlFor="cnic-front-input" className="cursor-pointer block text-xs">
                            {workerCnicFrontName ? (
                              <div className="text-[11px] font-bold text-[#16A34A] truncate">
                                ✓ {workerCnicFrontName}
                              </div>
                            ) : (
                              <div className="text-slate-500 text-[11px]">
                                <Upload className="w-4 h-4 text-[#16A34A] mx-auto mb-0.5" />
                                <span>{m.uploadCnicFront}</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {m.cnicBackLabel}
                        </label>
                        <div className="border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-2.5 text-center">
                          <input
                            type="file"
                            id="cnic-back-input"
                            accept="image/*"
                            onChange={handleCnicBackChange}
                            className="hidden"
                          />
                          <label htmlFor="cnic-back-input" className="cursor-pointer block text-xs">
                            {workerCnicBackName ? (
                              <div className="text-[11px] font-bold text-[#16A34A] truncate">
                                ✓ {workerCnicBackName}
                              </div>
                            ) : (
                              <div className="text-slate-500 text-[11px]">
                                <Upload className="w-4 h-4 text-[#16A34A] mx-auto mb-0.5" />
                                <span>{m.uploadCnicBack}</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Payout Receiving Account Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.payoutMethodLabel} *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["jazzcash", "easypaisa", "bank_transfer"] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setWorkerPayoutMethod(method)}
                            className={`py-2 px-2 rounded-xl border text-xs font-bold text-center transition-all ${
                              workerPayoutMethod === method
                                ? "bg-[#16A34A] text-white border-[#16A34A] shadow-sm"
                                : isDarkMode
                                ? "bg-slate-800 text-slate-300 border-slate-700"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {method === "jazzcash"
                              ? "JazzCash"
                              : method === "easypaisa"
                              ? "Easypaisa"
                              : "Bank"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Account Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.accountTitleLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={workerAccountTitle}
                        onChange={(e) => setWorkerAccountTitle(e.target.value)}
                        placeholder={m.accountTitlePlaceholder}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                        } text-xs focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>

                    {/* Account Number / Mobile Wallet */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {m.accountNumberLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={workerAccountNumber}
                        onChange={(e) => setWorkerAccountNumber(e.target.value)}
                        placeholder={m.accountNumberPlaceholder}
                        dir="ltr"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                        } text-xs font-mono focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>

                    {/* Terms Agreement & 10% Commission Notice */}
                    <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          id="terms-agree"
                          required
                          checked={workerAgreedToTerms}
                          onChange={(e) => setWorkerAgreedToTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-[#16A34A] focus:ring-[#16A34A]"
                        />
                        <label
                          htmlFor="terms-agree"
                          className="font-bold text-emerald-950 dark:text-emerald-200 cursor-pointer text-xs"
                        >
                          {m.termsAgreementLabel}
                        </label>
                      </div>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 pl-6 leading-relaxed">
                        {m.termsNotice}
                      </p>
                    </div>

                    {/* Step 3 Navigation Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setWorkerStepNumber(2)}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                          isDarkMode
                            ? "bg-slate-800 text-slate-300 border-slate-700"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {m.backStepBtn}
                      </button>

                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{m.submitWorkerBtn}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── STEP 4: STATUS (REGISTRATION SUBMITTED — PENDING VERIFICATION) ─── */}
                {workerStepNumber === 4 && (
                  <div className="text-center space-y-4 py-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-md">
                      <FileCheck className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black">{m.workerSuccessTitle}</h3>
                      <p className="text-xs text-[#16A34A] font-bold">{m.workerSuccessSub}</p>
                      <div className="inline-block mt-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold">
                        {m.statusPendingBadge}
                      </div>
                    </div>

                    {/* Summary of submitted details */}
                    <div
                      className={`${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                      } rounded-2xl p-4 text-xs space-y-2 border text-left`}
                    >
                      <div className="flex justify-between">
                        <span className="text-slate-400">{m.workerNameLabel}</span>
                        <span className="font-bold">{workerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{m.workerTradeLabel}</span>
                        <span className="font-bold text-[#16A34A]">{workerCategories.join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{m.workerCityLabel}</span>
                        <span className="font-bold">{workerCity} ({workerArea})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{m.workerMobileLabel}</span>
                        <span className="font-bold" dir="ltr">+92 {workerPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{m.payoutMethodLabel}</span>
                        <span className="font-bold uppercase">{workerPayoutMethod} ({workerAccountTitle})</span>
                      </div>
                    </div>

                    {/* Critical Dispatch Policy: Cannot receive bookings until admin approves */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 dark:text-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{m.noBookingsNoticeTitle}</span>
                      </div>
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                        {m.noBookingsNoticeDesc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setWorkerModalTab("dashboard")}
                        className="flex-1 py-3 px-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Percent className="w-4 h-4" />
                        <span>{m.viewDashboardBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsWorkerModalOpen(false)}
                        className={`py-3 px-5 rounded-xl border text-xs font-bold transition-all ${
                          isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {m.doneBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WORKER COMMISSION DASHBOARD & CALCULATOR */}
            {workerModalTab === "dashboard" && (
              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                    <Percent className="w-3.5 h-3.5" />
                    <span>{m.tabDashboard}</span>
                  </div>
                  <h3 className="text-xl font-black">{m.commissionDashboardTitle}</h3>
                  <p className="text-xs text-slate-400">
                    {lang === "ur"
                      ? "10% پلیٹ فارم کمیشن کا مکمل طریقہ کار، آمدنی لیجر اور ڈیڈ لائن پالیسی۔"
                      : lang === "sd"
                      ? "10 سيڪڙو ڪميشن پاليسي، ڪمائي لکپڙهه ۽ مهلت جون هدايتون۔"
                      : "Overview of KAMZO's 10% commission system, worker ledger, and 7-day payment policy."}
                  </p>
                </div>

                {/* Status Notice */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-bold text-amber-800 dark:text-amber-200">
                      {lang === "ur"
                        ? "اکاؤنٹ اسٹیٹس: ایڈمن تصدیق زیر التواء"
                        : lang === "sd"
                        ? "کاتي جي حيثيت: ايڊمن تصديق هيٺ"
                        : "Account Status: Pending Verification"}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold">
                    {lang === "ur" ? "بکنگ عارضی رکی ہوئی" : lang === "sd" ? "بڪنگ بند" : "Bookings Paused"}
                  </span>
                </div>

                {/* 10% Commission Policy Rules */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-xs">
                  <h4 className="font-black text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#16A34A]" />
                    <span>{m.commissionPolicyTitle}</span>
                  </h4>
                  <ul className="space-y-1 text-emerald-900 dark:text-emerald-300 text-[11px] leading-relaxed">
                    <li>{m.commissionRule1}</li>
                    <li>{m.commissionRule2}</li>
                    <li>{m.commissionRule3}</li>
                  </ul>
                </div>

                {/* Clear Commission Example Box (Rs. 3000 -> Rs. 300 KAMZO -> Rs. 2700 Worker) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-[#16A34A]/30 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#16A34A] block">
                    {m.exampleBoxTitle}
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">{m.enterBillLabel}</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Rs. 3,000</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 shadow-sm border border-emerald-300 dark:border-emerald-800">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block">{m.kamzoFeeLabel}</span>
                      <span className="text-xs sm:text-sm font-extrabold text-[#16A34A]">Rs. 300</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">{m.yourShareLabel}</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Rs. 2,700</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Live 10% Commission Calculator */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>{m.calculatorTitle}</span>
                    </h4>
                    <span className="text-[10px] text-[#16A34A] font-extrabold">10% Platform Fee</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {m.enterBillLabel}
                    </label>
                    <div className="flex" dir="ltr">
                      <span className="inline-flex items-center px-3 rounded-l-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                        PKR
                      </span>
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={calcBillAmount}
                        onChange={(e) => setCalcBillAmount(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-r-xl border ${
                          isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200"
                        } text-xs font-bold focus:outline-none focus:border-[#16A34A]`}
                      />
                    </div>
                  </div>

                  {/* Calculator Breakdown Results */}
                  {Number(calcBillAmount) > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block">{m.kamzoFeeLabel}</span>
                        <span className="text-base font-black text-[#16A34A]">
                          Rs. {(Number(calcBillAmount) * 0.1).toFixed(0)}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-500 block">{m.yourShareLabel}</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          Rs. {(Number(calcBillAmount) * 0.9).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ledger & Overdue Warning */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{m.commissionDueTitle}</span>
                    <span className="text-[10px] text-slate-400">Account # KMZ-W782</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                      <span className="text-[10px] text-rose-600 block">{m.commissionDueLabel}</span>
                      <span className="text-sm font-black text-rose-600">Rs. 0</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                      <span className="text-[10px] text-emerald-700 block">{m.commissionPaidLabel}</span>
                      <span className="text-sm font-black text-[#16A34A]">Rs. 0</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">{m.completedJobsLabel}</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">0</span>
                    </div>
                  </div>

                  {/* 7-Day Overdue Policy Alert */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{m.overdueNoticeTitle}</span>
                    </div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                      {m.overdueNoticeDesc}
                    </p>
                  </div>
                </div>

                {/* Submit Commission Payment Section */}
                <form onSubmit={handleCommissionDepositSubmit} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{m.payCommissionTitle}</span>
                  </h4>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-500">JazzCash / Easypaisa:</span>
                      <span className="font-mono text-[#16A34A]" dir="ltr">0319 7318425</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Account Title:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Parvindar Kumar / KAMZO</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {m.tidInputLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={commissionDepositTid}
                      onChange={(e) => setCommissionDepositTid(e.target.value)}
                      placeholder={m.tidPlaceholder}
                      dir="ltr"
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${
                        isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200"
                      } text-xs font-mono focus:outline-none focus:border-[#16A34A]`}
                    />
                  </div>

                  {commissionDepositSubmitted ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#16A34A] text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A]" />
                      <span>{m.depositSubmittedSuccess}</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{m.submitDepositBtn}</span>
                    </button>
                  )}
                </form>

                <button
                  type="button"
                  onClick={() => setIsWorkerModalOpen(false)}
                  className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {m.doneBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── DARAZ-STYLE CUSTOMER AUTH MODAL (SIGN IN / REGISTER / FAST OTP) ─── */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl ${
              isDarkMode ? "bg-slate-900 text-white border border-slate-800" : "bg-white text-slate-900"
            } p-5 sm:p-7 shadow-2xl relative space-y-4`}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                setPendingServiceAfterAuth(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with KAMZO Branding */}
            <div className="text-center space-y-1.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#16A34A] text-xs font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>KAMZO Customer Account</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">{t.authModalTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                {t.authModalSub}
              </p>
            </div>

            {/* Interception Notice (If trying to book a service) */}
            {pendingServiceAfterAuth && (
              <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="leading-snug">
                  <p className="font-extrabold text-emerald-950 dark:text-emerald-200">
                    Booking: {getServiceName(pendingServiceAfterAuth)}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Login or create an account to secure your booking instantly.
                  </p>
                </div>
              </div>
            )}

            {/* 1-Click Google Connect Button */}
            <button
              type="button"
              onClick={handleGoogleConnect}
              disabled={isAuthLoading}
              className="w-full py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {isAuthLoading ? "Connecting..." : (m.continueWithGoogle || "Continue with Google")}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {m.orDividerText || "OR SIGN IN WITH GMAIL / PHONE"}
              </span>
            </div>

            {/* Auth Tab Switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthTab("signin");
                  setAuthError(null);
                }}
                className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center truncate ${
                  authTab === "signin"
                    ? "bg-white dark:bg-slate-900 text-[#16A34A] shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {t.tabSignIn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab("register");
                  setAuthError(null);
                }}
                className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center truncate ${
                  authTab === "register"
                    ? "bg-white dark:bg-slate-900 text-[#16A34A] shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {t.tabRegister}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab("quick");
                  setAuthError(null);
                }}
                className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center truncate ${
                  authTab === "quick"
                    ? "bg-white dark:bg-slate-900 text-[#16A34A] shadow-xs font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {t.tabQuickLogin}
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="font-semibold">{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-left">
              {/* Name field (for Registration & Quick Login optional) */}
              {authTab === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.nameInputLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    } text-xs focus:outline-none focus:border-[#16A34A] font-medium`}
                  />
                </div>
              )}

              {/* Email field (for Registration) */}
              {authTab === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {m.emailInputLabel || "Gmail / Email Address:"}
                  </label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={m.emailPlaceholder || "yourname@gmail.com"}
                    dir="ltr"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    } text-xs focus:outline-none focus:border-[#16A34A] font-medium`}
                  />
                </div>
              )}

              {/* Mobile Number / Gmail Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {authTab === "signin" ? (m.emailInputLabel || "Gmail or Mobile Number:") : t.phoneInputLabel}
                </label>
                <div className="relative">
                  <input
                    type={authTab === "signin" ? "text" : "tel"}
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder={authTab === "signin" ? "0300 1234567 or yourname@gmail.com" : "0300 1234567"}
                    dir="ltr"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    } text-xs font-mono focus:outline-none focus:border-[#16A34A]`}
                  />
                </div>
              </div>

              {/* Password field (for Sign In & Register) */}
              {authTab !== "quick" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.passwordInputLabel}
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    } text-xs focus:outline-none focus:border-[#16A34A] font-medium`}
                  />
                </div>
              )}

              {/* City Selection (for Register) */}
              {authTab === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.cityInputLabel}
                  </label>
                  <select
                    value={authCity}
                    onChange={(e) => setAuthCity(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200 bg-slate-50 text-slate-900"
                    } text-xs focus:outline-none focus:border-[#16A34A] font-medium`}
                  >
                    {pakistaniCities[lang].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAuthLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>
                      {authTab === "signin"
                        ? t.loginSubmitBtn
                        : authTab === "register"
                        ? t.registerSubmitBtn
                        : t.quickLoginSubmitBtn}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Daraz-Style Trust Footer Note */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              <p>🛡️ {t.guestNotice}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MY BOOKINGS / ORDERS DRAWER MODAL ─── */}
      {isMyBookingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl ${
              isDarkMode ? "bg-slate-900 text-white border border-slate-800" : "bg-white text-slate-900"
            } p-5 sm:p-7 shadow-2xl relative space-y-4`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMyBookingsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#16A34A] text-xs font-extrabold">
                <PackageCheck className="w-3.5 h-3.5" />
                <span>Customer Ledger</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">{t.myBookingsTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.myBookingsSub}</p>
            </div>

            {/* Active User Pill */}
            {customerUser && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{customerUser.name}</span>
                    <span className="block text-[11px] text-slate-500 font-mono" dir="ltr">{customerUser.phone}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFetchMyBookings}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#16A34A] transition-colors cursor-pointer"
                >
                  Refresh
                </button>
              </div>
            )}

            {/* Bookings List */}
            {isLoadingBookings ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium">Loading your orders...</p>
              </div>
            ) : customerBookingsList.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xs mx-auto">
                  {t.noBookingsFound}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsMyBookingsOpen(false);
                    handleOpenBooking();
                  }}
                  className="px-4 py-2 bg-[#16A34A] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#15803D] transition-colors cursor-pointer"
                >
                  {t.bookNewService}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {customerBookingsList.map((b: any) => (
                  <div
                    key={b.id || b.booking_number}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all text-left space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#16A34A]" dir="ltr">
                          {b.booking_number}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(b.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === "completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : b.status === "verified" || b.status === "accepted"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {b.status === "completed"
                          ? "Completed"
                          : b.status === "verified" || b.status === "accepted"
                          ? "Technician Assigned"
                          : "Under Review"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {b.service_name} • {b.city}
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        {b.visit_fee > 0 ? `Rs. ${b.visit_fee}` : "Free Inspection"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {b.problem}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Payment: {b.payment_method?.toUpperCase()}</span>
                      <a
                        href={`https://wa.me/923197318425?text=${encodeURIComponent(
                          `#KAMZO Customer Inquiry\nAssalam-o-Alaikum Support!\nRegarding my booking #${b.booking_number} (${b.service_name}) in ${b.city}.\nStatus: ${b.status}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{t.callSupport}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
