import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Moon, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";

const navItems = [
  { to: "/", key: "nav.home" as const },
  { to: "/program", key: "nav.program" as const },
  { to: "/assessment", key: "nav.assessment" as const },
  { to: "/diary", key: "nav.diary" as const },
  { to: "/relax", key: "nav.relax" as const },
  { to: "/learn", key: "nav.learn" as const },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const calcDict = getCalcDict(lang);
  const calculatorItems = [
    { to: "/calculator", label: calcDict.nav.cycle },
    { to: "/sleep-calculator", label: calcDict.nav.sleep },
    { to: "/bedtime-calculator", label: calcDict.nav.bedtime },
    { to: "/nap-calculator", label: calcDict.nav.nap },
    { to: "/melatonin-calculator", label: calcDict.nav.melatonin },
  ];
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Moon className="h-4 w-4 text-primary-foreground" />
              <span className="absolute inset-0 -z-10 rounded-full bg-primary/40 blur-xl" />
            </span>
            <span className="font-display text-lg tracking-tight">somna</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to as any}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                activeProps={{ className: "rounded-full px-3 py-1.5 text-sm bg-white/10 text-foreground" }}
              >
                {t(item.key)}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                onClick={() => setToolsOpen((v) => !v)}
              >
                {calcDict.nav.tools} <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {toolsOpen && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="glass-strong w-64 rounded-2xl border border-white/10 p-2 shadow-xl">
                    <div className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {calcDict.nav.section}
                    </div>
                    {calculatorItems.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to as any}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground/90 transition hover:bg-white/5"
                        onClick={() => setToolsOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5">
              {(["en", "zh", "es"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                    lang === l
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={`Switch to ${l}`}
                >
                  {l === "en" ? "EN" : l === "zh" ? "中" : "ES"}
                </button>
              ))}
            </div>
            <button
              className="lg:hidden rounded-full p-2 text-muted-foreground hover:bg-white/5"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-white/5 px-5 py-3 animate-fade-up">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to as any}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  activeProps={{ className: "rounded-lg px-3 py-3 text-sm bg-white/10 text-foreground" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="mt-2 border-t border-white/5 pt-2">
                <div className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {calcDict.nav.section}
                </div>
                {calculatorItems.map((c) => (
                  <Link
                    key={c.to}
                    to={c.to as any}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    activeProps={{ className: "block rounded-lg px-3 py-3 text-sm bg-white/10 text-foreground" }}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
