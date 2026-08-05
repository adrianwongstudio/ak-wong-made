# AK Wong Made — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the AK Wong Made studio marketing site — home, work, work case study, gallery, life timeline, blog, about, contact — as an Astro 5 static site deployed to Cloudflare Pages.

**Architecture:** Astro 5 with content collections (`projects`, `posts`, `life`). Single `tokens.css` file drives the entire theme. Custom-built components (no UI framework, no Tailwind). Static output; deployed on Cloudflare Pages with the domain on Cloudflare DNS.

**Tech Stack:** Astro 5, TypeScript, `@astrojs/sitemap`, `sharp`, Bricolage Grotesque + Inter + JetBrains Mono (Google Fonts), Cloudflare Pages + Cloudflare Web Analytics.

## Global Constraints

- **Astro:** 5.x. Content collections use the Astro 5 `src/content.config.ts` location (not the pre-5 `src/content/config.ts`).
- **No Tailwind.** All styling in `src/styles/tokens.css` + `src/styles/global.css` + component `<style>` blocks.
- **All colors, type sizes, spacing steps live in `tokens.css`.** Components reference CSS variables — never hex codes.
- **Palette (verbatim):** `--egyptian: #1034A6`, `--egyptian-ink: #0B2478`, `--gold: #D4A017`, `--coral: #E63946`, `--coral-ink: #C42A38`, `--ivory: #F5F0E6`, `--ivory-2: #EDE6D6`, `--charcoal: #2B2B2B`, `--charcoal-mute: #6B6B6B`, `--rule: #D9D0BC`.
- **Gold is NEVER used for body text** (fails WCAG AA on ivory). Gold is for mono labels, hairlines, badge outlines only.
- **Coral used at most once per page** — sticky "Contact →" nav pill on all pages, plus the CTA-band button on `/`.
- **Fonts:** Bricolage Grotesque (display), Inter (body), JetBrains Mono (meta). Preconnect + display=swap.
- **URLs:** trailing slash always (`trailingSlash: 'always'` in `astro.config.mjs`).
- **Domain:** `https://www.akwongmade.com`.
- **Node:** 20.x (Cloudflare Pages default).
- **Every task ends with a commit.**

---

## File Structure

```
my_website/
├── .gitignore
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── media/                       (added as content is added)
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   ├── projects/shaolin.md
│   │   ├── posts/hello-world.md
│   │   └── life/
│   │       ├── 2026-launching-akwongmade.md
│   │       ├── 2025-shaolin-launch.md
│   │       ├── 2024-first-ai-client.md
│   │       └── … (seed entries only)
│   ├── data/
│   │   ├── services.ts
│   │   ├── gallery.ts
│   │   ├── tools.ts
│   │   └── eras.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ServiceCard.astro
│   │   ├── ProjectCard.astro
│   │   ├── FilterChips.astro
│   │   ├── LogoWall.astro
│   │   ├── Reveal.astro
│   │   ├── GalleryGrid.astro
│   │   ├── Lightbox.astro
│   │   ├── PostCard.astro
│   │   ├── Pagination.astro
│   │   ├── TagCloud.astro
│   │   ├── Timeline.astro
│   │   ├── TimelineEra.astro
│   │   └── TimelineMilestone.astro
│   ├── layouts/
│   │   ├── Base.astro
│   │   ├── Post.astro
│   │   ├── Project.astro
│   │   └── Life.astro
│   └── pages/
│       ├── index.astro
│       ├── 404.astro
│       ├── about.astro
│       ├── contact.astro
│       ├── gallery.astro
│       ├── work/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── life/
│       │   ├── index.astro
│       │   └── [slug].astro
│       └── blog/
│           ├── index.astro
│           ├── page/[page].astro
│           └── tag/[tag].astro
└── docs/superpowers/{specs,plans}/
```

**Reference files (kept, moved into `reference/`):**
- `reference/astro-portfolio-recipe.md`
- `reference/portfolio-reference.html`
- `reference/homepage-v1.html` (from the brainstorm preview)
- `reference/life-timeline-v1.html`

Legacy Shaolin docs (`CUSTOMIZATION.md`, `INCONSISTENCIES.md`, `PAGINATION.md`, `README.md`, `SETUP-GUIDE.md`, `testing.md`, `apps-script/`) are deleted — they belong to the Shaolin project and will confuse the new repo.

---

## Testing approach

This is a static content site with no server logic. The test loop per task is:

1. **`npm run astro check`** — TypeScript / content-collection schema validation (fails on broken imports, missing frontmatter fields, bad types).
2. **`npm run build`** — full site build; fails on any Astro / MDX / template error, broken links between pages, missing images.
3. **Visual verify** — `npm run dev`, open the affected page in the browser, confirm it matches the design.

Where components have real logic (Pagination math, FilterChips filter state), we add a Vitest unit test.

---

## Task 1: Repo scaffold + clean up legacy files

**Files:**
- Create: `.gitignore`
- Delete (legacy Shaolin docs): `CUSTOMIZATION.md`, `INCONSISTENCIES.md`, `PAGINATION.md`, `README.md`, `SETUP-GUIDE.md`, `testing.md`, `apps-script/`, `.DS_Store`
- Move (into `reference/`): `astro-portfolio-recipe.md`, `portfolio-reference.html`
- Copy (from brainstorm output into `reference/`): `homepage-v1.html`, `life-timeline-v1.html`

**Interfaces:**
- Consumes: none
- Produces: clean project root ready for `npm create astro`

- [ ] **Step 1: Initialize git**

```bash
cd /Users/adrianwong/Documents/projects/my_website
git init -b main
```

- [ ] **Step 2: Verify what's in the directory before deleting**

```bash
ls -la
```

Expected: shows the legacy Shaolin docs listed above alongside the astro recipe / reference files.

- [ ] **Step 3: Move reference files into `reference/`**

```bash
mkdir -p reference
mv astro-portfolio-recipe.md reference/
mv portfolio-reference.html reference/
cp .superpowers/brainstorm/*/content/homepage-v1.html reference/ 2>/dev/null || true
cp .superpowers/brainstorm/*/content/life-timeline-v1.html reference/ 2>/dev/null || true
```

- [ ] **Step 4: Delete legacy Shaolin docs**

```bash
rm -f CUSTOMIZATION.md INCONSISTENCIES.md PAGINATION.md README.md SETUP-GUIDE.md testing.md .DS_Store
rm -rf apps-script
```

- [ ] **Step 5: Write `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
.DS_Store
.superpowers/
.wrangler/
```

- [ ] **Step 6: Verify state**

```bash
ls -la
```

Expected: only `docs/`, `reference/`, `.gitignore`, `.superpowers/` (ignored).

- [ ] **Step 7: Commit**

```bash
git add .gitignore reference/ docs/
git commit -m "chore: initial repo scaffold, move reference material, drop legacy docs"
```

---

## Task 2: Astro scaffold + dependencies + config

**Files:**
- Create (via `npm create astro`): `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/pages/index.astro` (placeholder from template, overwritten in Task 5)
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: a working Astro project — `npm run dev` serves `http://localhost:4321`

- [ ] **Step 1: Scaffold Astro into the current directory**

```bash
npm create astro@latest -- --template minimal --typescript strict --install --no-git --skip-houston .
```

Notes: `.` scaffolds into the current directory. `--no-git` because we already ran `git init`. `--skip-houston` skips the animated welcome (avoids extra output).

- [ ] **Step 2: Add integrations and sharp**

```bash
npx astro add sitemap --yes
npm i -D sharp
```

- [ ] **Step 3: Rewrite `astro.config.mjs`**

Replace the file contents with:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.akwongmade.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
```

- [ ] **Step 4: Verify dev server works**

```bash
npm run dev
```

Open `http://localhost:4321` — expect the default Astro minimal template page. Kill dev with `Ctrl+C`.

- [ ] **Step 5: Verify build works**

```bash
npm run build
```

Expected: build completes, `dist/` created, sitemap emitted.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs src/ public/
git commit -m "chore: scaffold astro 5 with sitemap and sharp"
```

---

## Task 3: Design tokens + global styles + font loader

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

**Interfaces:**
- Consumes: nothing
- Produces: CSS variables usable by every component — `--egyptian`, `--gold`, `--coral`, `--ivory`, `--ivory-2`, `--charcoal`, `--charcoal-mute`, `--rule`, `--egyptian-ink`, `--coral-ink`, plus semantic aliases `--bg`, `--surface`, `--text`, `--text-mute`, `--brand`, `--brand-ink`, `--accent`, `--emphasis`, `--line`, `--bg-invert`, `--text-invert`; type scale `--step--1` through `--step-3`; `--display`, `--body`, `--mono`; `--gutter`, `--stack`; utility classes `.wrap`, `.mono-label`, `.btn`, `.btn-primary`, `.btn-outline`, `.btn-coral`.

- [ ] **Step 1: Write `src/styles/tokens.css`**

```css
:root {
  /* Palette */
  --egyptian:       #1034A6;
  --egyptian-ink:   #0B2478;
  --gold:           #D4A017;
  --coral:          #E63946;
  --coral-ink:      #C42A38;
  --ivory:          #F5F0E6;
  --ivory-2:        #EDE6D6;
  --charcoal:       #2B2B2B;
  --charcoal-mute:  #6B6B6B;
  --rule:           #D9D0BC;

  /* Semantic aliases */
  --bg:          var(--ivory);
  --surface:     var(--ivory-2);
  --text:        var(--charcoal);
  --text-mute:   var(--charcoal-mute);
  --brand:       var(--egyptian);
  --brand-ink:   var(--egyptian-ink);
  --accent:      var(--gold);
  --emphasis:    var(--coral);
  --line:        var(--rule);
  --bg-invert:   var(--egyptian);
  --text-invert: var(--ivory);

  /* Type families */
  --display: "Bricolage Grotesque", system-ui, sans-serif;
  --body:    "Inter", system-ui, sans-serif;
  --mono:    "JetBrains Mono", ui-monospace, monospace;

  /* Fluid type scale */
  --step--1: clamp(0.78rem, 0.75rem + 0.15vw, 0.85rem);
  --step-0:  clamp(1rem,    0.95rem + 0.25vw, 1.125rem);
  --step-1:  clamp(1.25rem, 1.1rem  + 0.6vw,  1.55rem);
  --step-2:  clamp(1.9rem,  1.5rem  + 1.9vw,  3rem);
  --step-3:  clamp(2.6rem,  1.6rem  + 4.6vw,  5.8rem);

  /* Spacing */
  --gutter: clamp(1.25rem, 5vw, 5rem);
  --stack:  clamp(4rem, 10vh, 7.5rem);

  /* Radii */
  --radius-sm: 3px;
  --radius:    4px;
  --radius-pill: 999px;
}
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: 400 var(--step-0)/1.6 var(--body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, svg, video { display: block; max-width: 100%; }
a { color: var(--brand); text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 1px; }
a:hover { color: var(--brand-ink); }

:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
  border-radius: 2px;
}
.skip {
  position: absolute; left: -9999px;
  background: var(--brand); color: var(--text-invert);
  padding: 0.75rem 1rem; z-index: 100;
}
.skip:focus { left: 1rem; top: 1rem; }

