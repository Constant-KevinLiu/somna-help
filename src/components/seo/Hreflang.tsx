/**
 * Componente Hreflang.
 *
 * Inyecta en el <head> las etiquetas hreflang bidireccionales (en / es) y la
 * etiqueta canonical única, para evitar que Google considere las versiones
 * como contenido duplicado o traducido.
 *
 * Uso dentro del `head` de cualquier ruta:
 *   <Hreflang pathname={router.state.location.pathname} />
 *
 * Genera:
 *   <link rel="alternate" hreflang="en" href="https://somna.help/<path>" />
 *   <link rel="alternate" hreflang="es" href="https://somna.help/es/<path>" />
 *   <link rel="alternate" hreflang="x-default" href="https://somna.help/<path>" />
 *   <link rel="canonical" href="https://somna.help/<currentPath>" />
 */

import type { Lang } from "@/lib/lang-detect";
import { switchRouteLang, ACTIVE_LANGS } from "@/lib/lang-detect";

export const SITE_ORIGIN = "https://somna.help";

const HREFLANG_BY_LANG: Record<Lang, string> = {
  en: "en",
  es: "es",
  pt: "pt",
  de: "de",
  ja: "ja",
  zh: "zh",
};

interface HreflangProps {
  pathname: string;
}

/**
 * Devuelve la lista de URLs alternativas para una ruta dada.
 * Genera entradas para todos los idiomas activos (en, es, pt) + x-default.
 * Exportado para que el sitemap y el SSR puedan reutilizarlo.
 */
export function buildAlternates(pathname: string) {
  const alternates = ACTIVE_LANGS.map((lang) => ({
    hreflang: HREFLANG_BY_LANG[lang],
    href: `${SITE_ORIGIN}${switchRouteLang(pathname, lang)}`,
  }));
  // x-default apunta a la versión inglesa.
  return [
    ...alternates,
    { hreflang: "x-default", href: `${SITE_ORIGIN}${switchRouteLang(pathname, "en")}` },
  ];
}

/**
 * Componente para usar dentro de `head.links` de TanStack Router.
 * Devuelve un array de objetos link que el router inyecta como <link>.
 *
 * Uso:
 *   head: () => ({
 *     meta: [...],
 *     links: hreflangLinks("/es/program"),
 *   })
 */
export function hreflangLinks(pathname: string) {
  const alternates = buildAlternates(pathname);
  const canonical = `${SITE_ORIGIN}${pathname}`;
  return [
    ...alternates.map((a) => ({
      rel: "alternate",
      hrefLang: a.hreflang,
      href: a.href,
    })),
    { rel: "canonical", href: canonical },
  ];
}

/**
 * Alias mantenido por compatibilidad. Devuelve el mismo contenido que
 * hreflangLinks, para usar dentro de `head.links`.
 *
 * @deprecated Usar hreflangLinks() en su lugar.
 */
export function hreflangMeta(pathname: string) {
  return hreflangLinks(pathname);
}
