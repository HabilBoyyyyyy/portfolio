import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";

async function getSkills() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/skills`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function createSkill(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      category: formData.get("category"),
      progress: Number(formData.get("progress")) || 0,
      description: formData.get("description"),
      order: Number(formData.get("order")) || 0,
      visible: true,
    }),
  });
  revalidatePath("/admin/skills");
}

async function deleteSkill(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/skills/${id}`, {method: "DELETE"});
  revalidatePath("/admin/skills");
}

async function toggleVisible(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const name = formData.get("name");
  const category = formData.get("category");
  const progress = formData.get("progress");
  const description = formData.get("description");
  const order = formData.get("order");
  const visible = formData.get("visible") === "true";

  // Skills use PUT with the full object (see Phase 3's update_skill endpoint),
  // so we resend all fields with `visible` flipped.
  await adminFetch(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      category,
      progress: Number(progress),
      description,
      order: Number(order),
      visible: !visible,
    }),
  });
  revalidatePath("/admin/skills");
}

export default async function SkillsAdminPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Skills</h1>

      {/* Add new skill */}
      <form
        action={createSkill}
        className="space-y-3 p-4 border rounded-lg bg-white">
        <h2 className="font-semibold">Add a skill</h2>
        <input
          name="name"
          placeholder="Skill name (e.g. Frontend Development)"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="category"
          placeholder="Category (optional)"
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2">
          <input
            name="progress"
            type="number"
            min="0"
            max="100"
            placeholder="Progress %"
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            name="order"
            type="number"
            placeholder="Display order"
            className="w-1/2 border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-[#C1502E] text-white px-4 py-2 rounded">
          Add Skill
        </button>
      </form>

      {/* Existing skills list */}
      <div className="space-y-3">
        <h2 className="font-semibold">Current skills</h2>
        {skills.length === 0 && (
          <p className="text-sm text-gray-500">No skills yet.</p>
        )}
        {skills.map((skill: any) => (
          <div
            key={skill.id}
            className="p-4 border rounded-lg bg-white flex items-center justify-between">
            <div>
              <p className="font-medium">
                {skill.name} — {skill.progress}%
              </p>
              <p className="text-sm text-gray-500">{skill.category}</p>
              <p className="text-sm text-gray-400">{skill.description}</p>
              <p className="text-xs text-gray-400">
                {skill.visible ? "Visible" : "Hidden"} · order {skill.order}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={toggleVisible}>
                <input type="hidden" name="id" value={skill.id} />
                <input type="hidden" name="name" value={skill.name} />
                <input
                  type="hidden"
                  name="category"
                  value={skill.category ?? ""}
                />
                <input type="hidden" name="progress" value={skill.progress} />
                <input
                  type="hidden"
                  name="description"
                  value={skill.description ?? ""}
                />
                <input type="hidden" name="order" value={skill.order} />
                <input
                  type="hidden"
                  name="visible"
                  value={String(skill.visible)}
                />
                <button
                  type="submit"
                  className="text-sm px-3 py-1 border rounded">
                  {skill.visible ? "Hide" : "Show"}
                </button>
              </form>
              <form action={deleteSkill}>
                <input type="hidden" name="id" value={skill.id} />
                <button
                  type="submit"
                  className="text-sm px-3 py-1 border rounded text-[#B33A2E]">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
