// Localized share text + share URL builders for all social platforms.
import type { Lang } from "@/lib/i18n";
import { shareImageUrl } from "@/lib/share-config";
import type { SharePlatformParams } from "@/lib/share/shareService";

const SITE_URL = "https://somna.help";

/** Page-content-type hashtags for X (Twitter). */
const HASHTAGS: Record<string, Record<Lang, string[]>> = {
  dashboard: { en: ["SleepHealth", "CBTI"], zh: ["睡眠健康"], es: ["SaludDelSueño"] },
  assessment: { en: ["SleepProfile", "CBTI"], zh: ["睡眠档案"], es: ["PerfilDeSueño"] },
  diary: { en: ["SleepDiary", "CBTI"], zh: ["睡眠日记"], es: ["DiarioDeSueño"] },
  program: { en: ["CBTI", "SleepProgram"], zh: ["CBTI课程"], es: ["ProgramaCBTI"] },
  article: { en: ["SleepTips", "CBTI"], zh: ["睡眠知识"], es: ["ConsejosDeSueño"] },
  default: { en: ["SleepHealth", "CBTI"], zh: ["睡眠健康"], es: ["SaludDelSueño"] },
};

/** Localized WhatsApp share copy. */
const WHATSAPP_COPY: Record<Lang, (eff: number, pageUrl: string) => string> = {
  en: (eff, pageUrl) => `My Sleep Efficiency is now ${eff}% — try Somna → ${pageUrl}`,
  zh: (eff, pageUrl) => `我的睡眠效率提升到了${eff}%。看看 Somna → ${pageUrl}`,
  es: (eff, pageUrl) => `Mi eficiencia del sueño mejoró al ${eff}%. Prueba Somna → ${pageUrl}`,
};

/** Build hashtags string for X based on content type. */
function xHashtags(contentType: string, lang: Lang): string {
  const tags = HASHTAGS[contentType]?.[lang] ?? HASHTAGS.default[lang];
  return tags.map((t) => `#${t}`).join(" ");
}

/** Reddit share text per language. */
export function redditText(lang: Lang, efficiency: number): string {
  const eff = Math.round(efficiency);
  if (lang === "zh") {
    return `我的睡眠效率提升到了${eff}%。\n\n记录睡眠：\n${SITE_URL}`;
  }
  if (lang === "es") {
    return `Mi eficiencia del sueño mejoró al ${eff}%。\n\nHaz seguimiento aquí:\n${SITE_URL}`;
  }
  return `I improved my Sleep Efficiency to ${eff}% using CBT-I tools.\n\nTrack your sleep:\n${SITE_URL}`;
}

/** X (Twitter) share text per language. */
export function xText(lang: Lang, efficiency: number, contentType = "default"): string {
  const eff = Math.round(efficiency);
  const hashtags = xHashtags(contentType, lang);
  if (lang === "zh") {
    return `我的睡眠效率提升到了${eff}%。\n\n${hashtags}\n${SITE_URL}`;
  }
  if (lang === "es") {
    return `Mi eficiencia del sueño mejoró al ${eff}%。\n\n${hashtags}\n${SITE_URL}`;
  }
  return `My Sleep Efficiency is now ${eff}%.\n\n${hashtags}\n${SITE_URL}`;
}

/** Pinterest description. */
export function pinterestDescription(lang: Lang): string {
  if (lang === "zh") return `用 CBT-I 和睡眠追踪改善你的睡眠。${SITE_URL}`;
  if (lang === "es") return `Mejora tu sueño con CBT-I y seguimiento del sueño. ${SITE_URL}`;
  return `Improve your sleep with CBT-I and sleep tracking. ${SITE_URL}`;
}

/** Build the Reddit submit URL with prefilled title + url. */
export function redditShareUrl(lang: Lang, efficiency: number, title?: string): string {
  const text = redditText(lang, efficiency);
  const pageTitle = title?.trim() || text.split("\n")[0];
  return `https://www.reddit.com/submit?title=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(SITE_URL)}`;
}

/** Build the X (Twitter) share URL with prefilled text + hashtags. */
export function xShareUrl(lang: Lang, efficiency: number, contentType = "default"): string {
  const text = xText(lang, efficiency, contentType);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

/**
 * Build the Pinterest pin create URL.
 *
 * Pinterest requires a publicly hosted image. The `imageUrl` must be a full
 * public R2 CDN URL so Pinterest can fetch the preview image server-side.
 *
 * @param pageUrl     The page URL to attach to the Pin (the "url" param).
 * @param imageUrl    Public https:// URL of the PNG to pin (the "media" param).
 * @param lang        Language for the description.
 */
export function pinterestShareUrl(pageUrl: string, imageUrl: string, lang: Lang): string {
  // Guarantee a full public URL for the media param; never use a relative URL.
  const publicMediaUrl = imageUrl.startsWith("http") ? imageUrl : shareImageUrl(imageUrl);
  const desc = pinterestDescription(lang);
  const params = new URLSearchParams({
    url: pageUrl,
    media: publicMediaUrl,
    description: desc,
  });
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
}

/** WhatsApp share text per language. */
export function whatsAppText(lang: Lang, efficiency: number, pageUrl = SITE_URL): string {
  const eff = Math.round(efficiency);
  return WHATSAPP_COPY[lang](eff, pageUrl);
}

/** Facebook share URL (uses og tags at target URL, so we just send the URL). */
export function facebookShareUrl(params: SharePlatformParams): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(params.pageUrl)}`;
}

/** LinkedIn share URL with optional title and summary. */
export function linkedInShareUrl(params: SharePlatformParams): string {
  const query = new URLSearchParams({ url: params.pageUrl });
  if (params.title) query.set("title", params.title);
  if (params.description) query.set("summary", params.description);
  return `https://www.linkedin.com/sharing/share-offsite/?${query.toString()}`;
}

/** WhatsApp share URL. */
export function whatsAppShareUrl(lang: Lang, efficiency: number, pageUrl = SITE_URL): string {
  const text = whatsAppText(lang, efficiency, pageUrl);
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Copy a URL to clipboard, returning true on success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers / non-secure contexts
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
