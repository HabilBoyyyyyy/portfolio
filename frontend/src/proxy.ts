import {NextRequest, NextResponse} from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  // Unauthenticated user attempting to access admin dashboard -> redirect to /admin/login
  if (!token && !isLoginPage) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated user visiting /admin/login -> redirect to /admin
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
