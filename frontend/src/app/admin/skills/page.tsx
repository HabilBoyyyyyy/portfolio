export const dynamic = "force-dynamic";
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import ImageUpload from "@/components/admin/ImageUpload";
import Paper from "@/components/scrapbook/Paper";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type {Skill} from "@/lib/api";

async function getSkills(): Promise<Skill[]> {
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
  revalidatePath("/");
}

async function updateSkill(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: formData.get("name"),
      icon_url: formData.get("icon_url"),
      category: formData.get("category"),
      progress: 0,
      description: formData.get("description"),
      order: Number(formData.get("order")) || 0,
      visible: formData.get("visible") === "true",
    }),
  });
  revalidatePath("/admin/skills");
  revalidatePath("/");
}

async function deleteSkill(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/skills/${id}`, {method: "DELETE"});
  revalidatePath("/admin/skills");
  revalidatePath("/");
}

async function toggleVisible(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/skills/${id}/visibility`, {
    method: "PATCH",
  });
  revalidatePath("/admin/skills");
  revalidatePath("/");
}

async function moveSkill(formData: FormData) {
  "use server";
  const skillsJson = formData.get("reorder_payload") as string;
  if (!skillsJson) return;
  await adminFetch("/api/admin/skills/reorder", {
    method: "PUT",
    body: skillsJson,
  });
  revalidatePath("/admin/skills");
  revalidatePath("/");
}

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  const groups: Record<string, Skill[]> = {};
  for (const skill of skills) {
    const cat = skill.category || "Uncategorized";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(skill);
  }
  // Sort skills within each category by order
  for (const cat of Object.keys(groups)) {
    groups[cat].sort((a, b) => a.order - b.order);
  }
  return groups;
}

function buildMovePayload(
  skills: Skill[],
  currentIndex: number,
  direction: "up" | "down",
): string | null {
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= skills.length) return null;
  const reordered = [...skills];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, moved);
  return JSON.stringify({
    skills: reordered.map((s, idx) => ({
      id: s.id,
      order: idx + 1,
    })),
  });
}

