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
import { switchRouteLang } from "@/lib/lang-detect";

export const SITE_ORIGIN = "https://somna.help";

const HREFLANG_BY_LANG: Record<Lang, string> = {
  en: "en",
  es: "es",
};

interface HreflangProps {
  pathname: string;
}

/**
 * Devuelve la lista de URLs alternativas para una ruta dada.
 * Exportado para que el sitemap y el SSR puedan reutilizarlo.
 */
export function buildAlternates(pathname: string) {
  const enPath = switchRouteLang(pathname, "en");
  const esPath = switchRouteLang(pathname, "es");
  return [
    { hreflang: HREFLANG_BY_LANG.en, href: `${SITE_ORIGIN}${enPath}` },
    { hreflang: HREFLANG_BY_LANG.es, href: `${SITE_ORIGIN}${esPath}` },
    { hreflang: "x-default", href: `${SITE_ORIGIN}${enPath}` },
  ];
}

/**
 * Componente para usar dentro de `head.meta` de TanStack Router.
 * Devuelve un array de objetos meta que el router inyecta como <link>.
 */
export function hreflangMeta(pathname: string) {
  const alternates = buildAlternates(pathname);
  const canonical = `${SITE_ORIGIN}${pathname}`;
  return [
    ...alternates.map((a) => ({
      rel: "alternate",
      hreflang: a.hreflang,
      href: a.href,
    })),
    { rel: "canonical", href: canonical },
  ];
}
