/**
 * Diário do sono em português (/pt/diary).
 *
 * Reutiliza o componente DiaryPage da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { DiaryPage } from "@/routes/diary";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/diary")({
  component: DiaryPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.diary.title");
    const description = getPtString(t, "seo.diary.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: "https://somna.help/pt/diary" },
      ],
      links: hreflangLinks("/pt/diary"),
    };
  },
});
