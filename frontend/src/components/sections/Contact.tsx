import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import ContactForm from "./ContactForm";
import {socials} from "@/lib/site";
import type {Profile} from "@/lib/api";

export default function Contact({profile}: {profile: Profile | null}) {
  return (
    <SectionShell id="contact" label="06 / Contact" title="Let's talk">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="max-w-sm text-lg text-sand-800">
            Hiring, need an intern, or just want to connect? I&apos;m open to
            new opportunities and conversations.
          </p>

          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="mt-6 inline-block text-terracotta-600 underline underline-offset-4 hover:text-terracotta-700">
              {profile.email}
            </a>
          )}

          <ul className="mt-8 space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-widest text-sand-700 transition hover:text-terracotta-600">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <ContactForm />
        </Reveal>
      </div>
    </SectionShell>
  );
}
