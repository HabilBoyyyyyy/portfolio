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
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Adds a background once you've scrolled a little
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tracks which section is crossing a thin band near the middle of the screen
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

  return (
    <header
      className={`sticky top-0 z-50 transition ${
        scrolled || open
          ? "border-b border-sand-100 bg-ivory/85 backdrop-blur"
          : "border-b border-transparent"
      }`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl text-ink">
          {name}
          <span className="text-terracotta-600">.</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <Link
                href={`/#${l.id}`}
                className={`font-mono text-xs uppercase tracking-widest transition ${
                  active === l.id
                    ? "text-terracotta-600"
                    : "text-sand-700 hover:text-ink"
                }`}>
                {l.label}
              </Link>
            </li>
          ))}
          {resumeUrl && (
            <li>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-sand-300 px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition hover:border-terracotta-600 hover:text-terracotta-600">
                CV
              </a>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="font-mono text-xs uppercase tracking-widest text-ink md:hidden">
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <ul className="space-y-1 px-6 pb-5 md:hidden">
          {links.map((l) => (
            <li key={l.id}>
              <Link
                href={`/#${l.id}`}
                onClick={() => setOpen(false)}
                className={`block py-2 font-mono text-sm uppercase tracking-widest ${
                  active === l.id ? "text-terracotta-600" : "text-sand-800"
                }`}>
                {l.label}
              </Link>
            </li>
          ))}
          {resumeUrl && (
            <li>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 font-mono text-sm uppercase tracking-widest text-terracotta-600">
                Download CV
              </a>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
