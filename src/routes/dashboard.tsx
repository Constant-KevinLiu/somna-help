import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Moon, Sun, Sparkles, Wind, BookOpen } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dash,
  head: () => ({
    meta: [
      { title: "Tonight's Sleep Plan — somna" },
      { name: "description", content: "Your gentle sleep dashboard." },
    ],
  }),
});

function Dash() {
  const { t } = useI18n();
  return (
    <>
      <PageHero eyebrow="TONIGHT" title={t("dash.title")} />
      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          <Tile icon={Moon} label={t("dash.bed")} value="22:45" />
          <Tile icon={Sun} label={t("dash.wake")} value="06:45" />
          <div className="glass-strong rounded-3xl p-6">
            <div className="text-sm text-muted-foreground">{t("dash.eff")}</div>
            <div className="mt-2 font-display text-4xl text-gradient">87%</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: "87%" }} />
            </div>
          </div>
          <div className="glass-strong rounded-3xl p-6">
            <div className="text-sm text-muted-foreground">{t("dash.streak")}</div>
            <div className="mt-2 font-display text-4xl text-gradient">12</div>
            <div className="mt-4 flex gap-1.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className={`h-6 w-2 rounded-full ${i < 12 ? "bg-gradient-to-b from-primary to-accent" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl">
          <h2 className="mb-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">{t("dash.actions")}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Action to="/relax" icon={Wind} label={t("nav.relax")} />
            <Action to="/diary" icon={Sparkles} label={t("nav.diary")} />
            <Action to="/learn" icon={BookOpen} label={t("nav.learn")} />
          </div>
        </div>
      </section>
    </>
  );
}

function Tile({ icon: Icon, label, value }: any) {
  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5"><Icon className="h-4 w-4 text-accent" /></span>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
      <div className="mt-3 font-display text-5xl text-gradient">{value}</div>
    </div>
  );
}
function Action({ to, icon: Icon, label }: any) {
  return (
    <Link to={to} className="glass flex items-center gap-3 rounded-2xl p-4 transition hover:bg-white/[0.06]">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5"><Icon className="h-4 w-4 text-accent" /></span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
