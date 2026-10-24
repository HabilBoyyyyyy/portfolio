import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/ui/InteractiveBackground";
import {getProfile, getSections, isVisible} from "@/lib/api";
import {socials} from "@/lib/site";
import EasterEggs from "@/components/easter-eggs/EasterEggs";

const NAV = [
  {key: "hero", id: "home", label: "Home"},
  {key: "about", id: "about", label: "About"},
  {key: "skills", id: "skills", label: "Skills"},
  {key: "projects", id: "projects", label: "Projects"},
  {key: "experience", id: "experience", label: "Experience"},
  {key: "certificates", id: "certificates", label: "Certificates"},
  {key: "timeline", id: "timeline", label: "Journey"},
  {key: "contact", id: "contact", label: "Contact"},
];

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, sections] = await Promise.all([getProfile(), getSections()]);

  const links = NAV.filter((n) => isVisible(sections, n.key)).map(
    ({id, label}) => ({id, label}),
  );
  const fullName = profile?.name ?? "Habil Baihaki Ramadhan";

  return (
    <>
      <InteractiveBackground variant="dot-grid" />

      <Navbar
        links={links}
        name={fullName.split(" ")[0]}
        resumeUrl={profile?.resume_url ?? null}
      />
      {children}

      <footer className="mt-0 w-full border-t border-sand-200/90 bg-ivory">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-3.5 md:flex-row">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full bg-green-600"
              title="Open to Opportunities"
            />
            <p className="font-mono text-xs text-sand-600">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-ink">{fullName}</span>. All
              rights reserved.
            </p>
          </div>

          <div className="order-last md:order-none">
            <EasterEggs resumeUrl={profile?.resume_url ?? null} />
          </div>

          <div className="flex items-center gap-5">
            <ul className="flex items-center gap-5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-sand-700 transition-colors hover:text-terracotta-600">
                    <span>{s.label}</span>
                    <span className="text-[10px] text-sand-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-terracotta-600">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <span className="h-3.5 w-[1px] bg-sand-300" aria-hidden="true" />

            <a
              href="#home"
              aria-label="Scroll to top"
              title="Back to top"
              className="group inline-flex h-7 w-7 items-center justify-center rounded-full border border-sand-300 bg-white text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta-600 hover:bg-terracotta-600 hover:text-ivory">
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:-translate-y-0.5">
                <path d="M7 11V3M3.5 6.5L7 3l3.5 3.5" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
