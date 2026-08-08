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

/**
 * The canonical gtag function signature.
 *
 * The real gtag() function is variadic and is called with `arguments` passed
 * (the IArguments object), which gtag.js processes from Google Tag Manager
 * expects on the dataLayer. We preserve that shape precisely so queued commands
 * are consumable by the real Google runtime.
 */
type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

export interface PageViewInput {
  pathname: string;
  search?: string;
  hash?: string;
  title?: string;
}

/**
 * @deprecated Use PageViewInput with pathname/search/hash instead.
 * Temporary backward-compat shape — callers should migrate.
 */
export interface LegacyPageViewInput {
  path: string;
  title?: string;
}

export type AnalyticsParameterValue = string | number | boolean;

// ─── Internal state ──────────────────────────────────────────────────────────

let initialized = false;
let measurementId: string | null = null;
/** Whether initialization was explicitly skipped (disabled / invalid ID / dev). */
let initializationSkipped = false;

const MEASUREMENT_ID_RE = /^G-[A-Z0-9]+$/;

// ─── Dev diagnostics ────────────────────────────────────────────────────────

/**
 * Privacy-safe development diagnostics.
 *
 * Only active when VITE_GA_DEBUG === "true". Never logs full URLs, query
 * strings, or sensitive values. Logs are short, stable reason strings so
 * developers can understand why a page_view was or wasn't sent without
 * exposing user data.
 *
 * The flag is read dynamically (not cached as a module-level const) so that
 * tests and runtime toggles can enable/disable diagnostics without a reload.
 */
function isDebugEnabled(): boolean {
  try {
    if (typeof import.meta === "undefined") return false;
    if (!import.meta.env) return false;
    return import.meta.env.VITE_GA_DEBUG === "true";
  } catch {
    return false;
  }
}

function debugLog(event: string, detail?: string): void {
  if (!isDebugEnabled()) return;
  if (!isBrowser()) return;
  try {
    const prefix = "[ga4]";
    if (detail !== undefined) {
      // eslint-disable-next-line no-console
      console.log(prefix, event, detail);
    } else {
      // eslint-disable-next-line no-console
      console.log(prefix, event);
    }
  } catch {
    // console access can fail in restricted environments — silently ignore.
  }
}

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
 *
 * Always returns a string — never throws. If input cannot be parsed safely,
 * returns "/" as a safe fallback.
 */
function sanitizePath(fullPath: unknown): string {
  // Defense-in-depth: if input is not a string, return a safe fallback.
  // This prevents "Cannot convert object to primitive value" errors when
  // a router event object or other non-primitive accidentally reaches here.
  if (typeof fullPath !== "string") {
    return "/";
  }

  if (fullPath.length === 0) {
    return "/";
  }

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
    const result = fullPath.slice(0, Math.max(1, end));
    // Final guard: ensure we always return a non-empty string starting with "/"
    if (!result || result.length === 0) return "/";
    if (!result.startsWith("/")) return `/${result}`;
    return result;
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
  if (initialized) {
    debugLog("init:skipped", "already_initialized");
    return;
  }
  if (!isBrowser()) {
    debugLog("init:skipped", "ssr");
    return;
  }
  if (!shouldEnable()) {
    // Mark as initialized so we don't repeatedly check.
    initialized = true;
    initializationSkipped = true;
    debugLog("init:skipped", "disabled");
    return;
  }

  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  measurementId = id;
  const mid = id; // local const for type narrowing inside nested functions

  // Set up dataLayer and gtag stub BEFORE injecting the script, so any
  // queued events are picked up when the script loads.
  //
  // CRITICAL: the gtag stub MUST use `dataLayer.push(arguments)` — NOT an
  // array spread, NOT Array.from(), NOT a rest parameter that converts to a
  // plain Array. The real Google gtag.js runtime iterates dataLayer entries
  // by treating each pushed item as the canonical `arguments` / IArguments
  // object shape. Pushing a plain Array (e.g. `dataLayer.push(args)`) causes
  // the loaded runtime to fail silently — commands queue forever, no
  // `/g/collect` requests fire, the `_ga` cookie is never set, and
  // `gtag('get', ...)` callbacks are never invoked.
  //
  // This is the canonical Google snippet, reproduced verbatim in spirit:
  //   window.dataLayer = window.dataLayer || [];
  //   function gtag(){dataLayer.push(arguments);}
  //   window.gtag = gtag;
  window.dataLayer = window.dataLayer || [];

  // IMPORTANT: the rest parameter `_args` exists only for TypeScript's type
  // system. At runtime we push the native `arguments` object (IArguments),
  // NOT the rest-parameter array. The rest param lets TypeScript verify
  // call sites while preserving the canonical gtag command shape.
  //
  // `arguments` is always available in non-arrow functions regardless of
  // whether rest params are declared — it is the real IArguments object.
  function gtag(..._args: unknown[]): void {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
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
    debugLog("init:script_injection_failed");
  }

  initialized = true;
  debugLog("init:success");
}

