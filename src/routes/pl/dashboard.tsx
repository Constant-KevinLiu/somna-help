/**
 * Panel danych po polsku (/pl/dashboard).
 *
 * Ponownie wykorzystuje komponent Dash z trasy angielskiej /dashboard.
 */

import { createFileRoute } from "@tanstack/react-router";
import { Dash } from "@/routes/dashboard";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/dashboard")({
  component: Dash,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.dashboard.title");
    const description = getPlString(t, "seo.dashboard.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/dashboard" },
      ],
      links: hreflangLinks("/pl/dashboard"),
    };
  },
});
