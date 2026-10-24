import {
  getProfile,
  getSkills,
  getProjects,
  getExperiences,
  getCertificates,
  getTimeline,
  getSections,
  isVisible,
} from "@/lib/api";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";

export default async function Home() {
  // Fetch everything in parallel so the page doesn't wait on each request in turn
  const [
    profile,
    skills,
    projects,
    experiences,
    certificates,
    timeline,
    sections,
  ] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperiences(),
    getCertificates(),
    getTimeline(),
    getSections(),
  ]);

  return (
    <main>
      {isVisible(sections, "hero") && <Hero profile={profile} />}
      {isVisible(sections, "about") && <About profile={profile} />}
      {isVisible(sections, "skills") && <Skills skills={skills} />}
      {isVisible(sections, "projects") && <Projects projects={projects} />}
      {isVisible(sections, "experience") && <Experience items={experiences} />}
      {isVisible(sections, "certificates") && (
        <Certificates certificates={certificates} />
      )}
      {isVisible(sections, "timeline") && <Timeline items={timeline} />}
      {isVisible(sections, "contact") && <Contact profile={profile} />}
    </main>
  );
}
