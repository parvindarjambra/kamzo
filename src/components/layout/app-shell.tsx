"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Public customer-facing routes where Admin sidebar and auth are NOT required
  const isPublicRoute = pathname === "/" || pathname === "/login";

  useEffect(() => {
    if (isPublicRoute) {
      setIsAuthenticated(true);
      return;
    }

    // Check if admin is authenticated via localStorage or cookie
    const hasLocalAuth =
      typeof window !== "undefined" &&
      localStorage.getItem("kamzo_admin_authenticated") === "true";
    const hasCookieAuth =
      typeof document !== "undefined" &&
      document.cookie.includes("kamzo_admin_auth=true");

    if (hasLocalAuth || hasCookieAuth) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.replace("/login");
    }
  }, [pathname, isPublicRoute, router]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  if (isPublicRoute) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  // If still checking authentication or not authenticated, render secure redirecting screen
  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen bg-[#070D1E] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0062FF] mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0062FF]" />
        </div>
        <h3 className="text-lg font-bold">Checking Admin Privileges...</h3>
        <p className="text-xs text-slate-400 mt-1">
          Authentication required. Redirecting to login...
        </p>
      </div>
    );
  }

  // Admin Dashboard routes with responsive sidebar and top header
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 antialiased flex flex-col lg:flex-row">
      {/* Responsive Left Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0 w-full">
        <Header onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
