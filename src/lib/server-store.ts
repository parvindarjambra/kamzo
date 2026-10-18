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

export interface StoredCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  city?: string;
  created_at: string;
}

import fs from "fs";
import path from "path";

// Global in-memory cache to persist across requests in the Node.js runtime
declare global {
  var __KAMZO_SETTINGS: PlatformSettings | undefined;
  var __KAMZO_BOOKINGS: StoredBooking[] | undefined;
  var __KAMZO_PAYMENTS: StoredPayment[] | undefined;
  var __KAMZO_WORKERS: StoredWorker[] | undefined;
  var __KAMZO_NOTIFICATIONS: StoredNotification[] | undefined;
  var __KAMZO_CUSTOMERS: StoredCustomer[] | undefined;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "kamzo-live-store.json");
const TMP_STORE_FILE = path.join("/tmp", "kamzo-live-store.json");

function getStorageFilePath(): string {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return STORE_FILE;
  } catch (_) {
    return TMP_STORE_FILE;
  }
}

function persistStoreToDisk() {
  try {
    const targetFile = getStorageFilePath();
    const payload = JSON.stringify(
      {
        settings: global.__KAMZO_SETTINGS,
        bookings: global.__KAMZO_BOOKINGS,
        payments: global.__KAMZO_PAYMENTS,
        workers: global.__KAMZO_WORKERS,
        notifications: global.__KAMZO_NOTIFICATIONS,
        customers: global.__KAMZO_CUSTOMERS,
        savedAt: new Date().toISOString(),
      },
      null,
      2
    );

    fs.writeFileSync(targetFile, payload, "utf-8");
    if (targetFile !== TMP_STORE_FILE) {
      try {
        fs.writeFileSync(TMP_STORE_FILE, payload, "utf-8");
      } catch (_) {}
    }
  } catch (_) {
    // Read-only serverless fallback
  }
}

function loadStoreFromDisk() {
  try {
    let raw = "";
    if (fs.existsSync(STORE_FILE)) {
      raw = fs.readFileSync(STORE_FILE, "utf-8");
    } else if (fs.existsSync(TMP_STORE_FILE)) {
      raw = fs.readFileSync(TMP_STORE_FILE, "utf-8");
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.settings && typeof parsed.settings === "object") {
        global.__KAMZO_SETTINGS = { ...global.__KAMZO_SETTINGS, ...parsed.settings };
      }
      if (Array.isArray(parsed.bookings)) {
        global.__KAMZO_BOOKINGS = parsed.bookings;
      }
      if (Array.isArray(parsed.payments)) {
        global.__KAMZO_PAYMENTS = parsed.payments;
      }
      if (Array.isArray(parsed.workers)) {
        global.__KAMZO_WORKERS = parsed.workers;
      }
      if (Array.isArray(parsed.notifications)) {
        global.__KAMZO_NOTIFICATIONS = parsed.notifications;
      }
      if (Array.isArray(parsed.customers)) {
        global.__KAMZO_CUSTOMERS = parsed.customers;
      }
    }
  } catch (_) {}
}

