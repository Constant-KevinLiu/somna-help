/**
 * Share Targets — platform URL builders for every supported social platform.
 *
 * This module centralizes the share-URL construction logic so that
 * `shareService.share(platform, payload)` can dispatch to any platform
 * without duplicating URL-building code. It covers:
 *
 *   Global:  Pinterest · X (Twitter) · Reddit · Facebook · LinkedIn · WhatsApp
 *   China:   WeChat (QR) · Weibo · QQ
 *   Utility: Copy Link · Download Image
 *
 * Each builder is a pure function that returns a fully-formed HTTPS share URL
 * (or, for Copy/Download, a sentinel handled by the service layer). The
 * builders never touch `window` or analytics — that is the service's job.
 */

import type { Lang } from "@/lib/i18n";
import { shareI18n, tr } from "./shareI18n";

/** Canonical platform identifiers used across the Share Service v3. */
export type SharePlatformId =
  // Global
  | "pinterest"
  | "x"
  | "reddit"
  | "facebook"
  | "linkedin"
  | "whatsapp"
  // China
  | "wechat"
  | "weibo"
  | "qq"
  // Utility
  | "copy"
  | "download";

/** All global (non-China) social platforms, in display order. */
export const GLOBAL_PLATFORMS: SharePlatformId[] = [
  "pinterest",
  "x",
  "reddit",
  "facebook",
  "linkedin",
  "whatsapp",
];

/** All China social platforms, in display order. */
export const CHINA_PLATFORMS: SharePlatformId[] = ["wechat", "weibo", "qq"];

/** Utility actions (not social platforms). */
export const UTILITY_PLATFORMS: SharePlatformId[] = ["copy", "download"];

/** Standardized input passed to every platform URL builder. */
export interface ShareTargetInput {
  /** The canonical page URL being shared. */
  pageUrl: string;
  /** Share title / headline. */
  title: string;
  /** Share description / summary. */
  description: string;
  /** Public HTTPS image URL (required by Pinterest, Weibo, QQ). */
  imageUrl: string;
  /** Active language. */
  lang: Lang;
  /** Sleep efficiency value (0-100), used in share copy. */
  efficiency: number;
  /** Logical content type, e.g. "dashboard", "assessment". */
  contentType: string;
}

/** Brand colors for share buttons (hex). */
export const PLATFORM_BRAND_COLORS: Record<SharePlatformId, string> = {
  pinterest: "#E60023",
  x: "#000000",
  reddit: "#FF4500",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  whatsapp: "#25D366",
  wechat: "#07C160",
  weibo: "#E6162D",
  qq: "#12B7F5",
  copy: "#7C8CFF",
  download: "#7C8CFF",
};

/** Localized button label for a platform. */
export function platformLabel(platform: SharePlatformId, lang: Lang): string {
  switch (platform) {
    case "pinterest":
      return tr(shareI18n.pinterest, lang);
    case "x":
      return tr(shareI18n.x, lang);
    case "reddit":
      return tr(shareI18n.reddit, lang);
    case "facebook":
      return tr(shareI18n.facebook, lang);
    case "linkedin":
      return tr(shareI18n.linkedin, lang);
    case "whatsapp":
      return tr(shareI18n.whatsapp, lang);
    case "wechat":
      return tr(shareI18n.wechat, lang);
    case "weibo":
      return tr(shareI18n.weibo, lang);
    case "qq":
      return tr(shareI18n.qq, lang);
    case "copy":
      return tr(shareI18n.copyLink, lang);
    case "download":
      return tr(shareI18n.downloadImage, lang);
    default:
      return platform;
  }
}

/** Whether clicking the platform button should open a new browser window. */
export function opensWindow(platform: SharePlatformId): boolean {
  return (
    platform === "pinterest" ||
    platform === "x" ||
    platform === "reddit" ||
    platform === "facebook" ||
    platform === "linkedin" ||
    platform === "whatsapp" ||
    platform === "weibo" ||
    platform === "qq"
  );
}

// =============================================================================
// Global platform URL builders
// =============================================================================

