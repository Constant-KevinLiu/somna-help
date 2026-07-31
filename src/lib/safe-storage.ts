/**
 * Shared Safe Storage Utilities
 *
 * Centralized SSR-safe storage helpers used across the application.
 * Avoids duplicated isBrowser() checks and try/catch patterns.
 *
 * Domain-specific logic and schema validation remain in their respective
 * modules (sleep-records.ts, habit-storage.ts, etc.).
 */

// ============================================
// Environment Detection
// ============================================
export function isBrowser(): boolean {
  // Check for actual browser window, not Node.js or other environments
  // Using multiple checks to avoid false positives in test environments
  return typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.localStorage !== "undefined" &&
    // This ensures we're in a real browser context, not a jsdom or node environment
    window.navigator?.userAgent?.length > 0 &&
    !window.navigator.userAgent.includes("Node.js");
}

export function isDocumentAvailable(): boolean {
  return typeof document !== "undefined" &&
    typeof document.cookie === "string";
}

export function isNavigatorAvailable(): boolean {
  return typeof navigator !== "undefined" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.length > 0 &&
    !navigator.userAgent.includes("Node.js");
}

export function isBroadcastChannelSupported(): boolean {
  return isBrowser() && "BroadcastChannel" in window;
}

export function isNotificationSupported(): boolean {
  return isBrowser() && "Notification" in window;
}

// ============================================
// Safe JSON Parsing
// ============================================
/**
 * Safely parse JSON with fallback default value.
 * No errors are swallowed silently in development mode.
 */
export function safeJsonParse<T>(
  json: string | null,
  defaultValue: T,
  options?: { devWarn?: boolean }
): T {
  if (!json) return defaultValue;

  try {
    return JSON.parse(json) as T;
  } catch (error) {
    if (options?.devWarn && isBrowser()) {
      console.warn("[safe-storage] Failed to parse JSON:", error);
    }
    return defaultValue;
  }
}

// ============================================
// Local Storage Helpers
// ============================================
/**
 * Safely get an item from localStorage.
 * Returns defaultValue if not in browser or on parse error.
 */
export function safeLocalStorageGet<T>(
  key: string,
  defaultValue: T,
  options?: { devWarn?: boolean }
): T {
  if (!isBrowser()) return defaultValue;

  try {
    const raw = window.localStorage.getItem(key);
    return safeJsonParse(raw, defaultValue, options);
  } catch (error) {
    if (options?.devWarn) {
      console.warn(`[safe-storage] Failed to read "${key}":`, error);
    }
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage.
 * Silently ignores quota/private-mode errors.
 */
export function safeLocalStorageSet(
  key: string,
  value: unknown,
  options?: { dispatchEvent?: string; devWarn?: boolean }
): void {
  if (!isBrowser()) return;

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);

    if (options?.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent(options.dispatchEvent, { detail: value })
      );
    }
  } catch (error) {
    if (options?.devWarn) {
      console.warn(`[safe-storage] Failed to write "${key}":`, error);
    }
    // Ignore quota / private mode errors silently in production
  }
}

/**
 * Safely remove an item from localStorage.
 */
export function safeLocalStorageRemove(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// ============================================
// Broadcast Channel Helper
// ============================================
let sharedChannels: Map<string, BroadcastChannel> = new Map();

/**
 * Get or create a shared BroadcastChannel instance.
 * Returns null if not in browser or unsupported.
 */
export function getSharedBroadcastChannel(name: string): BroadcastChannel | null {
  if (!isBroadcastChannelSupported()) return null;

  if (!sharedChannels.has(name)) {
    sharedChannels.set(name, new BroadcastChannel(name));
  }
  return sharedChannels.get(name) ?? null;
}

/**
 * Close and remove a shared BroadcastChannel.
 */
export function closeSharedBroadcastChannel(name: string): void {
  const channel = sharedChannels.get(name);
  if (channel) {
    channel.close();
    sharedChannels.delete(name);
  }
}
