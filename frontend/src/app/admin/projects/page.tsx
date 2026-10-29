export const dynamic = "force-dynamic";
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import ImageUpload from "@/components/admin/ImageUpload";
import Paper from "@/components/scrapbook/Paper";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type {Project} from "@/lib/api";

async function getProjects(): Promise<Project[]> {
  try {
    const res = await adminFetch("/api/admin/projects");
    return res;
  } catch {
    return [];
  }
}

function revalidateAllProjectPaths(slug?: string | null) {
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }
}

async function createProject(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") || "").trim();
  await adminFetch("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify({
      title: formData.get("title"),
      slug,
      summary: formData.get("summary"),
      write_up: formData.get("write_up"),
      tags: formData.get("tags"),
      repo_url: formData.get("repo_url"),
      demo_url: formData.get("demo_url"),
      order: Number(formData.get("order")) || 0,
      visible: true,
    }),
  });
  revalidateAllProjectPaths(slug);
}

async function updateProject(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const slug = String(formData.get("slug") || "").trim();
  await adminFetch(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: formData.get("title"),
      slug,
      summary: formData.get("summary"),
      write_up: formData.get("write_up"),
      tags: formData.get("tags"),
      repo_url: formData.get("repo_url"),
      demo_url: formData.get("demo_url"),
      order: Number(formData.get("order")) || 0,
      visible: formData.get("visible") === "true",
    }),
  });
  revalidateAllProjectPaths(slug);
}

async function deleteProject(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/projects/${id}`, {method: "DELETE"});
  revalidateAllProjectPaths();
}

async function toggleVisible(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/projects/${id}/visibility`, {
    method: "PATCH",
  });
  revalidateAllProjectPaths();
}

