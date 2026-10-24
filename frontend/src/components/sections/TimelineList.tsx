"use client";

import {useEffect, useRef, useState} from "react";
import Paper from "@/components/scrapbook/Paper";
import type {TimelineItem} from "@/lib/api";

function TimelineNode({
  item,
  index,
  total,
  isLeft,
}: {
  item: TimelineItem;
  index: number;
  total: number;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      {threshold: 0.12, rootMargin: "0px 0px -12% 0px"},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative mb-12 flex w-full items-center pl-10 last:mb-0 sm:pl-12 md:mb-16 md:w-1/2 md:pl-0 ${
        isLeft ? "md:justify-end md:pr-12" : "md:ml-auto md:self-end md:pl-12"
      }`}>
      {/* Mobile Timeline Node Badge */}
      <div className="absolute left-0 top-6 z-10 flex h-6 w-6 items-center justify-center md:hidden">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-terracotta-600 font-mono text-[9px] font-bold transition-all duration-500 ${
            visible
              ? "scale-100 bg-terracotta-600 text-ivory shadow-[0_0_12px_rgba(193,80,46,0.45)]"
              : "scale-75 bg-ivory text-terracotta-600"
          }`}>
          {index + 1}
        </span>
      </div>

      {/* Desktop Timeline Node Badge */}
      <div
        className="absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center md:flex"
        style={{[isLeft ? "right" : "left"]: "-16px"}}>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-terracotta-600 font-mono text-[10px] font-bold transition-all duration-500 ${
            visible
              ? "scale-100 bg-terracotta-600 text-ivory shadow-[0_0_14px_rgba(193,80,46,0.5)]"
              : "scale-75 bg-ivory text-terracotta-600"
          }`}>
          {index + 1}
        </span>
      </div>

      {/* Desktop Dashed Branch Connector */}
      <div
        className={`absolute top-1/2 hidden h-px -translate-y-1/2 border-t-2 border-dashed border-terracotta-300 transition-all duration-700 delay-150 md:block ${
          visible ? "w-10 opacity-100" : "w-0 opacity-0"
        }`}
        style={{[isLeft ? "right" : "left"]: "-40px"}}
      />

      {/* Milestone Card */}
      <div
        className={`min-w-0 w-full max-w-full transition-all duration-700 ease-out ${
          visible
            ? "translate-y-0 opacity-100 md:translate-x-0"
            : `translate-y-6 opacity-0 md:translate-y-0 ${
                isLeft ? "md:translate-x-6" : "md:-translate-x-6"
              }`
        }`}>
        <Paper
          tape
          rotate={index % 2 === 0 ? -1.1 : 1.1}
          className="group relative min-w-0 w-full max-w-full overflow-hidden rounded-2xl !p-5 sm:!p-6 transition-all duration-300 hover:-translate-y-1 hover:[--r:0deg] max-sm:[rotate:0deg]">
          {/* Top Metadata Strip */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-sand-200/70 pb-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-terracotta-300/80 bg-terracotta-50 px-3 py-0.5 font-mono text-xs font-bold tracking-widest text-terracotta-700">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta-600" />
              {item.year}
            </span>

            <span className="font-mono text-[10px] uppercase tracking-widest text-sand-400">
              Milestone {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>

          <h3 className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-terracotta-600 sm:text-2xl">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-2.5 border-l-2 border-sand-300 pl-3.5 font-body text-sm leading-relaxed text-sand-700 group-hover:border-terracotta-300">
              {item.description}
            </p>
          )}
        </Paper>
      </div>
    </div>
  );
}

export default function TimelineList({items}: {items: TimelineItem[]}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  const sortedItems = [...items].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLineProgress(100);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = viewportHeight * 0.58 - rect.top;
      const progress = (scrollY / Math.max(1, rect.height)) * 100;
      setLineProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (sortedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sand-300 bg-ivory/60 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-sand-500">
          06 / Roadmap Empty
        </p>
        <p className="mt-1 font-display text-lg text-ink">
          Journey milestones coming soon.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-4xl py-6">
      {/* Background Central Track Line */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-[11px] top-4 w-[3px] rounded-full bg-sand-200 md:left-1/2 md:-ml-[1.5px]"
      />

      {/* Scroll-Filled Active Terracotta Filament */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-[11px] top-4 w-[3px] overflow-hidden rounded-full md:left-1/2 md:-ml-[1.5px]">
        <div
          className="w-full origin-top rounded-full bg-terracotta-600 transition-transform duration-200 ease-out"
          style={{height: "100%", transform: `scaleY(${lineProgress / 100})`}}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col pt-4">
        {sortedItems.map((item, i) => (
          <TimelineNode
            key={item.id}
            item={item}
            index={i}
            total={sortedItems.length}
            isLeft={i % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
}
