import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Wind, Music, Heart, Play } from "lucide-react";
import { relaxTracks, type RelaxCategory } from "@/lib/relax-tracks";
import { RelaxAudioPlayer } from "@/components/RelaxAudioPlayer";

export const Route = createFileRoute("/relax")({
  component: RelaxPage,
  head: () => ({
    meta: [
      { title: "Relaxing Sleep Audio | Somna" },
      {
        name: "description",
        content:
          "Guided relaxation, body scan meditation, ocean sounds, rain sounds, anxiety relief sessions and pink noise for better sleep.",
      },
      { property: "og:title", content: "Relaxing Sleep Audio | Somna" },
      {
        property: "og:description",
        content:
          "Guided relaxation, body scan meditation, ocean sounds, rain sounds, anxiety relief sessions and pink noise for better sleep.",
      },
    ],
  }),
});

const phases = [
  { key: "relax.inhale", dur: 4 },
  { key: "relax.hold", dur: 7 },
  { key: "relax.exhale", dur: 8 },
] as const;

const catLabels: Record<RelaxCategory, { en: string; zh: string; es: string }> = {
  guided: { en: "Guided", zh: "引导", es: "Guiada" },
  nature: { en: "Nature", zh: "自然", es: "Naturaleza" },
  noise: { en: "Noise", zh: "噪音", es: "Ruido" },
};

const catIcon = { guided: Heart, nature: Wind, noise: Music } as const;

const sectionLabel = {
  en: "Sleep Audio Library",
  zh: "睡眠音频库",
  es: "Biblioteca de audio para dormir",
};
const sectionSub = {
  en: "Guided sessions, nature ambiences and noise. Tap a session to open the player.",
  zh: "引导练习、自然音景与噪音。点击任一会话打开播放器。",
  es: "Sesiones guiadas, ambientes naturales y ruido. Toca una sesión para abrir el reproductor.",
};
const playLabel = { en: "Play", zh: "播放", es: "Reproducir" };

function RelaxPage() {
  const { t, lang } = useI18n();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<number>(0);
  const [sec, setSec] = useState<number>(phases[0].dur);
  const ref = useRef<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSec((s) => {
        if (s > 1) return s - 1;
        setPhase((p) => {
          const np = (p + 1) % phases.length;
          setSec(phases[np].dur);
          return np;
        });
        return phases[(phase + 1) % phases.length].dur;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, phase]);

  const scale = phase === 0 ? "scale-110" : phase === 1 ? "scale-110" : "scale-90";

  return (
    <>
      <PageHero eyebrow="RELAX" title={t("relax.title")} sub={t("relax.sub")} />
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-8 text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              {t("relax.breathe")}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("relax.breathe.sub")}</p>

            <div className="relative mx-auto my-10 flex h-72 w-72 items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
              <div
                className={`relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 transition-transform duration-[1500ms] ease-in-out ${running ? scale : ""}`}
              >
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full glass-strong">
                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {t(phases[phase].key)}
                  </div>
                  <div className="mt-1 font-display text-5xl">{sec}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setRunning(!running);
                setPhase(0);
                setSec(phases[0].dur);
              }}
              className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {running ? t("relax.stop") : t("relax.start")}
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl sm:text-3xl">{sectionLabel[lang]}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{sectionSub[lang]}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relaxTracks.map((tr) => {
              const Icon = catIcon[tr.category];
              const isActive = activeId === tr.id;
              return (
                <div
                  key={tr.id}
                  className={`glass rounded-2xl p-5 transition ${isActive ? "ring-1 ring-primary/40 bg-white/[0.06]" : "hover:-translate-y-1 hover:bg-white/[0.06]"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-medium">{tr.title[lang]}</h3>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {catLabels[tr.category][lang]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{tr.description[lang]}</p>
                      {tr.duration && (
                        <p className="mt-1 text-[11px] text-muted-foreground/80">{tr.duration}</p>
                      )}
                    </div>
                  </div>

                  {!isActive ? (
                    <button
                      onClick={() => setActiveId(tr.id)}
                      aria-label={`${playLabel[lang]}: ${tr.title[lang]}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {playLabel[lang]}
                    </button>
                  ) : (
                    <div className="mt-4">
                      <RelaxAudioPlayer src={tr.audioUrl} title={tr.title[lang]} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
