export const dynamic = "force-dynamic";
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import Paper from "@/components/scrapbook/Paper";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type {Certificate} from "@/lib/api";

async function getCertificates(): Promise<Certificate[]> {
  try {
    const res = await adminFetch("/api/admin/certificates", {
      cache: "no-store",
    });
    if (Array.isArray(res)) return res;
  } catch {
    // Fallback to public endpoint if admin GET route is not mounted yet
  }
  try {
    const baseUrl = (
      process.env.BACKEND_URL || "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");
    const res = await fetch(`${baseUrl}/api/certificates`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function revalidateCertificatePaths() {
  revalidatePath("/admin/certificates");
  revalidatePath("/");
}

async function createCertificate(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/certificates", {
    method: "POST",
    body: JSON.stringify({
      name: String(formData.get("name") || "").trim(),
      issuer: String(formData.get("issuer") || "").trim() || null,
      score: String(formData.get("score") || "").trim() || null,
      date: String(formData.get("date") || "").trim() || null,
    }),
  });
  revalidateCertificatePaths();
}

async function deleteCertificate(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/certificates/${formData.get("id")}`, {
    method: "DELETE",
  });
  revalidateCertificatePaths();
}

async function updateCertificate(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/certificates/${formData.get("id")}`, {
    method: "PUT",
    body: JSON.stringify({
      name: String(formData.get("name") || "").trim(),
      issuer: String(formData.get("issuer") || "").trim() || null,
      score: String(formData.get("score") || "").trim() || null,
      date: String(formData.get("date") || "").trim() || null,
    }),
  });
  revalidateCertificatePaths();
}

export default async function CertificatesAdminPage() {
  const certificates = await getCertificates();

  const inputClass =
    "w-full rounded border border-sand-300 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600 font-mono";
  const labelClass =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider text-ink break-words">
          Certificates Management
        </h1>
      </div>

      {/* Add New Certificate Form */}
      <Paper rotate={-0.4} tape className="max-sm:[rotate:0deg] !p-4 sm:!p-6 md:!p-8">
        <form action={createCertificate} className="space-y-6">
          <h2 className="mb-2 border-b border-sand-200 pb-2 font-display text-xl sm:text-2xl text-terracotta-600">
            Add New Certificate
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Certificate Name *</label>
              <input
                name="name"
                placeholder="e.g. AWS Certified Cloud Practitioner"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Issuing Organization</label>
              <input
                name="issuer"
                placeholder="e.g. Amazon Web Services / Coursera"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Score / Grade / Credential ID (Optional)
              </label>
              <input
                name="score"
                placeholder="e.g. 98% or 940/1000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Issue Date / Year</label>
              <input
                name="date"
                placeholder="e.g. Oct 2026"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-terracotta-600 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-md transition hover:-translate-y-0.5 hover:bg-terracotta-700 cursor-pointer text-center">
              + Add Certificate
            </button>
          </div>
        </form>
      </Paper>

      {/* Current Certificates List */}
      <div className="space-y-4">
        <div className="pl-1 sm:pl-2">
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-ink">
            Current Certificates
            <span className="block sm:inline sm:ml-3 font-mono text-xs sm:text-sm normal-case tracking-normal text-sand-500 mt-1 sm:mt-0">
              {certificates.length} total
            </span>
          </h2>
        </div>

        {certificates.length === 0 && (
          <p className="pl-2 font-mono text-sm text-sand-500">
            No certificates yet.
          </p>
        )}

        <div className="flex flex-col gap-3 max-w-full">
          {certificates.map((cert: Certificate, index: number) => (
            <div
              key={cert.id}
              className="min-w-0 max-w-full overflow-hidden rounded-lg border border-sand-200 bg-ivory p-4 shadow-sm transition-all hover:border-terracotta-300 hover:shadow-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-terracotta-200 bg-terracotta-50 font-mono text-xs font-bold text-terracotta-700">
                    #{index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-lg leading-tight text-ink">
                        {cert.name}
                      </p>
                      {cert.score && (
                        <span className="rounded-full border border-terracotta-300 bg-terracotta-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-terracotta-700">
                          Score: {cert.score}
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 font-mono text-xs text-sand-600">
                      {cert.issuer || "Official Credential"}
                      {cert.date ? ` · ${cert.date}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-sand-200/60 pt-2.5 sm:border-t-0 sm:pt-0">
                  <form action={deleteCertificate}>
                    <input type="hidden" name="id" value={cert.id} />
                    <ConfirmDeleteButton
                      skillName={cert.name}
                      className="w-20 rounded border border-red-200 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-red-600 transition hover:border-red-300 hover:bg-red-50"
                    />
                  </form>
                </div>
              </div>

              <details className="group mt-3 border-t border-sand-200 pt-3">
                <summary className="cursor-pointer select-none font-mono text-xs uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700">
                  Edit Certificate Details ▾
                </summary>

                <form
                  action={updateCertificate}
                  className="mt-4 space-y-4 rounded border border-sand-200 bg-white p-4">
                  <input type="hidden" name="id" value={cert.id} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Certificate Name</label>
                      <input
                        name="name"
                        defaultValue={cert.name}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Issuer</label>
                      <input
                        name="issuer"
                        defaultValue={cert.issuer ?? ""}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Score (Optional)</label>
                      <input
                        name="score"
                        defaultValue={cert.score ?? ""}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Date</label>
                      <input
                        name="date"
                        defaultValue={cert.date ?? ""}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="rounded bg-green-600 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white shadow transition hover:bg-green-700">
                      Save Changes
                    </button>
                  </div>
                </form>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
