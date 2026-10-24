import SectionShell from "@/components/SectionShell";
import TimelineList from "./TimelineList";
import type {TimelineItem} from "@/lib/api";

export default function Timeline({items}: {items: TimelineItem[]}) {
  return (
    <SectionShell id="timeline" label="Journey" title="How I got here">
      <TimelineList items={items} />
    </SectionShell>
  );
}
