"use client";

import * as React from "react";
import { Sparkles, ExternalLink } from "lucide-react";

export type AdSlotType = "header_top" | "in_feed" | "footer_banner" | "sidebar";

interface AdBannerProps {
  slot: AdSlotType;
  className?: string;
  // If user has Google AdSense Publisher ID
  adClient?: string;
  adSlotId?: string;
  // Optional custom sponsor details for direct advertiser monetization
  sponsor?: {
    title: string;
    description: string;
    ctaText: string;
    linkUrl: string;
    badgeText?: string;
    imageUrl?: string;
  };
}

export function AdBanner({
  slot,
  className = "",
  adClient,
  adSlotId,
  sponsor,
}: AdBannerProps) {
  // If user provides Google AdSense IDs, render standard AdSense unit
  if (adClient && adSlotId) {
    return (
      <div className={`w-full overflow-hidden flex flex-col items-center justify-center my-4 ${className}`}>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
          Advertisement (اشتہار)
        </span>
        <div className="w-full max-w-[728px] min-h-[90px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adClient}
            data-ad-slot={adSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // 1. Header Top Leaderboard (728x90 on Desktop, 320x50 on Mobile - MedicoEngineer style)
  if (slot === "header_top") {
    return (
      <div className={`w-full max-w-5xl mx-auto px-4 my-3 ${className}`}>
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200/60 dark:border-blue-900/40 p-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-[#0062FF] dark:text-blue-400 border border-blue-500/20 shrink-0">
              Sponsored
            </span>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {sponsor?.title || "Partner With KAMZO: Showcase Your Local Hardware & Tools Business"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                {sponsor?.description || "Reach 50,000+ monthly homeowners and technicians across Karachi, Lahore & Umerkot."}
              </p>
            </div>
          </div>

          <a
            href={sponsor?.linkUrl || "https://wa.me/923197318425?text=Hi%20KAMZO,%20I%20want%20to%20advertise%20on%20your%20marketplace"}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-[#0062FF] hover:bg-[#0052D9] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>{sponsor?.ctaText || "Advertise Here"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 2. In-Feed Native Card (Blends cleanly into service sections like MedicoEngineer)
  if (slot === "in_feed") {
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 ${className}`}>
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-950 text-white p-6 sm:p-10 border border-blue-500/30 shadow-2xl">
          {/* Ambient light glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#0062FF]" />
                <span>FEATURED LOCAL SPONSOR · اشتہار</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {sponsor?.title || "Pak Fasteners & Electrical Supply Depot"}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {sponsor?.description || "Genuine copper cables, breaker panels, plumbing fittings, and AC copper tubing at wholesale dealer rates with same-day doorstep delivery."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={sponsor?.linkUrl || "https://wa.me/923197318425?text=Inquiry%20from%20KAMZO%20Sponsored%20Ad"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#0062FF] hover:bg-[#0052D9] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{sponsor?.ctaText || "Get Special 15% Discount"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Footer Banner (Placed right before the footer)
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 my-8 ${className}`}>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            Sponsored Network Partner
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {sponsor?.title || "Want to grow your hardware store or automotive workshop in Pakistan?"}
          </p>
        </div>
        <a
          href={sponsor?.linkUrl || "https://wa.me/923197318425?text=Partner%20Inquiry%20from%20Footer%20Ad"}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl border border-[#0062FF] text-[#0062FF] hover:bg-[#0062FF] hover:text-white text-xs font-bold transition-all"
        >
          {sponsor?.ctaText || "Book Ad Space"}
        </a>
      </div>
    </div>
  );
}
