/**
 * Lección "Qué es la TCC-I" en español (/es/learn/what-is-cbti).
 *
 * Reutiliza LearnLessonTemplate. El idioma se deriva de la ruta (/es/** → "es").
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadEs } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/es/learn/what-is-cbti")({
  component: Page,
  head: () => learnHeadEs("what-is-cbti"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["what-is-cbti"];
  return <LearnLessonTemplate slug="what-is-cbti" lesson={lesson} />;
}
