# GA4 Canonical gtag Command Queue Hotfix

**Date:** 2026-08-09
**Severity:** P0 — production GA4 silently fails to deliver any hits
**Status:** Verified in unit/integration tests — requires production deployment to confirm delivery

---

## Summary

The GA4 integration was silently failing in production because the custom gtag
stub pushed **plain Arrays** onto `dataLayer` instead of the canonical
**`arguments` / IArguments** objects that Google's gtag.js runtime expects.

The loaded Google runtime iterates `dataLayer` and processes each entry as an
IArguments-like object. When entries are plain Arrays, the runtime silently
skips them — commands queue forever, no `/g/collect` requests fire, the `_ga`
cookie is never set, and `gtag('get', ...)` callbacks never fire.

This is a one-line fix (replace `dataLayer.push(args)` with
`dataLayer.push(arguments)`) with comprehensive regression tests to prevent
silent reintroduction.

---

## Root Cause

### The bug

In `src/lib/ga4.ts`, the gtag stub was defined as:

```ts
function gtag(...args: unknown[]): void {
  window.dataLayer!.push(args);
}
```

This uses JavaScript rest parameters (`...args`), which converts the function's
arguments into a **plain Array**. That Array is then pushed onto `dataLayer`.

### Why it matters

Google's canonical gtag snippet uses:

```js
function gtag() {
  dataLayer.push(arguments);
}
```

The `arguments` object is an **IArguments** object — it has numeric indices and
`.length` like an array, but it is NOT a `Array.isArray()` true value.

The real gtag.js runtime (loaded from `googletagmanager.com/gtag/js`) processes
`dataLayer` entries by treating each one as an IArguments-like command object.
When entries are plain Arrays, the runtime's internal processing does not match
its expected command shape, and the commands are silently ignored.

### Production evidence confirming this

All of these were observed on `https://somna.help`:

1. `gtag.js` loads successfully (HTTP 200)
2. There is exactly one Google script tag
3. `google_tag_manager["G-X7ZRF14YZ4"]` exists with `dataLayer`, `bootstrap`, `callback`
4. `window.dataLayer` contains queued commands: `["js", ...]`, `["config", ...]`, `["event", "page_view", ...]`
5. **No `/g/collect` request is ever generated**
6. **No `_ga` cookie is ever created**
7. **`gtag('get', 'G-X7ZRF14YZ4', 'client_id', callback)` never invokes the callback**
8. Direct `navigator.sendBeacon()` to `google-analytics.com/g/collect` works (network is healthy)

This pattern — commands queued, script loaded, runtime present, but zero
transport — is exactly what happens when the dataLayer command shape is wrong.

---

## The Fix

### Core change

Replace the rest-parameter Array push with canonical `arguments` push:

```ts
function gtag(..._args: unknown[]): void {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer!.push(arguments);
}

window.gtag = gtag;
```

The rest parameter `..._args` exists **only for TypeScript's type system** — it
lets TypeScript verify call sites and provide type checking. At runtime, the
native `arguments` object (IArguments) is what gets pushed onto `dataLayer`.

This is semantically identical to Google's canonical snippet while remaining
fully type-safe.

### Diagnostic fix

Renamed `page_view:sent` → `page_view:queued` in debug diagnostics, since
"sent" implied transport confirmation that we don't actually have. The log
only proves the command was queued to `dataLayer`.

---

## Initialization Lifecycle

### Before (broken)

```
dataLayer created (plain Array)
→ gtag stub installed that pushes plain Arrays
→ js command queued (plain Array — runtime will ignore it)
→ config command queued (plain Array — runtime will ignore it)
→ async gtag.js loads
→ Google runtime boots
→ runtime inspects dataLayer
→ ❌ entries are plain Arrays, not IArguments — silently skipped
→ page_view event queued (also plain Array — skipped)
→ result: zero hits delivered
```

### After (fixed)

```
dataLayer created (plain Array — this is fine, it's the queue container)
→ gtag stub installed that pushes IArguments objects
→ js command queued (IArguments — runtime will consume it)
→ config command queued (IArguments — runtime will consume it)
→ async gtag.js loads
→ Google runtime boots
→ runtime inspects dataLayer
→ ✅ entries are IArguments-shaped — processed normally
→ GA initializes, creates _ga cookie, client_id becomes available
→ page_view event queued (IArguments — processed normally)
→ result: /g/collect request fires, hit delivered
```

**No ordering changes were made.** The queue-before-load pattern is correct and
intentional — that's how gtag.js is designed to work.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/ga4.ts` | Replaced `dataLayer.push(args)` with `dataLayer.push(arguments)` for canonical IArguments command shape; renamed `page_view:sent` → `page_view:queued` debug diagnostic |
| `src/lib/ga4.test.ts` | Updated dataLayer entry access to work with IArguments objects; added 10 new canonical command queue tests (Tests A–I + regression guard) |

