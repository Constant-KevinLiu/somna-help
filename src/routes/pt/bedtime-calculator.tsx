/**
 * Calculadora de hora de dormir em português brasileiro
 * (/pt/bedtime-calculator).
 *
 * Reutiliza o componente BedtimeCalculatorPage da rota inglesa. O idioma é
 * derivado automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { BedtimeCalculatorPage } from "@/routes/bedtime-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/bedtime-calculator")({
  component: BedtimeCalculatorPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.bedtime-calculator.title");
    const description = getPtString(t, "seo.bedtime-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/bedtime-calculator" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/bedtime-calculator"),
    };
  },
});