async function moveProject(formData: FormData) {
  "use server";
  const payloadStr = formData.get("reorder_payload") as string;
  if (!payloadStr) return;

  const parsed = JSON.parse(payloadStr) as {
    projects: Array<{
      id: number;
      order: number;
      slug: string;
      title: string;
      summary?: string | null;
      write_up?: string | null;
      tags?: string | null;
      repo_url?: string | null;
      demo_url?: string | null;
      visible: boolean;
    }>;
  };

  // Try dedicated batch reorder endpoint first; if backend doesn't have /projects/reorder,
  // automatically fall back to updating each project via existing PUT /api/admin/projects/{id}
  try {
    await adminFetch("/api/admin/projects/reorder", {
      method: "PUT",
      body: JSON.stringify({
        projects: parsed.projects.map((p) => ({id: p.id, order: p.order})),
      }),
    });
  } catch {
    for (const p of parsed.projects) {
      await adminFetch(`/api/admin/projects/${p.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: p.title,
          slug: p.slug,
          summary: p.summary ?? "",
          write_up: p.write_up ?? "",
          tags: p.tags ?? "",
          repo_url: p.repo_url ?? "",
          demo_url: p.demo_url ?? "",
          order: p.order,
          visible: p.visible,
        }),
      });
    }
  }

  revalidateAllProjectPaths();
}

async function addProjectImage(formData: FormData) {
  "use server";
  const projectId = formData.get("project_id");
  const slug = String(formData.get("slug") || "");
  const imageUrl = String(formData.get("image_url") || "").trim();
  if (!imageUrl) return;
  await adminFetch(`/api/admin/projects/${projectId}/images`, {
    method: "POST",
    body: JSON.stringify({
      image_url: imageUrl,
      order: Number(formData.get("order")) || 0,
    }),
  });
  revalidateAllProjectPaths(slug);
}

async function deleteProjectImage(formData: FormData) {
  "use server";
  const projectId = formData.get("project_id");
  const imageId = formData.get("image_id");
  const slug = String(formData.get("slug") || "");
  await adminFetch(`/api/admin/projects/${projectId}/images/${imageId}`, {
    method: "DELETE",
  });
  revalidateAllProjectPaths(slug);
}

function buildMovePayload(
  projects: Project[],
  currentIndex: number,
  direction: "up" | "down",
): string | null {
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= projects.length) return null;
  const reordered = [...projects];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, moved);
  return JSON.stringify({
    projects: reordered.map((p, idx) => ({
      id: p.id,
      order: idx + 1,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      write_up: p.write_up,
      tags: p.tags,
      repo_url: p.repo_url,
      demo_url: p.demo_url,
      visible: p.visible,
    })),
  });
}

export default async function ProjectsAdminPage() {
  const rawProjects = await getProjects();
  const projects = [...rawProjects].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const visibleCount = projects.filter((p) => p.visible).length;

  const inputClass =
    "w-full rounded border border-sand-300 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600 font-mono";
  const labelClass =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider text-ink break-words">
          Projects Management
        </h1>
      </div>

      {/* Add New Project Card */}
      <Paper rotate={-0.4} tape className="max-sm:[rotate:0deg] !p-4 sm:!p-6 md:!p-8">
        <form action={createProject} className="space-y-6">
          <h2 className="mb-2 border-b border-sand-200 pb-2 font-display text-xl sm:text-2xl text-terracotta-600">
            Add New Project
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Project Title</label>
              <input
                name="title"
                placeholder="e.g. Neural Search Engine"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>URL Slug</label>
              <input
                name="slug"
                placeholder="e.g. neural-search-engine"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Short Description (Shown on /projects Archive Page)
            </label>
            <textarea
              name="summary"
              placeholder="1–2 sentence overview of the problem and solution"
              rows={2}
              className={inputClass}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>Tags (Comma-separated)</label>
              <input
                name="tags"
                placeholder="Next.js, FastAPI, PostgreSQL"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Repository URL (Optional)</label>
              <input
                name="repo_url"
                placeholder="https://github.com/..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Live Demo URL (Optional)</label>
              <input
                name="demo_url"
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Full Case Study Write-Up (Markdown)
            </label>
            <textarea
              name="write_up"
              placeholder="## Overview&#10;Write your full project case study in Markdown..."
              rows={5}
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
              defaultValue={projects.length + 1}
              min={0}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-terracotta-600 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-md transition hover:-translate-y-0.5 hover:bg-terracotta-700 cursor-pointer text-center">
              + Add Project
            </button>
          </div>
        </form>
      </Paper>

      {/* Current Projects List with ▲ / ▼ Reorder Controls */}
      <div className="space-y-4">
        <div className="pl-1 sm:pl-2">
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-ink">
            Current Projects
            <span className="block sm:inline sm:ml-3 font-mono text-xs sm:text-sm normal-case tracking-normal text-sand-500 mt-1 sm:mt-0">
              {projects.length} total · {visibleCount} visible (Top 6 shown on
              Home Page)
            </span>
          </h2>
          <p className="mt-1 font-mono text-xs text-sand-500">
            Use ▲ and ▼ to reorder projects. The first 6 visible projects appear
            in the Home Page picture showcase, and all visible projects appear
            on /projects in this exact order.
          </p>
        </div>

        {projects.length === 0 && (
          <p className="pl-2 font-mono text-sm text-sand-500">
            No projects yet.
          </p>
        )}

        <div className="flex flex-col gap-3 max-w-full">
          {projects.map((project: Project, index: number) => {
            const upPayload = buildMovePayload(projects, index, "up");
            const downPayload = buildMovePayload(projects, index, "down");
            const sortedImages = [...(project.images || [])].sort(
              (a, b) => a.order - b.order,
            );
            const cover = sortedImages[0];
            const isFeaturedOnHome =
              project.visible &&
              projects
                .filter((p) => p.visible)
                .findIndex((p) => p.id === project.id) < 6;

            return (
              <div
                key={project.id}
                className={`min-w-0 max-w-full overflow-hidden rounded-lg border bg-ivory p-4 shadow-sm transition-all ${
                  !project.visible
                    ? "border-dashed border-sand-300 bg-sand-100/50 opacity-60"
                    : "border-sand-200 hover:border-terracotta-300 hover:shadow-md"
                }`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  {/* Left + Middle: Reorder + Badge + Thumbnail + Info */}
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    {/* ▲ / ▼ Reorder Controls */}
                    <div className="flex shrink-0 flex-col gap-1">
                      <form action={moveProject}>
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
                      <form action={moveProject}>
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

                    {/* Order badge */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-200 font-mono text-xs font-bold text-sand-700">
                      #{index + 1}
                    </div>

                    {/* Cover Thumbnail */}
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.image_url}
                        alt=""
                        className="hidden h-12 w-16 shrink-0 rounded border border-sand-200 bg-white object-cover xs:block sm:block"
                      />
                    ) : (
                      <div className="hidden h-12 w-16 shrink-0 items-center justify-center rounded border border-sand-200 bg-terracotta-100 font-display text-lg text-terracotta-700 xs:flex sm:flex">
                        {project.title[0]}
                      </div>
                    )}

                    {/* Project Info (min-w-0 prevents text from stretching the card) */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <p className="truncate font-display text-base leading-tight text-ink sm:text-lg">
                          {project.title}
                        </p>
                        <span className="max-w-[140px] truncate rounded bg-sand-100 px-2 py-0.5 font-mono text-[10px] text-sand-600 sm:max-w-none">
                          /{project.slug}
                        </span>
                        {isFeaturedOnHome && (
                          <span className="shrink-0 rounded-full border border-terracotta-300 bg-terracotta-50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-terracotta-700">
                            ★ Home Top 6
                          </span>
                        )}
                      </div>

                      {project.summary && (
                        <p className="mt-1 line-clamp-2 break-words text-xs leading-relaxed text-sand-600 sm:line-clamp-1">
                          {project.summary}
                        </p>
                      )}

                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-sand-400">
                        {project.visible
                          ? "✓ Visible on Site"
                          : "✗ Hidden from Public"}{" "}
                        · {sortedImages.length}{" "}
                        {sortedImages.length === 1 ? "photo" : "photos"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Actions (wraps cleanly to bottom bar on mobile) */}
                  <div className="flex shrink-0 items-center justify-end gap-2 border-t border-sand-200/60 pt-2.5 sm:border-t-0 sm:pt-0">
                    <form action={toggleVisible}>
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        title={
                          project.visible
                            ? "Hide this project from public"
                            : "Show this project to public"
                        }
                        className={`w-20 rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition ${
                          project.visible
                            ? "border-sand-300 text-sand-600 hover:bg-sand-200"
                            : "border-green-400 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}>
                        {project.visible ? "Hide" : "Show"}
                      </button>
                    </form>

                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={project.id} />
                      <ConfirmDeleteButton
                        skillName={project.title}
                        className="w-20 rounded border border-red-200 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-red-600 transition hover:border-red-300 hover:bg-red-50"
                      />
                    </form>
                  </div>
                </div>

                {/* Expandable Edit Details & Gallery Manager */}
                <details className="group mt-3 border-t border-sand-200 pt-3">
                  <summary className="cursor-pointer select-none font-mono text-xs uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700">
                    Edit Details &amp; Gallery Photos ({sortedImages.length}) ▾
                  </summary>

                  <div className="mt-4 space-y-6 rounded border border-sand-200 bg-white p-5">
                    {/* Update Project Form */}
                    <form action={updateProject} className="space-y-4">
                      <input type="hidden" name="id" value={project.id} />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className={labelClass}>Project Title</label>
                          <input
                            name="title"
                            defaultValue={project.title}
                            required
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>URL Slug</label>
                          <input
                            name="slug"
                            defaultValue={project.slug}
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Short Description</label>
                        <textarea
                          name="summary"
                          defaultValue={project.summary ?? ""}
                          rows={2}
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
                            defaultValue={project.tags ?? ""}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Repository URL</label>
                          <input
                            name="repo_url"
                            defaultValue={project.repo_url ?? ""}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Live Demo URL</label>
                          <input
                            name="demo_url"
                            defaultValue={project.demo_url ?? ""}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Full Write-Up (Markdown)
                        </label>
                        <textarea
                          name="write_up"
                          defaultValue={project.write_up ?? ""}
                          rows={6}
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
                            defaultValue={project.order}
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
                            defaultValue={String(project.visible)}
                            className={inputClass}>
                            <option value="true">Visible on Public Site</option>
                            <option value="false">
                              Hidden from Public Site
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="rounded bg-green-600 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white shadow transition hover:bg-green-700">
                          Save Project Details
                        </button>
                      </div>
                    </form>

                    {/* Gallery Images Management */}
                    <div className="border-t border-sand-200 pt-5">
                      <h4 className="font-display text-lg text-ink">
                        Gallery Stack Photos ({sortedImages.length})
                      </h4>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-sand-500">
                        Photo #1 is used as the cover snapshot on the Home Page
                        and /projects Archive.
                      </p>

                      {sortedImages.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {sortedImages.map((img, i) => (
                            <div
                              key={img.id}
                              className="relative rounded border border-sand-200 bg-ivory p-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.image_url}
                                alt=""
                                className="aspect-[4/3] w-full rounded object-cover"
                              />
                              <div className="mt-2 flex items-center justify-between">
                                <span className="font-mono text-[10px] text-sand-600">
                                  #{i + 1} {i === 0 ? "(Cover)" : ""}
                                </span>
                                <form action={deleteProjectImage}>
                                  <input
                                    type="hidden"
                                    name="project_id"
                                    value={project.id}
                                  />
                                  <input
                                    type="hidden"
                                    name="image_id"
                                    value={img.id}
                                  />
                                  <input
                                    type="hidden"
                                    name="slug"
                                    value={project.slug}
                                  />
                                  <button
                                    type="submit"
                                    className="font-mono text-[10px] uppercase text-red-600 hover:underline">
                                    Remove
                                  </button>
                                </form>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <form
                        action={addProjectImage}
                        className="mt-4 flex flex-col gap-3 rounded border border-dashed border-sand-300 bg-sand-50/50 p-3 sm:flex-row sm:items-end">
                        <input
                          type="hidden"
                          name="project_id"
                          value={project.id}
                        />
                        <input type="hidden" name="slug" value={project.slug} />
                        <input
                          type="hidden"
                          name="order"
                          value={sortedImages.length + 1}
                        />
                        <div className="flex-1">
                          <label className={labelClass}>
                            Add Photo to Stack
                          </label>
                          <ImageUpload
                            name="image_url"
                            accept="image/svg+xml,image/png,image/webp,image/jpeg"
                          />
                        </div>
                        <button
                          type="submit"
                          className="rounded bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-ivory transition hover:bg-terracotta-600">
                          + Add Photo
                        </button>
                      </form>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
