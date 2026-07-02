/**
 * Layout raíz de la versión en español (/es/...).
 *
 * - Establece los meta por defecto en español e inyecta hreflang bidireccional
 *   + canonical.
 * - ⚠️ NO renderiza Header/Footer: ya los renderiza __root.tsx (RootComponent).
 *   Renderizarlos aquí duplicaría la navegación. Este layout solo añade el
 *   <Outlet/> para que las páginas hijas se muestren dentro del shell único.
 *
 * NOTA: Este layout envuelve TODAS las rutas bajo /es/. Las páginas hijas
 * (es/index, es/program, etc.) heredan este layout automáticamente.
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/es")({
  head: () => ({
    meta: [
      { name: "lang", content: "es" },
      { title: "somna — Vuelve a dormir bien, esta misma noche" },
      {
        name: "description",
        content:
          "Somna es tu acompañante de sueño basado en CBT-I. Sin pastillas, sin presión: pequeños cambios diarios para recuperar tu ritmo natural de descanso.",
      },
      { property: "og:locale", content: "es_ES" },
    ],
    // No inyectamos links aquí: cada página /es/* inyecta su propio
    // hreflang + canonical vía hreflangLinks(). Evita canonical duplicados.
  }),
  component: EsLayout,
});

function EsLayout() {
  // Solo el Outlet. Header y Footer los provee __root.tsx una sola vez.
  return <Outlet />;
}