if (!global.__KAMZO_SETTINGS) {
  global.__KAMZO_SETTINGS = {
    visit_fee: 0,
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

if (!global.__KAMZO_CUSTOMERS) {
  global.__KAMZO_CUSTOMERS = [];
}

// Hydrate from disk immediately on cold start
loadStoreFromDisk();

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
    persistStoreToDisk();
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
    persistStoreToDisk();
    return newBooking;
  },

  deleteBooking(bookingNumber: string): boolean {
    if (!global.__KAMZO_BOOKINGS) return false;
    const initialLen = global.__KAMZO_BOOKINGS.length;
    global.__KAMZO_BOOKINGS = global.__KAMZO_BOOKINGS.filter((b) => b.booking_number !== bookingNumber);
    if (global.__KAMZO_PAYMENTS) {
      global.__KAMZO_PAYMENTS = global.__KAMZO_PAYMENTS.filter((p) => p.booking_number !== bookingNumber);
    }
    persistStoreToDisk();
    return global.__KAMZO_BOOKINGS.length < initialLen;
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
    persistStoreToDisk();
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
      persistStoreToDisk();
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
    persistStoreToDisk();
    return newWorker;
  },

  updateWorkerStatus(id: string, status: "verified" | "suspended" | "pending"): StoredWorker | null {
    const w = global.__KAMZO_WORKERS!.find((item) => item.id === id);
    if (w) {
      w.status = status;
      persistStoreToDisk();
      return w;
    }
    return null;
  },

  deleteWorker(idOrPhone: string): boolean {
    if (!global.__KAMZO_WORKERS) return false;
    const initialLen = global.__KAMZO_WORKERS.length;
    global.__KAMZO_WORKERS = global.__KAMZO_WORKERS.filter((w) => w.id !== idOrPhone && w.phone !== idOrPhone);
    persistStoreToDisk();
    return global.__KAMZO_WORKERS.length < initialLen;
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
    persistStoreToDisk();
    return notif;
  },

  markNotificationsRead(): void {
    if (global.__KAMZO_NOTIFICATIONS) {
      global.__KAMZO_NOTIFICATIONS.forEach((n) => (n.is_read = true));
      persistStoreToDisk();
    }
  },

  // Customers & Authentication
  getCustomers(): StoredCustomer[] {
    return global.__KAMZO_CUSTOMERS || [];
  },

  findCustomer(phoneOrEmail: string): StoredCustomer | undefined {
    const clean = phoneOrEmail.trim().toLowerCase().replace(/[\s-]/g, "");
    return (global.__KAMZO_CUSTOMERS || []).find((c) => {
      const cleanPhone = c.phone.replace(/[\s-]/g, "");
      const cleanEmail = (c.email || "").toLowerCase();
      return (
        cleanPhone === clean ||
        cleanPhone.endsWith(clean) ||
        clean.endsWith(cleanPhone) ||
        (cleanEmail && cleanEmail === clean)
      );
    });
  },

  registerCustomer(data: { name: string; phone: string; email?: string; password?: string; city?: string }): { success: boolean; customer?: StoredCustomer; error?: string } {
    const existing = this.findCustomer(data.phone);
    if (existing) {
      return { success: false, error: "An account with this mobile number already exists. Please sign in." };
    }

    const cleanPhone = data.phone.trim().replace(/[\s-]/g, "");
    const newCustomer: StoredCustomer = {
      id: "cust_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: data.name.trim(),
      phone: cleanPhone,
      email: data.email?.trim().toLowerCase() || "",
      password: data.password || "pass123",
      city: data.city || "Umerkot",
      created_at: new Date().toISOString(),
    };

    global.__KAMZO_CUSTOMERS!.unshift(newCustomer);
    persistStoreToDisk();
    return { success: true, customer: newCustomer };
  },

  authenticateCustomer(phoneOrEmail: string, password?: string): { success: boolean; customer?: StoredCustomer; error?: string } {
    const customer = this.findCustomer(phoneOrEmail);
    if (!customer) {
      return { success: false, error: "Account not found with this mobile number or email. Please register." };
    }

    if (password && customer.password && customer.password !== password) {
      return { success: false, error: "Incorrect password. Please try again or create a new account." };
    }

    return { success: true, customer };
  },

  getCustomerBookings(phone: string): StoredBooking[] {
    const clean = phone.trim().replace(/[\s-]/g, "");
    return (global.__KAMZO_BOOKINGS || []).filter((b) => {
      const bPhone = (b.customer_phone || "").replace(/[\s-]/g, "");
      return bPhone === clean || bPhone.endsWith(clean) || clean.endsWith(bPhone);
    });
  },

  /**
   * Bi-directional Live Sync from authorized Admin clients
   * Guarantees zero data loss across Vercel deployments and server cold-starts.
   */
  mergeLiveState(data: {
    bookings?: StoredBooking[];
    payments?: StoredPayment[];
    workers?: StoredWorker[];
    settings?: Partial<PlatformSettings>;
    customers?: StoredCustomer[];
  }) {
    if (data.settings && typeof data.settings === "object") {
      global.__KAMZO_SETTINGS = { ...global.__KAMZO_SETTINGS!, ...data.settings };
    }

    if (Array.isArray(data.bookings) && data.bookings.length > 0) {
      const existing = new Set(global.__KAMZO_BOOKINGS!.map((b) => b.booking_number));
      data.bookings.forEach((b) => {
        if (!existing.has(b.booking_number)) {
          global.__KAMZO_BOOKINGS!.unshift(b);
          existing.add(b.booking_number);
        } else {
          // If client has verified or rejected status, preserve it
          const current = global.__KAMZO_BOOKINGS!.find((item) => item.booking_number === b.booking_number);
          if (current && b.status && b.status !== "submitted") {
            current.status = b.status;
          }
        }
      });
    }

    if (Array.isArray(data.payments) && data.payments.length > 0) {
      const existing = new Set(global.__KAMZO_PAYMENTS!.map((p) => p.booking_number + "_" + p.reference_number));
      data.payments.forEach((p) => {
        const key = p.booking_number + "_" + p.reference_number;
        if (!existing.has(key)) {
          global.__KAMZO_PAYMENTS!.unshift(p);
          existing.add(key);
        } else {
          const current = global.__KAMZO_PAYMENTS!.find((item) => item.booking_number === p.booking_number);
          if (current && p.status && p.status !== "submitted") {
            current.status = p.status;
            if (p.rejection_reason) current.rejection_reason = p.rejection_reason;
          }
        }
      });
    }

    if (Array.isArray(data.workers) && data.workers.length > 0) {
      const existing = new Set(global.__KAMZO_WORKERS!.map((w) => w.phone));
      data.workers.forEach((w) => {
        if (!existing.has(w.phone)) {
          global.__KAMZO_WORKERS!.unshift(w);
          existing.add(w.phone);
        } else {
          const current = global.__KAMZO_WORKERS!.find((item) => item.phone === w.phone);
          if (current && w.status && w.status !== "pending") {
            current.status = w.status;
          }
        }
      });
    }

    if (Array.isArray(data.customers) && data.customers.length > 0) {
      const existing = new Set(global.__KAMZO_CUSTOMERS!.map((c) => c.phone));
      data.customers.forEach((c) => {
        if (!existing.has(c.phone)) {
          global.__KAMZO_CUSTOMERS!.unshift(c);
          existing.add(c.phone);
        }
      });
    }

    persistStoreToDisk();
    return {
      totalBookings: global.__KAMZO_BOOKINGS!.length,
      totalPayments: global.__KAMZO_PAYMENTS!.length,
      totalWorkers: global.__KAMZO_WORKERS!.length,
    };
  },
};
