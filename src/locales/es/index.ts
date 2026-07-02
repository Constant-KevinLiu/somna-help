/**
 * Cargador de diccionarios de locales/es.
 *
 * Principio SEO: los textos en español se redactan de forma nativa y viven en
 * archivos JSON físicamente aislados bajo src/locales/es/. No se traducen desde
 * el inglés en tiempo de ejecución ni en tiempo de compilación. Este módulo
 * simplemente importa los JSON y los combina en un único diccionario plano.
 *
 * Uso:
 *   import { loadEsDict, getEsString } from "@/locales/es";
 *   const t = loadEsDict();
 *   t["nav.home"]; // "Inicio"
 */

import common from "./common.json";
import diary from "./diary.json";
import pricing from "./pricing.json";
import shareCard from "./share-card.json";
import blog from "./blog.json";
import email from "./email.json";
import legal from "./legal.json";

export type EsDict = Record<string, string>;

/**
 * Combina todos los JSON de locales/es en un único diccionario plano.
 * Las claves con prefijo "_" (metadatos) se excluyen del diccionario de uso.
 */
export function loadEsDict(): EsDict {
  const merged: EsDict = {};
  for (const file of [common, diary, pricing, shareCard, blog, email, legal]) {
    for (const [key, value] of Object.entries(file)) {
      if (key.startsWith("_")) continue;
      if (typeof value === "string") merged[key] = value;
    }
  }
  return merged;
}

/**
 * Acceso tipado a una cadena concreta. Devuelve la clave si falta, para que el
 * fallo sea visible durante el desarrollo sin romper la página.
 */
export function getEsString(dict: EsDict, key: string): string {
  return dict[key] ?? key;
}

export { common, diary, pricing, shareCard, blog, email, legal };
