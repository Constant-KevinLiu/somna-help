/**
 * Generador de sitemaps multilingües.
 *
 * Produce cuatro sitemaps independientes (sitemap-en.xml, sitemap-es.xml,
 * sitemap-pt.xml, sitemap-pl.xml), cada uno con URLs forzosamente en HTTPS.
 * También genera un índice sitemap.xml para compatibilidad con herramientas
 * que esperan un único punto de entrada.
 *
 * Uso:
 *   node scripts/generate-sitemap.mjs
 *
 * Ejecutar antes de cada deploy.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGIN = "https://somna.help";

/** Idiomas activos con su prefijo de ruta. */
const LANGS = [
  { code: "en", prefix: "" },
  { code: "es", prefix: "/es" },
  { code: "pt", prefix: "/pt" },
  { code: "pl", prefix: "/pl" },
];

/** Rutas principales de la app (sin locale). */
const ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/dashboard", priority: "0.9", changefreq: "daily" },
  { path: "/diary", priority: "0.9", changefreq: "daily" },
  { path: "/assessment", priority: "0.8", changefreq: "weekly" },
  { path: "/program", priority: "0.8", changefreq: "weekly" },
  { path: "/relax", priority: "0.6", changefreq: "monthly" },
  { path: "/calculator", priority: "0.8", changefreq: "monthly" },
  { path: "/sleep-calculator", priority: "0.8", changefreq: "monthly" },
  { path: "/bedtime-calculator", priority: "0.8", changefreq: "monthly" },
  { path: "/nap-calculator", priority: "0.7", changefreq: "monthly" },
  { path: "/melatonin-calculator", priority: "0.7", changefreq: "monthly" },
  { path: "/cbt-i-guide", priority: "0.7", changefreq: "monthly" },
  { path: "/insomnia-treatment", priority: "0.7", changefreq: "monthly" },
  { path: "/how-to-fall-asleep-fast", priority: "0.7", changefreq: "monthly" },
  { path: "/sleep-anxiety", priority: "0.7", changefreq: "monthly" },
  { path: "/wake-up-at-3am", priority: "0.7", changefreq: "monthly" },
  { path: "/learn", priority: "0.6", changefreq: "weekly" },
  { path: "/pricing", priority: "0.7", changefreq: "monthly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

function localizePath(path, prefix) {
  if (path === "/") {
    return prefix || "/";
  }
  return `${prefix}${path}`;
}

function urlBlock(route, langPrefix) {
  const loc = `${ORIGIN}${localizePath(route.path, langPrefix)}`;
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}

function generateSitemap(lang) {
  const body = ROUTES.map((route) => urlBlock(route, lang.prefix)).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function generateSitemapIndex() {
  const entries = LANGS.map(
    (lang) =>
      `  <sitemap>
    <loc>${ORIGIN}/sitemap-${lang.code}.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
}

for (const lang of LANGS) {
  const outPath = resolve(__dirname, "..", "public", `sitemap-${lang.code}.xml`);
  writeFileSync(outPath, generateSitemap(lang), "utf8");
  console.log(`Sitemap generado: ${outPath} (${ROUTES.length} URLs)`);
}

const indexPath = resolve(__dirname, "..", "public", "sitemap.xml");
writeFileSync(indexPath, generateSitemapIndex(), "utf8");
console.log(`Índice de sitemaps generado: ${indexPath}`);
