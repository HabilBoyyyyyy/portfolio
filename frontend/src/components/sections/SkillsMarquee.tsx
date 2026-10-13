"use client";

import { useEffect, useRef, useState } from "react";
import type { Skill } from "@/lib/api";

/* ── Marquee row ── */
function MarqueeRow({
  items,
  direction = "left",
  speed = 35,
}: {
  items: Skill[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  /* Pause on hover */
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <div
        ref={trackRef}
        className="flex gap-4"
        style={{
          width: "max-content",
          animation: `marquee-${direction} ${speed}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {/* Duplicate the items so it loops seamlessly */}
        {[...items, ...items].map((skill, i) => (
          <div
            key={`${skill.id}-${i}`}
            className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 bg-white border border-sand-200 shadow-[0_1px_3px_rgba(32,28,26,0.06)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-terracotta-400 cursor-default select-none"
            style={{ minWidth: "max-content" }}
          >
            {skill.icon_url ? (
              <img
                src={skill.icon_url}
                alt={skill.name}
                width={22}
                height={22}
                className="flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full bg-terracotta-100 flex items-center justify-center font-mono text-[10px] text-terracotta-700">
                {skill.name[0]}
              </span>
            )}
            <span className="text-sm font-medium text-ink whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function SkillsMarquee({ skills }: { skills: Skill[] }) {
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
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Split skills into categories or just split in half for two rows
  const categories = new Map<string, Skill[]>();
  skills.forEach((s) => {
    const cat = s.category?.trim() || "Other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(s);
  });

  // If we have meaningful categories, use them as separate rows
  // Otherwise, split the flat list into two rows
  const rows: Skill[][] = [];
  if (categories.size >= 2) {
    categories.forEach((items) => {
      if (items.length > 0) rows.push(items);
    });
  } else {
    const mid = Math.ceil(skills.length / 2);
    rows.push(skills.slice(0, mid));
    if (skills.length > 1) rows.push(skills.slice(mid));
  }

  return (
    <div
      ref={ref}
      className="space-y-4 transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {rows.map((row, i) => (
        <MarqueeRow
          key={i}
          items={row}
          direction={i % 2 === 0 ? "left" : "right"}
          speed={30 + row.length * 2}
        />
      ))}
    </div>
  );
}
