import Reveal from "@/components/Reveal";

export default function SectionShell({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-terracotta-600">
          {label}
        </p>
        <h2 className="mt-2 font-display text-4xl text-ink">{title}</h2>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}
