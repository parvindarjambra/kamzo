"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Percent,
  Gift,
  Bell,
  Users,
  HardHat,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Commissions",
    href: "/payments?tab=commissions",
    icon: Percent,
  },
  {
    title: "Bonuses",
    href: "/bonuses",
    icon: Gift,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Workers",
    href: "/workers",
    icon: HardHat,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out of the KAMZO Admin Panel?")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kamzo_admin_authenticated");
        document.cookie = "kamzo_admin_auth=; path=/; max-age=0";
      }
      window.location.href = "/login";
    }
  };

  return (
    <aside className="w-64 bg-[#141414] text-gray-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-[#262626] select-none shadow-2xl">
      {/* Brand Header */}
      <div className="h-20 px-5 py-4 flex items-center border-b border-[#262626] gap-3.5">
        <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-[#0062FF]/25 shrink-0 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="KAMZO Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white text-lg tracking-tight">
              KAM<span className="text-[#0062FF]">ZO</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/40">
              Admin
            </span>
          </div>
          <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">
            SERVICES HUB
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase flex items-center justify-between">
          <span>Platform Control</span>
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href.split("?")[0]);
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#0062FF] text-white shadow-lg shadow-blue-600/30 font-semibold"
                  : "text-gray-300 hover:bg-[#202020] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-blue-400"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="w-4 h-4 text-blue-200/80" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Link to Customer Website */}
      <div className="px-3 py-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-blue-950/40 text-blue-300 border border-blue-800/40 hover:bg-blue-900/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Customer Site</span>
          </div>
          <span className="text-[10px] bg-[#0062FF] px-1.5 py-0.5 rounded text-white font-bold">Live</span>
        </Link>
      </div>

      {/* Admin Profile & Status */}
      <div className="p-3 border-t border-[#262626] space-y-2 bg-[#171717]">
        <div className="bg-[#202020] rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-8 h-8 rounded-full bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-300 font-semibold text-xs shrink-0">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#0062FF] ring-2 ring-[#202020]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                Super Admin
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                admin@kamzo.pk
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Sign Out / Log In</span>
        </button>
      </div>
    </aside>
  );
}
