import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Clock, ShieldCheck, CheckCircle2, Compass, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { RelatedTools } from "@/components/RelatedTools";
import { useI18n } from "@/lib/i18n";
import { getCbtiDict, type CbtiArticle, type CbtiSlug, CBTI_SLUGS, cbtiPath } from "@/lib/cbti-i18n";

export function CbtiArticleShell({
  slug,
  article,
  children,
}: {
  slug: CbtiSlug;
  article: CbtiArticle;
  children?: ReactNode;
}) {
  const { lang } = useI18n();
  const dict = getCbtiDict(lang);

  return (
    <>
      <PageHero eyebrow={article.eyebrow} title={article.title} sub={article.intro}>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
            <ShieldCheck className="h-3.5 w-3.5" /> {dict.ui.badge}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {article.readTime} {dict.ui.readTime}
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
              {article.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 md:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Main content sections */}
      <section className="px-5 pb-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {article.sections.map((s, i) => (
            <article key={i} className="glass rounded-2xl p-6 md:p-8 animate-fade-up">
              <h2 className="font-display text-xl text-foreground md:text-2xl">{s.heading}</h2>
              {s.paras?.map((p, j) => (
                <p key={j} className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-foreground/90 md:text-base">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Interactive slot */}
      {children && (
        <section className="px-5 pb-8">
          <div className="mx-auto max-w-3xl">{children}</div>
        </section>
      )}

      {/* CBT-I Strategy Box */}
      <section className="px-5 pb-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-accent/30 bg-gradient-to-br from-primary/15 via-transparent to-accent/15 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <Compass className="h-3.5 w-3.5" /> {dict.ui.strategyTitle}
            </div>
            {article.strategyIntro && (
              <p className="mb-5 text-sm text-foreground/85 md:text-base">{article.strategyIntro}</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {article.strategyItems.map((it, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-display text-base text-foreground">{it.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to={article.cta.to as any}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {article.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center font-display text-2xl text-foreground/90">
            {dict.ui.relatedArticlesTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CBTI_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link
                key={s}
                to={cbtiPath(s) as any}
                className="glass group rounded-2xl p-5 transition hover:bg-white/[0.06]"
              >
                <div className="font-display text-base text-foreground group-hover:text-accent">
                  {dict.titles[s]}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{dict.summaries[s]}</p>
              </Link>
            ))}
            <Link
              to="/diary"
              className="glass group rounded-2xl p-5 transition hover:bg-white/[0.06]"
            >
              <div className="font-display text-base text-foreground group-hover:text-accent">
                {dict.ui.sleepDiary}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{dict.ui.sleepDiaryDesc}</p>
            </Link>
          </div>
        </div>
      </section>

      <FAQ items={article.faqs} title={dict.ui.faqTitle} />
      <RelatedTools />
    </>
  );
}

export function cbtiHead(slug: CbtiSlug) {
  const en = getCbtiDict("en");
  const a = en.articles[slug];
  const faqs = a.faqs;
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const url = cbtiPath(slug);
  return {
    meta: [
      { title: a.meta.title },
      { name: "description", content: a.meta.desc },
      { property: "og:title", content: a.meta.title },
      { property: "og:description", content: a.meta.desc },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: a.meta.title },
      { name: "twitter:description", content: a.meta.desc },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }],
  };
}
