/**
 * Lekcja "Czym jest CBT-I" po polsku (/pl/learn/what-is-cbti).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPl } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pl/learn/what-is-cbti")({
  component: Page,
  head: () => learnHeadPl("what-is-cbti"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["what-is-cbti"];
  return <LearnLessonTemplate slug="what-is-cbti" lesson={lesson} />;
}
