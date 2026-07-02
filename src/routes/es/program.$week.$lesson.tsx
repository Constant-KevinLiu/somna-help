/**
 * Página de lección individual del programa CBT-I en español
 * (/es/program/$week/$lesson).
 *
 * Reutiliza LessonTemplate de la ruta inglesa. El idioma se deriva
 * automáticamente de la ruta (/es/** → "es") vía useI18n(), por lo que el
 * contenido de cada lección se renderiza en español nativo (los textos
 * nativos viven en program-lessons-content/ → lesson.i18n.es).
 *
 * Meta title/description, hreflang bidireccional y canonical independientes
 * en español, generados por lessonHead(lesson, "es").
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonTemplate, lessonHead } from "@/components/program/LessonTemplate";
import { useI18n } from "@/lib/i18n";
import {
  getLessonMetaByWeekAndSlug,
  isValidWeekSlug,
  loadLesson,
} from "@/lib/program-lessons";

export const Route = createFileRoute("/es/program/$week/$lesson")({
  loader: async ({ params }) => {
    if (!isValidWeekSlug(params.week)) throw notFound();
    const meta = getLessonMetaByWeekAndSlug(params.week, params.lesson);
    if (!meta) throw notFound();
    const lesson = await loadLesson(params.week, params.lesson);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const lesson = loaderData?.lesson;
    if (!lesson) {
      return { meta: [{ title: "Lección CBT-I — somna" }] };
    }
    // head() se ejecuta antes del montaje del componente. Usamos español
    // para los meta SSR; el cliente se hidratará con el idioma del usuario.
    return lessonHead(lesson, "es");
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Lección no encontrada</h1>
      <p className="mt-3 text-muted-foreground">
        Esa lección del programa no existe.
      </p>
    </div>
  ),
  component: EsLessonRoute,
});

function EsLessonRoute() {
  const { lesson } = Route.useLoaderData();
  const { lang } = useI18n();
  // Reemite el head con el idioma del usuario en el cliente. El head de
  // TanStack Router es principalmente para SSR; para cambios de idioma en
  // cliente el título del documento se actualiza aquí.
  if (typeof document !== "undefined") {
    const c = lesson.i18n[lang] ?? lesson.i18n.en;
    if (document.title !== c.seoTitle) document.title = c.seoTitle;
  }
  return <LessonTemplate lesson={lesson} />;
}
