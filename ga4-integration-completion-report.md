# GA4 Integration Completion Report

## 1. Final Verdict

⚠️ **GA4 INTEGRATION COMPLETE — DEPLOYMENT VERIFICATION REQUIRED**

All code changes are implemented, tested, type-checked, and built successfully.
The production build exits 0. The measurement ID is not hardcoded — it must be
configured via the `VITE_GA_MEASUREMENT_ID` environment variable at build time.
Real GA4 data cannot be verified from this development environment; post-deploy
verification steps are provided in section 20.

---

## 2. Root Cause

GA4 showed no data because the production application contained **no Google
tag at all**. There was no `<script>` reference to `googletagmanager.com`,
no `window.dataLayer`, no `window.gtag`, and no `page_view` events being sent.

This was confirmed by a full-text search of `src/` for `gtag`,
`googletagmanager`, `google-analytics`, `analytics` (in the product-analytics
sense), `page_view`, and `dataLayer` — zero matches for Google Analytics
infrastructure.

---

## 3. Existing Architecture Inspected

| Area | Finding |
|------|---------|
| **TanStack Router** | v1.168.x with `useRouter()` and `router.subscribe("onResolved", fn)` API available |
| **Root component** | `src/routes/__root.tsx` with `RootShell` (html/head/body) and `RootComponent` (providers + layout) |
| **SSR** | Cloudflare Workers via TanStack Start, custom `src/server.ts` entry |
| **Existing analytics** | `src/lib/analytics/` is all sleep-domain computation (not product analytics). `src/lib/share-analytics.ts` is localStorage-only. No GA/gtag code exists. |
| **Consent** | `CookieConsentBanner` placeholder exists but returns `null`. No real consent mechanism. |
| **CSP** | **No CSP header configured.** Only HSTS, X-Content-Type-Options, and Referrer-Policy. |
| **Env vars** | `import.meta.env.VITE_*` for client-side. `.env.example` committed, `.env.local` gitignored. |
| **Tests** | Vitest with jsdom for component tests, node for logic tests. 547 pre-existing tests. |
| **Crawler detection** | `CrawlerContext` with `isCrawler` flag already suppresses UI for bots. |

---

## 4. Files Created

| File | Purpose |
|------|---------|
| `src/lib/ga4.ts` | GA4 analytics module: initialization, page view tracking, custom events, URL sanitization, SSR safety |
| `src/hooks/use-analytics-page-view.ts` | React hook: initializes GA4 on mount, subscribes to TanStack Router `onResolved` for SPA page views, deduplicates identical paths |
| `src/lib/ga4.test.ts` | 22 unit tests in jsdom environment covering disabled states, valid ID behavior, idempotency, page_view payload, URL sanitization, blocked-script resilience, reset, production-only loading |
| `docs/implementation/GA4_ANALYTICS_INTEGRATION.md` | Full architecture and operations documentation |

---

## 5. Files Modified

| File | Change |
|------|--------|
| `src/routes/__root.tsx` | Added import of `useAnalyticsPageView` and one hook call in `RootComponent`, passing `isCrawler` flag |
| `.env.example` | Added `VITE_GA_MEASUREMENT_ID` and `VITE_GA_ENABLE_IN_DEV` with documentation comments |

---

## 6. Measurement-ID Configuration

- **Variable**: `VITE_GA_MEASUREMENT_ID`
- **Format validation**: `^G-[A-Z0-9]+$` (regex-checked at runtime)
- **When absent**: Analytics completely disabled — no script injected, no network requests
- **When invalid**: Same as absent — disabled without errors
- **Production-only**: Only loads in production builds by default
- **Dev override**: `VITE_GA_ENABLE_IN_DEV=true` enables in development for testing
- **Not hardcoded**: ID is never in source control; set at build time

---

## 7. Script-Loading Behavior

1. `initializeAnalytics()` is called client-side from `useAnalyticsPageView` hook
2. Validates measurement ID and environment
3. Creates `window.dataLayer` and `window.gtag` stub (queues events early)
4. Calls `gtag("js", new Date())` and `gtag("config", id, { send_page_view: false })`
5. Injects **one** async `<script>` tag pointing to `https://www.googletagmanager.com/gtag/js?id=G-XXX`
6. Script is marked with `data-ga-id` for idempotency checks
7. Script failure (CSP, ad blocker, network error) is silently caught — app continues normally

