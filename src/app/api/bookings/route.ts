import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";
import {
  notifyAdminOnNewBooking,
  buildCustomerInvoiceWhatsApp,
  sendEmail,
  ADMIN_CONFIG,
} from "@/lib/notification-service";

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
      customerWhatsApp,
      customerEmail,
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

    const cleanPhone = customerPhone.trim().replace(/[\s-]/g, "");
    const cleanWhatsApp = (customerWhatsApp || customerPhone).trim().replace(/[\s-]/g, "");
    const cleanEmail = (customerEmail || "").trim().toLowerCase();

    // 1. Save Booking in serverStore
    const newBooking = serverStore.addBooking({
      booking_number: bookingNumber,
      customer_name: customerName.trim(),
      customer_phone: cleanPhone,
      customer_whatsapp: cleanWhatsApp,
      customer_email: cleanEmail,
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
        payer_phone: cleanPhone,
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
        ? `${customerName} (Phone: ${cleanPhone}, WA: ${cleanWhatsApp}) booked ${serviceName} in ${city}. Amount: Rs. ${visitFee} (TID: ${transactionRef || "N/A"}).`
        : `${customerName} (Phone: ${cleanPhone}, WA: ${cleanWhatsApp}) booked free inspection for ${serviceName} in ${city}.`;

    serverStore.addNotification(notifTitle, notifBody, "booking", {
      booking_number: bookingNumber,
      customer_name: customerName,
      customer_phone: cleanPhone,
      customer_whatsapp: cleanWhatsApp,
      customer_email: cleanEmail,
      service_name: serviceName,
      amount: visitFee,
      transaction_ref: transactionRef,
    });

    // 4. Send Gmail to Admin (kundanpanriya978@gmail.com) & generate #KAMZO WhatsApp link
    let adminWhatsAppUrl = "";
    let customerWhatsAppInvoiceUrl = "";
    try {
      const notifyResult = await notifyAdminOnNewBooking(newBooking);
      adminWhatsAppUrl = notifyResult.adminWhatsAppUrl;
      customerWhatsAppInvoiceUrl = buildCustomerInvoiceWhatsApp(newBooking);

      if (cleanEmail) {
        await sendEmail({
          to: cleanEmail,
          subject: `[${ADMIN_CONFIG.tag}] Order Confirmed #${newBooking.booking_number} - ${newBooking.service_name}`,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #16A34A;">
              <h2 style="color: #16A34A; margin: 0; font-size: 24px;">KAMZO Pakistan Services</h2>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 13px;">Order Confirmation & Invoice</p>
            </div>
            <div style="padding: 20px 0; font-size: 14px; line-height: 1.6;">
              <p>Dear <strong>${newBooking.customer_name}</strong>,</p>
              <p>Thank you for choosing KAMZO! Your service order has been placed successfully.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr><td style="color:#64748b; padding:6px 0;">Order #:</td><td style="font-weight:bold; font-family:monospace;">${newBooking.booking_number}</td></tr>
                <tr><td style="color:#64748b; padding:6px 0;">Service:</td><td style="font-weight:bold;">${newBooking.service_name}</td></tr>
                <tr><td style="color:#64748b; padding:6px 0;">City:</td><td>${newBooking.city}</td></tr>
                <tr><td style="color:#64748b; padding:6px 0;">Visit Fee:</td><td style="font-weight:bold; color:#16A34A;">Rs. ${newBooking.visit_fee}</td></tr>
                <tr><td style="color:#64748b; padding:6px 0;">Status:</td><td style="font-weight:bold;">${newBooking.status === "accepted" ? "Verified & Confirmed" : "Under Admin Review"}</td></tr>
              </table>
            </div>
            <div style="text-align: center; padding-top: 15px; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #94a3b8;">Helpline: +92 319 7318425 (WhatsApp 24/7)</p>
            </div>
          </div>`,
          text: `KAMZO Order #${newBooking.booking_number} placed for ${newBooking.service_name} in ${newBooking.city}.`,
        });
      }
    } catch (e) {
      console.warn("Admin notification dispatch skipped:", e);
    }

    // 5. Background sync to Supabase if configured
    try {
      const supabase = createAdminServerClient();
      await supabase.from("bookings").insert({
        booking_number: bookingNumber,
        customer_id: "00000000-0000-0000-0000-000000000000",
        service_id: "00000000-0000-0000-0000-000000000000",
        problem_description: `${customerName} (${cleanPhone}) - ${problem}`,
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
      adminWhatsAppUrl,
      customerWhatsAppInvoiceUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