/* Layout wrap */
.wrap { max-width: 1200px; margin: 0 auto; padding: 0 var(--gutter); }
.wrap--narrow { max-width: 780px; }

/* Section mono label with gold leading rule */
.mono-label {
  font: 500 0.72rem/1 var(--mono);
  color: var(--accent);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  display: inline-flex; align-items: center; gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.mono-label::before {
  content: ""; width: 1.6rem; height: 1px; background: var(--accent);
}

/* Buttons */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.7rem 1.15rem;
  font: 600 var(--step--1)/1 var(--body);
  border-radius: var(--radius-pill);
  border: none; text-decoration: none;
  transition: background .15s ease, color .15s ease;
  cursor: pointer;
}
.btn-primary { background: var(--brand); color: var(--text-invert); }
.btn-primary:hover { background: var(--brand-ink); }
.btn-outline {
  background: transparent; color: var(--text);
  box-shadow: inset 0 0 0 1.5px var(--text);
}
.btn-outline:hover { background: var(--text); color: var(--bg); }
.btn-coral { background: var(--emphasis); color: var(--text-invert); }
.btn-coral:hover { background: var(--coral-ink); }

/* Underlined body links get no border-bottom inside .prose */
.prose a { text-decoration: underline; border: none; }
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat(styles): design tokens and global styles"
```

---

## Task 4: Base layout + Header + Footer

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` (imported once in `Base.astro`)
- Produces:
  - `<Base title="…" description="…" current="work|gallery|life|blog|about|contact|home">…</Base>` — full HTML shell with head, meta, fonts, header, footer, and `<slot />` for page content
  - `<Header current="…" />` — sticky ivory-blurred nav with `Work · Gallery · Life · Blog · About · Contact →` (Contact is the coral pill)
  - `<Footer />` — ivory-2 band with copyright + email/GitHub/LinkedIn links

- [ ] **Step 1: Write `src/components/Header.astro`**

```astro
---
interface Props {
  current?: 'home' | 'work' | 'gallery' | 'life' | 'blog' | 'about' | 'contact';
}
const { current } = Astro.props;
const link = (key: string, label: string, href: string) => ({
  key, label, href, active: current === key,
});
const items = [
  link('work',    'Work',    '/work/'),
  link('gallery', 'Gallery', '/gallery/'),
  link('life',    'Life',    '/life/'),
  link('blog',    'Blog',    '/blog/'),
  link('about',   'About',   '/about/'),
];
---
<header class="site">
  <div class="wrap row">
    <a href="/" class="brand">
      AK Wong Made
      <span class="mono">STUDIO</span>
    </a>
    <nav class="site" aria-label="Primary">
      {items.map(i => (
        <a href={i.href} class={i.active ? 'current' : ''}>{i.label}</a>
      ))}
      <a href="/contact/" class:list={['btn', 'btn-coral', current === 'contact' && 'is-current']}>
        Contact &rarr;
      </a>
    </nav>
  </div>
</header>

<style>
  header.site {
    position: sticky; top: 0; z-index: 20;
    background: rgba(245,240,230,0.88);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--rule);
  }
  header.site .row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 0;
  }
  .brand {
    font: 800 1.05rem/1 var(--display);
    letter-spacing: -0.01em;
    color: var(--text);
    border: none;
    display: inline-flex; align-items: center; gap: 0.55rem;
  }
  .brand .mono {
    font: 500 0.7rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.3rem 0.5rem;
    border: 1px solid var(--accent);
    border-radius: var(--radius-sm);
  }
  nav.site {
    display: flex; align-items: center; gap: 1.6rem;
    font: 500 var(--step--1)/1 var(--body);
  }
  nav.site a {
    color: var(--text);
    border: none;
    padding: 0.4rem 0;
  }
  nav.site a:hover { color: var(--brand); }
  nav.site a.current {
    border-bottom: 1.5px solid var(--brand);
    color: var(--brand);
  }
  nav.site .btn-coral { padding: 0.55rem 0.95rem; }
  @media (max-width: 640px) {
    nav.site { gap: 1rem; }
    nav.site a:not(.btn) { display: none; }
    nav.site a:nth-last-child(-n+3):not(.btn) { display: inline-flex; }
  }
</style>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="site">
  <div class="wrap row">
    <div>&copy; {year} AK Wong Made &nbsp;·&nbsp; Made in Vancouver</div>
    <div>
      <a href="mailto:hi@akwongmade.com">Email</a> &nbsp;·&nbsp;
      <a href="https://github.com/adrianwongstudio" rel="me noopener">GitHub</a> &nbsp;·&nbsp;
      <a href="https://www.linkedin.com/" rel="me noopener">LinkedIn</a>
    </div>
  </div>
</footer>

<style>
  footer.site {
    background: var(--surface);
    padding: 2.5rem 0;
    border-top: 1px solid var(--rule);
    font-size: var(--step--1);
    color: var(--text-mute);
    margin-top: var(--stack);
  }
  footer.site .row {
    display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  }
  footer.site a { color: var(--text); }
</style>
```

- [ ] **Step 3: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
  current?: 'home' | 'work' | 'gallery' | 'life' | 'blog' | 'about' | 'contact';
  ogImage?: string;
}
const {
  title,
  description = 'AK Wong Made — a one-person studio for AI automation, small-business websites, and web apps.',
  current,
  ogImage = '/og-default.png',
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).toString();
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, Astro.site).toString()} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <a href="#main" class="skip">Skip to content</a>
    <Header current={current} />
    <main id="main"><slot /></main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build passes (there are no pages using Base yet, but nothing should error).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/components/Header.astro src/components/Footer.astro
git commit -m "feat(layout): base layout, sticky header, footer"
```

---

## Task 5: Home page (`/`)

**Files:**
- Modify (overwrite the scaffold's placeholder): `src/pages/index.astro`
- Create: `src/data/services.ts`
- Create: `src/components/ServiceCard.astro`

**Interfaces:**
- Consumes: `Base.astro`, `services.ts`
- Produces: rendered `/` matching `reference/homepage-v1.html` — hero, services (ivory-2 band), featured work, blue chapter band, coral CTA band

- [ ] **Step 1: Write `src/data/services.ts`**

```ts
export type Service = {
  num: string;
  title: string;
  body: string;
  recently: string;
};

export const services: Service[] = [
  {
    num: '/ 01',
    title: 'AI Automation',
    body: "Custom agents and pipelines that remove repetitive work — invoicing, triage, reporting, research. Wired into the tools you already use.",
    recently: 'Recently: cut a 6-hour invoicing loop to under 4 minutes.',
  },
  {
    num: '/ 02',
    title: 'Small-Business Websites',
    body: "Fast, editable marketing sites for schools, studios, and service businesses. Free hosting, CMS, forms — costs the client $0/month to run.",
    recently: 'Recently: Shaolin Hung Gar — school & lion dance troupe.',
  },
  {
    num: '/ 03',
    title: 'Web Apps',
    body: "Custom internal tools and small SaaS-style products. Built to be understood — no opaque frameworks, no lock-in.",
    recently: 'Recently: financial-planning tool for a family office.',
  },
];
```

- [ ] **Step 2: Write `src/components/ServiceCard.astro`**

```astro
---
import type { Service } from '../data/services';
interface Props { service: Service }
const { service } = Astro.props;
---
<article class="service">
  <div class="num">{service.num}</div>
  <h3>{service.title}</h3>
  <p>{service.body}</p>
  <div class="outcome">{service.recently}</div>
</article>

<style>
  .service {
    background: var(--bg);
    border: 1px solid var(--line);
    padding: 2rem 1.75rem 2.25rem;
    border-radius: var(--radius);
    display: flex; flex-direction: column; gap: 0.9rem;
  }
  .num {
    font: 500 0.75rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.15em;
  }
  h3 {
    font: 700 1.35rem/1.15 var(--display);
    color: var(--brand);
    margin: 0;
    letter-spacing: -0.01em;
  }
  p { margin: 0; line-height: 1.55; }
  .outcome {
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--line);
    color: var(--text-mute);
    font-size: var(--step--1);
  }
</style>
```

- [ ] **Step 3: Overwrite `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import ServiceCard from '../components/ServiceCard.astro';
import { services } from '../data/services';
---
<Base title="AK Wong Made — studio for AI automation, websites, and web apps" current="home">

  <section class="hero wrap">
    <div class="mono-label">01 &mdash; A studio, quietly shipping</div>
    <h1>AI automation, <em>websites,</em> and web apps for small businesses.</h1>
    <p class="lead">
      One-person studio. I help small teams cut manual work, launch clean marketing sites,
      and build the internal tools they can't buy off the shelf.
    </p>
    <div class="ctas">
      <a href="/contact/" class="btn btn-primary">Book a call &rarr;</a>
      <a href="/work/" class="btn btn-outline">See the work</a>
    </div>
  </section>

  <section class="services">
    <div class="wrap">
      <div class="mono-label">02 &mdash; Services</div>
      <h2>Three lines of work. Sharpened over years of client engagements.</h2>
      <div class="service-grid">
        {services.map(s => <ServiceCard service={s} />)}
      </div>
    </div>
  </section>

  <section class="featured wrap">
    <div class="mono-label">03 &mdash; Featured work</div>
    <h2>Selected projects.</h2>
    <p class="lead-lite">Case studies for a few. Live links for the rest.</p>
    <p><a href="/work/">See all &rarr;</a></p>
    {/* Real ProjectCards wire up in Task 8 once the projects collection exists. */}
  </section>

  <section class="band">
    <div class="wrap">
      <div class="mono-label" style="color: var(--accent);">A note from a client</div>
      <p class="quote">Adrian took a mess of spreadsheets and turned it into a system I actually understand.</p>
      <div class="attr"><span>&mdash;</span> Sifu Wong &nbsp;·&nbsp; Shaolin Hung Gar Kung Fu</div>
    </div>
  </section>

  <section class="cta">
    <div class="wrap row">
      <div>
        <h2>Have something in mind?</h2>
        <p class="sub">Book a 20-minute call. No pitch, no obligation.</p>
      </div>
      <a href="/contact/" class="btn btn-coral">Book a call &rarr;</a>
    </div>
  </section>

