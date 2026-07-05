import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasDevAccess = request.cookies.get("dev_access")?.value === "true";

  const allowedPaths =
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/api/dev-access") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (allowedPaths) {
    return NextResponse.next();
  }

  if (!hasDevAccess) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};