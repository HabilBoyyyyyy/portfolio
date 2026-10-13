"use client";

import { useEffect, useState } from "react";

interface CaseFileProps {
  open: boolean;
  onClose: () => void;
  resumeUrl: string | null;
}

export default function CaseFile({ open, onClose, resumeUrl }: CaseFileProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(0);
      
      const timeouts = [
        setTimeout(() => setStep(1), 500),
        setTimeout(() => setStep(2), 1000),
        setTimeout(() => setStep(3), 1500),
        setTimeout(() => setStep(4), 2000),
        setTimeout(() => setStep(5), 2500),
        setTimeout(() => setStep(6), 3000),
        setTimeout(() => setStep(7), 3500),
        setTimeout(() => setStep(8), 5500), // Threat level reveal
        setTimeout(() => setStep(9), 6000), // Status line reveal
        setTimeout(() => setStep(10), 8500), // Status unredacted
        setTimeout(() => setStep(11), 9000), // Fingerprint & link
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur">
      <div className="relative w-full max-w-lg rotate-[-0.5deg]">
        <div className="relative bg-[#d4c5a9] border-2 border-[#b8a88a] rounded-sm p-8 shadow-2xl min-h-[400px]">
          {/* Coffee stain decoration */}
          <div className="absolute top-10 right-20 w-24 h-24 rounded-full border-2 border-[#8b775b]/20 pointer-events-none"></div>
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-xl text-[#8a7a68] transition hover:text-[#3a3028]"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="mb-8">
            <h2 className="font-display text-2xl uppercase tracking-wider text-[#3a3028]">
              Case File
            </h2>
            <p className="font-mono text-[10px] text-[#8a7a68]">
              CASE No. HBR-2026-001
            </p>
          </div>

          <div className="absolute top-6 right-8">
            {step >= 1 && (
              <div className="stamp-in rotate-[-8deg] border-2 border-red-700 px-3 py-1 font-mono text-xs uppercase tracking-widest text-red-700">
                CLASSIFIED
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 font-mono text-sm text-[#3a3028]">
            {step >= 1 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="font-bold">SUBJECT:</span> Habil Baihaki Ramadhan
              </p>
            )}
            {step >= 2 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="font-bold">ALIAS:</span> @HabilBoyyyyyy
              </p>
            )}
            {step >= 3 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="font-bold">LOCATION:</span> East Bekasi, Indonesia
              </p>
            )}
            {step >= 4 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="font-bold">OCCUPATION:</span> Informatics Student & Web Developer
              </p>
            )}
            {step >= 5 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="font-bold">SPECIALIZATION:</span> Full-Stack Web Development, AI Engineering
              </p>
            )}
            {step >= 6 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="font-bold">KNOWN TOOLS:</span> JavaScript, Python, Next.js, FastAPI, PostgreSQL
              </p>
            )}
            {step >= 7 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="font-bold">THREAT LEVEL:</span>{" "}
                {step >= 8 ? (
                  "Exceptionally Dangerous (to bugs)"
                ) : (
                  <span className="bg-[#3a3028] text-[#3a3028] px-1">██████████</span>
                )}
              </p>
            )}
            {step >= 9 && (
              <p className="animate-in fade-in slide-in-from-bottom-2 duration-500 relative flex items-center gap-2 min-h-[2rem]">
                <span className="font-bold">STATUS:</span>{" "}
                {step >= 10 ? (
                  <span className="stamp-in border border-green-800 text-green-900 bg-green-200/50 px-2 py-0.5 text-xs font-bold rotate-[-2deg]">
                    OPEN TO WORK
                  </span>
                ) : (
                  <span className="bg-[#3a3028] text-[#3a3028] px-1">██████████</span>
                )}
              </p>
            )}
          </div>

          {step >= 11 && (
            <div className="mt-8 animate-in fade-in duration-500">
              <p className="font-mono text-sm text-[#3a3028]">
                📎 ATTACHED EVIDENCE:{" "}
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta-700 underline hover:text-terracotta-900"
                  >
                    View Resume →
                  </a>
                ) : (
                  <span className="text-[#8a7a68] italic">No resume on file</span>
                )}
              </p>
            </div>
          )}

          {step >= 11 && (
            <div className="absolute bottom-6 right-6 stamp-in pointer-events-none">
              <svg width="60" height="80" viewBox="0 0 60 80" className="text-[#8a7a68]/30 fill-current">
                <path d="M30 0C18 0 8 10 8 22C8 30 11 36 15 42C18 47 22 51 25 56C27 61 28 66 28 71C28 76 29 80 30 80C31 80 32 76 32 71C32 66 33 61 35 56C38 51 42 47 45 42C49 36 52 30 52 22C52 10 42 0 30 0ZM30 6C39 6 46 13 46 22C46 28 43 33 40 38C37 43 33 47 30 52C27 47 23 43 20 38C17 33 14 28 14 22C14 13 21 6 30 6Z"/>
                <path d="M30 14C25 14 22 18 22 22C22 26 24 29 26 33C28 36 30 40 30 43C30 40 32 36 34 33C36 29 38 26 38 22C38 18 35 14 30 14Z"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
