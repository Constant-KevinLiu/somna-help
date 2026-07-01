# Somna.help Release Report

**Generated:** 2026-07-01 15:26:41 UTC
**Duration:** 46.3s
**Decision:** ✅ READY FOR PRODUCTION

---

## Summary

| Metric | Count |
|--------|-------|
| ✅ Passed | 23 |
| ⚠️ Warnings | 0 |
| ❌ Failed | 0 |

---

## Build Status

✅ READY FOR PRODUCTION

## Code Quality

- TypeScript: 0 errors
- ESLint: 17 warnings (acceptable)
- Prettier: all files formatted

## Bundle Size

largest chunk: router-BlLUbsC1.js (392 KB)

## Cloudflare

- Build: dist/server/server.js + dist/client/ produced
- Wrangler: config valid, R2 binding present

## SEO

### SEO Checks

- [x] sitemap.xml lists all routes — 47 URLs
- [x] robots.txt allows crawling + references sitemap — valid
- [x] OG image file exists — public/og-cover.jpg
- [x] No localhost URLs in source — clean
- [x] Canonical URL present in root layout — present
- [x] JSON-LD structured data present — Article JSON-LD in lessons



## i18n

### i18n Checks

- [x] All i18n modules have 3 language dicts — 6 modules × 3 langs
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

None identified in automated checks.


---

## Final Decision

✅ READY FOR PRODUCTION
