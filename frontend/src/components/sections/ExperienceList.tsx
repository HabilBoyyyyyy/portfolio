"use client";

import {useEffect, useRef, useState} from "react";
import Paper from "@/components/scrapbook/Paper";
import Tape from "@/components/scrapbook/Tape";
import Reveal from "@/components/Reveal";
import {splitTags} from "@/lib/api";
import type {Experience} from "@/lib/api";

const CARD_TILTS = [-0.45, 0.35, -0.3, 0.4];

function CompanyBadge({item}: {item: Experience}) {
  const [imgError, setImgError] = useState(false);

  if (item.company_logo_url && !imgError) {
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sand-200 bg-white p-1.5 shadow-2xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.company_logo_url}
          alt={item.company}
          onError={() => setImgError(true)}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  }

  const initials = item.company
    .split(/[\s.&-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-terracotta-200 bg-terracotta-100/80 font-display text-base font-bold text-terracotta-700 shadow-2xs">
      {initials || item.company[0]?.toUpperCase() || "E"}
    </span>
  );
}

function parseBullets(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•*-]+/, "").trim())
    .filter(Boolean);
}

export default function ExperienceList({items}: {items: Experience[]}) {
  const visibleItems = [...items]
    .filter((it) => it.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<number | null>(
    visibleItems[0]?.id ?? null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [railProgress, setRailProgress] = useState(0.3);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pct = (vh * 0.65 - rect.top) / Math.max(1, rect.height);
      setRailProgress(Math.min(1, Math.max(0.08, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (visibleItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sand-300 bg-ivory/60 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-sand-500">
          04 / Career Dossier Empty
        </p>
        <p className="mt-1 font-display text-lg text-ink">
          Professional experience coming soon.
        </p>
      </div>
    );
  }

  const employmentTypes = Array.from(
    new Set(
      visibleItems
        .map((it) => it.employment_type?.trim())
        .filter((t): t is string => Boolean(t)),
    ),
  );

  const filteredItems =
    activeFilter === "All"
      ? visibleItems
      : visibleItems.filter(
          (it) => it.employment_type?.trim() === activeFilter,
        );

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Top Filter Pills (Only shown if multiple employment types exist) */}
      {employmentTypes.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
                activeFilter === "All"
                  ? "border-ink bg-ink text-ivory shadow-2xs"
                  : "border-sand-300 bg-ivory text-sand-700 hover:border-sand-400"
              }`}>
              All Roles ({visibleItems.length})
            </button>
            {employmentTypes.map((type) => {
              const count = visibleItems.filter(
                (i) => i.employment_type?.trim() === type,
              ).length;
              const isActive = activeFilter === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveFilter(type)}
                  className={`rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
                    isActive
                      ? "border-terracotta-600 bg-terracotta-600 text-ivory shadow-2xs"
                      : "border-sand-300 bg-ivory text-sand-700 hover:border-terracotta-300"
                  }`}>
                  {type} ({count})
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[10px] uppercase tracking-widest text-sand-500">
            Click any dossier card to expand notes
          </span>
        </div>
      )}

      {/* Editorial Career Rail + Scrapbook Dossier Cards */}
      <div className="relative pl-6 sm:pl-10">
        {/* Background Vertical Rail */}
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-2 top-4 w-[2px] bg-sand-200 sm:left-3.5">
          <div
            style={{height: `${Math.round(railProgress * 100)}%`}}
            className="w-full bg-terracotta-500 transition-[height] duration-200"
          />
        </div>

        <div className="space-y-8 sm:space-y-10">
          {filteredItems.map((item, idx) => {
            const tags = splitTags(item.tags);
            const bullets = parseBullets(item.description);
            const isExpanded = expandedId === item.id;
            const dateLabel = `${item.start_date} — ${
              item.is_current ? "Present" : item.end_date || "Present"
            }`;

            return (
              <Reveal key={item.id} delay={idx * 70}>
                <div className="relative">
                  {/* Timeline Node Marker */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    aria-label={`Toggle details for ${item.role} at ${item.company}`}
                    className={`absolute -left-6 top-6 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all sm:-left-6.5 sm:h-6 sm:w-6 ${
                      item.is_current
                        ? "border-green-600 bg-green-50 text-green-700 ring-4 ring-green-500/15"
                        : isExpanded
                          ? "border-terracotta-600 bg-terracotta-600 text-ivory"
                          : "border-sand-400 bg-ivory text-sand-600 hover:border-terracotta-500"
                    }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </button>

                  {/* Dossier Paper Card */}
                  <Paper
                    rotate={CARD_TILTS[idx % CARD_TILTS.length]}
                    className={`min-w-0 max-w-full overflow-hidden rounded-2xl !p-5 sm:!p-7 max-sm:[rotate:0deg] transition-all duration-300 ${
                      isExpanded
                        ? "border-terracotta-300 shadow-lg"
                        : "hover:border-sand-300"
                    }`}>
                    <Tape
                      rotate={idx % 2 === 0 ? -1.8 : 1.5}
                      className="pointer-events-none absolute -top-2.5 left-1/2 z-20 -translate-x-1/2 opacity-90"
                    />

                    {/* Card Header: Company Badge + Role + Date Stamp */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                        <CompanyBadge item={item} />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-terracotta-600">
                              #{String(idx + 1).padStart(2, "0")}
                            </span>
                            {item.employment_type && (
                              <span className="rounded border border-sand-200 bg-sand-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-sand-700">
                                {item.employment_type}
                              </span>
                            )}
                            {item.is_current && (
                              <span className="stamp-in inline-flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                                Current Role
                              </span>
                            )}
                          </div>

                          <h3 className="mt-1 font-display text-xl leading-snug text-ink sm:text-2xl">
                            {item.role}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-sm text-sand-700">
                            {item.company_url ? (
                              <a
                                href={item.company_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-ink underline decoration-terracotta-300 underline-offset-4 transition hover:text-terracotta-600">
                                <span>{item.company}</span>
                                <span className="font-mono text-xs text-terracotta-600">
                                  ↗
                                </span>
                              </a>
                            ) : (
                              <span className="font-semibold text-ink">
                                {item.company}
                              </span>
                            )}

                            {item.location && (
                              <>
                                <span className="text-sand-300">·</span>
                                <span className="font-mono text-xs text-sand-500">
                                  {item.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Date Range Badge */}
                      <div className="flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-end">
                        <span className="rounded-full border border-sand-300 bg-sand-50/90 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-sand-800">
                          {dateLabel}
                        </span>

                        {bullets.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : item.id)
                            }
                            className="font-mono text-[10px] uppercase tracking-widest text-terracotta-600 hover:text-terracotta-700">
                            {isExpanded ? "Hide Notes ▴" : "Read Notes ▾"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Short Summary Callout */}
                    {item.summary && (
                      <p className="mt-4 border-l-2 border-terracotta-300 pl-3.5 font-body text-sm leading-relaxed text-sand-700 sm:text-[15px]">
                        {item.summary}
                      </p>
                    )}

                    {/* Detailed Responsibilities / Achievements Bullets */}
                    {bullets.length > 0 && isExpanded && (
                      <ul className="mt-4 space-y-2 rounded-xl border border-sand-200/80 bg-sand-50/50 p-4 font-body text-sm leading-relaxed text-sand-800">
                        {bullets.map((line, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-500" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Stack Tags */}
                    {tags.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-sand-200/70 pt-4">
                        {tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-md border border-sand-300/80 bg-ivory px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-sand-800">
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Paper>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
