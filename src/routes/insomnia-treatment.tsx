import { createFileRoute } from "@tanstack/react-router";
import { CbtiArticleShell, cbtiHead } from "@/components/cbti/CbtiArticleShell";
import { useI18n, type Lang } from "@/lib/i18n";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/insomnia-treatment")({
  component: InsomniaTreatmentPage,
  head: () => cbtiHead("insomnia-treatment"),
});

type Row = { label: string; cbti: string; med: string };

const compare: Partial<Record<Lang, { heading: string; cbtiCol: string; medCol: string; rows: Row[] }>> = {
  en: {
    heading: "CBT-I vs Medication",
    cbtiCol: "CBT-I",
    medCol: "Sleep medication",
    rows: [
      {
        label: "Effectiveness",
        cbti: "Strong — 70–80% respond",
        med: "Strong short-term, fades long-term",
      },
      { label: "Side effects", cbti: "None", med: "Possible — grogginess, dependence" },
      {
        label: "Long-term results",
        cbti: "Durable for 1–3+ years",
        med: "Often rebound when stopped",
      },
      { label: "Cost", cbti: "Varies; digital is affordable", med: "Ongoing prescription cost" },
      { label: "Relapse risk", cbti: "Low", med: "Higher when discontinued" },
    ],
  },
  zh: {
    heading: "CBT-I 与药物对比",
    cbtiCol: "CBT-I",
    medCol: "睡眠药物",
    rows: [
      { label: "有效性", cbti: "强 —— 70–80% 有反应", med: "短期强,长期减弱" },
      { label: "副作用", cbti: "无", med: "可能有 —— 嗜睡、依赖" },
      { label: "长期效果", cbti: "可持续 1–3 年以上", med: "停药后常反弹" },
      { label: "费用", cbti: "因情况而异;数字版较实惠", med: "持续的处方费用" },
      { label: "复发风险", cbti: "低", med: "停药后较高" },
    ],
  },
  es: {
    heading: "TCC-I vs medicación",
    cbtiCol: "TCC-I",
    medCol: "Medicación",
    rows: [
      {
        label: "Eficacia",
        cbti: "Alta — 70–80% responde",
        med: "Alta a corto plazo, decae a largo plazo",
      },
      { label: "Efectos secundarios", cbti: "Ninguno", med: "Posibles — somnolencia, dependencia" },
      {
        label: "Resultados a largo plazo",
        cbti: "Duraderos 1–3+ años",
        med: "A menudo rebote al parar",
      },
      { label: "Coste", cbti: "Variable; digital es asequible", med: "Coste continuo de receta" },
      { label: "Riesgo de recaída", cbti: "Bajo", med: "Mayor al suspender" },
    ],
  },
};

export function InsomniaTreatmentPage() {
  const { lang } = useI18n();
  const article = getCbtiDict(lang).articles["insomnia-treatment"];
  const c = compare[lang] ?? compare.en!

  return (
    <CbtiArticleShell slug="insomnia-treatment" article={article}>
      <div className="glass-strong overflow-hidden rounded-3xl">
        <div className="p-6 md:p-8 pb-0">
          <h3 className="font-display text-xl text-foreground">{c.heading}</h3>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-y border-white/10 bg-white/5 text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-3 font-medium"></th>
                <th className="px-6 py-3 font-medium text-accent">{c.cbtiCol}</th>
                <th className="px-6 py-3 font-medium">{c.medCol}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r, i) => (
                <tr key={i} className="border-b border-white/5 last:border-b-0">
                  <td className="px-6 py-4 font-medium text-foreground">{r.label}</td>
                  <td className="px-6 py-4 text-foreground/90">{r.cbti}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.med}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CbtiArticleShell>
  );
}
