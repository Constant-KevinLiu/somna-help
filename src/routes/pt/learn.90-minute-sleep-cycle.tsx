/**
 * Lição "Ciclo de sono de 90 minutos" em português brasileiro
 * (/pt/learn/90-minute-sleep-cycle).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPt } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pt/learn/90-minute-sleep-cycle")({
  component: Page,
  head: () => learnHeadPt("90-minute-sleep-cycle"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["90-minute-sleep-cycle"];
  return <LearnLessonTemplate slug="90-minute-sleep-cycle" lesson={lesson} />;
}
