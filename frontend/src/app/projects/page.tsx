import Link from "next/link";
import type {Metadata} from "next";
import {getProjects, splitTags, type Project} from "@/lib/api";
import Paper from "@/components/scrapbook/Paper";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Projects — Habil Baihaki Ramadhan",
  description:
    "Complete archive of software engineering projects, case studies, and experiments.",
};

const TILTS = [-1.1, 0.9, -0.7, 1.2, -0.9, 0.8];

export default async function AllProjectsPage() {
  const rawProjects = await getProjects();
  const projects = [...rawProjects]
    .filter((p: Project) => p.visible !== false)
    .sort((a: Project, b: Project) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-sand-200 pb-6">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sand-700 transition hover:text-terracotta-600">
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          <span>Back to Portfolio</span>
        </Link>

        <span className="rounded-full border border-sand-300 bg-sand-50 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-sand-700">
          {projects.length} {projects.length === 1 ? "Project" : "Projects"}
        </span>
      </div>

      {/* Editorial Archive Header */}
      <header className="mt-10 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-terracotta-600">
          03 / Project Archive
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl md:text-6xl">
          Selected Works &amp; Case Studies
        </h1>
        <p className="mt-4 font-body text-base leading-relaxed text-sand-700 sm:text-lg">
          Every build in this directory includes architecture notes, visual
          snapshots, and links to source repositories or live deployments.
        </p>
      </header>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-sand-300 bg-ivory/70 p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-sand-500">
            Archive Empty
          </p>
          <p className="mt-2 font-display text-2xl text-ink">
            Projects are currently being curated.
          </p>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-12">
          {projects.map((project: Project, i: number) => {
            const sortedImages = [...(project.images || [])]
              .filter((img) => Boolean(img.image_url?.trim()))
              .sort((a, b) => a.order - b.order);
            const cover = sortedImages[0];
            const tags = splitTags(project.tags);

            return (
              <Reveal key={project.id} delay={i * 60}>
                <article className="group flex h-full flex-col justify-between rounded-2xl border border-sand-200/90 bg-ivory/90 p-5 shadow-xs transition-all duration-300 hover:border-sand-300 hover:bg-white/80 hover:shadow-md sm:p-6">
                  <div>
                    {/* Polaroid Cover Image */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="block outline-none">
                      <Paper
                        tape
                        rotate={TILTS[i % TILTS.length]}
                        className="!p-3 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:[--r:0deg] shadow-md">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] border border-sand-200 bg-sand-100">
                          {cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cover.image_url}
                              alt={`${project.title} cover`}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-ivory">
                              <span className="font-display text-6xl text-terracotta-200">
                                {project.title.charAt(0)}
                              </span>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-sand-400">
                                Preview coming soon
                              </span>
                            </div>
                          )}

                          {/* Multi-photo indicator badge */}
                          {sortedImages.length > 1 && (
                            <span className="absolute bottom-2.5 right-2.5 rounded-full border border-white/25 bg-ink/75 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ivory backdrop-blur-xs">
                              {sortedImages.length} Photos
                            </span>
                          )}
                        </div>
                      </Paper>
                    </Link>

                    {/* Project Index + Title */}
                    <div className="mt-7 flex items-baseline justify-between gap-3">
                      <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="transition-colors hover:text-terracotta-600">
                          {project.title}
                        </Link>
                      </h2>
                      <span className="shrink-0 font-mono text-xs text-terracotta-600">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Short Description (summary) */}
                    {project.summary ? (
                      <p className="mt-3 line-clamp-3 border-l-2 border-terracotta-300 pl-3.5 font-body text-sm leading-relaxed text-sand-700 sm:text-[15px]">
                        {project.summary}
                      </p>
                    ) : (
                      <p className="mt-3 font-mono text-xs italic text-sand-500">
                        Explore the full project breakdown and gallery inside.
                      </p>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-md border border-sand-300/80 bg-sand-100/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-sand-800">
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Card Footer: View Project Button + Quick External Links */}
                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200/80 pt-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group/btn inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory transition-all duration-300 hover:bg-terracotta-600 hover:shadow-sm">
                      <span>View Project</span>
                      <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">
                        →
                      </span>
                    </Link>

                    <div className="flex items-center gap-2">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-sand-300 bg-ivory px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-sand-700 transition hover:border-terracotta-500 hover:text-terracotta-600">
                          Demo ↗
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-sand-300 bg-ivory px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-sand-700 transition hover:border-ink hover:text-ink">
                          Code ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </main>
  );
}
