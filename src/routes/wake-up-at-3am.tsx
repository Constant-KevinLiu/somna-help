import { createFileRoute } from "@tanstack/react-router";
import { CbtiArticleShell, cbtiHead } from "@/components/cbti/CbtiArticleShell";
import { useI18n, type Lang } from "@/lib/i18n";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/wake-up-at-3am")({
  component: WakeUp3amPage,
  head: () => cbtiHead("wake-up-at-3am"),
});

type Node = { q?: string; yes?: string; no?: string; action?: string };

const flow: Record<Lang, { heading: string; nodes: Node[]; yes: string; no: string }> = {
  en: {
    heading: "Nighttime Awakening Flowchart",
    yes: "Yes",
    no: "No",
    nodes: [
      { q: "Did you wake up?", yes: "Stay still, breathe slowly.", no: "Keep resting." },
      { q: "Still awake after ~20 minutes?", yes: "Leave the bed. Dim light. Calm activity.", no: "Drift back to sleep." },
      { q: "Feeling sleepy again?", yes: "Return to bed.", no: "Stay up until sleepy." },
      { action: "Wake at your usual time — don't sleep in." },
    ],
  },
  zh: {
    heading: "夜间醒来流程",
    yes: "是",
    no: "否",
    nodes: [
      { q: "你醒了吗?", yes: "保持安静,缓慢呼吸。", no: "继续休息。" },
      { q: "约 20 分钟后仍清醒?", yes: "离开床。昏暗光线。安静活动。", no: "慢慢再入睡。" },
      { q: "再次感到困倦?", yes: "回到床上。", no: "保持清醒直到困倦。" },
      { action: "按正常时间起床 —— 不要赖床。" },
    ],
  },
  es: {
    heading: "Diagrama de despertar nocturno",
    yes: "Sí",
    no: "No",
    nodes: [
      { q: "¿Te despertaste?", yes: "Quédate quieto, respira lento.", no: "Sigue descansando." },
      { q: "¿Aún despierto tras ~20 min?", yes: "Sal de la cama. Luz tenue. Actividad tranquila.", no: "Vuelve a dormirte." },
      { q: "¿Sientes sueño de nuevo?", yes: "Vuelve a la cama.", no: "Quédate despierto hasta tener sueño." },
      { action: "Despierta a tu hora habitual — no duermas hasta tarde." },
    ],
  },
};

function WakeUp3amPage() {
  const { lang } = useI18n();
  const article = getCbtiDict(lang).articles["wake-up-at-3am"];
  const f = flow[lang];

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
