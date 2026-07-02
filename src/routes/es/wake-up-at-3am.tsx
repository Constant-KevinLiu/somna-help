/**
 * Despertar a las 3 de la madrugada en español (/es/wake-up-at-3am).
 *
 * Reutiliza el componente WakeUp3amPage de la ruta inglesa.
 */

import { createFileRoute } from "@tanstack/react-router";
import { WakeUp3amPage } from "@/routes/wake-up-at-3am";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/es/wake-up-at-3am")({
  component: WakeUp3amPage,
  head: () => {
    const a = getCbtiDict("es").articles["wake-up-at-3am"];
    return {
      meta: [
        { title: a.meta.title },
        { name: "description", content: a.meta.desc },
        { property: "og:title", content: a.meta.title },
        { property: "og:description", content: a.meta.desc },
        { property: "og:url", content: "https://somna.help/es/wake-up-at-3am" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_ES" },
      ],
      links: hreflangLinks("/es/wake-up-at-3am"),
    };
  },
});
