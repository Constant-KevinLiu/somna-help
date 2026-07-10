/**
 * Detecção de idioma e persistência da preferência do usuário.
 *
 * ⚠️ 100% cliente. Sem endpoints /api. Sem createAPIFileRoute. Sem SSR.
 *
 * Arquitetura multilíngue extensível:
 * - A preferência do usuário é salva no cookie `somna_lang` (1 ano) e no
 *   localStorage `somna-language`.
 * - Detecção automática por navegador (navigator.language) como fallback.
 * - Idiomas suportados: en, es, pt, pl. Reservados para futuro: de, ja, zh.
 * - Cada idioma tem seu próprio prefixo de rota: / (en), /es/, /pt/, /pl/,
 *   /de/, /ja/, /zh/.
 */

export type Lang = "en" | "es" | "pt" | "pl" | "de" | "ja" | "zh";

/** Idiomas atualmente ativos (com rotas e locales criados). */
export const ACTIVE_LANGS: Lang[] = ["en", "es", "pt", "pl"];

/** Idiomas reservados para futuro (sem rotas ainda). */
export const RESERVED_LANGS: Lang[] = ["de", "ja", "zh"];

/** Mapeamento de idioma → prefixo de rota. en não tem prefixo. */
export const LANG_PREFIX: Record<Lang, string> = {
  en: "",
  es: "/es",
  pt: "/pt",
  pl: "/pl",
  de: "/de",
  ja: "/ja",
  zh: "/zh",
};

/** Nome do cookie que guarda a preferência de idioma do usuário. */
export const LANG_COOKIE = "somna_lang";
/** Nome do cookie de identificador de usuário. */
export const UID_COOKIE = "somna_uid";
/** Validade do cookie de idioma: 1 ano. */
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
/** Nome da chave localStorage que guarda a preferência de idioma do usuário. */
export const LANG_LOCAL_STORAGE = "somna-language";

/**
 * Lee una cookie individual por su nombre desde document.cookie (cliente).
 * Devuelve null si no existe o si se ejecuta en SSR sin document.
 */
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * getBrowserLang: lê o idioma do navegador (navigator.language) e o normaliza
 * para um dos idiomas suportados. Retorna "en" como fallback.
 * - pt-BR, pt-PT → "pt"
 * - pl-PL → "pl"
 * - es-ES, es-MX, es-AR → "es"
 * - de-DE, de-AT → "de"
 * - ja-JP → "ja"
 * - zh-CN, zh-TW → "zh"
 */
export function getBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const l of langs) {
    if (!l) continue;
    const lower = l.toLowerCase();
    if (lower.startsWith("pt")) return "pt";
    if (lower.startsWith("pl")) return "pl";
    if (lower.startsWith("es")) return "es";
    if (lower.startsWith("de")) return "de";
    if (lower.startsWith("ja")) return "ja";
    if (lower.startsWith("zh")) return "zh";
  }
  return "en";
}

function isValidLang(v: string | null): v is Lang {
  return (
    v === "en" || v === "es" || v === "pt" || v === "pl" || v === "de" || v === "ja" || v === "zh"
  );
}

/**
 * getSavedUserLang: lê a preferência manual salva pelo usuário no cookie
 * somna_lang ou no localStorage somna-language. Retorna null se não houver
 * preferência salva.
 */
