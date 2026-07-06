/**
 * Dziennik snu po polsku (/pl/diary).
 *
 * Ponownie wykorzystuje komponent DiaryPage z trasy angielskiej.
 */

import { createFileRoute } from "@tanstack/react-router";
import { DiaryPage } from "@/routes/diary";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/diary")({
  component: DiaryPage,
  head: () => {
    const t = loadPlDict();
    const title = getPlString(t, "seo.diary.title");
    const description = getPlString(t, "seo.diary.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:url", content: "https://somna.help/pl/diary" },
      ],
      links: hreflangLinks("/pl/diary"),
    };
  },
});
