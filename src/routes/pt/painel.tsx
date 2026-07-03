/**
 * Painel do sono em português (/pt/painel).
 *
 * Reutiliza o componente Dash da rota inglesa /dashboard. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n().
 *
 * Nota: o slug em português é "painel" (não "panel" nem "dashboard").
 * O mapeamento /pt/painel ↔ /dashboard é tratado em switchRouteLang().
 */

import { createFileRoute } from "@tanstack/react-router";
import { Dash } from "@/routes/dashboard";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/painel")({
  component: Dash,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.painel.title");
    const description = getPtString(t, "seo.painel.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: "https://somna.help/pt/painel" },
      ],
      links: hreflangLinks("/pt/painel"),
    };
  },
});
