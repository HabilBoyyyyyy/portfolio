// frontend/src/app/admin/page.tsx

import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";

async function getProfile() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

async function updateProfile(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify({
      name: formData.get("name"),
      tagline: formData.get("tagline"),
      bio: formData.get("bio"),
      email: formData.get("email"),
      stat_projects: formData.get("stat_projects"),
      stat_years: formData.get("stat_years"),
      stat_certs: formData.get("stat_certs"),
    }),
  });
  revalidatePath("/admin");
}

export default async function ProfileAdminPage() {
  const profile = await getProfile();

  return (
    <form action={updateProfile} className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <input
        name="name"
        defaultValue={profile.name}
        placeholder="Name"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="tagline"
        defaultValue={profile.tagline}
        placeholder="Tagline"
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        name="bio"
        defaultValue={profile.bio}
        placeholder="Bio"
        rows={5}
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="email"
        defaultValue={profile.email}
        placeholder="Contact email"
        className="w-full border rounded px-3 py-2"
      />

      <div className="flex gap-2">
        <input
          name="stat_projects"
          defaultValue={profile.stat_projects}
          placeholder="e.g. 4+"
          className="w-1/3 border rounded px-3 py-2"
        />
        <input
          name="stat_years"
          defaultValue={profile.stat_years}
          placeholder="e.g. 1+"
          className="w-1/3 border rounded px-3 py-2"
        />
        <input
          name="stat_certs"
          defaultValue={profile.stat_certs}
          placeholder="e.g. 3+"
          className="w-1/3 border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-[#C1502E] text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}
