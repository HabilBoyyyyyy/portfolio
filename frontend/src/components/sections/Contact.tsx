import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import ContactForm from "./ContactForm";
import type {Profile} from "@/lib/api";

export default function Contact({profile}: {profile: Profile | null}) {
  return (
    <SectionShell id="contact" label="06 / Contact" title="Let's talk">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="max-w-sm text-[15px] md:text-base leading-relaxed text-sand-700">
            Hiring, need an intern, or just want to connect? I&apos;m always open to discussing new projects, creative ideas, or opportunities. Let&apos;s build something amazing together.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center gap-5 p-4 md:p-5 bg-ivory border border-sand-200 rounded-2xl transition-all duration-300 hover:border-terracotta-300 hover:shadow-[0_8px_30px_rgba(193,80,46,0.12)] hover:-translate-y-1"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-sand-200 bg-sand-100 text-sand-500 group-hover:text-terracotta-600 group-hover:border-terracotta-200 group-hover:bg-terracotta-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand-500 mb-1">
                    Email
                  </span>
                  <span className="font-display text-lg md:text-xl text-ink group-hover:text-terracotta-600 transition-colors">
                    {profile.email}
                  </span>
                </div>
              </a>
            )}

            <div className="group flex items-center gap-5 p-4 md:p-5 bg-ivory border border-sand-200 rounded-2xl transition-all duration-300 hover:shadow-md">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-sand-200 bg-sand-100 text-sand-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand-500 mb-1">
                  Location
                </span>
                <span className="font-display text-lg md:text-xl text-ink">
                  East Bekasi, Indonesia
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <ContactForm />
        </Reveal>
      </div>
    </SectionShell>
  );
}
