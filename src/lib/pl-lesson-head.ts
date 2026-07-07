/**
 * Pomocniki SEO head dla statycznych stron lekcji programu CBT-I
 * po polsku (/pl/program/week-N/lekcja).
 *
 * Zasada SEO: tytuł, opis i słowa kluczowe każdej strony są odczytywane
 * wyłącznie z niezależnych zasobów w src/locales/pl/. Żaden tekst nie jest
 * tłumaczony z języka angielskiego w czasie działania ani kompilacji.
 *
 * Hreflang (en / es / pt / pl + x-default) oraz canonical wskazują na
 * wzajemnie odpowiadające sobie trasy 1:1, unikając błędów 404.
 */

import type { LessonContent } from "@/lib/program-lessons";
import { lessonPath } from "@/lib/program-lessons";
import { getPlString, loadPlDict, type PlDict } from "@/locales/pl";
import type { Lang } from "@/lib/i18n";
import { articleJsonLd } from "@/components/program/LessonTemplate";

const SITE_ORIGIN = "https://somna.help";

/**
 * Buduje obiekt `head` dla lekcji programu, odczytując metadane
 * (seoTitle, seoDescription, keywords) bezpośrednio z izolowanego
 * słownika pl w src/locales/pl/.
 *
 * @param lesson     Pełna treść lekcji (używana do JSON-LD i URL-i).
 * @param lessonKey  Klucz bazowy w JSON (np. "week3.lesson7").
 */
/**
 * Zwraca tytuł dokumentu dla danej lekcji w języku polskim,
 * odczytany z izolowanego słownika src/locales/pl/. Używany w
 * komponencie trasy, by nadpisać document.title wartością polską
 * zamiast angielskiego fallbacku z lesson.i18n.
 */
export function plLessonTitleFromLocales(lessonKey: string): string {
  const dict: PlDict = loadPlDict();
  return getPlString(dict, `${lessonKey}.seoTitle`);
}

export function plLessonHeadFromLocales(lesson: LessonContent, lessonKey: string) {
  const dict: PlDict = loadPlDict();
  const seoTitle = getPlString(dict, `${lessonKey}.seoTitle`);
  const seoDescription = getPlString(dict, `${lessonKey}.seoDescription`);
  const keywords = getPlString(dict, `${lessonKey}.keywords`);

  const lang: Lang = "pl";
  const url = lessonPath(lesson.weekSlug, lesson.slug, lang);
  const enUrl = lessonPath(lesson.weekSlug, lesson.slug, "en");
  const esUrl = lessonPath(lesson.weekSlug, lesson.slug, "es");
  const ptUrl = lessonPath(lesson.weekSlug, lesson.slug, "pt");
  const plUrl = url;

  return {
    meta: [
      { title: seoTitle },
      { name: "description", content: seoDescription },
      { name: "keywords", content: keywords },
      { property: "og:title", content: seoTitle },
      { property: "og:description", content: seoDescription },
      { property: "og:url", content: `${SITE_ORIGIN}${url}` },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "pl_PL" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}${enUrl}` },
      { rel: "alternate", hrefLang: "es", href: `${SITE_ORIGIN}${esUrl}` },
      { rel: "alternate", hrefLang: "pt", href: `${SITE_ORIGIN}${ptUrl}` },
      { rel: "alternate", hrefLang: "pl", href: `${SITE_ORIGIN}${plUrl}` },
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
