/**
 * Share Service v2 — unified image generation, upload, and social sharing.
 *
 * This module is the single source of truth for:
 *   - rendering branded 1200×630 share-card PNGs via Canvas
 *   - uploading images to the Cloudflare R2 bucket
 *   - resolving public R2 CDN URLs
 *   - triggering share dialogs for any supported social platform
 *   - generating Open Graph preview images
 *
 * Extension points are provided for:
 *   - new social platforms (`registerSharePlatform`)
 *   - custom Canvas templates (`registerShareTemplate`)
 *   - A/B test variants (`variant` field in options)
 *
 * All functions wrap errors consistently and report analytics events through
 * `@/lib/share-analytics`.
 */

import { useI18n, type Lang } from "@/lib/i18n";
import {
  trackImageGenerate,
  trackImageUpload,
  trackImageUploadError,
  trackShareClick,
  SharePlatformType,
  ShareUploadErrorType,
  type ShareEventType,
} from "@/lib/share-analytics";
import {
  PUBLIC_SHARE_BASE_URL,
  SHARE_IMAGE_HOSTING_ENABLED,
  shareImageUrl,
} from "@/lib/share-config";
import {
  facebookShareUrl,
  linkedInShareUrl,
  pinterestShareUrl,
  redditShareUrl,
  whatsAppShareUrl,
  xShareUrl,
} from "@/lib/share-text";
import { toast } from "sonner";
import { BRAND, CANVAS, COLORS, FONT_SIZES, FONTS, SITE_HOST, SPACING } from "./canvasConfig";

// =============================================================================
// Types
// =============================================================================

/** Built-in social platforms. */
export type SharePlatform =
  | "pinterest"
  | "x"
  | "reddit"
  | "facebook"
  | "linkedin"
  | "whatsapp"
  | "wechat"
  | "weibo"
  | "qq"
  | "copy"
  | "download";

/** Built-in Canvas template kinds. */
export type ShareTemplate =
  | "dashboard"
  | "diary"
  | "assessment"
  | "program"
  | "article"
  | "default"
  | "error";

/** A/B variant identifier for share cards. */
export type ShareVariant = "a" | "b" | string;

/** Common options for every 1200×630 share card. */
export interface ShareCanvasOptions {
  template: ShareTemplate | string;
  lang?: Lang;
  title?: string;
  subtitle?: string;
  /** Primary metric value rendered in large type. */
  metric?: string | number;
  /** Label placed above the metric. */
  metricLabel?: string;
  /** Optional secondary label/value pairs. */
  details?: Array<{ label: string; value: string }>;
  /** Optional A/B test variant. */
  variant?: ShareVariant;
}

/** Options specific to the Dashboard template. */
export interface DashboardCanvasOptions extends ShareCanvasOptions {
  template: "dashboard";
  efficiency: number;
  streakDays: number;
  trendData?: number[];
  userName?: string;
}

/** Options specific to the Sleep Diary weekly template. */
export interface DiaryCanvasOptions extends ShareCanvasOptions {
  template: "diary";
  averageScore: number;
  averageEfficiency: number;
  dateRange: string;
  totalEntries: number;
}

/** Options specific to the Assessment / Sleep Profile template. */
export interface AssessmentCanvasOptions extends ShareCanvasOptions {
  template: "assessment";
  levelName: string;
  levelDesc: string;
  efficiencyLabel: string;
}

/** Options specific to the Program lesson template. */
export interface ProgramCanvasOptions extends ShareCanvasOptions {
  template: "program";
  weekNumber: number;
  lessonNumber: number;
  lessonTitle: string;
  weekTitle: string;
}

/** Options for generic article / blog share cards. */
export interface ArticleCanvasOptions extends ShareCanvasOptions {
  template: "article";
  articleTitle: string;
  category?: string;
}

/** Options for the default OG fallback card. */
export interface DefaultCanvasOptions extends ShareCanvasOptions {
  template: "default";
}

/** Options for the error / upload-failure fallback card. */
export interface ErrorCanvasOptions extends ShareCanvasOptions {
  template: "error";
  errorMessage?: string;
}

export type AnyShareCanvasOptions =
  | DashboardCanvasOptions
  | DiaryCanvasOptions
  | AssessmentCanvasOptions
  | ProgramCanvasOptions
  | ArticleCanvasOptions
  | DefaultCanvasOptions
  | ErrorCanvasOptions;

