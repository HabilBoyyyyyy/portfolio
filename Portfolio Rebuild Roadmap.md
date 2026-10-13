# Portfolio Rebuild Roadmap

*Next.js + FastAPI + PostgreSQL · Habil Baihaki Ramadhan*

## 1. Confirmed direction

- **Aesthetic:** evolve the noir theme into something more minimal and recruiter-friendly — ivory/terracotta/deep-green palette, light mode only, typewriter vibe modernized (not literal typewriter font everywhere, but the *feel* of it in headings/labels).
- **Layout:** single-page, scrapbook-style, with a light, distinct interaction per section (not uniform scroll-reveal everywhere).
- **Hero:** fully reimagined intro, but keeps the 3D tilt profile photo as a signature element, rebuilt properly with layered depth (glow, pushpin, card shell, holographic shine, parallax photo, gradient name, glass info bar, physics-based tilt).
- **Projects:** card grid on the homepage + full individual detail pages (`/projects/[slug]`) with write-ups and galleries.
- **Admin:** a private dashboard that can edit everything (bio, stats, skills, projects, certs, timeline, resume file) and toggle whole sections on/off.
- **Mini-game:** The Gallows kept as an easter egg, plus one new signature interactive feature (see below).
- **Deployment:** frontend on Vercel; backend + database on a free-tier-friendly host.

## 2. Suggested signature feature — "the surprise"

Since the brand is detective/noir evolving into editorial-professional, here's a feature idea that fits both and that almost no student portfolio has:

