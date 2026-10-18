import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const workers = serverStore.getWorkers();
    return NextResponse.json({ success: true, workers });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch workers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      whatsapp = "",
      city = "",
      area = "",
      workAddress = "",
      categories = [],
      experience = 0,
      skills = "",
      workType = "both",
      cnic = "",
      payoutMethod = "easypaisa",
      payoutAccount = "",
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Worker full name and phone number are required." },
        { status: 400 }
      );
    }

    const newWorker = serverStore.addWorker({
      name: name.trim(),
      phone: phone.trim(),
      whatsapp,
      city,
      area,
      work_address: workAddress,
      categories: Array.isArray(categories) ? categories : [categories],
      experience_years: Number(experience) || 0,
      skills,
      work_type: workType,
      cnic,
      payout_method: payoutMethod,
      payout_account: payoutAccount,
      status: "pending",
    });

    const notifTitle = `👷 New Worker Registration: ${name}`;
    const notifBody = `${name} (${phone}) registered as ${categories.join(", ") || "Technician"} in ${city}. Pending admin review.`;

    serverStore.addNotification(notifTitle, notifBody, "worker", {
      worker_id: newWorker.id,
      name,
      phone,
      city,
      categories,
    });

    // Background sync to Supabase
    try {
      const supabase = createAdminServerClient();
      await supabase.from("notifications").insert({
        title: notifTitle,
        message: notifBody,
        audience: "all",
        type: "system",
      } as any);
    } catch (_) {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      worker: newWorker,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register worker" },
      { status: 500 }
    );
  }
}
