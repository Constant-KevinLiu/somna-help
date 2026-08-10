import { Target, Info, Lightbulb, AlertCircle } from "lucide-react";
import { SafeLink } from "@/components/common/SafeLink";
import { useI18n } from "@/lib/i18n";
import { LANG_PREFIX } from "@/lib/lang-detect";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { useLessonTitle } from "@/hooks/use-lesson-title";
import type { WeeklyFocus, DataSufficiency } from "@/lib/analytics/types";
import type { ProgramDefinition, ProgramLessonDefinition } from "@/lib/program/types";
import { FOCUS_CATEGORY_TO_LESSON_DOMAINS } from "@/lib/program/weekly-focus-adapter";

type Props = {
  focus: WeeklyFocus | null;
  dataSufficiency: DataSufficiency;
  definition: ProgramDefinition;
  currentWeekId: string | null;
  /** Number of diary records in the evidence window */
  recordCount: number;
  evidenceDays: number;
  /** Translation function for analytics focus strings */
  t: (key: string) => string;
};

/**
 * Program-specific Weekly Focus section.
 *
 * Explains WHY the focus appears (data-driven), links to a related lesson,
 * and shows an honest "insufficient data" state when there isn't enough data.
 *
 * Does NOT:
 *  - Mark lessons complete
 *  - Change program state
 *  - Make diagnostic claims
 */
export function ProgramWeeklyFocusSection({
  focus,
  dataSufficiency,
  definition,
  currentWeekId,
  recordCount,
  evidenceDays,
  t,
}: Props) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);
  const langPrefix = LANG_PREFIX[lang];

  // Find a related lesson from the current week (or next available)
  const relatedLesson = findRelatedLesson(focus, definition, currentWeekId);

  // If data is insufficient, show an honest state
  if (dataSufficiency === "none" || dataSufficiency === "insufficient") {
    return (
      <section className="px-5 pb-8" aria-labelledby="program-focus-title">
        <div className="mx-auto max-w-3xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-accent" />
              {ui.weeklyFocusTitle}
            </div>

            <div className="mt-4 flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{ui.weeklyFocusInsufficient}</p>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {ui.weeklyFocusDataWindow.replace("7", String(evidenceDays))}: {recordCount}{" "}
              {recordCount === 1 ? "entry" : "entries"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!focus) return null;

  const reasonText = t(`analytics.focus.${focus.category}.reason`);
  const actionText = t(`analytics.focus.${focus.category}.action`);
  const hasReason = reasonText !== `analytics.focus.${focus.category}.reason`;
  const hasAction = actionText !== `analytics.focus.${focus.category}.action`;

  return (
    <section className="px-5 pb-8" aria-labelledby="program-focus-title">
      <div className="mx-auto max-w-3xl">
        <div className="glass-strong rounded-3xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-accent" />
            <span id="program-focus-title">{ui.weeklyFocusTitle}</span>
          </div>

          {/* Focus statement */}
          <div className="mt-3 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <p className="text-sm font-medium text-foreground">
              {hasAction ? actionText : focus.category.replace(/_/g, " ")}
            </p>
          </div>

          {/* Why this appears */}
          {hasReason && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                {ui.weeklyFocusWhy}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{reasonText}</p>
            </div>
          )}

          {/* Data basis */}
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              {ui.weeklyFocusBasedOn} {recordCount} {recordCount === 1 ? "entry" : "entries"} /{" "}
              {evidenceDays} days
            </span>
          </div>

          {/* Related lesson */}
          {relatedLesson && (
            <RelatedLessonLink
              lesson={relatedLesson}
              langPrefix={langPrefix}
              weekLabel={ui.weekLabel}
              lessonLabel={ui.lessonLabel}
              relatedLessonLabel={ui.weeklyFocusRelatedLesson}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Find a lesson related to the focus category.
 * Prefers a lesson in the current week, otherwise the first matching lesson.
 */
function findRelatedLesson(
  focus: WeeklyFocus | null,
  definition: ProgramDefinition,
  currentWeekId: string | null,
): ProgramLessonDefinition | null {
  if (!focus) return null;

  const relatedTags = FOCUS_CATEGORY_TO_LESSON_DOMAINS[focus.category] ?? [];
  if (relatedTags.length === 0) return null;

  // First: try current week
  if (currentWeekId) {
    const currentWeekLessons = definition.lessons.filter((l) => l.weekId === currentWeekId);
    const match = currentWeekLessons.find((l) => l.tags.some((t) => relatedTags.includes(t)));
    if (match) return match;
  }

  // Fallback: first lesson in the program with matching tags
  const match = definition.lessons.find((l) => l.tags.some((t) => relatedTags.includes(t)));
  return match ?? null;
}

function getWeekNumber(weekId: string): number {
  const m = weekId.match(/week-(\d+)/);
  return m ? Number(m[1]) : 1;
}

// -----------------------------------------------------------------------------
// RelatedLessonLink — loads localized lesson title via shared hook
// -----------------------------------------------------------------------------

function RelatedLessonLink({
  lesson,
  langPrefix,
  weekLabel,
  lessonLabel,
  relatedLessonLabel,
}: {
  lesson: ProgramLessonDefinition;
  langPrefix: string;
  weekLabel: string;
  lessonLabel: string;
  relatedLessonLabel: string;
}) {
  const { lang } = useI18n();
  const title = useLessonTitle(lesson.weekId, lesson.id, lang);

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Lightbulb className="h-3.5 w-3.5 text-accent" />
        {relatedLessonLabel}
      </div>
      <SafeLink
        to={`${langPrefix}/program/${lesson.weekId}/${lesson.id}`}
        className="mt-2 group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30">
          <Lightbulb className="h-4 w-4 text-accent" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground group-hover:text-accent">
            {title ?? `${lessonLabel} ${lesson.order}`}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {weekLabel} {getWeekNumber(lesson.weekId)}
          </p>
        </div>
      </SafeLink>
    </div>
  );
}
