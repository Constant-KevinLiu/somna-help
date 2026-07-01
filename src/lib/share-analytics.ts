// Local-only share analytics. No external services.
// Stores share events under a single localStorage key.

const SHARE_EVENTS_KEY = "somna.shareEvents";
const IMAGE_EVENTS_KEY = "somna.shareImageEvents";

/** Strictly-typed platform names used for analytics and adapter registration. */
export enum SharePlatformType {
  Pinterest = "pinterest",
  X = "x",
  Reddit = "reddit",
  Facebook = "facebook",
  LinkedIn = "linkedin",
  WhatsApp = "whatsapp",
  WeChat = "wechat",
  Weibo = "weibo",
  QQ = "qq",
  Discord = "discord",
  Threads = "threads",
  Copy = "copy",
  Download = "download",
}

export type ShareEventType =
  | "share_open"
  | "share_click"
  | "image_generated"
  | "upload_success"
  | "upload_failed"
  | "download_image"
  | "share_reddit"
  | "share_x"
  | "share_pinterest"
  | "share_facebook"
  | "share_linkedin"
  | "share_whatsapp"
  | "share_wechat"
  | "share_weibo"
  | "share_qq"
  | "share_discord"
  | "share_threads"
  | "copy_link";

export type ImageEventType = "image_generate" | "image_upload" | "image_upload_error";

/** Client-side upload validation error types returned by the share service. */
export enum ShareUploadErrorType {
  PngFormatInvalid = "PNG_FORMAT_INVALID",
  FileSizeOverLimit = "FILE_SIZE_OVER_LIMIT",
}

export interface ShareEvent {
  type: ShareEventType;
  context: string; // e.g. "dashboard", "assessment", "calculator", "article"
  url: string;
  timestamp: number;
  detail?: Record<string, unknown>;
}

export interface ImageEvent {
  type: ImageEventType;
  context: string;
  detail: Record<string, unknown>;
  timestamp: number;
}

function readEvents(): ShareEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SHARE_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events: ShareEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHARE_EVENTS_KEY, JSON.stringify(events));
  } catch {
    /* ignore quota / unavailable */
  }
}

function readImageEvents(): ImageEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(IMAGE_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeImageEvents(events: ImageEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(IMAGE_EVENTS_KEY, JSON.stringify(events));
  } catch {
    /* ignore quota / unavailable */
  }
}

/** Record a share event locally. */
export function trackShare(
  type: ShareEventType,
  context: string,
  url: string = typeof window !== "undefined" ? window.location.href : "",
  detail: Record<string, unknown> = {},
) {
  const events = readEvents();
  const event: ShareEvent = { type, context, url, timestamp: Date.now(), detail };
  events.push(event);
  writeEvents(events);
}

/** Record an image-generation event. */
export function trackImageGenerate(templateType: string, spendMs: number) {
  const events = readImageEvents();
  const event: ImageEvent = {
    type: "image_generate",
    context: templateType,
    detail: { renderTime: spendMs },
    timestamp: Date.now(),
  };
  events.push(event);
  writeImageEvents(events);
}

/** Record a successful image-upload event. */
export function trackImageUpload(fileSizeKb: number, pageSource = "unknown") {
  const events = readImageEvents();
  const event: ImageEvent = {
    type: "image_upload",
    context: pageSource,
    detail: { sizeKb: fileSizeKb, pageSource },
    timestamp: Date.now(),
  };
  events.push(event);
  writeImageEvents(events);
}

/** Record an image-upload failure event. */
export function trackImageUploadError(errorType: string, pageSource = "unknown") {
  const events = readImageEvents();
  const event: ImageEvent = {
    type: "image_upload_error",
    context: pageSource,
    detail: { error: errorType, pageSource },
    timestamp: Date.now(),
  };
  events.push(event);
  writeImageEvents(events);
}

/** Map a platform enum value to the corresponding analytics event type. */
const PLATFORM_EVENT_MAP: Record<SharePlatformType, ShareEventType> = {
  [SharePlatformType.Pinterest]: "share_pinterest",
  [SharePlatformType.X]: "share_x",
  [SharePlatformType.Reddit]: "share_reddit",
  [SharePlatformType.Facebook]: "share_facebook",
  [SharePlatformType.LinkedIn]: "share_linkedin",
  [SharePlatformType.WhatsApp]: "share_whatsapp",
  [SharePlatformType.WeChat]: "share_wechat",
  [SharePlatformType.Weibo]: "share_weibo",
  [SharePlatformType.QQ]: "share_qq",
  [SharePlatformType.Discord]: "share_discord",
  [SharePlatformType.Threads]: "share_threads",
  [SharePlatformType.Copy]: "copy_link",
  [SharePlatformType.Download]: "download_image",
};

/** Type-safe analytics entry point that only accepts valid platform enum values. */
export function trackShareClick(
  platform: SharePlatformType,
  context: string,
  url: string = typeof window !== "undefined" ? window.location.href : "",
  detail: Record<string, unknown> = {},
) {
  const type = PLATFORM_EVENT_MAP[platform];
  trackShare(type, context, url, { platform, ...detail });
}

/** Track when the Share modal is opened. */
export function trackShareOpen(
  context: string,
  url: string = typeof window !== "undefined" ? window.location.href : "",
  detail: Record<string, unknown> = {},
) {
  trackShare("share_open", context, url, detail);
}

/** Track when a share image is generated (Canvas → PNG). */
export function trackShareImageGenerated(context: string, detail: Record<string, unknown> = {}) {
  trackShare("image_generated", context, "", detail);
}

/** Track a successful image upload to R2. */
export function trackUploadSuccess(context: string, detail: Record<string, unknown> = {}) {
  trackShare("upload_success", context, "", detail);
}

/** Track a failed image upload to R2. */
export function trackUploadFailed(context: string, detail: Record<string, unknown> = {}) {
  trackShare("upload_failed", context, "", detail);
}

/** Read all recorded share events (for future dashboards/debugging). */
export function getShareEvents(): ShareEvent[] {
  return readEvents();
}

/** Read all recorded image events. */
export function getImageEvents(): ImageEvent[] {
  return readImageEvents();
}

/** Count events by type. */
export function shareEventCounts(): Record<ShareEventType, number> {
  const events = readEvents();
  const counts: Record<ShareEventType, number> = {
    share_open: 0,
    share_click: 0,
    image_generated: 0,
    upload_success: 0,
    upload_failed: 0,
    download_image: 0,
    share_reddit: 0,
    share_x: 0,
    share_pinterest: 0,
    share_facebook: 0,
    share_linkedin: 0,
    share_whatsapp: 0,
    share_wechat: 0,
    share_weibo: 0,
    share_qq: 0,
    share_discord: 0,
    share_threads: 0,
    copy_link: 0,
  };
  for (const e of events) {
    counts[e.type] = (counts[e.type] ?? 0) + 1;
  }
  return counts;
}

/** Count image events by type. */
export function imageEventCounts(): Record<ImageEventType, number> {
  const events = readImageEvents();
  const counts: Record<ImageEventType, number> = {
    image_generate: 0,
    image_upload: 0,
    image_upload_error: 0,
  };
  for (const e of events) {
    counts[e.type] = (counts[e.type] ?? 0) + 1;
  }
  return counts;
}
