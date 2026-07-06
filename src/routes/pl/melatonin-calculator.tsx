/**
 * Kalkulator melatoniny po polsku (/pl/melatonin-calculator).
 *
 * Ponownie wykorzystuje komponent MelatoninCalculatorPage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { MelatoninCalculatorPage } from "@/routes/melatonin-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/melatonin-calculator")({
  component: MelatoninCalculatorPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.melatonin-calculator.title");
    const description = getPlString(t, "seo.melatonin-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/melatonin-calculator" },
      ],
      links: hreflangLinks("/pl/melatonin-calculator"),
    };
  },
});
