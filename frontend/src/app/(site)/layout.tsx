import Navbar from "@/components/Navbar";
import {getProfile, getSections, isVisible} from "@/lib/api";
import {socials} from "@/lib/site";
import EasterEggs from "@/components/easter-eggs/EasterEggs";

const NAV = [
  {key: "hero", id: "home", label: "Home"},
  {key: "about", id: "about", label: "About"},
  {key: "skills", id: "skills", label: "Skills"},
  {key: "projects", id: "projects", label: "Projects"},
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
      <Navbar
        links={links}
        name={fullName.split(" ")[0]}
        resumeUrl={profile?.resume_url ?? null}
      />
      {children}
      <footer className="border-t border-sand-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
          <p className="font-mono text-xs text-sand-600">
            © {new Date().getFullYear()} {fullName}. All rights reserved.
          </p>
          <div className="order-last md:order-none">
            <EasterEggs resumeUrl={profile?.resume_url ?? null} />
          </div>
          <ul className="flex gap-6">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-widest text-sand-700 transition hover:text-terracotta-600">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
