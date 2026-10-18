import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const phone = url.searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Customer phone is required." },
        { status: 400 }
      );
    }

    // 1. Get from server store
    const storeBookings = serverStore.getCustomerBookings(phone);

    // 2. Also attempt to fetch from Supabase
    let remoteBookings: any[] = [];
    try {
      const supabase = createAdminServerClient();
      const cleanPhone = phone.trim().replace(/[\s-]/g, "");
      const { data } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_number,
          problem_description,
          service_address,
          status,
          visit_fee,
          final_amount,
          created_at,
          service:service_id(name),
          customer:customer_id(full_name, phone)
        `)
        .ilike("customer.phone", `%${cleanPhone.slice(-9)}%`)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        remoteBookings = data.map((b: any) => ({
          id: b.id,
          booking_number: b.booking_number,
          customer_name: b.customer?.full_name || "Customer",
          customer_phone: b.customer?.phone || cleanPhone,
          service_id: "",
          service_name: b.service?.name || "Marketplace Service",
          city: b.service_address || "Pakistan",
          problem: b.problem_description || "Inspection",
          visit_fee: Number(b.visit_fee) || 0,
          payment_method: "jazzcash",
          status: b.status,
          created_at: b.created_at,
        }));
      }
    } catch (_) {
      // Offline fallback
    }

    // Merge without duplicates
    const combined = [...storeBookings];
    remoteBookings.forEach((rb) => {
      if (!combined.some((b) => b.booking_number === rb.booking_number)) {
        combined.push(rb);
      }
    });

    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      bookings: combined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch customer bookings." },
      { status: 500 }
    );
  }
}
