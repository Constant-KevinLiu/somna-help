import { Link } from "@tanstack/react-router";
import { Calculator, Moon, Bed, Coffee, Pill, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";

export function RelatedTools({ exclude }: { exclude?: string }) {
  const { lang } = useI18n();
  const d = getCalcDict(lang);
  const tools = [
    { to: "/calculator", title: d.nav.cycle, desc: d.related.cycleDesc, icon: Moon },
    { to: "/sleep-calculator", title: d.nav.sleep, desc: d.related.sleepDesc, icon: Calculator },
    { to: "/bedtime-calculator", title: d.nav.bedtime, desc: d.related.bedtimeDesc, icon: Bed },
    { to: "/nap-calculator", title: d.nav.nap, desc: d.related.napDesc, icon: Coffee },
    { to: "/melatonin-calculator", title: d.nav.melatonin, desc: d.related.melatoninDesc, icon: Pill },
    { to: "/program", title: d.related.guide, desc: d.related.guideDesc, icon: BookOpen },
  ];
  const items = tools.filter((t) => t.to !== exclude);
  return (
    <section className="px-5 pb-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-center font-display text-2xl text-foreground/90">{d.related.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to as any}
                className="glass group flex items-start gap-3 rounded-2xl p-5 transition hover:bg-white/[0.06]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40">
                  <Icon className="h-4 w-4 text-foreground" />
                </span>
                <div>
                  <div className="font-display text-base text-foreground group-hover:text-accent">{t.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}