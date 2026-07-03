/**
 * Carregador de dicionários de locales/pt.
 *
 * Princípio SEO: os textos em português brasileiro são escritos de forma
 * nativa e vivem em arquivos JSON fisicamente isolados sob src/locales/pt/.
 * Não são traduzidos do inglês em tempo de execução nem de compilação. Este
 * módulo apenas importa os JSON e os combina em um único dicionário plano.
 *
 * Uso:
 *   import { loadPtDict, getPtString } from "@/locales/pt";
 *   const t = loadPtDict();
 *   t["nav.home"]; // "Início"
 */

import common from "./common.json";
import week1 from "./week-1.json";
import week2 from "./week-2.json";
import week3 from "./week-3.json";
import week4 from "./week-4.json";
import week5 from "./week-5.json";
import week6 from "./week-6.json";

export type PtDict = Record<string, string>;

/**
 * Combina todos os JSON de locales/pt em um único dicionário plano.
 * Chaves com prefixo "_" (metadados) são excluídas do dicionário de uso.
 */
export function loadPtDict(): PtDict {
  const merged: PtDict = {};
  for (const file of [common, week1, week2, week3, week4, week5, week6]) {
    for (const [key, value] of Object.entries(file)) {
      if (key.startsWith("_")) continue;
      if (typeof value === "string") merged[key] = value;
    }
  }
  return merged;
}

/**
 * Acesso tipado a uma string específica. Retorna a chave se faltar, para que
 * a falha seja visível durante o desenvolvimento sem quebrar a página.
 */
export function getPtString(dict: PtDict, key: string): string {
  return dict[key] ?? key;
}

export { common, week1, week2, week3, week4, week5, week6 };
