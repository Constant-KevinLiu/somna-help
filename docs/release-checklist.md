# Somna.help Release Checklist

> **Rule:** No production deployment may occur unless every checkbox below is
> verified. The automated Release Gate (`npm run release-gate`) covers the
> items marked **[auto]** — run it first, then complete the manual checks.
>
> **Automated gate command:**
>
> ```bash
> npm run release:report
> ```
>
> This produces `release-report.md` with a `✅ READY FOR PRODUCTION` or
> `❌ RELEASE BLOCKED` decision.

---

## Engineering **[auto]**

- [ ] TypeScript (`npm run typecheck`) — 0 errors
- [ ] ESLint (`npm run lint`) — 0 errors
- [ ] Prettier (`npm run format:check`) — all files formatted
- [ ] Production Build (`npm run build`) — succeeds
- [ ] Wrangler Dry Run (`npx wrangler deploy --dry-run`) — config valid

---

## Functional

### Dashboard

- [ ] Dashboard opens without errors
- [ ] Sleep records load from localStorage
- [ ] Last 7 Days Trend chart renders (Recharts)
- [ ] Weekly Insight updates based on trend
- [ ] CBT-I Brain recommendation displays
- [ ] Recommended bedtime is valid (not before 20:00, not after 01:00)
- [ ] Recommended wake-up time is valid (not before 04:00, not after 09:00)

### Assessment

- [ ] All questions display in current language
- [ ] Progress indicator updates on each answer
- [ ] Sleep Profile generates at completion
- [ ] Color-coded severity displays (green/amber/red)
- [ ] "Go to Dashboard" button navigates correctly
- [ ] Results persist across page reload

### Sleep Diary

- [ ] Save Entry works (no console errors)
- [ ] Save error shows toast if localStorage quota exceeded
- [ ] Dashboard button navigates correctly
- [ ] localStorage `sleepRecords` key updates
- [ ] Dashboard reflects new entry after navigation

### Program

- [ ] All 6 Weeks accessible from `/program`
- [ ] All 18 Lessons accessible (none incorrectly locked)
- [ ] Lesson navigation (Next/Previous) works
- [ ] "Back to Week" link uses correct long slug
- [ ] Lesson completion checkbox persists
- [ ] Progress percentage updates on program hub

### Learn

- [ ] Learn hub (`/learn`) lists all guides + quick lessons
- [ ] All 5 CBT-I guides open correctly
- [ ] All 6 quick lessons open correctly
- [ ] Related articles links work
- [ ] Related tools links work
- [ ] Back navigation works

### Relax

- [ ] Breathing animation (4-7-8) starts/stops correctly
- [ ] Phase transitions (inhale → hold → exhale) display
- [ ] Timer counts down correctly
- [ ] Meditation audio sessions load (if audio files present)

### Tools

- [ ] Sleep Cycle Calculator returns valid cycles
- [ ] Sleep Calculator returns valid bedtime/wake times
- [ ] Bedtime Calculator returns valid wake times
- [ ] Nap Calculator returns valid nap durations
- [ ] Melatonin Calculator returns valid timing
- [ ] Calculator preferences persist between visits (localStorage)
- [ ] Recommended sleep cycles are highlighted

---

## Sharing

### Pipeline

- [ ] Share image generates (canvas → data URL)
- [ ] Image uploads to Cloudflare R2
- [ ] Public HTTPS URL is returned
- [ ] Public URL returns HTTP 200 with `image/png`

### Platforms

- [ ] Pinterest — pin create URL opens with image
- [ ] X (Twitter) — intent/tweet URL opens with text
- [ ] Reddit — submit URL opens with title
- [ ] Facebook — sharer URL opens
- [ ] LinkedIn — share URL opens with title + summary
- [ ] WhatsApp — wa.me URL opens with text
- [ ] WeChat — QR code generates and displays
- [ ] Weibo — share URL opens with image (pic param)
- [ ] QQ — share URL opens with image (pics param)
- [ ] Copy Link — clipboard write succeeds
- [ ] Download Image — file downloads as PNG

---

## Cloudflare

- [ ] Workers — `dist/server/server.js` exists and is valid
- [ ] R2 — `SHARE_BUCKET` binding points to `somna-share` bucket
- [ ] Assets — `dist/client/` directory populated (60+ files)
- [ ] Routes — all routes serve correct content
- [ ] Compatibility Date — set in `wrangler.jsonc`
- [ ] Compatibility Flags — `nodejs_compat` enabled

---

## SEO **[partial auto]**

- [ ] `sitemap.xml` — lists all 40+ routes
- [ ] `robots.txt` — allows crawling, references sitemap
- [ ] Canonical URLs — present on all pages
- [ ] Open Graph — `og:title`, `og:description`, `og:image` present
- [ ] OG Image — `/og-cover.jpg` exists in `public/`
- [ ] Twitter Card — `twitter:card`, `twitter:image` present
- [ ] Structured Data — JSON-LD (Article/FAQPage) on content pages
- [ ] Favicon — all sizes present in `public/`
- [ ] No localhost URLs in production source
- [ ] No broken OG image references

---

## Multilingual

- [ ] English — all UI text displays in English
- [ ] 简体中文 — all UI text displays in Chinese
- [ ] Español — all UI text displays in Spanish
- [ ] Language switcher persists selection (localStorage `somna-language`)
- [ ] No mixed-language strings in any dict
- [ ] Dashboard translations complete
- [ ] Share dialog translations complete
- [ ] Program lesson translations complete (18 lessons × 3 langs)
- [ ] Error messages localized

---

## Accessibility

### Mobile

- [ ] Layout responsive at 375px width
- [ ] Touch targets ≥ 44×44 px
- [ ] No horizontal scroll on any page

### Desktop

- [ ] Layout correct at 1440px width
- [ ] Navigation dropdowns work with mouse

### Keyboard

- [ ] All interactive elements reachable via Tab
- [ ] Focus visible on all elements
- [ ] Modal dialogs trap focus correctly
- [ ] Escape closes dialogs
- [ ] Tab order is logical

### Screen Reader

- [ ] All buttons have `aria-label` or visible text
- [ ] Images have `alt` text
- [ ] Form fields have associated labels
- [ ] Dynamic content changes announced

---

## Data Integrity **[auto]**

- [ ] Single `SLEEP_RECORDS_KEY` constant (no duplicates)
- [ ] `loadRecords()` validates every field
- [ ] Dashboard uses `cbti-brain.ts::sleepWindow()` (not `tonightPlan()`)
- [ ] No direct `localStorage.getItem("sleepRecords")` outside `sleep-records.ts`
- [ ] Corrupted localStorage data recovers gracefully (returns `[]`)

---

## Security **[auto]**

- [ ] No `dangerouslySetInnerHTML` outside `src/components/ui/`
- [ ] R2 upload validates PNG format + 5MB size limit
- [ ] Share URLs use `encodeURIComponent`
- [ ] No XSS vectors in user input handling
- [ ] localStorage data validated on read

---

## Final Sign-Off

- [ ] Automated Release Gate passes (`✅ READY FOR PRODUCTION`)
- [ ] `release-report.md` reviewed
- [ ] Manual functional checks completed
- [ ] No `console.log` debug statements in production code
- [ ] Deploy approved by reviewer

---

**Deploy command (after all checks pass):**

```bash
npx wrangler deploy
```
