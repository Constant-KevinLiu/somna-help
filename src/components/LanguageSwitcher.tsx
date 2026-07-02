/**
 * Conmutador de idioma para la cabecera.
 *
 * - Muestra el idioma actual y permite cambiar entre Español e English.
 * - Al cambiar, navega a la ruta equivalente en el otro idioma y guarda la
 *   preferencia en la cookie somna_uid (vía llamada al endpoint /api/lang).
 * - Prioriza Facebook/Instagram/TikTok en el resto de la app; aquí solo
 *   aparece el selector de idioma.
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Globe, Check, ChevronDown } from "lucide-react";
import type { Lang } from "@/lib/lang-detect";
import { switchRouteLang, isEsRoute } from "@/lib/lang-detect";

interface LangOption {
  value: Lang;
  label: string;
  flag: string;
}

const OPTIONS: LangOption[] = [
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = router.state.location.pathname;
  const current: Lang = isEsRoute(pathname) ? "es" : "en";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function choose(lang: Lang) {
    setOpen(false);
    if (lang === current) return;

    // 1. Guarda la preferencia en la cookie somna_uid.
    try {
      await fetch("/api/lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang }),
      });
    } catch {
      // No bloqueamos la navegación si falla la cookie.
    }

    // 2. Navega a la ruta equivalente en el otro idioma.
    const target = switchRouteLang(pathname, lang);
    navigate({ to: target });
  }

  const currentOption = OPTIONS.find((o) => o.value === current)!;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Cambiar de idioma"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{currentOption.label}</span>
        <span className="sm:hidden">{currentOption.flag}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-card/95 p-1 shadow-xl backdrop-blur">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => choose(opt.value)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground/90 transition hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <span>{opt.flag}</span>
                {opt.label}
              </span>
              {opt.value === current && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
