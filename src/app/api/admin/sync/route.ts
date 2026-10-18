import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = serverStore.getBookings();
    const payments = serverStore.getPayments();
    const workers = serverStore.getWorkers();
    const settings = serverStore.getSettings();
    const notifications = serverStore.getNotifications();
    const customers = serverStore.getCustomers();

    return NextResponse.json({
      success: true,
      snapshot: {
        bookings,
        payments,
        workers,
        settings,
        notifications,
        customers,
        timestamp: Date.now(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch live sync snapshot" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookings, payments, workers, settings, customers } = body;

    const summary = serverStore.mergeLiveState({
      bookings,
      payments,
      workers,
      settings,
      customers,
    });

    return NextResponse.json({
      success: true,
      message: "Live state synchronized successfully.",
      summary,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync state" },
      { status: 500 }
    );
  }
}
