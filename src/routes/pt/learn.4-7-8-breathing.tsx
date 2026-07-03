/**
 * Lição "Respiração 4-7-8" em português brasileiro (/pt/learn/4-7-8-breathing).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPt } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pt/learn/4-7-8-breathing")({
  component: Page,
  head: () => learnHeadPt("4-7-8-breathing"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["4-7-8-breathing"];
  return <LearnLessonTemplate slug="4-7-8-breathing" lesson={lesson} />;
}
