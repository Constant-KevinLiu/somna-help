# Somna.help Release Report

**Generated:** 2026-07-07 14:21:41 UTC
**Duration:** 99.7s
**Decision:** ❌ RELEASE BLOCKED

---

## Summary

| Metric | Count |
|--------|-------|
| ✅ Passed | 18 |
| ⚠️ Warnings | 2 |
| ❌ Failed | 3 |

---

## Build Status

❌ RELEASE BLOCKED

## Code Quality

- TypeScript: 0 errors
- ESLint: not run
- Prettier: some files need formatting (run `npm run format`)

## Bundle Size

router-BcCVOcV8.js is 957 KB (threshold 500 KB)

## Cloudflare

- Build: dist/server/server.js + dist/client/ produced
- Wrangler: —

## SEO

### SEO Checks

- [ ] sitemap.xml lists all routes — program week 1 missing
- [x] robots.txt allows crawling + references sitemap — valid
- [x] OG image file exists — public/og-cover.jpg
- [x] No localhost URLs in source — clean
- [x] Canonical URL present in root layout — present
- [x] JSON-LD structured data present — Article JSON-LD in lessons



## i18n

### i18n Checks

- [x] All i18n modules have active language dicts — 6 modules × 4 langs
- [x] No mixed-language strings in main i18n dict — en dict clean of CJK
- [x] Fallback mechanism present — falls back to en



## Security

### Security Checks

- [x] No dangerous innerHTML in components — no dangerouslySetInnerHTML (ui/ primitives excluded)
- [x] R2 upload validates file format + size — PNG format + 5MB size limit
- [x] Share URLs use HTTPS + encodeURIComponent — URLs encoded



## Data Integrity

### Data Integrity Checks

- [x] Single SleepRecord source (one SLEEP_RECORDS_KEY) — one canonical key
- [x] loadRecords validates every field — full field validation
- [x] Dashboard uses cbti-brain recommendation engine — sleepWindow() from cbti-brain.ts



## Remaining Risks

- ⚠️ Prettier (format check): some files need formatting (run `npm run format`)
- ⚠️ Main router chunk under 500 KB: router-BcCVOcV8.js is 957 KB (threshold 500 KB)

## Blocking Issues

- ❌ ESLint (0 errors): Command failed: npx eslint .
- ❌ Wrangler Dry Run: spawnSync C:\WINDOWS\system32\cmd.exe ENOBUFS
- ❌ sitemap.xml lists all routes: program week 1 missing

---

## Final Decision

❌ RELEASE BLOCKED
