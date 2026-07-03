# ⬡ ignyte 2026 — Future Innovators Hackathon

> The premier school hackathon platform for Classes 8–12 — now themed
> end-to-end with the Ignyte game-jam preview's ember / loch / gold
> palette.

## What's new in this build

The standalone `ignyte-preview.html` (the Pyreloch / GVEI Hackathon 2026
game-jam landing page) has been integrated into the Next.js app — both
as a **theme layer** (now the theme of the *entire* project, not just
the new sections) and as **additional content sections**.

### 1. The original HTML preview is in the repo

The original, untouched preview lives at:

```
frontend/public/ignyte-preview.html
```

When the dev server is running it is served verbatim at:

```
http://localhost:3000/ignyte-preview.html
```

A "Preview" button in the navbar (amber-bordered, with a map-pin icon)
opens it in a new tab. The footer also links to it.

### 2. The preview's theme is now the theme of the ENTIRE project

The ember / loch / gold palette from the preview has replaced the
original cyan / purple / mint palette everywhere — including all the
original ByteFest sections (Hero, About, Rules, Benefits, Prizes,
FoodSection, Certificates, Registration, Navbar, Footer,
AnimatedBackground).

This was done in two complementary ways:

**(a) Token remap in `frontend/styles/globals.css`.** The legacy
`--neon-*` and `--text-*` CSS variable names are preserved (so every
existing class that referenced them — `.grad-text`, `.btn-primary`,
`.glass-card`, `.section-label`, `.glow-blue`, `.countdown-box`,
`.bg-mesh .orb-*`, etc. — automatically inherits the new theme), but
they now resolve to ember / loch / gold equivalents:

| Variable          | Old value (cool) | New value (ember) |
| ----------------- | ---------------- | ----------------- |
| `--bg`            | `#03040a`        | `#1a1410` (warm dark)        |
| `--bg-elevated`   | `#0a0c18`        | `#25201b` (warm card)        |
| `--neon-blue`     | `#00c3ff` (cyan) | `#e08840` (ember)            |
| `--neon-purple`   | `#8b5cf6`        | `#b8451c` (ember-deep)       |
| `--neon-cyan`     | `#06ffd8` (mint) | `#f5c451` (gold)             |
| `--neon-pink`     | `#ff2d78`        | `#f5a623` (warm gold)        |
| `--neon-gold`     | `#ffd700`        | `#f5c451` (gold, unified)    |
| `--text-primary`  | `#f0f6ff`        | `#f5ede0` (warm off-white)   |
| `--text-secondary`| `#a0aec0`        | `#a89888` (warm muted)       |
| `--text-muted`    | `#64748b`        | `#7a6f60` (warm darker)      |
| `--text-dim`      | `#475569`        | `#5a4f44` (warm dim)         |

The body background now uses a warm radial wash (ember + warm gold +
loch), and all gradient text / button / glass-card / glow / animated
border / countdown-box classes have been rewritten onto the ember
palette. The canonical ember / loch / gold tokens (`--ember`,
`--ember-bright`, `--ember-deep`, `--loch`, `--gold`, `--ig-bg`,
`--ig-card`, `--ig-muted`, etc.) are also defined here for the new
sections to use directly.

**(b) Hardcoded color remap across every ByteFest section.** Many of
the original sections hardcoded hex values (e.g. `#00c3ff`, `#06ffd8`,
`#8b5cf6`, `#f0f6ff`, `#8899bb`, `#64748b`) inside inline `style={}`
props. A one-shot script (`scripts/remap_theme.py`) rewrote every
occurrence — both hex and `rgba(r, g, b, a)` forms — across all 17
affected files (459 individual color swaps total). After the script
ran, the only file in the repo that still contains the old cool
palette is `frontend/public/ignyte-preview.html`, which is the
canonical reference and is intentionally left untouched.

`frontend/components/AnimatedBackground.tsx` was updated separately so
its four particle colors and connection-line color use the ember
palette (the script's regex didn't catch its compact `rgba(r,g,b,`
prefix form).

A full inventory of the additional utility classes and keyframes
brought in from the preview (`.card-ember`, `.spotlight`, `.ig-reveal`,
`.ig-chip`, `.tl-item`, `.float-field`, `.ig-tilt`, `.ig-cursor-glow`,
`.ig-scroll-progress`, `.ig-back-to-top`, ember-rise, aurora-drift,
marquee-x, pulse-glow-ember, scroll-hint, confetti-fall, etc.) lives
in the second half of `globals.css`.

### 3. The preview's content is now composed into the home page

Ten new section components have been added under
`frontend/components/sections/`, each porting one block of the preview:

