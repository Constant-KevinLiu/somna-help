/**
 * Przewodnik CBT-I po polsku (/pl/cbt-i-guide).
 *
 * Ponownie wykorzystuje komponent CbtIGuidePage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CbtIGuidePage } from "@/routes/cbt-i-guide";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/cbt-i-guide")({
  component: CbtIGuidePage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.cbt-i-guide.title");
    const description = getPlString(t, "seo.cbt-i-guide.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pl/cbt-i-guide" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
      ],
      links: hreflangLinks("/pl/cbt-i-guide"),
    };
  },
});
