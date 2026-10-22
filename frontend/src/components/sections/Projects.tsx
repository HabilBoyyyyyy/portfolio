import Link from "next/link";
import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import Paper from "@/components/scrapbook/Paper";
import type {Project} from "@/lib/api";

const TILTS = [-1.4, 1.1, -0.8, 1.3, -1.0, 0.9];
const MAX_PREVIEW_PROJECTS = 6;

export default function Projects({projects}: {projects: Project[]}) {
  const visibleProjects = [...projects]
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const featuredProjects = visibleProjects.slice(0, MAX_PREVIEW_PROJECTS);

  return (
    <SectionShell id="projects" label="03 / Projects" title="My Work">
      {featuredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand-300 bg-ivory/60 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-sand-500">
            03 / Archive Empty
          </p>
          <p className="mt-1 font-display text-lg text-ink">
            Projects coming soon.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {/* Picture-Only Polaroid Contact Sheet (Max 6) */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 md:gap-9">
            {featuredProjects.map((project, i) => {
              const sortedImages = [...(project.images || [])]
                .filter((img) => Boolean(img.image_url?.trim()))
                .sort((a, b) => a.order - b.order);
              const cover = sortedImages[0];

              return (
                <Reveal key={project.id} delay={i * 70}>
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={project.title}
                    className="group block outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 focus-visible:ring-offset-4">
                    <Paper
                      tape
                      rotate={TILTS[i % TILTS.length]}
                      className="!p-3.5 sm:!p-4 transition-all duration-500 ease-out hover:-translate-y-2 hover:[--r:0deg] shadow-md hover:shadow-xl">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-sand-200 bg-sand-100">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover.image_url}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-ivory">
                            <span className="font-display text-6xl text-terracotta-300 transition-transform duration-500 group-hover:scale-110">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Subtle photographic gloss */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/10 via-transparent to-white/20 opacity-80 transition-opacity duration-300 group-hover:opacity-40" />

                        {/* Minimal corner frame index stamp (no text/description clutter) */}
                        <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full border border-white/30 bg-ink/70 px-2 py-0.5 font-mono text-[10px] tracking-widest text-ivory backdrop-blur-xs transition-transform duration-300 group-hover:bg-terracotta-600">
                          {String(i + 1).padStart(2, "0")} ↗
                        </span>
                      </div>
                    </Paper>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* CTA Bar leading to the dedicated /projects page */}
          <div className="flex flex-col items-center justify-center pt-2">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3.5 rounded-full border border-ink bg-ink px-8 py-3.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta-600 hover:bg-terracotta-600 hover:shadow-[0_8px_24px_rgba(193,80,46,0.28)]">
              <span>View Projects</span>
              {visibleProjects.length > 0 && (
                <span className="rounded-full bg-ivory/15 px-2 py-0.5 text-[10px] text-ivory">
                  {visibleProjects.length}
                </span>
              )}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
