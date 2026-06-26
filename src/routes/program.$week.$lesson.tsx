import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonTemplate, lessonHead } from "@/components/program/LessonTemplate";
import { useI18n } from "@/lib/i18n";
import {
  getLessonMetaByWeekAndSlug,
  isValidWeekSlug,
  loadLesson,
} from "@/lib/program-lessons";

export const Route = createFileRoute("/program/$week/$lesson")({
  // Lazy-load the week's full lesson content in the loader so each lesson
  // route only bundles the content it actually needs.
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
      return { meta: [{ title: "CBT-I Lesson — somna" }] };
    }
    // head() runs before the component mounts, so we can't read the live lang
    // from the hook here. We default to English for SSR meta; the client will
    // hydrate with the user's chosen language via the component.
    return lessonHead(lesson, "en");
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Lesson not found</h1>
      <p className="mt-3 text-muted-foreground">
        That lesson of the program doesn't exist.
      </p>
    </div>
  ),
  component: LessonRoute,
});

function LessonRoute() {
  const { lesson } = Route.useLoaderData();
  const { lang } = useI18n();
  // Re-emit head with the user's language on the client. TanStack Router's head
  // is primarily for SSR; for client-side language switches the document title
  // is updated here.
  if (typeof document !== "undefined") {
    const c = lesson.i18n[lang] ?? lesson.i18n.en;
    if (document.title !== c.seoTitle) document.title = c.seoTitle;
  }
  return <LessonTemplate lesson={lesson} />;
}
