import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Share2,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { ShareModal } from "@/components/ShareModal";
import { useI18n } from "@/lib/i18n";
import {
  getAdjacentLessons,
  getLessonMeta,
  lessonPath,
  type LessonContent,
} from "@/lib/program-lessons";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { useProgramProgress } from "@/lib/program-progress";
import { getWeekByNumber } from "@/lib/program-weeks";
import { trackShare } from "@/lib/share-analytics";
import { generateOGImageUrl } from "@/lib/share/shareService";
import { loadLesson } from "@/lib/program-lessons";

type Props = {
  lesson: LessonContent;
};

export function LessonTemplate({ lesson }: Props) {
  const { lang, t } = useI18n();
  const ui = getProgramLessonUI(lang);
  const { progress, toggle, hydrated } = useProgramProgress();
  const c = lesson.i18n[lang] ?? lesson.i18n.en;
  const meta = getLessonMeta(lesson.slug)!;
  const { prev, next } = getAdjacentLessons(lesson.slug);
  const [shareOpen, setShareOpen] = useState(false);

  const pageUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.location.href
        : `https://somna.help${lessonPath(lesson.weekSlug, lesson.slug)}`,
    [],
  );

  // Generate and upload a real OG image for this lesson, then update meta tags.
  useEffect(() => {
    const c = lesson.i18n[lang] ?? lesson.i18n.en;
    let cancelled = false;
    const updateOg = async () => {
      try {
        const ogUrl = await generateOGImageUrl({
          type: "program",
          resourceId: `${lesson.weekNumber}-${meta.lessonNumber}`,
          title: c.seoTitle,
          description: c.seoDescription,
          lang,
        });
        if (cancelled) return;
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute("content", ogUrl);
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) twitterImage.setAttribute("content", ogUrl);
      } catch {
        // OG generation is best-effort; leave fallback meta in place.
      }
    };
    void updateOg();
    return () => {
      cancelled = true;
    };
  }, [lesson, meta.lessonNumber, lang]);

  const completed = hydrated && progress.completedLessons.includes(lesson.slug);
  const relatedLessons = meta.relatedLessonSlugs
    .map((s) => getLessonMeta(s))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))
    .slice(0, 3);

  // Localized titles for related lessons (read from the lesson content's i18n title).
  // We import lazily via the week content modules only when needed; but to keep this
  // component synchronous and simple, we use the meta + a small title lookup.
  const relatedTitles = relatedLessons.map((rl) => {
    // Titles are stored in the content modules; for the card we use a lightweight
    // approach: read from the same lesson's i18n if it's the current one, otherwise
    // fall back to a generic label. The route loader provides full content for the
    // current lesson only; related titles are resolved by the RelatedLessonCard via
    // its own loader data is not available here, so we pass slug + weekSlug and let
    // the card render the localized title through a tiny inline lookup.
    return rl;
  });

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} sub={c.subtitle}>
        {/* Metadata row: reading time, difficulty, progress */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
            <Clock className="h-3.5 w-3.5" /> {c.readingTime}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-muted-foreground">
            <Compass className="h-3.5 w-3.5" /> {c.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" /> {ui.lessonLabel} {meta.lessonNumber}
          </span>
          {completed && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> {ui.completedLabel}
            </span>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mx-auto mt-6 max-w-md">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>{ui.progressLabel}</span>
            <span>{progress.completedLessons.length} / 18</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${Math.round((progress.completedLessons.length / 18) * 100)}%` }}
              role="progressbar"
              aria-valuenow={progress.completedLessons.length}
              aria-valuemin={0}
              aria-valuemax={18}
              aria-label={ui.progressLabel}
            />
          </div>
        </div>
      </PageHero>

      {/* Lesson content sections */}
      <section className="px-5 pb-8" aria-label={ui.lessonContentTitle}>
        <div className="mx-auto max-w-3xl space-y-6">
          {c.content.map((s, i) => (
            <article key={i} className="glass rounded-2xl p-6 md:p-8 animate-fade-up">
              <h2 className="font-display text-xl text-foreground md:text-2xl">{s.heading}</h2>
              {s.paras.map((p, j) => (
                <p
                  key={j}
                  className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base"
                >
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>

      {/* Action step */}
      <section className="px-5 pb-6" aria-label={ui.actionStepTitle}>
        <div className="mx-auto max-w-3xl">
          <div className="glass-strong rounded-3xl border border-accent/30 bg-accent/[0.07] p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <ListChecks className="h-3.5 w-3.5" /> {ui.actionStepTitle}
            </div>
            <p className="text-sm text-foreground/90 md:text-base">{c.actionStep}</p>
          </div>
        </div>
      </section>

      {/* Reflection */}
      <section className="px-5 pb-6" aria-label={ui.reflectionTitle}>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <Sparkles className="h-3.5 w-3.5" /> {ui.reflectionTitle}
            </div>
            <p className="text-sm text-foreground/90 md:text-base">{c.reflection}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={c.faqs} title={ui.faqTitle} />

      {/* Related lessons */}
      <section className="px-5 pb-10" aria-label={ui.relatedLessons}>
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-accent" /> {ui.relatedLessons}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {relatedTitles.map((rl) => (
              <RelatedLessonCard key={rl.slug} weekSlug={rl.weekSlug} lessonSlug={rl.slug} />
            ))}
          </div>
        </div>
      </section>

      {/* Complete lesson + Next lesson */}
      <section className="px-5 pb-8">
        <div className="mx-auto max-w-3xl">
          {/* Completion status banner */}
          {completed && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-full border border-success/30 bg-success/10 px-5 py-2 text-sm text-success animate-fade-up">
              <CheckCircle2 className="h-4 w-4" />
              {ui.lessonCompleted}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Mark as completed toggle */}
            <button
              type="button"
              onClick={() => toggle(lesson.slug)}
              disabled={!hydrated}
              aria-pressed={completed}
              aria-label={completed ? ui.markIncomplete : ui.markCompleted}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/10 disabled:opacity-50"
            >
              <CheckCircle2
                className={`h-4 w-4 ${completed ? "text-success" : "text-muted-foreground"}`}
              />
              {completed ? ui.completedLabel : ui.markCompleted}
            </button>

            {/* Share lesson button */}
            <button
              type="button"
              onClick={() => {
                trackShare("share_click", "program-lesson", pageUrl);
                setShareOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
              {t("share.share")}
            </button>

            {/* Next lesson button */}
            {next ? (
              <Link
                to="/program/$week/$lesson"
                params={{ week: next.weekSlug, lesson: next.slug }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {ui.nextLesson}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/program"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {ui.backToProgram}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <ShareModal
            open={shareOpen}
            onOpenChange={setShareOpen}
            context="program-lesson"
            efficiency={75}
            url={pageUrl}
            imageFilename={`somna-program-w${lesson.weekNumber}-l${meta.lessonNumber}-${lesson.slug}.png`}
          />
        </div>
      </section>

      {/* Prev / Back to week */}
      <section className="px-5 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <Link
              to="/program/$week/$lesson"
              params={{ week: prev.weekSlug, lesson: prev.slug }}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{ui.previousLesson}</span>
            </Link>
          ) : (
            <span />
          )}

          <Link
            to="/program/$slug"
            params={{ slug: getWeekByNumber(lesson.weekNumber)?.slug ?? lesson.weekSlug }}
            className="inline-flex items-center justify-center rounded-full bg-white/[0.06] px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/[0.1]"
          >
            {ui.backToWeek} {lesson.weekNumber}
          </Link>

          <span className="hidden sm:block" />
        </div>
      </section>
    </>
  );
}

/** A related-lesson card that resolves its localized title from the week content module. */
function RelatedLessonCard({ weekSlug, lessonSlug }: { weekSlug: string; lessonSlug: string }) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);
  const meta = getLessonMeta(lessonSlug);
  // Resolve localized title lazily. We use a synchronous lookup via a module-level
  // cache populated on first render of any lesson card. To avoid an extra network
  // round-trip per card, we read titles from the already-loaded current lesson when
  // possible; otherwise we show the lesson number + a neutral label and let the link
  // carry the user to the full lesson.
  const title = useRelatedLessonTitle(weekSlug, lessonSlug, lang);
  if (!meta) return null;
  return (
    <Link
      to="/program/$week/$lesson"
      params={{ week: weekSlug, lesson: lessonSlug }}
      className="glass group rounded-2xl p-4 transition hover:bg-white/[0.06]"
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-accent">
        {ui.lessonLabel} {meta.lessonNumber}
      </div>
      <div className="mt-1 font-display text-sm text-foreground group-hover:text-accent">
        {title ?? `${ui.lessonLabel} ${meta.lessonNumber}`}
      </div>
    </Link>
  );
}

// Lightweight cache for related-lesson titles keyed by `${weekSlug}/${lessonSlug}/${lang}`.
const titleCache = new Map<string, string>();

function useRelatedLessonTitle(
  weekSlug: string,
  lessonSlug: string,
  lang: "en" | "zh" | "es",
): string | null {
  const cacheKey = `${weekSlug}/${lessonSlug}/${lang}`;
  const [title, setTitle] = useState<string | null>(() => titleCache.get(cacheKey) ?? null);

  useEffect(() => {
    if (titleCache.has(cacheKey)) {
      setTitle(titleCache.get(cacheKey)!);
      return;
    }
    let active = true;
    loadLesson(weekSlug, lessonSlug)
      .then((lesson) => {
        if (!lesson || !active) return;
        const t = (lesson.i18n[lang] ?? lesson.i18n.en).title;
        titleCache.set(cacheKey, t);
        setTitle(t);
      })
      .catch(() => {
        /* ignore — card falls back to neutral label */
      });
    return () => {
      active = false;
    };
  }, [cacheKey, lang]);

  return title;
}

/** SEO head helper for lesson routes. */
export function lessonHead(lesson: LessonContent, lang: "en" | "zh" | "es") {
  const c = lesson.i18n[lang] ?? lesson.i18n.en;
  const url = lessonPath(lesson.weekSlug, lesson.slug);
  return {
    meta: [
      { title: c.seoTitle },
      { name: "description", content: c.seoDescription },
      { name: "keywords", content: c.keywords.join(", ") },
      { property: "og:title", content: c.seoTitle },
      { property: "og:description", content: c.seoDescription },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(articleJsonLd(lesson, lang)),
      },
    ],
  };
}

/** schema.org Article JSON-LD for a lesson. */
export function articleJsonLd(lesson: LessonContent, lang: "en" | "zh" | "es") {
  const c = lesson.i18n[lang] ?? lesson.i18n.en;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.seoDescription,
    keywords: c.keywords.join(", "),
    articleSection: `Week ${lesson.weekNumber}`,
    wordCount: c.content.reduce((n, s) => n + s.paras.join(" ").split(/\s+/).length, 0),
    author: { "@type": "Organization", name: "Somna" },
    publisher: { "@type": "Organization", name: "Somna" },
    mainEntityOfPage: lessonPath(lesson.weekSlug, lesson.slug),
  };
}
