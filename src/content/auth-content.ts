/**
 * Sleep Diary v2.3 - Authentication Content Index
 *
 * Content Governance: All four locales are independent content products.
 * No silent English fallback - missing locale content blocks deployment.
 */

import type { Locale } from "./content-types";
import { validateContentPackage } from "./content-types";
import type { AuthCopy } from "./en/auth/auth-copy";
import { authCopyEn } from "./en/auth/auth-copy";
import { authCopyEs } from "./es/auth/auth-copy";
import { authCopyPtBr } from "./pt-BR/auth/auth-copy";
import { authCopyPl } from "./pl/auth/auth-copy";

const authContentPackages: Partial<Record<Locale, typeof authCopyEn>> = {
  en: authCopyEn,
  es: authCopyEs,
  "pt-BR": authCopyPtBr,
  pl: authCopyPl,
};

// Validate all active content packages at module load time
// Partial locales (e.g. de) may not have native auth content yet
const ACTIVE_LOCALES: Locale[] = ["en", "es", "pt-BR", "pl"];
try {
  for (const locale of ACTIVE_LOCALES) {
    const pkg = authContentPackages[locale];
    if (!pkg) {
      throw new Error(`Missing content package for locale: ${locale}`);
    }
    validateContentPackage(pkg, locale);
  }
} catch (error) {
  console.error("Content Governance validation failed:", error);
  throw error;
}

export function getAuthCopy(locale: Locale): AuthCopy {
  const pkg = authContentPackages[locale];
  if (!pkg) {
    // Fall back to English for locales without native auth content
    return authCopyEn.content;
  }
  return pkg.content;
}

export { authCopyEn, authCopyEs, authCopyPtBr, authCopyPl };
export type { AuthCopy };
