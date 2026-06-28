# Share Service v2 — Implementation Checklist

This checklist matches the Implementation Checklist section of the architecture diagram.

## Core foundation

- [x] Create Share Service v2 core library (`src/lib/share/shareService.ts`)
- [x] Implement `generateImage()` for 1200×630 Canvas templates (`src/lib/share/shareService.ts`)
- [x] Implement unified `generateAndUploadImage()` to render once and upload once (`src/lib/share/shareService.ts`)
- [x] Implement `uploadImage()` to R2 bucket (`src/lib/share/shareService.ts`)
- [x] Implement `getPublicUrl()` resolver (`src/lib/share/shareService.ts`)
- [x] Implement unified `share()` entry function (`src/lib/share/shareService.ts`)
- [x] Implement `generateOGImage()` reusing the same blob as share cards (`src/lib/share/shareService.ts`)
- [x] Implement `generateOGImageUrl()` runtime upload path (`src/lib/share/shareService.ts`)
- [x] Implement `getOGImageUrl()` resolver for already-uploaded assets (`src/lib/share/shareService.ts`)
- [x] Add global input validation (`validateShareParams`) (`src/lib/share/shareService.ts`)
- [x] Add global error wrapper (`wrapShareError`) (`src/lib/share/shareService.ts`)
- [x] Implement Worker upload endpoint `POST /api/share/upload` (`src/server.ts`)
- [x] Preserve legacy `POST /api/share-image` endpoint for backward compatibility (`src/server.ts`)
- [x] Hardcode private R2 S3 API endpoint in Worker (`src/server.ts`)

## Canvas templates

- [x] Dashboard Sleep Score Summary Card (`src/lib/share/shareService.ts`)
- [x] Sleep Diary Weekly Trend Summary Card (`src/lib/share/shareService.ts`)
- [x] Assessment Sleep Profile Result Card (`src/lib/share/shareService.ts`)
- [x] Program Lesson Card (supports all 18 lesson variants) (`src/lib/share/shareService.ts`)
- [x] Generic Article / Blog Content Share Card (`src/lib/share/shareService.ts`)
- [x] Global Default OG Preview Fallback Card (`src/lib/share/shareService.ts`)
- [x] Error / Upload Failure Fallback Card (`src/lib/share/shareService.ts`)

## Social platforms

- [x] Pinterest (`src/lib/share/shareService.ts`, `src/components/ShareModal.tsx`)
- [x] X / Twitter (`src/lib/share/shareService.ts`, `src/lib/share-text.ts`)
- [x] Reddit with `title` param (`src/lib/share-text.ts`)
- [x] Facebook with `SharePlatformParams` (`src/lib/share-text.ts`)
- [x] LinkedIn with `SharePlatformParams` (`src/lib/share-text.ts`)
- [x] WhatsApp (`src/lib/share-text.ts`)
- [x] Copy Link (`src/lib/share/shareService.ts`, `src/components/ShareModal.tsx`)

## Pluggable adapters

- [x] Define `SharePlatformAdapter` interface (`src/lib/share/shareService.ts`)
- [x] Create `SharePlatformParams` standard type (`src/lib/share/shareService.ts`)
- [x] Enforce adapter contract in `registerSharePlatform()` (`src/lib/share/shareService.ts`)
- [x] Create strict `SharePlatformType` enum (`src/lib/share-analytics.ts`)
- [x] Refactor analytics to `trackShareClick()` accepting enum only (`src/lib/share-analytics.ts`)

## Page integration

- [x] Dashboard share + OG meta (`src/components/DashboardShareCard.tsx`)
- [x] Assessment share + OG meta (`src/routes/assessment.tsx`)
- [x] Sleep Diary share + OG meta (`src/routes/diary.tsx`)
- [x] Program lesson share + OG meta (`src/components/program/LessonTemplate.tsx`)

## UI / ShareModal

- [x] Keep existing Somna dark glassmorphism style (`src/components/ShareModal.tsx`)
- [x] Add OG live preview panel (`src/components/ShareModal.tsx`)
- [x] Add collapse / hide toggle for preview panel with localStorage persistence (`src/components/ShareModal.tsx`)
- [x] Add dedicated inline error panel (`src/components/ShareModal.tsx`)
- [x] Render branded platform buttons (`src/components/ShareModal.tsx`)

## i18n

- [x] Add `share.title` header translation EN/ZH/ES (`src/lib/i18n.tsx`)
- [x] Replace hardcoded ShareModal header with `t("share.title")` (`src/components/ShareModal.tsx`)
- [x] English (EN) translations (`src/lib/i18n.tsx`)
- [x] Chinese (ZH) translations (`src/lib/i18n.tsx`)
- [x] Spanish (ES) translations (`src/lib/i18n.tsx`)
- [x] Auxiliary prompt keys: copy failed, upload error, preview title, error tip, hide/show preview, format/size errors (`src/lib/i18n.tsx`)

## Environment variables

- [x] `PUBLIC_SHARE_BASE_URL` centralized (`src/lib/share-config.ts`)
- [x] Automatic fallback to official R2 Public Development URL (`src/lib/share-config.ts`)
- [x] Automatic domain switch without code changes (`src/lib/share-config.ts`)
- [x] Provide `.env.example` template (`.env.example`)

## Analytics

- [x] `share_click` events with platform/route/template dimensions (`src/lib/share-analytics.ts`)
- [x] `image_generate` events with template/render-time dimensions (`src/lib/share-analytics.ts`)
- [x] `image_upload` events with size/page-source dimensions (`src/lib/share-analytics.ts`)
- [x] `image_upload_error` events with error-type/page-source dimensions (`src/lib/share-analytics.ts`)

## Security & validation

- [x] Client-side PNG + 5MB validation (`src/lib/share/shareService.ts`)
- [x] Server-side PNG + 5MB validation (`src/server.ts`)
- [x] User identity validation middleware on upload (`src/server.ts`)
- [x] Upload filename keyed by user ID (`{pageType}-{user-uuid}.png`) (`src/server.ts`)
- [x] Deduplication via R2 object head check (`src/server.ts`)
- [x] ESLint rule to ban private R2 endpoints in frontend code (`eslint.config.js`)
- [x] No private R2 S3 API endpoint exposed in client bundle

## Future expansion hooks

- [x] Pluggable platform adapter interface (`registerSharePlatform`) (`src/lib/share/shareService.ts`)
- [x] Custom template registration function (`registerShareTemplate`) (`src/lib/share/shareService.ts`)
- [x] A/B test variant support (`variant` field in canvas options) (`src/lib/share/shareService.ts`)
- [x] Extension demos for Discord / Threads and custom templates (`README.md`, `src/lib/share/README.md`)

## Documentation

- [x] `src/lib/share/README.md` with usage examples
- [x] `docs/share-service-acceptance-checklist.md` with OG social preview validation flow
- [x] `docs/share-service-implementation-checklist.md` with source file paths
- [x] `docs/R2_BUCKET_SETUP.md` with bucket creation steps (`docs/R2_BUCKET_SETUP.md`)
- [x] Root `README.md` with error-handling usage examples and extension demos (`README.md`)

## Verification

- [x] `tsc --noEmit` passes with zero errors
- [ ] Full manual acceptance test run (tracked separately)
