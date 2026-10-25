export const dynamic = "force-dynamic";

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

function cleanField(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function updateProfile(formData: FormData) {
  "use server";
  await adminFetch("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify({
      name: cleanField(formData, "name") || "Habil Baihaki Ramadhan",
      role: cleanField(formData, "role"),
      tagline: cleanField(formData, "tagline"),
      bio: cleanField(formData, "bio"),
      email: cleanField(formData, "email"),
      resume_url: cleanField(formData, "resume_url"),
      hero_image_url: cleanField(formData, "hero_image_url"),
      about_image_url: cleanField(formData, "about_image_url"),
      stat_projects: cleanField(formData, "stat_projects"),
      stat_years: cleanField(formData, "stat_years"),
      stat_certs: cleanField(formData, "stat_certs"),
    }),
  });
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  revalidatePath("/");
}

export default async function ProfileAdminPage() {
  const profile = await getProfile();

  const inputClass =
    "w-full rounded-sm border border-sand-300 bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta-600";
  const monoInputClass =
    "w-full rounded-sm border border-sand-300 bg-ivory px-3.5 py-2 text-sm font-mono text-ink outline-none transition focus:border-terracotta-600";
  const labelClass =
    "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-sand-600";

  const hasResume = Boolean(profile.resume_url);
  const hasHeroPhoto = Boolean(profile.hero_image_url);
  const hasAboutPhoto = Boolean(profile.about_image_url);

  return (
    <div className="space-y-8">
      {/* ── Editorial Page Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand-300 pb-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-terracotta-600">
            ADMIN // 01 · IDENTITY &amp; HERO
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
            Profile &amp; Hero Setup
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span
            className={`rounded-full border px-3 py-1 ${
              hasResume
                ? "border-green-600/30 bg-green-50 text-green-700"
                : "border-sand-300 bg-sand-100 text-sand-600"
            }`}>
            CV: {hasResume ? "Linked ✓" : "Not Set"}
          </span>
          <span
            className={`rounded-full border px-3 py-1 ${
              hasHeroPhoto
                ? "border-green-600/30 bg-green-50 text-green-700"
                : "border-sand-300 bg-sand-100 text-sand-600"
            }`}>
            Hero Photo: {hasHeroPhoto ? "Custom ✓" : "Default"}
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-sand-300 bg-ivory px-3 py-1 text-ink transition hover:border-terracotta-600 hover:text-terracotta-600">
            View Live ↗
          </a>
        </div>
      </div>

      <form action={updateProfile} className="space-y-6">
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ── Left Column: Identity & Narrative ── */}
          <Paper
            tape
            rotate={0.2}
            className="max-sm:[rotate:0deg] !p-6 sm:!p-7">
            <div className="mb-5 flex items-center justify-between border-b border-sand-200 pb-3">
              <h2 className="font-display text-xl text-ink">
                Identity &amp; Story
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-500">
                Hero + About
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    name="name"
                    required
                    defaultValue={profile.name || "Habil Baihaki Ramadhan"}
                    placeholder="Habil Baihaki Ramadhan"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Role Badge (Hero &amp; About)
                  </label>
                  <input
                    name="role"
                    defaultValue={
                      profile.role || "Full-Stack Developer & AI Engineer"
                    }
                    placeholder="Full-Stack Developer & AI Engineer"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Hero Tagline (Main Headline)
                </label>
                <input
                  name="tagline"
                  defaultValue={profile.tagline}
                  placeholder="I build digital experiences that matter."
                  className={inputClass}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-600">
                    About Me Bio (Full Story)
                  </label>
                  <span className="font-mono text-[10px] text-sand-500">
                    Use line breaks for paragraphs
                  </span>
                </div>
                <textarea
                  name="bio"
                  defaultValue={profile.bio}
                  placeholder="Write your background, focus areas, and what you love building..."
                  rows={6}
                  className={`${inputClass} leading-relaxed`}
                />
              </div>

              <div>
                <label className={labelClass}>Direct Contact Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  placeholder="habilramadhan1005@gmail.com"
                  className={monoInputClass}
                />
              </div>
            </div>
          </Paper>

          {/* ── Right Column: Metrics & Media Assets ── */}
          <div className="space-y-6">
            {/* Hero Stats */}
            <Paper rotate={-0.2} className="max-sm:[rotate:0deg] !p-6">
              <div className="mb-4 flex items-center justify-between border-b border-sand-200 pb-2.5">
                <h2 className="font-display text-xl text-ink">
                  Hero Metrics Strip
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta-600">
                  3 Counters
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Projects</label>
                  <input
                    name="stat_projects"
                    defaultValue={profile.stat_projects}
                    placeholder="6+"
                    className={monoInputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Years</label>
                  <input
                    name="stat_years"
                    defaultValue={profile.stat_years}
                    placeholder="2+"
                    className={monoInputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Certs</label>
                  <input
                    name="stat_certs"
                    defaultValue={profile.stat_certs}
                    placeholder="4+"
                    className={monoInputClass}
                  />
                </div>
              </div>
            </Paper>

            {/* Assets & Uploads */}
            <Paper rotate={0.2} className="max-sm:[rotate:0deg] !p-6">
              <div className="mb-4 flex items-center justify-between border-b border-sand-200 pb-2.5">
                <h2 className="font-display text-xl text-ink">
                  Media &amp; CV Assets
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-500">
                  Cloudinary / Local
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Resume / CV (PDF)</label>
                  <ImageUpload
                    name="resume_url"
                    accept="application/pdf"
                    existingUrl={profile.resume_url}
                  />
                </div>

                <div>
                  <label className={labelClass}>Hero Card Portrait</label>
                  <ImageUpload
                    name="hero_image_url"
                    accept="image/*"
                    existingUrl={profile.hero_image_url}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    About Me Portrait{" "}
                    {hasAboutPhoto ? "(Custom)" : "(Falls back to Hero)"}
                  </label>
                  <ImageUpload
                    name="about_image_url"
                    accept="image/*"
                    existingUrl={profile.about_image_url}
                  />
                </div>
              </div>
            </Paper>
          </div>
        </div>

        {/* ── Sticky / Bottom Save Bar ── */}
        <div className="flex items-center justify-between rounded-sm border border-sand-300 bg-sand-50/90 px-5 py-3.5">
          <p className="font-mono text-[11px] text-sand-600">
            Saving immediately updates both <span className="text-ink">/</span>{" "}
            (Hero &amp; About) and <span className="text-ink">/admin</span>.
          </p>
          <button
            type="submit"
            className="rounded-full bg-terracotta-600 px-7 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory transition hover:bg-terracotta-700">
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
