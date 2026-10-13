const API = process.env.BACKEND_URL;

export type Profile = {
  name: string;
  role?: string | null;
  tagline?: string | null;
  bio?: string | null;
  email?: string | null;
  resume_url?: string | null;
  hero_image_url?: string | null;
  about_image_url?: string | null;
  stat_projects?: string | null;
  stat_years?: string | null;
  stat_certs?: string | null;
};

export type Skill = {
  id: number;
  name: string;
  icon_url?: string | null;
  category?: string | null;
  progress: number;
  description?: string | null;
  order: number;
  visible: boolean;
};

export type ProjectImage = {id: number; image_url: string; order: number};

export type Project = {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  write_up?: string | null;
  tags?: string | null;
  repo_url?: string | null;
  demo_url?: string | null;
  order: number;
  visible: boolean;
  images: ProjectImage[];
};

export type Certificate = {
  id: number;
  name: string;
  issuer?: string | null;
  score?: string | null;
  date?: string | null;
};

export type TimelineItem = {
  id: number;
  year: string;
  title: string;
  description?: string | null;
  order: number;
};

export type Section = {key: string; visible: boolean};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

// Generic fetcher: if the backend is down or returns an error, we return the
// fallback instead of crashing the whole page.
async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {next: {revalidate: 30}});
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const getProfile = () => get<Profile | null>("/api/profile", null);
export const getSkills = () => get<Skill[]>("/api/skills", []);
export const getProjects = () => get<Project[]>("/api/projects", []);
export const getProject = (slug: string) =>
  get<Project | null>(`/api/projects/${slug}`, null);
export const getCertificates = () =>
  get<Certificate[]>("/api/certificates", []);
export const getTimeline = () => get<TimelineItem[]>("/api/timeline", []);
export const getSections = () => get<Section[]>("/api/sections", []);

// A section counts as visible unless the admin explicitly hid it.
export function isVisible(sections: Section[], key: string) {
  const found = sections.find((s) => s.key === key);
  return found ? found.visible : true;
}

export function splitTags(tags?: string | null): string[] {
  return (tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
