import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({error: "Invalid request."}, {status: 400});
  }

  const {name, email, subject, message, website} = body;

  // Honeypot: real visitors never see this hidden field, bots fill it in.
  // We pretend it worked so the bot doesn't learn anything.
  if (website) return NextResponse.json({ok: true});

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

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
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
    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json(
      {error: "Couldn't reach the server. Please try again."},
      {status: 502},
    );
  }
}
