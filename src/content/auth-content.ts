/**
 * Sleep Diary v2.3 - Authentication Content Index
 * 
 * Content Governance: All four locales are independent content products.
 * No silent English fallback - missing locale content blocks deployment.
 */

import type { Locale } from "./content-types";
import { assertNoEnglishFallback } from "./content-types";
import type { AuthCopy } from "./en/auth/auth-copy";
import { authCopyEn } from "./en/auth/auth-copy";
import { authCopyEs } from "./es/auth/auth-copy";
import { authCopyPtBr } from "./pt-BR/auth/auth-copy";
import { authCopyPl } from "./pl/auth/auth-copy";

const authContentPackages: Record<Locale, typeof authCopyEn> = {
  "en": authCopyEn,
  "es": authCopyEs,
  "pt-BR": authCopyPtBr,
  "pl": authCopyPl,
};

// Validate all content packages at module load time
// This blocks deployment if any locale is missing or not approved
try {
  assertNoEnglishFallback(authContentPackages);
} catch (error) {
  console.error("Content Governance validation failed:", error);
  throw error;
}

export function getAuthCopy(locale: Locale): AuthCopy {
  const pkg = authContentPackages[locale];
  if (!pkg) {
    // This should never happen due to the validation above
    throw new Error(`No auth content package for locale: ${locale}`);
  }
  return pkg.content;
}

export { authCopyEn, authCopyEs, authCopyPtBr, authCopyPl };
export type { AuthCopy };
