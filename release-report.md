# Somna.help Release Report

**Generated:** 2026-08-10 02:39:53 UTC
**Duration:** 73.0s
**Decision:** ❌ RELEASE BLOCKED

---

## Summary

| Metric | Count |
|--------|-------|
| ✅ Passed | 37 |
| ⚠️ Warnings | 2 |
| ❌ Failed | 2 |

---

## Build Status

❌ RELEASE BLOCKED

## Code Quality

- TypeScript: not run
- ESLint: 17 warnings (acceptable)
- Prettier: some files need formatting (run `npm run format`)

## Bundle Size

router-CrJFYewW.js is 1472 KB (threshold 500 KB)

## Cloudflare

- Build: dist/server/server.js + dist/client/ produced
- Wrangler: config valid, R2 binding present

## SEO

### SEO Checks

- [x] sitemap.xml lists all routes — 184 URLs
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



## WheelEngine Health

### WheelEngine Checks

- [ ] WheelEngine unit tests pass — Command failed: node node_modules/tsx/dist/cli.mjs --test src/components/time-picker/WheelPhysics.test.ts src/components/time-picker/VirtualWheel.test.ts src/components/time-picker/WheelGesture.test.ts src/components/time-picker/WheelDebug.test.ts src/components/time-picker/WheelRenderer.test.ts
- [x] WheelEngine virtual renderer never collapses — slot count and dimensions guarded
- [x] WheelEngine renderer validates translate3d values — translate3d values validated
- [x] WheelEngine debug overlay is dev-only — dev-only debug overlay with toggle and export
- [x] WheelEngine physics lifecycle reports state — physics/gesture/pointer state instrumented



## Remaining Risks

- ⚠️ Prettier (format check): some files need formatting (run `npm run format`)
- ⚠️ Main router chunk under 500 KB: router-CrJFYewW.js is 1472 KB (threshold 500 KB)

## Blocking Issues

- ❌ TypeScript (tsc --noEmit): Command failed: npx tsc --noEmit
- ❌ WheelEngine unit tests pass: Command failed: node node_modules/tsx/dist/cli.mjs --test src/components/time-picker/WheelPhysics.test.ts src/components/time-picker/VirtualWheel.test.ts src/components/time-picker/WheelGesture.test.ts src/components/time-picker/WheelDebug.test.ts src/components/time-picker/WheelRenderer.test.ts

---

## Final Decision

❌ RELEASE BLOCKED
