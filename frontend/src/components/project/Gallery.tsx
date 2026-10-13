"use client";

import { useState, useRef } from "react";
import Tape from "@/components/scrapbook/Tape";
import Stack, { type StackRef } from "@/components/ui/Stack";
import type { ProjectImage } from "@/lib/api";

const TAPE_ROTATIONS = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.4];

export default function Gallery({
  images,
  title,
}: {
  images: ProjectImage[];
  title: string;
}) {
  const validImages = images.filter((img) => Boolean(img.image_url?.trim()));
  const [selectedStartIndex, setSelectedStartIndex] = useState(0);
  const [stackTopIndex, setStackTopIndex] = useState(0);
  const [layout, setLayout] = useState<"fan" | "pile" | "deck">("fan");
  const stackRef = useRef<StackRef>(null);

  if (validImages.length === 0) return null;

  // Reorder images so that the chosen image sits at index 0 when thumbnail is clicked
  const orderedImages = [
    ...validImages.slice(selectedStartIndex),
    ...validImages.slice(0, selectedStartIndex),
  ];

  // Current active index in the original validImages array
  const currentActiveIndex =
    (selectedStartIndex + stackTopIndex) % validImages.length;

  const handleCardChange = (newTopIndex: number) => {
    setStackTopIndex(newTopIndex);
  };

  const handleSelectThumbnail = (idx: number) => {
    setSelectedStartIndex(idx);
    setStackTopIndex(0);
  };

  const polaroidCards = orderedImages.map((img, i) => {
    const originalIndex = (selectedStartIndex + i) % validImages.length;
    const tapeAngle = TAPE_ROTATIONS[originalIndex % TAPE_ROTATIONS.length];

    return (
      <div
        key={`${img.id}-${originalIndex}`}
        className="relative flex h-full w-full flex-col justify-between bg-ivory p-3.5 pb-11 sm:p-5 sm:pb-14 border border-sand-300/80 shadow-[0_4px_16px_rgba(32,28,26,0.12),0_1px_3px_rgba(32,28,26,0.08)] select-none"
      >
        {/* Washi Tape on Top Edge */}
        <Tape
          rotate={tapeAngle}
          className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-90 scale-90 sm:scale-100"
        />

        {/* Photo Cutout Frame */}
        <div className="relative flex-1 w-full min-h-0 overflow-hidden rounded-[2px] bg-sand-100 border border-sand-300/70 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.image_url}
            alt={`${title} screenshot ${originalIndex + 1}`}
            className="h-full w-full object-contain bg-sand-50/60 pointer-events-none select-none"
            draggable={false}
          />

          {/* Photographic Gloss / Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
        </div>

        {/* Polaroid Chin / Handwritten Style Label */}
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="min-w-0 pr-3">
            <p className="font-display text-base sm:text-lg text-ink/90 tracking-wide truncate">
              {title}
              <span className="ml-2 font-mono text-xs font-normal text-terracotta-700/80">
                #0{originalIndex + 1}
              </span>
            </p>
          </div>

          <span className="shrink-0 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-terracotta-700 bg-terracotta-100/80 border border-terracotta-300/60 px-2.5 py-0.5 rounded-full">
            {originalIndex + 1} / {validImages.length}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className="relative w-full my-6">
      {/* Top Controls Bar (when multiple images) */}
      {validImages.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-sand-500">
              Photos ({validImages.length})
            </span>
            <span className="font-mono text-xs text-terracotta-600">
              • #{currentActiveIndex + 1}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout Switcher */}
            <div className="inline-flex rounded-md border border-sand-300 bg-ivory p-0.5 shadow-xs">
              {(["fan", "pile", "deck"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLayout(l)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded transition-all ${
                    layout === l
                      ? "bg-ink text-ivory shadow-xs font-bold"
                      : "text-sand-600 hover:text-ink hover:bg-sand-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Next Photo Button */}
            <button
              type="button"
              onClick={() => stackRef.current?.sendToBack()}
              className="inline-flex items-center gap-1.5 rounded-md border border-sand-300 bg-ivory px-3 py-1 text-xs font-mono uppercase tracking-wider text-sand-700 shadow-xs transition hover:border-terracotta-600 hover:text-terracotta-600 active:scale-95"
            >
              Shuffle →
            </button>
          </div>
        </div>
      )}

      {/* Main Stack Polaroid Container */}
      <div className="relative mx-auto w-full max-w-3xl h-[360px] sm:h-[460px] md:h-[520px] px-2 sm:px-6 py-4">
        <Stack
          ref={stackRef}
          key={selectedStartIndex}
          cards={polaroidCards}
          layout={layout}
          visible={Math.min(validImages.length, 4)}
          spread={0.55}
          depth={0.45}
          radius={6}
          shadow={true}
          tilt={24}
          sendToBackOnClick={validImages.length > 1}
          onChange={handleCardChange}
          className="mx-auto"
        />
      </div>

      {/* Interactive Hint */}
      {validImages.length > 1 && (
        <p className="mt-6 text-center font-mono text-[11px] sm:text-xs uppercase tracking-widest text-sand-500">
          Click or flick cards to shuffle • Arrow keys or Space to flip
        </p>
      )}

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3 px-2">
          {validImages.map((img, i) => {
            const isCurrent = i === currentActiveIndex;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => handleSelectThumbnail(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={isCurrent}
                className={`group relative overflow-hidden rounded-[2px] bg-white p-1 border-2 transition-all duration-300 ${
                  isCurrent
                    ? "border-terracotta-600 ring-2 ring-terracotta-300 shadow-md scale-105"
                    : "border-sand-300/80 opacity-70 hover:opacity-100 hover:border-sand-400 hover:-translate-y-0.5"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt=""
                  className="h-14 w-20 sm:h-16 sm:w-24 object-cover rounded-[1px]"
                />
                <span className="mt-1 block text-center font-mono text-[9px] uppercase tracking-wider text-sand-600">
                  #{i + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
