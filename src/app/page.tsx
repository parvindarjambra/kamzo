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
    color: "#0062FF",
    badgeBg: "bg-blue-50 text-[#0062FF] border-blue-200",
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
    mainHeadline: "Certified Local Service Experts Near You.",
    subHeadline: "Your Need, Our Verified Experts.",
    heroSubtitle: "Connect with verified local mechanics, AC technicians, plumbers, and electricians anywhere in Pakistan. Transparent flat Rs. 200 inspection fee and pay cash directly after satisfactory completion.",
    bookAsCustomer: "1. Book as Customer",
    bookAsCustomerSub: "Order Service • Flat Rs. 200 Visit Fee",
    joinAsWorker: "2. Join as Worker",
    joinAsWorkerSub: "Register Skill • Earn & Get Daily Jobs",
    reviewsCount: "(2,100+ Reviews)",
    activeTechnicians: "320+ Active Technicians",
    securityCheck: "Security Check",
    cnicVerified: "100% CNIC Verified",
    visitFeeLabel: "Visit Fee",
    visitFeeValue: "Flat Rs. 200",
    certifiedTechsBanner: "Certified Pakistani Technicians",
    techsListBanner: "Mechanic • AC Repair • Plumber • Electrician",
    verifiedBadge: "Verified",
    coreServicesTag: "CORE SERVICES",
    coreServicesTitle: "Comprehensive On-Demand Solutions",
    coreServicesSub: "Select your required category and get an immediate verified expert at your location.",
    commonIssuesLabel: "Common Issues:",
    feePrefix: "Fee: ",
    certifiedTechBadge: "Certified Technician",
    bookNowPrefix: "Book ",
    bookNowSuffix: " Now",
    whyChooseTag: "BENEFITS",
    whyChooseTitle: "Why Customers Choose KAMZO",
    whyChooseSub: "The safest and most reliable way to hire skilled trade workers in Pakistan.",
    benefit1Title: "100% CNIC Background Verified",
    benefit1Desc: "Every service professional is thoroughly screened and identity-verified with Pakistani NADRA CNIC registration.",
    benefit2Title: "Fixed Rs. 200 Initial Visit Fee",
    benefit2Desc: "Zero surprise charges. Pay a flat Rs. 200 inspection fee, and pay the repair amount in cash only when you approve the work.",
    benefit3Title: "Rapid 30-Minute Doorstep Arrival",
    benefit3Desc: "Our automated algorithm connects you with the nearest active partner in your locality for prompt response.",
    howItWorksTag: "HOW IT WORKS",
    howItWorksTitle: "Three Simple Steps",
    howItWorksSub: "No complicated calls or bargaining. Experience smooth, transparent service delivery.",
    step1Title: "Request Service & Pay Visit Fee",
    step1Desc: "Select your service, choose your city, and pay flat Rs. 200 fee via JazzCash, Easypaisa, or Bank.",
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
  },
  ur: {
    selectLanguage: "زبان:",
    taglineBadge: "پاکستان کا نمبر 1 لوکل سروس مارکیٹ پلیس",
    mainHeadline: "آپ کے قریبی تصدیق شدہ ماہر کاریگر",
    subHeadline: "آپ کی ضرورت، ہمارے ماہر کاریگر۔",
    heroSubtitle: "پاکستان بھر میں تصدیق شدہ مکینک، اے سی ٹیکنیشن، پلمبر اور الیکٹریشن سے رابطہ کریں۔ وزٹ فیس صرف 200 روپے، اور کام تسلی بخش مکمل ہونے پر کیش ادا کریں۔",
    bookAsCustomer: "1. گاہک بکنگ",
    bookAsCustomerSub: "کاریگر بلوائیں • 200 روپے وزٹ فیس",
    joinAsWorker: "2. کاریگر رجسٹریشن",
    joinAsWorkerSub: "ہنر رجسٹر کریں • روزانہ کام حاصل کریں",
    reviewsCount: "(2,100+ جائزے)",
    activeTechnicians: "320+ تصدیق شدہ کاریگر",
    securityCheck: "سیکیورٹی چیک",
    cnicVerified: "100% شناختی کارڈ تصدیق",
    visitFeeLabel: "وزٹ فیس",
    visitFeeValue: "فلیٹ 200 روپے",
    certifiedTechsBanner: "سرٹیفائیڈ پاکستانی ماہر کاریگر",
    techsListBanner: "مکینک • اے سی سروس • پلمبر • الیکٹریشن",
    verifiedBadge: "تصدیق شدہ",
    coreServicesTag: "بنیادی خدمات",
    coreServicesTitle: "گھر اور دکان کی فوری و تسلی بخش مرمت",
    coreServicesSub: "اپنی مطلوبہ سروس منتخب کریں اور فوری طور پر تصدیق شدہ ماہر کاریگر بلوائیں۔",
    commonIssuesLabel: "عام مسائل:",
    feePrefix: "فیس: ",
    certifiedTechBadge: "تصدیق شدہ کاریگر",
    bookNowPrefix: "ابھی ",
    bookNowSuffix: " بک کریں",
    whyChooseTag: "فوائد",
    whyChooseTitle: "صارفین کامزو کا انتخاب کیوں کرتے ہیں؟",
    whyChooseSub: "پاکستان میں ہنر مند کاریگر ہائر کرنے کا سب سے محفوظ اور شفاف پلیٹ فارم۔",
    benefit1Title: "100% نادرا شناختی کارڈ تصدیق شدہ",
    benefit1Desc: "ہر سروس پروفیشنل کی مکمل جانچ پڑتال نادرا قومی شناختی کارڈ کے ساتھ کی جاتی ہے۔",
    benefit2Title: "فلیٹ 200 روپے وزٹ فیس",
    benefit2Desc: "کوئی چھپے ہوئے چارجز نہیں۔ صرف 200 روپے فیس، اور کام کے پیسے تسلی بخش مکمل ہونے کے بعد کیش میں ادا کریں۔",
    benefit3Title: "30 منٹ کے اندر دہلیز پر آمد",
    benefit3Desc: "ہمارا سسٹم آپ کے قریبی ایکٹو پارٹنر کو فوری الرٹ بھیجتا ہے تا کہ وہ جلد از جلد آپ تک پہنچ سکے۔",
    howItWorksTag: "طریقہ کار",
    howItWorksTitle: "تین آسان مراحل",
    howItWorksSub: "کوئی لمبی کالز یا بحث نہیں۔ آسان اور شفاف طریقے سے کام کروائیں۔",
    step1Title: "سروس منتخب کریں اور 200 فیس دیں",
    step1Desc: "اپنی مطلوبہ سروس اور شہر منتخب کریں اور جاز کیش، ایزی پیسہ یا بینک سے 200 روپے وزٹ فیس منتقل کریں۔",
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
  },
  sd: {
    selectLanguage: "ٻولي:",
    taglineBadge: "پاڪستان جو نمبر 1 مقامي سروس مارڪيٽ پليس",
    mainHeadline: "توهان جا ويجها تصديق ٿيل ماهر ڪاريگر",
    subHeadline: "توهان جي ضرورت، اسان جا ماهر ڪاريگر۔",
    heroSubtitle: "سڄي پاڪستان ۾ تصديق ٿيل ميڪينڪ، اي سي ٽيڪنيشن، پلمبر ۽ اليڪٽريشن۔ وزٽ فيس رڳو 200 رپيا، ۽ ڪم پورو ٿيڻ تي هٿ تي ڪيش ادا ڪريو۔",
    bookAsCustomer: "1. گراهڪ بڪنگ",
    bookAsCustomerSub: "ڪاريگر گهرايو • 200 رپيا وزٽ فيس",
    joinAsWorker: "2. ڪاريگر رجسٽريشن",
    joinAsWorkerSub: "هنر رجسٽر ڪريو • روزانو ڪم حاصل ڪريو",
    reviewsCount: "(2,100+ رايا)",
    activeTechnicians: "320+ تصديق ٿيل ڪاريگر",
    securityCheck: "سيڪيورٽي چيڪ",
    cnicVerified: "100% سڃاڻپ ڪارڊ تصديق",
    visitFeeLabel: "وزٽ فيس",
    visitFeeValue: "رڳو 200 رپيا",
    certifiedTechsBanner: "تصديق ٿيل پاڪستاني ماهر ڪاريگر",
    techsListBanner: "ميڪينڪ • اي سي سروس • پلمبر • اليڪٽريشن",
    verifiedBadge: "تصديق ٿيل",
    coreServicesTag: "مکيه خدمتون",
    coreServicesTitle: "گهر ۽ دڪان جي فوري و تسلي بخش مرمت",
    coreServicesSub: "پنهنجي گهربل سروس چونڊيو ۽ فوري طور ماهر ڪاريگر گهرايو۔",
    commonIssuesLabel: "عام مسئلا:",
    feePrefix: "فيس: ",
    certifiedTechBadge: "تصديق ٿيل ڪاريگر",
    bookNowPrefix: "هاڻي ",
    bookNowSuffix: " بڪ ڪريو",
    whyChooseTag: "فائدا",
    whyChooseTitle: "ماڻهو ڪامزو ڇو چونڊيندا آهن؟",
    whyChooseSub: "پاڪستان ۾ ڪاريگر گهرائڻ جو سڀ کان محفوظ ۽ آسان طريقو۔",
    benefit1Title: "100% نادرا سڃاڻپ ڪارڊ تصديق ٿيل",
    benefit1Desc: "هر ڪاريگر جي مڪمل چڪاس نادرا قومي سڃاڻپ ڪارڊ ذريعي ڪئي وڃي ٿي۔",
    benefit2Title: "رڳو 200 رپيا وزٽ فيس",
    benefit2Desc: "ڪو به لڪيل خرچ ناهي۔ رڳو 200 رپيا فيس، ۽ ڪم پورو ٿيڻ بعد ڪيش ادا ڪريو۔",
    benefit3Title: "30 منٽن ۾ گهر پهچ",
    benefit3Desc: "اسان جو سسٽم توهان جي ويجھي ڪاريگر کي فوري اطلاع موڪلي ٿو ته جيئن هو جلدي پهچي۔",
    howItWorksTag: "طريقو",
    howItWorksTitle: "ٽي سولا مرحلا",
    howItWorksSub: "ڪا به ڏکيائي ناهي۔ سولو ۽ شفاف طريقي سان ڪم ڪرايو۔",
    step1Title: "سروس چونڊيو ۽ 200 فيس ڏيو",
    step1Desc: "پنهنجي گهربل سروس ۽ شهر چونڊيو ۽ جاز ڪيش، ايزي پئسا يا بينڪ مان 200 رپيا فيس ادا ڪريو۔",
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
    bookingStep2Badge: "Step 2 of 2: Transfer Rs. 200 Visit Fee",
    attachProofTitle: "Attach Payment Proof",
    attachProofSub: "Send Rs. 200 advance inspection fee to any account below and upload the screenshot.",
    depositDetails: "Deposit Account Details:",
    transferInstruction: (method: string) => `Open your ${method} App, send Rs. 200, then paste the TID below.`,
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

    // Worker Modal
    workerBadge: "Worker Registration Form",
    workerModalTitle: "Join KAMZO as Service Professional",
    workerModalSub: "Register your trade, earn daily income with verified client bookings in your city.",
    workerNameLabel: "Full Name:",
    workerNamePlaceholder: "e.g. Ramesh Kumar / Muhammad Usman",
    workerMobileLabel: "Pakistani Mobile / WhatsApp:",
    workerTradeLabel: "Primary Skill / Trade:",
    workerCityLabel: "Your Base City:",
    workerExpLabel: "Experience:",
    exp1Year: "1 Year Experience",
    exp2Years: "2 Years Experience",
    exp3Years: "3 - 5 Years Experience",
    exp5Years: "5 - 10 Years (Senior Master)",
    exp10Years: "10+ Years (Ustadh / Expert)",
    cnicLabel: "CNIC Number:",
    cnicDigits: "13 Digits",
    cnicPlaceholder: "44102-1234567-1",
    cnicPhotoLabel: "CNIC Card Photo / Document:",
    cnicAttached: "CNIC Attached",
    uploadCnicPhoto: "Upload CNIC Front & Back Photo",
    submitWorkerBtn: "Submit Worker Application",
    workerSuccessTitle: "Application Received!",
    workerSuccessMsg: "Your technician registration application has been received successfully.",
    workerTrade: "Trade / Skill:",
    workerReviewPending: "Pending Review by Admin",
    verificationProcessTitle: "Verification Process:",
    workerVerifyStep1: "1. Admin team will verify your CNIC credentials and experience within 24 hours.",
    workerVerifyStep2: "2. Once approved, your account is activated and you will receive direct customer job leads via WhatsApp.",
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
    feeBreakdownSub: "اگلا مرحلہ: کاریگر روانگی کی تصدیق کے لیے جاز کیش یا ایزی پیسہ سے 200 روپے وزٹ فیس ادا کریں۔",
    nextPaymentBtn: "اگلا: وزٹ فیس ادائیگی کی طرف جائیں",
    bookingStep2Badge: "مرحلہ 2: 200 روپے وزٹ فیس منتقل کریں",
    attachProofTitle: "رسید کا ثبوت منسلک کریں",
    attachProofSub: "نیچے دیے گئے کسی بھی اکاؤنٹ میں 200 روپے بھیجیں اور اسکرین شاٹ اپ لوڈ کریں۔",
    depositDetails: "اکاؤنٹ کی تفصیلات:",
    transferInstruction: (method: string) => `اپنا ${method} ایپ کھولیں، 200 روپے بھیجیں اور نیچے TID درج کریں۔`,
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

    // Worker Modal
    workerBadge: "کاریگر رجسٹریشن فارم",
    workerModalTitle: "کامزو میں بطور کاریگر شامل ہوں",
    workerModalSub: "اپنا ہنر رجسٹر کریں، اور اپنے شہر میں روزانہ باقاعدہ کام اور آمدنی حاصل کریں۔",
    workerNameLabel: "کاریگر کا پورا نام:",
    workerNamePlaceholder: "مثال: محمد عثمان / رمیش کمار",
    workerMobileLabel: "موبائل نمبر / واٹس ایپ:",
    workerTradeLabel: "بنیادی مہارت / شعبہ:",
    workerCityLabel: "آپ کا شہر:",
    workerExpLabel: "تجربہ:",
    exp1Year: "1 سال کا تجربہ",
    exp2Years: "2 سال کا تجربہ",
    exp3Years: "3 سے 5 سال کا تجربہ",
    exp5Years: "5 سے 10 سال (سینئر کاریگر)",
    exp10Years: "10 سال سے زیادہ (استاد / ایکسپرٹ)",
    cnicLabel: "قومی شناختی کارڈ نمبر:",
    cnicDigits: "13 ہندسے",
    cnicPlaceholder: "44102-1234567-1",
    cnicPhotoLabel: "شناختی کارڈ کی تصویر:",
    cnicAttached: "شناختی کارڈ منسلک ہے",
    uploadCnicPhoto: "شناختی کارڈ کی تصویر اپ لوڈ کریں",
    submitWorkerBtn: "درخواست جمع کروائیں",
    workerSuccessTitle: "درخواست موصول ہو گئی!",
    workerSuccessMsg: "کاریگر رجسٹریشن درخواست کامیابی کے ساتھ موصول ہو گئی ہے۔",
    workerTrade: "مہارت / ہنر:",
    workerReviewPending: "ایڈمن جانچ پڑتال جاری ہے",
    verificationProcessTitle: "تصدیقی عمل:",
    workerVerifyStep1: "1. ایڈمن ٹیم 24 گھنٹوں میں آپ کے شناختی کارڈ اور تجربے کی تصدیق کرے گی۔",
    workerVerifyStep2: "2. منظوری کے بعد آپ کو کسٹمر کے کام کے آرڈرز واٹس ایپ پر ملنا شروع ہو جائیں گے۔",
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
    feeBreakdownSub: "اڳيان مرحلو: ڪاريگر جي اچڻ جي تصديق لاءِ 200 رپيا وزٽ فيس جاز ڪيش يا ايزي پئسا ذريعي ادا ڪريو۔",
    nextPaymentBtn: "اڳيان: وزٽ فيس ادائيگي ڏانهن وڃو",
    bookingStep2Badge: "مرحلو 2: 200 رپيا وزٽ فيس موڪليو",
    attachProofTitle: "رسيد جو ثبوت لڳايو",
    attachProofSub: "هيٺ ڏنل ڪنهن به اڪائونٽ ۾ 200 رپيا موڪليو ۽ اسڪرين شاٽ اپلوڊ ڪريو۔",
    depositDetails: "اڪائونٽ جا تفصيل:",
    transferInstruction: (method: string) => `پنهنجي ${method} ائپ مان 200 رپيا موڪليو ۽ هيٺ TID داخل ڪريو۔`,
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

    // Worker Modal
    workerBadge: "ڪاريگر رجسٽريشن فارم",
    workerModalTitle: "ڪامزو ۾ بحيثيت ڪاريگر شامل ٿيو",
    workerModalSub: "پنهنجو هنر رجسٽر ڪريو، ۽ پنهنجي شهر ۾ روزانو باقاعده ڪم ۽ ڪمائي حاصل ڪريو۔",
    workerNameLabel: "ڪاريگر جو پورو نالو:",
    workerNamePlaceholder: "مثال: محمد عثمان / رميش ڪمار",
    workerMobileLabel: "موبائل نمبر / واٽس ايپ:",
    workerTradeLabel: "مکيه هنر / شعبو:",
    workerCityLabel: "توهان جو شهر:",
    workerExpLabel: "تجربو:",
    exp1Year: "1 سال تجربو",
    exp2Years: "2 سال تجربو",
    exp3Years: "3 کان 5 سال تجربو",
    exp5Years: "5 کان 10 سال (سينئر ڪاريگر)",
    exp10Years: "10 سال کان وڌيڪ (استاد / ماهر)",
    cnicLabel: "قومي سڃاڻپ ڪارڊ نمبر:",
    cnicDigits: "13 انگ",
    cnicPlaceholder: "44102-1234567-1",
    cnicPhotoLabel: "سڃاڻپ ڪارڊ جو فوٽو:",
    cnicAttached: "سڃاڻپ ڪارڊ لڳل آهي",
    uploadCnicPhoto: "سڃاڻپ ڪارڊ جو فوٽو اپلوڊ ڪريو",
    submitWorkerBtn: "درخواست جمع ڪريو",
    workerSuccessTitle: "درخواست ملي وئي!",
    workerSuccessMsg: "ڪاريگر رجسٽريشن درخواست ڪاميابي سان ملي وئي آهي۔",
    workerTrade: "هنر / شعبو:",
    workerReviewPending: "ايڊمن چڪاس جاري آهي",
    verificationProcessTitle: "تصديقي عمل:",
    workerVerifyStep1: "1. ايڊمن ٽيم 24 ڪلاڪن ۾ توهان جي سڃاڻپ ڪارڊ ۽ تجربي جي چڪاس ڪندي۔",
    workerVerifyStep2: "2. منظوري بعد توهان کي گراهڪن جا آرڊر واٽس ايپ تي ملڻ شروع ٿيندا۔",
  },
};

