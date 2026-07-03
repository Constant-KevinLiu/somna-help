import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import {
  getSavedUserLang,
  getLangFromPathname,
  isLocalizedRoute,
  switchRouteLang,
} from "@/lib/lang-detect";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "somna — Sleep Better, Starting Tonight" },
      {
        name: "description",
        content:
          "A science-based CBT-I sleep platform that gently helps you restore healthy sleep patterns — drug-free, calming, and built around you.",
      },
      { name: "author", content: "somna" },
      // ==============================================
      // ✅ OPEN GRAPH（Facebook / WhatsApp / Telegram / 微信 / 搜索引擎）
      // ==============================================
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://somna.help/" },
      { property: "og:title", content: "somna — Sleep Better, Starting Tonight" },
      {
        property: "og:description",
        content: "Science-based CBT-I sleep companion. Calm, gentle, evidence-backed.",
      },
      {
        property: "og:image",
        content: `${import.meta.env.PUBLIC_SHARE_BASE_URL || "https://somna.help"}/og-cover.jpg`,
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:site_name", content: "somna" },
      { property: "og:locale", content: "en_US" },

      // ==============================================
      // ✅ TWITTER CARD（X / Twitter 分享大图）
      // ==============================================
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "somna — Sleep Better, Starting Tonight" },
      {
        name: "twitter:description",
        content: "Science-based CBT-I sleep companion. Calm, gentle, evidence-backed.",
      },
      {
        name: "twitter:image",
        content: `${import.meta.env.PUBLIC_SHARE_BASE_URL || "https://somna.help"}/og-cover.jpg`,
      },
      { name: "twitter:site", content: "@somna" },
      { name: "twitter:creator", content: "@somna" },

      // 浏览器主题颜色（标签栏颜色）
      { name: "theme-color", content: "#1E1B4B" },
      { name: "apple-mobile-web-app-status-bar-style", content: "#1E1B4B" },
    ],
    links: [
      // Favicon 相关
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      // 你现有的样式/字体链接
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  // O atributo lang do <html> segue o idioma da rota atual (/pt/** → "pt",
  // /es/** → "es", demais → "en"), para SEO e leitores de tela.
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const routeLang = getLangFromPathname(pathname);
  return (
    <html lang={routeLang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = router.state.location.pathname;
  // O idioma é derivado da rota: /es/** → "es", /pt/** → "pt", resto → "en".
  // SSR e cliente usam o mesmo valor, evitando mismatch de hidratação.
  const routeLang = getLangFromPathname(pathname);

  // Auto-redirect baseado no cookie de preferência (somna_lang).
  // Só no cliente: evita SSR 500 e mismatch de hidratação.
  // - Se o cookie diz "pt" mas estamos em rota de outro idioma → /pt/...
  // - Se o cookie diz "en" mas estamos em /es/... ou /pt/... → rota inglesa.
  useEffect(() => {
    const saved = getSavedUserLang();
    if (!saved) return;
    const currentLang = getLangFromPathname(pathname);
    if (saved === currentLang) return;
    // Só redireciona se o idioma salvo tem rotas ativas.
    if (saved !== "en" && saved !== "es" && saved !== "pt") return;
    const target = switchRouteLang(pathname, saved);
    if (target !== pathname) router.navigate({ to: target, replace: true });
  }, [pathname, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLang={routeLang as "en" | "es" | "pt" | "zh"}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-center" />
      </I18nProvider>
    </QueryClientProvider>
  );
}
