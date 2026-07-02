/**
 * Cómo quedarse dormido rápido en español (/es/how-to-fall-asleep-fast).
 *
 * Reutiliza el componente FallAsleepFastPage de la ruta inglesa.
 */

import { createFileRoute } from "@tanstack/react-router";
import { FallAsleepFastPage } from "@/routes/how-to-fall-asleep-fast";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/es/how-to-fall-asleep-fast")({
  component: FallAsleepFastPage,
  head: () => {
    const a = getCbtiDict("es").articles["how-to-fall-asleep-fast"];
    return {
      meta: [
        { title: a.meta.title },
        { name: "description", content: a.meta.desc },
        { property: "og:title", content: a.meta.title },
        { property: "og:description", content: a.meta.desc },
        { property: "og:url", content: "https://somna.help/es/how-to-fall-asleep-fast" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_ES" },
      ],
      links: hreflangLinks("/es/how-to-fall-asleep-fast"),
    };
  },
});
