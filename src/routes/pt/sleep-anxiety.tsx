/**
 * Ansiedade e sono em português brasileiro (/pt/sleep-anxiety).
 *
 * Reutiliza o componente SleepAnxietyPage da rota inglesa.
 */

import { createFileRoute } from "@tanstack/react-router";
import { SleepAnxietyPage } from "@/routes/sleep-anxiety";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/sleep-anxiety")({
  component: SleepAnxietyPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.sleep-anxiety.title");
    const description = getPtString(t, "seo.sleep-anxiety.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/sleep-anxiety" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/sleep-anxiety"),
    };
  },
});
