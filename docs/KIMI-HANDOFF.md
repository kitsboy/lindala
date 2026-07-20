# Kimi Handoff — lindala

## Session — 2026-07-19

**Machine:** M3 (Grok)
**Project:** lindala

**Done:**
- [x] Added thin Satohash API client `lib/satohash.js` (`X-Satohash-Client: lindala`)
- [x] Exports: `stampHash`, `getApiHealth`, `verifyUrl`, `stampGuideUrl`, `sha256Hex`
- [x] Defaults: API `https://api.satohash.io`, site `https://satohash.io`
- [x] Graceful offline (`ok: false`, no throw on network failure); no secrets in repo
- [x] ESM module suitable for future Vite/Node app scaffolding (repo was docs-only)

**Decisions:**
- Plain JS ESM at `lib/satohash.js` because lindala has no package.json/build yet
- Env overrides: `VITE_SATOHASH_*` or `SATOHASH_*` when a runtime appears

**Git State:**
- Branch: main
- See commit after push

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

## Session — 2026-07-20

**Machine:** M3 (Grok)
**Project:** lindala

**Done:**
- [x] Opened both WordPress backup zips (`well-known.zip` full WP core, `et-cache.zip` = wp-content/uploads/themes/plugins — heavy overlap)
- [x] Extracted & curated only real portfolio media (~7MB) into `site/images/`
- [x] Built static cinematic portfolio (no WordPress): `site/index.html` + CSS/JS
- [x] Sections: hero crossfade, Selected Work (AMLT / Wu Assassins / Van Helsing), Vimeo reels, stills strip + lightbox, bio, contact, CV PDF
- [x] Local server: `python3 -m http.server 5173 --directory site` → http://localhost:5173
- [x] `.gitignore` excludes zips + `_wp-extract/`

**Decisions:**
- Kill WordPress/Divi entirely; pure static HTML ready for Cloudflare later
- Keep champagne/gold `#E7E2BC` + Cinzel from original brand
- Do not commit 782MB zips or full WP dump

**Open:**
- Confirm contact email (currently `hello@lindalaconspiracy.com` placeholder-style)
- User may want more stills / IMDB link / agent contact
- Not pushed yet — wait for Cam review

**Git State:**
- Uncommitted: site/, package.json, .gitignore, handoff

---

## Session — 2026-07-20 (cleanup → v1)

**Machine:** M3 (Grok)
**Project:** lindala

**Done:**
- [x] Deleted `et-cache.zip`, `well-known.zip` (~780MB)
- [x] Deleted `_wp-extract/` (~212MB)
- [x] Removed `.DS_Store` junk
- [x] Root `README.md` + fixed `docs/DEPLOYMENT.md` for lindala
- [x] Repo organized as **version 1.0.0** — product lives in `site/`

**Layout (final):**
```
site/     → website
lib/      → satohash helper (future)
docs/     → deploy + handoffs
```

**Git State:**
- Clean working tree pending commit of site + docs (user has not requested push)

---
