/**
 * Layout główny wersji polskiej (/pl/...).
 *
 * - Ustawia domyślne meta w języku polskim.
 * - ⚠️ NIE renderuje Header/Footer: są one renderowane przez __root.tsx
 *   (RootComponent). Renderowanie ich tutaj zduplikowałoby nawigację.
 *   Ten layout dodaje tylko <Outlet/>, aby strony podrzędne wyświetlały się
 *   wewnątrz pojedynczej powłoki.
 *
 * UWAGA: Ten layout otacza WSZYSTKIE trasy pod /pl/. Strony podrzędne
 * (pl/index, pl/program itd.) dziedziczą ten layout automatycznie.
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl")({
  head: () => {
    const t = loadPlDict();
    return {
      meta: [
        { name: "lang", content: "pl" },
        { title: getPlString(t, "seo.home.title") },
        { name: "description", content: getPlString(t, "seo.home.description") },
        { property: "og:locale", content: "pl_PL" },
      ],
      // Nie wstrzykujemy linków tutaj: każda strona /pl/* wstrzykuje własny
      // hreflang + canonical przez hreflangLinks(). Zapobiega to duplikatom canonical.
    };
  },
  component: PlLayout,
});

function PlLayout() {
  // Tylko Outlet. Header i Footer dostarcza __root.tsx jeden raz.
  return <Outlet />;
}
