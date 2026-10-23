"use client";

import {useState} from "react";
import Paper from "@/components/scrapbook/Paper";

type Status = "idle" | "sending" | "sent" | "error";

const QUICK_SUBJECTS = [
  "Internship opportunity",
  "Project collaboration",
  "Full-time role",
  "Just saying hello",
];

const field =
  "w-full rounded-lg border border-sand-300 bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-sand-400 focus:border-terracotta-600 focus:bg-white focus:ring-2 focus:ring-terracotta-500/15";
const label =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [messageLen, setMessageLen] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim() || null,
      message: String(formData.get("message") || "").trim(),
      _gotcha_field: String(formData.get("_gotcha_field") || ""),
    };

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Something went wrong. Please try again.");
      }
      form.reset();
      setSubject("");
      setMessageLen(0);
      setStatus("sent");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Paper tape rotate={0.6} className="!p-8 md:!p-12 text-center shadow-lg">
        <div className="mx-auto max-w-md space-y-5">
          <span className="stamp-in inline-block rounded border-4 border-green-600 bg-green-50 px-6 py-2 font-display text-3xl uppercase tracking-widest text-green-700 shadow-xs">
            Dispatched
          </span>
          <h3 className="font-display text-2xl text-ink">
            Message received loud and clear.
          </h3>
          <p className="font-body text-sm leading-relaxed text-sand-700">
            Thanks for reaching out! Your note has been logged in my inbox and
            I&apos;ll get back to you as soon as possible.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-ivory px-5 py-2 font-mono text-xs uppercase tracking-widest text-terracotta-600 transition hover:border-terracotta-500 hover:bg-terracotta-50">
              <span>Send another message</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </Paper>
    );
  }

  return (
    <Paper tape rotate={-0.5} className="!p-6 sm:!p-8 shadow-lg">
      {/* Postcard Header Strip */}
      <div className="mb-6 flex items-start justify-between border-b border-dashed border-sand-300 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta-600">
            Postal Dispatch // Direct Line
          </span>
          <h3 className="mt-0.5 font-display text-2xl text-ink">
            Send a Message
          </h3>
        </div>

        {/* Decorative SVG Air-Mail Stamp */}
        <div className="flex h-12 w-10 shrink-0 flex-col items-center justify-center rounded-[2px] border-2 border-dashed border-terracotta-400/80 bg-terracotta-50/70 p-1 text-center">
          <span className="font-mono text-[7px] uppercase tracking-tighter text-terracotta-700">
            AIR MAIL
          </span>
          <span className="font-display text-xs font-bold text-terracotta-600">
            ID
          </span>
          <span className="font-mono text-[6px] text-sand-500">2026</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Safe Honeypot: uses non-autofill field name (_gotcha_field) so Chrome/Safari autofill never triggers it */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0">
          <label htmlFor="_gotcha_field">Leave this field blank</label>
          <input
            id="_gotcha_field"
            type="text"
            name="_gotcha_field"
            tabIndex={-1}
            autoComplete="new-password"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={label}>
              Your name <span className="text-terracotta-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              maxLength={100}
              placeholder="Jane Doe"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="email" className={label}>
              Your email <span className="text-terracotta-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={200}
              placeholder="jane@email.com"
              className={field}
            />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-1">
            <label htmlFor="subject" className={label}>
              Subject (optional)
            </label>
            <span className="mb-1 font-mono text-[9px] uppercase tracking-wider text-sand-400">
              Or tap a quick topic below
            </span>
          </div>
          <input
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={150}
            placeholder="Internship opportunity"
            className={field}
          />
          {/* Quick Topic Chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK_SUBJECTS.map((topic) => {
              const isSelected = subject === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSubject(isSelected ? "" : topic)}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition ${
                    isSelected
                      ? "border-terracotta-600 bg-terracotta-600 text-ivory"
                      : "border-sand-200 bg-sand-50 text-sand-600 hover:border-terracotta-300 hover:text-ink"
                  }`}>
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="message" className={label}>
              Message <span className="text-terracotta-600">*</span>
            </label>
            <span className="mb-1 font-mono text-[10px] text-sand-400">
              {messageLen} / 3000
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={3000}
            onChange={(e) => setMessageLen(e.target.value.length)}
            placeholder="Tell me about your project, timeline, or idea..."
            className={field}
          />
        </div>

        {status === "error" && (
          <div
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 px-3.5 py-2.5 font-mono text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-sand-400">
            Encrypted &amp; Direct
          </span>

          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-2.5 rounded-full bg-terracotta-600 px-7 py-3 font-mono text-xs uppercase tracking-widest text-ivory shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-700 disabled:cursor-not-allowed disabled:opacity-60">
            <span>{status === "sending" ? "Sending..." : "Send Message"}</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </form>
    </Paper>
  );
}
