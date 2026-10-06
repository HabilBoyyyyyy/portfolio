import type {Profile} from "@/lib/api";
import TiltCard from "@/components/hero/TiltCard";
import Paper from "@/components/scrapbook/Paper";

export default function Hero({profile}: {profile: Profile | null}) {
  const name = profile?.name ?? "Habil Baihaki Ramadhan";

  const stats = [
    {label: "Projects", value: profile?.stat_projects},
    {label: "Years learning", value: profile?.stat_years},
    {label: "Certifications", value: profile?.stat_certs},
  ].filter((s) => s.value);
  const tilts = [-2, 1.5, -1];

  return (
    <section
      id="home"
      className="mx-auto grid min-h-screen max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-terracotta-600">
          Informatics student · Web developer · Open to work
        </p>

        <h1 className="mt-5 font-display text-5xl leading-[1.05] text-ink md:text-7xl">
          {profile?.tagline ?? "I build digital experiences that matter."}
        </h1>

        {profile?.bio && (
          <p className="mt-6 line-clamp-3 max-w-xl text-lg text-sand-700">
            {profile.bio}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-terracotta-600 px-6 py-3 text-sm font-medium text-ivory transition hover:bg-terracotta-700">
            View projects
          </a>
          {profile?.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-sand-300 px-6 py-3 text-sm font-medium transition hover:border-terracotta-600 hover:text-terracotta-600">
              Download CV
            </a>
          )}
        </div>

        {stats.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <Paper
                key={s.label}
                rotate={tilts[i % tilts.length]}
                className="min-w-28 !p-4 text-center">
                <p className="font-display text-3xl text-terracotta-600">
                  {s.value}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-sand-600">
                  {s.label}
                </p>
              </Paper>
            ))}
          </div>
        )}

        <Paper tape rotate={-1.2} className="mt-12 max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-widest text-green-600">
            About this site
          </p>
          <p className="mt-2 text-sm text-sand-800">
            Designed and built from scratch with Next.js, FastAPI and
            PostgreSQL. Everything on this page is editable from a private admin
            dashboard I wrote for it.
          </p>
        </Paper>
      </div>

      <TiltCard
        name={name}
        role="Informatics Student & Web Developer"
        location="East Bekasi, Indonesia"
        status="Open to work"
        photo="/images/profile.webp"
      />
    </section>
  );
}
