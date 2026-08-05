# AK Wong Made — deploy notes

## Before going live

1. **Calendly URL** — `src/pages/contact.astro` uses a placeholder `https://calendly.com/akwongmade/discovery`. Set up the real event type and replace.
2. **Cloudflare Web Analytics token** — `src/layouts/Base.astro` embeds `REPLACE_WITH_CF_ANALYTICS_TOKEN`. Grab the real token from the Cloudflare dashboard → Web Analytics → your site.
3. **Real project imagery** — the gallery uses 6 placeholder SVGs at `public/gallery/`. Replace with real screenshots (same filenames, or update `src/data/gallery.ts`).
4. **`hi@akwongmade.com`** — the mailto lives in `src/components/Footer.astro` and `src/pages/contact.astro`. Point it wherever mail actually lands (or set up email forwarding on Cloudflare).
5. **Real OG image** — `public/og-default.png` is a plain blue wordmark. Refine in Figma when time permits.

## Deploy (Cloudflare Pages)

1. Push repo to GitHub (e.g. `adrianwongstudio/akwongmade`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Env var: `NODE_VERSION=20` (or 22, matches `package.json` engines)
4. First deploy will succeed → project available at `<name>.pages.dev`.
5. Custom domains → Set up → `www.akwongmade.com`. DNS is on Cloudflare, so it wires itself.
6. Redirect Rules: `akwongmade.com/*` → `https://www.akwongmade.com/$1` (301).
7. Web Analytics → Add site → `www.akwongmade.com` → copy token → replace in `Base.astro`, commit, push.

## Local commands

```bash
npm run dev       # dev server at http://localhost:4321
npm run build     # produce dist/
npm run preview   # serve dist/ for smoke-testing the build
npm run check     # astro check (typechecks .astro + collections)
npm test          # vitest run
```
