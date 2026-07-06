/**
 * Leczenie bezsenności po polsku (/pl/insomnia-treatment).
 */

import { createFileRoute } from "@tanstack/react-router";
import { InsomniaTreatmentPage } from "@/routes/insomnia-treatment";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/insomnia-treatment")({
  component: InsomniaTreatmentPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.insomnia-treatment.title");
    const description = getPlString(t, "seo.insomnia-treatment.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pl/insomnia-treatment" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
      ],
      links: hreflangLinks("/pl/insomnia-treatment"),
    };
  },
});
