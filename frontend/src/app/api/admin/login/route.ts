import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {username, password, remember} = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        {error: "Username and password are required."},
        {status: 400},
      );
    }

    const backendUrl = (process.env.BACKEND_URL || "http://localhost:8000").replace(
      /\/+$/,
      "",
    );

    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    const res = await fetch(`${backendUrl}/api/admin/login`, {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: form,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      const detail = errData?.detail || "Invalid username or password.";
      return NextResponse.json({error: detail}, {status: res.status});
    }

    const data = await res.json();
    const response = NextResponse.json({ok: true});

    // 7 days if remember me is checked, otherwise 24 hours
    const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24;

    const isLocalhost =
      req.nextUrl.hostname === "localhost" ||
      req.nextUrl.hostname === "127.0.0.1";

    response.cookies.set("admin_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && !isLocalhost,
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      {error: "Unable to connect to authentication server. Please try again."},
      {status: 500},
    );
  }
}
