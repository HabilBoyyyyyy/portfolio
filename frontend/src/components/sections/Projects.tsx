import Link from "next/link";
import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import Paper from "@/components/scrapbook/Paper";
import {splitTags, type Project} from "@/lib/api";

const TILTS = [-1.4, 1.2, -0.8];

export default function Projects({projects}: {projects: Project[]}) {
  return (
    <SectionShell id="projects" label="03 / Projects" title="My Work">
      {projects.length === 0 && (
        <p className="text-sand-600 font-mono text-sm">Projects coming soon.</p>
      )}

      <div className="flex flex-col gap-24 md:gap-32 mt-12">
        {projects.map((p, i) => {
          const cover = [...(p.images || [])]
            .filter((img) => Boolean(img.image_url?.trim()))
            .sort((a, b) => a.order - b.order)[0];
          const tags = splitTags(p.tags);
          const isEven = i % 2 === 0;

          return (
            <Reveal key={p.id} delay={100}>
              <div 
                className={`flex flex-col gap-10 md:gap-16 items-center ${
                  !isEven ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* ── Polaroid Image ── */}
                <div className="w-full md:w-[55%]">
                  <Link href={`/projects/${p.slug}`} className="group block outline-none">
                    <Paper
                      tape
                      rotate={TILTS[i % TILTS.length]}
                      className="!p-4 md:!p-5 transition-all duration-500 hover:-translate-y-2 hover:[--r:0deg] shadow-xl hover:shadow-2xl"
                    >
                      <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-sand-200 border border-sand-200 relative">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover.image_url}
                            alt={`${p.title} screenshot`}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-ivory">
                            <span className="font-display text-7xl text-terracotta-200">
                              {p.title.charAt(0)}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-sand-400">
                              No screenshot yet
                            </span>
                          </div>
                        )}
                        
                        {/* Polaroid subtle gloss overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
                      </div>
                    </Paper>
                  </Link>
                </div>

                {/* ── Project Details ── */}
                <div className="w-full md:w-[45%] flex flex-col items-start">
                  <h3 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                    <Link href={`/projects/${p.slug}`} className="hover:text-terracotta-600 transition-colors">
                      {p.title}
                    </Link>
                  </h3>
                  
                  {p.summary && (
                    <p className="mt-5 text-[15px] md:text-base leading-relaxed text-sand-700 border-l-2 border-terracotta-300 pl-4">
                      {p.summary}
                    </p>
                  )}
                  
                  {tags.length > 0 && (
                    <ul className="mt-8 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <li
                          key={t}
                          className="rounded bg-sand-200/50 border border-sand-300 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/80 transition-colors hover:bg-terracotta-100 hover:text-terracotta-700 hover:border-terracotta-300"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <Link 
                    href={`/projects/${p.slug}`} 
                    className="group mt-10 inline-flex items-center gap-3 bg-ink text-ivory font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-300 hover:bg-terracotta-700 hover:shadow-[0_4px_14px_rgba(193,80,46,0.3)]"
                  >
                    View project
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
