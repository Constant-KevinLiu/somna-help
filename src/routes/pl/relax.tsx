/**
 * Relaks i odpoczynek po polsku (/pl/relax).
 *
 * Ponownie wykorzystuje komponent RelaxPage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { RelaxPage } from "@/routes/relax";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/relax")({
  component: RelaxPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.relax.title");
    const description = getPlString(t, "seo.relax.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/relax" },
      ],
      links: hreflangLinks("/pl/relax"),
    };
  },
});
