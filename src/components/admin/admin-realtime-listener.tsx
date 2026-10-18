"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Bell, CreditCard, HardHat, CheckCircle2, X, ExternalLink, Volume2, VolumeX } from "lucide-react";

interface LiveToast {
  id: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "worker" | "system";
  link?: string;
  createdAt: number;
}

/**
 * Synthesizes a soft, pleasant 2-tone notification bell (D5 -> A5)
 * without requiring any external mp3 files.
 */
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // First tone (D5 - 587 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);

    // Second tone (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.7);
  } catch (_) {
    // Audio context may be restricted before first gesture
  }
}

export function AdminRealtimeListener() {
  const [toasts, setToasts] = useState<LiveToast[]>([]);
  const lastKnownIdRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef(true);

  // Ask for browser notification permission gently
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkLiveFeed() {
      try {
        const res = await fetch("/api/admin/live-feed", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.success || !isMounted) return;

        // Broadcast raw data so active pages can instantly re-render without reload
        window.dispatchEvent(new CustomEvent("kamzo:feedUpdate", { detail: data }));

        const notifications = data.notifications || [];
        if (notifications.length === 0) return;

        const latest = notifications[0];

        // On first mount, just record the latest ID without ringing
        if (isFirstLoadRef.current) {
          lastKnownIdRef.current = latest.id;
          isFirstLoadRef.current = false;
          return;
        }

        // If new notification has arrived
        if (latest.id !== lastKnownIdRef.current) {
          lastKnownIdRef.current = latest.id;

          // 1. Play audio chime
          playChime();

          // 2. Determine link
          const link = latest.type === "worker" ? "/workers" : "/payments";

          // 3. Show floating toast
          const newToast: LiveToast = {
            id: latest.id,
            title: latest.title,
            message: latest.message,
            type: latest.type || "booking",
            link,
            createdAt: Date.now(),
          };

          setToasts((prev) => [newToast, ...prev.slice(0, 3)]);

          // 4. Send native browser notification if granted
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try {
              new Notification(latest.title, {
                body: latest.message,
                icon: "/icon.png",
              });
            } catch (_) {}
          }
        }
      } catch (_) {
        // Network retry
      }
    }

    // Initial check
    checkLiveFeed();

    // Fast polling every 3 seconds for instant real-time delivery across all devices
    const interval = setInterval(checkLiveFeed, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Realtime Admin Notifications" className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-md animate-in slide-in-from-top-3 duration-300 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#16A34A] flex items-center justify-center shrink-0 border border-emerald-500/30">
            {toast.type === "worker" ? (
              <HardHat className="w-5 h-5 text-emerald-400" />
            ) : toast.type === "payment" ? (
              <CreditCard className="w-5 h-5 text-emerald-400" />
            ) : (
              <Bell className="w-5 h-5 text-emerald-400 animate-bounce" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-emerald-400 tracking-wide">{toast.title}</h4>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed line-clamp-3">{toast.message}</p>
            {toast.link && (
              <div className="mt-2.5 flex items-center gap-2">
                <Link
                  href={toast.link}
                  onClick={() => dismissToast(toast.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#16A34A] hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition-colors shadow-sm"
                >
                  <span>Open Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-[11px] text-slate-400 hover:text-white px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </aside>
  );
}