**The Case File Easter Egg.** Hidden in the footer or a small pin icon, a visitor can click to open a short "case file" on *you* — styled like an evidence folder: a redacted-text intro that reveals itself line by line (your tagline, rewritten as a detective's case notes), a fingerprint-style stamp that marks "STATUS: OPEN TO WORK," and a final line linking to your resume. It reuses your existing noir assets creatively instead of needing new systems, pairs naturally with The Gallows, and gives recruiters something memorable to screenshot. If you like this direction, we can scope exact interactions once the core site is live — it's a nice Phase 9/10 addition, not a blocker for launch.

Alternative smaller idea: a typing terminal in the hero ("type 'help' to see commands") that can reveal fun facts, a hidden theme, or navigate sections — more effort, more novelty.

## 3. Recommended hosting stack (free-tier friendly)

| Layer | Recommendation | Why |
| --- | --- | --- |
| Frontend (Next.js) | **Vercel** | You already use it; zero-config Next.js hosting, generous free tier. |
| Backend (FastAPI) | **Render** (Free/Starter web service) | Simple Docker/Python deploy, free tier sleeps when idle (fine for a portfolio), easy env vars. Railway is a solid alternative but its free tier is usage-credit based rather than permanent. |
| Database (PostgreSQL) | **Neon** or **Supabase** (free tier) | Both give a managed Postgres instance for free with generous limits; Neon is lightweight and serverless-friendly, Supabase adds a dashboard + optional auth/storage you likely won't need since you're building your own admin. |
| File storage (images, resume PDF) | **Supabase Storage** or **Cloudinary free tier** | Don't store uploaded files directly on Render's filesystem — it's ephemeral (wiped on redeploy). |

We'll finalize exact choice when we reach Phase 9, but this combination costs $0 to start and scales if needed later.

## 4. Tech stack overview

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS (fastest way to implement your exact color-scale tokens), Framer Motion for the per-section interactions.
- **Backend:** FastAPI, SQLAlchemy (ORM), Alembic (migrations), Pydantic (data validation).
- **Database:** PostgreSQL.
- **Auth (admin only):** JWT-based login, single admin user seeded manually — no public signup.
- **Image/file uploads:** handled via the backend, stored in cloud storage (see above).

## 5. Phase 0 — Prerequisites & accounts

- [ ] Install Node.js (LTS), Python 3.11+, PostgreSQL (for local dev), Git, VS Code.
- [ ] Create accounts: Vercel, Render, Neon or Supabase, GitHub (already have).
- [ ] Install VS Code extensions: Python, Pylance, ESLint, Prettier, Tailwind CSS IntelliSense.

## 6. Phase 1 — Project scaffolding

- [ ] Create a monorepo structure: `/frontend` (Next.js) and `/backend` (FastAPI) in one Git repo, or two separate repos — we'll decide based on your deployment comfort.
- [ ] Scaffold Next.js app with TypeScript + Tailwind.
- [ ] Scaffold FastAPI app with a basic health-check route.
- [ ] Set up `.env` files for both (never committed — `.gitignore` from the start).

## 7. Phase 2 — Database design

Tables we'll need, based on your admin scope:

- `profile` (bio, tagline, stats, resume file URL, contact email)
- `skills` (name, category, progress %, description, order, visible)
- `projects` (slug, title, description, tags, repo link, demo link, order, visible, full write-up for detail pages)
- `project_images` (project\_id, image URL, order)
- `certificates` (name, issuer, score, date)
- `timeline_items` (year, title, description, order)
- `sections` (section key, visible boolean) — powers your "hide sections" toggle
- `contact_messages` (name, email, subject, message, created\_at, read boolean) — so submissions land in your admin, not just Formspree
- `admin_users` (single row — you)

* [ ] Draw this as an ER diagram.
* [ ] Write SQLAlchemy models.
* [ ] Set up Alembic and run the first migration.

## 8. Phase 3 — Backend (FastAPI)

- [ ] Public read-only endpoints: `/api/profile`, `/api/skills`, `/api/projects`, `/api/projects/{slug}`, `/api/certificates`, `/api/timeline`, `/api/sections`.
- [ ] Contact form endpoint: `POST /api/contact` (replaces or supplements Formspree).
- [ ] Admin auth: `POST /api/admin/login` (returns JWT).
- [ ] Protected admin CRUD endpoints for every table above, guarded by JWT middleware.
- [ ] File upload endpoint for images/resume, pushing to cloud storage and returning a URL.
- [ ] CORS configuration so Vercel's frontend domain can call the Render backend.
- [ ] Auto-generated API docs via FastAPI's built-in Swagger UI (`/docs`) — useful for testing as we build.

## 9. Phase 4 — Admin panel & auth

- [ ] A `/admin` route group in the Next.js app, not linked from public nav.
- [ ] Login page → stores JWT (httpOnly cookie, not localStorage, for security).
- [ ] Dashboard with sections: Profile, Skills, Projects, Certificates, Timeline, Section Visibility, Messages.
- [ ] Forms for create/edit/delete/reorder on each entity.
- [ ] Image upload UI with preview.
- [ ] Route protection middleware so `/admin/*` redirects to login if not authenticated.

## 10. Phase 5 — Frontend (Next.js) structure

- [ ] App Router layout: `/` (home, scrapbook single-page sections), `/projects/[slug]` (detail pages), `/admin/*` (private).
- [ ] Fetch public data server-side (Next.js Server Components) for fast initial load and good SEO.
- [ ] Section components: Hero, About, Skills, Projects, Certificates, Timeline, Contact — each reading its `visible` flag from the `sections` table.

## 11. Phase 6 — Design system implementation

- [ ] Translate your full color scale (ivory/terracotta/deep-green + neutrals + semantic colors) into Tailwind theme tokens.
- [ ] Choose and pair two typefaces: a modernized "typewriter-adjacent" display font (e.g. a geometric monospace or a serif with typewriter character) for headings, and a clean sans-serif for body text — we'll pick exact fonts together.
- [ ] Build the hero's 3D tilt card as its own component: glow layer, pushpin, card shell (430×599px), holographic shine (3 gradient layers, color-dodge blend), pointer glare, wall shadow, parallax photo (luminosity blend), gradient name overlay, glass info bar (`backdrop-filter: blur(28px)`), and the tilt engine (exponential decay physics, CSS custom properties, pointer events).
- [ ] Design one distinct "light interaction" per section (e.g. skills section skill-bars fill like film strips advancing, timeline unspools like a case file string-board, etc.) — we'll brainstorm these per section as we build.

## 12. Phase 7 — Signature features

- [ ] Rebuild The Gallows as a standalone route or modal, pulling word lists from the admin if you want them editable (optional).
- [ ] Build the Case File easter egg (or terminal, if you prefer that direction).

## 13. Phase 8 — Content migration & copy pass

- [ ] Migrate existing bio, skills, projects, certs, and timeline into the new database via the admin panel (you'll literally use your own tool to populate it — good first real test).
- [ ] Rewrite/tighten bio, project descriptions, and section intros together — we'll do this as its own pass once content is in place, so we're editing final copy rather than a moving target.
- [ ] Fill in the currently-missing links (GitHub repo links, NLP demo, trash-robot repo) where you have them.

## 14. Phase 9 — Deployment

- [ ] Push backend to Render, connect to Neon/Supabase Postgres, set environment variables (DB URL, JWT secret, storage keys).
- [ ] Push frontend to Vercel, set `NEXT_PUBLIC_API_URL` to the Render backend URL.
- [ ] Point your custom domain (if you have one) or use the default Vercel subdomain.
- [ ] Test the full flow end-to-end: public site loads, admin login works, CRUD changes reflect live.

## 15. Phase 10 — Post-launch polish

- [ ] Lighthouse/performance pass (image optimization, font loading strategy).
- [ ] Basic SEO: meta tags, Open Graph image, sitemap.
- [ ] Mobile responsiveness pass across all sections and the admin panel.
- [ ] Analytics (optional) — Vercel Analytics is a one-click free option.

## 16. How we'll work through this

This is a big build — we won't do it in one message. The natural order is Phase 0 → 1 → 2 → 3 (get the backend and database solid first, since the admin panel depends on it) → 4 → 5 → 6 → 7 → 8 → 9 → 10. Tell me which phase you want to start with, and we'll go step by step with full explanations at each stage, since you're newer to coding — I'll explain *why* each piece works the way it does, not just hand you code to paste.
