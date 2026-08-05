# AK Wong Made — Studio Site Design Spec

**Date:** 2026-08-05
**Domain:** `www.akwongmade.com`
**Positioning:** One-person studio — AI automation, small-business websites, web apps

## 1. Overview

Personal studio marketing site for AK Wong Made. Studio-forward tone (singular "I" but framed as a shop that ships), built in Astro 5, hosted on Cloudflare Pages. Reuses the paginated-blog and filterable-gallery patterns proven on the Shaolin Hung Gar site (`~/Documents/clients/shaolin-hung-gar-kung-fu`), rewritten as Astro components. Also adds a Life Timeline section for personal narrative.

The Astro theme scaffolding follows the recipe already in this directory (`astro-portfolio-recipe.md`, `portfolio-reference.html`) with a fully rethemed palette.

## 2. Palette & Theme

**Interpretation:** ivory-dominant light theme. Egyptian Blue is the structural brand color. Gold is a jeweler's accent (small marks only, never body text — fails WCAG AA on ivory). Coral is used at most once per page as a decisive emphasis. Charcoal is body text.

### Palette

| Token | Hex | Role |
|---|---|---|
| `--egyptian` | `#1034A6` | Brand — display headlines, links, primary button fill, filled bands, active chips |
| `--egyptian-ink` | `#0B2478` | Pressed / hover for Egyptian Blue |
| `--gold` | `#D4A017` | Accent marks — mono labels (`01 — SERVICES`), hairlines, badge outlines. Never body text. |
| `--coral` | `#E63946` | Rare emphasis — sticky "Contact →" nav pill, CTA-band button. Max once per page. |
| `--coral-ink` | `#C42A38` | Pressed coral |
| `--ivory` | `#F5F0E6` | Page background, cards |
| `--ivory-2` | `#EDE6D6` | Section band tonal stripe |
| `--charcoal` | `#2B2B2B` | Body text, secondary buttons, footer band |
| `--charcoal-mute` | `#6B6B6B` | Muted meta text |
| `--rule` | `#D9D0BC` | Hairlines on ivory |

Semantic aliases (`--bg`, `--surface`, `--text`, `--brand`, `--accent`, `--emphasis`, `--line`, `--bg-invert`, `--text-invert`) live in `tokens.css`. Components reference the semantic names.

### Type

- **Display:** Bricolage Grotesque (500 / 700 / 800). Egyptian Blue on ivory at large sizes is the identity moment.
- **Body:** Inter (400 / 500 / 600). Charcoal.
- **Meta / mono:** JetBrains Mono (500). Gold, uppercase, tracked. Reserved for section numerals, meta strips, tag chips.

Fluid type scale (`clamp()`) matches the reference: `--step--1` through `--step-3`.

### Spacing

Fluid gutter (`--gutter: clamp(1.25rem, 5vw, 5rem)`) and vertical stack (`--stack: clamp(4rem, 10vh, 7.5rem)`). Section rhythm alternates ivory ↔ ivory-2 with no dividers.

## 3. Information Architecture

```
/                                Home
/work/                           Project grid, filterable by service type
/work/[slug]/                    Case-study pages (Shaolin at launch; others added later)
/gallery/                        Filterable project-screenshots grid + lightbox
/life/                           Life timeline (most recent → birth)
/life/[slug]/                    Milestone or era detail pages
/blog/                           Paginated blog index
/blog/page/[page]/               Blog pagination
/blog/tag/[tag]/                 Blog tag pages, paginated
/about/                          Bio, values, tools
/contact/                        Calendly embed + email + expectations copy
/404/
```

**Header nav (sticky, ivory blurred):** `Work · Gallery · Life · Blog · About · Contact →`
Contact is the coral pill; all other links are charcoal, current page gets blue underline.

## 4. Page Designs

