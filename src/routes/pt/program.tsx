/**
 * Layout do Programa TCC-I em português (/pt/program).
 *
 * Esta rota atua como layout para todas as subrotas sob /pt/program/:
 *   - /pt/program/        → pt/program.index.tsx (índice do programa)
 *   - /pt/program/$slug   → pt/program.$slug.tsx (página de cada semana)
 *   - /pt/program/$week/$lesson → pt/program.$week.$lesson.tsx (lições)
 *
 * Apenas renderiza <Outlet/>. Header e Footer são fornecidos por __root.tsx.
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/pt/program")({
  head: () => ({
    meta: [
      { name: "lang", content: "pt" },
      { title: "Programa TCC-I em 6 semanas — somna" },
      {
        name: "description",
        content:
          "Uma jornada suave de 6 semanas e 18 lições para reconstruir seu sono passo a passo, baseado na terapia TCC-I.",
      },
      { property: "og:locale", content: "pt_BR" },
    ],
  }),
  component: PtProgramLayout,
});

function PtProgramLayout() {
  return <Outlet />;
}
