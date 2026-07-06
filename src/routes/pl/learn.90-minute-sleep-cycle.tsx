/**
 * Lekcja "90-minutowy cykl snu" po polsku (/pl/learn/90-minute-sleep-cycle).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPl } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pl/learn/90-minute-sleep-cycle")({
  component: Page,
  head: () => learnHeadPl("90-minute-sleep-cycle"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["90-minute-sleep-cycle"];
  return <LearnLessonTemplate slug="90-minute-sleep-cycle" lesson={lesson} />;
}