### Home (`/`)
Long-scroll, five bands:
1. **Hero** — blue display headline "AI automation, *websites,* and web apps for small businesses" (middle word swapped to charcoal for rhythm), lead paragraph, primary blue CTA "Book a call →", outlined charcoal secondary "See the work".
2. **Services** (ivory-2 band) — three cards: AI Automation, Small-Business Websites, Web Apps. Gold `/ 01 / 02 / 03` numerals, blue card titles, dashed-rule "Recently:" outcome line.
3. **Featured work** — three project cards. Shaolin is the flagship with a filled blue thumb; others are neutral thumbs. Cards link to `/work/[slug]/` if a case study exists, else to the live site.
4. **Blue band (chapter break)** — full Egyptian Blue full-width, ivory testimonial with gold accents. Palette centerpiece.
5. **CTA band** — charcoal band, ivory text, **coral button** (its one moment).

### Work (`/work/`)
Filterable grid. Chips: `All · AI Automation · Websites · Web Apps`. Card = screenshot + title + one-line + tech tags. Cards link to case study or live site.

### Work case study (`/work/[slug]/`)
Template for each case study:
- Hero image
- Meta strip (client, year, stack, live link)
- Sections: Problem · Approach · What was built · Outcome (short paragraphs, interleaved screenshots)
- Next/prev project links at bottom

At launch, only `shaolin.md` exists. Route + template are ready for future additions.

### Gallery (`/gallery/`)
Direct port of the Shaolin filterable gallery pattern: grid, lightbox, filter chips by service type (AI, Websites, Web Apps). Data-driven from `src/data/gallery.ts`.

### Life Timeline (`/life/`)
Single-column vertical timeline, spine on left, most recent → birth.
- **Sticky era chip strip** below main nav — jump-links to eras (Studio Life / Corporate Years / University / Growing Up). Active chip filled blue with gold year text.
- **Era markers** — gold-filled circles with era title + "Read the full era →" link to `/life/[era-slug]/`.
- **Milestone markers** — blue outlined dots, each with year (gold mono), title (blue display), card with 16:9 image + description + optional "Read the fuller story →" link to `/life/[milestone-slug]/`.
- **First milestone visually featured** — filled blue image slot.
- **Coral "Born." marker** at the bottom — book-end, one coral moment on the page.

### Life detail (`/life/[slug]/`)
Long-form Markdown pages for eras or individual milestones. Same content collection pattern as `/blog/`.

### Blog (`/blog/`, `/blog/page/[page]/`, `/blog/tag/[tag]/`)
Astro content collection (`posts`) with `title, date, tags, description, hero?`. Paginated 6/page. Sidebar with tag cloud. Single placeholder post at launch.

### About (`/about/`)
Photo, 2-paragraph bio, 3 values as bullets, tools/stack logo wall.

### Contact (`/contact/`)
Calendly inline embed + prominent `mailto:` + one paragraph "here's what happens on the call". No form, no backend.

## 5. Component & Code Architecture

```
src/
├── content.config.ts              collections: projects, posts, life
├── content/
│   ├── projects/
│   │   └── shaolin.md
│   ├── posts/
│   │   └── hello.md
│   └── life/
│       ├── 2026-launching-akwongmade.md
│       ├── 2025-shaolin-launch.md
│       └── … (one file per milestone / era)
├── data/
│   ├── services.ts                3 service cards
│   ├── gallery.ts                 { src, alt, project, tags }
│   └── tools.ts                   logo-wall entries
├── styles/
│   ├── tokens.css                 palette + type scale + spacing (single reskinning surface)
│   └── global.css                 resets, typography, base
├── components/
│   ├── Header.astro               sticky nav
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── ServiceCard.astro
│   ├── ProjectCard.astro
│   ├── LogoWall.astro
│   ├── Reveal.astro               IntersectionObserver fade-in
│   ├── GalleryGrid.astro          + Lightbox
│   ├── FilterChips.astro          shared between /work, /gallery, /life eras
│   ├── PostCard.astro
│   ├── Pagination.astro
│   ├── TagCloud.astro
│   ├── Timeline.astro             /life spine + milestones + era markers
│   ├── TimelineMilestone.astro
│   └── TimelineEra.astro
├── layouts/
│   ├── Base.astro
│   ├── Post.astro
│   ├── Project.astro
│   └── Life.astro
└── pages/
    ├── index.astro
    ├── work/
    │   ├── index.astro
    │   └── [slug].astro
    ├── gallery.astro
    ├── life/
    │   ├── index.astro
    │   └── [slug].astro
    ├── blog/
    │   ├── index.astro
    │   ├── page/[page].astro
    │   └── tag/[tag].astro
    ├── about.astro
    └── contact.astro
```

