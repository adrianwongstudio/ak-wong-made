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