</Base>

<style>
  .hero { padding: calc(var(--stack) * 1.1) 0 var(--stack); }
  .hero h1 {
    font: 800 var(--step-3)/0.98 var(--display);
    color: var(--brand);
    letter-spacing: -0.025em;
    margin: 0 0 1.5rem; max-width: 15ch;
  }
  .hero h1 em { font-style: normal; color: var(--text); }
  .hero .lead {
    font-size: var(--step-1); max-width: 42ch;
    line-height: 1.45; margin: 0 0 2.5rem;
  }
  .hero .ctas { display: flex; gap: 0.9rem; flex-wrap: wrap; }

  .services {
    padding: var(--stack) 0;
    background: var(--surface);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .services h2 {
    font: 700 var(--step-2)/1.05 var(--display);
    color: var(--brand);
    letter-spacing: -0.02em;
    margin: 0 0 3rem; max-width: 22ch;
  }
  .service-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 820px) { .service-grid { grid-template-columns: 1fr; } }

  .featured { padding: var(--stack) 0; }
  .featured h2 {
    font: 700 var(--step-2)/1.05 var(--display);
    color: var(--text);
    letter-spacing: -0.02em; margin: 0 0 1rem;
  }
  .lead-lite { color: var(--text-mute); margin: 0 0 2rem; }

  .band {
    background: var(--brand); color: var(--text-invert);
    padding: calc(var(--stack) * 1.1) 0;
    position: relative;
  }
  .band::before {
    content: ""; position: absolute; top: 0;
    left: var(--gutter); right: var(--gutter);
    height: 1px; background: var(--accent); opacity: 0.6;
  }
  .band .quote {
    font: 500 var(--step-2)/1.2 var(--display);
    letter-spacing: -0.015em;
    max-width: 26ch; margin: 0 0 2rem;
  }
  .band .quote::before {
    content: "\201C"; color: var(--accent);
    font-size: 1.4em; line-height: 0; margin-right: 0.2em;
  }
  .band .attr {
    font: 500 var(--step--1)/1 var(--mono);
    color: var(--text-invert); opacity: 0.75;
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .band .attr span { color: var(--accent); }

  .cta {
    background: var(--text); color: var(--text-invert);
    padding: calc(var(--stack) * 0.9) 0;
  }
  .cta .row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 2rem; flex-wrap: wrap;
  }
  .cta h2 {
    font: 700 var(--step-2)/1.05 var(--display);
    color: var(--text-invert);
    letter-spacing: -0.02em; margin: 0; max-width: 20ch;
  }
  .cta .sub {
    color: var(--line); margin: 0.5rem 0 0; font-size: var(--step-0);
  }
</style>
```

- [ ] **Step 4: Visual verify**

```bash
npm run dev
```

Open `http://localhost:4321/`. Check against `reference/homepage-v1.html`:
- Hero blue headline with "websites" in charcoal
- Services band ivory-2, three cards, gold `/ 01 / 02 / 03`
- Blue quote band
- Charcoal CTA with coral button

Kill dev.

- [ ] **Step 5: Build check**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/data/services.ts src/components/ServiceCard.astro
git commit -m "feat(home): homepage with services, chapter band, and CTA"
```

---

## Task 6: Content collections (`projects`, `posts`, `life`)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projects/shaolin.md`
- Create: `src/content/posts/hello-world.md`
- Create: `src/content/life/2026-launching-akwongmade.md`
- Create: `src/content/life/2025-shaolin-launch.md`
- Create: `src/content/life/2024-first-ai-client.md`
- Create: `src/content/life/1994-born.md`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `getCollection('projects')` → `{ data: { title, slug, year, client, services, stack, liveUrl?, repoUrl?, thumb, featured, hasCaseStudy, order } }`
  - `getCollection('posts')` → `{ data: { title, date, tags, description, hero?, draft? } }`
  - `getCollection('life')` → `{ data: { title, slug, year, era, type: 'milestone' | 'era-marker' | 'birth', image?, featured?, order } }`

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.number(),
    client: z.string(),
    services: z.array(z.enum(['AI Automation', 'Website', 'Web App'])),
    stack: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    thumb: image().optional(),
    featured: z.boolean().default(false),
    hasCaseStudy: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    hero: image().optional(),
    draft: z.boolean().default(false),
  }),
});

const life = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/life' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.number(),
    era: z.enum(['Studio Life', 'Corporate Years', 'University', 'Growing Up']),
    type: z.enum(['milestone', 'era-marker', 'birth']).default('milestone'),
    image: image().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { projects, posts, life };
```

- [ ] **Step 2: Write `src/content/projects/shaolin.md`**

```markdown
---
title: Shaolin Hung Gar Kung Fu
year: 2025
client: Shaolin Hung Gar Kung Fu (Vancouver)
services: [Website]
stack: [Eleventy, Decap CMS, Cloudflare Workers, Google Apps Script, GitHub Pages]
liveUrl: https://shaolinhunggarkungfu.com
featured: true
hasCaseStudy: true
order: 1
---

## The problem

A Vancouver kung fu school and lion dance troupe had an outdated site that
was expensive to change, hard to update, and didn't convert visitors into
free-trial signups.

## The approach

Rebuilt on Eleventy with a friendly in-browser CMS so non-technical staff
can edit any page without a developer. Free hosting on GitHub Pages,
form submissions via Google Apps Script, OAuth proxied through a Cloudflare
Worker. Total ongoing cost: $0/month.

## What was built

- 8 pages (home, kung fu, lion dance, blog, about, gallery, two form pages)
- Paginated blog with category and tag filtering
- Filterable photo gallery with lightbox
- Two conversion forms (free trial signup, lion dance booking enquiry)
- Full CMS at `/admin/` with schemas for every page section
- Automated deploys on every push to `main`

## Outcome

The school updates copy, images, and blog posts themselves. Free-trial
signups arrive in Google Sheets and staff inboxes. The whole thing runs
for free.
```

- [ ] **Step 3: Write `src/content/posts/hello-world.md`**

```markdown
---
title: Hello, world
date: 2026-08-05
tags: [meta]
description: Kicking off the AK Wong Made blog. Notes on shipping, small-business software, and building tools that outlast their vendors.
---

This is the first post on the AK Wong Made blog. I'll write here about
what I'm building, why, and what I've learned along the way — with a bias
toward things that hold up over years, not just quarters.

