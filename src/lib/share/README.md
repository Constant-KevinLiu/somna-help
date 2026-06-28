# Share Service v2

> Unified image generation, R2 upload, and social sharing for somna.help.

## Overview

The Share Service is responsible for:

1. Rendering branded 1200×630 share-card PNGs from Canvas templates.
2. Uploading those PNGs to the Cloudflare R2 bucket `somna-share`.
3. Resolving public R2 CDN URLs.
4. Triggering share dialogs for all supported social platforms.
5. Generating Open Graph preview images and updating page meta tags.

## Entry point

```ts
import {
  generateImage,
  generateImageDataUrl,
  uploadImage,
  getPublicUrl,
  share,
  generateOGImage,
  getOGImageUrl,
  validateUploadFile,
  registerSharePlatform,
  registerShareTemplate,
  useShareLang,
} from "@/lib/share/shareService";
```

## Usage examples

All examples include the full error-handling flow required by the architecture diagram.

### Dashboard page

```ts
import {
  generateImage,
  uploadImage,
  share,
  getPublicUrl,
  generateOGImageUrl,
} from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";

async function handleDashboardShare(pageUrl: string) {
  try {
    const blob = await generateImage({
      template: "dashboard",
      efficiency: 84,
      streakDays: 7,
      trendData: [78, 80, 82, 83, 85, 84, 86],
    });
    const key = "dashboard-84-7.png";
    const publicUrl = await uploadImage(blob, key, "dashboard");

    // Reuse the same uploaded asset for OG meta tags.
    await generateOGImageUrl({
      type: "dashboard",
      resourceId: "84-7",
      title: "My Sleep Score",
    });

    share(
      SharePlatformType.Pinterest,
      pageUrl,
      "My Sleep Score",
      "84% sleep efficiency this week",
      publicUrl,
      { contentType: "dashboard", efficiency: 84 },
    );
  } catch (err) {
    console.error("Dashboard share failed:", err);
    // Render and upload a fallback error card.
    const fallback = await generateImage({ template: "error", errorMessage: "Share failed" });
    await uploadImage(fallback, "dashboard-error.png", "dashboard");
  }
}
```

### Sleep Diary weekly summary

```ts
import {
  generateImage,
  uploadImage,
  share,
  getPublicUrl,
  generateOGImageUrl,
} from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";
import { weeklyAverageEfficiency, weeklyAverageScore, type SleepRecord } from "@/lib/sleep-records";

async function handleDiaryShare(records: SleepRecord[], pageUrl: string) {
  try {
    const avgEff = weeklyAverageEfficiency(records) ?? 0;
    const avgScore = weeklyAverageScore(records) ?? 0;
    const blob = await generateImage({
      template: "diary",
      averageScore: avgScore,
      averageEfficiency: avgEff,
      dateRange: "06/21 – 06/27",
      totalEntries: records.length,
    });
    const key = `diary-${Math.round(avgEff)}-${records.length}.png`;
    const publicUrl = await uploadImage(blob, key, "diary");

    await generateOGImageUrl({
      type: "dashboard",
      resourceId: `${Math.round(avgEff)}-${records.length}`,
    });

    share(SharePlatformType.X, pageUrl, "My Sleep Diary", "Weekly sleep summary", publicUrl, {
      contentType: "diary",
      efficiency: avgEff,
    });
  } catch (err) {
    console.error("Diary share failed:", err);
    const fallback = await generateImage({ template: "error", errorMessage: "Diary share failed" });
    await uploadImage(fallback, "diary-error.png", "diary");
  }
}
```

### Assessment / Sleep Profile page

```ts
import {
  generateImage,
  uploadImage,
  share,
  getPublicUrl,
  generateOGImageUrl,
} from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";

async function handleAssessmentShare(levelName: string, efficiencyLabel: string, pageUrl: string) {
  try {
    const blob = await generateImage({
      template: "assessment",
      levelName,
      levelDesc: "Sleep profile result",
      efficiencyLabel,
    });
    const key = "assessment-profile.png";
    const publicUrl = await uploadImage(blob, key, "assessment");

    await generateOGImageUrl({
      type: "assessment",
      resourceId: levelName.toLowerCase().replace(/\s+/g, "-"),
      title: levelName,
    });

    share(SharePlatformType.Facebook, pageUrl, levelName, "Find your sleep profile", publicUrl, {
      contentType: "assessment",
    });
  } catch (err) {
    console.error("Assessment share failed:", err);
    const fallback = await generateImage({
      template: "error",
      errorMessage: "Assessment share failed",
    });
    await uploadImage(fallback, "assessment-error.png", "assessment");
  }
}
```

### Program Lesson page

```ts
import {
  generateImage,
  uploadImage,
  share,
  getPublicUrl,
  generateOGImageUrl,
} from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";

async function handleLessonShare(lesson: LessonContent, pageUrl: string) {
  try {
    const c = lesson.i18n.en;
    const blob = await generateImage({
      template: "program",
      weekNumber: lesson.weekNumber,
      lessonNumber: lesson.lessonNumber,
      lessonTitle: c.title,
      weekTitle: `Week ${lesson.weekNumber}`,
    });
    const key = `program-w${lesson.weekNumber}-l${lesson.lessonNumber}.png`;
    const publicUrl = await uploadImage(blob, key, "program");

    await generateOGImageUrl({
      type: "program",
      resourceId: `${lesson.weekNumber}-${lesson.lessonNumber}`,
      title: c.title,
    });

    share(SharePlatformType.LinkedIn, pageUrl, c.title, "CBT-I sleep program lesson", publicUrl, {
      contentType: "program",
    });
  } catch (err) {
    console.error("Lesson share failed:", err);
    const fallback = await generateImage({
      template: "error",
      errorMessage: "Lesson share failed",
    });
    await uploadImage(fallback, "program-error.png", "program");
  }
}
```

