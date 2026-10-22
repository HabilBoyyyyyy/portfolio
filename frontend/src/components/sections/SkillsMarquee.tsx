"use client";

import {useMemo, useState} from "react";
import type {Skill} from "@/lib/api";
import LogoLoop from "@/components/ui/LogoLoop";
import type {LogoItem} from "@/components/ui/LogoLoop";

const CATEGORY_ORDER = ["Languages", "Frameworks", "Tools"];

const CATEGORY_META: Record<
  string,
  {
    index: string;
    subtitle: string;
    dotClass: string;
    badgeBg: string;
    badgeText: string;
    borderAccent: string;
    monogramBg: string;
  }
> = {
  Languages: {
    index: "01",
    subtitle: "Core syntax, type systems & foundations",
    dotClass: "bg-terracotta-600",
    badgeBg: "bg-terracotta-50 border-terracotta-200",
    badgeText: "text-terracotta-700",
    borderAccent: "hover:border-terracotta-400",
    monogramBg: "bg-terracotta-100 text-terracotta-700 border-terracotta-200",
  },
  Frameworks: {
    index: "02",
    subtitle: "Application architecture, UI & runtime libraries",
    dotClass: "bg-green-600",
    badgeBg: "bg-green-50 border-green-200",
    badgeText: "text-green-700",
    borderAccent: "hover:border-green-500",
    monogramBg: "bg-green-100 text-green-700 border-green-200",
  },
  Tools: {
    index: "03",
    subtitle: "Infrastructure, workflows, databases & DevOps",
    dotClass: "bg-sand-700",
    badgeBg: "bg-sand-100 border-sand-300",
    badgeText: "text-sand-800",
    borderAccent: "hover:border-sand-500",
    monogramBg: "bg-sand-200 text-sand-800 border-sand-300",
  },
};

function getCategoryMeta(category: string, fallbackIdx = 4) {
  return (
    CATEGORY_META[category] ?? {
      index: String(fallbackIdx).padStart(2, "0"),
      subtitle: "Specialized stack & workflow capabilities",
      dotClass: "bg-terracotta-500",
      badgeBg: "bg-sand-100 border-sand-200",
      badgeText: "text-sand-700",
      borderAccent: "hover:border-terracotta-400",
      monogramBg: "bg-terracotta-100 text-terracotta-700 border-terracotta-200",
    }
  );
}