/** Custom template extension interface. */
export type ShareTemplateRenderer<T extends ShareCanvasOptions = ShareCanvasOptions> = (
  ctx: CanvasRenderingContext2D,
  opts: T,
  labels: (typeof LABELS)["en"],
) => void;

/** Options for OG preview image generation. */
export interface OGCanvasOptions {
  type: "dashboard" | "assessment" | "program";
  resourceId: string;
  title?: string;
  description?: string;
  lang?: Lang;
}

/** Standardized input parameters for Facebook & LinkedIn share links. */
export interface SharePlatformParams {
  /** The canonical page URL being shared. */
  pageUrl: string;
  /** Optional pre-filled title (used by platforms that accept it). */
  title?: string;
  /** Optional pre-filled description. */
  description?: string;
  /** Optional public image URL (when the platform supports image prefill). */
  imageUrl?: string;
}

/** Context passed to platform adapters. */
export interface ShareContext {
  /** Target platform identifier. */
  platform: SharePlatformType | string;
  /** The page URL being shared. */
  pageUrl: string;
  /** Share title / headline. */
  title: string;
  /** Share description. */
  description: string;
  /** Public image URL (required for Pinterest). */
  imageUrl: string;
  /** Active language. */
  lang: Lang;
  /** Sleep efficiency value used for copy and hashtag generation. */
  efficiency: number;
  /** Logical content type, e.g. "dashboard", "assessment". */
  contentType: string;
  /** Standardized platform params available to every adapter. */
  params: SharePlatformParams;
}

/** Pluggable platform adapter contract. */
export interface SharePlatformAdapter {
  /** Human-readable platform name. */
  name: string;
  /** Brand color (hex) used for share buttons, e.g. "#1877F2". */
  brandColor: string;
  /** Build the final platform share URL. */
  buildUrl: (ctx: ShareContext) => string;
  /** Generate the platform-specific i18n button label key or raw label. */
  getI18nLabel?: (lang: Lang) => string;
  /** Map common context into platform-specific analytics dimensions. */
  buildAnalyticsParams?: (ctx: ShareContext) => Record<string, unknown>;
  /** Whether clicking the button should open a new window. Default true. */
  opensWindow?: boolean;
}

// =============================================================================
// Localization
// =============================================================================

const LABELS: Record<
  Lang,
  {
    sleepEfficiency: string;
    dayStreak: string;
    weeklyAverage: string;
    sleepProfile: string;
    sleepType: string;
    result: string;
    cbtiTraining: string;
    lesson: string;
    week: string;
    somna: string;
    tryAgain: string;
    shareFallback: string;
  }
> = {
  en: {
    sleepEfficiency: "Sleep Efficiency",
    dayStreak: "Day Streak",
    weeklyAverage: "Weekly Average",
    sleepProfile: "Sleep Profile",
    sleepType: "Sleep Type",
    result: "Result",
    cbtiTraining: "CBT-I Sleep Training",
    lesson: "Lesson",
    week: "Week",
    somna: "SOMNA",
    tryAgain: "Try sharing again",
    shareFallback: "Science-based CBT-I sleep companion.",
  },
  zh: {
    sleepEfficiency: "睡眠效率",
    dayStreak: "天连续记录",
    weeklyAverage: "本周平均",
    sleepProfile: "睡眠档案",
    sleepType: "睡眠类型",
    result: "结果",
    cbtiTraining: "CBT-I 睡眠训练",
    lesson: "课程",
    week: "第",
    somna: "SOMNA",
    tryAgain: "请重试",
    shareFallback: "基于 CBT-I 的科学睡眠伙伴。",
  },
  es: {
    sleepEfficiency: "Eficiencia del sueño",
    dayStreak: "Días seguidos",
    weeklyAverage: "Promedio semanal",
    sleepProfile: "Perfil de sueño",
    sleepType: "Tipo de sueño",
    result: "Resultado",
    cbtiTraining: "Entrenamiento de sueño CBT-I",
    lesson: "Lección",
    week: "Semana",
    somna: "SOMNA",
    tryAgain: "Inténtalo de nuevo",
    shareFallback: "Compañero de sueño basado en CBT-I.",
  },
};

