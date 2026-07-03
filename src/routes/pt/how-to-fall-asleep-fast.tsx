/**
 * Como adormecer rápido em português brasileiro (/pt/how-to-fall-asleep-fast).
 *
 * Reutiliza o componente FallAsleepFastPage da rota inglesa.
 */

import { createFileRoute } from "@tanstack/react-router";
import { FallAsleepFastPage } from "@/routes/how-to-fall-asleep-fast";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/how-to-fall-asleep-fast")({
  component: FallAsleepFastPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.how-to-fall-asleep-fast.title");
    const description = getPtString(t, "seo.how-to-fall-asleep-fast.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/how-to-fall-asleep-fast" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/how-to-fall-asleep-fast"),
    };
  },
});
