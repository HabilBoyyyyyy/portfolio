export const dynamic = 'force-dynamic';
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import type {Section} from "@/lib/api";

const KNOWN_SECTIONS = [
  "hero",
  "about",
  "skills",
  "projects",
  "certificates",
  "timeline",
  "contact",
  "experience",
  "blog",
  "achievements",
];

async function getSections() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/sections`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function toggleSection(formData: FormData) {
  "use server";
  const key = formData.get("key") as string;
  const currentlyVisible = formData.get("visible") === "true";
  await adminFetch(`/api/admin/sections/${key}`, {
    method: "PUT",
    body: JSON.stringify({visible: !currentlyVisible}),
  });
  revalidatePath("/admin/sections");
}

export default async function SectionsAdminPage() {
  const saved = await getSections();
  const sections = KNOWN_SECTIONS.map((key) => {
    const found = saved.find((s: Section) => s.key === key);
    return {key, visible: found ? found.visible : true};
  });

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-2xl font-bold">Section Visibility</h1>
      <p className="text-sm text-gray-500">
        Hide a section from the live site without deleting its content.
      </p>
      {sections.map((section) => (
        <div
          key={section.key}
          className="p-4 border rounded-lg bg-white flex items-center justify-between">
          <span className="capitalize">{section.key}</span>
          <form action={toggleSection}>
            <input type="hidden" name="key" value={section.key} />
            <input
              type="hidden"
              name="visible"
              value={String(section.visible)}
            />
            <button
              type="submit"
              className={`text-sm px-3 py-1 rounded border ${section.visible ? "text-[#2F5233]" : "text-[#B33A2E]"}`}>
              {section.visible
                ? "Visible — click to hide"
                : "Hidden — click to show"}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

