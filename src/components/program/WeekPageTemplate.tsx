import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useI18n } from "@/lib/i18n";
import { SleepRestrictionWidget } from "@/components/program/SleepRestrictionWidget";
import {
  getAdjacentWeeks,
  programLabels,
  programWeeks,
  weekHeading,
  type WeekContent,
} from "@/lib/program-weeks";

export function WeekPageTemplate({ week }: { week: WeekContent }) {
  const { lang } = useI18n();
  const labels = programLabels[lang];
  const c = week.i18n[lang] ?? week.i18n.en;
  const { prev, next } = getAdjacentWeeks(week.slug);

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={weekHeading(lang, week.number, c.title)}
        sub={c.intro}
      />

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
              <h2 className="font-display text-xl text-foreground/90">
                {c.encouragementTitle}
              </h2>
            </div>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              {c.encouragement}
            </p>
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
                <Link
                  key={w.slug}
                  to="/program/$slug"
                  params={{ slug: w.slug }}
                  className="glass rounded-2xl p-4 transition hover:bg-white/[0.06]"
                >
                  <div className="text-[10px] uppercase tracking-[0.18em] text-accent">
                    {labels.weekLabel} {w.number}
                  </div>
                  <div className="mt-1 font-display text-base text-foreground/90">
                    {wc.title}
                  </div>
                </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* Prev / Next / Back */}
      <section className="px-5 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <Link
              to="/program/$slug"
              params={{ slug: prev.slug }}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/[0.06]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{labels.prev} · {labels.weekLabel} {prev.number}</span>
            </Link>
          ) : (
            <span />
          )}

          <Link
            to="/program"
            className="inline-flex items-center justify-center rounded-full bg-white/[0.06] px-5 py-3 text-sm text-foreground/90 transition hover:bg-white/[0.1]"
          >
            {labels.back}
          </Link>

          {next ? (
            <Link
              to="/program/$slug"
              params={{ slug: next.slug }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <span>{labels.next} · {labels.weekLabel} {next.number}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <span>{labels.startAssessment}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
