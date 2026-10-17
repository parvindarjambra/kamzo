import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Admin Routes
  const protectedRoutes = [
    "/admin",
    "/payments",
    "/commissions",
    "/bonuses",
    "/notifications",
    "/users",
    "/workers",
    "/settings",
  ];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    const adminAuthCookie = request.cookies.get("kamzo_admin_auth")?.value;

    // If not authenticated, redirect directly to /login
    if (adminAuthCookie !== "true") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/payments/:path*",
    "/commissions/:path*",
    "/bonuses/:path*",
    "/notifications/:path*",
    "/users/:path*",
    "/workers/:path*",
    "/settings/:path*",
  ],
};