export function getSavedUserLang(): Lang | null {
  const cookie = readCookie(LANG_COOKIE);
  if (isValidLang(cookie)) return cookie;
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(LANG_LOCAL_STORAGE);
    if (isValidLang(stored)) return stored;
  }
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
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LANG_COOKIE}=${lang}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  if (!readCookie(UID_COOKIE)) {
    document.cookie = `${UID_COOKIE}=${generateUid()}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  }
}

/**
 * Persiste a preferência de idioma em cookie (somna_lang) e localStorage
 * (somna-language), mantendo compatibilidade com mecanismos anteriores.
 */
export function setUserLangPreference(lang: Lang): void {
  setUserLangCookie(lang);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANG_LOCAL_STORAGE, lang);
  }
}

/**
 * Devuelve el idioma efectivo del visitante en el cliente.
 * Prioridad: cookie somna_lang > localStorage somna-language > idioma del
 * navegador > "en".
 */
export function resolveClientLang(): Lang {
  return getSavedUserLang() ?? getBrowserLang();
}

/** Genera un identificador de usuario aleatorio (suficiente para vincular preferencia). */
export function generateUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxxxxxxxxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
}

/**
 * Detecta o idioma de uma rota pelo seu prefixo.
 * - "/" → "en"
 * - "/es" ou "/es/..." → "es"
 * - "/pt" ou "/pt/..." → "pt"
 * - "/pl" ou "/pl/..." → "pl"
 * - "/de/..." → "de", "/ja/..." → "ja", "/zh/..." → "zh"
 */
export function getLangFromPathname(pathname: string): Lang {
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  if (pathname === "/de" || pathname.startsWith("/de/")) return "de";
  if (pathname === "/ja" || pathname.startsWith("/ja/")) return "ja";
  if (pathname === "/zh" || pathname.startsWith("/zh/")) return "zh";
  return "en";
}

/**
 * Comprueba si una ruta pertenece a la versión en español (/es/...).
 * @deprecated Usar getLangFromPathname() para suporte multilíngue.
 */
export function isEsRoute(pathname: string): boolean {
  return pathname === "/es" || pathname.startsWith("/es/");
}

/**
 * Comprueba si una ruta pertenece a un idioma distinto del inglés.
 */
export function isLocalizedRoute(pathname: string): boolean {
  return getLangFromPathname(pathname) !== "en";
}

/**
 * Mapeo de slugs traducidos (legacy): algunas rutas localizadas usan slugs
 * nativos. Para que el conmutador de idioma y el auto-redirect funcionen en
 * ambas direcciones, normalizamos esos slugs a sus equivalentes en inglés.
 *
 * Nota: /es/panel ↔ /dashboard y /pt/painel ↔ /dashboard son asimétricos.
 */
const LOCALIZED_SLUG_TO_EN: Record<string, string> = {
  // Español (legacy)
  evaluacion: "assessment",
  diario: "diary",
  relajacion: "relax",
  panel: "dashboard",
  // Portugués
  avaliacao: "assessment",
  relaxamento: "relax",
  painel: "dashboard",
};
const EN_SLUG_TO_LOCALIZED: Record<string, Partial<Record<Lang, string>>> = {
  dashboard: { es: "panel", pt: "painel" },
};

/** Convierte un segmento de ruta localizado a su equivalente inglés. */
function localizedSlugToEn(segment: string): string {
  return LOCALIZED_SLUG_TO_EN[segment] ?? segment;
}
/** Convierte un segmento de ruta inglés a su equivalente en el idioma destino. */
function enSlugToLocalized(segment: string, toLang: Lang): string {
  const map = EN_SLUG_TO_LOCALIZED[segment];
  return map ? (map[toLang] ?? segment) : segment;
}

/**
 * Convierte una ruta a su equivalente en el idioma indicado.
 * - toLang "pt" sobre "/"  -> "/pt"
 * - toLang "pt" sobre "/diary" -> "/pt/diary"
 * - toLang "en" sobre "/pt/diary" -> "/diary"
 * - toLang "en" sobre "/pt" -> "/"
 * - toLang "es" sobre "/pt/program" -> "/es/program"
 *
 * Funciona entre cualquier par de idiomas soportados.
 */
export function switchRouteLang(pathname: string, toLang: Lang): string {
  const currentLang = getLangFromPathname(pathname);
  const currentPrefix = LANG_PREFIX[currentLang];
  const targetPrefix = LANG_PREFIX[toLang];

  // Quita el prefijo del idioma actual y normaliza slugs a inglés.
  let rest = pathname;
  if (currentPrefix && (pathname === currentPrefix || pathname.startsWith(currentPrefix + "/"))) {
    rest = pathname.slice(currentPrefix.length);
  }
  // Normaliza slugs localizados (legacy) a ingleses canónicos.
  const enSegments = rest.split("/").map((s) => localizedSlugToEn(s));
  const enPath = enSegments.join("/");

  // Aplica el prefijo del idioma destino y mapea slugs si es necesario.
  const targetSegments = enPath.split("/").map((s) => enSlugToLocalized(s, toLang));
  const result = targetPrefix + targetSegments.join("/");
  return result || "/";
}

/**
 * getAllLangAlternatePaths: genera las rutas equivalentes en TODOS los
 * idiomas activos para una ruta dada. Usado por SeoHead/hreflang para
 * renderizar las etiquetas <link rel="alternate" hreflang="...">.
 */
export function getAllLangAlternatePaths(pathname: string): Array<{ lang: Lang; path: string }> {
  return ACTIVE_LANGS.map((lang) => ({
    lang,
    path: switchRouteLang(pathname, lang),
  }));
}
