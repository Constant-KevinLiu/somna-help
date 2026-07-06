/**
 * Layout polskiego programu CBT-I (/pl/program).
 *
 * Ta trasa działa jako layout dla wszystkich podtras pod /pl/program/:
 *   - /pl/program/        → pl/program.index.tsx (spis programu)
 *   - /pl/program/$slug   → pl/program.$slug.tsx (strona każdego tygodnia)
 *   - /pl/program/$week/$lesson → pl/program.$week.$lesson.tsx (lekcje)
 *
 * Renderuje tylko <Outlet/>. Header i Footer dostarcza __root.tsx.
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { loadPlDict, getPlString } from "@/locales/pl";

export const Route = createFileRoute("/pl/program")({
  head: () => {
    const t = loadPlDict();
    return {
      meta: [
        { name: "lang", content: "pl" },
        { title: getPlString(t, "seo.program.title") },
        { name: "description", content: getPlString(t, "seo.program.description") },
        { property: "og:locale", content: "pl_PL" },
      ],
    };
  },
  component: PlProgramLayout,
});

function PlProgramLayout() {
  return <Outlet />;
}
