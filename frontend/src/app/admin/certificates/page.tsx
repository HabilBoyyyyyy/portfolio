export const dynamic = 'force-dynamic';
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import type {Certificate} from "@/lib/api";

async function getCertificates() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/certificates`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function createCertificate(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/certificates", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      issuer: formData.get("issuer"),
      score: formData.get("score"),
      date: formData.get("date"),
    }),
  });
  revalidatePath("/admin/certificates");
}

async function deleteCertificate(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/certificates/${formData.get("id")}`, {
    method: "DELETE",
  });
  revalidatePath("/admin/certificates");
}

async function updateCertificate(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/certificates/${formData.get("id")}`, {
    method: "PUT",
    body: JSON.stringify({
      name: formData.get("name"),
      issuer: formData.get("issuer"),
      score: formData.get("score"),
      date: formData.get("date"),
    }),
  });
  revalidatePath("/admin/certificates");
}

export default async function CertificatesAdminPage() {
  const certificates = await getCertificates();

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-2xl font-bold">Certificates</h1>

      <form
        action={createCertificate}
        className="space-y-3 p-4 border rounded-lg bg-white">
        <h2 className="font-semibold">Add a certificate</h2>
        <input
          name="name"
          placeholder="Certificate name"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="issuer"
          placeholder="Issuer"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2">
          <input
            name="score"
            placeholder="Score (optional)"
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            name="date"
            placeholder="Date (e.g. 2026)"
            className="w-1/2 border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-[#C1502E] text-white px-4 py-2 rounded">
          Add Certificate
        </button>
      </form>

      <div className="space-y-3">
        {certificates.length === 0 && (
          <p className="text-sm text-gray-500">No certificates yet.</p>
        )}
        {certificates.map((cert: Certificate) => (
          <div
            key={cert.id}
            className="p-4 border rounded-lg bg-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-gray-500">
                  {cert.issuer} {cert.score && `· Score: ${cert.score}`}{" "}
                  {cert.date && `· ${cert.date}`}
                </p>
              </div>
              <form action={deleteCertificate}>
                <input type="hidden" name="id" value={cert.id} />
                <button
                  type="submit"
                  className="text-sm px-3 py-1 border rounded text-[#B33A2E]">
                  Delete
                </button>
              </form>
            </div>
            
            <details className="text-sm group">
              <summary className="cursor-pointer text-gray-500 hover:text-black">
                Edit certificate
              </summary>
              <form action={updateCertificate} className="mt-3 space-y-2">
                <input type="hidden" name="id" value={cert.id} />
                <input
                  name="name"
                  defaultValue={cert.name}
                  required
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  name="issuer"
                  defaultValue={cert.issuer || ""}
                  className="w-full border rounded px-2 py-1"
                />
                <div className="flex gap-2">
                  <input
                    name="score"
                    defaultValue={cert.score || ""}
                    className="w-1/2 border rounded px-2 py-1"
                  />
                  <input
                    name="date"
                    defaultValue={cert.date || ""}
                    className="w-1/2 border rounded px-2 py-1"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-3 py-1 rounded">
                  Save
                </button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

