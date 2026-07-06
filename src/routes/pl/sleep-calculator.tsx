/**
 * Kalkulator godzin snu po polsku (/pl/sleep-calculator).
 *
 * Ponownie wykorzystuje komponent SleepCalculatorPage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { SleepCalculatorPage } from "@/routes/sleep-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/sleep-calculator")({
  component: SleepCalculatorPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.sleep-calculator.title");
    const description = getPlString(t, "seo.sleep-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/sleep-calculator" },
      ],
      links: hreflangLinks("/pl/sleep-calculator"),
    };
  },
});
