# Portfolio recipe — Astro 5

Everything the reference HTML demonstrates, restructured as a real project with content collections and generated project routes.

---

## 1. Scaffold

```bash
npm create astro@latest -- --template minimal my-portfolio
cd my-portfolio
npx astro add sitemap
npm i -D sharp            # image optimisation backend
```

Skip Tailwind. This design is ~400 lines of CSS with custom properties; a utility framework adds build weight and buys you nothing at this size.

## 2. File tree

```
my-portfolio/
├── astro.config.mjs
├── src/
│   ├── content.config.ts          ← collection schema (Astro 5 location)
│   ├── content/
│   │   └── projects/
│   │       ├── northbound.md
│   │       ├── kessler.md
│   │       └── arc9.md
│   ├── data/
│   │   └── clients.ts             ← logo wall config
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── LogoWall.astro
│   │   ├── ProjectCard.astro
│   │   └── Reveal.astro
│   ├── layouts/
│   │   └── Base.astro
│   └── pages/
│       ├── index.astro
│       ├── contact.astro
│       └── projects/
│           ├── index.astro
│           └── [...slug].astro    ← generates /projects/<slug>/
└── public/
    ├── media/hero.webm
    ├── media/hero-poster.jpg
    └── logos/*.svg
```

## 3. Config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com',
  trailingSlash: 'always',      // matches the /projects/slug/ URL shape
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
```

## 4. Content collection

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    kind: z.string(),                    // "Design system", "Data product"
    year: z.number(),
    stack: z.array(z.string()),
    cover: image(),                      // typed + optimised at build
    coverAlt: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
```

```markdown
<!-- src/content/projects/northbound.md -->
---
title: Northbound
kind: Design system
year: 2025
stack: [TypeScript, React, Style Dictionary]
cover: ./_covers/northbound.jpg
coverAlt: Component library documentation site
featured: true
order: 1
---

## The problem

Three product teams, three button components, zero agreement.
```

The `zod` schema is the whole point: misspell a frontmatter key and the build fails loudly instead of rendering `undefined` into production.

## 5. Dynamic routing

```astro
---
// src/pages/projects/[...slug].astro
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import Base from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const { title, kind, year, stack, cover, coverAlt } = project.data;
---

<Base title={`${title} — Your Name`} description={kind}>
  <article class="wrap">
    <p class="eyebrow">{kind} · {year}</p>
    <h1 class="display">{title}</h1>
    <Image src={cover} alt={coverAlt} widths={[640, 1024, 1600]} loading="eager" />
    <p class="project__stack">{stack.join(' · ')}</p>
    <div class="prose"><Content /></div>
  </article>
</Base>
```

Index page:

```astro
---
// src/pages/projects/index.astro
import { getCollection } from 'astro:content';
const projects = (await getCollection('projects', ({ data }) => !data.draft))
  .sort((a, b) => a.data.order - b.data.order);
---
<div class="projects">
  {projects.map((p, i) => (
    <a class="project" href={`/projects/${p.id}/`} data-reveal style={`--delay:${i * 90}ms`}>
      …
    </a>
  ))}
</div>
```

Note the Astro 5 API: `render(entry)` imported from `astro:content`, and `entry.id` is the slug — `entry.slug` and `entry.render()` were the Astro 4 shape.

## 6. Logo wall

```ts
// src/data/clients.ts
export const clients = [
  { name: 'Northbound', src: '/logos/northbound.svg' },
  { name: 'Kessler',    src: '/logos/kessler.svg' },
];
```

```astro
---
import { clients } from '../data/clients';
---
<div class="logos">
  {clients.map(c => (
    <div class="logo" role="img" aria-label={`Logo of ${c.name}`} style={`--src:url(${c.src})`} />
  ))}
</div>
```

The `mask-image` technique in the CSS forces every logo to one colour regardless of what fills are baked into the source SVG. This is the single highest-leverage move on the whole page — you never have to hand-edit a client's SVG, and the wall reads as texture instead of a colour clash.

## 7. Reveal component

Wrap the observer in a component so it's opt-in per element:

```astro
---
// src/components/Reveal.astro
const { delay = 0, as: Tag = 'div' } = Astro.props;
---
<Tag data-reveal style={`--delay:${delay}ms`}><slot /></Tag>

<script>
  const els = document.querySelectorAll('[data-reveal]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }
</script>
```

Astro deduplicates identical inline `<script>` blocks across component instances, so this ships once regardless of how many times you use `<Reveal>`.

**Progressive enhancement alternative** — scroll-linked CSS, zero JS. Baseline in Chrome/Edge/Firefox; still missing in Safari as of early 2026, so keep the JS path as the fallback:

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 32%;
    }
  }
}
@keyframes reveal { from { opacity: 0; translate: 0 24px; } to { opacity: 1; translate: 0; } }
```

## 8. Hero video pipeline

```bash
# target: under 2 MB, 1280×720, no audio track
ffmpeg -i source.mp4 -t 12 -an -vf "scale=1280:-2,fps=24" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 public/media/hero.webm

# Safari/iOS fallback
ffmpeg -i source.mp4 -t 12 -an -vf "scale=1280:-2,fps=24" \
  -c:v libx264 -crf 26 -movflags +faststart public/media/hero.mp4

# poster frame
ffmpeg -i public/media/hero.mp4 -vframes 1 -q:v 3 public/media/hero-poster.jpg
```

Non-negotiables on the element: `muted autoplay loop playsinline preload="metadata"` and a `poster`. Missing `playsinline` breaks autoplay on iOS; missing `muted` breaks it everywhere.

The reference file drops the video entirely on `saveData` or viewports under 640px and lets the CSS gradient carry the hero. On mobile a background video is 2 MB of bandwidth for something largely hidden behind a scrim — cutting it is usually the single biggest LCP win on this kind of page.

## 9. Deploy

```bash
git init && git add -A && git commit -m "init"
gh repo create my-portfolio --private --source=. --push
```

Cloudflare Pages → connect repo → framework preset **Astro** → build `npm run build`, output `dist`. Free, global CDN, previews per branch.

Then verify:

```bash
npx unlighthouse --site https://yourdomain.com
```

Target: LCP under 1.5s, CLS under 0.05, zero a11y violations. A static site this size that misses those targets has a specific bug, not a general performance problem — usually the video or an unsubsetted font.

## 10. Fonts

Self-host rather than hitting Google Fonts; it removes a third-party connection and a render-blocking round trip.

```bash
npx fontsource-cli add bricolage-grotesque inter jetbrains-mono
```

Then in `Base.astro`, `@import` only the weights you use and add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the display face.

---

## Order of operations

1. Copy first — five sections, written before any code. This determines conversion; the framework does not.
2. Tokens (`tokens.css`) — palette, type scale, spacing. Everything downstream derives from here.
3. `Base.astro` + `Header` + footer.
4. Hero, static first. Add the video only once the gradient version already looks finished.
5. Logo wall + services.
6. Content collection + `[...slug].astro`.
7. Reveals last. Motion is the layer you add to something that already works.
8. Deploy on day one, not at the end. Push early and often so you're always looking at the real thing on a real CDN.

Two solid days at your level.
