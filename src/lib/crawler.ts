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

/** Major legitimate search-engine crawlers (SEO-friendly). */
export const SEARCH_ENGINE_BOT_USER_AGENTS = [
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
  "bingbot",
  "BingPreview",
  "DuckDuckBot",
  "DuckDuckGo-Favicons-Bot",
  "YandexBot",
  "YandexImages",
  "YandexRenderResourcesBot",
  "YandexAccessibilityBot",
  "YandexMobileBot",
  "Baiduspider",
  "Baiduspider-image",
  "Baiduspider-video",
  "Baiduspider-news",
  "Sogou web spider",
  "Sogou inst spider",
  "360Spider",
  "HaosouSpider",
  "Slurp",
  "Yahoo",
  "Applebot",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "Pinterestbot",
  "Snapchat",
  "TelegramBot",
  "Discordbot",
  "SkypeUriPreview",
  "Slackbot",
  "Embedly",
  "redditbot",
  "ShowyouBot",
  "Outbrain",
  "W3C_CSS_Validator",
  "W3C_Validator",
  "Validator.nu",
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/",
] as const;

/** Known unauthorized / aggressive AI scrapers and SEO tool bots. */
export const MALICIOUS_AI_BOT_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "ClaudeBot",
  "claude-web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "Bytespider",
  "ImagesiftBot",
  "Omgilibot",
  "Omgili",
  "Diffbot",
  "SemrushBot",
  "AhrefsBot",
  "MJ12bot",
  "DotBot",
  "DataForSeoBot",
  "AhrefsSiteAudit",
  "Screaming Frog",
  "rogerbot",
  "BrightEdge",
  "SiteAuditBot",
  "linkdexbot",
  "BLEXBot",
  "SERankingBot",
  "MojeekBot",
  "NeevaBot",
  "YouBot",
  "YaCy",
  "meta-externalagent",
  "Meta-ExternalFetcher",
  "Meta-ExternalAgent",
  "FacebookBot",
  "cohere-training-user-bot",
  "Webzio-Extended",
  "Seekport",
  "Timpibot",
  "VelenPublicWebCrawler",
  "Applebot-Extended",
  "Google-Extended",
  "https://www.searchmetrics.com",
  "Amazonbot",
  "bingbot-claude",
  "ChatGPT",
] as const;

/** Returns true for any recognized legitimate search-engine crawler. */
export function isSearchEngineBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent;
  return isGoogleBot(ua) || SEARCH_ENGINE_BOT_USER_AGENTS.some((snippet) => ua.includes(snippet));
}

/** Returns true for known malicious or unauthorized AI scrapers. */
export function isMaliciousAiBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return MALICIOUS_AI_BOT_USER_AGENTS.some((snippet) => userAgent.includes(snippet));
}

/** Returns true for any recognized search/social crawler or bot. */
export function isCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return isSearchEngineBot(userAgent) || isMaliciousAiBot(userAgent);
}
