// Central configuration for share-image hosting.
//
// Pinterest requires a real public https:// image URL (it fetches the image
// server-side). data: and blob: URLs do NOT work. We therefore upload the
// generated PNG to Cloudflare R2 and expose it under the base URL below.
//
// Setup steps for maintainers:
//   1. Create the R2 bucket:  wrangler r2 bucket create somna-share
//   2. Enable public access on the bucket (r2.dev subdomain or custom domain).
//   3. Bind the bucket in wrangler.jsonc as SHARE_BUCKET.
//   4. Set PUBLIC_SHARE_BASE_URL environment variable to the public URL.
//
// Domain switch rule:
//   - The code reads PUBLIC_SHARE_BASE_URL from import.meta.env at build/runtime.
//   - When the custom production domain share.somna.help is launched, simply
//     update the environment variable. No business code changes are required.
//   - The fallback value matches the official Cloudflare R2 Public Development
//     URL from the architecture diagram.
//
// Security rule:
//   - Only public R2 URLs (r2.dev subdomains or custom public domains) may be
//     used in client-side code. The private S3 API endpoint
//     *.r2.cloudflarestorage.com must never appear in the frontend bundle.

/** Official Cloudflare R2 Public Development URL for the somna-share bucket. */
const OFFICIAL_R2_PUBLIC_URL = "https://pub-d4e88771abf4204879658307182abe9.r2.dev";

/** Pattern that matches the private R2 S3 API endpoint. */
export const PRIVATE_R2_ENDPOINT_PATTERN = /\.r2\.cloudflarestorage\.com/i;

/** Pattern that matches public R2 development subdomains. */
export const PUBLIC_R2_DEV_PATTERN = /\.r2\.dev$/i;

/**
 * Resolve the public base URL for uploaded share images.
 * Prefers the PUBLIC_SHARE_BASE_URL environment variable, then falls back to
 * the official R2 Public Development URL.
 */
function resolvePublicShareBaseUrl(): string {
  const env =
    typeof import.meta.env !== "undefined" && import.meta.env.PUBLIC_SHARE_BASE_URL
      ? String(import.meta.env.PUBLIC_SHARE_BASE_URL)
      : "";
  return env.replace(/\/$/, "") || OFFICIAL_R2_PUBLIC_URL;
}

/**
 * Public base URL where uploaded share images are served.
 * Must NOT have a trailing slash. Example: "https://share.somna.help"
 */
export const PUBLIC_SHARE_BASE_URL: string = resolvePublicShareBaseUrl();

/**
 * Whether R2-backed Pinterest sharing is enabled.
 * True only when a public base URL is configured.
 */
export const SHARE_IMAGE_HOSTING_ENABLED = PUBLIC_SHARE_BASE_URL.length > 0;

/**
 * Guard helper: throw if a URL contains the private R2 S3 API endpoint.
 * Use this in any frontend code that builds or validates share image URLs.
 */
export function guardPublicR2Url(url: string): string {
  if (PRIVATE_R2_ENDPOINT_PATTERN.test(url)) {
    throw new Error("Private R2 endpoint detected in share URL. Use the public CDN URL only.");
  }
  return url;
}

/**
 * Build the public URL for an uploaded share image.
 */
export function shareImageUrl(filename: string): string {
  return guardPublicR2Url(`${PUBLIC_SHARE_BASE_URL}/${filename}`);
}

/**
 * The R2 binding name used in wrangler.jsonc and accessed in server.ts.
 */
export const R2_BINDING_NAME = "SHARE_BUCKET" as const;

/**
 * Build the OG image URL for the Dashboard page.
 * Used for server-side OG meta tags and client-side sharing.
 */
export function ogDashboardImageUrl(efficiency: number | null, streak: number): string {
  const eff = Math.round(efficiency ?? 0);
  return shareImageUrl(`somna-dashboard-${eff}-${streak}.png`);
}

/**
 * Build the OG image URL for the Assessment / Sleep Profile page.
 */
export function ogAssessmentImageUrl(level: string): string {
  const safeLevel = level.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return shareImageUrl(`somna-profile-${safeLevel}.png`);
}

/**
 * Build the OG image URL for Calculator pages (bedtime, nap, melatonin).
 */
export function ogCalculatorImageUrl(calculatorType: string, resultValue: string | number): string {
  return shareImageUrl(
    `somna-${calculatorType}-${String(resultValue)
      .replace(/:/g, "-")
      .replace(/[^a-z0-9]/g, "-")}.png`,
  );
}

/**
 * Build the OG image URL for the Program lesson page.
 */
export function ogProgramLessonImageUrl(
  weekNumber: number,
  lessonNumber: number,
  lessonSlug: string,
): string {
  return shareImageUrl(`somna-program-w${weekNumber}-l${lessonNumber}-${lessonSlug}.png`);
}
