/**
 * Conmutador de idioma para la cabecera.
 *
 * ⚠️ 100% cliente. Sin endpoints /api. Sin createAPIFileRoute.
 *
 * - Muestra el idioma actual y permite cambiar entre los idiomas activos.
 * - Idiomas activos: English, Español, Português (BR).
 * - Reservados (desactivados): Deutsch, 日本語, 中文.
 * - Al hacer clic: persiste somna_lang + somna-language, cierra el drawer
 *   móvil si es necesario, y navega a la ruta equivalente.
 */

import { useState, useRef, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { Globe, Check, ChevronDown } from "lucide-react";
import type { Lang } from "@/lib/lang-detect";
import { switchRouteLang, getLangFromPathname, setUserLangPreference } from "@/lib/lang-detect";
import { useI18n } from "@/lib/i18n";

interface LanguageSwitcherProps {
  /** Llamado antes de persistir el idioma y navegar; permite cerrar el drawer
   *  móvil y esperar su animación para evitar condiciones de carrera. */
  onBeforeChange?: () => void | Promise<void>;
}

interface LangOption {
  value: Lang;
  label: string;
  flag: string;
  active: boolean;
}

const OPTIONS: LangOption[] = [
  { value: "en", label: "English", flag: "🇬🇧", active: true },
  { value: "es", label: "Español", flag: "🇪🇸", active: true },
  { value: "pt", label: "Português (BR)", flag: "🇧🇷", active: true },
  { value: "pl", label: "Polski", flag: "🇵🇱", active: true },
  { value: "de", label: "Deutsch", flag: "🇩🇪", active: false },
  { value: "ja", label: "日本語", flag: "🇯🇵", active: false },
  { value: "zh", label: "中文", flag: "🇨🇳", active: false },
];

export function LanguageSwitcher({ onBeforeChange }: LanguageSwitcherProps) {
  const router = useRouter();
  const { t } = useI18n();
  const pathname = router.state.location.pathname;
  const current: Lang = getLangFromPathname(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ESC closes the language menu.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function choose(lang: Lang) {
    setOpen(false);

    // 1. Cierra el drawer móvil si procede y espera su animación.
    if (onBeforeChange) await onBeforeChange();

    // 2. Relee la ruta actual para evitar decisiones obsoletas tras la espera.
    const freshPathname = router.state.location.pathname;
    const freshCurrent = getLangFromPathname(freshPathname);
    if (lang === freshCurrent) return;

    // 3. Sincroniza cookie, localStorage y estado de i18n.
    setUserLangPreference(lang);

    // 4. Navega a la ruta equivalente en el otro idioma.
    const target = switchRouteLang(freshPathname, lang);
    router.navigate({ to: target, replace: true });
  }

  const currentOption = OPTIONS.find((o) => o.value === current) ?? OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("lang.switch.aria")}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85 transition hover:bg-accent/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{currentOption.label}</span>
        <span className="sm:hidden">{currentOption.flag}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <div className="nav-surface absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl p-1 animate-nav-dropdown">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => opt.active && choose(opt.value)}
              disabled={!opt.active}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 transition hover:bg-accent/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="flex items-center gap-2">
                <span>{opt.flag}</span>
                {opt.label}
                {!opt.active && <span className="text-[10px] text-white/60">em breve</span>}
              </span>
              {opt.value === current && opt.active && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
