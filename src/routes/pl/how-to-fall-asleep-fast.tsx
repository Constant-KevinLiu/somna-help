/**
 * Jak szybciej zasnąć po polsku (/pl/how-to-fall-asleep-fast).
 */

import { createFileRoute } from "@tanstack/react-router";
import { FallAsleepFastPage } from "@/routes/how-to-fall-asleep-fast";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/how-to-fall-asleep-fast")({
  component: FallAsleepFastPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.how-to-fall-asleep-fast.title");
    const description = getPlString(t, "seo.how-to-fall-asleep-fast.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pl/how-to-fall-asleep-fast" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
      ],
      links: hreflangLinks("/pl/how-to-fall-asleep-fast"),
    };
  },
});
