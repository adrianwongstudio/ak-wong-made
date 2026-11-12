---
title: Pausecard
year: 2026
client: Pausecard (own product)
services: [Web App]
stack: [Next.js, Supabase, Drizzle, Stripe, Cloudflare]
featured: false
hasCaseStudy: true
order: 2
teaser: >
  A subscription-control app: make a virtual card per subscription, pause it when you want
  to stop paying. Freemium SaaS billed through Stripe in Canadian dollars, with plan gates
  on active cards.
blocks:
  - chapterTitle: Pricing
    body: |
      Three tiers, billed monthly in CAD, cancel any time. Free forever, and the paid tiers
      raise the card limit.

      | Plan | Price | Active cards | Includes |
      | --- | --- | --- | --- |
      | **Free** | $0 forever | 12 | Subscription, free trial and single-use cards; email alerts for blocked charges |
      | **Plus** | $4 CAD / month | 50 | Category budgets and Everywhere cards; daily, monthly and yearly caps |
      | **Pro** | $9 CAD / month | 300 | Everything in Plus, the highest card limit |

      If someone moves to a smaller plan, their existing cards keep working.

  - chapterTitle: How billing works
    body: >
      Stripe handles checkout and subscriptions, with a webhook updating each user's plan.
      Plan limits live in one entitlements module that the card-creation gate checks, so
      the homepage pricing and the enforced limits come from the same source.
---
