/**
 * Relajación y descanso en español (/es/relax).
 *
 * Reutiliza el componente RelaxPage de la ruta inglesa. El idioma se deriva
 * automáticamente de la ruta (/es/** → "es") vía useI18n().
 *
 * Meta title/description y hreflang independientes en español.
 */

import { createFileRoute } from "@tanstack/react-router";
import { RelaxPage } from "@/routes/relax";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/relax")({
  component: RelaxPage,
  head: () => ({
    meta: [
      { title: "Relajación y descanso — somna" },
      {
        name: "description",
        content:
          "Un espacio tranquilo para dejar ir el día: respiración 4-7-8, meditación y rituales calmados antes de dormir.",
      },
      { property: "og:title", content: "Relajación y descanso — somna" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/relax" },
    ],
    links: hreflangLinks("/es/relax"),
  }),
});
