export const dynamic = "force-dynamic";
import {adminFetch} from "@/lib/adminApi";
import {revalidatePath} from "next/cache";
import Paper from "@/components/scrapbook/Paper";
import type {Section} from "@/lib/api";

const SECTION_CATALOG: Array<{
  key: string;
  index: string;
  title: string;
  description: string;
  activeInPage: boolean;
}> = [
  {
    key: "hero",
    index: "00",
    title: "Hero Banner",
    description: "Top introduction, headline, portrait & key stat counters.",
    activeInPage: true,
  },
  {
    key: "about",
    index: "01",
    title: "About Me",
    description: "Personal bio, story, and background photo.",
    activeInPage: true,
  },
  {
    key: "skills",
    index: "02",
    title: "Skills & Stack",
    description: "Interactive kinetic logo marquee & categorized Bento grid.",
    activeInPage: true,
  },
  {
    key: "projects",
    index: "03",
    title: "Featured Projects",
    description: "Home page 6-photo Polaroid contact sheet & /projects link.",
    activeInPage: true,
  },
  {
    key: "experience",
    index: "04",
    title: "Work Experience",
    description: "Career dossier timeline, internships & organization roles.",
    activeInPage: true,
  },
  {
    key: "certificates",
    index: "05",
    title: "Certificates & Honors",
    description: "Archival credential vouchers with perforated score stubs.",
    activeInPage: true,
  },
  {
    key: "timeline",
    index: "06",
    title: "Journey & Milestones",
    description:
      "Scroll-reactive vertical roadmap of academic & life milestones.",
    activeInPage: true,
  },
  {
    key: "contact",
    index: "07",
    title: "Contact Dispatch",
    description: "Direct email card, location badge & postal message form.",
    activeInPage: true,
  },
  {
    key: "blog",
    index: "08",
    title: "Blog & Notes",
    description:
      "Reserved section toggle for future articles & engineering notes.",
    activeInPage: false,
  },
  {
    key: "achievements",
    index: "09",
    title: "Achievements & Awards",
    description: "Reserved section toggle for competitions & honors.",
    activeInPage: false,
  },
];

async function getSections(): Promise<Section[]> {
  try {
    const res = await adminFetch("/api/admin/sections", {cache: "no-store"});
    if (Array.isArray(res)) return res;
  } catch {
    // Fallback to public endpoint
  }
  try {
    const baseUrl = (
      process.env.BACKEND_URL || "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");
    const res = await fetch(`${baseUrl}/api/sections`, {
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
  revalidatePath("/");
}

export default async function SectionsAdminPage() {
  const saved = await getSections();
  const sections = SECTION_CATALOG.map((meta) => {
    const found = saved.find((s: Section) => s.key === meta.key);
    return {
      ...meta,
      visible: found ? found.visible : true,
    };
  });

  const visibleCount = sections.filter((s) => s.visible).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand-200 pb-5">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-ink">
            Section Visibility
          </h1>
          <p className="mt-1 font-mono text-xs text-sand-500">
            Show or hide any section on your live portfolio without deleting its
            underlying database records. Navigation links in the header update
            automatically.
          </p>
        </div>

        <span className="rounded-full border border-sand-300 bg-ivory px-3.5 py-1.5 font-mono text-xs text-sand-700">
          {visibleCount} / {sections.length} Sections Active
        </span>
      </div>

      <Paper rotate={-0.3} tape className="!p-6 sm:!p-8">
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.key}
              className={`flex flex-col justify-between gap-4 rounded-xl border p-4 transition-all ${
                section.visible
                  ? "border-sand-200 bg-ivory shadow-2xs hover:border-terracotta-300"
                  : "border-dashed border-sand-300 bg-sand-100/50 opacity-65"
              }`}>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-terracotta-600">
                      {section.index} /
                    </span>
                    <h2 className="font-display text-lg text-ink">
                      {section.title}
                    </h2>
                  </div>

                  <span className="rounded bg-sand-100 px-2 py-0.5 font-mono text-[10px] text-sand-600">
                    #{section.key}
                  </span>
                </div>

                <p className="mt-1.5 font-body text-xs leading-relaxed text-sand-600">
                  {section.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-sand-200/70 pt-3">
                <span
                  className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
                    section.visible ? "text-green-700" : "text-sand-500"
                  }`}>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      section.visible ? "bg-green-600" : "bg-sand-400"
                    }`}
                  />
                  {section.visible ? "Visible on Live Site" : "Hidden on Site"}
                </span>

                <form action={toggleSection}>
                  <input type="hidden" name="key" value={section.key} />
                  <input
                    type="hidden"
                    name="visible"
                    value={String(section.visible)}
                  />
                  <button
                    type="submit"
                    className={`rounded-full border px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider transition ${
                      section.visible
                        ? "border-sand-300 bg-white text-sand-700 hover:border-terracotta-400 hover:text-terracotta-600"
                        : "border-green-500 bg-green-600 text-ivory hover:bg-green-700"
                    }`}>
                    {section.visible ? "Hide Section" : "Show Section"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}
