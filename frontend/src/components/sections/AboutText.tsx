"use client";

import { useEffect, useRef, useState } from "react";
import { socials } from "@/lib/site";

export default function AboutText({
  name,
  role,
  bio,
  resumeUrl,
}: {
  name: string;
  role: string | null;
  bio: string;
  resumeUrl: string | null;
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
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const defaultBio =
    "Informatics student at President University with a focus on AI/ML and full-stack web development. I build systems where software meets the real world — from IoT-connected campus apps to robotic arms and industrial inspection prototypes.";

  const displayBio = bio && bio.trim().length > 10 ? bio : defaultBio;

  // Split into max 2 short paragraphs
  const paragraphs = displayBio
    .split("\n")
    .filter((p) => p.trim() !== "")
    .slice(0, 2);

  const firstName = name.split(" ")[0];
  const restOfName = name.split(" ").slice(1).join(" ");

  return (
    <div ref={ref} className="space-y-6">
      {/* ── Name Header ── */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sand-500 mb-2">
          I am
        </p>
        <h3 className="font-display text-3xl md:text-4xl tracking-wide text-ink">
          {firstName}{" "}
          <span className="bg-ink text-ivory px-3 py-1 inline-block rotate-[-0.5deg]">
            {restOfName}
          </span>
        </h3>
      </div>

      {/* ── Role Badge ── */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transitionDelay: "150ms",
        }}
      >
        <span className="inline-block bg-terracotta-600 text-ivory font-display text-sm md:text-base uppercase tracking-widest px-4 py-1.5 rotate-[-0.3deg]">
          {role || "Full-Stack Developer & AI Engineer"}
        </span>
      </div>

      {/* ── Bio Paragraphs with left accent ── */}
      <div
        className="border-l-[3px] border-terracotta-600 pl-5 space-y-4 transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-12px)",
          transitionDelay: "350ms",
        }}
      >
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-[15px] md:text-base leading-relaxed text-sand-700"
          >
            {para.trim()}
          </p>
        ))}
      </div>

      {/* ── Download CV Button & Socials ── */}
      <div
        className="flex flex-wrap items-center gap-4 transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transitionDelay: "500ms",
        }}
      >
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-2.5 bg-ink text-ivory font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-300 hover:bg-terracotta-700 hover:shadow-[0_6px_20px_rgba(193,80,46,0.3)]"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download CV
          </a>
        )}

        <div className="flex items-center gap-3 ml-2">
          {socials.map((s) => {
            let iconPath = "";
            let hoverClass = "";

            if (s.label === "GitHub") {
              iconPath = "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z";
              hoverClass = "hover:bg-[#181717] hover:border-[#181717] hover:text-white";
            } else if (s.label === "LinkedIn") {
              iconPath = "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z";
              hoverClass = "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white";
            } else if (s.label === "Instagram") {
              iconPath = "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z";
              hoverClass = "hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white";
            } else {
              return null; // Fallback for unsupported labels if any
            }

            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className={`flex items-center justify-center w-11 h-11 rounded-full border border-sand-300 bg-transparent text-sand-500 transition-all duration-300 ${hoverClass} hover:shadow-lg`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={iconPath} />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
