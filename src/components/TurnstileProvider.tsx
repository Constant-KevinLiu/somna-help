"use client";

import { useCallback } from "react";
import { TurnstileWidget } from "./TurnstileWidget";

export interface TurnstileProviderProps {
  /** Cloudflare Turnstile sitekey. Falls back to PUBLIC_TURNSTILE_SITE_KEY. */
  siteKey?: string;
}

/**
 * Global Turnstile mount point.
 *
 * Rendered once in the root route. The actual widget is only injected on the
 * client and is skipped entirely for search-engine crawlers, so bot traffic
 * always receives clean HTML with full SEO markup.
 */
export function TurnstileProvider({ siteKey }: TurnstileProviderProps) {
  const handleVerify = useCallback((token: string) => {
    // TODO: validate token server-side or store in global auth state.
    // eslint-disable-next-line no-console
    console.log("[TurnstileProvider] verified", token);
  }, []);

  const handleError = useCallback((errorCode: string) => {
    // eslint-disable-next-line no-console
    console.error("[TurnstileProvider] error", errorCode);
  }, []);

  return (
    <TurnstileWidget
      siteKey={siteKey}
      action="site-verify"
      onVerify={handleVerify}
      onError={handleError}
      className="fixed bottom-4 right-4 z-50"
    />
  );
}