Idempotency: calling `initializeAnalytics()` multiple times has no additional effect.
SSR safety: function is a no-op when `typeof window === "undefined"`.

---

## 8. Initial Page-View Behavior

After hydration, the `useAnalyticsPageView` hook fires exactly one `page_view`
event for the initial URL:

```js
gtag("event", "page_view", {
  page_location: window.location.origin + sanitizedPath,
  page_path: sanitizedPath,
  page_title: document.title,
})
```

This happens after:
- Browser environment is confirmed
- Measurement ID is validated
- Analytics is not disabled (production mode or dev override)
- User is not a crawler

GA4's automatic page_view is disabled via `send_page_view: false` to avoid
duplicate initial page views.

---

## 9. SPA Route-View Behavior

Uses TanStack Router's official `router.subscribe("onResolved", fn)` API:

- Fires on every **successful** client-side navigation
- Only fires after the route has fully loaded and resolved
- Does not fire for failed/cancelled navigations
- Deduplicates: if the resolved path is identical to the last tracked path,
  the page_view is skipped (handles edge cases with same-document resolves)
- Each page_view includes `page_location`, `page_path`, and `page_title`
- Path includes pathname + (sanitized) search + hash
- Subscription is cleaned up on unmount

---

## 10. SSR Safety

| Mechanism | Purpose |
|-----------|---------|
| `typeof window === "undefined"` guard in `initializeAnalytics()` | Prevents any analytics code from running during SSR |
| `typeof window === "undefined"` guard in hook `useEffect` | Hook body is a no-op on server |
| `send_page_view: false` in GA config | Ensures GA4's automatic page_view doesn't double-fire |
| `isCrawler` flag from `CrawlerContext` | Suppresses analytics for search engine bots and AI scrapers |
| `useEffect` placement in `RootComponent` | Only runs after client hydration, never during server render |

No analytics script tag appears in the SSR HTML response.

---

## 11. Privacy Boundaries

**GA4 tracks only:**
- Page path (sanitized)
- Page URL (origin + sanitized path)
- Page title

**Never sent to Google:**
- Sleep diary entries, bedtime, wake time, sleep efficiency
- Insomnia assessment answers or scores
- Reflection text, CBT-I lesson response text
- Email address, name, user ID, tokens
- Program storage payloads, D1 records
- Sensitive query parameters (stripped by `sanitizePath()`)

**URL sanitization** strips query params matching: `token`, `code`, `otp`,
`email`, `user`, `uid`, `session`, `id_token`, `access_token`,
`refresh_token`, `state`.

---

## 12. Consent Status

**No consent mechanism is implemented.** The `CookieConsentBanner` component
is a placeholder that returns `null`.

The analytics module is structured so that consent gating can be added later:
- `initializeAnalytics()` is the single entry point for enabling analytics
- Moving it from "mount" to "consent granted" is a one-line change
- No historical page views are backfilled
- `isAnalyticsEnabled()` provides a clean status check

**This integration does NOT constitute GDPR/ePrivacy compliance.** Consent
infrastructure is a prerequisite for legal compliance and is listed as
remaining debt.

---

## 13. CSP Result

**Current state: No CSP header is configured.**

The application currently sets only:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Required CSP directives for GA4** (documented for future CSP rollout):

```
script-src:  https://www.googletagmanager.com
connect-src: https://www.google-analytics.com https://region1.google-analytics.com
img-src:     https://www.google-analytics.com
```

CSP was NOT added in this task because:
1. The site has never had a CSP; adding one risks breaking existing functionality
2. A proper CSP rollout should start with `Content-Security-Policy-Report-Only`
3. Per requirements: "do not introduce a broad CSP rewrite in this task"

---

## 14. Tests Added

22 unit tests in `src/lib/ga4.test.ts` (jsdom environment):

### Disabled states (6 tests)
- Absent measurement ID: no throw, `isAnalyticsEnabled()` false, no script, no-op trackPageView, no-op trackEvent
- Invalid format: disabled without throwing
- Rejects lowercase `g-` prefix
- Rejects empty `G-` prefix

