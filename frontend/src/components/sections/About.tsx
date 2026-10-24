import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import type {Profile} from "@/lib/api";
import AboutPhoto from "./AboutPhoto";
import AboutText from "./AboutText";

export default function About({profile}: {profile: Profile | null}) {
  return (
    <SectionShell id="about" label="About" title="About me">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] items-center">
        
        <Reveal>
          <AboutPhoto src={profile?.about_image_url || "/images/profile.webp"} />
        </Reveal>

        <Reveal delay={150}>
          <AboutText
            name={profile?.name || "Habil Baihaki Ramadhan"}
            role={profile?.role ?? null}
            bio={profile?.bio || ""}
            resumeUrl={profile?.resume_url ?? null}
          />
        </Reveal>

      </div>
    </SectionShell>
  );
}
