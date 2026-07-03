/**
 * Avaliação do sono em português (/pt/assessment).
 *
 * Reutiliza o componente AssessPage da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { AssessPage } from "@/routes/assessment";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/assessment")({
  component: AssessPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.assessment.title");
    const description = getPtString(t, "seo.assessment.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: "https://somna.help/pt/assessment" },
      ],
      links: hreflangLinks("/pt/assessment"),
    };
  },
});
