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
