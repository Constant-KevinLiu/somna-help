/**
 * Calculadora de ciclos de sueño en español (/es/calculator).
 *
 * Reutiliza el componente CalculatorPage de la ruta inglesa. El idioma se
 * deriva automáticamente de la ruta (/es/** → "es") vía useI18n(), por lo que
 * toda la interfaz se renderiza en español nativo sin lógica de traducción.
 *
 * Meta title/description y hreflang independientes en español.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CalculatorPage } from "@/routes/calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/calculator")({
  component: CalculatorPage,
  head: () => ({
    meta: [
      { title: "Calculadora de sueño — somna" },
      {
        name: "description",
        content:
          "Descubre tu hora ideal de acostarte y levantarte usando los ciclos naturales de sueño de 90 minutos.",
      },
      { property: "og:title", content: "Calculadora de sueño — somna" },
      {
        property: "og:description",
        content:
          "Calcula tu hora ideal de dormir según los ciclos de 90 minutos.",
      },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/calculator" },
    ],
    links: hreflangLinks("/es/calculator"),
  }),
});
