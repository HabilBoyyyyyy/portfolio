export const dynamic = "force-dynamic";
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import ImageUpload from "@/components/admin/ImageUpload";
import Paper from "@/components/scrapbook/Paper";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type {Experience} from "@/lib/api";

async function getExperiences(): Promise<Experience[]> {
  try {
    const res = await adminFetch("/api/admin/experiences");
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

function revalidateExperiencePaths() {
  revalidatePath("/admin/experience");
  revalidatePath("/");
}

async function createExperience(formData: FormData) {
  "use server";
  const isCurrent = formData.get("is_current") === "on";
  await adminFetch("/api/admin/experiences", {
    method: "POST",
    body: JSON.stringify({
      role: formData.get("role"),
      company: formData.get("company"),
      company_url: formData.get("company_url") || null,
      company_logo_url: formData.get("company_logo_url") || null,
      location: formData.get("location") || null,
      employment_type: formData.get("employment_type") || null,
      start_date: formData.get("start_date"),
      end_date: isCurrent ? null : formData.get("end_date") || null,
      is_current: isCurrent,
      summary: formData.get("summary") || null,
      description: formData.get("description") || null,
      tags: formData.get("tags") || null,
      order: Number(formData.get("order")) || 0,
      visible: true,
    }),
  });
  revalidateExperiencePaths();
}

async function updateExperience(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const isCurrent = formData.get("is_current") === "on";
  await adminFetch(`/api/admin/experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      role: formData.get("role"),
      company: formData.get("company"),
      company_url: formData.get("company_url") || null,
      company_logo_url: formData.get("company_logo_url") || null,
      location: formData.get("location") || null,
      employment_type: formData.get("employment_type") || null,
      start_date: formData.get("start_date"),
      end_date: isCurrent ? null : formData.get("end_date") || null,
      is_current: isCurrent,
      summary: formData.get("summary") || null,
      description: formData.get("description") || null,
      tags: formData.get("tags") || null,
      order: Number(formData.get("order")) || 0,
      visible: formData.get("visible") === "true",
    }),
  });
  revalidateExperiencePaths();
}

async function deleteExperience(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/experiences/${id}`, {method: "DELETE"});
  revalidateExperiencePaths();
}

async function toggleVisible(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/experiences/${id}/visibility`, {
    method: "PATCH",
  });
  revalidateExperiencePaths();
}

async function moveExperience(formData: FormData) {
  "use server";
  const payload = formData.get("reorder_payload") as string;
  if (!payload) return;
  await adminFetch("/api/admin/experiences/reorder", {
    method: "PUT",
    body: payload,
  });
  revalidateExperiencePaths();
}

function buildMovePayload(
  items: Experience[],
  currentIndex: number,
  direction: "up" | "down",
): string | null {
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return null;
  const reordered = [...items];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, moved);
  return JSON.stringify({
    experiences: reordered.map((it, idx) => ({
      id: it.id,
      order: idx + 1,
    })),
  });
}

export default async function ExperienceAdminPage() {
  const rawItems = await getExperiences();
  const experiences = [...rawItems].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const visibleCount = experiences.filter((e) => e.visible).length;

  const inputClass =
    "w-full rounded border border-sand-300 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600 font-mono";
  const labelClass =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider text-ink break-words">
          Experience Management
        </h1>
      </div>

      {/* Add New Experience Card */}
      <Paper rotate={-0.4} tape className="max-sm:[rotate:0deg] !p-4 sm:!p-6 md:!p-8">
        <form action={createExperience} className="space-y-6">
          <h2 className="mb-2 border-b border-sand-200 pb-2 font-display text-xl sm:text-2xl text-terracotta-600">
            Add New Experience
          </h2>

          <div>
            <label className={labelClass}>Company Logo (Optional)</label>
            <ImageUpload
              name="company_logo_url"
              accept="image/svg+xml,image/png,image/webp,image/jpeg"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Role / Job Title *</label>
              <input
                name="role"
                placeholder="e.g. Full-Stack Developer Intern"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Company / Organization *</label>
              <input
                name="company"
                placeholder="e.g. PT Teknologi Nusantara"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>Employment Type</label>
              <select
                name="employment_type"
                defaultValue="Internship"
                className={inputClass}>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Organization">Organization</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                name="location"
                placeholder="e.g. Jakarta, Indonesia · Hybrid"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Company Website URL</label>
              <input
                name="company_url"
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:items-end">
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                name="start_date"
                placeholder="e.g. Jun 2026"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                End Date (Leave blank if current)
              </label>
              <input
                name="end_date"
                placeholder="e.g. Dec 2026"
                className={inputClass}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 rounded border border-sand-300 bg-ivory px-3.5 py-2.5 font-mono text-xs text-ink">
              <input
                type="checkbox"
                name="is_current"
                className="h-4 w-4 accent-[#c1502e]"
              />
              <span>I currently work here</span>
            </label>
          </div>

          <div>
            <label className={labelClass}>Short Summary (1–2 sentences)</label>
            <textarea
              name="summary"
              placeholder="High-level summary of your role and team"
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Key Achievements / Bullet Points (One bullet per line)
            </label>
            <textarea
              name="description"
              placeholder="- Built real-time inspection pipelines in FastAPI and Next.js&#10;- Reduced API p95 latency by 40% via Redis caching"
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Tech Stack Tags (Comma-separated)
              </label>
              <input
                name="tags"
                placeholder="Next.js, TypeScript, FastAPI, PostgreSQL"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Display Order (0 = auto-place at end)
              </label>
              <input
                name="order"
                type="number"
                defaultValue={0}
                min={0}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-terracotta-600 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-md transition hover:-translate-y-0.5 hover:bg-terracotta-700 cursor-pointer text-center">
              + Add Experience
            </button>
          </div>
        </form>
      </Paper>

      {/* Current Experiences List */}
      <div className="space-y-4">
        <div className="pl-1 sm:pl-2">
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-ink">
            Current Experiences
            <span className="block sm:inline sm:ml-3 font-mono text-xs sm:text-sm normal-case tracking-normal text-sand-500 mt-1 sm:mt-0">
              {experiences.length} total · {visibleCount} visible
            </span>
          </h2>
          <p className="mt-1 font-mono text-xs text-sand-500">
            Use ▲ and ▼ to set exact display order. The public Experience
            section respects this order.
          </p>
        </div>

        {experiences.length === 0 && (
          <p className="pl-2 font-mono text-sm text-sand-500">
            No experience entries yet.
          </p>
        )}

        <div className="flex flex-col gap-3 max-w-full">
          {experiences.map((exp: Experience, index: number) => {
            const upPayload = buildMovePayload(experiences, index, "up");
            const downPayload = buildMovePayload(experiences, index, "down");

            return (
              <div
                key={exp.id}
                className={`min-w-0 max-w-full overflow-hidden rounded-lg border bg-ivory p-4 shadow-sm transition-all ${
                  !exp.visible
                    ? "border-dashed border-sand-300 bg-sand-100/50 opacity-60"
                    : "border-sand-200 hover:border-terracotta-300 hover:shadow-md"
                }`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  {/* Left + Middle: Reorder + Badge + Logo + Info */}
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    <div className="flex shrink-0 flex-col gap-1">
                      <form action={moveExperience}>
                        <input
                          type="hidden"
                          name="reorder_payload"
                          value={upPayload ?? ""}
                        />
                        <button
                          type="submit"
                          disabled={!upPayload}
                          title="Move Up"
                          className="flex h-7 w-7 items-center justify-center rounded border border-sand-300 bg-white text-xs text-sand-600 transition hover:border-terracotta-400 hover:bg-sand-100 hover:text-terracotta-600 disabled:cursor-not-allowed disabled:opacity-20">
                          ▲
                        </button>
                      </form>
                      <form action={moveExperience}>
                        <input
                          type="hidden"
                          name="reorder_payload"
                          value={downPayload ?? ""}
                        />
                        <button
                          type="submit"
                          disabled={!downPayload}
                          title="Move Down"
                          className="flex h-7 w-7 items-center justify-center rounded border border-sand-300 bg-white text-xs text-sand-600 transition hover:border-terracotta-400 hover:bg-sand-100 hover:text-terracotta-600 disabled:cursor-not-allowed disabled:opacity-20">
                          ▼
                        </button>
                      </form>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-200 font-mono text-xs font-bold text-sand-700">
                      #{index + 1}
                    </div>

                    {exp.company_logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={exp.company_logo_url}
                        alt=""
                        className="hidden h-10 w-10 shrink-0 rounded border border-sand-200 bg-white object-contain p-1 sm:block"
                      />
                    ) : (
                      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded border border-sand-200 bg-terracotta-100 font-display text-base text-terracotta-700 sm:flex">
                        {exp.company[0]}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-display text-base leading-tight text-ink sm:text-lg">
                          {exp.role}
                        </p>
                        <span className="font-mono text-xs font-semibold text-terracotta-600">
                          @ {exp.company}
                        </span>
                        {exp.is_current && (
                          <span className="rounded-full border border-green-300 bg-green-50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-green-700">
                            ● Current
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 font-mono text-[11px] text-sand-600">
                        {exp.start_date} —{" "}
                        {exp.is_current ? "Present" : exp.end_date || "Present"}
                        {exp.employment_type ? ` · ${exp.employment_type}` : ""}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </p>

                      {exp.summary && (
                        <p className="mt-1 line-clamp-1 break-words text-xs text-sand-600">
                          {exp.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Actions */}
                  <div className="flex shrink-0 items-center justify-end gap-2 border-t border-sand-200/60 pt-2.5 sm:border-t-0 sm:pt-0">
                    <form action={toggleVisible}>
                      <input type="hidden" name="id" value={exp.id} />
                      <button
                        type="submit"
                        className={`w-20 rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition ${
                          exp.visible
                            ? "border-sand-300 text-sand-600 hover:bg-sand-200"
                            : "border-green-400 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}>
                        {exp.visible ? "Hide" : "Show"}
                      </button>
                    </form>

                    <form action={deleteExperience}>
                      <input type="hidden" name="id" value={exp.id} />
                      <ConfirmDeleteButton
                        skillName={`${exp.role} at ${exp.company}`}
                        className="w-20 rounded border border-red-200 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-red-600 transition hover:border-red-300 hover:bg-red-50"
                      />
                    </form>
                  </div>
                </div>

                {/* Expandable Edit Details */}
                <details className="group mt-3 border-t border-sand-200 pt-3">
                  <summary className="cursor-pointer select-none font-mono text-xs uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700">
                    Edit Details &amp; Settings ▾
                  </summary>

                  <form
                    action={updateExperience}
                    className="mt-4 space-y-4 rounded border border-sand-200 bg-white p-4">
                    <input type="hidden" name="id" value={exp.id} />

                    <div>
                      <label className={labelClass}>Company Logo URL</label>
                      <ImageUpload
                        name="company_logo_url"
                        existingUrl={exp.company_logo_url ?? ""}
                        accept="image/svg+xml,image/png,image/webp,image/jpeg"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Role / Job Title</label>
                        <input
                          name="role"
                          defaultValue={exp.role}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Company / Organization
                        </label>
                        <input
                          name="company"
                          defaultValue={exp.company}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className={labelClass}>Employment Type</label>
                        <select
                          name="employment_type"
                          defaultValue={exp.employment_type ?? "Internship"}
                          className={inputClass}>
                          <option value="Internship">Internship</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Organization">Organization</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <input
                          name="location"
                          defaultValue={exp.location ?? ""}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Company URL</label>
                        <input
                          name="company_url"
                          defaultValue={exp.company_url ?? ""}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 md:items-end">
                      <div>
                        <label className={labelClass}>Start Date</label>
                        <input
                          name="start_date"
                          defaultValue={exp.start_date}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>End Date</label>
                        <input
                          name="end_date"
                          defaultValue={exp.end_date ?? ""}
                          className={inputClass}
                        />
                      </div>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded border border-sand-300 bg-ivory px-3.5 py-2.5 font-mono text-xs text-ink">
                        <input
                          type="checkbox"
                          name="is_current"
                          defaultChecked={exp.is_current}
                          className="h-4 w-4 accent-[#c1502e]"
                        />
                        <span>Currently working here</span>
                      </label>
                    </div>

                    <div>
                      <label className={labelClass}>Short Summary</label>
                      <textarea
                        name="summary"
                        defaultValue={exp.summary ?? ""}
                        rows={2}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Bullet Points (One per line)
                      </label>
                      <textarea
                        name="description"
                        defaultValue={exp.description ?? ""}
                        rows={4}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className={labelClass}>
                          Tags (Comma-separated)
                        </label>
                        <input
                          name="tags"
                          defaultValue={exp.tags ?? ""}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Display Order</label>
                        <input
                          name="order"
                          type="number"
                          defaultValue={exp.order}
                          min={1}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Visibility</label>
                        <select
                          name="visible"
                          defaultValue={String(exp.visible)}
                          className={inputClass}>
                          <option value="true">Visible on Public Site</option>
                          <option value="false">Hidden from Public Site</option>
                        </select>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
