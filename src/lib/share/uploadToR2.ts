/**
 * Upload to Cloudflare R2 — the single upload entry point for Share Service v3.
 *
 * This module wraps the existing `/api/share/upload` multipart endpoint
 * (handled by `src/server.ts`) and adds:
 *   - SHA-256 content-hash deduplication (in-memory session cache)
 *   - client-side PNG + 5MB validation
 *   - analytics tracking via `@/lib/share-analytics`
 *   - a thin `uploadShareImageFromDataUrl` helper for the legacy
 *     data-URL workflow used by the v1 ShareCards
 *
 * The public R2 Development URL remains the upload target. Images are only
 * uploaded when a user explicitly clicks **Share** — never automatically
 * after Save Entry or page load.
 */

import {
  trackImageUpload,
  trackImageUploadError,
  ShareUploadErrorType,
} from "@/lib/share-analytics";
import { SHARE_IMAGE_HOSTING_ENABLED, shareImageUrl } from "@/lib/share-config";

/** Result of validating an upload file. */
export type UploadValidationResult =
  | { valid: true }
  | { valid: false; error: ShareUploadErrorType; msg: string };

/** Maximum allowed upload size (5 MB). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Validate an upload file client-side before sending it to R2.
 *
 * @param file - File selected for upload.
 * @returns Validation result with a precise error enum and message when invalid.
 */
export function validateUploadFile(file: File): UploadValidationResult {
  if (file.type !== "image/png") {
    return {
      valid: false,
      error: ShareUploadErrorType.PngFormatInvalid,
      msg: "Only PNG images are allowed.",
    };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      error: ShareUploadErrorType.FileSizeOverLimit,
      msg: "File cannot exceed 5MB.",
    };
  }
  return { valid: true };
}

/**
 * Compute the SHA-256 hash of a blob for deduplication.
 */
async function hashBlob(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * In-memory session cache mapping content hash → public R2 URL.
 * Reusing the uploaded URL when the content has not changed avoids duplicate
 * uploads during a single session.
 */
const uploadCache = new Map<string, string>();

/** Clear the in-memory upload cache (useful for tests). */
export function clearUploadCache(): void {
  uploadCache.clear();
}

/**
 * Upload a PNG image blob to the Cloudflare R2 bucket via the
 * `/api/share/upload` multipart endpoint.
 *
 * Deduplication: if a blob with the same SHA-256 hash was already uploaded
 * this session, the cached public URL is returned without re-uploading.
 *
 * @param imageBlob  - PNG image binary blob.
 * @param filename   - Destination object key, e.g. "dashboard-84-7.png".
 * @param pageSource - Logical page source for analytics (e.g. "dashboard").
 * @returns The public R2 CDN URL of the uploaded object.
 * @throws If image hosting is disabled, the upload fails, or the response is malformed.
 */
export async function uploadToR2(
  imageBlob: Blob,
  filename: string,
  pageSource = "unknown",
): Promise<string> {
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
}

/**
 * Convert a data URL (as produced by Canvas `toDataURL`) into a Blob.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:([^;]+)/)?.[1] ?? "image/png";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Upload a share image from a data URL (the workflow used by the v1
 * ShareCards and the ShareModal preview). Validates the file before upload.
 *
 * @param dataUrl    - PNG data URL from Canvas `toDataURL`.
 * @param filename   - Destination object key.
 * @param pageSource - Logical page source for analytics.
 * @returns The public R2 CDN URL, or null if hosting is disabled or upload fails.
 */
export async function uploadShareImageFromDataUrl(
  dataUrl: string,
  filename: string,
  pageSource = "unknown",
): Promise<string | null> {
  if (!SHARE_IMAGE_HOSTING_ENABLED) return null;

  const blob = dataUrlToBlob(dataUrl);
  const file = new File([blob], filename, { type: blob.type });
  const validation = validateUploadFile(file);
  if (!validation.valid) {
    trackImageUploadError(validation.error, pageSource);
    return null;
  }

  try {
    return await uploadToR2(blob, filename, pageSource);
  } catch {
    return null;
  }
}

/**
 * Resolve the public R2 CDN URL for an already-uploaded object key.
 * This does not upload — it only constructs the URL.
 */
export function getPublicUrl(r2ObjectKey: string): string {
  return shareImageUrl(r2ObjectKey);
}
