/**
 * Calculadora de sueño (horas recomendadas) en español (/es/sleep-calculator).
 *
 * Reutiliza el componente SleepCalculatorPage de la ruta inglesa. El idioma se
 * deriva automáticamente de la ruta (/es/** → "es") vía useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { SleepCalculatorPage } from "@/routes/sleep-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/sleep-calculator")({
  component: SleepCalculatorPage,
  head: () => ({
    meta: [
      { title: "Calculadora de horas de sueño — somna" },
      {
        name: "description",
        content:
          "Calcula cuántas horas necesitas dormir según tu edad y planifica tu hora de acostarte y levantarte.",
      },
      { property: "og:title", content: "Calculadora de horas de sueño — somna" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/sleep-calculator" },
    ],
    links: hreflangLinks("/es/sleep-calculator"),
  }),
});
