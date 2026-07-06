"use client";

import { useCallback, useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

import { useCrawler } from "@/lib/crawler-context";
import { isGoogleBot } from "@/lib/crawler";

export interface TurnstileWidgetProps {
  /** Cloudflare Turnstile sitekey. Falls back to PUBLIC_TURNSTILE_SITE_KEY. */
  siteKey?: string;
  /** Widget action identifier passed to Cloudflare analytics/validation. */
  action?: string;
  /** Customer payload attached to the challenge. */
  cData?: string;
  /** Called when the challenge succeeds and returns a token. */
  onVerify?: (token: string) => void;
  /** Called when the challenge fails. Receives the Turnstile error code. */
  onError?: (errorCode: string) => void;
  /** Called when the challenge token expires. */
  onExpire?: (token: string) => void;
  /** Container className. */
  className?: string;
}

const DEFAULT_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";

/**
 * Cloudflare Turnstile widget wrapper.
 *
 * Safety guarantees:
 * - Does not render for search-engine crawlers (SSR context + client UA guard).
 * - Does not render during SSR / first paint to avoid hydration mismatch.
 * - Fails open in development when no site key is configured.
 */
export function TurnstileWidget({
  siteKey = DEFAULT_SITE_KEY,
  action = "default",
  cData,
  onVerify,
  onError,
  onExpire,
  className,
}: TurnstileWidgetProps) {
  const { isCrawler: contextIsCrawler } = useCrawler();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Double-guard: SSR crawler context + client-side UA check for CSR navigation.
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isCrawler = contextIsCrawler || isGoogleBot(ua);

  const handleSuccess = useCallback(
    (token: string) => {
      onVerify?.(token);
    },
    [onVerify],
  );

  const handleError = useCallback(
    (errorCode: string) => {
      onError?.(errorCode);
    },
    [onError],
  );

  const handleExpire = useCallback(
    (token: string) => {
      onExpire?.(token);
    },
    [onExpire],
  );

  if (isCrawler || !isClient) {
    return null;
  }

  if (!siteKey) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[TurnstileWidget] PUBLIC_TURNSTILE_SITE_KEY is not set");
    }
    return null;
  }

  return (
    <div className={className} aria-live="polite">
      <Turnstile
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={handleExpire}
        options={{
          action,
          cData,
          theme: "auto",
          size: "normal",
          language: "auto",
          appearance: "interaction-only",
        }}
      />
    </div>
  );
}
