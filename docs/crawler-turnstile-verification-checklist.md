# Crawler & Turnstile Fix Verification Checklist

> Use this checklist after deploying tasks 1–4 to confirm that search-engine
> crawlers can access every locale without hitting Turnstile challenges, while
> real visitors still see the required privacy and security UI.

---

## ① Cloudflare Security — 3 alerts cleared

- [ ] **WAF events for Googlebot = 0**
  - Cloudflare Dashboard → Security → Events → filter by `User-Agent contains Googlebot`.
  - Expected: no blocked / challenged requests in the last 7 days.
- [ ] **Rate limiting skipped for crawlers**
  - Dashboard → Security → WAF → Rate limiting rules → verify a rule exists that
    skips rate limiting for `http.user_agent contains "Googlebot"`.
- [ ] **Turnstile verified-bot exemption enabled**
  - Dashboard → Turnstile → Site settings → "Verified bots" / "Bot Management"
    allowlist is enabled so Googlebot never sees a challenge.

---

## ② GSC crawl for `/pl`, `/es`, `/pt` pages — no 403, no challenge

- [ ] Google Search Console → URL Inspection → `/pl/program`
  - Status: **URL is on Google** or **Page indexing**
  - Crawl status: **200 OK**
  - No "Blocked due to access denied" or "Soft 403".
- [ ] Google Search Console → URL Inspection → `/es/program`
  - Same 200 OK result.
- [ ] Google Search Console → URL Inspection → `/pt/program`
  - Same 200 OK result.
- [ ] Live test with Googlebot UA:
  ```bash
  curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
       -I https://somna.help/es/program
  ```
  - Expected: `HTTP/2 200`, no `cf-mitigated` / `cf-challenge` headers.
- [ ] GSC Crawl Stats show 403/503 errors trending to zero for these locales.

---

## ③ TypeScript & build health

- [ ] `npm run typecheck` (tsc --noEmit) passes with no errors.
- [ ] `npm run lint:check` (eslint --max-warnings 0) passes with no warnings.
- [ ] `npm run build` completes successfully:
  - Client build finishes.
  - Server build finishes.
  - Output contains `dist/client/` and `dist/server/`.
- [ ] `npm run wrangler:dry-run` validates `wrangler.jsonc` and Worker entry.

---

## ④ Human visitor — popups and verification still work

- [ ] Open the site in a normal browser with a standard UA.
- [ ] Cookie consent banner (placeholder `CookieConsentBanner` in `__root.tsx`)
  renders when implemented.
- [ ] Turnstile widget renders when `PUBLIC_TURNSTILE_SITE_KEY` is configured.
- [ ] Language preference redirect still works:
  - Visit `/`, switch to Español → URL changes to `/es`.
  - Visit `/es`, switch to English → URL changes to `/`.
- [ ] No runtime console errors related to `@marsidev/react-turnstile`.

---

## ⑤ Crawler page output — full HTML, 4 hreflangs, independent locale meta

For each locale page (`/pl/program`, `/es/program`, `/pt/program`) verify the
server-rendered HTML (view-source):

- [ ] `<html lang="pl">` / `<html lang="es">` / `<html lang="pt">` is present.
- [ ] `<title>` and `<meta name="description">` are in the correct language.
- [ ] Canonical link points to the current locale:
  - `/pl/program` → `<link rel="canonical" href="https://somna.help/pl/program">`
  - `/es/program` → `<link rel="canonical" href="https://somna.help/es/program">`
  - `/pt/program` → `<link rel="canonical" href="https://somna.help/pt/program">`
- [ ] All 4 language alternates are present:
  - `<link rel="alternate" hreflang="en" href="https://somna.help/program">`
  - `<link rel="alternate" hreflang="es" href="https://somna.help/es/program">`
  - `<link rel="alternate" hreflang="pt" href="https://somna.help/pt/program">`
  - `<link rel="alternate" hreflang="pl" href="https://somna.help/pl/program">`
  - `<link rel="alternate" hreflang="x-default" href="https://somna.help/program">`
- [ ] No Turnstile markup in the source:
  - No `<iframe>` from `challenges.cloudflare.com`.
  - No `<script src="...turnstile...">`.
  - No element with `id="cf-turnstile"`.
- [ ] No cookie consent banner markup in the source.
- [ ] Course lesson body text is fully rendered in the HTML (not only after JS).

---

## Quick automated smoke test

Run the following after deployment to assert crawler behavior:

```bash
# Should return 200 with no challenge headers
for path in / /es/program /pt/program /pl/program; do
  echo "=== $path ==="
  curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
       -D - "https://somna.help$path" -o /dev/null | head -n 8
done
```

Expected for every path:
- `HTTP/2 200`
- No `cf-mitigated` header
- No `set-cookie` forcing a challenge

---

## Files changed in this fix

- [public/robots.txt](public/robots.txt) — Googlebot allow rules + 4 sitemaps.
- [wrangler.jsonc](wrangler.jsonc) — WAF/Turnstile/rate-limit crawler bypass examples.
- [src/server.ts](src/server.ts) — Worker-level Googlebot bypass.
- [src/lib/crawler.ts](src/lib/crawler.ts) — centralized Googlebot UA detection.
- [src/lib/crawler-context.tsx](src/lib/crawler-context.tsx) — React context for crawler state.
- [src/routes/__root.tsx](src/routes/__root.tsx) — SSR crawler detection + conditional UI.
- [src/components/TurnstileWidget.tsx](src/components/TurnstileWidget.tsx) — crawler-aware Turnstile widget.
- [src/components/TurnstileDialog.tsx](src/components/TurnstileDialog.tsx) — crawler-aware Turnstile modal.
- [src/components/TurnstileProvider.tsx](src/components/TurnstileProvider.tsx) — global Turnstile mount point.
