# Checklist de lanzamiento de la versión en español /es/

> Ejecutar de arriba a abajo. Pensado para una sola persona en VS Code.
> Proyecto real: TanStack Start + Vite + Cloudflare (NO Next.js).

## Fase 0 — Verificación previa

- [ ] Confirmar que `npm.cmd run typecheck` pasa sin errores.
- [ ] Confirmar que `npm.cmd run lint:check` pasa sin warnings.
- [ ] Hacer commit de la rama actual y crear rama `feat/es-site`.

## Fase 1 — Desarrollo en VS Code

### 1.1 Recursos de idioma (ya creados)

- [ ] Revisar `src/locales/es/common.json` — navegación, botones, errores.
- [ ] Revisar `src/locales/es/diary.json` — diario, panel, análisis IA.
- [ ] Revisar `src/locales/es/pricing.json` — planes en euros.
- [ ] Revisar `src/locales/es/share-card.json` — compartir en redes.
- [ ] Revisar `src/locales/es/blog.json` — metacadenas del blog.
- [ ] Revisar `src/locales/es/email.json` — cadenas de emails.
- [ ] Revisar `src/locales/es/legal.json` — privacidad RGPD + términos.
- [ ] Revisar `src/locales/es/faq.json` — FAQ de producto.
- [ ] Revisar `src/locales/es/payment.json` — flujo de pago Subotiz.

### 1.2 Arquitectura (ya creada)

- [ ] `src/lib/lang-detect.ts` — detección IP/Cookie, switch de rutas.
- [ ] `src/lib/format.ts` — fecha/hora/moneda ES vs MX.
- [ ] `src/components/seo/Hreflang.tsx` — hreflang bidireccional + canonical.
- [ ] `src/components/LanguageSwitcher.tsx` — conmutador de cabecera.
- [ ] `src/routes/api/lang.ts` — endpoint cookie somna_uid.
- [ ] `src/routes/es.tsx` — layout raíz /es/.
- [ ] `src/routes/es/index.tsx` — home española.
- [ ] `scripts/generate-sitemap.mjs` — sitemap multilingüe.
- [ ] `docs/cloudflare-cache-rules-es.txt` — reglas de caché.

### 1.3 Ampliar rutas /es/ (tarea pendiente)

Replicar el patrón de `src/routes/es/index.tsx` para cada página:

- [ ] `src/routes/es/diary.tsx`
- [ ] `src/routes/es/calculator.tsx`
- [ ] `src/routes/es/assessment.tsx`
- [ ] `src/routes/es/program/index.tsx`
- [ ] `src/routes/es/dashboard.tsx`
- [ ] `src/routes/es/relax.tsx`
- [ ] `src/routes/es/blog/index.tsx`
- [ ] `src/routes/es/faq.tsx`
- [ ] `src/routes/es/pricing.tsx`
- [ ] `src/routes/es/privacy.tsx`
- [ ] `src/routes/es/terms.tsx`

Cada una: `createFileRoute("/es/<path>")`, `head` con `hreflangMeta("/es/<path>")`,
textos de `loadEsDict()`.

### 1.4 Emails (ya creados)

- [ ] `src/emails/es/base.html` + 6 plantillas específicas.
- [ ] `src/services/email/send-es.ts` — dispatcher nativo es.
- [ ] `src/routes/api/email/send.ts` — endpoint POST.

### 1.5 Compartir y pago

- [ ] `src/components/ShareExportDialogEs.tsx` — diálogo R2 en español.
- [ ] `src/locales/es/payment.json` — cadenas Subotiz.

## Fase 2 — Previsualización local

- [ ] `npm.cmd run dev` y abrir `http://localhost:3000/es`.
- [ ] Verificar que el `<html lang="es">` aparece en el DOM.
- [ ] Verificar en DevTools → Network que las etiquetas `<link rel="alternate"
    hreflang="en|es">` y `<link rel="canonical">` están presentes.
- [ ] Probar el conmutador de idioma: cambia de /es a / y viceversa.
- [ ] Comprobar que la cookie `somna_uid` se setea con `lang=es` tras cambiar.
- [ ] Probar el diario en /es/diary con textos en español.
- [ ] Probar el diálogo de compartir: forzar error 401 y ver mensaje español.
- [ ] Ejecutar `node scripts/generate-sitemap.mjs` y revisar `public/sitemap.xml`.
- [ ] `npm.cmd run typecheck` de nuevo.
- [ ] `npm.cmd run build` para validar el build de producción.

## Fase 3 — Despliegue gradual (gris)

- [ ] Hacer push de la rama `feat/es-site` y abrir PR.
- [ ] Desplegar en un entorno de preview de Cloudflare Pages.
- [ ] Validar en preview:
  - [ ] `/es` carga con textos españoles.
  - [ ] hreflang correcto en todas las páginas /es/.
  - [ ] canonical apunta a la URL /es/ correspondiente.
  - [ ] sitemap.xml accesible y con ambas versiones.
  - [ ] robots.txt no bloquea /es/.
- [ ] Configurar las reglas de caché de `docs/cloudflare-cache-rules-es.txt`
      en Cloudflare Dashboard → Rules → Cache Rules.
- [ ] Configurar redirección por IP (opcional, vía Cloudflare Workers):
      visitantes de países ES_* a /es/ si no tienen cookie somna_uid.

## Fase 4 — Indexación y SEO

- [ ] Añadir `https://somna.help/es/` como propiedad de prefijo en GSC.
- [ ] Enviar `https://somna.help/sitemap.xml` en GSC.
- [ ] Revisar informe de cobertura: URLs /es/ indexándose.
- [ ] Revisar informe internacional → hreflang sin errores.
- [ ] Confirmar que las URLs inglesas no compiten con las españolas.
- [ ] Tras 2 semanas, revisar consultas reales en español y ajustar metas.

## Fase 5 — Contenido y enlaces

- [ ] Redactar los 20 artículos del blog con `docs/blog-prompt-es.md`.
- [ ] Publicar al menos 4 artículos antes del lanzamiento público.
- [ ] Aplicar el clúster de enlazado interno de `docs/blog-index-es.md`.
- [ ] Iniciar linkbuilding según `docs/seo-strategy-es.md`.
- [ ] Preparar el «Informe del sueño en España 2026» como link magnet.

## Fase 6 — Lanzamiento público

- [ ] Merge del PR a main.
- [ ] Despliegue a producción en Cloudflare Pages.
- [ ] Verificación final en producción de /es/ y del conmutador.
- [ ] Anuncio en redes (priorizar Facebook, Instagram, TikTok).
- [ ] Monitorizar errores en GSC y en los logs de Cloudflare durante 1 semana.

## Notas técnicas

- **PowerShell:** usar `npm.cmd run <script>` (no `npm.ps1`).
- **No encadenar con `&&`:** usar `;` en PowerShell.
- **Build:** `npm.cmd run build` genera `dist/` que Cloudflare sirve.
- **R2:** el bucket `somna-share` ya existe; las imágenes de compartir en
  español usan el mismo bucket con prefijo `es/`.
- **D1:** añadir columna `lang TEXT` a la tabla de usuarios si no existe,
  para persistir la preferencia también en servidor.
