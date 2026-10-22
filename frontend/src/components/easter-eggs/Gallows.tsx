"use client";

import {useEffect, useState, useCallback} from "react";
import Paper from "@/components/scrapbook/Paper";

const WORDS = [
  {word: "JAVASCRIPT", hint: "Programming Language"},
  {word: "TYPESCRIPT", hint: "Programming Language"},
  {word: "PYTHON", hint: "Programming Language"},
  {word: "NEXTJS", hint: "Web Framework"},
  {word: "FASTAPI", hint: "Web Framework"},
  {word: "TAILWIND", hint: "CSS Framework"},
  {word: "POSTGRES", hint: "Database"},
  {word: "DOCKER", hint: "DevOps Tool"},
  {word: "KUBERNETES", hint: "DevOps Tool"},
  {word: "ALGORITHM", hint: "Computer Science"},
  {word: "RECURSION", hint: "Computer Science"},
  {word: "DEBUGGING", hint: "Developer Activity"},
  {word: "FRONTEND", hint: "Web Development"},
  {word: "BACKEND", hint: "Web Development"},
  {word: "DATABASE", hint: "Technology"},
  {word: "COMPONENT", hint: "React Concept"},
  {word: "MIDDLEWARE", hint: "Software Pattern"},
  {word: "RESPONSIVE", hint: "Design Principle"},
  {word: "SERVERLESS", hint: "Architecture"},
  {word: "WEBSOCKET", hint: "Protocol"},
  {word: "LOCALHOST", hint: "Development"},
  {word: "TERMINAL", hint: "Developer Tool"},
  {word: "COMPILER", hint: "Computer Science"},
  {word: "HASHMAP", hint: "Data Structure"},
  {word: "BINARY", hint: "Computer Science"},
  {word: "NEURAL", hint: "AI/ML Concept"},
  {word: "PYTORCH", hint: "ML Framework"},
  {word: "GITHUB", hint: "Platform"},
  {word: "VERCEL", hint: "Platform"},
  {word: "RENDER", hint: "Platform"},
];

const QWERTY = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

interface GallowsProps {
  open: boolean;
  onClose: () => void;
}

