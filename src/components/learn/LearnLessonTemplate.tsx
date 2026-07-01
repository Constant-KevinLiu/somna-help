import {
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { RelatedTools } from "@/components/RelatedTools";
import { SafeLink } from "@/components/common/SafeLink";
import { useI18n } from "@/lib/i18n";
import {
  getLearnDict,
  LEARN_SLUGS,
  learnPath,
  type LearnSlug,
  type LearnLesson,
} from "@/lib/learn-i18n";
import { getCbtiDict, cbtiPath } from "@/lib/cbti-i18n";

export function LearnLessonTemplate({ slug, lesson }: { slug: LearnSlug; lesson: LearnLesson }) {
  const { lang } = useI18n();
  const dict = getLearnDict(lang);
  const cbti = getCbtiDict(lang);
  const next = dict.lessons[lesson.nextLesson];

  return (
    <>
      <PageHero eyebrow={lesson.eyebrow} title={lesson.title} sub={lesson.subtitle}>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
            <Clock className="h-3.5 w-3.5" /> {dict.ui.readBadge}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" /> {lesson.readingTime} {dict.ui.minRead}
          </span>
        </div>
      </PageHero>

      {/* Key takeaways */}
      <section className="px-5 pb-10">
        <div className="mx-auto max-w-3xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <Sparkles className="h-3.5 w-3.5" /> {dict.ui.takeawaysTitle}
            </div>
            <ul className="space-y-3">
              {lesson.keyTakeaways.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-foreground/90 md:text-base"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Educational content sections */}
      <section className="px-5 pb-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {lesson.sections.map((s, i) => (
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

      {/* Science note */}
      <section className="px-5 pb-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <FlaskConical className="h-3.5 w-3.5" /> {dict.ui.scienceNoteTitle}
            </div>
            <p className="text-sm text-foreground/90 md:text-base">{lesson.scienceNote}</p>
          </div>
        </div>
      </section>

      {/* Practical tip */}
      <section className="px-5 pb-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-accent/30 bg-accent/[0.07] p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <Lightbulb className="h-3.5 w-3.5" /> {dict.ui.practicalTipTitle}
            </div>
            <p className="text-sm text-foreground/90 md:text-base">{lesson.practicalTip}</p>
          </div>
        </div>
      </section>

      {/* Related tool + Related guide */}
      <section className="px-5 pb-10">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          <SafeLink
            to={lesson.relatedTool.to}
            className="glass group rounded-2xl p-6 transition hover:bg-white/[0.06]"
          >
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
              {dict.ui.relatedToolTitle}
            </div>
            <div className="font-display text-lg text-foreground group-hover:text-accent">
              {lesson.relatedTool.label}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{lesson.relatedTool.desc}</p>
          </SafeLink>
          <SafeLink
            to={cbtiPath(lesson.relatedGuide.slug)}
            className="glass group rounded-2xl p-6 transition hover:bg-white/[0.06]"
          >
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
              {dict.ui.relatedGuideTitle}
            </div>
            <div className="font-display text-lg text-foreground group-hover:text-accent">
              {cbti.titles[lesson.relatedGuide.slug]}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {cbti.summaries[lesson.relatedGuide.slug]}
            </p>
          </SafeLink>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <SafeLink
            to={lesson.cta.to}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            {lesson.cta.label} <ArrowRight className="h-4 w-4" />
          </SafeLink>
        </div>
      </section>

      {/* Next lesson */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-3xl">
          <SafeLink
            to={learnPath(lesson.nextLesson)}
            className="glass-strong group flex flex-col items-start justify-between gap-3 rounded-3xl p-6 transition hover:bg-white/[0.06] md:flex-row md:items-center"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-accent">
                {dict.ui.nextLessonTitle}
              </div>
              <div className="mt-1 font-display text-xl text-foreground group-hover:text-accent">
                {next.title}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{next.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground">
              {dict.ui.nextLessonCta} <ArrowRight className="h-4 w-4" />
            </span>
          </SafeLink>
        </div>
      </section>

      {/* More quick lessons */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center font-display text-2xl text-foreground/90">
            {dict.ui.quickLessons}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEARN_SLUGS.filter((s) => s !== slug).map((s) => (
              <SafeLink
                key={s}
                to={learnPath(s)}
                className="glass group rounded-2xl p-5 transition hover:bg-white/[0.06]"
              >
                <div className="font-display text-base text-foreground group-hover:text-accent">
                  {dict.titles[s]}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{dict.summaries[s]}</p>
              </SafeLink>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={lesson.faqs} />
      <RelatedTools />
    </>
  );
}

export function learnHead(slug: LearnSlug) {
  const en = getLearnDict("en");
  const lesson = en.lessons[slug];
  const url = learnPath(slug);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lesson.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return {
    meta: [
      { title: lesson.meta.title },
      { name: "description", content: lesson.meta.desc },
      { property: "og:title", content: lesson.meta.title },
      { property: "og:description", content: lesson.meta.desc },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: lesson.meta.title },
      { name: "twitter:description", content: lesson.meta.desc },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }],
  };
}
