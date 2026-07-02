/**
 * Calculadora de siestas en español (/es/nap-calculator).
 *
 * Reutiliza el componente NapCalculatorPage de la ruta inglesa. El idioma se
 * deriva automáticamente de la ruta (/es/** → "es") vía useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { NapCalculatorPage } from "@/routes/nap-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/nap-calculator")({
  component: NapCalculatorPage,
  head: () => ({
    meta: [
      { title: "Calculadora de siestas — somna" },
      {
        name: "description",
        content:
          "Calcula la duración ideal de tu siesta para recargar energía sin interferir en el sueño nocturno.",
      },
      { property: "og:title", content: "Calculadora de siestas — somna" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/nap-calculator" },
    ],
    links: hreflangLinks("/es/nap-calculator"),
  }),
});
