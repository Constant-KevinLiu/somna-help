/**
 * Lição "O que é TCC-I" em português brasileiro (/pt/learn/what-is-cbti).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPt } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pt/learn/what-is-cbti")({
  component: Page,
  head: () => learnHeadPt("what-is-cbti"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["what-is-cbti"];
  return <LearnLessonTemplate slug="what-is-cbti" lesson={lesson} />;
}
