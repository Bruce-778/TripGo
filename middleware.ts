import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEV_COOKIE } from "./src/lib/devMode";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin pages + admin APIs so guests cannot access even if they know the URL.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isDev = req.cookies.get(DEV_COOKIE)?.value === "1";
    if (!isDev) {
      // Hide existence: rewrite to 404 page.
      const url = req.nextUrl.clone();
      url.pathname = "/_not-found";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};


