"use client";

import {useState, useRef} from "react";
import Tape from "@/components/scrapbook/Tape";
import Stack, {type StackRef} from "@/components/ui/Stack";
import type {ProjectImage} from "@/lib/api";

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
        className="relative flex h-full w-full select-none flex-col justify-between border border-sand-300/80 bg-ivory p-3.5 pb-11 shadow-[0_8px_24px_rgba(32,28,26,0.12),0_2px_4px_rgba(32,28,26,0.08)] sm:p-5 sm:pb-14">
        {/* Washi Tape on Top Edge */}
        <Tape
          rotate={tapeAngle}
          className="pointer-events-none absolute -top-1 left-1/2 z-20 -translate-x-1/2 scale-90 opacity-90 sm:scale-100"
        />

        {/* Photo Cutout Frame */}
        <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[2px] border border-sand-300/70 bg-sand-100 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.image_url}
            alt={`${title} screenshot ${originalIndex + 1}`}
            className="pointer-events-none h-full w-full select-none bg-sand-50/60 object-contain"
            draggable={false}
          />

          {/* Photographic Gloss / Reflection Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
        </div>

        {/* Polaroid Chin / Handwritten Style Label */}
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="min-w-0 pr-3">
            <p className="truncate font-display text-base tracking-wide text-ink/90 sm:text-lg">
              {title}
              <span className="ml-2 font-mono text-xs font-normal text-terracotta-700/80">
                #{String(originalIndex + 1).padStart(2, "0")}
              </span>
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-terracotta-300/60 bg-terracotta-100/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-terracotta-700 sm:text-xs">
            {originalIndex + 1} / {validImages.length}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className="relative my-6 w-full rounded-2xl border border-sand-200/80 bg-sand-50/40 p-4 sm:p-6">
      {/* Top Controls Bar (when multiple images) */}
      {validImages.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-sand-200/80 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-terracotta-600" />
            <span className="font-mono text-xs uppercase tracking-widest text-sand-600">
              Snapshots ({validImages.length})
            </span>
            <span className="font-mono text-xs font-semibold text-terracotta-600">
              · Viewing #{String(currentActiveIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout Switcher: Fan / Pile / Deck */}
            <div className="inline-flex rounded-full border border-sand-300 bg-ivory p-0.5 shadow-xs">
              {(["fan", "pile", "deck"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLayout(l)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all ${
                    layout === l
                      ? "bg-ink font-semibold text-ivory shadow-xs"
                      : "text-sand-600 hover:bg-sand-100 hover:text-ink"
                  }`}>
                  {l}
                </button>
              ))}
            </div>

            {/* Shuffle Photo Button */}
            <button
              type="button"
              onClick={() => stackRef.current?.sendToBack()}
              className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-ivory px-3.5 py-1 font-mono text-xs uppercase tracking-wider text-sand-700 shadow-xs transition hover:border-terracotta-600 hover:text-terracotta-600 active:scale-95">
              Shuffle →
            </button>
          </div>
        </div>
      )}

      {/* Main Stack Polaroid Container */}
      <div className="relative mx-auto h-[360px] w-full max-w-3xl px-2 py-4 sm:h-[460px] sm:px-6 md:h-[520px]">
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
        <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-widest text-sand-500">
          Click or drag cards to shuffle · Switch between Fan, Pile &amp; Deck
          views above
        </p>
      )}

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-3 px-2">
          {validImages.map((img, i) => {
            const isCurrent = i === currentActiveIndex;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => handleSelectThumbnail(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={isCurrent}
                className={`group relative overflow-hidden rounded-[2px] border-2 bg-white p-1 transition-all duration-300 ${
                  isCurrent
                    ? "scale-105 border-terracotta-600 shadow-md ring-2 ring-terracotta-300/60"
                    : "border-sand-300/80 opacity-70 hover:-translate-y-0.5 hover:border-sand-400 hover:opacity-100"
                }`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt=""
                  className="h-14 w-20 rounded-[1px] object-cover sm:h-16 sm:w-24"
                />
                <span className="mt-1 block text-center font-mono text-[9px] uppercase tracking-wider text-sand-600">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
