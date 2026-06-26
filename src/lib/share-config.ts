// Central configuration for share-image hosting.
//
// Pinterest requires a real public https:// image URL (it fetches the image
// server-side). data: and blob: URLs do NOT work. We therefore upload the
// generated PNG to Cloudflare R2 and expose it under the base URL below.
//
// To enable Pinterest sharing:
//   1. Create the R2 bucket:  wrangler r2 bucket create somna-share
//   2. Enable public access on the bucket (r2.dev subdomain or a custom domain).
//   3. Set PUBLIC_SHARE_BASE_URL below to the public URL of that bucket.
//
// If PUBLIC_SHARE_BASE_URL is empty (or R2 is not bound), the app gracefully
// falls back to the "download the image first" workflow for Pinterest only.
// X, Reddit, and Copy Link sharing are unaffected.

/**
 * Public base URL where uploaded share images are served.
 * Must NOT have a trailing slash. Example: "https://share.somna.help"
 * Leave empty to disable R2 uploads and use the download-image fallback.
 */
export const PUBLIC_SHARE_BASE_URL = "https://share.somna.help";

/**
 * Whether R2-backed Pinterest sharing is enabled.
 * True only when a public base URL is configured.
 */
export const SHARE_IMAGE_HOSTING_ENABLED = PUBLIC_SHARE_BASE_URL.length > 0;

/**
 * Build the public URL for an uploaded share image.
 */
export function shareImageUrl(filename: string): string {
  return `${PUBLIC_SHARE_BASE_URL}/${filename}`;
}

/**
 * The R2 binding name used in wrangler.jsonc and accessed in server.ts.
 */
export const R2_BINDING_NAME = "SHARE_BUCKET" as const;
