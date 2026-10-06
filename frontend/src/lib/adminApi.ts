import {cookies} from "next/headers";

export async function adminFetch(path: string, options: RequestInit = {}) {
  const token = (await cookies()).get("admin_token")?.value;

  const res = await fetch(`${process.env.BACKEND_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
