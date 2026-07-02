import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SafeLink } from "@/components/common/SafeLink";
import { useI18n } from "@/lib/i18n";
import { SleepRestrictionWidget } from "@/components/program/SleepRestrictionWidget";
import {
  getAdjacentWeeks,
  programLabels,
  programWeeks,
  weekHeading,
  type WeekContent,
} from "@/lib/program-weeks";
import { getLessonsByWeek, loadLesson } from "@/lib/program-lessons";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { useProgramProgress, weekCompletionPercent, resolveWeekSlug } from "@/lib/program-progress";

export function WeekPageTemplate({ week }: { week: WeekContent }) {
  const { lang } = useI18n();
  const labels = programLabels[lang];
  const ui = getProgramLessonUI(lang);
  const c = week.i18n[lang] ?? week.i18n.en;
  const { prev, next } = getAdjacentWeeks(week.slug);
  const { progress, hydrated } = useProgramProgress();
  const esPrefix = lang === "es" ? "/es" : "";

  const weekLessons = getLessonsByWeek(
    resolveWeekSlug(week.slug) ??
      resolveWeekSlug(week.slug) ??
      resolveWeekSlug(week.slug) ??
      week.slug,
  );
  const weekPct = hydrated ? weekCompletionPercent(progress, week.slug) : 0;

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={weekHeading(lang, week.number, c.title)} sub={c.intro} />

      {/* Lessons in this week */}
      <section className="px-5 pb-8" aria-label={ui.lessonsLabel}>
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-accent" /> {ui.lessonsLabel}
            </div>
            {hydrated && <span className="text-xs text-muted-foreground">{weekPct}%</span>}
          </div>
          {hydrated && (
            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${weekPct}%` }}
                role="progressbar"
                aria-valuenow={weekPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={ui.completionLabel}
              />
            </div>
          )}
          <div className="space-y-3">
            {weekLessons.map((lm) => {
              const done = hydrated && progress.completedLessons.includes(lm.slug);
              return (
                <SafeLink
                  key={lm.slug}
                  to={`${esPrefix}/program/${lm.weekSlug}/${lm.slug}`}
                  className="glass group flex items-center gap-3 rounded-2xl p-4 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 text-xs font-medium text-foreground">
                    {lm.lessonNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {done && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />}
                      <span className="text-[10px] uppercase tracking-[0.18em] text-accent">
                        {ui.lessonLabel} {lm.lessonNumber}
                      </span>
                    </div>
                    <div className="mt-0.5 font-display text-base text-foreground group-hover:text-accent">
                      <WeekLessonTitle weekSlug={lm.weekSlug} lessonSlug={lm.slug} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {lm.estimatedMinutes} min
                      <span className="text-white/20">·</span>
                      {ui.difficulty[lm.difficultyKey]}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </SafeLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="mx-auto grid max-w-3xl gap-6">
          {week.slug === "week-3-sleep-restriction" && <SleepRestrictionWidget />}

          {/* Why it matters */}
          <article className="glass rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground/90">{c.whyTitle}</h2>
            <ul className="mt-4 space-y-3">
              {c.whyPoints.map((p, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground md:text-base">
                  <Sparkles className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Key practices */}
          <article className="glass rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground/90">{c.practicesTitle}</h2>
            <ul className="mt-4 space-y-3">
              {c.practices.map((p, i) => (
                <li
                  key={i}
                  className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-foreground/90 md:text-base"
                >
                  {p}
                </li>
              ))}
            </ul>
          </article>

          {/* Action steps */}
          <article className="glass-strong rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground/90">{c.actionsTitle}</h2>
            <ul className="mt-4 space-y-3">
              {c.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <span className="text-sm text-foreground/90 md:text-base">{a}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Encouragement */}
          <article className="rounded-3xl bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-6 md:p-8">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl text-foreground/90">{c.encouragementTitle}</h2>
            </div>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">{c.encouragement}</p>
          </article>
        </div>
      </section>

      {/* Internal links to other weeks */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center font-display text-xl text-foreground/90">
            {labels.other}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {programWeeks
              .filter((w) => w.slug !== week.slug)
              .map((w) => {
                const wc = w.i18n[lang] ?? w.i18n.en;
                return (
                  <SafeLink
                    key={w.slug}
                    to={`${esPrefix}/program/${w.slug}`}
                    className="glass rounded-2xl p-4 transition hover:bg-white/[0.06]"
                  >
                    <div className="text-[10px] uppercase tracking-[0.18em] text-accent">
                      {labels.weekLabel} {w.number}
                    </div>
                    <div className="mt-1 font-display text-base text-foreground/90">{wc.title}</div>
                  </SafeLink>
                );
              })}
          </div>
        </div>
      </section>

      {/* Prev / Next / Back */}
      <section className="px-5 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <SafeLink
              to={`${esPrefix}/program/${prev.slug}`}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>
                {labels.prev} · {labels.weekLabel} {prev.number}
              </span>
            </SafeLink>
          ) : (
            <span />
          )}

          <SafeLink
            to={`${esPrefix}/program`}
            className="inline-flex items-center justify-center rounded-full bg-white/[0.06] px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/[0.1]"
          >
            {labels.back}
          </SafeLink>

          {next ? (
            <SafeLink
              to={`${esPrefix}/program/${next.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <span>
                {labels.next} · {labels.weekLabel} {next.number}
              </span>
              <ArrowRight className="h-4 w-4" />
            </SafeLink>
          ) : (
            <SafeLink
              to={`${esPrefix}/assessment`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <span>{labels.startAssessment}</span>
              <ArrowRight className="h-4 w-4" />
            </SafeLink>
          )}
        </div>
      </section>
    </>
  );
}

// Cache for lesson titles shown on the week page (keyed by week/lesson/lang).
const weekLessonTitleCache = new Map<string, string>();

/** Resolves a lesson's localized title lazily for the week-page lesson list. */
function WeekLessonTitle({ weekSlug, lessonSlug }: { weekSlug: string; lessonSlug: string }) {
  const { lang } = useI18n();
  const cacheKey = `${weekSlug}/${lessonSlug}/${lang}`;
  const [title, setTitle] = useState<string | null>(
    () => weekLessonTitleCache.get(cacheKey) ?? null,
  );

  useEffect(() => {
    if (weekLessonTitleCache.has(cacheKey)) {
      setTitle(weekLessonTitleCache.get(cacheKey)!);
      return;
    }
    let active = true;
    loadLesson(weekSlug, lessonSlug)
      .then((lesson) => {
        if (!lesson || !active) return;
        const t = (lesson.i18n[lang] ?? lesson.i18n.en).title;
        weekLessonTitleCache.set(cacheKey, t);
        setTitle(t);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      active = false;
    };
  }, [cacheKey, lang]);

  return <>{title ?? "…"}</>;
}
