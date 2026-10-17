import React from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAMZO | Pakistan's Trusted Local Service Marketplace (آپ کی ضرورت، ہمارے ماہر)",
  description: "Connect with verified local mechanics, AC technicians, plumbers, and electricians across Pakistan. Fast, trustworthy, and transparent service.",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta name="theme-color" content="#1B5E20" />
      </head>
      <body className="antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
