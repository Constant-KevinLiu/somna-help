/**
 * QR Code generation for WeChat sharing.
 *
 * Generates QR codes locally in the browser — no server rendering required.
 * The QR code encodes the page URL (preferred) or, as a fallback, the public
 * R2 image URL so users can scan and open the shared content on any device.
 *
 * The `qrcode` library is lazy-loaded so it never impacts initial page weight.
 */

import type { Lang } from "@/lib/i18n";

/** Lazy-loaded qrcode module reference (cached after first import). */
type QRCodeModule = typeof import("qrcode");

let qrcodeModulePromise: Promise<QRCodeModule> | null = null;

/**
 * Lazily import the `qrcode` npm package. The module is cached so subsequent
 * calls resolve immediately. Safe to call during render — the import is
 * deferred until the WeChat modal is actually opened.
 */
function loadQrcode(): Promise<QRCodeModule> {
  if (!qrcodeModulePromise) {
    qrcodeModulePromise = import("qrcode");
  }
  return qrcodeModulePromise;
}

/** Options for rendering a QR code to a data URL. */
export interface QrRenderOptions {
  /** Pixel size of each module (dark square). Default 8. */
  scale?: number;
  /** Quiet-zone size in modules. Default 4. */
  margin?: number;
  /** Foreground color (dark modules). Default "#0B1020". */
  dark?: string;
  /** Background color (light modules). Default "#FFFFFF". */
  light?: string;
  /** Error-correction level. Default "M". */
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Generate a QR code as a PNG data URL.
 *
 * @param content  - The text/URL to encode.
 * @param options  - Render options.
 * @returns PNG data URL of the QR code.
 */
export async function generateQrDataUrl(
  content: string,
  options: QrRenderOptions = {},
): Promise<string> {
  const QRCode = await loadQrcode();
  return QRCode.toDataURL(content, {
    scale: options.scale ?? 8,
    margin: options.margin ?? 4,
    color: {
      dark: options.dark ?? "#0B1020",
      light: options.light ?? "#FFFFFF",
    },
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
  });
}

/**
 * Generate a QR code as an SVG string. Useful when a scalable QR is preferred
 * (e.g. for high-DPI displays or print).
 *
 * @param content  - The text/URL to encode.
 * @param options  - Render options.
 * @returns SVG string of the QR code.
 */
export async function generateQrSvg(
  content: string,
  options: QrRenderOptions = {},
): Promise<string> {
  const QRCode = await loadQrcode();
  return QRCode.toString(content, {
    type: "svg",
    margin: options.margin ?? 4,
    color: {
      dark: options.dark ?? "#0B1020",
      light: options.light ?? "#FFFFFF",
    },
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
  });
}

/**
 * Decide which URL the WeChat QR code should encode.
 *
 * Preference order:
 *   1. The current page URL (with optional `?share=...` param).
 *   2. The public R2 image URL as a fallback.
 *
 * @param pageUrl      - The canonical page URL.
 * @param shareId      - Optional share identifier appended as `?share=<id>`.
 * @param fallbackUrl  - Public R2 image URL used when no page URL is available.
 * @returns The URL to encode into the QR code.
 */
export function resolveQrContent(
  pageUrl: string,
  shareId?: string,
  fallbackUrl?: string,
): string {
  if (pageUrl) {
    try {
      const url = new URL(pageUrl);
      if (shareId) url.searchParams.set("share", shareId);
      return url.toString();
    } catch {
      // pageUrl is not a valid absolute URL — fall through to fallback.
    }
  }
  return fallbackUrl ?? pageUrl;
}

/**
 * Detect whether the current browser is the WeChat in-app browser.
 *
 * WeChat's in-app browser cannot scan a QR code (the camera is unavailable),
 * so the UI should hide the QR and instruct the user to long-press the image
 * instead.
 */
export function isWeChatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

/** Localized "long press to share" hint shown inside the WeChat in-app browser. */
export const WECHAT_LONG_PRESS_HINT: Record<Lang, string> = {
  en: "Long press the image to share.",
  zh: "长按图片即可分享",
  es: "Mantén pulsada la imagen para compartirla.",
};
