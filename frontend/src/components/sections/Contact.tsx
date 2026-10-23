import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import ContactForm from "./ContactForm";
import type {Profile} from "@/lib/api";

export default function Contact({profile}: {profile: Profile | null}) {
  const email = profile?.email || "habilramadhan1005@gmail.com";

  return (
    <SectionShell id="contact" label="06 / Contact" title="Let's talk">
      <div className="-mb-8 grid items-start gap-10 md:-mb-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
        <Reveal>
          <div className="space-y-6">
            {/* Live Availability Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-green-300/90 bg-green-50/90 px-3.5 py-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-green-700">
                Available for Internships &amp; Projects
              </span>
            </div>

            <p className="max-w-md font-body text-[15px] leading-relaxed text-sand-700 md:text-base">
              Hiring, need an intern, or just want to connect? I&apos;m always
              open to discussing new projects, creative ideas, or engineering
              opportunities. Let&apos;s build something remarkable together.
            </p>

            {/* Contact Dispatch Cards */}
            <div className="space-y-3.5 pt-2">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-sand-200/90 bg-ivory p-4 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta-400 hover:bg-white hover:shadow-[0_10px_28px_rgba(193,80,46,0.1)] sm:p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sand-200 bg-sand-100/80 text-sand-600 transition-colors group-hover:border-terracotta-200 group-hover:bg-terracotta-50 group-hover:text-terracotta-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.6}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-sand-500">
                        Direct Email
                      </span>
                      <span className="mt-0.5 block truncate font-display text-lg text-ink transition-colors group-hover:text-terracotta-600 sm:text-xl">
                        {email}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-sand-200 bg-sand-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-sand-600 transition group-hover:border-terracotta-300 group-hover:bg-terracotta-50 group-hover:text-terracotta-700">
                    Write ↗
                  </span>
                </a>
              )}

              {/* Location & Timezone Card */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-sand-200/90 bg-ivory p-4 shadow-2xs sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sand-200 bg-sand-100/80 text-sand-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.6}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-sand-500">
                      Base &amp; Timezone
                    </span>
                    <span className="mt-0.5 block font-display text-lg text-ink sm:text-xl">
                      East Bekasi, Indonesia
                    </span>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-sand-200 bg-sand-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-sand-600">
                  UTC+7 · WIB
                </span>
              </div>
            </div>

            {/* Editorial Response Note */}
            <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50/50 px-4 py-3 font-mono text-[11px] text-sand-600">
              <span className="font-semibold text-terracotta-600">
                DISPATCH NOTE:
              </span>{" "}
              Messages sent through this form go straight to my private inbox.
              Typical response window is under 24 hours.
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </SectionShell>
  );
}
