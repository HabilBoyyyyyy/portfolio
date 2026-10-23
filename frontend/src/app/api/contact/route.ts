import {NextRequest, NextResponse} from "next/server";
import {revalidatePath} from "next/cache";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({error: "Invalid request."}, {status: 400});
  }

  const {name, email, subject, message, _gotcha_field} = body;

  // Honeypot: uses non-autofill field name (_gotcha_field) so Chrome/Safari
  // address autofill never accidentally populates it and drops real messages!
  if (typeof _gotcha_field === "string" && _gotcha_field.trim().length > 0) {
    return NextResponse.json({ok: true});
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return NextResponse.json(
      {error: "Please fill in your name, email and message."},
      {status: 400},
    );
  }

  if (name.length > 100 || email.length > 200 || message.length > 3000) {
    return NextResponse.json(
      {error: "One of the fields is too long."},
      {status: 400},
    );
  }

  const baseUrl = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      cache: "no-store",
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        subject:
          typeof subject === "string" && subject.trim()
            ? subject.trim().slice(0, 150)
            : null,
        message: message.trim(),
      }),
    });

    if (res.status === 422) {
      return NextResponse.json(
        {error: "Please check your email address."},
        {status: 422},
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        {error: "Something went wrong on my side. Please try again."},
        {status: 502},
      );
    }

    // Revalidate Admin inbox paths immediately so new messages appear right away
    revalidatePath("/admin/messages");
    revalidatePath("/admin/contact");
    revalidatePath("/admin");

    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json(
      {error: "Couldn't reach the server. Please try again."},
      {status: 502},
    );
  }
}
