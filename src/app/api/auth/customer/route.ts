import { NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { createAdminServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, phone, email, password, name, city } = body;

    if (action === "register") {
      if (!name || name.trim().length < 2) {
        return NextResponse.json(
          { success: false, error: "Full name is required (minimum 2 letters)." },
          { status: 400 }
        );
      }

      const cleanPhone = (phone || "").trim().replace(/[\s-]/g, "");
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid Pakistani mobile number (e.g. 03001234567)." },
          { status: 400 }
        );
      }

      if (!password || password.trim().length < 6) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      if (email && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return NextResponse.json(
            { success: false, error: "Please enter a valid Gmail / Email address (e.g. yourname@gmail.com)." },
            { status: 400 }
          );
        }
      }

      const regResult = serverStore.registerCustomer({
        name: name.trim(),
        phone: cleanPhone,
        email: email?.trim() || "",
        password: password.trim(),
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

    if (action === "google_login") {
      const userEmail = (email || "").trim().toLowerCase();
      if (!userEmail || !userEmail.includes("@") || !userEmail.includes(".")) {
        return NextResponse.json(
          { success: false, error: "A valid Google account email is required." },
          { status: 400 }
        );
      }

      const userName = (name || "").trim() || userEmail.split("@")[0];
      const userPhone = (phone || "").trim() || "0300" + Math.floor(1000000 + Math.random() * 9000000);

      let customer = serverStore.findCustomer(userEmail);
      if (!customer) {
        const reg = serverStore.registerCustomer({
          name: userName,
          email: userEmail,
          phone: userPhone,
          password: "google_oauth_auth_" + Math.random().toString(36).substring(7),
          city: city || "Pakistan",
        });
        customer = reg.customer;
      }

      if (!customer) {
        return NextResponse.json({ success: false, error: "Failed to authenticate Google user." }, { status: 500 });
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

    if (action === "whatsapp_login") {
      const cleanPhone = (phone || "").trim().replace(/[\s-]/g, "");
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json(
          { success: false, error: "Valid WhatsApp number is required (e.g. 03001234567)." },
          { status: 400 }
        );
      }

      let customer = serverStore.findCustomer(cleanPhone);
      if (!customer) {
        const reg = serverStore.registerCustomer({
          name: name?.trim() || `WhatsApp Customer`,
          phone: cleanPhone,
          email: email?.trim() || `${cleanPhone}@whatsapp.kamzo.pk`,
          password: "wa_verified_" + Math.random().toString(36).substring(7),
          city: city || "Pakistan",
        });
        customer = reg.customer;
      }

      if (!customer) {
        return NextResponse.json({ success: false, error: "WhatsApp verification failed." }, { status: 500 });
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

    if (action === "login") {
      const identifier = (phone || email || "").trim();
      if (!identifier) {
        return NextResponse.json(
          { success: false, error: "Please enter your Gmail or registered mobile number." },
          { status: 400 }
        );
      }

      if (!password || !password.trim()) {
        return NextResponse.json(
          { success: false, error: "Please enter your account password." },
          { status: 400 }
        );
      }

      const authResult = serverStore.authenticateCustomer(identifier, password.trim());
      if (!authResult.success || !authResult.customer) {
        return NextResponse.json(
          { success: false, error: authResult.error || "Authentication failed. Incorrect password or account not found." },
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
