import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminAuthCookie = request.cookies.get("kamzo_admin_auth")?.value;

  // If already authenticated and visiting /login, redirect straight to /admin
  if (pathname === "/login" && adminAuthCookie === "true") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

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
    "/login",
    "/admin",
    "/admin/:path*",
    "/payments",
    "/payments/:path*",
    "/commissions",
    "/commissions/:path*",
    "/bonuses",
    "/bonuses/:path*",
    "/notifications",
    "/notifications/:path*",
    "/users",
    "/users/:path*",
    "/workers",
    "/workers/:path*",
    "/settings",
    "/settings/:path*",
  ],
};
