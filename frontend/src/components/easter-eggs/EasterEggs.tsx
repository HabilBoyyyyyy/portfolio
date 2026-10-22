"use client";

import {useState} from "react";
import {createPortal} from "react-dom";
import Gallows from "./Gallows";
import CaseFile from "./CaseFile";

type Modal = null | "gallows" | "casefile";

interface EasterEggsProps {
  resumeUrl: string | null;
}

export default function EasterEggs({resumeUrl}: EasterEggsProps) {
  const [modal, setModal] = useState<Modal>(null);

  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-sand-300/90 bg-sand-50/90 p-1 shadow-xs">
        {/* Case File Trigger — Bespoke Classified Dossier SVG Icon */}
        <button
          type="button"
          onClick={() => setModal("casefile")}
          title="Open classified dossier"
          aria-label="Open case file"
          className="group relative inline-flex items-center gap-2 rounded-full border border-transparent bg-ivory px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-sand-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta-400 hover:bg-white hover:text-ink hover:shadow-xs">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-terracotta-600 transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true">
            {/* Manila folder outline with classified tab + stamp lines */}
            <path d="M3 6a2 2 0 0 1 2-2h4.2a2 2 0 0 1 1.6.8L12.2 6.5H19a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />
            <path d="M8 12h8" />
            <path d="M8 15.5h5" />
            <circle
              cx="16.5"
              cy="15.5"
              r="1.5"
              className="fill-terracotta-600"
            />
          </svg>
          <span>Dossier</span>
        </button>

        <span className="h-3.5 w-[1px] bg-sand-300" aria-hidden="true" />

        {/* Gallows Trigger — Bespoke Architectural Timber & Cipher SVG Icon */}
        <button
          type="button"
          onClick={() => setModal("gallows")}
          title="Play The Gallows word game"
          aria-label="Play a game?"
          className="group relative inline-flex items-center gap-2 rounded-full border border-transparent bg-ivory px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-sand-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta-400 hover:bg-white hover:text-ink hover:shadow-xs">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink transition-transform duration-200 group-hover:text-terracotta-600"
            aria-hidden="true">
            {/* Architectural Gallows Frame + Swinging Loop */}
            <path d="M4 20h16" />
            <path d="M7 20V4h9" />
            <path d="M7 8l4-4" />
            <g className="origin-[16px_4px] transition-transform duration-300 group-hover:rotate-12">
              <path d="M16 4v4" />
              <circle
                cx="16"
                cy="11"
                r="2.8"
                className="stroke-terracotta-600"
              />
            </g>
          </svg>
          <span>Cipher</span>
        </button>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <>
            <Gallows
              open={modal === "gallows"}
              onClose={() => setModal(null)}
            />
            <CaseFile
              open={modal === "casefile"}
              onClose={() => setModal(null)}
              resumeUrl={resumeUrl}
            />
          </>,
          document.body,
        )}
    </>
  );
}
