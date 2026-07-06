/**
 * Kalkulator drzemki po polsku (/pl/nap-calculator).
 *
 * Ponownie wykorzystuje komponent NapCalculatorPage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { NapCalculatorPage } from "@/routes/nap-calculator";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/nap-calculator")({
  component: NapCalculatorPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.nap-calculator.title");
    const description = getPlString(t, "seo.nap-calculator.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/nap-calculator" },
      ],
      links: hreflangLinks("/pl/nap-calculator"),
    };
  },
});
