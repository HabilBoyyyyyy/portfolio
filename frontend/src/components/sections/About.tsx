import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import Paper from "@/components/scrapbook/Paper";
import type {Profile} from "@/lib/api";

export default function About({profile}: {profile: Profile | null}) {
  return (
    <SectionShell id="about" label="01 / About" title="About me">
      <Reveal>
        <Paper tape rotate={-0.8} className="max-w-3xl !p-8 md:!p-10">
          <p className="whitespace-pre-line text-lg leading-relaxed text-sand-800 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-terracotta-600">
            {profile?.bio ?? "Add your bio in the admin."}
          </p>
        </Paper>
      </Reveal>
    </SectionShell>
  );
}
