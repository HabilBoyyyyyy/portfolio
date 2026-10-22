import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {getProject, getProjects, splitTags} from "@/lib/api";
import Gallery from "@/components/project/Gallery";
import Markdown from "@/components/project/Markdown";
import Paper from "@/components/scrapbook/Paper";

export type Props = {params: Promise<{slug: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const project = await getProject(slug);
  if (!project) return {title: "Project not found"};
  return {
    title: `${project.title} — Habil Baihaki Ramadhan`,
    description: project.summary ?? undefined,
  };
}

export default async function ProjectPage({params}: Props) {
  const {slug} = await params;
  const [project, allProjects] = await Promise.all([
    getProject(slug),
    getProjects(),
  ]);
  if (!project) notFound();

  const images = [...(project.images || [])]
    .filter((img) => Boolean(img.image_url?.trim()))
    .sort((a, b) => a.order - b.order);
  const tags = splitTags(project.tags);

  const orderedVisible = [...allProjects]
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const currentIndex = orderedVisible.findIndex((p) => p.slug === project.slug);
  const prevProject =
    currentIndex > 0 ? orderedVisible[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < orderedVisible.length - 1
      ? orderedVisible[currentIndex + 1]
      : null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 md:py-20">
      {/* Top Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center justify-between gap-4 border-b border-sand-200 pb-5">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-sand-700 transition hover:text-terracotta-600">
            <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span>All Projects</span>
          </Link>
          <span className="text-sand-300">/</span>
          <Link
            href="/#projects"
            className="text-sand-500 transition hover:text-ink">
            Home
          </Link>
        </div>

        {currentIndex >= 0 && (
          <span className="rounded-full border border-sand-200 bg-sand-50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-sand-600">
            Case Study #{String(currentIndex + 1).padStart(2, "0")} of{" "}
            {orderedVisible.length}
          </span>
        )}
      </nav>

      {/* Editorial Case Study Header */}
      <header className="mt-10 rounded-2xl border border-sand-200/90 bg-ivory/80 p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-block h-2 w-2 rounded-full bg-terracotta-600" />
          <p className="font-mono text-xs uppercase tracking-widest text-terracotta-600">
            Project Dossier
          </p>
          {images.length > 0 && (
            <>
              <span className="text-sand-300">·</span>
              <span className="font-mono text-xs text-sand-500">
                {images.length} {images.length === 1 ? "Snapshot" : "Snapshots"}
              </span>
            </>
          )}
        </div>

        <h1 className="mt-2.5 font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
          {project.title}
        </h1>

        {project.summary && (
          <p className="mt-4 max-w-3xl border-l-2 border-terracotta-400 pl-4 font-body text-base leading-relaxed text-sand-700 sm:text-lg">
            {project.summary}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-5 border-t border-sand-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-green-300/80 bg-green-50 px-3 py-1 font-mono text-xs text-green-700">
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <div />
          )}

          <div className="flex flex-wrap items-center gap-3">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta-600 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-sm transition hover:-translate-y-0.5 hover:bg-terracotta-700">
                <span>Live Demo</span>
                <span>↗</span>
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-sm transition hover:-translate-y-0.5 hover:bg-sand-900">
                <span>View Source</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Fan / Pile / Deck Stack Gallery */}
      {images.length > 0 && (
        <section aria-label="Project Gallery" className="mt-12">
          <Gallery images={images} title={project.title} />
        </section>
      )}

      {/* Case Study Write-Up */}
      <section aria-label="Project Write-up" className="mt-14">
        <Paper
          tape
          rotate={0.3}
          className="mx-auto max-w-3xl !p-7 sm:!p-10 md:!p-12 shadow-lg">
          <div className="mb-6 flex items-center justify-between border-b border-sand-200 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta-600">
              Field Notes &amp; Architecture Write-Up
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-sand-400">
              {project.slug}
            </span>
          </div>

          {project.write_up ? (
            <Markdown>{project.write_up}</Markdown>
          ) : (
            <p className="font-body italic text-sand-600">
              The full engineering write-up for this project is coming soon.
            </p>
          )}
        </Paper>
      </section>

      {/* Bottom Sequential Project Navigation */}
      {(prevProject || nextProject) && (
        <nav
          aria-label="Adjacent projects"
          className="mt-16 grid grid-cols-1 gap-4 border-t border-sand-200 pt-8 sm:grid-cols-2">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-sand-200 bg-ivory p-4 transition hover:border-terracotta-400 hover:bg-white">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sand-500">
                ← Previous Project
              </span>
              <span className="mt-1 font-display text-xl text-ink group-hover:text-terracotta-600">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-sand-200 bg-ivory p-4 text-right transition hover:border-terracotta-400 hover:bg-white">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sand-500">
                Next Project →
              </span>
              <span className="mt-1 font-display text-xl text-ink group-hover:text-terracotta-600">
                {nextProject.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
