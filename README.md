# Robin William Lindala — Cinematographer

**Version 1** · Static portfolio · Local now · Cloudflare later

Cinematic, image-first site for Robin Lindala (Director of Photography).  
No WordPress. No PHP. No build step.

## Quick start

```bash
npm start
# → http://localhost:5173
```

Or: `python3 -m http.server 5173 --directory site`

## Layout

```
lindala/
├── site/                 # ← the website (v1)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── images/           # hero, work, stills, posters
│   └── pdf/              # DP resume
├── lib/                  # optional helpers (Satohash client for later)
├── docs/                 # deployment + session handoffs
├── package.json
└── README.md
```

## What’s in v1

| Section | Content |
|--------|---------|
| Hero | Full-bleed stills, name, role |
| Work | *A Million Little Things*, *Wu Assassins*, *Van Helsing* |
| Reels | Vimeo dramatic + action |
| Stills | Horizontal strip + lightbox |
| About | Bio + CV PDF |
| Contact | Email CTA |

## Next (later)

- Confirm contact email / agent / IMDb  
- Design revisions  
- Deploy to Cloudflare Pages (point at `site/`)

## Credits

- Live legacy: [lindalaconspiracy.com](https://lindalaconspiracy.com) (WordPress/Divi — retired)  
- Part of the [Give A Bit](https://giveabit.io) family