/** Pinterest pin-create URL. Requires a public HTTPS image URL. */
export function pinterestShareUrl(input: ShareTargetInput): string {
  const media = input.imageUrl.startsWith("http")
    ? input.imageUrl
    : `https://somna.help/${input.imageUrl}`;
  const desc = input.description || tr(shareI18n.defaultShareText, input.lang);
  const params = new URLSearchParams({
    url: input.pageUrl,
    media,
    description: desc,
  });
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
}

/** X (Twitter) intent URL. */
export function xShareUrl(input: ShareTargetInput): string {
  const eff = Math.round(input.efficiency);
  const base = tr(shareI18n.defaultShareText, input.lang);
  const text = input.title || base;
  const params = new URLSearchParams({ text, url: input.pageUrl });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/** Reddit submit URL. */
export function redditShareUrl(input: ShareTargetInput): string {
  const title = input.title || tr(shareI18n.defaultShareText, input.lang);
  const params = new URLSearchParams({ title, url: input.pageUrl });
  return `https://www.reddit.com/submit?${params.toString()}`;
}

/** Facebook sharer URL (relies on OG tags at the target page). */
export function facebookShareUrl(input: ShareTargetInput): string {
  const params = new URLSearchParams({ u: input.pageUrl });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/** LinkedIn share URL. */
export function linkedInShareUrl(input: ShareTargetInput): string {
  const params = new URLSearchParams({ url: input.pageUrl });
  if (input.title) params.set("title", input.title);
  if (input.description) params.set("summary", input.description);
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/** WhatsApp share URL. */
export function whatsappShareUrl(input: ShareTargetInput): string {
  const eff = Math.round(input.efficiency);
  const text = shareI18n.dashboardShareText[input.lang](eff) + " " + input.pageUrl;
  const params = new URLSearchParams({ text });
  return `https://wa.me/?${params.toString()}`;
}

// =============================================================================
// China platform URL builders
// =============================================================================

/**
 * WeChat does not support a direct web share URL. Sharing is handled by the
 * ShareModal via a QR code (desktop) or a long-press hint (mobile WeChat
 * browser). This builder returns an empty string to signal "no window open".
 */
export function wechatShareUrl(_input: ShareTargetInput): string {
  return "";
}

/** Weibo share URL. Uses the public R2 image URL as `pic`. */
export function weiboShareUrl(input: ShareTargetInput): string {
  const title = input.title || tr(shareI18n.defaultShareText, input.lang);
  const params = new URLSearchParams({
    url: input.pageUrl,
    title,
  });
  if (input.imageUrl && input.imageUrl.startsWith("http")) {
    params.set("pic", input.imageUrl);
  }
  return `https://service.weibo.com/share/share.php?${params.toString()}`;
}

/**
 * QQ share URL. Uses the uploaded R2 image as `pics`.
 *
 * If QQ blocks image loading from R2, callers can fall back to URL-only
 * sharing by omitting `imageUrl` (the builder will simply not attach `pics`).
 */
export function qqShareUrl(input: ShareTargetInput): string {
  const title = input.title || tr(shareI18n.defaultShareText, input.lang);
  const summary = input.description || tr(shareI18n.defaultShareText, input.lang);
  const params = new URLSearchParams({
    url: input.pageUrl,
    title,
    summary,
  });
  if (input.imageUrl && input.imageUrl.startsWith("http")) {
    params.set("pics", input.imageUrl);
  }
  return `https://connect.qq.com/widget/shareqq/index.html?${params.toString()}`;
}

// =============================================================================
// Master dispatcher
// =============================================================================

/**
 * Build the share URL for any platform. Returns an empty string for platforms
 * that do not open a window (WeChat QR, Copy, Download) — the service layer
 * handles those cases specially.
 */
export function buildShareUrl(platform: SharePlatformId, input: ShareTargetInput): string {
  switch (platform) {
    case "pinterest":
      return pinterestShareUrl(input);
    case "x":
      return xShareUrl(input);
    case "reddit":
      return redditShareUrl(input);
    case "facebook":
      return facebookShareUrl(input);
    case "linkedin":
      return linkedInShareUrl(input);
    case "whatsapp":
      return whatsappShareUrl(input);
    case "wechat":
      return wechatShareUrl(input);
    case "weibo":
      return weiboShareUrl(input);
    case "qq":
      return qqShareUrl(input);
    case "copy":
    case "download":
    default:
      return "";
  }
}
