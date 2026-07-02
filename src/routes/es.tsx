/**
 * Layout raíz de la versión en español (/es/...).
 *
 * - Establece <html lang="es"> y los meta por defecto en español.
 * - Inyecta hreflang bidireccional + canonical.
 * - Reutiliza Header y Footer existentes; el idioma se resuelve por ruta.
 *
 * NOTA: Este layout envuelve TODAS las rutas bajo /es/. Las páginas hijas
 * (es/index, es/diary, etc.) heredan este layout automáticamente.
 */

import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { hreflangMeta } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "lang", content: "es" },
      { title: "somna — Vuelve a dormir bien, esta misma noche" },
      {
        name: "description",
        content:
          "Somna es tu acompañante de sueño basado en CBT-I. Sin pastillas, sin presión: pequeños cambios diarios para recuperar tu ritmo natural de descanso.",
      },
      { name: "og:locale", content: "es_ES" },
      ...hreflangMeta("/es"),
    ],
  }),
  component: EsLayout,
});

function EsLayout() {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Marca la ruta actual para depuración de hreflang */}
      <span data-es-path={pathname} className="sr-only" aria-hidden="true" />
      <Toaster />
    </div>
  );
}