export default async function SkillsAdminPage() {
  const skills = await getSkills();
  const grouped = groupByCategory(skills);
  const categoryOrder = ["Languages", "Frameworks", "Tools"];
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  const inputClass =
    "w-full rounded border border-sand-300 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600 font-mono";
  const labelClass =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink uppercase tracking-wider">
          Skills Management
        </h1>
      </div>

      <Paper rotate={-0.5} tape className="!p-8">
        <form action={createSkill} className="space-y-6">
          <h2 className="font-display text-2xl text-terracotta-600 mb-2 border-b border-sand-200 pb-2">
            Add New Skill
          </h2>

          <div className="grid gap-6">
            <div>
              <label className={labelClass}>Icon Image (Optional)</label>
              <ImageUpload
                name="icon_url"
                accept="image/svg+xml,image/png,image/webp,image/jpeg"
              />
              <p className="text-[10px] font-mono text-sand-500 mt-1">
                Upload an SVG/PNG or paste an image URL.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>Skill Name</label>
                <input
                  name="name"
                  placeholder="e.g. Next.js"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  name="category"
                  className={inputClass}
                  defaultValue="Languages">
                  <option value="Languages">Languages</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Description (Optional — shown in public Spotlight & Bento cards)
              </label>
              <textarea
                name="description"
                placeholder="e.g. App Router, Server Actions & SSR architecture"
                rows={2}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Display Order (0 = auto-place at end of category)
              </label>
              <input
                name="order"
                type="number"
                placeholder="0"
                defaultValue={0}
                min={0}
                className={inputClass}
              />
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

      <div className="space-y-8">
        <div className="pl-2">
          <h2 className="font-display text-2xl text-ink uppercase tracking-wider">
            Current Skills
            <span className="ml-3 font-mono text-sm text-sand-500 normal-case tracking-normal">
              {skills.length} total ·{" "}
              {skills.filter((s: Skill) => s.visible).length} visible
            </span>
          </h2>
          <p className="font-mono text-xs text-sand-500 mt-1">
            Use ▲ and ▼ to set exact display order within each category. The
            public Bento grid and ticker respect this order.
          </p>
        </div>

        {skills.length === 0 && (
          <p className="font-mono text-sm text-sand-500 pl-2">No skills yet.</p>
        )}

        {sortedCategories.map((category) => {
          const catSkills = grouped[category];
          const visibleCount = catSkills.filter((s) => s.visible).length;
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-3 pl-2 border-b border-sand-200 pb-2">
                <h3 className="font-display text-xl text-terracotta-600 uppercase tracking-wider">
                  {category}
                </h3>
                <span className="font-mono text-[10px] text-sand-500 uppercase tracking-widest">
                  {catSkills.length} skills ({visibleCount} visible,{" "}
                  {catSkills.length - visibleCount} hidden)
                </span>
              </div>

              <div className="grid gap-3">
                {catSkills.map((skill: Skill, index: number) => {
                  const upPayload = buildMovePayload(catSkills, index, "up");
                  const downPayload = buildMovePayload(
                    catSkills,
                    index,
                    "down",
                  );

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 border rounded-lg bg-ivory shadow-sm transition-all ${
                        !skill.visible
                          ? "opacity-60 border-dashed border-sand-300 bg-sand-100/50"
                          : "border-sand-200 hover:shadow-md hover:border-terracotta-300"
                      }`}>
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: Reorder Controls */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <form action={moveSkill}>
                            <input
                              type="hidden"
                              name="reorder_payload"
                              value={upPayload ?? ""}
                            />
                            <button
                              type="submit"
                              disabled={!upPayload}
                              title="Move Up"
                              className="w-7 h-7 flex items-center justify-center rounded border border-sand-300 bg-white text-sand-600 text-xs hover:bg-sand-100 hover:border-terracotta-400 hover:text-terracotta-600 transition disabled:opacity-20 disabled:cursor-not-allowed">
                              ▲
                            </button>
                          </form>
                          <form action={moveSkill}>
                            <input
                              type="hidden"
                              name="reorder_payload"
                              value={downPayload ?? ""}
                            />
                            <button
                              type="submit"
                              disabled={!downPayload}
                              title="Move Down"
                              className="w-7 h-7 flex items-center justify-center rounded border border-sand-300 bg-white text-sand-600 text-xs hover:bg-sand-100 hover:border-terracotta-400 hover:text-terracotta-600 transition disabled:opacity-20 disabled:cursor-not-allowed">
                              ▼
                            </button>
                          </form>
                        </div>

                        {/* Order badge */}
                        <div className="shrink-0 w-8 h-8 rounded-full bg-sand-200 flex items-center justify-center font-mono text-xs font-bold text-sand-700">
                          #{skill.order}
                        </div>

                        {/* Skill info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {skill.icon_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={skill.icon_url}
                              alt=""
                              className="w-9 h-9 flex-shrink-0 object-contain p-0.5 bg-white rounded border border-sand-200"
                            />
                          ) : (
                            <div className="w-9 h-9 bg-terracotta-100 text-terracotta-700 rounded flex items-center justify-center font-display text-base flex-shrink-0">
                              {skill.name[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-display text-lg text-ink truncate leading-tight">
                              {skill.name}
                            </p>
                            {skill.description && (
                              <p className="text-xs text-sand-600 mt-0.5 truncate">
                                {skill.description}
                              </p>
                            )}
                            <p className="font-mono text-[10px] text-sand-400 mt-1 uppercase tracking-widest">
                              {skill.visible
                                ? "✓ Visible on Site"
                                : "✗ Hidden from Public"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Quick Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <form action={toggleVisible}>
                            <input type="hidden" name="id" value={skill.id} />
                            <button
                              type="submit"
                              title={
                                skill.visible
                                  ? "Hide this skill from public"
                                  : "Show this skill to public"
                              }
                              className={`w-20 text-xs font-mono uppercase tracking-widest px-3 py-1.5 border rounded transition ${
                                skill.visible
                                  ? "border-sand-300 text-sand-600 hover:bg-sand-200"
                                  : "border-green-400 bg-green-50 text-green-700 hover:bg-green-100"
                              }`}>
                              {skill.visible ? "Hide" : "Show"}
                            </button>
                          </form>

                          <form action={deleteSkill}>
                            <input type="hidden" name="id" value={skill.id} />
                            <ConfirmDeleteButton
                              skillName={skill.name}
                              className="w-20 text-xs font-mono uppercase tracking-widest px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 hover:border-red-300 transition"
                            />
                          </form>
                        </div>
                      </div>

                      {/* Expandable Edit Details */}
                      <details className="mt-3 pt-3 border-t border-sand-200 group">
                        <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700 select-none">
                          Edit Details & Settings ▾
                        </summary>
                        <form
                          action={updateSkill}
                          className="space-y-4 mt-4 bg-white p-4 rounded border border-sand-200">
                          <input type="hidden" name="id" value={skill.id} />

                          <div>
                            <label className={labelClass}>Icon URL</label>
                            <ImageUpload
                              name="icon_url"
                              existingUrl={skill.icon_url ?? ""}
                              accept="image/svg+xml,image/png,image/webp,image/jpeg"
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className={labelClass}>Skill Name</label>
                              <input
                                name="name"
                                defaultValue={skill.name}
                                required
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Category</label>
                              <select
                                name="category"
                                defaultValue={skill.category ?? "Languages"}
                                className={inputClass}>
                                <option value="Languages">Languages</option>
                                <option value="Frameworks">Frameworks</option>
                                <option value="Tools">Tools</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className={labelClass}>Description</label>
                            <textarea
                              name="description"
                              defaultValue={skill.description ?? ""}
                              rows={2}
                              className={inputClass}
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className={labelClass}>
                                Display Order Number
                              </label>
                              <input
                                name="order"
                                type="number"
                                defaultValue={skill.order}
                                min={1}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>
                                Visibility Status
                              </label>
                              <select
                                name="visible"
                                defaultValue={String(skill.visible)}
                                className={inputClass}>
                                <option value="true">
                                  Visible on Public Site
                                </option>
                                <option value="false">
                                  Hidden from Public Site
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              className="rounded bg-green-600 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white transition hover:bg-green-700 shadow">
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
          );
        })}
      </div>
    </div>
  );
}
