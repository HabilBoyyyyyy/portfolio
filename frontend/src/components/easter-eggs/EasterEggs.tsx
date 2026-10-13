"use client";

import { useState } from "react";
import Gallows from "./Gallows";
import CaseFile from "./CaseFile";

type Modal = null | "gallows" | "casefile";

interface EasterEggsProps {
  resumeUrl: string | null;
}

export default function EasterEggs({ resumeUrl }: EasterEggsProps) {
  const [modal, setModal] = useState<Modal>(null);

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setModal("casefile")}
          className="text-sand-500 hover:text-terracotta-600 transition text-sm flex items-center justify-center w-6 h-6 rounded"
          title="Open case file"
          aria-label="Open case file"
        >
          📁
        </button>
        <button
          onClick={() => setModal("gallows")}
          className="text-sand-500 hover:text-terracotta-600 transition text-sm flex items-center justify-center w-6 h-6 rounded"
          title="Play a game?"
          aria-label="Play a game?"
        >
          ☠
        </button>
      </div>

      <Gallows open={modal === "gallows"} onClose={() => setModal(null)} />
      <CaseFile
        open={modal === "casefile"}
        onClose={() => setModal(null)}
        resumeUrl={resumeUrl}
      />
    </>
  );
}
