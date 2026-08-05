# Project pages — schema + templates

Reverse-engineered from the LFO project pages, with the bugs fixed.

---

## 1. Schema

Extends the collection from the main recipe. Every field below maps to something LFO's pages actually render.

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title:    z.string(),
    client:   z.string(),                        // rendered ABOVE the h1, not inside it
    clientLogo: image().optional(),
    kind:     z.string(),                        // "Web App", "Design system"
    summary:  z.string().max(160),               // meta description + og + index card
    year:     z.number(),
    stack:    z.array(z.string()).min(1),
    liveUrl:  z.string().url().optional(),
    liveLabel: z.string().optional(),            // display text, e.g. "klimaatadaptatie.nl"

    hero:     image(),
    heroAlt:  z.string().min(1),                 // .min(1) makes empty alt a BUILD ERROR

    gallery: z.array(z.object({
      src:     image(),
      alt:     z.string().min(1),
      caption: z.string().optional(),
    })).default([]),

    tags:     z.array(z.string()).default([]),   // powers derived "related projects"
    order:    z.number().default(99),
    featured: z.boolean().default(false),
    draft:    z.boolean().default(false),
  }),
});

export const collections = { projects };
```

`.max(160)` on `summary` and `.min(1)` on every alt turn two of LFO's live defects into build failures. That's the whole argument for a typed collection over hand-written templates.

```markdown
<!-- src/content/projects/cas.md -->
---
title: Climate Adaptation Summit Timetables
client: Oostblok media
kind: Javascript app
summary: Embedded HTML timetables from Google Sheets JSON, displayed inside a virtual 3D environment.
year: 2021
stack: [HTML, CSS, JavaScript, JSON, Google Sheets]
liveUrl: https://klimaatadaptatiegroningen.nl
liveLabel: klimaatadaptatiegroningen.nl
hero: ./_media/cas/home.webp
heroAlt: The event timetable floating above a 3D model of Groningen
gallery:
  - src: ./_media/cas/martini.webp
    alt: Venue interior with timetable beside a live video feed
    caption: Each venue loaded its own timetable via a query parameter.
tags: [data-viz, embed, events]
order: 6
---

## The constraint

The organisers needed to edit the schedule themselves, in a tool they already used…
```

## 2. Detail page

```astro
---
// src/pages/projects/[...slug].astro
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import Base from '../../layouts/Base.astro';
import Gallery from '../../components/Gallery.astro';
import RelatedProjects from '../../components/RelatedProjects.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const d = project.data;
---