### Valid ID (14 tests)
- Creates dataLayer and gtag function
- Injects exactly one gtag script with correct src and async attribute
- Idempotent initialization (second call does nothing)
- Config has `send_page_view: false`
- trackPageView sends page_view with location, path, and title
- trackPageView uses document.title when title not provided
- trackPageView sanitizes sensitive query parameters
- trackPageView preserves hash fragments
- trackEvent sends custom event with parameters
- trackEvent works without parameters
- Blocked script (CSP-style) does not crash app
- resetAnalytics clears state and removes script
- After reset, initializeAnalytics works again

### Production-only behavior (1 test)
- Disabled in dev mode when VITE_GA_ENABLE_IN_DEV is not set

### Framework verification (1 test)
- All 22 tests pass with jsdom environment

---

## 15. Test Result

```
Test Files  34 passed (34)
     Tests  569 passed (569)
```

All pre-existing tests continue to pass. No regressions.

---

## 16. TypeScript Result

**GA4-related files: 0 TypeScript errors**

```
src/lib/ga4.ts           — clean
src/hooks/use-analytics-page-view.ts — clean
src/routes/__root.tsx    — clean
```

Full project TypeScript check (`typecheck:app`) has pre-existing errors in
unrelated files (AuthModal, diary components, Header, server.ts, sync services).
These are not introduced by this change and are documented as pre-existing.

---

## 17. Lint Result

**GA4-related files: 0 lint errors, 0 warnings**

```
src/lib/ga4.ts                        — clean
src/hooks/use-analytics-page-view.ts  — clean
src/lib/ga4.test.ts                   — clean
```

All prettier formatting issues resolved. React hooks rules satisfied.

---

## 18. Build Result

```
✓ built in 4.23s
```

Production build exits 0. Both client and server bundles are generated
successfully.

---

## 19. Deployment Variables Required

| Variable | Required | Purpose | Where to set |
|----------|----------|---------|--------------|
| `VITE_GA_MEASUREMENT_ID` | Yes | GA4 Measurement ID (format: `G-XXXXXXXXXX`) | Build-time environment variable (Cloudflare Pages, CI, or `.env.local`) |
| `VITE_GA_ENABLE_IN_DEV` | No | Set to `true` to enable analytics in dev mode (default: `false`) | `.env.local` only |

**Important:** Set `VITE_GA_MEASUREMENT_ID` as a **build-time** variable, not
a runtime Worker variable. Vite embeds `import.meta.env.VITE_*` values into
the client bundle at build time.

For Cloudflare Pages / similar: set it in the project's environment variables
under "Build & deploy" settings.

---

## 20. Manual Production Verification

### Browser Network Tab

1. Visit `https://somna.help` with DevTools open → Network tab
2. Filter by `gtag/js` — verify script loads from `www.googletagmanager.com` with 200 status
3. Filter by `collect` — verify at least one request to `google-analytics.com` on initial load
4. Navigate to `/program` — another `collect` request should appear
5. Navigate to `/dashboard` — another `collect` request should appear

### Browser Console

```js
typeof window.gtag       // "function"
window.dataLayer.length  // > 0
// Inspect: window.dataLayer has "js", "config", and "event" entries
```

### GA4 Realtime Report

1. Open GA4 → Reports → Realtime
2. Visit the production site
3. Within ~30 seconds: Active users ≥ 1, pages/screens shows visited page

### GA4 DebugView (deeper validation)

1. Install Google Analytics Debugger Chrome extension
2. Enable on somna.help
3. GA4 → Admin → DebugView
4. Verify `page_view` events with correct `page_location`, `page_path`, `page_title`
5. Navigate between routes — each navigation produces one `page_view`

---

## 21. Remaining Debt

| Priority | Item |
|----------|------|
| **High** | Implement cookie / analytics consent banner and gate `initializeAnalytics()` on consent (required for GDPR/ePrivacy compliance) |
| **High** | Update privacy policy to disclose GA4 usage and third-party cookies |
| **Medium** | Implement Content-Security-Policy (start with report-only mode) including GA4 directives |
| **Medium** | Add cookie preferences / consent-withdrawal mechanism |
| **Low** | Consider Google Consent Mode v2 for granular consent signaling |
| **Low** | Add custom events (e.g. `share_open`, `program_start`) once consent is in place |
| **Low** | Add GA4 debug_mode flag for easier production debugging |
