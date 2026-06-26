// Localized share text + share URL builders for Reddit, X, Pinterest.
import type { Lang } from "@/lib/i18n";

const SITE_URL = "https://somna.help";

/** Reddit share text per language. */
export function redditText(lang: Lang, efficiency: number): string {
  const eff = Math.round(efficiency);
  if (lang === "zh") {
    return `我的睡眠效率提升到了${eff}%。\n\n记录睡眠：\n${SITE_URL}`;
  }
  if (lang === "es") {
    return `Mi eficiencia del sueño mejoró al ${eff}%.\n\nHaz seguimiento aquí:\n${SITE_URL}`;
  }
  return `I improved my Sleep Efficiency to ${eff}% using CBT-I tools.\n\nTrack your sleep:\n${SITE_URL}`;
}

/** X (Twitter) share text per language. */
export function xText(lang: Lang, efficiency: number): string {
  const eff = Math.round(efficiency);
  if (lang === "zh") {
    return `我的睡眠效率提升到了${eff}%。\n\n#睡眠健康\n${SITE_URL}`;
  }
  if (lang === "es") {
    return `Mi eficiencia del sueño mejoró al ${eff}%.\n\n#SaludDelSueño\n${SITE_URL}`;
  }
  return `My Sleep Efficiency is now ${eff}%.\n\nTracking sleep with CBT-I.\n#SleepHealth #CBTI\n${SITE_URL}`;
}

/** Pinterest description. */
export function pinterestDescription(lang: Lang): string {
  if (lang === "zh") return `用 CBT-I 和睡眠追踪改善你的睡眠。${SITE_URL}`;
  if (lang === "es") return `Mejora tu sueño con CBT-I y seguimiento del sueño. ${SITE_URL}`;
  return `Improve your sleep with CBT-I and sleep tracking. ${SITE_URL}`;
}

/** Build the Reddit submit URL with prefilled text. */
export function redditShareUrl(lang: Lang, efficiency: number): string {
  const text = redditText(lang, efficiency);
  return `https://www.reddit.com/submit?title=${encodeURIComponent(text.split("\n")[0])}&url=${encodeURIComponent(SITE_URL)}`;
}

/** Build the X (Twitter) share URL with prefilled text. */
export function xShareUrl(lang: Lang, efficiency: number): string {
  const text = xText(lang, efficiency);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

/**
 * Build the Pinterest pin create URL.
 *
 * Pinterest requires a publicly hosted image. Pass the public image URL
 * returned by uploadShareImage() as `imageUrl`. If `imageUrl` is empty,
 * the caller MUST NOT open Pinterest — instead show the fallback message
 * telling the user to download the image first.
 *
 * @param pageUrl     The page URL to attach to the Pin (the "url" param).
 * @param imageUrl    Public https:// URL of the PNG to pin (the "media" param).
 * @param lang        Language for the description.
 */
export function pinterestShareUrl(pageUrl: string, imageUrl: string, lang: Lang): string {
  const desc = pinterestDescription(lang);
  const params = new URLSearchParams({
    url: pageUrl,
    media: imageUrl,
    description: desc,
  });
  return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
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
