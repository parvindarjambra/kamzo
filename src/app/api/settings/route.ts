import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = serverStore.getSettings();

    // Also attempt to read from Supabase if available
    try {
      const supabase = createAdminServerClient();
      const { data, error } = await supabase.from("admin_settings").select("key, value");
      if (!error && data && data.length > 0) {
        data.forEach((row: { key: string; value: string }) => {
          if (row.key === "visit_fee") {
            const parsed = Number(row.value);
            if (!isNaN(parsed)) settings.visit_fee = parsed;
          } else if (row.key === "commission_rate") {
            const parsed = Number(row.value);
            if (!isNaN(parsed)) settings.commission_rate = parsed;
          } else if (row.key === "payment_accounts") {
            try {
              settings.payment_accounts = JSON.parse(row.value);
            } catch (_) {}
          }
        });
        serverStore.updateSettings(settings);
      }
    } catch (_) {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to get settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = serverStore.updateSettings(body);

    // Sync to Supabase
    try {
      const supabase = createAdminServerClient();
      if (body.visit_fee !== undefined) {
        await supabase.from("admin_settings").upsert(
          {
            key: "visit_fee",
            value: body.visit_fee.toString(),
            description: "Standard visit fee charged to customers",
          } as any,
          { onConflict: "key" }
        );
      }
      if (body.commission_rate !== undefined) {
        await supabase.from("admin_settings").upsert(
          {
            key: "commission_rate",
            value: body.commission_rate.toString(),
            description: "Platform commission rate",
          } as any,
          { onConflict: "key" }
        );
      }
      if (body.payment_accounts) {
        await supabase.from("admin_settings").upsert(
          {
            key: "payment_accounts",
            value: JSON.stringify(body.payment_accounts),
            description: "Deposit credentials shown to users",
          } as any,
          { onConflict: "key" }
        );
      }
    } catch (_) {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
