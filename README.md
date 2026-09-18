# Inspectre Technologies — identity and landing-page directions

`/` is the company home page: a Baseten-inspired layout (dashed drafting grid, monospace chips, isometric line illustrations) in the Inspectre palette, listing every project with a dossier sheet, plus a contact form. It lives in `app/home/`.

The three earlier design directions remain available and are linked from the footer under "Lab":

- `/signal` — an interactive signal observatory; technical, atmospheric, and closest to the core brand idea.
- `/index` — an editorial practice index; direct, graphic, and strongest for showing breadth of work.
- `/human` — a conversational system; warm, thoughtful, and strongest for turning an unclear problem into an opening message.

The site is built with React 19 and Vinext for OpenAI Sites. Interactions use native Canvas, CSS, and browser APIs, with reduced-motion, touch, keyboard, and semantic HTML fallbacks.

## Local use

```bash
npm run dev
npm run lint
npm run build
npm test
npm run build:pages
```

`npm run build:pages` produces the static GitHub Pages artifact in `dist-pages/` from the entry in `static-site/`. (That folder must not be called `pages/`: vinext would treat it as a Next.js Pages Router and crash on `document`.)

## Home page

- `app/home/content.ts` — all copy, project facts, the contact address. Read `PUBLIC-CLAIMS.md` before editing.
- `app/home/HomeExperience.tsx` — sections, dossier dialog, contact form, theme toggle.
- `app/home/iso.tsx` — the isometric illustration kit. `app/home/scenes/` holds one scene per project and practice step.
- `app/home/home.css` — tokens (light and dark), the illustration styles, then the page.
- `npx tsx scripts/preview-scene.tsx PbxScene [--dark]` renders one illustration to `.preview/` with headless Chrome.

The contact form sends nothing to a server. It composes a structured brief and opens the visitor's own mail client.

## Content boundaries

The home page covers PBX, Provision OS, Idea Radar, Human In The Loop, Voice Front Door, The Hive and Summit Rush. Several of those belong to clients or partners; `PUBLIC-CLAIMS.md` records what each entry may say and what still needs sign-off. It intentionally does not show client logos, testimonials, commercial metrics, private repository links, financial performance, or unreleased product claims.

Before choosing a production direction, add a company-owned email or booking URL and confirm which project names can be publicly attributed to Inspectre.
