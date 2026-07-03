/**
 * Relaxamento e descanso em português (/pt/relax).
 *
 * Reutiliza o componente RelaxPage da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { RelaxPage } from "@/routes/relax";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/relax")({
  component: RelaxPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.relax.title");
    const description = getPtString(t, "seo.relax.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: "https://somna.help/pt/relax" },
      ],
      links: hreflangLinks("/pt/relax"),
    };
  },
});
