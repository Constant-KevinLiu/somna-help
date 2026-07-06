/**
 * Lęk a sen po polsku (/pl/sleep-anxiety).
 */

import { createFileRoute } from "@tanstack/react-router";
import { SleepAnxietyPage } from "@/routes/sleep-anxiety";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/sleep-anxiety")({
  component: SleepAnxietyPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.sleep-anxiety.title");
    const description = getPlString(t, "seo.sleep-anxiety.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pl/sleep-anxiety" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
      ],
      links: hreflangLinks("/pl/sleep-anxiety"),
    };
  },
});
