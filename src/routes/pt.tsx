/**
 * Layout raiz da versão em português (/pt/...).
 *
 * - Define os meta padrão em português e injeta hreflang bidirecional +
 *   canonical.
 * - ⚠️ NÃO renderiza Header/Footer: já são renderizados por __root.tsx
 *   (RootComponent). Renderizá-los aqui duplicaria a navegação. Este layout
 *   apenas adiciona o <Outlet/> para que as páginas filhas sejam exibidas
 *   dentro do shell único.
 *
 * NOTA: Este layout envolve TODAS as rotas sob /pt/. As páginas filhas
 * (pt/index, pt/program, etc.) herdam este layout automaticamente.
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { loadPtDict, getPtString } from "@/locales/pt";

export const Route = createFileRoute("/pt")({
  head: () => {
    const t = loadPtDict();
    return {
      meta: [
        { name: "lang", content: "pt" },
        { title: getPtString(t, "seo.home.title") },
        { name: "description", content: getPtString(t, "seo.home.description") },
        { property: "og:locale", content: "pt_BR" },
      ],
      // Não injetamos links aqui: cada página /pt/* injeta seu próprio
      // hreflang + canonical via hreflangLinks(). Evita canonical duplicados.
    };
  },
  component: PtLayout,
});

function PtLayout() {
  // Apenas o Outlet. Header e Footer são fornecidos por __root.tsx uma única vez.
  return <Outlet />;
}
