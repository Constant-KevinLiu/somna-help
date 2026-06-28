# Share Service v2 — Acceptance Criteria Self-Check

This checklist maps 1:1 to the acceptance criteria on the architecture diagram.
Use it for manual regression testing after every release.

## Dashboard sharing

- [ ] Open `/dashboard` with sleep records.
- [ ] Click **Share** on the Dashboard share card.
- [ ] Verify the ShareModal opens and renders a preview image.
- [ ] Click **Reddit** → confirm a Reddit submit page opens with prefilled title.
- [ ] Click **X** → confirm `twitter.com/intent/tweet` opens with hashtags.
- [ ] Click **Pinterest** → confirm `pinterest.com/pin/create/button` opens and the `media` param is a full public R2 URL.
- [ ] Click **Facebook** → confirm Facebook sharer opens with the current page URL.
- [ ] Click **LinkedIn** → confirm LinkedIn share-offsite opens with the current page URL.
- [ ] Click **WhatsApp** → confirm `wa.me` opens with localized text + page URL.
- [ ] Click **Copy Link** → confirm "Link copied" toast appears and the URL is on the clipboard.

## Assessment sharing

- [ ] Complete the assessment at `/assessment`.
- [ ] Click **Share Profile**.
- [ ] Verify the ShareModal preview shows the sleep profile card.
- [ ] Confirm all 7 platform buttons work as expected.

## Sleep Diary sharing

- [ ] Save at least one entry in `/diary`.
- [ ] Scroll to the weekly summary share section.
- [ ] Click **Share** and verify the ShareModal opens.
- [ ] Confirm Pinterest uses a full public R2 URL for the preview image.

## Program lesson sharing

- [ ] Open any lesson under `/program/$week/$lesson`.
- [ ] Click **Share** below the completion toggle.
- [ ] Verify the lesson-specific ShareModal opens.
- [ ] Confirm the page `og:image` and `twitter:image` meta tags update to a lesson-specific URL.

## Internationalization

- [ ] Switch language to **中文**.
- [ ] Open any ShareModal and confirm all button labels and the preview title are in Chinese.
- [ ] Trigger Copy Link and confirm the Chinese "链接已复制" toast.
- [ ] Trigger an upload error (e.g. disconnect network) and confirm Chinese error text.
- [ ] Switch language to **Español** and repeat the checks.

## OG social preview test

- [ ] Open the deployed site and complete a share flow to trigger image upload.
- [ ] Copy the current page URL.
- [ ] **X (Twitter) Card Validator**
  - Go to `https://cards-dev.twitter.com/validator`.
  - Paste the URL and click **Preview card**.
  - Confirm the card image loads from the public R2 CDN URL (`*.r2.dev` or `share.somna.help`).
  - Confirm the `og:title` and `og:description` match the page content.
- [ ] **Facebook Sharing Debugger**
  - Go to `https://developers.facebook.com/tools/debug/`.
  - Paste the URL and click **Debug**.
  - Confirm no warnings about missing `og:image`.
  - Confirm the preview thumbnail loads from the public R2 CDN URL.
- [ ] **LinkedIn Post Inspector**
  - Go to `https://www.linkedin.com/post-inspector/inspect/`.
  - Paste the URL and click **Inspect**.
  - Confirm the image, title, and description render correctly.
- [ ] Repeat the above for:
  - Dashboard URL (`/dashboard`)
  - Assessment result URL (`/assessment`)
  - Sleep Diary URL (`/diary`)
  - Any Program lesson URL (`/program/$week/$lesson`)

## OG image previews

- [ ] Copy a Dashboard URL and paste it into a social preview debugger (e.g. X Card Validator).
- [ ] Confirm the preview image loads from the public R2 CDN URL.
- [ ] Repeat for Assessment and Program lesson URLs.

## Upload validation

- [ ] Attempt to upload a `.jpg` file to `/api/share/upload` → expect `invalid_format`.
- [ ] Attempt to upload a 6MB PNG → expect `too_large`.
- [ ] Upload the same PNG twice under the same user cookie → expect `deduplicated: true` on the second request.
- [ ] Upload without a `somna_uid` cookie → expect `unauthorized`.

## Security

- [ ] Search the frontend bundle for `.r2.cloudflarestorage.com` → expect zero matches.
- [ ] Verify ESLint reports an error when adding a literal private R2 URL in `src/`.

## Analytics

- [ ] Open browser DevTools → Application → Local Storage.
- [ ] Trigger each share platform and confirm events appear under `somna.shareEvents` with platform/page/template detail.
- [ ] Trigger Pinterest upload and confirm `somna.shareImageEvents` contains `image_generate`, `image_upload`, or `image_upload_error` with dimension metadata.

## Environment variable domain switch

- [ ] Set `PUBLIC_SHARE_BASE_URL=https://share.somna.help` and restart dev server.
- [ ] Trigger a share upload and confirm the returned URL uses the custom domain.
- [ ] Confirm no business code changes were required.
