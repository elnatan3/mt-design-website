import { NextRequest, NextResponse } from "next/server";

const DEV_CODE = process.env.DEV_ACCESS_CODE;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAccess = request.cookies.get("dev_access")?.value === "true";

  if (
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/api/dev-access") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};