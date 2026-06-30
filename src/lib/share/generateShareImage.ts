/**
 * Generate Share Image — Canvas → PNG rendering for Share Service v3.
 *
 * This module is the single entry point for rendering branded share-card PNGs.
 * It wraps the existing template renderers (dashboard, diary, assessment,
 * program, article, default, error) defined in `shareService.ts` and exposes
 * a clean, typed API:
 *
 *   generateShareImage(options) → Blob
 *   generateShareImageDataUrl(options) → string
 *   generateAndUploadShareImage(options, filename, pageSource) → { blob, publicUrl }
 *
 * All cards use the same Somna dark UI design language (glassmorphism,
 * rounded cards, calm accent colors) defined in `canvasConfig.ts`.
 *
 * The standard card size is 1200×630 (OG-friendly). A square 1200×1200
 * variant is available via the `square: true` option for platforms that
 * prefer square images (e.g. Pinterest, WeChat preview).
 */

import { generateImage, generateImageDataUrl } from "./shareService";
import { uploadToR2 } from "./uploadToR2";
import type { AnyShareCanvasOptions } from "./shareService";

/** Re-export the canvas options union so consumers can import from one place. */
export type { AnyShareCanvasOptions } from "./shareService";

/** Options for rendering + uploading a share image in one call. */
export interface GenerateAndUploadOptions {
  /** Canvas template config. */
  options: AnyShareCanvasOptions;
  /** Destination object key, e.g. "dashboard-84-7.png". */
  filename: string;
  /** Logical page source for analytics. */
  pageSource?: string;
}

/**
 * Generate a share-card PNG blob from canvas options.
 *
 * @param options - Canvas template config (template type + metric data).
 * @returns PNG image binary blob.
 */
export async function generateShareImage(options: AnyShareCanvasOptions): Promise<Blob> {
  return generateImage(options);
}

/**
 * Generate a share-card PNG and return it as a data URL (no upload).
 * Useful for preview panels inside the ShareModal.
 *
 * @param options - Canvas template config.
 * @returns Data URL of the generated PNG.
 */
export async function generateShareImageDataUrl(
  options: AnyShareCanvasOptions,
): Promise<string> {
  return generateImageDataUrl(options);
}

/**
 * Generate a share-card PNG, upload it once to R2, and return both the blob
 * and its public URL. This is the unified path used by share actions and OG
 * meta tags so the same R2 asset is reused instead of rendered/uploaded twice.
 *
 * The image is only uploaded when this function is called — never
 * automatically after Save Entry or page load.
 *
 * @param options    - Canvas template config.
 * @param filename   - Destination object key.
 * @param pageSource - Logical page source for analytics.
 * @returns `{ blob, publicUrl }` for the single uploaded asset.
 */
export async function generateAndUploadShareImage(
  options: AnyShareCanvasOptions,
  filename: string,
  pageSource = "unknown",
): Promise<{ blob: Blob; publicUrl: string }> {
  const blob = await generateShareImage(options);
  const publicUrl = await uploadToR2(blob, filename, pageSource);
  return { blob, publicUrl };
}

/**
 * Trigger a browser download of a share-image blob.
 *
 * @param blob     - PNG image blob.
 * @param filename - Suggested download filename.
 */
export function downloadShareImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick to ensure the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Trigger a browser download from a data URL.
 *
 * @param dataUrl  - PNG data URL.
 * @param filename - Suggested download filename.
 */
export function downloadShareImageFromDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
