/**
 * Sleep Diary v2.4 — Locale Registry
 *
 * Single source of truth for all locale definitions, metadata, and policies.
 * Every other module (i18n, lang-detect, content-types, routes, hreflang,
 * formatting, analytics, reminders, program) should import locale types
 * from this file.
 *
 * Architecture:
 *   SupportedLocale  — every locale that has any code-level recognition
 *   ActiveLocale     — locales with full UI + content support (in switcher)
 *   PartialLocale    — locales with partial support (visible but "coming soon")
 *   ReservedLocale   — locales reserved for future, no content yet
 *
 * Fallback chain:
 *   requested locale → feature-specific fallback → English → safe key
 */

// =============================================================================
// Core Types
// =============================================================================

/**
 * Every locale recognized by the codebase.
 * Order is display order in language switchers and hreflang.
 *
 * Policy:
 *  - "pt" is the canonical UI/route code. Content uses "pt-BR" internally
 *    because the only Portuguese variant is Brazilian Portuguese.
 *  - "de" is partially active (program + analytics + some UI; missing
 *    sleep/calc/reflections/auth).
 *  - "zh" is reserved — has main UI strings but no program/analytics content.
 *  - "ja" is reserved — type-only, no translations.
 */
export const SUPPORTED_LOCALES = ["en", "es", "pt", "pl", "de", "zh", "ja"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Locales fully active in the language switcher and route system. */
export const ACTIVE_LOCALES: SupportedLocale[] = ["en", "es", "pt", "pl"];
export type ActiveLocale = (typeof ACTIVE_LOCALES)[number];

/** Locales with partial support — visible as "coming soon", not selectable. */
export const PARTIAL_LOCALES: SupportedLocale[] = ["de"];
export type PartialLocale = (typeof PARTIAL_LOCALES)[number];

/** Locales reserved for future development — no content, no UI activation. */
export const RESERVED_LOCALES: SupportedLocale[] = ["zh", "ja"];
export type ReservedLocale = (typeof RESERVED_LOCALES)[number];

/** Locales that appear in the language switcher (active + partial coming-soon). */
export const SWITCHER_LOCALES: SupportedLocale[] = [...ACTIVE_LOCALES, ...PARTIAL_LOCALES];

// =============================================================================
// Locale Definitions
// =============================================================================

export type TextDirection = "ltr" | "rtl";

export interface LocaleDefinition {
  /** Canonical UI / route locale code. */
  code: SupportedLocale;
  /** Value for HTML `lang` attribute. */
  htmlLang: string;
  /** Value for hreflang attribute (RFC 5646 format). */
  hreflang: string;
  /** Text direction. */
  direction: TextDirection;
  /** i18n key for the display name (used in language switcher). */
  displayNameKey: string;
  /** Short label (2-3 chars) used in compact displays. */
  shortLabel: string;
  /** Whether the locale is selectable in the language switcher. */
  enabled: boolean;
  /** Content locale code used for content packages (e.g. "pt-BR" for "pt"). */
  contentLocale: string;
  /** Fallback locale when a translation key is missing. */
  fallbackLocale: SupportedLocale;
  /** Activation status: active | partial | reserved */
  status: "active" | "partial" | "reserved";
}

/**
 * Authoritative locale registry.
 *
 * Notes:
 * - pt: UI code is "pt", content folder is "pt-BR" because the only
 *   Portuguese variant is Brazilian Portuguese. The route prefix is `/pt`.
 * - de: Partial activation — program content + analytics exist, but
 *   sleep tracking, calculator, reflections, and auth are not translated.
 * - zh: Reserved — main UI strings exist, but no program/analytics/reflection
 *   content has been authored. Not selectable in switcher.
 * - ja: Reserved — no translations at all. Type-only presence.
 */
export const LOCALE_REGISTRY: Record<SupportedLocale, LocaleDefinition> = {
  en: {
    code: "en",
    htmlLang: "en-US",
    hreflang: "en",
    direction: "ltr",
    displayNameKey: "lang.name.en",
    shortLabel: "EN",
    enabled: true,
    contentLocale: "en",
    fallbackLocale: "en",
    status: "active",
  },
  es: {
    code: "es",
    htmlLang: "es-ES",
    hreflang: "es",
    direction: "ltr",
    displayNameKey: "lang.name.es",
    shortLabel: "ES",
    enabled: true,
    contentLocale: "es",
    fallbackLocale: "en",
    status: "active",
  },
  pt: {
    code: "pt",
    htmlLang: "pt-BR",
    hreflang: "pt-BR",
    direction: "ltr",
    displayNameKey: "lang.name.pt",
    shortLabel: "PT",
    enabled: true,
    contentLocale: "pt-BR",
    fallbackLocale: "en",
    status: "active",
  },
  pl: {
    code: "pl",
    htmlLang: "pl-PL",
    hreflang: "pl",
    direction: "ltr",
    displayNameKey: "lang.name.pl",
    shortLabel: "PL",
    enabled: true,
    contentLocale: "pl",
    fallbackLocale: "en",
    status: "active",
  },
  de: {
    code: "de",
    htmlLang: "de-DE",
    hreflang: "de",
    direction: "ltr",
    displayNameKey: "lang.name.de",
    shortLabel: "DE",
    enabled: false, // partial — visible as coming soon
    contentLocale: "de",
    fallbackLocale: "en",
    status: "partial",
  },
  zh: {
    code: "zh",
    htmlLang: "zh-CN",
    hreflang: "zh-CN",
    direction: "ltr",
    displayNameKey: "lang.name.zh",
    shortLabel: "中",
    enabled: false,
    contentLocale: "zh-CN",
    fallbackLocale: "en",
    status: "reserved",
  },
  ja: {
    code: "ja",
    htmlLang: "ja-JP",
    hreflang: "ja",
    direction: "ltr",
    displayNameKey: "lang.name.ja",
    shortLabel: "JA",
    enabled: false,
    contentLocale: "ja",
    fallbackLocale: "en",
    status: "reserved",
  },
};

// =============================================================================
// pt / pt-BR Policy
// =============================================================================

/**
 * Canonical Portuguese locale code used throughout the UI and routes.
 * Content files use "pt-BR" internally (see contentLocale).
 *
 * Migration mapping: persisted values of "pt-BR" are normalized to "pt"
 * on read via normalizePersistedLocale().
 */
export const CANONICAL_PT_LOCALE = "pt" as const;
export const LEGACY_PT_LOCALE = "pt-BR" as const;

/**
 * Map of legacy locale values to their canonical equivalents.
 * Used when reading persisted user preferences from cookies / localStorage.
 */
export const LEGACY_LOCALE_MAP: Record<string, SupportedLocale> = {
  "pt-BR": "pt",
  "pt-br": "pt",
  "PT-BR": "pt",
  "en-US": "en",
  "es-ES": "es",
  "pl-PL": "pl",
  "de-DE": "de",
  "zh-CN": "zh",
  "ja-JP": "ja",
};

// =============================================================================
// Type Guards & Validation
// =============================================================================

/** Check if a value is a supported locale code. */
export function isSupportedLocale(v: unknown): v is SupportedLocale {
  return typeof v === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(v);
}

/** Check if a value is an active locale code. */
export function isActiveLocale(v: unknown): v is ActiveLocale {
  return typeof v === "string" && (ACTIVE_LOCALES as readonly string[]).includes(v);
}

/** Check if a value is a partial locale code. */
export function isPartialLocale(v: unknown): v is PartialLocale {
  return typeof v === "string" && (PARTIAL_LOCALES as readonly string[]).includes(v);
}

/** Check if a value is a reserved locale code. */
export function isReservedLocale(v: unknown): v is ReservedLocale {
  return typeof v === "string" && (RESERVED_LOCALES as readonly string[]).includes(v);
}

// =============================================================================
// Locale Migration & Normalization
// =============================================================================

/**
 * Normalize a raw locale value to a SupportedLocale.
 * Handles:
 *  - Legacy "pt-BR" → "pt" mapping
 *  - Case variations ("PT-BR" → "pt")
 *  - Full locale tags ("en-US" → "en")
 *  - Unknown values → fallback (default: "en")
 *
 * Safe to call with any user-provided value — never throws.
 */
export function normalizePersistedLocale(
  raw: string | null | undefined,
  fallback: SupportedLocale = "en",
): SupportedLocale {
  if (!raw) return fallback;

  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  // Exact match
  if (isSupportedLocale(trimmed)) return trimmed;

  // Legacy mapping
  const lower = trimmed.toLowerCase();
  const mapped = LEGACY_LOCALE_MAP[trimmed] ?? LEGACY_LOCALE_MAP[lower];
  if (mapped) return mapped;

  // Prefix match (e.g., "pt-BR" → "pt", "en-US" → "en")
  const prefix = trimmed.split("-")[0].toLowerCase();
  if (isSupportedLocale(prefix)) return prefix;

  return fallback;
}

// =============================================================================
// Convenience Lookups
// =============================================================================

/** Get locale definition by code. Returns English definition as fallback. */
export function getLocaleDefinition(code: SupportedLocale): LocaleDefinition {
  return LOCALE_REGISTRY[code] ?? LOCALE_REGISTRY.en;
}

/** Get hreflang value for a locale. */
export function getHreflang(code: SupportedLocale): string {
  return LOCALE_REGISTRY[code]?.hreflang ?? "en";
}

/** Get content locale code for a UI locale. */
export function getContentLocale(code: SupportedLocale): string {
  return LOCALE_REGISTRY[code]?.contentLocale ?? "en";
}

/** Get HTML lang attribute value. */
export function getHtmlLang(code: SupportedLocale): string {
  return LOCALE_REGISTRY[code]?.htmlLang ?? "en-US";
}

/** Get text direction for a locale. */
export function getTextDirection(code: SupportedLocale): TextDirection {
  return LOCALE_REGISTRY[code]?.direction ?? "ltr";
}

/**
 * Get list of locale codes that should appear in hreflang / sitemap.
 * Only active locales get hreflang entries (partial/reserved don't have
 * real content, so they shouldn't claim search engine presence).
 */
export function getHreflangLocales(): SupportedLocale[] {
  return ACTIVE_LOCALES;
}

// =============================================================================
// Safe Fallback Utilities
// =============================================================================

/**
 * Resolve a translation key through the fallback chain.
 *
 * Fallback order:
 *   1. requested locale dict
 *   2. feature fallback dict (optional — caller-provided)
 *   3. English dict
 *   4. human-readable key (last segment, capitalized)
 *
 * Never returns undefined and never shows raw dotted keys in production-like
 * form. In development mode, logs a warning (without sensitive values).
 */
export function resolveTranslation(
  key: string,
  localeDict: Record<string, string> | undefined,
  englishDict: Record<string, string>,
  featureFallback?: Record<string, string>,
): string {
  // 1. Requested locale
  if (localeDict?.[key] !== undefined) return localeDict[key];

  // 2. Feature-specific fallback (if provided)
  if (featureFallback?.[key] !== undefined) return featureFallback[key];

  // 3. English
  if (englishDict[key] !== undefined) return englishDict[key];

  // 4. Safe fallback — derive from key
  return safeKeyFallback(key);
}

/**
 * Generate a human-readable fallback from a translation key.
 * E.g. "dashboard.weeklyFocus.title" → "Weekly focus title"
 *
 * This prevents raw keys from appearing in user-facing UI while still
 * being informative enough for developers to identify the missing key.
 */
export function safeKeyFallback(key: string): string {
  // Take last segment
  const lastSegment = key.split(".").pop() ?? key;
  // Convert camelCase and snake_case to Title Case words
  const words = lastSegment
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
  if (words.length === 0) return key;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// =============================================================================
// Display name keys (for i18n context)
// =============================================================================

/**
 * Translation keys for locale display names.
 * These should be defined in the main i18n dictionary.
 */
export const LOCALE_NAME_KEYS: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  pl: "Polski",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
};
