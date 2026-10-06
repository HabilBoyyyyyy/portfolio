"use client";

import {useState} from "react";
import Paper from "@/components/scrapbook/Paper";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded border border-sand-200 bg-ivory px-3 py-2 text-sm outline-none transition focus:border-terracotta-600";
const label =
  "mb-1 block font-mono text-[10px] uppercase tracking-widest text-sand-600";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // grab it now: it becomes null after the first await
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Something went wrong. Please try again.");
      }
      form.reset();
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
      <Paper tape rotate={1} className="!py-12 text-center">
        <span className="stamp-in inline-block rounded border-4 border-green-600 px-6 py-2 font-display text-3xl uppercase tracking-widest text-green-600">
          Sent
        </span>
        <p className="mt-6 text-sand-800">
          Thanks for reaching out. I&apos;ll reply as soon as I can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-xs uppercase tracking-widest text-terracotta-600 underline">
          Send another
        </button>
      </Paper>
    );
  }

  return (
    <Paper tape rotate={-0.6} className="!p-6 md:!p-8">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Honeypot, hidden from people */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className={label}>
              Your name
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
              Your email
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
          <label htmlFor="subject" className={label}>
            Subject (optional)
          </label>
          <input
            id="subject"
            name="subject"
            maxLength={150}
            placeholder="Internship opportunity"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="message" className={label}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={3000}
            placeholder="Tell me about your project or idea..."
            className={field}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-terracotta-600 px-6 py-3 text-sm font-medium text-ivory transition hover:bg-terracotta-700 disabled:opacity-60">
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
      </form>
    </Paper>
  );
}
