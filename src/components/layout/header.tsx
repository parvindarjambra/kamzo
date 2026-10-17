"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Search,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const pathMap: Record<string, string> = {
  "": "Dashboard",
  payments: "Payments & Verification",
  commissions: "Commission Ledgers",
  bonuses: "Worker Bonuses & Incentives",
  notifications: "Push Notifications",
  users: "Customer Management",
  workers: "Worker Network & Verification",
  settings: "Platform Settings",
};

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const currentPageTitle =
    segments.length === 0
      ? "Dashboard"
      : pathMap[segments[0]] || segments[0].charAt(0).toUpperCase() + segments[0].slice(1);

  return (
    <header className="h-16 bg-white border-b border-gray-200/80 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-gray-500 hover:text-[#0062FF] font-medium transition-colors"
        >
          KAMZO
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900">{currentPageTitle}</span>
        {segments.length > 1 && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 capitalize">
              {segments.slice(1).join(" / ")}
            </span>
          </>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Environment Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0062FF] border border-blue-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0062FF] animate-pulse" />
            Live PK Network
          </span>
        </div>

        {/* Quick Links / Notifications */}
        <Link
          href="/notifications"
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Admin Identity */}
        <div className="flex items-center gap-3 pl-1">
          <div className="w-8 h-8 rounded-full bg-[#0062FF] text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-sm">
            K
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-semibold text-gray-900">Admin Operations</p>
            <p className="text-gray-500 text-[11px]">Karachi, Pakistan</p>
          </div>
        </div>
      </div>
    </header>
  );
}
