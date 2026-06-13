import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { programLabels, programWeeks } from "@/lib/program-weeks";

export const Route = createFileRoute("/program/")({
  component: ProgramPage,
  head: () => ({
    meta: [
      { title: "CBT-I Program — somna" },
      { name: "description", content: "A 6-week gentle CBT-I journey to rebuild your sleep." },
      { property: "og:title", content: "CBT-I Program — somna" },
      { property: "og:description", content: "A 6-week gentle CBT-I journey to rebuild your sleep." },
      { property: "og:url", content: "/program" },
    ],
    links: [{ rel: "canonical", href: "/program" }],
  }),
});

function ProgramPage() {
  const { t, lang } = useI18n();
  const labels = programLabels[lang];
  return (
    <>
      <PageHero eyebrow="6-WEEK PROGRAM" title={t("program.title")} sub={t("program.sub")} />
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-3xl">
          <ol className="relative space-y-4 border-l border-white/10 pl-6">
            {programWeeks.map((w) => {
              const wc = w.i18n[lang] ?? w.i18n.en;
              return (
                <li key={w.slug} className="relative">
                  <span className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-medium text-primary-foreground">
                    {w.number}
                  </span>
                  <Link
                    to="/program/$slug"
                    params={{ slug: w.slug }}
                    className="glass group block rounded-2xl p-5 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <h3 className="font-display text-lg">
                        {labels.weekLabel} {w.number} · {wc.title}
                      </h3>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{wc.shortDesc}</p>
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 text-center">
            <Link to="/assessment" className="inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground">
              {t("assess.start")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}