### OG image resolver

```ts
import { getOGImageUrl, generateOGImageUrl } from "@/lib/share/shareService";

// Synchronous URL builder for an already-uploaded asset.
const ogImageUrl = getOGImageUrl("dashboard", "84-7");

// Runtime path that generates the canvas, uploads once, and returns the public URL.
const liveOgUrl = await generateOGImageUrl({
  type: "dashboard",
  resourceId: "84-7",
  title: "My Sleep Score",
});
```

## Canvas templates

| Template     | Options type              | Use case                            |
| ------------ | ------------------------- | ----------------------------------- |
| `dashboard`  | `DashboardCanvasOptions`  | Dashboard sleep-efficiency summary  |
| `diary`      | `DiaryCanvasOptions`      | Weekly diary trend summary          |
| `assessment` | `AssessmentCanvasOptions` | Sleep profile result card           |
| `program`    | `ProgramCanvasOptions`    | CBT-I program lesson card           |
| `article`    | `ArticleCanvasOptions`    | Generic article/blog content card   |
| `default`    | `DefaultCanvasOptions`    | Global OG fallback preview          |
| `error`      | `ErrorCanvasOptions`      | Upload/render failure fallback card |

## Supported platforms

- Pinterest
- X / Twitter
- Reddit
- Facebook
- LinkedIn
- WhatsApp
- Copy Link

## Extending platforms

Register a new platform with the full adapter contract, including brand color,
i18n label helper, and analytics param mapping:

```ts
import { registerSharePlatform, type SharePlatformAdapter } from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";

const discordAdapter: SharePlatformAdapter = {
  name: "Discord",
  brandColor: "#5865F2",
  buildUrl: ({ params }) =>
    `https://discord.com/channels/@me?message=${encodeURIComponent(
      `${params.title ?? ""}\n${params.pageUrl}`,
    )}`,
  getI18nLabel: () => "share.discord",
  buildAnalyticsParams: ({ contentType }) => ({
    pageRoute: contentType,
    templateType: contentType,
  }),
};

registerSharePlatform(SharePlatformType.Discord, discordAdapter);

// Threads example
registerSharePlatform(SharePlatformType.Threads, {
  name: "Threads",
  brandColor: "#000000",
  buildUrl: ({ params }) =>
    `https://threads.net/intent/post?text=${encodeURIComponent(
      (params.title ?? "") + " " + params.pageUrl,
    )}`,
  getI18nLabel: () => "share.threads",
});
```

## Extending templates

Register a custom Canvas renderer. The renderer receives the 2D context, the
merged options, and the active-language label set:

```ts
import { registerShareTemplate } from "@/lib/share/shareService";

registerShareTemplate("podcast", (ctx, opts, labels) => {
  const cx = 1200 / 2;
  ctx.fillStyle = "#F5F7FF";
  ctx.textAlign = "center";
  ctx.font = "700 60px Inter, sans-serif";
  ctx.fillText(opts.title ?? "Podcast", cx, 315);
  ctx.fillStyle = "#7C8CFF";
  ctx.font = "500 28px Inter, sans-serif";
  ctx.fillText(labels.somna, cx, 420);
});
```

## Environment variable

Set the public R2 base URL via `PUBLIC_SHARE_BASE_URL` in your `.env` file:

```bash
PUBLIC_SHARE_BASE_URL=https://pub-d4e88771abf4204879658307182abe9.r2.dev
```

When the production custom domain `https://share.somna.help` is launched, simply
update the environment variable. No business code changes are required.

## Upload API

`POST /api/share/upload`

- Content-Type: `multipart/form-data`
- Body: `{ file: PNG Blob, filename: string }`
- Validation: PNG only, max 5MB, safe filename pattern `/^[a-z0-9._-]+\.png$/i`
- User identity required via `somna_uid` cookie for upload isolation.
- Deduplication: skips re-upload if the same user/object already exists in R2.
- Response: `{ success: true, key: string, url: string, deduplicated?: boolean }`

The legacy JSON endpoint `POST /api/share-image` is preserved for backward
compatibility.

## Analytics

Image events are stored separately from share events:

- `image_generate` — fires after successful Canvas render.
- `image_upload` — fires after successful R2 upload.
- `image_upload_error` — fires for validation rejects / network / R2 failures.

All events include dimension metadata:

- `share_click`: platform, page route, template type
- `image_generate`: template type, render time ms
- `image_upload`: file size KB, page source
- `image_upload_error`: error type, page source

Use `imageEventCounts()` from `@/lib/share-analytics` to read counts.

## Error handling

All `generateImage` / `uploadImage` calls are wrapped with `wrapShareError`,
which surfaces user-friendly toast messages and re-throws the error so callers
can fall back gracefully. The ShareModal additionally shows a dedicated inline
error panel for detailed upload/share failures.