/** Read the currently active app language. Safe to call outside React. */
export function getActiveLang(): Lang {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("lull.lang") as Lang | null;
    if (stored === "en" || stored === "zh" || stored === "es") return stored;
  }
  return "en";
}

/** React hook that returns the active language. */
export function useShareLang(): Lang {
  const i18n = useI18n();
  return i18n?.lang ?? getActiveLang();
}

// =============================================================================
// Extension registries
// =============================================================================

const customTemplates = new Map<string, ShareTemplateRenderer>();
const customPlatforms = new Map<string, SharePlatformAdapter>();

/**
 * Register a custom Canvas template renderer.
 *
 * @param templateName - Unique template identifier.
 * @param renderer     - Function that renders the template onto a 2D context.
 */
export function registerShareTemplate(templateName: string, renderer: ShareTemplateRenderer): void {
  customTemplates.set(templateName, renderer);
}

/**
 * Register a new social-platform adapter.
 *
 * The adapter must implement the full `SharePlatformAdapter` contract:
 *   - `name` — human-readable platform name
 *   - `brandColor` — hex brand color for buttons
 *   - `buildUrl` — platform URL builder
 *   - optional `getI18nLabel`, `buildAnalyticsParams`, `opensWindow`
 *
 * @param platform - Platform identifier from `SharePlatformType`.
 * @param adapter  - Adapter implementing the full interface.
 */
export function registerSharePlatform(
  platform: SharePlatformType,
  adapter: SharePlatformAdapter,
): void {
  if (!platform || typeof adapter?.buildUrl !== "function") {
    throw new Error("Invalid SharePlatformAdapter: platform and buildUrl are required.");
  }
  customPlatforms.set(platform, adapter);
}

/** Reserve A/B test variant helpers. */
export function getVariantSeed(variant?: ShareVariant): number {
  const seed = variant?.charCodeAt(0) ?? 0;
  return seed % 2;
}

