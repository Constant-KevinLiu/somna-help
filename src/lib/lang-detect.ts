/**
 * Detección de idioma y persistencia de la preferencia del usuario.
 *
 * - La preferencia se guarda en la cookie `somna_uid` (vinculada al usuario),
 *   tal como exige el proyecto. Se complementa con localStorage para acceso
 *   rápido desde el cliente.
 * - La detección por IP se delega a Cloudflare (cabecera `cf-ipcountry`).
 *   Aquí solo interpretamos esa cabecera y la preferencia guardada.
 *
 * No hay parámetro ?lang=. No hay subdominios por país. Solo rutas / y /es/.
 */

export type Lang = "en" | "es";

/** Países hispanohablantes que deben redirigir a /es/. */
export const ES_COUNTRIES = new Set([
  "ES", // España
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GT", "HN",
  "MX", "NI", "PA", "PY", "PE", "PR", "UY", "VE",
]);

export const LANG_COOKIE = "somna_uid";
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 años

/**
 * Lee la preferencia de idioma guardada en la cookie somna_uid.
 * El valor se guarda como `somna_uid=<uid>; lang=<es|en>` — aquí solo nos
 * interesa el segmento `lang`.
 */
export function readLangFromCookie(cookieHeader: string | null | undefined): Lang | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)lang=(en|es)(?:;|$)/i);
  if (!match) return null;
  return match[1].toLowerCase() as Lang;
}

/**
 * Construye el valor de la cookie somna_uid conservando el uid existente y
 * fijando el segmento `lang`.
 */
export function buildLangCookieValue(
  existingCookie: string | null | undefined,
  lang: Lang,
): string {
  let uid = "";
  if (existingCookie) {
    const uidMatch = existingCookie.match(/(?:^|;\s*)somna_uid=([^;]+)/);
    if (uidMatch) uid = uidMatch[1];
  }
  if (!uid) uid = generateUid();
  return `somna_uid=${uid}; lang=${lang}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
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
 * Decide el idioma inicial del visitante a partir de la cookie y del país
 * detectado por Cloudflare. Prioridad: cookie > país > 'en'.
 *
 * @param cookieHeader  Cabecera Cookie entrante.
 * @param cfIpCountry   Valor de la cabecera `cf-ipcountry` (código ISO 3166-1 alpha-2).
 */
export function detectInitialLang(
  cookieHeader: string | null | undefined,
  cfIpCountry: string | null | undefined,
): Lang {
  const fromCookie = readLangFromCookie(cookieHeader);
  if (fromCookie) return fromCookie;

  const country = (cfIpCountry ?? "").toUpperCase();
  if (ES_COUNTRIES.has(country)) return "es";

  return "en";
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
 */
export function switchRouteLang(pathname: string, toLang: Lang): string {
  const isEs = isEsRoute(pathname);
  if (toLang === "es") {
    if (isEs) return pathname;
    if (pathname === "/") return "/es";
    return "/es" + pathname;
  }
  // toLang === "en"
  if (!isEs) return pathname;
  if (pathname === "/es") return "/";
  return pathname.slice(3); // quita "/es"
}