`tokens.css` is *the* reskinning surface. Every color, type size, and spacing step lives there.

## 6. Content Model

### `projects` collection
```ts
{
  title: string
  slug: string
  year: number
  client: string
  services: ('AI Automation' | 'Website' | 'Web App')[]
  stack: string[]
  liveUrl?: string
  repoUrl?: string
  thumb: image
  featured: boolean         // controls appearance on home
  hasCaseStudy: boolean     // if false, card links to liveUrl instead
  order: number             // manual sort
}
```

### `posts` collection (blog)
```ts
{
  title: string
  date: date
  tags: string[]
  description: string
  hero?: image
  draft?: boolean
}
```

### `life` collection
```ts
{
  title: string
  slug: string
  year: number
  era: 'Studio Life' | 'Corporate Years' | 'University' | 'Growing Up'
  type: 'milestone' | 'era'
  image?: image
  featured?: boolean        // gets the filled blue treatment on /life/
  order: number             // sort within same year
}
```

## 7. Stack

- **Astro 5** — minimal template, TypeScript, content collections
- **Integrations:** `@astrojs/sitemap`, `sharp` (image optimization)
- **No Tailwind** — ~500 lines of CSS with custom properties is sufficient at this size
- **No CMS** — Markdown editing in the editor; add Decap later if needed
- **No backend / form service** — Calendly + mailto only
- **Fonts** — Google Fonts, Bricolage Grotesque + Inter + JetBrains Mono, preconnected
- **Images** — Astro `<Image>` component with sharp for optimization

## 8. Deploy

- **Cloudflare Pages** — GitHub integration, auto-deploy on push to `main`, branch previews for free
- **Domain** — `www.akwongmade.com` on Cloudflare DNS; apex redirects to www
- **Analytics** — Cloudflare Web Analytics (privacy-friendly, no cookie banner)
- **CI** — no additional CI at launch; add typecheck + build on PR later if needed

## 9. Out of Scope for v1

- Dark/light theme toggle (the ivory theme is the identity)
- Newsletter signup on blog
- Case studies beyond Shaolin at launch (route works, fill in as written)
- Apps Script forms / OAuth Worker / Decap CMS (not needed with Calendly + mailto)
- Analytics beyond Cloudflare Web Analytics
- Comment system on blog or life pages
- RSS feed for `/life/` (blog gets one; life is not a feed)

## 10. Success Criteria

- Homepage loads in under 1s on a fresh connection (fluid type, inlined critical CSS, images optimized)
- Lighthouse Performance ≥ 95, Accessibility ≥ 95 on all pages
- All body text passes WCAG AA contrast on ivory backgrounds
- Nav is usable at 375px viewport (mobile) with no horizontal scroll
- Content can be added to any collection by dropping a Markdown file — no code changes required
- A future palette change requires editing only `tokens.css`

## 11. References

- Astro recipe: `astro-portfolio-recipe.md` (in project root)
- Reference HTML: `portfolio-reference.html` (in project root)
- Prior client work (Shaolin, Eleventy): `~/Documents/clients/shaolin-hung-gar-kung-fu`
- Live palette preview: `.superpowers/brainstorm/…/content/homepage-v1.html` and `life-timeline-v1.html`
