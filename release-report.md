# Somna.help Release Report

**Generated:** 2026-07-24 04:22:05 UTC
**Duration:** 91.5s
**Decision:** ❌ RELEASE BLOCKED

---

## Summary

| Metric | Count |
|--------|-------|
| ✅ Passed | 36 |
| ⚠️ Warnings | 2 |
| ❌ Failed | 3 |

---

## Build Status

❌ RELEASE BLOCKED

## Code Quality

- TypeScript: not run
- ESLint: not run
- Prettier: some files need formatting (run `npm run format`)

## Bundle Size

router-CqYYj_3c.js is 1205 KB (threshold 500 KB)

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
node:internal/modules/cjs/loader:1479
  throw err;
  ^

Error: Cannot find module 'D:\WorkSpace\sleep-app-v8\node_modules\tsx\dist\cli.mjs'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1476:15)
    at wrapResolveFilename (node:internal/modules/cjs/loader:1049:27)
    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1073:10)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1094:12)
    at Module._load (node:internal/modules/cjs/loader:1262:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.15.0

- [x] WheelEngine virtual renderer never collapses — slot count and dimensions guarded
- [x] WheelEngine renderer validates translate3d values — translate3d values validated
- [x] WheelEngine debug overlay is dev-only — dev-only debug overlay with toggle and export
- [x] WheelEngine physics lifecycle reports state — physics/gesture/pointer state instrumented



## Remaining Risks

- ⚠️ Prettier (format check): some files need formatting (run `npm run format`)
- ⚠️ Main router chunk under 500 KB: router-CqYYj_3c.js is 1205 KB (threshold 500 KB)

## Blocking Issues

- ❌ TypeScript (tsc --noEmit): Command failed: npx tsc --noEmit
- ❌ ESLint (0 errors): spawnSync C:\WINDOWS\system32\cmd.exe ENOBUFS
- ❌ WheelEngine unit tests pass: Command failed: node node_modules/tsx/dist/cli.mjs --test src/components/time-picker/WheelPhysics.test.ts src/components/time-picker/VirtualWheel.test.ts src/components/time-picker/WheelGesture.test.ts src/components/time-picker/WheelDebug.test.ts src/components/time-picker/WheelRenderer.test.ts
node:internal/modules/cjs/loader:1479
  throw err;
  ^

Error: Cannot find module 'D:\WorkSpace\sleep-app-v8\node_modules\tsx\dist\cli.mjs'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1476:15)
    at wrapResolveFilename (node:internal/modules/cjs/loader:1049:27)
    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1073:10)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1094:12)
    at Module._load (node:internal/modules/cjs/loader:1262:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.15.0


---

## Final Decision

❌ RELEASE BLOCKED
