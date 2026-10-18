import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = serverStore.getBookings();
    const payments = serverStore.getPayments();
    const workers = serverStore.getWorkers();
    const notifications = serverStore.getNotifications();
    const settings = serverStore.getSettings();

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      bookings,
      payments,
      workers,
      notifications,
      unreadCount,
      settings,
      serverTime: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load live feed" },
      { status: 500 }
    );
  }
}
