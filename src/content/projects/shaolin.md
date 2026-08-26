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
blocks:
  - chapterTitle: The problem
    image: /gallery/placeholder-1.svg
    caption: The old site — 2024
    body: >
      A Vancouver kung fu school and lion dance troupe was stuck on a site that was
      expensive to change and hard for staff to update. Copy edits meant emailing a
      developer. Free-trial signups arrived by phone or not at all. The site itself
      was slow, ranked poorly in search, and looked nothing like the school on the mat.

  - chapterTitle: The approach
    image: /gallery/placeholder-2.svg
    caption: Rebuilt on Eleventy — 2025
    body: |
      Rebuild on **Eleventy** with a friendly in-browser CMS (Decap) so non-technical staff
      could edit any page without touching code. Free hosting on GitHub Pages, form submissions
      handled by a Google Apps Script that writes to a Google Sheet and emails staff. OAuth
      for the CMS proxied through a Cloudflare Worker (~90 lines).

      Total ongoing cost: **$0/month**.

  - chapterTitle: What was built
    image: /gallery/placeholder-5.svg
    caption: Booking form — free trial signups
    body: >
      Two conversion forms — free trial signup and lion dance booking enquiry — both post
      to a Google Apps Script Web App that appends a row to Google Sheets and emails the
      school directly. No third-party form vendor, no monthly fee.

  - image: /gallery/placeholder-6.svg
    caption: Filterable gallery with lightbox
    body: >
      A photo gallery with category filters and a click-to-enlarge lightbox. Photos upload
      through the CMS, get tagged, and appear on the site automatically.

  - image: /gallery/placeholder-3.svg
    caption: In-browser CMS at /admin/
    body: |
      The Decap CMS at `/admin/` has schemas for every page section — hero, class schedule,
      pricing, blog posts, gallery photos, team bios. Non-technical staff edit content in a
      familiar form interface. Every save commits to `main` and the site rebuilds in ~90 sec.

  - chapterTitle: The outcome
    image: /gallery/placeholder-4.svg
    caption: Live at shaolinhunggarkungfu.com
    body: >
      The school edits copy, images, and blog posts themselves. Free-trial signups now arrive
      in Google Sheets and staff inboxes automatically. Site loads fast, ranks better in local
      search, and reads like the school looks.
---
