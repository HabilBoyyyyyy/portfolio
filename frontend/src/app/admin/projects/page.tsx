import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";

async function getProjects() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/projects`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function createProject(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify({
      slug: formData.get("slug"),
      title: formData.get("title"),
      summary: formData.get("summary"),
      write_up: formData.get("write_up"),
      tags: formData.get("tags"),
      repo_url: formData.get("repo_url"),
      demo_url: formData.get("demo_url"),
      order: Number(formData.get("order")) || 0,
      visible: true,
    }),
  });
  revalidatePath("/admin/projects");
}

async function updateProject(formData: FormData) {
  "use server";
  const id = formData.get("id");
  await adminFetch(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      slug: formData.get("slug"),
      title: formData.get("title"),
      summary: formData.get("summary"),
      write_up: formData.get("write_up"),
      tags: formData.get("tags"),
      repo_url: formData.get("repo_url"),
      demo_url: formData.get("demo_url"),
      order: Number(formData.get("order")) || 0,
      visible: formData.get("visible") === "true",
    }),
  });
  revalidatePath("/admin/projects");
}

async function deleteProject(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/projects/${formData.get("id")}`, {
    method: "DELETE",
  });
  revalidatePath("/admin/projects");
}

async function addImage(formData: FormData) {
  "use server";
  const projectId = formData.get("project_id");
  await adminFetch(`/api/admin/projects/${projectId}/images`, {
    method: "POST",
    body: JSON.stringify({
      image_url: formData.get("image_url"),
      order: Number(formData.get("order")) || 0,
    }),
  });
  revalidatePath("/admin/projects");
}

async function deleteImage(formData: FormData) {
  "use server";
  await adminFetch(`/api/admin/projects/images/${formData.get("image_id")}`, {
    method: "DELETE",
  });
  revalidatePath("/admin/projects");
}

export default async function ProjectsAdminPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Projects</h1>

      <form
        action={createProject}
        className="space-y-3 p-4 border rounded-lg bg-white">
        <h2 className="font-semibold">Add a project</h2>
        <input
          name="slug"
          placeholder="Slug (e.g. the-gallows)"
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
          name="summary"
          placeholder="Short summary (shown on the card)"
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="write_up"
          placeholder="Full write-up (shown on the detail page)"
          rows={5}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="tags"
          placeholder="Tags, comma separated (e.g. JavaScript, Game)"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2">
          <input
            name="repo_url"
            placeholder="GitHub link"
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            name="demo_url"
            placeholder="Demo link (optional)"
            className="w-1/2 border rounded px-3 py-2"
          />
        </div>
        <input
          name="order"
          type="number"
          placeholder="Display order"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-[#C1502E] text-white px-4 py-2 rounded">
          Add Project
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="font-semibold">Current projects</h2>
        {projects.length === 0 && (
          <p className="text-sm text-gray-500">No projects yet.</p>
        )}
        {projects.map((project: any) => (
          <div
            key={project.id}
            className="p-4 border rounded-lg bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {project.title}{" "}
                  <span className="text-sm text-gray-400">/{project.slug}</span>
                </p>
                <p className="text-sm text-gray-500">{project.summary}</p>
                <p className="text-xs text-gray-400">
                  {project.visible ? "Visible" : "Hidden"} · order{" "}
                  {project.order} · tags: {project.tags}
                </p>
              </div>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={project.id} />
                <button
                  type="submit"
                  className="text-sm px-3 py-1 border rounded text-[#B33A2E]">
                  Delete
                </button>
              </form>
            </div>

            <details>
              <summary className="cursor-pointer text-sm text-[#C1502E]">
                Edit project
              </summary>
              <form action={updateProject} className="space-y-2 mt-3">
                <input type="hidden" name="id" value={project.id} />
                <input
                  name="slug"
                  defaultValue={project.slug}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  name="title"
                  defaultValue={project.title}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  name="summary"
                  defaultValue={project.summary}
                  rows={2}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  name="write_up"
                  defaultValue={project.write_up}
                  rows={5}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  name="tags"
                  defaultValue={project.tags}
                  className="w-full border rounded px-3 py-2"
                />
                <div className="flex gap-2">
                  <input
                    name="repo_url"
                    defaultValue={project.repo_url}
                    className="w-1/2 border rounded px-3 py-2"
                  />
                  <input
                    name="demo_url"
                    defaultValue={project.demo_url}
                    className="w-1/2 border rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    name="order"
                    type="number"
                    defaultValue={project.order}
                    className="w-1/2 border rounded px-3 py-2"
                  />
                  <select
                    name="visible"
                    defaultValue={String(project.visible)}
                    className="w-1/2 border rounded px-3 py-2">
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-[#2F5233] text-white px-4 py-2 rounded text-sm">
                  Save changes
                </button>
              </form>
            </details>

            <details>
              <summary className="cursor-pointer text-sm text-[#C1502E]">
                Manage images ({project.images?.length ?? 0})
              </summary>
              <div className="mt-3 space-y-2">
                {project.images?.map((img: any) => (
                  <div key={img.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-16 h-12 object-cover rounded border"
                    />
                    <span className="truncate flex-1">{img.image_url}</span>
                    <form action={deleteImage}>
                      <input type="hidden" name="image_id" value={img.id} />
                      <button type="submit" className="text-[#B33A2E]">
                        Remove
                      </button>
                    </form>
                  </div>
                ))}
                <form action={addImage} className="flex gap-2">
                  <input type="hidden" name="project_id" value={project.id} />
                  <input
                    name="image_url"
                    placeholder="Image URL"
                    className="flex-1 border rounded px-3 py-1 text-sm"
                  />
                  <input
                    name="order"
                    type="number"
                    placeholder="Order"
                    className="w-20 border rounded px-3 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="text-sm px-3 py-1 border rounded">
                    Add
                  </button>
                </form>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
