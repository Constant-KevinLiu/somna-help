/**
 * Budzenie się o 3 w nocy po polsku (/pl/wake-up-at-3am).
 */

import { createFileRoute } from "@tanstack/react-router";
import { WakeUp3amPage } from "@/routes/wake-up-at-3am";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/wake-up-at-3am")({
  component: WakeUp3amPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.wake-up-at-3am.title");
    const description = getPlString(t, "seo.wake-up-at-3am.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pl/wake-up-at-3am" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
      ],
      links: hreflangLinks("/pl/wake-up-at-3am"),
    };
  },
});
