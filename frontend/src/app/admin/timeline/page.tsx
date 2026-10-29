export const dynamic = "force-dynamic";
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import Paper from "@/components/scrapbook/Paper";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type {TimelineItem} from "@/lib/api";

async function getTimeline(): Promise<TimelineItem[]> {
  try {
    const res = await adminFetch("/api/admin/timeline", {cache: "no-store"});
    if (Array.isArray(res)) return res;
  } catch {
    // Fallback to public endpoint if admin GET route is not mounted yet
  }
  try {
    const baseUrl = (
      process.env.BACKEND_URL || "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");
    const res = await fetch(`${baseUrl}/api/timeline`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function revalidateTimelinePaths() {
  revalidatePath("/admin/timeline");
  revalidatePath("/");
}

async function createTimelineItem(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/timeline", {
    method: "POST",
    body: JSON.stringify({
      year: String(formData.get("year") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim() || null,
      order: Number(formData.get("order")) || 0,
    }),
  });
  revalidateTimelinePaths();
}

async function deleteTimelineItem(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/timeline/${formData.get("id")}`, {
    method: "DELETE",
  });
  revalidateTimelinePaths();
}

async function updateTimelineItem(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/timeline/${formData.get("id")}`, {
    method: "PUT",
    body: JSON.stringify({
      year: String(formData.get("year") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim() || null,
      order: Number(formData.get("order")) || 0,
    }),
  });
  revalidateTimelinePaths();
}

async function moveTimelineItem(formData: FormData) {
  "use server";
  const payloadStr = formData.get("reorder_payload") as string;
  if (!payloadStr) return;

  const parsed = JSON.parse(payloadStr) as {
    items: Array<{
      id: number;
      order: number;
      year: string;
      title: string;
      description?: string | null;
    }>;
  };

  try {
    await adminFetch("/api/admin/timeline/reorder", {
      method: "PUT",
      body: JSON.stringify({
        items: parsed.items.map((it) => ({id: it.id, order: it.order})),
      }),
    });
  } catch {
    for (const it of parsed.items) {
      await adminFetch(`/api/admin/timeline/${it.id}`, {
        method: "PUT",
        body: JSON.stringify({
          year: it.year,
          title: it.title,
          description: it.description ?? "",
          order: it.order,
        }),
      });
    }
  }

  revalidateTimelinePaths();
}

function buildMovePayload(
  items: TimelineItem[],
  currentIndex: number,
  direction: "up" | "down",
): string | null {
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return null;
  const reordered = [...items];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, moved);
  return JSON.stringify({
    items: reordered.map((it, idx) => ({
      id: it.id,
      order: idx + 1,
      year: it.year,
      title: it.title,
      description: it.description,
    })),
  });
}

export default async function TimelineAdminPage() {
  const rawItems = await getTimeline();
  const items = [...rawItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const inputClass =
    "w-full rounded border border-sand-300 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600 font-mono";
  const labelClass =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider text-ink break-words">
          Journey &amp; Timeline Management
        </h1>
      </div>

      {/* Add New Milestone Card */}
      <Paper rotate={-0.4} tape className="max-sm:[rotate:0deg] !p-4 sm:!p-6 md:!p-8">
        <form action={createTimelineItem} className="space-y-6">
          <h2 className="mb-2 border-b border-sand-200 pb-2 font-display text-xl sm:text-2xl text-terracotta-600">
            Add New Milestone
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>Year / Era *</label>
              <input
                name="year"
                placeholder="e.g. 2026 or 2024 – 2026"
                required
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Milestone Title *</label>
              <input
                name="title"
                placeholder="e.g. Started B.Sc. in Informatics"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description (Optional)</label>
            <textarea
              name="description"
              placeholder="Brief story or highlight from this milestone..."
              rows={2}
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

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-terracotta-600 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-md transition hover:-translate-y-0.5 hover:bg-terracotta-700 cursor-pointer text-center">
              + Add Milestone
            </button>
          </div>
        </form>
      </Paper>

      {/* Current Milestones List with ▲ / ▼ Reorder Controls */}
      <div className="space-y-4">
        <div className="pl-1 sm:pl-2">
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-ink">
            Current Milestones
            <span className="block sm:inline sm:ml-3 font-mono text-xs sm:text-sm normal-case tracking-normal text-sand-500 mt-1 sm:mt-0">
              {items.length} total
            </span>
          </h2>
          <p className="mt-1 font-mono text-xs text-sand-500">
            Use ▲ and ▼ to reorder milestones along your public Journey
            timeline.
          </p>
        </div>

        {items.length === 0 && (
          <p className="pl-2 font-mono text-sm text-sand-500">
            No timeline items yet.
          </p>
        )}

        <div className="flex flex-col gap-3 max-w-full">
          {items.map((item: TimelineItem, index: number) => {
            const upPayload = buildMovePayload(items, index, "up");
            const downPayload = buildMovePayload(items, index, "down");

            return (
              <div
                key={item.id}
                className="min-w-0 max-w-full overflow-hidden rounded-lg border border-sand-200 bg-ivory p-4 shadow-sm transition-all hover:border-terracotta-300 hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    {/* ▲ / ▼ Reorder Controls */}
                    <div className="flex shrink-0 flex-col gap-1">
                      <form action={moveTimelineItem}>
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
                      <form action={moveTimelineItem}>
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

                    {/* Order Badge */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-200 font-mono text-xs font-bold text-sand-700">
                      #{index + 1}
                    </div>

                    {/* Milestone Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded border border-terracotta-200 bg-terracotta-50 px-2 py-0.5 font-mono text-xs font-bold text-terracotta-700">
                          {item.year}
                        </span>
                        <p className="truncate font-display text-lg leading-tight text-ink">
                          {item.title}
                        </p>
                      </div>

                      {item.description && (
                        <p className="mt-1 line-clamp-2 break-words text-xs text-sand-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delete Action */}
                  <div className="flex shrink-0 items-center justify-end gap-2 border-t border-sand-200/60 pt-2.5 sm:border-t-0 sm:pt-0">
                    <form action={deleteTimelineItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmDeleteButton
                        skillName={item.title}
                        className="w-20 rounded border border-red-200 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-red-600 transition hover:border-red-300 hover:bg-red-50"
                      />
                    </form>
                  </div>
                </div>

                {/* Expandable Edit Form */}
                <details className="group mt-3 border-t border-sand-200 pt-3">
                  <summary className="cursor-pointer select-none font-mono text-xs uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700">
                    Edit Milestone Details ▾
                  </summary>

                  <form
                    action={updateTimelineItem}
                    className="mt-4 space-y-4 rounded border border-sand-200 bg-white p-4">
                    <input type="hidden" name="id" value={item.id} />

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className={labelClass}>Year</label>
                        <input
                          name="year"
                          defaultValue={item.year}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Title</label>
                        <input
                          name="title"
                          defaultValue={item.title}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        name="description"
                        defaultValue={item.description ?? ""}
                        rows={2}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Display Order</label>
                      <input
                        name="order"
                        type="number"
                        defaultValue={item.order}
                        min={1}
                        className={inputClass}
                      />
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
