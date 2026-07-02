/**
 * Ansiedad y sueño en español (/es/sleep-anxiety).
 *
 * Reutiliza el componente SleepAnxietyPage de la ruta inglesa.
 */

import { createFileRoute } from "@tanstack/react-router";
import { SleepAnxietyPage } from "@/routes/sleep-anxiety";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/es/sleep-anxiety")({
  component: SleepAnxietyPage,
  head: () => {
    const a = getCbtiDict("es").articles["sleep-anxiety"];
    return {
      meta: [
        { title: a.meta.title },
        { name: "description", content: a.meta.desc },
        { property: "og:title", content: a.meta.title },
        { property: "og:description", content: a.meta.desc },
        { property: "og:url", content: "https://somna.help/es/sleep-anxiety" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_ES" },
      ],
      links: hreflangLinks("/es/sleep-anxiety"),
    };
  },
});
