/**
 * Panel de sueño en español (/es/panel).
 *
 * Reutiliza el componente Dash de la ruta inglesa /dashboard. El idioma se
 * deriva automáticamente de la ruta (/es/** → "es") vía useI18n(), por lo que
 * todo el panel se renderiza en español nativo.
 *
 * Meta title/description y hreflang independientes en español.
 */

import { createFileRoute } from "@tanstack/react-router";
import { Dash } from "@/routes/dashboard";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/panel")({
  component: Dash,
  head: () => ({
    meta: [
      { title: "Tu panel de sueño — somna" },
      {
        name: "description",
        content:
          "Tu plan de sueño para esta noche, tu eficiencia y tu racha de constancia, de un vistazo.",
      },
      { property: "og:title", content: "Tu panel de sueño — somna" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/panel" },
    ],
    links: hreflangLinks("/es/panel"),
  }),
});

