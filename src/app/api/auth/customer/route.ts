import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, phone, email, password, name, city } = body;

    if (action === "register") {
      if (!name || !phone) {
        return NextResponse.json(
          { success: false, error: "Full name and mobile number are required." },
          { status: 400 }
        );
      }

      const regResult = serverStore.registerCustomer({
        name,
        phone,
        email: email || "",
        password: password || "pass123",
        city: city || "Umerkot",
      });

      if (!regResult.success || !regResult.customer) {
        return NextResponse.json(
          { success: false, error: regResult.error || "Failed to register" },
          { status: 400 }
        );
      }

      // Also register or sync in Supabase profiles table in background
      try {
        const supabase = createAdminServerClient();
        await supabase.from("profiles").upsert(
          {
            full_name: regResult.customer.name,
            phone: regResult.customer.phone,
            role: "customer",
            is_active: true,
          } as any,
          { onConflict: "phone" }
        );
      } catch (_) {
        // Offline fallback
      }

      const res = NextResponse.json({
        success: true,
        customer: {
          id: regResult.customer.id,
          name: regResult.customer.name,
          phone: regResult.customer.phone,
          email: regResult.customer.email,
          city: regResult.customer.city,
        },
      });

      // Set customer cookie
      res.cookies.set("kamzo_customer_phone", regResult.customer.phone, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });

      return res;
    }

    if (action === "login") {
      if (!phone) {
        return NextResponse.json(
          { success: false, error: "Please enter your mobile number or email." },
          { status: 400 }
        );
      }

      const authResult = serverStore.authenticateCustomer(phone, password);
      if (!authResult.success || !authResult.customer) {
        return NextResponse.json(
          { success: false, error: authResult.error || "Authentication failed" },
          { status: 401 }
        );
      }

      const res = NextResponse.json({
        success: true,
        customer: {
          id: authResult.customer.id,
          name: authResult.customer.name,
          phone: authResult.customer.phone,
          email: authResult.customer.email,
          city: authResult.customer.city,
        },
      });

      res.cookies.set("kamzo_customer_phone", authResult.customer.phone, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });

      return res;
    }

    // Fast OTP / Quick Mobile Verification (Like Daraz / Foodpanda quick SMS verification)
    if (action === "quick_phone_login") {
      if (!phone) {
        return NextResponse.json(
          { success: false, error: "Valid mobile number is required." },
          { status: 400 }
        );
      }

      let customer = serverStore.findCustomer(phone);
      if (!customer) {
        // Auto-create customer profile on first mobile login
        const autoReg = serverStore.registerCustomer({
          name: name?.trim() || `Customer (${phone.slice(-4)})`,
          phone,
          city: city || "Umerkot",
          password: password || "kamzo2026",
        });
        customer = autoReg.customer;
      }

      if (!customer) {
        return NextResponse.json(
          { success: false, error: "Could not create customer account." },
          { status: 500 }
        );
      }

      const res = NextResponse.json({
        success: true,
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          city: customer.city,
        },
      });

      res.cookies.set("kamzo_customer_phone", customer.phone, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });

      return res;
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Customer auth error." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const phone = url.searchParams.get("phone");

    if (phone) {
      const customer = serverStore.findCustomer(phone);
      if (customer) {
        return NextResponse.json({
          success: true,
          customer: {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            city: customer.city,
          },
        });
      }
    }

    return NextResponse.json({ success: false, error: "Not logged in" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to get profile" },
      { status: 500 }
    );
  }
}
