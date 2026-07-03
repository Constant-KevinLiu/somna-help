/**
 * Centro de aprendizado em português brasileiro (/pt/learn).
 *
 * Reutiliza o componente LearnHub da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnHub } from "@/routes/learn.index";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/learn/")({
  component: LearnHub,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.learn-hub.title");
    const description = getPtString(t, "seo.learn-hub.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/learn" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/learn"),
    };
  },
});
