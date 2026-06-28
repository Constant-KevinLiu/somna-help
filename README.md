# somna.help

A science-based CBT-I sleep platform built with TanStack Start, React, TypeScript,
and Cloudflare Workers.

## Share Service v2

The Share Service renders branded 1200×630 share cards via Canvas, uploads them
to the Cloudflare R2 bucket `somna-share`, and triggers social share dialogs.

### Usage examples with full error handling

#### Dashboard

```ts
import { generateImage, uploadImage, share, generateOGImageUrl } from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";

async function shareDashboard(pageUrl: string, efficiency: number, streak: number) {
  try {
    const blob = await generateImage({
      template: "dashboard",
      efficiency,
      streakDays: streak,
    });
    const key = `dashboard-${efficiency}-${streak}.png`;
    const publicUrl = await uploadImage(blob, key, "dashboard");

    // Reuse the same uploaded asset for OG meta tags.
    await generateOGImageUrl({ type: "dashboard", resourceId: `${efficiency}-${streak}` });

    share(SharePlatformType.Pinterest, pageUrl, "My Sleep Score", "Weekly progress", publicUrl, {
      contentType: "dashboard",
      efficiency,
    });
  } catch (err) {
    console.error("Share failed:", err);
    const fallback = await generateImage({ template: "error", errorMessage: "Share failed" });
    await uploadImage(fallback, "dashboard-error.png", "dashboard");
  }
}
```

#### Sleep Diary

```ts
import { generateImage, uploadImage, share, generateOGImageUrl } from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";
import { weeklyAverageEfficiency, type SleepRecord } from "@/lib/sleep-records";

async function shareDiary(pageUrl: string, records: SleepRecord[]) {
  try {
    const avgEff = weeklyAverageEfficiency(records) ?? 0;
    const blob = await generateImage({
      template: "diary",
      averageScore: 0,
      averageEfficiency: avgEff,
      dateRange: "this week",
      totalEntries: records.length,
    });
    const key = `diary-${avgEff}-${records.length}.png`;
    const publicUrl = await uploadImage(blob, key, "diary");
    await generateOGImageUrl({ type: "dashboard", resourceId: `${avgEff}-${records.length}` });
    share(SharePlatformType.X, pageUrl, "My Sleep Diary", "Weekly summary", publicUrl, {
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

#### Assessment

```ts
import { generateImage, uploadImage, share, generateOGImageUrl } from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";

async function shareAssessment(pageUrl: string, levelName: string, efficiencyLabel: string) {
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

#### Program Lesson

```ts
import { generateImage, uploadImage, share, generateOGImageUrl } from "@/lib/share/shareService";
import { SharePlatformType } from "@/lib/share-analytics";
import type { LessonContent } from "@/lib/program-lessons";

async function shareLesson(pageUrl: string, lesson: LessonContent) {
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
    share(SharePlatformType.LinkedIn, pageUrl, c.title, "CBT-I lesson", publicUrl, {
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

### Extending Share Service

#### Register a new social platform

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
```

#### Register a custom Canvas template

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

### Environment variables

Copy `.env.example` to `.env` and set `PUBLIC_SHARE_BASE_URL`.

```bash
cp .env.example .env
```

See `docs/R2_BUCKET_SETUP.md` for bucket creation steps.

## Development

```bash
npm install
npm run dev
```

## Type checking

```bash
npx tsc --noEmit
```
