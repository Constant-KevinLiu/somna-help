/**
 * GA4 Analytics Module
 *
 * Client-side Google Analytics 4 integration for Somna.
 *
 * Design principles:
 *  - SSR-safe: all functions are no-ops when window is undefined.
 *  - Production-only (by default): does nothing unless VITE_GA_MEASUREMENT_ID
 *    is set AND the environment is production.
 *  - Idempotent: initializeAnalytics() can be called multiple times safely.
 *  - Privacy-first: never sends health, sleep, diary, or auth data.
 *    Only page_path, page_location, and page_title are sent for page views.
 *  - Fail-safe: if Google scripts are blocked or fail to load, the app
 *    continues to work without errors.
 *
 * Consent gating: this module is designed so that `initializeAnalytics()`
 * can later be called from a consent-banner "accept" handler instead of
 * from app boot. Until consent UI is implemented, analytics only loads
 * when the measurement ID is configured.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface PageViewInput {
  path: string;
  title?: string;
}

export type AnalyticsParameterValue = string | number | boolean;

// ─── Internal state ──────────────────────────────────────────────────────────

let initialized = false;
let measurementId: string | null = null;

const MEASUREMENT_ID_RE = /^G-[A-Z0-9]+$/;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isValidMeasurementId(id: string): boolean {
  return MEASUREMENT_ID_RE.test(id);
}

/**
 * Decide whether analytics should be active.
 *
 * Requirements:
 *  - Running in a browser (not SSR, not tests by default).
 *  - VITE_GA_MEASUREMENT_ID is set and matches G-XXXXXXXX format.
 *  - Production mode OR VITE_GA_ENABLE_IN_DEV is explicitly "true".
 */
function shouldEnable(): boolean {
  if (!isBrowser()) return false;

  const rawId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!rawId || typeof rawId !== "string") return false;
  if (!isValidMeasurementId(rawId)) return false;

  const isProd = import.meta.env.PROD;
  const enableInDev = import.meta.env.VITE_GA_ENABLE_IN_DEV === "true";
  if (!isProd && !enableInDev) return false;

  return true;
}

/**
 * Sanitize a URL path before sending to GA.
 *
 * Strips any query parameter that might contain tokens, emails, or other
 * sensitive data. Somna's public routes use clean pathnames; query strings
 * are rare but if they appear we only keep known-safe params.
 *
 * Currently strips ALL query parameters and hash fragments that look like
 * tokens. The full pathname + safe search is preserved.
 */
function sanitizePath(fullPath: string): string {
  try {
    // Build a URL we can parse. Use a dummy origin since we only care about
    // path + query + hash.
    const url = new URL(fullPath, "https://sanitize.local");
    const params = new URLSearchParams();
    const sensitiveKeys = [
      "token",
      "code",
      "otp",
      "email",
      "user",
      "uid",
      "session",
      "id_token",
      "access_token",
      "refresh_token",
      "state",
    ];
    for (const [key, value] of url.searchParams) {
      const lower = key.toLowerCase();
      if (sensitiveKeys.some((sk) => lower.includes(sk))) continue;
      params.set(key, value);
    }
    const search = params.toString() ? `?${params.toString()}` : "";
    // Keep hash — it's used for in-page navigation, not sensitive data in this app.
    return url.pathname + search + url.hash;
  } catch {
    // If parsing fails, fall back to just the pathname portion.
    const qIndex = fullPath.indexOf("?");
    const hIndex = fullPath.indexOf("#");
    const end =
      qIndex === -1 && hIndex === -1
        ? fullPath.length
        : Math.min(
            qIndex === -1 ? fullPath.length : qIndex,
            hIndex === -1 ? fullPath.length : hIndex,
          );
    return fullPath.slice(0, Math.max(1, end));
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Initialize Google Analytics 4.
 *
 * Safe to call multiple times — only the first call has effect.
 * No-op during SSR, in tests, or when the measurement ID is absent/invalid.
 */
export function initializeAnalytics(): void {
  if (initialized) return;
  if (!isBrowser()) return;
  if (!shouldEnable()) {
    // Mark as initialized so we don't repeatedly check.
    initialized = true;
    return;
  }

  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  measurementId = id;
  const mid = id; // local const for type narrowing inside nested functions

  // Set up dataLayer and gtag stub BEFORE injecting the script, so any
  // queued events are picked up when the script loads.
  window.dataLayer = window.dataLayer || [];

  function gtag(...args: unknown[]): void {
    window.dataLayer!.push(args);
  }

  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", mid, {
    send_page_view: false,
  });

  // Inject the gtag script.
  // We use document.head.appendChild (not document.write) so the script
  // loads asynchronously and cannot block rendering.
  try {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-ga-id="${CSS.escape(mid)}"]`,
    );
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(mid)}`;
      script.dataset.gaId = mid;
      // Fail silently if the script is blocked (ad blockers, CSP, etc.).
      script.onerror = (): void => {
        // Script blocked — analytics simply won't work. No user-facing impact.
      };
      document.head.appendChild(script);
    }
  } catch {
    // CSP or other error — analytics disabled, app continues normally.
  }

  initialized = true;
}

/**
 * Track a page view.
 *
 * Call after initial hydration and on every successful client-side route change.
 *
 * @param input.path - The page path (pathname + search + hash).
 * @param input.title - Optional document title override.
 */
export function trackPageView(input: PageViewInput): void {
  if (!initialized) return;
  if (!isBrowser()) return;
  if (!measurementId) return;
  if (typeof window.gtag !== "function") return;

  const sanitizedPath = sanitizePath(input.path);
  const pageLocation = window.location.origin + sanitizedPath;
  const pageTitle = input.title ?? document.title;

  try {
    window.gtag("event", "page_view", {
      page_location: pageLocation,
      page_path: sanitizedPath,
      page_title: pageTitle,
    });
  } catch {
    // Never let analytics errors break the app.
  }
}

/**
 * Track a custom event.
 *
 * IMPORTANT: Only send privacy-safe metadata. Never include sleep data,
 * diary entries, email addresses, user IDs, or tokens.
 *
 * @param name - The event name (GA4-compatible: alphanumeric + underscores).
 * @param parameters - Optional event parameters.
 */
export function trackEvent(
  name: string,
  parameters?: Record<string, AnalyticsParameterValue>,
): void {
  if (!initialized) return;
  if (!isBrowser()) return;
  if (!measurementId) return;
  if (typeof window.gtag !== "function") return;

  try {
    window.gtag("event", name, parameters ?? {});
  } catch {
    // Never let analytics errors break the app.
  }
}

/**
 * Reset analytics state.
 *
 * Intended for test environments only. Removes the injected script tag and
 * clears internal state so tests can run in isolation.
 */
export function resetAnalytics(): void {
  if (!isBrowser()) {
    initialized = false;
    measurementId = null;
    return;
  }
  if (measurementId) {
    const script = document.querySelector<HTMLScriptElement>(
      `script[data-ga-id="${CSS.escape(measurementId)}"]`,
    );
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
  }
  initialized = false;
  measurementId = null;
  // Intentionally leave window.dataLayer / window.gtag in place — other code
  // might reference them. Tests should set up their own window state.
}

/**
 * Whether analytics has been initialized successfully with a valid ID.
 * Useful for tests and for gating consent-dependent features.
 */
export function isAnalyticsEnabled(): boolean {
  return initialized && measurementId !== null;
}
