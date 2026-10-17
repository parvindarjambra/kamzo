"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Public customer-facing routes where Admin sidebar should NOT appear
  const isPublicRoute = pathname === "/" || pathname === "/login";

  if (isPublicRoute) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  // Admin Dashboard routes with sidebar and top header
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 antialiased flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
