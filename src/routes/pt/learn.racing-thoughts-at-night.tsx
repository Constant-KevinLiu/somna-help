/**
 * Lição "Pensamentos acelerados à noite" em português brasileiro
 * (/pt/learn/racing-thoughts-at-night).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPt } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pt/learn/racing-thoughts-at-night")({
  component: Page,
  head: () => learnHeadPt("racing-thoughts-at-night"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["racing-thoughts-at-night"];
  return <LearnLessonTemplate slug="racing-thoughts-at-night" lesson={lesson} />;
}
