/**
 * Utilidades de formato de fecha, hora y moneda, diferenciando España (EUR,
 * DD/MM/AAAA, 24h) y México (USD, MM/DD/AAAA, 12h con AM/PM).
 *
 * Estas funciones son la única fuente de verdad de formato en toda la app.
 * Cualquier texto que muestre una fecha, hora o precio debe pasar por aquí.
 */

import type { Lang } from "@/lib/lang-detect";

/** Variante regional dentro del español. */
export type EsRegion = "es-ES" | "es-MX";

const LOCALE_BY_LANG: Partial<Record<Lang, string>> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
  de: "de-DE",
  ja: "ja-JP",
};

const LOCALE_BY_ES_REGION: Record<EsRegion, string> = {
  "es-ES": "es-ES",
  "es-MX": "es-MX",
};

/** Devuelve la variante regional española a partir de la ruta. */
export function esRegionFromPathname(pathname: string): EsRegion {
  if (pathname.startsWith("/es-mx")) return "es-MX";
  return "es-ES";
}

/**
 * Formatea una fecha.
 * - España: DD/MM/AAAA (ej. 02/07/2026)
 * - México: MM/DD/AAAA (ej. 07/02/2026)
 */
export function formatDate(d: Date, lang: Lang, region?: EsRegion): string {
  const locale =
    lang === "es" && region ? LOCALE_BY_ES_REGION[region] : (LOCALE_BY_LANG[lang] ?? "en-US");
  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formatea una hora.
 * - España: 24h (ej. 23:45)
 * - México: 12h con AM/PM (ej. 11:45 p. m.)
 */
export function formatTime(d: Date, lang: Lang, region?: EsRegion): string {
  const locale =
    lang === "es" && region ? LOCALE_BY_ES_REGION[region] : (LOCALE_BY_LANG[lang] ?? "en-US");
  const use12h = lang === "es" && region === "es-MX";
  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: use12h,
  });
}

/** Formatea fecha y hora juntas. */
export function formatDateTime(d: Date, lang: Lang, region?: EsRegion): string {
  return `${formatDate(d, lang, region)} · ${formatTime(d, lang, region)}`;
}

/**
 * Formatea un precio.
 * - España: euros, símbolo tras la cantidad con espacio (11,99 €)
 * - México: dólares, símbolo delante ($9.99)
 */
export function formatPrice(amount: number, lang: Lang, region?: EsRegion): string {
  if (lang === "es" && region === "es-MX") {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }
  if (lang === "es") {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Devuelve el precio mensual según la región.
 * España: 11,99 €/mes. México: $9.99/mes.
 */
export function monthlyPriceFor(region: EsRegion): { amount: number; currency: "EUR" | "USD" } {
  if (region === "es-MX") return { amount: 9.99, currency: "USD" };
  return { amount: 11.99, currency: "EUR" };
}

/** Devuelve el precio anual mensualizado (20 % de descuento). */
export function yearlyMonthlyPriceFor(region: EsRegion): {
  amount: number;
  currency: "EUR" | "USD";
} {
  const monthly = monthlyPriceFor(region);
  return { amount: Math.round(monthly.amount * 0.8 * 100) / 100, currency: monthly.currency };
}
