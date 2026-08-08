# GA4 Page View Delivery Fix — Completion Report

**Date:** 2026-08-04
**Verdict:** ⚠️ CODE FIXED — PRODUCTION VERIFICATION REQUIRED

---

## Executive Summary

The GA4 page_view delivery pipeline has been audited, hardened, and verified
through unit/integration tests. The page_view event flow is correct at the
code level: explicit page_view events are emitted via `gtag("event", "page_view", ...)`
both on initial hydration and on every SPA navigation, with proper
deduplication, sanitization, and failure isolation.

Production verification is required to confirm that the browser actually
sends `google-analytics.com/g/collect` requests — which depends on the
runtime gtag script loading successfully and having a valid measurement ID
configured in the environment.

---

## Test Results

### `npm test`

```
 Test Files  38 passed (38)
      Tests  656 passed (656)
   Duration  7.63s
```

All 656 tests pass, including:
- 41 tests in `src/lib/ga4.test.ts` (GA4 module)
- 30 tests in `src/hooks/use-analytics-page-view.test.tsx` (router hook)

### `npm run build`

```
✓ built in 3.64s
```

Production build succeeds with no errors. Pre-existing warnings about
dynamic/static import overlap are unrelated to analytics.

---

## Regression Test Matrix

| Test Case | File | Status |
|---|---|---|
| Initial load page_view | hook test | ✅ |
| SPA navigation page_view | hook test | ✅ |
| Unchanged URL deduplication (exact match) | hook test | ✅ |
| Deduplication: different search = different page | hook test | ✅ |
| Deduplication: different hash = different page | hook test | ✅ |
| Malformed router payload (event object not used) | hook test | ✅ |
| Resolved state pathname is string (initial) | hook test | ✅ |
| Resolved state pathname is string (navigation) | hook test | ✅ |
| Browser-location fallback (router state null) | hook test | ✅ |
| Browser-location fallback (pathname not string) | hook test | ✅ |
| Browser-location fallback during navigation | hook test | ✅ |
| No page view when both sources unavailable | hook test | ✅ |
| Crawler suppression | hook test | ✅ |
| Missing measurement ID disables analytics | ga4 test + hook test | ✅ |
| Event failure does not reach React | ga4 test + hook test | ✅ |
| send_page_view: false → explicit page_view sent | ga4 test + hook test | ✅ |
| Analytics initialized debug log | ga4 test | ✅ |
| page_view attempted debug log | ga4 test | ✅ |
| page_view skipped with stable reason | ga4 test | ✅ |
| No debug logging when flag off | ga4 test | ✅ |
| Sensitive query stripping | ga4 test | ✅ |
| Script injection failure doesn't crash app | ga4 test | ✅ |

---

## Key Findings

### What Works

1. **Initial page view fires** after hydration via the `useAnalyticsPageView`
   hook's `useEffect` body.

2. **SPA navigation page views fire** via `router.subscribe("onResolved")`.

3. **Deduplication** correctly prevents duplicate page_views for the same URL.

4. **Defensive boundaries** at every level prevent analytics failures from
   reaching React error boundaries.

5. **send_page_view: false** is correctly configured — GA's automatic page
   views are disabled, and our explicit `gtag("event", "page_view", ...)`
   calls are the sole source of page_view events.

### What Was Improved

1. **Browser location fallback** — The hook now falls back to
   `window.location` if `router.state.location` is missing or malformed.
   This is defense-in-depth: the router payload object should never be in
   a bad state, but if it is, analytics still works.

2. **Dev diagnostics** — Setting `VITE_GA_DEBUG=true` enables console logs
   with stable reason codes: `init:success`, `init:skipped:<reason>`,
   `page_view:sent`, `page_view:skipped:<reason>`, etc. No sensitive data
   is ever logged. The debug flag is read dynamically so it can be toggled
   in tests or at runtime.

3. **Test coverage** — Added 17 new test cases covering the browser
   location fallback, send_page_view:false verification, deduplication
   edge cases, resolved state pathname validation, and dev diagnostics.

---

## Root Cause Analysis of Missing page_view

Based on code audit, the most likely causes of missing `/g/collect` requests
in production (in order of probability):

1. **The gtag script hasn't finished loading before page_view is emitted.**
   The `gtag` stub queues events in `dataLayer`, but the actual GA script
   loads asynchronously. If the script fails to load (network, ad blocker,
   CSP), events are queued but never sent. The script's `onerror` handler
   is a no-op by design (fail-silent).

2. **Measurement ID mismatch or environment variable not set in production.**
   The production build must have `VITE_GA_MEASUREMENT_ID=G-X7ZRF14YZ4`
   set at build time. If not, analytics silently degrades.

3. **Consent mode or GDPR restrictions.** GA4 may withhold data transmission
   if consent mode is active and consent hasn't been granted. This would
   manifest as no `/g/collect` requests even though gtag is loaded.

The code-level fixes in this change address diagnostic visibility (so any
of the above can be quickly identified) and add a browser-location fallback
(so malformed router state can never be the cause).

---

## Production Verification Checklist

- [ ] Deploy to staging with `VITE_GA_DEBUG=true`
- [ ] Console shows `[ga4] init:success`
- [ ] Console shows `[ga4] page_view:sent /` on initial load
- [ ] Console shows `[ga4] page_view:sent /program` after navigation
- [ ] Network tab shows `google-analytics.com/g/collect` requests
- [ ] GA4 Realtime report shows incoming page views
- [ ] `window.gtag("event", "ga_debug_test", { debug_mode: true })` produces a collect request
- [ ] dataLayer contains explicit `page_view` event entries
- [ ] Deploy to production with `VITE_GA_DEBUG=false` (or unset)
- [ ] Verify no console.log output from analytics in production

---

## Files Changed

| File | Lines | Change Summary |
|---|---|---|
| `src/lib/ga4.ts` | +57 / -3 | Dev diagnostics, initializationSkipped flag |
| `src/hooks/use-analytics-page-view.ts` | +89 / -38 | Browser location fallback, hook diagnostics |
| `src/lib/ga4.test.ts` | +67 / -0 | 4 new test cases |
| `src/hooks/use-analytics-page-view.test.tsx` | +210 / -17 | 13 new test cases |
| `docs/implementation/GA4_PAGE_VIEW_DELIVERY_FIX.md` | new | Technical design document |
| `ga4-page-view-delivery-fix-completion-report.md` | new | This report |

---

## Final Verdict

**⚠️ CODE FIXED — PRODUCTION VERIFICATION REQUIRED**

The page_view delivery pipeline is correct at the code level. All
regression tests pass. The build succeeds. The missing page_view in
production is most likely caused by runtime conditions (script load
failure, environment variable, consent mode) that can only be diagnosed
in a live environment — which is exactly what the new `VITE_GA_DEBUG`
diagnostics are designed to do.

**Next step:** Deploy to staging with `VITE_GA_DEBUG=true` and check
the console and network tab for the diagnostic signals listed above.
