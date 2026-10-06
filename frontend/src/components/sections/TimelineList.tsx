"use client";

import {useEffect, useRef, useState} from "react";
import Reveal from "@/components/Reveal";
import Paper from "@/components/scrapbook/Paper";
import type {TimelineItem} from "@/lib/api";

export default function TimelineList({items}: {items: TimelineItem[]}) {
  const ref = useRef<HTMLOListElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      {threshold: 0.1},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* The "string": it grows from the top to the bottom when the list appears */}
      <span
        aria-hidden
        className={`absolute bottom-2 left-[6px] top-2 w-0.5 origin-top bg-terracotta-300 transition-transform duration-[1400ms] ease-out motion-reduce:transition-none ${
          drawn ? "scale-y-100" : "scale-y-0"
        }`}
      />
      <ol ref={ref} className="space-y-8">
        {items.map((item, i) => (
          <li key={item.id} className="relative pl-10">
            {/* The pin */}
            <span
              aria-hidden
              className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full bg-terracotta-600 ring-4 ring-ivory"
            />
            <Reveal delay={i * 120}>
              <Paper
                rotate={i % 2 === 0 ? -0.8 : 0.8}
                className="max-w-xl !p-4">
                <p className="font-mono text-xs text-terracotta-600">
                  {item.year}
                </p>
                <h3 className="mt-1 font-display text-xl text-ink">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-sm text-sand-700">
                    {item.description}
                  </p>
                )}
              </Paper>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
