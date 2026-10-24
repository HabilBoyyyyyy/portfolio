import SectionShell from "@/components/SectionShell";
import ExperienceList from "./ExperienceList";
import type {Experience as ExperienceItem} from "@/lib/api";

export default function Experience({items}: {items: ExperienceItem[]}) {
  return (
    <SectionShell
      id="experience"
      label="Experience"
      title="Where I've worked">
      <ExperienceList items={items} />
    </SectionShell>
  );
}
