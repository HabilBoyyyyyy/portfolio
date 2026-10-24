import SectionShell from "@/components/SectionShell";
import Reveal from "@/components/Reveal";
import Paper from "@/components/scrapbook/Paper";
import type {Certificate} from "@/lib/api";

export default function Certificates({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <SectionShell
      id="certificates"
      label="Certificates"
      title="Credentials">
      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <Paper
              rotate={i % 2 === 0 ? -0.6 : 0.6}
              className="flex items-stretch !p-0 hover:-translate-y-1 hover:[rotate:0deg]">
              <div className="flex-1 p-5">
                {c.issuer && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-green-600">
                    {c.issuer}
                  </p>
                )}
                <h3 className="mt-1 font-display text-xl text-ink">{c.name}</h3>
                {c.date && (
                  <p className="mt-2 text-sm text-sand-600">{c.date}</p>
                )}
              </div>

              {/* Ticket stub with a rubber-stamp score */}
              {c.score && (
                <div className="flex w-28 items-center justify-center border-l-2 border-dashed border-sand-200 p-3">
                  <span className="-rotate-[8deg] rounded-full border-2 border-terracotta-600 px-3 py-2 text-center font-mono text-[10px] uppercase leading-tight text-terracotta-600">
                    Score
                    <span className="block text-lg font-semibold">
                      {c.score}
                    </span>
                  </span>
                </div>
              )}
            </Paper>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
