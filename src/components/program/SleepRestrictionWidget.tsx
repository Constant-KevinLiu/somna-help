import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { loadRecords, type SleepRecord } from "@/lib/sleep-records";
import { recommend, sleepWindow } from "@/lib/cbti-brain";
import { useSleepI18n } from "@/lib/sleep-i18n";

/** Live Week-3 panel: 7d efficiency, recommended window, adjustment minutes. */
export function SleepRestrictionWidget() {
  const { t } = useSleepI18n();
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const rec = recommend(records);
  const win = sleepWindow(records);
  const adjLabel =
    win.adjustmentMinutes > 0
      ? `+${win.adjustmentMinutes} min`
      : t("cbti.window.adjust.hold");

  return (
    <article className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
        <Activity className="h-3.5 w-3.5" />
        {t("cbti.week3.live")}
      </div>
      <h2 className="mt-3 font-display text-2xl text-foreground/95">
        {t("cbti.week3.title")}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Tile label={t("cbti.week3.efficiency")} value={rec.efficiency !== null ? `${rec.efficiency}%` : "—"} />
        <Tile label={t("cbti.week3.window")} value={`${win.bedtime} → ${win.wakeUpTime}`} />
        <Tile label={t("cbti.week3.adjust")} value={adjLabel} accent />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {t(rec.reasonKey, rec.efficiency !== null ? { n: rec.efficiency } : undefined)}
      </p>
    </article>
  );
}

function Tile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-xl ${accent ? "text-accent" : "text-gradient"}`}>{value}</div>
    </div>
  );
}