function SkillIcon({
  skill,
  size = "md",
}: {
  skill: Skill;
  size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);
  const cat = skill.category || "Tools";
  const meta = getCategoryMeta(cat);

  const dims =
    size === "sm"
      ? "h-7 w-7 text-xs"
      : size === "lg"
        ? "h-11 w-11 text-base"
        : "h-9 w-9 text-sm";

  if (skill.icon_url && !imgError) {
    return (
      <span
        className={`inline-flex ${dims} shrink-0 items-center justify-center rounded-lg border border-sand-200/80 bg-white p-1.5 shadow-[0_1px_2px_rgba(32,28,26,0.04)]`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={skill.icon_url}
          alt={skill.name}
          onError={() => setImgError(true)}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </span>
    );
  }

  const initials = skill.name
    .split(/[\s./+-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <span
      className={`inline-flex ${dims} shrink-0 items-center justify-center rounded-lg border font-mono font-semibold tracking-tight ${meta.monogramBg}`}>
      {initials || skill.name[0]?.toUpperCase() || "?"}
    </span>
  );
}

/**
 * Converts a Skill into a tactile, self-contained pill badge for LogoLoop
 * so icons of varying aspect ratios stay neatly framed and readable at a glance.
 */
function skillToLogo(
  skill: Skill,
  onSelect: (skill: Skill) => void,
  isSelected: boolean,
): LogoItem {
  const cat = skill.category || "Tools";
  const meta = getCategoryMeta(cat);

  return {
    ariaLabel: `${skill.name} (${cat})`,
    title: skill.name,
    node: (
      <button
        type="button"
        onClick={() => onSelect(skill)}
        className={`group inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-left transition-all duration-200 ${
          isSelected
            ? "border-terracotta-600 bg-terracotta-50/90 shadow-sm ring-2 ring-terracotta-500/20"
            : "border-sand-200/90 bg-ivory/95 hover:border-terracotta-400 hover:bg-white hover:shadow-sm"
        }`}>
        <SkillIcon skill={skill} size="sm" />
        <span className="font-body text-sm font-medium tracking-tight text-ink group-hover:text-terracotta-700">
          {skill.name}
        </span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${meta.dotClass} opacity-75`}
          title={cat}
        />
      </button>
    ),
  };
}

export default function SkillsMarquee({skills}: {skills: Skill[]}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"showcase" | "grid" | "index">(
    "showcase",
  );
  const [selectedSkillId, setSelectedSkillId] = useState<Skill["id"] | null>(
    null,
  );

  // Filter out hidden skills and sort strictly by category order then skill.order
  const visibleSkills = useMemo(() => {
    return skills
      .filter((s) => s.visible !== false)
      .slice()
      .sort((a, b) => {
        const catA = a.category || "Uncategorized";
        const catB = b.category || "Uncategorized";
        const idxA = CATEGORY_ORDER.indexOf(catA);
        const idxB = CATEGORY_ORDER.indexOf(catB);
        if (idxA !== idxB) {
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        }
        return (a.order ?? 0) - (b.order ?? 0);
      });
  }, [skills]);

  const grouped = useMemo(() => {
    const map: Record<string, Skill[]> = {};
    for (const skill of visibleSkills) {
      const cat = skill.category || "Uncategorized";
      if (!map[cat]) map[cat] = [];
      map[cat].push(skill);
    }
    for (const cat of Object.keys(map)) {
      map[cat].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return map;
  }, [visibleSkills]);

  const categories = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [grouped]);

  const selectedSkill = useMemo(() => {
    if (selectedSkillId !== null) {
      const found = visibleSkills.find((s) => s.id === selectedSkillId);
      if (found) return found;
    }
    return (
      visibleSkills.find((s) => s.description && s.description.trim() !== "") ??
      visibleSkills[0] ??
      null
    );
  }, [visibleSkills, selectedSkillId]);

  if (visibleSkills.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sand-300 bg-ivory/60 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-sand-500">
          02 / Inventory Empty
        </p>
        <p className="mt-1 font-display text-lg text-ink">
          Skills repertoire coming soon.
        </p>
      </div>
    );
  }

  // Split visible skills into two balanced marquee rows
  const mid = Math.ceil(visibleSkills.length / 2);
  const marqueeRows: Skill[][] = [
    visibleSkills.slice(0, mid),
    visibleSkills.slice(mid),
  ].filter((r) => r.length > 0);

  const displayedCategories =
    activeCategory === "All"
      ? categories
      : categories.filter((c) => c === activeCategory);

  return (
    <div className="space-y-8">
      {/* Top Controls Bar: Category Filter Pills + View Switcher */}
      <div className="flex flex-col gap-4 border-b border-sand-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Filter Tabs */}
        <div
          className="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter skills by category">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "All"}
            onClick={() => setActiveCategory("All")}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
              activeCategory === "All"
                ? "border-ink bg-ink text-ivory shadow-sm"
                : "border-sand-300 bg-ivory text-sand-700 hover:border-sand-400 hover:bg-sand-50"
            }`}>
            <span>All Stack</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeCategory === "All"
                  ? "bg-ivory/20 text-ivory"
                  : "bg-sand-200/80 text-sand-700"
              }`}>
              {visibleSkills.length}
            </span>
          </button>

          {categories.map((cat, idx) => {
            const meta = getCategoryMeta(cat, idx + 1);
            const isActive = activeCategory === cat;
            const count = grouped[cat]?.length ?? 0;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "border-terracotta-600 bg-terracotta-600 text-ivory shadow-sm"
                    : "border-sand-300 bg-ivory text-sand-700 hover:border-terracotta-300 hover:bg-sand-50"
                }`}>
                <span
                  className={`h-2 w-2 rounded-full ${
                    isActive ? "bg-ivory" : meta.dotClass
                  }`}
                />
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-ivory/20 text-ivory"
                      : "bg-sand-200/80 text-sand-700"
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="inline-flex self-start rounded-full border border-sand-300 bg-sand-50 p-1 sm:self-auto">
          {(
            [
              {id: "showcase", label: "Showcase"},
              {id: "grid", label: "Bento Grid"},
              {id: "index", label: "Index"},
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setViewMode(mode.id)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all ${
                viewMode === mode.id
                  ? "bg-ivory text-ink shadow-xs border border-sand-200"
                  : "text-sand-600 hover:text-ink"
              }`}>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kinetic Pill Ribbon (Shown in Showcase mode) */}
      {viewMode === "showcase" && (
        <div className="relative overflow-hidden rounded-2xl border border-sand-200/90 bg-gradient-to-b from-sand-50/70 via-ivory to-sand-50/70 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="mb-3 flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-terracotta-500" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-sand-600">
                Interactive Stack Ticker · Drag or click any badge to inspect
              </span>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-sand-400 sm:inline">
              {visibleSkills.length} Active Technologies
            </span>
          </div>

          <div className="space-y-3">
            {marqueeRows.map((row, i) => {
              const logos: LogoItem[] = row.map((skill) =>
                skillToLogo(
                  skill,
                  (s) => setSelectedSkillId(s.id),
                  selectedSkill?.id === skill.id,
                ),
              );
              return (
                <LogoLoop
                  key={i}
                  logos={logos}
                  speed={26}
                  direction={i % 2 === 0 ? "left" : "right"}
                  logoHeight={38}
                  gap={14}
                  hoverSpeed={6}
                  scaleOnHover
                  labels="none"
                  muted={0}
                  fadeOut
                  fadeOutWidth={0.08}
                  draggable
                  scrollBoost={0.12}
                  ariaLabel={`Skills marquee row ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Skill Spotlight / Field Note Bar */}
      {selectedSkill && (
        <div className="relative overflow-hidden rounded-xl border border-sand-300/90 bg-ivory p-4 shadow-xs sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5 sm:items-center">
              <SkillIcon skill={selectedSkill} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta-600">
                    Field Note
                  </span>
                  <span className="text-sand-300">·</span>
                  <span className="rounded border border-sand-200 bg-sand-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-sand-700">
                    {selectedSkill.category || "Uncategorized"}
                  </span>
                  {typeof selectedSkill.order === "number" &&
                    selectedSkill.order > 0 && (
                      <span className="font-mono text-[10px] text-sand-400">
                        #{String(selectedSkill.order).padStart(2, "0")}
                      </span>
                    )}
                </div>
                <h3 className="mt-0.5 font-display text-xl text-ink">
                  {selectedSkill.name}
                </h3>
                <p className="mt-0.5 text-sm text-sand-700">
                  {selectedSkill.description?.trim()
                    ? selectedSkill.description
                    : `Production experience with ${selectedSkill.name} in modern ${(
                        selectedSkill.category || "software"
                      ).toLowerCase()} workflows.`}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
              <span className="stamp-in inline-flex items-center gap-1.5 rounded-md border border-green-600/30 bg-green-50 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                Active in Stack
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Categorized Bento Grid (Shown in Showcase & Grid modes) */}
      {viewMode !== "index" ? (
        <div
          className={`grid gap-6 ${
            displayedCategories.length === 1
              ? "grid-cols-1"
              : displayedCategories.length === 2
                ? "md:grid-cols-2"
                : "lg:grid-cols-3"
          }`}>
          {displayedCategories.map((category, catIdx) => {
            const catSkills = grouped[category] ?? [];
            const meta = getCategoryMeta(category, catIdx + 1);

            return (
              <div
                key={category}
                className="flex flex-col justify-between rounded-2xl border border-sand-200/90 bg-ivory/90 p-5 shadow-xs transition-all hover:border-sand-300">
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between border-b border-sand-200 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-terracotta-600">
                          {meta.index} /
                        </span>
                        <h3 className="font-display text-xl tracking-wide text-ink">
                          {category}
                        </h3>
                      </div>
                      <p className="mt-0.5 font-body text-xs text-sand-600">
                        {meta.subtitle}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${meta.badgeBg} ${meta.badgeText}`}>
                      {catSkills.length}
                    </span>
                  </div>

                  {/* Skills List / Tiles */}
                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {catSkills.map((skill, idx) => {
                      const isSelected = selectedSkill?.id === skill.id;
                      return (
                        <button
                          key={skill.id ?? `${skill.name}-${idx}`}
                          type="button"
                          onClick={() => setSelectedSkillId(skill.id)}
                          onMouseEnter={() => setSelectedSkillId(skill.id)}
                          className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-150 ${
                            isSelected
                              ? "border-terracotta-500 bg-white shadow-xs ring-1 ring-terracotta-500/20"
                              : `border-sand-200/80 bg-sand-50/50 hover:bg-white hover:shadow-xs ${meta.borderAccent}`
                          }`}>
                          <SkillIcon skill={skill} size="md" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="truncate font-body text-sm font-semibold text-ink group-hover:text-terracotta-700">
                                {skill.name}
                              </p>
                              <span className="shrink-0 font-mono text-[10px] text-sand-400">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                            </div>
                            {skill.description ? (
                              <p className="mt-0.5 truncate font-body text-xs text-sand-600">
                                {skill.description}
                              </p>
                            ) : (
                              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-sand-400">
                                {category}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-sand-200/60 pt-3 font-mono text-[10px] uppercase tracking-widest text-sand-500">
                  <span>Ordered by priority</span>
                  <span>
                    {catSkills.length}{" "}
                    {catSkills.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Editorial Index Table View */
        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-ivory shadow-xs">
          <div className="divide-y divide-sand-200">
            {displayedCategories.map((category, catIdx) => {
              const catSkills = grouped[category] ?? [];
              const meta = getCategoryMeta(category, catIdx + 1);
              return (
                <div
                  key={category}
                  className="grid gap-4 p-5 md:grid-cols-12 md:items-start">
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${meta.dotClass}`}
                      />
                      <span className="font-mono text-xs uppercase tracking-widest text-terracotta-600">
                        {meta.index}
                      </span>
                      <h3 className="font-display text-lg text-ink">
                        {category}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-sand-600">
                      {meta.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:col-span-9">
                    {catSkills.map((skill, idx) => {
                      const isSelected = selectedSkill?.id === skill.id;
                      return (
                        <button
                          key={skill.id ?? `${skill.name}-${idx}`}
                          type="button"
                          onClick={() => setSelectedSkillId(skill.id)}
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition ${
                            isSelected
                              ? "border-terracotta-600 bg-terracotta-50 text-ink shadow-xs"
                              : "border-sand-200 bg-white hover:border-terracotta-400"
                          }`}>
                          <SkillIcon skill={skill} size="sm" />
                          <div>
                            <span className="block font-body text-sm font-medium text-ink">
                              {skill.name}
                            </span>
                            {skill.description && (
                              <span className="block max-w-[200px] truncate font-mono text-[10px] text-sand-500">
                                {skill.description}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
