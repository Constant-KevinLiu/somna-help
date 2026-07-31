import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LOCALES,
  ACTIVE_LOCALES,
  PARTIAL_LOCALES,
  RESERVED_LOCALES,
  LOCALE_REGISTRY,
  isSupportedLocale,
  isActiveLocale,
  isPartialLocale,
  isReservedLocale,
  normalizePersistedLocale,
  getHreflang,
  getContentLocale,
  getHtmlLang,
  getTextDirection,
  safeKeyFallback,
  resolveTranslation,
  LEGACY_LOCALE_MAP,
  getHreflangLocales,
} from "./locale-registry";

describe("locale-registry", () => {
  // =========================================================================
  // Core types and constants
  // =========================================================================

  describe("locale lists", () => {
    it("has 7 supported locales", () => {
      expect(SUPPORTED_LOCALES).toHaveLength(7);
      expect(SUPPORTED_LOCALES).toEqual(["en", "es", "pt", "pl", "de", "zh", "ja"]);
    });

    it("has 4 active locales", () => {
      expect(ACTIVE_LOCALES).toEqual(["en", "es", "pt", "pl"]);
    });

    it("has 1 partial locale (de)", () => {
      expect(PARTIAL_LOCALES).toEqual(["de"]);
    });

    it("has 2 reserved locales (zh, ja)", () => {
      expect(RESERVED_LOCALES).toEqual(["zh", "ja"]);
    });

    it("active + partial + reserved = all supported", () => {
      const all = [...ACTIVE_LOCALES, ...PARTIAL_LOCALES, ...RESERVED_LOCALES];
      expect(all.sort()).toEqual([...SUPPORTED_LOCALES].sort());
    });
  });

  // =========================================================================
  // Locale definitions
  // =========================================================================

  describe("LOCALE_REGISTRY", () => {
    it("has definition for every supported locale", () => {
      for (const locale of SUPPORTED_LOCALES) {
        expect(LOCALE_REGISTRY[locale]).toBeDefined();
        expect(LOCALE_REGISTRY[locale].code).toBe(locale);
      }
    });

    it("marks active locales as enabled", () => {
      for (const locale of ACTIVE_LOCALES) {
        expect(LOCALE_REGISTRY[locale].enabled).toBe(true);
        expect(LOCALE_REGISTRY[locale].status).toBe("active");
      }
    });

    it("marks partial and reserved locales as not enabled", () => {
      for (const locale of [...PARTIAL_LOCALES, ...RESERVED_LOCALES]) {
        expect(LOCALE_REGISTRY[locale].enabled).toBe(false);
      }
    });

    it("pt maps content locale to pt-BR", () => {
      expect(LOCALE_REGISTRY.pt.contentLocale).toBe("pt-BR");
    });

    it("all locales have ltr direction", () => {
      for (const locale of SUPPORTED_LOCALES) {
        expect(LOCALE_REGISTRY[locale].direction).toBe("ltr");
      }
    });

    it("en has self as fallback", () => {
      expect(LOCALE_REGISTRY.en.fallbackLocale).toBe("en");
    });

    it("all non-en locales fall back to en", () => {
      for (const locale of SUPPORTED_LOCALES.filter((l) => l !== "en")) {
        expect(LOCALE_REGISTRY[locale].fallbackLocale).toBe("en");
      }
    });
  });

  // =========================================================================
  // Type guards
  // =========================================================================

  describe("type guards", () => {
    it("isSupportedLocale accepts all 7 locales", () => {
      expect(isSupportedLocale("en")).toBe(true);
      expect(isSupportedLocale("es")).toBe(true);
      expect(isSupportedLocale("pt")).toBe(true);
      expect(isSupportedLocale("pl")).toBe(true);
      expect(isSupportedLocale("de")).toBe(true);
      expect(isSupportedLocale("zh")).toBe(true);
      expect(isSupportedLocale("ja")).toBe(true);
    });

    it("isSupportedLocale rejects invalid values", () => {
      expect(isSupportedLocale("fr")).toBe(false);
      expect(isSupportedLocale("")).toBe(false);
      expect(isSupportedLocale(null)).toBe(false);
      expect(isSupportedLocale(undefined)).toBe(false);
      expect(isSupportedLocale(123)).toBe(false);
    });

    it("isActiveLocale returns true only for active locales", () => {
      expect(isActiveLocale("en")).toBe(true);
      expect(isActiveLocale("de")).toBe(false);
      expect(isActiveLocale("zh")).toBe(false);
      expect(isActiveLocale("ja")).toBe(false);
    });

    it("isPartialLocale returns true only for partial locales", () => {
      expect(isPartialLocale("de")).toBe(true);
      expect(isPartialLocale("en")).toBe(false);
      expect(isPartialLocale("zh")).toBe(false);
    });

    it("isReservedLocale returns true only for reserved locales", () => {
      expect(isReservedLocale("zh")).toBe(true);
      expect(isReservedLocale("ja")).toBe(true);
      expect(isReservedLocale("en")).toBe(false);
      expect(isReservedLocale("de")).toBe(false);
    });
  });

  // =========================================================================
  // pt / pt-BR migration
  // =========================================================================

  describe("normalizePersistedLocale — pt/pt-BR", () => {
    it("canonical pt stays pt", () => {
      expect(normalizePersistedLocale("pt")).toBe("pt");
    });

    it("legacy pt-BR maps to pt", () => {
      expect(normalizePersistedLocale("pt-BR")).toBe("pt");
    });

    it("pt-br lowercase maps to pt", () => {
      expect(normalizePersistedLocale("pt-br")).toBe("pt");
    });

    it("PT-BR uppercase maps to pt", () => {
      expect(normalizePersistedLocale("PT-BR")).toBe("pt");
    });

    it("pt-PT maps to pt (prefix match)", () => {
      expect(normalizePersistedLocale("pt-PT")).toBe("pt");
    });
  });

  describe("normalizePersistedLocale — all legacy mappings", () => {
    it("maps en-US to en", () => {
      expect(normalizePersistedLocale("en-US")).toBe("en");
    });

    it("maps es-ES to es", () => {
      expect(normalizePersistedLocale("es-ES")).toBe("es");
    });

    it("maps de-DE to de", () => {
      expect(normalizePersistedLocale("de-DE")).toBe("de");
    });

    it("maps zh-CN to zh", () => {
      expect(normalizePersistedLocale("zh-CN")).toBe("zh");
    });

    it("maps ja-JP to ja", () => {
      expect(normalizePersistedLocale("ja-JP")).toBe("ja");
    });
  });

  describe("normalizePersistedLocale — edge cases", () => {
    it("null falls back to en", () => {
      expect(normalizePersistedLocale(null)).toBe("en");
    });

    it("undefined falls back to en", () => {
      expect(normalizePersistedLocale(undefined)).toBe("en");
    });

    it("empty string falls back to en", () => {
      expect(normalizePersistedLocale("")).toBe("en");
    });

    it("unknown locale falls back to en", () => {
      expect(normalizePersistedLocale("fr")).toBe("en");
    });

    it("unknown locale with region falls back to en (prefix not recognized)", () => {
      expect(normalizePersistedLocale("fr-FR")).toBe("en");
    });

    it("custom fallback is respected", () => {
      expect(normalizePersistedLocale("fr", "es")).toBe("es");
    });

    it("whitespace is trimmed", () => {
      expect(normalizePersistedLocale("  pt  ")).toBe("pt");
    });
  });

  // =========================================================================
  // Convenience lookups
  // =========================================================================

  describe("convenience lookups", () => {
    it("getHreflang returns correct values", () => {
      expect(getHreflang("en")).toBe("en");
      expect(getHreflang("es")).toBe("es");
      expect(getHreflang("pt")).toBe("pt-BR");
      expect(getHreflang("de")).toBe("de");
      expect(getHreflang("zh")).toBe("zh-CN");
      expect(getHreflang("ja")).toBe("ja");
    });

    it("getContentLocale returns correct values", () => {
      expect(getContentLocale("en")).toBe("en");
      expect(getContentLocale("pt")).toBe("pt-BR");
      expect(getContentLocale("zh")).toBe("zh-CN");
    });

    it("getHtmlLang returns correct values", () => {
      expect(getHtmlLang("en")).toBe("en-US");
      expect(getHtmlLang("pt")).toBe("pt-BR");
      expect(getHtmlLang("de")).toBe("de-DE");
    });

    it("getTextDirection returns ltr for all", () => {
      for (const locale of SUPPORTED_LOCALES) {
        expect(getTextDirection(locale)).toBe("ltr");
      }
    });

    it("getHreflangLocales returns only active locales", () => {
      const hreflangs = getHreflangLocales();
      expect(hreflangs).toEqual(ACTIVE_LOCALES);
      expect(hreflangs).not.toContain("de");
      expect(hreflangs).not.toContain("zh");
      expect(hreflangs).not.toContain("ja");
    });
  });

  // =========================================================================
  // Safe fallback (raw key prevention)
  // =========================================================================

  describe("safeKeyFallback", () => {
    it("converts simple key to title case", () => {
      expect(safeKeyFallback("title")).toBe("Title");
    });

    it("converts camelCase to words", () => {
      expect(safeKeyFallback("weeklyFocus")).toBe("Weekly Focus");
    });

    it("converts snake_case to words", () => {
      expect(safeKeyFallback("sleep_efficiency")).toBe("Sleep Efficiency");
    });

    it("takes last segment of dotted key", () => {
      expect(safeKeyFallback("dashboard.weeklyFocus.title")).toBe("Title");
    });

    it("handles empty string gracefully", () => {
      expect(safeKeyFallback("")).toBe("");
    });
  });

  describe("resolveTranslation", () => {
    const enDict = { hello: "Hello", world: "World" };
    const esDict = { hello: "Hola" };

    it("returns translation from requested locale", () => {
      expect(resolveTranslation("hello", esDict, enDict)).toBe("Hola");
    });

    it("falls back to English when key missing in requested locale", () => {
      expect(resolveTranslation("world", esDict, enDict)).toBe("World");
    });

    it("falls back to safe key when missing in both", () => {
      const result = resolveTranslation("missing.key", esDict, enDict);
      expect(result).not.toBe("missing.key");
      expect(result).toBe("Key");
    });

    it("uses feature fallback before English", () => {
      const featureDict = { world: "Feature World" };
      expect(resolveTranslation("world", {}, enDict, featureDict)).toBe(
        "Feature World"
      );
    });

    it("handles undefined locale dict gracefully", () => {
      expect(resolveTranslation("hello", undefined, enDict)).toBe("Hello");
    });

    it("never returns undefined", () => {
      const result = resolveTranslation("totally.missing", {}, {});
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  // =========================================================================
  // LEGACY_LOCALE_MAP
  // =========================================================================

  describe("LEGACY_LOCALE_MAP", () => {
    it("contains pt-BR → pt mapping", () => {
      expect(LEGACY_LOCALE_MAP["pt-BR"]).toBe("pt");
    });

    it("contains all full locale tags", () => {
      expect(LEGACY_LOCALE_MAP["en-US"]).toBe("en");
      expect(LEGACY_LOCALE_MAP["es-ES"]).toBe("es");
      expect(LEGACY_LOCALE_MAP["pt-BR"]).toBe("pt");
      expect(LEGACY_LOCALE_MAP["pl-PL"]).toBe("pl");
      expect(LEGACY_LOCALE_MAP["de-DE"]).toBe("de");
      expect(LEGACY_LOCALE_MAP["zh-CN"]).toBe("zh");
      expect(LEGACY_LOCALE_MAP["ja-JP"]).toBe("ja");
    });
  });
});
