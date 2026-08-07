# Deployment & DNS runbook

How this site is wired end-to-end, and how to fix it when something breaks.
See [NOTES.md](NOTES.md) for the pre-launch checklist (placeholders to swap, etc).

---

## Live infrastructure

| Layer | Where | Notes |
|---|---|---|
| Source | [github.com/adrianwongstudio/ak-wong-made](https://github.com/adrianwongstudio/ak-wong-made) | Private repo. Push to `main` triggers deploy. |
| Host | Cloudflare — Workers & Pages | Deployed as a **Worker with static assets** (Cloudflare's current default for new static-site deploys, formerly called "Pages"). Same GitHub integration, same behavior. |
| Worker preview URL | `ak-wong-made.legacy-financial-planning.workers.dev` | Always-on, useful for staging. Not the canonical URL. |
| Custom domain (canonical) | `https://www.akwongmade.com` | Attached to the Worker in Cloudflare → Workers & Pages → ak-wong-made → Domains. |
| Custom domain (redirect) | `https://akwongmade.com` → 301 → `www.` | Handled by Cloudflare Redirect Rule (Rules → Redirect Rules on the `akwongmade.com` zone). |
| Registrar | GoDaddy | Only responsibility here is nameservers. Everything else is on Cloudflare. |
| DNS | Cloudflare | Nameservers: `aldo.ns.cloudflare.com`, `nataly.ns.cloudflare.com` |
| Email | Google Workspace | Uses `hi@akwongmade.com`. MX/TXT records in Cloudflare DNS route mail to Google. |
| Analytics | Cloudflare Web Analytics | Beacon lives in [src/layouts/Base.astro](src/layouts/Base.astro) behind `import.meta.env.PROD`. |

## Deploy cycle

```
git push origin main
   → Cloudflare Workers detects the push
   → Runs `npm run build`
   → Deploys `dist/` to the Worker (~90s)
   → www.akwongmade.com and akwongmade.com now serve the new build
```

Failed builds appear in Cloudflare → Workers & Pages → `ak-wong-made` → **Deployments**. Every commit gets a preview URL like `<commit-hash>.ak-wong-made.legacy-financial-planning.workers.dev`.

## DNS records — current state

All records live in **Cloudflare** (dash.cloudflare.com → `akwongmade.com` → DNS → Records). The nameservers at GoDaddy just point at Cloudflare.

### Site-serving records (managed by Cloudflare Workers — do not hand-edit)

| Type | Name | Value | Purpose |
|---|---|---|---|
| CNAME (or A) | `akwongmade.com` | Points to the Worker | Auto-created when apex was attached to Worker → Domains |
| CNAME (or A) | `www.akwongmade.com` | Points to the Worker | Auto-created when www was attached to Worker → Domains |

If either of these is missing or hand-edited, the site won't resolve. Re-attaching the domain in Workers → Domains recreates them.

### Google Workspace email records — DO NOT DELETE

These are what make `hi@akwongmade.com` and any other addresses on the domain work. Touching any of them breaks email.

| Type | Name | Value | Purpose |
|---|---|---|---|
| MX (priority 1) | `akwongmade.com` | `aspmx.l.google.com` | Primary Google mail server |
| MX (priority 5) | `akwongmade.com` | `alt1.aspmx.l.google.com` | Backup mail server |
| MX (priority 5) | `akwongmade.com` | `alt2.aspmx.l.google.com` | Backup mail server |
| MX (priority 10) | `akwongmade.com` | `alt3.aspmx.l.google.com` | Backup mail server |
| MX (priority 10) | `akwongmade.com` | `alt4.aspmx.l.google.com` | Backup mail server |
| TXT | `akwongmade.com` | `google-site-verification=…` | Domain ownership proof for Google Workspace admin |
| TXT | `akwongmade.com` | `v=spf1 include:…` | SPF — declares which servers can send mail as this domain |
| TXT | `_dmarc.akwongmade.com` | `v=DMARC1; p=quarantine; …` | DMARC — how receiving mail servers handle SPF/DKIM failures |
| TXT | `google._domainkey.akwongmade.com` | `v=DKIM1;k=rsa;p=…` | DKIM — cryptographic sig for outgoing mail |

---

## Troubleshooting playbook

### Site won't load at all (`akwongmade.com` or `www.akwongmade.com`)

Check what the internet actually sees:

```bash
dig +short NS akwongmade.com          # should return aldo.ns.cloudflare.com / nataly.ns.cloudflare.com
dig +short A www.akwongmade.com       # should return Cloudflare IPs
curl -I https://akwongmade.com/       # should return 301 → https://www.akwongmade.com/
curl -I https://www.akwongmade.com/   # should return 200
```

Diagnose by result:

- **Nameservers wrong** → GoDaddy hasn't finished propagation, or was changed away from Cloudflare. Fix at GoDaddy (see Reference #1 below).
- **NS correct but no A record** → domain isn't attached to the Worker as a custom domain. Fix: Cloudflare → Workers & Pages → `ak-wong-made` → Domains → **+ Add Domain** → pick `akwongmade.com`.
- **A record exists but 5xx / 000** → Worker itself is failing. Check Cloudflare → Workers & Pages → `ak-wong-made` → **Deployments** for build errors.

### Email stopped working

You touched an MX or TXT record. Restore from the table above (Google Workspace records section). If the DKIM value was lost, regenerate it from [admin.google.com](https://admin.google.com) → Apps → Google Workspace → Gmail → Authenticate email → generate new DKIM key → paste into Cloudflare DNS.

### Latest push didn't deploy

- Check Cloudflare → Workers & Pages → `ak-wong-made` → **Deployments** — look for a failed build with a red badge
- Click into it → "View build log" — usually a TypeScript error (`npm run check`), a build error (`npm run build`), or Node version mismatch

### The `NODE_VERSION` build env got reset

Symptom: build fails with a Node version error. Fix: Cloudflare → Workers & Pages → `ak-wong-made` → **Settings** → **Variables and Secrets** → make sure `NODE_VERSION` = `22` (or ≥20).

---

## Reference — how to change things

### #1 — Change GoDaddy nameservers

GoDaddy → My Products → `akwongmade.com` → **DNS** → **Nameservers** tab → **Change Nameservers** → *"I'll use my own nameservers"* → paste the two `.ns.cloudflare.com` lines Cloudflare assigned you → **Save**.

**DNSSEC gotcha:** if GoDaddy shows a "DS record" form during the nameserver change, cancel out. Find **DNS → DNSSEC** and **disable** it first. Then retry the nameserver change. Never invent DS record values — wrong values hard-break the domain.

### #2 — Attach a custom domain to the Worker

Cloudflare → Workers & Pages → `ak-wong-made` → **Domains** tab → **+ Add Domain** → pick `akwongmade.com` → enter the subdomain (leave empty for apex, or type `www` for www subdomain) → **Add domain**.

Cloudflare creates the DNS record automatically and issues an SSL cert (~1 min).

### #3 — The `already has externally managed DNS records` error

Happens when you attach a custom domain to the Worker but Cloudflare's DNS zone already has an `A`, `AAAA`, or `CNAME` for that hostname (typically imported from the previous registrar when the domain was added to Cloudflare).

**Fix:** DNS → Records → delete only the conflicting `A` / `AAAA` / `CNAME` rows for that hostname. **Keep all `MX` and `TXT` records** (they're for email — see the Google Workspace table above).

Then retry the Add Domain step.

### #4 — Redirect apex to www

Cloudflare → `akwongmade.com` → **Rules** → **Redirect Rules** → **Create rule**:

- **When incoming requests match** → Field: *Hostname* → Operator: *equals* → Value: `akwongmade.com`
- **Then** → Type: *Static* → URL: `https://www.akwongmade.com${http.request.uri.path}` → Status: **301**

Save. Test: `curl -I https://akwongmade.com/` should return `301` with `location: https://www.akwongmade.com/`.

---

## Log of issues resolved (2026-08-07)

Kept as a reference so we don't re-diagnose the same problem twice.

1. **DNSSEC prompt at GoDaddy blocked the nameserver change.** Cancelled the "Add DS record" flow, disabled DNSSEC under GoDaddy DNS → Advanced Features, then the nameserver change went through cleanly.
2. **Cloudflare imported old GoDaddy A/CNAME records when the domain was added.** These conflicted with the Worker custom-domain attach with the error `already has externally managed DNS records`. Fix was to delete four rows in Cloudflare DNS:
   - `akwongmade.com` A `13.248.243.5` (GoDaddy parking)
   - `akwongmade.com` A `76.223.105.230` (GoDaddy parking)
   - `www.akwongmade.com` CNAME `akwongmade.com` (old www)
   - `_domainconnect.akwongmade.com` CNAME (GoDaddy auto-config helper)
   
   All Google Workspace MX and TXT records were preserved.
3. **Deployed as Worker, not Pages.** Cloudflare quietly changed the default for new static-site deploys — new sites now deploy as "Workers with static assets" instead of Pages. Functionally identical for this project (same GitHub integration, same auto-build on push, same custom-domain flow). No config change needed on our side.
