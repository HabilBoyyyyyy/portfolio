"use client";

import {useEffect, useRef, useState} from "react";
import Paper from "@/components/scrapbook/Paper";
import type {Skill} from "@/lib/api";

const TILTS = [-1, 0.8, -0.6, 1.1];

export default function SkillCard({
  skill,
  index,
}: {
  skill: Skill;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [value, setValue] = useState(0);

  // Step 1: wait until the card is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      {threshold: 0.4},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Step 2: count the number up while the bar fills (the bar itself is a CSS transition)
  useEffect(() => {
    if (!shown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(skill.progress);
      return;
    }
    const start = performance.now() + index * 80;
    const duration = 1000;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3); // fast start, gentle finish
      setValue(Math.round(skill.progress * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, skill.progress, index]);

  return (
    <div ref={ref}>
      <Paper
        rotate={TILTS[index % TILTS.length]}
        className="!p-6 hover:-translate-y-1 hover:[rotate:0deg]">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-ink">{skill.name}</h3>
          <span className="font-mono text-sm text-terracotta-600">
            {value}%
          </span>
        </div>
        {skill.category && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-green-600">
            {skill.category}
          </p>
        )}
        {skill.description && (
          <p className="mt-3 text-sm text-sand-700">{skill.description}</p>
        )}
        <div className="mt-4 h-1.5 overflow-hidden rounded bg-sand-50">
          <div
            className="h-full rounded bg-terracotta-600 motion-reduce:transition-none"
            style={{
              width: `${shown ? skill.progress : 0}%`,
              transition: `width 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 80}ms`,
            }}
          />
        </div>
      </Paper>
    </div>
  );
}
