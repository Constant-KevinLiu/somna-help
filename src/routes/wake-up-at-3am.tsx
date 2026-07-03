import { createFileRoute } from "@tanstack/react-router";
import { CbtiArticleShell, cbtiHead } from "@/components/cbti/CbtiArticleShell";
import { useI18n } from "@/lib/i18n";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/wake-up-at-3am")({
  component: WakeUp3amPage,
  head: () => cbtiHead("wake-up-at-3am"),
});

export function WakeUp3amPage() {
  const { lang } = useI18n();
  const article = getCbtiDict(lang).articles["wake-up-at-3am"];
  const f = article.flow;
  if (!f) return null;

  return (
    <CbtiArticleShell slug="wake-up-at-3am" article={article}>
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <h3 className="font-display text-xl text-foreground">{f.heading}</h3>
        <div className="mt-6 space-y-4">
          {f.nodes.map((n, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              {n.q && (
                <>
                  <div className="text-xs uppercase tracking-widest text-accent">Q{i + 1}</div>
                  <div className="mt-1 font-display text-base text-foreground">{n.q}</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm">
                      <span className="font-semibold text-accent">{f.yes}: </span>
                      <span className="text-foreground/90">{n.yes}</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <span className="font-semibold text-muted-foreground">{f.no}: </span>
                      <span className="text-foreground/90">{n.no}</span>
                    </div>
                  </div>
                </>
              )}
              {n.action && (
                <div className="text-center text-sm font-medium text-foreground">{n.action}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </CbtiArticleShell>
  );
}
