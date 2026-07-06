"use client";

import { useCallback } from "react";
import { TurnstileWidget } from "./TurnstileWidget";
import { useCrawler } from "@/lib/crawler-context";
import { isSearchEngineBot } from "@/lib/crawler";

export interface TurnstileProviderProps {
  /** Cloudflare Turnstile sitekey. Falls back to PUBLIC_TURNSTILE_SITE_KEY. */
  siteKey?: string;
  /** Maximum number of auto-retries for the global verification widget. */
  maxRetries?: number;
}

/**
 * Global Turnstile mount point.
 *
 * Rendered once in the root route. The actual widget is only injected on the
 * client and is skipped entirely for search-engine crawlers, so bot traffic
 * always receives clean HTML with full SEO markup.
 */
export function TurnstileProvider({ siteKey, maxRetries = 3 }: TurnstileProviderProps) {
  const { isCrawler: contextIsCrawler } = useCrawler();
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isCrawler = contextIsCrawler || isSearchEngineBot(ua);

  const handleVerify = useCallback((token: string) => {
    // TODO: validate token server-side or store in global auth state.
    // eslint-disable-next-line no-console
    console.log("[TurnstileProvider] verified", token);
  }, []);

  const handleError = useCallback((errorCode: string) => {
    // Non-retryable or max-retries-exceeded errors surface here.
    // eslint-disable-next-line no-console
    console.error("[TurnstileProvider] error", errorCode);
  }, []);

  // Do not render Turnstile for any search-engine crawler.
  if (isCrawler) {
    return null;
  }

  return (
    <TurnstileWidget
      siteKey={siteKey}
      action="site-verify"
      maxRetries={maxRetries}
      onVerify={handleVerify}
      onError={handleError}
      className="fixed bottom-4 right-4 z-50"
    />
  );
}
