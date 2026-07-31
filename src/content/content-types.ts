/**
 * Sleep Diary v2.4 - Content Governance Types
 *
 * Permanent content quality control metadata.
 * Every locale-owned content file must include this metadata.
 *
 * Principle: Each language version is an independent content product.
 * No silent cross-locale reuse for therapeutic or long-form content.
 *
 * Phase G-0: Locale type now imports from the authoritative locale registry.
 * ContentLocale uses the content-specific locale code (e.g. "pt-BR")
 * as opposed to the UI locale code ("pt").
 */

import type { SupportedLocale } from "../lib/locale-registry";
import { getContentLocale } from "../lib/locale-registry";

/**
 * Content locale codes used by content packages.
 * These may differ from UI locale codes (e.g. "pt-BR" vs "pt").
 * Use getContentLocale() to map from a SupportedLocale to its content code.
 */
export type ContentLocale = "en" | "es" | "pt-BR" | "pl" | "de";

/** @deprecated Use SupportedLocale from @/lib/locale-registry instead. */
export type Locale = ContentLocale;

/**
 * Convert a UI locale code to its content locale equivalent.
 * e.g. "pt" → "pt-BR", "en" → "en"
 */
export function uiLocaleToContentLocale(locale: SupportedLocale): ContentLocale {
  return getContentLocale(locale) as ContentLocale;
}

export type MedicalReviewStatus = "draft" | "reviewed" | "approved";
export type NativeReviewStatus = "draft" | "reviewed" | "approved";

export interface ContentMetadata {
  locale: Locale;
  version: string;
  reviewedAt?: string;
  reviewedBy?: string;
  medicalReviewStatus: MedicalReviewStatus;
  nativeReviewStatus: NativeReviewStatus;
  lastUpdated: string;
}

export interface ContentPackage<T> {
  metadata: ContentMetadata;
  content: T;
}

// =============================================================================
// Validation Helpers
// =============================================================================

export function validateContentPackage<T>(
  pkg: ContentPackage<T>,
  requiredLocale: Locale
): boolean {
  if (pkg.metadata.locale !== requiredLocale) {
    throw new Error(`Content locale mismatch: expected ${requiredLocale}, got ${pkg.metadata.locale}`);
  }
  
  if (pkg.metadata.medicalReviewStatus !== "approved") {
    throw new Error(`Content not medically approved for ${requiredLocale}`);
  }
  
  if (pkg.metadata.nativeReviewStatus !== "approved") {
    throw new Error(`Content not natively reviewed for ${requiredLocale}`);
  }
  
  return true;
}

export function assertNoEnglishFallback<T>(
  packages: Record<Locale, ContentPackage<T>>
): void {
  const locales: Locale[] = ["en", "es", "pt-BR", "pl"];
  
  for (const locale of locales) {
    if (!packages[locale]) {
      throw new Error(`Missing content package for locale: ${locale}`);
    }
    validateContentPackage(packages[locale], locale);
  }
}
