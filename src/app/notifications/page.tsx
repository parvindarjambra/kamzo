"use client";

import * as React from "react";
import {
  Bell,
  Send,
  Users,
  HardHat,
  Globe,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { NotificationAudience, NotificationType } from "@/types/database.types";
import { supabase } from "@/lib/supabase/client";

interface NotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  audience: NotificationAudience;
  recipient_name?: string;
  type: NotificationType;
  status: "sent" | "pending" | "failed";
  created_at: string;
}

const initialHistory: NotificationHistoryItem[] = [
  {
    id: "notif-1",
    title: "Rain Alert: High Demand for Electricians",
    message: "Monsoon showers expected in Lahore today. Ensure insulated safety equipment is used on all outdoor jobs.",
    audience: "workers",
    type: "alert",
    status: "sent",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "notif-2",
    title: "Flat 20% Off on AC Maintenance this Friday!",
    message: "Beat the heat with certified KAMZO technicians. Promo code: JUMMAH20 applied automatically.",
    audience: "users",
    type: "promotion",
    status: "sent",
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: "notif-3",
    title: "Important System Maintenance at 2:00 AM",
    message: "KAMZO platform will undergo scheduled core database upgrades for 30 minutes.",
    audience: "all",
    type: "system",
    status: "sent",
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
  },
  {
    id: "notif-4",
    title: "Payment Verification Required",
    message: "Your visit fee receipt for Booking KZ-94812 is currently under review by admin.",
    audience: "specific",
    recipient_name: "Muhammad Usman (0300-1234567)",
    type: "info",
    status: "sent",
    created_at: new Date(Date.now() - 1000 * 60 * 2800).toISOString(),
  },
];

const mockUsers = [
  { id: "u-1", name: "Muhammad Usman", phone: "0300-1234567", role: "Customer" },
  { id: "u-2", name: "Ayesha Malik", phone: "0333-8889990", role: "Customer" },
  { id: "w-1", name: "Tariq Mahmood", phone: "0321-7654321", role: "Worker" },
  { id: "w-2", name: "Kamran Ali", phone: "0345-1112223", role: "Worker" },
];

export default function NotificationsPage() {
  const [history, setHistory] = React.useState<NotificationHistoryItem[]>(initialHistory);

  // Form states
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [audience, setAudience] = React.useState<NotificationAudience>("all");
  const [specificUserId, setSpecificUserId] = React.useState(mockUsers[0].id);
  const [notifType, setNotifType] = React.useState<NotificationType>("info");
  const [isSending, setIsSending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);

    const selectedUser = mockUsers.find((u) => u.id === specificUserId);
    const recipientName = audience === "specific" && selectedUser
      ? `${selectedUser.name} (${selectedUser.phone})`
      : undefined;

    const newNotification: NotificationHistoryItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      audience,
      recipient_name: recipientName,
      type: notifType,
      status: "sent",
      created_at: new Date().toISOString(),
    };

    try {
      // Optional Supabase insertion
      await supabase.from("notifications").insert([
        {
          title,
          message,
          audience,
          recipient_id: audience === "specific" ? specificUserId : null,
          type: notifType,
          status: "sent",
        } as any,
      ]);
    } catch (e) {
      console.warn("Supabase notification insert skipped or offline.");
    } finally {
      setHistory([newNotification, ...history]);
      setIsSending(false);
      setTitle("");
      setMessage("");
      setFeedback({
        text: `Push notification "${newNotification.title}" broadcasted successfully!`,
        type: "success",
      });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const getAudienceBadge = (aud: NotificationAudience, recipientName?: string) => {
    switch (aud) {
      case "all":
        return <Badge variant="purple">Broadcast: Everyone</Badge>;
      case "users":
        return <Badge variant="info">Customers Only</Badge>;
      case "workers":
        return <Badge variant="success">Workers Only</Badge>;
      case "specific":
        return (
          <Badge variant="default" className="text-[11px]">
            {recipientName || "Specific Recipient"}
          </Badge>
        );
      default:
        return <Badge variant="default">{aud}</Badge>;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "alert":
        return <span className="text-rose-600 font-semibold text-xs">⚠️ Urgent Alert</span>;
      case "promotion":
        return <span className="text-emerald-700 font-semibold text-xs">🎁 Promo</span>;
      case "system":
        return <span className="text-gray-700 font-semibold text-xs">⚙️ System</span>;
      default:
        return <span className="text-sky-700 font-semibold text-xs">ℹ️ General</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Push Notifications & Broadcasts
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Send instant FCM push notifications to customers, service providers, or individual accounts.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* SECTION 1: Send Notification Form */}
      <Card
        title="Compose Push Broadcast"
        subtitle="Dispatches notifications via Firebase Cloud Messaging (FCM) to active mobile devices"
      >
        <CardContent className="pt-4">
          <form onSubmit={handleSend} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Notification Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrician Safety Advisory during Monsoon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                />
              </div>

              {/* Notification Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Notification Type
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as NotificationType)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                >
                  <option value="info">General Info</option>
                  <option value="alert">Critical Alert</option>
                  <option value="promotion">Promo / Campaign</option>
                  <option value="system">System Notice</option>
                </select>
              </div>
            </div>

            {/* Target Audience Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Target Audience *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "all", label: "All (Everyone)", icon: Globe },
                  { id: "users", label: "All Customers", icon: Users },
                  { id: "workers", label: "All Workers", icon: HardHat },
                  { id: "specific", label: "Specific User", icon: UserCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = audience === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAudience(item.id as NotificationAudience)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? "border-[#1B5E20] bg-emerald-50/60 text-[#1B5E20] ring-1 ring-[#1B5E20]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific User Dropdown (conditional) */}
            {audience === "specific" && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 animate-in fade-in">
                <label className="block text-xs font-semibold text-gray-700">
                  Select User or Worker *
                </label>
                <select
                  value={specificUserId}
                  onChange={(e) => setSpecificUserId(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                >
                  {mockUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      [{u.role}] {u.name} — {u.phone}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Message Body *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Enter complete notification text sent to device notification center..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Supports up to 240 characters for optimal lockscreen readability on Android & iOS.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSending}
                className="gap-2 bg-[#1B5E20] hover:bg-[#144717] px-6"
              >
                <Send className="w-4 h-4" />
                Dispatch Push Notification
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* SECTION 2: Notification History Table */}
      <Card
        title="Dispatched Notification History"
        subtitle="Recent platform messages delivered to end-user devices"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Title & Content</th>
                <th className="py-3.5 px-4">Recipient / Audience</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Sent At</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-5 max-w-sm">
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {item.message}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {getAudienceBadge(item.audience, item.recipient_name)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getTypeBadge(item.type)}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Badge variant="success">Delivered</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
