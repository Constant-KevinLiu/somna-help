# GA4 Analytics Integration

## Why GA Previously Showed No Data

Google Analytics 4 showed zero data because the Somna production application
did not contain a Google tag (gtag.js). No `<script>` tag referencing
`googletagmanager.com` was present in the SSR HTML or injected client-side,
so no `page_view` events or any other data was ever sent to GA4.

This document describes the production-safe GA4 integration that resolves
the issue.

---

## Environment Variable

### Configuration

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

- **Read via**: `import.meta.env.VITE_GA_MEASUREMENT_ID`
- **Format**: Must match `G-` followed by uppercase letters and digits (e.g. `G-ABC123DEF`)
- **When absent/invalid**: Analytics is completely disabled. No script is injected,
  no network requests are made, no errors are thrown.
- **Production-only by default**: Analytics only loads in production builds.
  To enable in local development (e.g. for testing with GA DebugView), also set:
  ```env
  VITE_GA_ENABLE_IN_DEV=true
  ```

### Setup

1. Copy the variable from `.env.example` to `.env.local` (never commit real IDs).
2. In Cloudflare / deployment, set `VITE_GA_MEASUREMENT_ID` as a build-time
   environment variable (it's embedded in the client bundle by Vite).
3. For local testing with GA DebugView, also set `VITE_GA_ENABLE_IN_DEV=true`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  src/routes/__root.tsx  (RootComponent)                     │
│    ↓ calls on mount                                         │
│  src/hooks/use-analytics-page-view.ts                       │
│    ├─ initializeAnalytics()  (once, browser-only)           │
│    ├─ Initial page_view (after hydration)                   │
│    └─ router.subscribe("onResolved") → page_view per route  │
│         ↓                                                   │
│  src/lib/ga4.ts                                             │
│    ├─ Validates measurement ID format                       │
│    ├─ Injects gtag.js script (async, idempotent)            │
│    ├─ Sets up window.dataLayer + window.gtag                │
│    ├─ trackPageView({ path, title })                        │
│    └─ trackEvent(name, params)                              │
└─────────────────────────────────────────────────────────────┘
```

Key files:

| File | Purpose |
|------|---------|
| `src/lib/ga4.ts` | GA4 module: init, page views, custom events, sanitization |
| `src/hooks/use-analytics-page-view.ts` | React hook: init + router subscription |
| `src/routes/__root.tsx` | Integration point (calls hook in RootComponent) |
| `src/lib/ga4.test.ts` | Unit tests (22 tests, jsdom environment) |

---

## Script Initialization

1. `initializeAnalytics()` is called from `useAnalyticsPageView` on client mount.
2. It validates `VITE_GA_MEASUREMENT_ID` against `^G-[A-Z0-9]+$`.
3. It checks that we're in production mode (or `VITE_GA_ENABLE_IN_DEV=true`).
4. It creates `window.dataLayer` (if not already present) and `window.gtag`.
5. It calls:
   ```js
   gtag("js", new Date());
   gtag("config", measurementId, { send_page_view: false });
   ```
   `send_page_view: false` disables GA4's automatic page-view tracking so the
   app can explicitly send page views on route changes (avoiding duplicates).
6. It injects one async script tag:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXX" data-ga-id="G-XXX">
   ```

Idempotency is guaranteed by the `initialized` flag — calling
`initializeAnalytics()` multiple times has no additional effect.

---

## SPA Page-View Behavior

TanStack Router manages client-side navigation. The integration uses the
official router subscription API:

```ts
router.subscribe("onResolved", () => {
  trackPageView({ path: currentPath, title: document.title });
});
```

### Initial page view

After hydration, the hook fires one page_view for the initial URL. This
represents the first page a user lands on.

### Subsequent route changes

Every successful client-side navigation triggers an `onResolved` event, which
sends a new `page_view` with:

- `page_location`: `window.location.origin + sanitized_path`
- `page_path`: pathname + (sanitized) search + hash
- `page_title`: `document.title`

### Deduplication

The hook compares the current path with the last tracked path. If they are
identical (same pathname + search + hash), no duplicate page view is sent.
This handles edge cases where `onResolved` may fire for same-document
resolves or internal re-resolves.

### What is NOT tracked

- Failed or cancelled navigations (only `onResolved` fires on success).
- Server-side rendered pages — analytics is client-side only.
- Crawler/bot traffic — suppressed via the `isCrawler` flag from `CrawlerContext`.

---

## Privacy Boundaries

GA4 may track **only** privacy-safe navigation metadata. The following are
**never** sent to Google:

| Category | Examples |
|----------|----------|
| Sleep diary data | Bedtime, wake time, sleep efficiency, TST, SOL, WASO |
| Assessment data | Insomnia assessment answers, scores |
| Reflection text | Journal entries, weekly reflections |
| CBT-I responses | Lesson response text, quiz answers |
| Account data | Email address, name, user ID, session tokens |
| Program data | Lesson progress, habit data |
| Sensitive URL params | Tokens, codes, OTP, emails, session IDs |

### URL sanitization

The `sanitizePath()` function strips known-sensitive query parameters before
sending to GA:

- `token`, `code`, `otp`, `email`, `user`, `uid`, `session`,
  `id_token`, `access_token`, `refresh_token`, `state`

Only the pathname, non-sensitive query params, and hash fragment are sent.

---

## Consent Status

### Current state

**No user-facing consent mechanism is implemented.**

The `CookieConsentBanner` component in `src/routes/__root.tsx` is a placeholder
that returns `null`. The privacy policy currently states that only essential
technical cookies are used (no tracking cookies).

### What this means for GA4

Adding GA4 introduces third-party tracking cookies (`_ga`, `_gid`, `_ga_*`).
Under GDPR / ePrivacy, this requires user consent before analytics is loaded.

### How the module is structured for future consent gating

The analytics module is designed so that consent gating can be added with
minimal changes:

1. Move `initializeAnalytics()` from the hook's mount effect to a
   "consent granted" handler.
2. When consent is granted, call `initializeAnalytics()` and then
   `trackPageView()` for the current page.
3. When consent is denied, `initializeAnalytics()` is never called.

No historical page views are backfilled — only views from the moment of
consent onward are sent.

### Follow-up items

- [ ] Implement a real cookie / analytics consent banner.
- [ ] Gate `initializeAnalytics()` on consent (not just measurement ID).
- [ ] Update privacy policy to disclose GA4 usage.
- [ ] Add a cookie preferences page / mechanism to withdraw consent.
- [ ] Consider Google Consent Mode v2 for granular consent signaling.

**IMPORTANT: This integration does NOT make the site GDPR/ePrivacy compliant
by itself. Consent infrastructure is a prerequisite for legal compliance.**

---

## CSP Requirements

### Current state

**No Content-Security-Policy header is currently set.** The site uses HSTS,
X-Content-Type-Options, and Referrer-Policy, but no CSP.

### Required CSP directives for GA4

When CSP is eventually implemented, the following directives are needed
for GA4 to function:

```
script-src:
  https://www.googletagmanager.com

connect-src:
  https://www.google-analytics.com
  https://region1.google-analytics.com

img-src:
  https://www.google-analytics.com
```

(The `img-src` directive is needed because GA4 may use a tracking pixel
fallback in some scenarios.)

### Why we aren't adding CSP now

Adding a full CSP to a site that has never had one carries a risk of
breaking existing functionality (fonts, images, inline styles, etc.).
A CSP rollout should be done as its own project, starting with
`Content-Security-Policy-Report-Only` mode.

This task documents the GA4-specific CSP requirements but does not
introduce a CSP header.

---

## Local Verification

### 1. Set up the measurement ID

```bash
# .env.local
VITE_GA_MEASUREMENT_ID=G-TESTID123
VITE_GA_ENABLE_IN_DEV=true
```

### 2. Start the dev server

```bash
npm run dev
```

### 3. Verify in browser DevTools

**Console:**
```js
> window.dataLayer.length > 0
true
> typeof window.gtag
"function"
```

**Network tab:**
- Filter by `gtag/js` — verify the script loads with 200 status.
- Filter by `collect` — verify a `page_view` request is sent on load
  and again after navigating to a different route.

### 4. GA4 DebugView

1. In GA4, go to **Admin → DebugView**.
2. Load the local dev site with `VITE_GA_ENABLE_IN_DEV=true`.
3. Verify your device appears and `page_view` events stream in as you
   navigate between routes.

---

## Production Verification

### 1. Network tab

Visit `https://somna.help` with DevTools open.

Verify:
- `gtag/js?id=G-...` returns 200 from `www.googletagmanager.com`.
- Filter by `collect` — at least one request to `google-analytics.com`
  appears on initial load.
- Navigate to `/program` — another `collect` request appears.
- Navigate to `/dashboard` — another `collect` request appears.

### 2. Console

```js
// Check that gtag is loaded
typeof window.gtag  // "function"

// Check dataLayer has events
window.dataLayer
// Should include at least:
// - ["js", Date]
// - ["config", "G-XXX", {send_page_view: false}]
// - ["event", "page_view", {...}]
```

### 3. GA4 Realtime

1. Open GA4 → **Reports → Realtime**.
2. Visit the production site.
3. Within ~30 seconds, you should see:
   - Active users: ≥ 1
   - Pages/screens: the page you visited

### 4. GA4 DebugView (optional, for deeper validation)

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   Chrome extension.
2. Enable it on somna.help.
3. In GA4 → **Admin → DebugView**, verify `page_view` events appear
   with correct `page_location`, `page_path`, and `page_title`.

---

## Troubleshooting

### No data in GA4 after deployment

1. **Check the measurement ID**: Verify `VITE_GA_MEASUREMENT_ID` is set as
   a build-time env var and matches `G-XXXXXXXXXX` format.
2. **Check production build**: Verify the built JS contains `G-` string
   (search the `dist/client/assets/` directory).
3. **Check network tab**: Is `gtag/js` loading? Are `collect` requests sent?
4. **Check for ad blockers**: Many ad blockers block Google Analytics by
   default. Test in an incognito window without extensions.
5. **Check GA4 property**: Make sure the Measurement ID matches the GA4
   property and data streams are correctly configured.

### Script fails to load

If `gtag/js` returns 404 or is blocked:
- Confirm the Measurement ID is correct.
- Check for CSP headers blocking `googletagmanager.com`.
- Check for browser extensions or network-level blockers.

### Page views are duplicated

If you see two `page_view` events per navigation:
- Verify `send_page_view: false` is in the config call.
- Check if another analytics integration is also sending page views.

### Only the initial page view fires, not route changes

- Verify the TanStack Router `onResolved` subscription is active.
- Check the browser console for errors.
- Ensure the component using `useAnalyticsPageView` remains mounted
  during navigation (it should be in the root component).

---

## Files

**Created:**
- `src/lib/ga4.ts` — GA4 analytics module
- `src/hooks/use-analytics-page-view.ts` — React hook for router integration
- `src/lib/ga4.test.ts` — Unit tests
- `docs/implementation/GA4_ANALYTICS_INTEGRATION.md` — This document

**Modified:**
- `src/routes/__root.tsx` — Added `useAnalyticsPageView` hook call
- `.env.example` — Added `VITE_GA_MEASUREMENT_ID` and `VITE_GA_ENABLE_IN_DEV`
