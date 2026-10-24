import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import Paper from "@/components/scrapbook/Paper";
import type {Certificate} from "@/lib/api";

const CARD_TILTS = [-0.5, 0.45, -0.35, 0.5];

export default function Certificates({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <SectionShell
      id="certificates"
      label="Certificates"
      title="Credentials & Honors">
      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand-300 bg-ivory/60 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-sand-500">
            05 / Vault Empty
          </p>
          <p className="mt-1 font-display text-lg text-ink">
            Certifications and credentials coming soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {certificates.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <Paper
                tape
                rotate={CARD_TILTS[i % CARD_TILTS.length]}
                className="group relative flex min-w-0 max-w-full flex-col items-stretch overflow-hidden rounded-2xl !p-0 transition-all duration-300 hover:-translate-y-1 hover:[--r:0deg] max-sm:[rotate:0deg] sm:flex-row">
                {/* Left Archival Accent Bar */}
                <div
                  aria-hidden="true"
                  className="h-1.5 w-full bg-gradient-to-r from-terracotta-600 via-terracotta-400 to-green-600 sm:h-auto sm:w-2 sm:bg-gradient-to-b"
                />

                {/* Main Certificate Body */}
                <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-green-300/80 bg-green-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        <span>{c.issuer?.trim() || "Official Credential"}</span>
                      </div>

                      <span className="font-mono text-[10px] uppercase tracking-widest text-sand-400">
                        CERT // #{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-xl leading-snug text-ink transition-colors group-hover:text-terracotta-600 sm:text-2xl">
                      {c.name}
                    </h3>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-sand-200/70 pt-3 font-mono text-xs text-sand-600">
                    <span className="inline-flex items-center gap-1.5">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-terracotta-600"
                        aria-hidden="true">
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      <span>{c.date?.trim() || "Issued"}</span>
                    </span>

                    <span className="text-[10px] uppercase tracking-widest text-sand-400">
                      Verified Record
                    </span>
                  </div>
                </div>

                {/* Right Perforated Ticket Stub (Score Stamp or Official Seal) */}
                <div className="relative flex shrink-0 items-center justify-center border-t-2 border-dashed border-sand-200 bg-sand-50/60 px-5 py-4 sm:w-32 sm:border-l-2 sm:border-t-0 sm:px-3">
                  {/* Top & Bottom Perforation Punch-Out Notches (Desktop) */}
                  <span
                    aria-hidden="true"
                    className="hidden sm:block absolute -left-2 -top-2 h-4 w-4 rounded-full border border-sand-200 bg-ivory"
                  />
                  <span
                    aria-hidden="true"
                    className="hidden sm:block absolute -bottom-2 -left-2 h-4 w-4 rounded-full border border-sand-200 bg-ivory"
                  />

                  {c.score?.trim() ? (
                    <div className="-rotate-6 rounded-xl border-2 border-terracotta-600 bg-terracotta-50/80 px-3 py-2 text-center font-mono text-terracotta-700 shadow-2xs transition-transform duration-300 group-hover:rotate-0">
                      <span className="block text-[9px] uppercase tracking-widest text-terracotta-600">
                        Score
                      </span>
                      <span className="mt-0.5 block font-display text-lg font-bold leading-tight text-terracotta-700">
                        {c.score}
                      </span>
                    </div>
                  ) : (
                    <div className="-rotate-6 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-green-600/70 bg-green-50/70 p-2.5 text-center font-mono text-green-700 transition-transform duration-300 group-hover:rotate-0">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true">
                        <path d="M12 15l-3.5 2 .9-4-3.1-2.7 4.1-.4L12 6l1.6 3.9 4.1.4-3.1 2.7.9 4z" />
                      </svg>
                      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest">
                        Certified
                      </span>
                    </div>
                  )}
                </div>
              </Paper>
            </Reveal>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
