import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";

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
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update payment" },
      { status: 500 }
    );
  }
}
