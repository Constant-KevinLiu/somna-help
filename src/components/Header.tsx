import { Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Moon, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LANG_PREFIX } from "@/lib/lang-detect";
import { getCalcDict } from "@/lib/calc-i18n";
import { getCbtiDict, CBTI_SLUGS, cbtiPath } from "@/lib/cbti-i18n";
import { getLearnDict, LEARN_SLUGS, learnPath } from "@/lib/learn-i18n";
import { SafeLink } from "@/components/common/SafeLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Rutas base por idioma. Usamos los mismos slugs en todos los idiomas
// (1:1 mapping) para que switchRouteLang() pueda hacer el intercambio de
// prefijo de forma fiable. Los textos del menú sí son nativos en cada
// idioma (vía useI18n).
const NAV_BY_LANG = {
  en: [
    { to: "/", key: "nav.home" as const },
    { to: "/program", key: "nav.program" as const },
    { to: "/assessment", key: "nav.assessment" as const },
    { to: "/diary", key: "nav.diary" as const },
    { to: "/relax", key: "nav.relax" as const },
  ],
  es: [
    { to: "/es", key: "nav.home" as const },
    { to: "/es/program", key: "nav.program" as const },
    { to: "/es/assessment", key: "nav.assessment" as const },
    { to: "/es/diary", key: "nav.diary" as const },
    { to: "/es/relax", key: "nav.relax" as const },
  ],
  pt: [
    { to: "/pt", key: "nav.home" as const },
    { to: "/pt/program", key: "nav.program" as const },
    { to: "/pt/assessment", key: "nav.assessment" as const },
    { to: "/pt/diary", key: "nav.diary" as const },
    { to: "/pt/relax", key: "nav.relax" as const },
  ],
  pl: [
    { to: "/pl", key: "nav.home" as const },
    { to: "/pl/program", key: "nav.program" as const },
    { to: "/pl/assessment", key: "nav.assessment" as const },
    { to: "/pl/diary", key: "nav.diary" as const },
    { to: "/pl/relax", key: "nav.relax" as const },
  ],
  zh: [
    { to: "/", key: "nav.home" as const },
    { to: "/program", key: "nav.program" as const },
    { to: "/assessment", key: "nav.assessment" as const },
    { to: "/diary", key: "nav.diary" as const },
    { to: "/relax", key: "nav.relax" as const },
  ],
};

const DASHBOARD_BY_LANG = {
  en: { to: "/dashboard", key: "nav.dashboard" as const },
  es: { to: "/es/panel", key: "nav.dashboard" as const },
  pt: { to: "/pt/painel", key: "nav.dashboard" as const },
  pl: { to: "/pl/dashboard", key: "nav.dashboard" as const },
  zh: { to: "/dashboard", key: "nav.dashboard" as const },
};

