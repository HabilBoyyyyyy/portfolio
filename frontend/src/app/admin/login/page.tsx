"use client";

import {useState, useEffect} from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Running-away button states
  const [shiftIndex, setShiftIndex] = useState(0);
  const [hasAttemptedHover, setHasAttemptedHover] = useState(false);

  const isFormFilled = username.trim().length > 0 && password.trim().length > 0;

  // Reset shift & clear error when form is edited
  useEffect(() => {
    if (isFormFilled) {
      setShiftIndex(0);
    }
    if (error) {
      setError("");
    }
  }, [username, password, isFormFilled, error]);

  // Positions cycling: center (0), left (1), top (2), right (3), bottom (4)
  const shiftTransforms = [
    "translate-x-0 translate-y-0",
    "-translate-x-24 translate-y-0",
    "translate-x-0 -translate-y-12",
    "translate-x-24 translate-y-0",
    "translate-x-0 translate-y-12",
  ];

  function triggerShift() {
    if (!isFormFilled) {
      setHasAttemptedHover(true);
      setShiftIndex((prev) => {
        // Cycle between 1, 2, 3, 4
        return (prev % 4) + 1;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!isFormFilled) {
      triggerShift();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username: username.trim(),
          password,
          remember,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        // Full navigation commits cookies immediately and avoids stale router caches
        window.location.href = "/admin";
      } else {
        setError(data?.error || "Invalid username or password.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const currentTransform = isFormFilled
    ? "translate-x-0 translate-y-0"
    : shiftTransforms[shiftIndex];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-ivory bg-[radial-gradient(rgba(32,28,26,0.08)_1px,transparent_1px)] bg-[size:24px_24px] px-4 selection:bg-terracotta-500 selection:text-ivory relative overflow-hidden">
      {/* Background warm ambient terracotta glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-terracotta-500/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main card container */}
      <div className="relative w-full max-w-[400px] pt-12">
        {/* Top floating circular avatar badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-sand-900 border-2 border-sand-700 flex items-center justify-center shadow-xl z-20">
          <div className="w-20 h-20 rounded-full bg-ink border border-sand-800 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-terracotta-500"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>

        {/* Form Card using portfolio ink palette */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-ink text-ivory border border-sand-800/90 rounded-[30px] p-8 pt-16 shadow-[0_24px_64px_rgba(32,28,26,0.3)] flex flex-col items-center relative z-10">
          {/* Title in signature Fraunces display font */}
          <h1 className="font-display text-2xl tracking-[0.2em] text-ivory font-bold uppercase mt-1 mb-2">
            LOGIN
          </h1>

          {/* Dynamic feedback message banner */}
          <div className="min-h-[24px] flex items-center justify-center mb-5 px-2 w-full">
            {error ? (
              <p className="text-[#f87171] font-mono text-xs text-center leading-tight">
                {error}
              </p>
            ) : isFormFilled ? (
              <p className="text-[#7bd389] font-mono text-xs text-center tracking-wider">
                Great! Now you can proceed
              </p>
            ) : hasAttemptedHover ? (
              <p className="text-terracotta-400 font-mono text-xs text-center tracking-wider animate-pulse">
                Please fill the input fields before proceeding
              </p>
            ) : (
              <p className="text-sand-400 font-mono text-xs text-center tracking-wider">
                Enter your credentials
              </p>
            )}
          </div>

          {/* Username field */}
          <div className="w-full relative border-b border-sand-700 focus-within:border-terracotta-500 transition-colors py-2 mb-6">
            <input
              type="text"
              id="uname"
              name="username"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full bg-transparent outline-none text-ivory font-mono text-sm placeholder:text-sand-500 pr-8"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sand-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
          </div>

          {/* Password field */}
          <div className="w-full relative border-b border-sand-700 focus-within:border-terracotta-500 transition-colors py-2 mb-6">
            <input
              type="password"
              id="pass"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-transparent outline-none text-ivory font-mono text-sm placeholder:text-sand-500 pr-8"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sand-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
          </div>

          {/* Actions: Remember Me & Portfolio Link */}
          <div className="flex items-center justify-between w-full text-xs font-mono text-sand-400 mb-6">
            <label
              htmlFor="remember"
              className="flex items-center gap-2 cursor-pointer select-none hover:text-ivory transition-colors">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-sand-700 bg-sand-900 text-terracotta-600 focus:ring-0 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/"
              className="text-sand-400 hover:text-terracotta-400 transition-colors">
              View Site ↗
            </Link>
          </div>

          {/* Button container with running-away trigger */}
          <div
            className="w-full py-6 min-h-[96px] flex items-center justify-center relative overflow-visible"
            onMouseEnter={triggerShift}
            onTouchStart={triggerShift}>
            <button
              type="submit"
              id="login-btn"
              disabled={loading}
              onMouseEnter={triggerShift}
              onTouchStart={triggerShift}
              className={`py-3.5 px-8 rounded-[16px] bg-terracotta-600 hover:bg-terracotta-700 active:scale-[0.98] text-ivory font-mono text-xs uppercase tracking-widest font-semibold shadow-lg shadow-terracotta-900/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none ${currentTransform} ${
                !isFormFilled ? "cursor-not-allowed opacity-90" : "opacity-100"
              }`}>
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="font-mono text-[11px] text-sand-500 hover:text-sand-300 tracking-wider transition-colors">
              ← Return to portfolio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
