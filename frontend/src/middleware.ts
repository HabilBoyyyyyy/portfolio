import {NextRequest, NextResponse} from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