**No changes to:**
- `src/hooks/use-analytics-page-view.ts` — all existing protections intact
- `src/routes/__root.tsx` — crawler suppression, initialization pattern intact

---

## Tests Added

All tests are in `src/lib/ga4.test.ts` under the
`canonical gtag command queue shape` describe block.

### Test A — Canonical command object shape
Verifies queued commands are IArguments objects (`Array.isArray()` returns
false), not plain Arrays. This test would fail against the old implementation.

### Test B — Command contents
Verifies `js` command contains a `Date` and `config` command contains
`send_page_view: false`.

### Test C — Explicit page_view
Verifies `event page_view` is queued with `page_location`, `page_path`, and
`page_title` parameters.

### Test D — get callback compatibility
Verifies `gtag('get', id, 'client_id', callback)` uses the same canonical
IArguments command shape.

### Test E — Idempotency
Calling `initializeAnalytics()` multiple times injects exactly one script and
queues initialization commands exactly once.

### Test F — Script blocked resilience
Script load failure (ad blocker, CSP) must not throw into the application.

### Test G — SSR safety
No `window`/`document` side effects when analytics is disabled / SSR context.

### Test H — Analytics disabled
Invalid/missing measurement ID is a safe no-op with zero side effects.

### Test I — Browser-level integration
Simulates a gtag.js-style consumer that iterates dataLayer entries by numeric
index (as the real runtime does) and verifies all commands are fully readable
and correctly structured.

### Regression guard
Explicit test that verifies `Array.isArray(entry) === false` for every
dataLayer entry, preventing silent reintroduction of the plain-Array bug.

---

## Validation Results

### Tests
```
Test Files:  38 passed (38)
Tests:       666 passed (666)
Duration:    12.98s
```

All 51 GA4 module tests pass, including all 10 new canonical command queue
tests.

### TypeScript
```
GA4-related files:  0 errors
Pre-existing debt:  many (unrelated — locale, diary, sync, Header, etc.)
```

No new TypeScript errors introduced by this change.

### Build
```
Exit code:  0
Status:     Success (pre-existing chunk-size warnings only)
```

---

## Production Verification Checklist

After deployment to `https://somna.help`, verify the following in browser
DevTools:

### A. Command representation
```js
window.dataLayer
```
Inspect the first few entries. They should be **IArguments objects**, not plain
Arrays. In Chrome DevTools, they appear as `Arguments(2) ['js', ...]` or similar
—not `Array(2)`.

### B. Cookie
```js
document.cookie.split(';').filter(x => x.includes('_ga'))
```
Expected: `_ga` cookie present after GA initializes (subject to browser/privacy
policy).

### C. Client ID
```js
gtag('get', 'G-X7ZRF14YZ4', 'client_id', console.log)
```
Expected: callback receives a client ID string.

### D. Session ID
```js
gtag('get', 'G-X7ZRF14YZ4', 'session_id', console.log)
```
Expected: callback receives a session ID where applicable.

### E. Collector request
Network → All → filter: `collect`

Expected: `google-analytics.com/g/collect` request (or regional equivalent).

### F. Response
Expected collector HTTP response: **204 No Content**.

### G. GA4 Realtime
GA4 property Realtime report should show the test visit/page_view after
transport succeeds.

---

## Why This Was Hard to Catch

1. **Silent failure** — the Google runtime doesn't throw errors or log warnings
   when dataLayer entries are in the wrong shape. It just skips them.

2. **Surface-level checks pass** — `window.gtag` is a function,
   `window.dataLayer` has entries, `gtag.js` loads, `google_tag_manager`
   object exists. Everything *looks* working.

3. **Common pattern in tutorials** — many TypeScript GA4 tutorials use rest
   parameters (`...args`) because they're "more modern" and type-safe. They
   accidentally change the runtime behavior without realizing it.

4. **Transport is hard to verify in tests** — you can't confirm `/g/collect`
   actually fires without a real browser + network. Unit tests only verify
   queuing, not delivery.

---

## Related Documentation

- [GA4 Page View Delivery Fix](GA4_PAGE_VIEW_DELIVERY_FIX.md) — previous investigation that narrowed to this root cause
- [GA4 Analytics Integration](GA4_ANALYTICS_INTEGRATION.md) — original GA4 integration design
- [GA4 Router Crash and Auth Lookup Hotfix](GA4_ROUTER_CRASH_AND_AUTH_LOOKUP_HOTFIX.md) — prior P0 analytics fixes