<Base title={`${d.title} — Your Name`} description={d.summary} ogImage={d.hero}>
  <article>
    <header class="wrap project-head">
      {d.clientLogo && <Image src={d.clientLogo} alt={`${d.client} logo`} height={28} class="logo" />}
      <p class="eyebrow">{d.client} · {d.year}</p>

      <!-- client sits OUTSIDE the h1 -->
      <h1 class="display">{d.title}</h1>
      <p class="project__kind">{d.kind}</p>
      <p class="lede">{d.summary}</p>

      <ul class="stack">
        {d.stack.map(t => <li>{t}</li>)}
      </ul>

      {d.liveUrl && (
        <a class="btn btn--ghost" href={d.liveUrl} target="_blank" rel="noopener noreferrer">
          {d.liveLabel ?? 'Visit site'}
          <span class="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </header>

    <Image src={d.hero} alt={d.heroAlt} widths={[720, 1200, 1800]}
           sizes="(max-width: 78rem) 100vw, 78rem" loading="eager" fetchpriority="high" class="project-hero" />

    <div class="wrap prose"><Content /></div>

    <Gallery items={d.gallery} />

    <RelatedProjects current={project} limit={3} />
  </article>
</Base>
```

`loading="eager"` + `fetchpriority="high"` on the hero only. Everything below gets Astro's default lazy loading — this is your LCP.

## 3. Gallery

The captions are the highest-value content on these pages. Give them real typographic weight.

```astro
---
// src/components/Gallery.astro
import { Image } from 'astro:assets';
const { items = [] } = Astro.props;
---
{items.length > 0 && (
  <section class="wrap gallery">
    {items.map((item, i) => (
      <figure data-reveal style={`--delay:${i * 80}ms`}>
        <Image src={item.src} alt={item.alt} widths={[640, 1024, 1600]}
               sizes="(max-width: 60rem) 100vw, 60rem" loading="lazy" decoding="async" />
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>
    ))}
  </section>
)}

<style>
  .gallery { display: grid; gap: clamp(3rem, 8vh, 6rem); margin-block: var(--stack); }
  figure { margin: 0; }
  figure img { width: 100%; height: auto; border: 1px solid var(--line); }
  figcaption {
    margin-top: 1rem;
    padding-left: 1rem;
    border-left: 2px solid var(--accent);
    font: 400 var(--step-0)/1.55 var(--body);
    color: var(--paper);
    max-width: 52ch;
  }
</style>
```

Note `figcaption` uses `--paper`, not `--muted`. LFO's captions do the explanatory heavy lifting but are styled as afterthoughts. Don't repeat that.

## 4. Related projects — derived, not hardcoded

LFO's "Other projects" block shows two entries on one page and one on another. That's a hand-maintained list going stale. Derive it:

```astro
---
// src/components/RelatedProjects.astro
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';

const { current, limit = 3 } = Astro.props;
const all = await getCollection('projects', ({ data }) => !data.draft);

const scored = all
  .filter(p => p.id !== current.id)
  .map(p => ({
    project: p,
    score:
      p.data.tags.filter(t => current.data.tags.includes(t)).length * 2 +
      (p.data.kind === current.data.kind ? 1 : 0),
  }))
  .sort((a, b) => b.score - a.score || a.project.data.order - b.project.data.order)
  .slice(0, limit)
  .map(s => s.project);
---
{scored.length > 0 && (
  <section class="wrap">
    <p class="eyebrow">Related work</p>
    <div class="projects">
      {scored.map((p, i) => (
        <a class="project" href={`/projects/${p.id}/`} data-reveal style={`--delay:${i * 90}ms`}>
          <Image src={p.data.hero} alt={p.data.heroAlt} widths={[400, 800]}
                 sizes="(max-width: 60rem) 100vw, 26rem" class="project__thumb" />
          <div class="project__body">
            <span class="project__kind">{p.data.kind}</span>
            <h3>{p.data.title}</h3>
            <div class="project__stack">{p.data.stack.join(' · ')}</div>
          </div>
        </a>
      ))}
    </div>
  </section>
)}
```

Tag overlap weighted 2×, same-kind 1×, `order` breaks ties. Always fills to `limit` as long as the collection is big enough — no more one-item blocks.

## 5. Projects index

```astro
---
// src/pages/projects/index.astro
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import Base from '../../layouts/Base.astro';

const projects = (await getCollection('projects', ({ data }) => !data.draft))
  .sort((a, b) => a.data.order - b.data.order);
---
<!-- description is REQUIRED here — LFO's index page ships without one -->
<Base
  title="Work — Your Name"
  description="Selected projects: design systems, data products, and front ends built to last.">

  <section class="wrap">
    <p class="eyebrow">{projects.length} selected projects</p>
    <h1 class="display">Things I made <em>on purpose</em>.</h1>

    <div class="projects">
      {projects.map((p, i) => (
        <a class="project" href={`/projects/${p.id}/`} data-reveal style={`--delay:${(i % 3) * 90}ms`}>
          <Image src={p.data.hero} alt={p.data.heroAlt} widths={[400, 800, 1200]}
                 sizes="(max-width: 60rem) 100vw, 26rem"
                 loading={i < 3 ? 'eager' : 'lazy'} class="project__thumb" />
          <div class="project__body">
            <span class="project__kind">{p.data.kind}</span>
            <h2>{p.data.title}</h2>
            <p class="project__client">{p.data.client} · {p.data.year}</p>
            <div class="project__stack">{p.data.stack.join(' · ')}</div>
          </div>
        </a>
      ))}
    </div>
  </section>
</Base>
```

`loading={i < 3 ? 'eager' : 'lazy'}` — above-fold cards eager, everything else deferred.

## 6. Base layout — the SEO plumbing LFO gets 90% right

```astro
---
// src/layouts/Base.astro
import { getImage } from 'astro:assets';
const { title, description, ogImage } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const og = ogImage ? new URL((await getImage({ src: ogImage, width: 1200, format: 'jpg' })).src, Astro.site) : undefined;
---
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:type" content="website" />
  {og && <meta property="og:image" content={og} />}
  {og && <meta name="twitter:card" content="summary_large_image" />}
  <meta name="twitter:description" content={description} />
</head>
```

Making `description` a required prop means the index page physically cannot ship without one.

## 7. Image pipeline

LFO's SAFT screenshots are `.png` while everything else is `.webp` — a manual-conversion process with gaps. Don't convert by hand. Commit sources into `src/content/projects/_media/` (**not** `public/`), reference them through the schema's `image()` helper, and let Astro emit responsive WebP/AVIF with correct `width`/`height` attributes at build time. Files in `public/` are copied through untouched and unoptimised.

```bash
npm i -D sharp
```

## 8. Bug checklist — the five LFO shipped

| Defect | Prevented by |
|---|---|
| Stray `-->` in the body | Component templates + `npx astro check` in CI |
| Empty `alt=""` on two cards | `z.string().min(1)` in the schema |
| No description on `/projects/` | Required `description` prop on `Base.astro` |
| Client name inside the `<h1>` | Separate `client` field rendered outside |
| `.png` where `.webp` belongs | `astro:assets`, never `public/` |

Add to CI:

```yaml
- run: npx astro check          # type + template errors
- run: npm run build
- run: npx linkinator dist --recurse
- run: npx pa11y-ci --sitemap https://yourdomain.com/sitemap-index.xml
```
