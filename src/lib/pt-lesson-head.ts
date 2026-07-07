/**
 * Auxiliares de SEO head para as páginas estáticas das lições do programa
 * TCC-I em português brasileiro.
 *
 * Princípio SEO: o título, a descrição e as palavras-chave de cada página são
 * lidos exclusivamente dos recursos independentes em `src/locales/pt/`. Nenhum
 * texto é traduzido do inglês em tempo de execução nem de compilação.
 *
 * Os hreflang bidirecionais (en / es / pt + x-default) e o canonical apontam
 * para as rotas 1:1 correspondentes às versões inglesas, evitando 404.
 */

import type { LessonContent } from "@/lib/program-lessons";
import { lessonPath } from "@/lib/program-lessons";
import { getPtString, loadPtDict, type PtDict } from "@/locales/pt";
import type { Lang } from "@/lib/i18n";
import { articleJsonLd } from "@/components/program/LessonTemplate";

const SITE_ORIGIN = "https://somna.help";

/**
 * Constrói o objeto `head` para uma lição do programa, lendo os metadados
 * (seoTitle, seoDescription, keywords) diretamente do dicionário pt isolado
 * em src/locales/pt/.
 *
 * @param lesson     Conteúdo completo da lição (usado para JSON-LD e URLs).
 * @param lessonKey  Chave base no JSON (ex.: "week3.lesson7").
 */
export function ptLessonHeadFromLocales(lesson: LessonContent, lessonKey: string) {
  const dict: PtDict = loadPtDict();
  const seoTitle = getPtString(dict, `${lessonKey}.seoTitle`);
  const seoDescription = getPtString(dict, `${lessonKey}.seoDescription`);
  const keywords = getPtString(dict, `${lessonKey}.keywords`);

  const lang: Lang = "pt";
  const url = lessonPath(lesson.weekSlug, lesson.slug, lang);
  const enUrl = lessonPath(lesson.weekSlug, lesson.slug, "en");
  const esUrl = lessonPath(lesson.weekSlug, lesson.slug, "es");
  const ptUrl = lessonPath(lesson.weekSlug, lesson.slug, "pt");

  return {
    meta: [
      { title: seoTitle },
      { name: "description", content: seoDescription },
      { name: "keywords", content: keywords },
      { property: "og:title", content: seoTitle },
      { property: "og:description", content: seoDescription },
      { property: "og:url", content: `${SITE_ORIGIN}${url}` },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}${enUrl}` },
      { rel: "alternate", hrefLang: "es", href: `${SITE_ORIGIN}${esUrl}` },
      { rel: "alternate", hrefLang: "pt", href: `${SITE_ORIGIN}${ptUrl}` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}${enUrl}` },
      { rel: "canonical", href: `${SITE_ORIGIN}${url}` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(articleJsonLd(lesson, lang)),
      },
    ],
  };
}
