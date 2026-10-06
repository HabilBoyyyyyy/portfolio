import SectionShell from "@/components/SectionShell";
import SkillCard from "./SkillCard";
import type {Skill} from "@/lib/api";

export default function Skills({skills}: {skills: Skill[]}) {
  return (
    <SectionShell id="skills" label="02 / Skills" title="What I work with">
      <div className="grid gap-8 md:grid-cols-2">
        {skills.map((s, i) => (
          <SkillCard key={s.id} skill={s} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
