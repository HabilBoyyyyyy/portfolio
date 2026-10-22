"use client";

import Link from "next/link";
import {useEffect, useState} from "react";

type NavLink = {id: string; label: string};

export default function Navbar({
  links,
  name,
  resumeUrl,
}: {
  links: NavLink[];
  name: string;
  resumeUrl: string | null;
}) {
  const [active, setActive] = useState(links[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll state + lightweight reading progress ring
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is crossing the center viewport band
  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      {rootMargin: "-40% 0px -55% 0px"},
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [links]);

  const circumference = 2 * Math.PI * 12;
  const strokeDashoffset = circumference * (1 - scrollProgress);

  return (
    <header className="pointer-events-none sticky top-4 z-50 px-4 sm:top-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        {/* Detached Floating Pill Island */}
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full border transition-all duration-300 md:w-auto md:gap-5 ${
            scrolled || open
              ? "border-sand-300/90 bg-ivory/92 px-3.5 py-2 shadow-[0_12px_32px_-10px_rgba(32,28,26,0.16),0_2px_6px_rgba(32,28,26,0.06)] backdrop-blur-md"
              : "border-sand-200/90 bg-ivory/80 px-4 py-2.5 shadow-[0_4px_18px_-6px_rgba(32,28,26,0.08)] backdrop-blur-sm"
          }`}>
          {/* Left: Monogram Stamp + Scroll Progress Ring + Name */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-full pr-2 outline-none">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 font-mono text-xs font-bold text-ink transition-transform duration-300 group-hover:scale-105">
              <svg
                className="pointer-events-none absolute inset-0 -rotate-90"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                aria-hidden="true">
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="text-sand-300/70"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-terracotta-600 transition-[stroke-dashoffset] duration-150"
                />
              </svg>
              <span>{name.charAt(0)}</span>
            </span>

            <span className="font-display text-lg tracking-tight text-ink transition-colors group-hover:text-terracotta-600">
              {name}
              <span className="text-terracotta-600">.</span>
            </span>
          </Link>

          {/* Center: Desktop Floating Pill Links */}
          <ul
            onMouseLeave={() => setHoveredId(null)}
            className="hidden items-center gap-1 rounded-full border border-sand-200/70 bg-sand-50/70 p-1 md:flex">
            {links.map((l, idx) => {
              const isActive = active === l.id;
              const isHovered = hoveredId === l.id;

              return (
                <li key={l.id}>
                  <Link
                    href={`/#${l.id}`}
                    onMouseEnter={() => setHoveredId(l.id)}
                    className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 ${
                      isActive
                        ? "bg-ink text-ivory shadow-xs"
                        : isHovered
                          ? "bg-sand-200/70 text-ink"
                          : "text-sand-700 hover:text-ink"
                    }`}>
                    <span
                      className={`text-[9px] transition-opacity duration-200 ${
                        isActive
                          ? "text-terracotta-400 opacity-100"
                          : "text-sand-400 opacity-70"
                      }`}>
                      0{idx + 1}
                    </span>
                    <span>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Perforated CV Stub + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden items-center gap-1.5 rounded-full border border-terracotta-300 bg-terracotta-50 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-terracotta-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta-600 hover:bg-terracotta-600 hover:text-ivory hover:shadow-xs md:inline-flex">
                <span>CV</span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M3 9L9 3M9 3H4.5M9 3V7.5" />
                </svg>
              </a>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-sand-50 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink transition hover:border-terracotta-500 md:hidden">
              <span>{open ? "Close" : "Index"}</span>
              <span className="relative flex h-3 w-3.5 flex-col justify-between">
                <span
                  className={`h-[1.5px] w-full bg-current transition-transform duration-200 ${
                    open ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-[1.5px] w-full bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-[1.5px] w-full bg-current transition-transform duration-200 ${
                    open ? "-translate-y-[5.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile Detached Card Drawer */}
        {open && (
          <div className="pointer-events-auto mt-2.5 w-full overflow-hidden rounded-2xl border border-sand-300 bg-ivory/95 p-4 shadow-xl backdrop-blur-md md:hidden">
            <div className="mb-2 flex items-center justify-between border-b border-sand-200 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sand-500">
                Navigation Directory
              </span>
              <span className="font-mono text-[10px] text-terracotta-600">
                {Math.round(scrollProgress * 100)}% Read
              </span>
            </div>

            <ul className="grid grid-cols-2 gap-1.5">
              {links.map((l, idx) => {
                const isActive = active === l.id;
                return (
                  <li key={l.id}>
                    <Link
                      href={`/#${l.id}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
                        isActive
                          ? "border-ink bg-ink text-ivory"
                          : "border-sand-200/80 bg-sand-50/60 text-sand-800 hover:border-terracotta-400"
                      }`}>
                      <span
                        className={`text-[10px] ${
                          isActive ? "text-terracotta-300" : "text-sand-400"
                        }`}>
                        0{idx + 1}
                      </span>
                      <span className="truncate">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {resumeUrl && (
              <div className="mt-3 border-t border-sand-200 pt-3">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-600 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-xs transition hover:bg-terracotta-700">
                  <span>Download Curriculum Vitae</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
