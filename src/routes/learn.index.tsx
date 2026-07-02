import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Clock, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useI18n } from "@/lib/i18n";
import { getLearnDict, LEARN_SLUGS, learnPath } from "@/lib/learn-i18n";
import { getCbtiDict, CBTI_SLUGS, cbtiPath } from "@/lib/cbti-i18n";
import { SafeLink } from "@/components/common/SafeLink";

export const Route = createFileRoute("/learn/")({
  component: LearnHub,
  head: () => ({
    meta: [
      { title: "Learn — CBT-I Guides & Quick Lessons | Somna" },
      {
        name: "description",
        content:
          "A library of long-form CBT-I guides and short, evidence-based lessons to help you understand sleep — and yourself.",
      },
      { property: "og:title", content: "Learn — CBT-I Guides & Quick Lessons | Somna" },
      {
        property: "og:description",
        content: "Evidence-based sleep education — long-form guides and quick lessons.",
      },
      { property: "og:url", content: "/learn" },
    ],
    links: [{ rel: "canonical", href: "/learn" }],
  }),
});

export function LearnHub() {
  const { lang } = useI18n();
  const dict = getLearnDict(lang);
  const cbti = getCbtiDict(lang);

  return (
    <>
      <PageHero eyebrow="LEARN" title={dict.ui.hubTitle} sub={dict.ui.hubSub} />

      {/* CBT-I Guides */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40">
              <GraduationCap className="h-5 w-5 text-foreground" />
            </span>
            <h2 className="font-display text-2xl text-foreground">{dict.ui.hubGuidesLabel}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CBTI_SLUGS.map((s) => (
              <SafeLink
                key={s}
                to={cbtiPath(s, lang)}
                className="glass group rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-3 w-3" /> {dict.ui.hubGuidesLabel}
                </div>
                <div className="font-display text-lg text-foreground group-hover:text-accent">
                  {cbti.titles[s]}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{cbti.summaries[s]}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-accent">
                  {dict.ui.relatedGuideCta} <ArrowRight className="h-3 w-3" />
                </div>
              </SafeLink>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Lessons */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40">
              <Clock className="h-5 w-5 text-foreground" />
            </span>
            <h2 className="font-display text-2xl text-foreground">
              {dict.ui.hubQuickLessonsLabel}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {LEARN_SLUGS.map((s) => (
              <SafeLink
                key={s}
                to={learnPath(s, lang)}
                className="glass group rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-3 w-3" /> {dict.ui.readBadge}
                </div>
                <div className="font-display text-lg text-foreground group-hover:text-accent">
                  {dict.titles[s]}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{dict.summaries[s]}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-accent">
                  {dict.ui.nextLessonCta} <ArrowRight className="h-3 w-3" />
                </div>
              </SafeLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
