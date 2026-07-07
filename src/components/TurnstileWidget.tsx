"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

import { useCrawler } from "@/lib/crawler-context";
import { isSearchEngineBot } from "@/lib/crawler";

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
  /** Maximum number of auto-retries after recoverable errors. */
  maxRetries?: number;
}

const DEFAULT_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Error codes that Cloudflare Turnstile may emit for transient failures. */
const RETRYABLE_ERROR_CODES = new Set([
  "undefined",
  "null",
  "",
  "timeout-or-duplicate",
  "bad-request",
  "internal-error",
  "500",
  "503",
]);

/** Returns true when the widget should automatically retry the challenge. */
function isRetryableError(errorCode: string): boolean {
  return RETRYABLE_ERROR_CODES.has(errorCode?.trim?.() ?? "");
}

/**
 * Cloudflare Turnstile widget wrapper.
 *
 * Safety guarantees:
 * - Does not render for search-engine crawlers (SSR context + client UA guard).
 * - Does not render during SSR / first paint to avoid hydration mismatch.
 * - Fails open in development when no site key is configured.
 * - Automatically retries recoverable Turnstile errors up to `maxRetries` times
 *   with exponential backoff, matching Cloudflare's recommended client behavior.
 */
export function TurnstileWidget({
  siteKey = DEFAULT_SITE_KEY,
  action = "default",
  cData,
  onVerify,
  onError,
  onExpire,
  className,
  maxRetries = 3,
}: TurnstileWidgetProps) {
  const { isCrawler: contextIsCrawler } = useCrawler();
  const [isClient, setIsClient] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Double-guard: SSR crawler context + client-side UA check for CSR navigation.
  // Covers Google, Bing, DuckDuckGo, Apple, Yandex, Baidu and other verified bots.
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isCrawler = contextIsCrawler || isSearchEngineBot(ua);

  const scheduleRetry = useCallback(
    (errorCode: string) => {
      if (retryCount >= maxRetries) {
        setLastError(errorCode);
        onError?.(errorCode);
        return;
      }

      const nextRetry = retryCount + 1;
      // Exponential backoff: 1s, 2s, 4s.
      const delayMs = 1000 * 2 ** (nextRetry - 1);

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(nextRetry);
        // Force the Turnstile component to remount and fetch a fresh challenge.
        setWidgetKey((k) => k + 1);
      }, delayMs);
    },
    [retryCount, maxRetries, onError],
  );

  const handleSuccess = useCallback(
    (token: string) => {
      setRetryCount(0);
      setLastError(null);
      onVerify?.(token);
    },
    [onVerify],
  );

  const handleError = useCallback(
    (errorCode: string) => {
      setLastError(errorCode);
      if (isRetryableError(errorCode)) {
        scheduleRetry(errorCode);
      } else {
        onError?.(errorCode);
      }
    },
    [onError, scheduleRetry],
  );

  const handleExpire = useCallback(
    (token: string) => {
      // Expired tokens are recoverable: remount to request a new challenge.
      scheduleRetry("timeout-or-duplicate");
      onExpire?.(token);
    },
    [onExpire, scheduleRetry],
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
        key={widgetKey}
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
          retry: "auto",
          refreshExpired: "auto",
        }}
      />
      {lastError && retryCount > 0 && retryCount < maxRetries && (
        <p className="sr-only" role="status">
          Verification failed ({lastError}). Retrying {retryCount}/{maxRetries}...
        </p>
      )}
    </div>
  );
}
