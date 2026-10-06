import Link from "next/link";
import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import Paper from "@/components/scrapbook/Paper";
import {splitTags, type Project} from "@/lib/api";

const TILTS = [-1.4, 1, -0.7];

export default function Projects({projects}: {projects: Project[]}) {
  return (
    <SectionShell id="projects" label="03 / Projects" title="Things I've built">
      {projects.length === 0 && (
        <p className="text-sand-600">Projects coming soon.</p>
      )}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const cover = [...p.images].sort((a, b) => a.order - b.order)[0];
          const tags = splitTags(p.tags);

          return (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <Paper
                  tape
                  rotate={TILTS[i % TILTS.length]}
                  className="!p-3 group-hover:-translate-y-2 group-hover:[rotate:0deg]">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm bg-terracotta-100">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.image_url}
                        alt={`${p.title} screenshot`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1">
                        <span className="font-display text-6xl text-terracotta-300">
                          {p.title.charAt(0)}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta-600">
                          No screenshot yet
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-2 pb-2 pt-4">
                    <h3 className="font-display text-xl text-ink">{p.title}</h3>
                    {p.summary && (
                      <p className="mt-2 line-clamp-3 text-sm text-sand-700">
                        {p.summary}
                      </p>
                    )}
                    {tags.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-full bg-green-100 px-2.5 py-0.5 font-mono text-[10px] text-green-700">
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-4 font-mono text-xs uppercase tracking-widest text-terracotta-600">
                      View project{" "}
                      <span className="inline-block transition group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </Paper>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
