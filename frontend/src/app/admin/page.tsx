export const dynamic = 'force-dynamic';

import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import ImageUpload from "@/components/admin/ImageUpload";
import Paper from "@/components/scrapbook/Paper";

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
      role: formData.get("role"),
      tagline: formData.get("tagline"),
      bio: formData.get("bio"),
      email: formData.get("email"),
      resume_url: formData.get("resume_url"),
      hero_image_url: formData.get("hero_image_url"),
      about_image_url: formData.get("about_image_url"),
      stat_projects: formData.get("stat_projects"),
      stat_years: formData.get("stat_years"),
      stat_certs: formData.get("stat_certs"),
    }),
  });
  revalidatePath("/admin");
}

export default async function ProfileAdminPage() {
  const profile = await getProfile();

  const inputClass = "w-full rounded border border-sand-300 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600 font-mono";
  const labelClass = "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-ink uppercase tracking-wider">Profile Setup</h1>

      <form action={updateProfile} className="space-y-8">
        
        <Paper rotate={0.5} tape className="!p-8">
          <h2 className="font-display text-2xl text-terracotta-600 mb-6 border-b border-sand-200 pb-2">Identity</h2>
          
          <div className="grid gap-6">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="name"
                defaultValue={profile.name}
                placeholder="Name"
                className={inputClass}
              />
            </div>
            
            <div>
              <label className={labelClass}>Job Role (Badge in About section)</label>
              <input
                name="role"
                defaultValue={profile.role || "Full-Stack Developer & AI Engineer"}
                placeholder="e.g. UI/UX Designer & Web Developer"
                className={inputClass}
              />
            </div>
            
            <div>
              <label className={labelClass}>Hero Tagline (Short description)</label>
              <input
                name="tagline"
                defaultValue={profile.tagline}
                placeholder="Tagline"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>About Me Bio (Detailed story)</label>
              <textarea
                name="bio"
                defaultValue={profile.bio}
                placeholder="Bio"
                rows={5}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Contact Email</label>
              <input
                name="email"
                defaultValue={profile.email}
                placeholder="Contact email"
                className={inputClass}
              />
            </div>
          </div>
        </Paper>

        <Paper rotate={-0.5} tape className="!p-8">
          <h2 className="font-display text-2xl text-terracotta-600 mb-6 border-b border-sand-200 pb-2">Statistics</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Projects Completed</label>
              <input
                name="stat_projects"
                defaultValue={profile.stat_projects}
                placeholder="e.g. 4+"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Years Experience</label>
              <input
                name="stat_years"
                defaultValue={profile.stat_years}
                placeholder="e.g. 1+"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Certifications</label>
              <input
                name="stat_certs"
                defaultValue={profile.stat_certs}
                placeholder="e.g. 3+"
                className={inputClass}
              />
            </div>
          </div>
        </Paper>

        <Paper rotate={0.5} tape className="!p-8">
          <h2 className="font-display text-2xl text-terracotta-600 mb-6 border-b border-sand-200 pb-2">Assets & Documents</h2>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Resume PDF</label>
              <ImageUpload name="resume_url" accept="application/pdf" existingUrl={profile.resume_url} />
            </div>
            <div>
              <label className={labelClass}>Hero Section Photo</label>
              <ImageUpload name="hero_image_url" accept="image/*" existingUrl={profile.hero_image_url} />
            </div>
            <div>
              <label className={labelClass}>About Section Photo</label>
              <ImageUpload name="about_image_url" accept="image/*" existingUrl={profile.about_image_url} />
            </div>
          </div>
        </Paper>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="rounded-full bg-terracotta-600 px-8 py-3 font-mono text-xs uppercase tracking-widest text-ivory transition hover:bg-terracotta-700 shadow-lg hover:-translate-y-0.5 hover:shadow-xl">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
