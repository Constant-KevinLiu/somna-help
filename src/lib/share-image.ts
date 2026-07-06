// Branded share image generator using Canvas API.
// Generates 1200×1200 square images in Somna Night Mode theme.

import type { Lang } from "@/lib/i18n";

// Somna Night Mode palette
export const SHARE_COLORS = {
  background: "#0B1020",
  surface: "#151B2F",
  accent: "#7C8CFF",
  text: "#F5F7FF",
  muted: "#9AA3C7",
} as const;

const SIZE = 1200;
const SITE_URL = "somna.help";

/** Localized labels used inside generated images. */
type ImgLabelSet = {
  sleepEfficiency: string;
  improving: string;
  dayStreak: string;
  cbtiTraining: string;
  sleepProfile: string;
  sleepType: string;
  result: string;
};

const IMG_LABELS: Record<Lang, ImgLabelSet> = {
  en: {
    sleepEfficiency: "Sleep Efficiency",
    improving: "Improving",
    dayStreak: "Day Streak",
    cbtiTraining: "CBT-I Sleep Training",
    sleepProfile: "Sleep Profile",
    sleepType: "Sleep Type",
    result: "Result",
  },
  zh: {
    sleepEfficiency: "睡眠效率",
    improving: "正在改善",
    dayStreak: "天连续记录",
    cbtiTraining: "CBT-I 睡眠训练",
    sleepProfile: "睡眠档案",
    sleepType: "睡眠类型",
    result: "结果",
  },
  es: {
    sleepEfficiency: "Eficiencia del sueño",
    improving: "Mejorando",
    dayStreak: "Días seguidos",
    cbtiTraining: "Entrenamiento de sueño CBT-I",
    sleepProfile: "Perfil de sueño",
    sleepType: "Tipo de sueño",
    result: "Resultado",
  },
  pt: {
    sleepEfficiency: "Eficiência do sono",
    improving: "Melhorando",
    dayStreak: "Dias seguidos",
    cbtiTraining: "Treinamento de sono TCC-I",
    sleepProfile: "Perfil de sono",
    sleepType: "Tipo de sono",
    result: "Resultado",
  },
  pl: {
    sleepEfficiency: "Wydajność snu",
    improving: "Poprawia się",
    dayStreak: "Dni z rzędu",
    cbtiTraining: "Trening snu CBT-I",
    sleepProfile: "Profil snu",
    sleepType: "Typ snu",
    result: "Wynik",
  },
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBase(ctx: CanvasRenderingContext2D) {
  // Background
  ctx.fillStyle = SHARE_COLORS.background;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle accent glow (top-right)
  const glow = ctx.createRadialGradient(SIZE - 100, 120, 40, SIZE - 100, 120, 600);
  glow.addColorStop(0, "rgba(124,140,255,0.18)");
  glow.addColorStop(1, "rgba(124,140,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Surface card
  const cardX = 80;
  const cardY = 80;
  const cardW = SIZE - 160;
  const cardH = SIZE - 160;
  ctx.fillStyle = SHARE_COLORS.surface;
  roundRect(ctx, cardX, cardY, cardW, cardH, 40);
  ctx.fill();

  // Accent top border
  ctx.fillStyle = SHARE_COLORS.accent;
  roundRect(ctx, cardX, cardY, cardW, 8, 4);
  ctx.fill();
}

function drawBrand(ctx: CanvasRenderingContext2D) {
  // SOMNA wordmark
  ctx.fillStyle = SHARE_COLORS.text;
  ctx.font = "700 44px Inter, 'Noto Sans SC', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("SOMNA", 140, 175);

  // Accent dot
  ctx.fillStyle = SHARE_COLORS.accent;
  ctx.beginPath();
  ctx.arc(332, 162, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = SHARE_COLORS.muted;
  ctx.font = "500 34px Inter, 'Noto Sans SC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(SITE_URL, SIZE / 2, SIZE - 130);
}

export interface DashboardImageInput {
  efficiency: number | null;
  streak: number;
  lang: Lang;
}

/** Generate the dashboard share image and return a data URL (PNG). */
export function generateDashboardImage(input: DashboardImageInput): string {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const labels = IMG_LABELS[input.lang];
  drawBase(ctx);
  drawBrand(ctx);
  drawFooter(ctx);

  const cx = SIZE / 2;

  // Section label
  ctx.fillStyle = SHARE_COLORS.muted;
  ctx.font = "600 30px Inter, 'Noto Sans SC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(labels.sleepEfficiency.toUpperCase(), cx, 360);

  // Big efficiency number
  ctx.fillStyle = SHARE_COLORS.text;
  ctx.font = "700 220px Inter, sans-serif";
  const effText = input.efficiency !== null ? `${input.efficiency}%` : "—";
  ctx.fillText(effText, cx, 580);

  // Improving badge
  ctx.fillStyle = SHARE_COLORS.accent;
  ctx.font = "600 40px Inter, 'Noto Sans SC', sans-serif";
  ctx.fillText(labels.improving, cx, 660);

  // Streak
  ctx.fillStyle = SHARE_COLORS.muted;
  ctx.font = "500 36px Inter, 'Noto Sans SC', sans-serif";
  ctx.fillText(`${input.streak} ${labels.dayStreak}`, cx, 740);

  // CBT-I training tagline
  ctx.fillStyle = SHARE_COLORS.accent;
  ctx.font = "600 34px Inter, 'Noto Sans SC', sans-serif";
  ctx.fillText(labels.cbtiTraining, cx, 880);

  return canvas.toDataURL("image/png");
}

export interface ProfileImageInput {
  efficiencyLabel: string;
  sleepType: string;
  lang: Lang;
}

/** Generate the assessment profile share image. */
export function generateProfileImage(input: ProfileImageInput): string {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const labels = IMG_LABELS[input.lang];
  drawBase(ctx);
  drawBrand(ctx);
  drawFooter(ctx);

  const cx = SIZE / 2;

  // Section label
  ctx.fillStyle = SHARE_COLORS.muted;
  ctx.font = "600 30px Inter, 'Noto Sans SC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(labels.sleepProfile.toUpperCase(), cx, 360);

  // Sleep Efficiency label
  ctx.fillStyle = SHARE_COLORS.muted;
  ctx.font = "500 34px Inter, 'Noto Sans SC', sans-serif";
  ctx.fillText(labels.sleepEfficiency, cx, 470);

  // Efficiency value
  ctx.fillStyle = SHARE_COLORS.text;
  ctx.font = "700 110px Inter, sans-serif";
  ctx.fillText(input.efficiencyLabel, cx, 600);

  // Sleep Type label
  ctx.fillStyle = SHARE_COLORS.muted;
  ctx.font = "500 34px Inter, 'Noto Sans SC', sans-serif";
  ctx.fillText(labels.sleepType, cx, 720);

  // Sleep type value
  ctx.fillStyle = SHARE_COLORS.accent;
  ctx.font = "600 64px Inter, 'Noto Sans SC', sans-serif";
  ctx.fillText(input.sleepType, cx, 810);

  return canvas.toDataURL("image/png");
}

export interface CalculatorImageInput {
  title: string;
  resultLines: string[];
  lang: Lang;
}

/** Generate a calculator result share image. */
export function generateCalculatorImage(input: CalculatorImageInput): string {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const labels = IMG_LABELS[input.lang];
  drawBase(ctx);
  drawBrand(ctx);
  drawFooter(ctx);

  const cx = SIZE / 2;

  // Result label
  ctx.fillStyle = SHARE_COLORS.muted;
  ctx.font = "600 30px Inter, 'Noto Sans SC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(labels.result.toUpperCase(), cx, 360);

  // Calculator title
  ctx.fillStyle = SHARE_COLORS.text;
  ctx.font = "700 56px Inter, 'Noto Sans SC', sans-serif";
  ctx.fillText(input.title, cx, 450);

  // Result lines (up to 4)
  ctx.fillStyle = SHARE_COLORS.accent;
  ctx.font = "600 72px Inter, sans-serif";
  const startY = 600;
  const lineGap = 110;
  input.resultLines.slice(0, 4).forEach((line, i) => {
    ctx.fillText(line, cx, startY + i * lineGap);
  });

  return canvas.toDataURL("image/png");
}

/** Trigger a browser download of a data URL image. */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Upload a generated share image (data URL) to R2 and return its public URL.
 *
 * Pinterest requires a real https:// image URL �?data: and blob: URLs do not
 * work because Pinterest fetches the image server-side. This helper posts the
 * PNG to /api/share-image (handled in src/server.ts), which stores it in the
 * SHARE_BUCKET R2 binding and returns the public URL.
 *
 * @returns The public image URL on success, or null if hosting is disabled,
 *          the bucket is not bound, or the upload fails. Callers should fall
 *          back to the "download image first" Pinterest workflow on null.
 */
export async function uploadShareImage(dataUrl: string, filename: string): Promise<string | null> {
  try {
    const res = await fetch("/api/share-image", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ image: dataUrl, filename }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; url?: string };
    if (!data.ok || !data.url) return null;
    return data.url;
  } catch {
    return null;
  }
}
