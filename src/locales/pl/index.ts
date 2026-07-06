/**
 * Ładowarka słowników locales/pl.
 *
 * Zasada SEO: polskie teksty są pisane natywnie i żyją w fizycznie
 * odseparowanych plikach JSON pod src/locales/pl/. Nie są tłumaczone z
 * języka angielskiego w czasie działania ani kompilacji. Ten moduł tylko
 * importuje JSON-y i łączy je w jeden płaski słownik.
 *
 * Użycie:
 *   import { loadPlDict, getPlString } from "@/locales/pl";
 *   const t = loadPlDict();
 *   t["nav.home"]; // "Strona główna"
 */

import common from "./common.json";
import week1 from "./week-1.json";
import week2 from "./week-2.json";
import week3 from "./week-3.json";
import week4 from "./week-4.json";
import week5 from "./week-5.json";
import week6 from "./week-6.json";

export type PlDict = Record<string, string>;

/**
 * Łączy wszystkie JSON-y z locales/pl w jeden płaski słownik.
 * Klucze zaczynające się od "_" (metadane) są wykluczone ze słownika użytkowego.
 */
export function loadPlDict(): PlDict {
  const merged: PlDict = {};
  for (const file of [common, week1, week2, week3, week4, week5, week6]) {
    for (const [key, value] of Object.entries(file)) {
      if (key.startsWith("_")) continue;
      if (typeof value === "string") merged[key] = value;
    }
  }
  return merged;
}

/**
 * Typowany dostęp do konkretnego łańcucha. Zwraca klucz, jeśli brakuje wartości,
 * aby brak był widoczny podczas rozwoju bez psucia strony.
 */
export function getPlString(dict: PlDict, key: string): string {
  return dict[key] ?? key;
}

export { common, week1, week2, week3, week4, week5, week6 };
