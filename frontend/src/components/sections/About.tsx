import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import type {Profile} from "@/lib/api";
import AboutPhoto from "./AboutPhoto";
import AboutText from "./AboutText";

export default function About({profile}: {profile: Profile | null}) {
  const photoSrc =
    profile?.about_image_url?.trim() ||
    profile?.hero_image_url?.trim() ||
    "/images/profile.webp";

  return (
    <SectionShell id="about" label="01 / About" title="About me">
      <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <AboutPhoto src={photoSrc} />
        </Reveal>

        <Reveal delay={150}>
          <AboutText
            name={profile?.name?.trim() || "Habil Baihaki Ramadhan"}
            role={profile?.role ?? null}
            bio={profile?.bio || ""}
            email={profile?.email ?? null}
            resumeUrl={profile?.resume_url ?? null}
          />
        </Reveal>
      </div>
    </SectionShell>
  );
}
