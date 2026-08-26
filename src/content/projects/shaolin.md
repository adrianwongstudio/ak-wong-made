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
teaser: >
  A Vancouver kung fu school and lion dance troupe had an outdated site — expensive to change,
  hard for staff to update, low conversion on free-trial signups. Rebuilt on Eleventy with an
  in-browser CMS so non-technical staff edit every page themselves. Free hosting, form-to-email
  via Google Sheets, $0/month to run.
sections:
  - title: The problem
    image: /gallery/placeholder-1.svg
    caption: The old site — 2024
    body: >
      A Vancouver kung fu school and lion dance troupe was stuck on a site that was expensive
      to change and hard for staff to update. Copy edits meant emailing a developer.
      Free-trial signups arrived by phone or not at all. The site itself was slow, ranked
      poorly in search, and looked nothing like the school on the mat.

  - title: The approach
    image: /gallery/placeholder-2.svg
    caption: The redesigned home — 2025
    body: |
      Rebuild on **Eleventy** with a friendly in-browser CMS (Decap) so non-technical staff
      could edit any page without touching code. Free hosting on GitHub Pages, form submissions
      handled by a Google Apps Script that writes to a Google Sheet and emails staff. OAuth for
      the CMS proxied through a Cloudflare Worker (~90 lines).

      Total ongoing cost: **$0/month**.

  - title: What was built
    image: /gallery/placeholder-5.svg
    caption: Booking form and CMS
    body: |
      - 8 pages — home, kung fu, lion dance, blog, about, gallery, plus two form pages
      - Paginated blog with category + tag filtering
      - Filterable photo gallery with lightbox
      - Two conversion forms (free trial signup, lion dance booking enquiry)
      - Full CMS at `/admin/` with schemas for every page section
      - Automated deploys on every push to `main`

  - title: The outcome
    image: /gallery/placeholder-4.svg
    caption: Live at shaolinhunggarkungfu.com
    body: >
      The school edits copy, images, and blog posts themselves. Free-trial signups now arrive
      in Google Sheets and staff inboxes automatically. Site loads fast, ranks better in local
      search, and reads like the school looks.
---
