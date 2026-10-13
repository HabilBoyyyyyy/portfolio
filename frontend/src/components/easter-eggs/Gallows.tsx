"use client";

import { useEffect, useState, useCallback } from "react";
import Paper from "@/components/scrapbook/Paper";

const WORDS = [
  { word: "JAVASCRIPT", hint: "Programming Language" },
  { word: "TYPESCRIPT", hint: "Programming Language" },
  { word: "PYTHON", hint: "Programming Language" },
  { word: "NEXTJS", hint: "Web Framework" },
  { word: "FASTAPI", hint: "Web Framework" },
  { word: "TAILWIND", hint: "CSS Framework" },
  { word: "POSTGRES", hint: "Database" },
  { word: "DOCKER", hint: "DevOps Tool" },
  { word: "KUBERNETES", hint: "DevOps Tool" },
  { word: "ALGORITHM", hint: "Computer Science" },
  { word: "RECURSION", hint: "Computer Science" },
  { word: "DEBUGGING", hint: "Developer Activity" },
  { word: "FRONTEND", hint: "Web Development" },
  { word: "BACKEND", hint: "Web Development" },
  { word: "DATABASE", hint: "Technology" },
  { word: "COMPONENT", hint: "React Concept" },
  { word: "MIDDLEWARE", hint: "Software Pattern" },
  { word: "RESPONSIVE", hint: "Design Principle" },
  { word: "SERVERLESS", hint: "Architecture" },
  { word: "WEBSOCKET", hint: "Protocol" },
  { word: "LOCALHOST", hint: "Development" },
  { word: "TERMINAL", hint: "Developer Tool" },
  { word: "COMPILER", hint: "Computer Science" },
  { word: "HASHMAP", hint: "Data Structure" },
  { word: "BINARY", hint: "Computer Science" },
  { word: "NEURAL", hint: "AI/ML Concept" },
  { word: "PYTORCH", hint: "ML Framework" },
  { word: "GITHUB", hint: "Platform" },
  { word: "VERCEL", hint: "Platform" },
  { word: "RENDER", hint: "Platform" },
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

export default function Gallows({ open, onClose }: GallowsProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  const currentWord = WORDS[wordIndex];
  const wrongGuesses = Array.from(guessedLetters).filter(
    (letter) => !currentWord.word.includes(letter)
  ).length;

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
    } else if (wrongGuesses >= 6) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur">
      <div className="relative w-full max-w-2xl">
        <Paper className="bg-ink p-8 border border-sand-900 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-2xl text-sand-400 transition hover:text-ivory"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="text-center mb-8">
            <h2 className="font-display text-3xl uppercase tracking-wider text-terracotta-500">
              The Gallows
            </h2>
            <p className="font-mono text-xs text-sand-500">
              A developer&apos;s word game
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-center mb-8">
            <div className="relative">
              <svg
                width="200"
                height="250"
                viewBox="0 0 200 250"
                className="fill-none"
                strokeWidth="4"
              >
                <g className="stroke-sand-400">
                  <line x1="20" y1="230" x2="180" y2="230" />
                  <line x1="60" y1="230" x2="60" y2="20" />
                  <line x1="60" y1="20" x2="140" y2="20" />
                  <line x1="140" y1="20" x2="140" y2="50" />
                </g>
                <g className="stroke-terracotta-500 transition-all duration-300">
                  {wrongGuesses >= 1 && <circle cx="140" cy="70" r="20" />}
                  {wrongGuesses >= 2 && (
                    <line x1="140" y1="90" x2="140" y2="150" />
                  )}
                  {wrongGuesses >= 3 && (
                    <line x1="140" y1="100" x2="110" y2="130" />
                  )}
                  {wrongGuesses >= 4 && (
                    <line x1="140" y1="100" x2="170" y2="130" />
                  )}
                  {wrongGuesses >= 5 && (
                    <line x1="140" y1="150" x2="110" y2="200" />
                  )}
                  {wrongGuesses >= 6 && (
                    <line x1="140" y1="150" x2="170" y2="200" />
                  )}
                </g>
              </svg>
              {status === "won" && (
                <div className="stamp-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-green-600 px-4 py-2 text-2xl font-bold tracking-widest text-green-600">
                  SOLVED
                </div>
              )}
              {status === "lost" && (
                <div className="stamp-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[15deg] border-4 border-terracotta-600 px-4 py-2 text-2xl font-bold tracking-widest text-terracotta-600">
                  HANGED
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 text-center">
              <div>
                <p className="font-mono text-sm uppercase text-sand-500 mb-2">
                  {currentWord.hint}
                </p>
                <div className="font-mono text-2xl tracking-[0.5em] text-terracotta-400 min-h-[2.5rem]">
                  {currentWord.word.split("").map((char, i) => (
                    <span key={i}>
                      {guessedLetters.has(char) || status === "lost"
                        ? char
                        : "_"}
                    </span>
                  ))}
                </div>
              </div>

              {status !== "playing" && (
                <button
                  onClick={resetGame}
                  className="font-mono text-sm px-4 py-2 border border-sand-700 text-sand-300 hover:bg-terracotta-700 hover:text-ivory transition rounded"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {QWERTY.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((char) => {
                  const isGuessed = guessedLetters.has(char);
                  return (
                    <button
                      key={char}
                      disabled={isGuessed || status !== "playing"}
                      onClick={() => {
                        setGuessedLetters((prev) => {
                          const next = new Set(prev);
                          next.add(char);
                          return next;
                        });
                      }}
                      className="w-9 h-9 rounded border border-sand-700 bg-sand-900 text-sand-200 font-mono text-sm hover:bg-terracotta-700 hover:text-ivory transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {char}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
