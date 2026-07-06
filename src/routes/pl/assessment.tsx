/**
 * Ocena snu po polsku (/pl/assessment).
 *
 * Ponownie wykorzystuje komponent AssessPage z trasy angielskiej. Język jest
 * wnioskowany automatycznie z trasy (/pl/** → "pl") przez useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { AssessPage } from "@/routes/assessment";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/assessment")({
  component: AssessPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.assessment.title");
    const description = getPlString(t, "seo.assessment.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/assessment" },
      ],
      links: hreflangLinks("/pl/assessment"),
    };
  },
});
