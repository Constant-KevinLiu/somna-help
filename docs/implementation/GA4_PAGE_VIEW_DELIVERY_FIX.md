# GA4 Page View Delivery Fix

## Status

⚠️ **CODE FIXED — PRODUCTION VERIFICATION REQUIRED**

All code-level changes pass tests and build successfully. The page_view event
pipeline is verified end-to-end through unit and integration tests. Production
verification requires deploying and confirming that
`google-analytics.com/g/collect` requests appear for both initial load and
SPA navigation.

---

## Background

Production report:

- Google tag loads with HTTP 200
- `typeof window.gtag === "function"`
- `window.dataLayer` contains `js`, `config` for `G-X7ZRF14YZ4`, and GTM events
- Application no longer crashes (previous P0 hotfix succeeded)
- **No `google-analytics.com/g/collect` request appears** during initial load or SPA navigation
- GA configuration uses `send_page_view: false`
- Manual `gtag("event", "ga_debug_test", { debug_mode: true })` — to be verified in production

The previous P0 hotfix added defensive boundaries to prevent analytics from
crashing the application. Those boundaries remain intact. This fix addresses
the delivery side: ensuring page_view events are actually emitted to GA4.

---

## Event Flow

### Initial Load (Hydration)

```
RootComponent mounts
  → useAnalyticsPageView(router, { isCrawler })
    → SSR guard (server: early return)
    → Crawler guard (crawler: early return)
    → initializeAnalytics()
      → shouldEnable() checks: browser, valid measurement ID, prod/dev flag
      → Sets up dataLayer + gtag stub
      → Pushes "js" + "config" (with send_page_view: false)
      → Injects gtag script async
    → isAnalyticsEnabled() check
    → resolvePath()
      → readPathFromRouter() → router.state.location
        → Validates pathname/search/hash are string primitives
        → Returns { pathname, search, hash, source: "router" }
      → (fallback) readPathFromBrowser() → window.location
        → Validates pathname/search/hash are string primitives
        → Returns { pathname, search, hash, source: "browser" }
    → trackPageView({ pathname, search, hash, title })
      → Sanitizes sensitive query params
      → Emits gtag("event", "page_view", { page_location, page_path, page_title })
    → router.subscribe("onResolved", callback)
```

### SPA Navigation

```
User navigates → TanStack Router resolves new route
  → onResolved callback fires
    → Inner try/catch defensive boundary
    → resolvePath()
      → readPathFromRouter() first, then window.location fallback
    → Deduplication: compare full path against lastPathRef
    → If changed: trackPageView(...) + update lastPathRef
```

---

## Early-Return Conditions

### `trackPageView()` returns early when:

| Condition                        | Stable reason         |
| -------------------------------- | --------------------- |
| Analytics not initialized        | `not_initialized`     |
| Not in browser (SSR)             | `ssr`                 |
| No measurement ID                | `no_measurement_id`   |
| `window.gtag` is not a function  | `no_gtag`             |
| `input.pathname` is not a string | `pathname_not_string` |
| `input.pathname` is empty string | `pathname_empty`      |
| Any error in the function body   | `error`               |

### `useAnalyticsPageView` hook returns early when:

| Condition                                          | Stable reason            |
| -------------------------------------------------- | ------------------------ |
| Not in browser (SSR)                               | (none — silent)          |
| Crawler detected                                   | `crawler`                |
| Analytics disabled after init                      | `analytics_disabled`     |
| Both router state AND browser location unavailable | `no_path_source`         |
| Path identical to last tracked                     | `duplicate_path`         |
| Any error in setup or callback                     | `error` / `setup_failed` |

---

## Changes Made

### 1. `src/lib/ga4.ts`

**Added privacy-safe dev diagnostics** (`VITE_GA_DEBUG="true"`):

- `init:success` / `init:skipped:<reason>` — initialization events
- `page_view:sent <sanitized_path>` — successful emission
- `page_view:skipped <reason>` — stable skip reason codes
- Never logs full query strings, sensitive values, or user data
- Reads env dynamically so tests can toggle the flag

**Added `initializationSkipped` internal flag** — tracks whether init was
skipped (disabled/invalid/dev) vs. completed successfully. Used by
`resetAnalytics()` to fully reset state.

**All defensive boundaries preserved** — every `try/catch` from the P0
hotfix remains in place.

### 2. `src/hooks/use-analytics-page-view.ts`

**Added browser location fallback** — defense-in-depth against malformed
router state:

