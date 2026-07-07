/**
 * Calculadora de melatonina en español (/es/melatonin-calculator).
 *
 * Reutiliza el componente MelatoninCalculatorPage de la ruta inglesa. El idioma
 * se deriva automáticamente de la ruta (/es/** → "es") vía useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { MelatoninCalculatorPage } from "@/routes/melatonin-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/melatonin-calculator")({
  component: MelatoninCalculatorPage,
  head: () => ({
    meta: [
      { title: "Calculadora de melatonina — somna" },
      {
        name: "description",
        content: "Calcula cuándo tomar melatonina y en qué dosis según tu hora objetivo de sueño.",
      },
      { property: "og:title", content: "Calculadora de melatonina — somna" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/melatonin-calculator" },
    ],
    links: hreflangLinks("/es/melatonin-calculator"),
  }),
});
