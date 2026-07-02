# Checklist de verificación local — 3 problemas corregidos

> Ejecutar con `npm.cmd run dev` (Vite, NO vinxi). Puerto 8080.
> Verificar en orden. Cada paso marca si el problema está resuelto.

## Problema 1 — Doble barra de navegación en /es/

- [ ] Abrir `http://localhost:8080/es`.
- [ ] Inspeccionar el DOM: debe haber **un solo** `<header>` (banner).
- [ ] Confirmar que no aparece una segunda barra de navegación debajo.
- [ ] **Causa corregida:** `src/routes/es.tsx` ya no renderiza `<Header/>` ni
      `<Footer/>`; los provee `__root.tsx` una sola vez.

## Problema 2 — /es/program devolvía 404

- [ ] Abrir `http://localhost:8080/es/program`.
- [ ] La página carga con título "Programa CBT-I en 6 semanas — somna".
- [ ] Se ven las 6 semanas del programa y el botón "Empezar mi plan de sueño".
- [ ] **Causa corregida:** creado `src/routes/es/program.tsx`.
- [ ] Verificar también las rutas nuevas:
  - [ ] `/es/evaluacion` → "Test de sueño"
  - [ ] `/es/diario` → "Diario de sueño"
  - [ ] `/es/panel` → "Tu panel de sueño"
  - [ ] `/es/relajacion` → "Relajación y descanso"

## Problema 3 — Botón ES no navegaba a /es/

- [ ] Abrir `http://localhost:8080/` (versión inglesa).
- [ ] Hacer clic en el botón de idioma (arriba a la derecha) → "English".
- [ ] Seleccionar "🇪🇸 Español".
- [ ] La URL cambia a `http://localhost:8080/es`.
- [ ] La página muestra textos en español.
- [ ] Hacer clic de nuevo → "Español" → seleccionar "🇬🇧 English".
- [ ] La URL vuelve a `http://localhost:8080/`.
- [ ] **Causa corregida:** `LanguageSwitcher` ahora escribe cookie `somna_lang`
      y llama `router.navigate()`; sin endpoints `/api`.

## Verificación de SEO (hreflang + canonical)

- [ ] En `/es/program`, inspeccionar `<head>`:
  - [ ] Un único `<link rel="canonical" href="https://somna.help/es/program">`.
  - [ ] `<link rel="alternate" hreflang="en" href="https://somna.help/program">`.
  - [ ] `<link rel="alternate" hreflang="es" href="https://somna.help/es/program">`.
  - [ ] `<link rel="alternate" hreflang="x-default" href="https://somna.help/program">`.
- [ ] En `/` (inglés):
  - [ ] `<link rel="canonical" href="https://somna.help/">`.
  - [ ] hreflang en/es/x-default presentes.

## Verificación de navegación en español

- [ ] En `/es`, la barra de navegación muestra: Inicio · Programa · Evaluación ·
      Diario · Panel · Relajación.
- [ ] Los enlaces apuntan a `/es`, `/es/program`, `/es/evaluacion`, etc.
- [ ] El footer muestra textos en español.

## Verificación de cookie

- [ ] Tras seleccionar ES, en DevTools → Application → Cookies:
  - [ ] `somna_lang=es` existe, Path=/, Max-Age=1 año.
  - [ ] `somna_uid` existe (identificador de usuario).

## Verificación de tipos y build

- [ ] `npm.cmd run typecheck` sin errores.
- [ ] `npm.cmd run build` completa sin errores.

## Notas

- No hay `src/routes/api/` ni `createAPIFileRoute`. Todo es cliente.
- El idioma se sincroniza con la ruta en `__root.tsx` (RootComponent) pasando
  `initialLang` a `I18nProvider`, evitando mismatch de hidratación.
- `vite dev` es el único comando de desarrollo. o/q/r siguen funcionando.
