/**
 * Baza wiedzy po polsku (/pl/learn).
 *
 * Ponownie wykorzystuje komponent LearnHub z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnHub } from "@/routes/learn.index";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/learn/")({
  component: LearnHub,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.learn-hub.title");
    const description = getPlString(t, "seo.learn-hub.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pl/learn" },
        { property: "og:locale", content: "pl_PL" },
      ],
      links: hreflangLinks("/pl/learn"),
    };
  },
});
