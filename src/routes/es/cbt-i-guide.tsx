/**
 * Guía TCC-I en español (/es/cbt-i-guide).
 *
 * Reutiliza el componente CbtIGuidePage de la ruta inglesa. El idioma se
 * deriva automáticamente de la ruta (/es/** → "es") vía useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { CbtIGuidePage } from "@/routes/cbt-i-guide";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/es/cbt-i-guide")({
  component: CbtIGuidePage,
  head: () => {
    const a = getCbtiDict("es").articles["cbt-i-guide"];
    return {
      meta: [
        { title: a.meta.title },
        { name: "description", content: a.meta.desc },
        { property: "og:title", content: a.meta.title },
        { property: "og:description", content: a.meta.desc },
        { property: "og:url", content: "https://somna.help/es/cbt-i-guide" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_ES" },
      ],
      links: hreflangLinks("/es/cbt-i-guide"),
    };
  },
});
