/**
 * Centro de aprendizaje en español (/es/learn).
 *
 * Reutiliza el componente LearnHub de la ruta inglesa. El idioma se deriva
 * automáticamente de la ruta (/es/** → "es") vía useI18n().
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnHub } from "@/routes/learn.index";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/es/learn/")({
  component: LearnHub,
  head: () => {
    const dict = getLearnDict("es");
    return {
      meta: [
        { title: "Aprende — Guías TCC-I y lecciones rápidas | Somna" },
        {
          name: "description",
          content:
            "Una biblioteca de guías TCC-I extensas y lecciones breves basadas en evidencia para entender el sueño — y a ti mismo.",
        },
        { property: "og:title", content: "Aprende — Guías TCC-I y lecciones rápidas | Somna" },
        {
          property: "og:description",
          content:
            "Educación sobre el sueño basada en evidencia — guías extensas y lecciones rápidas.",
        },
        { property: "og:url", content: "https://somna.help/es/learn" },
        { property: "og:locale", content: "es_ES" },
      ],
      links: hreflangLinks("/es/learn"),
    };
  },
});