// Set to false when app is officially launched on Play Store / Hostinger
const SHOW_BROWSER_APP_INSTALL = true;

export default function STCStyleMarketplacePage() {
  const [lang, setLang] = useState<"en" | "ur" | "sd">("en");
  const [selectedService, setSelectedService] = useState<ServiceData>(services[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "confirmed">("details");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Worker Join Onboarding State
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerStep, setWorkerStep] = useState<"form" | "confirmed">("form");
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");
  const [workerSkill, setWorkerSkill] = useState("Auto Mechanic");
  const [workerCity, setWorkerCity] = useState("Umerkot");
  const [workerExperience, setWorkerExperience] = useState("3");
  const [workerCnic, setWorkerCnic] = useState("");
  const [workerCnicFileName, setWorkerCnicFileName] = useState("");

  // Secret Admin Access via 5 Rapid Logo Taps
  const [logoTaps, setLogoTaps] = useState(0);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Synchronize city and worker skill on language change
  useEffect(() => {
    setSelectedCity(pakistaniCities[lang][0]);
    setWorkerCity(pakistaniCities[lang][0]);
    setWorkerSkill(workerSkillsList[lang][0]);
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
    if (lang === "ur") return srv.inspectionFeeUrdu;
    if (lang === "sd") return srv.inspectionFeeSindhi;
    return srv.inspectionFee;
  };

  const getServiceItems = (srv: ServiceData) => {
    if (lang === "ur") return srv.popularItemsUrdu;
    if (lang === "sd") return srv.popularItemsSindhi;
    return srv.popularItems;
  };

  return (
    <div
      dir={lang === "ur" || lang === "sd" ? "rtl" : "ltr"}
      className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden ${
        isDarkMode ? "bg-[#0B132B] text-slate-100" : "bg-white text-[#0A1128]"
      } font-sans transition-colors duration-200 selection:bg-[#0062FF] selection:text-white relative pb-24 md:pb-0`}
    >
      {/* Subtle MedicoEngineer Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* ─── OFFICIAL NAVBAR WITH TRILINGUAL SELECTOR ─── */}
      <header
        className={`sticky top-0 z-40 ${
          isDarkMode ? "bg-[#0B132B]/95 border-slate-800" : "bg-white/95 border-slate-100"
        } backdrop-blur-md border-b transition-colors w-full overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo Brand: Official KAMZO App Icon & Typography */}
          <Link
            href="/"
            onClick={handleLogoSecretTap}
            className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 select-none cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-md shadow-blue-500/25 transition-all group-hover:scale-105 shrink-0">
              <img src="/logo.png" alt="KAMZO Logo" className="w-full h-full object-cover" />
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

          {/* Centered Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#services" className="hover:text-[#0062FF] transition-colors py-1">
              {t.navServices}
            </a>
            <a href="#how-it-works" className="hover:text-[#0062FF] transition-colors py-1">
              {t.navHowItWorks}
            </a>
            <a href="#benefits" className="hover:text-[#0062FF] transition-colors py-1">
              {t.navWhyUs}
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* PWA Install Button (For Desktop / Laptop) */}
            {!isAppInstalled && (
              <button
                onClick={handleInstallApp}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-blue-500/30 bg-blue-50/70 hover:bg-blue-100 text-[#0062FF] dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700/50 transition-all cursor-pointer shrink-0 shadow-xs"
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
                    ? "bg-[#0062FF] text-white shadow-xs font-black"
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
                    ? "bg-[#0062FF] text-white shadow-xs font-black"
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
                    ? "bg-[#0062FF] text-white shadow-xs font-black"
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className={`lg:col-span-7 space-y-6 ${lang === "ur" || lang === "sd" ? "text-center lg:text-right" : "text-center lg:text-left"}`}>
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#0062FF] text-xs font-extrabold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>{t.taglineBadge}</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] ${isDarkMode ? "text-white" : "text-[#0A1128]"}`}>
                  {t.mainHeadline}
                </h1>
                <p className="text-2xl sm:text-3xl font-black text-[#0062FF] leading-snug">
                  {t.subHeadline}
                </p>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Clean Action Box: ONLY 2 Buttons (Customer Booking & Worker Join) */}
              <div
                className={`${
                  isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/80"
                } rounded-2xl p-4 sm:p-5 shadow-xl shadow-blue-900/5 border max-w-xl mx-auto lg:mx-0`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Button 1: Customer Booking */}
                  <button
                    onClick={() => handleOpenBooking(selectedService)}
                    className="w-full py-4 px-4 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-between gap-3 cursor-pointer text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                        <Wrench className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold truncate text-sm">
                          {t.bookAsCustomer}
                        </div>
                        <div className="text-[10px] text-blue-100 truncate font-normal">
                          {t.bookAsCustomerSub}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 text-white rtl:rotate-180" />
                  </button>

                  {/* Button 2: Worker Join / Registration */}
                  <button
                    onClick={() => {
                      setWorkerStep("form");
                      setIsWorkerModalOpen(true);
                    }}
                    className={`w-full py-4 px-4 font-bold text-xs sm:text-sm rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer text-left rtl:text-right ${
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
                    <ArrowRight className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 rtl:rotate-180" />
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
                  <span className="text-xs text-slate-400">{t.reviewsCount}</span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Users className="w-4 h-4 text-[#0062FF]" />
                  <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                    {t.activeTechnicians}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Image Showcase Column (Badges placed OUTSIDE image: Above & Below) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none space-y-3.5">
                {/* ─── UPER (ABOVE IMAGE): Security Check & Visit Fee Badges ─── */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Top-Left Badge: Security Check */}
                  <div
                    className={`rounded-2xl p-3 shadow-sm border flex items-center gap-2.5 transition-all ${
                      isDarkMode ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-800"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0062FF] shrink-0 border border-blue-100 dark:border-blue-900/50">
                      <ShieldCheck className="w-5 h-5 text-[#0062FF]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight truncate">
                        {t.securityCheck}
                      </p>
                      <p className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate">
                        {t.cnicVerified}
                      </p>
                    </div>
                  </div>

                  {/* Top-Right Badge: Visit Fee */}
                  <div
                    className={`rounded-2xl p-3 shadow-sm border flex items-center gap-2.5 transition-all ${
                      isDarkMode ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-800"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0062FF] shrink-0 border border-blue-100 dark:border-blue-900/50">
                      <Wallet className="w-4 h-4 text-[#0062FF]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight truncate">
                        {t.visitFeeLabel}
                      </p>
                      <p className="text-xs font-black text-[#0062FF] leading-tight truncate">
                        {t.visitFeeValue}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ─── CLEAR & UNOBSTRUCTED IMAGE (Picture 100% Clear Show Hogi) ─── */}
                <div
                  className={`rounded-3xl overflow-hidden shadow-2xl border-4 ${
                    isDarkMode ? "border-slate-800 shadow-blue-950/20" : "border-white shadow-blue-900/10"
                  } bg-slate-100 group relative`}
                >
                  <img
                    src="/services-grid.jpg"
                    alt="KAMZO Certified Pakistani Technicians - Electrician, Plumber, AC Repair, Mechanic"
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-102"
                  />
                </div>

                {/* ─── NICHA (BELOW IMAGE): Certified Pakistani Technicians Banner ─── */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl shadow-md border transition-all ${
                    isDarkMode ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0062FF] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0062FF]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black truncate">{t.certifiedTechsBanner}</p>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {t.techsListBanner}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-extrabold bg-[#0062FF] text-white px-3 py-1.5 rounded-xl shadow-md shadow-blue-500/25 shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.verifiedBadge}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETAILED 4 SERVICES CARDS (With Real Worker Images) ─── */}
      <section className="py-20" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
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
              const displayDesc = getServiceDescription(srv);
              const displayFee = getServiceFee(srv);
              const displayItems = getServiceItems(srv);

              return (
                <div
                  key={srv.id}
                  className={`${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 hover:border-[#0062FF]/50"
                      : "bg-white border-slate-200/80 hover:border-[#0062FF]/40"
                  } rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
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
                          {t.feePrefix}{displayFee}
                        </span>
                      </div>
                      {/* Certified Badge Overlay */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#0062FF] text-white shadow-sm flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          <span>{t.certifiedTechBadge}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          isDarkMode ? "text-white" : "text-[#0A1128]"
                        } group-hover:text-[#0062FF] transition-colors`}
                      >
                        {displayName}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{displayCategory}</p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {displayDesc}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {t.commonIssuesLabel}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {displayItems.map((issue, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded-md ${
                              isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                            } font-medium`}
                          >
                            • {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenBooking(srv)}
                      className="w-full py-2.5 px-4 bg-blue-50 group-hover:bg-[#0062FF] text-[#0062FF] group-hover:text-white font-bold text-xs rounded-xl border border-blue-200 group-hover:border-[#0062FF] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>
                        {t.bookNowPrefix}{displayName}{t.bookNowSuffix}
                      </span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
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
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
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
                isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"
              } p-8 rounded-3xl border shadow-sm text-center space-y-4`}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
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
                isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"
              } p-8 rounded-3xl border shadow-sm text-center space-y-4`}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
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
                isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"
              } p-8 rounded-3xl border shadow-sm text-center space-y-4`}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0062FF] flex items-center justify-center mx-auto border border-blue-100">
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
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0062FF]">
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
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
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
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
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
              <div className="w-12 h-12 rounded-xl bg-[#0062FF] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
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
            <div className="flex items-center gap-3.5 cursor-pointer select-none" onClick={handleLogoSecretTap}>
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-blue-500/25 shrink-0">
                <img src="/logo.png" alt="KAMZO Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-white tracking-tight">KAM</span>
                  <span className="text-xl font-black text-[#0062FF] tracking-tight">ZO</span>
                </div>
                <p className="text-[9px] uppercase tracking-[0.24em] font-extrabold text-slate-400">
                  SERVICES MARKETPLACE
                </p>
                <p className="text-[10px] text-[#0062FF] font-bold">{t.footerTagline}</p>
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
            <p className="text-[#0062FF] font-semibold">{t.footerLocations}</p>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING ACTION WIDGETS ─── */}
      <a
        href="https://wa.me/923197318425?text=Assalam-o-Alaikum%20KAMZO%20Support"
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
          className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0062FF] hover:bg-[#0052D9] text-white flex items-center justify-center shadow-xl shadow-blue-500/35 border-2 border-white/20 transition-all hover:scale-110 cursor-pointer animate-in fade-in group"
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
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#0062FF] flex-1 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </button>

        <a
          href="#services"
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-600 dark:text-slate-300 hover:text-[#0062FF] flex-1 transition-colors"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">{t.navServices}</span>
        </a>

        {/* Center Booking Action (Prominent App Button) */}
        <button
          onClick={() => handleOpenBooking()}
          className="flex flex-col items-center justify-center -mt-5 py-0.5 px-2 flex-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#0062FF] text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-active:scale-95 transition-transform border-3 border-white dark:border-[#0B132B]">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-[#0062FF] mt-0.5 whitespace-nowrap">Rs. 200 Book</span>
        </button>

        <a
          href="https://wa.me/923197318425?text=Assalam-o-Alaikum%20KAMZO%20Support"
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
          <div
            className={`${
              isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-200"
            } rounded-3xl max-w-sm w-full p-6 shadow-2xl border space-y-4`}
          >
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
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0062FF] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>Safari browser me neeche <strong>Share button</strong> par tap karein.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0062FF] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>Menu ko scroll karein aur <strong>Add to Home Screen</strong> select karein.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0062FF] font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>Top right par <strong>Add</strong> par click karein. KAMZO aapke phone par app ki tarah save ho jayegi!</span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSInstallGuide(false)}
              className="w-full py-2.5 bg-[#0062FF] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
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
              <form onSubmit={handleDetailsSubmit} className="space-y-4 text-left rtl:text-right">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0062FF]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{m.bookingStep1Badge}</span>
                  </div>
                  <h3 className="text-xl font-black">
                    {m.bookTitle} {getServiceName(selectedService)}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {m.initialInspectionFee} <strong className="text-[#0062FF]">{getServiceFee(selectedService)}</strong>
                  </p>
                </div>

                {/* Service Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.chooseServiceLabel}
                  </label>
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
                        <span className="truncate">{getServiceName(srv)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.selectCityLabel}
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    } text-xs font-semibold focus:outline-none focus:border-[#0062FF]`}
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
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200 bg-blue-50/40"
                        } text-xs font-semibold focus:outline-none focus:border-[#0062FF] placeholder:text-slate-400`}
                      />
                    </div>
                  )}
                </div>

                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={m.fullNamePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                    } text-xs focus:outline-none focus:border-[#0062FF]`}
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.mobileLabel}
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
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="319 7318425"
                      className={`w-full px-3.5 py-2.5 rounded-r-xl border ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                      } text-xs focus:outline-none focus:border-[#0062FF]`}
                    />
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.problemLabel}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={problemDetail}
                    onChange={(e) => setProblemDetail(e.target.value)}
                    placeholder={m.problemPlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                    } text-xs focus:outline-none focus:border-[#0062FF] resize-none`}
                  />
                </div>

                {/* Visit fee breakdown */}
                <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl p-3 border border-blue-100 dark:border-blue-900/50 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-blue-950 dark:text-blue-200">
                    <span>{m.feeBreakdownTitle}</span>
                    <span className="text-[#0062FF]">{getServiceFee(selectedService)}</span>
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    {m.feeBreakdownSub}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{m.nextPaymentBtn}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT & RECEIPT PROOF ATTACHMENT */}
            {bookingStep === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left rtl:text-right">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0062FF]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{m.bookingStep2Badge}</span>
                  </div>
                  <h3 className="text-xl font-black">{m.attachProofTitle}</h3>
                  <p className="text-xs text-slate-400">{m.attachProofSub}</p>
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
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-blue-900 dark:text-blue-200 font-bold">
                    <span>{m.depositDetails}</span>
                    <span className="text-xs bg-[#0062FF] text-white px-2 py-0.5 rounded-full font-mono">
                      Rs. 200
                    </span>
                  </div>

                  {paymentMethod === "jazzcash" && (
                    <div className="space-y-1 text-slate-800 dark:text-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">JazzCash Mobile:</span>
                        <span className="font-mono font-black text-sm text-[#0062FF]" dir="ltr">0319 7318425</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold">KAMZO Services / Parvindar</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "easypaisa" && (
                    <div className="space-y-1 text-slate-800 dark:text-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Easypaisa Mobile:</span>
                        <span className="font-mono font-black text-sm text-[#0062FF]" dir="ltr">0319 7318425</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold">KAMZO Services / Parvindar</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank_transfer" && (
                    <div className="space-y-1 text-slate-800 dark:text-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bank Name:</span>
                        <span className="font-bold">Allied Bank / Meezan Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account / IBAN:</span>
                        <span className="font-mono font-bold text-xs" dir="ltr">03197318425 / PK36MEZN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold">KAMZO Marketplace</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-blue-700 dark:text-blue-300 pt-1 border-t border-blue-200/60 dark:border-blue-900/50">
                    {m.transferInstruction(paymentMethod === "jazzcash" ? "JazzCash" : paymentMethod === "easypaisa" ? "Easypaisa" : "Bank")}
                  </p>
                </div>

                {/* Transaction Reference / TID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{m.tidLabel}</span>
                    <span className="text-[10px] text-slate-400">{m.tidRequired}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder={m.tidPlaceholder}
                    dir="ltr"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                    } text-xs font-mono focus:outline-none focus:border-[#0062FF]`}
                  />
                </div>

                {/* Screenshot Upload with Preview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{m.receiptProofLabel}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">{m.fastApproval}</span>
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-3 text-center transition-colors ${
                      receiptPreview
                        ? "border-emerald-400 bg-emerald-50/50"
                        : isDarkMode
                        ? "border-slate-700 bg-slate-800/50 hover:border-blue-500"
                        : "border-slate-200 bg-slate-50/70 hover:border-blue-400"
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
                        <div className="flex items-center gap-3 text-left rtl:text-right">
                          <img
                            src={receiptPreview}
                            alt="Receipt Preview"
                            className="w-14 h-14 object-cover rounded-xl border border-emerald-300 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{m.receiptAttached}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{receiptFileName || "screenshot.png"}</p>
                            <span className="text-[10px] text-[#0062FF] underline font-semibold">{m.changeScreenshot}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2.5 space-y-1">
                          <Upload className="w-6 h-6 text-[#0062FF] mx-auto" />
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {m.tapUploadReceipt}
                          </div>
                          <p className="text-[10px] text-slate-400">{m.uploadFormats}</p>
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
                    {m.backBtn}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0062FF] hover:bg-[#0052D9] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{m.submitProofBtn}</span>
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
                  <h3 className="text-2xl font-black">{m.bookingRegistered}</h3>
                  <p className="text-xs text-[#0062FF] font-bold mt-1">{m.bookingSuccessMsg}</p>
                  <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                    {m.underVerification}
                  </div>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  } rounded-2xl p-4 text-xs space-y-2 border text-left rtl:text-right`}
                >
                  <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">{m.bookingRef}</span>
                    <span className="font-mono font-bold text-[#0062FF]" dir="ltr">{confirmedBookingId}</span>
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
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-[#0062FF] font-bold">
                    <span>{m.initialFeeTransferred}</span>
                    <span>Rs. 200</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed text-left rtl:text-right">
                  <p className="font-semibold pb-1">{m.nextStepsTitle}</p>
                  <p>{m.step1AdminVerify}</p>
                  <p>{m.step2Dispatch}</p>
                  <p>{m.step3PayCash}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/923197318425"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span dir="ltr">WhatsApp (+92 319 7318425)</span>
                  </a>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="py-2.5 px-5 bg-[#0062FF] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    {m.doneBtn}
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
          <div
            className={`${
              isDarkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-slate-100"
            } rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border relative space-y-5 max-h-[90vh] overflow-y-auto`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsWorkerModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {workerStep === "form" ? (
              <form onSubmit={handleWorkerSubmit} className="space-y-4 text-left rtl:text-right">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{m.workerBadge}</span>
                  </div>
                  <h3 className="text-xl font-black">{m.workerModalTitle}</h3>
                  <p className="text-xs text-slate-400">{m.workerModalSub}</p>
                </div>

                {/* Worker Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.workerNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder={m.workerNamePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "border-slate-200"
                    } text-xs focus:outline-none focus:border-emerald-600`}
                  />
                </div>

                {/* Worker Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.workerMobileLabel}
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
                      } text-xs focus:outline-none focus:border-emerald-600`}
                    />
                  </div>
                </div>

                {/* Skill / Trade Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.workerTradeLabel}
                  </label>
                  <select
                    value={workerSkill}
                    onChange={(e) => setWorkerSkill(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    } text-xs font-semibold focus:outline-none focus:border-emerald-600`}
                  >
                    {workerSkillsList[lang].map((trade) => (
                      <option key={trade} value={trade}>
                        {trade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.workerCityLabel}
                  </label>
                  <select
                    value={workerCity}
                    onChange={(e) => setWorkerCity(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    } text-xs font-semibold focus:outline-none focus:border-emerald-600`}
                  >
                    {pakistaniCities[lang].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience in Years */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.workerExpLabel}
                  </label>
                  <select
                    value={workerExperience}
                    onChange={(e) => setWorkerExperience(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    } text-xs font-semibold focus:outline-none focus:border-emerald-600`}
                  >
                    <option value="1">{m.exp1Year}</option>
                    <option value="2">{m.exp2Years}</option>
                    <option value="3">{m.exp3Years}</option>
                    <option value="5">{m.exp5Years}</option>
                    <option value="10">{m.exp10Years}</option>
                  </select>
                </div>

                {/* CNIC Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{m.cnicLabel}</span>
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
                    } text-xs font-mono focus:outline-none focus:border-emerald-600`}
                  />
                </div>

                {/* CNIC Photo Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {m.cnicPhotoLabel}
                  </label>
                  <div className="border-2 border-dashed border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-3 text-center">
                    <input
                      type="file"
                      id="cnic-file-input"
                      accept="image/*,.pdf"
                      onChange={handleWorkerCnicChange}
                      className="hidden"
                    />
                    <label htmlFor="cnic-file-input" className="cursor-pointer block text-xs">
                      {workerCnicFileName ? (
                        <div className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center gap-1">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{workerCnicFileName} {m.cnicAttached}</span>
                        </div>
                      ) : (
                        <div className="text-slate-600 dark:text-slate-300">
                          <Upload className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {m.uploadCnicPhoto}
                          </span>
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
                  <span>{m.submitWorkerBtn}</span>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">{m.workerSuccessTitle}</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-1">{m.workerSuccessMsg}</p>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  } rounded-2xl p-4 text-xs space-y-2 border text-left rtl:text-right`}
                >
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.workerNameLabel}</span>
                    <span className="font-bold">{workerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.workerTrade}</span>
                    <span className="font-bold">{workerSkill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.workerCityLabel}</span>
                    <span className="font-bold">{workerCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.workerMobileLabel}</span>
                    <span className="font-bold" dir="ltr">+92 {workerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{m.cnicLabel}</span>
                    <span className="font-bold text-amber-600">{m.workerReviewPending}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed text-left rtl:text-right">
                  <p className="font-semibold pb-1">{m.verificationProcessTitle}</p>
                  <p>{m.workerVerifyStep1}</p>
                  <p>{m.workerVerifyStep2}</p>
                </div>

                <button
                  onClick={() => setIsWorkerModalOpen(false)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  {m.doneBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
