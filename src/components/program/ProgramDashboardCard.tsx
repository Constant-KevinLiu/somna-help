import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import { SafeLink } from "@/components/common/SafeLink";
import { ProgramUnsupportedBanner } from "./ProgramUnsupportedBanner";
import { useI18n } from "@/lib/i18n";
import { LANG_PREFIX } from "@/lib/lang-detect";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { useProgramService } from "@/lib/program/use-program-service";
import { getWeekByNumber } from "@/lib/program-weeks";
import { TOTAL_LESSONS } from "@/lib/program-lessons";
import type { ProgramLoadStatus } from "@/lib/program/use-program-service";

type Props = {
  onResume?: () => void;
  onPause?: () => void;
  onStart?: () => void;
};

/**
 * Dashboard Program Card — shows current program state and next action.
 *
 * Handles all lifecycle states:
 *  - loading (skeleton)
 *  - not-started (intro + start CTA)
 *  - active (progress + continue CTA)
 *  - paused (paused status + resume CTA)
 *  - completed (acknowledgment + review CTA)
 *  - unsupported-version (protected warning)
 */
export function ProgramDashboardCard({
  onResume,
  onStart,
}: Props) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);
  const {
    progress,
    hydrated,
    overallCompletion,
    recommendedNextLesson,
    currentWeekId,
    isUnsupportedSchema,
    loadStatus,
    startProgram,
    resumeProgram,
  } = useProgramService();
  const langPrefix = LANG_PREFIX[lang];

  const handleStart = onStart ?? startProgram;
  const handleResume = onResume ?? resumeProgram;

  // Loading state
  if (!hydrated) {
    return (
      <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5 text-accent" />
          {ui.dashProgramTitle}
        </div>
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  // Unsupported schema state
  if (isUnsupportedSchema) {
    return (
      <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5 text-accent" />
          {ui.dashProgramTitle}
        </div>
        <div className="mt-4">
          <ProgramUnsupportedBanner compact />
        </div>
      </div>
    );
  }

  const pct = overallCompletion;
  const nextLesson = recommendedNextLesson;
  const isComplete = pct === 100;
  const status = progress.status;
  const isNotStarted = status === "not_started";
  const isActive = status === "active";
  const isPaused = status === "paused";
  const isCompleted = status === "completed";

  // Current week info
  const weekMatch = currentWeekId?.match(/week-(\d+)/);
  const weekNumber = weekMatch ? Number(weekMatch[1]) : 1;
  const currentWeek = getWeekByNumber(weekNumber);
  const weekLocale = currentWeek ? (currentWeek.i18n[lang] ?? currentWeek.i18n.en) : null;

  // Next lesson info
  const nextLessonNumber = nextLesson?.order ?? 0;
  const nextLessonWeekSlug = nextLesson?.weekId ?? "";
  const nextLessonSlug = nextLesson?.id ?? "";

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5 text-accent" />
          {ui.dashProgramTitle}
        </div>
        <StatusBadge status={status} loadStatus={loadStatus} ui={ui} />
      </div>

      {/* Not started: intro state */}
      {isNotStarted && (
        <div className="mt-5">
          <p className="text-sm text-muted-foreground">{ui.startProgramSubtitle}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            {ui.programStructureInfo}
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            {ui.dashStartProgram}
          </button>
        </div>
      )}

      {/* Active / Paused / Completed: progress + metrics */}
      {!isNotStarted && (
        <>
          {/* Metrics grid */}
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <BrainMetric
              label={ui.dashCurrentWeek}
              value={weekLocale ? `${ui.weekLabel} ${weekNumber}` : "—"}
            />
            <BrainMetric
              label={ui.dashCurrentLesson}
              value={
                nextLesson
                  ? `${ui.lessonLabel} ${nextLessonNumber}`
                  : ui.dashProgramComplete
              }
            />
            <BrainMetric label={ui.dashCompletion} value={`${pct}%`} />
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>
                {progress.completedLessonIds.length} / {TOTAL_LESSONS}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={ui.dashCompletion}
              />
            </div>
          </div>

          {/* Active: next lesson CTA */}
          {isActive && nextLesson && (
            <SafeLink
              to={`${langPrefix}/program/${nextLessonWeekSlug}/${nextLessonSlug}`}
              className="group mt-5 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.07] p-4 transition hover:bg-accent/[0.12]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40">
                <BookOpen className="h-4 w-4 text-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {ui.dashRecommended}
                </div>
                <div className="mt-0.5 font-display text-base text-foreground">
                  {ui.lessonLabel} {nextLessonNumber}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                {ui.dashContinueLearning}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </SafeLink>
          )}

          {/* Paused: resume CTA */}
          {isPaused && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.07] p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                <Pause className="h-4 w-4 text-accent" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {ui.dashPausedStatus}
                </div>
                <p className="mt-0.5 text-sm text-foreground/90">
                  {ui.pausedProgressPreserved}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResume}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Play className="h-3.5 w-3.5" />
                {ui.dashResumeCta}
              </button>
            </div>
          )}

          {/* Completed: acknowledgment */}
          {isCompleted && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
              <GraduationCap className="h-5 w-5 shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {ui.dashProgramComplete}
                </p>
                <p className="text-xs text-muted-foreground">
                  {TOTAL_LESSONS} {ui.completionLessonsCount}
                </p>
              </div>
              <SafeLink
                to={`${langPrefix}/program`}
                className="inline-flex items-center gap-1.5 rounded-full border border-success/30 px-4 py-2 text-sm font-medium text-success transition hover:bg-success/10"
              >
                {ui.dashReviewCta}
                <ArrowRight className="h-3.5 w-3.5" />
              </SafeLink>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =============================================================================
// Subcomponents
// =============================================================================

function StatusBadge({
  status,
  loadStatus,
  ui,
}: {
  status: string;
  loadStatus: ProgramLoadStatus;
  ui: ReturnType<typeof getProgramLessonUI>;
}) {
  if (loadStatus === "corrupted") {
    return (
      <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-[10px] font-medium text-destructive">
        {ui.statusCorrupted}
      </span>
    );
  }

  const map: Record<string, { label: string; cls: string }> = {
    not_started: { label: ui.statusNotStarted, cls: "border-white/10 bg-white/5 text-muted-foreground" },
    active: { label: ui.statusActive, cls: "border-accent/30 bg-accent/10 text-accent" },
    paused: { label: ui.statusPaused, cls: "border-accent/30 bg-accent/10 text-accent" },
    completed: { label: ui.statusCompleted, cls: "border-success/30 bg-success/10 text-success" },
  };

  const s = map[status] ?? map.not_started;

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function BrainMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-lg text-foreground">{value}</div>
    </div>
  );
}
