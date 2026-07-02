/**
 * Tratamiento del insomnio en español (/es/insomnia-treatment).
 *
 * Reutiliza el componente InsomniaTreatmentPage de la ruta inglesa.
 */

import { createFileRoute } from "@tanstack/react-router";
import { InsomniaTreatmentPage } from "@/routes/insomnia-treatment";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/es/insomnia-treatment")({
  component: InsomniaTreatmentPage,
  head: () => {
    const a = getCbtiDict("es").articles["insomnia-treatment"];
    return {
      meta: [
        { title: a.meta.title },
        { name: "description", content: a.meta.desc },
        { property: "og:title", content: a.meta.title },
        { property: "og:description", content: a.meta.desc },
        { property: "og:url", content: "https://somna.help/es/insomnia-treatment" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_ES" },
      ],
      links: hreflangLinks("/es/insomnia-treatment"),
    };
  },
});
