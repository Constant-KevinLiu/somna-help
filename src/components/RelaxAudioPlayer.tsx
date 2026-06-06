import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  src: string;
  title: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

const labels = {
  en: { play: "Play", pause: "Pause", back: "Back 15s", fwd: "Forward 15s", speed: "Speed", missing: "This audio will be available soon." },
  zh: { play: "播放", pause: "暂停", back: "后退 15 秒", fwd: "前进 15 秒", speed: "速度", missing: "此音频即将上线。" },
  es: { play: "Reproducir", pause: "Pausar", back: "Atrás 15s", fwd: "Adelante 15s", speed: "Velocidad", missing: "Este audio estará disponible pronto." },
};

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function RelaxAudioPlayer({ src, title }: Props) {
  const { lang } = useI18n();
  const L = labels[lang] ?? labels.en;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = speed;
  }, [speed]);

  // reset on src change
  useEffect(() => {
    setMissing(false);
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a || missing) return;
    if (playing) {
      a.pause();
    } else {
      try { await a.play(); } catch { /* ignore */ }
    }
  };

  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min((a.duration || 0), a.currentTime + delta));
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
    else if (e.key === "ArrowLeft" || e.key === "j") { e.preventDefault(); skip(-15); }
    else if (e.key === "ArrowRight" || e.key === "l") { e.preventDefault(); skip(15); }
  };

  if (missing) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-5 text-sm text-muted-foreground">
        {L.missing}
      </div>
    );
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      className="rounded-2xl border border-border bg-card/60 p-5"
      role="group"
      aria-label={title}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setMissing(true)}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => skip(-15)}
          aria-label={L.back}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground transition hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={toggle}
          aria-label={playing ? L.pause : L.play}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow transition hover:opacity-90"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
        </button>
        <button
          onClick={() => skip(15)}
          aria-label={L.fwd}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground transition hover:bg-white/10"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <span className="sr-only">{L.speed}</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              className={`rounded-full px-2 py-1 transition ${speed === s ? "bg-primary/30 text-foreground" : "hover:bg-white/5"}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="w-10 text-right font-mono text-xs text-muted-foreground tabular-nums">{fmt(current)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={onSeek}
          aria-label="Seek"
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[oklch(0.78_0.12_285)]"
          style={{ background: `linear-gradient(to right, oklch(0.78 0.12 285) ${pct}%, oklch(1 0 0 / 12%) ${pct}%)` }}
        />
        <span className="w-10 font-mono text-xs text-muted-foreground tabular-nums">{fmt(duration)}</span>
      </div>
    </div>
  );
}

export default RelaxAudioPlayer;