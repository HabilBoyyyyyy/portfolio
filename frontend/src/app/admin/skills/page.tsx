export const dynamic = 'force-dynamic';
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import ImageUpload from "@/components/admin/ImageUpload";
import Paper from "@/components/scrapbook/Paper";
import type {Skill} from "@/lib/api";

async function getSkills() {
  try {
    const res = await adminFetch("/api/admin/skills");
    return res;
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
      icon_url: formData.get("icon_url"),
      category: formData.get("category"),
      progress: 0,
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
  const icon_url = formData.get("icon_url");
  const category = formData.get("category");
  const description = formData.get("description");
  const order = formData.get("order");
  const visible = formData.get("visible") === "true";

  await adminFetch(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      icon_url,
      category,
      progress: 0,
      description,
      order: Number(order),
      visible: !visible,
    }),
  });
  revalidatePath("/admin/skills");
}

export default async function SkillsAdminPage() {
  const skills = await getSkills();

  const inputClass = "w-full rounded border border-sand-300 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600 font-mono";
  const labelClass = "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-ink uppercase tracking-wider">Skills Management</h1>

      <Paper rotate={-0.5} tape className="!p-8">
        <form action={createSkill} className="space-y-6">
          <h2 className="font-display text-2xl text-terracotta-600 mb-2 border-b border-sand-200 pb-2">Add New Skill</h2>
          
          <div className="grid gap-6">
            <div>
              <label className={labelClass}>Icon Image (Optional)</label>
              <ImageUpload name="icon_url" accept="image/svg+xml,image/png,image/webp,image/jpeg" />
              <p className="text-[10px] font-mono text-sand-500 mt-1">You can upload a file or paste an image URL directly into the box above.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Skill Name</label>
                <input name="name" placeholder="e.g. Frontend Development" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input name="category" placeholder="e.g. Languages, Tools" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" placeholder="Description" rows={2} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Display Order</label>
              <input name="order" type="number" placeholder="0" className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="rounded-full bg-terracotta-600 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory transition hover:bg-terracotta-700 shadow-md hover:-translate-y-0.5">
              + Add Skill
            </button>
          </div>
        </form>
      </Paper>

      <div className="space-y-4">
        <h2 className="font-display text-2xl text-ink uppercase tracking-wider pl-2">Current Skills</h2>
        {skills.length === 0 && (
          <p className="font-mono text-sm text-sand-500 pl-2">No skills yet.</p>
        )}
        <div className="grid gap-4">
          {skills.map((skill: Skill) => (
            <div
              key={skill.id}
              className={`p-5 border border-sand-200 rounded bg-ivory shadow-sm flex items-center justify-between transition-all ${
                !skill.visible ? "opacity-50 grayscale border-dashed" : "hover:shadow-md hover:border-terracotta-300"
              }`}>
              <div className="flex items-center gap-4">
                {skill.icon_url ? (
                  <img src={skill.icon_url} alt="" className="w-10 h-10 flex-shrink-0 object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-sand-200 rounded flex items-center justify-center font-display text-lg text-sand-600">{skill.name[0]}</div>
                )}
                <div>
                  <p className="font-display text-lg text-ink">
                    {skill.name}
                  </p>
                  <p className="font-mono text-xs text-terracotta-600 mt-1 uppercase tracking-widest">{skill.category}</p>
                  <p className="text-sm text-sand-600 mt-1">{skill.description}</p>
                  <p className="font-mono text-[10px] text-sand-400 mt-2 uppercase tracking-widest">
                    {skill.visible ? "Visible" : "Hidden"} · Order: {skill.order}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <form action={toggleVisible}>
                  <input type="hidden" name="id" value={skill.id} />
                  <input type="hidden" name="name" value={skill.name} />
                  <input type="hidden" name="icon_url" value={skill.icon_url ?? ""} />
                  <input type="hidden" name="category" value={skill.category ?? ""} />
                  <input type="hidden" name="description" value={skill.description ?? ""} />
                  <input type="hidden" name="order" value={skill.order} />
                  <input type="hidden" name="visible" value={String(skill.visible)} />
                  <button
                    type="submit"
                    className="w-full text-xs font-mono uppercase tracking-widest px-3 py-1.5 border border-sand-300 rounded hover:bg-sand-200 transition">
                    {skill.visible ? "Hide" : "Show"}
                  </button>
                </form>
                <form action={deleteSkill}>
                  <input type="hidden" name="id" value={skill.id} />
                  <button
                    type="submit"
                    className="w-full text-xs font-mono uppercase tracking-widest px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 hover:border-red-300 transition">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
