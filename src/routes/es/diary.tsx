/**
 * Diario de sueño en español (/es/diary).
 *
 * Reutiliza el componente DiaryPage de la ruta inglesa. El idioma se deriva
 * automáticamente de la ruta (/es/** → "es") vía useI18n().
 *
 * Meta title/description y hreflang independientes en español.
 */

import { createFileRoute } from "@tanstack/react-router";
import { DiaryPage } from "@/routes/diary";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/diary")({
  component: DiaryPage,
  head: () => ({
    meta: [
      { title: "Diario de sueño — somna" },
      {
        name: "description",
        content:
          "Anota tu sueño en tres minutos cada mañana. Sin juicio, sin presión: solo entender qué pasa por la noche.",
      },
      { property: "og:title", content: "Diario de sueño — somna" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: "https://somna.help/es/diary" },
    ],
    links: hreflangLinks("/es/diary"),
  }),
});
