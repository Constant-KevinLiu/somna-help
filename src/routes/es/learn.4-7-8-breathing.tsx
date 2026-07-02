/**
 * Lección "Respiración 4-7-8" en español (/es/learn/4-7-8-breathing).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadEs } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/es/learn/4-7-8-breathing")({
  component: Page,
  head: () => learnHeadEs("4-7-8-breathing"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["4-7-8-breathing"];
  return <LearnLessonTemplate slug="4-7-8-breathing" lesson={lesson} />;
}
