/**
 * Calculadora de horas de sono em português brasileiro (/pt/sleep-calculator).
 *
 * Reutiliza o componente SleepCalculatorPage da rota inglesa. O idioma é
 * derivado automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { SleepCalculatorPage } from "@/routes/sleep-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/sleep-calculator")({
  component: SleepCalculatorPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.sleep-calculator.title");
    const description = getPtString(t, "seo.sleep-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/sleep-calculator" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/sleep-calculator"),
    };
  },
});
