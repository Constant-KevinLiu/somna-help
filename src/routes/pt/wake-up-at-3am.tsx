/**
 * Acordar às 3 da manhã em português brasileiro (/pt/wake-up-at-3am).
 *
 * Reutiliza o componente WakeUp3amPage da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n(), e o fluxo de
 * despertar noturno é lido do dicionário CBT-I em português.
 */

import { createFileRoute } from "@tanstack/react-router";
import { WakeUp3amPage } from "@/routes/wake-up-at-3am";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt/wake-up-at-3am")({
  component: WakeUp3amPage,
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.wake-up-at-3am.title");
    const description = getPtString(t, "seo.wake-up-at-3am.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://somna.help/pt/wake-up-at-3am" },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks("/pt/wake-up-at-3am"),
    };
  },
});