// =============================================================================
// Internal helpers
// =============================================================================

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);

  const glow = ctx.createRadialGradient(
    SPACING.glowX,
    SPACING.glowY,
    30,
    SPACING.glowX,
    SPACING.glowY,
    SPACING.glowRadius,
  );
  glow.addColorStop(0, "rgba(124,140,255,0.16)");
  glow.addColorStop(1, "rgba(124,140,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

function drawBrand(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.brand}px ${FONTS.sans}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(BRAND.word, SPACING.brandX, SPACING.brandY);

  ctx.fillStyle = COLORS.accent;
  ctx.beginPath();
  ctx.arc(BRAND.dotX, BRAND.dotY, BRAND.dotRadius, 0, Math.PI * 2);
  ctx.fill();
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.muted;
  ctx.font = `500 ${FONT_SIZES.footer}px ${FONTS.sans}`;
  ctx.textAlign = "center";
  ctx.fillText(SITE_HOST, CANVAS.width / 2, CANVAS.height - 50);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const metrics = ctx.measureText(test);
    if (metrics.width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// =============================================================================
// Built-in template renderers
// =============================================================================

function renderDashboard(
  ctx: CanvasRenderingContext2D,
  opts: DashboardCanvasOptions,
  labels: (typeof LABELS)["en"],
) {
  const cx = CANVAS.width / 2;
  const efficiency = clamp(Math.round(opts.efficiency), 0, 100);
  const streak = Math.max(0, opts.streakDays);

  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 ${FONT_SIZES.eyebrow}px ${FONTS.sans}`;
  ctx.textAlign = "center";
  ctx.fillText(labels.sleepEfficiency.toUpperCase(), cx, 200);

  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.metric}px ${FONTS.metric}`;
  ctx.fillText(`${efficiency}%`, cx, 360);

  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 ${FONT_SIZES.body}px ${FONTS.sans}`;
  ctx.fillText(`${streak} ${labels.dayStreak}`, cx, 430);

  if (opts.trendData && opts.trendData.length > 1) {
    const chartY = 480;
    const chartH = 60;
    const chartW = 400;
    const chartX = cx - chartW / 2;
    const values = opts.trendData.map((v) => clamp(v, 0, 100));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = chartX + (i / (values.length - 1)) * chartW;
      const y = chartY + chartH - ((v - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

function renderDiary(
  ctx: CanvasRenderingContext2D,
  opts: DiaryCanvasOptions,
  labels: (typeof LABELS)["en"],
) {
  const cx = CANVAS.width / 2;

  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 ${FONT_SIZES.eyebrow}px ${FONTS.sans}`;
  ctx.textAlign = "center";
  ctx.fillText(labels.weeklyAverage.toUpperCase(), cx, 200);

  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.metricSmall}px ${FONTS.metric}`;
  ctx.fillText(`${Math.round(opts.averageEfficiency)}%`, cx, 340);

  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 ${FONT_SIZES.body}px ${FONTS.sans}`;
  ctx.fillText(`${opts.totalEntries} entries · ${opts.dateRange}`, cx, 410);

  ctx.fillStyle = COLORS.muted;
  ctx.font = `500 ${FONT_SIZES.caption}px ${FONTS.sans}`;
  ctx.fillText(`Sleep Score ${Math.round(opts.averageScore)}`, cx, 480);
}

function renderAssessment(
  ctx: CanvasRenderingContext2D,
  opts: AssessmentCanvasOptions,
  labels: (typeof LABELS)["en"],
) {
  const cx = CANVAS.width / 2;

  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 ${FONT_SIZES.eyebrow}px ${FONTS.sans}`;
  ctx.textAlign = "center";
  ctx.fillText(labels.sleepProfile.toUpperCase(), cx, 200);

  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.title}px ${FONTS.sans}`;
  const lines = wrapText(ctx, opts.levelName, 1000);
  let y = 310;
  for (const line of lines.slice(0, 2)) {
    ctx.fillText(line, cx, y);
    y += 90;
  }

  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 ${FONT_SIZES.body}px ${FONTS.sans}`;
  ctx.fillText(`${labels.sleepType}: ${opts.efficiencyLabel}`, cx, 460);
}

/** Lesson accent colors give each week a subtle visual identity. */
const LESSON_ACCENT_COLORS = [
  "#7C8CFF", // week 1
  "#63D39A", // week 2
  "#FFC978", // week 3
  "#FF9AA2", // week 4
  "#A0C4FF", // week 5
  "#BDB2FF", // week 6
];

function renderProgram(
  ctx: CanvasRenderingContext2D,
  opts: ProgramCanvasOptions,
  labels: (typeof LABELS)["en"],
) {
  const cx = CANVAS.width / 2;
  const weekIndex = clamp(opts.weekNumber - 1, 0, 5);
  const accent = LESSON_ACCENT_COLORS[weekIndex] ?? COLORS.accent;
  const weekLabel =
    opts.lang === "zh" ? `${labels.week}${opts.weekNumber}` : `${labels.week} ${opts.weekNumber}`;

  // Variant B: render a left accent bar for visual differentiation.
  if (opts.variant === "b") {
    ctx.fillStyle = accent;
    roundRect(ctx, 40, 100, 8, 430, 4);
    ctx.fill();
  }

  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 ${FONT_SIZES.eyebrow}px ${FONTS.sans}`;
  ctx.textAlign = "center";
  ctx.fillText(`${weekLabel} · ${labels.lesson} ${opts.lessonNumber}`.toUpperCase(), cx, 200);

  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.titleSmall}px ${FONTS.sans}`;
  const lines = wrapText(ctx, opts.lessonTitle, 1050);
  let y = 320;
  for (const line of lines.slice(0, 2)) {
    ctx.fillText(line, cx, y);
    y += 86;
  }

  ctx.fillStyle = accent;
  ctx.font = `600 ${FONT_SIZES.bodySmall}px ${FONTS.sans}`;
  ctx.fillText(opts.weekTitle, cx, 470);
}

function renderArticle(ctx: CanvasRenderingContext2D, opts: ArticleCanvasOptions) {
  const cx = CANVAS.width / 2;

  if (opts.category) {
    ctx.fillStyle = COLORS.accent;
    ctx.font = `600 ${FONT_SIZES.eyebrow - 2}px ${FONTS.sans}`;
    ctx.textAlign = "center";
    ctx.fillText(opts.category.toUpperCase(), cx, 210);
  }

  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.titleSmall + 2}px ${FONTS.sans}`;
  ctx.textAlign = "center";
  const lines = wrapText(ctx, opts.articleTitle, 1050);
  let y = opts.category ? 290 : 260;
  for (const line of lines.slice(0, 2)) {
    ctx.fillText(line, cx, y);
    y += 86;
  }
}

