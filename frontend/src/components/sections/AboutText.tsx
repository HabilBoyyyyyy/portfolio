import {socials} from "@/lib/site";

export default function AboutText({
  name,
  role,
  bio,
  email,
  resumeUrl,
}: {
  name: string;
  role: string | null;
  bio: string;
  email?: string | null;
  resumeUrl: string | null;
}) {
  const defaultBio =
    "Informatics student at President University with a focus on AI/ML and full-stack web development. I build systems where software meets the real world — from IoT-connected campus apps to robotic arms and industrial inspection prototypes.";

  const displayBio = bio && bio.trim().length > 10 ? bio.trim() : defaultBio;

  // Render all non-empty paragraphs (fixes the old .slice(0, 2) truncation bug)
  const paragraphs = displayBio
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const cleanRole = role?.trim() || "Full-Stack Developer & AI Engineer";

  return (
    <div className="space-y-6">
      {/* ── Dossier Header ── */}
      <div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-terracotta-600">
          <span>PROFILE DOSSIER</span>
          <span className="text-sand-300">//</span>
          <span className="text-sand-600">{cleanRole}</span>
        </div>

        <h3 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
          {name}
        </h3>
      </div>

      {/* ── Narrative Paragraphs (All paragraphs preserved) ── */}
      <div className="space-y-4 border-l-2 border-terracotta-600/70 pl-4 sm:pl-5">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-[15px] leading-relaxed text-sand-800 sm:text-base">
            {para}
          </p>
        ))}
      </div>

      {/* ── Compact Quick-Facts Grid ── */}
      <div className="grid grid-cols-2 gap-3 rounded-sm border border-sand-300 bg-sand-50/70 p-3.5 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-500">
            Focus
          </p>
          <p className="mt-0.5 font-mono text-xs font-medium text-ink">
            Full-Stack &amp; AI/ML
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-500">
            Base
          </p>
          <p className="mt-0.5 font-mono text-xs font-medium text-ink">
            Bekasi, Indonesia
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand-500">
            Direct Line
          </p>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-0.5 block truncate font-mono text-xs font-medium text-terracotta-600 hover:underline">
              {email}
            </a>
          ) : (
            <p className="mt-0.5 font-mono text-xs font-medium text-ink">
              Open via Contact Form
            </p>
          )}
        </div>
      </div>

      {/* ── Actions & Social Links ── */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory transition hover:bg-terracotta-600">
            <span>Download CV</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-ivory px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sand-700 transition hover:border-terracotta-600 hover:text-terracotta-600">
              <span>{s.label}</span>
              <span aria-hidden="true" className="text-[10px]">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
