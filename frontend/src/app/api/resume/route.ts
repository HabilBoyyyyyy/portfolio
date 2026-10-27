import {NextRequest, NextResponse} from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const baseUrl = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/+$/, "");

  let resumeUrl: string | null = null;
  let fullName = "Habil_Baihaki_Ramadhan";

  try {
    const res = await fetch(`${baseUrl}/api/profile`, {
      cache: "no-store",
    });
    if (res.ok) {
      const profile = await res.json();
      resumeUrl = profile?.resume_url || null;
      if (profile?.name) {
        fullName = profile.name.trim().replace(/\s+/g, "_");
      }
    }
  } catch {
    // If backend is unreachable, fallback to local static file
  }

  // 1. If resume is a base64 Data URL (uploaded via admin panel)
  if (resumeUrl && resumeUrl.startsWith("data:application/pdf")) {
    const base64Index = resumeUrl.indexOf("base64,");
    if (base64Index !== -1) {
      const base64Data = resumeUrl.slice(base64Index + 7);
      const buffer = Buffer.from(base64Data, "base64");
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${fullName}_CV.pdf"`,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }
  }

  // 2. If resume is an external HTTP/HTTPS link (e.g. Google Drive, Cloudinary)
  if (resumeUrl && (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://"))) {
    return NextResponse.redirect(resumeUrl);
  }

  // 3. If resume is a relative URL (e.g. /files/Habil_baihaki_Resume.pdf)
  if (resumeUrl && resumeUrl.startsWith("/")) {
    return NextResponse.redirect(new URL(resumeUrl, req.url));
  }

  // 4. Fallback: check if local PDF exists in public/files
  const possibleFiles = [
    path.join(process.cwd(), "public", "files", "Habil_baihaki_Resume.pdf"),
    path.join(process.cwd(), "public", "files", "Habil_Baihaki_Ramadhan_CV.pdf"),
  ];

  for (const localFilePath of possibleFiles) {
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = fs.readFileSync(localFilePath);
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${fullName}_CV.pdf"`,
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }
  }

  return new Response("CV / Resume not found.", {status: 404});
}
