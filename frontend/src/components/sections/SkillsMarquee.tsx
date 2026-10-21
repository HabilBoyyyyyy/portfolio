"use client";

import type {Skill} from "@/lib/api";
import LogoLoop from "@/components/ui/LogoLoop";
import type {LogoItem} from "@/components/ui/LogoLoop";

/**
 * Converts Skills from the database into LogoLoop items.
 * Skills with icon_url get an <img>, others get a styled monogram node.
 */
function skillToLogo(skill: Skill): LogoItem {
  if (skill.icon_url) {
    return {
      src: skill.icon_url,
      alt: skill.name,
      title: skill.name,
    };
  }
  return {
    node: (
      <span className="flex h-[1em] w-[1em] items-center justify-center rounded-full bg-terracotta-100 font-mono text-[0.45em] font-medium text-terracotta-700">
        {skill.name[0]}
      </span>
    ),
    title: skill.name,
  };
}

export default function SkillsMarquee({skills}: {skills: Skill[]}) {
  if (skills.length === 0) {
    return (
      <p className="font-mono text-sm text-sand-600">Skills coming soon.</p>
    );
  }

  // Evenly balance skills into exactly two rows
  const mid = Math.ceil(skills.length / 2);
  const rows: Skill[][] = [
    skills.slice(0, mid),
    skills.slice(mid),
  ].filter((r) => r.length > 0);

  return (
    <div className="space-y-2">
      {rows.map((row, i) => {
        const logos: LogoItem[] = row.map(skillToLogo);
        return (
          <LogoLoop
            key={i}
            logos={logos}
            speed={28}
            direction={i % 2 === 0 ? "left" : "right"}
            logoHeight={35}
            gap={40}
            hoverSpeed={8}
            scaleOnHover
            labels="hover"
            muted={0}
            fadeOut={false}
            draggable
            scrollBoost={0.15}
            ariaLabel={`Skills row ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
