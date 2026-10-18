import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = serverStore.getBookings();
    const payments = serverStore.getPayments();

    return NextResponse.json({
      success: true,
      bookings,
      payments,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      serviceId,
      serviceName,
      city,
      problem,
      visitFee = 0,
      paymentMethod = "free",
      transactionRef = "",
      proofUrl = "",
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    const bookingNumber =
      "KMZ-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const bookingStatus = Number(visitFee) === 0 ? "accepted" : "payment_pending";

    // 1. Save Booking in serverStore
    const newBooking = serverStore.addBooking({
      booking_number: bookingNumber,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      service_id: serviceId || "auto-mechanic",
      service_name: serviceName || "General Service",
      city: city || "Pakistan",
      problem: problem || "General inspection requested",
      visit_fee: Number(visitFee),
      payment_method: paymentMethod,
      transaction_reference: transactionRef,
      status: bookingStatus,
    });

    // 2. If Visit Fee > 0 or TID provided, save Payment record
    let newPayment = null;
    if (Number(visitFee) > 0 || transactionRef) {
      newPayment = serverStore.addPayment({
        booking_id: newBooking.id,
        booking_number: bookingNumber,
        payer_name: customerName.trim(),
        payer_phone: customerPhone.trim(),
        amount: Number(visitFee) || 0,
        payment_method: (paymentMethod as any) || "jazzcash",
        reference_number: transactionRef || "TID-PENDING",
        status: "submitted",
        proof_url: proofUrl,
        type: "visit_fee",
      });
    }

    // 3. Create Live Admin Notification
    const notifTitle =
      Number(visitFee) > 0
        ? `🔔 New Booking & Payment: ${serviceName}`
        : `🔔 New Free Inspection Booking: ${serviceName}`;

    const notifBody =
      Number(visitFee) > 0
        ? `${customerName} (${customerPhone}) booked ${serviceName} in ${city}. Amount: Rs. ${visitFee} (TID: ${transactionRef || "N/A"}).`
        : `${customerName} (${customerPhone}) booked free inspection for ${serviceName} in ${city}.`;

    serverStore.addNotification(notifTitle, notifBody, "booking", {
      booking_number: bookingNumber,
      customer_name: customerName,
      customer_phone: customerPhone,
      service_name: serviceName,
      amount: visitFee,
      transaction_ref: transactionRef,
    });

    // 4. Background sync to Supabase if configured
    try {
      const supabase = createAdminServerClient();
      // Try to insert booking
      await supabase.from("bookings").insert({
        booking_number: bookingNumber,
        customer_id: "00000000-0000-0000-0000-000000000000",
        service_id: "00000000-0000-0000-0000-000000000000",
        problem_description: `${customerName} (${customerPhone}) - ${problem}`,
        service_address: city,
        status: Number(visitFee) === 0 ? "accepted" : "payment_pending",
        visit_fee: Number(visitFee),
      } as any);

      if (newPayment) {
        await supabase.from("payments").insert({
          payer_id: "00000000-0000-0000-0000-000000000000",
          amount: Number(visitFee),
          payment_type: "visit_fee",
          payment_method: paymentMethod as any,
          reference_number: transactionRef,
          status: "submitted",
        } as any);
      }

      await supabase.from("notifications").insert({
        title: notifTitle,
        message: notifBody,
        audience: "all",
        type: "booking",
      } as any);
    } catch (_) {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      bookingNumber,
      booking: newBooking,
      payment: newPayment,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
