/**
 * Tratamento da insônia em português brasileiro (/pt/insomnia-treatment).
 *
 * Reutiliza o componente InsomniaTreatmentPage da rota inglesa.
 */

import { createFileRoute } from "@tanstack/react-router";
import { InsomniaTreatmentPage } from "@/routes/insomnia-treatment";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/insomnia-treatment")({
  component: InsomniaTreatmentPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.insomnia-treatment.title");
    const description = getPtString(t, "seo.insomnia-treatment.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/insomnia-treatment" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/insomnia-treatment"),
    };
  },
});
