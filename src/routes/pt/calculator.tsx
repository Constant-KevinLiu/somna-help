/**
 * Calculadora de ciclos de sono em português (/pt/calculator).
 *
 * Reutiliza o componente CalculatorPage da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { CalculatorPage } from "@/routes/calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/calculator")({
  component: CalculatorPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.calculator.title");
    const description = getPtString(t, "seo.calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: "https://somna.help/pt/calculator" },
      ],
      links: hreflangLinks("/pt/calculator"),
    };
  },
});