function renderDefault(
  ctx: CanvasRenderingContext2D,
  _opts: DefaultCanvasOptions,
  labels: (typeof LABELS)["en"],
) {
  const cx = CANVAS.width / 2;

  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.title + 2}px ${FONTS.display}`;
  ctx.textAlign = "center";
  ctx.fillText("Sleep Better,", cx, 260);
  ctx.fillText("Starting Tonight", cx, 350);

  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 ${FONT_SIZES.bodySmall}px ${FONTS.sans}`;
  ctx.fillText(labels.shareFallback, cx, 430);
}

function renderError(
  ctx: CanvasRenderingContext2D,
  opts: ErrorCanvasOptions,
  labels: (typeof LABELS)["en"],
) {
  const cx = CANVAS.width / 2;

  ctx.fillStyle = COLORS.danger;
  ctx.font = `600 ${FONT_SIZES.bodySmall - 6}px ${FONTS.sans}`;
  ctx.textAlign = "center";
  ctx.fillText("⚠", cx, 230);

  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${FONT_SIZES.error}px ${FONTS.sans}`;
  ctx.fillText(labels.tryAgain, cx, 320);

  ctx.fillStyle = COLORS.muted;
  ctx.font = `500 ${FONT_SIZES.caption - 2}px ${FONTS.sans}`;
  const msg = opts.errorMessage || "Image upload failed";
  const lines = wrapText(ctx, msg, 900);
  let y = 390;
  for (const line of lines.slice(0, 2)) {
    ctx.fillText(line, cx, y);
    y += 40;
  }
}

const builtInTemplates: Record<ShareTemplate, ShareTemplateRenderer<AnyShareCanvasOptions>> = {
  dashboard: renderDashboard as ShareTemplateRenderer<AnyShareCanvasOptions>,
  diary: renderDiary as ShareTemplateRenderer<AnyShareCanvasOptions>,
  assessment: renderAssessment as ShareTemplateRenderer<AnyShareCanvasOptions>,
  program: renderProgram as ShareTemplateRenderer<AnyShareCanvasOptions>,
  article: renderArticle as ShareTemplateRenderer<AnyShareCanvasOptions>,
  default: renderDefault as ShareTemplateRenderer<AnyShareCanvasOptions>,
  error: renderError as ShareTemplateRenderer<AnyShareCanvasOptions>,
};

function renderTemplate(
  ctx: CanvasRenderingContext2D,
  opts: AnyShareCanvasOptions,
  labels: (typeof LABELS)["en"],
) {
  const renderer =
    customTemplates.get(opts.template) ?? builtInTemplates[opts.template as ShareTemplate];
  if (!renderer) {
    renderDefault(ctx, { template: "default" }, labels);
    return;
  }
  renderer(ctx, opts, labels);
}

// =============================================================================
// Validation
// =============================================================================

function validateShareParams(params: Record<string, unknown>): boolean {
  if (!params || typeof params !== "object") return false;
  return Object.entries(params).every(([_, value]) => value !== undefined && value !== null);
}

function validateUploadFileInternal(
  file: File,
): { valid: true } | { valid: false; error: ShareUploadErrorType; msg: string } {
  if (file.type !== "image/png") {
    return {
      valid: false,
      error: ShareUploadErrorType.PngFormatInvalid,
      msg: "Only PNG images are allowed.",
    };
  }
  if (file.size > 5 * 1024 * 1024) {
    return {
      valid: false,
      error: ShareUploadErrorType.FileSizeOverLimit,
      msg: "File cannot exceed 5MB.",
    };
  }
  return { valid: true };
}

// =============================================================================
// Error wrapper
// =============================================================================

async function wrapShareError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Share service error";
    if (typeof window !== "undefined") {
      toast.error(message);
    }
    throw err;
  }
}

// =============================================================================
// Blob hashing / upload deduplication helpers
// =============================================================================

async function hashBlob(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const uploadCache = new Map<string, string>();

// =============================================================================
// Public API
// =============================================================================

/**
 * Generate a standard 1200×630 share card canvas blob.
 *
 * When the supplied options are invalid or data is missing, a fallback error
 * card is rendered instead of throwing, so share previews never appear blank.
 *
 * @param options - Canvas template config including template type and metric data.
 * @returns PNG image binary blob.
 */
export async function generateImage(options: AnyShareCanvasOptions): Promise<Blob> {
  return wrapShareError(async () => {
    const start = performance.now();
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS.width;
    canvas.height = CANVAS.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not acquire 2D canvas context");
    }

    const lang = options.lang ?? getActiveLang();
    const labels = LABELS[lang];
    const params = options as unknown as Record<string, unknown>;

    drawBackground(ctx);
    drawBrand(ctx);
    drawFooter(ctx);

    if (!validateShareParams(params)) {
      renderError(ctx, { template: "error", errorMessage: labels.tryAgain }, labels);
    } else {
      renderTemplate(ctx, options, labels);
    }

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob returned null"));
          return;
        }
        const spendMs = Math.round(performance.now() - start);
        trackImageGenerate(String(options.template), spendMs);
        resolve(blob);
      }, "image/png");
    });
  });
}

/**
 * Generate a share card blob and upload it once to R2, returning both the blob
 * and its public URL. This is the unified path used by share previews and OG
 * meta tags so the same R2 asset is reused instead of rendered/uploaded twice.
 *
 * @param options    - Canvas template config.
 * @param filename   - Destination object key, e.g. "dashboard-84-7.png".
 * @param pageSource - Logical page source for analytics.
 * @returns `{ blob, publicUrl }` for the single uploaded asset.
 */
export async function generateAndUploadImage(
  options: AnyShareCanvasOptions,
  filename: string,
  pageSource = "unknown",
): Promise<{ blob: Blob; publicUrl: string }> {
  const blob = await generateImage(options);
  const publicUrl = await uploadImage(blob, filename, pageSource);
  return { blob, publicUrl };
}

/**
 * Generate a share card blob and immediately produce a public R2 data URL
 * without uploading. Useful for preview panels inside the ShareModal.
 *
 * @param options - Canvas template config.
 * @returns Data URL of the generated PNG.
 */
export async function generateImageDataUrl(options: AnyShareCanvasOptions): Promise<string> {
  const blob = await generateImage(options);
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Upload a generated PNG image blob to the R2 bucket.
 *
 * @param imageBlob - PNG image binary blob.
 * @param filename  - Destination object key, e.g. "dashboard-84-7.png".
 * @param pageSource- Logical page source for analytics (e.g. "dashboard", "diary").
 * @returns The public R2 CDN URL of the uploaded object.
 */
export async function uploadImage(
  imageBlob: Blob,
  filename: string,
  pageSource = "unknown",
): Promise<string> {
  return wrapShareError(async () => {
    if (!SHARE_IMAGE_HOSTING_ENABLED) {
      trackImageUploadError("hosting_disabled", pageSource);
      throw new Error("Image hosting is not configured.");
    }

    const hash = await hashBlob(imageBlob);
    const cached = uploadCache.get(hash);
    if (cached) return cached;

    const sizeKb = Math.round(imageBlob.size / 1024);
    const form = new FormData();
    form.append("file", imageBlob, filename);

    const res = await fetch("/api/share/upload", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      trackImageUploadError(data.error || "network", pageSource);
      throw new Error(data.error || `Upload failed (${res.status})`);
    }

    const data = (await res.json()) as { success?: boolean; url?: string; key?: string };
    if (!data.success || !data.url) {
      trackImageUploadError("network", pageSource);
      throw new Error("Upload response missing URL");
    }

    trackImageUpload(sizeKb, pageSource);
    uploadCache.set(hash, data.url);
    return data.url;
  });
}

/**
 * Convert an R2 object key into its public CDN URL.
 *
 * @param r2ObjectKey - The key stored in the R2 bucket.
 * @returns Full public HTTPS R2 URL.
 */
export function getPublicUrl(r2ObjectKey: string): string {
  return shareImageUrl(r2ObjectKey);
}

/** Build the standardized params object passed to every platform adapter. */
function buildPlatformParams(ctx: Omit<ShareContext, "params">): SharePlatformParams {
  return {
    pageUrl: ctx.pageUrl,
    title: ctx.title,
    description: ctx.description,
    imageUrl: ctx.imageUrl,
  };
}

/**
 * Unified entry point to trigger sharing on any supported social platform.
 * The language is resolved automatically from the active app language unless
 * explicitly provided.
 *
 * @param platform    - Target social platform (string for backward compatibility or enum for type safety).
 * @param pageUrl     - The page URL to share.
 * @param title       - Title / headline text.
 * @param desc        - Description text.
 * @param imageUrl    - Public image URL (required for Pinterest).
 * @param options     - Optional overrides: lang, efficiency, contentType.
 */
export function share(
  platform: SharePlatformType | SharePlatform | string,
  pageUrl: string,
  title: string,
  desc: string,
  imageUrl: string,
  options: {
    lang?: Lang;
    efficiency?: number;
    contentType?: string;
  } = {},
): void {
  if (!validateShareParams({ platform, pageUrl, title, desc, imageUrl })) {
    throw new Error("Invalid share parameters");
  }

  const lang = options.lang ?? getActiveLang();
  const efficiency = options.efficiency ?? 75;
  const contentType = options.contentType ?? "default";
  const context = `share-service:${contentType}`;
  const normalizedPlatform = normalizePlatform(platform);

  const baseContext: Omit<ShareContext, "params"> = {
    platform: normalizedPlatform,
    pageUrl,
    title,
    description: desc,
    imageUrl,
    lang,
    efficiency,
    contentType,
  };
  const ctx: ShareContext = { ...baseContext, params: buildPlatformParams(baseContext) };

  const customAdapter = customPlatforms.get(normalizedPlatform);
  if (customAdapter) {
    const url = customAdapter.buildUrl(ctx);
    const analyticsDetail = customAdapter.buildAnalyticsParams?.(ctx) ?? {
      pageRoute: context,
      templateType: contentType,
    };
    trackShareClick(normalizedPlatform as SharePlatformType, context, pageUrl, analyticsDetail);
    if (customAdapter.opensWindow !== false) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    return;
  }

  let url = "";

  switch (normalizedPlatform as SharePlatform) {
    case "pinterest":
      url = pinterestShareUrl(pageUrl, imageUrl, lang);
      break;
    case "x":
      url = xShareUrl(lang, efficiency, contentType);
      break;
    case "reddit":
      url = redditShareUrl(lang, efficiency, title);
      break;
    case "facebook": {
      const fbParams: SharePlatformParams = { pageUrl, title: desc };
      url = facebookShareUrl(fbParams);
      break;
    }
    case "linkedin": {
      const liParams: SharePlatformParams = { pageUrl, title, description: desc };
      url = linkedInShareUrl(liParams);
      break;
    }
    case "whatsapp":
      url = whatsAppShareUrl(lang, efficiency, pageUrl);
      break;
    case "weibo": {
      // Weibo share URL with title + public R2 image as `pic`.
      const weiboParams = new URLSearchParams({ url: pageUrl, title: title || desc });
      if (imageUrl && imageUrl.startsWith("http")) weiboParams.set("pic", imageUrl);
      url = `https://service.weibo.com/share/share.php?${weiboParams.toString()}`;
      break;
    }
    case "qq": {
      // QQ share URL with title, summary, and public R2 image as `pics`.
      const qqParams = new URLSearchParams({
        url: pageUrl,
        title: title || desc,
        summary: desc,
      });
      if (imageUrl && imageUrl.startsWith("http")) qqParams.set("pics", imageUrl);
      url = `https://connect.qq.com/widget/shareqq/index.html?${qqParams.toString()}`;
      break;
    }
    case "wechat":
      // WeChat is handled by the ShareModal via a QR code (desktop) or
      // long-press hint (mobile WeChat browser). No window is opened here.
      trackShareClick(SharePlatformType.WeChat, context, pageUrl, {
        pageRoute: context,
        templateType: contentType,
      });
      return;
    case "download":
      // Download is handled by the ShareModal via the Canvas blob.
      trackShareClick(SharePlatformType.Download, context, pageUrl, {
        pageRoute: context,
        templateType: contentType,
      });
      return;
    case "copy":
    default:
      void navigator.clipboard.writeText(pageUrl);
      toast.success("Link copied");
      trackShareClick(SharePlatformType.Copy, context, pageUrl, {
        pageRoute: context,
        templateType: contentType,
      });
      return;
  }

  trackShareClick(normalizedPlatform as SharePlatformType, context, pageUrl, {
    pageRoute: context,
    templateType: contentType,
  });
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Normalize legacy platform strings to the strict enum type. */
function normalizePlatform(
  platform: SharePlatformType | SharePlatform | string,
): SharePlatformType | string {
  if (typeof platform !== "string") return platform;
  const map: Record<string, SharePlatformType> = {
    pinterest: SharePlatformType.Pinterest,
    x: SharePlatformType.X,
    reddit: SharePlatformType.Reddit,
    facebook: SharePlatformType.Facebook,
    linkedin: SharePlatformType.LinkedIn,
    whatsapp: SharePlatformType.WhatsApp,
    wechat: SharePlatformType.WeChat,
    weibo: SharePlatformType.Weibo,
    qq: SharePlatformType.QQ,
    copy: SharePlatformType.Copy,
    download: SharePlatformType.Download,
  };
  return map[platform] ?? platform;
}

