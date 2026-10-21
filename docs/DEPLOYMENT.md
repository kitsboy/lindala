# Deployment — lindala

**Project:** Robin William Lindala — cinematographer portfolio
**Live:** https://lindalaconspiracy.com
**GitHub:** https://github.com/kitsboy/lindala (`main`)
**Local:** `npm start` → http://localhost:5173
**Web root:** `site/` (static HTML/CSS/JS + images — **no PHP, no WordPress, no build step**)

## Local

```bash
cd ~/projects/lindala
npm start
# or: python3 -m http.server 5173 --directory site
```

## Cloudflare Pages (live)

- Project: `lindala` (account: Give A Bit), https://lindala.pages.dev
- Direct upload from this repo's `site/` directory (no build command):

```bash
wrangler pages deploy site --project-name lindala --branch main
```

- Custom domains: `lindalaconspiracy.com`, `www.lindalaconspiracy.com`
  (www 301-redirects to the apex via a Cloudflare redirect rule)
- DNS zone `lindalaconspiracy.com` lives on Cloudflare
  (`joselyn.ns.cloudflare.com`, `west.ns.cloudflare.com`); GoDaddy is registrar only.

## Email

Cloudflare Email Routing (catch-all → `lindalaconspiracy@gmail.com`).
MX: `route1/2/3.mx.cloudflare.net`. The old EZP mailboxes were retired at cutover —
no mail is handled by the web host.

## Version

**v1** — static portfolio from curated WordPress media. WordPress dump removed from repo.
The legacy WordPress/Divi site (PHP 8.0) was replaced in Oct 2026 to close the PHP
attack surface (CVE-2026-109618 / CVE-2026-109619).
