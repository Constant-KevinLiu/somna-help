/**
 * Search-engine crawler detection helpers.
 *
 * Used in both the Cloudflare Worker entry (src/server.ts) and the React root
 * route (src/routes/__root.tsx) so that verified bots always receive a plain
 * 200 HTML response with full meta/hreflang content, and never see cookie
 * consent banners, Turnstile challenges, or other user-facing interstitials.
 */

/** Google-owned crawler User-Agent substrings. */
export const GOOGLE_BOT_USER_AGENTS = [
  "Googlebot",
  "Googlebot-Mobile",
  "Googlebot-Image",
  "Googlebot-Video",
  "Googlebot-News",
  "Mediapartners-Google",
  "AdsBot-Google",
  "AdsBot-Google-Mobile",
  "AdsBot-Google-Mobile-Apps",
  "APIs-Google",
  "DuplexWeb-Google",
  "FeedFetcher-Google",
  "Google-Read-Aloud",
  "Google Favicon",
  "Storebot-Google",
  "GoogleProducer",
  "Google-InspectionTool",
  "GoogleOther",
  "GoogleOther-Image",
  "GoogleOther-Video",
  "Google-Site-Verification",
  "Google-Adwords-Express",
  "Google-Apps-Script",
] as const;

/** Returns true when the given User-Agent belongs to a known Google crawler. */
export function isGoogleBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return GOOGLE_BOT_USER_AGENTS.some((snippet) => userAgent.includes(snippet));
}

/** Additional major search crawlers (Bing, DuckDuckGo, etc.) for future use. */
export const OTHER_BOT_USER_AGENTS = [
  "bingbot",
  "BingPreview",
  "DuckDuckBot",
  "DuckDuckGo-Favicons-Bot",
  "Slurp",
  "Baiduspider",
  "YandexBot",
  "YandexImages",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "Applebot",
  "SemrushBot",
  "AhrefsBot",
  "MJ12bot",
  "DotBot",
] as const;

/** Returns true for any recognized search/social crawler. */
export function isCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent;
  return (
    isGoogleBot(ua) ||
    OTHER_BOT_USER_AGENTS.some((snippet) => ua.includes(snippet))
  );
}
