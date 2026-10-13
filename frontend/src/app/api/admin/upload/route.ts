import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401});
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({error: "No file provided"}, {status: 400});
  }

  // Forward to backend
  const backendForm = new FormData();
  backendForm.append("file", file);

  const res = await fetch(`${process.env.BACKEND_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: backendForm,
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      {error: err || "Upload failed"},
      {status: res.status},
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
