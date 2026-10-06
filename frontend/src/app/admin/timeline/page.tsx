import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";

async function getTimeline() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/timeline`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function createTimelineItem(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/timeline", {
    method: "POST",
    body: JSON.stringify({
      year: formData.get("year"),
      title: formData.get("title"),
      description: formData.get("description"),
      order: Number(formData.get("order")) || 0,
    }),
  });
  revalidatePath("/admin/timeline");
}

async function deleteTimelineItem(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/timeline/${formData.get("id")}`, {
    method: "DELETE",
  });
  revalidatePath("/admin/timeline");
}

export default async function TimelineAdminPage() {
  const items = await getTimeline();

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-2xl font-bold">Timeline</h1>

      <form
        action={createTimelineItem}
        className="space-y-3 p-4 border rounded-lg bg-white">
        <h2 className="font-semibold">Add a milestone</h2>
        <input
          name="year"
          placeholder="Year (e.g. 2026)"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="title"
          placeholder="Title"
          required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="order"
          type="number"
          placeholder="Display order"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-[#C1502E] text-white px-4 py-2 rounded">
          Add Milestone
        </button>
      </form>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">No timeline items yet.</p>
        )}
        {items.map((item: any) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg bg-white flex items-center justify-between">
            <div>
              <p className="font-medium">
                {item.year} — {item.title}
              </p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-xs text-gray-400">order {item.order}</p>
            </div>
            <form action={deleteTimelineItem}>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="text-sm px-3 py-1 border rounded text-[#B33A2E]">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
