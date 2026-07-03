/**
 * Guia TCC-I em português brasileiro (/pt/cbt-i-guide).
 *
 * Reutiliza o componente CbtIGuidePage da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { CbtIGuidePage } from "@/routes/cbt-i-guide";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/cbt-i-guide")({
  component: CbtIGuidePage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.cbt-i-guide.title");
    const description = getPtString(t, "seo.cbt-i-guide.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/cbt-i-guide" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/cbt-i-guide"),
    };
  },
});