| Component                    | Section id  | What it shows                                                  |
| ---------------------------- | ----------- | -------------------------------------------------------------- |
| `Mission.tsx`                | `#mission`  | "Born in the valley. Built for it." — why Pyreloch runs this  |
| `Roles.tsx`                  | `#roles`    | 9 roles (Mechanic, Architect, Rigger, Concept, Sculptor, Composer, Scribe, Weaver, Director) + a 6-question role-finder quiz |
| `TheJam.tsx`                 | `#jam`      | The two-day schedule (Day 1 starts, Day 2 ships)               |
| `ToolsSection.tsx`           | `#tools`    | 31 studio tools in a filterable grid + marquee                 |
| `ArchitectSeat.tsx`          | —           | Spotlight on the Architect role (websites, leaderboards, deploy, etc.) |
| `Awards.tsx`                 | `#awards`   | 6 awards (Most Original Concept, Best Character & World, Best Technical Build, Best Art & Sound, Best Story & Design, People's Choice) |
| `Outcomes.tsx`               | —           | 6 things you walk away with beyond the game                    |
| `ForParents.tsx`             | `#parents`  | A short pitch for parents                                      |
| `FAQ.tsx`                    | `#faq`      | 8-question accordion                                           |
| `PyrelochLab.tsx`            | —           | CTA card for the six-month Pyreloch Lab program                |

All section content is centralised in `frontend/lib/ignyte-data.ts` —
edit that one file to change roles, tools, awards, FAQs, or quiz
questions.

The home page (`frontend/app/page.tsx`) composes them in the same
order as the preview, between the original ByteFest sections and the
existing Registration + Footer.

### 4. Ambient ignyte-preview layer

`frontend/components/IgnytePreview.tsx` is mounted once at the top of
the home page. It renders no layout of its own — only fixed overlays:

- the top scroll-progress bar
- the cursor-glow follower (desktop only)
- the back-to-top button
- the ember particle layer
- the `useIgReveal()` hook (reveal-on-scroll, spotlight, magnetic
  buttons, 3D tilt)

`frontend/components/LucideIcons.tsx` loads the Lucide UMD bundle from
a CDN and re-runs `lucide.createIcons()` whenever the DOM changes, so
every `<i data-lucide="...">` placeholder in the new sections gets
replaced with the right SVG.

The reveal-on-scroll / spotlight / magnetic / tilt wiring lives in
`frontend/lib/useIgReveal.ts`.

## Quick Start

```bash
# 1. Setup database — run docs/schema.sql in Supabase SQL Editor

# 2. Frontend
cd frontend
npm install
# copy .env.example to .env.local and fill your Supabase keys
npx next dev
# Open http://localhost:3000

# 3. View the integrated ignyte preview
# Either click "Preview" in the navbar, or open:
# http://localhost:3000/ignyte-preview.html

# 4. Admin Dashboard
# Open http://localhost:3000/admin
# Password: ignyte2026admin

# 5. Project Submission
# Open http://localhost:3000/submit
```

> Note: `/admin` and `/submit` need Supabase env vars set, otherwise
> `next build` will fail to prerender them at build time. They work
> fine under `next dev` once the env vars are in place. This is a
> pre-existing requirement of the bytefest repo and is unrelated to
> the ignyte-preview integration.

## Full Setup Guide
See `docs/SETUP.md` for complete step-by-step instructions.

## Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Backend** (optional): Python FastAPI + Resend emails
- **Icons**: Lucide (loaded via `frontend/components/LucideIcons.tsx`)
- **Fonts**: Space Grotesk (display) + Inter (body) — already imported
  in `frontend/app/layout.tsx`; used by every section.

## Pages
| Page | URL |
|------|-----|
| Landing Page | / |
| Original HTML Preview | /ignyte-preview.html |
| Admin Dashboard | /admin |
| Submit Project | /submit |

## File map (new + modified files)

```
frontend/
├── public/
│   └── ignyte-preview.html                      ← the original preview, served verbatim
├── lib/
│   ├── ignyte-data.ts                           ← all section content (roles, tools, awards, FAQ, quiz)
│   └── useIgReveal.ts                           ← reveal-on-scroll + spotlight + magnetic + tilt hook
├── components/
│   ├── IgnytePreview.tsx                        ← ambient layer (scroll bar, cursor glow, back-to-top, embers)
│   ├── LucideIcons.tsx                          ← loads + re-renders Lucide icons
│   ├── AnimatedBackground.tsx                   ← MODIFIED: orbs + particles now ember / loch / gold
│   └── sections/
│       ├── Mission.tsx
│       ├── Roles.tsx                            ← 9 roles + role-finder quiz
│       ├── TheJam.tsx
│       ├── ToolsSection.tsx                     ← filterable tools grid + marquee
│       ├── ArchitectSeat.tsx
│       ├── Awards.tsx
│       ├── Outcomes.tsx
│       ├── ForParents.tsx
│       ├── FAQ.tsx
│       └── PyrelochLab.tsx
└── styles/
    └── globals.css                              ← MODIFIED: full ember / loch / gold theme
```

**Other modified files** (color palette remapped, structure untouched):
- `frontend/app/page.tsx` — composes the new sections
- `frontend/app/admin/page.tsx` — colors remapped
- `frontend/app/submit/page.tsx` — colors remapped
- `frontend/app/page-premium.tsx` — colors remapped
- `frontend/components/ui/Navbar.tsx` — colors remapped + new "Preview" button + nav links
- `frontend/components/ui/Footer.tsx` — colors remapped + footer links to new sections
- `frontend/components/sections/Hero.tsx` — colors remapped
- `frontend/components/sections/About.tsx` — colors remapped
- `frontend/components/sections/Rules.tsx` — colors remapped
- `frontend/components/sections/Benefits.tsx` — colors remapped
- `frontend/components/sections/Prizes.tsx` — colors remapped
- `frontend/components/sections/FoodSection.tsx` — colors remapped
- `frontend/components/sections/Certificates.tsx` — colors remapped
- `frontend/components/sections/Registration.tsx` — colors remapped
- `frontend/components/sections/PremiumHero.tsx` — colors remapped
- `frontend/components/sections/PremiumFeatures.tsx` — colors remapped
- `frontend/components/sections/PremiumPrizes.tsx` — colors remapped

The remap script lives at `/home/z/my-project/scripts/remap_theme.py`
and is safe to re-run if more cool-palette colors are introduced.
