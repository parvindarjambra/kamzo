import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#16A34A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "KAMZO | Pakistan's Trusted Local Service Marketplace (آپ کی ضرورت، ہمارے ماہر)",
  description: "Connect with verified local mechanics, AC technicians, plumbers, and electricians across Pakistan. Fast, trustworthy, and transparent service.",
  manifest: "/manifest.json",
  applicationName: "KAMZO",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KAMZO",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/icon.png?v=2", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2" },
      { url: "/logo.png?v=2" },
    ],
    shortcut: ["/favicon.ico?v=2"],
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
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KAMZO" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('KAMZO PWA active:', reg.scope); },
                    function(err) { console.log('KAMZO PWA reg error:', err); }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
