"use client";

import {useEffect, useState} from "react";

interface CaseFileProps {
  open: boolean;
  onClose: () => void;
  resumeUrl: string | null;
}

export default function CaseFile({open, onClose, resumeUrl}: CaseFileProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);

      const timeouts = [
        setTimeout(() => setStep(1), 450),
        setTimeout(() => setStep(2), 900),
        setTimeout(() => setStep(3), 1350),
        setTimeout(() => setStep(4), 1800),
        setTimeout(() => setStep(5), 2250),
        setTimeout(() => setStep(6), 2700),
        setTimeout(() => setStep(7), 3150),
        setTimeout(() => setStep(8), 4800), // Threat level reveal
        setTimeout(() => setStep(9), 5300), // Status line reveal
        setTimeout(() => setStep(10), 7200), // Status unredacted
        setTimeout(() => setStep(11), 7700), // Fingerprint & link
      ];

      return () => {
        timeouts.forEach(clearTimeout);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const progressPct = Math.min(100, Math.round((step / 11) * 100));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rotate-[-0.4deg] transition-transform">
        {/* Manila Folder Top Die-Cut Tab */}
        <div className="flex items-center justify-between pr-4">
          <div className="inline-flex items-center gap-3 rounded-t-xl border-x-2 border-t-2 border-[#b59e7a] bg-[#dfd0b5] px-5 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-terracotta-600" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#3a3028]">
              CASE No. HBR-2026-001
            </span>
            {/* Micro Barcode SVG */}
            <svg
              width="38"
              height="12"
              viewBox="0 0 38 12"
              className="fill-[#3a3028]/60"
              aria-hidden="true">
              <rect x="0" y="1" width="2" height="10" />
              <rect x="4" y="1" width="1" height="10" />
              <rect x="7" y="1" width="3" height="10" />
              <rect x="12" y="1" width="1" height="10" />
              <rect x="15" y="1" width="2" height="10" />
              <rect x="19" y="1" width="4" height="10" />
              <rect x="25" y="1" width="1" height="10" />
              <rect x="28" y="1" width="2" height="10" />
              <rect x="32" y="1" width="1" height="10" />
              <rect x="35" y="1" width="3" height="10" />
            </svg>
          </div>

          {step < 11 && (
            <button
              type="button"
              onClick={() => setStep(11)}
              className="rounded-t-lg border border-b-0 border-sand-600 bg-ink/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-sand-300 transition hover:text-ivory">
              Declassify Now ({progressPct}%) →
            </button>
          )}
        </div>

        {/* Outer Manila Folder Body */}
        <div className="relative overflow-hidden rounded-b-xl rounded-tr-xl border-2 border-[#b59e7a] bg-[#dfd0b5] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-5">
          {/* Metallic Paperclip SVG on top-left edge */}
          <svg
            width="28"
            height="56"
            viewBox="0 0 28 56"
            fill="none"
            className="pointer-events-none absolute -top-2 left-8 z-30 text-[#5c5346]"
            aria-hidden="true">
            <path
              d="M8 12v28a6 6 0 0 0 12 0V10a8 8 0 0 0-16 0v32a10 10 0 0 0 20 0V14"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Cream Intelligence Sheet */}
          <div className="relative min-h-[430px] rounded-sm border border-[#c8b99e] bg-[#faf5eb] p-6 shadow-inner sm:p-8">
            {/* Subtle Coffee Ring SVG Watermark */}
            <svg
              width="110"
              height="110"
              viewBox="0 0 110 110"
              fill="none"
              className="pointer-events-none absolute right-14 top-12 opacity-15"
              aria-hidden="true">
              <circle
                cx="55"
                cy="55"
                r="46"
                stroke="#8b6f47"
                strokeWidth="3"
                strokeDasharray="80 12 40 8"
              />
              <circle
                cx="57"
                cy="54"
                r="43"
                stroke="#8b6f47"
                strokeWidth="1.2"
              />
            </svg>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case file"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cbbba0] bg-[#f0e6d2] font-mono text-sm text-[#5c4d3c] transition hover:border-terracotta-600 hover:bg-terracotta-600 hover:text-ivory">
              ✕
            </button>

            {/* Dossier Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#3a3028] pb-4 pr-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a7a68]">
                  INTERNAL INTELLIGENCE BUREAU // DOSSIER
                </p>
                <h2 className="mt-0.5 font-display text-3xl uppercase tracking-wider text-[#201c1a]">
                  Case File
                </h2>
                <p className="font-mono text-[11px] text-[#6e5f4f]">
                  CASE No. HBR-2026-001
                </p>
              </div>

              {step >= 1 && (
                <div className="stamp-in rotate-[-6deg] rounded-[2px] border-2 border-red-700 bg-red-700/5 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red-700 shadow-xs">
                  CLASSIFIED
                </div>
              )}
            </div>

            {/* Declassification Progress Strip */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#e5dac5]">
                <div
                  style={{width: `${progressPct}%`}}
                  className="h-full bg-terracotta-600 transition-all duration-300"
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8a7a68]">
                {step >= 11 ? "DECLASSIFIED" : `DECRYPTING ${progressPct}%`}
              </span>
            </div>

            {/* Structured Intelligence Fields (100% Original Content Preserved) */}
            <div className="mt-5 divide-y divide-[#e6dcc8] border-y border-[#d6c8ae] font-mono text-xs sm:text-sm text-[#3a3028]">
              {step >= 1 && (
                <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    SUBJECT:
                  </span>
                  <span className="font-semibold text-[#201c1a] sm:col-span-8">
                    Habil Baihaki Ramadhan
                  </span>
                </div>
              )}

              {step >= 2 && (
                <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    ALIAS:
                  </span>
                  <span className="text-terracotta-700 sm:col-span-8">
                    @HabilBoyyyyyy
                  </span>
                </div>
              )}

              {step >= 3 && (
                <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    LOCATION:
                  </span>
                  <span className="sm:col-span-8">East Bekasi, Indonesia</span>
                </div>
              )}

              {step >= 4 && (
                <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    OCCUPATION:
                  </span>
                  <span className="sm:col-span-8">
                    Informatics Student &amp; Web Developer
                  </span>
                </div>
              )}

              {step >= 5 && (
                <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    SPECIALIZATION:
                  </span>
                  <span className="sm:col-span-8">
                    Full-Stack Web Development, AI Engineering
                  </span>
                </div>
              )}

              {step >= 6 && (
                <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    KNOWN TOOLS:
                  </span>
                  <span className="sm:col-span-8">
                    JavaScript, Python, Next.js, FastAPI, PostgreSQL
                  </span>
                </div>
              )}

              {step >= 7 && (
                <div className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:items-baseline">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    THREAT LEVEL:
                  </span>
                  <span className="sm:col-span-8">
                    {step >= 8 ? (
                      <span className="font-semibold text-terracotta-700">
                        Exceptionally Dangerous (to bugs)
                      </span>
                    ) : (
                      <span className="inline-block select-none rounded-[2px] bg-[#3a3028] px-2 text-[#3a3028]">
                        ██████████
                      </span>
                    )}
                  </span>
                </div>
              )}

              {step >= 9 && (
                <div className="grid min-h-[2.5rem] grid-cols-1 items-center gap-1 py-2 sm:grid-cols-12">
                  <span className="font-bold uppercase tracking-wider text-[#756553] sm:col-span-4">
                    STATUS:
                  </span>
                  <span className="sm:col-span-8">
                    {step >= 10 ? (
                      <span className="stamp-in inline-block rotate-[-2deg] border-2 border-green-800 bg-green-200/60 px-2.5 py-0.5 text-xs font-bold tracking-widest text-green-900">
                        OPEN TO WORK
                      </span>
                    ) : (
                      <span className="inline-block select-none rounded-[2px] bg-[#3a3028] px-2 text-[#3a3028]">
                        ██████████
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Evidence & Fingerprint Watermark */}
            {step >= 11 && (
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2.5 rounded-lg border border-[#d6c8ae] bg-[#f2ead9] px-3.5 py-2 font-mono text-xs sm:text-sm text-[#3a3028]">
                  {/* Custom SVG Paperclip Icon (No Emoji) */}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-terracotta-700"
                    aria-hidden="true">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  <span className="font-bold">ATTACHED EVIDENCE:</span>
                  {resumeUrl ? (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-terracotta-700 underline decoration-terracotta-500 underline-offset-4 transition hover:text-terracotta-900">
                      View Resume →
                    </a>
                  ) : (
                    <span className="italic text-[#8a7a68]">
                      No resume on file
                    </span>
                  )}
                </div>

                {/* Biometric Fingerprint Stamp */}
                <div className="stamp-in pointer-events-none shrink-0">
                  <svg
                    width="48"
                    height="64"
                    viewBox="0 0 60 80"
                    className="fill-current text-[#8a7a68]/35"
                    aria-hidden="true">
                    <path d="M30 0C18 0 8 10 8 22C8 30 11 36 15 42C18 47 22 51 25 56C27 61 28 66 28 71C28 76 29 80 30 80C31 80 32 76 32 71C32 66 33 61 35 56C38 51 42 47 45 42C49 36 52 30 52 22C52 10 42 0 30 0ZM30 6C39 6 46 13 46 22C46 28 43 33 40 38C37 43 33 47 30 52C27 47 23 43 20 38C17 33 14 28 14 22C14 13 21 6 30 6Z" />
                    <path d="M30 14C25 14 22 18 22 22C22 26 24 29 26 33C28 36 30 40 30 43C30 40 32 36 34 33C36 29 38 26 38 22C38 18 35 14 30 14Z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