export default function Gallows({open, onClose}: GallowsProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  const currentWord = WORDS[wordIndex];
  const wrongGuesses = Array.from(guessedLetters).filter(
    (letter) => !currentWord.word.includes(letter),
  ).length;
  const maxWrong = 6;
  const livesLeft = Math.max(0, maxWrong - wrongGuesses);

  const resetGame = useCallback(() => {
    setWordIndex(Math.floor(Math.random() * WORDS.length));
    setGuessedLetters(new Set());
    setStatus("playing");
  }, []);

  useEffect(() => {
    if (open) resetGame();
  }, [open, resetGame]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (status !== "playing") return;

    const isWon = currentWord.word
      .split("")
      .every((char) => guessedLetters.has(char));
    if (isWon) {
      setStatus("won");
    } else if (wrongGuesses >= maxWrong) {
      setStatus("lost");
    }
  }, [guessedLetters, currentWord.word, wrongGuesses, status]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (status === "playing") {
        const char = e.key.toUpperCase();
        if (/^[A-Z]$/.test(char)) {
          setGuessedLetters((prev) => {
            if (prev.has(char)) return prev;
            const next = new Set(prev);
            next.add(char);
            return next;
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, status, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl">
        <Paper
          tape
          rotate={0.3}
          className="overflow-hidden rounded-2xl border-2 border-sand-300 bg-ivory !p-6 shadow-[0_24px_60px_rgba(0,0,0,0.5)] sm:!p-8">
          {/* Top Header Bar */}
          <div className="flex items-start justify-between border-b border-sand-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-terracotta-600" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta-600">
                  Interactive Cipher // Easter Egg
                </span>
              </div>
              <h2 className="mt-1 font-display text-3xl uppercase tracking-wider text-ink">
                The Gallows
              </h2>
              <p className="font-mono text-xs text-sand-600">
                A developer&apos;s word game
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sand-300 bg-sand-50 font-mono text-sm text-sand-700 transition hover:border-terracotta-600 hover:bg-terracotta-600 hover:text-ivory">
              ✕
            </button>
          </div>

          {/* Main Game Grid: Left Architectural Drafting Board + Right Letterpress Tiles */}
          <div className="my-6 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            {/* Left: Architectural Blueprint Gallows Box */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-sand-800 bg-ink p-5 text-ivory shadow-inner md:col-span-5">
              {/* Attempts Pips */}
              <div className="mb-2 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-widest text-sand-400">
                <span>Attempts</span>
                <div className="flex items-center gap-1">
                  {Array.from({length: maxWrong}).map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        idx < livesLeft
                          ? "bg-green-500"
                          : "bg-terracotta-600/80"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <svg
                width="180"
                height="210"
                viewBox="0 0 200 240"
                className="fill-none"
                strokeLinecap="round"
                strokeLinejoin="round">
                {/* Blueprint Grid Reference Lines */}
                <line
                  x1="10"
                  y1="220"
                  x2="190"
                  y2="220"
                  stroke="rgba(250,246,240,0.08)"
                  strokeWidth="1"
                />
                <line
                  x1="55"
                  y1="10"
                  x2="55"
                  y2="230"
                  stroke="rgba(250,246,240,0.08)"
                  strokeWidth="1"
                />

                {/* Architectural Timber Gallows Frame */}
                <g className="stroke-sand-300" strokeWidth="4.5">
                  {/* Base Platform */}
                  <line x1="20" y1="220" x2="180" y2="220" />
                  <line x1="32" y1="228" x2="168" y2="228" strokeWidth="2" />
                  {/* Vertical Timber Post */}
                  <line x1="55" y1="220" x2="55" y2="22" />
                  {/* Top Crossbeam */}
                  <line x1="50" y1="22" x2="145" y2="22" />
                  {/* Angled Support Brace */}
                  <line x1="55" y1="58" x2="92" y2="22" strokeWidth="3.5" />
                  {/* Rope & Coil Knot */}
                  <line
                    x1="140"
                    y1="22"
                    x2="140"
                    y2="50"
                    strokeWidth="2.5"
                    className="stroke-terracotta-400"
                  />
                </g>

                {/* Drawn Figure Stages */}
                <g
                  className="stroke-terracotta-500 transition-all duration-300"
                  strokeWidth="4">
                  {wrongGuesses >= 1 && (
                    <circle cx="140" cy="68" r="18" className="fill-ink" />
                  )}
                  {wrongGuesses >= 2 && (
                    <line x1="140" y1="86" x2="140" y2="146" />
                  )}
                  {wrongGuesses >= 3 && (
                    <line x1="140" y1="100" x2="112" y2="128" />
                  )}
                  {wrongGuesses >= 4 && (
                    <line x1="140" y1="100" x2="168" y2="128" />
                  )}
                  {wrongGuesses >= 5 && (
                    <line x1="140" y1="146" x2="114" y2="194" />
                  )}
                  {wrongGuesses >= 6 && (
                    <line x1="140" y1="146" x2="166" y2="194" />
                  )}
                </g>
              </svg>

              {status === "won" && (
                <div className="stamp-in absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] rounded border-4 border-green-500 bg-ink/95 px-4 py-1.5 font-mono text-xl font-bold tracking-widest text-green-400 shadow-lg">
                  SOLVED
                </div>
              )}
              {status === "lost" && (
                <div className="stamp-in absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[12deg] rounded border-4 border-terracotta-500 bg-ink/95 px-4 py-1.5 font-mono text-xl font-bold tracking-widest text-terracotta-400 shadow-lg">
                  HANGED
                </div>
              )}
            </div>

            {/* Right: Clue Pill + Letterpress Word Slots */}
            <div className="flex flex-col items-center justify-center gap-5 text-center md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-sand-50 px-3.5 py-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-sand-500">
                  Category Hint:
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-terracotta-700">
                  {currentWord.hint}
                </span>
              </div>

              {/* Letterpress Tile Slots */}
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {currentWord.word.split("").map((char, i) => {
                  const isRevealed = guessedLetters.has(char);
                  const isMissedOnLoss = status === "lost" && !isRevealed;

                  return (
                    <span
                      key={i}
                      className={`inline-flex h-11 w-9 items-center justify-center rounded-lg border-2 border-b-4 font-mono text-lg font-bold transition-all sm:h-12 sm:w-10 sm:text-xl ${
                        isRevealed
                          ? "border-ink bg-white text-ink shadow-xs"
                          : isMissedOnLoss
                            ? "border-terracotta-500 bg-terracotta-50 text-terracotta-700"
                            : "border-sand-300 bg-sand-100/70 text-sand-400"
                      }`}>
                      {isRevealed || status === "lost" ? char : "_"}
                    </span>
                  );
                })}
              </div>

              {status !== "playing" ? (
                <button
                  type="button"
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta-600 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ivory shadow-md transition hover:-translate-y-0.5 hover:bg-terracotta-700">
                  <span>Play Again</span>
                  <span>→</span>
                </button>
              ) : (
                <p className="font-mono text-[11px] text-sand-500">
                  Type on your keyboard or tap the mechanical keys below (
                  {livesLeft} {livesLeft === 1 ? "mistake" : "mistakes"} left)
                </p>
              )}
            </div>
          </div>

          {/* Bottom: Tactile Mechanical Keycaps */}
          <div className="rounded-xl border border-sand-200 bg-sand-50/80 p-3 sm:p-4">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              {QWERTY.map((row, i) => (
                <div
                  key={i}
                  className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
                  {row.map((char) => {
                    const isGuessed = guessedLetters.has(char);
                    const isHit = isGuessed && currentWord.word.includes(char);
                    const isMiss =
                      isGuessed && !currentWord.word.includes(char);

                    return (
                      <button
                        key={char}
                        type="button"
                        disabled={isGuessed || status !== "playing"}
                        onClick={() => {
                          setGuessedLetters((prev) => {
                            const next = new Set(prev);
                            next.add(char);
                            return next;
                          });
                        }}
                        className={`h-9 w-8 rounded-md border font-mono text-xs font-semibold transition-all sm:h-9 sm:w-9 sm:text-sm ${
                          isHit
                            ? "border-green-600 bg-green-600 text-ivory shadow-none"
                            : isMiss
                              ? "border-sand-200 bg-sand-200/60 text-sand-400 line-through opacity-50"
                              : "border-sand-300 border-b-2 bg-white text-ink shadow-[0_1px_0_rgba(32,28,26,0.12)] hover:-translate-y-0.5 hover:border-terracotta-500 hover:text-terracotta-600 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                        }`}>
                        {char}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}
