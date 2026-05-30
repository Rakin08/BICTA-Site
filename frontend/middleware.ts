import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("bicta_admin");
    if (!session?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("reason", "admin");
      return NextResponse.redirect(url);
    }
  }

  // Protect /competition/exam
  if (pathname.startsWith("/competition/exam")) {
    const session =
      request.cookies.get("bicta_session") ||
      request.cookies.get("bicta_admin");
    if (!session?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/competition/exam/:path*"],
};