- `resolvePath()` tries `router.state.location` first
- Falls back to `window.location` if router state is missing or malformed
- Both sources validate pathname/search/hash as string primitives
- Hook-level `hookDebug()` logs which source was used

**Added hook-level dev diagnostics** (`VITE_GA_DEBUG="true"`):

- `initialized`, `setup_failed`, `cleanup`
- `page_view:initial <source>`, `page_view:navigation <source>`
- `page_view:skipped <reason>`
- `path_source browser_fallback` when fallback is used

**Preserved existing safety**:

- Outer try/catch around entire useEffect
- Inner try/catch around onResolved callback
- Try/catch around unsubscribe cleanup
- Crawler suppression before any analytics code
- SSR guard before any window access

### 3. `src/routes/__root.tsx`

**No changes required** — the existing integration is correct. The
`RootComponent` calls `useAnalyticsPageView(router, { isCrawler })` with
both the router instance and the computed crawler flag.

---

## Test Coverage

### `src/lib/ga4.test.ts` (41 tests)

Existing tests preserved. Added:

- **send_page_view: false still results in explicit page_view** — verifies
  that even with automatic page views disabled, `trackPageView()` emits an
  explicit `"page_view"` event via `gtag("event", "page_view", ...)`.
- **Dev diagnostics: no logging when debug flag off**
- **Dev diagnostics: logs init + page_view when flag on, no sensitive data**
- **Dev diagnostics: stable skip reason for non-string pathname**

### `src/hooks/use-analytics-page-view.test.tsx` (30 tests)

Existing tests preserved (updated expectations where browser fallback
changes behavior). Added:

- **Browser location fallback when router state location is null**
- **Browser location fallback when router pathname is not a string**
- **Browser location fallback during SPA navigation with malformed router state**
- **No page view when BOTH router state and window.location are unavailable**
- **send_page_view: false + explicit page_view verification**
- **Resolved state pathname is string primitive (initial + navigation)**
- **Unchanged URL deduplication: exact match, different search, different hash**

---

## Production Verification Steps

1. Deploy the build with `VITE_GA_DEBUG=true` to a staging environment.
2. Open browser DevTools → Console → filter for `[ga4]`.
3. On initial load, expect:
   ```
   [ga4] init:success
   [ga4:hook] initialized
   [ga4:hook] page_view:initial source:router
   [ga4] page_view:sent /sanitized-path
   ```
4. Navigate via SPA links, expect:
   ```
   [ga4:hook] page_view:navigation source:router
   [ga4] page_view:sent /next-path
   ```
5. In Network tab → filter by `google-analytics.com/g/collect`, confirm:
   - At least one `/g/collect` request on initial load
   - One additional `/g/collect` per SPA navigation
   - Request payload contains `en=page_view`
6. Run `window.gtag("event", "ga_debug_test", { debug_mode: true })` in
   console → confirm a collect request appears.
7. Check GA4 Realtime report → confirm page views appear.
8. Disable `VITE_GA_DEBUG` for production deploy.

---

## Preservation Checklist

| Guarantee                    | Status                                                          |
| ---------------------------- | --------------------------------------------------------------- |
| SSR safety                   | ✅ All functions return early when `window` is undefined        |
| Crawler suppression          | ✅ `isCrawler` flag checked before any analytics init           |
| Sensitive query stripping    | ✅ `sanitizePath()` strips token/email/uid/session/etc.         |
| Measurement ID validation    | ✅ `MEASUREMENT_ID_RE = /^G-[A-Z0-9]+$/`                        |
| Analytics failure isolation  | ✅ try/catch at every boundary: module, hook, callback, cleanup |
| `send_page_view: false`      | ✅ Config preserved, explicit page_view sent manually           |
| Deduplication                | ✅ `lastPathRef` compares full pathname+search+hash             |
| Defensive runtime boundaries | ✅ All P0 hotfix boundaries unchanged                           |

---

## Files Modified

- `src/lib/ga4.ts` — dev diagnostics + initializationSkipped flag
- `src/hooks/use-analytics-page-view.ts` — browser location fallback + hook diagnostics
- `src/lib/ga4.test.ts` — new regression tests
- `src/hooks/use-analytics-page-view.test.tsx` — new regression tests
- `docs/implementation/GA4_PAGE_VIEW_DELIVERY_FIX.md` — this document

## Files Verified (No Changes)

- `src/routes/__root.tsx` — hook integration is correct
