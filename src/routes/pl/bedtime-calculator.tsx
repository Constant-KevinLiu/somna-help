/**
 * Kalkulator pory snu po polsku (/pl/bedtime-calculator).
 *
 * Ponownie wykorzystuje komponent BedtimeCalculatorPage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { BedtimeCalculatorPage } from "@/routes/bedtime-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/bedtime-calculator")({
  component: BedtimeCalculatorPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.bedtime-calculator.title");
    const description = getPlString(t, "seo.bedtime-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/bedtime-calculator" },
      ],
      links: hreflangLinks("/pl/bedtime-calculator"),
    };
  },
});
