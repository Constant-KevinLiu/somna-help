/**
 * Generador de sitemap multilingüe.
 *
 * Produce un único sitemap.xml con entradas <url> por cada página, cada una con
 * su bloque <xhtml:link rel="alternate" hreflang="en|es|x-default">. Así Google
 * entiende que /es/diary y /diary son versiones equivalentes, no duplicados.
 *
 * Uso:
 *   node scripts/generate-sitemap.mjs
 *
 * El resultado se escribe en public/sitemap.xml. Ejecutar antes de cada deploy.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGIN = "https://somna.help";

/** Rutas principales de la app (sin locale). Cada una genera versión en y es. */
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

/** Convierte una ruta base a su versión en/es. */
function toEn(path) {
  return path === "/" ? "/" : path;
}
function toEs(path) {
  return path === "/" ? "/es" : "/es" + path;
}

function urlBlock(route) {
  const enUrl = ORIGIN + toEn(route.path);
  const esUrl = ORIGIN + toEs(route.path);
  return `  <url>
    <loc>${enUrl}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

${ROUTES.map(urlBlock).join("\n")}

</urlset>
`;

const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`Sitemap generado: ${outPath} (${ROUTES.length} URLs, ${ROUTES.length * 2} versiones idioma)`);