/**
 * Generate an Open Graph preview image blob and its public R2 URL using the
 * same `generateImage()` canvas blob. This avoids duplicate rendering/upload.
 *
 * @param options - OG canvas config.
 * @returns `{ blob, publicUrl }` for the single generated/uploaded asset.
 */
export async function generateOGImage(
  options: OGCanvasOptions,
): Promise<{ blob: Blob; publicUrl: string }> {
  const base: ShareCanvasOptions = {
    template: "default",
    lang: options.lang ?? getActiveLang(),
    title: options.title,
    subtitle: options.description,
  };

  let canvasOptions: AnyShareCanvasOptions;
  switch (options.type) {
    case "dashboard":
      canvasOptions = {
        ...base,
        template: "dashboard",
        efficiency: parseInt(options.resourceId.split("-")[0] || "0", 10) || 0,
        streakDays: parseInt(options.resourceId.split("-")[1] || "0", 10) || 0,
      } as DashboardCanvasOptions;
      break;
    case "assessment":
      canvasOptions = {
        ...base,
        template: "assessment",
        levelName: options.title || "Sleep Profile",
        levelDesc: options.description || "",
        efficiencyLabel: options.resourceId,
      } as AssessmentCanvasOptions;
      break;
    case "program":
      canvasOptions = {
        ...base,
        template: "program",
        weekNumber: parseInt(options.resourceId.split("-")[0] || "1", 10),
        lessonNumber: parseInt(options.resourceId.split("-")[1] || "1", 10),
        lessonTitle: options.title || "CBT-I Lesson",
        weekTitle: options.description || "",
      } as ProgramCanvasOptions;
      break;
    default:
      canvasOptions = base as AnyShareCanvasOptions;
  }

  const filename = `og-${options.type}-${options.resourceId}.png`;
  return generateAndUploadImage(canvasOptions, filename, `og-${options.type}`);
}