export function Header() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const navItems = NAV_BY_LANG[lang];
  const dashboardItem = DASHBOARD_BY_LANG[lang];
  const calcDict = getCalcDict(lang);
  const cbtiDict = getCbtiDict(lang);
  const learnDict = getLearnDict(lang);
  const langPrefix = LANG_PREFIX[lang];
  const calculatorItems = [
    { to: `${langPrefix}/calculator`, label: calcDict.nav.cycle },
    { to: `${langPrefix}/sleep-calculator`, label: calcDict.nav.sleep },
    { to: `${langPrefix}/bedtime-calculator`, label: calcDict.nav.bedtime },
    { to: `${langPrefix}/nap-calculator`, label: calcDict.nav.nap },
    { to: `${langPrefix}/melatonin-calculator`, label: calcDict.nav.melatonin },
  ];
  const guideItems = CBTI_SLUGS.map((s) => ({ to: cbtiPath(s, lang), label: cbtiDict.titles[s] }));
  const lessonItems = LEARN_SLUGS.map((s) => ({
    to: learnPath(s, lang),
    label: learnDict.titles[s],
  }));
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerFirstRef = useRef<HTMLAnchorElement>(null);
  // Any overlay panel currently open (drives the dim overlay + ESC handling).
  const anyPanelOpen = open || toolsOpen || learnOpen;

  // Helper: open exactly one dropdown, closing the other.
  const openTools = () => {
    setLearnOpen(false);
    setToolsOpen(true);
  };
  const openLearn = () => {
    setToolsOpen(false);
    setLearnOpen(true);
  };

  // ESC closes every open panel.
  useEffect(() => {
    if (!anyPanelOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setToolsOpen(false);
        setLearnOpen(false);
        // Return focus to the trigger that matches the closed panel.
        if (open) hamburgerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [anyPanelOpen, open]);

  // Click-outside closes the desktop dropdowns (mouse + touch).
  useEffect(() => {
    if (!toolsOpen && !learnOpen) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (toolsRef.current && !toolsRef.current.contains(t)) setToolsOpen(false);
      if (learnRef.current && !learnRef.current.contains(t)) setLearnOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [toolsOpen, learnOpen]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the drawer for accessibility.
    const id = window.setTimeout(() => drawerFirstRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(id);
      // Return focus to the hamburger button when the drawer closes.
      hamburgerRef.current?.focus();
    };
  }, [open]);

  // Close panels on route change.
  useEffect(() => {
    setOpen(false);
    setToolsOpen(false);
    setLearnOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="nav-bar">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to={langPrefix || "/"} className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Moon className="h-4 w-4 text-primary-foreground" />
              <span className="absolute inset-0 -z-10 rounded-full bg-primary/40 blur-xl" />
            </span>
            <span className="font-display text-lg tracking-tight text-white">somna</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.slice(0, 4).map((item) => (
              <SafeLink
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-1.5 text-base font-medium text-white/80 transition hover:bg-accent/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                activeProps={{
                  className:
                    "rounded-full px-3 py-1.5 text-base font-medium bg-accent/25 border border-accent/40 text-white",
                }}
              >
                {t(item.key)}
              </SafeLink>
            ))}
            {/* Highlighted Dashboard pill — primary accent, moon icon, glow */}
            <SafeLink
              to={dashboardItem.to}
              activeOptions={{ exact: false }}
              className="group relative mx-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-base font-medium text-primary-foreground shadow-[0_0_24px_-6px_oklch(0.72_0.13_280/70%)] transition hover:scale-[1.03] hover:shadow-[0_0_36px_-6px_oklch(0.72_0.13_280/90%)]"
              activeProps={{
                className:
                  "group relative mx-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-base font-medium text-primary-foreground shadow-[0_0_28px_-4px_oklch(0.72_0.13_280/90%)] ring-2 ring-accent/40",
              }}
            >
              <Moon className="h-3.5 w-3.5" />
              {t(dashboardItem.key)}
            </SafeLink>
            {navItems.slice(4).map((item) => (
              <SafeLink
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-1.5 text-base font-medium text-white/80 transition hover:bg-accent/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                activeProps={{
                  className:
                    "rounded-full px-3 py-1.5 text-base font-medium bg-accent/25 border border-accent/40 text-white",
                }}
              >
                {t(item.key)}
              </SafeLink>
            ))}
            <div
              className="relative"
              ref={toolsRef}
              onMouseEnter={() => openTools()}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-base font-medium text-white/80 transition hover:bg-accent/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => openTools()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openTools();
                  }
                }}
                aria-haspopup="menu"
                aria-expanded={toolsOpen}
              >
                {t("nav.tools")} <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {toolsOpen && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="nav-surface w-64 rounded-2xl p-2 animate-nav-dropdown">
                    <div className="nav-label px-3 py-2">{t("nav.tools.section")}</div>
                    {calculatorItems.map((c) => (
                      <SafeLink
                        key={c.to}
                        to={c.to}
                        className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-accent/20 hover:text-white"
                        onClick={() => setToolsOpen(false)}
                      >
                        {c.label}
                      </SafeLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              ref={learnRef}
              onMouseEnter={() => openLearn()}
              onMouseLeave={() => setLearnOpen(false)}
            >
              <button
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-base font-medium text-white/80 transition hover:bg-accent/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => openLearn()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLearn();
                  }
                }}
                aria-haspopup="menu"
                aria-expanded={learnOpen}
              >
                {t("nav.learn")} <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {learnOpen && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="nav-surface w-[34rem] rounded-2xl p-3 animate-nav-dropdown">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <SafeLink
                          to={langPrefix ? `${langPrefix}/learn` : "/learn"}
                          onClick={() => setLearnOpen(false)}
                          className="block px-3 py-2 text-xs uppercase tracking-widest text-accent hover:underline"
                        >
                          {t("nav.guides")}
                        </SafeLink>
                        {guideItems.map((g) => (
                          <SafeLink
                            key={g.to}
                            to={g.to}
                            className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-accent/20 hover:text-white"
                            onClick={() => setLearnOpen(false)}
                          >
                            {g.label}
                          </SafeLink>
                        ))}
                      </div>
                      <div>
                        <SafeLink
                          to={langPrefix ? `${langPrefix}/learn` : "/learn"}
                          onClick={() => setLearnOpen(false)}
                          className="block px-3 py-2 text-xs uppercase tracking-widest text-accent hover:underline"
                        >
                          {t("nav.lessons")}
                        </SafeLink>
                        {lessonItems.map((l) => (
                          <SafeLink
                            key={l.to}
                            to={l.to}
                            className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-accent/20 hover:text-white"
                            onClick={() => setLearnOpen(false)}
                          >
                            {l.label}
                          </SafeLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              ref={hamburgerRef}
              className="lg:hidden rounded-full p-2 text-white/80 hover:bg-accent/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer backdrop — interactive so tapping outside closes the drawer. */}
      {open && (
        <div
          className="nav-overlay fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop dropdown dim overlay — pointer-events-none so it never blocks
          hover/click on the sticky header; click-outside is handled by the
          document mousedown listener. */}
      {(toolsOpen || learnOpen) && (
        <div
          className="nav-overlay pointer-events-none fixed inset-0 z-40 hidden lg:block"
          aria-hidden="true"
        />
      )}

      {open && (
        <nav className="nav-drawer fixed right-0 top-0 h-full w-full max-w-sm z-40 overflow-y-auto px-5 pb-8 pt-[88px] animate-nav-drawer lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.slice(0, 4).map((item, idx) => (
              <SafeLink
                key={item.to}
                ref={idx === 0 ? drawerFirstRef : undefined}
                to={item.to}
                onClick={() => setOpen(false)}
                className="nav-item"
                activeProps={{
                  className: "nav-item nav-item-active",
                }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {t(item.key)}
              </SafeLink>
            ))}
            <SafeLink
              to={dashboardItem.to}
              onClick={() => setOpen(false)}
              className="nav-item justify-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_0_24px_-6px_oklch(0.72_0.13_280/70%)]"
              activeProps={{
                className:
                  "nav-item nav-item-active justify-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground ring-2 ring-accent/40",
              }}
            >
              <Moon className="h-4 w-4" />
              {t(dashboardItem.key)}
            </SafeLink>
            {navItems.slice(4).map((item) => (
              <SafeLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="nav-item"
                activeProps={{
                  className: "nav-item nav-item-active",
                }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {t(item.key)}
              </SafeLink>
            ))}

            <section className="nav-section">
              <h2 className="nav-label mb-4">{t("nav.tools.section")}</h2>
              <div className="flex flex-col gap-2">
                {calculatorItems.map((c) => (
                  <SafeLink
                    key={c.to}
                    to={c.to}
                    onClick={() => setOpen(false)}
                    className="nav-item"
                    activeProps={{
                      className: "nav-item nav-item-active",
                    }}
                  >
                    {c.label}
                  </SafeLink>
                ))}
              </div>
            </section>

            <section className="nav-section">
              <h2 className="nav-label mb-4">{t("nav.guides")}</h2>
              <div className="flex flex-col gap-2">
                {guideItems.map((g) => (
                  <SafeLink
                    key={g.to}
                    to={g.to}
                    onClick={() => setOpen(false)}
                    className="nav-item"
                    activeProps={{
                      className: "nav-item nav-item-active",
                    }}
                  >
                    {g.label}
                  </SafeLink>
                ))}
              </div>
            </section>

            <section className="nav-section">
              <h2 className="nav-label mb-4">{t("nav.lessons")}</h2>
              <div className="flex flex-col gap-2">
                <SafeLink
                  to={langPrefix ? `${langPrefix}/learn` : "/learn"}
                  onClick={() => setOpen(false)}
                  className="nav-item"
                >
                  {t("nav.learn")}
                </SafeLink>
                {lessonItems.map((l) => (
                  <SafeLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="nav-item"
                    activeProps={{
                      className: "nav-item nav-item-active",
                    }}
                  >
                    {l.label}
                  </SafeLink>
                ))}
              </div>
            </section>
          </div>
        </nav>
      )}
    </header>
  );
}
