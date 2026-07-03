/**
 * Calculadora de soneca em português brasileiro (/pt/nap-calculator).
 *
 * Reutiliza o componente NapCalculatorPage da rota inglesa. O idioma é
 * derivado automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { NapCalculatorPage } from "@/routes/nap-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/nap-calculator")({
  component: NapCalculatorPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.nap-calculator.title");
    const description = getPtString(t, "seo.nap-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/nap-calculator" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/nap-calculator"),
    };
  },
});
