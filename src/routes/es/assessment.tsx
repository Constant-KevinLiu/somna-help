/**
 * Evaluación de sueño en español (/es/assessment).
 *
 * Reutiliza el componente AssessPage de la ruta inglesa. El idioma se deriva
 * automáticamente de la ruta (/es/** → "es") vía useI18n().
 *
 * Meta title/description y hreflang independientes en español.
 */

import { createFileRoute } from "@tanstack/react-router";
import { AssessPage } from "@/routes/assessment";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/assessment")({
  component: AssessPage,
  head: () => ({
    meta: [
      { title: "Test de sueño — somna" },
      {
        name: "description",
        content:
          "Una breve revisión basada en CBT-I para entender tu sueño y crear tu plan personalizado.",
      },
      { property: "og:title", content: "Test de sueño — somna" },
      {
        property: "og:description",
        content:
          "Cinco preguntas para entender tu sueño y crear tu plan personalizado de CBT-I.",
      },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/assessment" },
    ],
    links: hreflangLinks("/es/assessment"),
  }),
});