/**
 * Track a page view.
 *
 * Call after initial hydration and on every successful client-side route change.
 *
 * Accepts normalized primitives: pathname, optional search, optional hash,
 * and optional title. All values are validated to be strings before use.
 *
 * Analytics failure must NEVER propagate into the React error boundary.
 * The entire function body is wrapped in a try/catch defensive boundary.
 *
 * @param input.pathname - The page pathname (e.g. "/program").
 * @param input.search - Optional query string including "?" prefix.
 * @param input.hash - Optional hash fragment including "#" prefix.
 * @param input.title - Optional document title override.
 */
export function trackPageView(input: PageViewInput): void {
  // ── Defensive boundary: analytics failure ≠ application failure ────────
  try {
    if (!initialized) {
      debugLog("page_view:skipped", "not_initialized");
      return;
    }
    if (!isBrowser()) {
      debugLog("page_view:skipped", "ssr");
      return;
    }
    if (!measurementId) {
      debugLog("page_view:skipped", "no_measurement_id");
      return;
    }
    if (typeof window.gtag !== "function") {
      debugLog("page_view:skipped", "no_gtag");
      return;
    }

    // Validate pathname is a valid string — skip emission if not.
    // This guards against accidental passing of router event objects,
    // undefined values, or other non-primitive inputs.
    const pathname = input?.pathname;
    if (typeof pathname !== "string") {
      debugLog("page_view:skipped", "pathname_not_string");
      return;
    }
    if (pathname.length === 0) {
      debugLog("page_view:skipped", "pathname_empty");
      return;
    }

    // Validate search and hash are strings (or undefined)
    const search = input.search !== undefined && typeof input.search === "string"
      ? input.search
      : "";
    const hash = input.hash !== undefined && typeof input.hash === "string"
      ? input.hash
      : "";

    // Build full path from normalized parts
    const fullPath = pathname + search + hash;

    // Sanitize (strips sensitive query params)
    const sanitizedPath = sanitizePath(fullPath);

    // Build page_location from window.location.origin + sanitized path
    // window.location.origin is always a string in browser environments.
    const origin = typeof window.location?.origin === "string"
      ? window.location.origin
      : "";
    const pageLocation = origin + sanitizedPath;

    // Title: use provided string, else fall back to document.title
    let pageTitle: string;
    if (typeof input.title === "string") {
      pageTitle = input.title;
    } else if (typeof document?.title === "string") {
      pageTitle = document.title;
    } else {
      pageTitle = "";
    }

    window.gtag("event", "page_view", {
      page_location: pageLocation,
      page_path: sanitizedPath,
      page_title: pageTitle,
    });

    debugLog("page_view:queued", sanitizedPath);
  } catch {
    // Analytics must never crash the application.
    // Swallow ALL errors from the analytics path silently.
    // Real errors can be diagnosed via dev tools console if needed,
    // but they must never reach a React ErrorComponent.
    debugLog("page_view:skipped", "error");
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
  // ── Defensive boundary: analytics failure ≠ application failure ────────
  try {
    if (!initialized) return;
    if (!isBrowser()) return;
    if (!measurementId) return;
    if (typeof window.gtag !== "function") return;
    if (typeof name !== "string" || name.length === 0) return;

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
    initializationSkipped = false;
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
  initializationSkipped = false;
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
