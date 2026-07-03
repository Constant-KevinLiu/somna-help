/**
 * Calculadora de melatonina em português brasileiro (/pt/melatonin-calculator).
 *
 * Reutiliza o componente MelatoninCalculatorPage da rota inglesa. O idioma é
 * derivado automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { MelatoninCalculatorPage } from "@/routes/melatonin-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/melatonin-calculator")({
  component: MelatoninCalculatorPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.melatonin-calculator.title");
    const description = getPtString(t, "seo.melatonin-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/melatonin-calculator" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/melatonin-calculator"),
    };
  },
});