More soon.
```

- [ ] **Step 4: Write seed `life/*.md` files**

`src/content/life/2026-launching-akwongmade.md`:

```markdown
---
title: Launching AK Wong Made
year: 2026
era: Studio Life
type: milestone
featured: true
order: 1
---

Formally consolidated three years of freelance projects into a small
studio brand: AI automation, small-business websites, web apps. This
site is the first thing it ships.
```

`src/content/life/2025-shaolin-launch.md`:

```markdown
---
title: Shaolin Hung Gar goes live
year: 2025
era: Studio Life
type: milestone
---

Built and shipped the marketing site for a Vancouver kung fu school and
lion dance troupe. Free hosting, built-in CMS, forms that email the
school directly. Became the reference case for the small-business
website line.
```

`src/content/life/2024-first-ai-client.md`:

```markdown
---
title: First AI automation client
year: 2024
era: Studio Life
type: milestone
---

Built an invoice-to-receipt automation for a small business — cut a
6-hour weekly task down to under 4 minutes. Convinced me this was a
real line of work, not a side experiment.
```

`src/content/life/1994-born.md`:

```markdown
---
title: Born.
year: 1994
era: Growing Up
type: birth
order: 999
---

The start of the story.
```

- [ ] **Step 5: Verify collections type-check**

```bash
npx astro sync
npx astro check
```

Expected: no errors. `astro sync` regenerates the collection types.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat(content): projects, posts, life collections with seed entries"
```

---

## Task 7: `FilterChips` component + Vitest setup

**Files:**
- Create: `src/components/FilterChips.astro`
- Create: `src/lib/filter.ts` (pure filter logic — testable)
- Create: `src/lib/filter.test.ts`
- Modify: `package.json` — add `vitest` dev dep + `test` script
- Create: `vitest.config.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `filterByType<T>(items: T[], keyFn: (item: T) => string[], selectedType: string | null): T[]` — returns `items` if `selectedType` is null; otherwise items whose `keyFn(item)` includes `selectedType`
  - `<FilterChips options={['All','AI Automation','Websites','Web Apps']} paramName="type" />` — renders chip strip; active chip determined by `?type=` query string via a tiny inline script

- [ ] **Step 1: Add Vitest**

```bash
npm i -D vitest @vitest/coverage-v8
```

- [ ] **Step 2: Add scripts to `package.json`**

Add `"test": "vitest run"` and `"test:watch": "vitest"` to the `scripts` block.

- [ ] **Step 3: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
```

- [ ] **Step 4: Write the failing test — `src/lib/filter.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { filterByType } from './filter';

type P = { title: string; services: string[] };
const items: P[] = [
  { title: 'A', services: ['AI Automation'] },
  { title: 'B', services: ['Website'] },
  { title: 'C', services: ['Website', 'AI Automation'] },
];

describe('filterByType', () => {
  it('returns all items when selectedType is null', () => {
    expect(filterByType(items, i => i.services, null)).toHaveLength(3);
  });
  it('returns items whose key array includes the type', () => {
    const r = filterByType(items, i => i.services, 'AI Automation');
    expect(r.map(i => i.title)).toEqual(['A', 'C']);
  });
  it('returns empty when nothing matches', () => {
    expect(filterByType(items, i => i.services, 'Nope')).toEqual([]);
  });
});
```

- [ ] **Step 5: Run the test — expect FAIL**

```bash
npm test
```

Expected: fails with "Cannot find module './filter'".

- [ ] **Step 6: Write `src/lib/filter.ts`**

```ts
export function filterByType<T>(
  items: T[],
  keyFn: (item: T) => string[],
  selectedType: string | null,
): T[] {
  if (!selectedType) return items;
  return items.filter(i => keyFn(i).includes(selectedType));
}
```

- [ ] **Step 7: Run test — expect PASS**

```bash
npm test
```

- [ ] **Step 8: Write `src/components/FilterChips.astro`**

```astro
---
interface Props {
  options: string[];
  paramName?: string;
}
const { options, paramName = 'type' } = Astro.props;
const url = Astro.url;
const active = url.searchParams.get(paramName);
---
<div class="chips" role="tablist" aria-label="Filter">
  {options.map(opt => {
    const href = new URL(url.pathname, url.origin);
    if (opt !== 'All') href.searchParams.set(paramName, opt);
    const isActive = (opt === 'All' && !active) || opt === active;
    return (
      <a
        href={href.pathname + href.search}
        class:list={['chip', isActive && 'active']}
        aria-selected={isActive}
      >{opt}</a>
    );
  })}
</div>

<style>
  .chips { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .chip {
    display: inline-flex; align-items: center;
    padding: 0.45rem 0.85rem;
    font: 500 var(--step--1)/1 var(--body);
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: var(--radius-pill);
    text-decoration: none;
  }
  .chip:hover { background: var(--surface); }
  .chip.active {
    background: var(--brand); color: var(--text-invert);
    border-color: var(--brand);
  }
</style>
```

- [ ] **Step 9: Commit**

```bash
git add src/lib/ src/components/FilterChips.astro vitest.config.ts package.json package-lock.json
git commit -m "feat(filter): FilterChips + filterByType with tests"
```

---

## Task 8: Work index + ProjectCard + case-study route

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/work/index.astro`
- Create: `src/pages/work/[slug].astro`
- Create: `src/layouts/Project.astro`
- Modify: `src/pages/index.astro` — wire real ProjectCards into the "Featured work" section

**Interfaces:**
- Consumes: `getCollection('projects')`, `FilterChips`, `filterByType`, `Base`
- Produces:
  - `/work/` — filterable grid of project cards (chips: All, AI Automation, Websites, Web Apps)
  - `/work/shaolin/` — full case study, styled per spec
  - Featured section on `/` renders top 3 projects where `featured: true`, ordered by `order`

- [ ] **Step 1: Write `src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'>; featured?: boolean; }
const { project, featured = false } = Astro.props;
const d = project.data;
const href = d.hasCaseStudy ? `/work/${project.id.replace(/\.md$/, '')}/` : d.liveUrl!;
const external = !d.hasCaseStudy;
---
<article class:list={['project', featured && 'is-featured']}>
  <a href={href} rel={external ? 'noopener' : undefined} class="thumb-link">
    <div class="thumb">
      {featured && (
        <div class="thumb-mark">
          {d.title}
          <span>{d.hasCaseStudy ? 'Case study →' : 'Live site →'}</span>
        </div>
      )}
    </div>
  </a>
  <div class="tags">
    {d.services.map(s => <span class="tag">{s}</span>)}
    {d.stack.slice(0, 2).map(s => <span class="tag">{s}</span>)}
  </div>
  <h3><a href={href} rel={external ? 'noopener' : undefined}>{d.title}</a></h3>
  <p>{d.client} &middot; {d.year}</p>
</article>

<style>
  .project { display: flex; flex-direction: column; gap: 0.9rem; }
  .thumb-link { display: block; border: none; }
  .thumb {
    aspect-ratio: 4/3;
    border-radius: var(--radius);
    background: var(--surface);
    border: 1px solid var(--line);
    position: relative; overflow: hidden;
  }
  .thumb::after {
    content: "";
    position: absolute; inset: 0;
    background:
      repeating-linear-gradient(45deg,
        rgba(16,52,166,0.06) 0 8px, transparent 8px 16px);
  }
  .is-featured .thumb {
    background: linear-gradient(135deg, var(--brand) 0%, var(--brand-ink) 100%);
  }
  .is-featured .thumb::after { display: none; }
  .thumb-mark {
    position: absolute; inset: auto 1.25rem 1.25rem 1.25rem;
    color: var(--text-invert);
    font: 800 1.4rem/1 var(--display);
    letter-spacing: -0.02em;
    display: flex; align-items: baseline; justify-content: space-between; gap: 1rem;
  }
  .thumb-mark span {
    font: 500 0.7rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .tag {
    font: 500 0.65rem/1 var(--mono);
    color: var(--text-mute);
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.3rem 0.5rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
  }
  h3 {
    font: 700 1.2rem/1.2 var(--display);
    color: var(--brand);
    margin: 0; letter-spacing: -0.01em;
  }
  h3 a { color: inherit; border: none; }
  h3 a:hover { color: var(--brand-ink); }
  p { margin: 0; color: var(--text-mute); font-size: var(--step--1); line-height: 1.5; }
</style>
```

- [ ] **Step 2: Write `src/pages/work/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import FilterChips from '../../components/FilterChips.astro';
import { filterByType } from '../../lib/filter';
import { getCollection } from 'astro:content';

const allProjects = (await getCollection('projects'))
  .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

const type = Astro.url.searchParams.get('type');
// Map chip label → schema value
const typeMap: Record<string, string> = {
  'AI Automation': 'AI Automation',
  'Websites': 'Website',
  'Web Apps': 'Web App',
};
const mapped = type ? typeMap[type] ?? type : null;
const projects = filterByType(allProjects, p => p.data.services, mapped);
---
<Base title="Work — AK Wong Made" current="work">
  <section class="wrap" style="padding: calc(var(--stack) * 0.9) 0 var(--stack);">
    <div class="mono-label">Work</div>
    <h1>Selected projects.</h1>
    <FilterChips options={['All', 'AI Automation', 'Websites', 'Web Apps']} />
    <div class="grid">
      {projects.map(p => <ProjectCard project={p} featured={p.data.featured} />)}
    </div>
    {projects.length === 0 && <p>No projects match that filter yet.</p>}
  </section>
</Base>

<style>
  h1 {
    font: 700 var(--step-2)/1.05 var(--display);
    color: var(--text); letter-spacing: -0.02em;
    margin: 0 0 2rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 820px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Write `src/layouts/Project.astro`**

```astro
---
import Base from './Base.astro';
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'>; }
const { project } = Astro.props;
const d = project.data;
---
<Base title={`${d.title} — AK Wong Made`} description={`${d.client} · ${d.year}`} current="work">
  <article class="case wrap wrap--narrow">
    <div class="mono-label">Case study &mdash; {d.year}</div>
    <h1>{d.title}</h1>
    <div class="meta">
      <div><span>Client</span>{d.client}</div>
      <div><span>Stack</span>{d.stack.join(', ')}</div>
      <div><span>Services</span>{d.services.join(', ')}</div>
      {d.liveUrl && <div><span>Live</span><a href={d.liveUrl} rel="noopener">{new URL(d.liveUrl).host}</a></div>}
    </div>
    <div class="prose"><slot /></div>
    <p style="margin-top: var(--stack);"><a href="/work/">&larr; All projects</a></p>
  </article>
</Base>

<style>
  .case { padding: calc(var(--stack) * 0.9) 0 var(--stack); }
  h1 {
    font: 800 var(--step-3)/1 var(--display);
    color: var(--brand);
    letter-spacing: -0.025em;
    margin: 0 0 2rem; max-width: 20ch;
  }
  .meta {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 1rem 2rem;
    padding: 1.5rem 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    margin: 0 0 var(--stack);
    font-size: var(--step--1);
  }
  .meta span {
    display: block;
    font: 500 0.7rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 0.35rem;
  }
  .prose h2 {
    font: 700 var(--step-2)/1.1 var(--display);
    color: var(--brand);
    margin: 2.5rem 0 0.8rem;
  }
  .prose p { line-height: 1.7; margin: 0 0 1rem; }
  .prose ul { line-height: 1.7; padding-left: 1.2rem; }
  .prose ul li { margin-bottom: 0.3rem; }
</style>
```

- [ ] **Step 4: Write `src/pages/work/[slug].astro`**

```astro
---
import Project from '../../layouts/Project.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects', p => p.data.hasCaseStudy);
  return projects.map(p => ({
    params: { slug: p.id.replace(/\.md$/, '') },
    props: { project: p },
  }));
}
const { project } = Astro.props;
const { Content } = await render(project);
---
<Project project={project}>
  <Content />
</Project>
```

- [ ] **Step 5: Wire real featured cards into `/` — modify `src/pages/index.astro`**

Add to frontmatter:

```ts
import ProjectCard from '../components/ProjectCard.astro';
import { getCollection } from 'astro:content';
const featured = (await getCollection('projects', p => p.data.featured))
  .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  .slice(0, 3);
```

Replace the `.featured` section body with:

```astro
<section class="featured wrap">
  <div class="head">
    <div>
      <div class="mono-label">03 &mdash; Featured work</div>
      <h2>Selected projects.</h2>
    </div>
    <a href="/work/">See all &rarr;</a>
  </div>
  <div class="grid">
    {featured.map((p, i) => <ProjectCard project={p} featured={i === 0} />)}
  </div>
</section>
```

Add to the page's `<style>`:

```css
.featured .head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 2rem; margin-bottom: 2.5rem;
}
.featured .grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
}
@media (max-width: 820px) { .featured .grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 6: Build + visual verify**

```bash
npm run build
npm run dev
```

Visit `/`, `/work/`, `/work/shaolin/`, `/work/?type=Websites`. All should render correctly.

- [ ] **Step 7: Commit**

```bash
git add src/pages/work/ src/pages/index.astro src/components/ProjectCard.astro src/layouts/Project.astro
git commit -m "feat(work): filterable work index, shaolin case study, home featured cards"
```

---

## Task 9: Life timeline — components, index, detail

**Files:**
- Create: `src/data/eras.ts`
- Create: `src/components/TimelineEra.astro`
- Create: `src/components/TimelineMilestone.astro`
- Create: `src/components/Timeline.astro`
- Create: `src/pages/life/index.astro`
- Create: `src/layouts/Life.astro`
- Create: `src/pages/life/[slug].astro`

**Interfaces:**
- Consumes: `getCollection('life')`, `Base`
- Produces:
  - `/life/` — vertical timeline, era chip strip, sorted most recent → birth
  - `/life/[slug]/` — per-milestone Markdown page in `Life` layout
  - `<Timeline entries={…} eras={ERAS} />` — groups by era, renders spine + markers

- [ ] **Step 1: Write `src/data/eras.ts`**

```ts
export type Era = {
  key: 'Studio Life' | 'Corporate Years' | 'University' | 'Growing Up';
  years: string;
  slug: string;
};

// Order: newest → oldest (matches page order)
export const eras: Era[] = [
  { key: 'Studio Life',     years: '2023 →',       slug: 'studio-life' },
  { key: 'Corporate Years', years: '2016–2022',    slug: 'corporate-years' },
  { key: 'University',      years: '2012–2016',    slug: 'university' },
  { key: 'Growing Up',      years: '1994–2012',    slug: 'growing-up' },
];
```

- [ ] **Step 2: Write `src/components/TimelineEra.astro`**

```astro
---
import type { Era } from '../data/eras';
interface Props { era: Era; }
const { era } = Astro.props;
---
<div class="era-break" id={era.slug}>
  <div class="era-label">Era &mdash; {era.years}</div>
  <h2>{era.key}</h2>
</div>

<style>
  .era-break {
    position: relative;
    padding: 1.5rem 0 1.5rem 90px;
    margin: 3rem 0 2rem;
  }
  .era-break::before {
    content: "";
    position: absolute;
    left: 20px; top: 50%;
    width: 26px; height: 26px;
    background: var(--accent);
    border: 3px solid var(--bg);
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 0 2px var(--accent);
  }
  .era-label {
    font: 500 0.72rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.16em; text-transform: uppercase;
    margin-bottom: 0.4rem;
  }
  h2 {
    font: 700 var(--step-2)/1.05 var(--display);
    color: var(--text);
    letter-spacing: -0.02em; margin: 0;
  }
  @media (max-width: 600px) {
    .era-break { padding-left: 65px; }
    .era-break::before { left: 10px; }
  }
</style>
```

- [ ] **Step 3: Write `src/components/TimelineMilestone.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { entry: CollectionEntry<'life'>; hasDetail?: boolean; }
const { entry, hasDetail = true } = Astro.props;
const d = entry.data;
const slug = entry.id.replace(/\.md$/, '');
const isBirth = d.type === 'birth';
---
{isBirth ? (
  <div class="birth">
    <div class="year">&mdash; {d.year}</div>
    <h2>{d.title}</h2>
  </div>
) : (
  <article class:list={['milestone', d.featured && 'featured']}>
    <div class="year">&mdash; {d.year}</div>
    <h3>{d.title}</h3>
    <div class="card">
      <div class="img" data-caption={d.title} />
      <div class="body">
        <slot />
        {hasDetail && (
          <a href={`/life/${slug}/`} class="more">Read the fuller story &rarr;</a>
        )}
      </div>
    </div>
  </article>
)}

<style>
  .milestone {
    position: relative;
    padding: 0 0 3rem 90px;
  }
  .milestone::before {
    content: "";
    position: absolute;
    left: 25px; top: 12px;
    width: 16px; height: 16px;
    background: var(--bg);
    border: 2.5px solid var(--brand);
    border-radius: 50%;
    z-index: 2;
  }
  .year {
    font: 500 0.72rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.16em;
    margin-bottom: 0.5rem;
  }
  h3 {
    font: 700 1.55rem/1.15 var(--display);
    color: var(--brand);
    letter-spacing: -0.015em; margin: 0 0 1rem;
  }
  .card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .img {
    aspect-ratio: 16/9;
    background: linear-gradient(135deg, var(--bg) 0%, var(--surface) 100%);
    position: relative;
    border-bottom: 1px solid var(--line);
  }
  .img::after {
    content: attr(data-caption);
    position: absolute; inset: auto 0 0.6rem 0;
    text-align: center;
    font: 500 0.65rem/1 var(--mono);
    color: var(--text-mute);
    letter-spacing: 0.12em; text-transform: uppercase;
  }
  .body { padding: 1.5rem 1.75rem 1.75rem; }
  .body :global(p) { margin: 0 0 1rem; line-height: 1.6; }
  .body :global(p:last-child) { margin-bottom: 0; }
  .more {
    display: inline-flex; align-items: center; gap: 0.35rem;
    margin-top: 0.6rem;
    font-size: var(--step--1);
    font-weight: 500;
  }

  .featured .card { background: var(--bg); }
  .featured .img {
    background: linear-gradient(135deg, var(--brand) 0%, var(--brand-ink) 100%);
  }
  .featured .img::after { color: var(--accent); }

  .birth {
    position: relative;
    padding: 1rem 0 1rem 90px;
    margin-top: 1rem;
  }
  .birth::before {
    content: "";
    position: absolute;
    left: 20px; top: 50%;
    width: 26px; height: 26px;
    background: var(--emphasis);
    border: 3px solid var(--bg);
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 0 2px var(--emphasis);
  }
  .birth .year { color: var(--emphasis); margin-bottom: 0.35rem; }
  .birth h2 {
    font: 700 var(--step-1)/1.05 var(--display);
    color: var(--text); margin: 0;
  }
  @media (max-width: 600px) {
    .milestone, .birth { padding-left: 65px; }
    .milestone::before { left: 15px; }
    .birth::before { left: 10px; }
  }
</style>
```

- [ ] **Step 4: Write `src/components/Timeline.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import TimelineEra from './TimelineEra.astro';
import TimelineMilestone from './TimelineMilestone.astro';
import { eras } from '../data/eras';
import { render } from 'astro:content';

interface Props { entries: CollectionEntry<'life'>[]; }
const { entries } = Astro.props;

// Sort newest → oldest by year desc, then by order asc within same year
const sorted = [...entries].sort((a, b) => {
  if (b.data.year !== a.data.year) return b.data.year - a.data.year;
  return (a.data.order ?? 0) - (b.data.order ?? 0);
});

// Pre-render bodies (Content component per entry) — must await sequentially
const rendered = await Promise.all(sorted.map(async e => ({ entry: e, Content: (await render(e)).Content })));

// Group by era (era order matches `eras` array)
const byEra = eras.map(era => ({
  era,
  entries: rendered.filter(r => r.entry.data.era === era.key),
})).filter(g => g.entries.length > 0);
---
<div class="timeline">
  <div class="spine" />
  {byEra.map(group => (
    <>
      <TimelineEra era={group.era} />
      {group.entries.map(({ entry, Content }) => (
        <TimelineMilestone entry={entry} hasDetail={entry.data.type === 'milestone'}>
          <Content />
        </TimelineMilestone>
      ))}
    </>
  ))}
</div>

<style>
  .timeline {
    position: relative;
    padding: 0 0 var(--stack);
    max-width: 780px;
    margin: 0 auto;
  }
  .spine {
    position: absolute;
    left: 32px; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent 0,
      var(--brand) 40px,
      var(--brand) calc(100% - 40px),
      transparent 100%
    );
  }
  @media (max-width: 600px) { .spine { left: 22px; } }
</style>
```

- [ ] **Step 5: Write `src/pages/life/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Timeline from '../../components/Timeline.astro';
import { getCollection } from 'astro:content';
import { eras } from '../../data/eras';

const entries = await getCollection('life');
---
<Base title="Life Timeline — AK Wong Made" current="life">
  <section class="page-hero wrap">
    <div class="mono-label">Life Timeline</div>
    <h1>The road that got me here.</h1>
    <p class="lead">
      A working index of the moments, decisions, and detours that shaped
      how I think and what I build. Newest at the top. Click any milestone
      to read the fuller story.
    </p>
  </section>

  <nav class="eras" aria-label="Timeline eras">
    <div class="wrap row">
      <span class="label">Jump to era &mdash;</span>
      {eras.map(era => (
        <a href={`#${era.slug}`} class="chip">
          {era.key} <span class="yr">{era.years}</span>
        </a>
      ))}
    </div>
  </nav>

  <Timeline entries={entries} />
</Base>

<style>
  .page-hero { padding: calc(var(--stack) * 0.9) 0 calc(var(--stack) * 0.5); }
  .page-hero h1 {
    font: 800 var(--step-3)/0.98 var(--display);
    color: var(--brand);
    letter-spacing: -0.025em;
    margin: 0 0 1.5rem; max-width: 14ch;
  }
  .page-hero .lead {
    font-size: var(--step-1); max-width: 55ch;
    line-height: 1.5; margin: 0;
  }

  .eras {
    position: sticky; top: 63px; z-index: 10;
    background: rgba(245,240,230,0.88);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
    padding: 0.85rem 0;
    margin-bottom: var(--stack);
  }
  .eras .row {
    display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
  }
  .eras .label {
    font: 500 0.68rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.16em; text-transform: uppercase;
    margin-right: 0.5rem;
  }
  .chip {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    border: 1px solid var(--line);
    border-radius: var(--radius-pill);
    color: var(--text); background: var(--bg);
    text-decoration: none;
    font: 500 var(--step--1)/1 var(--body);
  }
  .chip:hover { background: var(--surface); }
  .chip .yr {
    font: 500 0.65rem/1 var(--mono);
    color: var(--text-mute);
    letter-spacing: 0.1em;
  }
</style>
```

- [ ] **Step 6: Write `src/layouts/Life.astro`**

```astro
---
import Base from './Base.astro';
import type { CollectionEntry } from 'astro:content';
interface Props { entry: CollectionEntry<'life'>; }
const { entry } = Astro.props;
const d = entry.data;
---
<Base title={`${d.title} — AK Wong Made`} current="life">
  <article class="life wrap wrap--narrow">
    <div class="mono-label">{d.era} &mdash; {d.year}</div>
    <h1>{d.title}</h1>
    <div class="prose"><slot /></div>
    <p style="margin-top: var(--stack);"><a href="/life/">&larr; Back to timeline</a></p>
  </article>
</Base>

<style>
  .life { padding: calc(var(--stack) * 0.9) 0 var(--stack); }
  h1 {
    font: 800 var(--step-3)/1 var(--display);
    color: var(--brand);
    letter-spacing: -0.025em;
    margin: 0 0 2rem; max-width: 22ch;
  }
  .prose p { line-height: 1.75; margin: 0 0 1.2rem; font-size: var(--step-1); }
</style>
```

- [ ] **Step 7: Write `src/pages/life/[slug].astro`**

```astro
---
import Life from '../../layouts/Life.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('life', e => e.data.type === 'milestone');
  return entries.map(e => ({
    params: { slug: e.id.replace(/\.md$/, '') },
    props: { entry: e },
  }));
}
const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Life entry={entry}>
  <Content />
</Life>
```

- [ ] **Step 8: Build + visual verify**

```bash
npm run build
npm run dev
```

Visit `/life/` — should match `reference/life-timeline-v1.html`. Visit `/life/2025-shaolin-launch/` — should render as a long-form page.

- [ ] **Step 9: Commit**

```bash
git add src/data/eras.ts src/components/Timeline*.astro src/components/Timeline.astro src/pages/life/ src/layouts/Life.astro
git commit -m "feat(life): timeline components, index, and per-milestone detail pages"
```

---

## Task 10: Blog — index, pagination, tag pages, layout

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/components/Pagination.astro`
- Create: `src/components/TagCloud.astro`
- Create: `src/lib/paginate.ts` (pure math for pagination — testable)
- Create: `src/lib/paginate.test.ts`
- Create: `src/layouts/Post.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/page/[page].astro`
- Create: `src/pages/blog/tag/[tag].astro`

**Interfaces:**
- Consumes: `getCollection('posts')`, `Base`
- Produces:
  - `/blog/` = first page of paginated post list (6/page)
  - `/blog/page/N/` = page N
  - `/blog/tag/[tag]/` = tag-filtered posts, also paginated
  - `paginate<T>(items: T[], perPage: number, currentPage: number): { items: T[], current: number, total: number, prev: number | null, next: number | null }`

- [ ] **Step 1: Write failing test `src/lib/paginate.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { paginate } from './paginate';

describe('paginate', () => {
  it('returns the requested slice', () => {
    const items = [1,2,3,4,5,6,7,8,9,10];
    const p = paginate(items, 3, 2);
    expect(p.items).toEqual([4,5,6]);
    expect(p.current).toBe(2);
    expect(p.total).toBe(4);
    expect(p.prev).toBe(1);
    expect(p.next).toBe(3);
  });
  it('sets prev/next to null at edges', () => {
    const items = [1,2,3];
    expect(paginate(items, 3, 1).prev).toBeNull();
    expect(paginate(items, 3, 1).next).toBeNull();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test
```

- [ ] **Step 3: Write `src/lib/paginate.ts`**

```ts
export function paginate<T>(items: T[], perPage: number, currentPage: number) {
  const total = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.max(1, Math.min(currentPage, total));
  const start = (current - 1) * perPage;
  const slice = items.slice(start, start + perPage);
  return {
    items: slice,
    current,
    total,
    prev: current > 1 ? current - 1 : null,
    next: current < total ? current + 1 : null,
  };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test
```

- [ ] **Step 5: Write `src/components/PostCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { post: CollectionEntry<'posts'>; }
const { post } = Astro.props;
const d = post.data;
const slug = post.id.replace(/\.md$/, '');
const dateStr = d.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
---
<article class="post-card">
  <div class="meta">
    <time datetime={d.date.toISOString()}>{dateStr}</time>
    {d.tags.length > 0 && <span class="dot">·</span>}
    {d.tags.map(t => <a href={`/blog/tag/${t}/`} class="tag">{t}</a>)}
  </div>
  <h3><a href={`/blog/${slug}/`}>{d.title}</a></h3>
  <p>{d.description}</p>
</article>

<style>
  .post-card {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--line);
  }
  .post-card:last-child { border-bottom: none; }
  .meta {
    display: flex; align-items: center; gap: 0.5rem;
    font: 500 0.7rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 0.75rem;
  }
  .meta .dot { color: var(--text-mute); }
  .tag { color: var(--accent); border: none; }
  h3 {
    font: 700 1.4rem/1.2 var(--display);
    color: var(--brand);
    letter-spacing: -0.01em;
    margin: 0 0 0.5rem;
  }
  h3 a { color: inherit; border: none; }
  h3 a:hover { color: var(--brand-ink); }
  p { color: var(--text); margin: 0; }
</style>
```

- [ ] **Step 6: Write `src/components/Pagination.astro`**

```astro
---
interface Props {
  current: number;
  total: number;
  baseUrl: string;  // e.g. '/blog' or '/blog/tag/notes'
}
const { current, total, baseUrl } = Astro.props;
const href = (n: number) => n === 1 ? `${baseUrl}/` : `${baseUrl}/page/${n}/`;
const prev = current > 1 ? current - 1 : null;
const next = current < total ? current + 1 : null;
---
{total > 1 && (
  <nav class="pagination" aria-label="Pagination">
    <a href={prev ? href(prev) : '#'} aria-disabled={!prev} class:list={[!prev && 'disabled']}>&larr; Prev</a>
    <span class="count">Page {current} of {total}</span>
    <a href={next ? href(next) : '#'} aria-disabled={!next} class:list={[!next && 'disabled']}>Next &rarr;</a>
  </nav>
)}

<style>
  .pagination {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
    padding: 2rem 0 0;
    margin-top: 2rem;
    border-top: 1px solid var(--line);
    font-size: var(--step--1);
  }
  .pagination a { color: var(--brand); }
  .pagination a.disabled { color: var(--text-mute); pointer-events: none; border-color: transparent; }
  .count {
    font: 500 0.7rem/1 var(--mono);
    color: var(--text-mute);
    letter-spacing: 0.14em; text-transform: uppercase;
  }
</style>
```

- [ ] **Step 7: Write `src/components/TagCloud.astro`**

```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('posts', p => !p.data.draft);
const counts = new Map<string, number>();
for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]);
---
{tags.length > 0 && (
  <aside class="cloud">
    <div class="mono-label" style="margin: 0 0 1rem;">Tags</div>
    <div class="list">
      {tags.map(([t, n]) => (
        <a href={`/blog/tag/${t}/`} class="tag">{t} <span>{n}</span></a>
      ))}
    </div>
  </aside>
)}

<style>
  .cloud { padding: 1.5rem; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
  .list { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .tag {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.35rem 0.65rem;
    font: 500 var(--step--1)/1 var(--body);
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: var(--radius-pill);
    text-decoration: none;
  }
  .tag span {
    font: 500 0.65rem/1 var(--mono);
    color: var(--accent);
  }
</style>
```

- [ ] **Step 8: Write `src/layouts/Post.astro`**

```astro
---
import Base from './Base.astro';
import type { CollectionEntry } from 'astro:content';
interface Props { post: CollectionEntry<'posts'>; }
const { post } = Astro.props;
const d = post.data;
const dateStr = d.date.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
---
<Base title={`${d.title} — AK Wong Made`} description={d.description} current="blog">
  <article class="post wrap wrap--narrow">
    <div class="mono-label">{dateStr}{d.tags.length > 0 && ` — ${d.tags.join(', ')}`}</div>
    <h1>{d.title}</h1>
    <p class="lead">{d.description}</p>
    <div class="prose"><slot /></div>
    <p style="margin-top: var(--stack);"><a href="/blog/">&larr; All posts</a></p>
  </article>
</Base>

<style>
  .post { padding: calc(var(--stack) * 0.9) 0 var(--stack); }
  h1 {
    font: 800 var(--step-3)/1 var(--display);
    color: var(--brand);
    letter-spacing: -0.025em;
    margin: 0 0 1rem; max-width: 22ch;
  }
  .lead {
    font-size: var(--step-1); color: var(--text-mute);
    margin: 0 0 var(--stack); max-width: 55ch;
  }
  .prose p { line-height: 1.75; margin: 0 0 1.2rem; font-size: var(--step-1); }
  .prose h2 { font: 700 var(--step-2)/1.1 var(--display); color: var(--brand); margin: 2.5rem 0 0.8rem; }
  .prose ul { line-height: 1.7; }
</style>
```

- [ ] **Step 9: Write `src/pages/blog/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import PostCard from '../../components/PostCard.astro';
import Pagination from '../../components/Pagination.astro';
import TagCloud from '../../components/TagCloud.astro';
import { getCollection } from 'astro:content';
import { paginate } from '../../lib/paginate';

const PER_PAGE = 6;
const all = (await getCollection('posts', p => !p.data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
const page = paginate(all, PER_PAGE, 1);
---
<Base title="Blog — AK Wong Made" current="blog">
  <section class="wrap" style="padding: calc(var(--stack) * 0.9) 0 var(--stack);">
    <div class="mono-label">Blog</div>
    <h1>Notes, essays, work-in-progress.</h1>
    <div class="layout">
      <div class="posts">
        {page.items.map(p => <PostCard post={p} />)}
        <Pagination current={page.current} total={page.total} baseUrl="/blog" />
      </div>
      <TagCloud />
    </div>
  </section>
</Base>

<style>
  h1 {
    font: 700 var(--step-2)/1.05 var(--display);
    color: var(--text); letter-spacing: -0.02em;
    margin: 0 0 2rem;
  }
  .layout {
    display: grid; grid-template-columns: 1fr 240px; gap: 3rem;
  }
  @media (max-width: 820px) { .layout { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 10: Write `src/pages/blog/page/[page].astro`**

```astro
---
import Base from '../../../layouts/Base.astro';
import PostCard from '../../../components/PostCard.astro';
import Pagination from '../../../components/Pagination.astro';
import TagCloud from '../../../components/TagCloud.astro';
import { getCollection } from 'astro:content';
import { paginate } from '../../../lib/paginate';

const PER_PAGE = 6;

export async function getStaticPaths() {
  const all = (await getCollection('posts', p => !p.data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  // Skip page 1 — that's /blog/
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    params: { page: String(i + 2) },
    props: { pageNum: i + 2, all },
  }));
}
const { pageNum, all } = Astro.props;
const page = paginate(all, PER_PAGE, pageNum);
---
<Base title={`Blog — page ${pageNum} — AK Wong Made`} current="blog">
  <section class="wrap" style="padding: calc(var(--stack) * 0.9) 0 var(--stack);">
    <div class="mono-label">Blog &mdash; page {pageNum}</div>
    <h1>Notes, essays, work-in-progress.</h1>
    <div class="layout">
      <div class="posts">
        {page.items.map(p => <PostCard post={p} />)}
        <Pagination current={page.current} total={page.total} baseUrl="/blog" />
      </div>
      <TagCloud />
    </div>
  </section>
</Base>

<style>
  h1 { font: 700 var(--step-2)/1.05 var(--display); color: var(--text); letter-spacing: -0.02em; margin: 0 0 2rem; }
  .layout { display: grid; grid-template-columns: 1fr 240px; gap: 3rem; }
  @media (max-width: 820px) { .layout { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 11: Write `src/pages/blog/tag/[tag].astro`**

```astro
---
import Base from '../../../layouts/Base.astro';
import PostCard from '../../../components/PostCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const all = await getCollection('posts', p => !p.data.draft);
  const tags = new Set(all.flatMap(p => p.data.tags));
  return [...tags].map(tag => ({
    params: { tag },
    props: {
      tag,
      posts: all
        .filter(p => p.data.tags.includes(tag))
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()),
    },
  }));
}
const { tag, posts } = Astro.props;
---
<Base title={`Tag: ${tag} — AK Wong Made`} current="blog">
  <section class="wrap" style="padding: calc(var(--stack) * 0.9) 0 var(--stack);">
    <div class="mono-label">Tag &mdash; {tag}</div>
    <h1>Posts tagged &ldquo;{tag}&rdquo;</h1>
    {posts.map(p => <PostCard post={p} />)}
    <p style="margin-top: var(--stack);"><a href="/blog/">&larr; All posts</a></p>
  </section>
</Base>

<style>
  h1 { font: 700 var(--step-2)/1.05 var(--display); color: var(--text); letter-spacing: -0.02em; margin: 0 0 2rem; }
</style>
```

- [ ] **Step 12: Add per-post route — `src/pages/blog/[slug].astro`**

```astro
---
import Post from '../../layouts/Post.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts', p => !p.data.draft);
  return posts.map(p => ({
    params: { slug: p.id.replace(/\.md$/, '') },
    props: { post: p },
  }));
}
const { post } = Astro.props;
const { Content } = await render(post);
---
<Post post={post}><Content /></Post>
```

- [ ] **Step 13: Build + visual verify**

```bash
npm run build
npm run dev
```

Visit `/blog/`, `/blog/hello-world/`, `/blog/tag/meta/`.

- [ ] **Step 14: Commit**

```bash
git add src/lib/paginate.ts src/lib/paginate.test.ts src/components/PostCard.astro src/components/Pagination.astro src/components/TagCloud.astro src/layouts/Post.astro src/pages/blog/
git commit -m "feat(blog): paginated index, tag pages, per-post route"
```

---

## Task 11: Gallery + Lightbox

**Files:**
- Create: `src/data/gallery.ts`
- Create: `src/components/GalleryGrid.astro`
- Create: `src/components/Lightbox.astro`
- Create: `src/pages/gallery.astro`
- Create: `public/gallery/README.md` (a note that real images go here)

**Interfaces:**
- Consumes: `Base`, `FilterChips`, `filterByType`
- Produces:
  - `/gallery/` — filterable image grid; chips = All / AI Automation / Websites / Web Apps
  - Clicking a tile opens a native `<dialog>` lightbox with the full image + caption; ESC or click-outside closes

- [ ] **Step 1: Write `src/data/gallery.ts`**

```ts
export type GalleryItem = {
  src: string;       // /gallery/<file>
  alt: string;
  caption: string;
  project: string;
  services: ('AI Automation' | 'Website' | 'Web App')[];
};

// Seed with placeholders; real images added later.
export const gallery: GalleryItem[] = [
  { src: '/gallery/placeholder-1.svg', alt: 'Shaolin homepage hero',        caption: 'Shaolin Hung Gar — Home',    project: 'Shaolin',    services: ['Website'] },
  { src: '/gallery/placeholder-2.svg', alt: 'Shaolin gallery grid',          caption: 'Shaolin Hung Gar — Gallery', project: 'Shaolin',    services: ['Website'] },
  { src: '/gallery/placeholder-3.svg', alt: 'Invoice automation dashboard',  caption: 'Invoice → Receipt',          project: 'Invoicing',  services: ['AI Automation'] },
  { src: '/gallery/placeholder-4.svg', alt: 'Financial planning tool',       caption: 'Legacy Financial Planning',  project: 'Legacy',     services: ['Web App'] },
];
```

- [ ] **Step 2: Add a placeholder SVG**

Create `public/gallery/placeholder-1.svg` (repeat for 2, 3, 4 with color variations):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#EDE6D6"/>
  <rect x="20" y="20" width="760" height="560" fill="none" stroke="#D9D0BC" stroke-width="2"/>
  <text x="400" y="310" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="18" fill="#6B6B6B" letter-spacing="4">PLACEHOLDER</text>
</svg>
```

- [ ] **Step 3: Write `src/components/Lightbox.astro`**

```astro
---
// Lightbox is a single dialog per page; opened by grid items via data attributes.
---
<dialog id="lightbox" class="lightbox">
  <button class="close" aria-label="Close" data-close>&times;</button>
  <img id="lightbox-img" alt="" />
  <p id="lightbox-caption" class="caption" />
</dialog>

<script>
  const dlg = document.getElementById('lightbox') as HTMLDialogElement;
  const img = document.getElementById('lightbox-img') as HTMLImageElement;
  const cap = document.getElementById('lightbox-caption')!;
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const trigger = t.closest('[data-lightbox]') as HTMLAnchorElement | null;
    if (trigger) {
      e.preventDefault();
      img.src = trigger.dataset.src ?? trigger.href;
      img.alt = trigger.dataset.alt ?? '';
      cap.textContent = trigger.dataset.caption ?? '';
      dlg.showModal();
    }
    if (t.matches('[data-close]') || t === dlg) dlg.close();
  });
</script>

<style>
  .lightbox {
    border: none; padding: 0;
    background: transparent; color: var(--text-invert);
    max-width: 90vw; max-height: 90vh;
  }
  .lightbox::backdrop {
    background: rgba(11, 36, 120, 0.92);
    backdrop-filter: blur(4px);
  }
  .lightbox img { max-width: 90vw; max-height: 80vh; border-radius: var(--radius); }
  .close {
    position: absolute; top: -3rem; right: 0;
    background: transparent; border: none;
    color: var(--text-invert); font-size: 2rem; cursor: pointer;
  }
  .caption {
    text-align: center; margin: 0.75rem 0 0;
    font: 500 0.75rem/1 var(--mono);
    color: var(--accent);
    letter-spacing: 0.14em; text-transform: uppercase;
  }
</style>
```

- [ ] **Step 4: Write `src/components/GalleryGrid.astro`**

```astro
---
import type { GalleryItem } from '../data/gallery';
interface Props { items: GalleryItem[]; }
const { items } = Astro.props;
---
<div class="grid">
  {items.map(it => (
    <a
      href={it.src}
      class="tile"
      data-lightbox
      data-src={it.src}
      data-alt={it.alt}
      data-caption={it.caption}
    >
      <img src={it.src} alt={it.alt} loading="lazy" />
      <span class="tag">{it.services.join(' · ')}</span>
    </a>
  ))}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media (max-width: 820px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .grid { grid-template-columns: 1fr; } }
  .tile {
    position: relative; display: block;
    border: 1px solid var(--line);
    border-radius: var(--radius); overflow: hidden;
  }
  .tile img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
  .tag {
    position: absolute; left: 0.75rem; bottom: 0.75rem;
    padding: 0.25rem 0.5rem;
    font: 500 0.65rem/1 var(--mono);
    color: var(--text-invert);
    background: rgba(11, 36, 120, 0.85);
    letter-spacing: 0.12em; text-transform: uppercase;
    border-radius: var(--radius-sm);
  }
</style>
```

- [ ] **Step 5: Write `src/pages/gallery.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import FilterChips from '../components/FilterChips.astro';
import GalleryGrid from '../components/GalleryGrid.astro';
import Lightbox from '../components/Lightbox.astro';
import { filterByType } from '../lib/filter';
import { gallery } from '../data/gallery';

const type = Astro.url.searchParams.get('type');
const typeMap: Record<string, string> = {
  'AI Automation': 'AI Automation',
  'Websites': 'Website',
  'Web Apps': 'Web App',
};
const mapped = type ? typeMap[type] ?? type : null;
const items = filterByType(gallery, g => g.services, mapped);
---
<Base title="Gallery — AK Wong Made" current="gallery">
  <section class="wrap" style="padding: calc(var(--stack) * 0.9) 0 var(--stack);">
    <div class="mono-label">Gallery</div>
    <h1>Screenshots from the studio.</h1>
    <FilterChips options={['All', 'AI Automation', 'Websites', 'Web Apps']} />
    <GalleryGrid items={items} />
  </section>
  <Lightbox />
</Base>

<style>
  h1 { font: 700 var(--step-2)/1.05 var(--display); color: var(--text); letter-spacing: -0.02em; margin: 0 0 2rem; }
</style>
```

- [ ] **Step 6: Build + visual verify**

```bash
npm run build
npm run dev
```

Visit `/gallery/`, click a tile — lightbox opens, ESC closes.

- [ ] **Step 7: Commit**

```bash
git add src/data/gallery.ts src/components/GalleryGrid.astro src/components/Lightbox.astro src/pages/gallery.astro public/gallery/
git commit -m "feat(gallery): filterable grid with lightbox"
```

---

## Task 12: About + Contact + 404

**Files:**
- Create: `src/data/tools.ts`
- Create: `src/components/LogoWall.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `Base`
- Produces: `/about/`, `/contact/`, `/404/` — all rendered per spec

- [ ] **Step 1: Write `src/data/tools.ts`**

```ts
export type Tool = { name: string; };
export const tools: Tool[] = [
  { name: 'Astro' },
  { name: 'TypeScript' },
  { name: 'Eleventy' },
  { name: 'Cloudflare' },
  { name: 'Figma' },
  { name: 'Anthropic' },
  { name: 'PostgreSQL' },
  { name: 'Node.js' },
];
```

- [ ] **Step 2: Write `src/components/LogoWall.astro`**

```astro
---
import { tools } from '../data/tools';
---
<div class="wall">
  {tools.map(t => <span class="chip">{t.name}</span>)}
</div>

<style>
  .wall {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    margin-top: 1.5rem;
  }
  .chip {
    font: 500 var(--step--1)/1 var(--body);
    padding: 0.5rem 0.9rem;
    background: var(--bg);
    border: 1px solid var(--line);
    color: var(--text);
    border-radius: var(--radius-pill);
  }
</style>
```

- [ ] **Step 3: Write `src/pages/about.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import LogoWall from '../components/LogoWall.astro';
---
<Base title="About — AK Wong Made" current="about">
  <section class="wrap wrap--narrow" style="padding: calc(var(--stack) * 0.9) 0 var(--stack);">
    <div class="mono-label">About</div>
    <h1>One person. A shop that ships.</h1>
    <div class="prose">
      <p>
        I'm Adrian. I run AK Wong Made — a small studio doing AI automation,
        small-business websites, and web apps out of Vancouver. Before this
        I spent seven years building software inside larger companies.
      </p>
      <p>
        I work with owners who want their tools to make sense, and with small
        teams who need software they can maintain themselves. Everything I
        ship is built to outlast the vendor that hosts it.
      </p>
      <h2>How I work</h2>
      <ul>
        <li><strong>Own the boring parts.</strong> DNS, hosting, forms, backups — all set up so you never have to think about them.</li>
        <li><strong>Build to be understood.</strong> No opaque frameworks, no lock-in, no "we'll rewrite this next quarter."</li>
        <li><strong>Ship early.</strong> Something small and real beats a rewrite that never lands.</li>
      </ul>
      <h2>Tools</h2>
      <LogoWall />
    </div>
  </section>
</Base>

<style>
  h1 { font: 800 var(--step-3)/1 var(--display); color: var(--brand); letter-spacing: -0.025em; margin: 0 0 var(--stack); max-width: 20ch; }
  .prose p { line-height: 1.75; margin: 0 0 1.2rem; font-size: var(--step-1); }
  .prose h2 { font: 700 var(--step-2)/1.1 var(--display); color: var(--brand); margin: 2.5rem 0 0.8rem; }
  .prose ul { line-height: 1.7; padding-left: 1.2rem; }
  .prose ul li { margin-bottom: 0.4rem; }
</style>
```

- [ ] **Step 4: Write `src/pages/contact.astro`**

```astro
---
import Base from '../layouts/Base.astro';
// Placeholder Calendly URL — replace when the real one is set.
const calendly = 'https://calendly.com/akwongmade/discovery';
---
<Base title="Contact — AK Wong Made" current="contact">
  <section class="wrap wrap--narrow" style="padding: calc(var(--stack) * 0.9) 0 var(--stack);">
    <div class="mono-label">Contact</div>
    <h1>Let's talk.</h1>
    <p class="lead">
      Book a 20-minute call below, or email <a href="mailto:hi@akwongmade.com">hi@akwongmade.com</a>.
      No pitch, no obligation — I'll ask what you're trying to do, and tell you honestly whether I'm the right person to help.
    </p>
    <div class="calendly">
      <iframe
        src={calendly + '?hide_gdpr_banner=1'}
        title="Book a call with AK Wong Made"
        loading="lazy"
      ></iframe>
    </div>
  </section>
</Base>

<style>
  h1 { font: 800 var(--step-3)/1 var(--display); color: var(--brand); letter-spacing: -0.025em; margin: 0 0 1.5rem; }
  .lead { font-size: var(--step-1); max-width: 55ch; line-height: 1.55; margin: 0 0 var(--stack); }
  .calendly iframe {
    width: 100%; height: 750px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
  }
</style>
```

- [ ] **Step 5: Write `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Not found — AK Wong Made">
  <section class="wrap" style="padding: var(--stack) 0; text-align: center;">
    <div class="mono-label" style="justify-content: center;">404</div>
    <h1>This page took a wrong turn.</h1>
    <p><a href="/" class="btn btn-primary">&larr; Back to home</a></p>
  </section>
</Base>

<style>
  h1 { font: 800 var(--step-3)/1 var(--display); color: var(--brand); letter-spacing: -0.025em; margin: 0 0 var(--stack); }
</style>
```

- [ ] **Step 6: Build + visual verify**

```bash
npm run build
npm run dev
```

Visit `/about/`, `/contact/`, `/some-fake-url/`.

- [ ] **Step 7: Commit**

```bash
git add src/data/tools.ts src/components/LogoWall.astro src/pages/about.astro src/pages/contact.astro src/pages/404.astro
git commit -m "feat(pages): about, contact (calendly), 404"
```

---

## Task 13: Favicon, robots, meta polish, Cloudflare Web Analytics

**Files:**
- Create: `public/favicon.svg`
- Create: `public/robots.txt`
- Create: `public/og-default.png` (placeholder — 1200×630 flat blue with the wordmark, exported from any tool; commit as-is)
- Modify: `src/layouts/Base.astro` — add Cloudflare Web Analytics `<script>` (deferred, only in prod)

**Interfaces:**
- Consumes: nothing new
- Produces: correct favicon in tab, robots.txt at `/robots.txt`, OG image at `/og-default.png`, CF Web Analytics beacon on every page

- [ ] **Step 1: Write `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#1034A6"/>
  <text x="32" y="42" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="36" fill="#F5F0E6">A</text>
</svg>
```

- [ ] **Step 2: Write `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.akwongmade.com/sitemap-index.xml
```

- [ ] **Step 3: Placeholder `public/og-default.png`**

Create a 1200×630 flat-blue PNG (Egyptian Blue `#1034A6`) with the wordmark "AK Wong Made" in Ivory using any image tool (Figma / Sketch / macOS Preview from an SVG export). Commit as-is; refine later.

- [ ] **Step 4: Add Cloudflare Web Analytics to `src/layouts/Base.astro`**

Just before `</body>`, add:

```astro
{import.meta.env.PROD && (
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN"}'
  ></script>
)}
```

Leave a `TODO(token)` note in a `NOTES.md` at the repo root so the token gets added post-deploy.

- [ ] **Step 5: Build + verify**

```bash
npm run build
```

`dist/sitemap-index.xml` and `dist/robots.txt` should exist. Favicon should show in the browser tab.

- [ ] **Step 6: Commit**

```bash
git add public/favicon.svg public/robots.txt public/og-default.png src/layouts/Base.astro NOTES.md
git commit -m "chore(meta): favicon, robots, og-default, CF web analytics stub"
```

---

## Task 14: Deploy to Cloudflare Pages + DNS

**Files:**
- Create: `NOTES.md` (append deploy notes, or create if not present)
- Create: `.github/` — not needed; Cloudflare Pages watches GitHub directly

**Interfaces:**
- Consumes: a GitHub repo with the code pushed to it
- Produces: `https://akwongmade.pages.dev` (Pages default) and `https://www.akwongmade.com` (custom domain)

- [ ] **Step 1: Push repo to GitHub**

Create a new empty repo at `github.com/adrianwongstudio/akwongmade` (private or public — the user's choice).

```bash
git remote add origin git@github.com:adrianwongstudio/akwongmade.git
git push -u origin main
```

- [ ] **Step 2: Create a Cloudflare Pages project (in the CF dashboard)**

- Log into Cloudflare → Workers & Pages → Create → Pages → Connect to Git
- Select the repo
- Build settings:
  - Framework preset: **Astro**
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Node version env var: `NODE_VERSION=20`
- Deploy. First build should succeed.

- [ ] **Step 3: Attach the custom domain**

- In the Pages project → Custom domains → Set up a custom domain → `www.akwongmade.com`
- Cloudflare adds the CNAME automatically since DNS is on Cloudflare.
- Add a redirect rule: `akwongmade.com/*` → `https://www.akwongmade.com/$1` (301). Set up via Cloudflare Rules → Redirect Rules.

- [ ] **Step 4: Enable Cloudflare Web Analytics**

- In the CF dashboard → Web Analytics → Add a site → `www.akwongmade.com`
- Copy the beacon token
- Edit `src/layouts/Base.astro` and replace `REPLACE_WITH_CF_ANALYTICS_TOKEN` with the real token
- Commit + push

```bash
git commit -am "chore(analytics): wire real CF Web Analytics token"
git push
```

- [ ] **Step 5: Smoke-test production**

- Visit `https://www.akwongmade.com/` — should render homepage
- Visit `https://akwongmade.com/` — should redirect to `www.`
- Check every page loads (`/work/`, `/work/shaolin/`, `/gallery/`, `/life/`, `/life/2025-shaolin-launch/`, `/blog/`, `/blog/hello-world/`, `/blog/tag/meta/`, `/about/`, `/contact/`, `/definitely-not-a-page/` → 404)
- Confirm CF Web Analytics beacon fires (Network tab shows `beacon.min.js`)

- [ ] **Step 6: Update NOTES.md with the deploy status and commit**

```bash
git commit -am "docs: mark deploy complete in notes"
git push
```

---

## Task 15: Final QA sweep

**Files:** none new; verification only.

- [ ] **Step 1: Run full checks**

```bash
npx astro check
npm test
npm run build
```

All three must pass.

- [ ] **Step 2: Lighthouse audit (Chrome DevTools) on production**

Target: Performance ≥ 95, Accessibility ≥ 95 on `/`, `/work/`, `/life/`, `/blog/`, `/about/`.

- [ ] **Step 3: Manual responsive check**

Resize to 375px, 768px, 1280px on `/`, `/life/`, `/work/`. No horizontal scroll, nav collapses cleanly at 640px.

- [ ] **Step 4: Manual contrast check**

Spot-check every colored text-on-background combination against WCAG AA (4.5:1 for body, 3:1 for large). Focus on gold text on ivory — confirm it appears ONLY in mono-labels, tag counts, and section marks, never in body copy.

- [ ] **Step 5: Sign off in NOTES.md**

Append a "Launch checklist" section with today's date and a summary of what's live.

```bash
git commit -am "docs: launch sign-off"
git push
```

---

## Self-Review

**Spec coverage:**

- §1 Overview — Task 2 (scaffold Astro 5), Task 14 (deploy Cloudflare Pages) ✓
- §2 Palette — Task 3 (tokens.css with all colors, aliases, type scale) ✓
- §3 IA — every route in the sitemap has a task: `/` (T5), `/work/` (T8), `/work/[slug]/` (T8), `/gallery/` (T11), `/life/` (T9), `/life/[slug]/` (T9), `/blog/` (T10), `/blog/page/[n]/` (T10), `/blog/tag/[t]/` (T10), `/about/` (T12), `/contact/` (T12), `/404/` (T12) ✓
- §4 Page designs — each covered in its respective page task ✓
- §5 Component architecture — every file listed in the spec has a create step in some task ✓
- §6 Content model — Task 6 defines all three collections with the exact fields from the spec ✓
- §7 Stack — Task 2 (Astro + sitemap + sharp), Task 4 (Google Fonts), Task 7 (Vitest) ✓
- §8 Deploy — Task 14 (Cloudflare Pages + DNS + analytics) ✓
- §9 Out of scope — nothing scoped in ✓
- §10 Success criteria — Task 15 explicitly verifies each ✓

**Placeholder scan:** no TBDs; all code is inline. Every "test" step has assertions; every implementation step has code. The Calendly URL and CF Analytics token are marked as placeholder-with-`REPLACE_WITH_…` and gated behind Task 14 Step 4.

**Type consistency:**
- `filterByType` signature: `(items, keyFn, selectedType) → items`. Used identically in Task 8 (Work), Task 11 (Gallery).
- `paginate` signature: returns `{ items, current, total, prev, next }`. Used identically in Task 10 index and `[page].astro`.
- Content collection schemas defined once in `src/content.config.ts` (Task 6); every consumer imports via `CollectionEntry<'…'>`.
- Every `.astro` component `Props` interface uses the same field names its callers pass.

Plan is internally consistent.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-05-akwongmade.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — execute tasks in this session with checkpoints for review.

**Which approach?**
