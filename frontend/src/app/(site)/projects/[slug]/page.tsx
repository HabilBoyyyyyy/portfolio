import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {getProject, splitTags} from "@/lib/api";
import Gallery from "@/components/project/Gallery";
import Markdown from "@/components/project/Markdown";
import Paper from "@/components/scrapbook/Paper";

type Props = {params: Promise<{slug: string}>};

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
  const project = await getProject(slug);
  if (!project) notFound();

  const images = [...project.images].sort((a, b) => a.order - b.order);
  const tags = splitTags(project.tags);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/#projects"
        className="font-mono text-xs uppercase tracking-widest text-sand-700 transition hover:text-terracotta-600">
        ← All projects
      </Link>

      <header className="mt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-terracotta-600">
          Project
        </p>
        <h1 className="mt-2 font-display text-5xl text-ink md:text-6xl">
          {project.title}
        </h1>
        {project.summary && (
          <p className="mt-4 max-w-2xl text-lg text-sand-700">
            {project.summary}
          </p>
        )}

        {tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t}
                className="rounded-full bg-green-100 px-3 py-1 font-mono text-xs text-green-700">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-terracotta-600 px-5 py-2.5 text-sm font-medium text-ivory transition hover:bg-terracotta-700">
              View source ↗
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-sand-300 px-5 py-2.5 text-sm font-medium transition hover:border-terracotta-600 hover:text-terracotta-600">
              Live demo ↗
            </a>
          )}
        </div>
      </header>

      {images.length > 0 && (
        <div className="mt-12">
          <Gallery images={images} title={project.title} />
        </div>
      )}

      <div className="mt-14">
        <Paper tape rotate={0.4} className="max-w-3xl !p-8 md:!p-10">
          {project.write_up ? (
            <Markdown>{project.write_up}</Markdown>
          ) : (
            <p className="text-sand-600">
              The full write-up for this project is coming soon.
            </p>
          )}
        </Paper>
      </div>
    </main>
  );
}
