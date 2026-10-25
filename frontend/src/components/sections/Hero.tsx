import type {Profile} from "@/lib/api";
import TiltCard from "@/components/hero/TiltCard";

export default function Hero({profile}: {profile: Profile | null}) {
  const name = profile?.name?.trim() || "Habil Baihaki Ramadhan";
  const role = profile?.role?.trim() || "Informatics Student & Web Developer";
  const tagline =
    profile?.tagline?.trim() || "I build digital experiences that matter.";

  // Extract a crisp lead from bio if present (avoids duplicating the full multi-paragraph story from About)
  const rawBio = profile?.bio?.trim() || "";
  const leadSentence = rawBio
    ? rawBio.split(/(?<=[.!?])\s+/)[0]
    : "Building practical software systems where full-stack web engineering meets AI/ML and real-world hardware.";

  const stats = [
    {label: "Projects", value: profile?.stat_projects?.trim()},
    {label: "Years learning", value: profile?.stat_years?.trim()},
    {label: "Certifications", value: profile?.stat_certs?.trim()},
  ].filter((s) => Boolean(s.value));

  return (
    <section
      id="home"
      className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:py-24">
      {/* ── Left Column: Lightweight Editorial Masthead ── */}
      <div>
        {/* Status + Role Eyebrow */}
        <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-sand-300 bg-ivory/90 px-3.5 py-1.5 shadow-2xs">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Open to work
          </span>
          <span className="text-sand-300">·</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-700">
            {role}
          </span>
        </div>

        {/* Main Display Tagline */}
        <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
          {tagline}
        </h1>

        {/* Concise Lead Paragraph */}
        <p className="mt-5 max-w-xl text-base leading-relaxed text-sand-700 sm:text-lg">
          {leadSentence}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta-600 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ivory transition hover:bg-terracotta-700">
            View projects
            <span aria-hidden="true">→</span>
          </a>

          {profile?.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-ivory/80 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-terracotta-600 hover:text-terracotta-600">
              Download CV
              <span aria-hidden="true">↗</span>
            </a>
          )}

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-sand-700 underline decoration-sand-400 underline-offset-4 transition hover:text-terracotta-600 hover:decoration-terracotta-600">
            Let&apos;s talk
          </a>
        </div>

        {/* Lightweight Inline Stat Strip */}
        {stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-sand-300/80 py-4 sm:max-w-lg sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-sand-600">
                  {s.label}
                </dt>
                <dd className="mt-0.5 font-display text-2xl font-medium text-terracotta-600 sm:text-3xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Lightweight Colophon Strip */}
        <p className="mt-5 font-mono text-[11px] leading-relaxed text-sand-500">
          <span className="font-semibold uppercase tracking-[0.16em] text-green-700">
            Colophon //
          </span>{" "}
          Built from scratch with Next.js, FastAPI &amp; PostgreSQL — editable
          live from a custom admin dashboard.
        </p>
      </div>

      {/* ── Right Column: Existing TiltCard (Untouched) ── */}
      <TiltCard
        name={name}
        role={role}
        location="East Bekasi, Indonesia"
        status="Open to work"
        photo={profile?.hero_image_url?.trim() || "/images/profile.webp"}
      />
    </section>
  );
}
