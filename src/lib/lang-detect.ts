/**
 * Detección de idioma y persistencia de la preferencia del usuario.
 *
 * ⚠️ 100% cliente. Sin endpoints /api. Sin createAPIFileRoute. Sin SSR.
 *
 * - La preferencia del usuario se guarda en la cookie `somna_lang` (1 año),
 *   vinculada al identificador `somna_uid` cuando existe.
 * - Detección automática por navegador (navigator.language) como respaldo.
 * - No hay parámetro ?lang=. No hay subdominios por país. Solo rutas / y /es/.
 */

export type Lang = "en" | "es";

/** Nombre de la cookie que guarda la preferencia de idioma del usuario. */
export const LANG_COOKIE = "somna_lang";
/** Nombre de la cookie de identificador de usuario. */
export const UID_COOKIE = "somna_uid";
/** Validez de la cookie de idioma: 1 año. */
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Lee una cookie individual por su nombre desde document.cookie (cliente).
 * Devuelve null si no existe o si se ejecuta en SSR sin document.
 */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * getBrowserLang: lee el idioma del navegador (navigator.language) y lo
 * normaliza a "es" o "en". Si el navegador está en español (es-ES, es-MX,
 * es-AR, etc.) devuelve "es"; en cualquier otro caso devuelve "en".
 */
export function getBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const l of langs) {
    if (l && l.toLowerCase().startsWith("es")) return "es";
  }
  return "en";
}

/**
 * getSavedUserLang: lee la preferencia manual guardada por el usuario en la
 * cookie somna_lang. Devuelve null si no hay preferencia guardada.
 */
export function getSavedUserLang(): Lang | null {
  const v = readCookie(LANG_COOKIE);
  if (v === "es" || v === "en") return v;
  return null;
}

/**
 * setUserLangCookie: escribe la cookie somna_lang con el idioma indicado.
 * Validez 1 año, Path=/, SameSite=Lax. En http (dev) no marca Secure.
 * También garantiza que exista somna_uid (lo crea si falta) para vincular
 * la preferencia al usuario.
 */
export function setUserLangCookie(lang: Lang): void {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LANG_COOKIE}=${lang}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  if (!readCookie(UID_COOKIE)) {
    document.cookie = `${UID_COOKIE}=${generateUid()}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  }
}

/**
 * Devuelve el idioma efectivo del visitante en el cliente.
 * Prioridad: cookie de preferencia manual > idioma del navegador > "en".
 */
export function resolveClientLang(): Lang {
  return getSavedUserLang() ?? getBrowserLang();
}

/** Genera un identificador de usuario aleatorio (suficiente para vincular preferencia). */
export function generateUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxxxxxxxxxx".replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
}

/**
 * Comprueba si una ruta pertenece a la versión en español (/es/...).
 */
export function isEsRoute(pathname: string): boolean {
  return pathname === "/es" || pathname.startsWith("/es/");
}

/**
 * Convierte una ruta a su equivalente en el idioma indicado.
 * - toLang "es" sobre "/"  -> "/es"
 * - toLang "es" sobre "/diary" -> "/es/diary"
 * - toLang "en" sobre "/es/diary" -> "/diary"
 * - toLang "en" sobre "/es" -> "/"
 *
 * Mapeo de slugs traducidos (legacy): algunas rutas españolas antiguas usaban
 * slugs nativos (evaluacion, diario, relajacion, panel). Para que el
 * conmutador de idioma y el auto-redirect funcionen en ambas direcciones,
 * normalizamos esos slugs a sus equivalentes en inglés.
 *
 * Nota: /es/panel ↔ /dashboard es una correspondencia asimétrica (el slug
 * español "panel" no coincide con el inglés "dashboard").
 */
const ES_SLUG_TO_EN: Record<string, string> = {
  evaluacion: "assessment",
  diario: "diary",
  relajacion: "relax",
  panel: "dashboard",
};
const EN_SLUG_TO_ES: Record<string, string> = {
  assessment: "assessment",
  diary: "diary",
  relax: "relax",
  dashboard: "panel",
};

/** Convierte un segmento de ruta español (legacy) a su equivalente inglés. */
function esSlugToEn(segment: string): string {
  return ES_SLUG_TO_EN[segment] ?? segment;
}
/** Convierte un segmento de ruta inglés a su equivalente español. */
function enSlugToEs(segment: string): string {
  return EN_SLUG_TO_ES[segment] ?? segment;
}

export function switchRouteLang(pathname: string, toLang: Lang): string {
  const isEs = isEsRoute(pathname);
  if (toLang === "es") {
    if (isEs) return pathname;
    if (pathname === "/") return "/es";
    // 1:1 mapping con excepciones documentadas (dashboard → panel).
    const segments = pathname.split("/").map((s) => enSlugToEs(s));
    return "/es" + segments.join("/");
  }
  // toLang === "en"
  if (!isEs) return pathname;
  if (pathname === "/es") return "/";
  // Quita "/es" y normaliza slugs españoles (legacy) a ingleses.
  const rest = pathname.slice(3); // quita "/es"
  const segments = rest.split("/").map((s) => esSlugToEn(s));
  return segments.join("/");
}
