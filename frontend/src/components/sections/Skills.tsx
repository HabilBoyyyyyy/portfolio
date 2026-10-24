import SectionShell from "@/components/SectionShell";
import SkillsMarquee from "./SkillsMarquee";
import type {Skill} from "@/lib/api";

export default function Skills({skills}: {skills: Skill[]}) {
  return (
    <SectionShell id="skills" label="Skills" title="What I work with">
      <SkillsMarquee skills={skills} />
    </SectionShell>
  );
}
