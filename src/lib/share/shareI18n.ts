/**
 * Share Service i18n — centralized trilingual labels (English / 中文 / Español).
 *
 * This module is the single source of truth for every user-facing string
 * used by the Share Service v3, including:
 *   - platform button labels (global + China platforms)
 *   - WeChat QR dialog copy
 *   - toast messages (copy link, download, upload)
 *   - share text templates per content type
 *
 * Keeping share copy here (separate from the app-wide `i18n.tsx` dictionary)
 * lets the Share Service stay self-contained and reusable, while the
 * ShareModal still mirrors the most user-facing keys into `i18n.tsx` so the
 * rest of the app can reference them through the standard `t()` helper.
 */

import type { Lang } from "@/lib/i18n";

/** All share-related localized strings. */
export const shareI18n = {
  /** Generic share button label. */
  share: { en: "Share", zh: "分享", es: "Compartir" },

  /** Platform button labels. */
  pinterest: { en: "Pinterest", zh: "Pinterest", es: "Pinterest" },
  x: { en: "X", zh: "X", es: "X" },
  reddit: { en: "Reddit", zh: "Reddit", es: "Reddit" },
  facebook: { en: "Facebook", zh: "Facebook", es: "Facebook" },
  linkedin: { en: "LinkedIn", zh: "LinkedIn", es: "LinkedIn" },
  whatsapp: { en: "WhatsApp", zh: "WhatsApp", es: "WhatsApp" },
  wechat: { en: "WeChat", zh: "微信", es: "WeChat" },
  weibo: { en: "Weibo", zh: "微博", es: "Weibo" },
  qq: { en: "QQ", zh: "QQ", es: "QQ" },

  /** Action labels. */
  copyLink: { en: "Copy Link", zh: "复制链接", es: "Copiar enlace" },
  downloadImage: { en: "Download Image", zh: "下载图片", es: "Descargar imagen" },
  close: { en: "Close", zh: "关闭", es: "Cerrar" },

  /** Toast messages. */
  linkCopied: { en: "Link copied.", zh: "链接已复制", es: "Enlace copiado." },
  copyFailed: { en: "Could not copy link", zh: "无法复制链接", es: "No se pudo copiar el enlace" },
  downloadStarted: {
    en: "Download started.",
    zh: "已开始下载",
    es: "Descarga iniciada.",
  },

  /** WeChat QR dialog. */
  weChatTitle: { en: "Share to WeChat", zh: "分享到微信", es: "Compartir en WeChat" },
  weChatScanHint: {
    en: "Scan this QR Code with WeChat",
    zh: "用微信扫描此二维码",
    es: "Escanea este código QR con WeChat",
  },
  weChatLongPress: {
    en: "Long press the image to share.",
    zh: "长按图片即可分享",
    es: "Mantén pulsada la imagen para compartirla.",
  },
  weChatPreviewImage: { en: "Preview Image", zh: "预览图片", es: "Vista previa de la imagen" },

  /** Share text templates per content type. */
  defaultShareText: {
    en: "Improve your sleep with science-based CBT-I.",
    zh: "用基于科学的 CBT-I 改善你的睡眠。",
    es: "Mejora tu sueño con CBT-I basado en la ciencia.",
  },
  dashboardShareText: {
    en: (eff: number) => `My Sleep Efficiency is now ${Math.round(eff)}%. Try Somna →`,
    zh: (eff: number) => `我的睡眠效率提升到了 ${Math.round(eff)}%。看看 Somna →`,
    es: (eff: number) => `Mi eficiencia del sueño mejoró al ${Math.round(eff)}%. Prueba Somna →`,
  },
} as const;

/** Resolve a static trilingual label for the active language. */
export function tr(label: Record<Lang, string>, lang: Lang): string {
  return label[lang] ?? label.en;
}

/** Resolve a function-based trilingual label for the active language. */
export function trFn<T extends unknown[]>(
  label: Record<Lang, (...args: T) => string>,
  lang: Lang,
): (...args: T) => string {
  return label[lang] ?? label.en;
}

/** Type alias for a trilingual string record. */
export type Trilingual = Record<Lang, string>;
