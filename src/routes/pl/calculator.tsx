/**
 * Kalkulator cykli snu po polsku (/pl/calculator).
 *
 * Ponownie wykorzystuje komponent CalculatorPage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CalculatorPage } from "@/routes/calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/calculator")({
  component: CalculatorPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.calculator.title");
    const description = getPlString(t, "seo.calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/calculator" },
      ],
      links: hreflangLinks("/pl/calculator"),
    };
  },
});
