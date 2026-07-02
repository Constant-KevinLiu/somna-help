/**
 * Calculadora de hora de acostarse en español (/es/bedtime-calculator).
 *
 * Reutiliza el componente BedtimeCalculatorPage de la ruta inglesa. El idioma
 * se deriva automáticamente de la ruta (/es/** → "es") vía useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { BedtimeCalculatorPage } from "@/routes/bedtime-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/bedtime-calculator")({
  component: BedtimeCalculatorPage,
  head: () => ({
    meta: [
      { title: "Calculadora de hora de acostarse — somna" },
      {
        name: "description",
        content:
          "Descubre a qué hora deberías acostarte esta noche según la hora a la que quieres levantarte.",
      },
      { property: "og:title", content: "Calculadora de hora de acostarse — somna" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/bedtime-calculator" },
    ],
    links: hreflangLinks("/es/bedtime-calculator"),
  }),
});