/**
 * Resolve a standardized OG image public URL for an already-uploaded asset.
 *
 * @param type - Logical page type.
 * @param resourceId - Stable resource identifier.
 * @returns Public R2 URL for the OG image.
 */
export function getOGImageUrl(
  type: "dashboard" | "assessment" | "program",
  resourceId: string,
): string {
  return shareImageUrl(`og-${type}-${resourceId}.png`);
}

/**
 * Generate, upload, and return the public URL for an OG preview image.
 * This is the recommended runtime path: it produces one canvas blob, uploads
 * it once, and returns the public R2 URL used for all OG/Twitter meta tags.
 *
 * @param options - OG canvas config.
 * @returns Public R2 URL of the uploaded OG image.
 */
export async function generateOGImageUrl(options: OGCanvasOptions): Promise<string> {
  const { publicUrl } = await generateOGImage(options);
  return publicUrl;
}

/**
 * Validate an upload file from the client side.
 *
 * @param file - File selected for upload.
 * @returns Validation result with a precise error enum and user-friendly message when invalid.
 */
export function validateUploadFile(
  file: File,
): { valid: true } | { valid: false; error: ShareUploadErrorType; msg: string } {
  return validateUploadFileInternal(file);
}

// Re-export centralized style config for consumers that need to build previews.
export { CANVAS, COLORS, FONTS, FONT_SIZES, SPACING, BRAND, SITE_HOST };
