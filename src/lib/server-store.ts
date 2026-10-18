/**
 * Central in-memory + Supabase server store for KAMZO Pakistan marketplace.
 * Keeps settings, bookings, payments, workers, and live notifications synchronized
 * across all client devices (laptops, phones) in real time.
 */

import { createAdminServerClient } from "@/lib/supabase/server";

export interface StoredBooking {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  service_name: string;
  city: string;
  problem: string;
  visit_fee: number;
  payment_method: string;
  transaction_reference?: string;
  status: "submitted" | "payment_pending" | "verified" | "accepted" | "in_progress" | "completed" | "cancelled" | "rejected";
  created_at: string;
}

export interface StoredPayment {
  id: string;
  booking_id: string;
  booking_number: string;
  payer_name: string;
  payer_phone: string;
  amount: number;
  payment_method: "jazzcash" | "easypaisa" | "bank_transfer" | "cash";
  reference_number: string;
  status: "submitted" | "verified" | "rejected";
  proof_url: string;
  rejection_reason?: string | null;
  type: "visit_fee" | "commission";
  created_at: string;
}

export interface StoredWorker {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  city: string;
  area: string;
  work_address?: string;
  categories: string[];
  experience_years: number;
  skills?: string;
  work_type?: string;
  cnic: string;
  payout_method: string;
  payout_account: string;
  status: "pending" | "verified" | "suspended";
  created_at: string;
}

export interface StoredNotification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "worker" | "system";
  is_read: boolean;
  created_at: string;
  data?: any;
}

export interface PlatformSettings {
  visit_fee: number;
  commission_rate: number;
  payment_accounts: {
    jazzcashNumber: string;
    jazzcashTitle: string;
    easypaisaNumber: string;
    easypaisaTitle: string;
    bankName: string;
    bankTitle: string;
    bankIban: string;
  };
  worker_levels?: any[];
}

// Global in-memory cache to persist across requests in the Node.js runtime
declare global {
  var __KAMZO_SETTINGS: PlatformSettings | undefined;
  var __KAMZO_BOOKINGS: StoredBooking[] | undefined;
  var __KAMZO_PAYMENTS: StoredPayment[] | undefined;
  var __KAMZO_WORKERS: StoredWorker[] | undefined;
  var __KAMZO_NOTIFICATIONS: StoredNotification[] | undefined;
}

if (!global.__KAMZO_SETTINGS) {
  global.__KAMZO_SETTINGS = {
    visit_fee: 200,
    commission_rate: 10,
    payment_accounts: {
      jazzcashNumber: "0319 7318425",
      jazzcashTitle: "KAMZO Services / Parvindar",
      easypaisaNumber: "0319 7318425",
      easypaisaTitle: "KAMZO Services / Parvindar",
      bankName: "Allied Bank / Meezan Bank",
      bankTitle: "KAMZO Marketplace",
      bankIban: "PK36MEZN0001234567890123",
    },
  };
}

if (!global.__KAMZO_BOOKINGS) {
  global.__KAMZO_BOOKINGS = [];
}

if (!global.__KAMZO_PAYMENTS) {
  global.__KAMZO_PAYMENTS = [];
}

if (!global.__KAMZO_WORKERS) {
  global.__KAMZO_WORKERS = [];
}

if (!global.__KAMZO_NOTIFICATIONS) {
  global.__KAMZO_NOTIFICATIONS = [];
}

export const serverStore = {
  // Settings
  getSettings(): PlatformSettings {
    return global.__KAMZO_SETTINGS!;
  },

  updateSettings(partial: Partial<PlatformSettings>): PlatformSettings {
    global.__KAMZO_SETTINGS = {
      ...global.__KAMZO_SETTINGS!,
      ...partial,
    };
    return global.__KAMZO_SETTINGS;
  },

  // Bookings
  getBookings(): StoredBooking[] {
    return global.__KAMZO_BOOKINGS || [];
  },

  addBooking(booking: Omit<StoredBooking, "id" | "created_at">): StoredBooking {
    const newBooking: StoredBooking = {
      ...booking,
      id: "bkg_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
    };
    global.__KAMZO_BOOKINGS!.unshift(newBooking);
    return newBooking;
  },

  // Payments
  getPayments(): StoredPayment[] {
    return global.__KAMZO_PAYMENTS || [];
  },

  addPayment(payment: Omit<StoredPayment, "id" | "created_at">): StoredPayment {
    const newPayment: StoredPayment = {
      ...payment,
      id: "pay_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
    };
    global.__KAMZO_PAYMENTS!.unshift(newPayment);
    return newPayment;
  },

  updatePaymentStatus(id: string, status: "verified" | "rejected", reason?: string): StoredPayment | null {
    const p = global.__KAMZO_PAYMENTS!.find((item) => item.id === id);
    if (p) {
      p.status = status;
      if (reason) p.rejection_reason = reason;
      // Also update linked booking if any
      const b = global.__KAMZO_BOOKINGS!.find((item) => item.booking_number === p.booking_number);
      if (b) {
        b.status = status === "verified" ? "verified" : "rejected";
      }
      return p;
    }
    return null;
  },

  // Workers
  getWorkers(): StoredWorker[] {
    return global.__KAMZO_WORKERS || [];
  },

  addWorker(worker: Omit<StoredWorker, "id" | "created_at">): StoredWorker {
    const newWorker: StoredWorker = {
      ...worker,
      id: "wrk_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
    };
    global.__KAMZO_WORKERS!.unshift(newWorker);
    return newWorker;
  },

  updateWorkerStatus(id: string, status: "verified" | "suspended" | "pending"): StoredWorker | null {
    const w = global.__KAMZO_WORKERS!.find((item) => item.id === id);
    if (w) {
      w.status = status;
      return w;
    }
    return null;
  },

  // Notifications
  getNotifications(): StoredNotification[] {
    return global.__KAMZO_NOTIFICATIONS || [];
  },

  addNotification(title: string, message: string, type: StoredNotification["type"] = "booking", data?: any): StoredNotification {
    const notif: StoredNotification = {
      id: "notif_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString(),
      data,
    };
    global.__KAMZO_NOTIFICATIONS!.unshift(notif);
    // Keep max 50 recent notifications
    if (global.__KAMZO_NOTIFICATIONS!.length > 50) {
      global.__KAMZO_NOTIFICATIONS = global.__KAMZO_NOTIFICATIONS!.slice(0, 50);
    }
    return notif;
  },

  markNotificationsRead(): void {
    if (global.__KAMZO_NOTIFICATIONS) {
      global.__KAMZO_NOTIFICATIONS.forEach((n) => (n.is_read = true));
    }
  },
};
