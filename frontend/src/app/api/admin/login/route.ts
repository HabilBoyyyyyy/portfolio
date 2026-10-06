import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  const {username, password} = await req.json();

  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await fetch(`${process.env.BACKEND_URL}/api/admin/login`, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: form,
  });

  if (!res.ok) {
    return NextResponse.json({error: "Invalid credentials"}, {status: 401});
  }

  const data = await res.json();
  const response = NextResponse.json({ok: true});

  response.cookies.set("admin_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours, matches backend token expiry
  });

  return response;
}
