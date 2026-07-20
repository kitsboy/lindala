# Deployment — lindala

**Project:** Robin William Lindala — cinematographer portfolio  
**GitHub:** https://github.com/kitsboy/lindala (`main`)  
**Local:** `npm start` → http://localhost:5173  
**Web root:** `site/` (static HTML/CSS/JS + images)

## Local

```bash
cd ~/projects/lindala
npm start
# or: python3 -m http.server 5173 --directory site
```

## Cloudflare Pages (when ready)

1. Connect repo `kitsboy/lindala`
2. Build command: *(none)*
3. Output / root directory: `site`
4. Deploy

No secrets required for v1. Optional later: custom domain (e.g. lindalaconspiracy.com).

## Version

**v1** — static portfolio from curated WordPress media. WordPress dump removed from repo.
