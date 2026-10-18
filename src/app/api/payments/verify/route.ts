import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";
import { notifyCustomerOnPaymentDecision } from "@/lib/notification-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, action, rejectionReason } = body;

    if (!paymentId || !action) {
      return NextResponse.json(
        { success: false, error: "paymentId and action ('verify' | 'reject') are required." },
        { status: 400 }
      );
    }

    const newStatus = action === "verify" ? "verified" : "rejected";
    const updated = serverStore.updatePaymentStatus(paymentId, newStatus, rejectionReason);

    // Dispatch Gmail notification & WhatsApp message to customer
    let customerWhatsAppUrl = "";
    if (updated) {
      const booking = serverStore.getBookings().find((b) => b.booking_number === updated.booking_number);
      if (booking) {
        const customer = serverStore.findCustomer(booking.customer_phone);
        try {
          const notifyResult = await notifyCustomerOnPaymentDecision({
            booking,
            isVerified: newStatus === "verified",
            rejectionReason,
            customerEmail: customer?.email,
          });
          customerWhatsAppUrl = notifyResult.customerWhatsAppUrl;
        } catch (e) {
          console.warn("Customer notification dispatch skipped:", e);
        }
      }
    }

    // Sync to Supabase
    try {
      const supabase = createAdminServerClient();
      await supabase
        .from("payments")
        .update({
          status: newStatus,
          verified_at: newStatus === "verified" ? new Date().toISOString() : null,
          rejection_reason: rejectionReason || null,
        } as any)
        .eq("id", paymentId);
    } catch (_) {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      payment: updated,
      customerWhatsAppUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update payment" },
      { status: 500 }
    );
  }
}
