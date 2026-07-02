/**
 * Layout del Programa CBT-I en español (/es/program).
 *
 * Esta ruta actúa como layout para todas las subrutas bajo /es/program/:
 *   - /es/program/        → es/program.index.tsx (índice del programa)
 *   - /es/program/$slug   → es/program.$slug.tsx (página de cada semana)
 *
 * Solo renderiza <Outlet/>. Header y Footer los provee __root.tsx una sola vez.
 * Los meta por defecto del programa viven aquí; las páginas hijas pueden
 * sobrescribirlos con sus propios head().
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/es/program")({
  head: () => ({
    meta: [
      { name: "lang", content: "es" },
      { title: "Programa CBT-I en 6 semanas — somna" },
      {
        name: "description",
        content:
          "Un viaje suave de 6 semanas y 18 lecciones para reconstruir tu sueño paso a paso, basado en la terapia CBT-I.",
      },
      { property: "og:locale", content: "es_ES" },
    ],
  }),
  component: EsProgramLayout,
});

function EsProgramLayout() {
  return <Outlet />;
}
